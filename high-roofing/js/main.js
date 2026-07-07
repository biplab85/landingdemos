// =============================================================================
// High Roofing — front-end JS (self-contained). Bundled to assets/js/bundle.min.js
// Swiper loads via CDN as a global; every feature guards for missing targets.
// =============================================================================

const onReady = (fn) =>
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", fn)
    : fn();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Sticky header ---------------------------------------------------
function header() {
  const el = document.querySelector(".header");
  if (!el) return;
  const onScroll = () => el.classList.toggle("is-stuck", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// ---------- Mobile nav ------------------------------------------------------
function mobileNav() {
  const btn = document.querySelector(".hamburger");
  const nav = document.getElementById("mobile-nav");
  if (!btn || !nav) return;
  const toggle = (open) => {
    const isOpen = open ?? !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", isOpen);
    btn.setAttribute("aria-expanded", String(isOpen));
  };
  btn.addEventListener("click", () => toggle());
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggle(false)));
}

// ---------- Accordion -------------------------------------------------------
function accordion() {
  const items = document.querySelectorAll(".acc");
  if (!items.length) return;
  const setPanel = (item, open) => {
    const panel = item.querySelector(".acc__panel");
    const trigger = item.querySelector(".acc__trigger");
    item.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", String(open));
    panel.style.maxHeight = open ? panel.scrollHeight + "px" : "";
  };
  items.forEach((item) => {
    const trigger = item.querySelector(".acc__trigger");
    if (item.classList.contains("is-open")) setPanel(item, true);
    trigger.addEventListener("click", () => {
      const willOpen = !item.classList.contains("is-open");
      items.forEach((i) => setPanel(i, false));
      if (willOpen) setPanel(item, true);
    });
  });
  // keep open panels sized on resize
  window.addEventListener("resize", () => {
    document.querySelectorAll(".acc.is-open .acc__panel").forEach((p) => {
      p.style.maxHeight = p.scrollHeight + "px";
    });
  });
}

// ---------- Scroll reveals --------------------------------------------------
function reveals() {
  const els = document.querySelectorAll("[data-reveal]");
  if (!els.length) return;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  els.forEach((el) => io.observe(el));
}

// ---------- Counters --------------------------------------------------------
function counters() {
  const nums = document.querySelectorAll("[data-count]");
  if (!nums.length) return;
  const run = (el) => {
    const target = parseFloat(el.dataset.count) || 0;
    if (reduceMotion) {
      el.textContent = target;
      return;
    }
    const dur = 1500;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!("IntersectionObserver" in window)) {
    nums.forEach(run);
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          run(e.target);
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  nums.forEach((n) => io.observe(n));
}

// ---------- Sliders (Swiper) ------------------------------------------------
function sliders() {
  if (typeof Swiper === "undefined") return;
  const projects = document.querySelector(".projects__slider");
  if (projects) {
    new Swiper(projects, {
      slidesPerView: 1.15,
      spaceBetween: 0,
      loop: true,
      speed: 700,
      autoplay: { delay: 3500, disableOnInteraction: false },
      pagination: { el: ".projects__dots", clickable: true },
      breakpoints: {
        560: { slidesPerView: 2 },
        900: { slidesPerView: 3 },
        1200: { slidesPerView: 4 },
      },
    });
  }
  const testi = document.querySelector(".testi");
  if (testi) {
    new Swiper(testi, {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      speed: 600,
      autoHeight: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: ".testi__dots", clickable: true },
    });
  }
}

// ---------- Forms (demo submit) ---------------------------------------------
function forms() {
  document.querySelectorAll("[data-quote-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = form.querySelector("[role='status']");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (status) {
        status.textContent = "Thanks! Jacob will be in touch shortly to book your free inspection.";
        status.classList.add("is-ok");
      }
      form.reset();
    });
  });
}

// ---------- Footer accordion (mobile only) ----------------------------------
function footerAccordion() {
  const items = document.querySelectorAll(".footer__col--acc");
  if (!items.length) return;
  const mq = window.matchMedia("(max-width: 900px)");
  const sync = () => {
    items.forEach((item) => {
      const btn = item.querySelector(".footer__acc-btn");
      // desktop: force open (lists always visible); mobile: collapse by default
      const open = !mq.matches;
      item.classList.toggle("is-open", open);
      if (btn) btn.setAttribute("aria-expanded", String(open));
    });
  };
  sync();
  mq.addEventListener("change", sync);
  items.forEach((item) => {
    const btn = item.querySelector(".footer__acc-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (!mq.matches) return; // desktop: not a toggle
      const open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });
}

// ---------- Scrollspy (active nav) ------------------------------------------
function scrollSpy() {
  const links = [...document.querySelectorAll(".nav__link")];
  const map = links
    .map((l) => {
      const id = l.getAttribute("href");
      const sec = id && id.startsWith("#") ? document.querySelector(id) : null;
      return sec ? { link: l, sec } : null;
    })
    .filter(Boolean);
  if (!map.length || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.remove("is-active"));
          const hit = map.find((m) => m.sec === e.target);
          if (hit) hit.link.classList.add("is-active");
        }
      });
    },
    { threshold: 0.4, rootMargin: "-20% 0px -55% 0px" }
  );
  map.forEach((m) => io.observe(m.sec));
}

// ---------- Boot ------------------------------------------------------------
onReady(() => {
  [header, mobileNav, accordion, footerAccordion, reveals, counters, sliders, forms, scrollSpy].forEach(
    (fn) => {
      try {
        fn();
      } catch (err) {
        console.error("[init]", err);
      }
    }
  );
  document.documentElement.classList.add("js-ready");
});
