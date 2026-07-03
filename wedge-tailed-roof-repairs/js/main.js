// =============================================================
// WEDGE TAILED ROOF REPAIRS · JS ENTRY
// Imports feature modules and initialises them after DOM ready.
// Each module guards for its target element, so pages only run
// what they actually contain.
// =============================================================
import { $$ } from './utils/dom.js';
import { initHeader } from './modules/header.js';
import { initNavDrawer } from './modules/nav-drawer.js';
import { initSliders } from './modules/sliders.js';
import { initLightbox } from './modules/lightbox.js';
import { initAnimations } from './modules/animations.js';
import { initCounters } from './modules/counters.js';
import { initAccordion } from './modules/accordion.js';
import { initForms } from './modules/forms.js';
import { initSmoothScroll } from './modules/smooth-scroll.js';
import { initShowcase } from './modules/showcase.js';
import { initWhyusSpread } from './modules/whyus-spread.js';
import { initQuoteModal } from './modules/quote-modal.js';
import { initScrollspy } from './modules/scrollspy.js';
import { initFooterAccordion } from './modules/footer-accordion.js';
import { initGallerySlider } from './modules/gallery-slider.js';
import { initShowreel } from './modules/showreel.js';

// Failsafe: if anything throws, ensure reveal content is never left hidden.
function revealAll() {
  $$('[data-reveal]').forEach((el) => (el.style.opacity = '1'));
  $$('[data-reveal-group]').forEach((g) =>
    Array.from(g.children).forEach((c) => (c.style.opacity = '1'))
  );
  $$('.hero__line > *').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

function boot() {
  const tasks = [
    initHeader,
    initNavDrawer,
    initSliders,
    initLightbox,
    initCounters,
    initAccordion,
    initForms,
    initSmoothScroll,
    initQuoteModal,
    initScrollspy,
    initFooterAccordion,
    initGallerySlider,
    initShowreel,
    initShowcase,
    initAnimations,
    initWhyusSpread,
  ];
  tasks.forEach((fn) => {
    try {
      fn();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`[init] ${fn.name} failed:`, err);
    }
  });
}

try {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
} catch (err) {
  revealAll();
}

// Absolute failsafe: if the animation module never took over (hard JS
// failure, GSAP CDN blocked), make sure no reveal content is left hidden.
window.setTimeout(() => {
  if (!window.__revealsHandled) revealAll();
}, 3000);
