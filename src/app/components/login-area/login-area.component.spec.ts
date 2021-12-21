import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import { LoginAreaComponent } from './login-area.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { findEl, setFieldValue } from 'src/app/spec-helpers/spec-functions';

describe('LoginAreaComponent', () => {
  let authServiceStub: jasmine.SpyObj<AuthService>;
  let routerStub: Partial<Router>;
  let component: LoginAreaComponent;
  let fixture: ComponentFixture<LoginAreaComponent>;
  authServiceStub = jasmine.createSpyObj(
    'authService',
    ['loginUser']
  );

  beforeEach(async () => {
    routerStub = {
      navigate: jasmine.createSpy('routerNavigate')
    };
    await TestBed.configureTestingModule({
      declarations: [ LoginAreaComponent ],
      imports: [
        NoopAnimationsModule,
        MatCardModule,
        MatToolbarModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        FlexLayoutModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceStub},
        { provide: Router, useValue: routerStub }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#loginUser asks auth service to attempt to login user if form was valid', fakeAsync(() => {
    authServiceStub.loginUser.and.returnValue(new Promise(resolve => resolve(true)));
    // this doesn't really work the way it should, form.value still ends up empty
    // for whatever reason
    setFieldValue(fixture, 'username-input', 'test-user');
    setFieldValue(fixture, 'password-input', 'test-password');
    fixture.detectChanges();
    tick(10000);
    const btn = findEl(fixture, 'login-button');

    btn.nativeElement.click();
    fixture.detectChanges();
    tick(10000);

    expect(authServiceStub.loginUser).toHaveBeenCalled();
  }));

  it('#loginUser switches showIncorrect switch if auth service says login failed', fakeAsync(() => {
    authServiceStub.loginUser.and.returnValue(new Promise(resolve => resolve(false)));
    // this doesn't really work the way it should, form.value still ends up empty
    // for whatever reason
    setFieldValue(fixture, 'username-input', 'test-user');
    setFieldValue(fixture, 'password-input', 'test-password');
    fixture.detectChanges();
    tick(10000);
    const btn = findEl(fixture, 'login-button');

    btn.nativeElement.click();
    fixture.detectChanges();
    tick(10000);

    expect(authServiceStub.loginUser).toHaveBeenCalled();
    expect(component.showIncorrect).toBeTrue();
  }));
});
