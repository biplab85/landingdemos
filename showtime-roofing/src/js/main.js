// =============================================================
// SHOWTIME ROOFING · JS entry
// =============================================================
import '../scss/main.scss';
import 'swiper/css';
import 'swiper/css/pagination';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

import { initHeader } from './modules/header.js';
import { initHeroSlider } from './modules/heroSlider.js';
import { initSliders } from './modules/sliders.js';
import { initGallery } from './modules/gallery.js';
import { initAccordion } from './modules/accordion.js';
import { initForm } from './modules/form.js';
import { initCounters } from './modules/counters.js';
import { initFilter } from './modules/filter.js';
import { initAnimations } from './modules/animations.js';

// Flag that JS is available (drives reveal from-states in SCSS)
document.documentElement.classList.add('js');

const onReady = () => {
  initHeader();
  initHeroSlider();
  initSliders();
  initGallery();
  initAccordion();
  initForm();
  initCounters();
  initFilter();
  initAnimations();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onReady);
} else {
  onReady();
}
