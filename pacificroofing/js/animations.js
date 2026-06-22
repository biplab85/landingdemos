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
  var tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.9 } });

  tl.from("[data-hero]", { y: 34, opacity: 0, stagger: 0.12 })
    .from(
      "[data-roofline]",
      { yPercent: 40, opacity: 0, duration: 1.1, ease: "power2.out" },
      "-=0.7"
    );

  /* ---------- Scroll reveals ---------- */
  gsap.utils.toArray(".reveal").forEach(function (el) {
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    });
  });

  /* ---------- Staggered service cards ---------- */
  if (window.ScrollTrigger) {
    var cards = gsap.utils.toArray(".service-card");
    if (cards.length) {
      gsap.set(cards, { opacity: 0, y: 26 });
      ScrollTrigger.batch(cards, {
        start: "top 90%",
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.07,
            overwrite: true,
          });
        },
      });
    }
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
