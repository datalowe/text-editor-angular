import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Socket } from 'ngx-socket-io';

import { DocumentService } from './document.service';

// import { TextDocument } from '../interfaces/TextDocument';

import { testDocReg, testDocCode, testDocEmptyReg } from 'src/app/spec-helpers/spec-objects';

// import { Apollo, QueryRef } from 'apollo-angular';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';

// import { ApolloQueryResult, ObservableQuery } from '@apollo/client/core';
// import { of } from 'rxjs';

import { GQL_CREATE_NEW_DOCUMENT, GQL_GET_ALL_DOCUMENTS, GQL_GET_EDITORS, GQL_UPDATE_DOCUMENT } from '../graphql/graphql-queries';
import { TextDocument } from '../interfaces/TextDocument';
import { forkJoin } from 'rxjs';
import { AuthService } from './auth.service';

// const regularEmptyDoc: TextDocument = {
//   id: '',
//   title: '',
//   body: ''
// };

// const filledDoc: TextDocument = {
//   id: 'abcdefghijklmnopqrstuvwx',
//   title: 'filled-title',
//   body: 'filled-body'
// };

describe('DocumentService', () => {
  let apolloController: ApolloTestingController;
  let service: DocumentService;
  let socketService: Socket;
  let authService: AuthService;
  let httpController: HttpTestingController;
  // let apolloService: jasmine.SpyObj<Apollo>;

  beforeEach(() => {
    socketService = jasmine.createSpyObj<Socket>(
      'SocketService',
      ['on', 'emit']
    );
    authService = jasmine.createSpyObj<AuthService>(
      'AuthService',
      {'getOwnUserId': '1'}
    );

    // spyOn(apolloService, 'watchQuery').and.returnValue(3);

    TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule,
        HttpClientTestingModule
      ],
      providers: [
          DocumentService,
          { provide: Socket, useValue: socketService},
          // { provide: Apollo, useValue: apolloService}
      ]
    });

    service = TestBed.inject(DocumentService);
    apolloController = TestBed.inject(ApolloTestingController);
    httpController = TestBed.inject(HttpTestingController);
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

  it('#createDocument triggers post request and document refresh', async () => {
    const refreshSpy = spyOn(service, 'refreshAllDocs');

    service.createDocument();

    const op = apolloController.expectOne(GQL_CREATE_NEW_DOCUMENT);

    op.flush({
      data: {
        status: 'good'
      },
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(refreshSpy).toHaveBeenCalled();
  });

//   it('#upsertDocument calls #createDocument and in turn httpClient.post when active doc is empty', (done: DoneFn) => {
//     httpClientSpy.post.and.returnValue(asyncData(regularEmptyDoc));
    
//     docService.upsertDocument().subscribe(
//       (doc) => {
//         expect(doc).toEqual(regularEmptyDoc);
//         done();
//       },
//       done.fail
//     );

//     expect(httpClientSpy.post.calls.count())
//       .withContext('httpClient.post spy method was called once')
//       .toBe(1);
//   });

//   it("#updateActiveTitle changes document title and triggers subject event emission", () => {
//     const testDoc = { ...regularEmptyDoc };
//     testDoc.title = filledDoc.title;

//     docService.onActiveDocUpdate().subscribe((doc) => expect(doc).toEqual(testDoc));
//     docService.updateActiveTitle(testDoc.title);
//   });

//   it("#updateActiveBody changes document body and triggers subject event emission", () => {
//     const testDoc = { ...regularEmptyDoc };
//     testDoc.body = filledDoc.body;

//     docService.onActiveDocUpdate().subscribe((doc) => expect(doc).toEqual(testDoc));
//     docService.updateActiveBody(testDoc.body);
//   });

//   it("#swapActive changes document and triggers subject event emission", () => {
//     docService.onActiveDocUpdate().subscribe((doc) => expect(doc).toEqual(filledDoc));
//     docService.swapActive(filledDoc);
//   });

//   it("#resetActiveDoc makes document return to empty state and triggers subject emission", fakeAsync(() => {
//     docService.swapActive(filledDoc);
//     tick(1);
//     docService.onActiveDocUpdate().subscribe((doc) => expect(doc).toEqual(regularEmptyDoc));
//     docService.resetActiveDoc();
//   })
//   );

//   it('#upsertDocument calls #updateDocument and in turn httpClient.put when active doc is filled', fakeAsync(() => {
//     httpClientSpy.put.and.returnValue(asyncData(filledDoc));
//     docService.swapActive(filledDoc);
//     tick(1);
    
//     docService.upsertDocument().subscribe(
//       (doc) => {
//         expect(doc).toEqual(filledDoc);
//       },
//       (error) => {
//         console.log(error);
//       }
//     );

//     expect(httpClientSpy.put.calls.count())
//       .withContext('httpClient.post spy method was called once')
//       .toBe(1);
//   })
//   );
});
