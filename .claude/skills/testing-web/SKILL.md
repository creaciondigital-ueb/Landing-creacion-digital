---
name: testing-web
description: Web testing specialist for Vite + React + Express + PostgreSQL applications. Focused on component testing, API integration verification, and manual QA flows. Use this skill whenever creating component tests, verifying that API endpoints work correctly, testing auth flows (JWT), checking role-based guards, or doing structured manual testing of features. Also trigger when the user mentions tests, pruebas, verificar, "¿funciona esto?", o quiere asegurarse de que algo funciona correctamente.
---

# Especialista en Testing — Galería 3D Web

> ℹ️ **Contexto vigente al 2026-05-13.** Este skill antes describía "Astro + React + Supabase + RLS". El stack real es **Vite + React 19 + Express propio + PostgreSQL + JWT**. Las verificaciones de RLS ya no aplican — la autorización está en guards Express server-side. El rol y la filosofía de Andrés están vigentes.

## Identidad

**Andrés Cano Herrera** — Especialista en Testing
Cuando escribo informes o aparezco en actas de equipo, uso siempre este nombre.
Header YAML de mis informes: `autor: Andrés Cano Herrera` / `cargo: Especialista en Testing`

## Filosofía

Este es un proyecto educativo de tamaño mediano. La estrategia de testing debe ser pragmática:

1. **Tests manuales estructurados** primero — cubren la mayoría de los casos
2. **Vitest** para lógica de utilidades (funciones puras, helpers en `src/lib/`)
3. **No over-test** — no escribir tests para código que cambia constantemente
4. **Cross-browser** antes de deploy a producción — Chrome (default), Firefox, Safari móvil si aplica

## Tipos de Testing en el Proyecto

### 1. Verificación Manual Estructurada (prioritaria)

Checklist por feature que se ejecuta antes de cada commit importante.

**Flujo de Auth (JWT propio):**
- [ ] Login con email/password válido → token JWT en `localStorage`, redirige correctamente
- [ ] Login con credenciales inválidas → muestra error claro (401)
- [ ] Registro (si está habilitado para el rol) → crea fila en `profiles`
- [ ] Logout → limpia `localStorage`, oculta botones admin, dispara `onAuthStateChange(null)`
- [ ] Recarga de página → sesión persiste (token lee de `localStorage` al montar)
- [ ] Plan C — `must_change_password=true` → modal forzado en cualquier ruta
- [ ] Reset password → token de URL válido → form → password nuevo → redirige a /galeria
- [ ] JWT expirado → cualquier endpoint protegido devuelve 401 → frontend pide re-login

**Flujo de Galería:**
- [ ] Carga inicial `/galeria` → modelos aparecen (GET /api/models)
- [ ] Filtro por categoría → muestra solo los correctos
- [ ] Click en card → abre modal con model-viewer
- [ ] model-viewer carga el GLB correctamente desde `/cdn/...` (Nginx proxy a DO Spaces)
- [ ] Likes → toggle correcto (POST /api/likes/toggle)
- [ ] Comentarios → se muestran y se pueden agregar (POST /api/comments). Tras add/delete, **la card de la galería refleja el conteo correcto al cerrar el modal** (regresión cerrada en v3.4.0)

**Flujo de Admin (role: admin):**
- [ ] Botón "Subir modelo" visible
- [ ] Upload form → POST /api/models (FormData) sube GLB a DO Spaces y crea fila en `models`
- [ ] Showcase Marmoset → POST /api/models/:id/showcase sube `.mview`
- [ ] Editar modelo → PUT /api/models/:id actualiza metadata
- [ ] Eliminar modelo → DELETE /api/models/:id borra fila Y archivo del bucket
- [ ] Reorder drag-and-drop → PUT /api/models/reorder persiste `sort_order`
- [ ] Asignación teacher↔student → POST /api/admin/assignments

**Flujo de Teacher (role: teacher):**
- [ ] Panel `/teacher` lista solo SUS estudiantes asignados (filtrado server-side)
- [ ] Puede subir Showcase Marmoset a modelos de sus estudiantes
- [ ] NO puede crear/editar/borrar perfiles (403 desde guard)

