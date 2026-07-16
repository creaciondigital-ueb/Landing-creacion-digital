---
autor: Sebastián Torres Mejía
cargo: Senior Dev Astro/React
fecha: 2026-05-11
tema: Viabilidad técnica — Editorial Rebrand (refactor strategy, JSX, estimaciones)
estado: revision
---

# Viabilidad Técnica — Editorial Rebrand

## Mi mandato

Aterrizar las decisiones de Laura, Natalia, Isabella y Andrés en **código real ejecutable**. Mi enfoque:

1. **Refactor strategy del `global.css`** — cómo reescribir 2800 líneas sin romper en cascada
2. **JSX changes específicos** por componente, con riesgos de type-safety
3. **Patrón de implementación reutilizable** — tokens + clases reutilizadas en componentes nuevos
4. **Estimación realista por sprint** — corrijo las del Tech Lead si las veo optimistas
5. **Trampas técnicas que predigo** — saber antes evita perder tiempo

## 1) Refactor strategy del `global.css`

El `src/styles/global.css` tiene **~2800 líneas** producto de 12+ meses de trabajo incremental. Reescribirlo de golpe es un suicidio (rompe en cascada, demasiada superficie a validar).

### Estrategia: **reescritura por secciones, no por archivo completo**

Mantengo el archivo `global.css` y voy reescribiendo **secciones autocontenidas** por sprint. La estructura del archivo (que ya está bien organizada por componente con comentarios `/* ============ */`) facilita esto.

```
src/styles/global.css (2800 líneas hoy)
├── :root { ...tokens... }            ← Sprint 1 reescribe esto
├── Reset                             ← Sprint 1 reescribe esto
├── Topbar                            ← Sprint 3
├── Hero                              ← Sprint 3
├── FilterBar                         ← Sprint 3
├── ModelGrid + ModelCard             ← Sprint 3
├── ModelModal                        ← Sprint 5
├── ShowcaseCarousel                  ← Sprint 5
├── ShowcaseUploadForm                ← Sprint 5
├── UploadForm + EditModelForm        ← Sprint 5
├── AuthModal                         ← Sprint 5
├── ChangePasswordModal               ← Sprint 5
├── TempPasswordModal                 ← Sprint 5
├── ResetPasswordPage                 ← Sprint 5
├── EstudiantesPage + StudentCard     ← Sprint 4
├── HexagonChart                      ← Sprint 4
├── AdminPanel                        ← Sprint 6
├── TeacherPanel                      ← Sprint 6
├── UserMenu                          ← Sprint 6
├── ProfilePage                       ← Sprint 6
├── Footer                            ← Sprint 3
└── nginx-recovery (no aplica, ignorar)
```

**Ventaja**: cada sprint deja el archivo en estado válido (parseable, sin errores). Si paramos a mitad, las secciones ya re-skinneadas funcionan y las viejas también funcionan (con paleta nueva pero estructura vieja).

### Patrón concreto de reescritura por sección

Para cada sección, el flujo es:

1. **Buscar la sección actual** (anclas como `/* ============ TOPBAR ============ */`)
2. **Reemplazar el bloque entero** con la versión nueva del UI Kit del design (literal cuando se pueda, adaptado cuando los componentes del producto difieran del kit)
3. **Conservar selectores que el design no menciona** pero que existen en el producto (`<-- LEGACY -->` comment)
4. **Type check + visual smoke**

## 2) JSX changes específicos por componente

### Sprint 1 — Foundation

**Archivos:**
- `src/styles/global.css` (solo `:root` y `body`)

**JSX:** ninguno. Sin riesgo de type-safety.

### Sprint 2 — Landing + Router

**Archivos:**
- `src/pages/ProgramaCreacionDigital.tsx` (nuevo, ~600 líneas JSX)
- `src/styles/programa.css` (nuevo, ~870 líneas)
- `src/App.tsx` (modificar router)
- `src/layouts/Layout.tsx` (cambiar NavLinks `to`)

**JSX issues anticipados:**

