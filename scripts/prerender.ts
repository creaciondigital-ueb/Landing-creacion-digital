/**
 * Genera HTML legible para bots que no ejecutan JavaScript (rastreadores de
 * IA como GPTBot, ClaudeBot, PerplexityBot) — corre DESPUÉS de `vite build`.
 *
 * Por cada ruta escribe dist/<ruta>.html (la home, dist/index.html) a partir de dist/index.html:
 *   - <head> de esa ruta (título, descripción, canonical, OG/Twitter, JSON-LD),
 *     con los MISMOS valores que pone useSeo en el navegador (src/seo/pages.ts).
 *   - Dentro de <div id="root">, el contenido de la página en HTML semántico,
 *     sacado de las mismas fuentes que usa la app (translations.ts, data/*.ts).
 * React no hidrata: createRoot reemplaza ese contenido al cargar, así que la
 * app se ve y funciona igual.
 *
 * También genera dist/404.html (la app sin contenido previo, para rutas que
 * no existen), sitemap.xml, robots.txt y llms.txt.
 *
 * Se compila con Vite (modo SSR) y se ejecuta con Node: ver "build" en
 * package.json.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import translations from '../src/i18n/translations';
import { BLOG_POSTS, type BlogPost } from '../src/data/blog';
import { PROYECTOS, type Proyecto } from '../src/data/proyectos';
import { SITE_URL, SITE_NAME, ASSET_CDN, VIDEO_CDN, APLICA_URL, CHARLA_URL, resolveImageUrl } from '../src/seo/site';
import { homeSeo, blogListSeo, proyectosListSeo, blogPostSeo, proyectoSeo, type PageSeo } from '../src/seo/pages';

const DIST = join(process.cwd(), 'dist');
const t = translations.es;

// ── utilidades ────────────────────────────────────────────────────────────
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Texto con **negritas** → HTML escapado con <strong>. */
const rich = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
const plain = (s: string) => s.replace(/\*\*(.+?)\*\*/g, '$1');
/** Párrafos separados por línea en blanco → <p>…</p>. */
const paragraphs = (s: string) =>
  s.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => `<p>${rich(p)}</p>`).join('\n');
const link = (href: string, text: string) => `<a href="${esc(href)}">${esc(text)}</a>`;

// ── docentes ──────────────────────────────────────────────────────────────
interface Docente {
  ariaLabel: string;
  bio: string;
  p1: string;
  p2: string;
  tags: string[];
  exp: { title: string | null; body: string | null; boldParts: string[] | null }[];
}
const docentes = Object.values(t.docentes).filter(
  (v): v is Docente => typeof v === 'object' && v !== null && 'ariaLabel' in v,
);
const docenteName = (d: Docente) => d.ariaLabel.replace(/^Ver perfil de /, '');
const expText = (e: Docente['exp'][number]) => e.body ?? (e.boldParts ?? []).join('');

// ── contenido de cada página ─────────────────────────────────────────────
const nav = `<nav aria-label="Navegación principal"><ul>
<li>${link('/', 'Inicio')}</li>
<li>${link('/#programa', 'Programa')}</li>
<li>${link('/#docentes', 'Docentes')}</li>
<li>${link('/proyectos', 'Proyectos')}</li>
<li>${link('/blog', 'Blog')}</li>
<li>${link(APLICA_URL, 'Aplica ahora')}</li>
<li>${link(CHARLA_URL, t.nav.charla)}</li>
</ul></nav>`;

