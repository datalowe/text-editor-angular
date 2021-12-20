import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentService } from 'src/app/services/document.service';

import { DocumentListComponent } from './document-list.component';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

import { By } from '@angular/platform-browser';

import { testDocReg, testDocCode } from 'src/app/spec-helpers/spec-objects';

let documentServiceStub: Partial<DocumentService>;

describe('DocumentListComponent (code mode off)', () => {
  let fixture: ComponentFixture<DocumentListComponent>;
  let component: DocumentListComponent;

  beforeEach(async () => {
    documentServiceStub = {
      isCodeModeOn: () => false
    };

    await TestBed.configureTestingModule({
      declarations: [ 
        DocumentListComponent
      ],
      imports: [
        MatListModule,
        MatCardModule
      ],
      providers: [
        { provide: DocumentService, useValue: documentServiceStub },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentListComponent);
    component = fixture.componentInstance;
  });

  it('emits the docSelection event when embedded document list item is clicked', () => {
    spyOn(component.docSelection, "emit");
    component.onClickDoc(testDocReg);

    expect(component.docSelection.emit).toHaveBeenCalledWith(testDocReg);
  })

  it('filters to keep only regular docs when code mode is off', () => {
    component.documents = [testDocCode, testDocReg];
    const currMDocs = component.getCurrentModeDocs();

    expect(currMDocs.length).toBe(1);
    expect(currMDocs[0]).toBe(testDocReg);
  });

  it('correctly renders doc title of regular doc when code mode is off', () => {
    component.documents = [testDocCode, testDocReg];
    fixture.detectChanges();

    const docListItems = fixture.debugElement.queryAll(By.css(".document-list-item"));

    expect(docListItems.length).toBe(1);
    expect(docListItems[0].nativeNode.innerHTML).toContain(testDocReg.title);
  });
});







describe('DocumentListComponent (code mode on)', () => {
  let fixture: ComponentFixture<DocumentListComponent>;
  let component: DocumentListComponent;

  beforeEach(async () => {
    documentServiceStub = {
      isCodeModeOn: () => true
    };

    await TestBed.configureTestingModule({
      declarations: [ 
        DocumentListComponent
      ],
      imports: [
        MatListModule,
        MatCardModule
      ],
      providers: [
        { provide: DocumentService, useValue: documentServiceStub },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentListComponent);
    component = fixture.componentInstance;
  });

  it('filters to keep only code docs when code mode is on', () => {
    component.documents = [testDocCode, testDocReg];
    const currMDocs = component.getCurrentModeDocs();

    expect(currMDocs.length).toBe(1);
    expect(currMDocs[0]).toBe(testDocCode);
  });
});