---
autor: Claude Renard
cargo: Líder de Desarrollo / Tech Lead
fecha: 2026-05-11
tema: Plan final acordado — Editorial Rebrand v3.4.0
estado: aprobado_pendiente_inicio
branch: feature/editorial-rebrand
acta_referencia: docs/informes/2026-05-11-acta-comite-editorial-rebrand.md
---

# Plan v3.4.0 — Editorial Rebrand

> **Este es el plan ejecutable acordado por el comité de expertos.** Reemplaza el borrador inicial que escribí solo como TL antes de que la mesa hiciera su análisis. Para el detalle de cada decisión, ver el acta del comité y los 5 informes individuales en `docs/informes/`.

**Estado**: aprobado por el comité, pendiente de **OK explícito de Carlos al Sprint 1** para iniciar implementación.
**Branch**: `feature/editorial-rebrand` (creada, vacía de cambios).
**Tiempo total estimado**: **15-21h** distribuibles en 2-3 sesiones.

## Resumen ejecutivo

Aplicar un design system editorial (paper / ink / cobalt / acid / magenta / tomato / mint) a dos productos web que conviven en el codebase:

1. **Nueva landing del Programa Creación Digital** (`/`) — paraguas público de la carrera, estilo Buck.co × manifiesto.
2. **Re-skin completo de la galería existente** (`/galeria`) — adopta el mismo lenguaje editorial conservando 100% la funcionalidad.

**Backend intocable** (directriz Carlos). Frontend reprogramado para consumir los mismos endpoints. Trabajo en branch local, sin push hasta cerrar Sprint 7.

## Equipo

| Especialista | Rol |
|---|---|
| Claude Renard (Tech Lead) | Coordino, commits, sesión log, comité |
| Isabella Moreno Ríos (Frontend 3D) | ⭐ Protagonista visual — Decálogo, mapeo componentes, ajustes |
| Sebastián Torres Mejía (Senior Dev) | Implementación JSX/CSS, type-safety |
| Natalia Vargas Ospina (Arquitecta) | Rutas, Layout strategy, code-splitting |
| Andrés Cano Herrera (Testing) | Smoke QA por sprint, DoD universal |
| Valentina Soto Parra (QA Lead) | Comité QA al cierre del Sprint 7 |

## Decisiones cerradas (resumen de las 16 resoluciones del comité)

| Tema | Decisión |
|---|---|
| Alcance | **B continuous** (landing + reskin galería en una línea de trabajo) |
| Layout strategy | **2 Layouts distintos** — landing fuera del `<Route element={<Layout/>}>` |
| Blanco frío | **`--bg: #f6f8fb`** + `--surface: #ffffff` |
| Code-splitting | `React.lazy` para landing + pre-fetch idle del chunk galería |
| Fuentes | **Google Fonts CDN** (`@import` en línea 1 de `global.css`) |
| Estrategia CSS | **Reescritura por secciones**, no archivo completo — orden definido en sprints |
| Overlay categoría | `mix-blend-mode: multiply, opacity 0.08` + vignette inferior |
| Componentes sin guía | **Decálogo Isabella** (10 reglas, ver informe Isabella sección 3) |
| Bandera roja modal forzado | Copia defensiva en `ProgramaCreacionDigital.tsx` |
| Anchors landing | Helper `<AnchorLink>` con `scrollIntoView({behavior:'smooth'})` |
| HexagonChart | **Colores cobalt en JSX directo**, no override CSS |
| DoD universal | tsc + build + console clean + 0 network errors + commit + 0 regression |
| Matriz QA | **20 flujos críticos** (ver informe Andrés sección 1) |
| Sin push | Branch local hasta Sprint 7 cerrado |

Detalle completo de cada decisión: `docs/informes/2026-05-11-acta-comite-editorial-rebrand.md`.

## Sprints (Scrumban WIP:1, OK explícito por sprint)

### Sprint 1 — Foundation (tokens + fuentes)

**Owner**: Sebastián + Isabella · **Tiempo**: 30-40 min · **Riesgo**: bajo

