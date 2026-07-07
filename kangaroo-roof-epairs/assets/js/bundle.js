(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // js/modules/header.js
  var header_exports = {};
  __export(header_exports, {
    init: () => init
  });

  // js/utils/dom.js
  var $ = (sel, ctx = document) => ctx.querySelector(sel);
  var $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  var on = (el, evt, cb, opts) => el && el.addEventListener(evt, cb, opts);
  var focusables = (ctx) => $$(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ctx
  );

  // js/modules/header.js
  function init() {
    const header = $(".header");
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    on(window, "scroll", onScroll, { passive: true });
    const links = $$(".nav__link[href^='#']");
    const map = /* @__PURE__ */ new Map();
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

  // js/modules/nav-drawer.js
  var nav_drawer_exports = {};
  __export(nav_drawer_exports, {
    init: () => init2
  });
  function init2() {
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

  // js/modules/accordion.js
  var accordion_exports = {};
  __export(accordion_exports, {
    init: () => init3
  });
  function init3() {
    const items = $$(".acc-item");
    if (!items.length) return;
    items.forEach((item) => {
      const trigger = item.querySelector(".acc-item__trigger");
      const panel = item.querySelector(".acc-item__panel");
      if (!trigger || !panel) return;
      on(trigger, "click", () => {
        const isOpen = item.classList.contains("is-open");
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

  // js/modules/counters.js
  var counters_exports = {};
  __export(counters_exports, {
    init: () => init4
  });

  // js/utils/prefers-motion.js
  var mq = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var prefersReducedMotion = () => mq.matches;
  var canHover = () => window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // js/modules/counters.js
  var easeOut = (t) => 1 - Math.pow(1 - t, 3);
  function run(el) {
    const target = parseFloat(el.dataset.count || "0");
    const decimals = el.dataset.decimals && parseInt(el.dataset.decimals, 10) || 0;
    const dur = 1600;
    if (prefersReducedMotion()) {
      el.textContent = target.toLocaleString(void 0, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
      return;
    }
    let start = null;
    const step = (ts) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const val = target * easeOut(p);
      el.textContent = val.toLocaleString(void 0, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
      if (p < 1) requestAnimationFrame(step);
      else
        el.textContent = target.toLocaleString(void 0, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        });
    };
    requestAnimationFrame(step);
  }
  function init4() {
    const nums = $$("[data-count]");
    if (!nums.length) return;
    if (!("IntersectionObserver" in window)) {
      nums.forEach(run);
      return;
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run(e.target);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    nums.forEach((n) => io.observe(n));
  }

  // js/modules/smooth-scroll.js
  var smooth_scroll_exports = {};
  __export(smooth_scroll_exports, {
    init: () => init5
  });
  function init5() {
    const links = $$('a[href^="#"]:not([href="#"])');
    links.forEach((link) => {
      on(link, "click", (e) => {
        const id = link.getAttribute("href");
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        if (link.hasAttribute("data-fancybox")) return;
        e.preventDefault();
        const headerH = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue("--header-h"),
          10
        ) || 84;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
        window.scrollTo({
          top,
          behavior: prefersReducedMotion() ? "auto" : "smooth"
        });
      });
    });
  }

  // js/modules/magnetic.js
  var magnetic_exports = {};
  __export(magnetic_exports, {
    init: () => init6
  });
  function init6() {
    if (!canHover() || prefersReducedMotion()) return;
    const els = $$("[data-magnetic]");
    if (!els.length) return;
    const strength = 0.3;
    els.forEach((el) => {
      on(el, "pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      on(el, "pointerleave", () => {
        el.style.transform = "";
      });
    });
  }

  // js/modules/sliders.js
  var sliders_exports = {};
  __export(sliders_exports, {
    init: () => init7
  });
  function init7() {
    const Swiper = window.Swiper;
    if (!Swiper) return;
    if ($(".gallery__carousel")) {
      new Swiper(".gallery__carousel", {
        slidesPerView: "auto",
        spaceBetween: 20,
        grabCursor: true,
        speed: 600,
        navigation: {
          prevEl: ".gallery .swiper-nav-prev",
          nextEl: ".gallery .swiper-nav-next",
          disabledClass: "is-disabled"
        },
        breakpoints: {
          768: { spaceBetween: 28 }
        }
      });
    }
    if ($(".testimonials__carousel")) {
      new Swiper(".testimonials__carousel", {
        slidesPerView: 1,
        spaceBetween: 24,
        speed: 600,
        autoHeight: false,
        pagination: {
          el: ".testimonials .swiper-pagination",
          clickable: true
        },
        navigation: {
          prevEl: ".testimonials .swiper-nav-prev",
          nextEl: ".testimonials .swiper-nav-next",
          disabledClass: "is-disabled"
        },
        breakpoints: {
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }
      });
    }
  }

  // js/modules/lightbox.js
  var lightbox_exports = {};
  __export(lightbox_exports, {
    init: () => init8
  });
  function init8() {
    const Fancybox = window.Fancybox;
    if (!Fancybox) return;
    Fancybox.bind('[data-fancybox="gallery"]', {
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: [],
          right: ["slideshow", "thumbs", "close"]
        }
      },
      Thumbs: { type: "classic" }
    });
  }

  // js/modules/quote-modal.js
  var quote_modal_exports = {};
  __export(quote_modal_exports, {
    init: () => init9
  });
  function init9() {
    const Fancybox = window.Fancybox;
    const triggers = $$('[data-quote], a[href="#quote-modal"]');
    if (!triggers.length) return;
    if (Fancybox) {
      triggers.forEach((t) => {
        if (!t.hasAttribute("data-src")) t.setAttribute("data-src", "#quote-modal");
        t.setAttribute("data-fancybox", "");
      });
      Fancybox.bind('[data-src="#quote-modal"]', {
        mainClass: "quote-fancybox",
        autoFocus: true,
        dragToClose: false
      });
    } else {
      triggers.forEach(
        (t) => on(t, "click", (e) => {
          const form = document.getElementById("quote");
          if (form) {
            e.preventDefault();
            form.scrollIntoView({ behavior: "smooth" });
          }
        })
      );
    }
  }

  // js/modules/forms.js
  var forms_exports = {};
  __export(forms_exports, {
    init: () => init10
  });
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var phoneRe = /^[0-9 ()+\-]{6,}$/;
  function validateField(field) {
    const input = field.querySelector("input, select, textarea");
    if (!input) return true;
    let ok = true;
    const val = input.value.trim();
    if (input.required && !val) ok = false;
    else if (input.type === "email" && val && !emailRe.test(val)) ok = false;
    else if (input.dataset.type === "phone" && val && !phoneRe.test(val)) ok = false;
    field.classList.toggle("has-error", !ok);
    return ok;
  }
  function init10() {
    const forms = $$("form[data-quote-form]");
    if (!forms.length) return;
    forms.forEach((form) => {
      const status = form.querySelector(".quote-form__status");
      form.querySelectorAll(".field").forEach((field) => {
        const input = field.querySelector("input, select, textarea");
        if (input) on(input, "blur", () => validateField(field));
      });
      on(form, "submit", (e) => {
        e.preventDefault();
        let valid = true;
        form.querySelectorAll(".field").forEach((field) => {
          if (!validateField(field)) valid = false;
        });
        if (!valid) {
          if (status) {
            status.textContent = "Please complete the highlighted fields.";
            status.style.color = "#d64545";
          }
          return;
        }
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          btn.disabled = true;
          btn.dataset.label = btn.textContent;
          btn.textContent = "Sending\u2026";
        }
        setTimeout(() => {
          form.reset();
          if (btn) {
            btn.disabled = false;
            btn.textContent = btn.dataset.label || "Send Request";
          }
          if (status) {
            status.style.color = "";
            status.textContent = "Thanks! Your request has been received \u2014 we'll call you shortly.";
          }
        }, 900);
      });
    });
  }

  // js/modules/animations.js
  var animations_exports = {};
  __export(animations_exports, {
    init: () => init11
  });
  function fallbackReveal() {
    const els = $$(".reveal");
    if (!els.length || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
  }
  function init11() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || prefersReducedMotion()) {
      fallbackReveal();
      $$(".hero__line span").forEach((s) => s.style.transform = "none");
      return;
    }
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    const heroLines = $$(".hero__line span");
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (heroLines.length) {
      gsap.set(heroLines, { yPercent: 110 });
      tl.to(heroLines, { yPercent: 0, duration: 0.9, stagger: 0.08 }, 0.1);
    }
    const heroFade = $$("[data-hero-fade]");
    if (heroFade.length) {
      gsap.set(heroFade, { opacity: 0, y: 22 });
      tl.to(heroFade, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.4);
    }
    const heroMedia = $(".hero__figure");
    if (heroMedia) {
      gsap.from(heroMedia, { opacity: 0, scale: 1.04, duration: 1.1, ease: "power2.out" }, 0);
    }
    if (!ScrollTrigger) {
      fallbackReveal();
      return;
    }
    $$(".reveal").forEach((el) => {
      const delay = parseFloat(el.dataset.delay || "0");
      gsap.fromTo(
        el,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" }
        }
      );
    });
    $$("[data-stagger]").forEach((group) => {
      const kids = Array.from(group.children);
      gsap.fromTo(
        kids,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: group, start: "top 82%" }
        }
      );
    });
    $$("[data-parallax]").forEach((el) => {
      const amount = parseFloat(el.dataset.parallax || "40");
      gsap.to(el, {
        yPercent: amount * -0.1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });
  }

  // js/main.js
  var boot = () => {
    [
      header_exports,
      nav_drawer_exports,
      accordion_exports,
      counters_exports,
      smooth_scroll_exports,
      magnetic_exports,
      sliders_exports,
      lightbox_exports,
      quote_modal_exports,
      forms_exports,
      animations_exports
    ].forEach((m) => {
      try {
        m.init();
      } catch (err) {
        console.error("[init]", err);
      }
    });
    document.documentElement.classList.add("js-ready");
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
