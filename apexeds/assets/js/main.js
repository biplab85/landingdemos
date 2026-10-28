/* ============================================================
   APEX v2 — Electrical, Data & Security
   Interactions: app shell, Swiper, Fancybox, GSAP motion, form
   ============================================================ */
(function () {
  "use strict";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var root = document.documentElement;
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var animate = hasGSAP && !prefersReduced;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sydney time: greeting + open status ---------- */
  function sydneyNow() {
    try {
      var parts = new Intl.DateTimeFormat("en-AU", {
        timeZone: "Australia/Sydney", weekday: "short", hour: "numeric", hour12: false
      }).formatToParts(new Date());
      var o = {};
      parts.forEach(function (p) { o[p.type] = p.value; });
      return { day: o.weekday, hour: parseInt(o.hour, 10) % 24 };
    } catch (e) {
      var d = new Date();
      return { day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()], hour: d.getHours() };
    }
  }

  var now = sydneyNow();
  var isOpen = now.day !== "Sun" && now.hour >= 6 && now.hour < 17;
  var greeting = now.hour < 12 ? "Good morning" : now.hour < 17 ? "Good afternoon" : "Good evening";

  $$("[data-greeting]").forEach(function (el) { el.textContent = "G'day, " + greeting.toLowerCase(); });
  $$("[data-open-status]").forEach(function (el) { el.classList.toggle("is-closed", !isOpen); });
  $$("[data-open-text]").forEach(function (el) {
    el.textContent = isOpen ? "Open now · until 5:00pm" : "After hours · 24/7 emergency line open";
  });
  $$("[data-open-short]").forEach(function (el) { el.textContent = isOpen ? "Open now" : "24/7 line open"; });

  /* ---------- Header scrolled state ---------- */
  var header = document.getElementById("header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 10);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Back to top ---------- */
  $$("[data-to-top]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
  });

  /* ---------- Bottom sheet menu ---------- */
  var sheet = document.getElementById("sheet");
  var sheetPanel = sheet ? $(".sheet__panel", sheet) : null;
  var sheetOpeners = $$("[data-sheet-open]");
  var lastFocus = null;

  function openSheet() {
    if (!sheet) return;
    lastFocus = document.activeElement;
    sheet.classList.add("is-open");
    sheet.setAttribute("aria-hidden", "false");
    sheetOpeners.forEach(function (b) { b.setAttribute("aria-expanded", "true"); });
    document.body.classList.add("is-locked");
    var closeBtn = $(".sheet__head [data-sheet-close]", sheet);
    if (closeBtn) setTimeout(function () { closeBtn.focus(); }, 60);
  }

  function closeSheet() {
    if (!sheet || !sheet.classList.contains("is-open")) return;
    sheet.classList.remove("is-open");
    sheet.setAttribute("aria-hidden", "true");
    sheetOpeners.forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    document.body.classList.remove("is-locked");
    if (sheetPanel) sheetPanel.style.transform = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  sheetOpeners.forEach(function (b) {
    b.addEventListener("click", function () {
      if (sheet.classList.contains("is-open")) closeSheet();
      else openSheet();
    });
  });
  $$("[data-sheet-close]").forEach(function (b) { b.addEventListener("click", closeSheet); });
  if (sheet) $$("a", sheet).forEach(function (a) { a.addEventListener("click", closeSheet); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSheet(); });

  // drag the handle down to dismiss, like a native sheet
  var grab = sheet ? $("[data-sheet-drag]", sheet) : null;
  if (grab && sheetPanel) {
    var startY = 0, dy = 0, dragging = false;
    grab.addEventListener("pointerdown", function (e) {
      dragging = true; startY = e.clientY; dy = 0;
      sheet.classList.add("is-dragging");
      grab.setPointerCapture(e.pointerId);
    });
    grab.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      dy = Math.max(0, e.clientY - startY);
      sheetPanel.style.transform = "translateY(" + dy + "px)";
    });
    var endDrag = function () {
      if (!dragging) return;
      dragging = false;
      sheet.classList.remove("is-dragging");
      if (dy > 90) closeSheet();
      else sheetPanel.style.transform = "";
    };
    grab.addEventListener("pointerup", endDrag);
    grab.addEventListener("pointercancel", endDrag);
  }

  /* ---------- Active section → nav + tab bar ---------- */
  var tabFor = {
    top: "top", about: "top",
    services: "services", sectors: "services",
    work: "work", process: "work", guarantee: "work", projects: "work",
    quote: "quote"
  };
  var navLinks = $$(".nav a");
  var tabs = $$(".tabbar [data-tab]");

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + id); });
        var tab = tabFor[id] || "";
        tabs.forEach(function (t) { t.classList.toggle("is-active", t.getAttribute("data-tab") === tab); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { io.observe(s); });
  }

  /* ---------- Swiper sliders ---------- */
  // smooth infinite autoplay; pauses on hover and resumes after a swipe.
  // `key` wires the counter (data-KEY-current) and the countdown ring (data-KEY-ring).
  function initSlider(selector, key, delay, opts) {
    var el = $(selector);
    if (!el || !window.Swiper) return;
    var current = $("[data-" + key + "-current]");
    var ring = $("[data-" + key + "-ring]");
    var RING = 157.08;   // 2πr, r = 25

    var config = Object.assign({
      loop: true,
      speed: 1100,
      grabCursor: true,
      keyboard: { enabled: true, onlyInViewport: true },
      navigation: { prevEl: "[data-" + key + "-prev]", nextEl: "[data-" + key + "-next]" },
      pagination: { el: "[data-" + key + "-progress]", type: "progressbar" },
      autoplay: prefersReduced ? false : { delay: delay, disableOnInteraction: false, pauseOnMouseEnter: true },
      on: {
        slideChange: function (s) {
          if (current) current.textContent = String(s.realIndex + 1).padStart(2, "0");
        },
        autoplayTimeLeft: function (s, time, progress) {
          if (ring) ring.style.strokeDashoffset = RING * progress;
        }
      }
    }, opts);

    new Swiper(el, config);
  }

  initSlider(".services__swiper", "svc", 3200, {
    slidesPerView: 1,
    spaceBetween: 14,
    breakpoints: {
      640: { slidesPerView: 2, spaceBetween: 18 },
      1024: { slidesPerView: 3, spaceBetween: 22 }
    }
  });

  initSlider(".projects__swiper", "proj", 2600, {
    slidesPerView: 1,
    spaceBetween: 12,
    breakpoints: {
      640: { slidesPerView: 2, spaceBetween: 16 },
      1024: { slidesPerView: 3, spaceBetween: 18 },
      1280: { slidesPerView: 4, spaceBetween: 20 }
    }
  });

  /* ---------- Fancybox gallery ---------- */
  // Hash sync is off: otherwise visiting "#work" (the section anchor) is read
  // by Fancybox as a deep link into a gallery and pops the lightbox open.
  if (window.Fancybox) {
    if (window.Fancybox.defaults) window.Fancybox.defaults.Hash = false;
    window.Fancybox.bind('[data-fancybox="apex-gallery"]', {
      Hash: false,
      dragToClose: true,
      showClass: "f-zoomInUp",
      hideClass: "f-fadeOut",
      Thumbs: { type: "classic" },
      Toolbar: {
        display: { left: ["infobar"], middle: [], right: ["slideshow", "fullscreen", "thumbs", "close"] }
      }
    });
  }

  /* ---------- Portfolio filter (GSAP Flip) + sliding pill ---------- */
  var workGrid = document.getElementById("workGrid");
  var workItems = $$(".work__item");
  var filterBtns = $$("[data-filter]");
  var pill = $(".filters__pill");
  var workCount = $("[data-work-count]");
  var hasFlip = animate && typeof window.Flip !== "undefined";
  if (hasFlip) gsap.registerPlugin(Flip);

  function movePill(btn) {
    if (!pill || !btn) return;
    pill.style.width = btn.offsetWidth + "px";
    pill.style.transform = "translateX(" + btn.offsetLeft + "px)";
  }
  var activeFilter = function () { return $("[data-filter].is-active"); };
  movePill(activeFilter());
  window.addEventListener("resize", function () { movePill(activeFilter()); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { movePill(activeFilter()); });

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      movePill(btn);
      btn.scrollIntoView({ block: "nearest", inline: "center", behavior: prefersReduced ? "auto" : "smooth" });

      var state = hasFlip ? Flip.getState(workItems) : null;
      var shown = 0;
      workItems.forEach(function (item) {
        var cat = item.getAttribute("data-cat");
        if (!cat) return;   // the quote tile always stays
        var show = filter === "all" || cat === filter;
        if (show) shown++;
        item.classList.toggle("is-hidden", !show);
        // hidden tiles leave the lightbox group
        item.setAttribute("data-fancybox", show ? "apex-gallery" : "apex-hidden");
      });
      if (workGrid) workGrid.classList.toggle("is-filtered", filter !== "all");
      if (workCount) workCount.textContent = shown;

      if (state) {
        Flip.from(state, {
          duration: 0.7,
          ease: "power3.inOut",
          absolute: true,
          nested: true,
          onEnter: function (els) { return gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.55 }); },
          onLeave: function (els) { return gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.35 }); },
          onComplete: function () { ScrollTrigger.refresh(); }
        });
      }
    });
  });

  /* ---------- Desktop "View" cursor over gallery tiles ---------- */
  var viewCursor = $(".view-cursor");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (viewCursor && finePointer) {
    root.classList.add("has-view-cursor");
    var setX, setY;
    if (hasGSAP) {
      setX = gsap.quickTo(viewCursor, "x", { duration: 0.45, ease: "power3.out" });
      setY = gsap.quickTo(viewCursor, "y", { duration: 0.45, ease: "power3.out" });
    } else {
      setX = function (v) { viewCursor.style.left = v + "px"; };
      setY = function (v) { viewCursor.style.top = v + "px"; };
    }
    window.addEventListener("mousemove", function (e) { setX(e.clientX); setY(e.clientY); }, { passive: true });
    workItems.forEach(function (item) {
      if (!item.getAttribute("data-cat")) return;
      item.addEventListener("mouseenter", function () { viewCursor.classList.add("is-on"); });
      item.addEventListener("mouseleave", function () { viewCursor.classList.remove("is-on"); });
      item.addEventListener("click", function () { viewCursor.classList.remove("is-on"); });
    });
  }

  /* ---------- Sector tabs ---------- */
  var tabButtons = $$('.tabs [role="tab"]');
  function selectTab(btn, focus) {
    tabButtons.forEach(function (b) {
      var on = b === btn;
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(b.getAttribute("aria-controls"));
      if (panel) panel.hidden = !on;
      if (on && panel && animate) {
        gsap.fromTo($(".sector__media", panel), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
        gsap.fromTo($(".sector__body", panel).children, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" });
      }
    });
    if (focus) btn.focus();
    btn.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  tabButtons.forEach(function (btn, i) {
    btn.addEventListener("click", function () { selectTab(btn, false); });
    btn.addEventListener("keydown", function (e) {
      var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      selectTab(tabButtons[(i + dir + tabButtons.length) % tabButtons.length], true);
    });
  });

  /* ---------- FAQ accordion ---------- */
  var accButtons = $$(".acc__btn");
  accButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var willOpen = btn.getAttribute("aria-expanded") !== "true";
      accButtons.forEach(function (b) {
        var open = b === btn && willOpen;
        b.setAttribute("aria-expanded", open ? "true" : "false");
        var panel = document.getElementById(b.getAttribute("aria-controls"));
        if (panel) panel.classList.toggle("is-open", open);
      });
    });
  });

  /* ---------- Free quote drawer ---------- */
  var drawer = document.getElementById("quote");
  var drawerPanel = drawer ? $(".drawer__panel", drawer) : null;
  var form = document.getElementById("quoteForm");
  var drawerLastFocus = null;
  var step = 1;

  function focusables(el) {
    return $$('a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])', el)
      .filter(function (n) { return n.offsetParent !== null; });
  }

  function setStep(n) {
    step = n;
    $$(".qstep", form).forEach(function (s) { s.hidden = s.getAttribute("data-step") !== String(n); });
    $$("[data-step-label]", drawer).forEach(function (l) {
      var i = +l.getAttribute("data-step-label");
      l.classList.toggle("is-active", i === n);
      l.classList.toggle("is-done", i < n);
    });
    var bar = $("[data-step-bar]", drawer);
    if (bar) bar.style.width = n === 1 ? "50%" : "100%";
    $("[data-step-back]", form).hidden = n === 1;
    $("[data-step-next]", form).hidden = n !== 1;
    $("[data-step-submit]", form).hidden = n === 1;
    $(".drawer__body", form).scrollTop = 0;

    var active = $('.qstep[data-step="' + n + '"]', form);
    if (animate && active) {
      gsap.fromTo(active.children, { opacity: 0, x: n === 2 ? 24 : -24 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.04, ease: "power3.out" });
    }
  }

  function resetForm() {
    form.reset();
    form.classList.remove("is-sent");
    $$(".field.is-invalid", form).forEach(function (f) { f.classList.remove("is-invalid"); });
    setStep(1);
  }

  function openDrawer(type) {
    if (!drawer) return;
    closeSheet();
    if (form.classList.contains("is-sent")) resetForm();
    if (type) $$('input[name="type"]', form).forEach(function (r) { r.checked = r.value === type; });

    drawerLastFocus = document.activeElement;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");

    if (animate) {
      gsap.fromTo($$(".drawer__head > *", drawer), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, delay: 0.2, ease: "power3.out" });
      gsap.fromTo($('.qstep[data-step="' + step + '"]', form).children, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, delay: 0.35, ease: "power3.out" });
    }
    setTimeout(function () { var c = $(".drawer__close", drawer); if (c) c.focus(); }, 80);
  }

  function closeDrawer() {
    if (!drawer || !drawer.classList.contains("is-open")) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    if (drawerPanel) drawerPanel.style.transform = "";
    if (location.hash === "#quote") history.replaceState(null, "", location.pathname + location.search);
    if (drawerLastFocus && drawerLastFocus.focus) drawerLastFocus.focus();
  }

  if (drawer && form) {
    // every "#quote" link opens the drawer; "Enquire" links preselect the project type
    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[href="#quote"]');
      if (!link) return;
      e.preventDefault();
      openDrawer(link.getAttribute("data-enquire"));
    });
    $$("[data-drawer-close]", drawer).forEach(function (b) { b.addEventListener("click", closeDrawer); });
    if (location.hash === "#quote") openDrawer();

    document.addEventListener("keydown", function (e) {
      if (!drawer.classList.contains("is-open")) return;
      if (e.key === "Escape") { closeDrawer(); return; }
      if (e.key !== "Tab") return;
      // keep focus inside the drawer
      var f = focusables(drawerPanel);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // mobile: drag the handle down to dismiss
    var dGrab = $("[data-drawer-drag]", drawer);
    if (dGrab && drawerPanel) {
      var dStart = 0, dDy = 0, dDragging = false;
      dGrab.addEventListener("pointerdown", function (e) {
        dDragging = true; dStart = e.clientY; dDy = 0;
        drawer.classList.add("is-dragging");
        dGrab.setPointerCapture(e.pointerId);
      });
      dGrab.addEventListener("pointermove", function (e) {
        if (!dDragging) return;
        dDy = Math.max(0, e.clientY - dStart);
        drawerPanel.style.transform = "translateY(" + dDy + "px)";
      });
      var dEnd = function () {
        if (!dDragging) return;
        dDragging = false;
        drawer.classList.remove("is-dragging");
        if (dDy > 110) closeDrawer();
        else drawerPanel.style.transform = "";
      };
      dGrab.addEventListener("pointerup", dEnd);
      dGrab.addEventListener("pointercancel", dEnd);
    }

    // --- steps ---
    $("[data-step-next]", form).addEventListener("click", function () {
      setStep(2);
      setTimeout(function () { form.elements.name.focus({ preventScroll: true }); }, 60);
    });
    $("[data-step-back]", form).addEventListener("click", function () { setStep(1); });

    // --- validation ---
    var rules = {
      name: function (v) { return v.trim().length >= 2; },
      phone: function (v) {
        var d = v.replace(/[^\d+]/g, "").replace(/^\+61/, "0");
        return /^0[2-478]\d{8}$/.test(d) || /^1[38]00\d{6}$/.test(d);
      },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }
    };

    var validate = function (input) {
      var rule = rules[input.name];
      if (!rule) return true;
      var ok = rule(input.value);
      input.closest(".field").classList.toggle("is-invalid", !ok);
      input.setAttribute("aria-invalid", ok ? "false" : "true");
      return ok;
    };

    Object.keys(rules).forEach(function (name) {
      var input = form.elements[name];
      if (!input) return;
      input.addEventListener("blur", function () { if (input.value) validate(input); });
      input.addEventListener("input", function () {
        if (input.closest(".field").classList.contains("is-invalid")) validate(input);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (step === 1) { $("[data-step-next]", form).click(); return; }

      var firstBad = null;
      Object.keys(rules).forEach(function (name) {
        var input = form.elements[name];
        if (input && !validate(input) && !firstBad) firstBad = input;
      });
      if (firstBad) { firstBad.focus(); return; }

      // TODO: connect to a mail/CRM endpoint. Front-end success state only for now.
      var first = form.elements.name.value.trim().split(/\s+/)[0];
      var nameSlot = $("[data-success-name]", form);
      if (nameSlot) nameSlot.textContent = first ? ", " + first : "";
      form.classList.add("is-sent");
      $(".drawer__body", form).scrollTop = 0;
      var success = $(".qform__success", form);
      if (animate && success) gsap.fromTo(success.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: "power3.out" });
    });

    $("[data-form-reset]", form).addEventListener("click", resetForm);
  }

  /* ---------- Split intro statement into words ---------- */
  function splitWords(el) {
    var words = [];
    $$("*", el).concat([el]).forEach(function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType !== 3 || !child.textContent.trim()) return;
        var frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var span = document.createElement("span");
          span.className = "w";
          span.textContent = part;
          frag.appendChild(span);
          words.push(span);
        });
        child.parentNode.replaceChild(frag, child);
      });
    });
    return words;
  }

  /* ---------- No animation: show everything and stop here ---------- */
  root.classList.add("is-ready");
  if (!animate) return;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Hero intro timeline ---------- */
  var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
  tl.from(".hero__title .line > span", { yPercent: 115, duration: 1.15, stagger: 0.1 }, 0.05)
    .from(".hero [data-hero], .hero__hello", { y: 26, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.15)
    .fromTo(".hero__photo",
      { clipPath: "inset(14% 10% 14% 10% round 32px)" },
      { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.5, ease: "expo.out", clearProps: "clipPath" }, 0.1)
    .from(".hero__photo img", { scale: 1.25, duration: 1.9, ease: "expo.out" }, 0.1)
    .from(".hero__title .swash", { scaleX: 0, duration: 0.9, ease: "power3.inOut" }, 0.85)
    .from(".hero__float", { y: 24, opacity: 0, duration: 0.8, stagger: 0.14, ease: "back.out(1.6)" }, 0.9)
    .from(".quick__item", { y: 22, opacity: 0, duration: 0.6, stagger: 0.06 }, 0.55);

  // gentle idle float on the glass cards
  gsap.to(".hero__float--top", { y: -8, duration: 3.2, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 2 });
  gsap.to(".hero__float--bottom", { y: 8, duration: 3.6, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 2.2 });

  // hero photo parallax
  gsap.to(".hero__photo img", {
    yPercent: 7,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  });

  /* ---------- Scroll reveals ---------- */
  var reveals = $$("[data-reveal]");
  gsap.set(reveals, { y: 36, opacity: 0 });
  ScrollTrigger.batch(reveals, {
    start: "top 90%",
    once: true,
    onEnter: function (batch) {
      gsap.to(batch, { y: 0, opacity: 1, duration: 0.95, ease: "power3.out", stagger: 0.08, overwrite: true });
    }
  });

  /* ---------- Intro statement: words light up on scroll ---------- */
  $$("[data-words]").forEach(function (el) {
    var words = splitWords(el);
    gsap.fromTo(words, { opacity: 0.15 }, {
      opacity: 1,
      ease: "none",
      stagger: 0.05,
      scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 50%", scrub: true }
    });
  });

  /* ---------- Image parallax ---------- */
  $$("[data-parallax-img]").forEach(function (img) {
    gsap.fromTo(img, { yPercent: -6 }, {
      yPercent: 6,
      ease: "none",
      scrollTrigger: { trigger: img.parentNode, start: "top bottom", end: "bottom top", scrub: true }
    });
  });

  /* ---------- Count-up stats ---------- */
  $$("[data-count]").forEach(function (el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var obj = { v: 0 };
    el.textContent = "0";
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: function () {
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: function () { el.textContent = Math.round(obj.v); }
        });
      }
    });
  });

  /* ---------- Process: progress line + steps light up ---------- */
  var steps = $$(".step");
  if (steps.length) {
    gsap.fromTo(".steps__fill", { scaleX: 0 }, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".steps",
        start: "top 75%",
        end: "bottom 55%",
        scrub: true,
        onUpdate: function (self) {
          steps.forEach(function (s, i) {
            s.classList.toggle("is-on", self.progress >= (i / (steps.length - 1)) * 0.98);
          });
        }
      }
    });
  }

  /* ---------- Refresh once fonts & images settle ---------- */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
