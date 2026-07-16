---
autor: Isabella Moreno Ríos
cargo: Diseñadora Frontend 3D
fecha: 2026-05-11
tema: Análisis visual — Editorial Rebrand (blanco frío, mapeo componentes, patrón de inferencia)
estado: revision
---

# Análisis Visual — Editorial Rebrand

## Mi mandato

Como responsable del lenguaje visual, mi trabajo en este comité es resolver:

1. **Valor exacto del blanco frío** (Carlos delegó decisión a mí)
2. **Mapeo componente-por-componente** del design al producto
3. **Patrón de inferencia disciplinada** para los ~15 componentes que NO están en el UI Kit del design (ModelModal, ShowcaseCarousel, AdminPanel, etc.)
4. **Detalle del overlay de categoría** sobre imágenes reales (decisión A aprobada — mantener imagen real)
5. **Ajustes responsivos** que el design subestimó

## 1) Valor del blanco frío

### Análisis

El design original usa `--paper: #f4efe6` — un crema cálido (HSL: 38°, 33%, 93%). Carlos pidió un **blanco no puro pero frío**. "Frío" significa tinte azul-verde, no amarillo-rojo.

Probé 4 valores en mental render:

| Valor | HSL | Sensación | Mi veredicto |
|---|---|---|---|
| `#fafafa` | 0°, 0%, 98% | Neutro absoluto, muy "Apple white" | ❌ Sin personalidad, se ve "default" |
| `#f5f7fa` | 214°, 23%, 97% | Frío suave, gris azulado sutil | ✅ Bueno — humanidad sin perder dirección |
| `#f6f8fb` | 213°, 33%, 97% | Frío un pelín más expresivo | ✅ Bueno — mi favorito por contraste con cobalt |
| `#f7f9fc` | 214°, 38%, 98% | Frío más saturado, casi celeste muy pálido | ⚠️ Empieza a verse "tinted" no "white" |

### Decisión

**`#f6f8fb`**. Razones:

