// =============================================================
// MODULE · Footer link groups → accordion on MOBILE ONLY.
// Below 1024px, each footer heading toggles its list. On desktop
// nothing is added (no chevron, role, tabindex, or listeners), so
// the desktop footer is completely unchanged.
// =============================================================
import { $$ } from '../utils/dom.js';

export function initFooterAccordion() {
  const groups = $$('.site-footer__group');
  if (!groups.length) return;

  const mq = window.matchMedia('(max-width: 1023.98px)');
  const state = new Map(); // group -> { title, icon, handler }

  const makeIcon = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'site-footer__acc-icon');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#i-plus');
    svg.appendChild(use);
    return svg;
  };

  const enable = () => {
    groups.forEach((group) => {
      if (state.has(group)) return;
      const title = group.querySelector('.site-footer__col-title');
      if (!title) return;

      const icon = makeIcon();
      title.appendChild(icon);
      title.setAttribute('role', 'button');
      title.setAttribute('tabindex', '0');
      title.setAttribute('aria-expanded', 'false');

      const handler = (e) => {
        if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
        if (e.type === 'keydown') e.preventDefault();
        const open = group.classList.toggle('is-open');
        title.setAttribute('aria-expanded', String(open));
      };
      title.addEventListener('click', handler);
      title.addEventListener('keydown', handler);
      state.set(group, { title, icon, handler });
    });
  };

  const disable = () => {
    state.forEach(({ title, icon, handler }, group) => {
      title.removeEventListener('click', handler);
      title.removeEventListener('keydown', handler);
      title.removeAttribute('role');
      title.removeAttribute('tabindex');
      title.removeAttribute('aria-expanded');
      if (icon && icon.parentNode) icon.parentNode.removeChild(icon);
      group.classList.remove('is-open');
    });
    state.clear();
  };

  const apply = () => (mq.matches ? enable() : disable());
  apply();
  if (mq.addEventListener) mq.addEventListener('change', apply);
  else mq.addListener(apply); // older Safari
}
