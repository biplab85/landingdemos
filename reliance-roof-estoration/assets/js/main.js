// =============================================================================
// RELIANCE ROOF RESTORATION — main.js
// Single, sectioned entry (structure grows to fit the code — CLAUDE.md §14).
// Every init() no-ops if its target is absent. Reduced-motion aware.
// Vendor globals (Swiper, Fancybox, gsap, ScrollTrigger) load via CDN before this.
// =============================================================================

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------------------------------------------------------------------------
  // Sticky header
  // ---------------------------------------------------------------------------
  function initHeader() {
    const header = $("#site-header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ---------------------------------------------------------------------------
  // Mobile drawer
  // ---------------------------------------------------------------------------
  function initDrawer() {
    const drawer = $("#drawer");
    const burger = $("#burger");
    const menuBtn = $("#appbar-menu");
    const navToggle = $("#nav-toggle");
    if (!drawer) return;

    const open = () => {
      drawer.classList.add("is-open");
      burger && burger.classList.add("is-open");
      burger && burger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      drawer.classList.remove("is-open");
      burger && burger.classList.remove("is-open");
      burger && burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };
    const toggle = () => (drawer.classList.contains("is-open") ? close() : open());

    burger && burger.addEventListener("click", toggle);
    menuBtn && menuBtn.addEventListener("click", open);
    navToggle && navToggle.addEventListener("click", open);
    $$("[data-close]", drawer).forEach((el) => el.addEventListener("click", close));
    document.addEventListener("keydown", (e) => e.key === "Escape" && close());
  }

  // ---------------------------------------------------------------------------
  // Search overlay
  // ---------------------------------------------------------------------------
  function initSearch() {
    const pop = $("#search-pop");
    const toggle = $("#search-toggle");
    const closeBtn = $("#search-close");
    const form = $("#search-form");
    if (!pop || !toggle) return;

    const open = () => {
      pop.classList.add("is-open");
      const input = $("input", pop);
      input && input.focus();
    };
    const close = () => pop.classList.remove("is-open");

    toggle.addEventListener("click", open);
    closeBtn && closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", (e) => e.key === "Escape" && close());
    form && form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = ($("input", form).value || "").trim();
      if (q) {
        const url = "https://www.google.com/search?q=" +
          encodeURIComponent("site:relianceroofwesternsydney.com.au " + q);
        window.open(url, "_blank", "noopener");
      }
      close();
    });
  }

  // ---------------------------------------------------------------------------
  // Hero hotspots — toggle a popover per marker (one open at a time)
  // ---------------------------------------------------------------------------
  function initHotspots() {
    const wraps = $$(".hotspot-wrap");
    if (!wraps.length) return;

    const closeAll = (except) => {
      wraps.forEach((w) => {
        if (w !== except) {
          w.classList.remove("is-open");
          const b = $(".hotspot", w);
          b && b.setAttribute("aria-expanded", "false");
        }
      });
    };

    wraps.forEach((w) => {
      const btn = $(".hotspot", w);
      if (!btn) return;
      w.addEventListener("click", (e) => e.stopPropagation());
      btn.addEventListener("click", () => {
        const isOpen = w.classList.contains("is-open");
        closeAll(w);
        w.classList.toggle("is-open", !isOpen);
        btn.setAttribute("aria-expanded", String(!isOpen));
      });
    });

    document.addEventListener("click", () => closeAll(null));
    document.addEventListener("keydown", (e) => e.key === "Escape" && closeAll(null));
  }

  // ---------------------------------------------------------------------------
  // Services tabs (ARIA tablist — click + arrow-key navigation)
  // ---------------------------------------------------------------------------
  function initServiceTabs() {
    const list = $(".svc-tabs__list");
    if (!list) return;
    const tabs = $$(".svc-tab", list);
    const panels = $$(".svc-panel");
    if (!tabs.length || !panels.length) return;

    const activate = (i, focus) => {
      tabs.forEach((t, idx) => {
        const on = idx === i;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach((p, idx) => p.classList.toggle("is-active", idx === i));
      if (focus) tabs[i].focus();
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => activate(i));
      tab.addEventListener("keydown", (e) => {
        let next = null;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % tabs.length;
        else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = tabs.length - 1;
        if (next !== null) {
          e.preventDefault();
          activate(next, true);
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // FAQ accordion (one open at a time)
  // ---------------------------------------------------------------------------
  function initAccordion() {
    const items = $$(".acc");
    if (!items.length) return;
    items.forEach((acc) => {
      const head = $(".acc__head", acc);
      if (!head) return;
      head.addEventListener("click", () => {
        const isOpen = acc.classList.contains("is-open");
        items.forEach((a) => {
          a.classList.remove("is-open");
          const h = $(".acc__head", a);
          h && h.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          acc.classList.add("is-open");
          head.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Count-up stats
  // ---------------------------------------------------------------------------
  function animateCount(el) {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    const numNode = el.childNodes[0]; // leading text node ("0")
    if (reduceMotion) { numNode.nodeValue = String(target); return; }
    const dur = 1600;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      numNode.nodeValue = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function initCounters() {
    const nums = $$(".stat__num[data-count]");
    if (!nums.length) return;
    if (!("IntersectionObserver" in window)) { nums.forEach(animateCount); return; }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { animateCount(e.target); obs.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    nums.forEach((n) => io.observe(n));
  }

  // ---------------------------------------------------------------------------
  // Swiper sliders (gallery + reviews)
  // ---------------------------------------------------------------------------
  function initSliders() {
    if (typeof Swiper === "undefined") return;

    if ($("#gallery-slider")) {
      new Swiper("#gallery-slider", {
        slidesPerView: 1.15,
        spaceBetween: 18,
        grabCursor: true,
        navigation: { nextEl: "#gal-next", prevEl: "#gal-prev" },
        breakpoints: {
          480: { slidesPerView: 1.6, spaceBetween: 20 },
          768: { slidesPerView: 2.2, spaceBetween: 24 },
          1024: { slidesPerView: 3, spaceBetween: 26 },
        },
      });
    }

    if ($("#reviews-slider")) {
      new Swiper("#reviews-slider", {
        slidesPerView: 1,
        spaceBetween: 22,
        grabCursor: true,
        autoHeight: false,
        pagination: { el: "#reviews-slider .swiper-pagination", clickable: true },
        breakpoints: {
          768: { slidesPerView: 2, spaceBetween: 24 },
          1024: { slidesPerView: 3, spaceBetween: 26 },
        },
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Fancybox (lightbox + inline quote modal)
  // ---------------------------------------------------------------------------
  function initFancybox() {
    if (typeof Fancybox === "undefined") return;
    Fancybox.bind("[data-fancybox]", {
      dragToClose: false,
      Toolbar: { display: { right: ["close"] } },
    });
  }

  // ---------------------------------------------------------------------------
  // Scroll reveals — GSAP if present, else IntersectionObserver fallback
  // ---------------------------------------------------------------------------
  function initReveals() {
    const els = $$(".reveal");
    if (!els.length) return;

    if (reduceMotion) { els.forEach((el) => el.classList.add("is-in")); return; }

    const hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
    if (hasGsap) {
      gsap.registerPlugin(ScrollTrigger);
      els.forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            onStart: () => el.classList.add("is-in"),
          }
        );
      });
      return;
    }

    // Fallback
    if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("is-in")); return; }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
  }

  // ---------------------------------------------------------------------------
  // Hero headline flourish on load (GSAP, optional)
  // ---------------------------------------------------------------------------
  function initHeroIntro() {
    if (reduceMotion || typeof gsap === "undefined") return;
    const title = $(".hero__title em");
    if (!title) return;
    gsap.fromTo(title, { backgroundSize: "0% 100%" }, { duration: 0.9, delay: 0.3, ease: "power2.out" });
  }

  // ---------------------------------------------------------------------------
  // Quote form (demo — no backend)
  // ---------------------------------------------------------------------------
  function initForm() {
    const form = $("#quote-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const btn = $("button[type=submit]", form);
      if (btn) { btn.textContent = "Thanks — we'll be in touch!"; btn.disabled = true; }
      setTimeout(() => {
        if (typeof Fancybox !== "undefined") Fancybox.close();
        form.reset();
        if (btn) { btn.textContent = "Send Enquiry"; btn.disabled = false; }
      }, 1800);
    });
  }

  // ---------------------------------------------------------------------------
  // Newsletter form (demo — no backend)
  // ---------------------------------------------------------------------------
  function initNewsletter() {
    $$(".js-newsletter").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!form.reportValidity()) return;
        form.reset();
        const note = form.parentElement && form.parentElement.querySelector(".js-nl-note");
        if (note) note.hidden = false;
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Footer year
  // ---------------------------------------------------------------------------
  function initYear() {
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  }

  // ---------------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------------
  function boot() {
    initHeader();
    initDrawer();
    initSearch();
    initHotspots();
    initServiceTabs();
    initAccordion();
    initCounters();
    initSliders();
    initFancybox();
    initReveals();
    initHeroIntro();
    initForm();
    initNewsletter();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
