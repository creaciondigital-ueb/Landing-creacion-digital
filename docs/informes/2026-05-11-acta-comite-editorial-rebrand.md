---
autor: Claude Renard
cargo: Líder de Desarrollo / Tech Lead
fecha: 2026-05-11
tema: Acta del Comité — Editorial Rebrand v3.4.0
estado: aprobado_para_carlos
branch: feature/editorial-rebrand
---

# Acta del Comité — Editorial Rebrand

## 1. Convocatoria

| | |
|---|---|
| **Fecha** | 2026-05-11 |
| **Presidente** | Claude Renard (Tech Lead) |
| **Branch** | `feature/editorial-rebrand` |
| **Plan inicial referenciado** | `docs/plans/2026-05-11-editorial-rebrand.md` (escrito prematuramente solo por TL — esta acta lo refina) |
| **Asistentes con informe entregado** | 5/5 |

| # | Especialista | Informe entregado |
|---|---|---|
| 1 | Laura Botero Ríos — Analista | `2026-05-11-laura-editorial-rebrand-analisis.md` |
| 2 | Natalia Vargas Ospina — Arquitecta | `2026-05-11-natalia-editorial-rebrand-arquitectura.md` |
| 3 | Isabella Moreno Ríos — Frontend 3D | `2026-05-11-isabella-editorial-rebrand-visual.md` |
| 4 | Sebastián Torres Mejía — Senior Dev | `2026-05-11-sebastian-editorial-rebrand-viabilidad.md` |
| 5 | Andrés Cano Herrera — Testing | `2026-05-11-andres-editorial-rebrand-qa.md` |

## 2. Veredictos individuales

| Especialista | Veredicto | Observación clave |
|---|---|---|
| Laura | ✅ Aprobado con observaciones | Alcance B (continuous). Plan inicial del TL debe ser **refinado por el comité antes de implementar** |
| Natalia | ✅ Aprobado con observaciones | 2 Layouts distintos. Lazy + pre-fetch del chunk galería. Anchors landing requieren scroll JS |
| Isabella | ✅ Aprobado con decisiones | Blanco frío `#f6f8fb`. Decálogo de 10 reglas para inferencia. Overlay categoría multiply opacity 0.08 |
| Sebastián | ✅ Aprobado con re-estimación | 15-21h (no 10-15h). Reescritura `global.css` por secciones. 6 trampas técnicas documentadas |
| Andrés | ✅ Aprobado con bandera | 20 flujos críticos como DoD. Distinción visual vs funcional. **Bandera roja**: `must_change_password` modal fuera de `/` |

**Veredicto del comité: APROBADO CON OBSERVACIONES.** Procede a implementación previa aprobación de Carlos al alcance del Sprint 1.

## 3. Resoluciones del comité

Las decisiones acordadas por los 5 expertos (con razón explícita):

### R1 — Alcance: Alternativa B (continuous)
- **Decisión**: foundation + landing + reskin galería en una sola línea de trabajo, sin separar en sesiones.
- **Razón**: la disonancia visual de entregar la landing sola (sin reskin de galería) empeora la percepción del programa. Si no se puede entregar todo, mejor postergar hasta poder hacerlo atómicamente. Trabajamos en branch local, sin push hasta cerrar Sprint 7.
- **Origen**: Laura (informe 1, fase 2)

### R2 — Layout strategy: 2 Layouts distintos
- **Decisión**: la landing del PCD **NO** usa `Layout.tsx`. Tiene su topbar embebida. La galería + todas las páginas internas siguen usando `Layout.tsx`. En `App.tsx`:
  ```tsx
  <Route path="/" element={<Suspense><ProgramaCreacionDigital/></Suspense>} />
  <Route element={<Layout/>}>
    <Route path="/galeria" element={<GaleriaPage/>} />
    ...
  </Route>
  ```
- **Razón**: separación clara de responsabilidades (landing = público estático; galería = app con auth y estado complejo). Habilita code-splitting natural.
- **Origen**: Natalia (informe 2, sección 1)

### R3 — Valor exacto del blanco frío
- **Decisión**: `--bg: #f6f8fb` y `--surface: #ffffff`.
- **Razón**: HSL 213°,33%,97% — tinte frío sutil que hace brillar el cobalt sin perder limpieza. WCAG AAA pasa con margen. Si Carlos siente "muy gris" al verlo, fallback `#f9fafc` (un peldaño más claro).
- **Origen**: Isabella (informe 3, sección 1)

