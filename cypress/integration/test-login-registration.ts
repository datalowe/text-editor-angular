const registrationUser = {
  username: "Pocahontas",
  password: "disney"
};
const apiUrl = 'https://texted-backend-2.azurewebsites.net/user';

describe('Login form', () => {
    it('Initial page shows login form', () => {
      cy.visit('/');
      cy.contains('Login');
    });
});

describe('Registration form', () => {
    it('Registration page shows registration form', () => {
      cy.visit('/register');
      cy.contains('Registration');
    });

    it('Correctly attempts to send POST request to backend upon valid form submission', () => {
      cy.intercept('POST', `${apiUrl}/register`, {
        statusCode: 201
      }).as('requestNewUser');
      cy.visit('/register');

      const usernameInput = cy.get('#username-input');
      usernameInput.type(registrationUser.username);


      const passwordInput = cy.get('#password-input');

      passwordInput.type(registrationUser.password);

      const registerBtn = cy.get('#register-btn');

      registerBtn.click();


      cy.wait('@requestNewUser').its('request.body.username').should('eq', registrationUser.username);
    });
});
