import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { ASSET_CDN, VIDEO_CDN } from './src/seo/site'

/**
 * Imágenes, PDF y video viven fuera de Netlify (ver ASSET_CDN y VIDEO_CDN en
 * src/seo/site.ts). En el código las rutas siguen siendo /programa/... para
 * que `npm run dev` use public/. En el build se reescriben AQUÍ, antes de que
 * Vite calcule el hash de cada archivo: así, si cambia la URL del CDN, cambia
 * también el nombre del archivo y ningún caché (por ejemplo la precarga de
 * TikTok) puede seguir sirviendo la versión vieja con el mismo nombre.
 */
function assetsToCdn(): Plugin {
  return {
    name: 'assets-to-cdn',
    apply: 'build',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('/src/') || !code.includes('/programa/')) return null
      return code
        .replace(/(["'`(])\/programa\/video/g, `$1${VIDEO_CDN}`)
        .replace(/(["'`(])\/programa\//g, `$1${ASSET_CDN}/programa/`)
    },
  }
}

// El sitio es 100% estático — landing + /proyectos + /blog, contenido a mano
// en src/data/*.ts. No hay backend ni API que proxear (el proxy de /api y
// /cdn hacia el antiguo backend de Galería 3D se quitó al eliminar esa
// carpeta del repo — auditoría sep. 2026).
export default defineConfig({
  plugins: [assetsToCdn(), react()],
  base: '/',
})
