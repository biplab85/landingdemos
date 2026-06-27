// Removes stale build output from the project root before each build.
// The Vite build emits into this root (so the served URL is /showtime-roofing/
// index.html with no /dist/ segment), and because outDir == root we cannot use
// Vite's `emptyOutDir`. This script removes only the generated artifacts —
// never the `src/` sources, node_modules, configs, or the directory card logo.
import { rmSync } from 'fs';

const builtPages = ['index', 'services', 'about', 'our-work', 'contact'];

rmSync('assets', { recursive: true, force: true }); // hashed JS/CSS/images from the previous build
for (const p of builtPages) rmSync(`${p}.html`, { force: true });

console.log('prebuild: cleaned previous build output (assets/, *.html)');