### R4 — Code-splitting de la landing
- **Decisión**: `const ProgramaCreacionDigital = React.lazy(() => import('./pages/ProgramaCreacionDigital'))` envuelta en `<Suspense fallback={<PCDLoadingSkeleton/>}>`.
- **Adicional**: pre-fetch del chunk `GaleriaPage` en idle del navegador después de cargar la landing.
- **Razón**: visitantes a `/galeria` no descargan código de la landing (~25 KB ahorrados). Navegación landing→galería se siente instantánea por pre-fetch.
- **Origen**: Natalia (informe 2, sección 3)

### R5 — Fuentes vía Google Fonts CDN (no auto-host)
- **Decisión**: `@import url('https://fonts.googleapis.com/...')` en línea 1 absoluta de `global.css`. NO commitear los `.ttf` del bundle del design.
- **Razón**: ~5 MB de `.ttf` en repo vs ~106 KB de `.woff2` desde Google. Google entrega `display: swap` por default (no bloquea render).
- **Origen**: Natalia (informe 2, sección 3)

### R6 — Reescritura del `global.css` por secciones, no archivo completo
- **Decisión**: mantener el archivo `global.css` y reescribir secciones autocontenidas por sprint, en el orden definido en `Sebastián informe sección 1`. Sprint 1 reescribe solo `:root` + body reset. Sprint 3 reescribe Topbar/Hero/Filter/Grid/Card/Footer. Etc.
- **Razón**: el archivo tiene 2800 líneas — reescritura de golpe es alto riesgo. Por secciones cada sprint deja el archivo en estado parseable y válido.
- **Importante**: al reescribir una sección, **se borra el bloque viejo entero** (no se comenta). Evita cascade de specificity duplicado.
- **Origen**: Sebastián (informe 4, sección 1)

### R7 — Overlay de categoría sobre imagen real
- **Decisión**: las thumbnails `.model-card-thumb` mantienen la imagen `.webp` real, con un overlay de color de categoría aplicado vía pseudo-elemento:
  ```css
  .model-card-thumb::before {
    content: ''; position: absolute; inset: 0;
    background: var(--cat-color);
    mix-blend-mode: multiply;
    opacity: 0.08;
    pointer-events: none;
  }
  ```
  Más vignette inferior `linear-gradient(to top, rgba(13,13,13,0.20) 0%, transparent 40%)` para legibilidad de badge y stamp.
- **Excepción acid**: si el overlay con `acid #d6ff3a` (categoría `objeto`) sale lavado, cambiar a `mix-blend-mode: overlay` o `soft-light` solo en esa categoría. Decisión en Sprint 3 al ver el render real.
- **Razón**: preserva el trabajo visual del estudiante (imagen real) y aporta el color-block sutil del design. Decisión A aprobada por Carlos.
- **Origen**: Isabella (informe 3, sección 4) + Sebastián (informe 4, trampa 4)

### R8 — Decálogo Isabella como guía única para componentes sin guía del UI Kit
- **Decisión**: para los 15 componentes que el UI Kit no cubre (ModelModal, ShowcaseCarousel, AdminPanel, etc.), aplicar las **10 reglas del Decálogo Isabella** (informe 3, sección 3) sin excepción. Ningún experto introduce decisiones visuales ad-hoc fuera del decálogo.
- **Razón**: previene "Frankenstein" — mezcla de patrones entre componentes con guía y sin guía.
- **Origen**: Isabella (informe 3, sección 3)

### R9 — Mitigación bandera roja Andrés (modal forzado en `/`)
- **Decisión**: en `ProgramaCreacionDigital.tsx` también suscribirse a `onAuthStateChange` y montar `<ChangePasswordModal>` cuando `user.must_change_password === true`. Copia defensiva de la lógica del Layout. ~10 líneas.
- **Alternativa rechazada**: mover el guard al router level con un wrapper `<RequireNoPasswordChange/>`. Más limpio pero invasivo — preferimos la copia local por minimalismo.
- **Razón**: un usuario con flag=true que llegue directo a `/` (deep link, bookmark) debe ver el modal forzado. Sin esto, podría navegar todo el landing sin cambiar password.
- **Origen**: Andrés (informe 5, bandera roja) + Sebastián (informe 4, trampa 6)