function homeBody(): string {
  const h = t.hero;
  const axes = [t.axis02, t.axis01, t.axis03].map((a) => {
    const n = a.tag.slice(0, 1) === '0' ? a.tag.slice(1, 2) : '';
    const vs = [1, 2, 3].map((i) => {
      const k = `vs${n}${i}` as const;
      const rec = a as unknown as Record<string, string>;
      return `<li><strong>${esc(rec[`${k}title`])} ${esc(rec[`${k}accent`])}</strong> ${esc(rec[`${k}body`])}</li>`;
    }).join('\n');
    return `<section>
<h2>${esc(a.wordFull)}</h2>
<p>${esc(a.caption)}</p>
<ul>
${vs}
</ul>
<h3>${esc(a.contenidoTitle)}</h3>
<p>${rich(a.contenidoBody)}</p>
</section>`;
  }).join('\n');

  const docentesHtml = docentes.map((d) => `<article>
<h3>${esc(docenteName(d))}</h3>
<p>${esc(d.bio)}</p>
<p>${esc(d.p1)}</p>
<p>${esc(d.p2)}</p>
<ul>
${d.exp.map((e) => `<li>${e.title ? `<strong>${esc(e.title)}:</strong> ` : ''}${esc(expText(e))}</li>`).join('\n')}
</ul>
</article>`).join('\n');

  const equipo = Object.values(t.equipo).filter(
    (v): v is { nombre: string; profesion: string; rol: string; descripcion: string } =>
      typeof v === 'object' && v !== null && 'nombre' in v,
  );

  return `${nav}
<main>
<header>
<p>${esc(h.meta.tipo)} · ${esc(h.meta.duracion)} · ${esc(h.meta.ciudad)} · ${esc(h.meta.uni)} · ${esc(h.meta.snies)} 116265</p>
<h1>${esc(h.line1)} ${esc(h.line2pre)}${esc(h.line2word)}: ${esc(h.endings.join(', '))}.</h1>
<h2>¿Quiénes somos?</h2>
<p>${esc(h.quienesBody)}</p>
<p>${link(APLICA_URL, 'Aplica ahora')} · ${link(CHARLA_URL, t.nav.charla)}</p>
</header>
<section id="programa">
<h2>${esc(t.marquee1)}</h2>
${axes}
</section>
<section id="docentes">
<h2>${esc(t.docentes.sectionTitleL1)} ${esc(t.docentes.sectionTitleL2Pop)}${esc(t.docentes.sectionTitleL2Rest)}</h2>
<p>${esc(t.docentes.sectionSub)}</p>
${docentesHtml}
</section>
<section id="equipo">
<h2>${esc(t.equipo.sectionTitleL1Pre)}${esc(t.equipo.sectionTitleL1Pop)} ${esc(t.equipo.sectionTitleL2)}</h2>
${equipo.map((e) => `<article><h3>${esc(e.nombre)}</h3><p>${esc(e.rol)} · ${esc(e.profesion)}</p><p>${esc(e.descripcion)}</p></article>`).join('\n')}
</section>
<section>
<h2>${esc(t.projects.sectionTitleL1)} ${esc(t.projects.sectionTitlePop)}${esc(t.projects.sectionTitleL2rest)} ${esc(t.projects.sectionTitleL3)}</h2>
<ul>${proyectosConDetalle().map((p) => `<li>${link(`/proyectos/${p.id}`, p.caption)}</li>`).join('\n')}</ul>
</section>
<section>
<h2>${esc(t.blog.sectionTitleL1)} ${esc(t.blog.sectionTitlePop)} ${esc(t.blog.sectionTitleL3)}</h2>
<ul>${postsConDetalle().map((p) => `<li>${link(`/blog/${p.id}`, p.title)}</li>`).join('\n')}</ul>
</section>
<section>
<h2>${esc(t.estudia.title)} ${esc(t.estudia.titleNeon)} ${esc(t.estudia.titleEnd)}</h2>
<p>${esc(t.estudia.body)}</p>
<p>${link(APLICA_URL, 'Aplica ahora')}</p>
</section>
</main>`;
}

const postsConDetalle = () => [...BLOG_POSTS].reverse().filter((p) => p.detail);
const proyectosConDetalle = () => PROYECTOS.filter((p) => p.modal);

function blogListBody(): string {
  return `${nav}
<main>
<h1>${esc(t.blogPage.titleL1)} ${esc(t.blogPage.titlePop)} ${esc(t.blogPage.titleL2)} ${esc(t.blogPage.titleL3)}</h1>
${postsConDetalle().map((p) => `<article>
<h2>${link(`/blog/${p.id}`, p.title)}</h2>
<p>${esc(p.category)} · ${esc(p.date)}</p>
<p>${esc(p.excerpt)}</p>
</article>`).join('\n')}
</main>`;
}

