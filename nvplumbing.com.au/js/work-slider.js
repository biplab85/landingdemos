// ─────────────────────────────────────────────────────────────
// Premium gallery slider — autoplay, keyboard, swipe, thumbs
// Designed & developed by Biplab Kumar Paul
// ─────────────────────────────────────────────────────────────

export function initWorkSlider() {
  const root = document.getElementById('workSlider');
  if (!root) return;

  const track    = root.querySelector('[data-track]');
  const slides   = Array.from(root.querySelectorAll('.work-slide'));
  const counter  = root.querySelector('[data-current]');
  const progress = root.querySelector('[data-progress]');
  const prevBtn  = root.querySelector('[data-prev]');
  const nextBtn  = root.querySelector('[data-next]');
  const playBtn  = root.querySelector('[data-play]');
  const thumbsEl = root.querySelector('[data-thumbs]');

  if (!slides.length) return;

  const total = slides.length;
  let index = 0;
  let playing = true;
  let rafId = null;
  let startTs = 0;
  const AUTOPLAY_MS = 6500;

  // Build thumbnails from each slide's image
  const thumbs = slides.map((slide, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', `Show photo ${i + 1} of ${total}`);
    const src = slide.querySelector('img')?.getAttribute('src') || '';
    const alt = slide.querySelector('img')?.getAttribute('alt') || '';
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = 160;
    img.height = 120;
    btn.appendChild(img);
    btn.addEventListener('click', () => { go(i); restart(); });
    li.appendChild(btn);
    thumbsEl.appendChild(li);
    return btn;
  });

  function pad(n) { return String(n).padStart(2, '0'); }

  function render() {
    slides.forEach((s, i) => {
      const active = i === index;
      s.classList.toggle('is-active', active);
      if (active) s.removeAttribute('hidden');
      else s.setAttribute('hidden', '');
    });
    thumbs.forEach((t, i) => {
      t.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
    if (counter) counter.textContent = pad(index + 1);
    // Eagerly load neighboring slide images
    [(index + 1) % total, (index - 1 + total) % total].forEach(n => {
      const img = slides[n]?.querySelector('img');
      if (img && img.loading === 'lazy') img.loading = 'eager';
    });
  }

  function go(i) { index = ((i % total) + total) % total; render(); }
  function next() { go(index + 1); }
  function prev() { go(index - 1); }

  function tick(ts) {
    if (!startTs) startTs = ts;
    const elapsed = ts - startTs;
    const pct = Math.min(elapsed / AUTOPLAY_MS, 1);
    if (progress) progress.style.width = (pct * 100).toFixed(2) + '%';
    if (pct >= 1) { startTs = ts; next(); }
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

  // Controls
  prevBtn?.addEventListener('click', () => { prev(); restart(); });
  nextBtn?.addEventListener('click', () => { next(); restart(); });
  playBtn?.addEventListener('click', () => { playing ? pause() : play(); });

  // Focus pause only (accessibility) — autoplay keeps running on hover
  root.addEventListener('focusin',  pause);
  root.addEventListener('focusout', (e) => {
    if (!root.contains(e.relatedTarget) && playBtn?.getAttribute('aria-pressed') === 'true') {
      play();
    }
  });

  // Keyboard
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); restart(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); restart(); }
    else if (e.key === ' ' && e.target === root) {
      e.preventDefault();
      playing ? pause() : play();
    }
  });

  // Swipe
  let touchX = null;
  track.addEventListener('touchstart', (e) => {
    touchX = e.changedTouches[0].clientX;
    pause();
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); restart(); }
    touchX = null;
  });

  // Pause when offscreen
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && rafId) cancelAnimationFrame(rafId);
        else if (entry.isIntersecting && playing) {
          startTs = 0;
          rafId = requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.2 });
    io.observe(root);
  }

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    pause();
  } else {
    rafId = requestAnimationFrame(tick);
  }

  render();
}
