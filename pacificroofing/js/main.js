/* Pacific Roofing — core interactions */
(function () {
  "use strict";

  // Flag for CSS (enables reveal hidden-state only when JS is on)
  document.documentElement.classList.add("js");

  /* ---- Mobile nav toggle ---- */
  var nav = document.querySelector(".nav");
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("nav-menu");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });

    // close when a link is tapped
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a") && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });

    // close when the backdrop is tapped
    document.querySelectorAll("[data-nav-close]").forEach(function (el) {
      el.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });

    // close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  /* ---- Header scrolled state ---- */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Footer "Quick links" accordion (mobile only) ---- */
  document.querySelectorAll(".site-footer__col[data-accordion]").forEach(function (col) {
    var head = col.querySelector("h3");
    if (!head) return;
    head.setAttribute("role", "button");
    head.setAttribute("tabindex", "0");
    head.setAttribute("aria-expanded", "false");
    var toggle = function () {
      var open = col.classList.toggle("is-open");
      head.setAttribute("aria-expanded", String(open));
    };
    head.addEventListener("click", toggle);
    head.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  });

  /* ---- Current year ---- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---- Quote modal ---- */
  var modal = document.getElementById("quote-modal");
  if (modal) {
    var lastFocus = null;

    var openModal = function (e) {
      if (e) e.preventDefault();
      lastFocus = document.activeElement;
      modal.classList.add("is-active");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      var first = modal.querySelector("input, select, textarea, button");
      if (first) setTimeout(function () { first.focus(); }, 60);
    };

    var closeModal = function () {
      modal.classList.remove("is-active");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      if (lastFocus) lastFocus.focus();
    };

    // open from any [data-modal="quote"] trigger
    document.querySelectorAll('[data-modal="quote"]').forEach(function (btn) {
      btn.addEventListener("click", openModal);
    });

    // close on overlay / close button
    modal.querySelectorAll("[data-modal-close]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });

    // close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-active")) closeModal();
    });
  }

  /* ---- Form submit (front-end success state; wire to a backend/Formspree to deliver) ---- */
  document.querySelectorAll("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var success = form.parentNode.querySelector(".form-success");
      if (success) {
        form.style.display = "none";
        success.classList.add("is-shown");
      }
    });
  });

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Hero background slideshow (crossfade) ---- */
  (function () {
    var slides = document.querySelectorAll(".hero__slide");
    if (slides.length < 2 || reduce) return;
    var i = 0;
    setInterval(function () {
      slides[i].classList.remove("is-active");
      i = (i + 1) % slides.length;
      slides[i].classList.add("is-active");
    }, 5000);
  })();

  /* ---- Testimonial slider (auto-rotate + dots) ---- */
  (function () {
    var root = document.querySelector("[data-testi-slider]");
    if (!root) return;
    var slides = root.querySelectorAll(".testi__slide");
    var dots = root.querySelectorAll(".testi__dot");
    if (!slides.length) return;
    var i = 0;
    var timer = null;

    var go = function (n) {
      slides[i].classList.remove("is-active");
      if (dots[i]) dots[i].classList.remove("is-active");
      i = (n + slides.length) % slides.length;
      slides[i].classList.add("is-active");
      if (dots[i]) dots[i].classList.add("is-active");
    };

    var start = function () {
      if (reduce) return;
      stop();
      timer = setInterval(function () { go(i + 1); }, 5500);
    };
    var stop = function () { if (timer) clearInterval(timer); };

    dots.forEach(function (dot, idx) {
      dot.addEventListener("click", function () { go(idx); start(); });
    });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    start();
  })();

  /* ---- Video buttons are placeholders — don't jump the page ---- */
  document.querySelectorAll(".video-btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      if (btn.getAttribute("href") === "#") e.preventDefault();
    });
  });

  /* ---- Scroll-spy: highlight the nav link for the section in view ---- */
  (function () {
    var links = [].slice.call(
      document.querySelectorAll('.nav__menu a.nav__link[href^="#"]')
    );
    if (links.length < 2) return;

    var items = links
      .map(function (a) {
        var el = document.getElementById(a.getAttribute("href").slice(1));
        return el ? { a: a, el: el } : null;
      })
      .filter(Boolean);
    if (!items.length) return;

    // order by position on the page (menu order may differ from DOM order)
    items.sort(function (x, y) {
      return x.el.offsetTop - y.el.offsetTop;
    });

    var raf = null;
    var update = function () {
      raf = null;
      var line = window.scrollY + window.innerHeight * 0.35;
      var atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      var active = items[0];
      if (atBottom) {
        active = items[items.length - 1];
      } else {
        for (var i = 0; i < items.length; i++) {
          if (items[i].el.offsetTop <= line) active = items[i];
        }
      }
      items.forEach(function (it) {
        it.a.classList.toggle("is-active", it === active);
      });
    };

    var onScroll = function () {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  })();
})();