1. **Anchors del landing**: el HTML del design usa `<a href="#manifiesto">`. En React Router puro, eso recarga la página. Solución:
   ```tsx
   <a href="#manifiesto" onClick={(e) => {
     e.preventDefault();
     document.getElementById('manifiesto')?.scrollIntoView({behavior: 'smooth'});
   }}>Manifiesto</a>
   ```
   O más limpio: wrap en una función `<AnchorLink href="#manifiesto">`. Decisión: función helper en el mismo componente.

2. **SVG inline en el design**: el design tiene SVGs con `viewBox`, `path`, etc. JSX requiere camelCase (`strokeWidth` no `stroke-width`). Hay que transformar al pegar. Tedioso pero trivial.

3. **Atributos HTML específicos**: `data-screen-label` que tiene el design para labeling de sus screens. En el producto no aporta nada — los quito al portar.

4. **Link al `/galeria`**: el design tiene `<a href="../ui_kits/galeria/index.html">` que apuntaba al UI Kit hermano. En el producto real es `<Link to="/galeria">` de React Router. Reemplazo directo.

### Sprint 3 — Galería core

**Archivos:**
- `src/layouts/Layout.tsx` — topbar wordmark + glyph
- `src/components/Gallery.tsx` — Hero JSX completamente nuevo
- `src/components/ModelCard.tsx` — `style={{ '--cat-color': ... }}` para overlay
- `src/components/SortableModelCard.tsx` — pasa props
- `src/styles/global.css` — secciones Topbar, Hero, FilterBar, Grid, Card, Footer

**JSX issues:**

1. **Hero estructura nueva**: el `<h1>` actual de Gallery.tsx es plano. El nuevo tiene 3 `<span class="hero-line">` con múltiples `<em>`, `<s>`, `<span class="hero-bubble">` etc. Reescribir el JSX completo del Hero. ~50 líneas.

2. **`Layout.tsx` topbar wordmark**: hoy es `<NavLink to="/" className="topbar-brand"><span>✦</span> Galería 3D</NavLink>`. Cambia a `<NavLink to="/galeria" className="topbar-brand"><span className="topbar-glyph"></span><span className="topbar-wordmark">Galería 3D</span></NavLink>`. El sufijo "· Estudio CD4" lo agrega el CSS via `::after`. Trivial.

3. **Overlay categoría**: el `ModelCard.tsx` actual pasa `accent` como prop. Lo extiendo a setear `style={{ '--cat-color': accentColor }}` en el `<div className="model-card-thumb">`. Cambio mínimo.

### Sprint 4 — Students + Hex

**Archivos:**
- `src/components/StudentCard.tsx` — re-estructura JSX según kit (avatar inicial, hex centrado, bio card noir)
- `src/components/HexagonChart.tsx` — cambia colores hardcoded
- `src/components/EstudiantesPage.tsx` — layout editorial header

**JSX issues:**

1. **HexagonChart colores**: hoy tiene `fill="rgba(0,255,136,0.15)"` y `stroke="#00ff88"` (verde) hardcoded. Cambiar a `fill="rgba(26,60,255,0.16)"` y `stroke="#1a3cff"` (cobalt). 4 valores a tocar en el JSX. Decisión D aprobada.

2. **StudentCard estructura**: el componente actual probablemente tiene avatar con icono o foto, el kit usa **inicial** del nombre en cobalt. Si el componente actual ya soporta inicial fallback, drop-in. Si no, agregar `const initials = name.split(' ').slice(0,2).map(p => p[0]).join('').toUpperCase()`.

3. **Bio links**: el kit usa SVGs específicos para ArtStation/Instagram. Verificar si los del producto ya están bien.

### Sprint 5 — Modales y forms

**Archivos:** muchos componentes; sin guía del kit excepto AuthModal.

**JSX issues:**

1. **ModelModal**: el componente más grande y complejo. Re-skin sin cambiar lógica:
   - Conserva: lógica de likes/comments/auth, integración con ShowcaseCarousel, Suspense para R3F
   - Cambia: clases CSS (asumiendo se mapean a `.modal-overlay`, etc.), tipografía interna, paleta
   - **Trampa**: `modal-thumb-placeholder` actual usa background dark — cambiar a `var(--surface)` editorial. Pero el placeholder es solo para el loading inicial — verificar que el contraste del spinner sigue siendo legible.

