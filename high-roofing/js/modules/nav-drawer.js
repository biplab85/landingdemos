// Mobile drawer: open/close, focus trap, Esc, restore focus
import { $, $$, on, focusables } from "../utils/dom.js";

export function init() {
  const drawer = $(".drawer");
  const toggle = $(".hamburger");
  if (!drawer || !toggle) return;

  const overlay = $(".drawer__overlay", drawer);
  const panel = $(".drawer__panel", drawer);
  let lastFocused = null;

  const open = () => {
    lastFocused = document.activeElement;
    drawer.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
    const f = focusables(panel);
    if (f.length) f[0].focus();
  };

  const close = () => {
    drawer.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
    if (lastFocused) lastFocused.focus();
  };

  on(toggle, "click", () => {
    drawer.classList.contains("is-open") ? close() : open();
  });
  on(overlay, "click", close);
  $$(".drawer__link, .drawer [data-close]", drawer).forEach((el) => on(el, "click", close));

  on(document, "keydown", (e) => {
    if (!drawer.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "Tab") {
      const f = focusables(panel);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}
