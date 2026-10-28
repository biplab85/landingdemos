/* ═══════════════════════════════════════════════════════════════
   Effective Pest Control — V2 · main.js
   Vanilla JS + optional GSAP/ScrollTrigger, Swiper, Fancybox (CDN).
   Every enhancement degrades gracefully if a library fails to load.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  /* ── 1. Header state + back-to-top ─────────────────────────── */
  var header = $('#header');
  var toTop = $('[data-to-top]');
  var onScroll = function () {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-stuck', y > 8);
    if (toTop) toTop.classList.toggle('is-visible', y > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    var home = $('#home'); if (home) { home.setAttribute('tabindex', '-1'); home.focus({ preventScroll: true }); }
  });

  /* ── 2. Sheets (mobile menu + quote / contact drawers) ─────────── */
  var openSheet = null;
  var lastFocus = null;
  var focusables = function (el) {
    return $$('a[href], button:not([disabled]), input:not([type="hidden"]), textarea, select, [tabindex]:not([tabindex="-1"])', el)
      .filter(function (n) { return n.offsetParent !== null || n === document.activeElement; });
  };
  var setTriggers = function (id, expanded) {
    $$('[data-sheet-open="' + id + '"][aria-controls]').forEach(function (b) { b.setAttribute('aria-expanded', String(expanded)); });
  };
  var showSheet = function (sheet, trigger) {
    if (!sheet || openSheet === sheet) return;
    if (openSheet) hideSheet(openSheet, true);
    lastFocus = trigger || document.activeElement;
    clearSuccess();
    sheet.hidden = false;
    document.documentElement.classList.add('is-locked');
    // next frame → transition in
    requestAnimationFrame(function () { requestAnimationFrame(function () { sheet.classList.add('is-open'); }); });
    openSheet = sheet;
    if (Autoplay) Autoplay.setOverlay(true); // sliders pause while a drawer / menu is open
    setTriggers(sheet.id, true);
    setTimeout(function () {
      // Focus the first link in the menu; in the drawer focus the close button
      // (focusing an input would pop the phone keyboard over the sheet).
      var panel = sheet.querySelector('.sheet__panel');
      var f = panel.querySelector('[data-sheet-link]') || panel.querySelector('button');
      if (f) f.focus({ preventScroll: true });
    }, 80);
  };
  // a pending "success → auto-close" timer must never close a drawer that was reopened
  var successTimers = [];
  var clearSuccess = function () {
    successTimers.forEach(clearTimeout); successTimers = [];
    $$('.sheet .form__success').forEach(function (s) { s.hidden = true; });
  };
  var hideSheet = function (sheet, immediate) {
    if (!sheet || sheet.hidden) return;
    sheet.classList.remove('is-open');
    document.documentElement.classList.remove('is-locked');
    setTriggers(sheet.id, false);
    if (openSheet === sheet) openSheet = null;
    if (Autoplay && !openSheet) Autoplay.setOverlay(!!document.querySelector('.fancybox__container'));
    var done = function () { if (!sheet.classList.contains('is-open')) sheet.hidden = true; };
    if (immediate || reduceMotion) done(); else setTimeout(done, 420);
    if (!immediate && lastFocus && lastFocus.focus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  };

  $$('[data-sheet-open]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var sheet = document.getElementById(btn.getAttribute('data-sheet-open'));
      if (!sheet) return;
      e.preventDefault();
      showSheet(sheet, btn);
    });
  });
  $$('.sheet').forEach(function (sheet) {
    $$('[data-sheet-close]', sheet).forEach(function (c) { c.addEventListener('click', function () { hideSheet(sheet); }); });
    // links inside the menu: close first, then let the browser follow the anchor
    $$('[data-sheet-link]', sheet).forEach(function (a) {
      a.addEventListener('click', function () { lastFocus = null; hideSheet(sheet, true); });
    });
  });
  // Two drawers: [data-quote] → #quote (free quote), [data-contact] → #contact-us (general enquiry).
  // Triggers never navigate or change the hash; opening one drawer swaps out the other.
  var setVal = function (sel, val) { if (sel && val && sel.querySelector('option[value="' + val + '"]')) sel.value = val; };
  var bindDrawer = function (attr, id, prefill) {
    var drawer = document.getElementById(id);
    $$('[' + attr + ']').forEach(function (t) {
      t.setAttribute('aria-controls', id);
      t.addEventListener('click', function (e) {
        e.preventDefault();
        if (!drawer) return;
        // coming from inside another sheet (menu / other drawer) → return focus to a stable control
        var from = t.closest('.sheet') ? ($('.hdr__menu') || t) : t;
        if (prefill) prefill(drawer, t);
        showSheet(drawer, from);
      });
    });
  };
  bindDrawer('data-quote', 'quote', function (drawer, t) {
    setVal(drawer.querySelector('#q-service'), t.getAttribute('data-service'));
    setVal(drawer.querySelector('#q-property'), t.getAttribute('data-property'));
    var pest = t.getAttribute('data-pest');
    var chip = pest && drawer.querySelector('input[name="pest"][value="' + pest + '"]');
    if (chip) chip.checked = true;
  });
  bindDrawer('data-contact', 'contact-us');

  document.addEventListener('keydown', function (e) {
    if (!openSheet) return;
    if (e.key === 'Escape') { hideSheet(openSheet); return; }
    if (e.key === 'Tab') {
      var items = focusables(openSheet.querySelector('.sheet__panel'));
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // Close the menu sheet if the viewport grows into desktop layout
  window.matchMedia('(min-width: 1100px)').addEventListener('change', function (mq) {
    var menu = $('#menuSheet');
    if (mq.matches && openSheet === menu) hideSheet(menu, true);
  });

  /* ── 3. Active section → desktop nav, menu sheet, app bar ──── */
  var sectionToBar = {
    home: 'home', about: 'home', team: 'home',
    services: 'services', 'why-us': 'services',
    gallery: 'gallery', preparation: 'gallery'
    // testimonials / faq: no app-bar tab; "Contact" opens the contact drawer and is never "active"
  };
  var navLinks = $$('.nav a[href^="#"]:not([data-contact]), .sheet__nav a[href^="#"]:not([data-contact])');
  var barItems = $$('[data-appbar]');
  var setActive = function (id) {
    navLinks.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
    var bar = sectionToBar[id];
    barItems.forEach(function (b) {
      var on = b.getAttribute('data-appbar') === bar;
      b.classList.toggle('is-active', on);
      if (on) b.setAttribute('aria-current', 'location'); else b.removeAttribute('aria-current');
    });
  };
  var tracked = $$('main section[id]');
  if ('IntersectionObserver' in window && tracked.length) {
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      // pick the first section (document order) currently crossing the probe line
      for (var i = 0; i < tracked.length; i++) { if (visible[tracked[i].id]) { setActive(tracked[i].id); break; } }
    }, { rootMargin: '-35% 0px -60% 0px' });
    tracked.forEach(function (s) { io.observe(s); });
  }
  setActive('home');

  /* ── 4. FAQ accordion (single-open, animated) ──────────────── */
  var accButtons = $$('.acc__btn');
  var closePanel = function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', 'false');
    btn.closest('.acc').classList.remove('is-open');
    if (!panel || panel.hidden) return;
    if (reduceMotion || !panel.animate) { panel.hidden = true; return; }
    var h = panel.scrollHeight;
    var anim = panel.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 260, easing: 'cubic-bezier(.2,.7,.2,1)' });
    anim.onfinish = function () { if (btn.getAttribute('aria-expanded') === 'false') panel.hidden = true; };
  };
  var openPanel = function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', 'true');
    btn.closest('.acc').classList.add('is-open');
    if (!panel) return;
    panel.hidden = false;
    if (reduceMotion || !panel.animate) return;
    var h = panel.scrollHeight;
    panel.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 320, easing: 'cubic-bezier(.2,.7,.2,1)' });
  };
  accButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      accButtons.forEach(function (o) { if (o !== btn && o.getAttribute('aria-expanded') === 'true') closePanel(o); });
      if (isOpen) closePanel(btn); else openPanel(btn);
    });
  });

  /* ── 5. Autoplay controller (shared by every slider) ───────────
     A slider plays only while it has no "pause reasons":
       user (toggle) · focus (keyboard focus inside) · offscreen ·
       hidden (tab hidden) · overlay (drawer / menu / lightbox open).
     prefers-reduced-motion → never autoplays, toggles are hidden. */
  var players = {};
  var overlayOpen = false;
  var Autoplay = {
    add: function (name, root, api) {
      var p = { name: name, root: root, api: api, reasons: {}, playing: null };
      p.toggle = $('[data-autoplay-toggle="' + name + '"]');
      p.set = function (reason, on) { if (on) p.reasons[reason] = true; else delete p.reasons[reason]; p.apply(); };
      p.apply = function () {
        var play = !reduceMotion && Object.keys(p.reasons).length === 0;
        if (play === p.playing) return;
        p.playing = play;
        try { if (play) api.start(); else api.stop(); } catch (e) { /* never break the page */ }
      };
      if (p.toggle) {
        if (reduceMotion) p.toggle.hidden = true;
        var base = p.toggle.getAttribute('aria-label').replace(/^(Pause|Play) /, '');
        var paint = function () {
          var paused = !!p.reasons.user;
          p.toggle.classList.toggle('is-paused', paused);
          p.toggle.setAttribute('aria-label', (paused ? 'Play ' : 'Pause ') + base);
        };
        p.toggle.addEventListener('click', function () { p.set('user', !p.reasons.user); paint(); });
        paint();
      }
      if (root) {
        // keyboard focus on slide content pauses; focusing the pause/play control itself does not
        var isContent = function (el) { return el && root.contains(el) && !el.closest('[data-autoplay-toggle]'); };
        root.addEventListener('focusin', function (e) { if (isContent(e.target)) p.set('focus', true); });
        root.addEventListener('focusout', function (e) { if (!isContent(e.relatedTarget)) p.set('focus', false); });
        if ('IntersectionObserver' in window) {
          new IntersectionObserver(function (en) { p.set('offscreen', !en[0].isIntersecting); }, { threshold: 0.15 }).observe(root);
        }
      }
      if (document.hidden) p.reasons.hidden = true;
      if (overlayOpen) p.reasons.overlay = true;
      players[name] = p;
      p.apply();
      return p;
    },
    each: function (fn) { Object.keys(players).forEach(function (k) { fn(players[k]); }); },
    setOverlay: function (on) { overlayOpen = on; Autoplay.each(function (p) { p.set('overlay', on); }); }
  };
  window.__autoplay = players; // exposed for QA / tests only
  document.addEventListener('visibilitychange', function () { Autoplay.each(function (p) { p.set('hidden', document.hidden); }); });
  // Fancybox lightbox open/close (library-agnostic: watch for its container)
  if ('MutationObserver' in window) {
    var lightboxOpen = false;
    new MutationObserver(function () {
      var open = !!document.querySelector('.fancybox__container');
      if (open !== lightboxOpen) { lightboxOpen = open; Autoplay.setOverlay(open || !!openSheet); }
    }).observe(document.body, { childList: true });
  }

  /* ── 5b. Hero crossfade slider (infinite, 5.5s, 1.1s fade) ──── */
  (function () {
    var frame = $('[data-hero-slider]');
    if (!frame) return;
    var slides = $$('.hero__slide', frame);
    var bars = $$('.hero__bars span', frame);
    var label = $('[data-hero-label]', frame);
    var DURATION = 5500;
    var i = 0, timer = null;
    frame.style.setProperty('--slide-ms', DURATION + 'ms');
    frame.setAttribute('data-index', '0');
    var paint = function (restartBar) {
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
      bars.forEach(function (b, k) { b.classList.remove('is-active'); b.classList.toggle('is-done', k < i); });
      if (bars[i] && !reduceMotion && restartBar !== false) { void bars[i].offsetWidth; bars[i].classList.add('is-active'); }
      if (label) label.textContent = slides[i].getAttribute('data-label') || '';
      frame.setAttribute('data-index', String(i));
    };
    var next = function () { i = (i + 1) % slides.length; paint(); };
    paint(false);
    if (slides.length < 2) return;
    window.addEventListener('load', function () { slides.forEach(function (s) { s.loading = 'eager'; }); });
    Autoplay.add('hero', frame, {
      start: function () { if (timer) return; frame.classList.remove('is-paused'); paint(); timer = setInterval(next, DURATION); },
      stop: function () { if (timer) { clearInterval(timer); timer = null; } frame.classList.add('is-paused'); }
    });
  })();

  /* ── 6. Services rail progress (mobile) ────────────────────── */
  (function () {
    var rail = $('[data-rail]');
    var bar = $('[data-rail-bar]');
    if (!rail || !bar) return;
    var update = function () {
      var max = rail.scrollWidth - rail.clientWidth;
      var ratio = rail.clientWidth / rail.scrollWidth;
      bar.style.width = (ratio * 100) + '%';
      var p = max > 0 ? rail.scrollLeft / max : 0;
      bar.style.transform = 'translateX(' + (p * (1 / ratio - 1) * 100) + '%)';
    };
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ── 7. Forms (demo handler with inline validation) ────────── */
  $$('[data-form]').forEach(function (form) {
    var success = $('.form__success', form);
    var msgFor = function (input) {
      if (input.validity.valueMissing) return input.tagName === 'SELECT' ? 'Please choose an option.' : 'Please fill in this field.';
      if (input.validity.typeMismatch && input.type === 'email') return 'Please enter a valid email address.';
      return input.validationMessage;
    };
    var check = function (input) {
      var field = input.closest('.field');
      if (!field) return true;
      var ok = input.checkValidity();
      field.classList.toggle('is-invalid', !ok);
      input.setAttribute('aria-invalid', String(!ok));
      var err = $('.field__err', field);
      if (err) {
        err.textContent = ok ? '' : msgFor(input);
        if (!err.id) err.id = (input.id || 'f') + '-err';
        if (ok) input.removeAttribute('aria-describedby'); else input.setAttribute('aria-describedby', err.id);
      }
      return ok;
    };
    $$('input[required], textarea[required], select[required]', form).forEach(function (input) {
      input.addEventListener('blur', function () { if (input.value) check(input); });
      input.addEventListener('input', function () { if (input.closest('.field').classList.contains('is-invalid')) check(input); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      $$('input[required], textarea[required], select[required]', form).forEach(function (input) { if (!check(input) && !firstBad) firstBad = input; });
      if (firstBad) { firstBad.focus(); return; }
      // Demo only — wire to a real endpoint in production.
      form.reset();
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
        successTimers.push(setTimeout(function () {
          success.hidden = true;
          var sheet = form.closest('.sheet');
          if (sheet) hideSheet(sheet);
        }, sheetDelay(form)));
      }
    });
  });
  function sheetDelay(form) { return form.closest('.sheet') ? 3200 : 7000; }

  /* ── 8. Year ───────────────────────────────────────────────── */
  $$('[data-year]').forEach(function (n) { n.textContent = String(new Date().getFullYear()); });

  /* ── 9. Libraries (loaded with defer, before this file) ────── */
  var initLibs = function () {
    // Each library is isolated: one failing never blocks the others.
    // Swiper — team + reviews: true infinite loop, stepping autoplay, smooth 900ms slides.
    try { if (window.Swiper) {
      // Swiper's loop needs >= slidesPerView × 2 slides at every breakpoint. Duplicate the
      // set if short (clones: aria-hidden, untabbable, ids stripped). Returns clones added.
      var ensureLoopSlides = function (el, min) {
        var wrap = el.querySelector('.swiper-wrapper');
        var originals = $$('.swiper-slide', wrap);
        var n = originals.length, k = 0;
        if (!n) return 0;
        while (wrap.children.length < min) {
          var c = originals[k % n].cloneNode(true);
          c.classList.add('is-clone');
          c.setAttribute('aria-hidden', 'true');
          c.removeAttribute('id');
          $$('[id]', c).forEach(function (x) { x.removeAttribute('id'); });
          $$('a, button, input, select, textarea, [tabindex]', c).forEach(function (x) { x.setAttribute('tabindex', '-1'); });
          wrap.appendChild(c); k++;
        }
        return k;
      };
      var makeSwiper = function (name, el, maxPerView, opts) {
        if (!el) return null;
        el.setAttribute('data-loop-clones', String(ensureLoopSlides(el, Math.ceil(maxPerView) * 2)));
        var sw = new window.Swiper(el, opts);
        Autoplay.add(name, el, {
          start: function () { if (sw.autoplay && !sw.autoplay.running) sw.autoplay.start(); },
          stop: function () { if (sw.autoplay && sw.autoplay.running) sw.autoplay.stop(); }
        });
        return sw;
      };
      var autoplayOpts = function (delay) {
        return reduceMotion ? false : { delay: delay, disableOnInteraction: false, pauseOnMouseEnter: true };
      };

      makeSwiper('team', $('.team-swiper'), 4, {
        loop: true,
        slidesPerView: 1.28,
        spaceBetween: 14,
        speed: 900,
        grabCursor: true,
        autoplay: autoplayOpts(3800),
        navigation: { prevEl: '[data-team-prev]', nextEl: '[data-team-next]' },
        pagination: { el: '.team-progress', type: 'progressbar' },
        keyboard: { enabled: true, onlyInViewport: true },
        a11y: { enabled: true, prevSlideMessage: 'Previous team member', nextSlideMessage: 'Next team member', slideRole: 'group' },
        breakpoints: { 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 4, spaceBetween: 20 } }
      });

      makeSwiper('reviews', $('.reviews-swiper'), 3, {
        loop: true,
        slidesPerView: 1.16,
        spaceBetween: 14,
        speed: 900,
        grabCursor: true,
        autoplay: autoplayOpts(5000),
        navigation: { prevEl: '[data-reviews-prev]', nextEl: '[data-reviews-next]' },
        pagination: {
          el: '.reviews-pagination', clickable: true,
          renderBullet: function (idx, cls) { return '<button type="button" class="' + cls + '" aria-label="Go to testimonial ' + (idx + 1) + '"></button>'; }
        },
        keyboard: { enabled: true, onlyInViewport: true },
        a11y: { enabled: true, prevSlideMessage: 'Previous testimonial', nextSlideMessage: 'Next testimonial', slideRole: 'group' },
        breakpoints: { 640: { slidesPerView: 1.67 }, 1024: { slidesPerView: 3, spaceBetween: 20 } }
      });
    } } catch (err) { if (window.console) console.warn("Carousels disabled:", err); }

    // Fancybox — gallery lightbox
    try { if (window.Fancybox) {
      window.Fancybox.bind('[data-fancybox="gallery"]', {
        Hash: false,
        Images: { zoom: true },
        Thumbs: { type: 'classic' },
        Toolbar: { display: { left: ['infobar'], middle: [], right: ['slideshow', 'thumbs', 'close'] } }
      });
    } } catch (err) { if (window.console) console.warn("Lightbox disabled:", err); }

    // GSAP — restrained reveals.
    // Fail-safe: nothing is hidden by CSS. Elements are only hidden from JS immediately
    // before their animations are registered, and any error restores full visibility.
    if (window.gsap && !reduceMotion) {
      var gsap = window.gsap;
      var revealAll = function () {
        try { gsap.killTweensOf('[data-reveal], [data-hero-anim], .facts__item'); } catch (e) { /* ignore */ }
        $$('[data-reveal], [data-hero-anim], .facts__item').forEach(function (el) { el.style.opacity = ''; el.style.transform = ''; el.style.visibility = ''; });
      };
      try {
        if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
        gsap.from('[data-hero-anim]', { y: 26, opacity: 0, duration: .9, ease: 'power3.out', stagger: .09, delay: .05, clearProps: 'transform,opacity' });
        gsap.from('.facts__item', { y: 18, opacity: 0, duration: .7, ease: 'power2.out', stagger: .08, delay: .45, clearProps: 'transform,opacity' });

        if (window.ScrollTrigger) {
          var items = $$('[data-reveal]');
          var show = function (batch) { gsap.to(batch, { y: 0, opacity: 1, duration: .8, ease: 'power3.out', stagger: .07, overwrite: true, clearProps: 'transform,opacity' }); };
          gsap.set(items, { y: 28, opacity: 0 });
          window.ScrollTrigger.batch(items, { start: 'top 90%', once: true, onEnter: show });
          // Safety net: anything already scrolled past/into view but still hidden is shown.
          var sweep = function () {
            var vh = window.innerHeight;
            var late = items.filter(function (el) { return el.style.opacity === '0' && el.getBoundingClientRect().top < vh; });
            if (late.length) show(late);
          };
          var sweepT = null;
          window.addEventListener('scroll', function () { clearTimeout(sweepT); sweepT = setTimeout(sweep, 250); }, { passive: true });
          window.addEventListener('load', function () { window.ScrollTrigger.refresh(); setTimeout(sweep, 600); });
          // gentle parallax on the about composition (desktop only)
          gsap.matchMedia().add('(min-width: 1024px)', function () {
            gsap.to('.about__inset', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
          });
        }
      } catch (err) {
        revealAll();
        if (window.console) console.warn('Animations disabled:', err);
      }
      // a later runtime error anywhere on the page must never leave content invisible
      window.addEventListener('error', revealAll);
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initLibs);
  else initLibs();
})();
