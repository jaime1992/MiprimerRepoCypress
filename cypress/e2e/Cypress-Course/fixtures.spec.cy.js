//Localizar un archivo, en este caso el archivo fixtures (sauceCredentials.json)

describe ('FixturesDemo', () => { // agrupa los tests
  // before se ejecuta una sola vez visitando la pagina, por eso la utl se deje dentro del caso 1
  // en cambio beforeEach la pagina se recargue antes de cada test
   beforeEach(function () {
   cy.visit('https://www.saucedemo.com/')
    cy.fixture('fixtures-demo/sauceCredentials').as('credentials')
    //Cypress registra el alias directamente en el contexto de Mocha. Así, cuando el test corre,
    // this.credentials ya está disponible automáticamente — siempre que el it use function() (no arrow function =>).
  })

  //Caso 1
  //l uso de .then() en conjunto con cy.fixture() sirve para trabajar con datos externos (fixtures) y poder manipularlos dentro de tus pruebas.
  it('Usuario Correcto: standardUser', function () {
      //debe ir a dentro del caso, ya que cada caso (it) debe volver a ingresar al login
     cy.get('[data-test="username"]').type(this.credentials.standardUser)
      //cy.wait(2000) // pausa de 2s
     cy.get('[data-test="password"]').type(this.credentials.systemPassword)
      //cy.wait(2000) // pausa de 2s
     cy.get('[data-test="login-button"]').click()
      //cy.wait(2000) // pausa de 2s

     cy.url().should('include', '/inventory')
     //
      cy.wait(2000) // pausa de 4s

     cy.get('.title').should('contain.text','Products')
    })

 it('Usuario Incorrecto: incorrectUser', function () {
    cy.visit('https://www.saucedemo.com/')
     cy.get('[data-test="username"]').type(this.credentials.incorrectUser)
      //cy.wait(2000) // pausa de 2ss
     cy.get('[data-test="password"]').type(this.credentials.incorrectPassword)
      //cy.wait(2000) // pausa de 2s
     cy.get('[data-test="login-button"]').click()
     // cy.wait(2000) // pausa de 2s

    //permite obtener mensaje de error cuando las credenciales son incorrectas
   cy.get('[data-test="error"]').should('contain.text','Epic sadface: Username and password do not match any user in this service')

  })
it('Usuario Bloqueado: lockedUsername', function () {
     cy.visit('https://www.saucedemo.com/')
     cy.get('[data-test="username"]').type(this.credentials.lockedUsername)
      //cy.wait(2000) // pausa de 2s
     cy.get('[data-test="password"]').type(this.credentials.systemPassword)
      //cy.wait(2000) // pausa de 2s
     cy.get('[data-test="login-button"]').click()
      //cy.wait(2000) // pausa de 2s

    //permite obtener mensaje de error cuando las credenciales son incorrectas
   cy.get('[data-test="error"]').should('contain.text','Epic sadface: Sorry, this user has been locked out.')

  })


  //Caso 3 adicional usando method 2 first,eq last
  //l uso de .then() en conjunto con cy.fixture() sirve para trabajar con datos externos (fixtures) y poder manipularlos dentro de tus pruebas.
  it('Usuario Correcto: standardUser (Method 2 First,Eq,Last)', function () {
     //debe ir a dentro del caso, ya que cada caso (it) debe volver a ingresar al login
     cy.visit('https://www.saucedemo.com/')
      
     //method 2 usando posiciones en el DOM
      cy.get('input').first().type(this.credentials.standardUser)   // username
      //cy.wait(2000) // pausa de 2s
      cy.get('input').eq(1).type(this.credentials.systemPassword)   // password
       //cy.wait(2000) // pausa de 2s
      cy.get('input').eq(2).click()                                // login button

     cy.url().should('include', '/inventory')
      //cy.wait(4000) // pausa de 4s

  })




})



