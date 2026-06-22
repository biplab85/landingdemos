/* ─────────────────────────────────────────────────────────────
   Designed & developed by
   Biplab Kumar Paul — Web Designer & Developer
   Mobile: 01735 927356
   Email:  biplab.cse.85@gmail.com
   ───────────────────────────────────────────────────────────── */
(function () {
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- page-load reveal ------------------------------------ */
  function markLoaded() { document.body.classList.add("loaded"); }
  if (document.readyState === "complete") markLoaded();
  else addEventListener("load", markLoaded);
  setTimeout(markLoaded, 250);

  /* ---- nav: condense on scroll ----------------------------- */
  var nav = document.getElementById("nav");
  addEventListener("scroll", function () {
    nav.classList.toggle("scrolled", scrollY > 32);
  }, { passive: true });

  /* ---- scroll reveals -------------------------------------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---- count-up stats -------------------------------------- */
  var cIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, target = +el.dataset.count, out = el.querySelector(".val");
      if (reduce) { out.textContent = target.toLocaleString(); cIO.unobserve(el); return; }
      var t0 = null, dur = 1500;
      requestAnimationFrame(function tick(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var ease = 1 - Math.pow(1 - p, 3);
        out.textContent = Math.round(target * ease).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      });
      cIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach(function (el) { cIO.observe(el); });

  /* ---- mobile slide-down menu ------------------------------ */
  (function () {
    var toggle = document.getElementById("navToggle");
    var panel = document.getElementById("navPanel");
    if (!toggle || !panel) return;

    function setOpen(open) {
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    toggle.addEventListener("click", function () {
      setOpen(!document.body.classList.contains("menu-open"));
    });

    // close when a link is tapped
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });

    // close on Escape
    addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    // reset when resizing up to desktop
    addEventListener("resize", function () {
      if (innerWidth > 720) setOpen(false);
    });
  })();

  /* ---- mobile app-bar "More" opens the existing menu --------- */
  (function () {
    var more = document.getElementById("appBarMore");
    var toggle = document.getElementById("navToggle");
    if (more && toggle) {
      more.addEventListener("click", function () { toggle.click(); });
    }
  })();
})();
