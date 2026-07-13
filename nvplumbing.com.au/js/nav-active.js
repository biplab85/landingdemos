// ─────────────────────────────────────────────────────────────
// Designed & developed by
// Biplab Kumar Paul — Web Designer & Developer
// Mobile: 01735 927356
// Email:  biplab.cse.85@gmail.com
// ─────────────────────────────────────────────────────────────
//
// Scroll-spy — highlights the header menu item for the section
// currently in view (adds/removes .is-active).
//

export function initNavActive() {
  const links = [...document.querySelectorAll('.pf-nav__list a[href^="#"]')]
    .map((a) => ({ a, id: a.getAttribute('href').slice(1) }))
    .filter((l) => l.id && document.getElementById(l.id));

  if (!links.length) return;

  const sections = links.map((l) => ({ ...l, el: document.getElementById(l.id) }));

  const setActive = (id) => {
    sections.forEach((s) => s.a.classList.toggle('is-active', s.id === id));
  };

  if (!('IntersectionObserver' in window)) return;

  // Track which observed sections are currently crossing the "active band"
  // (a thin horizontal strip just below the fixed header).
  const visible = new Set();

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      });

      // Of the sections touching the band, activate the one highest on the page.
      if (visible.size) {
        const topMost = sections
          .filter((s) => visible.has(s.id))
          .sort((a, b) => a.el.offsetTop - b.el.offsetTop)[0];
        if (topMost) setActive(topMost.id);
      }
    },
    { rootMargin: '-42% 0px -53% 0px', threshold: 0 }
  );

  sections.forEach((s) => io.observe(s.el));
}
