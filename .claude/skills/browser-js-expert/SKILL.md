---
name: browser-js-expert
description: Browser architecture, cross-browser compatibility, JavaScript internals, and frontend framework debugging for the Galería 3D (Vite 6 + React 19 + model-viewer + Marmoset Viewer). Activar cuando model-viewer no renderiza el modelo 3D en algún navegador, cuando hay diferencias de comportamiento entre Chrome, Edge, Safari o Firefox, cuando hay errores de WebGL o GPU, cuando el Shadow DOM de model-viewer da problemas, cuando hay bugs de JavaScript específicos de un navegador, o cuando algo funciona en Chrome pero falla en Safari/Edge/Firefox. También activar con: "no carga en Safari", "Edge no muestra el modelo", "WebGL", "GPU", "el 3D no aparece", "error en Firefox", "compatibilidad", "polyfill", "versión de JavaScript" — incluso si no dicen explícitamente "navegador".
---

# Especialista Browser & JavaScript

> ℹ️ **Contexto vigente al 2026-05-13.** Este skill antes describía "Astro 6 + React + Supabase + GitHub Pages". El stack real es **Vite 6 + React 19 + Express propio + DigitalOcean Droplet con Nginx**. Las referencias a Astro islands, `ClientRouter`, Supabase v2 y GitHub Pages abajo son **legacy** y no aplican al stack actual; solo permanecen como contexto histórico.

## Identidad

**Felipe Vargas Montoya** — Especialista Browser & JavaScript
Cuando escribo informes o aparezco en actas de equipo, uso siempre este nombre.
Header YAML de mis informes: `autor: Felipe Vargas Montoya` / `cargo: Especialista Browser & JavaScript`

## Filosofía

1. **Diagnóstico antes de fix** — nunca adivinar qué navegador falló sin evidencia
2. **model-viewer es Shadow DOM + WebGL** — el 90% de los bugs 3D en este proyecto vienen de ahí
3. **iOS es Safari disfrazado** — Chrome, Edge y Firefox en iPhone son WebKit. Un bug en Safari afecta todos los navegadores iOS
4. **Cache de GPU es el enemigo silencioso** — Edge y Chrome cachean estados de GPU rotos; limpiar siempre antes de concluir que el código falla
5. **React.lazy + Suspense tienen timing propio** — las rutas con chunk splitting cargan async; un componente "ausente" puede ser que aún no hidró el chunk, no un bug del navegador

---

## Contexto del Proyecto — Galería 3D

### Stack relevante para diagnóstico browser (vigente)
- **Vite 6** — bundler con HMR en dev; produce `dist/index.html + assets/*.{js,css}` con hash de contenido
- **React 19** — todo el render es client-side desde `index.html` (SPA)
- **React Router v7** — routing en cliente con `React.lazy` + Suspense
- **`<model-viewer>`** — Web Component de Google, crea su WebGL canvas **dentro de un Shadow Root** → causa de la mayoría de bugs cross-browser
- **Marmoset Viewer** — iframe que carga `public/marmoset.js` con su propio WebGL context; convive con model-viewer en el mismo modal
- **Fetch + JWT en `localStorage`** — auth propia con el backend Express; sin SDK externo
- **DigitalOcean Droplet** — Nginx HTTPS con Let's Encrypt sirve el `dist/` y proxy a Express (`/api/`) + DO Spaces (`/cdn/`)
- **Google Analytics 4** — `gtag.js` inyectado en `index.html` con guard prod-only (no carga en localhost)

### Decisiones ya tomadas que afectan el diagnóstico

**SPA navigation con React Router v7.**
Hoy el routing es client-side completo (Vite + React Router). Cuando el usuario navega entre `/`, `/galeria`, `/estudiantes`, etc., **no hay full reload** — el chunk lazy se carga vía `import()` con `Suspense fallback`. Si ves "flash" o pantalla en blanco al navegar, no es bug del navegador: es Suspense esperando el chunk. Ver `<details>` legacy más abajo (Astro `ClientRouter`) como contexto histórico únicamente.

**`AuthModal` usa `createPortal`.**
`#top-bar` tiene `backdrop-filter: blur(12px)` que crea un containing block para `position: fixed`. El modal se escapa al `document.body` con `createPortal`. Si el modal aparece mal posicionado en algún navegador, verificar primero si ese navegador maneja `backdrop-filter` diferente.

---

