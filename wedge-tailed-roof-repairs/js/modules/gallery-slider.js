// =============================================================
// MODULE · Projects gallery → Swiper slider on MOBILE ONLY.
// Initialised below 1024px; destroyed at >= 1024px so the desktop
// 3-column grid (CSS) is left completely unchanged.
// Expects global `Swiper` (CDN).
// =============================================================
import { $ } from '../utils/dom.js';

export function initGallerySlider() {
  const el = $('.gallery.swiper');
  if (!el || typeof window.Swiper === 'undefined') return;

  const mq = window.matchMedia('(max-width: 1023.98px)');
  let swiper = null;

  const enable = () => {
    if (swiper) return;
    swiper = new window.Swiper(el, {
      slidesPerView: 1.15,
      spaceBetween: 16,
      grabCursor: true,
      pagination: {
        el: el.querySelector('.swiper-pagination'),
        clickable: true,
      },
      breakpoints: {
        480: { slidesPerView: 2.1 },
        640: { slidesPerView: 2.3 },
      },
      a11y: { enabled: true },
    });
  };

  const disable = () => {
    if (!swiper) return;
    swiper.destroy(true, true); // remove instance + clean inline styles
    swiper = null;
  };

  const apply = () => (mq.matches ? enable() : disable());
  apply();
  if (mq.addEventListener) mq.addEventListener('change', apply);
  else mq.addListener(apply); // older Safari
}
