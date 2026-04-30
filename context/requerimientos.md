# Requerimientos de Automatización

> Estado de cobertura de requerimientos funcionales.
> Actualizar cuando se agreguen o completen tests.

---

## Leyenda

| Símbolo | Significado |
|---|---|
| ✅ | Automatizado y pasando |
| 🔄 | En progreso |
| ❌ | Sin automatizar |
| ⏸️ | Bloqueado / descartado |

---

## Módulo: Autenticación

| ID | Requerimiento | Spec file | Estado |
|---|---|---|---|
| AUTH-01 | Login exitoso con credenciales válidas | `Cypress-Course/` | ❌ |
| AUTH-02 | Error visible con credenciales inválidas | `Cypress-Course/` | ❌ |
| AUTH-03 | Logout limpia sesión correctamente | `Cypress-Course/` | ❌ |

---

## Módulo: API REST

| ID | Requerimiento | Spec file | Estado |
|---|---|---|---|
| API-01 | GET lista de recursos | `Cypress-Course/api-restful.cy.js` | 🔄 |
| API-02 | POST crea recurso nuevo | `Cypress-Course/api-restful.cy.js` | 🔄 |
| API-03 | PUT actualiza recurso | `Cypress-Course/api-restful.cy.js` | 🔄 |
| API-04 | DELETE elimina recurso | `Cypress-Course/api-restful.cy.js` | 🔄 |

---

## Módulo: Webhook / Notificaciones

| ID | Requerimiento | Spec file | Estado |
|---|---|---|---|
| WH-01 | Webhook dispara al completar run | `Cypress-Course/webhook.cy.js` | 🔄 |
| WH-02 | Email enviado con reporte adjunto | `cypress/plugins/afterRun.js` | ✅ |

---

## Cobertura global

**Automatizados:** 1 / 9 (11%)
**En progreso:** 5 / 9 (56%)
**Sin automatizar:** 3 / 9 (33%)
