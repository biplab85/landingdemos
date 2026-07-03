// =============================================================
// MODULE · Mobile nav drawer (open/close, focus trap, a11y)
// =============================================================
import { $, $$, on } from '../utils/dom.js';

export function initNavDrawer() {
  const drawer = $('.drawer');
  const toggle = $('.nav__toggle');
  const closeBtn = $('.drawer__close');
  const scrim = $('.drawer__scrim');
  if (!drawer || !toggle) return;

  const focusableSel =
    'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  const open = () => {
    lastFocused = document.activeElement;
    drawer.classList.add('is-open');
    document.body.classList.add('is-locked');
    toggle.setAttribute('aria-expanded', 'true');
    const first = $(focusableSel, drawer);
    if (first) first.focus();
  };

  const close = () => {
    drawer.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    toggle.setAttribute('aria-expanded', 'false');
    if (lastFocused) lastFocused.focus();
  };

  const trapFocus = (e) => {
    if (e.key !== 'Tab' || !drawer.classList.contains('is-open')) return;
    const items = $$(focusableSel, drawer).filter((el) => el.offsetParent !== null);
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

  on(toggle, 'click', open);
  on(closeBtn, 'click', close);
  on(scrim, 'click', close);
  on(document, 'keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
    trapFocus(e);
  });

  // Close when a nav link is tapped
  $$('.drawer__link', drawer).forEach((link) => on(link, 'click', close));
}
