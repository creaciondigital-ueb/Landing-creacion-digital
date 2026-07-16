---
autor: Claude Renard (coordinación)
cargo: Líder de Desarrollo / Tech Lead
fecha: 2026-05-28
tema: Acta del comité pre-deploy v3.5.0 — Landing del Programa Creación Digital
estado: aprobado
---

# Acta — Comité Pre-Deploy v3.5.0

## Convocatoria

| Especialista | Cargo | Veredicto |
|---|---|---|
| Mateo Gutiérrez Reyes | DevOps / Deploy | 🟢 Aprobado (atención a assets en R2) |
| Andrés Cano Herrera | Especialista en Testing | 🟡 Aprobado con riesgo cross-browser registrado |
| Felipe Vargas Montoya | Browser & JavaScript | 🟢 Aprobado |
| Diego Ramírez Castellanos | Data Lead & Security | 🟢 Aprobado |
| Claude Renard | Tech Lead | Coordinación |

Informes individuales: `docs/informes/2026-05-28-{mateo,andres,felipe,diego}-deploy-v350-precheck.md`.

## Decisión

✅ **DEPLOY AUTORIZADO** a producción (`https://ceopacademia.org`, droplet DO).

**Riesgo asumido (decisión de Carlos):** smoke cross-browser Firefox/Safari NO
ejecutado (preview fue Chromium). Features `<dialog>`/`:has()` tienen buen
soporte moderno; peor caso es cosmético. Carlos verificará en Firefox/Safari
en las primeras horas post-deploy; si algo aparece, se parchea en caliente.

## Resoluciones de ejecución (R1-R10)

### R1 — Branch flow
```bash
git checkout main
git merge develop --ff-only
git tag -a v3.5.0 -m "Release v3.5.0 — Landing Programa Creación Digital (handoff Claude Design)"
git push origin main --tags
```
Si `--ff-only` falla → PARAR y coordinar con Mateo (no forzar).

### R2 — Pre-flight build (⚠️ verificar assets)
```bash
git stash push -- vite.config.ts   # si hay override local
npm run build
ls dist/programa/img/ | wc -l       # debe dar 22 (20 webp + 2 png logos)
grep -c "G-EMK9RDJD0G" dist/index.html   # 3
grep -rEi "jwt_secret|do_token|db_pass" dist/ | grep -v ".map" | wc -l   # 0
```

### R3 — Backup
```bash
ssh root@159.203.189.167 "cd /var/www && tar czf /root/galeria-frontend-prev-$(date +%Y%m%d-%H%M).tar.gz galeria-frontend/"
```

### R4 — Deploy
```bash
scp -r dist/* root@159.203.189.167:/var/www/galeria-frontend/
```
Revisar residuos de deploys anteriores en el droplet y limpiar si aplica.

### R5 — Smoke post-deploy
```bash
curl -I https://ceopacademia.org/                                   # 200
curl -I https://ceopacademia.org/galeria                            # 200
curl -I https://ceopacademia.org/api/health                         # 200
curl -sI https://ceopacademia.org/programa/img/JuanDavid_Init.webp  # 200
curl -s https://ceopacademia.org/ | grep -c G-EMK9RDJD0G            # 3
```
+ navegador: landing nueva, modales, carrusel, /galeria con paleta nueva.

### R6 — Cross-browser (Carlos, post-deploy)
Abrir landing en Firefox + Safari. Verificar modales + scroll-lock + marquees.

### R7 — Plan C
Login con usuario `must_change_password=true` en `/` → modal forzado.

### R9 — Rollback
```bash
ssh root@159.203.189.167 "cd /var/www && rm -rf galeria-frontend/* && tar xzf /root/galeria-frontend-prev-YYYYMMDD-HHMM.tar.gz -C /var/www/"
```
< 1 min. NO revertir el commit de main si se hace rollback de archivos.

### R10 — Volver a develop
```bash
git checkout develop && git merge main && git push origin develop && git branch --show-current
```

## Pendientes BG (no bloquean)

- Dependabot 3 vulns (Diego)
- Consentimiento de imagen de docentes — confirmar con FACyC (Diego, administrativo)
- Follow-ups de la mesa de desarrollo (lazy-load docentes, `.pcd-loading`, hero photo)
- UI Marmoset en prod + botón X modal modelo (heredados de sesiones previas)

## Firmas

✍️ Mateo Gutiérrez Reyes — Aprobado
✍️ Andrés Cano Herrera — Aprobado (riesgo cross-browser registrado)
✍️ Felipe Vargas Montoya — Aprobado
✍️ Diego Ramírez Castellanos — Aprobado
✍️ Claude Renard — Coordinación
