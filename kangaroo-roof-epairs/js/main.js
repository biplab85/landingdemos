// =============================================================================
// Kangaroo Roof Repairs — JS entry. Bundled to assets/js/bundle.min.js (esbuild).
// Third-party libs (GSAP, Swiper, Fancybox) load via CDN as globals; every
// module guards for their absence so the page never breaks.
// =============================================================================
import * as header from "./modules/header.js";
import * as navDrawer from "./modules/nav-drawer.js";
import * as accordion from "./modules/accordion.js";
import * as footerAccordion from "./modules/footer-accordion.js";
import * as beforeAfter from "./modules/before-after.js";
import * as counters from "./modules/counters.js";
import * as smoothScroll from "./modules/smooth-scroll.js";
import * as magnetic from "./modules/magnetic.js";
import * as sliders from "./modules/sliders.js";
import * as lightbox from "./modules/lightbox.js";
import * as quoteModal from "./modules/quote-modal.js";
import * as forms from "./modules/forms.js";
import * as animations from "./modules/animations.js";

const boot = () => {
  [
    header,
    navDrawer,
    accordion,
    footerAccordion,
    beforeAfter,
    counters,
    smoothScroll,
    magnetic,
    sliders,
    lightbox,
    quoteModal,
    forms,
    animations,
  ].forEach((m) => {
    try {
      m.init();
    } catch (err) {
      // Never let one module take the page down
      console.error("[init]", err);
    }
  });

  document.documentElement.classList.add("js-ready");
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
