import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { first } from 'rxjs/operators';

import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('raises the btnClick event when clicked', fakeAsync( () => {
    spyOn(component.btnClick, 'emit');
    const button = fixture.debugElement.nativeElement.querySelector('button');
  
    button.click()
    tick(1);
    expect(component.btnClick.emit).toHaveBeenCalled();

  })
  );
});
