/*!
 * ==========================================================================
 * Sklentr v3 — Law & Advisory Landing Page (evergreen counsel edition)
 * Author : Biplab Paul
 * Email  : biplab.cse.85@gmail.com
 * Phone  : 01735927356
 * --------------------------------------------------------------------------
 * Motion  : GSAP 3 + ScrollTrigger (scrubbed reveals, marquee, wipe,
 *           counters, cursor disc), Lenis smooth scroll on desktop.
 * UI      : Swiper testimonials, Fancybox case lightbox, consultation sheet,
 *           validated forms + toast, phone app bars with scroll-spy.
 * Hooks   : js-* classes only (never styled).
 * ==========================================================================
 */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };

  var mqDesktop = window.matchMedia('(min-width: 992px)');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var lenis = null;

  /* ------------------------------------------------------------------------
   * Utilities
   * ---------------------------------------------------------------------- */
  function formatNumber(n, sep) {
    var s = String(Math.round(n));
    return sep ? s.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : s;
  }

  function scrollToTarget(target) {
    var offset = mqDesktop.matches ? 0 : -(parseFloat(getComputedStyle(root).getPropertyValue('--topbar-h')) || 64) + 1;
    if (lenis) {
      lenis.scrollTo(target, { offset: offset, duration: 1.2 });
    } else {
      var y = target.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top: target.id === 'home' ? 0 : y, behavior: reduced ? 'auto' : 'smooth' });
    }
  }

  /* ------------------------------------------------------------------------
   * Toast
   * ---------------------------------------------------------------------- */
  var toastEl = $('.js-toast');
  var toastTimer;
  function toast(message, isError) {
    if (!toastEl) return;
    $('.js-toast-text', toastEl).textContent = message;
    toastEl.classList.toggle('is-error', !!isError);
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 3800);
  }

  /* ------------------------------------------------------------------------
   * Smooth scroll (desktop only)
   * ---------------------------------------------------------------------- */
  function initLenis() {
    if (reduced || !mqDesktop.matches || typeof window.Lenis === 'undefined') return;
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  /* ------------------------------------------------------------------------
   * In-page anchors
   * ---------------------------------------------------------------------- */
  function initAnchors() {
    doc.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = doc.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      // let a closing sheet release the scroll lock first
      setTimeout(function () { scrollToTarget(target); }, a.classList.contains('js-close-sheet') ? 380 : 0);
    });
  }

  /* ------------------------------------------------------------------------
   * Sheets (consultation + phone menu)
   * ---------------------------------------------------------------------- */
  var openSheetEl = null;
  var lastFocus = null;

  function openSheet(id, trigger) {
    var sheet = doc.getElementById(id);
    if (!sheet) return;
    if (openSheetEl) closeSheet();
    lastFocus = trigger || doc.activeElement;

    // Preselect a plan when opened from a pricing card
    var plan = trigger && trigger.getAttribute('data-plan');
    var select = $('.js-plan-target', sheet);
    if (plan && select) select.value = plan;

    sheet.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
    doc.body.classList.add('is-locked');
    if (lenis) lenis.stop();
    openSheetEl = sheet;
    var panel = $('.c-sheet__panel', sheet);
    setTimeout(function () {
      var first = $('input, select, textarea', panel);
      (mqDesktop.matches && first ? first : panel).focus({ preventScroll: true });
    }, 60);
  }

  function closeSheet() {
    if (!openSheetEl) return;
    openSheetEl.classList.remove('is-open');
    openSheetEl.setAttribute('aria-hidden', 'true');
    doc.body.classList.remove('is-locked');
    if (lenis) lenis.start();
    openSheetEl = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function initSheets() {
    doc.addEventListener('click', function (e) {
      var opener = e.target.closest('.js-open-sheet');
      if (opener) {
        e.preventDefault();
        openSheet(opener.getAttribute('data-sheet'), opener);
        return;
      }
      if (e.target.closest('.js-close-sheet')) closeSheet();
    });

    doc.addEventListener('keydown', function (e) {
      if (!openSheetEl) return;
      if (e.key === 'Escape') { closeSheet(); return; }
      if (e.key !== 'Tab') return;
      // simple focus trap
      var f = $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', $('.c-sheet__panel', openSheetEl));
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // Swipe the phone sheet down to dismiss
    $$('.js-sheet .c-sheet__panel').forEach(function (panel) {
      var startY = null;
      panel.addEventListener('touchstart', function (e) {
        startY = panel.scrollTop <= 0 ? e.touches[0].clientY : null;
      }, { passive: true });
      panel.addEventListener('touchmove', function (e) {
        if (startY === null) return;
        var dy = e.touches[0].clientY - startY;
        if (dy > 0) panel.style.transform = 'translateY(' + dy + 'px)';
      }, { passive: true });
      panel.addEventListener('touchend', function (e) {
        if (startY === null) return;
        var dy = e.changedTouches[0].clientY - startY;
        panel.style.transform = '';
        startY = null;
        if (dy > 110) closeSheet();
      });
    });
  }

  /* ------------------------------------------------------------------------
   * Forms — required + email validation, success toast, no backend
   * ---------------------------------------------------------------------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validateField(input) {
    var field = input.closest('.c-field');
    var err = field && $('.c-field__error', field);
    var value = input.value.trim();
    var msg = '';
    if (input.required && !value) {
      msg = input.tagName === 'SELECT' ? 'Please choose an option.' : 'This field is required.';
    } else if (input.type === 'email' && value && !EMAIL_RE.test(value)) {
      msg = 'Please enter a valid email address.';
    } else if (input.type === 'tel' && value && value.replace(/\D/g, '').length < 7) {
      msg = 'Please enter a valid phone number.';
    }
    if (field) field.classList.toggle('is-invalid', !!msg);
    if (err) err.textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }

  function initForms() {
    $$('.js-form').forEach(function (form) {
      var inputs = $$('input, select, textarea', form);
      inputs.forEach(function (input) {
        input.addEventListener('blur', function () { if (input.value) validateField(input); });
        input.addEventListener('input', function () {
          if (input.closest('.c-field.is-invalid')) validateField(input);
        });
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var firstBad = null;
        inputs.forEach(function (input) {
          if (!validateField(input) && !firstBad) firstBad = input;
        });
        if (firstBad) {
          firstBad.focus();
          toast('Please check the highlighted fields.', true);
          return;
        }
        var btn = $('button[type="submit"]', form);
        btn.disabled = true;
        btn.style.opacity = '0.7';
        setTimeout(function () {
          btn.disabled = false;
          btn.style.opacity = '';
          form.reset();
          $$('.c-field', form).forEach(function (f) { f.classList.remove('is-invalid'); });
          if (form.closest('.js-sheet')) closeSheet();
          toast(form.getAttribute('data-success') || 'Thank you!');
        }, 650);
      });
    });
  }

  /* ------------------------------------------------------------------------
   * Testimonials slider
   * ---------------------------------------------------------------------- */
  function initSwiper() {
    var el = $('.js-testimonials');
    if (!el || typeof window.Swiper === 'undefined') return;
    new window.Swiper(el, {
      slidesPerView: 'auto',
      spaceBetween: 24,
      loop: true,
      speed: 500,
      grabCursor: true,
      autoplay: reduced ? false : { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true },
      navigation: { prevEl: '.js-prev', nextEl: '.js-next' },
      a11y: { enabled: true },
      breakpoints: { 0: { spaceBetween: 14 }, 992: { spaceBetween: 24 } }
    });
  }

  /* ------------------------------------------------------------------------
   * Fancybox (case results lightbox)
   * ---------------------------------------------------------------------- */
  function initFancybox() {
    if (typeof window.Fancybox === 'undefined') return;
    window.Fancybox.bind('[data-fancybox="cases"]', {
      Hash: false,
      Thumbs: false,
      on: {
        init: function () { if (lenis) lenis.stop(); },
        destroy: function () { if (lenis) lenis.start(); }
      }
    });
  }

  /* ------------------------------------------------------------------------
   * Phone: case filter chips
   * ---------------------------------------------------------------------- */
  function initChips() {
    var chips = $$('.js-chip');
    var cards = $$('.js-case');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.getAttribute('data-filter');
        chips.forEach(function (c) {
          var on = c === chip;
          c.classList.toggle('is-active', on);
          c.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        cards.forEach(function (card) {
          var show = f === 'all' || card.getAttribute('data-cat') === f;
          card.classList.toggle('is-hidden', !show);
          if (show && hasGsap && !reduced) {
            gsap.fromTo(card, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out', clearProps: 'transform' });
          }
        });
        if (hasGsap) ScrollTrigger.refresh();
      });
    });
  }

  /* ------------------------------------------------------------------------
   * Phone: footer accordions
   * ---------------------------------------------------------------------- */
  function initAccordions() {
    $$('.js-acc').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (mqDesktop.matches) return;
        var open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.nextElementSibling.classList.toggle('is-open', open);
      });
    });
  }

  /* ------------------------------------------------------------------------
   * Phone: top bar state + tab scroll-spy
   * ---------------------------------------------------------------------- */
  function setActiveTab(id) {
    $$('.js-tab').forEach(function (t) {
      var on = t.getAttribute('data-target') === id;
      t.classList.toggle('is-active', on);
      if (on) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
    });
  }

  function initAppChrome() {
    var topbar = $('.js-topbar');
    var onScroll = function () {
      if (topbar) topbar.classList.toggle('is-scrolled', window.pageYOffset > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Scroll-spy: the last tab section whose top passed 45% of the viewport
    var tabs = $$('.js-tab').map(function (t) { return doc.getElementById(t.getAttribute('data-target')); }).filter(Boolean);
    var current = null;
    var spy = function () {
      var line = window.innerHeight * 0.45;
      var id = tabs[0] && tabs[0].id;
      tabs.forEach(function (sec) { if (sec.getBoundingClientRect().top <= line) id = sec.id; });
      if (id !== current) { current = id; setActiveTab(id); }
    };
    if (hasGsap) ScrollTrigger.create({ start: 0, end: 'max', onUpdate: spy });
    window.addEventListener('scroll', spy, { passive: true });
    spy();
  }

  /* ------------------------------------------------------------------------
   * Counters
   * ---------------------------------------------------------------------- */
  function initCounters() {
    $$('.js-count').forEach(function (el) {
      var to = parseFloat(el.getAttribute('data-to'));
      var sep = el.getAttribute('data-sep');
      if (reduced || !hasGsap) { el.textContent = formatNumber(to, sep); return; }
      var obj = { v: 0 };
      el.textContent = '0';
      gsap.to(obj, {
        v: to,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        onUpdate: function () { el.textContent = formatNumber(obj.v, sep); }
      });
    });
  }

  /* ------------------------------------------------------------------------
   * Motion (GSAP + ScrollTrigger)
   * ---------------------------------------------------------------------- */
  function initMarquee() {
    var track = $('.js-marquee');
    if (!track) return;
    var list = track.firstElementChild;
    // three copies so the loop never shows a gap
    for (var i = 0; i < 2; i++) {
      var clone = list.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }
    if (reduced) return;
    var tween = gsap.to(track, {
      xPercent: -100 / 3,
      ease: 'none',
      duration: mqDesktop.matches ? 46 : 30,
      repeat: -1
    });
    // nudge speed with scroll velocity, like a living ticker
    ScrollTrigger.create({
      trigger: track,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: function (self) {
        var v = Math.min(Math.abs(self.getVelocity()) / 600, 3);
        gsap.to(tween, {
          timeScale: 1 + v, duration: 0.3, overwrite: true,
          onComplete: function () { gsap.to(tween, { timeScale: 1, duration: 1.2, overwrite: true }); }
        });
      }
    });
  }

  function initHero() {
    var items = $$('.js-hero-item');
    var tl = gsap.timeline({ defaults: { duration: 1.1, ease: 'power3.out' } });
    tl.from(items, { x: -80, autoAlpha: 0, stagger: 0.12 }, 0.1)
      .from('.js-hero-badge', { y: 40, autoAlpha: 0, duration: 0.9 }, 0.35)
      .from('.c-hero__media', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.4, ease: 'power4.inOut' }, 0)
      .from('.c-hero__media img', { scale: 1.18, duration: 1.8, ease: 'power3.out' }, 0.1);

    // gentle parallax on the statue panel (desktop)
    if (mqDesktop.matches) {
      gsap.to('.c-hero__media img', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: '.c-hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }
    // badge turns as you scroll
    gsap.to('.c-badge__svg', {
      rotate: 220,
      ease: 'none',
      scrollTrigger: { trigger: '.c-hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  function scrub(el, fromVars, start, end, trigger) {
    gsap.fromTo(el, fromVars, {
      x: 0, y: 0, scale: 1, autoAlpha: 1, ease: 'none',
      scrollTrigger: { trigger: trigger || el, start: start || 'top bottom', end: end || 'top 62%', scrub: 0.6 }
    });
  }

  function initReveals() {
    var desktop = mqDesktop.matches;

    // Section headings drop in from above while scaling up (scroll-scrubbed)
    $$('.js-head').forEach(function (h) {
      scrub(h, { y: desktop ? -100 : -30, scale: 0.96, autoAlpha: 0 }, 'top bottom', desktop ? 'top 68%' : 'top 82%', h.parentElement);
    });

    // Card groups rise
    $$('.js-rise').forEach(function (g) {
      scrub(g, { y: desktop ? 57 : 30, autoAlpha: 0 }, 'top bottom', desktop ? 'top 72%' : 'top 85%');
    });

    if (desktop) {
      scrub('.js-from-left', { x: -103, autoAlpha: 0 }, 'top bottom', 'top 60%');
      scrub('.js-from-below', { y: 57, autoAlpha: 0 }, 'top bottom', 'top 62%');
      scrub('.js-from-above', { y: -88, autoAlpha: 0 }, 'top bottom', 'top 62%');
      scrub('.js-from-right', { x: 80, autoAlpha: 0 }, 'top bottom', 'top 70%');
    } else {
      $$('.js-from-left, .js-from-below, .js-from-above, .js-from-right').forEach(function (el) {
        scrub(el, { y: 30, autoAlpha: 0 }, 'top bottom', 'top 85%');
      });
    }

    // Process: image wipes open, steps rise one after another
    var wipe = $('.js-wipe');
    if (wipe) {
      gsap.fromTo(wipe, { clipPath: 'inset(0% 100% 0% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power3.inOut',
        scrollTrigger: { trigger: wipe, start: 'top 72%', once: true }
      });
      gsap.fromTo($('img', wipe), { scale: 1.2 }, {
        scale: 1, duration: 1.8, ease: 'power3.out',
        scrollTrigger: { trigger: wipe, start: 'top 72%', once: true }
      });
    }
    gsap.fromTo('.js-step', { y: 88, autoAlpha: 0 }, {
      y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.15,
      scrollTrigger: { trigger: '.c-process__list', start: 'top 78%', once: true }
    });

    // Team: staircase cards rise in sequence (scrubbed)
    var lawyers = $$('.js-lawyer');
    if (desktop) {
      gsap.fromTo(lawyers, { y: 80, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, ease: 'none', stagger: 0.25,
        scrollTrigger: { trigger: '.c-team__grid', start: 'top bottom', end: 'top 45%', scrub: 0.6 }
      });
    } else {
      scrub('.c-team__grid', { y: 30, autoAlpha: 0 }, 'top bottom', 'top 85%');
    }

    // Pricing cards
    if (desktop) {
      gsap.fromTo('.js-plan', { y: 70, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, ease: 'none', stagger: 0.18,
        scrollTrigger: { trigger: '.c-pricing__grid', start: 'top bottom', end: 'top 55%', scrub: 0.6 }
      });
    } else {
      scrub('.c-pricing__grid', { y: 30, autoAlpha: 0 }, 'top bottom', 'top 85%');
    }

    // Images inside panels drift slightly (desktop parallax)
    if (desktop) {
      $$('.c-about__main img, .c-case__media img').forEach(function (img) {
        gsap.fromTo(img, { yPercent: -5, scale: 1.1 }, {
          yPercent: 5, scale: 1.1, ease: 'none',
          scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
    }
  }

  /* ------------------------------------------------------------------------
   * Case cards: cursor-following "view" disc
   * ---------------------------------------------------------------------- */
  function initCaseCursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    $$('.c-case__media').forEach(function (media) {
      var ring = $('.js-case-ring', media);
      var disc = $('.js-case-cursor', media);
      if (!ring || !disc) return;
      var parts = [ring, disc];
      gsap.set(parts, { xPercent: -50, yPercent: -50, scale: 0, x: media.clientWidth / 2, y: media.clientHeight / 2 });
      var xTo = parts.map(function (p, i) { return gsap.quickTo(p, 'x', { duration: i ? 0.45 : 0.6, ease: 'power3.out' }); });
      var yTo = parts.map(function (p, i) { return gsap.quickTo(p, 'y', { duration: i ? 0.45 : 0.6, ease: 'power3.out' }); });
      media.addEventListener('mousemove', function (e) {
        var r = media.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        xTo.forEach(function (f) { f(x); });
        yTo.forEach(function (f) { f(y); });
      });
      media.addEventListener('mouseenter', function (e) {
        var r = media.getBoundingClientRect();
        gsap.set(parts, { x: e.clientX - r.left, y: e.clientY - r.top });
        gsap.to(parts, { scale: 1, duration: 0.45, ease: 'back.out(1.7)', overwrite: 'auto' });
      });
      media.addEventListener('mouseleave', function () {
        gsap.to(parts, { scale: 0, duration: 0.35, ease: 'power2.in', overwrite: 'auto' });
      });
    });
  }

  /* ------------------------------------------------------------------------
   * Boot
   * ---------------------------------------------------------------------- */
  function boot() {
    var year = $('.js-year');
    if (year) year.textContent = new Date().getFullYear();

    if (hasGsap) gsap.registerPlugin(ScrollTrigger);

    initLenis();
    initAnchors();
    initSheets();
    initForms();
    initSwiper();
    initFancybox();
    initChips();
    initAccordions();
    initAppChrome();
    initCounters();

    if (hasGsap) {
      initMarquee();
      if (!reduced) {
        initHero();
        initReveals();
        initCaseCursor();
      }
      window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    }

    // Re-evaluate desktop/phone-only behaviour when crossing the breakpoint
    var wasDesktop = mqDesktop.matches;
    window.addEventListener('resize', function () {
      if (mqDesktop.matches !== wasDesktop) window.location.reload();
    });
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

/* ==========================================================================
 * Desktop menu: active link follows the section in view
 * Author : Biplab Paul · biplab.cse.85@gmail.com · 01735927356
 * Runs after load so pinned sections have already added their scroll length.
 * ========================================================================== */
(function () {
  'use strict';
  var links = Array.prototype.slice.call(document.querySelectorAll('.c-nav__link[href^="#"]'));
  if (!links.length) return;

  function setActive(id) {
    links.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-current', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  function init() {
    links.forEach(function (a) {
      var sec = document.querySelector(a.getAttribute('href'));
      if (!sec) return;
      if (window.ScrollTrigger) {
        ScrollTrigger.create({
          trigger: sec,
          start: 'top center',
          end: 'bottom center',
          onToggle: function (self) { if (self.isActive) setActive(sec.id); }
        });
      }
    });
    if (!window.ScrollTrigger && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
      }, { rootMargin: '-50% 0px -50% 0px' });
      links.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) io.observe(s); });
    }
  }

  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
})();
