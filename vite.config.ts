import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { assetsToCdn } from './scripts/assets-to-cdn'

// El sitio es 100% estático — landing + /proyectos + /blog, contenido a mano
// en src/data/*.ts. No hay backend ni API que proxear (el proxy de /api y
// /cdn hacia el antiguo backend de Galería 3D se quitó al eliminar esa
// carpeta del repo — auditoría sep. 2026).
//
// Dos entradas: index.html (todo el sitio) y pauta.html (/pauta, la página de
// los anuncios). La de pauta no carga el enrutador ni el resto del sitio, para
// que pese lo menos posible.
export default defineConfig({
  plugins: [assetsToCdn(), react()],
  base: '/',
  build: {
    rollupOptions: {
      input: { main: 'index.html', pauta: 'pauta.html' },
    },
  },
})
