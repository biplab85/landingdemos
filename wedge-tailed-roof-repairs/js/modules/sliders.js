// =============================================================
// MODULE · Swiper sliders (testimonials, services, gallery, trust marquee)
// Expects global `Swiper` (loaded via CDN in index.html).
// =============================================================
import { $ } from '../utils/dom.js';
import { prefersReducedMotion } from '../utils/prefers-motion.js';

export function initSliders() {
  if (typeof window.Swiper === 'undefined') return;
  const { Swiper } = window;

  // ---- Trust marquee (continuous) ----
  if ($('.trust-slider')) {
    new Swiper('.trust-slider', {
      slidesPerView: 'auto',
      spaceBetween: 48,
      loop: true,
      allowTouchMove: false,
      speed: 4000,
      autoplay: prefersReducedMotion()
        ? false
        : { delay: 0, disableOnInteraction: false },
    });
  }
}
