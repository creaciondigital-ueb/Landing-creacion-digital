---
autor: Diego Ramírez Castellanos
cargo: Data Lead & Arquitecto de Datos
fecha: 2026-05-13
tema: Pre-check security v3.4.0 — bundle audit + secretos + credenciales
estado: revision
---

# Pre-check Security v3.4.0

## Veredicto

🟢 **Apruebo el deploy** desde el flanco security. El bundle estático que
se va a subir al droplet **no contiene credenciales productivas**, los
endpoints del backend Express ya tienen sus guards en producción (no se
tocan), y el `.env` del droplet sigue siendo la única fuente de credenciales.
Quedan **3 pendientes BG** que NO bloquean este deploy pero hay que cerrar
después.

## Auditoría del bundle `dist/` que se va al droplet

Ejecuté un grep exhaustivo sobre `dist/index.html`, `dist/assets/*.js` y
`dist/assets/*.css` buscando patrones sensibles:

```bash
grep -rEi "secret|password|api[_-]?key|access[_-]?key|do_token|jwt_secret|spaces.*key" dist/
```

**Resultado: 0 matches** fuera de nombres de componentes legítimos
(`TempPasswordModal`, `ChangePasswordModal`, `ResetPasswordPage`).

Strings sensibles esperados que sí están en el bundle (correctos):

- `G-EMK9RDJD0G` (5 ocurrencias en `index.html`) — Measurement ID público
  de GA4. No es secreto, gtag.js está diseñado para vivir en cliente.
- `ceopacademia.org` (3 ocurrencias) — guard hostname para GA4. Esperado.

Strings que SÍ buscaba y confirmé NO están:

- ❌ `JWT_SECRET` del backend
- ❌ Credenciales de DO Spaces (access key / secret key)
- ❌ Password de la DB
- ❌ Password del admin Carlos
- ❌ Tokens DO (incluso el PAT efímero del incidente)
- ❌ IP del droplet `159.203.189.167` (correcto: el frontend usa `ceopacademia.org`)

## `.gitignore` — credenciales protegidas

Verifiqué que `.gitignore` cubre:

```
.env
.env.production
backend/.env
```

`.env*` no existe en el filesystem actual (verifiqué con `ls .env*`). Las
credenciales productivas viven SOLO en:

1. `/var/www/galeria-api/.env` del droplet (acceso por SSH como root)
2. iCloud Keychain del owner (Carlos)

Esto está alineado con la disciplina post-incidente del 2026-04-30
(rotación de 4 credenciales: DB, JWT, Spaces, admin galería).

## Backend Express — guards en producción

El deploy v3.4.0 NO toca `server.js` (backend = "columna vertebral
intocable" — decisión R1 del comité editorial). Por lo tanto, los guards
`requireAuth` y `requireRole` que están corriendo en `pm2 galeria-api`
desde el release v3.3.1 siguen aplicando sin cambios.

Quick audit de endpoints según `docs/deploy.md`:

| Endpoint | Auth | Estado |
|---|---|---|
| `GET /api/health` | público | ✅ |
| `POST /api/auth/login` | público | ✅ |
| `GET /api/models` | público | ✅ |
| `POST /api/models` | requireAuth | ✅ |
| `DELETE /api/models/:id` | admin | ✅ |
| `PUT /api/models/reorder` | admin | ✅ |
| `POST /api/models/:id/showcase` | admin/teacher | ✅ |
| `GET /api/teacher/students` | admin/teacher | ✅ |
| `DELETE /api/profiles/:id` | admin | ✅ |

Sin regresiones esperadas porque ninguna línea de `server.js` cambió.

## CORS y headers

El frontend nuevo no introduce nuevos orígenes — sigue siendo same-origin
con `ceopacademia.org` para `/api/*` y `/cdn/*` (proxy Nginx). El Nginx
del droplet ya tiene la config correcta desde el runbook
`docs/runbooks/nginx-recovery.md` (resolver dinámico post-incidente
2026-04-23).

## Inputs del usuario y XSS

Verifiqué que ningún componente nuevo del rebrand usa `dangerouslySetInnerHTML`:

```bash
grep -rn "dangerouslySetInnerHTML" src/
# (0 resultados)
```

Comentarios, bio, tags, descripciones de modelos — todos se renderizan como
texto plano via React. La protección contra XSS está garantizada por React
por defecto.

## Riesgos identificados

### 🟡 GA4 puede registrar IPs y user-agents
Google Analytics 4 por defecto colecta dirección IP, user-agent y datos
agregados de navegación. Si el proyecto se difunde a estudiantes menores
de edad, conviene:

- Activar **IP Anonymization** en el panel de GA4 (Configuration → Data
  Streams → Web → Configure → More options → IP anonymization)
- Considerar agregar un aviso de cookies en el footer si la normativa
  colombiana de habeas data aplica

No bloquea el deploy. Es una recomendación post-deploy.

### 🟡 `model-viewer` puede cargar GLBs cross-origin
Los GLBs llegan via `/cdn/...` proxy a DO Spaces, que es lectura pública.
No es un riesgo nuevo — viene desde v3.0.

### 🟢 JWT en `localStorage` (no `httpOnly` cookie)
Decisión existente del backend (v3.0+). En el contexto de proyecto
educativo es aceptable. El token expira en 7 días.

## Pendientes BG (NO bloquean este deploy)

1. **Revocar DO API Token efímero del incidente 2026-04-30** — Carlos lo
   genera en el panel DO cuando lo necesite y lo revoca. Si todavía está
   activo, revocarlo en el panel de DigitalOcean.
2. **Avisar al colaborador `creaciondigital-ueb` del rename del repo**
   (`galeria-3d-clase` → `LandingCreacionDigital`) + difundir `SECURITY.md`.
3. **`SECURITY.md` puede actualizarse** para reflejar el nuevo stack
   (Express+PG+JWT en lugar de Supabase, si menciona Supabase).

## Recomendación al acta

Aprobar deploy. Sin observaciones bloqueantes del lado security. Los 3
pendientes BG se atienden con calma después del release.

— Diego Ramírez Castellanos, Data Lead & Arquitecto de Datos
