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
})();
