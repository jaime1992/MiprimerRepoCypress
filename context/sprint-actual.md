# Sprint Actual

> Actualizar este archivo al inicio de cada sprint.
> Al cierre, mover el contenido a `archives/sprint-history.md`.

---

## Sprint 2 — [Nombre del sprint] (2026-05)

**Objetivo principal:**
> Describir en 1-2 oraciones qué se quiere lograr este sprint.

**Fecha inicio:** 2026-05-01
**Fecha fin:** 2026-05-15

---

## Tests planificados

| Spec file | Funcionalidad | Prioridad | Estado |
|---|---|---|---|
| `Cypress-Course/api-restful.cy.js` | CRUD API REST | Alta | En progreso |
| `Cypress-Course/webhook.cy.js` | Notificaciones webhook | Alta | En progreso |
| | | | |

---

## Bloqueantes activos

> Lista de impedimentos que frenan el avance.

- [ ] _(ninguno registrado)_

---

## Definition of Done (DoD)

Un test se considera terminado cuando:
1. Pasa en headless Chrome (`npm run cy:run:chrome`)
2. Está en su carpeta correcta según convención de nombres
3. No usa `cy.wait(ms)` con tiempo fijo
4. Es independiente (no depende de orden de ejecución)
5. Tiene al menos un `cy.log()` descriptivo por flujo principal

---

## Notas del sprint

> Observaciones, cambios de alcance, decisiones rápidas.

-
