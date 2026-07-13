// ─────────────────────────────────────────────────────────────
// Designed & developed by
// Biplab Kumar Paul — Web Designer & Developer
// Mobile: 01735 927356
// Email:  biplab.cse.85@gmail.com
// ─────────────────────────────────────────────────────────────
//
// Hero — background slideshow + foreground image carousel
//

// Generic fade cycler: advances .is-active across a NodeList on an interval.
function fadeCycle(items, { interval = 2000, onChange } = {}) {
  if (!items || items.length < 2) return null;
  let i = 0;
  let timer = null;

  const show = next => {
    items[i].classList.remove('is-active');
    i = (next + items.length) % items.length;
    items[i].classList.add('is-active');
    if (onChange) onChange(i);
  };

  const start = () => {
    stop();
    timer = setInterval(() => show(i + 1), interval);
  };
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

  start();
  return { show, start, stop, get index() { return i; } };
}

export function initHero() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1) Background slideshow (fade + Ken-Burns, 2s like the reference)
  const bgSlides = document.querySelectorAll('.pf-hero__slide');
  if (bgSlides.length > 1 && !reduce) {
    // re-trigger the Ken-Burns animation each time a slide becomes active
    fadeCycle(bgSlides, {
      interval: 4000,
      onChange: idx => {
        const el = bgSlides[idx];
        el.style.animation = 'none';
        // force reflow so the animation restarts
        void el.offsetWidth;
        el.style.animation = '';
      },
    });
  }

  // 2) Foreground image carousel with clickable dots
  const gallery = document.getElementById('hero-gallery');
  const dotsWrap = gallery?.parentElement.querySelector('.pf-gallery__dots');
  if (gallery && dotsWrap) {
    const slides = gallery.querySelectorAll('.pf-gallery__slide');
    const dots = dotsWrap.querySelectorAll('button');

    const setDot = idx => {
      dots.forEach((d, n) => d.classList.toggle('is-active', n === idx));
    };

    const cycler = fadeCycle(slides, {
      interval: 3000,
      onChange: setDot,
    });

    if (cycler) {
      dots.forEach((dot, n) => {
        dot.addEventListener('click', () => {
          cycler.show(n);
          cycler.start();      // restart timer after manual nav
        });
      });
    }
  }
}

// Count-up numbers (About + Services stats) — fire once on scroll into view
export function initCounters() {
  const els = document.querySelectorAll('.pf-count');
  if (!els.length) return;

  const run = el => {
    const target = parseFloat(el.dataset.count) || 0;
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1600;
    let startTs = null;

    const step = ts => {
      if (startTs === null) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);       // easeOutCubic
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals);
    };
    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) { els.forEach(run); return; }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
    });
  }, { threshold: 0.4 });

  els.forEach(el => io.observe(el));
}
