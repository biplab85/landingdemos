// =============================================================
// MODULE · GSAP scroll reveals + hero intro
// Expects globals `gsap` and `ScrollTrigger` (CDN).
// Fully guarded for prefers-reduced-motion.
//
// Reveal contract:
//  - CSS (.js) hides [data-reveal] / [data-reveal-group] > * at opacity 0
//    and hero lines via transform, purely to prevent FOUC.
//  - GSAP uses fromTo() with an EXPLICIT end state (opacity 1 / transform
//    none), so it never depends on the CSS-forced current value.
//  - We do NOT clearProps opacity — the inline opacity:1 must persist to
//    override the CSS fallback. Only transform is cleared.
// =============================================================
import { $, $$ } from '../utils/dom.js';
import { prefersReducedMotion } from '../utils/prefers-motion.js';

export function initAnimations() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  // Progressive enhancement: without GSAP or with reduced-motion,
  // reveal everything immediately and bail. main.js reads this flag
  // so its failsafe only fires when GSAP never took over.
  if (!gsap || prefersReducedMotion()) {
    revealAllInstant();
    window.__revealsHandled = true;
    return;
  }

  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  window.__revealsHandled = true;

  // ---- Hero intro timeline ----
  const heroLines = $$('.hero__line > *');
  const heroExtras = $$('.hero .eyebrow, .hero__cta-row, .hero__aside, .hero__band');
  if (heroLines.length) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    // Lines are masked by overflow:hidden — slide up from below (no opacity).
    tl.fromTo(
      heroLines,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.9, stagger: 0.12 }
    ).fromTo(
      heroExtras,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.12 },
      '-=0.4'
    );
  }

  // Subtle hero image parallax
  const heroImg = $('.hero__media img');
  if (heroImg && ScrollTrigger) {
    gsap.to(heroImg, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // ---- Generic scroll reveals ----
  if (ScrollTrigger) {
    $$('[data-reveal]').forEach((el) => {
      const delay = parseFloat(el.dataset.revealDelay) || 0;
      gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }
      );
    });

    // Staggered groups (children reveal in sequence)
    $$('[data-reveal-group]').forEach((group) => {
      gsap.fromTo(
        group.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: group, start: 'top 82%', once: true },
        }
      );
    });

    // Subtle scroll parallax: elements drift from +dist → -dist as they
    // pass through the viewport. Transform-only, so no layout shift.
    $$('[data-parallax]').forEach((el) => {
      const dist = parseFloat(el.dataset.parallax) || 20;
      gsap.fromTo(
        el,
        { y: dist },
        {
          y: -dist,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    // Recalculate trigger positions once images/fonts settle, so late
    // layout shifts can't leave a section stuck hidden.
    window.addEventListener('load', () => ScrollTrigger.refresh());
    ScrollTrigger.refresh();
  }
}

// Force every reveal element to its visible resting state (fallback path).
function revealAllInstant() {
  $$('[data-reveal]').forEach((el) => (el.style.opacity = '1'));
  $$('[data-reveal-group]').forEach((g) =>
    Array.from(g.children).forEach((c) => (c.style.opacity = '1'))
  );
  $$('.hero__line > *').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}
