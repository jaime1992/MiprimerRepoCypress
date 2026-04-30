# cypres-e2e-framework

Proyecto de automatización E2E con Cypress — autor: Jaime Quiñelen.

## Prompt Maestro — Sistema de contexto del agente

Antes de cualquier tarea, leer en este orden:

| Carpeta | Qué contiene | Cuándo leer |
|---|---|---|
| `context/sprint-actual.md` | Sprint vigente, objetivos, bloqueantes | Siempre |
| `context/ambientes.md` | URLs, puertos, variables de entorno | Al configurar o ejecutar tests |
| `context/requerimientos.md` | Cobertura de requerimientos | Al crear tests nuevos |
| `decision/` | ADRs — por qué se tomaron decisiones clave | Antes de proponer cambios arquitectónicos |
| `archives/` | Historia de sprints y decisiones descartadas | Al investigar contexto pasado |
| `projects/` | Separación por producto o cliente | Al trabajar en un proyecto específico |
| `references/docs-externas.md` | Links a documentación oficial | Al buscar APIs o configuración |
| `templates/` | SDD, bug report, caso de prueba, reporte semanal | Al generar documentación |

### Flujo de trabajo del agente

```
Nueva tarea recibida
  → leer context/sprint-actual.md
  → leer context/ambientes.md (si hay ejecución de tests)
  → leer decision/ (si hay propuesta de cambio estructural)
  → ejecutar tarea
  → actualizar context/requerimientos.md si se agregaron tests
  → si decisión importante: crear decision/ADR-XXX-nombre.md
```

---

## Stack

- **Cypress** 15.x + **JavaScript** (sin TypeScript)
- **Node.js** 18+
- **Reporters:** Mochawesome (JSON → HTML)
- **Extras:** xlsx (reportes Excel), nodemailer (envío de email), n8n (notificaciones webhook)

## Comandos disponibles

```bash
# Abrir Cypress en modo interactivo (UI)
npm run cypress:open

# Ejecutar todos los tests en modo headless
npm run cy:run

# Ejecutar en Chrome
npm run cy:run:chrome

# Ejecutar con navegador visible
npm run cy:run:headed

# Ejecutar en Firefox
npm run cy:run:firefox

# Generar reporte Mochawesome + enviar email + notificar n8n
npm run cy:report

# Ejecutar un spec específico (ejemplo)
npx cypress run --spec "cypress/e2e/Cypress-Course/retry.ability/retry.ability.cy.js"
```

## Estructura del proyecto

```
cypres-e2e-framework/
├── cypress/
│   ├── e2e/
│   │   ├── 1-getting-started/        # Tests básicos de ejemplo
│   │   ├── 2-advanced-examples/      # Features avanzadas de Cypress
│   │   ├── Cypress-Course/           # Tests del curso / prácticas
│   │   │   ├── retry.ability/        # Tests de retry, hooks, estructura
│   │   │   ├── downloads.cy.js
│   │   │   ├── fixtures.spec.cy.js
│   │   │   └── ...
│   │   └── locators/                 # Estrategias de selectores
│   ├── fixtures/
│   │   ├── example.json
│   │   ├── profile.json
│   │   └── fixtures-demo/
│   │       └── sauceCredentials.json
│   ├── support/
│   │   ├── commands.js               # Comandos custom globales (vacío — pendiente poblar)
│   │   └── e2e.js                    # Entry point de soporte, importa commands.js
│   └── downloads/                    # Archivos descargados durante tests
├── cypress.config.js                 # Configuración principal de Cypress
├── run-and-report.js                 # Script de reporte manual
├── open-cypress.bat                  # Atajo Windows para abrir Cypress
├── package.json
└── CLAUDE.md
```

## Configuración (cypress.config.js)

- **projectId:** `k93ovz`
- **specPattern:** `cypress/e2e/**/*.cy.js`
- **supportFile:** `cypress/support/e2e.js`
- **downloadsFolder:** `cypress/downloads`
- **video:** habilitado
- **apiBaseUrl (env):** `http://localhost:3000`
- **after:run hook:** genera Excel en `C:\QA\Reports\`, envía email y notifica n8n en `localhost:5678`

## Integraciones activas

| Sistema | Detalle |
|---|---|
| **Email (Gmail SMTP)** | Envía reporte HTML + Excel adjunto tras cada run |
| **n8n** | Webhook en `http://localhost:5678/webhook/cypress-results` |
| **Excel** | Reporte por spec guardado en `C:\QA\Reports\cypress_report_FECHA.xlsx` |

## Convenciones del proyecto

