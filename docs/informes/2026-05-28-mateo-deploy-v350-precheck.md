---
autor: Mateo Gutiérrez Reyes
cargo: DevOps / Deploy
fecha: 2026-05-28
tema: Pre-check deploy v3.5.0 — landing del Programa (handoff Claude Design)
estado: revision
---

# Pre-check Deploy v3.5.0

## Veredicto

🟢 **Apruebo el deploy.** Mismo stack y procedimiento que v3.4.0/v3.4.1
(droplet DO, `scp` manual). El único cambio operativo: hay **assets nuevos**
en `public/programa/img/` que el `scp dist/*` debe arrastrar.

## Versión

`v3.4.1` → **`v3.5.0`** (MINOR — feature grande nueva: landing del Programa
reescrita). Backend sin cambios → no se redeploya `galeria-api`.

## Procedimiento (R1-R10)

### R1 — Branch flow
```bash
git checkout develop
git status                       # vite.config.ts override local — IGNORAR
git checkout main
git merge develop --ff-only
git tag -a v3.5.0 -m "Release v3.5.0 — Landing Programa Creación Digital (handoff Claude Design)"
git push origin main --tags
```

### R2 — Pre-flight build (con git stash del override)
```bash
git checkout main
git stash push -- vite.config.ts   # si hay override; en main no debería haberlo
npm run build
ls -lh dist/programa/img/          # ⚠️ verificar que los 20 webp + 2 png logos están
grep -c "G-EMK9RDJD0G" dist/index.html   # GA4 sigue = 3
```

⚠️ **Punto de atención:** los assets de la landing viven en `public/programa/img/`.
Vite copia `public/` íntegro a `dist/`. Confirmar que `dist/programa/img/` tiene
los 22 archivos (20 webp + Label/LogoUEB png) antes del scp. Si faltan, la
landing sale sin imágenes.

### R3 — Backup
```bash
ssh root@159.203.189.167 "cd /var/www && tar czf /root/galeria-frontend-prev-$(date +%Y%m%d-%H%M).tar.gz galeria-frontend/"
```

### R4 — Deploy
```bash
scp -r dist/* root@159.203.189.167:/var/www/galeria-frontend/
```
El `scp -r dist/*` incluye `dist/programa/` → los assets llegan al droplet.
Es additive (no borra viejos); si hay residuos de deploys anteriores, limpiarlos
como en v3.4.0.

### R5 — Smoke
```bash
curl -I https://ceopacademia.org/                    # 200 (landing nueva)
curl -I https://ceopacademia.org/galeria             # 200
curl -I https://ceopacademia.org/api/health          # 200 (backend intacto)
curl -sI https://ceopacademia.org/programa/img/JuanDavid_Init.webp  # 200 (assets)
```
Y abrir la landing en el navegador: hero, ejes, carrusel, modales, footer.

### R9 — Rollback
`tar xzf /root/galeria-frontend-prev-*.tar.gz -C /var/www/` — < 1 min.

### R10 — Volver a develop
`git checkout develop && git merge main && git push origin develop`

## Riesgos

- 🟡 **Override local de `vite.config.ts`**: igual que siempre, `git stash`
  antes del build. En `main` no debería estar (nunca se commiteó).
- 🟡 **Peso de assets**: +5.2MB en el droplet (webp docentes/proyectos + png
  logos). Trivial para el disco del droplet.
- 🟢 Backend, Nginx, PM2, DB: sin cambios.

## Recomendación al acta

Aprobado. Atención especial en R2: verificar `dist/programa/img/` poblado
antes del scp.

— Mateo Gutiérrez Reyes, DevOps
