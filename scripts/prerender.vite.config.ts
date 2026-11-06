import { defineConfig } from 'vite';

// Compila scripts/prerender.ts para Node (ver "build" en package.json).
// publicDir: false → no copia las imágenes de /public a .prerender.
export default defineConfig({
  publicDir: false,
  logLevel: 'warn',
  build: {
    ssr: 'scripts/prerender.ts',
    outDir: '.prerender',
    emptyOutDir: true,
  },
});
