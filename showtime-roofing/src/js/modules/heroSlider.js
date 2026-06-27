// =============================================================
// MODULE · Hero background slider
// Cross-fades the stacked hero slides and drives the index + the
// animated progress bars (home hero) in sync.
// =============================================================

export function initHeroSlider() {
  const slider = document.querySelector('[data-hero-slider]');
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll('.hero__slide'));
  if (slides.length < 2) return;

  // Optional UI (index counter + progress bars) — may be absent.
  const bars = Array.from(document.querySelectorAll('[data-hero-progress] .hero__bar'));
  const currentEl = document.querySelector('[data-hero-current]');
  const totalEl = document.querySelector('[data-hero-total]');
  const pad = (n) => String(n + 1).padStart(2, '0');
  if (totalEl) totalEl.textContent = pad(slides.length - 1);

  const paint = (i) => {
    slides.forEach((s, n) => s.classList.toggle('is-active', n === i));
    if (currentEl) currentEl.textContent = pad(i);
    // Restart the active bar's fill animation by toggling the class fresh.
    bars.forEach((b, n) => {
      b.classList.remove('is-active');
      if (n === i) {
        // force reflow so the animation replays even on the same element
        void b.offsetWidth;
        b.classList.add('is-active');
      }
    });
  };

  // Honour reduced-motion: show the first slide, don't auto-advance.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    paint(0);
    return;
  }

  let index = slides.findIndex((s) => s.classList.contains('is-active'));
  if (index < 0) index = 0;
  paint(index);

  const INTERVAL = 3500; // 3.5s per slide — keep in sync with --hero-interval
  setInterval(() => {
    index = (index + 1) % slides.length;
    paint(index);
  }, INTERVAL);
}
