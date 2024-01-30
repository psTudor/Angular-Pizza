import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from "../services/auth.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard {
  constructor(private authService: AuthService,
              private router: Router) {}


  canActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const currentUser = this.authService.currentUserValue;
    const requestedRouter = state.url;
    if (currentUser && currentUser.roles.admin) {
      return true;
    } else if (currentUser && currentUser.roles.waiter && requestedRouter.startsWith('/orders')) {
        return true;
      } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  };

  }



