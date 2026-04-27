/*


*/


describe('Location Demo', () => {
  beforeEach(() => {
      // Abre la aplicación antes de cada test (it)
    cy.visit('https://www.saucedemo.com/') // ajusta la URL a tu app real
  })

  it('Deberia tener Titulo Swag Labs', () => {
      // title permite verificar el titulo
      cy.title().should('eq','Swag Labs') 
 })

  it('Validar URL https://www.saucedemo.com', () => {
      // ur permite verificar la url de la página
      cy.url().should('eq','https://www.saucedemo.com/')
   })

   it('Usar https', () => {
      // location permite verificar que contenga https
      cy.location('protocol').should('contains','https')
   })

  it('Validar Hostname www.saucedemo.com', () => {
      //validar hostname (nombre de la url)
      cy.location('hostname').should('eq','www.saucedemo.com')
   })

    it('Se debe direccionar a /inventory', () => {
      //validar hostname (nombre de la url)
      // get permite ver clase y como se escribe interno del campo y el type es el dato a escribir
      cy.get('[data-test="username"]').type('standard_user')
      cy.get('[data-test="password"]').type('secret_sauce')
      cy.get('[data-test="login-button"]').click()  // no espera ningun valor, por eso es solo click()
      
      cy.location('pathname').should('eq','/inventory.html')
   })
   
})