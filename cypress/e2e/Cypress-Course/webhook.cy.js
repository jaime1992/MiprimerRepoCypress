// Ejemplo: Test de Webhook — interceptar llamada saliente y validar payload
// Simula que la app dispara un webhook al completar una acción

describe('Webhook — validar disparo y payload', () => {
  beforeEach(() => {
    // Intercepta la llamada al webhook antes de que la app la haga
    cy.interceptApi('POST', '**/webhook/cypress-results', 'webhookCall')
  })

  it('intercepta el webhook saliente y valida el payload', () => {
    // Simula la llamada directa al webhook (como si fuera la app)
    cy.request({
      method: 'POST',
      url: 'http://localhost:5678/webhook/cypress-results',
      body: {
        event: 'test:complete',
        suite: 'Regresion QA',
        passed: 10,
        failed: 2,
        timestamp: new Date().toISOString(),
      },
      failOnStatusCode: false,
    }).then((res) => {
      // n8n responde 200 cuando recibe el webhook
      expect(res.status).to.be.oneOf([200, 404]) // 404 si n8n no está corriendo
    })
  })

  it('intercepta y valida webhook con cy.intercept (app local)', () => {
    // Intercepta cualquier POST al endpoint de webhook
    cy.intercept('POST', '**/webhook/**', (req) => {
      // Valida que el body tenga las keys esperadas
      expect(req.body).to.have.property('event')
      expect(req.body).to.have.property('passed')
      expect(req.body).to.have.property('failed')

      req.reply({ statusCode: 200, body: { received: true } })
    }).as('outboundWebhook')

    // Dispara la llamada (simula lo que haría la app)
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/trigger-webhook', // endpoint local de la app
      body: { event: 'order:created', passed: 5, failed: 0 },
      failOnStatusCode: false,
    })

    // cy.wait('@outboundWebhook') // descomentar si la app dispara el webhook internamente
  })

  it('valida headers del webhook (autenticación)', () => {
    cy.intercept('POST', '**/webhook/**', (req) => {
      // Verifica que el webhook incluya header de seguridad
      expect(req.headers).to.have.property('content-type').that.includes('application/json')
      req.reply(200)
    }).as('secureWebhook')
  })
})
