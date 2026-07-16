---
autor: Natalia Vargas Ospina
cargo: Arquitecta Web
fecha: 2026-05-28
tema: Auditoría arquitectónica — reemplazo de la landing del Programa (handoff Claude Design)
estado: revision
---

# Auditoría Arquitectónica — Landing PCD v2

## Veredicto

🟡 **Aprobado con condiciones.** El port a React es estructuralmente sano y
respeta el aislamiento del backend (no se tocó). Pero hay **un riesgo de
regresión visual de alcance global** que debe resolverse antes del commit:
el cambio de paleta en `global.css` impacta toda la galería, no solo la landing.

## 🔴 Hallazgo crítico — La paleta nueva toca TODA la galería

El desarrollo cambió los tokens de acento en `global.css`:

| Token | Antes (rebrand v3.4.0) | Ahora (handoff Design) |
|---|---|---|
| `--accent` (cobalt) | `#1a3cff` | `#2c08ff` (más saturado/oscuro) |
| `--accent2` (tomato) | `#ff5a2c` (naranja) | `#ff103e` (rojo) |
| `--acid` | `#d6ff3a` | `#d1ff22` (más verdoso) |

Estos tokens alimentan **toda la galería** (`/galeria`, `/estudiantes`,
`/perfil`, `/admin`, modales, hexagon chart, badges de categoría, roles).
Los Sprints 3-6 del editorial rebrand se diseñaron y aprobaron con la paleta
anterior. El nuevo tomato `#ff103e` es notablemente más rojo que el naranja
`#ff5a2c` — esto cambia el rol `admin`, la categoría `personaje`, los botones
destructivos y el estado `danger` en TODA la app.

Además se actualizaron ~15 valores `rgba()` hardcodeados (focus rings, hovers)
de `rgba(26,60,255,…)` → `rgba(44,8,255,…)` y `rgba(255,90,44,…)` →
`rgba(255,16,62,…)`.

**Riesgo:** una feature que debía ser "implementar la landing" terminó
modificando la identidad visual de todo el producto. Esto fue una decisión
que Carlos aprobó explícitamente ("Landing + actualizar galería también"),
así que NO es un error de scope — pero **exige QA visual de toda la galería**
antes de mergear, no solo de la landing. Es responsabilidad de Andrés/Valentina.

**Recomendación:** tratar el cambio de paleta global como un sub-entregable
con su propia verificación. Si la galería se ve mal con el tomato rojo, hay
que decidir: (a) ajustar, o (b) revertir la paleta global y dejar la nueva
solo en `programa.css` (que está aislada con tokens `--pcd-*`).

## 🟡 Doble fuente de verdad de la paleta

`programa.css` redefine la paleta como tokens `--pcd-*` (cobalt, acid, tomato)
con los mismos valores que `global.css`. Es bueno para el aislamiento (la
landing no depende de los tokens de la galería), pero significa que un cambio
futuro de paleta hay que hacerlo en **dos lugares**. Aceptable dado que son
dos productos distintos, pero hay que documentarlo para no desincronizar.

## 🟢 Code splitting — sin regresión

El chunk `ProgramaCreacionDigital` quedó en 28.95 KB / 6.44 KB gzip (antes
5.90 KB gzip). El leve aumento es por los modales y el carrusel — esperado y
aceptable. La landing sigue aislada del bundle principal vía `React.lazy`.
El `usePrefetchGaleria` sigue funcionando.

## 🟡 Estrategia de assets

Buen call la conversión a WebP (24MB → 5MB). Pero las 8 imágenes de docentes
(`_Init`/`_End`, ~400-600KB c/u = ~4MB) se cargan vía `background-image` en
pseudo-elementos `::before`/`::after`, que **no soportan `loading="lazy"`**.
Toda la sección docentes descarga sus 4MB apenas el usuario llega a esa
parte del scroll, sin diferir. Para una landing de captación (prospectos en
redes móviles) conviene un `IntersectionObserver` que active los blobs al
entrar en viewport. **No bloqueante**, pero recomendado como follow-up.

## 🟢 Backend intocado

Confirmado: cero cambios en `server.js`, endpoints, schema o `src/lib/api.ts`.
La landing es presentación pura. Respeta la regla "backend = columna vertebral".

## Recomendaciones para el acta

1. **Bloqueante:** QA visual de toda la galería con la paleta nueva (no solo landing).
2. Documentar la doble fuente de verdad de paleta (global.css ↔ programa.css).
3. Follow-up no bloqueante: lazy-load de los blobs de docentes (IntersectionObserver).

— Natalia Vargas Ospina, Arquitecta Web
