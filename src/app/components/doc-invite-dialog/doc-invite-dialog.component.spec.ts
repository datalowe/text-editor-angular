import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { testDocReg } from 'src/app/spec-helpers/spec-objects';

import { DocInviteDialogComponent } from './doc-invite-dialog.component';

describe('DocInviteDialogComponent', () => {
  let component: DocInviteDialogComponent;
  let fixture: ComponentFixture<DocInviteDialogComponent>;
  let dialogRefStub: Partial<MatDialogRef<DocInviteDialogComponent>>;
  let snackBarStub: Partial<MatSnackBar>;
  const mockDialogData = {
    docId: testDocReg.id
  };

  beforeEach(async () => {
    dialogRefStub = {
      'close': jasmine.createSpy('dialogClose')
    };
    snackBarStub = {
      'open': jasmine.createSpy('snackBarClose')
    };
    await TestBed.configureTestingModule({
      declarations: [
        DocInviteDialogComponent
      ],
      imports: [
        NoopAnimationsModule,
        MatDialogModule,
        FormsModule,
        MatFormFieldModule,
        MatSnackBarModule,
        MatInputModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatSnackBar, useValue: snackBarStub }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocInviteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onCancelClick asks dialogref to close', () => {
    component.onCancelClick();

    expect(dialogRefStub.close).toHaveBeenCalled();
  });

  it('#onSendClick triggers snackbar to be opened if no email has been entered', () => {
    component.onSendClick();

    expect(snackBarStub.open).toHaveBeenCalled();
  });

  it('#onSendClick triggers e-mail invite if email has been input and opens no snackbar', () => {
    component.email = 'foo@boo.fasa';
    const trigSpy = spyOn(component, 'triggerEmailInvite');

    component.onSendClick();

    expect(trigSpy).toHaveBeenCalled();
    expect(snackBarStub.open).toHaveBeenCalledTimes(0);
  });
});
