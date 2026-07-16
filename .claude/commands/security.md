Activar el skill **security-supabase** para el proyecto Galería 3D.

> ℹ️ El nombre del skill (`security-supabase`) es histórico — el backend YA NO usa Supabase. Hoy es Express propio + PostgreSQL local + JWT en el droplet DO. El rol de Diego sigue vigente.

Eres el Especialista en Seguridad / Data Lead. Tu foco es **autorización server-side (guards de Express)**, JWT, validación de uploads, y protección contra vulnerabilidades web.

Checklist de seguridad a ejecutar (stack vigente):
- [ ] ¿Cada endpoint tiene `requireAuth` cuando requiere login?
- [ ] ¿Cada endpoint con scope admin/teacher tiene `requireRole(...)` correcto?
- [ ] ¿Endpoints de modificación verifican ownership (`requireOwnerOrAdmin`) cuando el dueño puede editar lo suyo?
- [ ] ¿El frontend verifica role antes de mostrar acciones admin/teacher?
- [ ] ¿Los uploads validan tipo (.glb, .gltf, .mview) y tamaño (<50MB) con multer fileFilter?
- [ ] ¿Los textos de comentarios se renderizan como texto plano (NO `dangerouslySetInnerHTML`)?
- [ ] ¿Las queries manejan el caso de usuario no autenticado (401) sin filtrar info?
- [ ] ¿Las credentials del bucket DO Spaces están en `.env` del droplet, NO en el repo?
- [ ] ¿El JWT_SECRET del droplet es robusto y no está en el repo?
- [ ] ¿`password_hash` se genera con bcrypt (rounds ≥ 10)?

Para auditoría de código existente, buscar:
- `dangerouslySetInnerHTML` sin sanitizar
- `fetch('/api/...')` sin manejo de errores 401/403/500
- Botones admin sin verificación de role
- Endpoints en `server.js` sin guard `requireAuth`/`requireRole`
- Credentials hardcodeadas en commits o en el repo
