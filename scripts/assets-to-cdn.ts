import type { Plugin } from 'vite';
import { ASSET_CDN, VIDEO_CDN } from '../src/seo/site';

/**
 * Imágenes, PDF y video viven fuera de Netlify (ver ASSET_CDN y VIDEO_CDN en
 * src/seo/site.ts). En el código las rutas siguen siendo /programa/... para
 * que `npm run dev` use public/. En el build se reescriben AQUÍ, antes de que
 * Vite calcule el hash de cada archivo: así, si cambia la URL del CDN, cambia
 * también el nombre del archivo y ningún caché (por ejemplo la precarga de
 * TikTok) puede seguir sirviendo la versión vieja con el mismo nombre.
 *
 * Lo usan vite.config.ts (la app) y scripts/prerender.vite.config.ts (el HTML
 * prerenderizado de /pauta), para que las dos versiones pidan las mismas URL.
 */
export function assetsToCdn(): Plugin {
  return {
    name: 'assets-to-cdn',
    apply: 'build',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('/src/') || !code.includes('/programa/')) return null;
      return code
        .replace(/(["'`(])\/programa\/video/g, `$1${VIDEO_CDN}`)
        .replace(/(["'`(])\/programa\//g, `$1${ASSET_CDN}/programa/`);
    },
  };
}
