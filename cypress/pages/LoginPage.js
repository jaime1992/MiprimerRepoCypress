class LoginPage {
  // Selectores
  get emailInput()    { return cy.get('[data-cy=email]') }
  get passwordInput() { return cy.get('[data-cy=password]') }
  get submitBtn()     { return cy.get('[data-cy=submit]') }
  get errorMsg()      { return cy.get('[data-cy=error-message]') }

  visit() {
    cy.visit('/login')
  }

  login(email, password) {
    this.emailInput.clear().type(email)
    this.passwordInput.clear().type(password, { log: false })
    this.submitBtn.click()
  }

  shouldShowError(message) {
    this.errorMsg.should('be.visible').and('contain', message)
  }
}

module.exports = new LoginPage()
