# Plan: HTML legible para bots de IA y buscadores

**Estado**: en_progreso
**Creado**: 2026-11-06
**Implementado**: —

## Problema

El sitio es una SPA (Vite + React). Lo que el servidor entrega en cualquier ruta es:

```html
<body>
  <div id="root"></div>
</body>
```

Todo el texto (programa, docentes, blog, proyectos) aparece solo cuando corre JavaScript. Google ejecuta JS, pero la mayoría de rastreadores de IA (GPTBot de OpenAI, ClaudeBot, PerplexityBot y otros) **no**: para ellos el sitio está vacío. Además, el `<title>`, la descripción y el canonical de cada página los pone `useSeo` con JS, así que esos bots solo ven los genéricos de `index.html`.

Dos problemas relacionados:

1. `SITE_URL` (`src/hooks/useSeo.ts`), el canonical, el JSON-LD de `index.html` y `public/sitemap.xml` apuntan a `https://creaciondigital.online`, que hoy sirve el sitio viejo de junio en DigitalOcean. El sitio vivo está en `https://creaciondigital-ueb.netlify.app`.
2. La descripción de `index.html` (og/twitter) todavía dice "No vinimos a dictar clase: vinimos a crear".

## Opciones evaluadas

| Opción | Qué es | A favor | En contra |
|---|---|---|---|
| **A. Prerender con React (SSR en el build)** | Renderizar cada ruta con `react-dom/static` + `StaticRouter` al compilar y luego "hidratar" en el navegador | HTML idéntico a la página | Cambia cómo arranca la app (`hydrateRoot`); riesgo de desajustes de hidratación (animación del título, idioma guardado en `localStorage`, carrusel, scroll); toca muchos componentes |
| **B. Captura con navegador headless (Puppeteer)** | Abrir cada ruta en Chrome al compilar y guardar el HTML resultante | No toca componentes | Descarga Chromium (~170 MB) en el build de Netlify; captura estados intermedios de animaciones; build más lento y frágil |
| **C. HTML estático por ruta desde los datos** ✅ | Un script post-build genera `dist/<ruta>/index.html` con el `<head>` correcto y el contenido en HTML semántico dentro de `#root`; React lo reemplaza al cargar (`createRoot`, sin hidratar) | Sin dependencias nuevas; no cambia cómo arranca la app; usa las mismas fuentes de datos, así que no se desincroniza | El HTML para bots es "plano" (sin el diseño); se ve un instante antes de que cargue React |

**Recomendación: C.** Es el cambio más simple que resuelve el problema de fondo. A queda como mejora futura si algún día se necesita HTML idéntico.

## Cómo funciona la opción C

- `scripts/prerender.ts` corre después de `vite build` (se agrega al script `build`, así Netlify lo ejecuta solo).
- Lee `src/i18n/translations.ts` (español, el idioma por defecto), `src/data/blog.ts` y `src/data/proyectos.ts`.
- Para cada ruta toma `dist/index.html` como plantilla y escribe una copia con:
  - `<title>`, `meta description`, Open Graph, Twitter y `canonical` de esa ruta (los mismos valores que hoy pone `useSeo`).
  - JSON-LD de la ruta: `EducationalOrganization` + programa en la home, `Article` en cada post, `CreativeWork` en cada proyecto.
  - Dentro de `<div id="root">`, el contenido en HTML semántico (`h1`, `h2`, `p`, listas, enlaces).
- Rutas: `/`, `/proyectos`, `/proyectos/:id` (5), `/blog`, `/blog/:id` (6). Total 14.
- Netlify sirve `dist/blog/dia-del-unicornio-2026/index.html` antes que la regla `/* /index.html 200` de `_redirects`, porque el archivo existe. Las rutas sin archivo siguen cayendo en la app.
- Para que el contenido plano no "parpadee": se le da un estilo mínimo coherente (fondo papel, tipografía del sitio). React lo reemplaza apenas carga, y el texto visible es el mismo que el de la página, así que no es cloaking.

### Qué contenido va en cada ruta

- **`/`**: título del hero, "¿quiénes somos?", los tres ejes (Mundo 3D, Contenido, Negocios digitales) con su bajada y "¿Qué aprenderás?", docentes (nombre + bio con empleadores), equipo, enlaces a proyectos y blog, CTA "Aplica ahora" y "Agenda tu charla informativa".
- **`/blog` y `/proyectos`**: lista con título, fecha, bajada y enlace a cada uno.
- **`/blog/:id` y `/proyectos/:id`**: título, fecha/autor, descripción completa y etiquetas.

