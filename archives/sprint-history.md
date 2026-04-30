# Sprint History — Cypress E2E Framework

> Archivo de consulta: sprints cerrados y entregables pasados.
> Los sprints activos viven en `context/sprint-actual.md`.

---

## Sprint 0 — Setup inicial (2026-04)

**Objetivo:** Levantar el framework desde cero.

**Entregables:**
- Cypress 15.x instalado con `cypress.config.js` base
- Reporter Mochawesome configurado (JSON → HTML)
- Integración Excel con `xlsx` (`C:\QA\Reports\`)
- Notificación email via Gmail SMTP (nodemailer)
- Webhook n8n en `localhost:5678`
- `.gitignore` con credenciales excluidas

**Decisiones clave tomadas:**
- JavaScript puro, sin TypeScript (ver `decision/ADR-001-page-objects.md`)
- Credenciales en `cypress.env.json`, nunca en el config principal
- Hook `after:run` extraído a `cypress/plugins/afterRun.js`

**Estado:** CERRADO ✓

---

## Sprint 1 — Mejoras de arquitectura (2026-04)

**Objetivo:** Refactorizar hacia patrones mantenibles.

**Entregables:**
- Page Objects: `LoginPage.js`, `DashboardPage.js`
- `commands.js` poblado con 10 comandos custom reutilizables
- `baseUrl` global en `cypress.config.js`
- `cypress.config.js` reducido de 158 a 26 líneas
- Estructura de carpetas documentada en `CLAUDE.md`

**Estado:** CERRADO ✓

---

<!-- Copiar bloque para nuevo sprint:

## Sprint N — Nombre (YYYY-MM)

**Objetivo:**

**Entregables:**
-

**Decisiones clave:**
-

**Estado:** EN CURSO | CERRADO ✓

-->
