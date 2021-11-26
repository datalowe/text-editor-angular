import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentEditorsListComponent } from './document-editors-list.component';
import { DocumentService } from 'src/app/services/document.service';

let documentServiceStub: Partial<DocumentService>;

const subscribeSpy = jasmine.createSpy('subscribe');

documentServiceStub = {
  // onEditorsUpdate: () => false
};

xdescribe('DocumentEditorsListComponent', () => {
  let component: DocumentEditorsListComponent;
  let fixture: ComponentFixture<DocumentEditorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DocumentEditorsListComponent
      ],
      providers: [
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
});
