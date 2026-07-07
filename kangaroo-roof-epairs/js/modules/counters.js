// Rolling stat counters — animate 0 → target when in view
import { $$ } from "../utils/dom.js";
import { prefersReducedMotion } from "../utils/prefers-motion.js";

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

function run(el) {
  const target = parseFloat(el.dataset.count || "0");
  const decimals = (el.dataset.decimals && parseInt(el.dataset.decimals, 10)) || 0;
  const dur = 1600;

  if (prefersReducedMotion()) {
    el.textContent = target.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return;
  }

  let start = null;
  const step = (ts) => {
    if (start === null) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const val = target * easeOut(p);
    el.textContent = val.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    if (p < 1) requestAnimationFrame(step);
    else
      el.textContent = target.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
  };
  requestAnimationFrame(step);
}

export function init() {
  const nums = $$("[data-count]");
  if (!nums.length) return;

  if (!("IntersectionObserver" in window)) {
    nums.forEach(run);
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          run(e.target);
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  nums.forEach((n) => io.observe(n));
}