- Archivos de test: `nombre-descriptivo.cy.js` — siempre con extensión `.cy.js`
- Fixtures en `cypress/fixtures/` — formato JSON
- Comandos custom en `cypress/support/commands.js`
- No usar `cy.wait(ms)` con tiempo fijo — preferir `cy.intercept()` + aliases
- Variables de entorno van en `cypress.config.js` bajo `env:`, no en `.env` sueltos
- Los tests deben ser independientes entre sí (no depender de orden de ejecución)

## Convenciones de nombres para nuevos tests

```
cypress/e2e/
├── Cypress-Course/nombre-funcionalidad.cy.js   # Tests del curso / práctica
├── locators/nombre-pagina.cy.js                # Tests de estrategias de selectores
└── [nueva-carpeta]/nombre-flujo.cy.js          # Tests nuevos van en su propia carpeta
```

---

## Mejoras implementadas

### 1. commands.js — comandos reutilizables disponibles
`cypress/support/commands.js` tiene los siguientes comandos listos para usar:

| Comando | Uso |
|---|---|
| `cy.login(email, pass)` | Login via UI |
| `cy.loginApi(email, pass)` | Login via API (más rápido, sin UI) |
| `cy.logout()` | Limpia cookies y localStorage |
| `cy.interceptApi(method, url, alias)` | Intercept con alias |
| `cy.fillForm({ selector: value })` | Llenar formulario completo |
| `cy.shouldShowToast(message)` | Verificar mensaje de éxito/error |
| `cy.dragTo(targetSelector)` | Drag and drop |
| `cy.scrollToElement(selector)` | Scroll hasta elemento |
| `cy.tableRowCount(table, n)` | Verificar filas de tabla |
| `cy.verifyDownload(filename)` | Verificar archivo descargado |

### 2. Credenciales en cypress.env.json (fuera del config)
`cypress.env.json` contiene SMTP_USER, SMTP_PASS, EMAIL_TO y apiBaseUrl.
El archivo está en `.gitignore` — nunca se sube al repositorio.
`afterRun.js` lee las credenciales desde `process.env` o valores por defecto.

### 3. baseUrl global configurado
`cypress.config.js` tiene `baseUrl: 'http://localhost:3000'`.
Usar `cy.visit('/')` en lugar de `cy.visit('http://localhost:3000/')`.

### 4. .gitignore actualizado
`cypress.env.json` agregado al `.gitignore` existente.

### 5. Page Objects creados
```
cypress/pages/
├── LoginPage.js     — visit(), login(), shouldShowError()
└── DashboardPage.js — visit(), shouldBeVisible(), logout(), navigateTo()
```
Uso en tests:
```javascript
const LoginPage = require('../../pages/LoginPage')
LoginPage.visit()
LoginPage.login('user@email.com', 'pass')
```

### 6. Hook after:run extraído
`cypress.config.js` pasó de 158 líneas a 26 líneas.
La lógica completa (Excel + Email + n8n) vive en `cypress/plugins/afterRun.js`.

---

## Skills de Claude Code disponibles

Skills creadas en las últimas 3 semanas para este proyecto QA:

| Skill | Comando | Para qué sirve |
|---|---|---|
| **qa-cv-builder** | `/qa-cv-builder` | Genera CVs profesionales para roles QA (Engineer, Lead, Analyst, SDET) con formato ATS |
| **sdd-methodology** | `/sdd-methodology` | Convierte casos de prueba, historias de usuario o bugs a formato SDD con opción de generar PDF |
| **WeekReportQA** | `/WeekReportQA` | Consolida múltiples casos de prueba o SDDs en un reporte semanal de avance QA |
| **workflow-n8n-qa** | `/workflow-n8n-qa` | Diseña y documenta workflows n8n para QA: reportes automáticos, gestión de bugs, pipelines de prueba |
| **skill-creator** | `/skill-creator` | Crea nuevas skills, mejora skills existentes y mide su rendimiento con evals |
| **n8n-code-javascript** | `/n8n-code-javascript` | Escribe código JavaScript en nodos Code de n8n: `$input`, `$json`, `$node`, HTTP requests, DateTime |
| **n8n-code-python** | `/n8n-code-python` | Escribe código Python en nodos Code de n8n (usar solo si se prefiere Python explícitamente) |
| **n8n-expression-syntax** | `/n8n-expression-syntax` | Valida y corrige expresiones `{{}}` de n8n, acceso a `$json/$node`, mapeo entre nodos |
| **n8n-mcp-tools-expert** | `/n8n-mcp-tools-expert` | Guía para usar las herramientas n8n-mcp: búsqueda de nodos, templates, credenciales, auditoría |
| **n8n-node-configuration** | `/n8n-node-configuration` | Configura nodos n8n correctamente: campos requeridos por operación, `displayOptions`, `patchNodeField` |
| **n8n-validation-expert** | `/n8n-validation-expert` | Interpreta errores de validación de workflows n8n y guía para corregirlos |
| **n8n-workflow-patterns** | `/n8n-workflow-patterns` | Patrones arquitectónicos probados para webhooks, APIs, bases de datos, AI agents, batch processing |
| **whatsapp-automation** | `/whatsapp-automation` | Automatización WhatsApp Business: soporte al cliente, notificaciones, chatbots, mensajes masivos |