2. **ShowcaseCarousel**: el componente acabamos de armarlo en v3.3.0. Cambiar el cyan iluminado (chip activo) por cobalt. Mantener flip 3D intacto. CSS-only.

3. **UploadForm**: el dropzone tiene Canvas R3F embebido para preview + ThumbnailCapture. **No tocar la lógica del Canvas**, solo el styling del wrap.

4. **PROTOTYPE_GUARD**: aún hay flag `false` en `ShowcaseUploadForm.tsx`. NO se toca (eso es del incidente anterior, ya en false).

### Sprint 6 — Admin/Teacher panels

**Archivos:**
- `AdminPanel.tsx`, `TeacherPanel.tsx`, `UserMenu.tsx`, `ProfilePage.tsx`

**JSX issues**: lower-risk porque los componentes son tablas + forms estándar. Aplicar Decálogo Isabella mecánicamente. La tabla `AdminPanel.tsx` tiene scroll horizontal — verificar que el padding nuevo no rompe el layout.

### Sprint 7 — QA + cleanup

Sin JSX changes. Solo:
- Eliminar `_inspect_design/` (no commiteado pero ocupa disco local)
- Agregar al `.gitignore` por si acaso
- Build + smoke + cierre

## 3) Type-safety

**Cambios en interfaces TS** (anticipados):

1. `ModelCardProps` — agregar `categoryColor?: string` o usar el `accent` existente como CSS var inline. **Recomiendo**: usar `accent` existente, solo cambiar cómo se aplica (de `style={{color: accent}}` a `style={{'--cat-color': accent}}`).

2. `LayoutProps` — ninguno. Layout sigue siendo `<Outlet/>` wrapper.

3. `ProgramaCreacionDigitalProps` — componente nuevo, sin props (es página standalone con datos hardcoded por ahora, no fetcha de API).

4. CSS variables custom — TS strict no las valida por default. Para mejor DX podríamos declarar `interface CSSProperties { '--cat-color'?: string }` global, pero es overkill. **No lo hago**.

**Comandos de validación:**

```bash
npx tsc --noEmit                # type check sin emitir
npx tsc --noEmit --strict       # ya está en strict por config (no requiere flag)
```

Esto pasa hoy. Después de cada sprint, **antes del commit**, ejecutar.

## 4) Trampas técnicas predichas

### Trampa 1 — Cascade de specificity del CSS legacy

El `global.css` actual tiene reglas como `.modal-overlay { background: rgba(0, 0, 0, 0.8); }` heredadas del dark theme. Si la nueva sección AuthModal define `background: rgba(13, 13, 13, 0.55)` pero deja la regla vieja activa, queda doble declaración. **Mitigación**: cuando reescribo una sección, BORRO la sección vieja completa primero, no comento — borro.

### Trampa 2 — Fuentes Google no aplicadas en build

Si el `@import url('https://fonts.googleapis.com/css2?...')` está en el CSS, Vite lo respeta. Pero algunos browsers strict pueden tardar más en aplicar el font-face si el `@import` viene después del primer uso. **Mitigación**: poner el `@import` al inicio absoluto del `global.css` (línea 1).

### Trampa 3 — Hero italic "Galería" se ve cortado en mobile

Italic + `letter-spacing: -0.04em` puede hacer que la última letra ("a") se cropee con `overflow: hidden` en el container. **Mitigación**: agregar `padding-right: 0.05em` al `.hero-word--galeria` para dar respiro.

### Trampa 4 — `mix-blend-mode: multiply` en thumbnails sobre fondos claros

`mix-blend-mode: multiply` con un overlay de color claro (e.g. `acid #d6ff3a`) **oscurece** la imagen original. Para mantener el efecto sutil con cualquier categoría, el overlay debe ser oscuro o medio. Las 4 categorías nuevas tienen brillo distinto (tomato medio, cobalt oscuro, magenta medio, acid muy claro). **Para acid**: usar `mix-blend-mode: overlay` o `mix-blend-mode: soft-light` en vez de multiply. Probar visualmente y ajustar.

