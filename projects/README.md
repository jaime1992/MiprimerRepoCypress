# Proyectos / Clientes

> Esta carpeta separa configuraciones, fixtures y contexto por producto o cliente.
> Cada subcarpeta es autónoma y no interfiere con otras.

---

## Estructura por proyecto

```
projects/
├── README.md               ← Este archivo
├── proyecto-alpha/
│   ├── context.md          ← URLs, credenciales (placeholders), alcance
│   ├── fixtures/           ← JSON de datos de prueba específicos
│   └── specs-map.md        ← Qué spec files cubren este proyecto
└── proyecto-beta/
    ├── context.md
    └── specs-map.md
```

---

## Proyecto activo: Framework E2E (curso / práctica)

**Tipo:** Proyecto de aprendizaje y plantilla
**Spec files:** `cypress/e2e/Cypress-Course/`
**Fixtures:** `cypress/fixtures/`
**Contexto:** ver [../context/sprint-actual.md](../context/sprint-actual.md)

---

## Cómo agregar un proyecto nuevo

1. Crear carpeta `projects/nombre-proyecto/`
2. Copiar y completar `context.md` con URLs y alcance
3. Crear `specs-map.md` listando qué spec files cubren el proyecto
4. Si tiene datos de prueba propios, agregar subcarpeta `fixtures/`
5. Referenciarlo en `CLAUDE.md` si el agente necesita conocerlo

---

## Convención de nombres para specs por proyecto

```
cypress/e2e/
└── nombre-proyecto/
    ├── login.cy.js
    ├── checkout.cy.js
    └── smoke.cy.js
```