### Cuándo usar cada skill

- **Documentación de casos de prueba** → `/sdd-methodology`
- **Reporte de fin de sprint** → `/WeekReportQA`
- **Automatizar proceso QA en n8n** → `/workflow-n8n-qa`
- **Crear nueva skill personalizada** → `/skill-creator`
- **Preparar CV para postulación QA** → `/qa-cv-builder`
- **Código JavaScript en nodo Code n8n** → `/n8n-code-javascript`
- **Expresiones `{{}}` con errores en n8n** → `/n8n-expression-syntax`
- **Diseñar arquitectura de workflow n8n** → `/n8n-workflow-patterns`
- **Configurar nodo n8n con campos correctos** → `/n8n-node-configuration`
- **Errores de validación en workflow n8n** → `/n8n-validation-expert`
- **Usar herramientas MCP de n8n** → `/n8n-mcp-tools-expert`
- **Notificaciones o chatbot por WhatsApp** → `/whatsapp-automation`

---

## Requisito operacional — n8n + email-server

> **Error frecuente:** `The service refused the connection - perhaps it is offline`
> Causa: el `email-server.js` no está corriendo cuando n8n intenta enviar el email.

Todos los workflows que envían Gmail (WF-1.1, WF-1.2, WF-1.3, WF-1.4) dependen de **dos procesos** que deben estar activos al mismo tiempo:

```bash
# Terminal 1 — levantar n8n
n8n start

# Terminal 2 — levantar el servidor de email (desde la raíz del proyecto)
cd C:\Automation\cypress\asistente-cypres-e2e-framework
node email-server.js
```

| Proceso | Puerto | Qué hace |
|---|---|---|
| `n8n start` | `5678` | Orquestador de workflows |
| `node email-server.js` | `3025` | Genera Excel/HTML y envía Gmail vía SMTP |

**Regla:** si un nodo de tipo `Enviar Gmail` falla con "refused connection", lo primero es verificar que `email-server.js` esté corriendo en `localhost:3025` antes de revisar credenciales o configuración del nodo.

---

## Workflows n8n — Estado actual

| WF | Nombre | Estado | Repos |
|---|---|---|---|
| WF-1.1 | Cypress Regression → Gmail | ✅ Activo | MiprimerRepoCypress |
| WF-1.2 | Jira Bugs → Excel → Gmail | ✅ Activo | MiprimerRepoCypress |
| WF-1.3 | Jira Tasks → Gmail + WhatsApp | ✅ Activo | MiprimerRepoCypress |
| WF-1.4 | Estatus Diarios QA (6pm) | ✅ Activo | MiprimerRepoCypress + n8n_backup |
| WF-1.5 | Validar Ambientes QA (Health Check) | ✅ Activo | MiprimerRepoCypress + n8n_backup |
| WF-1.6 | Jira Task/Story → SDD PDF + Teams + Gmail | 🔄 En planificación | — |

### WF-1.6 — Decisiones pendientes antes de construir

1. **Teams webhook URL** — crear Incoming Webhook en el canal Teams:
   `Canal → ... → Connectors → Incoming Webhook → Configure → copiar URL`
2. **Deduplicación** — ¿archivo JSON local o JQL `created >= -5m`?
3. **Switch prioridad** — Critical/High → Gmail + Teams + WhatsApp / Medium/Low → solo Gmail?

### WF-1.6 — Ya confirmado

- SDD generado con las 9 secciones del PDF "Modelo Generico - Metodologia SDD QA"
- Secciones sin datos de Jira → `[Por completar]`
- PDF guardado en `C:\QA\Reports\SDD-{KEY}-{titulo}-{fecha}.pdf` via `pdfkit`
- Sticky note del WF incluirá SDD del propio workflow
- Skills a usar: `/workflow-n8n-qa`, `/sdd-methodology`, `/n8n-code-javascript`
