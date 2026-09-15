# Landing Creación Digital — Universidad El Bosque

Sitio web del pregrado en Creación Digital de la Universidad El Bosque: landing del programa, galería de proyectos de estudiantes y blog de noticias. Sitio 100% estático — sin backend, sin base de datos, sin autenticación. El contenido (proyectos, posts del blog) se agrega a mano como código en `src/data/`.

## Stack

| Capa | Tecnología |
|------|-----------|
| **Frontend** | Vite 6 + React 19 + React Router 7 (TypeScript estricto) |
| **Contenido** | Estático, en código (`src/data/proyectos.ts`, `src/data/blog.ts`) |
| **Styling** | CSS custom editorial v3.4.0 (paper / ink / cobalt / acid / tomato) con tipografías DM Serif Text + Zalando Sans + Rubik Bubbles + JetBrains Mono |
| **i18n** | Español / Inglés vía `LanguageContext` |
| **Deploy** | Nginx + SSL (Let's Encrypt) en DigitalOcean Droplet |
| **Dominio** | `creaciondigital.online` |

## Páginas

| Ruta | Contenido |
|------|-----------|
| `/` | Landing del programa: quiénes somos, docentes, equipo, preview de proyectos y blog |
| `/proyectos` | Galería completa de proyectos de estudiantes, con filtros por año/materia |
| `/proyectos/:id` | Detalle de un proyecto (carrusel, ficha técnica, descripción, habilidades) |
| `/blog` | Listado de publicaciones (noticias, logros, eventos), con filtros y buscador |
| `/blog/:id` | Detalle de una publicación |
| `*` | Página 404 para cualquier otra ruta |

## Desarrollo local

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # Build producción en dist/
npm run preview       # Sirve dist/ localmente para probar el build
```

## Deploy a producción

Manual, sin CI/CD:

```bash
npm run build
scp -r dist/* root@159.203.189.167:/var/www/galeria-frontend/
```

Ver `docs/deploy.md` para infraestructura completa (droplet, dominio, SSL, config de Nginx).

## Agregar contenido

- **Proyecto nuevo**: agregar un objeto al array `PROYECTOS` en `src/data/proyectos.ts`. Las imágenes van en `public/programa/img/proyectos/`.
- **Post de blog nuevo**: agregar un objeto al array `BLOG_POSTS` en `src/data/blog.ts`.
- En ambos casos, agregar también la URL correspondiente en `public/sitemap.xml` (no se genera automáticamente).

## Ramas

- `develop` — desarrollo diario
- `main` — solo merges de release para producción

**NUNCA quedarse en `main` después del deploy** — volver a `develop` inmediatamente.