**Alcance:**
- Reescribir SOLO el bloque `:root { ... }` y `body` reset de `src/styles/global.css`
- Mapeo de tokens (mantener nombres, cambiar valores):
  ```css
  :root {
    /* Surfaces */
    --bg:        #f6f8fb;  /* blanco frío decisión R3 */
    --surface:   #ffffff;  /* card surface */
    --surface2:  #ffffff;
    --border:    #0d0d0d;
    --border-soft: rgba(13,13,13,0.18);

    /* Tinta */
    --text:    #0d0d0d;
    --muted:   #5a5550;
    --muted-warm: #2a2722;

    /* Acentos */
    --accent:  #1a3cff;  /* cobalt — era cyan */
    --accent2: #ff5a2c;  /* tomato — era naranja */
    --purple:  #ff3d8a;  /* magenta */
    --magenta: #ff3d8a;
    --acid:    #d6ff3a;
    --green:   #1a3cff;  /* mapeado a cobalt */

    /* Categorías */
    --cat-personaje: #ff5a2c;
    --cat-vehiculo:  #1a3cff;
    --cat-criatura:  #ff3d8a;
    --cat-objeto:    #d6ff3a;

    /* Roles */
    --role-admin:   #ff5a2c;
    --role-teacher: #ff3d8a;
    --role-student: #1a3cff;

    /* Tipografía */
    --font-display: 'DM Serif Text', 'Times New Roman', serif;
    --font-display-fun: 'Rubik Bubbles', 'DM Serif Text', serif;
    --font-body:    'Zalando Sans', system-ui, -apple-system, sans-serif;
    --font-mono:    'JetBrains Mono', ui-monospace, monospace;

    /* ... resto de tokens (escala, radios, sombras editorial) según informe Isabella */
  }
  ```
- `@import` Google Fonts en línea 1 absoluta de `global.css`
- Body reset mínimo (font-family `--font-body`, background `--bg`, color `--text`)
- **NO se tocan los selectores de componentes** (siguen viejos hasta sus respectivos sprints)

**Archivos:**
- `src/styles/global.css` (modificar tokens iniciales + body)

**DoD adicional:**
- Galería en `localhost:5173/` carga (smoke F1)
- Login admin funciona (smoke F2)
- La galería se va a ver "rara" (paleta nueva sobre estructura vieja) — **esperado**

### Sprint 2 — Landing PCD + Router 2-Layouts + lazy + anchors + modal forzado

**Owner**: Sebastián + Natalia · **Tiempo**: 3-4 h · **Riesgo**: medio

**Alcance:**
- Nuevo componente `src/pages/ProgramaCreacionDigital.tsx` portando JSX del design (~600 líneas)
- Nuevo `src/styles/programa.css` (~870 líneas, clases `.pcd-*`)
- `App.tsx`: nuevo router con dos layouts (ver acta R2):
  ```tsx
  const ProgramaCreacionDigital = React.lazy(() => import('./pages/ProgramaCreacionDigital'));
  <Routes>
    <Route path="/" element={
      <Suspense fallback={<PCDLoadingSkeleton/>}><ProgramaCreacionDigital/></Suspense>
    } />
    <Route element={<Layout/>}>
      <Route path="/galeria" element={<GaleriaPage/>} />
      <Route path="/estudiantes" element={<EstudiantesPage/>} />
      <Route path="/perfil" element={<ProfilePage/>} />
      <Route path="/admin" element={<AdminPanel/>} />
      <Route path="/teacher" element={<TeacherPanel/>} />
      <Route path="/reset-password" element={<ResetPasswordPage/>} />
    </Route>
  </Routes>
  ```
- `Layout.tsx`: NavLinks `to="/"` → `to="/galeria"`, topbar-brand `to="/galeria"`
- Helper `<AnchorLink>` en `ProgramaCreacionDigital.tsx` para anchors smooth scroll (R10)
- Pre-fetch del chunk de GaleriaPage en idle (R4)
- Bandera roja R9: agregar `onAuthStateChange` + `<ChangePasswordModal>` también en `ProgramaCreacionDigital.tsx`
- Portar SVGs inline (camelCase: `strokeWidth` no `stroke-width`)
- `<a href="../ui_kits/galeria/index.html">` del design → `<Link to="/galeria">`

**Archivos:**
- `src/pages/ProgramaCreacionDigital.tsx` (nuevo)
- `src/styles/programa.css` (nuevo)
- `src/App.tsx` (modificar)
- `src/layouts/Layout.tsx` (modificar NavLinks)