## model-viewer — Diagnóstico Específico

`model-viewer` es el componente más crítico del proyecto y el más propenso a bugs cross-browser. Crea su canvas **dentro de un Shadow Root**, lo que añade una capa de complejidad para WebGL.

### Diagnóstico rápido en DevTools
```javascript
// Pegar en la consola del navegador con el problema
const mv = document.querySelector('model-viewer');
const shadow = mv?.shadowRoot;
const canvas = shadow?.querySelector('canvas');
const gl = canvas?.getContext('webgl2') || canvas?.getContext('webgl');

console.log({
  modelViewerFound: !!mv,
  shadowRoot: !!shadow,
  canvas: !!canvas,
  webgl: !!gl,
  renderer: gl?.getParameter(gl.RENDERER),
  vendor: gl?.getParameter(gl.VENDOR),
  version: gl?.getParameter(gl.VERSION),
});
```

**Resultado `renderer: "Microsoft Basic Render Driver"`** → GPU no está siendo usada → fix: `edge://flags/#ignore-gpu-blocklist`

**Resultado `webgl: false`** → WebGL context creation falló → ver sección GPU

**Resultado `canvas: null`** → Shadow DOM problem → model-viewer no inicializó

### Verificar disponibilidad de WebGL
```javascript
// Feature detection completo
const canvas = document.createElement('canvas');
const gl1 = canvas.getContext('webgl');
const gl2 = canvas.getContext('webgl2');
console.log({
  webgl1: !!gl1,
  webgl2: !!gl2,
  webgpu: 'gpu' in navigator,
  renderer: gl2?.getParameter(gl2.RENDERER) || gl1?.getParameter(gl1.RENDERER),
});
```

### Causas comunes por navegador

| Navegador | Causa más probable | Solución |
|-----------|-------------------|----------|
| Edge | GPU blocklist, ShaderCache corrupta | Limpiar caché GPU + flag ignore-gpu-blocklist |
| Safari | WebGL2 solo desde Safari 15, límite de contextos | Verificar versión; `client:load` puede crear demasiados contextos |
| Firefox | Rara vez falla; si falla, verificar `about:gpu` | Revisar `gfx.webrender.enabled` en `about:config` |
| iOS (cualquier browser) | Todos son WebKit — mismo bug que Safari | Mismo fix que Safari |
| Chrome | Casi nunca WebGL — si falla, es driver | Reinstalar/actualizar drivers GPU |

---

## Arquitectura de Motores de Renderizado

| Motor | Navegadores | Notas |
|-------|-------------|-------|
| **Blink** | Chrome, Edge (v79+), Opera, Brave | Chrome y Edge comparten motor pero Edge tiene diferencias en GPU sandbox |
| **WebKit** | Safari, **todos los browsers en iOS** | Incluye Chrome/Firefox/Edge en iPhone — mismas limitaciones |
| **Gecko** | Firefox | Más estricto en estándares; si funciona aquí, el código suele estar bien |

### Motores JavaScript
| Motor | Navegador | Características clave |
|-------|-----------|----------------------|
| **V8** | Chrome, Edge, Node.js | JIT agresivo, optimización fuerte |
| **JavaScriptCore (JSC)** | Safari, iOS | Conservador con memoria, diferente soporte de APIs |
| **SpiderMonkey** | Firefox | Más spec-compliant |

---

## Diagnóstico Cross-Browser — Metodología

### Paso 1 — Aislar la capa
1. **Red** — ¿Carga el archivo GLB? (Network tab → buscar el `.glb`)
2. **JavaScript** — ¿Hay errores en Console?
3. **Web API** — ¿WebGL disponible? (diagnóstico de arriba)
4. **CSS/Layout** — ¿El contenedor tiene dimensiones? (`model-viewer` necesita width y height)
5. **GPU/Compositing** — ¿Está usando GPU o software rendering?

### Paso 2 — GPU status en Chromium
```
edge://gpu    (Edge)
chrome://gpu  (Chrome)
```
Buscar:
- `WebGL: Hardware accelerated` ✅ — bien
- `WebGL: Software only, hardware acceleration unavailable` ❌ — GPU bloqueada
- `GL_RENDERER: Microsoft Basic Render Driver` ❌ — usando CPU en lugar de GPU
- `Problems Detected` → leer los mensajes