function blogPostBody(p: BlogPost): string {
  const d = p.detail!;
  return `${nav}
<main>
<article>
<p>${link('/blog', '← Blog')}</p>
<h1>${esc(p.title)}</h1>
<p>${esc(p.category)} · ${esc(p.date)}${p.author ? ` · ${esc(p.author)}` : ''}</p>
<p><strong>${esc(p.excerpt)}</strong></p>
${paragraphs(d.descriptionEs)}
${d.tagsEs?.length ? `<p>${d.tagsEs.map(esc).join(' · ')}</p>` : ''}
</article>
</main>`;
}

function proyectosListBody(): string {
  return `${nav}
<main>
<h1>${esc(t.proyectosPage.titleL1)} ${esc(t.proyectosPage.titlePop)} ${esc(t.proyectosPage.titleL2)} ${esc(t.proyectosPage.titleL3)}</h1>
${proyectosConDetalle().map((p) => `<article>
<h2>${link(`/proyectos/${p.id}`, p.caption)}</h2>
<p>${esc(p.subject)} · ${esc(p.year)}${p.student ? ` · ${esc(p.student)}` : ''}</p>
</article>`).join('\n')}
</main>`;
}

function proyectoBody(p: Proyecto): string {
  const m = p.modal!;
  return `${nav}
<main>
<article>
<p>${link('/proyectos', '← Proyectos')}</p>
<h1>${esc(m.titleEs ?? p.caption)}</h1>
<p>${esc(p.caption)}</p>
<p>${esc(p.subject)} · ${esc(p.year)}${p.professor ? ` · Docente: ${esc(p.professor)}` : ''}${p.student ? ` · ${esc(p.student)}` : ''}</p>
${paragraphs(m.descriptionEs)}
${m.skillsEs?.length ? `<h2>Habilidades</h2><ul>${m.skillsEs.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
</article>
</main>`;
}

// ── escritura ─────────────────────────────────────────────────────────────
const template = readFileSync(join(DIST, 'index.html'), 'utf8');

function setHead(html: string, seo: PageSeo): string {
  const url = `${SITE_URL}${seo.path}`;
  const image = resolveImageUrl(seo.image);
  const meta = (attr: string, key: string, val: string) => {
    const re = new RegExp(`<meta ${attr}="${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}" content="[^"]*" ?/?>`);
    const tag = `<meta ${attr}="${key}" content="${esc(val)}" />`;
    return (h: string) => (re.test(h) ? h.replace(re, tag) : h.replace('</head>', `  ${tag}\n</head>`));
  };
  const steps = [
    (h: string) => h.replace(/<title>[^<]*<\/title>/, `<title>${esc(seo.title)}</title>`),
    meta('name', 'description', seo.description),
    (h: string) => h.replace(/<link rel="canonical" href="[^"]*" ?\/?>/, `<link rel="canonical" href="${url}" />`),
    meta('property', 'og:title', seo.title),
    meta('property', 'og:description', seo.description),
    meta('property', 'og:type', seo.type ?? 'website'),
    meta('property', 'og:url', url),
    meta('property', 'og:image', image),
    meta('name', 'twitter:title', seo.title),
    meta('name', 'twitter:description', seo.description),
    meta('name', 'twitter:image', image),
    (h: string) => seo.jsonLd
      ? h.replace('</head>', `  <script id="pcd-jsonld-route" type="application/ld+json">${JSON.stringify(seo.jsonLd).replace(/</g, '\\u003c')}</script>\n</head>`)
      : h,
  ];
  return steps.reduce((h, f) => f(h), html);
}