### R10 — Anchors del landing (scroll JS, no full reload)
- **Decisión**: los `<a href="#manifiesto">` del landing se convierten en helper `<AnchorLink href="#X">` que hace `e.preventDefault()` + `scrollIntoView({behavior: 'smooth'})`. Función definida una vez en `ProgramaCreacionDigital.tsx`.
- **Razón**: React Router rompe `<a href="#X">` por default (causa navigation). Smooth scroll mejora UX.
- **Origen**: Natalia (informe 2, riesgo 6) + Sebastián (informe 4, sprint 2 JSX issue 1)

### R11 — HexagonChart cambio de colores en JSX (no override CSS)
- **Decisión**: en `HexagonChart.tsx`, cambiar los valores hardcoded `rgba(0,255,136,0.15)` → `rgba(26,60,255,0.16)` y `#00ff88` → `#1a3cff` (cobalt). NO override CSS con `!important`. 4 valores específicos.
- **Razón**: eliminar deuda técnica (el UI Kit usa override feo porque no puede tocar JSX; nosotros sí podemos).
- **Origen**: Carlos (decisión D aprobada) + Sebastián (informe 4, sprint 4)

### R12 — Re-estimación temporal: 15-21h totales
- **Decisión**: adoptar las estimaciones de Sebastián. Plan inicial del TL subestimaba el Sprint 2 (landing portada) y Sprint 5 (8 componentes sin guía).
- **Distribución sugerida**: 2-3 sesiones de trabajo (no 1). Carlos decide cuántos sprints por sesión según su disponibilidad.
- **Origen**: Sebastián (informe 4, sección 5)

### R13 — Definition of Done universal (cada sprint)
- **Decisión** (acordado por todos los expertos):
  1. `npx tsc --noEmit` pasa sin errores
  2. `npm run build` pasa sin warnings nuevos
  3. Console del navegador limpio (sin errores rojos)
  4. Network tab: 0 requests fallidos en flujos smoke del sprint
  5. Commit con mensaje descriptivo y scope claro
  6. El sprint NO rompe ningún flujo del sprint anterior (regression smoke)
- **Origen**: Andrés (informe 5, sección 3) + Sebastián (informe 4, type-safety)

### R14 — Matriz QA de 20 flujos críticos
- **Decisión**: adopción de la matriz de Andrés tal cual. Cada sprint tiene **smoke subset asignado** (informe Andrés sección 1). Sprint 7 valida los 20 completos antes del comité QA final con Valentina.
- **Origen**: Andrés (informe 5)

### R15 — Sin push hasta cerrar Sprint 7
- **Decisión**: TODOS los commits quedan en branch local `feature/editorial-rebrand`. NO se hace `git push origin feature/editorial-rebrand` hasta que el Sprint 7 cierra con QA de Valentina aprobado. Carlos en cualquier punto puede pedir parar y revertir.
- **Razón**: prevención de disonancia visual visible al colaborador o a producción mientras el trabajo está en progreso.
- **Origen**: Laura (informe 1, sección 4) + adoptado por todos

### R16 — Out of scope confirmado
- **Decisión**: NO se incluye en esta feature:
  - Scroll-linked animations / microinteracciones avanzadas del design Buck-style (sesión aparte)
  - Cambios al backend (cualquier cambio que sugiera tocar endpoints o schema queda fuera, se escala)
  - Migración del repo a Organization (sesión aparte)
  - Deploy a producción (sesión aparte, posterior a esta feature)
  - Re-skin del UI Kit "demo" del design (`ui_kits/galeria/index.html`) — vive en el bundle del design, no en el repo del producto
- **Origen**: Laura (informe 1, sección 4) + Carlos (directriz inicial)

## 4. Plan final acordado (reemplaza el plan inicial del TL)

### Sprints — versión revisada por el comité

