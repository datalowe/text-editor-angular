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

  upsertDocument(doc: Document): Observable<Document> {
    if (doc._id === '') {
      return this.createDocument(doc);
    } 
    return this.updateDocument(doc);
  }

  createDocument(doc: Document): Observable<Document> {
    const createUrl = `${this.apiUrl}/create`;

    return this.httpClient.post<Document>(createUrl, doc, httpOptions);
  }

  updateDocument(doc: Document): Observable<Document> {
    const updateUrl = `${this.apiUrl}/update`;

    console.log('foobar upsert' + updateUrl);
    console.log(doc);

    return this.httpClient.put<Document>(updateUrl, doc, httpOptions);
  }
}
