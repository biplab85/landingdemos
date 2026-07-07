// FAQ accordion (single-open, accessible)
import { $$, on } from "../utils/dom.js";

export function init() {
  const items = $$(".acc-item");
  if (!items.length) return;

  items.forEach((item) => {
    const trigger = item.querySelector(".acc-item__trigger");
    const panel = item.querySelector(".acc-item__panel");
    if (!trigger || !panel) return;

    on(trigger, "click", () => {
      const isOpen = item.classList.contains("is-open");
      // close siblings
      items.forEach((other) => {
        if (other !== item) {
          other.classList.remove("is-open");
          const t = other.querySelector(".acc-item__trigger");
          if (t) t.setAttribute("aria-expanded", "false");
        }
      });
      item.classList.toggle("is-open", !isOpen);
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });
  });
}
