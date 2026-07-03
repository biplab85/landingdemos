// =============================================================
// MODULE · Smooth anchor scrolling (respects reduced-motion)
// =============================================================
import { $$, on } from '../utils/dom.js';
import { prefersReducedMotion } from '../utils/prefers-motion.js';

export function initSmoothScroll() {
  $$('a[href^="#"]').forEach((link) => {
    // Quote CTAs / showreel trigger open a modal instead of scrolling
    if (link.hasAttribute('data-open-quote') || link.hasAttribute('data-open-showreel')) return;
    on(link, 'click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      });
      // Move focus for keyboard/screen-reader users
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
}
