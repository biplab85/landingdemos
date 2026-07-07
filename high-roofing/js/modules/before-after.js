// Before/After drag comparison. Pointer drag + keyboard (accessible slider).
import { $$, on } from "../utils/dom.js";

function setup(el) {
  const handle = el.querySelector(".ba__handle");
  let dragging = false;

  const setPos = (clientX) => {
    const r = el.getBoundingClientRect();
    let p = ((clientX - r.left) / r.width) * 100;
    p = Math.max(0, Math.min(100, p));
    el.style.setProperty("--pos", `${p}%`);
    if (handle) handle.setAttribute("aria-valuenow", String(Math.round(p)));
  };

  on(el, "pointerdown", (e) => {
    dragging = true;
    if (el.setPointerCapture) {
      try {
        el.setPointerCapture(e.pointerId);
      } catch (_) {}
    }
    setPos(e.clientX);
  });
  on(el, "pointermove", (e) => {
    if (dragging) setPos(e.clientX);
  });
  on(el, "pointerup", () => (dragging = false));
  on(el, "pointercancel", () => (dragging = false));

  // Keyboard support via the handle acting as a slider
  if (handle) {
    handle.setAttribute("role", "slider");
    handle.setAttribute("tabindex", "0");
    handle.setAttribute("aria-valuemin", "0");
    handle.setAttribute("aria-valuemax", "100");
    handle.setAttribute("aria-valuenow", "50");
    handle.setAttribute("aria-label", "Reveal before and after");

    on(handle, "keydown", (e) => {
      const cur = parseFloat(getComputedStyle(el).getPropertyValue("--pos")) || 50;
      let next = cur;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = Math.max(0, cur - 4);
      else if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.min(100, cur + 4);
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = 100;
      else return;
      e.preventDefault();
      el.style.setProperty("--pos", `${next}%`);
      handle.setAttribute("aria-valuenow", String(Math.round(next)));
    });
    // stop the handle's own pointerdown from being swallowed as a click-only
    on(handle, "click", (e) => e.preventDefault());
  }
}

export function init() {
  const widgets = $$("[data-ba]");
  if (!widgets.length) return;
  widgets.forEach(setup);
}
