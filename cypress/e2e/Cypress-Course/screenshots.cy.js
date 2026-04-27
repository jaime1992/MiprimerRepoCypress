describe('Screenshot Files', () => {

  beforeEach(() => {
    cy.visit('https://the-internet.herokuapp.com')
  })

  it('should take a screenshot of the full page', () => {
    cy.screenshot('full-page')
  })

  it('should take a screenshot of a specific element', () => {
    cy.get('h1').screenshot('heading-element')
  })

  it('should take a screenshot on test failure', () => {
    cy.visit('https://the-internet.herokuapp.com/login')

    cy.get('#username').type('invalid_user')
    cy.get('#password').type('invalid_pass')
    cy.get('button[type="submit"]').click()

    cy.get('.flash.error').should('be.visible').screenshot('login-error')
  })

  it('should take multiple screenshots during a flow', () => {
    cy.visit('https://the-internet.herokuapp.com/login')
    cy.screenshot('01-login-page')

    cy.get('#username').type('tomsmith')
    cy.get('#password').type('SuperSecretPassword!')
    cy.get('button[type="submit"]').click()
    cy.screenshot('02-after-login')

    cy.get('.flash.success').should('be.visible')
    cy.screenshot('03-success-message')
  })

})
