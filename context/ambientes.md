# Ambientes de Prueba

> Referencia rápida de URLs, puertos y credenciales POR AMBIENTE.
> ⚠️ NUNCA escribir contraseñas reales aquí — usar variables de entorno.

---

## Local (default)

| Parámetro | Valor |
|---|---|
| `baseUrl` | `http://localhost:3000` |
| `apiBaseUrl` | `http://localhost:3000` |
| n8n webhook | `http://localhost:5678/webhook/cypress-results` |
| Reportes Excel | `C:\QA\Reports\` |

Configurado en: [cypress.config.js](../cypress.config.js)
Credenciales en: `cypress.env.json` (no subir al repo)

---

## Staging (cuando exista)

| Parámetro | Valor |
|---|---|
| `baseUrl` | `https://staging.miapp.com` |
| `apiBaseUrl` | `https://api.staging.miapp.com` |

Cómo activar:
```bash
CYPRESS_baseUrl=https://staging.miapp.com npm run cy:run
```

---

## Producción (solo smoke tests)

| Parámetro | Valor |
|---|---|
| `baseUrl` | `https://miapp.com` |

> Solo ejecutar spec files marcados con `@smoke`. Nunca datos destructivos.

---

## Variables de entorno disponibles (cypress.env.json)

```json
{
  "SMTP_USER": "...",
  "SMTP_PASS": "...",
  "EMAIL_TO": "jaimeqv.2609@gmail.com",
  "apiBaseUrl": "http://localhost:3000"
}
```
