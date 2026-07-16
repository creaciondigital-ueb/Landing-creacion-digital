# Configuración de Claude Code — Galería 3D Interactiva

## Estructura

```
.claude/
├── skills/                          # Perfiles especializados de Claude
│   ├── senior-dev-astro/           # 🔧 Desarrollo diario (DEFAULT) — nombre legacy: hoy Vite+React+Express
│   ├── planner-analyst/            # 💭 Planificación y análisis
│   ├── software-architect-web/     # 🏗️ Arquitectura y diseño
│   ├── frontend-3d/                # 🎨 Diseño Frontend + 3D (editorial v3.4.0)
│   ├── testing-web/                # 🧪 Testing y QA manual
│   ├── security-supabase/          # 🔒 Seguridad y datos — nombre legacy: hoy Express+PG+JWT (NO Supabase)
│   ├── deploy-ghpages/             # 🚀 Deploy DigitalOcean — nombre legacy: hoy scp al droplet (NO GH Pages)
│   ├── qa/                         # ✅ Quality Assurance
│   └── skill-creator/              # ⚙️ Crear/mejorar skills
├── commands/                        # Slash commands personalizados
├── settings.local.json
└── README.md
```

---

## Equipo de Especialistas

### Mi identidad (Claude)

**Claude Renard** — Líder de Desarrollo / Tech Lead

### Los especialistas

| Nombre | Cargo | Skill | Comando |
|--------|-------|-------|---------|
| **Claude Renard** | Líder de Desarrollo | *(yo)* | — |
| **Sebastián Torres Mejía** | Senior Dev React | `senior-dev-astro` | `/dev` |
| **Laura Botero Ríos** | Analista y Planificadora | `planner-analyst` | `/plan` |
| **Natalia Vargas Ospina** | Arquitecta Web | `software-architect-web` | `/architect` |
| **Isabella Moreno Ríos** | Diseñadora Frontend 3D | `frontend-3d` | `/frontend` |
| **Andrés Cano Herrera** | Especialista en Testing | `testing-web` | `/test` |
| **Diego Ramírez Castellanos** | Data Lead & Arquitecto de Datos | `security-supabase` | `/security` |
| **Mateo Gutiérrez Reyes** | DevOps / Deploy | `deploy-ghpages` | `/deploy` |
| **Valentina Soto Parra** | QA Lead | `qa` | `/qa` |
| **Felipe Vargas Montoya** | Especialista Browser & JavaScript | `browser-js-expert` | `/browser` |

---

## Contexto del Proyecto

### Tecnologías
- **Frontend**: Vite 6 + React 19 + React Router 7
- **3D**: Three.js + React Three Fiber + Drei
- **Backend**: Node.js + Express (DigitalOcean Droplet)
- **Database**: PostgreSQL 16 (local en droplet)
- **Storage**: DigitalOcean Spaces (S3 CDN)
- **Auth**: JWT custom (bcryptjs + jsonwebtoken)
- **Styling**: CSS custom editorial v3.4.0 (paper / ink / cobalt / acid / magenta / tomato) + DM Serif Text + Zalando Sans + Rubik Bubbles + JetBrains Mono
- **Deploy**: Nginx en Droplet (159.203.189.167) servido como `https://ceopacademia.org` (Hostinger = solo registrador)
- **Procedimiento de deploy**: `scp -r dist/* root@droplet:/var/www/galeria-frontend/` (manual, sin CI/CD)

### Repositorio
- **GitHub**: `Karlvolsung88/LandingCreacionDigital` (renombrado desde `galeria-3d-clase`)
- **URL Producción**: https://ceopacademia.org
- **Ramas**: `develop` (desarrollo), `main` (producción)

### Tablas PostgreSQL
- `profiles` — perfiles con roles (admin/teacher/student), password hash bcrypt, `must_change_password`
- `models` — modelos 3D de estudiantes, `mview_url` opcional para Showcase Marmoset
- `likes` — likes de modelos
- `comments` — comentarios en modelos
- `student_skills` — habilidades de estudiantes (6 skills en escala 0-100)

### Categorías de Modelos
`personaje` (tomato) | `vehiculo` (cobalt) | `criatura` (magenta) | `objeto` (acid)

### Roles
- **admin** — Profesor principal: puede gestionar todo
- **teacher** — Docente: gestiona SUS estudiantes asignados, sube Showcase Marmoset
- **student** — Estudiante: solo sus propios modelos
- **visitante** — Sin auth: solo lectura

---

## Slash Commands

| Comando | Skill | Descripción |
|---------|-------|-------------|
| `/dev` | senior-dev-astro | Desarrollo diario, CRUDs, fixes |
| `/plan` | planner-analyst | Planificación de features |
| `/architect` | software-architect-web | Arquitectura y decisiones |
| `/frontend` | frontend-3d | UI/UX, componentes, estilos |
| `/test` | testing-web | Testing y verificación |
| `/security` | security-supabase | Seguridad, datos, auth |
| `/deploy` | deploy-ghpages | Deploy a DigitalOcean |
| `/qa` | qa | Quality Assurance |
| `/browser` | browser-js-expert | Bugs cross-browser, WebGL |

---

**Última actualización**: 2026-05-13 (post Editorial Rebrand v3.4.0 + cleanup contexto legacy)
**Proyecto**: Galería 3D Interactiva — Estudio de Creación Digital 4

## ⚠️ Anti-patrones de contexto (correcciones repetidas)

- ❌ NO mencionar **Astro** — el stack es Vite puro
- ❌ NO mencionar **Supabase** — backend es Express propio con PG local + JWT
- ❌ NO mencionar **GitHub Pages / GitHub Actions** para deploy — es scp manual al droplet
- ❌ NO mencionar **Hostinger FTP** — Hostinger es solo registrador de dominio
- ❌ NO usar **dark / neubrutalism / Bebas Neue / DM Sans** — la identidad es editorial v3.4.0
- ❌ NO usar `git worktree` — Carlos lo detesta
- ❌ NO commitear `vite.config.ts` con override local (`API_TARGET=http://localhost:3000`)
