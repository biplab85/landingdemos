// =============================================================
// MODULE · Accordion (FAQ) — accessible disclosure
// =============================================================

export function initAccordion() {
  const items = document.querySelectorAll('[data-accordion-item]');
  if (!items.length) return;

  items.forEach((item) => {
    const trigger = item.querySelector('[data-accordion-trigger]');
    const panel = item.querySelector('[data-accordion-panel]');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // single-open behaviour
      items.forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('[data-accordion-trigger]')
          ?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}
