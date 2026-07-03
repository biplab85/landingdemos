// =============================================================
// MODULE · Stat count-up (triggers when in view)
// =============================================================
import { $$ } from '../utils/dom.js';
import { prefersReducedMotion } from '../utils/prefers-motion.js';

export function initCounters() {
  const nums = $$('[data-count]');
  if (!nums.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;

    if (prefersReducedMotion()) {
      el.textContent = target.toLocaleString() + suffix;
      return;
    }

    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const value = Math.round(target * eased);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  nums.forEach((el) => observer.observe(el));
}
