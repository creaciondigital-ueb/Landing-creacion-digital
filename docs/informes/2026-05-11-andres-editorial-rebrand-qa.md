---
autor: Andrés Cano Herrera
cargo: Especialista en Testing
fecha: 2026-05-11
tema: Plan QA — Editorial Rebrand (matriz de regresiones, DoD, herramientas)
estado: revision
---

# Plan QA — Editorial Rebrand

## Mi mandato

El rebrand es visual pero **toca toda la galería**. Cualquier cambio CSS o JSX visual puede romper funcionalidades existentes accidentalmente. Mi trabajo es definir:

1. **Matriz de regresión funcional** — qué flujos tengo que validar por cada sprint
2. **Smoke tests críticos** — los 10 minutos mínimos antes de cerrar un sprint
3. **Definition of Done (DoD)** por sprint
4. **Riesgo visual vs funcional** — separar lo que es "ajuste estético" (no bloqueante) de "regresión real" (bloqueante)

## 1) Matriz de regresión funcional

### Flujos críticos a validar (todos los sprints)

| # | Flujo | Severidad si rompe | Qué valida |
|---|---|---|---|
| 1 | Visitante anónimo entra a galería pública y ve modelos | Crítico | GET /api/models, render del grid, thumbnails desde /cdn |
| 2 | Login con admin (calmeydar@unbosque.edu.co) | Crítico | POST /api/auth/login, JWT en localStorage, redirect post-login |
| 3 | Login con student (alguno migrado) | Crítico | Mismo flujo, role distinto |
| 4 | Admin abre `/admin` panel y ve lista de usuarios | Alto | GET /api/admin/users, render de tabla, botones de roles |
| 5 | Admin crea usuario nuevo desde `/admin` (Plan C, v3.2.0) | Alto | POST /api/admin/users, modal de password temporal |
| 6 | Admin sube modelo `.glb` nuevo | Crítico | UploadForm dropzone, ThumbnailCapture, POST /api/models |
| 7 | Admin sube `.mview` Showcase a un modelo existente | Alto | ShowcaseUploadForm, auto-extracción thumbnail, mview_url DB |
| 8 | Visitante abre card de modelo → ModelModal carga | Crítico | Modal aparece, viewer R3F renderiza, like/comment OK |
| 9 | Modelo con showcase: carrusel flip 3D entre `.glb` y `.mview` | Alto | ShowcaseCarousel, MarmosetViewer iframe, chip activo |
| 10 | Admin edita modelo desde card (botón edit) | Alto | EditModelForm abre, PUT /api/models/:id, refresh |
| 11 | Admin elimina modelo (botón delete) | Alto | Confirm modal, DELETE /api/models/:id, grid refresh |
| 12 | Visitante navega a `/estudiantes` y ve perfiles con hex chart | Alto | GET /api/profiles/students, HexagonChart renderiza skills |
| 13 | Student edita su perfil en `/perfil` | Alto | ProfilePage, PUT /api/profiles/:id, ArtStation/Instagram links |
| 14 | Reset password flow desde `/reset-password?token=X` | Medio | ResetPasswordPage, POST /api/auth/reset-password |
| 15 | Admin reset password de student (genera temp + modal) | Alto | TempPasswordModal con clipboard copy |
| 16 | Student con `must_change_password=true` ve modal forzado en cualquier ruta | Alto | ChangePasswordModal global montado en Layout |
| 17 | Drag-drop de modelos en admin reorder mode | Medio | SortableModelCard dnd-kit, PUT /api/models/reorder |
| 18 | Filtrar galería por categoría (chips) | Medio | Filter state, count actualizado |
| 19 | Like de modelo (visitante anónimo o logueado) | Bajo | POST /api/likes/toggle, count update |
| 20 | Comment en modelo (logueado) | Bajo | POST /api/comments, lista actualizada |

### Smoke tests por sprint (subset crítico)

