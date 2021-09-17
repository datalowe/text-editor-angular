import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';

import { Document } from 'src/app/Document';

const sendHttpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

const emptyDoc: Document = {
  _id: '',
  title: '',
  body: ''
};

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private activeDoc: Document = {
    ...emptyDoc
  };
  private subject: Subject<any> = new Subject<any>();

  private apiUrl = 'https://texted-backend-2.azurewebsites.net/editor-api/document';

  constructor(private httpClient: HttpClient) { }

  getDocuments(): Observable<Document[]> {
    return this.httpClient.get<Document[]>(this.apiUrl);
  }

  upsertDocument(): Observable<Document> {
    if (this.activeDoc._id === '') {
      return this.createDocument();
    } 
    return this.updateDocument();
  }

  createDocument(): Observable<Document> {
    const uploadObj = {
      'title': this.activeDoc.title,
      'body': this.activeDoc.body,
    }

    return this.httpClient.post<Document>(this.apiUrl, uploadObj, sendHttpOptions);
  }

  updateDocument(): Observable<Document> {
    const updateUrl = `${this.apiUrl}/${this.activeDoc._id}`;
    const uploadObj = {
      'title': this.activeDoc.title,
      'body': this.activeDoc.body,
    }

    return this.httpClient.put<Document>(updateUrl, uploadObj, sendHttpOptions);
  }

  resetActiveDoc(): void {
    this.activeDoc = {
      ...emptyDoc
    }
    this.subject.next(this.activeDoc);
  }

  updateActiveTitle(newTitle: string): void {
    this.activeDoc.title = newTitle;
    this.subject.next(this.activeDoc);
  }

  updateActiveBody(newBody: string): void {
    this.activeDoc.body = newBody;
    this.subject.next(this.activeDoc);
  }

  swapActive(newDoc: Document): void {
    this.activeDoc = newDoc;
    this.subject.next(this.activeDoc);
  }

  onActiveDocUpdate(): Observable<any> {
    return this.subject.asObservable();
  }
}