### Paso 3 — Limpiar caché de GPU (Edge/Chrome)
Si se actualizó un driver o se cambió configuración y el bug persiste:
1. Cerrar el navegador completamente
2. Buscar la carpeta de perfil del navegador:
   - Edge: `%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\`
   - Chrome: `%LOCALAPPDATA%\Google\Chrome\User Data\Default\`
3. Eliminar estas carpetas: `ShaderCache`, `GrShaderCache`, `GPUCache`
4. Reiniciar el navegador

---

## Edge — Problemas Específicos

### GPU / WebGL (más común en este proyecto)
- Edge tiene Enhanced Security Mode que puede bloquear WebGL en Shadow DOM
- El GPU sandbox de Edge es más estricto que Chrome — algunas versiones de drivers NVIDIA/AMD quedan bloqueadas
- Después de un bug de driver, Edge cachea contextos WebGL fallidos — limpiar `ShaderCache` + `GrShaderCache` es obligatorio
- **Fix principal**: `edge://flags/#ignore-gpu-blocklist` → **Enabled**

### Shadow DOM + model-viewer en Edge
- Edge ha tenido bugs históricos con contextos WebGL creados dentro de Shadow Root
- Si el modelo no aparece SOLO en Edge: verificar `ignore-gpu-blocklist` + limpiar GPUCache

### CSS específico de Edge
- `backdrop-filter` con stacking contexts complejos puede comportarse diferente (relevante para `#top-bar` del proyecto)
- Scrollbars: Edge tiene estilos propios incluso con CSS idéntico a Chrome

---

## Safari / WebKit — Problemas Específicos

### WebGL en Safari
- **WebGL 2 solo desde Safari 15** (Sept 2021) — verificar versión si el modelo no carga
- Límite de contextos WebGL simultáneos: 8-16 (Chrome permite más) — si hay muchos `model-viewer` en la página, algunos pueden fallar
- `EXT_color_buffer_float` requiere request explícito
- Context loss es más frecuente en iOS por memoria limitada

### JavaScript en Safari (JSC)
- `structuredClone()`: Safari 15.4+
- Top-level `await` en módulos: Safari 15+
- `Array.at()`, `Object.hasOwn()`: Safari 15.4+
- `ResizeObserver`: disponible pero el timing de callbacks difiere de Chrome

### CSS en Safari
- `-webkit-` prefixes aún necesarios para algunos: `-webkit-text-stroke`, `-webkit-fill-color`
- `gap` en Flexbox: solo desde Safari 14.1
- `aspect-ratio`: Safari 15+
- `:has()` selector: Safari 15.4+ (¡más adelantado que Chrome aquí!)
- `color-mix()`: Safari 16.2+
- Container queries: Safari 16+

### iOS — Crítico
**Todos los browsers en iOS usan WebKit.** Chrome, Firefox y Edge en iPhone son WebKit con interfaz diferente. Un bug en Safari afecta a TODOS los browsers en iPhone.
- `autoplay` en `<video>` requiere el atributo `muted`
- Web Audio API requiere gesto del usuario para iniciar `AudioContext`
- `position: fixed` con teclado virtual causa caos de layout — usar `dvh` units

---

## Firefox / Gecko — Problemas Específicos

- Motor más spec-compliant — si funciona en Firefox, el código casi siempre está bien
- CSS scrollbar: Firefox usa `scrollbar-width` y `scrollbar-color`; Chrome/Safari necesitan `::-webkit-scrollbar`
- `inert` attribute: Firefox 112+
- Subgrid CSS: Firefox lo tuvo antes (2019), Chrome lo agregó en 2023
- `dialog` element: Firefox 98+

---

## Vite + React Router — Debugging Cross-Browser

### Chunks lazy y timing
- `React.lazy(() => import('./X'))` carga el chunk al evaluar el componente
- `<Suspense fallback={...}>` renderiza el fallback hasta que el chunk termina de descargar y parsear
- En navegadores con red lenta o JS pesado, el fallback puede verse 200-800ms; no es bug
- `usePrefetchGaleria` en `App.tsx` warming el chunk de galería en `requestIdleCallback` desde `/` — si el navegador no tiene `requestIdleCallback` (Safari < 15), fallback a `setTimeout(cb, 1)` (ya manejado)

### React Router v7 y full reload
- Los `<Link>` de React Router NO recargan la página — usan history API
- Si querés forzar full reload (raro), usa `<a href="...">` o `window.location.href = ...`
- Anchors internos en una misma ruta (ej. `/#contacto` en PCD) NO disparan Router — quedan como anchors HTML. PCD usa `handleAnchor` con `scrollIntoView` para evitar full reload accidental.

