// =============================================================
// MODULE · Quote modal (open from any [data-open-quote] trigger)
// Accessible: focus-trap, Esc to close, scrim/close-button dismiss,
// body scroll-lock, focus restored to the trigger on close.
// =============================================================
import { $, $$, on } from '../utils/dom.js';

export function initQuoteModal() {
  const modal = $('#quote-modal');
  if (!modal) return;

  const triggers = $$('[data-open-quote]');
  const closers = $$('[data-modal-close]', modal);
  if (!triggers.length) return;

  const focusableSel =
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  const open = (e) => {
    if (e) e.preventDefault();
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    document.body.classList.add('is-locked');
    const first = $(focusableSel, modal);
    if (first) first.focus();
  };

  const close = () => {
    modal.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    if (lastFocused) lastFocused.focus();
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
  on(document, 'keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    trapFocus(e);
  });
}
