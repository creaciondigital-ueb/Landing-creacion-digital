---
autor: Claude Renard (coordinación)
cargo: Líder de Desarrollo / Tech Lead
fecha: 2026-05-28
tema: Acta de la mesa de desarrollo — reemplazo de la landing del Programa (handoff Claude Design)
estado: aprobado
---

# Acta — Mesa de Desarrollo · Landing PCD v2

## Contexto

Reemplazo completo de la landing pública `/` (`ProgramaCreacionDigital.tsx`)
con el handoff de Claude Design (9 secciones, carrusel de docentes con
modales, showcase de proyectos, paleta oficial). Incluye actualización de la
paleta oficial en `global.css` (afecta también la galería) y 20 assets WebP.

**Nota de proceso:** la implementación arrancó saltándose la convocatoria de
la mesa. Carlos lo detuvo, se convocó la mesa retroactivamente y se auditó el
desarrollo ANTES de commitear. Esta acta cierra esa revisión.

## Mesa convocada

| Especialista | Cargo | Informe |
|---|---|---|
| Natalia Vargas Ospina | Arquitecta Web | `2026-05-28-natalia-landing-pcd-arquitectura.md` |
| Isabella Moreno Ríos | Diseñadora Frontend 3D | `2026-05-28-isabella-landing-pcd-visual.md` |
| Sebastián Torres Mejía | Senior Dev React | `2026-05-28-sebastian-landing-pcd-implementacion.md` |
| Andrés Cano Herrera | Especialista en Testing | `2026-05-28-andres-landing-pcd-testing.md` |
| Claude Renard | Tech Lead | coordinación + esta acta |

## Bloqueantes levantados y su resolución

### 🔴 Bloqueante 1 — Verificación visual real (Isabella + Andrés)
"Compilar ≠ funcionar; nadie vio la página renderizada."
**Resuelto:** verificación en preview (Claude Preview / Chromium) sección por
sección contra el referente `index-print.html` que entregó Carlos. Hero, 3
ejes, carrusel, modales (abrir/cerrar/scroll-lock), proyectos, estudia,
footer. Confirmado con datos (`preview_inspect`/`preview_eval`), no solo a ojo.

**🐛 Bug encontrado en la verificación:** el reset `.pcd-page a { color: inherit }`
(especificidad 0,1,1) dejaba **invisible el texto de los 3 botones** (APLICA
AHORA header, VER PROYECTOS, CTA Estudia) — ink sobre ink. Fix: `:where(a)`
para especificidad 0. Exactamente el tipo de bug que la mesa anticipó.

### 🔴 Bloqueante 2 — Regresión de paleta en la galería (Natalia + Andrés)
La paleta oficial nueva (cobalt `#2c08ff`, tomato `#ff103e`, acid `#d1ff22`)
toca TODA la galería, no solo la landing.
**Resuelto:** verificada `/galeria` con la paleta nueva — badges acid legibles,
"VER EN DETALLE" cobalt, criatura magenta, "objetos" tachado tomato. Sin
roturas. Coherente.

## Bugs adicionales encontrados y corregidos (criterio de Carlos: el texto nunca se recorta)

- **Recorte de texto en anchos intermedios:** los ejes tenían `height: 774px`
  fijo + `overflow: hidden` → el texto de la columna derecha se cortaba al
  envolver. Fix: `min-height` + quitar overflow del eje (conservado solo en
  la columna izquierda, que recorta imágenes). La sección crece; el texto
  nunca se corta. Verificado `clipped:false` a 1040px y 375px.
- **Recorte del caption en móvil (mundo 3d):** `overflow: hidden` del bloque
  izquierdo cortaba el caption, y la regla específica del eje ganaba al reset
  móvil por especificidad. Fix: `overflow: visible` en móvil (imágenes ya
  ocultas) + reset scopeado por eje.

## Ajustes responsive solicitados por Carlos (móvil) — implementados

1. Logo del header proporcional (height fijo, width auto, sin deformar)
2. Título "no vinimos a dictar clase" centrado (sin shifts escalonados)
3. Menú del header → hamburguer con dropdown (☰ → X animada)
4. APLICA AHORA más pequeño, centrado, justo debajo del título
5. ¿quiénes somos? — "Creamos…" centrado
6. Footer en grid de 3 columnas centradas (PROGRAMA / COMUNIDAD / UNIVERSIDAD)

## Mejoras de accesibilidad

- `prefers-reduced-motion: reduce` agregado a los marquees (recomendación Andrés).

## Decisiones de contenido (Carlos)

- Footer "Programa": se mantiene **Manifiesto** (`#manifiesto`) como en el
  referente. Si más adelante hay destino real (PDF del manifiesto), se enlaza.
- Meta de proyecto-2: corregido el typo `eSTUDIO` → `ESTUDIO`.

## Follow-ups NO bloqueantes (diferibles post-deploy)

- Lazy-load de los blobs de docentes (~4MB) con IntersectionObserver (Natalia).
- Mover `.pcd-loading` a `global.css` para que el fallback de Suspense tenga
  estilo en el primer paint (Sebastián).
- `.pcd-hero__photo` usa px absolutos; revisar fino en el rango 980-1436px (Isabella).
- Doble fuente de verdad de paleta (`global.css` ↔ `programa.css`): documentado.

## ⚠️ Pendiente ANTES de producción (no resuelto en esta mesa)

- **Smoke cross-browser real (Firefox/Safari)** — el preview usado es Chromium.
  `<dialog>`, `:has()` (scroll-lock) y `mix-blend` tienen matices. Andrés lo
  marcó como bloqueante de DEPLOY (no de commit). Debe verificarlo Carlos en
  su navegador, o asumirse como riesgo en el comité pre-deploy.

## Veredicto de la mesa

✅ **APROBADO para commit a `develop`.**

🚫 **NO aprobado para deploy directo.** El deploy a producción requiere:
1. Commit a `develop` (este paso)
2. Smoke cross-browser (Firefox/Safari)
3. **Comité pre-deploy** (Mateo + Andrés + Felipe + Diego + acta), como en v3.4.0
4. Merge `develop → main` + tag `v3.5.0` + `scp` al droplet con backup/rollback

## Métricas

- Chunk landing: 5.90 → 6.44 KB gzip
- Assets: 24 MB PNG/JPG → 5.0 MB WebP (−79%)
- `tsc --noEmit` limpio · build ~5.1s · backend 0 cambios

## Firmas

✍️ Natalia Vargas Ospina — Arquitecta — Aprobado (con QA de paleta verificado)
✍️ Isabella Moreno Ríos — Frontend 3D — Aprobado (verificación visual hecha)
✍️ Sebastián Torres Mejía — Senior Dev — Aprobado a nivel código
✍️ Andrés Cano Herrera — Testing — Aprobado para commit; deploy condicionado a smoke cross-browser
✍️ Claude Renard — Tech Lead — Coordinación