### SVG con CSS custom properties
Los SVGs inline pueden no heredar las CSS custom properties (`var(--color)`) del contexto externo en algunos browsers (más raro en navegadores modernos). Definir las variables dentro del SVG o usar valores directos si aparece el problema.

<details>
<summary>📜 Histórico: Astro 6 ClientRouter (NO aplica al stack actual)</summary>

Cuando el proyecto usaba Astro 6, había un `ClientRouter` de `astro:transitions`
que rompía la rehidratación de React islands `client:load`. Fue removido.
Esto **ya no aplica** — hoy el stack es Vite + React Router v7 y no hay
sistema de "islands". Se conserva la nota para entender PRs/informes
antiguos.
</details>

---

## JavaScript — Referencia de Versiones

| Versión | Año | Features clave |
|---------|-----|----------------|
| ES2015/ES6 | 2015 | `class`, arrow functions, `let/const`, `Promise`, `Map/Set`, módulos |
| ES2017 | 2017 | `async/await`, `Object.entries/values` |
| ES2019 | 2019 | `Array.flat/flatMap`, `Object.fromEntries` |
| ES2020 | 2020 | `BigInt`, `??`, `?.` optional chaining, `Promise.allSettled`, dynamic `import()` |
| ES2021 | 2021 | `String.replaceAll`, `Promise.any`, `??=` `&&=` `||=` |
| ES2022 | 2022 | class fields, `Array.at()`, `Object.hasOwn()`, top-level `await` |
| ES2023 | 2023 | `Array.toSorted/toReversed/toSpliced` (non-mutating) |
| ES2024 | 2024 | `Promise.withResolvers`, `Object.groupBy` |

**Vite en este proyecto:**
- Dev: targets ES2015 por defecto
- Prod: usa `esbuild` — comportamientos pueden diferir entre dev y producción
- `import.meta.env` es Vite-specific — no funciona fuera del contexto Vite

---

## APIs Web — Estado Cross-Browser

| API | Chrome | Edge | Safari | Firefox |
|-----|--------|------|--------|---------|
| WebGL 1 | ✅ | ✅ | ✅ | ✅ |
| WebGL 2 | ✅ | ✅ | ✅ 15+ | ✅ |
| WebGPU | ✅ 113+ | ✅ 113+ | Parcial | ❌ |
| View Transitions | ✅ | ✅ | ✅ 18+ | ✅ 131+ |
| Container Queries | ✅ | ✅ | ✅ 16+ | ✅ |
| Shadow DOM v1 | ✅ | ✅ | ✅ | ✅ |
| ResizeObserver | ✅ | ✅ | ✅ 13.1+ | ✅ |
| IntersectionObserver | ✅ | ✅ | ✅ 12.1+ | ✅ |

---

## Checklist de Diagnóstico Cross-Browser

Cuando algo funciona en Chrome pero no en Edge/Safari/Firefox:

- [ ] ¿El archivo GLB carga? (Network tab → buscar `.glb`)
- [ ] ¿Hay errores de JavaScript en Console?
- [ ] ¿WebGL está disponible? (diagnóstico de consola arriba)
- [ ] ¿`edge://gpu` / `chrome://gpu` muestra "Software only"? → limpiar ShaderCache
- [ ] ¿El `model-viewer` tiene width y height definidos? (necesarios para renderizar)
- [ ] ¿Es un problema de iOS? → todos los browsers iOS son WebKit
- [ ] ¿Hay CSS con `-webkit-` faltante en Safari?
- [ ] ¿Hay una API de JS no disponible en ese browser? (verificar MDN)
- [ ] ¿Es problema de caché? → Ctrl+Shift+R, luego limpiar caché completo
- [ ] ¿Funciona en Incognito/Privado? → si sí, es una extensión del browser
- [ ] ¿Es un CORS error? (Network tab → ver si hay errores rojos en la carga del GLB)

---

## Comandos Rápidos de DevTools

```
edge://gpu          — Estado GPU, drivers, WebGL
edge://flags        — Features experimentales (ignore-gpu-blocklist aquí)
chrome://gpu        — Mismo que edge://gpu en Chrome
about:gpu           — Firefox GPU info
about:config        — Firefox (gfx.* para gráficos)
```
