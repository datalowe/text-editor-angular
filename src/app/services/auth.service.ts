import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

const sendHttpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://texted-backend-2.azurewebsites.net/user';

  constructor(private httpClient: HttpClient) { }

  createUser(
    username: string,
    password: string
  ): Observable<object> {
    const registerUrl = `${this.apiUrl}/register`;
    const uploadObj = {
      'username': username,
      'password': password,
    };

    return this.httpClient
      .post<object>(registerUrl, uploadObj, sendHttpOptions);
  }
}
