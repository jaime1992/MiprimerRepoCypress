# Decisiones Descartadas

> Por qué NO se tomaron ciertos caminos. Útil para no repetir debates.

---

## TypeScript — Descartado

**Propuesta:** Migrar los tests a TypeScript para tipado estático.

**Por qué se descartó:**
- El equipo actual trabaja cómodo en JavaScript
- Cypress funciona perfectamente sin TS en proyectos de este tamaño
- El overhead de configurar `tsconfig.json` + tipos no justifica el beneficio ahora

**Cuándo revisarlo:** Si el proyecto supera 50 spec files o si se incorpora un dev de TypeScript.

---

## Cucumber / Gherkin — Descartado

**Propuesta:** BDD con `cypress-cucumber-preprocessor`.

**Por qué se descartó:**
- Agrega complejidad de configuración (Webpack/Babel)
- Los stakeholders actuales no leen Gherkin directamente
- Mochawesome HTML ya provee reportes legibles para no-técnicos

**Cuándo revisarlo:** Si PO/negocio pide escribir escenarios en lenguaje natural.

---

## `.env` para credenciales — Descartado

**Propuesta:** Usar archivos `.env` con `dotenv`.

**Por qué se descartó:**
- Cypress tiene su propio sistema de env vars (`cypress.env.json`)
- Mezclar dos sistemas crea confusión sobre cuál tiene precedencia
- `cypress.env.json` ya está en `.gitignore` por default

---
