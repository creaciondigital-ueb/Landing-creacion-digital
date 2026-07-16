---
autor: Felipe Vargas Montoya
cargo: Especialista Browser & JavaScript
fecha: 2026-05-28
tema: Pre-check browser/JS deploy v3.5.0 — landing del Programa
estado: revision
---

# Pre-check Browser/JS v3.5.0

## Veredicto

🟢 **Apruebo el deploy.** El bundle es sano, GA4 intacto, y el JS de la landing
(modales con `<dialog>` + estado React, hamburguer) es estándar moderno sin
dependencias nuevas.

## Bundle

- Chunk landing `ProgramaCreacionDigital`: ~28.95 KB / 6.44 KB gzip (era 5.90;
  +0.5KB por modales + carrusel + hamburguer). Aislado vía `React.lazy`.
- CSS landing: ~20.6 KB / 4.4 KB gzip.
- Assets: 5.0 MB WebP + 180 KB PNG (logos) en `public/programa/img/`. Servidos
  estáticos por Nginx, NO inflan el bundle JS.
- `events-*.esm` (Three.js) sigue siendo el chunk grande pero solo carga en el
  modal de la galería, no en la landing.

## GA4

Sin cambios en `index.html` respecto a v3.4.0. El guard prod-only
(`hostname === ceopacademia.org`) sigue. `grep G-EMK9RDJD0G dist/index.html` = 3.
La landing NO añade tracking nuevo. Cuando el deploy llegue a prod, GA4 registra
la landing igual que el resto.

## JS de la landing

- Modales: `<dialog>` nativo controlado por estado React (`useEffect` →
  `showModal()`/`close()`). Sin librerías de modal. Limpio.
- Hamburguer: toggle de estado React + clase CSS. Sin JS extra.
- No hay `console.log` de debug.
- No hay listeners globales que se filtren (todo scoped al componente).

## Cross-browser (mismo riesgo que reporta Andrés)

- `<dialog>`, `:has()`: soporte en navegadores actuales; riesgo asumido por Carlos.
- WebP con alpha: soporte universal hoy (Chrome/FF/Safari/Edge).
- Fuentes Google CDN (DM Serif, Zalando, Rubik Bubbles, Noto Serif, JetBrains):
  cargadas con `display=swap`, sin FOIT.
- `requestIdleCallback` (prefetch galería): fallback a setTimeout ya existente.

## Cache post-deploy

Recordatorio del runbook v3.4.0: `index.html` se sirve sin `immutable`, los
assets con hash sí. Si un usuario ve la landing vieja tras el deploy → hard
refresh. Los assets nuevos (`/programa/img/`) no tienen hash en el nombre pero
son archivos nuevos (no existían antes), así que no hay colisión de cache.

## Recomendación al acta

Aprobado. Verificar en el smoke post-deploy que `/programa/img/*.webp` responde
200 (Nginx sirviendo el subdirectorio nuevo).

— Felipe Vargas Montoya, Especialista Browser & JavaScript