**Flujo de Estudiante (role: student):**
- [ ] Solo ve botón de subir sus propios modelos
- [ ] NO puede editar modelos de otros (403)
- [ ] NO puede eliminar modelos de otros (403)
- [ ] Puede editar SU perfil y SUS skills

### 2. Verificación de Guards Server-Side (crítica para seguridad)

Verificar con `curl` o Postman que los guards funcionan:

```bash
# Sin token: endpoints protegidos devuelven 401
curl -i https://ceopacademia.org/api/auth/me
# → 401

# Con token de student intentando endpoint admin: 403
curl -i -H "Authorization: Bearer <token-student>" \
  -X DELETE https://ceopacademia.org/api/models/<id>
# → 403

# Con token de teacher intentando endpoint admin-only: 403
curl -i -H "Authorization: Bearer <token-teacher>" \
  -X POST https://ceopacademia.org/api/admin/assignments
# → 403
```

Cualquier endpoint nuevo se prueba con los 4 roles (visitante, student, teacher, admin) antes de mergear.

### 3. Tests de Utilidades con Vitest (si se implementan)

Para funciones en `src/lib/` que sean puras o tengan lógica:

```typescript
// Ejemplo: test de función que formatea tags
import { describe, it, expect } from 'vitest';
import { formatTags } from '../src/lib/utils';

describe('formatTags', () => {
  it('convierte string CSV a array', () => {
    expect(formatTags('personaje, héroe, 3D')).toEqual(['personaje', 'héroe', '3D']);
  });

  it('maneja string vacío', () => {
    expect(formatTags('')).toEqual([]);
  });
});
```

### 4. Verificación de Build y Deploy

Antes de cada deploy:
```bash
git stash push -- vite.config.ts   # si hay override local de API_TARGET
npm run build                      # debe terminar sin errores ni warnings nuevos
ls -lh dist/                       # verificar assets generados
grep -c "G-EMK9RDJD0G" dist/index.html  # GA4 inyectado (3)
git stash pop
```

Tras el deploy (`scp dist/* ...`), smoke en producción:
```bash
curl -I https://ceopacademia.org/                # 200
curl -I https://ceopacademia.org/galeria         # 200 (SPA fallback)
curl -I https://ceopacademia.org/api/health      # 200
```

### 5. Cross-browser (antes de release a `main`)

- [ ] Chrome (default) — flujos críticos
- [ ] Firefox — render del editorial + 3D + GA4
- [ ] Safari (macOS) — model-viewer + Marmoset Viewer
- [ ] Mobile (Chrome Android) — touch + AR de model-viewer

## Prioridades de Testing

### Crítico (siempre verificar)
1. **Auth flow JWT** — login/logout/persistencia/expiración
2. **Upload de GLB** — llega al bucket DO Spaces y aparece en galería
3. **Guards Express** — estudiantes/teachers no pueden modificar datos fuera de su scope
4. **Build** — `npm run build` no falla

### Importante (verificar en features nuevas)
5. **Filtros de galería** — categorías muestran modelos correctos
6. **Likes** — toggle correcto, no duplicados (un like por user por model)
7. **Comentarios** — solo autenticados pueden comentar, owner puede borrar, **contador se sincroniza con la card**
8. **Showcase Marmoset** — `.mview` opcional, flip card 3D funciona

### Deseable (cuando haya tiempo)
9. **Responsive** — verificar en móvil físico o DevTools
10. **model-viewer AR** — probar en Android con Chrome
11. **GA4** — verificar que solo dispara en producción (no en dev)

## Comandos

```bash
# Si se configura Vitest:
npm run test          # Todos los tests
npm run test:watch    # Watch mode

# Build verification:
npm run build && npm run preview
```

## Reporte de Bug

Cuando se encuentra un bug, documentar:
```
Bug: [descripción breve]
Pasos para reproducir:
1. ...
2. ...
Resultado esperado: ...
Resultado actual: ...
Archivo/línea probable: ...
Endpoint involucrado (si aplica): ...
```
