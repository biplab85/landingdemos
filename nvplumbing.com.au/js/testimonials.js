// ─────────────────────────────────────────────────────────────
// Reviews slider — editorial, auto-play, keyboard + swipe
// Designed & developed by Biplab Kumar Paul
// ─────────────────────────────────────────────────────────────

export function initTestimonials() {
  const root = document.getElementById('reviewsSlider');
  if (!root) return;

  const viewport   = root.querySelector('[data-viewport]');
  const slides     = Array.from(root.querySelectorAll('.review-card'));
  const counter    = root.querySelector('[data-current]');
  const progress   = root.querySelector('[data-progress]');
  const bignum     = root.querySelector('[data-bignum]');
  const prevBtn    = root.querySelector('[data-prev]');
  const nextBtn    = root.querySelector('[data-next]');
  const playBtn    = root.querySelector('[data-play]');
  const dotsHost   = root.querySelector('[data-dots]');

  if (!slides.length) return;

  const total = slides.length;
  let index = 0;
  let playing = true;
  let rafId = null;
  let startTs = 0;
  const AUTOPLAY_MS = 6000;

  // Build dots
  const dots = slides.map((_, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', `Show review ${i + 1} of ${total}`);
    btn.addEventListener('click', () => {
      go(i);
      restart();
    });
    li.appendChild(btn);
    dotsHost.appendChild(li);
    return btn;
  });

  function pad(n) { return String(n).padStart(2, '0'); }

  function render() {
    slides.forEach((s, i) => {
      const active = i === index;
      s.classList.toggle('is-active', active);
      if (active) {
        s.removeAttribute('hidden');
      } else {
        s.setAttribute('hidden', '');
      }
    });
    dots.forEach((d, i) => {
      d.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
    if (counter) counter.textContent = pad(index + 1);
    if (bignum)  bignum.textContent  = pad(index + 1);
  }

  function go(i) {
    index = ((i % total) + total) % total;
    render();
  }
  function next() { go(index + 1); }
  function prev() { go(index - 1); }

  // Autoplay tick using rAF so the progress bar feels smooth
  function tick(ts) {
    if (!startTs) startTs = ts;
    const elapsed = ts - startTs;
    const pct = Math.min(elapsed / AUTOPLAY_MS, 1);
    if (progress) progress.style.width = (pct * 100).toFixed(2) + '%';
    if (pct >= 1) {
      startTs = ts;
      next();
    }
    if (playing) rafId = requestAnimationFrame(tick);
  }

  function play() {
    if (playing) return;
    playing = true;
    root.classList.remove('is-paused');
    if (playBtn) {
      playBtn.setAttribute('aria-pressed', 'true');
      playBtn.setAttribute('aria-label', 'Pause autoplay');
    }
    startTs = 0;
    rafId = requestAnimationFrame(tick);
  }

  function pause() {
    if (!playing) return;
    playing = false;
    root.classList.add('is-paused');
    if (playBtn) {
      playBtn.setAttribute('aria-pressed', 'false');
      playBtn.setAttribute('aria-label', 'Play autoplay');
    }
    if (rafId) cancelAnimationFrame(rafId);
  }

  function restart() {
    if (rafId) cancelAnimationFrame(rafId);
    startTs = 0;
    if (progress) progress.style.width = '0%';
    if (playing) rafId = requestAnimationFrame(tick);
  }

  // Wire controls
  prevBtn?.addEventListener('click', () => { prev(); restart(); });
  nextBtn?.addEventListener('click', () => { next(); restart(); });
  playBtn?.addEventListener('click', () => {
    if (playing) pause(); else play();
  });

  // Pause on hover / focus
  root.addEventListener('mouseenter', pause);
  root.addEventListener('mouseleave', () => {
    if (playBtn && playBtn.getAttribute('aria-pressed') === 'true') play();
  });
  root.addEventListener('focusin',  pause);
  root.addEventListener('focusout', (e) => {
    if (!root.contains(e.relatedTarget) && playBtn && playBtn.getAttribute('aria-pressed') === 'true') {
      play();
    }
  });

  // Keyboard nav
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); restart(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); restart(); }
    else if (e.key === ' ' && e.target === root) {
      e.preventDefault();
      if (playing) pause(); else play();
    }
  });

  // Swipe / drag
  let touchX = null;
  viewport.addEventListener('touchstart', (e) => {
    touchX = e.changedTouches[0].clientX;
    pause();
  }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next(); else prev();
      restart();
    }
    touchX = null;
  });

  // Pause when offscreen — saves CPU + respects user attention
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          if (rafId) cancelAnimationFrame(rafId);
        } else if (playing) {
          startTs = 0;
          rafId = requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.15 });
    io.observe(root);
  }

  // Respect reduced motion preference — start paused
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    pause();
  } else {
    rafId = requestAnimationFrame(tick);
  }

  render();
}
