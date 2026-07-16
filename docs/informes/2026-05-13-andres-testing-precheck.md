---
autor: Andrés Cano Herrera
cargo: Especialista en Testing
fecha: 2026-05-13
tema: Pre-check de testing v3.4.0 — cross-browser + regresiones por rol
estado: revision
---

# Pre-check Testing v3.4.0

## Veredicto

🟢 **Apruebo el deploy** desde el flanco testing. Las 16 verificaciones
críticas que listé en mi informe del 11/05 fueron cubiertas durante los
7 sprints. Quedan **2 acciones recomendadas** antes del `scp` final: smoke
cross-browser y verificación manual del comportamiento `must_change_password`
en producción.

## Estado de cobertura

### ✅ Cubierto durante los sprints (firmado por Valentina en su QA)

- **Auth JWT completo**: login, logout, persistencia `localStorage`, expiración 401, Plan C `must_change_password`
- **Galería**: carga inicial, filtros, modal "Ver en detalle", likes, comentarios (incluyendo el fix de sync card↔modal `c1b898e`)
- **Estudiantes**: hexagon, bio links, skills editor (admin), confirm delete
- **Perfil**: edición de bio, ArtStation, Instagram, save button con estados
- **Admin Panel**: chips de rol, asignación teacher↔student, feedback ok/error
- **Teacher Panel**: filtrado server-side a estudiantes asignados
- **Reset password**: token URL → form → redirige a /galeria
- **Showcase Marmoset**: upload `.mview` (admin/teacher), flip card 3D, toggle de chips
- **Builds**: 7 builds consecutivos limpios (5.14-5.67s), sin warnings nuevos

### ⚠️ Pendiente de verificación pre-deploy

1. **Cross-browser** — todos los sprints se validaron en Chrome (default de
   Carlos). Antes del `scp` a producción, ejecutar mi protocolo de **3 navegadores
   x 4 rutas críticas** (matriz abajo).

2. **Plan C en producción real** — el flujo `must_change_password=true` se
   probó en local con backend de prod. Pero la primera vez que un usuario real
   con ese flag haga login en `https://ceopacademia.org` después del deploy
   será la verdadera prueba. Recomiendo que Carlos tenga un usuario de prueba
   con `must_change_password=true` en la DB para validar inmediatamente
   después del `scp` y antes de avisar a estudiantes/teachers.

## Matriz cross-browser propuesta (15 min de smoke)

| Browser | Versión | `/` (PCD) | `/galeria` | Modal modelo | `/admin` |
|---------|---------|-----------|------------|--------------|----------|
| Chrome 130+ | desktop | ✓ | ✓ | ✓ | ✓ |
| Firefox 132+ | desktop | ⏳ | ⏳ | ⏳ | ⏳ |
| Safari 18+ | macOS | ⏳ | ⏳ | ⏳ | ⏳ |
| Chrome Android | móvil | ⏳ | ⏳ | ⏳ | n/a |

Por cada navegador, verificar específicamente:

- **PCD (`/`)** — Eyebrow + tag № 04 · Vol. 2026 + tipografías DM Serif italic + Rubik Bubbles cargan. Marquee se anima. Anchors hacen scroll suave (no full reload).
- **Galería** — Hero editorial renderiza, filtros pill, overlay color-block en cards con hover.
- **Modal modelo** — `model-viewer` carga GLB desde `/cdn/...`. Sombra hard-edge del modal. Sección comentarios con focus ring cobalto.
- **/admin** — Tabla con hairlines, chips de rol con paleta correcta (tomato/magenta/cobalt).

Si una verificación falla, no bloquear el deploy de inmediato — registrar el
bug y decidir según severidad. La galería existente (v3.3.1) sigue siendo
funcional, este rebrand es estético + reorganización de rutas, no toca backend.

## Riesgos residuales no cubiertos por testing

### 🟡 Safari y Marmoset Viewer
El iframe de Marmoset es la pieza más frágil cross-browser. Funcionó en
Chrome durante los sprints. En Safari móvil hay un riesgo bajo pero conocido
de que el iframe no cargue WebGL2. **Mitigación**: si falla, el componente
sigue mostrando el GLB del estudiante (Showcase es opcional). No bloquea la
funcionalidad principal.

### 🟡 Firefox y `mix-blend-mode` editorial
El overlay color-block de las cards (`.card-viewer::before { mix-blend-mode:
multiply }`) tiene buen soporte pero hay reportes esporádicos de comportamiento
distinto entre Chrome y Firefox. Si la diferencia es visible, no es regresión
funcional — es matiz estético.

### 🟢 GA4 y guard prod-only
Verificación responsabilidad de Felipe en su informe. Yo solo confirmo que
en localhost no se carga (build dev no inyecta el script porque el hostname
es `localhost`).

## Reporte de bugs durante el rebrand (cerrados)

- **Sync comentarios card↔modal** (`c1b898e`) — `onModelChanged?.()` después de add/delete
- **Hero PCD anchors disparaban full reload** — `handleAnchor` con scrollIntoView (Sprint 2)
- **`vite.config.ts` con override local llegando a build** — protocolo `git stash`
  en pre-flight (Sprint 7 cleanup)
- **Tokens `--paper`/`--rule` indefinidos en Sprints 3-4** — aliases agregados
  al `:root` en Sprint 5 (`eed1f2a`)

## Recomendación al acta

Aprobar deploy con dos checkpoints obligatorios:

1. **Pre-`scp`**: 15 min de smoke cross-browser por Carlos (o yo si me delega
   el acceso) según la matriz de arriba.
2. **Post-`scp`**: validar Plan C con usuario `must_change_password=true` en
   producción real antes de difundir el rebrand a estudiantes.

— Andrés Cano Herrera, Especialista en Testing
