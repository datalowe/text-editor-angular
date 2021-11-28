import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CookieService } from 'ngx-cookie-service';

import { AuthService } from './auth.service';
import { PlainUser } from '../interfaces/PlainUser';
import { backendRootUrl } from '../global-variables';

const testPUserNoInvite: PlainUser = {
  username: 'testname',
  password: 'testpass',
};

// fake user token with
// username: lowe
// userId: 617baa6ec5f1a2d4ffb247cd
// exp: 1637427549 (expiring at this number of seconds since 1970)
const fakeUserToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJ1c2VybmFtZSI6Imxvd2UiLCJ1c2VySWQiOiI2MTdiYWE2ZWM1Zj' +
  'FhMmQ0ZmZiMjQ3Y2QiLCJpYXQiOjE2Mzc0MjM5NDksImV4cCI6MT' +
  'YzNzQyNzU0OX0.sR6yOU6RDwdXExqTowmOwdYMFNshQlxBBmyhGlLo5RM';

describe('AuthService', () => {
  let service: AuthService;
  let cookieService: CookieService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AuthService,
        CookieService
      ]
    });
    service = TestBed.inject(AuthService);
    cookieService = TestBed.inject(CookieService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sends a POST request to backend with user when createUser is called', () => {
    let actualResp: any = {};
    const fakeResp = { success: 'user_created' };
    const expectedUri = `${backendRootUrl}/user/register`;

    service.createUser(testPUserNoInvite)
      .subscribe(
        (resp) => actualResp = resp
      );
    
    const req = httpController.expectOne(expectedUri);

    req.flush(fakeResp, {
      headers: {
        statusCode: '201'
      }
    });

    expect(actualResp).toEqual(fakeResp);
  });

  it('sends a POST request to backend and sets cookie when loginUser is called with valid user', async () => {
    let actualResp: any = {};
    const fakeResp = { token: 'test-token' };
    const expectedUri = `${backendRootUrl}/user/login`;

    const returnPromise: Promise<boolean> = service.loginUser(testPUserNoInvite);
    let returnVal;

    returnPromise.then((res) => returnVal = res);

    const req = httpController.expectOne(expectedUri);

    req.flush(fakeResp);

    await Promise.all([returnPromise]);

    expect(returnVal).toBeTrue();

    expect(cookieService.get('editor-api-token')).toBe(fakeResp.token);
  });

  it(
    'does not set cookie when loginUser is called and backend gives no cookie back', async () => {
    let actualResp: any = {};
    const fakeResp = { error: 'invalid_credentials' };
    const expectedUri = `${backendRootUrl}/user/login`;

    const returnPromise: Promise<boolean> = service.loginUser(testPUserNoInvite);
    let returnVal;

    returnPromise.then((res) => returnVal = res);

    const req = httpController.expectOne(expectedUri);

    req.flush(fakeResp);

    await Promise.all([returnPromise]);

    expect(returnVal).toBeFalse();

    expect(cookieService.get('editor-api-token')).toBeUndefined;
  });

  it("returns true when isUserLoginActive is called if user token hasn't expired", async () => {
    jasmine.clock().install();

    const preExpirationDate = new Date(1637426549000);

    jasmine.clock().mockDate(preExpirationDate);

    cookieService.set('editor-api-token', fakeUserToken);

    const loggedInVal = service.isUserLoginActive();

    expect(loggedInVal).toBeTrue();

    jasmine.clock().uninstall();
  });

  it("returns false when isUserLoginActive is called if user token has expired", async () => {
    jasmine.clock().install();

    const postExpirationDate = new Date(1637526549000);

    jasmine.clock().mockDate(postExpirationDate);

    cookieService.set('editor-api-token', fakeUserToken);

    const loggedInVal = service.isUserLoginActive();

    expect(loggedInVal).toBeFalse();

    jasmine.clock().uninstall();
  });

  it('returns username embedded in set token when getOwnUsername is called', () => {
    cookieService.set('editor-api-token', fakeUserToken);

    const userName = service.getOwnUsername();

    expect(userName).toEqual('lowe');
  });

  it('returns empty string when getOwnUsername is called and no token is set', () => {
    cookieService.delete('editor-api-token');

    const userName = service.getOwnUsername();

    expect(userName).toEqual('');
  });

  it('returns userId embedded in set token when getOwnUserId is called', () => {
    cookieService.set('editor-api-token', fakeUserToken);

    const userId = service.getOwnUserId();

    expect(userId).toEqual('617baa6ec5f1a2d4ffb247cd');
  });

  it('returns empty string when getOwnUserId is called and no token is set', () => {
    cookieService.delete('editor-api-token');

    const userId = service.getOwnUserId();

    expect(userId).toEqual('');
  });
});
