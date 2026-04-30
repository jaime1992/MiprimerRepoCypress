# ADR-001 — Patrón Page Object Model (POM)

**Fecha:** 2026-04
**Estado:** Aceptado
**Autor:** Jaime Quiñelen

---

## Contexto

Los tests de UI estaban copiando selectores directamente en cada `it()`. Cualquier cambio en el DOM requería actualizar múltiples archivos.

## Decisión

Adoptar Page Object Model con clases JavaScript simples en `cypress/pages/`.

Cada Page Object expone métodos de acción, no selectores directos:
```javascript
LoginPage.visit()
LoginPage.login(email, pass)
LoginPage.shouldShowError()
```

## Consecuencias positivas

- Selectores centralizados: un cambio en el DOM = un solo lugar a editar
- Tests más legibles (lenguaje de negocio, no CSS/XPath)
- Reutilización real entre spec files

## Consecuencias negativas

- Un archivo extra por página (overhead pequeño)
- Requiere disciplina del equipo para no escribir selectores inline

## Alternativas descartadas

- Funciones helper sueltas: sin estructura, difícil de encontrar
- Custom commands para cada página: sobrecarga `commands.js`

## Archivos relacionados

- [cypress/pages/LoginPage.js](../cypress/pages/LoginPage.js)
- [cypress/pages/DashboardPage.js](../cypress/pages/DashboardPage.js)
