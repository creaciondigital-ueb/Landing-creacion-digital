---
autor: Claude Renard (coordinación)
cargo: Líder de Desarrollo / Tech Lead
fecha: 2026-05-13
tema: Acta del comité pre-deploy v3.4.0 — Editorial Rebrand
estado: aprobado
---

# Acta del comité pre-deploy — Editorial Rebrand v3.4.0

## Convocatoria

| Especialista | Cargo | Rol en este comité |
|---|---|---|
| Claude Renard | Tech Lead | Coordinación + redacción del acta |
| Mateo Gutiérrez Reyes | DevOps / Deploy | Procedimiento, branch flow, rollback |
| Andrés Cano Herrera | Especialista en Testing | Regresiones funcionales, cross-browser |
| Felipe Vargas Montoya | Especialista Browser & JS | Bundle, GA4 real-world, console |
| Diego Ramírez Castellanos | Data Lead & Arquitecto de Datos | Bundle audit, secretos, guards |

**Ausente con QA previa firmada:** Valentina Soto Parra (QA Lead) — su
informe de cierre de sprints (`2026-05-13-valentina-qa-sprint7.md`, commit
`844f256`) cubrió la verificación funcional integral. El comité actual es
específico para autorizar el deploy a producción.

## Informes individuales

Los 4 informes están commiteados en `feature/editorial-rebrand`:

- `docs/informes/2026-05-13-mateo-deploy-precheck.md` — commit `6a33508`
- `docs/informes/2026-05-13-andres-testing-precheck.md` — este commit
- `docs/informes/2026-05-13-felipe-browser-precheck.md` — este commit
- `docs/informes/2026-05-13-diego-security-precheck.md` — este commit

## Resumen de veredictos

| Especialista | Veredicto |
|---|---|
| Mateo (DevOps) | 🟢 Apruebo el deploy (sin precondiciones bloqueantes) |
| Andrés (Testing) | 🟢 Apruebo el deploy (con 2 checkpoints obligatorios cross-browser y Plan C) |
| Felipe (Browser) | 🟢 Apruebo el deploy (con 2 verificaciones manuales post-deploy de GA4) |
| Diego (Security) | 🟢 Apruebo el deploy (sin observaciones bloqueantes) |
| Valentina (QA, previo) | ✅ Aprobado para merge a `develop` (commit `844f256`) |

**Decisión del comité: ✅ DEPLOY AUTORIZADO** para producción
(`https://ceopacademia.org` en el droplet DO `159.203.189.167`).

## Resoluciones del comité (orden de ejecución)

### R1 — Branch flow

```bash
# Asumir branch actual: feature/editorial-rebrand con commits limpios
git checkout develop
git merge feature/editorial-rebrand --ff-only   # linear history
git push origin develop

git checkout main
git merge develop --ff-only
git tag -a v3.4.0 -m "Release v3.4.0 — Editorial Rebrand + GA4 + cleanup contexto"
git push origin main --tags
```

Si `--ff-only` falla porque `develop` o `main` divergieron, **PARAR** y
coordinar con Mateo antes de hacer rebase o merge no-ff. El historial
lineal es requisito de la branch protection y romperlo requiere `--force`,
que NO está autorizado.

### R2 — Pre-flight obligatorio (Mateo + Felipe + Andrés)

Antes de generar el bundle de producción:

```bash
cd "F:/Estudio de Creacion Digital IV/Galeria"
git checkout main                              # ya con v3.4.0 mergeado
git status                                     # vite.config.ts MAY mostrar override local
git stash push -- vite.config.ts               # guardar override si lo hay
npm run build                                  # build con API_TARGET=https://ceopacademia.org
grep -c "G-EMK9RDJD0G" dist/index.html         # debe dar 3 (gtag injection)
grep -rEi "secret|jwt_secret|do_token" dist/   # debe dar 0
```

### R3 — Backup pre-deploy (Mateo)

```bash
ssh root@159.203.189.167
cd /var/www
tar czf /root/galeria-frontend-prev-$(date +%Y%m%d-%H%M).tar.gz galeria-frontend/
ls -lh /root/galeria-frontend-prev-*.tar.gz
exit
```

### R4 — Deploy del frontend (Mateo)

```bash
# Desde local, después de R2
scp -r dist/* root@159.203.189.167:/var/www/galeria-frontend/
git stash pop   # recuperar override local de vite.config.ts
```

Backend e infraestructura NO se tocan (decisión R1 del comité editorial:
backend = columna vertebral).

