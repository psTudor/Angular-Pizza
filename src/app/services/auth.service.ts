import { Injectable } from '@angular/core';
import { GoogleAuthProvider, AuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, firstValueFrom} from "rxjs";
import { AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import { User } from "../models/user";
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.authState.asObservable();
  currentUser: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);


  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.afs.doc<User>(`users/${user.uid}`).valueChanges().subscribe(userData => {
          if (userData) {
            this.currentUser.next(userData);
          } else {
            // Utilizatorul este autentificat dar nu există în Firestore
            this.currentUser.next(null);
          }
        });
      } else {
        // Utilizatorul nu este autentificat
        this.currentUser.next(null);
      }
    });
  }

  public get currentUserValue(): User | null {
    return this.currentUser.value;
  }


  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }


  AuthLogin(provider: AuthProvider): Promise<void> {
    return this.afAuth.signInWithPopup(provider).then(async (result: firebase.auth.UserCredential) => {
      if (result.user) { // verificare ca user sa nu fie null
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${result.user.uid}`);
        const docSnapshot = await firstValueFrom(userRef.get());

        if (!docSnapshot.exists) {
          // Utilizatorul nu există, deci trebuie creat unul nou cu rolul implicit
          const userData: User = {
            uid: result.user.uid,
            email: result.user.email as string,
            roles: {
              client: true,
              waiter: false,
              admin: false
            }
          };
          await userRef.set(userData, { merge: true });
          console.log('User with client role created.');
        } else {
          console.log('The user already exists.');
        }
      } else {
        throw new Error('No user found in UserCredential');
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  AuthLogout() {
    return this.afAuth.signOut().then((result) => {
      console.log('You have been successfully logged out!');
    })
      .catch((error) => {
        console.log(error);
      });
  }

}


