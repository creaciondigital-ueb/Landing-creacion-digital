---
autor: Andrés Cano Herrera
cargo: Especialista en Testing
fecha: 2026-05-28
tema: Plan de pruebas — landing del Programa (handoff Claude Design)
estado: revision
---

# Plan de Pruebas — Landing PCD v2

## Veredicto

🟡 **No firmo todavía.** El código compila, pero **nadie ha ejecutado la
página**. Hasta no correr el preview y pasar el checklist, esto no está
verificado. Compilar ≠ funcionar. Abajo el plan que voy a ejecutar.

## Checklist funcional (pendiente de ejecutar en `npm run dev`)

### Modales de docentes
- [ ] Click en cada una de las 4 cards abre su modal correcto
- [ ] Teclado: Enter y Space sobre una card enfocada abre el modal
- [ ] Cierre con botón X
- [ ] Cierre con tecla Esc (nativo de `<dialog>`)
- [ ] Cierre con click en backdrop
- [ ] El scroll del body se bloquea con modal abierto (`:has()` selector)
- [ ] Abrir/cerrar repetido NO deja el dialog en estado inconsistente (StrictMode dev)
- [ ] El contenido (perfil, experiencia, tags) corresponde a cada docente

### Carrusel docentes
- [ ] Se ven 3 cards + peek de la 4ta
- [ ] Scroll horizontal funciona (trackpad / shift+rueda / drag)
- [ ] Hover swap `_Init`→`_End` sin salto de escala ni posición
- [ ] Stickers (Like/Idea/Love) asoman entre cards sin recortarse

### Navegación
- [ ] Nav anchors (PROGRAMA/docentes/PROYECTOS) hacen scroll a su sección
- [ ] "VER PROYECTOS" → navega a `/galeria` SIN full reload (React Router)
- [ ] "Galería 3D" del footer → `/galeria`
- [ ] APLICA AHORA (header y CTA) abre unbosque.edu.co en pestaña nueva
- [ ] Links de footer (Instagram, TikTok, FACyC, UEB) abren correctos

### Plan C (regresión)
- [ ] Login con usuario `must_change_password=true` en `/` → modal forzado aparece

### Regresión de paleta en LA GALERÍA (crítico — lo levantó Natalia)
- [ ] `/galeria` — badges de categoría con tomato nuevo `#ff103e` se ven bien
- [ ] `/estudiantes` — hexagon chart cobalto `#2c08ff`
- [ ] `/admin` — chips de rol (admin tomato, teacher magenta, student cobalt)
- [ ] Modal de modelo — botones, like, category highlight
- [ ] Botones destructivos (eliminar) con el rojo nuevo

## 🟡 Cross-browser

| Feature | Soporte | Riesgo |
|---|---|---|
| `<dialog>` showModal | Chrome 37+, FF 98+, Safari 15.4+ | bajo |
| `:has()` (scroll lock) | Chrome 105+, FF 121+, Safari 15.4+ | medio en FF viejo |
| WebP con alpha | universal hoy | nulo |
| `aspect-ratio` | universal moderno | nulo |
| `scroll-snap` carrusel | universal | nulo |

Recomiendo smoke en Chrome + Firefox + Safari móvil antes del deploy (igual
que en v3.4.0).

## 🟡 Accesibilidad — falta `prefers-reduced-motion`

Los dos marquees animados (`pcd-scroll` 28s infinito) NO respetan
`prefers-reduced-motion`. Para usuarios con sensibilidad al movimiento
(vestibular), la animación infinita es un problema de accesibilidad. **Pediría
agregar** un `@media (prefers-reduced-motion: reduce)` que pause la animación.
No bloqueante pero es buena práctica y barato.

## 🟡 UX del carrusel en desktop

El carrusel de docentes es scroll horizontal nativo. En desktop sin trackpad
(mouse de rueda vertical), scrollear horizontalmente no es obvio. El peek de
la 4ta card ayuda a insinuarlo, pero un usuario con mouse puede no descubrir
a Juan Sebastián. Lo dejo como observación de UX, no bloqueante.

## Recomendaciones para el acta

1. **Bloqueante:** ejecutar el checklist funcional completo en preview.
2. **Bloqueante:** QA de regresión de paleta en la galería (no solo landing).
3. No bloqueante pero recomendado: `prefers-reduced-motion` en los marquees.
4. Smoke cross-browser antes del deploy.

— Andrés Cano Herrera, Especialista en Testing