### R5 — Smoke post-deploy mínimo (Mateo + Andrés + Felipe)

Desde local:

```bash
curl -I https://ceopacademia.org/                 # 200
curl -I https://ceopacademia.org/galeria          # 200 (SPA fallback)
curl -I https://ceopacademia.org/estudiantes      # 200
curl -I https://ceopacademia.org/api/health       # 200 (backend intacto)
curl -s https://ceopacademia.org/ | grep -c G-EMK9RDJD0G  # 3
```

Y en navegador:

- Cargar `https://ceopacademia.org/` y `https://ceopacademia.org/galeria`
- DevTools → Network: verificar request 200 a `googletagmanager.com`
  (desactivando bloqueadores)
- DevTools → Console: sin errores

### R6 — Cross-browser checkpoint (Andrés)

15 min de smoke según la matriz de Andrés:
- Chrome desktop ✓ (default, ya verificado durante sprints)
- Firefox desktop ⏳
- Safari macOS ⏳ (si disponible)
- Chrome Android ⏳

Por cada navegador: PCD `/` + galería `/galeria` + modal modelo + `/admin`.

Si una verificación falla → registrar como bug, decidir según severidad.
NO rollback automático si el bug es estético o no-bloqueante.

### R7 — Validar Plan C en producción (Andrés)

Antes de difundir el rebrand a estudiantes/teachers:

- Tener un usuario de prueba con `must_change_password=true` en la DB
- Hacer login con ese usuario en `https://ceopacademia.org/galeria`
- Verificar que el `<ChangePasswordModal>` se monta y bloquea la navegación
- Cambiar password → modal desmonta → galería normal

### R8 — Verificación GA4 (Felipe)

A los 5-10 minutos del deploy:

- Abrir el panel de GA4 (propiedad `G-EMK9RDJD0G`)
- Realtime → debe mostrar al menos 1 pageview
- Si no aparece en 15 min: revisar bloqueadores del navegador, IP
  anonymization config, y consentimiento de cookies si aplica

### R9 — Plan de rollback (Mateo)

Si el deploy rompe algo crítico:

```bash
ssh root@159.203.189.167
cd /var/www
rm -rf galeria-frontend/*
tar xzf /root/galeria-frontend-prev-YYYYMMDD-HHMM.tar.gz -C /var/www/
exit
# Verificar: curl -I https://ceopacademia.org/ → 200 + el dist viejo
```

Tiempo estimado: < 1 minuto. No requiere rebuild ni acceso a GitHub.

Si el rollback se ejecuta, **NO revertir el commit de `main`**. El tag
`v3.4.0` queda apuntando al commit pero `/var/www/galeria-frontend/` queda
con la versión anterior hasta que se resuelva el incidente. Coordinar con
Mateo para próximo deploy.

### R10 — Volver a `develop` después del deploy (regla CLAUDE.md)

```bash
git checkout develop
git merge main          # sync con main para que develop tenga el tag
git push origin develop
git branch --show-current   # debe decir 'develop'
```

**NUNCA quedarse en `main` después del deploy** — el próximo commit
accidental iría a producción.

## Pendientes BG (no bloquean este deploy)

Diego los listó en su informe y los confirmamos:

1. 🔑 Revocar DO API Token efímero del incidente 2026-04-30 (panel DO de Carlos)
2. 📢 Avisar al colaborador `creaciondigital-ueb` del rename del repo + difundir `SECURITY.md`
3. 📝 Actualizar `SECURITY.md` si todavía menciona Supabase como backend

Acciones de seguimiento que el comité recomienda **post-deploy**, en orden
sugerido:

- Felipe: activar IP Anonymization en GA4
- Carlos: considerar aviso de cookies si difunde a estudiantes menores
- Valentina: smoke periódico durante la primera semana del deploy

## Firmas

✍️ **Mateo Gutiérrez Reyes** — DevOps / Deploy — Apruebo
✍️ **Andrés Cano Herrera** — Especialista en Testing — Apruebo
✍️ **Felipe Vargas Montoya** — Especialista Browser & JavaScript — Apruebo
✍️ **Diego Ramírez Castellanos** — Data Lead & Arquitecto de Datos — Apruebo
✍️ **Valentina Soto Parra** — QA Lead — Apruebo previo (`844f256`)
✍️ **Claude Renard** — Tech Lead — Coordinación + redacción del acta

---

**Próximo paso del usuario**: ejecutar R1 a R10 en orden, con Carlos al
mando del teclado. El comité queda disponible para consultas durante el
deploy.