### Trampa 5 — Bundle includes design.tar.gz

`_inspect_design/design.tar.gz` (3.4 MB) sigue en disco local. Si por error Vite lo empaqueta (por estar dentro del workspace), el build se infla. **Mitigación**: ya está fuera de `src/` y `public/`, Vite no lo toca. Cleanup en Sprint 7.

### Trampa 6 — `must_change_password` modal no se monta en `/`

Esto lo levantó Andrés. Si el modal está en `Layout.tsx` y la landing no usa Layout, un usuario logueado con flag=true que entre directamente a `/` no ve el modal. **Mitigación**: dado que `/` es público y el visitante anónimo NO tiene `must_change_password=true`, en la práctica este caso no ocurre — pero por defensa en profundidad, agregar también el listener `onAuthStateChange` y modal en `ProgramaCreacionDigital.tsx`, o (mejor) mover el guard al router: `<Route element={<RequireNoPasswordChange/>}>`. **Recomiendo**: agregar el modal también en la landing, copy-paste defensivo. 10 líneas.

## 5) Estimación realista por sprint (mi opinión sobre las del Tech Lead)

| Sprint | TL estimó | Yo estimo | Notas |
|---|---|---|---|
| 1 Foundation | 30-45 min | **30-40 min** | OK |
| 2 Landing + router | 2-3 h | **3-4 h** | El JSX de la landing es 600 líneas; portar SVGs inline + adaptar anchors + lazy loading + CSS 870 líneas son más trabajo de lo estimado |
| 3 Galería core | 3-4 h | **4-5 h** | Hero JSX nuevo + reescritura de 5 secciones de global.css + overlay sobre imagen real (trampa 4) son más trabajo |
| 4 Students + hex | 1-2 h | **1-2 h** | OK — los cambios son acotados |
| 5 Modales y forms | 2-3 h | **3-4 h** | Hay 8 componentes en este sprint y la mayoría sin guía. La inferencia + validación visual de cada uno suma |
| 6 Admin panels | 1-2 h | **2-3 h** | AdminPanel tiene tabla con muchas células — el padding y borders editoriales requieren ajustes finos |
| 7 QA + cleanup | 1-2 h | **2-3 h** | Si Andrés valida los 20 flujos + comité Valentina + ajustes de hallazgos, son 2-3h, no 1-2 |
| **Total** | **10-15 h** | **15-21 h** | Más cercano a 2-3 días de trabajo enfocado |

## 6) Estrategia de commits

Coincido con el plan del Tech Lead: **un commit por sprint cerrado**. Formato:

```
feat(rebrand): Sprint N — descripción concisa

- Cambios visuales o de código resumidos
- Archivos relevantes
```

**Importante**: NO commitear cambios temporales (vite.config a localhost, archivos de test) accidentalmente. Cada commit revisado con `git diff --stat` antes de `git commit`.

## Output del informe

**Decisiones que aporto al comité:**

1. ✅ **Estrategia**: reescritura del `global.css` por secciones (no archivo completo). Mantiene el archivo válido durante el trabajo.
2. ✅ **JSX changes** mapeados por sprint con riesgos específicos identificados
3. ✅ **TypeScript**: `npx tsc --noEmit` antes de cada commit como DoD obligatorio (coincide con Andrés)
4. ✅ **6 trampas técnicas** documentadas con mitigación
5. ⚠️ **Re-estimación**: 15-21h totales (vs 10-15h del plan original). Es necesario para no quedarme corto

**Recomendación clave**: aprobar Sprint 1 al cierre del comité. **Es el sprint más seguro** (solo tokens, sin JSX), demuestra que el pipeline funciona, y desbloquea los siguientes.

**Banderas que escalo al comité:**
- Trampa #6 (modal forzado fuera de Layout) → coordinar con Andrés en Sprint 2
- Trampa #4 (multiply en acid) → coordinar con Isabella en Sprint 3

**Mi estimación de trabajo**: protagonista en Sprint 2, 3, 5, 6. Soporte en Sprint 1, 4. Total **12-15h** de mi tiempo.
