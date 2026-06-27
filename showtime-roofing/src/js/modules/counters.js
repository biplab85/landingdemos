// =============================================================
// MODULE · Animated counters — count up once when in view
// =============================================================

export function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const run = (el) => {
    const target = parseFloat(el.dataset.counter);
    const decimals = (el.dataset.counter.split('.')[1] || '').length;
    const duration = 1600;

    if (reduce) {
      el.textContent = target.toFixed(decimals);
      return;
    }

    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          run(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((c) => observer.observe(c));
}
