// ─────────────────────────────────────────────────────────────
// Designed & developed by
// Biplab Kumar Paul — Web Designer & Developer
// Mobile: 01735 927356
// Email:  biplab.cse.85@gmail.com
// ─────────────────────────────────────────────────────────────
//
// Quote modal — opens the contact/quote form from any CTA that
// points at #quote or #contact (or carries [data-open-quote]).
//

export function initQuoteModal() {
  const modal = document.getElementById('quote-modal');
  if (!modal) return;

  const triggers = document.querySelectorAll(
    'a[href="#quote"], a[href="#contact"], [data-open-quote]'
  );
  let lastFocus = null;

  const open = (e) => {
    if (e) e.preventDefault();
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const first = modal.querySelector('input, select, textarea, button:not([data-modal-close])');
    if (first) setTimeout(() => first.focus(), 80);
  };

  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  };

  triggers.forEach((t) => t.addEventListener('click', open));
  modal.querySelectorAll('[data-modal-close]').forEach((el) =>
    el.addEventListener('click', close)
  );
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
}
