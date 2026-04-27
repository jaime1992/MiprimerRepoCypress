describe('Práctica Selectores por ID', () => {

  beforeEach(() => {
    cy.visit('cypress/fixtures/practica-selectores.html')
  })

  it('Llena el formulario con credenciales correctas', () => {
    cy.get('#username').type('admin')
    cy.get('#password').type('1234')
    cy.get('#btn-login').click()
    cy.get('#mensaje').should('be.visible').and('contain', 'Login exitoso')
  })

  it('Muestra error con credenciales incorrectas', () => {
    cy.get('#username').type('usuario_malo')
    cy.get('#password').type('clavemal')
    cy.get('#btn-login').click()
    cy.get('#mensaje').should('contain', 'incorrectos')
  })

  it('El botón cancelar limpia el formulario', () => {
    cy.get('#username').type('admin')
    cy.get('#btn-cancel').click()
    cy.get('#username').should('have.value', '')
  })

})
