import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const loggedInGuard: CanActivateFn = (route, state) => {
  // return true;
  const authService: AuthService = inject(AuthService);
  const loggedIn = authService.isAuthenticated();
  const router = inject(Router);
  console.log('auth check : loggedIn', { loggedIn, route: state.url });

  if (loggedIn === false) {
    // trying to access and restricted route without being logged in, so go to login page
    router.navigate(['/login']);
  }

  return loggedIn === true;
};

