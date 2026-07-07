// Quote modal via Fancybox (clones #quote-modal). Falls back to scroll-to-form.
import { $$, on } from "../utils/dom.js";

export function init() {
  const Fancybox = window.Fancybox;
  const triggers = $$('[data-quote], a[href="#quote-modal"]');
  if (!triggers.length) return;

  if (Fancybox) {
    triggers.forEach((t) => {
      // ensure it opens the inline modal
      if (!t.hasAttribute("data-src")) t.setAttribute("data-src", "#quote-modal");
      t.setAttribute("data-fancybox", "");
    });
    Fancybox.bind('[data-src="#quote-modal"]', {
      mainClass: "quote-fancybox",
      autoFocus: true,
      dragToClose: false,
    });
  } else {
    // Fallback: scroll to the on-page quote form
    triggers.forEach((t) =>
      on(t, "click", (e) => {
        const form = document.getElementById("quote");
        if (form) {
          e.preventDefault();
          form.scrollIntoView({ behavior: "smooth" });
        }
      })
    );
  }
}
