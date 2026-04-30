# [Nombre de la funcionalidad] — SDD

**Versión:** 1.0
**Autor:** Jaime Quiñelen
**Fecha:** YYYY-MM-DD
**Estado:** Borrador | En revisión | Aprobado

---

## 1. Descripción general

> Qué hace esta funcionalidad. Máximo 3 oraciones.

---

## 2. Alcance

**Incluido:**
- [ ] Flujo principal (happy path)
- [ ] Validaciones de campo
- [ ] Mensajes de error

**Excluido:**
- [ ] _(lo que NO se va a probar en este ciclo)_

---

## 3. Prerrequisitos

| Prerrequisito | Detalle |
|---|---|
| Usuario | Debe existir en el sistema con rol `X` |
| Datos | Fixture: `cypress/fixtures/nombre.json` |
| Ambiente | Local / Staging |

---

## 4. Flujo de usuario principal

```
1. Usuario navega a [URL]
2. Ingresa [acción]
3. Sistema responde con [resultado esperado]
4. Usuario confirma [acción]
5. Sistema muestra [mensaje de éxito]
```

---

## 5. Casos de prueba

| ID | Descripción | Datos de entrada | Resultado esperado | Prioridad |
|---|---|---|---|---|
| TC-001 | Login exitoso | email válido + pass válido | Redirige a dashboard | Alta |
| TC-002 | Login fallido | email inválido | Mensaje de error visible | Alta |
| TC-003 | Campo vacío | email vacío | Validación inline | Media |

---

## 6. Criterios de aceptación

```gherkin
Given [contexto inicial]
When [acción del usuario]
Then [resultado observable]
```

---

## 7. Spec file asociado

```
cypress/e2e/[carpeta]/[nombre].cy.js
```

---

## 8. Notas / restricciones

- _(limitaciones conocidas, dependencias externas, etc.)_
