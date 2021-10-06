import { HttpClientModule } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { DocumentService } from './document.service';

import { TextDocument } from '../TextDocument';
import { asyncData } from 'src/testing/async-observable-helpers';

const emptyDoc: TextDocument = {
  _id: '',
  title: '',
  body: ''
};

const filledDoc: TextDocument = {
  _id: 'abcdefghijklmnopqrstuvwx',
  title: 'filled-title',
  body: 'filled-body'
};

describe('DocumentService', () => {
  let service: DocumentService;
  let httpClientSpy: { post: jasmine.Spy, put: jasmine.Spy };
  let docService: DocumentService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentService);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'put']);
    docService = new DocumentService(httpClientSpy as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#createDocument should call httpClient post with just title and body of empty doc', (done: DoneFn) => {
    const idDoc: TextDocument = {
      _id: 'abcdefghijklmnopqrstuvwx',
      title: '',
      body: ''
    }
    httpClientSpy.post.and.returnValue(asyncData(idDoc));

    docService.createDocument().subscribe(
      (doc) => {
        expect(doc).toEqual(idDoc);
        done();
      },
      done.fail
    );
    
    expect(httpClientSpy.post.calls.count())
      .withContext('httpClient.post spy method was called once')
      .toBe(1);
  
    expect(httpClientSpy.post.calls.first().args[1])
      .withContext('httpClient.post spy method was called with empty doc')
      .toEqual({'title': '', 'body': ''});
  });

  it('#upsertDocument calls #createDocument and in turn httpClient.post when active doc is empty', (done: DoneFn) => {
    httpClientSpy.post.and.returnValue(asyncData(emptyDoc));
    
    docService.upsertDocument().subscribe(
      (doc) => {
        expect(doc).toEqual(emptyDoc);
        done();
      },
      done.fail
    );

    expect(httpClientSpy.post.calls.count())
      .withContext('httpClient.post spy method was called once')
      .toBe(1);
  });

  it("#updateActiveTitle changes document title and triggers subject event emission", () => {
    const testDoc = { ...emptyDoc };
    testDoc.title = filledDoc.title;

    docService.onActiveDocUpdate().subscribe((doc) => expect(doc).toEqual(testDoc));
    docService.updateActiveTitle(testDoc.title);
  });

  it("#updateActiveBody changes document body and triggers subject event emission", () => {
    const testDoc = { ...emptyDoc };
    testDoc.body = filledDoc.body;

    docService.onActiveDocUpdate().subscribe((doc) => expect(doc).toEqual(testDoc));
    docService.updateActiveBody(testDoc.body);
  });

  it("#swapActive changes document and triggers subject event emission", () => {
    docService.onActiveDocUpdate().subscribe((doc) => expect(doc).toEqual(filledDoc));
    docService.swapActive(filledDoc);
  });

  it("#resetActiveDoc makes document return to empty state and triggers subject emission", fakeAsync(() => {
    docService.swapActive(filledDoc);
    tick(1);
    docService.onActiveDocUpdate().subscribe((doc) => expect(doc).toEqual(emptyDoc));
    docService.resetActiveDoc();
  })
  );

  it('#upsertDocument calls #updateDocument and in turn httpClient.put when active doc is filled', fakeAsync(() => {
    httpClientSpy.put.and.returnValue(asyncData(filledDoc));
    docService.swapActive(filledDoc);
    tick(1);
    
    docService.upsertDocument().subscribe(
      (doc) => {
        expect(doc).toEqual(filledDoc);
      },
      (error) => {
        console.log(error);
      }
    );

    expect(httpClientSpy.put.calls.count())
      .withContext('httpClient.post spy method was called once')
      .toBe(1);
  })
  );
});
