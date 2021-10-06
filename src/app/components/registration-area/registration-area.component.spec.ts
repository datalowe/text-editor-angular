import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationAreaComponent } from './registration-area.component';

describe('RegistrationAreaComponent', () => {
  let component: RegistrationAreaComponent;
  let fixture: ComponentFixture<RegistrationAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
