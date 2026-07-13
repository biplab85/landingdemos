/* Pacific Roofing — GSAP motion */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Bail gracefully if GSAP failed to load or motion is reduced
  if (typeof gsap === "undefined" || reduce) {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
    return;
  }

  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Hero load timeline ---------- */
  gsap.timeline({ defaults: { ease: "power3.out", duration: 0.9 } })
    .from("[data-hero]", { y: 34, opacity: 0, stagger: 0.12 });

  /* ---------- Scroll reveals (batched so grid rows stagger in together) ---------- */
  if (window.ScrollTrigger) {
    var reveals = gsap.utils.toArray(".reveal");
    ScrollTrigger.batch(reveals, {
      start: "top 90%",
      onEnter: function (batch) {
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.08,
          overwrite: true,
        });
      },
    });
  } else {
    gsap.utils.toArray(".reveal").forEach(function (el) {
      gsap.to(el, { y: 0, opacity: 1, duration: 0.8 });
    });
  }

  /* ---------- Animated stat counters ---------- */
  gsap.utils.toArray("[data-count]").forEach(function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
      onUpdate: function () {
        el.textContent = Math.round(obj.v) + suffix;
      },
    });
  });
})();
