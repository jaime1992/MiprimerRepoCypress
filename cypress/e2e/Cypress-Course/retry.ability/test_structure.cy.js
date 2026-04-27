//Tipics:
//-> Describe and context
//->It and Specity
//->Unit testing Demo

// let add = (a,b)=> a + b;
// let subtract = (a,b)=> a -b;
// let divide = (a,b)=> a/b;
// let multiply = (a,b)= a*b;

function add(a, b) {
    return a + b
  }
  
  function subtract(a, b) {
    return a - b
  }
  
  function divide(a, b) {
    return a / b
  }
  
  function multiply(a, b) {
    return a * b
  }

//Describe o context ->
describe('Unit testing for our dummy aplication',()=>{
    context('math with POSITIVE Numbers',()=>{
        //It = Specity
        it('should add positive numbers',()=>{
            cy.expect(add(1,2)).to.eq(3);
        });
        it('should subtract positive numbers',()=>{
            cy.expect(subtract(4,2)).to.eq(2);
        });
        it('should divide positive numbers',()=>{
            cy.expect(divide(6,2)).to.eq(3);
        });
        it('should multiply positive numbers',()=>{
            cy.expect(multiply(2,2)).to.eq(4);
        });
    });
    describe('Math with DECIMAL numbers',()=>{
        specify('should add positive numbers',()=>{
            cy.expect(add(2.2,2.2)).to.eq(4.4);
        });
        specify('should subtract positive numbers',()=>{
            cy.expect(subtract(4.4,2.2)).to.eq(2.2);
        });
        specify('should divide positive numbers',()=>{
            cy.expect(divide(2.2,2.2)).to.eq(1);
        });
        specify('should multiply positive numbers',()=>{
            cy.expect(multiply(4.4,2.2)).to.eq(9.680000000000001);
        });
    });
});