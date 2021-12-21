import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Socket } from 'ngx-socket-io';

import { DocumentService } from './document.service';

import { testDocReg, testDocCode, testDocEmptyReg } from 'src/app/spec-helpers/spec-objects';

import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';

import { GQL_CREATE_NEW_DOCUMENT, GQL_GET_ALL_DOCUMENTS, GQL_GET_EDITORS, GQL_UPDATE_DOCUMENT } from '../graphql/graphql-queries';
import { regularEmptyDoc, TextDocument } from '../interfaces/TextDocument';
import { AuthService } from './auth.service';
import { GraphQLError } from 'graphql';
import { ApolloError } from '@apollo/client/errors';
import { Editor } from '../interfaces/Editor';

const graphQLErrors = [
  new GraphQLError('Something went wrong with GraphQL'),
  new GraphQLError('Something else went wrong with GraphQL'),
];
const networkError = new Error('Network error');
const errorMessage = 'this is an error message';
const apolloError = new ApolloError({
  graphQLErrors: graphQLErrors,
  networkError: networkError,
  errorMessage: errorMessage,
});

const sampleCreateResp = {
  "data": {
      "createDocument": {
          "title": "qew",
          "body": "<p>rqe</p>",
          "ownerId": "617baa6ec5f1a2d4ffb247cd",
          "editorIds": [],
          "owner": {
              "username": "lowe"
          },
          "editors": []
      }
  }
};

const sampleUpdateResp = {
  "data": {
      "updateDocument": {
          "title": "lowedoc",
          "body": "<p>test test</p><p><br></p><p><span style=\"background-color: rgba(156, 39, 176, 0.4);\" comment-id=\"772833\" comment-text=\"wrwrqqanother\" onclick=\"showCommentEditor(this)\">comm</span></p><p><br></p><p>test</p><p><br></p><p>afaba</p>",
          "ownerId": "617baa6ec5f1a2d4ffb247cd",
          "editorIds": [],
          "owner": {
              "username": "lowe"
          },
          "editors": []
      }
  }
};

