import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextDocument } from 'src/app/interfaces/TextDocument';
import { DocumentService } from 'src/app/services/document.service';

import { DocumentListComponent } from './document-list.component';

const testDoc: TextDocument = {
  id: 'abcdefghijklmnopqrstuvwx',
  title: 'test-title',
  body: 'test-body',
  editors: [{id: '1', username: 'a'}],
  owner: {id: '3', username: 'ba'},
  type: 'regular'
}

let documentServiceStub: Partial<DocumentService>;

documentServiceStub = {
  isCodeModeOn: () => false
};

fdescribe('DocumentListComponent', () => {
  let fixture: ComponentFixture<DocumentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        DocumentListComponent
      ],
      providers: [
        { provide: DocumentService, useValue: documentServiceStub },
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentListComponent);
    // itemFixture = TestBed.createComponent(DocumentListItemComponent);
    // comp = fixture.componentInstance;
    // itemComp = itemFixture.componentInstance;
    // fixture.detectChanges();
  });

  it('raises the docSelection event when embedded document list item is clicked', () => {
    // TODO check that the correct
    // document is passed on through event.
    // comp.docSelection.pipe(first()).subscribe((selectedDoc: TextDocument) => expect(selectedDoc).toBe(testDoc));
    // comp.onClickDoc(testDoc);
    fixture
  })
});
