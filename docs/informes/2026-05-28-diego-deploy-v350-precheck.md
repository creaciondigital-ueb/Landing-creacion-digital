---
autor: Diego Ramírez Castellanos
cargo: Data Lead & Arquitecto de Datos
fecha: 2026-05-28
tema: Pre-check security deploy v3.5.0 — landing del Programa
estado: revision
---

# Pre-check Security v3.5.0

## Veredicto

🟢 **Apruebo el deploy.** La landing es presentación estática pura: no toca
backend, endpoints, schema ni `src/lib/api.ts`. No introduce superficie de
ataque nueva. Sin secretos en el bundle.

## Auditoría del bundle

- Grep de patrones sensibles (`jwt_secret`, `do_token`, `db_pass`, access keys,
  IP del droplet) sobre `dist/` → 0 matches reales (igual que v3.4.0).
- `G-EMK9RDJD0G` (GA4) presente — Measurement ID público, no es secreto.
- La landing no consume `/api/*` salvo el flujo Plan C (auth) que ya existía y
  no cambió.

## XSS

- Verificado: **0 usos de `dangerouslySetInnerHTML`** en `ProgramaCreacionDigital.tsx`.
  El contenido de los modales de docentes (incluyendo los `<strong>` inline)
  se renderiza como JSX, no como HTML inyectado. React escapa por defecto.
- Los textos son estáticos (no vienen de input de usuario). Sin riesgo de
  inyección.

## Links externos

- Todos los `href` externos (unbosque.edu.co, instagram, tiktok) usan
  `target="_blank" rel="noopener"`. Correcto — sin riesgo de tabnabbing.

## Datos personales (docentes)

- Las fotos e información de los 4 docentes (Juan David, Vanessa, Camilo, Juan
  Sebastián) son material institucional para difusión del programa. Asumo que
  el consentimiento de uso de imagen está gestionado por la facultad (fuera de
  mi alcance técnico, pero lo señalo para que Carlos lo confirme con la FACyC
  si no está ya cubierto).
- No hay PII sensible (emails personales, documentos) expuesta en la landing.

## Backend

Confirmado: `server.js`, endpoints, guards `requireAuth`/`requireRole`, schema
PostgreSQL — **0 cambios**. El deploy no requiere `pm2 restart galeria-api`.

## Pendientes BG (sin relación con este deploy)

- Dependabot: 3 vulns (1 high, 2 moderate) — siguen abiertas desde sesiones
  anteriores. NO bloquean este deploy (son deps de build/transitive), pero
  conviene cerrarlas pronto.

## Recomendación al acta

Aprobado sin observaciones bloqueantes. Recordatorio: confirmar con la FACyC el
consentimiento de imagen de los docentes (gestión administrativa, no técnica).

— Diego Ramírez Castellanos, Data Lead & Arquitecto de Datos