## Extras incluidos

- **`llms.txt`**: generado por el mismo script desde los mismos datos. Es un resumen en Markdown del programa, los ejes, los docentes y los enlaces a blog y proyectos. Es una convención reciente y no se sabe cuánto la usan los bots, pero sale casi gratis.
- **`sitemap.xml` generado**: hoy está escrito a mano y hay que acordarse de agregar cada post nuevo. El script lo genera desde los datos.
- **`robots.txt`**: se mantiene `Allow: /` para todos. Se apunta el `Sitemap:` al dominio oficial.
- **Descripción de `index.html`**: se actualiza al mensaje actual ("Vinimos a clase…" + "¿quiénes somos?").

## Decisiones (del usuario)

- 2026-11-06: dominio oficial = `https://creaciondigital-ueb.netlify.app` "por ahora" (en `src/seo/site.ts`).

### Pendientes originales

1. **Dominio oficial**: ¿el canonical, el sitemap y el JSON-LD apuntan a `creaciondigital-ueb.netlify.app` mientras tanto, o a `creaciondigital.online`, que hoy sirve el sitio viejo? Lo ideal es apuntar `creaciondigital.online` a Netlify y usar ese. Mientras eso no pase, apuntar a `.online` manda a bots y buscadores a la versión de junio. Queda en una sola constante (`SITE_URL`) para cambiarlo fácil.
2. **Comando de build en Netlify**: confirmar con quien administra Netlify que el comando es `npm run build` y la carpeta publicada `dist`. Si no, el script no corre.

## Equipo

- **Natalia Vargas Ospina** (Arquitecta Web): valida la opción C y el orden de resolución con `_redirects`.
- **Sebastián Torres Mejía** (Senior Dev React): escribe `scripts/prerender.ts` y el estilo mínimo.
- **Mateo Gutiérrez Reyes** (DevOps/Deploy): ajusta el script `build` y verifica en Netlify.
- **Andrés Cano Herrera** (Testing): verifica con `curl -A GPTBot` cada ruta y que la app siga igual en el navegador.

## Tareas

- [x] Decidir el dominio oficial y dejarlo en `SITE_URL`
- [ ] Confirmar el comando de build de Netlify
- [x] `scripts/prerender.ts`: plantilla + `<head>` por ruta + contenido semántico
- [x] Estilo mínimo para el contenido previo a React
- [x] Generar `llms.txt` y `sitemap.xml` desde los datos (quitar el sitemap escrito a mano)
- [x] Actualizar la descripción de `index.html`
- [x] Agregar el script al `build` de `package.json`
- [ ] Verificar: `curl -A "GPTBot"` en las 14 rutas devuelve texto; la app se ve y funciona igual; `_redirects` sigue cubriendo rutas inexistentes
- [ ] CHANGELOG + session log + commit + publicar

## Archivos a modificar

- `scripts/prerender.ts`: nuevo, el generador
- `package.json`: `build` pasa a `tsc -b && vite build && <prerender>`
- `src/hooks/useSeo.ts`: `SITE_URL` según la decisión 1; exportar los textos SEO por ruta para que el script y el hook usen los mismos
- `index.html`: descripción actualizada
- `public/sitemap.xml`: se elimina (lo genera el script)
- `public/robots.txt`: `Sitemap:` al dominio oficial
- `src/styles/global.css`: estilo mínimo del contenido previo

## Cómo se mide

- Antes: `curl -A GPTBot https://…/` devuelve 0 palabras de contenido.
- Después: cada ruta devuelve su texto (la home, más de 600 palabras).
- En Netlify Analytics → "Top resources not found": `/blog/...` y `/proyectos/...` ya no aparecen.
- A mediano plazo: preguntar a ChatGPT, Claude y Perplexity por "pregrado en Creación Digital Bogotá" y ver si citan el sitio.

## Notas de implementación

- El script se compila con `scripts/prerender.vite.config.ts` (Vite SSR, `publicDir: false`) y corre con Node; salida en `.prerender/` (ignorada en git).
- `_redirects` pasa a `/* /404.html 404`: las rutas reales tienen su propio `index.html`; las demás reciben la app sin contenido con código 404.
- Títulos, descripciones y JSON-LD por ruta viven en `src/seo/pages.ts` y los usan tanto las páginas (`useSeo`) como el script.
