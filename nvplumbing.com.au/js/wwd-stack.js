// ─────────────────────────────────────────────────────────────
// Designed & developed by
// Biplab Kumar Paul — Web Designer & Developer
// Mobile: 01735 927356
// Email:  biplab.cse.85@gmail.com
// ─────────────────────────────────────────────────────────────
//
// "What we do" — premium stacked sticky cards.
// The stacking itself is pure CSS `position: sticky`; GSAP ScrollTrigger
// only layers a subtle scale/brightness for depth as each card is covered.
// If GSAP is unavailable (offline / reduced-motion) the sticky stack still works.
//

export function initWwdStack() {
  const stack = document.querySelector('.pf-stack');
  if (!stack) return;

  const cards = [...stack.querySelectorAll('.service-card')];
  if (cards.length < 2) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  // Graceful fallback — CSS sticky already delivers the stack.
  if (reduce || !gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const readVar = name => parseFloat(getComputedStyle(stack).getPropertyValue(name)) || 0;
  const pinTop = idx => readVar('--pf-stack-top') + idx * readVar('--pf-stack-peek');

  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (!next) return;                       // last card stays full size

    // Shrink card `i` as card `i + 1` rises up and pins on top of it.
    gsap.fromTo(
      card,
      { scale: 1, filter: 'brightness(1)' },
      {
        scale: 0.94,
        filter: 'brightness(0.965)',
        ease: 'none',
        scrollTrigger: {
          trigger: next,
          start: 'top bottom',                       // next card enters from below
          end: () => `top ${pinTop(i + 1)}`,         // next card reaches its pin
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      }
    );
  });

  // Re-measure once fonts/images have settled so pins are pixel-accurate.
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
