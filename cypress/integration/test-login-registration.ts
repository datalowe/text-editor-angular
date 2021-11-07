import { PlainUser } from '../../src/app/interfaces/PlainUser';
import { backendRootUrl } from 'src/app/global-variables';

const registrationUser: PlainUser = {
  username: "Pocahontas",
  password: "disney"
};
const apiUrl = `${backendRootUrl}/user`;
const fakeUserToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJ1c2VybmFtZSI6Imxvd2UiLCJ1c2VySWQiOiI2MTdiYWE2ZWM1ZjFh' +
  'MmQ0ZmZiMjQ3Y2QiLCJpYXQiOjE2MzYyOTEyOTcsImV4cCI6MTYzNjI5NDg5N30.' +
  'pNP1C7tUNDynOB06aCNb7z2CJ1OQ-_7eMkBjvmaXZ_4';

describe('Login form', () => {
    it('Initial page shows login form for non-logged in user', () => {
      cy.visit('/');
      cy.contains('Login');
    });
});

describe('Registration form', () => {
    it('Registration page shows registration form for non-logged in user', () => {
      cy.visit('/register');
      cy.contains('Registration');
    });

    it('Correctly attempts to send POST request to backend upon valid form submission', () => {
      // intercept request to backend when registering new user
      cy.intercept('POST', `${apiUrl}/register`, {
        statusCode: 201
      }).as('requestNewUser');

      // intercept request to backend when attempting to log in user
      cy.intercept('POST', `${apiUrl}/login`, {
        statusCode: 201,
        body: {
          token: fakeUserToken
        }
      }).as('loginNewUser');

      cy.visit('/register');

      const usernameInput = cy.get('#username-input');
      usernameInput.type(registrationUser.username);


      const passwordInput = cy.get('#password-input');

      passwordInput.type(registrationUser.password);

      const registerBtn = cy.get('#register-btn');

      registerBtn.click();


      cy.wait('@requestNewUser').its('request.body.username').should('eq', registrationUser.username);

      // is directed to text editor after registering
      cy.contains('Document Title');
    });
});
