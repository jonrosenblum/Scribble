import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const notLoggedInGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
    const loggedIn = authService.isAuthenticated();
    const router = inject(Router);

    console.log('auth check : notLoggedIn', { loggedIn, route: state.url });

    if (loggedIn === true) {
      // you are logged in so sign up and login page are not allowed, redirect to their home page
      router.navigate(['/authenticated/']);
    }

    return loggedIn === false;
};
