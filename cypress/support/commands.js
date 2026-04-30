// ─── LOGIN ────────────────────────────────────────────────────────────────────
// Uso: cy.login('user@email.com', 'password')
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('[data-cy=email]').clear().type(email)
  cy.get('[data-cy=password]').clear().type(password, { log: false })
  cy.get('[data-cy=submit]').click()
})

// ─── LOGIN VIA API (más rápido, sin UI) ───────────────────────────────────────
// Uso: cy.loginApi('user@email.com', 'password')
Cypress.Commands.add('loginApi', (email, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiBaseUrl')}/auth/login`,
    body: { email, password },
    failOnStatusCode: false,
  }).then(({ body }) => {
    if (body.token) {
      window.localStorage.setItem('token', body.token)
    }
  })
})

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
// Uso: cy.logout()
Cypress.Commands.add('logout', () => {
  cy.clearCookies()
  cy.clearLocalStorage()
})

// ─── INTERCEPT + ALIAS GENÉRICO ───────────────────────────────────────────────
// Uso: cy.interceptApi('GET', '/api/users', 'getUsers') → cy.wait('@getUsers')
Cypress.Commands.add('interceptApi', (method, url, alias) => {
  cy.intercept(method, `${Cypress.env('apiBaseUrl')}${url}`).as(alias)
})

// ─── LLENAR FORMULARIO ────────────────────────────────────────────────────────
// Uso: cy.fillForm({ '[data-cy=name]': 'Juan', '[data-cy=email]': 'juan@a.com' })
Cypress.Commands.add('fillForm', (fields) => {
  Object.entries(fields).forEach(([selector, value]) => {
    cy.get(selector).clear().type(value)
  })
})

// ─── VERIFICAR TOAST / ALERTA ─────────────────────────────────────────────────
// Uso: cy.shouldShowToast('Guardado correctamente')
Cypress.Commands.add('shouldShowToast', (message) => {
  cy.contains(message).should('be.visible')
})

// ─── DRAG AND DROP ────────────────────────────────────────────────────────────
// Uso: cy.get('[data-cy=item]').dragTo('[data-cy=target]')
Cypress.Commands.add('dragTo', { prevSubject: 'element' }, (subject, targetSelector) => {
  cy.wrap(subject).trigger('dragstart')
  cy.get(targetSelector).trigger('dragover').trigger('drop')
})

// ─── SCROLL HASTA ELEMENTO ────────────────────────────────────────────────────
// Uso: cy.scrollToElement('[data-cy=footer]')
Cypress.Commands.add('scrollToElement', (selector) => {
  cy.get(selector).scrollIntoView().should('be.visible')
})

// ─── VERIFICAR TABLA ──────────────────────────────────────────────────────────
// Uso: cy.tableRowCount('[data-cy=tabla]', 5)
Cypress.Commands.add('tableRowCount', (tableSelector, expectedCount) => {
  cy.get(`${tableSelector} tbody tr`).should('have.length', expectedCount)
})

// ─── DESCARGAR Y VERIFICAR ARCHIVO ────────────────────────────────────────────
// Uso: cy.verifyDownload('reporte.xlsx')
Cypress.Commands.add('verifyDownload', (filename) => {
  const downloadsFolder = Cypress.config('downloadsFolder')
  cy.readFile(`${downloadsFolder}/${filename}`).should('exist')
})
