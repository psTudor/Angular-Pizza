import {Component, OnInit} from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  isWaiter: boolean = false;
  private authSubscription!: Subscription;

  constructor(private auth: AuthService,
              private router: Router) {}

  ngOnInit() {
    this.authSubscription = this.auth.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = !!user?.roles?.admin;
      this.isWaiter = !!user?.roles?.waiter;

    });
  }

  GoogleLogout() {
    return this.auth.AuthLogout().then(() => {
      window.location.reload();
    }).catch((error) => {
      console.error('Logout failed', error);
    })
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

}
