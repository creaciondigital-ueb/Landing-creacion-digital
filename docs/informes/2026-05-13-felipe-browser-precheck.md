---
autor: Felipe Vargas Montoya
cargo: Especialista Browser & JavaScript
fecha: 2026-05-13
tema: Pre-check browser/JS v3.4.0 — GA4 en condiciones reales, bundle, console limpia
estado: revision
---

# Pre-check Browser/JS v3.4.0

## Veredicto

🟢 **Apruebo el deploy** desde el flanco browser/JS. El bundle se comporta
como esperado, GA4 está correctamente guardado por hostname, y el código
generado por Vite es estándar moderno (ES2020+) sin polyfills exóticos.
Recomiendo **2 verificaciones manuales post-deploy** que solo se pueden
hacer en el dominio real.

## Análisis del bundle generado (`dist/`)

Build limpio del último commit (`a175fde` rama `feature/editorial-rebrand`):

| Asset | Raw | Gzip | Notas |
|---|---|---|---|
| `index.html` | 1.15 kB | 0.52 kB | Incluye GA4 script con guard hostname |
| `index-*.css` | 52.25 kB | 9.77 kB | Sistema editorial completo |
| `ProgramaCreacionDigital-*.css` | 16.86 kB | 3.24 kB | Chunk de landing aislado |
| `index-*.js` | 341.57 kB | 106.30 kB | Bundle principal |
| `ProgramaCreacionDigital-*.js` | 29.53 kB | 5.90 kB | Lazy chunk PCD |
| `Model3D-*.js` | 130.47 kB | 41.82 kB | R3F + Three.js core |
| `events-*.esm-*.js` | 847.22 kB | 227.66 kB | Three.js completo lazy |
| `ModelScene-*.js` | 24.52 kB | 8.19 kB | Lazy |
| `ModelModal-*.js` | 7.96 kB | 2.94 kB | Lazy |
| Formularios (Upload/Edit/Showcase) | 3-5 kB cada uno | 1-2 kB | Lazy |

**Observaciones:**

- Code splitting funciona como diseñó Natalia. El landing PCD queda
  efectivamente aislado (5.90 KB gzip) — usuario que solo visita `/` no
  descarga el código de galería ni de Three.js.
- El chunk `events-*.esm-*.js` de 847 KB (227 KB gzip) es Three.js completo;
  se descarga solo cuando el modal "Ver en detalle" se abre. Es aceptable.
- Warning de Vite "chunks larger than 500kB" se refiere al chunk de Three.js
  — no es regresión, viene desde v3.3.x.

## GA4 (gtag.js) — auditoría

`index.html` línea ~20 contiene el snippet envuelto en IIFE con guard:

```javascript
var host = window.location.hostname;
var isProd = host === 'ceopacademia.org' || host === 'www.ceopacademia.org';
if (!isProd) return;
```

### ✅ Verificaciones que ya hice

1. **`grep -c "G-EMK9RDJD0G" dist/index.html` = 3** — el ID aparece en URL del
   script + 2 referencias en código. Correcto.
2. **El script de `googletagmanager.com` NO se inyecta en localhost** —
   verifiqué levantando `npm run dev` y `npm run preview` con `dist/`. En
   ambos casos, DevTools → Network: 0 requests a `googletagmanager.com`.
3. **`window.gtag` queda expuesto solo en prod** — el closure del IIFE asigna
   `window.gtag = gtag` solo dentro del `if (isProd)`. En dev `window.gtag`
   es `undefined`. Esto permite usar `window.gtag?.('event', ...)` desde
   React más adelante sin romper en local.

### ⚠️ Verificaciones que solo se pueden hacer post-deploy

4. **El script SÍ se carga en `https://ceopacademia.org`** — verificar en
   DevTools Network del navegador real. Buscar request 200 a
   `https://www.googletagmanager.com/gtag/js?id=G-EMK9RDJD0G`.
5. **GA4 dashboard recibe el primer evento de pageview** — esperar 2-5
   minutos después del deploy y revisar la propiedad en el panel de Google
   Analytics. Si no llega: revisar bloqueadores de tracking del navegador
   de Carlos (uBlock, Brave Shields, etc. bloquean gtag por default).

## Console limpia

Audité los components principales con búsqueda de `console.error`,
`console.warn` y `console.log` residuales:

- `console.error('Error loading models:', err)` en `Gallery.tsx` y
  `EstudiantesPage.tsx` — **válidos**, ayudan al debugging
- `console.error('[Gallery] Error en init:', err)` en `Gallery.tsx` — válido
- Sin `console.log` de debug accidentales (verificado con grep)

En producción los errores reales del API se loggean en `console.error` con
prefijo entre corchetes. Cuando el droplet esté caído o el JWT expire, el
usuario verá en console mensajes legibles. Acción no requerida.

## Cross-browser desde el lado JS

- **Vite target `esnext`** — genera ES2020+, no soporta IE11 (no requerido).
  Chrome 90+, Firefox 90+, Safari 14+, Edge 90+ funcionan.
- **`React.lazy` + Suspense** — soporte universal en navegadores modernos.
- **`requestIdleCallback`** — Safari < 15 no lo tiene; `App.tsx` ya tiene
  fallback a `setTimeout(cb, 1)` para warming del chunk de galería.
- **`backdrop-filter`** (modal-overlay, topbar) — Safari iOS necesita
  `-webkit-backdrop-filter` además. Ya está aplicado en `.modal-overlay` y
  `.modal-admin-toolbar`.
- **`mix-blend-mode` editorial** — soporte universal pero rendering puede
  variar levemente entre Chrome y Firefox (Andrés lo mencionó).

## Riesgos identificados

### 🟡 Marmoset Viewer iframe en Safari móvil
El `<iframe>` que carga `public/marmoset.js` v4.05 puede tener issues con
WebGL2 en algunas versiones de Safari móvil antiguas (< 16.4). **Mitigación**:
si falla, el flip card 3D del Showcase muestra el GLB del estudiante en la
cara trasera; no bloquea la funcionalidad principal. Showcase es opcional.

### 🟡 Service Worker / cache agresivo
No tenemos service worker en este proyecto. Pero el `Cache-Control: immutable`
1 año en Nginx para `.js/.css` significa que si un usuario tiene `index.html`
viejo cargado, va a pedir assets con hashes que ya no existen → 404 en
chunks específicos. **Mitigación**: Nginx sirve `index.html` sin
`immutable`, así que un refresh trae el nuevo `index.html` con los nuevos
hashes. Documentar en el runbook que si un usuario reporta "pantalla en
blanco", el fix es Ctrl+Shift+R.

## Recomendación al acta

Aprobar deploy con verificación obligatoria de:

1. Pre-`scp`: confirmar que `grep G-EMK9RDJD0G dist/index.html` da 3 (parte
   del pre-flight de Mateo).
2. Post-`scp` inmediato: cargar `https://ceopacademia.org` desactivando el
   bloqueador de tracking si lo tenés, abrir DevTools Network, confirmar
   request 200 a `googletagmanager.com`.
3. Post-`scp` +5 min: GA4 dashboard muestra el primer pageview.

— Felipe Vargas Montoya, Especialista Browser & JavaScript
