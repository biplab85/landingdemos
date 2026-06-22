// ─────────────────────────────────────────────────────────────
// Designed & developed by
// Biplab Kumar Paul — Web Designer & Developer
// Mobile: 01735 927356
// Email:  biplab.cse.85@gmail.com
// ─────────────────────────────────────────────────────────────

export function initAccordion() {
  document.querySelectorAll('.accordion').forEach(acc => {
    acc.querySelectorAll('.accordion__item').forEach(item => {
      const head = item.querySelector('.accordion__head');
      const body = item.querySelector('.accordion__body');
      if (!head || !body) return;

      head.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // close siblings (single-open behavior)
        acc.querySelectorAll('.accordion__item.is-open').forEach(other => {
          if (other !== item) {
            other.classList.remove('is-open');
            const ob = other.querySelector('.accordion__body');
            const oh = other.querySelector('.accordion__head');
            if (ob) ob.style.maxHeight = '0px';
            if (oh) oh.setAttribute('aria-expanded', 'false');
          }
        });

        if (isOpen) {
          item.classList.remove('is-open');
          body.style.maxHeight = '0px';
          head.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('is-open');
          body.style.maxHeight = body.scrollHeight + 'px';
          head.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });
}