**DoD adicional:**
- `/` renderiza landing en chunk separado (verificar Network: chunk distinto)
- `/galeria` carga GaleriaPage con paleta nueva
- Anchors landing scrollean smooth sin recargar
- Modal forzado funciona también si admin entra a `/` con flag=true

### Sprint 3 — Re-skin galería core

**Owner**: Isabella + Sebastián · **Tiempo**: 4-5 h · **Riesgo**: medio

**Alcance:**
- Reescribir secciones de `global.css`: Topbar, Hero, FilterBar, ModelGrid, ModelCard, Footer
- **Topbar** (`Layout.tsx`): glyph cobalt, wordmark "Galería 3D · Estudio CD4" (sufijo via CSS `::after`)
- **Hero** (`Gallery.tsx`): JSX completamente nuevo con estructura 3-row del kit (Galería italic + Vol. 2026, de + tachado "objetos" + modelos italic, 3D en Rubik Bubbles cobalt)
- **FilterBar**: chips mono editorial, `.filter-counter` pill acid
- **ModelGrid + ModelCard**: estructura del kit + overlay multiply 0.08 + vignette (R7); `style={{'--cat-color': accent}}` inline en thumb
- **Footer**: tag editorial "GLB · PBR · WebXR" pill acid

**Archivos:**
- `src/layouts/Layout.tsx`
- `src/components/Gallery.tsx`
- `src/components/ModelCard.tsx`
- `src/components/SortableModelCard.tsx` (props passthrough)
- `src/styles/global.css` (secciones reescritas)

**DoD adicional:**
- Imagen real preservada en thumbnails
- Overlay categoría visible pero sutil (probar las 4 categorías; si acid sale lavado, fallback `mix-blend-mode: overlay` solo en `objeto`)
- Hero legible en mobile (375px) sin overflow horizontal

### Sprint 4 — Students + HexagonChart + EstudiantesPage

**Owner**: Isabella + Sebastián · **Tiempo**: 1-2 h · **Riesgo**: bajo

**Alcance:**
- **StudentCard** (`StudentCard.tsx`): avatar inicial cobalt, hex centrado, bio card noir con bio-links (estructura del kit)
- **HexagonChart** (`HexagonChart.tsx`): cambiar 4 valores hardcoded del JSX:
  - `rgba(0,255,136,0.15)` → `rgba(26,60,255,0.16)`
  - `#00ff88` (stroke) → `#1a3cff`
  - `#00ff88` (circle fill) → `#1a3cff`
  - `#1e2535` rings → `var(--border-soft)` via stroke
- **EstudiantesPage** (`EstudiantesPage.tsx`): header editorial con eyebrow + título display

**Archivos:** los 3 + secciones CSS

### Sprint 5 — Modales y formularios (aplicando Decálogo Isabella)

**Owner**: Sebastián · **Tiempo**: 3-4 h · **Riesgo**: medio (mucho componente sin guía)

**Alcance:**
- `AuthModal.tsx` — drop-in del kit (clases `.modal-overlay`, `.auth-*`)
- `ModelModal.tsx` — re-skin con Decálogo, conservar lógica likes/comments/R3F/Suspense
- `ShowcaseCarousel.tsx` — chip activo de cyan → cobalt; flip 3D intacto
- `MarmosetViewer.tsx` — wrap con border hairline, fondo `var(--surface)`
- `UploadForm.tsx` — dropzone editorial, NO tocar Canvas R3F embebido
- `EditModelForm.tsx` — patrón `.auth-*` sin dropzone
- `ShowcaseUploadForm.tsx` — patrón UploadForm con .mview
- `ChangePasswordModal.tsx` — drop-in + banner acid si es cambio forzado
- `TempPasswordModal.tsx` — pill copy editorial
- `ResetPasswordPage.tsx` — page standalone (NO usa Layout), centered

**Archivos:** los 10 componentes + secciones CSS

### Sprint 6 — Admin/Teacher + UserMenu + Profile

**Owner**: Sebastián · **Tiempo**: 2-3 h · **Riesgo**: bajo

