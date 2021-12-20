import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

import { DocumentEditorsListComponent } from './document-editors-list.component';
import { DocumentService } from 'src/app/services/document.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'zen-observable';
import { testDocReg } from 'src/app/spec-helpers/spec-objects';
import { DocInviteDialogComponent } from '../doc-invite-dialog/doc-invite-dialog.component';

let authServiceStub: Partial<AuthService>;
let documentServiceStub: Partial<DocumentService>;

describe('DocumentEditorsListComponent', () => {
  let component: DocumentEditorsListComponent;
  let fixture: ComponentFixture<DocumentEditorsListComponent>;

  beforeEach(async () => {
    documentServiceStub = {
      isCodeModeOn: () => false,
      toggleActiveEditor: jasmine.createSpy('toggleActiveEditor'),
      onEditorsUpdate: jasmine.createSpy('onEditorsUpdate').and.returnValue(of(testDocReg.editors)),
      onActiveDocUpdate: jasmine.createSpy('onActiveDocUpdate').and.returnValue(of(testDocReg))
    };
    authServiceStub = {
      getOwnUserId: () => testDocReg.editors[0].id,
    }
    await TestBed.configureTestingModule({
      declarations: [
        DocumentEditorsListComponent,
        DocInviteDialogComponent
      ],
      imports: [
        MatListModule,
        MatCardModule,
        MatDialogModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceStub},
        { provide: DocumentService, useValue: documentServiceStub },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentEditorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#isDocumentEditor returns true when editor ID is that of an active document editor', async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(component.isDocumentEditor(testDocReg.editors[0].id)).toBeTrue();
  });

  it('#isDocumentEditor returns false when editor ID is not that of an active document editor', () => {
    expect(component.isDocumentEditor('10123123')).toBeFalse();
  });

  it('#toggleEditor calls service method with correct argument', () => {
    component.toggleEditor('foo');

    expect(documentServiceStub.toggleActiveEditor).toHaveBeenCalledWith('foo');
  });

  it('#toggleShowEditors switches showEditors from false to true', () => {
    component.toggleShowEditors();

    expect(component.showEditors).toBeTrue();
  });

  it('#getDocEditorsExceptOwner returns all active editors except owner themselves', async () => {
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(component.getDocEditorsExceptOwner().includes(testDocReg.editors[0])).toBeTrue();
  });

  it('#getAllEditorsExceptOwner returns all active editors except owner themselves', async () => {
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(component.getAllEditorsExceptOwner().includes(testDocReg.editors[0])).toBeTrue();
  });

  it('#getAllEditorsExceptOwner returns all active editors except owner themselves', async () => {
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(component.getAllEditorsExceptOwner().includes(testDocReg.editors[0])).toBeTrue();
  });

  it('#openInviteDialog calls open on component matdialog with active doc data', async () => {
    const inviteDialogSpy = jasmine.createSpyObj(
      'inviteDialog',
      {
        'open': jasmine.createSpy('inviteDialogOpen')
      }
    );

    (component as any).inviteDialog = inviteDialogSpy;

    component.openInviteDialog();
      
    expect(inviteDialogSpy.open).toHaveBeenCalled();
  });
});
