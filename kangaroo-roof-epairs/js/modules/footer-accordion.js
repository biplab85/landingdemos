// Footer columns collapse into accordions on mobile only. Desktop untouched.
import { $$, on } from "../utils/dom.js";

export function init() {
  const cols = $$(".footer__col--acc");
  if (!cols.length) return;

  const mq = window.matchMedia("(max-width: 767.98px)");

  cols.forEach((col) => {
    const btn = col.querySelector(".footer__acc-btn");
    if (!btn) return;
    on(btn, "click", () => {
      if (!mq.matches) return; // never toggle on desktop
      const open = col.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  // Keep aria in sync with the active breakpoint (desktop shows all via CSS)
  const sync = () => {
    cols.forEach((col) => {
      const btn = col.querySelector(".footer__acc-btn");
      if (!btn) return;
      if (mq.matches) {
        btn.setAttribute("aria-expanded", String(col.classList.contains("is-open")));
      } else {
        col.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  };
  sync();
  if (mq.addEventListener) mq.addEventListener("change", sync);
}
