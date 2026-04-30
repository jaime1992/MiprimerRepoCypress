// Ejemplo: Test de API RESTful — CRUD de usuarios con JSONPlaceholder
const BASE_URL = 'https://jsonplaceholder.typicode.com'

describe('API RESTful — Usuarios', () => {
  let createdUserId

  it('GET /users — lista usuarios y valida estructura', () => {
    cy.request('GET', `${BASE_URL}/users`).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.be.an('array').with.length.greaterThan(0)

      const user = res.body[0]
      expect(user).to.have.all.keys('id', 'name', 'username', 'email', 'address', 'phone', 'website', 'company')
      expect(user.email).to.match(/.+@.+\..+/)
    })
  })

  it('POST /users — crea un usuario y verifica respuesta', () => {
    const newUser = {
      name: 'Jaime Quiñelen',
      username: 'jaimeq',
      email: 'jaime@qa.com',
      phone: '555-1234',
    }

    cy.request('POST', `${BASE_URL}/users`, newUser).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body.name).to.eq(newUser.name)
      expect(res.body.email).to.eq(newUser.email)
      expect(res.body).to.have.property('id')

      createdUserId = res.body.id
    })
  })

  it('PUT /users/1 — actualiza un usuario existente', () => {
    const updatedData = { name: 'Jaime Updated', email: 'updated@qa.com' }

    cy.request('PUT', `${BASE_URL}/users/1`, updatedData).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.name).to.eq(updatedData.name)
    })
  })

  it('DELETE /users/1 — elimina un usuario y verifica 200', () => {
    cy.request('DELETE', `${BASE_URL}/users/1`).then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('GET /users/999 — usuario inexistente retorna 404', () => {
    cy.request({ method: 'GET', url: `${BASE_URL}/users/999`, failOnStatusCode: false }).then((res) => {
      expect(res.status).to.eq(404)
    })
  })
})