| # | Sprint | Owner principal | Tiempo (Sebastián) | DoD adicional |
|---|---|---|---|---|
| **1** | Foundation tokens + fuentes | Sebastián + Isabella | 30-40 min | Galería sigue funcionando con paleta nueva (smoke F1+F2) |
| **2** | Landing PCD + Router 2-Layouts + lazy + anchors + modal forzado en landing | Sebastián + Natalia | 3-4 h | `/` renderiza landing en chunk separado; `/galeria` carga; anchors scroll smooth; bandera roja R9 implementada |
| **3** | Re-skin galería core (Topbar, Hero, FilterBar, Grid, Card con overlay multiply, Footer) | Isabella + Sebastián | 4-5 h | Imagen real preservada con overlay 0.08; Hero JSX 3-row con tachado; FilterBar acid counter |
| **4** | Students + HexagonChart (cobalt en JSX directo) + EstudiantesPage | Isabella + Sebastián | 1-2 h | Hex con valores cobalt sin overrides CSS |
| **5** | Modales y forms (ModelModal, ShowcaseCarousel, MarmosetViewer wrap, UploadForm, EditModelForm, ShowcaseUploadForm, AuthModal, ChangePasswordModal, TempPasswordModal, ResetPasswordPage) — aplicando Decálogo Isabella | Sebastián | 3-4 h | Chip activo del carrusel cambia de cyan a cobalt; ShowcaseCarousel flip 3D intacto |
| **6** | AdminPanel + TeacherPanel + UserMenu + ProfilePage | Sebastián | 2-3 h | Tablas legibles con border editorial; pills mono uppercase |
| **7** | QA exhaustivo (20 flujos) + comité Valentina + cleanup `_inspect_design/` + session log + plan estado `implementado` | Andrés + Valentina + Claude | 2-3 h | TODOS los 20 flujos validados; comité QA aprueba; cleanup OK |
| **Total** | | | **15-21 h** | distribuibles en 2-3 sesiones |

### Definition of Done por sprint (resumen)

**Universal (todos los sprints)** — R13:
- `npx tsc --noEmit` ✅
- `npm run build` ✅
- Console limpio ✅
- 0 network errors en flujos smoke ✅
- Commit descriptivo ✅
- 0 regresión vs sprints previos ✅

**Específico por sprint**: ver tabla arriba (columna "DoD adicional") + Andrés informe sección 3.

## 5. Acciones por prioridad (después de aprobación de Carlos)

| # | Prioridad | Acción | Owner |
|---|---|---|---|
| 1 | **Crítica** | Carlos aprueba alcance del Sprint 1 | Carlos |
| 2 | Alta | Sebastián + Isabella implementan Sprint 1 (Foundation) | Sebastián, Isabella |
| 3 | Alta | Andrés ejecuta smoke F1+F2 al cierre del Sprint 1 | Andrés |
| 4 | Alta | Claude commitea Sprint 1 en branch local | Claude Renard |
| 5 | Crítica | Carlos valida Sprint 1 y da OK al Sprint 2 | Carlos |
| 6 | … | (sucesivamente sprint por sprint) | |

## 6. Riesgos vivos y mitigaciones acordadas

| # | Riesgo | Mitigación |
|---|---|---|
| 1 | Trabajo se detiene a mitad | Sprints atómicos, cada uno deja la app funcional. Sin push hasta cierre completo (R15) |
| 2 | Componentes sin guía quedan Frankenstein | Decálogo Isabella (R8) aplicado sin excepción |
| 3 | Bandera roja modal forzado en `/` | R9 — copia defensiva del modal en `ProgramaCreacionDigital.tsx` |
| 4 | TypeScript errors en cascada | R13 — `tsc --noEmit` antes de cada commit |
| 5 | `mix-blend-mode: multiply` lava la categoría acid | R7 excepción — testear en Sprint 3, fallback a `overlay` o `soft-light` solo en `objeto` |
| 6 | Carlos cambia opinión visual a mitad | Decisiones cerradas en este acta. Sprint 1 es revertible si hay cambio mayor |
| 7 | Bundle infla con `_inspect_design/` | Cleanup en Sprint 7 (no commiteado, solo disco local) |

## 7. Pendientes vigilados (no parte de la feature, agendados)

- **DO API Token** del incidente 2026-05-11: pendiente revocación de Carlos en panel DO
- **Avisar a colaborador** `creaciondigital-ueb` del rename + SECURITY.md
- **Gitleaks** instalación (sesión aparte)
- **Email a Marmoset** para uso de logo oficial (opcional, sesión aparte)

## 8. Cierre del comité

El comité aprueba el plan acordado para presentar a Carlos. **Próximo paso**: aprobación de Carlos al alcance del Sprint 1 específicamente (no del plan completo — sprint por sprint con OK explícito).

**Firma del comité** (representada por TL):

- Laura Botero Ríos — Analista ✅
- Natalia Vargas Ospina — Arquitecta ✅
- Isabella Moreno Ríos — Frontend 3D ✅
- Sebastián Torres Mejía — Senior Dev ✅
- Andrés Cano Herrera — Testing ✅
- Claude Renard — Tech Lead (presidente) ✅

Cierre del acta: 2026-05-11.
