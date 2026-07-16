---
autor: Isabella Moreno Ríos
cargo: Diseñadora Frontend 3D
fecha: 2026-05-28
tema: Auditoría visual / fidelidad — landing del Programa (handoff Claude Design)
estado: revision
---

# Auditoría Visual — Landing PCD v2

## Veredicto

🟡 **Aprobado con observaciones.** El port respeta el diseño 1:1 a nivel de
CSS (es prácticamente el mismo stylesheet con tokens renombrados). Mi
preocupación no es la fidelidad del código sino la **verificación visual
real**, que NO se ha hecho — solo se compiló, nadie miró la página renderizada.

## Contexto importante

El diseño de Claude Design fue calibrado por Carlos a **mano, pixel a pixel**,
sobre un canvas de **1436px exactos** (el frame del Figma). Todo el chat de
Design fue Carlos ajustando posiciones: "bajá 30px", "subí 100", "anclá al
bloque de color en %". Esas posiciones absolutas y porcentuales están
calibradas para ese ancho.

## 🟡 Riesgo — calibración atada a 1436px

- El `.pcd-page` tiene `max-width: 1436px` centrado, así que en pantallas
  grandes el contenido se capa correctamente. ✅
- Los anclajes de imágenes de ejes están en **porcentajes** relativos al
  bloque de color (`left: 9.8%`, `bottom: -25.2%`, etc.) — esto escala bien
  proporcionalmente. ✅
- **PERO** el `.pcd-hero__photo` (proyecto-1) usa `top: -454px` y
  `right: -120px` en **píxeles absolutos**. Esto fue calibrado a 1436px. En
  viewports entre 980px y 1436px, donde el hero escala pero la foto mantiene
  px fijos, la intersección con la línea negra puede desfasarse. Solo se ve
  bien exactamente a 1436px. **Hay que verificar el rango intermedio.**

## 🟡 Verificación visual pendiente (lo más importante)

Nadie ha abierto la página renderizada. Necesito ver, mínimo:
- Hero a 1436px, 1200px, 980px (breakpoint), móvil
- Los 3 ejes color-block: que las imágenes (proyecto-3/5/6) caigan donde
  Carlos las ancló y no desborden raro
- El carrusel de docentes: que se vean 3 cards + peek de la 4ta, hover swap
  `_Init`→`_End` sin salto de escala/posición (fue un dolor en el chat de Design)
- Los stickers (Like/Idea/Love) asomando entre cards
- La sección Estudia: bullets (Estrategia cobalt, FUTURO tomato) sobre la foto
- Los modales de docentes centrados

Esto es trabajo de Andrés con el preview, pero como diseñadora **no firmo la
fidelidad sin ver la página**. El CSS puede ser idéntico y aun así romperse
por cómo React monta los estilos o por las rutas de WebP.

## 🟡 Pérdida de contenido en móvil

`.pcd-axis__image { display: none }` en `<980px` — las imágenes de los 3 ejes
desaparecen en móvil. Es intencional del diseño original (evita desbordes),
pero significa que un prospecto en celular no ve las imágenes de proyectos en
la sección Programa. Anotarlo; quizás más adelante una variante móvil.

## 🟢 Identidad visual coherente

Las tipografías (DM Serif Text italic, Zalando Sans, Rubik Bubbles, Noto Serif
para la estrella ✺) ya están en el CDN del proyecto. El lenguaje editorial
color-block es coherente con la galería. La paleta oficial (cobalt/acid/tomato)
es la fuente de verdad del Figma. ✅

## 🟢 WebP con alpha

Verifiqué conceptualmente: los PNG con transparencia (docentes, stickers,
logos, proyecto-1) se convirtieron a WebP con alpha preservado. La calidad 82
para fotos y lossless para stickers/logos es la decisión correcta.

## Recomendaciones para el acta

1. **Bloqueante:** verificación visual de la página renderizada (con Andrés)
   en al menos 3 anchos antes del commit. No firmo fidelidad a ciegas.
2. Revisar el `.pcd-hero__photo` con px absolutos en el rango 980-1436px.
3. Anotar la pérdida de imágenes de ejes en móvil como decisión consciente.

— Isabella Moreno Ríos, Diseñadora Frontend 3D
