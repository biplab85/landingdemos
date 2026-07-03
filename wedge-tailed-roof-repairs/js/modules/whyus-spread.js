// =============================================================
// MODULE · Why-Us cards scroll-spread
// The 4 cards start stacked in the centre (overlapping) and spread
// outward horizontally — equally left & right — as the section
// scrolls into view. Scrubbed to scroll position, so it reverses
// smoothly when scrolling back up (re-stacks).
//
// Desktop only (single row). On smaller screens the grid wraps, so
// the spread is disabled and the cards sit in their normal layout.
// Uses transforms only (x / scale) → no layout shift.
// =============================================================
import { $, $$ } from '../utils/dom.js';
import { prefersReducedMotion } from '../utils/prefers-motion.js';

export function initWhyusSpread() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const list = $('[data-whyus-spread]');
  if (!list || !gsap || !ScrollTrigger) return;

  const cards = $$('.whyus__card', list);
  if (cards.length < 2) return;

  gsap.registerPlugin(ScrollTrigger);

  // Reduced motion: leave cards in their natural spread layout.
  if (prefersReducedMotion()) return;

  const mm = gsap.matchMedia();

  // ---- Desktop: single row → horizontal spread from a centred stack ----
  mm.add('(min-width: 1024px)', () => {
    const centreIndex = (cards.length - 1) / 2;
    // Layout distance between consecutive cards (unaffected by transforms).
    const pitch = () => cards[1].offsetLeft - cards[0].offsetLeft;

    const tween = gsap.fromTo(
      cards,
      {
        // Start: every card translated to the row centre → stacked.
        x: (i) => (centreIndex - i) * pitch(),
        scale: 0.9,
        transformOrigin: 'center center',
      },
      {
        // End: natural grid position (equal spacing).
        x: 0,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '#why-us',
          start: 'top 82%',
          end: 'top 30%',
          scrub: 0.7, // smoothing → fluid + reversible with scroll direction
          invalidateOnRefresh: true, // recompute pitch on resize
        },
      }
    );

    // Cleanup when leaving this breakpoint
    return () => {
      tween.scrollTrigger && tween.scrollTrigger.kill();
      tween.kill();
      gsap.set(cards, { clearProps: 'transform' });
    };
  });
}
