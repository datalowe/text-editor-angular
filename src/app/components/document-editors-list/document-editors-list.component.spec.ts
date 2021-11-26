import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentEditorsListComponent } from './document-editors-list.component';

xdescribe('DocumentEditorsListComponent', () => {
  let component: DocumentEditorsListComponent;
  let fixture: ComponentFixture<DocumentEditorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentEditorsListComponent ]
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