describe('DocumentService', () => {
  let apolloController: ApolloTestingController;
  let service: DocumentService;
  let socketService: Socket;
  let authService: AuthService;

  beforeEach(() => {
    socketService = jasmine.createSpyObj<Socket>(
      'SocketService',
      ['on', 'emit']
    );
    authService = jasmine.createSpyObj<AuthService>(
      'AuthService',
      {'getOwnUserId': '1'}
    );

    TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule,
        HttpClientTestingModule
      ],
      providers: [
          DocumentService,
          { provide: Socket, useValue: socketService}
      ]
    });

    service = TestBed.inject(DocumentService);
    apolloController = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    apolloController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#startDocumentsSubscription ends up emitting fetched documents', async () => {
    let activeDocs: TextDocument[] = [];

    const docUpdateObservable = service.onAllDocsUpdate();

    docUpdateObservable.subscribe(
        data => {
          activeDocs = data;
        }
    );

    service.startDocumentsSubscription();

    const op = apolloController.expectOne(GQL_GET_ALL_DOCUMENTS);

    op.flush({
      data: {
        documents: [testDocReg, testDocCode]
      },
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    const matchDoc = activeDocs.find(el => el.title == testDocReg.title);

    expect(matchDoc).toBeTruthy();
  });

  it('#startDocumentsSubscription does not emit invalid returned data', async () => {
    let emptyArr: any[] = [];
    let activeDocs: TextDocument[] = emptyArr;

    const docUpdateObservable = service.onAllDocsUpdate();

    docUpdateObservable.subscribe(
        data => {
          activeDocs = data;
        }
    );

    service.startDocumentsSubscription();

    const op = apolloController.expectOne(GQL_GET_ALL_DOCUMENTS);

    op.flush({
      data: {
        nonsense: ['foo', 'bar']
      },
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(activeDocs).toEqual(emptyArr);
  });
  

  it('#createDocument triggers post request and document refresh', async () => {
    const refreshSpy = spyOn(service, 'refreshAllDocs');

    service.createDocument();

    const op = apolloController.expectOne(GQL_CREATE_NEW_DOCUMENT);

    op.flush(sampleCreateResp);

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(refreshSpy).toHaveBeenCalled();
  });

  it('#updateActiveTitle updates active doc title and triggers emission of document', async () => {
    let testDoc: TextDocument = regularEmptyDoc;

    service
      .onActiveDocUpdate()
      .subscribe(
        doc => testDoc = doc
      );
    
    service.updateActiveTitle('foo');

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(testDoc.title).toEqual('foo');
  });

  it('#updateActiveBody updates active doc body and triggers emission of document locally when id is not set', async () => {
    let testDoc: TextDocument = regularEmptyDoc;

    service
      .onActiveDocUpdate()
      .subscribe(
        doc => testDoc = doc
      );
    
    service.updateActiveBody('foo');

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(testDoc.body).toEqual('foo');
  });

  it('#updateActiveBody triggers emission of document remotely when id is set', async () => {
    const updateDocSpy = spyOn(service, 'updateDocument');

    service.swapActive(testDocCode);
    
    service.updateActiveBody('foo');

    expect(updateDocSpy).toHaveBeenCalled();
  });

  it('#swapActive triggers leave room event when document has id', () => {
    service.swapActive(testDocCode);

    service.swapActive(testDocReg);

    expect(socketService.emit).toHaveBeenCalled();
  })

  it('#upsertDocument when active doc has no id calls #createDocument', () => {
    const createDocSpy = spyOn(service, 'createDocument');

    service.swapActive(testDocEmptyReg);
    service.upsertDocument();

    expect(createDocSpy).toHaveBeenCalled();
  });

  it('#upsertDocument when active doc has id calls #createDocument', () => {
    const updateDocSpy = spyOn(service, 'updateDocument');

    service.swapActive(testDocReg);
    service.upsertDocument();

    expect(updateDocSpy).toHaveBeenCalled();
  });

  it('#updateDocument sends mutation update query and refreshes documents', async () => {
    const refreshDocsSpy = spyOn(service, 'refreshAllDocs');

    service.updateDocument();

    const op = apolloController.expectOne(GQL_UPDATE_DOCUMENT);

    op.flush(sampleUpdateResp);

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(refreshDocsSpy).toHaveBeenCalled();
  });

  it('#updateDocument does not refresh documents when mutation query fails', async () => {
    const refreshDocsSpy = spyOn(service, 'refreshAllDocs');

    service.updateDocument();

    const op = apolloController.expectOne(GQL_UPDATE_DOCUMENT);

    op.flush(apolloError);

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(refreshDocsSpy).toHaveBeenCalledTimes(0);
  });

  it('#createDocument does not refresh documents when mutation query fails', async () => {
    const refreshDocsSpy = spyOn(service, 'refreshAllDocs');

    service.createDocument();
    apolloController.expectOne(GQL_CREATE_NEW_DOCUMENT).flush(apolloError);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(refreshDocsSpy).toHaveBeenCalledTimes(0);
  });

  it('#startEditorsSubscription updates and emits editors', async () => {
    let testEditors: Editor[] = [];

    service
      .onEditorsUpdate()
      .subscribe(
        editors => testEditors = editors
      );

    service.startEditorsSubscription();
    apolloController.expectOne(GQL_GET_EDITORS)
      .flush({
        data: {
          editors: testDocReg.editors
        },
      });
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(testEditors.find(el => el.id == testDocReg.editors[0].id)).toBeTruthy();
  });

  it('#resetActiveDoc triggers socket leave room event when doc id is non-empty', () => {
    service.swapActive(testDocReg);

    service.resetActiveDoc();

    expect(socketService.emit).toHaveBeenCalledWith('leaveRoom', testDocReg.id);
  });

  it('#toggleCodeMode resets active doc to empty code doc if code mode was off', async () => {
    let testDoc: TextDocument = regularEmptyDoc;

    service
      .onActiveDocUpdate()
      .subscribe(
        doc => testDoc = doc
      );
    service.toggleCodeMode();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(testDoc.type).toEqual(testDocCode.type);
  });

  it('#toggleActiveEditor adds editor when it wasnt there at first', async () => {
    service.swapActive(testDocEmptyReg);

    service.startEditorsSubscription();
    apolloController.expectOne(GQL_GET_EDITORS)
      .flush({
        data: {
          editors: testDocReg.editors
        },
      });
    await new Promise(resolve => setTimeout(resolve, 0));
    apolloController.verify();

    let testDoc: TextDocument = testDocEmptyReg;

    service
      .onActiveDocUpdate()
      .subscribe(
        doc => testDoc = doc
      );
    service.toggleActiveEditor(testDocReg.editors[0].id);

    apolloController.expectOne(GQL_CREATE_NEW_DOCUMENT)
    .flush(sampleCreateResp);
    spyOn(service, 'refreshAllDocs');
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(testDoc.editors.find(el => el.id == testDocReg.editors[0].id)).toBeTruthy();
  });
});
