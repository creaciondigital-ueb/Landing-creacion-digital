import { defineConfig } from 'vite';
import { assetsToCdn } from './assets-to-cdn';

// Compila scripts/prerender.ts para Node (ver "build" en package.json).
// publicDir: false → no copia las imágenes de /public a .prerender.
// assetsToCdn: /pauta se prerenderiza con React, y sus imágenes deben apuntar
// al CDN igual que en el navegador. jsx automático: tsconfig.json solo
// cubre src/.
export default defineConfig({
  publicDir: false,
  logLevel: 'warn',
  plugins: [assetsToCdn()],
  esbuild: { jsx: 'automatic' },
  build: {
    ssr: 'scripts/prerender.ts',
    outDir: '.prerender',
    emptyOutDir: true,
  },
});
