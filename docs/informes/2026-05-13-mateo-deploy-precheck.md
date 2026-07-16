---
autor: Mateo Gutiérrez Reyes
cargo: DevOps / Deploy
fecha: 2026-05-13
tema: Pre-check de deploy v3.4.0 — DigitalOcean Droplet + Spaces
estado: revision
---

# Pre-check Deploy v3.4.0 — DO Droplet

## Veredicto

✅ **Apruebo el deploy** del rebrand a producción. El stack DO está estable
desde el hardening post-incidente del 2026-04-30 y el runbook de Nginx con
resolver dinámico (2026-04-24). No hay precondiciones nuevas que bloqueen
el deploy.

## Stack confirmado

| Componente | Detalle | Acción del deploy |
|---|---|---|
| **Droplet** | `159.203.189.167`, Ubuntu 24.04 | No se toca |
| **Frontend** | `/var/www/galeria-frontend/` (estático servido por Nginx) | **Sí: `scp dist/*`** |
| **Backend** | `/var/www/galeria-api/`, pm2 `galeria-api` | No se toca |
| **PostgreSQL** | `127.0.0.1:5432`, db `galeria_3d` | No se toca |
| **Spaces** | `galeria-3d-files.nyc3` + CDN | No se toca |
| **Nginx** | resolver dinámico activo, SSL Let's Encrypt | No se toca |

Backend e infraestructura quedan idénticos al estado actual de producción
(tag `v3.3.1`). Esto es coherente con la decisión R1 del comité editorial:
backend = columna vertebral intocable.

## Procedimiento de deploy propuesto

### 1. Pre-flight (en local)

```bash
cd "F:/Estudio de Creacion Digital IV/Galeria"

# Verificar branch y working tree
git checkout develop
git status                          # vite.config.ts puede mostrar override local — IGNORAR
git log --oneline develop ^main     # commits que van a producción

# Build limpio (sin override local)
git stash push -- vite.config.ts    # guarda el override
npm run build                       # build con prod target = ceopacademia.org
ls -lh dist/                        # verificar que existe index.html + assets/
grep -c "G-EMK9RDJD0G" dist/index.html  # debe dar 3 (gtag injection)
```

### 2. Backup del estado actual (en el droplet)

```bash
ssh root@159.203.189.167
cd /var/www
tar czf /root/galeria-frontend-prev-$(date +%Y%m%d-%H%M).tar.gz galeria-frontend/
ls -lh /root/galeria-frontend-prev-*.tar.gz  # confirmar backup creado
```

Esto nos da rollback inmediato si algo rompe en prod (sin tener que
rebuild desde tag `v3.3.1`).

### 3. Deploy del frontend

```bash
# Desde local, asumiendo dist/ ya compilado
scp -r dist/* root@159.203.189.167:/var/www/galeria-frontend/
```

Nginx ya sirve `try_files $uri $uri/ /index.html` para SPA routing, así
que las nuevas rutas del rebrand (`/`, `/galeria`, `/estudiantes`,
`/perfil`, `/admin`, `/teacher`, `/reset-password`) funcionan sin
cambios en Nginx config.

### 4. Smoke post-deploy

```bash
# Desde local
curl -I https://ceopacademia.org/                    # 200 OK
curl -I https://ceopacademia.org/galeria             # 200 OK (SPA fallback)
curl -s https://ceopacademia.org/ | grep gtag        # debe encontrar el snippet
curl -I https://ceopacademia.org/api/health         # 200 OK (backend intacto)
```

Y abrir en navegador:
- `https://ceopacademia.org/` — debe cargar el rebrand de Programa
- `https://ceopacademia.org/galeria` — debe cargar la galería editorial
- DevTools → Network: verificar que `https://www.googletagmanager.com/gtag/js?id=G-EMK9RDJD0G` se carga
- DevTools → Console: sin errores

### 5. Restaurar working tree local

```bash
git stash pop                       # recupera el override local de vite.config
```

## Riesgos identificados y mitigaciones

### 🟡 Working copy de `vite.config.ts`

Carlos mantiene un override sin commitear (`API_TARGET=http://localhost:3000`).
**Riesgo:** si compila el bundle SIN hacer `git stash` del override, el
frontend de producción intentaría llamar a `localhost:3000` y la galería
quedaría rota.

**Mitigación:** el paso 1 del procedimiento incluye `git stash push -- vite.config.ts`
explícito. Recomiendo además agregar un `console.log(API_TARGET)` temporal
durante el primer deploy para verificar visualmente.

### 🟡 Cache Nginx 1 año immutable

Los nuevos assets tienen hash en el filename (`index-CqReFb1f.js`), así
que el `Cache-Control: immutable` no es problema — cada deploy genera
hashes nuevos y el browser pide los archivos sin caché.

**Pero** `index.html` no tiene hash. Si Nginx lo cachea agresivamente,
los usuarios pueden seguir cargando la versión vieja. Confirmado en la
config: `index.html` NO está en el regex de assets immutable (solo
js/css/png/jpg/etc), así que se sirve sin cache especial. ✅

### 🟢 Routes nuevas y SPA fallback

`try_files $uri $uri/ /index.html` en Nginx ya cubre todas las rutas
client-side del rebrand. Sin acción.

### 🟢 GA4 dispara solo en prod

El guard de hostname (`ceopacademia.org` o `www.`) garantiza que GA4
empieza a registrar solo cuando el bundle se carga desde el droplet,
no antes. Confirmado leyendo `index.html` post-build.

## Plan de rollback

Si el deploy rompe algo:

```bash
ssh root@159.203.189.167
cd /var/www
rm -rf galeria-frontend/*
tar xzf /root/galeria-frontend-prev-YYYYMMDD-HHMM.tar.gz -C /var/www/
# (verificar que galeria-frontend/ tenga el contenido viejo)
```

Tiempo estimado de rollback: < 1 minuto. No requiere rebuild ni acceso a
GitHub.

## Pendientes vigilados (no bloquean deploy)

- **Revocar DO API Token** del incidente del 2026-04-30 — Carlos lo hace
  en el panel DO. No afecta este deploy porque el frontend no consume DO API
  desde el browser.
- **Avisar al colaborador del rename** del repo (`galeria-3d-clase` →
  `LandingCreacionDigital`) + difundir `SECURITY.md`.

## Resumen para el acta

- Frontend deploy = `scp dist/* /var/www/galeria-frontend/` desde local
- Backend e infra = sin cambios
- Backup pre-deploy = `tar czf /root/galeria-frontend-prev-*.tar.gz`
- Rollback = `tar xzf` del backup, < 1 min
- Riesgo principal = override local de `vite.config.ts` → mitigación con
  `git stash` en pre-flight
- GA4 + nuevas rutas SPA = cubiertos sin tocar Nginx

— Mateo Gutiérrez Reyes, DevOps