| Sprint | Smoke obligatorio |
|---|---|
| 1 (foundation) | F1 (galería renderiza) + F2 (login admin) |
| 2 (landing + router) | F1 (galería en `/galeria`) + landing `/` renderiza + topbar landing navega a `/galeria` + F2 |
| 3 (galería core) | F1 + F8 (modal abre) + F18 (filtros) — paleta nueva aplicada |
| 4 (estudiantes + hex) | F12 (hex chart con cobalt) + F13 (perfil edit) |
| 5 (modales y forms) | F6 (upload .glb) + F7 (upload .mview) + F10 (edit) + F11 (delete) + F8 (modal) + F9 (carrusel) |
| 6 (admin/teacher panels) | F4 (admin panel) + F5 (crear user) + F15 (reset password) + F16 (modal forzado) |
| 7 (QA + cleanup) | TODOS los 20 flujos |

## 2) Test environment

### Setup necesario

- **Backend local**: `cd backend && node server.js` corriendo en :3000
- **Vite dev**: `npm run dev` corriendo en :5173
- **vite.config.ts**: apuntando a `localhost:3000` (NO commitear este cambio)
- **DB local**: `galeria_3d_local` con paridad de prod (sincronizado de la sesión anterior)
- **Browser**: Chrome o Firefox actualizado, DevTools abierto durante QA

### Credenciales de prueba

- **Admin local**: `calmeydar@unbosque.edu.co` / (password local de iCloud Keychain del owner)
- **QA local**: usuario `jhondoe_qa@unbosque.edu.co` (creado en sesiones anteriores)
- **Student real**: cualquiera del sync (Andrea Rozo, Samuel Parada, etc.) — pero el password local es placeholder bcrypt no-funcional → no se puede hacer login con ellos. Si necesito un student "real" funcional, reseteo password vía admin

## 3) Definition of Done por sprint

### DoD universal (TODOS los sprints)

- [ ] `npx tsc --noEmit` pasa sin errores
- [ ] `npm run build` pasa sin warnings nuevos
- [ ] Console del navegador limpio (sin errores en F12 → Console)
- [ ] Network tab: cero requests fallidos (404, 500) en flujos smoke
- [ ] Commit con mensaje descriptivo + scope
- [ ] El sprint NO rompe ningún flujo del sprint anterior (smoke regression)

### DoD específico por sprint

**Sprint 1 (Foundation)**:
- Tokens nuevos cargan en root
- Fuentes Google cargan (verificar Network tab)
- Galería sigue funcionando (paleta cambia, estructura igual)
- Sin errores TS ni console

**Sprint 2 (Landing + Router)**:
- `/` renderiza ProgramaCreacionDigital
- `/galeria` renderiza GaleriaPage con tokens nuevos
- Topbar landing tiene links que funcionan (anchors internos + link a `/galeria`)
- React Router navega sin full-page reload
- Lazy chunk de landing se carga (verificar en Network: chunk separado)
- Pre-fetch de chunk galería en idle (opcional, no bloquea DoD)

**Sprint 3 (Galería core)**:
- Topbar tiene wordmark "Galería 3D · Estudio CD4"
- Hero con estructura nueva (3 rows, tachado, italic, Rubik Bubbles)
- FilterBar funcional con contador acid
- ModelCards con imagen real + overlay categoría
- Footer editorial
- Click en card abre ModelModal (no regresión a F8)

**Sprint 4 (Students + Hex)**:
- StudentCard con avatar inicial cobalt, hexagon, bio links
- HexagonChart con colores cobalt en JSX directamente (sin override CSS)
- EstudiantesPage layout editorial

**Sprint 5 (Modales y forms)**:
- TODOS los modales abren y cierran sin freezear
- AuthModal: tabs funcionan, submit OK
- ModelModal: viewer R3F + carrusel + likes + comments OK
- UploadForm: dropzone acepta archivos, validación funcional, upload OK
- EditModelForm: cambios persisten
- ShowcaseUploadForm: sube .mview, extrae thumbnail, refresh OK
- ResetPasswordPage: token válido y inválido manejados

