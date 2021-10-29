import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';

import { PlainUser } from '../interfaces/PlainUser';
import { backendRootUrl } from '../global-variables';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private subject: Subject<any> = new Subject<any>();
  private apiUrl: string = `${backendRootUrl}/user`;

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService) { };

  createUser(
    user: PlainUser
  ): Observable<object> {
    const sendHttpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    const registerUrl = `${this.apiUrl}/register`;

    return this.httpClient
      .post<object>(registerUrl, user, sendHttpOptions);
  };

  async loginUser(
    user: PlainUser
  ): Promise<boolean> {
    const sendHttpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    const loginUrl = `${this.apiUrl}/login`;

    const tokenObj = await this.httpClient
      .post<any>(loginUrl, user, sendHttpOptions)
      .toPromise();

    if (tokenObj.hasOwnProperty('token')) {
      this.cookieService.set('editor-api-token', tokenObj.token);
      return true;
    } else {
      return false;
    }
  };

  /*
  * No sensitive data are reached purely through the frontend, so there's no
  * need to validate user JWT's against the backend. Only malicious users should
  * run into trouble.
  */
  isUserLoginActive(): boolean {
    const token: string = this.cookieService.get('editor-api-token');

    if (token.length > 10 && token.includes('.')) {
      // decode token to get expiration time.
      const decodedToken = JSON.parse(atob(token.split('.')[1]));

      if (decodedToken && decodedToken.exp && decodedToken.exp > Date.now()/1000) {
        return true;
      }
    }
    return false;
  }

  getOwnUsername(): string {
    const token: string = this.cookieService.get('editor-api-token');

    if (token.length > 10 && token.includes('.')) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));

      if (decodedToken && decodedToken.username) {
        return decodedToken.username;
      }
    }
    return '';
  }

  getOwnUserId(): string {
    const token: string = this.cookieService.get('editor-api-token');

    if (token.length > 10 && token.includes('.')) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));

      if (decodedToken && decodedToken.userId) {
        return decodedToken.userId;
      }
    }
    return '';
  }
}
