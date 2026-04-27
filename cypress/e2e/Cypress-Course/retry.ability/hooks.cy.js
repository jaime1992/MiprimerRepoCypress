// hooks -> Mocha
// Los hooks de Mocha permiten ejecutar código en momentos específicos del ciclo de vida de los tests.
// NO confundir con hooks de React (useState, useEffect, etc.)

/* Orden de ejecución:
1. before()      --> UNA VEZ, al principio de todo el describe
2. beforeEach()  --> Antes de CADA test
3. TEST EXECUTION
4. afterEach()   --> Después de CADA test
5. beforeEach()  --> (siguiente test)
6. TEST EXECUTION
7. afterEach()
8. after()       --> UNA VEZ, al final de todo el describe
*/


//Skip - Only 
describe('Demo de hooks', () => {

  before(() => {
    cy.log('before / UNA VEZ, al principio')
  })

  beforeEach(() => {
    cy.log('beforeEach / Antes de cada test')
  })

  specify('should be test #1', () => {
    console.log('test #1')
  })

  specify('should be test #2', () => {
    console.log('test #2')
  })

  specify.only('should be test #3', () => {
    console.log('test #3')
  })

  afterEach(() => {
    cy.log('afterEach / Después de cada test')
  })

  after(() => {
    cy.log('after / UNA VEZ, al final')
  })

})
