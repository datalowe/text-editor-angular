describe('Site works at all', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.contains('New')
  })
})
