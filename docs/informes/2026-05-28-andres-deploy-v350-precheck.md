---
autor: Andrés Cano Herrera
cargo: Especialista en Testing
fecha: 2026-05-28
tema: Pre-check testing deploy v3.5.0 — landing del Programa
estado: revision
---

# Pre-check Testing v3.5.0

## Veredicto

🟡 **Apruebo con un riesgo registrado.** La landing pasó verificación funcional
completa en preview (Chromium) durante la mesa de desarrollo. El **smoke
cross-browser (Firefox/Safari) NO se ejecutó** — Carlos decidió asumirlo como
riesgo para no bloquear el deploy de hoy. Lo dejo formalmente registrado.

## 🟡 Riesgo asumido — cross-browser

Features con matices entre navegadores, NO verificados en Firefox/Safari:
- `<dialog>.showModal()` — Chrome 37+, FF 98+, Safari 15.4+. Riesgo bajo en navegadores actuales.
- `:has()` (scroll-lock del body con modal abierto) — Chrome 105+, FF 121+, Safari 15.4+. Si falla en un FF viejo, el fondo scrollea con el modal abierto (degradación menor, no rotura).
- `mix-blend` — no se usó al final.
- `scroll-snap` del carrusel — soporte universal.

**Mitigación:** si aparece un bug en Firefox/Safari post-deploy, se parchea en
caliente (la landing es CSS/JSX, sin backend). El peor caso es cosmético, no
funcional. Recomiendo que Carlos abra la landing en su Firefox/Safari en las
primeras horas post-deploy.

## ✅ Verificado en preview (Chromium) — mesa de desarrollo

- Hero, 3 ejes color-block, marquees, carrusel docentes, modales (abrir/cerrar/
  scroll-lock), proyectos, estudia, footer
- Responsive: 1040px y 375px sin recorte de texto ni overflow horizontal
- Hamburguer, título centrado, footer 3-col en móvil
- 5 bugs encontrados y corregidos (botones invisibles, recorte de texto x2,
  footer desktop, subrayado modal JD)

## Checklist post-deploy (ejecutar tras el scp)

- [ ] `https://ceopacademia.org/` carga la landing nueva (no la vieja cacheada → hard refresh)
- [ ] Hero + ejes + carrusel + modales funcionan
- [ ] "VER PROYECTOS" y footer "Galería 3D"… (ojo: footer ahora dice "Manifiesto") → `/galeria` sin reload
- [ ] APLICA AHORA (header + CTA) abre unbosque.edu.co
- [ ] Assets cargan (`/programa/img/*.webp` y los 2 png de logos)
- [ ] `/galeria` con paleta nueva sin regresión (badges, roles, botones)
- [ ] Plan C: usuario `must_change_password=true` en `/` → modal forzado

## Recomendación al acta

Aprobado con el riesgo cross-browser registrado. Smoke post-deploy obligatorio
en Chrome; Firefox/Safari recomendado en las primeras horas.

— Andrés Cano Herrera, Especialista en Testing
