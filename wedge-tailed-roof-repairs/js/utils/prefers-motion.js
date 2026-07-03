// =============================================================
// UTILS · reduced-motion guard
// Single source of truth for motion preference.
// =============================================================

const query = window.matchMedia('(prefers-reduced-motion: reduce)');

export const prefersReducedMotion = () => query.matches;

// React to live changes (user toggles OS setting)
export const onMotionChange = (cb) => {
  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', cb);
  }
};
