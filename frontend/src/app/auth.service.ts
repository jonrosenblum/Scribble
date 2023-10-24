import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private webService: WebRequestService, private router: Router) {}

  login(email: string, password: string) {
    return this.webService.login(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        const accessToken = res.headers.get('x-access-token');
        const refreshToken = res.headers.get('x-refresh-token');
        if (accessToken !== null && refreshToken !== null) {
          this.setSession(res.body._id, accessToken, refreshToken);
          console.log('LOGGED IN!');
        } else {
          console.error(
            'Access token is null. Handle this error appropriately.'
          ); // Log an error message
          // You can also perform other error handling or redirection as needed.
        }
      })
    );
  }

  logout() {
    this.removeSession();
  }

  getAccessToken() {
    return localStorage.getItem('x-access-item');
  }

  getRefreshToken() {
    return localStorage.getItem('x-refresh-token');
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('x-access-token', accessToken);
  }

  private setSession(
    userId: string,
    accessToken: string,
    refreshToken: string
  ) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private removeSession() {
    localStorage.removeItem('userId');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
