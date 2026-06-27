// =============================================================
// MODULE · Animations (GSAP) — subtle micro-interactions only
// Respects prefers-reduced-motion (CLAUDE.md §6)
// =============================================================
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reduced motion: snap everything to its final state, do nothing else.
  if (reduce) {
    gsap.set('[data-reveal], [data-stagger] > *', { opacity: 1, y: 0 });
    return;
  }

  // ---- Hero load reveal (staggered) ----
  const heroItems = gsap.utils.toArray('[data-hero-item]');
  if (heroItems.length) {
    gsap.from(heroItems, {
      y: 28,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.12,
      delay: 0.15,
    });
  }

  // ---- Fade-up on scroll ----
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      }
    );
  });

  // ---- Staggered groups (cards) ----
  gsap.utils.toArray('[data-stagger]').forEach((group) => {
    const children = group.children;
    gsap.fromTo(
      children,
      { y: 28, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: { trigger: group, start: 'top 82%' },
      }
    );
  });

  // ---- Process orbit: card entrance (opacity only, to keep N/E/S/W
  //      centering transforms intact) + gentle float on the hub core ----
  const orbitCards = gsap.utils.toArray('[data-orbit-card]');
  if (orbitCards.length) {
    gsap.from(orbitCards, {
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.12,
      scrollTrigger: { trigger: '[data-orbit]', start: 'top 75%' },
    });
  }
  const orbitCore = document.querySelector('[data-orbit-core]');
  if (orbitCore) {
    gsap.to(orbitCore, {
      y: -10,
      duration: 2.8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }

  // ---- Gentle parallax ----
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const depth = parseFloat(el.dataset.parallax) || 0.12;
    gsap.to(el, {
      yPercent: depth * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  ScrollTrigger.refresh();
}
