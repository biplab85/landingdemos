// =============================================================
// MODULE · Scrollspy — highlights the nav link for the section
// currently in view (header nav + drawer share the active class).
// =============================================================
import { $$ } from '../utils/dom.js';

export function initScrollspy() {
  const links = $$('.nav__link[href^="#"], .drawer__link[href^="#"]');
  if (!links.length) return;

  // Unique target sections that actually exist on the page
  const ids = [...new Set(links.map((l) => l.getAttribute('href').slice(1)))];
  const sections = ids
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach((l) => {
      l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`);
    });
  };

  // A thin band ~45% down the viewport decides the "current" section.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
}