**Alcance:**
- `AdminPanel.tsx` — secciones con border hairline, tabla con divisores `border-soft`, pills mono
- `TeacherPanel.tsx` — variante simplificada
- `UserMenu.tsx` — dropdown editorial
- `ProfilePage.tsx` — 2 columnas (perfil + skills editor con sliders)

### Sprint 7 — QA exhaustivo + comité + cleanup

**Owner**: Andrés + Valentina + Claude · **Tiempo**: 2-3 h

**Alcance:**
- Validar los 20 flujos críticos completos (informe Andrés)
- Comité de evaluación QA con Valentina
- Eliminar `_inspect_design/` del disco local (no commiteado, solo limpieza)
- Verificar `.gitignore` cubre `_inspect_design/` por defensa
- Session log `docs/session-logs/YYYY-MM-DD.md`
- Plan estado → `implementado`

**Output del Sprint 7:**
- Branch `feature/editorial-rebrand` con 7 commits limpios
- Plan `aprobado_pendiente_inicio` → `implementado`
- TODO el QA verde
- **Recién entonces** Carlos decide si push + merge develop + merge main + tag v3.4.0 (sesión aparte, NO parte de este plan)

## Definition of Done universal (TODOS los sprints) — R13

1. ✅ `npx tsc --noEmit` pasa
2. ✅ `npm run build` pasa
3. ✅ Console del navegador limpio
4. ✅ 0 network errors en flujos smoke del sprint
5. ✅ Commit con scope claro (`feat(rebrand): Sprint N — …`)
6. ✅ Sprint no rompe sprints previos (regresión smoke)

## Riesgos vivos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Trabajo se detiene a mitad | Sprints atómicos. Cada commit deja la app funcional. Sin push hasta Sprint 7 |
| Componentes sin guía quedan Frankenstein | Decálogo Isabella aplicado sin excepción |
| Modal forzado en `/` | Copia defensiva en landing (R9) |
| Acid lava con multiply | Excepción `overlay` o `soft-light` solo en categoría `objeto` |
| Bundle infla con `_inspect_design/` | Cleanup Sprint 7 (fuera de `src/` y `public/`, Vite no lo toca, solo limpieza de disco) |

## Out of scope (confirmado)

- ❌ Scroll-linked animations / microinteracciones Buck-style
- ❌ Cualquier cambio al backend o schema
- ❌ Migración del repo a Organization
- ❌ Deploy a producción
- ❌ Re-skin del UI Kit "demo" del bundle del design

## Cómo retomar este plan (instrucciones para próxima sesión)

1. **Verificar branch**: `git checkout feature/editorial-rebrand`
2. **Estado limpio**: `git status` debe estar limpio (solo settings.local.json modificado, ignorable)
3. **Backend local arriba**: `cd backend && node server.js`
4. **Vite dev arriba**: `npm run dev`
5. **`vite.config.ts` apuntando a localhost** (sin commit — solo sesión local)
6. **Leer este plan + el acta + 5 informes individuales** para contexto completo
7. **Sprint 1 listo para arrancar** — solo requiere OK explícito de Carlos
8. **Después de cada sprint cerrado**: smoke + commit + checkpoint con Carlos

## Documentos relacionados

| Documento | Propósito |
|---|---|
| Este plan | Plan ejecutable (qué hacer, en qué orden, con qué DoD) |
| `docs/informes/2026-05-11-acta-comite-editorial-rebrand.md` | Acta del comité (cómo se llegó a las decisiones) |
| `docs/informes/2026-05-11-laura-…` | Informe Analista (alternativas + riesgos macro) |
| `docs/informes/2026-05-11-natalia-…` | Informe Arquitecta (Layout + bundle + routing) |
| `docs/informes/2026-05-11-isabella-…` | Informe Frontend 3D (Decálogo + blanco frío + mapeo) |
| `docs/informes/2026-05-11-sebastian-…` | Informe Senior Dev (refactor strategy + trampas) |
| `docs/informes/2026-05-11-andres-…` | Informe Testing (matriz QA + DoD) |

## Cierre

Plan aprobado por el comité (Laura, Natalia, Isabella, Sebastián, Andrés) en sesión del 2026-05-11. Pendiente únicamente de aprobación de Carlos al alcance del Sprint 1 para iniciar implementación.
