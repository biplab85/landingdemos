// One-off: render favicon.svg → PNGs + favicon.ico
import { readFileSync, writeFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import pngToIco from 'png-to-ico';

const dir = new URL('../assets/img/', import.meta.url);
const svg = readFileSync(new URL('favicon.svg', dir));

const render = (size) =>
  new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();

const sizes = { 'favicon-16.png': 16, 'favicon-32.png': 32, 'favicon-180.png': 180, 'apple-touch-icon.png': 180 };
for (const [name, size] of Object.entries(sizes)) {
  writeFileSync(new URL(name, dir), render(size));
  console.log('wrote', name, size + 'px');
}

const ico = await pngToIco([render(16), render(32), render(48)]);
writeFileSync(new URL('favicon.ico', dir), ico);
console.log('wrote favicon.ico');
