import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocInviteDialogComponent } from './doc-invite-dialog.component';

xdescribe('DocInviteDialogComponent', () => {
  let component: DocInviteDialogComponent;
  let fixture: ComponentFixture<DocInviteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocInviteDialogComponent ]
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
});
