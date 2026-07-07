/**
 * Image optimiser — resizes the heavy WordPress JPEGs and emits a .webp
 * alongside a compressed .jpg fallback for each photo. Idempotent.
 *
 *   node scripts/optimize-images.mjs
 */
import { readdir, stat } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "img");

// max width per folder (px)
const MAXW = {
  hero: 1600,
  about: 1200,
  services: 900,
  gallery: 1300,
  team: 800,
  backgrounds: 1800,
};

const JPG = new Set([".jpg", ".jpeg"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const widthFor = (p) => {
  const folder = p.split(/[\\/]/).at(-2);
  return MAXW[folder] ?? 1200;
};

let count = 0;
for await (const file of walk(ROOT)) {
  const ext = extname(file).toLowerCase();
  if (!JPG.has(ext)) continue;

  const maxW = widthFor(file);
  const img = sharp(file);
  const meta = await img.metadata();
  const resize =
    meta.width && meta.width > maxW ? { width: maxW, withoutEnlargement: true } : null;

  const base = file.slice(0, -ext.length);

  // webp
  await sharp(file)
    .resize(resize ?? {})
    .webp({ quality: 78 })
    .toFile(`${base}.webp`);

  // compressed jpg fallback (write to tmp then replace)
  const tmp = `${base}.opt.jpg`;
  await sharp(file)
    .resize(resize ?? {})
    .jpeg({ quality: 76, mozjpeg: true, progressive: true })
    .toFile(tmp);

  const { default: fs } = await import("node:fs/promises");
  await fs.rename(tmp, `${base}.jpg`);
  if (ext === ".jpeg") await fs.rm(file, { force: true }); // normalise to .jpg

  const s = await stat(`${base}.jpg`);
  count++;
  console.log(`✓ ${file.replace(ROOT, "img")}  →  ${(s.size / 1024).toFixed(0)}kb jpg + webp`);
}
console.log(`\nOptimised ${count} images.`);
