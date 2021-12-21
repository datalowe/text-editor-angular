import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { of } from 'rxjs';

import { RegistrationAreaComponent } from './registration-area.component';
import { findEl } from 'src/app/spec-helpers/spec-functions';

describe('RegistrationAreaComponent', () => {
  let authServiceStub: jasmine.SpyObj<AuthService>;
  let routerStub: jasmine.SpyObj<Router>;
  let routeStub: jasmine.SpyObj<ActivatedRoute>;
  let component: RegistrationAreaComponent;
  let fixture: ComponentFixture<RegistrationAreaComponent>;
  authServiceStub = jasmine.createSpyObj(
    'authService',
    ['createUser', 'loginUser']
  );
  routerStub = jasmine.createSpyObj(
    'router',
    ['navigate']
  );
  routeStub = jasmine.createSpyObj(
    'route',
    {},
    {
      'queryParams': of(
        {'doc_invite_key': 'lolol'}
      )
    }
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        RegistrationAreaComponent
      ],
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
        { provide: Router, useValue: routerStub },
        { provide: ActivatedRoute, useValue: routeStub}        
      ]
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

  it('#toggleShowPassword flips switch', fakeAsync( () => {
    const showToggle = findEl(fixture, 'password-toggle-check');

    expect(component.showPassword).toBeFalse();
    showToggle.nativeElement.click();
    tick(1000);
    fixture.detectChanges();
    expect(component.showPassword).toBeTrue();
  }));

  it('#askCreateUser asks auth service to create user', fakeAsync( () => {
    authServiceStub.createUser.and.returnValue(of({'lol': true}));
    authServiceStub.loginUser.and.returnValue(new Promise(resolve => resolve(true)));
    const registerButton = findEl(fixture, 'register-button');

    registerButton.nativeElement.click();
    tick(1000);
    fixture.detectChanges();

    expect(authServiceStub.createUser).toHaveBeenCalled();
    expect(routerStub.navigate).toHaveBeenCalled();
  }));
});
