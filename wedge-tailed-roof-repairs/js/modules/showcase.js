// =============================================================
// MODULE · Showcase (hover/focus a service row → crossfade the photo)
// Rows are buttons, not links — they only swap the left image.
// =============================================================
import { $, $$, on } from '../utils/dom.js';

export function initShowcase() {
  const section = $('[data-showcase]');
  if (!section) return;

  const rows = $$('[data-showcase-row]', section);
  const imgs = $$('[data-showcase-img]', section);
  if (!rows.length || !imgs.length) return;

  const activate = (index) => {
    rows.forEach((row, i) => row.classList.toggle('is-active', i === index));
    imgs.forEach((img, i) => img.classList.toggle('is-active', i === index));
  };

  rows.forEach((row, i) => {
    // Pointer hover + keyboard focus both swap the photo
    on(row, 'mouseenter', () => activate(i));
    on(row, 'focus', () => activate(i));
  });
}
