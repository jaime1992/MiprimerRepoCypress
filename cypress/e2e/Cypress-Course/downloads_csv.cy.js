describe('Downloaded CSV Files', () => {

  const fileName = 'data.csv'
  const fileUrl = 'https://people.sc.fsu.edu/~jburkardt/data/csv/addresses.csv'

  it('should download a CSV file using cy.request and save it', () => {
    cy.request({
      url: fileUrl,
      encoding: 'binary'
    }).then((response) => {
      expect(response.status).to.eq(200)

      cy.writeFile(`cypress/downloads/${fileName}`, response.body, 'binary')
    })
  })

  it('should verify downloaded CSV file exists', () => {
    cy.request({
      url: fileUrl,
      encoding: 'binary'
    }).then((response) => {
      cy.writeFile(`cypress/downloads/${fileName}`, response.body, 'binary')
    })

    cy.readFile(`cypress/downloads/${fileName}`).should('exist')
  })

  it('should read and validate CSV file content', () => {
    cy.request({
      url: fileUrl,
      encoding: 'binary'
    }).then((response) => {
      cy.writeFile(`cypress/downloads/${fileName}`, response.body, 'binary')
    })

    cy.readFile(`cypress/downloads/${fileName}`).then((content) => {
      const rows = content.trim().split('\n')
      const headers = rows[0].split(',')

      expect(rows.length).to.be.greaterThan(1)
      expect(headers.length).to.be.greaterThan(0)

      cy.log(`Total rows: ${rows.length}`)
      cy.log(`Columns: ${headers.join(', ')}`)
    })
  })

})
