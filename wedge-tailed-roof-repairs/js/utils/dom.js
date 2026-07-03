// =============================================================
// UTILS · DOM helpers
// =============================================================

export const $ = (selector, scope = document) => scope.querySelector(selector);
export const $$ = (selector, scope = document) =>
  Array.from(scope.querySelectorAll(selector));

export const on = (el, event, handler, opts) => {
  if (el) el.addEventListener(event, handler, opts);
};

// Throttle via requestAnimationFrame (for scroll/resize)
export const rafThrottle = (fn) => {
  let ticking = false;
  return (...args) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      fn(...args);
      ticking = false;
    });
  };
};

// Simple debounce
export const debounce = (fn, wait = 200) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};