**Sprint 6 (Admin/Teacher panels)**:
- AdminPanel: tabla legible, todos los botones funcionan
- TeacherPanel: filtros por cohort funcionan
- UserMenu dropdown abre/cierra
- ProfilePage: skills editor funcional

**Sprint 7 (QA + cleanup)**:
- TODOS los 20 flujos validados con check-through manual
- Comité de evaluación QA con Valentina aprueba
- `_inspect_design/` eliminado de local
- Session log escrito

## 4) Riesgo visual vs funcional

### Visual (no bloqueante por sprint, ajustable en Sprint 7)

- Alineaciones ligeramente desfasadas
- Espaciados que se ven "raros" pero funcionan
- Hover transitions que tartamudean en algunos browsers
- Z-index issues que se ven raro pero no impiden click

### Funcional (bloqueante — NO se cierra sprint con esto)

- Botón no hace click (z-index issue real, no visual)
- Modal no abre o no cierra
- Form submit no envía o envía mal
- API request falla (500, CORS, etc.)
- Navegación rota
- Login no persiste
- Estado se pierde al re-render

**Regla operativa**: si encuentro algo visual durante un sprint específico, lo anoto en una lista de "ajustes Sprint 7" pero NO bloqueo el cierre del sprint. Si encuentro algo funcional, BLOQUEO y se arregla antes de commit.

## 5) Herramientas

- **Click-through manual**: principal método. No hay automation E2E en el proyecto
- **Type check**: `npx tsc --noEmit` (rápido, automated)
- **Build**: `npm run build` (detecta errores que TS no captura)
- **curl**: para validar endpoints específicos (no la UI, solo la API)
- **Network tab**: en cada flujo, verificar requests y respuestas
- **Console**: errores rojos = bloqueante. Warnings = noted en Sprint 7
- **Lighthouse** (opcional, Sprint 7): performance + accessibility scoring

### Test data necesario

- 1 modelo .glb sin showcase
- 1 modelo con showcase (.mview asociado) — `ak47` Andrea ya tiene este en local
- 1 modelo de cada categoría (personaje, vehiculo, criatura, objeto) para validar colores
- 1 student con skills set completo (radar hexagonal con datos)
- 1 student con perfil vacío (radar todos los valores en 0 — edge case)

## 6) Cronograma de QA

- **Inmediato post-commit de cada sprint**: smoke tests del sprint (10-15 min)
- **Final de cada sesión de trabajo**: regresión smoke de todos los sprints cerrados hasta el momento (20-30 min)
- **Pre-cierre de Sprint 7**: validación de 20 flujos completos (1-2 h)
- **Comité QA Valentina post-Sprint 7**: dictámenes consolidados antes de marcar feature como `implementado`

## Output del informe

**Decisiones que aporto al comité:**

1. ✅ Matriz de 20 flujos críticos
2. ✅ DoD por sprint (universal + específico)
3. ✅ Distinción visual (Sprint 7) vs funcional (bloqueante por sprint)
4. ✅ Setup mínimo: backend local + vite + DB local con paridad
5. ✅ Test data identificado (ak47 Andrea + perfiles existentes)

**Recomendación operativa al comité**: incluir el `npx tsc --noEmit` y `npm run build` como **DoD obligatorio universal**, no opcional. Sin eso, riesgo de regression en cascada.

**Bandera roja**: el ChangePasswordModal forzado se monta en `Layout.tsx`. Si Carlos (con `must_change_password=true`) entra a `/` (landing fuera de Layout), el modal **no aparecerá**. Esto podría ser un bug nuevo introducido por la separación de rutas — escalación a Sebastián para que valide. **Probable mitigación**: el modal forzado también vive en el componente landing, o el guard de `must_change_password` se mueve al nivel de Router con redirect, no a Layout. Discutir en el comité.

**Mi estimación**: Sprint 7 (QA exhaustivo + comité Valentina) = 2-3 h. Mi participación en sprints 1-6 = 15-30 min por sprint para smoke tests = ~2 h adicionales. Total: ~5 h.
