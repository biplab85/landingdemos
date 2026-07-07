// Sticky header condense + scrollspy for nav links
import { $, $$, on } from "../utils/dom.js";

export function init() {
  const header = $(".header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  on(window, "scroll", onScroll, { passive: true });

  // Scrollspy — highlight the nav link of the section in view
  const links = $$(".nav__link[href^='#']");
  const map = new Map();
  links.forEach((l) => {
    const id = l.getAttribute("href").slice(1);
    const sec = document.getElementById(id);
    if (sec) map.set(sec, l);
  });
  if (!map.size || !("IntersectionObserver" in window)) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.remove("is-active"));
          const link = map.get(e.target);
          if (link) link.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  map.forEach((_, sec) => io.observe(sec));
}
