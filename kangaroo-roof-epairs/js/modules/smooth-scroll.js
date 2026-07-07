// Smooth in-page anchor scrolling with sticky-header offset
import { $$, on } from "../utils/dom.js";
import { prefersReducedMotion } from "../utils/prefers-motion.js";

export function init() {
  const links = $$('a[href^="#"]:not([href="#"])');
  links.forEach((link) => {
    on(link, "click", (e) => {
      const id = link.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      // ignore Fancybox / data-triggers
      if (link.hasAttribute("data-fancybox")) return;
      e.preventDefault();
      const headerH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--header-h"),
        10
      ) || 84;
      const top =
        target.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({
        top,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    });
  });
}
