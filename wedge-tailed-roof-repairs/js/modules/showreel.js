// =============================================================
// MODULE · Showreel modal (cinematic fade image slider)
// Opened by the hero play button. Crossfade autoplay with Play/Pause
// controls. Accessible: focus-trap, Esc/scrim/close dismiss, body lock.
// Expects global `Swiper` (CDN).
// =============================================================
import { $, $$, on } from '../utils/dom.js';
import { prefersReducedMotion } from '../utils/prefers-motion.js';

export function initShowreel() {
  const modal = $('#showreel-modal');
  if (!modal) return;

  const triggers = $$('[data-open-showreel]');
  const closers = $$('[data-showreel-close]', modal);
  const toggleBtn = $('.showreel__toggle', modal);
  const sliderEl = $('.showreel__slider', modal);
  const focusableSel =
    'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

  let swiper = null;
  let lastFocused = null;
  let playing = true;

  const buildSwiper = () => {
    if (typeof window.Swiper === 'undefined') return null;
    return new window.Swiper(sliderEl, {
      loop: true,
      speed: 1100,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      autoplay: prefersReducedMotion()
        ? false
        : { delay: 3800, disableOnInteraction: false },
      pagination: {
        el: sliderEl.querySelector('.swiper-pagination'),
        clickable: true,
      },
      a11y: { enabled: true },
    });
  };

  const setPlaying = (state) => {
    playing = state;
    if (toggleBtn) {
      toggleBtn.classList.toggle('is-paused', !state);
      toggleBtn.setAttribute('aria-label', state ? 'Pause slideshow' : 'Play slideshow');
    }
  };

  const open = (e) => {
    if (e) e.preventDefault();
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    document.body.classList.add('is-locked');

    if (!swiper) swiper = buildSwiper();
    if (swiper) {
      swiper.update();
      if (swiper.autoplay && !prefersReducedMotion()) {
        swiper.autoplay.start();
        setPlaying(true);
      } else {
        setPlaying(false);
      }
    }
    if (closers[0]) closers[0].focus();
  };

  const close = () => {
    modal.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    if (swiper && swiper.autoplay) swiper.autoplay.stop();
    if (lastFocused) lastFocused.focus();
  };

  const toggle = () => {
    if (!swiper || !swiper.autoplay) return;
    if (playing) {
      swiper.autoplay.stop();
      setPlaying(false);
    } else {
      swiper.autoplay.start();
      setPlaying(true);
    }
  };

  const trapFocus = (e) => {
    if (e.key !== 'Tab') return;
    const items = $$(focusableSel, modal).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  triggers.forEach((t) => on(t, 'click', open));
  closers.forEach((c) => on(c, 'click', close));
  on(toggleBtn, 'click', toggle);
  on(document, 'keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    trapFocus(e);
  });
}
