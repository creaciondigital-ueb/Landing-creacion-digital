---
autor: Valentina Soto Parra
cargo: QA Lead
fecha: 2026-05-13
tema: QA final del Editorial Rebrand v3.4.0 — cierre de Sprint 7
estado: aprobado
---

# Informe QA — Editorial Rebrand v3.4.0 (Sprint 7)

## Contexto

Cierre del rebrand v3.4.0 sobre `feature/editorial-rebrand`. Siete sprints
ejecutados entre la sesión del comité (2026-05-11) y hoy (2026-05-13).
Backend intocado en todos los sprints. Esta revisión cubre los 16 flujos
críticos identificados por Andrés (Testing) en su informe del 11/05, más
las verificaciones de bandera roja levantadas en el acta del comité.

## Resumen ejecutivo

**Estado: APROBADO para merge a `develop`.**

- 7 sprints implementados y commiteados linealmente
- 0 referencias legacy hex/font restantes en código (solo 1 comentario explicativo)
- Build limpio en cada sprint (entre 5.14s y 5.67s)
- Bundle splitting respetado (chunk PCD = 29.53 KB / 5.90 KB gz, aislado)
- Migración tokens `--paper`/`--rule` realizada en Sprint 5 (eran usados pero no definidos)
- Backend confirmado sin tocar (`src/lib/api.ts`, endpoints, schema, RLS)
- Fix de bug derivado (sync de comentarios modal↔card) corregido durante Sprint 4
- Google Analytics 4 inyectado con guard prod-only (Sprint 6.5)

## Checklist universal (DoD)

### Routing y layouts

- [x] `/` carga `ProgramaCreacionDigital` (Layout standalone, sin topbar interno)
- [x] `/galeria` carga `Gallery` bajo `Layout` (topbar con NavLink Programa)
- [x] `/estudiantes` carga `EstudiantesPage` bajo `Layout`
- [x] `/perfil` carga `ProfilePage` bajo `Layout`
- [x] `/admin` con guard de rol
- [x] `/teacher` con guard de rol
- [x] `/reset-password?token=...` carga `ResetPasswordPage`
- [x] React.lazy + Suspense aislando bundle PCD
- [x] `usePrefetchGaleria` warming chunk en idle desde `/`
- [x] Anchors internos en PCD usan scrollIntoView (no full reload)

### Landing PCD

- [x] Hero con tipografía editorial (DM Serif italic + Zalando Sans + Rubik Bubbles)
- [x] Marquee
- [x] 4 ejes color-block
- [x] 3 roles
- [x] Showcase 8 placeholders
- [x] Studio strip con cubo isométrico SVG
- [x] Footer
- [x] Bandera roja resuelta: `<ChangePasswordModal>` defensivo en PCD para
      cubrir el caso `must_change_password=true` en `/` sin Layout

### Galería `/galeria`

- [x] Hero editorial 3-row (Galería italic + tag + de objetos→modelos + 3D.)
- [x] Stats bar eliminada por decisión de diseño
- [x] Topbar con marca a `/galeria` + sufijo "· Estudio CD4"
- [x] Filtros editoriales con pills hairline
- [x] Grid con overlay color-block por categoría (mix-blend-mode 0.08)
- [x] Card hover intensifica overlay
- [x] Like, comentarios y filtros consumen los mismos endpoints
- [x] **Fix de bug:** counter de comentarios se actualiza al cerrar modal
      (`onModelChanged?.()` en add/delete)
- [x] Modal "Ver en detalle" en paper + sombra hard-edge + visor ink
- [x] Comments section con focus ring cobalto
- [x] Tag "Marmoset Viewer" con animación glow cobalto

### Estudiantes `/estudiantes`

- [x] Hero compacto editorial (`.hero--estudiantes`)
- [x] StudentCard con paper + hairline, nombre DM Serif italic
- [x] Avatar cobalto con borde + mono
- [x] HexagonChart repaleta (cobalto + grid hairline frío)
- [x] SkillsEditor con border-left acid, slider thumb cobalto
- [x] Bio links como pills con brand color solo al hover
- [x] Admin actions: clear→acid, delete→tomato

### Auth y password

- [x] AuthModal con tabs hairline cobalto
- [x] Auth-error tomato editorial
- [x] Auth-success con pill acid + border ink
- [x] ResetPasswordPage en card paper + sombra hard-edge + DM Serif italic
- [x] ChangePasswordModal hereda automáticamente el sistema `.upload-modal/*`
- [x] TempPasswordModal con código en cobalto (`var(--accent)`)
- [x] Plan C flow `must_change_password=true` funcional en `/` y `/galeria`

### Admin / Teacher

- [x] AdminPanel h1 en DM Serif italic
- [x] Chips de rol con paleta `--role-*` del sistema
- [x] Feedback OK pill acid + ink, error tomato
- [x] Form de asignación con fondo `--bg` y border hairline
- [x] Primary button cobalto con hover ink
- [x] TeacherPanel hereda `.admin-*` sin código adicional

### Perfil

- [x] Avatar 64px cobalto
- [x] Nombre DM Serif italic
- [x] Save button cobalto con hover ink
- [x] Estados ok/error con relleno completo
- [x] Bio textarea con focus ring cobalto

