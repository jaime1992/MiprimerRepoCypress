# Caso de Prueba — [Nombre de la funcionalidad]

**ID:** TC-XXXX
**Módulo:** [Autenticación / API / UI / etc.]
**Autor:** Jaime Quiñelen
**Fecha:** YYYY-MM-DD
**Spec file:** `cypress/e2e/[ruta]/[nombre].cy.js`

---

## Objetivo

> Qué se está verificando en una oración.

---

## Precondiciones

- [ ] El ambiente local está corriendo en `http://localhost:3000`
- [ ] El fixture `cypress/fixtures/nombre.json` existe
- [ ] El usuario de prueba tiene rol `X`

---

## Datos de prueba

```json
{
  "email": "test@ejemplo.com",
  "password": "Password123!",
  "expectedMessage": "Bienvenido"
}
```

---

## Pasos del test

| # | Acción | Verificación |
|---|---|---|
| 1 | `cy.visit('/')` | URL cargada |
| 2 | `cy.get('[data-cy=email]').type(email)` | Campo con texto |
| 3 | `cy.get('[data-cy=submit]').click()` | — |
| 4 | — | `cy.contains('Bienvenido').should('be.visible')` |

---

## Resultado esperado

- El sistema muestra el mensaje de bienvenida
- La URL cambia a `/dashboard`
- No hay errores en la consola

---

## Resultado actual

- [ ] PASA ✅
- [ ] FALLA ❌ (ver BUG-XXXX)

---

## Código Cypress de referencia

```javascript
describe('TC-XXXX — Nombre funcionalidad', () => {
  beforeEach(() => {
    cy.fixture('nombre').as('datos')
  })

  it('debería [resultado esperado]', function () {
    cy.visit('/')
    cy.get('[data-cy=email]').type(this.datos.email)
    cy.get('[data-cy=submit]').click()
    cy.contains(this.datos.expectedMessage).should('be.visible')
  })
})
```
