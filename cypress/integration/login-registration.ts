describe('Login form', () => {
    it('Initial page shows login form', () => {
      cy.visit('/');
      cy.contains('Login');
    })
});

describe('Registration form', () => {
    it('Registration page shows registration form', () => {
      cy.visit('/register');
      cy.contains('Registration');
    })
});