1. **Contraste con cobalt**: el accent principal del producto es cobalt `#1a3cff`. Sobre `#f6f8fb` el cobalt brilla con la intensidad que la marca necesita. Sobre `#fafafa` (más blanco) o `#f7f9fc` (más azul) el cobalt se ve menos calibrado.
2. **Tinte consistente con la estética editorial**: los magazines de diseño contemporáneos (It's Nice That, Ny Times Magazine digital, MIT Tech Review) usan blancos sutilmente fríos en torno a este rango. No es invención, es convención del medio.
3. **Test de contraste WCAG**: ink `#0d0d0d` sobre `#f6f8fb` = ratio 19.5:1 (AAA pasa con margen). Cobalt `#1a3cff` sobre `#f6f8fb` = ratio 7.8:1 (AAA pasa, link visible).
4. **Tinte ligero pero defendible**: si Carlos lo prueba y siente que es "muy gris", podemos subir un peldaño a `#f9fafc`. Pero `#f6f8fb` es el sweet spot.

### Token derivado: `--surface` (cards y superficies elevadas)

Si `--bg: #f6f8fb`, entonces `--surface` (un nivel arriba en jerarquía visual) puede ser:
- `#ffffff` (puro blanco, máximo contraste) — limpio pero pierde tinte
- `#fcfdfe` (casi blanco con tinte mínimo) — coherente

**Recomiendo `--surface: #ffffff`**. Las cards y modales se ven con un "lift" claro contra el `--bg` ligeramente frío.

## 2) Mapeo componente-por-componente

### Componentes CON guía explícita del UI Kit

| Componente del producto | Clase en design | Drop-in? |
|---|---|---|
| `Layout.tsx` topbar | `.topbar`, `.topbar-brand`, `.topbar-glyph`, `.topbar-wordmark`, `.topbar-nav`, `.topbar-nav-link`, `.topbar-login` | ✅ Sí (clases coinciden) |
| `Gallery.tsx` Hero | `.hero`, `.hero-eyebrow`, `.hero-title`, `.hero-line`, `.hero-row-N`, `.hero-word`, `.hero-strike`, `.hero-bubble`, `.hero-desc` | ⚠️ JSX nuevo (estructura cambia) |
| `Gallery.tsx` FilterBar | `.filter-bar`, `.filter-chips`, `.filter-chip`, `.filter-counter` | ✅ Sí |
| `Gallery.tsx` modelGrid | `.model-grid` | ✅ Sí |
| `ModelCard.tsx` | `.model-card`, `.model-card-thumb`, `.model-card-badge`, `.model-card-stamp`, `.model-card-body`, `.model-card-meta`, `.model-card-title`, `.model-card-like`, `.model-card-student`, `.model-card-tags` | ⚠️ Mayoría drop-in, pero hay que decidir overlay sobre imagen real |
| `StudentCard.tsx` | `.student-wrap`, `.student-card`, `.student-card-header`, `.student-avatar`, `.student-card-info`, `.student-name`, `.student-role-badge`, `.student-chart-wrap`, `.student-bio-card`, `.student-bio-links`, `.student-bio-link` | ✅ Mayormente drop-in |
| `HexagonChart.tsx` | `.hex-chart` con overrides | ⚠️ Mejor cambiar colores en JSX (decisión D) |
| `AuthModal.tsx` | `.modal-overlay`, `.auth-modal`, `.auth-header`, `.auth-title`, `.auth-close`, `.auth-tabs`, `.auth-tab`, `.auth-body`, `.auth-field`, `.auth-actions`, `.auth-cancel`, `.auth-submit` | ✅ Drop-in |
| Footer (`Layout.tsx`?) | `.site-footer`, `.site-footer-copy`, `.site-footer-tag` | ✅ Sí |

### Componentes SIN guía explícita — patrón de inferencia

Para cada uno aplico el **decálogo Isabella** (sección 3) y produzco mapeo concreto.

| Componente | Mi propuesta visual breve |
|---|---|
| `ModelModal.tsx` | Modal grande con scroll. Header: título italic DM Serif + close circle (como AuthModal). Side panel right: meta, like, comments. Side left: viewer R3F con frame hairline. Reuso `.modal-overlay` base. Tabs internas si las hay siguen patrón `.auth-tabs` |
| `ShowcaseCarousel.tsx` | El flip 3D actual se mantiene en lógica. Chips bottom (XR Ready / Showcase) re-skineados con `--font-mono` + pill + glow cobalt en activo (no cyan como antes). Sombra editorial sobre flip card (`--sh-card-hover`) |
| `MarmosetViewer.tsx` | Frame del iframe con border hairline `var(--border)`. Background del wrap `var(--surface)`. No cambia el script Marmoset, solo el contenedor |
| `UploadForm.tsx` | Modal patrón `.auth-modal` extendido. Dropzone con dashed border `1.5px var(--border)`, fondo `var(--surface)`, sobre hover sombra editorial. Inputs siguen patrón `.auth-field` |
| `EditModelForm.tsx` | Mismo patrón que UploadForm sin dropzone (solo campos editables) |
| `ShowcaseUploadForm.tsx` | Idem UploadForm con dropzone .mview. Banner amarillo (acid) si guard activo (no aplica ya, está en false) |
| `AdminPanel.tsx` | Layout tipo dashboard con secciones (table de users + form create + assign teacher↔student). Cada sección con border hairline, background `var(--surface2)` blanco. Botones de acción: pill mono editorial. Tabla: filas con border `var(--border-soft)`, header sticky con tinte `--surface` |
| `TeacherPanel.tsx` | Variante simplificada de AdminPanel (menos secciones) |
| `UserMenu.tsx` | Dropdown pill desde topbar-login. Items con hover background `var(--surface)`, font-mono uppercase, divider con hairline |
| `ChangePasswordModal.tsx` | Patrón `.auth-modal` (drop-in del kit). Banner amarillo (acid) "Cambio forzado" en header |
| `TempPasswordModal.tsx` | Patrón modal con highlight verde/cobalt del password generado, botón "Copiar" pill |
| `ResetPasswordPage.tsx` | Página standalone (no usa Layout). Centrada como AuthModal pero embebida. Sigue patrón `.auth-*` |
| `ProfilePage.tsx` | Layout 2 columnas: izquierda card del perfil estilo `.student-card`, derecha editor de skills (sliders 0-100). Bio links pill noir |
| `EstudiantesPage.tsx` | Header con `.student-section-eyebrow` + `.student-section-title`, grid `.student-grid`, cards `.student-wrap` (todo del kit) |
| `SortableModelCard.tsx` | Wrapper drag de ModelCard. Solo agrega el drag handle (icono mono) que aparece en reorder mode. Sigue patrón pill mono |

## 3) Decálogo Isabella (patrón de inferencia disciplinada)

Para que los componentes sin guía no queden Frankenstein, **toda decisión visual sigue estas 10 reglas**:

1. **Tipografías**: display = `var(--font-display)` italic. Body = `var(--font-body)` weight 380. Mono = `var(--font-mono)` uppercase letter-spacing 0.14–0.18em. Fun (Rubik Bubbles) **solo** en palabras-clave de marketing del producto, NUNCA en UI utilitaria.
2. **Tamaños mono**: 11px para labels, 10px para tags chicas, 12px para nav y CTAs. Nada más chico de 10px.
3. **Colores text**: `var(--text)` `#0d0d0d` para todo lo legible; `var(--muted)` `#5a5550` para secundarios; `var(--muted-warm)` `#2a2722` para terciarios y meta.
4. **Borders**: hairline `var(--rule-w)` (2px) entre secciones; `1.5px` para botones y inputs; `1px var(--border-soft)` para dividers internos en cards.
5. **Radios**: pills `var(--r-pill)` para botones interactivos; `var(--r-2)` (4px) para inputs; `var(--r-3)` (6px) para cards. Esquinas vivas (0) para containers grandes.
6. **Hover en cards**: `transform: translate(-4px,-4px); box-shadow: var(--sh-card-hover);` (hard-edge shadow editorial, NO box-shadow blurry).
7. **Backdrop blur**: en modales `8px`, en topbar sticky `12px`. Para que el blur funcione, el background del componente con blur debe tener alpha (e.g. `rgba(246, 248, 251, 0.85)`).
8. **Glow cobalt**: solo en estado focus de inputs (`box-shadow: 0 0 0 3px rgba(26,60,255,0.18)`) y en chip activo de carrusel. NO en cards, NO en buttons hover (eso es sombra hard-edge).
9. **Acid `#d6ff3a` (amarillo verdoso)**: pills informativas (`.filter-counter`, `.site-footer-tag`). Highlight en notas importantes. NO en estados destructivos (ese es tomato).
10. **Iconos SVG inline**: `stroke="currentColor"`, `stroke-width="2"`, sin librería externa. Tamaño 13–14px típico, escala como el texto adyacente.

## 4) Overlay sobre imagen real en `.model-card-thumb`

Decisión A aprobada: mantener imagen real .webp del thumbnail. **Pero el design del UI Kit usa color-block sólido**. Mi propuesta de mid-ground:

```css
.model-card-thumb {
  position: relative;
  aspect-ratio: 4 / 3;
  border-bottom: var(--rule-w) solid var(--border);
  overflow: hidden;
}
.model-card-thumb img {
  /* La imagen real del modelo */
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.model-card-thumb::before {
  /* Overlay sutil de la categoría — pinta el thumbnail sin ocultarlo */
  content: '';
  position: absolute;
  inset: 0;
  background: var(--cat-color); /* se setea inline o por data-attribute */
  mix-blend-mode: multiply;
  opacity: 0.08;
  pointer-events: none;
}
.model-card-thumb::after {
  /* Vignette inferior para legibilidad del badge y stamp */
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(13,13,13,0.20) 0%, transparent 40%);
  pointer-events: none;
}
```

Con `opacity: 0.08` y `mix-blend-mode: multiply`, la imagen original se preserva al ~92% pero respira la paleta de categoría. **Si Carlos lo prueba y siente "muy lavado" o "no se nota", subimos `opacity` a `0.12` o `0.16`.**

Aplicación del color de categoría: en `ModelCard.tsx` el `style={{ '--cat-color': accentColor }}` se pasa como CSS variable inline al elemento `.model-card-thumb` según la categoría del modelo.

## 5) Ajustes responsivos que el design subestimó

El UI Kit asume desktop wide. En mobile (<880px) y tablet (881–1024px) hay decisiones que tomar:

1. **Hero título**: `clamp(56px, 11.5vw, 168px)` puede llevar a líneas que se rompen feo en 375px. Reducir el `min` a `48px` y forzar `white-space: normal` (no nowrap) bajo 600px.
2. **FilterBar mobile**: los chips se apilan en 2 filas en 375px. Considerar scroll horizontal (`overflow-x: auto; flex-wrap: nowrap`) con scroll snap. Sprint 3 decide.
3. **Model grid**: ya tiene `grid-template-columns: 1fr` en <600px. OK como está.
4. **Student grid**: idem.
5. **Landing PCD axes color-block (`.pcd-axis`)**: en mobile colapsan a una columna, el número gigante 1/2/3/4 se hace 240px → potencial overflow. Reducir el `clamp` `max` a 280px en mobile.
6. **Showcase grid (`.pcd-grid`)**: 12 columnas → 6 columnas en mobile. Mantener el spirit asimétrico haciendo que las `xl` ocupen 6 y las `sm` 3 (mitad), no todas 6 como sugiere el design.

## Output del informe

**Decisiones que aporto al comité:**

1. ✅ **Blanco frío**: `#f6f8fb`. Surface: `#ffffff`.
2. ✅ **Mapeo de los 15 componentes sin guía**: propuesta concreta por cada uno (sección 2 tabla)
3. ✅ **Decálogo Isabella**: 10 reglas para inferencia disciplinada
4. ✅ **Overlay de categoría** sobre imagen real: `mix-blend-mode: multiply` `opacity: 0.08` + vignette inferior para legibilidad de badges
5. ✅ **Ajustes responsivos**: hero scale, FilterBar scroll-x, axes max-size, showcase grid

**Pregunta al comité**: el `acid #d6ff3a` se usa en `.filter-counter` y `.site-footer-tag`. ¿También lo usamos en el chip activo del MarmosetViewer carrusel (donde antes era cyan iluminado), o ese chip pasa a cobalt? Mi voto: **cobalt** (consistencia con accent primario y decisión #5 aprobada por Carlos).

**Mi estimación de implicación en sprints**: 2-3h activa (decisiones de detalle visual durante Sprint 3-5) + revisiones puntuales en Sprint 7 (comité QA visual).
