import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { Socket } from 'ngx-socket-io';

import { Apollo, QueryRef } from 'apollo-angular';

import { codeEmptyDoc, TextDocument } from 'src/app/interfaces/TextDocument';
import { AuthService } from './auth.service';
import { Editor } from '../interfaces/Editor';

import { regularEmptyDoc } from 'src/app/interfaces/TextDocument';
import { stripTypename } from '../graphql/stripTypename';
import { GQL_CREATE_NEW_DOCUMENT, GQL_GET_ALL_DOCUMENTS, GQL_GET_EDITORS, GQL_UPDATE_DOCUMENT } from '../graphql/graphql-queries';
import { docToGQLCreateObj, docToGQLUpdateObj, toggleEditorById } from './service-helpers/document-helpers';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private activeDoc: TextDocument = {
    ...regularEmptyDoc
  };
  private allEditors: Editor[] = [];
  private allDocs: TextDocument[] = [];
  private activeDocSubject: Subject<any> = new Subject<any>();
  private editorsSubject: Subject<any> = new Subject<any>();
  private allDocsSubject: Subject<any> = new Subject<any>();
  private allDocsWatchQuery: QueryRef<any>;
  private codeModeOn: boolean = false;

  constructor(
    private socket: Socket,
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

  upsertDocument(): void {
    if (this.activeDoc.id === '') {
      return this.createDocument();
    }
    return this.updateDocument();
  }

  createDocument(): void {
    const gqlCreateObj: any = docToGQLCreateObj(this.activeDoc, this.authService.getOwnUserId());

    this.apollo.mutate({
      mutation: GQL_CREATE_NEW_DOCUMENT,
      variables: gqlCreateObj
    }).subscribe(
      () => {
        this.refreshAllDocs();
      },
      (error) => {
        console.error('New document could not be created with variables:', gqlCreateObj);
      }
    );    
  }

  updateDocument(): void {
    const gqlUpdateObj: any = docToGQLUpdateObj(this.activeDoc);

    this.apollo.mutate({
      mutation: GQL_UPDATE_DOCUMENT,
      variables: gqlUpdateObj
    }).subscribe(
      () => {
        this.refreshAllDocs();
      },
      (error) => {
        console.error('Document could not be updated with variables:', gqlUpdateObj);
      }
    );
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
    if (this.codeModeOn) {
      this.activeDoc = {
        ...codeEmptyDoc
      }
    } else {
      this.activeDoc = {
        ...regularEmptyDoc
      }
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
      this.updateDocument();
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
    this.activeDoc.editors = toggleEditorById(this.activeDoc.editors, this.allEditors, editorId);
    this.upsertDocument();
  }

  toggleCodeMode(): void {
    this.codeModeOn = !this.codeModeOn;
    this.resetActiveDoc();
  }

  isCodeModeOn(): boolean {
    return this.codeModeOn;
  }

  onActiveDocUpdate(): Observable<any> {
    return this.activeDocSubject.asObservable();
  }

  onAllDocsUpdate(): Observable<any> {
    return this.allDocsSubject.asObservable();
  }

  onEditorsUpdate(): Observable<Editor[]> {
    return this.editorsSubject.asObservable();
  }
}