function write(path: string, seo: PageSeo, body: string) {
  const html = setHead(template, seo).replace(
    '<div id="root"></div>',
    `<div id="root"><div class="pcd-prerender">\n${body}\n</div></div>`,
  );
  // /blog → dist/blog.html (no dist/blog/index.html): Netlify sirve
  // blog.html en /blog con 200; con una carpeta /blog/index.html redirige
  // a /blog/ (301) y el canonical sin barra apuntaría a una redirección.
  const file = path === '/' ? join(DIST, 'index.html') : join(DIST, `${path}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

// 404: la app tal cual, sin contenido previo (para rutas que no existen).
writeFileSync(join(DIST, '404.html'), template.replace('<head>', '<head>\n  <meta name="robots" content="noindex" />'));

const routes: string[] = [];
const add = (path: string, seo: PageSeo, body: string) => { write(path, seo, body); routes.push(path); };

add('/', homeSeo('es'), homeBody());
add('/proyectos', proyectosListSeo('es'), proyectosListBody());
for (const p of proyectosConDetalle()) add(`/proyectos/${p.id}`, proyectoSeo(p, p.id, 'es'), proyectoBody(p));
add('/blog', blogListSeo('es'), blogListBody());
for (const p of postsConDetalle()) add(`/blog/${p.id}`, blogPostSeo(p, p.id, 'es'), blogPostBody(p));

// sitemap.xml
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generado por scripts/prerender.ts en cada build, desde src/data/*.ts. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => {
  const depth = r === '/' ? 0 : r.split('/').length - 1;
  const priority = depth === 0 ? '1.0' : depth === 1 ? '0.8' : '0.6';
  return `  <url>\n    <loc>${SITE_URL}${r}</loc>\n    <changefreq>${depth < 2 ? 'weekly' : 'monthly'}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}).join('\n')}
</urlset>
`);

// robots.txt — todos los bots, incluidos los de IA, pueden rastrear.
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`);

// llms.txt — resumen en Markdown para modelos de lenguaje (https://llmstxt.org).
const md = [
  `# ${SITE_NAME}`,
  '',
  `> ${homeSeo('es').description}`,
  '',
  `Pregrado de ${t.hero.meta.duracion} en ${t.hero.meta.ciudad}, ${t.hero.meta.uni} (SNIES 116265). Inscripciones: ${APLICA_URL} · Charla informativa: ${CHARLA_URL}`,
  '',
  '## Ejes del programa',
  '',
  ...[t.axis02, t.axis01, t.axis03].map((a) => `- **${a.wordFull}**: ${a.caption}. ${plain(a.contenidoBody)}`),
  '',
  '## Docentes',
  '',
  ...docentes.map((d) => `- **${docenteName(d)}**: ${d.bio}`),
  '',
  '## Páginas',
  '',
  `- [Inicio](${SITE_URL}/): el programa, sus ejes, docentes y equipo`,
  `- [Proyectos de estudiantes](${SITE_URL}/proyectos)`,
  `- [Blog](${SITE_URL}/blog)`,
  '',
  '## Proyectos',
  '',
  ...proyectosConDetalle().map((p) => `- [${p.modal!.titleEs ?? p.caption}](${SITE_URL}/proyectos/${p.id}): ${p.caption}`),
  '',
  '## Blog',
  '',
  ...postsConDetalle().map((p) => `- [${p.title}](${SITE_URL}/blog/${p.id}): ${p.excerpt}`),
  '',
];
writeFileSync(join(DIST, 'llms.txt'), md.join('\n'));

// Imágenes, video y PDF a Cloudflare (ver ASSET_CDN en src/seo/site.ts):
// toda ruta /programa/... en JS, CSS y HTML pasa a la URL del CDN, y la
// carpeta se quita de dist para que Netlify no la publique. Si algo quedara
// apuntando a /programa/, _redirects lo manda al CDN.
const toCdn = (text: string) =>
  text
    .replaceAll(`${SITE_URL}/programa/`, `${ASSET_CDN}/programa/`)
    .replace(/(["'`(=\s])\/programa\//g, `$1${ASSET_CDN}/programa/`)
    .replaceAll(`${ASSET_CDN}/programa/video`, VIDEO_CDN);
let rewritten = 0;
const rewrite = (dir: string) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) { if (entry.name !== 'programa') rewrite(file); continue; }
    if (!/\.(js|css|html|txt|xml)$/.test(entry.name)) continue;
    const src = readFileSync(file, 'utf8');
    const out = toCdn(src);
    if (out !== src) { writeFileSync(file, out); rewritten++; }
  }
};
rewrite(DIST);
rmSync(join(DIST, 'programa'), { recursive: true, force: true });

console.log(`prerender: ${routes.length} rutas, 404.html, sitemap.xml, robots.txt, llms.txt → ${SITE_URL}`);
console.log(`prerender: ${rewritten} archivos con /programa/ → ${ASSET_CDN}`);
