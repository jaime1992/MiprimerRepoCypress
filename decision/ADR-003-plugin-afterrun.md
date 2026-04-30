# ADR-003 — Extracción del hook after:run a plugin separado

**Fecha:** 2026-04
**Estado:** Aceptado
**Autor:** Jaime Quiñelen

---

## Contexto

El `cypress.config.js` original tenía 158 líneas porque incluía toda la lógica de:
- Generación de Excel
- Envío de email via SMTP
- Llamada al webhook de n8n

Esto hacía el config difícil de leer y testear.

## Decisión

Extraer toda la lógica del hook `after:run` a `cypress/plugins/afterRun.js`.

`cypress.config.js` ahora solo hace:
```javascript
const { afterRunHook } = require('./cypress/plugins/afterRun')
// ...
on('after:run', afterRunHook)
```

## Consecuencias positivas

- `cypress.config.js` bajó de 158 a 26 líneas
- `afterRun.js` es un módulo Node.js testeable de forma aislada
- Separación clara de responsabilidades (config vs lógica de negocio)

## Consecuencias negativas

- Un archivo más en `cypress/plugins/`
- Hay que saber buscar la lógica en dos archivos al debuggear

## Archivos relacionados

- [cypress/plugins/afterRun.js](../cypress/plugins/afterRun.js)
- [cypress.config.js](../cypress.config.js)
