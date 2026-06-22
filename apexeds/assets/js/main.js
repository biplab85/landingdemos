/* ============================================================
   APEX — Electrical, Data & Security
   Interactions: GSAP parallax, hero timeline, scroll reveals
   ============================================================ */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Back to top ---------- */
  var backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Sticky header state ---------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 24) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");
  function closeMenu() {
    if (!navToggle || !mobileMenu) return;
    navToggle.classList.remove("is-open");
    mobileMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function openMenu() {
    if (!navToggle || !mobileMenu) return;
    navToggle.classList.add("is-open");
    mobileMenu.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      if (navToggle.classList.contains("is-open")) closeMenu();
      else openMenu();
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  // App-bar "More" opens the same mobile menu
  var appBarMenu = document.getElementById("appBarMenu");
  if (appBarMenu) {
    appBarMenu.addEventListener("click", function () {
      if (mobileMenu && mobileMenu.classList.contains("is-open")) closeMenu();
      else openMenu();
    });
  }

  /* ---------- Reduced motion: show everything, bail on animation ---------- */
  if (prefersReduced || !hasGSAP) {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    runCounters(true); // set final values immediately
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Hero load timeline ---------- */
  var heroReveals = document.querySelectorAll(".hero [data-reveal]");
  gsap.set(heroReveals, { y: 28, opacity: 0 });
  gsap.set(".hero__title .line", { y: 0, yPercent: 110, opacity: 1 });
  gsap.set(".hero__card", { opacity: 0, y: 24 });
  gsap.set(".hero__chip", { opacity: 0, y: -16 });

  // Lightning bolt: prep stroke for draw-on
  var boltStroke = document.querySelector(".hero__bolt-stroke");
  if (boltStroke && boltStroke.getTotalLength) {
    var len = boltStroke.getTotalLength();
    gsap.set(boltStroke, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(".hero__bolt-fill", { opacity: 0, scale: 0.96, transformOrigin: "50% 50%" });
  }

  var tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.9 } });
  tl.to(".hero__eyebrow", { y: 0, opacity: 1, duration: 0.7 }, 0.1)
    .to(".hero__title .line", { yPercent: 0, duration: 1.05, stagger: 0.1 }, 0.2)
    .to(".hero__actions", { y: 0, opacity: 1 }, "-=0.55")
    .to(".hero__proof", { y: 0, opacity: 1, duration: 0.7 }, "-=0.55")
    .to(".hero__visual", { y: 0, opacity: 1, duration: 1.1 }, 0.35)
    .to(".hero__bolt-stroke", { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" }, 0.7)
    .to(".hero__bolt-fill", { opacity: 0.92, scale: 1, duration: 0.8 }, "-=0.4")
    .to(".hero__card", { y: 0, opacity: 1, duration: 0.7, ease: "back.out(1.5)" }, "-=0.5")
    .to(".hero__chip", { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.5)" }, "-=0.55")
    .to(".hero__trust", { y: 0, opacity: 1, duration: 0.7 }, "-=0.5");

  /* ---------- Hero parallax (scrub) ---------- */
  gsap.utils.toArray("[data-parallax]").forEach(function (layer) {
    var depth = parseFloat(layer.getAttribute("data-parallax")) || 0.3;
    gsap.to(layer, {
      yPercent: depth * 40,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  });

  // Subtle content drift + fade as hero leaves
  gsap.to(".hero__inner", {
    yPercent: 12,
    opacity: 0.4,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  });

  /* ---------- Section reveals ---------- */
  var revealEls = gsap.utils.toArray("[data-reveal]").filter(function (el) {
    return !el.closest(".hero");
  });

  revealEls.forEach(function (el) {
    gsap.fromTo(
      el,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true }
      }
    );
  });

  /* ---------- Our Work: clip reveal + per-image scroll parallax ---------- */
  var workTiles = gsap.utils.toArray("[data-work]");
  if (workTiles.length) {
    ScrollTrigger.batch(workTiles, {
      start: "top 88%",
      once: true,
      onEnter: function (batch) {
        gsap.fromTo(
          batch,
          { clipPath: "inset(100% 0% 0% 0%)", y: 40, opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            stagger: 0.12,
            overwrite: true
          }
        );
      }
    });

    // gentle vertical drift of each photo as the tile scrolls through view
    workTiles.forEach(function (tile) {
      var img = tile.querySelector("[data-work-img]");
      if (!img) return;
      gsap.fromTo(
        img,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: tile, start: "top bottom", end: "bottom top", scrub: true }
        }
      );
    });
  }

  /* ---------- Staggered grids (services, guarantee, timeline) ---------- */
  [".services__grid", ".guarantee__list", ".timeline"].forEach(function (sel) {
    var parent = document.querySelector(sel);
    if (!parent) return;
    var kids = parent.children;
    ScrollTrigger.batch(kids, {
      start: "top 88%",
      once: true,
      onEnter: function (batch) {
        gsap.fromTo(
          batch,
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.08, overwrite: true }
        );
      }
    });
  });

  /* ---------- Count-up stats ---------- */
  function runCounters(immediate) {
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count")) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      if (immediate) {
        el.textContent = target + suffix;
        return;
      }
      var obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: function () {
          gsap.to(obj, {
            v: target,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: function () {
              el.textContent = Math.round(obj.v) + suffix;
            }
          });
        }
      });
    });
  }
  runCounters(false);

  /* ---------- Refresh after fonts load (layout shift safety) ---------- */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
})();
