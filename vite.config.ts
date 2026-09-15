import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// El sitio es 100% estático — landing + /proyectos + /blog, contenido a mano
// en src/data/*.ts. No hay backend ni API que proxear (el proxy de /api y
// /cdn hacia el antiguo backend de Galería 3D se quitó al eliminar esa
// carpeta del repo — auditoría sep. 2026).
export default defineConfig({
  plugins: [react()],
  base: '/',
})
