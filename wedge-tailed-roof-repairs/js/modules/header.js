// =============================================================
// MODULE · Header (sticky scroll state + mobile action bar reveal)
// =============================================================
import { $, on, rafThrottle } from '../utils/dom.js';

export function initHeader() {
  const header = $('.site-header');
  const actionBar = $('.action-bar');
  if (!header) return;

  const threshold = 80;

  const update = () => {
    const scrolled = window.scrollY > threshold;
    header.classList.toggle('is-scrolled', scrolled);
    // Reveal the mobile sticky action bar once past the hero fold
    if (actionBar) {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    }
  };

  on(window, 'scroll', rafThrottle(update), { passive: true });
  update();
}
