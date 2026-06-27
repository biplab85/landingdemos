import { defineConfig } from 'vite';
import { resolve } from 'path';

// Source lives in `src/`. The production build is emitted directly into the
// project root (this folder) so the site is served as `showtime-roofing/index.html`
// — no `dist/` segment in the URL. `base: './'` makes every asset reference
// relative, so the built site works when served from any sub-path (e.g. the
// landing-demos directory at /showtime-roofing/).
export default defineConfig({
  root: 'src',
  base: './',
  publicDir: false,
  build: {
    outDir: resolve(__dirname, '.'),
    emptyOutDir: false, // outDir is the project root; `npm run prebuild` cleans stale output instead
    assetsInlineLimit: 4096,
    rollupOptions: {
      // Multi-page: register each HTML page as an entry.
      input: {
        main: resolve(__dirname, 'src/index.html'),
        services: resolve(__dirname, 'src/services.html'),
        about: resolve(__dirname, 'src/about.html'),
        'our-work': resolve(__dirname, 'src/our-work.html'),
        contact: resolve(__dirname, 'src/contact.html'),
      },
    },
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
