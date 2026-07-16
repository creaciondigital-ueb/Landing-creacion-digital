# Política de Seguridad — Galería 3D

> Última actualización: 2026-04-30 tras incidente de credenciales expuestas.

## Resumen para colaboradores

Este proyecto aloja **datos reales de estudiantes** y conecta con infraestructura productiva
(DigitalOcean Droplet + Spaces + PostgreSQL). La seguridad no es opcional.

## ⛔ Nunca commitear

- Credenciales de cualquier tipo (passwords, tokens, API keys, secrets)
- Archivos `.env` o equivalentes
- Backups de base de datos (`backups/` está gitignored)
- Archivos personales de configuración local (`.claude/settings.local.json`)

Si por error commiteás algo así:
1. **No hagas push si aún no salió.** Avisame antes (issue privado o DM).
2. Si ya está pushed: avisame **inmediatamente** — hay que rotar la credencial expuesta.

## ✅ Cómo manejamos credenciales

| Tipo | Dónde vive |
|---|---|
| Producción (DB, JWT, Spaces, admin) | `/var/www/galeria-api/.env` del droplet (acceso SSH solo del owner) + iCloud Keychain del owner |
| Desarrollo local | `backend/.env` (gitignored) — cada developer maneja el suyo |
| Tokens de servicios externos (GitHub, DO) | Personal Access Tokens con scope mínimo + expiración |

Para correr el proyecto localmente, pedir al owner del repo un `.env.example` y los valores de dev.

## Flujo de trabajo

- `develop` — branch de desarrollo, PRs aquí
- `main` — branch protegida, solo el owner puede mergear
- Branch protection en `main` requiere review obligatorio
- CODEOWNERS define qué archivos requieren review del owner

## 2FA y acceso

- Todos los colaboradores deben tener **2FA habilitado** en GitHub
- El owner usa GitHub Mobile push como segundo factor
- Recovery codes guardados fuera de la nube (impresos o en password manager)

## Reportar vulnerabilidades

Si encontrás una vulnerabilidad en el código o infraestructura:

1. **NO abras un issue público** sobre el detalle
2. Contactá al owner directamente (DM en GitHub, email, o canal privado)
3. Damos 7 días para fix antes de cualquier disclosure

## Historial de incidentes

- **2026-04-30** — Credenciales productivas expuestas en repo público. Acciones: repo a privado, rotación completa (DB pass, JWT secret, DO Spaces keys, admin password), sanitización del código fuente, hardening (branch protection, CODEOWNERS, secret scanning).
