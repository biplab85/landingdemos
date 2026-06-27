// =============================================================
// MODULE · Sliders (Swiper)
// =============================================================
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, A11y, Keyboard } from 'swiper/modules';

export function initSliders() {
  // ---- Testimonials (centered coverflow) ----
  const testimonialEl = document.querySelector('[data-swiper="testimonials"]');
  if (testimonialEl) {
    new Swiper(testimonialEl, {
      modules: [Pagination, Navigation, A11y, Keyboard],
      // `loop` fights `centeredSlides` in Swiper 11 (off-by-one positioning),
      // so use `rewind` for reliable centering of the active hero card.
      rewind: true,
      centeredSlides: true,
      initialSlide: 1, // start mid-set so both neighbours peek like the design
      slidesPerView: 1.15,
      spaceBetween: 20,
      grabCursor: true,
      watchOverflow: true,
      keyboard: { enabled: true },
      navigation: {
        prevEl: '[data-swiper-prev="testimonials"]',
        nextEl: '[data-swiper-next="testimonials"]',
      },
      breakpoints: {
        // 2 slides + centered = middle card full, 50% of each neighbour showing
        768: { slidesPerView: 1.5, spaceBetween: 24 },
        1200: { slidesPerView: 2, spaceBetween: 28 },
      },
    });
  }

  // ---- Services: swipe on mobile, static grid >= lg ----
  const servicesEl = document.querySelector('[data-swiper="services"]');
  if (servicesEl) {
    let instance = null;
    const mq = window.matchMedia('(max-width: 991px)');

    const sync = () => {
      if (mq.matches && !instance) {
        instance = new Swiper(servicesEl, {
          modules: [A11y, Pagination],
          slidesPerView: 1.1,
          spaceBetween: 16,
          grabCursor: true,
          watchOverflow: true,
          pagination: {
            el: servicesEl.querySelector('.swiper-pagination'),
            clickable: true,
          },
          breakpoints: { 576: { slidesPerView: 2.1 } },
        });
      } else if (!mq.matches && instance) {
        instance.destroy(true, true);
        instance = null;
      }
    };
    sync();
    mq.addEventListener('change', sync);
  }
}
