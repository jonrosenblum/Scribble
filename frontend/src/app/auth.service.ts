import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = {
  ACCESS_TOKEN: 'x-access-token',
  REFRESH_TOKEN: 'x-refresh-token',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private webService: WebRequestService,
    private router: Router,
    private http: HttpClient
  ) {}

  signup(email: string, password: string) {
    return this.webService.signup(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        // the auth tokens will be in the header of this response
        this.setSession(
          res.body._id,
          res.headers.get(TOKEN_KEY.ACCESS_TOKEN) as any as string,
          res.headers.get(TOKEN_KEY.REFRESH_TOKEN)!
        );
        console.log('Successfully signed up and now logged in!');
      })
    );
  }

  login(email: string, password: string) {
    return this.webService.login(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        const accessToken = res.headers.get(TOKEN_KEY.ACCESS_TOKEN);
        const refreshToken = res.headers.get(TOKEN_KEY.REFRESH_TOKEN);
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

    this.router.navigateByUrl('/login');
  }

  getAccessToken() {
    return localStorage.getItem(TOKEN_KEY.ACCESS_TOKEN);
  }

  getRefreshToken() {
    return localStorage.getItem(TOKEN_KEY.REFRESH_TOKEN);
  }

  getUserId() {
    return localStorage.getItem('user-id');
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem(TOKEN_KEY.ACCESS_TOKEN, accessToken);
  }

  private setSession(
    userId: string,
    accessToken: string,
    refreshToken: string
  ) {
    localStorage.setItem('userId', userId);
    localStorage.setItem(TOKEN_KEY.ACCESS_TOKEN, accessToken);
    localStorage.setItem(TOKEN_KEY.REFRESH_TOKEN, refreshToken);
  }

  private removeSession() {
    localStorage.removeItem('userId');
    localStorage.removeItem(TOKEN_KEY.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEY.REFRESH_TOKEN);
  }

  getNewAccessToken() {
    return this.http
      .get(`${this.webService.ROOT_URL}/users/me/access_token`, {
        headers: {
          'x-refresh-token': this.getRefreshToken()!,
          _id: this.getUserId()!,
        },
        observe: 'response',
      })
      .pipe(
        tap((res: HttpResponse<any>) => {
          this.setAccessToken(res.headers.get(TOKEN_KEY.ACCESS_TOKEN)!);
        })
      );
  }

  isAuthenticated(): boolean {
    let isTokenValid = false;
    const token = this.getAccessToken();
    const now = new Date();

    console.log({ token });
    if (!token) {
      return false;
    }

    try {
      const jwt_decoded = jwtDecode(token);
      const tokenExpireDateNumber = jwt_decoded?.exp;
      if (!tokenExpireDateNumber) {
        return false;
      }

      const tokenExpireDate = new Date(tokenExpireDateNumber);

      isTokenValid = tokenExpireDateNumber> now.getTime()  / 1000;
      const isTokenExpired = !isTokenValid;

      console.log({
        tokenExpireDate,
        now,
        isTokenValid,
        isTokenExpired,
        tokenExpireDateNumber,
        jwt_decoded,
      });
    } catch (error) {
      console.error('token validation failed', { token, error });
    }

    console.log({ isTokenValid });
    return isTokenValid;
  }
}
