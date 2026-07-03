// =============================================================
// MODULE · Accordion / FAQ (accessible, animated height)
// =============================================================
import { $$, on } from '../utils/dom.js';

export function initAccordion() {
  const items = $$('.accordion-item');
  if (!items.length) return;

  items.forEach((item) => {
    const trigger = item.querySelector('.accordion-item__trigger');
    const panel = item.querySelector('.accordion-item__panel');
    if (!trigger || !panel) return;

    const setOpen = (open) => {
      item.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
      panel.style.maxHeight = open ? `${panel.scrollHeight}px` : '0px';
    };

    on(trigger, 'click', () => {
      const isOpen = item.classList.contains('is-open');
      // Close siblings for a clean single-open accordion
      items.forEach((other) => {
        if (other !== item) {
          other.classList.remove('is-open');
          const t = other.querySelector('.accordion-item__trigger');
          const p = other.querySelector('.accordion-item__panel');
          if (t) t.setAttribute('aria-expanded', 'false');
          if (p) p.style.maxHeight = '0px';
        }
      });
      setOpen(!isOpen);
    });

    // Recalculate open panel height on resize
    on(window, 'resize', () => {
      if (item.classList.contains('is-open')) {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    });
  });
}
