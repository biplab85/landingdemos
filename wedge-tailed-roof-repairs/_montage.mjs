import sharp from 'sharp';
import { readdirSync } from 'fs';
const dir = process.argv[2];
const out = process.argv[3];
const files = readdirSync(dir).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f) && !f.startsWith('_')).sort();
const cell = 320, cols = 4, rows = Math.ceil(files.length / cols);
const composites = [];
for (let i = 0; i < files.length; i++) {
  const label = files[i];
  try {
    const buf = await sharp(`${dir}/${files[i]}`)
      .resize(cell, cell, { fit: 'cover' })
      .composite([{ input: Buffer.from(`<svg width="${cell}" height="38"><rect width="100%" height="100%" fill="black" opacity="0.65"/><text x="8" y="26" font-size="19" fill="white" font-family="sans-serif">${label}</text></svg>`), gravity: 'south' }])
      .jpeg().toBuffer();
    composites.push({ input: buf, left: (i % cols) * cell, top: Math.floor(i / cols) * cell });
  } catch (e) { console.log('skip', files[i], e.message); }
}
await sharp({ create: { width: cell * cols, height: cell * rows, channels: 3, background: '#222' } })
  .composite(composites).jpeg({ quality: 82 }).toFile(out);
console.log('montage done', files.length, 'from', dir);
