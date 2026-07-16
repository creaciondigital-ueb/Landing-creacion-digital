---
autor: Sebastián Torres Mejía
cargo: Senior Dev React (Vite)
fecha: 2026-05-28
tema: Auditoría de implementación — port HTML→React de la landing PCD
estado: revision
---

# Auditoría de Implementación — Landing PCD v2

## Veredicto

🟢 **Aprobado a nivel de código** con 2 detalles a vigilar. El port del HTML
estático + script vanilla a React es idiomático y type-safe. `tsc --noEmit`
pasa limpio, `npm run build` compila sin errores.

## 🟢 Lo que está bien resuelto

- **Modales con `<dialog>` nativo + estado React**: el patrón
  `activeDocente: string | null` + un `<DocenteModal>` que llama
  `showModal()`/`close()` desde un `useEffect` sincronizado con la prop
  `active` es correcto. Reemplaza limpiamente el script vanilla con
  `querySelectorAll` del HTML original.
- **Accesibilidad preservada**: `tabIndex={0}`, `role="button"`,
  `aria-label`, manejo de Enter/Space en las cards. El `onClose` nativo del
  `<dialog>` captura Esc y backdrop click.
- **Datos de docentes como JSX**: en vez de meter el HTML con `<strong>`
  inline vía `dangerouslySetInnerHTML` (que habría sido un riesgo XSS y un
  flag de seguridad), escribí el contenido como JSX directo. Diego lo va a
  agradecer. ✅
- **Links internos**: `<Link to="/galeria">` de React Router en lugar de los
  `href="../ui_kits/galeria/index.html"` del prototipo. Correcto.
- **Custom props CSS** (`--docente-init`/`--docente-end`) tipadas con
  `as CSSProperties`. Es un cast pero es el patrón estándar de React para
  CSS vars inline. Aceptable.

## 🟡 Detalle 1 — StrictMode y showModal()

En desarrollo, React 19 StrictMode monta/desmonta los efectos dos veces. El
`useEffect` que llama `dlg.showModal()` está guardado con `if (active && !dlg.open)`,
así que el doble-invoke no debería duplicar la apertura. **Pero no lo probé en
runtime.** Andrés debe verificar que abrir/cerrar modales repetidamente en dev
no deje el `<dialog>` en estado inconsistente. En prod (sin StrictMode doble)
no aplica.

## 🟡 Detalle 2 — 4 dialogs siempre montados

Los 4 `<dialog>` de docentes están siempre en el DOM (cerrados con
`display: none`). Es liviano y es cómo funciona `<dialog>`, pero si crece a
muchos docentes convendría renderizar solo el activo. Para 4, no es problema.

## 🟢 Sin deuda técnica nueva

- No hay `console.log` de debug.
- No hay `any` en el TypeScript.
- No hay `useEffect` con dependencias mal declaradas.
- El `ChangePasswordModal` defensivo (Plan C) se mantuvo intacto.
- No se tocó `src/lib/api.ts` ni ningún componente de la galería.

## 🟡 Nota sobre el fallback de Suspense

`App.tsx` muestra `<div className="pcd-loading">` mientras carga el chunk
lazy. Pero `.pcd-loading` vive en `programa.css`, que se carga CON el chunk —
así que en el primer paint el fallback no tiene estilos (texto plano sin
centrar). Cosmético y ya existía antes. Si molesta, mover `.pcd-loading` a
`global.css`.

## Recomendaciones para el acta

1. Andrés: probar apertura/cierre repetida de modales en dev (StrictMode).
2. No bloqueante: considerar mover `.pcd-loading` a `global.css`.
3. El código está listo para commit una vez pase la verificación visual y de QA.

— Sebastián Torres Mejía, Senior Dev React (Vite)
