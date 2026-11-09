// ==========================================================================
// Author : Biplab Paul
// Email  : biplab.cse.85@gmail.com
// Phone  : 01735927356
// --------------------------------------------------------------------------
// MAIN — Sklentr v3 behaviour. Re-creates the Auditry Webflow interactions
// with GSAP + ScrollTrigger (hero entrance, slide-in-bottom, shrink-big-in,
// flip-in-left, rolling counters, ribbon + logo drift, FAQ slide/accordion,
// blog hover ring), Lenis smooth scroll (desktop), Swiper testimonials,
// scroll-spy nav chips + app tab bar, sticky-on-scroll-up header,
// consultation sheet, form validation and toasts.
// ==========================================================================

(function () {
  'use strict';

  var doc = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var mqMobile = window.matchMedia('(max-width: 991px)');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var lenis = null;

  if (!hasGsap) doc.classList.add('is-static');
  else gsap.registerPlugin(ScrollTrigger);

  // ---- Year ----------------------------------------------------------------
  $$('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // ---- Cubic-bezier easing (Webflow custom curves) --------------------------
  function bezier(p1x, p1y, p2x, p2y) {
    var cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx;
    var cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by;
    function sx(t) { return ((ax * t + bx) * t + cx) * t; }
    function sy(t) { return ((ay * t + by) * t + cy) * t; }
    function dx(t) { return (3 * ax * t + 2 * bx) * t + cx; }
    function solve(x) {
      var t = x, i, d;
      for (i = 0; i < 8; i++) { d = sx(t) - x; if (Math.abs(d) < 1e-6) return t; var dd = dx(t); if (Math.abs(dd) < 1e-6) break; t -= d / dd; }
      var lo = 0, hi = 1; t = x;
      while (lo < hi) { d = sx(t); if (Math.abs(d - x) < 1e-6) return t; if (x > d) lo = t; else hi = t; t = (hi - lo) / 2 + lo; if (hi - lo < 1e-7) break; }
      return t;
    }
    return function (x) { return x <= 0 ? 0 : x >= 1 ? 1 : sy(solve(x)); };
  }
  var easeCounter = bezier(0.784, 0.325, 0.222, 0.98);
  var easeCss = bezier(0.25, 0.1, 0.25, 1);

  // ---- Lenis (desktop pointer devices only) --------------------------------
  function initLenis() {
    if (!window.Lenis || mqMobile.matches || reduced || window.matchMedia('(pointer: coarse)').matches) return;
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    window.lenis = lenis;
  }

  function scrollToTarget(target) {
    var el = typeof target === 'string' ? $(target) : target;
    if (!el && target !== '#top') return;
    var y = target === '#top' ? 0 : el.getBoundingClientRect().top + window.scrollY;
    if (mqMobile.matches) y -= 64;
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  }

  // ---- Anchors -------------------------------------------------------------
  function initAnchors() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a || a.classList.contains('js-open-sheet')) return;
      var href = a.getAttribute('href');
      if (href === '#' || href.length < 2) { e.preventDefault(); return; }
      if (href === '#top' || $(href)) {
        e.preventDefault();
        closeDrops();
        scrollToTarget(href);
      }
    });
  }

  // ---- Header: scroll away, return on scroll-up ----------------------------
  function initHeader() {
    var header = $('.js-header');
    var appbar = $('.c-appbar');
    if (!header) return;
    var lastY = window.scrollY, sticky = false;
    var threshold = 160;

    function setSticky(on) {
      if (on === sticky) return;
      sticky = on;
      header.style.transition = 'none';
      header.classList.toggle('is-sticky', on);
      if (!on) header.classList.remove('is-shown');
      void header.offsetHeight;
      header.style.transition = '';
    }
    function onScroll() {
      var y = window.scrollY;
      var dir = y > lastY ? 1 : y < lastY ? -1 : 0;
      if (y <= 116) { setSticky(false); }
      else if (y > threshold) {
        setSticky(true);
        if (dir < 0) header.classList.add('is-shown');
        else if (dir > 0) { header.classList.remove('is-shown'); closeDrops(); }
      }
      if (appbar) appbar.classList.toggle('is-scrolled', y > 8);
      lastY = y;
    }
    if (lenis) lenis.on('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- Dropdowns (hover like data-hover="true") ----------------------------
  function closeDrops(except) {
    $$('.js-drop').forEach(function (d) {
      if (d === except) return;
      d.classList.remove('is-open');
      var t = $('.c-nav__toggle', d); if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
  function initDrops() {
    $$('.js-drop').forEach(function (d) {
      var toggle = $('.c-nav__toggle', d);
      var timer;
      function open() { clearTimeout(timer); closeDrops(d); d.classList.add('is-open'); toggle.setAttribute('aria-expanded', 'true'); }
      function close() { timer = setTimeout(function () { d.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }, 60); }
      d.addEventListener('mouseenter', open);
      d.addEventListener('mouseleave', close);
      d.addEventListener('focusin', open);
      d.addEventListener('focusout', function (e) { if (!d.contains(e.relatedTarget)) close(); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrops(); });
  }

  // ---- Scroll-spy: nav chips + app tabs -------------------------------------
  function initSpy() {
    var links = $$('.js-spy-link');
    var tabs = $$('.js-tab');
    var sections = $$('.js-spy');
    var current = { spy: null, tab: null };

    function setActive(spy, tab) {
      if (spy && spy !== current.spy) {
        current.spy = spy;
        links.forEach(function (l) { l.classList.toggle('is-active', l.dataset.spy === spy); });
      }
      if (tab && tab !== current.tab) {
        current.tab = tab;
        tabs.forEach(function (t) {
          var on = t.dataset.tab === tab;
          t.classList.toggle('is-active', on);
          if (on) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
        });
      }
    }
    function measure() {
      var line = window.innerHeight * 0.4;
      var pick = sections[0];
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top - line <= 0) pick = sections[i];
      }
      // Bottom of page -> last section
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) pick = sections[sections.length - 1];
      setActive(pick.dataset.spy, pick.dataset.tab);
    }
    if (hasGsap) {
      sections.forEach(function (s) {
        ScrollTrigger.create({ trigger: s, start: 'top 40%', end: 'bottom 40%', onToggle: measure });
      });
      ScrollTrigger.addEventListener('refresh', measure);
    }
    window.addEventListener('scroll', measure, { passive: true });
    measure();
  }

  // ---- Rolling counters (reference "Counter Animation On View") -------------
  function buildRolls() {
    $$('.c-roll').forEach(function (el) {
      var digits = String(el.dataset.roll || '');
      var prefix = el.dataset.prefix || '', suffix = el.dataset.suffix || '';
      var html = '';
      var addChar = function (c) { html += '<span class="c-roll__char" aria-hidden="true">' + c + '</span>'; };
      prefix.split('').forEach(addChar);
      digits.split('').forEach(function (d, i) {
        var n = +d, items = [], k;
        var forward = i % 2 === 0;
        for (k = 0; k < 11; k++) items.push((n + 1 + k * 7 + i * 3) % 10);
        if (forward) items[0] = n; else items[10] = n;
        html += '<span class="c-roll__col ' + (forward ? 'is-fwd' : 'is-rev') + '" aria-hidden="true">' +
          items.map(function (v) { return '<span>' + v + '</span>'; }).join('') + '</span>';
      });
      suffix.split('').forEach(addChar);
      el.innerHTML = html;
      el.setAttribute('role', 'img');
    });
  }
  function initRolls() {
    if (!hasGsap) return;
    $$('.c-roll').forEach(function (el) {
      var fwd = $$('.is-fwd', el), rev = $$('.is-rev', el);
      if (reduced) { gsap.set(fwd, { yPercent: 0 }); gsap.set(rev, { yPercent: -1000 }); return; }
      gsap.set(fwd, { yPercent: -1000 });
      gsap.set(rev, { yPercent: 0 });
      var done = false;
      var run = function (delay) {
        if (done) return; done = true;
        gsap.to(fwd, { yPercent: 0, duration: 2, delay: delay || 0, ease: easeCounter });
        gsap.to(rev, { yPercent: -1000, duration: 2, delay: delay || 0, ease: easeCounter });
      };
      // Already on screen at load (hero card): roll once the card has risen in.
      if (el.closest('.js-hero-stats')) run(1.2);
      else if (el.getBoundingClientRect().top < window.innerHeight) run(0.2);
      else ScrollTrigger.create({ trigger: el, start: 'top bottom', once: true, onEnter: function () { run(0); } });
    });
  }

  // ---- Hero entrance ("Hero Animation") -------------------------------------
  function heroIntro() {
    if (!hasGsap) return;
    var tl = gsap.timeline({ defaults: { duration: 1.2, ease: 'power2.out' } });
    tl.to('.js-hero-title', { xPercent: 0, x: 0, delay: 0 }, 0.1)
      .fromTo('.js-hero-img', { scale: 0 }, { scale: 1 }, 0.4)
      .to('.js-hero-text', { x: 0 }, 0.7)
      .to('.js-hero-stats', { y: 0, opacity: 1 }, 1.0)
      .to('.js-hero-btn', { y: 0 }, 1.1);
    if (reduced) tl.progress(1);
  }

  // ---- Scroll reveals --------------------------------------------------------
  function trig(el, fn) {
    var off = el.dataset.offset != null ? +el.dataset.offset : 10;
    ScrollTrigger.create({ trigger: el, start: 'top ' + (100 - off) + '%', once: true, onEnter: fn });
  }
  function initReveals() {
    if (!hasGsap) return;
    var small = mqMobile.matches;
    $$('.js-reveal').forEach(function (el) {
      var d = (+el.dataset.delay || 0) / 1000;
      trig(el, function () { gsap.to(el, { opacity: 1, y: 0, duration: small ? 0.8 : 1, delay: d, ease: 'power3.out', overwrite: 'auto' }); });
    });
    $$('.js-zoom-in').forEach(function (el) {
      var d = (+el.dataset.delay || 0) / 1000;
      trig(el.parentElement || el, function () { gsap.to(el, { opacity: 1, scale: 1, duration: 1, delay: d, ease: 'power3.out' }); });
    });
    if (!small) {
      $$('.js-flip').forEach(function (el) {
        trig(el, function () { gsap.to(el, { opacity: 1, rotationY: 0, duration: 1, delay: 0.1, ease: 'power3.out' }); });
      });
      var list = $('.js-faq-list');
      if (list) {
        ScrollTrigger.create({
          trigger: list, start: 'top bottom', once: true,
          onEnter: function () { gsap.to($$('.js-faq', list), { x: 0, xPercent: 0, duration: 0.8, ease: 'power1.out', stagger: 0.3 }); }
        });
      }
    }
  }

  // ---- Ribbon + logos drift --------------------------------------------------
  function initDrift() {
    if (!hasGsap || reduced) return;
    var ribbon = $('.js-ribbon');
    if (ribbon) {
      gsap.fromTo(ribbon, { x: 0 }, {
        x: function () { return -0.75 * window.innerWidth; },
        duration: mqMobile.matches ? 12 : 15, ease: 'none', repeat: -1
      });
    }
    var logos = $('.js-logos');
    if (logos) gsap.fromTo(logos, { xPercent: 0 }, { xPercent: -110, duration: 20, ease: 'none', repeat: -1 });
  }

  // ---- FAQ accordion -----------------------------------------------------------
  function initFaq() {
    var items = $$('.js-faq');
    items.forEach(function (item) {
      $('.c-faq__q', item).addEventListener('click', function () {
        var open = !item.classList.contains('is-open');
        items.forEach(function (o) {
          if (o !== item && o.classList.contains('is-open')) toggle(o, false);
        });
        toggle(item, open);
      });
    });
    function toggle(item, open) {
      var panel = $('.c-faq__a', item);
      item.classList.toggle('is-open', open);
      $('.c-faq__q', item).setAttribute('aria-expanded', open ? 'true' : 'false');
      if (hasGsap) {
        gsap.to(panel, { height: open ? 'auto' : 0, duration: 0.5, ease: 'power1.out', onComplete: function () { if (lenis) lenis.resize(); ScrollTrigger.refresh(); } });
      } else {
        panel.style.height = open ? 'auto' : '0px';
      }
    }
  }

  // ---- Blog card hover ("Blog Card Hover" + "Button Move") --------------------
  function initPosts() {
    if (!hasGsap) return;
    $$('.js-post').forEach(function (card) {
      var media = $('.js-post-media', card);
      var shade = $('.c-post__shade', card);
      var img = $('.c-post__imgwrap img', card);
      var circle = $('.c-circle--blog', card);
      var overlay = $('.c-post__overlay', card);
      var qx = gsap.quickTo(overlay, 'xPercent', { duration: 0.9, ease: 'power3.out' });
      var qy = gsap.quickTo(overlay, 'yPercent', { duration: 0.9, ease: 'power3.out' });
      card.addEventListener('mouseenter', function () {
        if (mqMobile.matches) return;
        gsap.to(shade, { width: '100%', duration: 0.6, ease: 'power1.inOut', overwrite: true });
        gsap.to(img, { scale: 1.15, opacity: 1, duration: 0.8, ease: easeCss, overwrite: true });
        gsap.to(circle, { scale: 1, duration: 0.5, delay: 0.1, ease: easeCss, overwrite: true });
      });
      card.addEventListener('mouseleave', function () {
        gsap.to(shade, { width: '0%', duration: 0.5, ease: 'power1.in', overwrite: true });
        gsap.to(img, { scale: 1, duration: 0.8, ease: easeCss, overwrite: true });
        gsap.to(circle, { scale: 0, duration: 0.5, ease: easeCss, overwrite: true });
      });
      media.addEventListener('mousemove', function (e) {
        var r = media.getBoundingClientRect();
        qx(((e.clientX - r.left) / r.width - 0.5) * 100);
        qy(((e.clientY - r.top) / r.height - 0.5) * 100);
      });
    });
  }

  // ---- Testimonials ------------------------------------------------------------
  function initTesti() {
    var el = $('.js-testi');
    if (!el || !window.Swiper) return;
    new Swiper(el, {
      loop: true,
      speed: 500,
      slidesPerView: 1,
      spaceBetween: 0,
      grabCursor: true,
      navigation: { prevEl: '.js-testi-prev', nextEl: '.js-testi-next' },
      breakpoints: { 0: { slidesPerView: 'auto', spaceBetween: 12 }, 992: { slidesPerView: 1, spaceBetween: 0 } },
      a11y: { prevSlideMessage: 'Previous testimonial', nextSlideMessage: 'Next testimonial' }
    });
  }

  // ---- About video: pause off-screen, open full screen with Fancybox -----------
  function initVideo() {
    var wrap = $('.c-about__video');
    var v = $('.js-video');
    if (!v) return;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        en.forEach(function (x) { if (x.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); });
      }, { threshold: 0.05 }).observe(v);
    }
    if (wrap && window.Fancybox) {
      wrap.addEventListener('click', function () {
        Fancybox.show([{ src: v.currentSrc || $('source', v).src, type: 'html5video' }]);
      });
    }
  }

  // ---- Consultation sheet ---------------------------------------------------------
  var sheet, lastFocus;
  function openSheet() {
    if (!sheet) return;
    lastFocus = document.activeElement;
    sheet.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop();
    document.body.style.overflow = 'hidden';
    setTimeout(function () { var f = $('input', sheet); if (f && !mqMobile.matches) f.focus(); }, 300);
  }
  function closeSheet() {
    if (!sheet) return;
    sheet.classList.remove('is-open');
    sheet.setAttribute('aria-hidden', 'true');
    if (lenis) lenis.start();
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function initSheet() {
    sheet = $('.js-sheet');
    $$('.js-open-sheet').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); closeDrops(); openSheet(); });
    });
    $$('.js-close-sheet').forEach(function (b) { b.addEventListener('click', closeSheet); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet.classList.contains('is-open')) closeSheet(); });
    // swipe down to close (app shell)
    var panel = $('.c-sheet__panel', sheet), y0 = null;
    panel.addEventListener('touchstart', function (e) { if (panel.scrollTop <= 0) y0 = e.touches[0].clientY; }, { passive: true });
    panel.addEventListener('touchmove', function (e) {
      if (y0 == null) return;
      var dy = e.touches[0].clientY - y0;
      if (dy > 0) panel.style.transform = 'translateY(' + dy + 'px)';
    }, { passive: true });
    panel.addEventListener('touchend', function (e) {
      if (y0 == null) return;
      var dy = e.changedTouches[0].clientY - y0;
      panel.style.transform = '';
      y0 = null;
      if (dy > 90) closeSheet();
    });
  }

  // ---- Toast + forms -----------------------------------------------------------
  var toastTimer;
  function toast(msg, isError) {
    var t = $('.js-toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.toggle('is-error', !!isError);
    t.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-visible'); }, 3800);
  }
  function validate(field) {
    var v = field.value.trim(), msg = '';
    if (field.required && !v) msg = field.tagName === 'SELECT' ? 'Please choose an option.' : 'This field is required.';
    else if (field.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Please enter a valid email address.';
    else if (field.type === 'tel' && v && !/^[+()\d\s-]{6,}$/.test(v)) msg = 'Please enter a valid phone number.';
    var holder = field.closest('.c-field') || field.closest('form');
    var err = holder ? $('.c-field-error', holder) : null;
    field.classList.toggle('is-invalid', !!msg);
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) err.textContent = msg;
    return !msg;
  }
  function initForms() {
    $$('.js-form').forEach(function (form) {
      var fields = $$('input, select, textarea', form);
      fields.forEach(function (f) {
        f.addEventListener('blur', function () { if (f.value) validate(f); });
        f.addEventListener('input', function () { if (f.classList.contains('is-invalid')) validate(f); });
      });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = fields.map(validate).every(Boolean);
        if (!ok) {
          var bad = $('.is-invalid', form); if (bad) bad.focus();
          toast('Please check the highlighted field' + ($$('.is-invalid', form).length > 1 ? 's.' : '.'), true);
          return;
        }
        form.reset();
        fields.forEach(function (f) { f.classList.remove('is-invalid'); });
        if (form.closest('.js-sheet')) closeSheet();
        toast(form.dataset.success || 'Thank you! Your submission has been received.');
      });
    });
  }

  // ---- Boot ----------------------------------------------------------------------
  buildRolls();
  initLenis();
  initAnchors();
  initHeader();
  initDrops();
  initSheet();
  initForms();
  initFaq();
  initTesti();
  initVideo();

  heroIntro();
  var started = false;
  function start() {
    if (started) return;
    started = true;
    initReveals();
    initRolls();
    initDrift();
    initPosts();
    initSpy();
    if (hasGsap) ScrollTrigger.refresh();
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
    setTimeout(start, 900);
  } else {
    window.addEventListener('load', start);
  }
  window.addEventListener('load', function () { if (hasGsap) ScrollTrigger.refresh(); });
})();
