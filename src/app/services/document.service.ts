import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Document } from 'src/app/Document';

const sendHttpOptions = {
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
    const uploadObj = {
      'title': doc.title,
      'body': doc.body,
    }

    return this.httpClient.post<Document>(this.apiUrl, uploadObj, sendHttpOptions);
  }

  updateDocument(doc: Document): Observable<Document> {
    const updateUrl = `${this.apiUrl}/${doc._id}`;
    const uploadObj = {
      'title': doc.title,
      'body': doc.body,
    }

    return this.httpClient.put<Document>(updateUrl, uploadObj, sendHttpOptions);
  }
}