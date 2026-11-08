/**
 * Datos del sitio compartidos por la app (useSeo) y por el generador de HTML
 * para bots (scripts/prerender.ts). Sin dependencias de React ni del DOM, para
 * que el script de Node pueda importarlo.
 *
 * SITE_URL: dominio oficial. Mientras creaciondigital.online siga apuntando al
 * servidor viejo de DigitalOcean (sitio de junio 2026), el oficial es el de
 * Netlify. Cuando el dominio apunte a Netlify, se cambia SOLO esta línea.
 */
export const SITE_URL = 'https://creaciondigital-ueb.netlify.app';
export const SITE_NAME = 'Creación Digital · Universidad El Bosque';
/**
 * ASSET_CDN: imágenes, video y PDF (todo /programa/*) se sirven desde
 * Cloudflare Pages desde noviembre 2026, para no gastar ancho de banda de
 * Netlify con la pauta. En el código las rutas siguen siendo /programa/...
 * (así funciona `npm run dev`); scripts/prerender.ts las reescribe a esta URL
 * en el build. `v1` es la versión: los archivos se cachean un año, así que si
 * se cambia una imagen se sube todo bajo v2 y se cambia aquí.
 */
export const ASSET_CDN = 'https://creaciondigital-ueb-img.pages.dev/v1';
/**
 * El video va por jsDelivr (desde el repo público, fijado a un commit) porque
 * Cloudflare Pages no responde por rangos (206) y Safari en iPhone, incluido
 * el navegador de TikTok, no reproduce videos sin eso. Si cambia el video, se
 * actualiza el commit.
 */
export const VIDEO_CDN = 'https://cdn.jsdelivr.net/gh/creaciondigital-ueb/Landing-creacion-digital@f5540de/public/programa/video';
export const DEFAULT_OG_IMAGE = `${ASSET_CDN}/programa/img/Label_UEB_CreacionDigital_Horizontal.png`;
export const APLICA_URL = 'https://www.unbosque.edu.co/inscripciones/pregrado';
export const CHARLA_URL = 'https://forms.cloud.microsoft/r/rx1NFDC8v9?origin=lprLink';

export function resolveImageUrl(image?: string): string {
  if (!image) return DEFAULT_OG_IMAGE;
  if (image.startsWith('http')) return image;
  return image.startsWith('/programa/') ? `${ASSET_CDN}${image}` : `${SITE_URL}${image}`;
}
