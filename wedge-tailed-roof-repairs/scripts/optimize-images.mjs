// =============================================================
// IMAGE OPTIMISATION PIPELINE
// Generates AVIF + WebP (and resized variants) from source images
// in assets/images/**. Run: npm run images
//
// Source of truth = original JP/PNG in assets/images/.
// Output = sibling .avif / .webp + width-suffixed variants.
// =============================================================
import { readdir, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.resolve(__dirname, '../assets/images');
const WIDTHS = [480, 800, 1200, 1600];
const SOURCE_EXT = ['.jpg', '.jpeg', '.png'];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (SOURCE_EXT.includes(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

async function process(file) {
  const dir = path.dirname(file);
  const base = path.basename(file, path.extname(file));
  const outDir = path.join(dir, 'optimized');
  if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });

  for (const width of WIDTHS) {
    const pipeline = sharp(file).resize({ width, withoutEnlargement: true });
    await pipeline
      .clone()
      .avif({ quality: 55 })
      .toFile(path.join(outDir, `${base}-${width}.avif`));
    await pipeline
      .clone()
      .webp({ quality: 72 })
      .toFile(path.join(outDir, `${base}-${width}.webp`));
  }
  // eslint-disable-next-line no-console
  console.log(`✓ ${base}`);
}

async function run() {
  if (!existsSync(IMAGES_DIR)) {
    console.warn(`No images directory at ${IMAGES_DIR}. Nothing to do.`);
    return;
  }
  const files = await walk(IMAGES_DIR);
  const sources = files.filter((f) => !f.includes(`${path.sep}optimized${path.sep}`));
  if (!sources.length) {
    console.warn('No source images found (.jpg/.jpeg/.png).');
    return;
  }
  console.log(`Optimising ${sources.length} image(s)…`);
  await Promise.all(sources.map(process));
  console.log('Done.');
}

run().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