### Showcase carousel (modelos con `.mview`)

- [x] Flip 3D con face ink editorial
- [x] Chips polaroid sobre ink (chrome translúcido claro)
- [x] Active state cobalto sólido + dot pulsante acid
- [x] Toggle inferior con gradiente ink
- [x] Marmoset iframe carga sin regresiones

### Observabilidad

- [x] Google Analytics 4 `G-EMK9RDJD0G` inyectado en `<head>` de `index.html`
- [x] Guard prod-only: hostname `ceopacademia.org` o `www.`
- [x] `window.gtag` expuesto para eventos custom futuros
- [x] En localhost NO se carga el script (verificado en build)

## Cleanup ejecutado en Sprint 7

### Hex inline purgados (7 archivos)

- `EditModelForm.tsx:149` — `#ff4d00` → `var(--accent2)`
- `UploadForm.tsx:211` — `#ff4d00` → `var(--accent2)`
- `ShowcaseUploadForm.tsx:232` — `#ff4d00` → `var(--accent2)`
- `ModelCard.tsx:99` — fallback color `#ff4d00` → `var(--accent2)`
- `ModelModal.tsx:41-44` — dict `categoryColors` alineado con `ModelCard`
- `ModelModal.tsx:321` — fallback `#ff4d00` → `var(--accent2)`
- `Gallery.tsx:427` — botón delete inline con tokens
- `TempPasswordModal.tsx:78` — `#22c55e` → `var(--accent)`

### CSS legacy purgado (`global.css`)

- `upload-btn:hover` background → `rgba(255, 90, 44, 0.10)` (tomato editorial)
- `gallery-save-indicator` `#22c55e` → `var(--accent)`
- `usermenu-badge/avatar/login-btn/dropdown` purga de `#00ff88*` + literales `Bebas Neue`/`DM Sans` → tokens
- `page-title` Bebas Neue → DM Serif italic

### Routes / dead code

- `/test-marmoset` ya estaba removido de `App.tsx` antes del sprint
- `public/test-models/` sigue en `.gitignore` (correcto)
- Solo queda 1 comentario explicativo en `HexagonChart.tsx:8` (no es legacy real)

## Banderas rojas y mitigaciones

| Bandera | Mitigación | Estado |
|--------|-----------|--------|
| Modal forzado password en `/` sin Layout | `<ChangePasswordModal>` defensivo en PCD.tsx | ✅ |
| `must_change_password` después de login | `onAuthStateChange` global en Layout | ✅ |
| Comentarios desincronizados con la card | `onModelChanged?.()` en add/delete (Sprint 4 hotfix) | ✅ |
| Tokens `--paper`/`--rule` no definidos | Aliases agregados en `:root` (Sprint 5) | ✅ |
| GA4 inflando métricas en dev | Guard hostname IIFE | ✅ |
| `vite.config.ts` con override local | Documentado, nunca se commitea | ✅ |

## Métricas

| Métrica | Antes | Después |
|--------|-------|---------|
| Refs legacy hex/font | ~60 | 0 (+1 comentario) |
| Tipografías cargadas | Bebas Neue + DM Sans + JetBrains Mono | DM Serif + Zalando + Rubik Bubbles + JetBrains Mono |
| Tokens en `:root` | 32 | 48 (+`--paper`, `--rule`, escalas, sombras, roles, categorías) |
| Bundle index gz | ~104 KB | ~106 KB (+2 KB por tipografías editoriales) |
| Bundle PCD gz | n/a | 5.90 KB (chunk aislado vía React.lazy) |
| CSS gz | ~7 KB | ~9.77 KB (+39%, esperado por sistema editorial) |
| Build time | 4.8-5.2s | 5.14-5.67s (sin regresión significativa) |

## Recomendaciones para merge

1. **No mergear a `main` directo** — usar el flujo:
   `feature/editorial-rebrand` → `develop` (validación final) → `main` (release tag `v3.4.0`)
2. **Smoke test cross-browser pendiente** (Chrome ✓ confirmado por Carlos
   en sesiones previas; Firefox/Safari recomendados antes de tag a `main`)
3. **GA4 empezará a registrar tráfico real solo después de llegar a `main`**
   y deploy a producción
4. **Cherry-pick del fix de comentarios** (`c1b898e`) si Carlos quiere
   patchear `main` antes del release completo del rebrand
5. **PENDIENTES BG** sin relación con el rebrand pero abiertos:
   - Revocar DO PAT del incidente
   - Avisar a colaborador del rename del repo + SECURITY.md

## Veredicto

✅ **APROBADO**.

Las 16 verificaciones críticas de Andrés y las 8 mitigaciones del acta
del comité están satisfechas. El rebrand mantiene paridad funcional total
con la versión anterior, sin tocar backend ni schemas. El cleanup de
Sprint 7 elimina toda referencia legacy y deja el código alineado con el
sistema editorial definido por Isabella.

Carlos puede proceder con el merge a `develop` cuando confirme el smoke
final en local.

— Valentina Soto Parra, QA Lead
