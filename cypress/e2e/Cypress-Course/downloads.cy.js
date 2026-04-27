describe('Downloaded Files', () => {

  const fileName = 'cypress-logo.png'
  const fileUrl = 'https://www.cypress.io/images/layouts/cypress-logo.svg'

  it('should download a file and verify it exists', () => {
    cy.visit('https://the-internet.herokuapp.com/download')

    cy.get('a').first().click()

    cy.wait(2000)

    cy.task('readFileMaybe', `cypress/downloads/some-file.pdf`).then((fileExists) => {
      expect(fileExists).to.not.be.null
    })
  })

  it('should download a file using cy.request and save it', () => {
    cy.request({
      url: fileUrl,
      encoding: 'binary'
    }).then((response) => {
      expect(response.status).to.eq(200)

      cy.writeFile(`cypress/downloads/${fileName}`, response.body, 'binary')
    })
  })

  it('should verify downloaded file exists after download', () => {
    cy.request({
      url: fileUrl,
      encoding: 'binary'
    }).then((response) => {
      cy.writeFile(`cypress/downloads/${fileName}`, response.body, 'binary')
    })

    cy.readFile(`cypress/downloads/${fileName}`).should('exist')
  })

})
