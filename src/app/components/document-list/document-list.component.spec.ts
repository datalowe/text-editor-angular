import { ComponentFixture, TestBed } from '@angular/core/testing';
import { first } from 'rxjs/operators';
import { Document } from 'src/app/Document';
import { DocumentListItemComponent } from '../document-list-item/document-list-item.component';

import { DocumentListComponent } from './document-list.component';

const testDoc: Document = {
  '_id': 'abcdefghijklmnopqrstuvwx',
  'title': 'test-title',
  'body': 'test-body'
}

describe('DocumentListComponent', () => {
  let comp: DocumentListComponent;
  let itemComp: DocumentListItemComponent;
  let fixture: ComponentFixture<DocumentListComponent>;
  let itemFixture: ComponentFixture<DocumentListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        DocumentListComponent,
        DocumentListItemComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentListComponent);
    // itemFixture = TestBed.createComponent(DocumentListItemComponent);
    comp = fixture.componentInstance;
    // itemComp = itemFixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('raises the onSelectDoc event when embedded document list item is clicked', () => {
    // TODO update so that it's an embedded item that is clicked, and check that the correct
    // document is passed on through event.
    comp.onSelectDoc.pipe(first()).subscribe((selectedDoc: Document) => expect(selectedDoc).toBe(testDoc));
    comp.onClickDoc(testDoc);
  })
});
