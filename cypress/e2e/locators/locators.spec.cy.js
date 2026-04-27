// cypress/locators/loginLocators.js

//Datos estaticos con un solo usuario, para varios hay que exportarlos de la carpeta fixture
let username = "standarde_user";
let password = "secret_sauce";

describe('Locators in Cypress', () => {
  beforeEach(() => {
       // Abre la aplicación antes de cada test (it)
       cy.visit('https://www.saucedemo.com/') // ajusta la URL a tu app real
    })

    // Method 1, por cada campo hacer un get
    //casi siempre buscan por id y classs
  it('Get Method', () => {
      //va a buscar el id del campo
      cy.get("#user-name").type(username)
      cy.wait(1000) // pausa de 1s
      // buscar por la class
      cy.get("input#password").type(password);
      cy.wait(1000) // pausa de 1s
      //localizar el botón no por id ni por class
      cy.get('[data-test="login-button"]').click()
   })

   // Method 2 por un elemento (input)hacer get a todos los campos
  it('EQ|First|last Method', () => {
      // asi llama a todos los elementos que son input, username, password y botón
     cy.get('input').first().type(username); //posición 0 vacia
     cy.wait(1000) // pausa de 1s
     cy.get('input').eq(1).type(password); // es 1 porque es la posicion 2 del array
     cy.wait(1000) // pausa de 1s
     cy.get('input').last().click();
     cy.wait(1000) // pausa de 1s
   })

   // Methot obtener un elemento de DOM que hace math a un selector en especifico 
  it('Filter Method', () => {
      // buscar todos los elementos que tenga input (typr) y filtrelos por el elemento de texto
      cy.get('input').filter('[type=text]').type(username);
      cy.wait(1000) // pausa de 1s
      cy.get('input').filter('[type=password]').type(password);
      cy.wait(1000) // pausa de 1s
      cy.get('input').filter('[type=submit]').click();
   })
     
    //obtiene los elementos descendiente de un selector en específico. form IMPORTANTE
   it('Find Method', () => {
      // por medio de find busca todos los input que se encuentran en form
      cy.get('form').find('input').eq(0).type(username); // peude ser first
      cy.get('form').find('input').eq(1).type(password);
      cy.get('form').find('input').eq(2).click(); //puede ser last en vez eq(2)
   })

   //div class el mayor, PADRE DE FORM... SERIA CLASS=LOGIN-BOX
   it('Parent Method', () => {
      cy.get('form').parent().should('have.class','login-box')
   })
    
})
