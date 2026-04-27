/*
Retry-ability: Es la capacidad de reintentar las pruebas

Las consultas (query): se enlazan, reintentando toda la cadena en conjunto.
Las aserciones (assertion): son un tipo de consulta que se muestra de forma especial en el registro de comandos.
should()

Las operaciones (acción) 
que no son consultas se ejecutan solo una vez.

cy.get('.todoapp') // query
  .find('.todo-list li') // query
  .should('have.length', 1) // assertion


En Cypress, el DOM (Document Object Model) es la estructura jerárquica
de objetos que representa la página web cargada, permitiendo a Cypress
interactuar con ella. Cypress utiliza comandos como cy.get() o
cy.contains() para consultar, seleccionar y manipular 
elementos HTML directamente. Además, gestiona de forma 
nativa el Shadow DOM, permitiendo pruebas en componentes 
encapsulados. 
*/

describe('Sesion de Retry-ability', () => { // agrupa los tests
  // before se ejecuta una sola vez visitando la pagina
  // en cambio beforeEach la pagina se recargue antes de cada test
  beforeEach(() => { //Hook
    cy.visit('https://example.cypress.io/todo')
  })

  // aquí van los comandos cy.get, cy.type, etc.
  it('Agrega dos textos en el campo', () => {
    cy.get('.new-todo').type('Todo-A{enter}', { delay: 300 }) // tipeo lento
    cy.wait(1000) // pausa de 1s
    cy.get('.new-todo').type('Todo-B{enter}', { delay: 300 }) // tipop lento
    cy.wait(1000) // pausa de 1s
    
    cy.get('.new-todo').type('Probando{enter}')
  })

  it('Agrega Numeros', () => {
    cy.get('.new-todo').type('1234{enter}', { delay: 300 }) // tipeo lento
    cy.wait(1000) // pausa de 1s
    cy.get('.new-todo').type('243545{enter}', { delay: 300 }) // tipeo lento
    cy.wait(1000) // pausa de 1s
  })

  // valida que existan los items creados
  it('Debe Crear 2 items Nombres', () => {
      cy.get('.new-todo').type('Javi{enter}', { delay: 300 }) // tipeo lento
    cy.wait(1000) // pausa de 1s
      cy.wait(1000) // pausa de 1s
      cy.get('.new-todo').type('Jaime{enter}')

      cy.get('.todo-list li')
      .should('have.length', 4) // Assertion: 2 default + 2 agregados
    })
})
