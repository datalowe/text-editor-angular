import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Document } from 'src/app/Document';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'https://texted-backend-2.azurewebsites.net/editor-api/document';

  constructor(private httpClient: HttpClient) { }

  getDocuments(): Observable<Document[]> {
    return this.httpClient.get<Document[]>(this.apiUrl);
  }
}
