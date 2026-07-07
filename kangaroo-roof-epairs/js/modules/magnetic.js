// Magnetic buttons — subtle cursor pull (desktop pointers only)
import { $$, on } from "../utils/dom.js";
import { canHover, prefersReducedMotion } from "../utils/prefers-motion.js";

export function init() {
  if (!canHover() || prefersReducedMotion()) return;
  const els = $$("[data-magnetic]");
  if (!els.length) return;

  const strength = 0.3;

  els.forEach((el) => {
    on(el, "pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    on(el, "pointerleave", () => {
      el.style.transform = "";
    });
  });
}
