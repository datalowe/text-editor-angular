import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';

import { Socket } from 'ngx-socket-io';

import { TextDocument } from 'src/app/TextDocument';

const sendHttpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

const emptyDoc: TextDocument = {
  _id: '',
  title: '',
  body: ''
};

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private activeDoc: TextDocument = {
    ...emptyDoc
  };
  private subject: Subject<any> = new Subject<any>();
  private apiUrl = 'https://texted-backend-2.azurewebsites.net/editor-api/document';

  constructor(private httpClient: HttpClient, private socket: Socket) {
    this.socket.on('docBodyUpdate',
      (data: any) => {
        this.activeDoc.body = data.text;
        this.subject.next(this.activeDoc);
      }
    );
  }

  getDocuments(): Observable<TextDocument[]> {
    return this.httpClient.get<TextDocument[]>(this.apiUrl);
  }

  upsertDocument(): Observable<TextDocument> {
    if (this.activeDoc._id === '') {
      return this.createDocument();
    } 
    return this.updateDocument();
  }

  createDocument(): Observable<TextDocument> {
    const uploadObj = {
      'title': this.activeDoc.title,
      'body': this.activeDoc.body,
    }

    // share is used to prevent the POST request from being sent twice since there might
    // be multiple subscribers
    const resp = this.httpClient
      .post<TextDocument>(this.apiUrl, uploadObj, sendHttpOptions)
      .pipe<TextDocument>(share());

    resp.subscribe(
      (doc: any) => {
        this.socket.emit('createRoom', doc._id);
        this.activeDoc._id = doc._id;
      },
      (err: any) => console.error('failed when trying to create doc:', err)
    );

    return resp;
  }

  updateDocument(): Observable<TextDocument> {
    const updateUrl = `${this.apiUrl}/${this.activeDoc._id}`;
    const uploadObj = {
      'title': this.activeDoc.title,
      'body': this.activeDoc.body,
    }

    return this.httpClient.put<TextDocument>(updateUrl, uploadObj, sendHttpOptions);
  }

  resetActiveDoc(): void {
    if (this.activeDoc._id) {
      this.socket.emit('leaveRoom', this.activeDoc._id);
    }
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
    if (this.activeDoc._id) {
      this.socket.emit('docBodyUpdate', {
        'text': newBody,
        '_id': this.activeDoc._id
        }
      );
      this.updateDocument().subscribe(d => {return;});
    }
  }

  swapActive(newDoc: TextDocument): void {
    if (this.activeDoc._id) {
      this.socket.emit('leaveRoom', this.activeDoc._id);
    }
    this.activeDoc = newDoc;
    this.socket.emit('createRoom', newDoc._id);
    this.subject.next(this.activeDoc);
  }

  onActiveDocUpdate(): Observable<any> {
    return this.subject.asObservable();
  }
}
