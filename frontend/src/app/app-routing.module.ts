import { NgModule, inject } from '@angular/core';
import {
  Routes,
  RouterModule,
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { NewListComponent } from './pages/new-list/new-list.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { EditListComponent } from './pages/edit-list/edit-list.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { AuthService } from './auth.service';
import { notLoggedInGuard } from './not-logged-in.guard';
import { loggedInGuard } from './logged-in.guard';

const authGuards = {
  isLoggedIn: (): CanActivateFn => () => {
    const next = inject(ActivatedRouteSnapshot);
    const state = inject(RouterStateSnapshot);
    const authService: AuthService = inject(AuthService);
    const loggedIn = authService.isAuthenticated();
    const router = inject(Router);
    console.log('auth check : loggedIn', { loggedIn, route: state.url });

    if (loggedIn === false) {
      // trying to access and restricted route without being logged in, so go to login page
      router.navigate(['/login']);
    }

    return loggedIn === true;
  },
  notLoggedIn: (): CanActivateFn => () => {
    const next = inject(ActivatedRouteSnapshot);
    const state = inject(RouterStateSnapshot);
    const authService: AuthService = inject(AuthService);
    const loggedIn = authService.isAuthenticated();
    const router = inject(Router);

    console.log('auth check : notLoggedIn', { loggedIn, route: state.url });

    if (loggedIn === true) {
      // you are logged in so sign up and login page are not allowed, redirect to their home page
      router.navigate(['/authenticated/']);
    }

    return loggedIn === false;
  },
};

// export function authenticationGuard(): CanActivateFn {
//   return () => {
//     const authService: AuthService = inject(AuthService);

//     return authService.isAuthenticated();
//   };
// }

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [notLoggedInGuard],
  },
  {
    path: 'signup',
    component: SignUpComponent,
    canActivate: [notLoggedInGuard],
  },
  { path: '', redirectTo: '/authenticated/lists', pathMatch: 'full' },
  {
    path: 'authenticated',
    canActivate: [loggedInGuard], // [authenticationGuard
    // canActivateChild: [authGuards.isLoggedIn],
    children: [
      { path: 'new-list', component: NewListComponent },
      { path: 'edit-list/:listId', component: EditListComponent },
      { path: 'lists', component: TaskViewComponent },
      { path: 'lists/:listId', component: TaskViewComponent },
      { path: 'lists/:listId/new-task', component: NewTaskComponent },
      { path: 'lists/:listId/edit-task/:taskId', component: EditTaskComponent },
      { path: '', redirectTo: '/authenticated/lists', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
