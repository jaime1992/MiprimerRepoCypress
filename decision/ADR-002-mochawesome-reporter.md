# ADR-002 — Reporter: Mochawesome

**Fecha:** 2026-04
**Estado:** Aceptado
**Autor:** Jaime Quiñelen

---

## Contexto

Necesitábamos un reporte HTML legible para stakeholders no técnicos, que además pudiera adjuntarse por email.

## Decisión

Usar `mochawesome` + `mochawesome-merge` + `mochawesome-report-generator`.

Flujo:
1. Cypress genera JSON por spec en `cypress/reports/`
2. `mochawesome-merge` combina todos en un JSON único
3. `mochawesome-report-generator` genera el HTML final
4. `afterRun.js` adjunta el HTML + Excel en el email

## Consecuencias positivas

- HTML con screenshots incrustados
- Fácil de leer sin conocimiento técnico
- Compatible con CI (archivo estático, sin servidor)

## Consecuencias negativas

- Requiere paso de merge post-run (no es automático)
- El HTML puede pesar varios MB si hay muchas screenshots

## Alternativas descartadas

- Allure: más potente pero requiere servidor Java y más configuración
- Cypress Cloud Dashboard: de pago, requiere projectId activo con plan premium

## Script relacionado

```bash
npm run cy:report   # Ejecuta merge + genera HTML + email + n8n
```
