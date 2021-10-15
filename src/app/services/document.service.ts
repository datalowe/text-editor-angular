import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, Subject, Subscription } from 'rxjs';
import { share } from 'rxjs/operators';

import { Socket } from 'ngx-socket-io';

import { Apollo, gql, QueryRef } from 'apollo-angular';

import { TextDocument } from 'src/app/interfaces/TextDocument';
import { backendRootUrl } from '../global-variables';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';
import { Editor } from '../interfaces/Editor';

import { emptyDoc } from 'src/app/interfaces/TextDocument';
import { stripTypename } from '../graphql/stripTypename';

const GQL_GET_EDITORS = gql`
  query GetEditors {
    editors {
      id
      username
    }
  }
`;

const GQL_GET_ALL_DOCUMENTS = gql`
  query GetDocuments {
    documents {
      id
      title
      body
      owner {
          id
          username
      }
      editors {
          id
          username
      }
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private activeDoc: TextDocument = {
    ...emptyDoc
  };
  private allEditors: Editor[] = [];
  private allDocs: TextDocument[] = [];
  private activeDocSubject: Subject<any> = new Subject<any>();
  private editorsSubject: Subject<any> = new Subject<any>();
  private allDocsSubject: Subject<any> = new Subject<any>();
  private allDocsWatchQuery: QueryRef<any>;
  private apiUrl: string = `${backendRootUrl}/editor-api/document`;

  constructor(
    private httpClient: HttpClient,
    private socket: Socket,
    private cookieService: CookieService,
    private authService: AuthService,
    private apollo: Apollo) {
    this.socket.on('docBodyUpdate',
      (data: any) => {
        this.activeDoc.body = data.text;
        this.activeDocSubject.next(this.activeDoc);
      }
    );
  }

  startDocumentsSubscription(): void {
    this.allDocsWatchQuery = this.apollo
      .watchQuery<any>({
        query: GQL_GET_ALL_DOCUMENTS
      });
    this.allDocsWatchQuery
      .valueChanges
      .subscribe(
        (result: any) => {
          if (result?.data?.documents) {
            this.allDocs = result.data.documents.map((d: any) => stripTypename(d));
            
            this.allDocsSubject.next(this.allDocs);
          }
        }
      );
  }

  refreshAllDocs(): void {
    this.allDocsWatchQuery.refetch()
  }

  upsertDocument(): Observable<TextDocument> {
    if (this.activeDoc.id === '') {
      return this.createDocument();
    }
    return this.updateDocument();
  }

  createDocument(): Observable<TextDocument> {
    const uploadObj = {
      'title': this.activeDoc.title,
      'body': this.activeDoc.body,
      'ownerId': this.authService.getOwnUserId(),
      'editorIds': this.activeDoc.editors.map(editor => editor.id)
    }
    const sendHttpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': this.cookieService.get('editor-api-token'),
      })
    };
    // share is used to prevent the POST request from being sent twice since there might
    // be multiple subscribers
    const resp = this.httpClient
      .post<TextDocument>(this.apiUrl, uploadObj, sendHttpOptions)
      .pipe<TextDocument>(share());

    resp.subscribe(
      (doc: any) => {   
        this.socket.emit('createRoom', doc.id);
        this.activeDoc.id = doc.id;
      },
      (err: any) => console.error('failed when trying to create doc:', err)
    );

    return resp;
  }

  updateDocument(): Observable<TextDocument> {
    const updateUrl = `${this.apiUrl}/${this.activeDoc.id}`;
    const uploadObj = {
      'title': this.activeDoc.title,
      'body': this.activeDoc.body,
      'owner': this.authService.getOwnUsername(),
      'editors': this.activeDoc.editors.map(editor => editor.id)
    };
    const sendHttpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': this.cookieService.get('editor-api-token'),
      })
    };

    return this.httpClient.put<TextDocument>(updateUrl, uploadObj, sendHttpOptions);
  }

  startEditorsSubscription(): void {
    this.apollo
      .watchQuery({
        query: GQL_GET_EDITORS
      })
      .valueChanges
      .subscribe(
        (result: any) => {
          if (result?.data?.editors) {
            this.allEditors = result.data.editors.map((e: any) => stripTypename(e));
            this.editorsSubject.next(this.allEditors);
          }
        }
      )
  };

  resetActiveDoc(): void {
    if (this.activeDoc.id) {
      this.socket.emit('leaveRoom', this.activeDoc.id);
    }
    this.activeDoc = {
      ...emptyDoc
    }
    this.activeDocSubject.next(this.activeDoc);
  }

  updateActiveTitle(newTitle: string): void {
    this.activeDoc.title = newTitle;
    this.activeDocSubject.next(this.activeDoc);
  }

  updateActiveBody(newBody: string): void {
    this.activeDoc.body = newBody;
    this.activeDocSubject.next(this.activeDoc);
    if (this.activeDoc.id) {
      this.socket.emit('docBodyUpdate', {
        'text': newBody,
        'id': this.activeDoc.id
        }
      );
      this.updateDocument().subscribe(d => {return;});
    }
  }

  swapActive(newDoc: TextDocument): void {
    if (this.activeDoc.id) {
      this.socket.emit('leaveRoom', this.activeDoc.id);
    }
    this.activeDoc = newDoc;
    this.socket.emit('createRoom', newDoc.id);
    this.activeDocSubject.next(this.activeDoc);
  }

  toggleActiveEditor(editorId: string): void {
    if (this.activeDoc.editors.find(e => e.id === editorId)) {
      this.activeDoc.editors = this.activeDoc.editors.filter(e => e.id !== editorId);
    } else {
      const matchEditor = this.allEditors.find(e => e.id === editorId);

      if (matchEditor) {
        this.activeDoc.editors.push(matchEditor);
      }
    }
    this
      .upsertDocument()
      .subscribe(
        (newDoc) => (this.activeDoc = newDoc)
      );
    this.activeDocSubject.next(this.activeDoc);
  }

  onActiveDocUpdate(): Observable<any> {
    return this.activeDocSubject.asObservable();
  }

  onAllDocsUpdate(): Observable<any> {
    return this.allDocsSubject.asObservable();
  }

  onEditorsUpdate(): Observable<any> {
    return this.editorsSubject.asObservable();
  }
}
