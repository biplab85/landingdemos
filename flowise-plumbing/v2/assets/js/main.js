/* ==========================================================================
   Flowise Plumbing — Version 2 · main.js
   Fail-safe by design: content is visible by default in CSS. Pre-reveal
   hidden states are only applied by GSAP after it has loaded, and any error
   reveals everything.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var mqReduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var reduce = function () { return !!mqReduce.matches; };

  /* ---------- fail-safe reveal ---------- */
  var revealed = false;
  function revealAll() {
    if (revealed) return;
    revealed = true;
    root.classList.remove('has-motion');
    var els = $$('[data-reveal], [data-hero]');
    try {
      if (window.gsap) { window.gsap.killTweensOf(els); window.gsap.set(els, { clearProps: 'opacity,visibility,transform' }); }
    } catch (e) { /* ignore */ }
    els.forEach(function (el) { el.style.opacity = ''; el.style.visibility = ''; el.style.transform = ''; });
  }
  window.addEventListener('error', revealAll);
  window.addEventListener('unhandledrejection', revealAll);

  function safe(name, fn) {
    try { fn(); } catch (e) {
      revealAll();
      if (window.console) console.warn('[flowise] ' + name + ' failed:', e);
    }
  }

  /* ---------- scroll lock (keeps scroll position) ---------- */
  var lockCount = 0;
  function lock() {
    if (lockCount++ === 0) {
      var sbw = window.innerWidth - root.clientWidth;
      if (sbw > 0) doc.body.style.paddingRight = sbw + 'px';
      root.classList.add('is-locked');
    }
  }
  function unlock() {
    if (lockCount === 0) return;
    if (--lockCount === 0) {
      root.classList.remove('is-locked');
      doc.body.style.paddingRight = '';
    }
  }

  /* ---------- focus trap helper ---------- */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function trap(container, e) {
    if (e.key !== 'Tab') return;
    var items = $$(FOCUSABLE, container).filter(function (el) { return el.offsetParent !== null || el === doc.activeElement; });
    if (!items.length) { e.preventDefault(); return; }
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && (doc.activeElement === first || !container.contains(doc.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* Generic overlay controller (menu + drawer) */
  function Overlay(el, opts) {
    this.el = el;
    this.panel = $(opts.panel, el);
    this.closeSel = opts.close;
    this.onOpen = opts.onOpen || function () {};
    this.onClose = opts.onClose || function () {};
    this.isOpen = false;
    this.returnTo = null;
    this.hideTimer = null;
    var self = this;
    $$(this.closeSel, el).forEach(function (b) { b.addEventListener('click', function () { self.close(); }); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.stopPropagation(); self.close(); }
      else trap(self.panel, e);
    });
  }
  Overlay.prototype.open = function (trigger) {
    if (this.isOpen) return;
    var self = this;
    clearTimeout(this.hideTimer);
    this.returnTo = trigger || doc.activeElement;
    this.el.hidden = false;
    lock();
    this.isOpen = true;
    // force reflow so the transition runs
    void this.el.offsetWidth;
    this.el.classList.add('is-open');
    this.onOpen();
    var focusTarget = $('[data-autofocus]', this.el) || this.panel;
    setTimeout(function () { try { focusTarget.focus({ preventScroll: true }); } catch (e) { focusTarget.focus(); } }, reduce() ? 0 : 60);
  };
  Overlay.prototype.close = function (opts) {
    if (!this.isOpen) return;
    opts = opts || {};
    var self = this;
    this.isOpen = false;
    this.el.classList.remove('is-open');
    unlock();
    this.onClose();
    var done = function () { if (!self.isOpen) self.el.hidden = true; };
    if (reduce() || opts.instant) done(); else this.hideTimer = setTimeout(done, 450);
    if (opts.restoreFocus !== false) {
      var r = opts.returnTo || this.returnTo;
      if (r && r.offsetParent === null && opts.fallbackFocus) r = opts.fallbackFocus;
      if (r && typeof r.focus === 'function') { try { r.focus({ preventScroll: true }); } catch (e) { r.focus(); } }
    }
  };

  var menu = null;
  var menuBtn = $('#menuBtn');

  /* ---------- mobile menu ---------- */
  safe('menu', function () {
    var el = $('#menu');
    if (!el || !menuBtn) return;
    menu = new Overlay(el, {
      panel: '.menu__panel',
      close: '[data-menu-close]',
      onOpen: function () { menuBtn.setAttribute('aria-expanded', 'true'); },
      onClose: function () { menuBtn.setAttribute('aria-expanded', 'false'); }
    });
    menuBtn.addEventListener('click', function () { menu.isOpen ? menu.close() : menu.open(menuBtn); });

    // in-page links inside the menu: close, then scroll
    $$('.menu__link:not([data-quote]):not([data-contact])', el).forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        var target = id && id.length > 1 ? doc.getElementById(id.slice(1)) : null;
        if (!target) return;
        e.preventDefault();
        menu.close({ restoreFocus: false });
        requestAnimationFrame(function () {
          target.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' });
          if (history.replaceState) history.replaceState(null, '', id);
        });
      });
    });

    // close menu when switching to desktop
    var mq = window.matchMedia('(min-width: 1024px)');
    var onMq = function () { if (mq.matches && menu.isOpen) menu.close({ restoreFocus: false }); };
    if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq);
  });

  /* ---------- Quote + Contact drawers (one open at a time) ---------- */
  var drawers = {};
  safe('drawers', function () {
    function validate(input) {
      var v = input.value.trim();
      var label = input.name;
      if (input.required && !v) {
        return {
          name: 'Please enter your name.',
          phone: 'Please enter a phone number so we can call you back.',
          email: 'Please enter your email address.',
          message: 'Please tell us how we can help.'
        }[label] || 'This field is required.';
      }
      if (!v) return '';
      if (label === 'name' && v.length < 2) return 'Please enter your name.';
      if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Please enter a valid email address.';
      if (input.type === 'tel' && !(v.replace(/[^\d]/g, '').length >= 8 && /^[+\d\s()-]+$/.test(v))) return 'Please enter a valid phone number.';
      return '';
    }
    function check(input) {
      var msg = validate(input);
      var field = input.closest('.field');
      var err = doc.getElementById(input.id + '-err');
      if (field) field.classList.toggle('has-error', !!msg);
      if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
      if (err) err.textContent = msg;
      return !msg;
    }

    function build(id, formId) {
      var el = doc.getElementById(id);
      if (!el) return null;
      var form = doc.getElementById(formId);
      var view = $('[data-view="form"]', el);
      var success = $('[data-view="success"]', el);
      var service = $('select[name="service"]', el);
      var autoCloseTimer = null;
      var ov = new Overlay(el, { panel: '.drawer__panel', close: '[data-drawer-close]' });

      function reset() {
        clearTimeout(autoCloseTimer); autoCloseTimer = null;
        if (view) view.hidden = false;
        if (success) success.hidden = true;
        if (!form) return;
        $$('.field', form).forEach(function (f) { f.classList.remove('has-error'); });
        $$('.field__err', form).forEach(function (p) { p.textContent = ''; });
        $$('[aria-invalid]', form).forEach(function (i) { i.removeAttribute('aria-invalid'); });
        var btn = $('button[type="submit"]', form);
        if (btn) btn.disabled = false;
      }

      if (form) {
        var fields = $$('input, textarea', form);
        fields.forEach(function (i) {
          i.addEventListener('blur', function () { if (i.value || (i.closest('.field') && i.closest('.field').classList.contains('has-error'))) check(i); });
          i.addEventListener('input', function () { if (i.closest('.field') && i.closest('.field').classList.contains('has-error')) check(i); });
        });
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var firstBad = null;
          fields.forEach(function (i) { if (!check(i) && !firstBad) firstBad = i; });
          if (firstBad) { firstBad.focus(); return; }
          var btn = $('button[type="submit"]', form);
          if (btn) btn.disabled = true;
          // front-end only (no backend yet): show the confirmation
          if (view) view.hidden = true;
          if (success) { success.hidden = false; try { success.focus({ preventScroll: true }); } catch (err) { success.focus(); } }
          form.reset();
          clearTimeout(autoCloseTimer);
          autoCloseTimer = setTimeout(function () { if (ov.isOpen) ov.close(); }, 6000);
        });
      }

      return {
        ov: ov,
        open: function (trigger, svc) {
          clearTimeout(autoCloseTimer); autoCloseTimer = null;
          if (success && !success.hidden) reset();
          if (svc && service) {
            $$('option', service).forEach(function (o) { if (o.value === svc || o.textContent === svc) service.value = o.value; });
          }
          ov.open(trigger);
        }
      };
    }

    drawers.quote = build('quote', 'quoteForm');
    drawers.contact = build('contact-us', 'contactForm');

    function openDrawer(kind, trigger) {
      var d = drawers[kind];
      if (!d) return;
      var returnTo = trigger;
      if (menu && menu.isOpen) { menu.close({ restoreFocus: false }); returnTo = menuBtn; }
      Object.keys(drawers).forEach(function (k) {
        var o = drawers[k];
        if (o && k !== kind && o.ov.isOpen) {
          // swap: keep the original trigger as the focus-return target
          if (o.ov.returnTo) returnTo = o.ov.returnTo;
          o.ov.close({ restoreFocus: false, instant: true });
        }
      });
      d.open(returnTo, trigger && trigger.getAttribute('data-service'));
    }

    doc.addEventListener('click', function (e) {
      if (!e.target.closest) return;
      var t = e.target.closest('[data-quote], [data-contact]');
      if (!t) return;
      e.preventDefault();
      openDrawer(t.hasAttribute('data-quote') ? 'quote' : 'contact', t);
    });
  });

  /* ---------- header: stuck state + scroll-spy ---------- */
  safe('spy', function () {
    var hdr = $('#hdr');
    var spyEls = $$('[data-spy]');
    var ids = [];
    $$('.nav [data-spy]').forEach(function (a) { var id = a.getAttribute('data-spy'); if (ids.indexOf(id) < 0) ids.push(id); });
    var sections = ids.map(function (id) { return doc.getElementById(id); }).filter(Boolean);
    var current = null;

    function setActive(id) {
      if (id === current) return;
      current = id;
      spyEls.forEach(function (a) {
        var on = a.getAttribute('data-spy') === id;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    }
    function run() {
      ticking = false;
      if (hdr) hdr.classList.toggle('is-stuck', hdr.getBoundingClientRect().top <= 0 && window.scrollY > 40);
      var offset = (hdr ? hdr.offsetHeight : 72) + window.innerHeight * 0.25;
      var active = sections.length ? sections[0].id : null;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top - offset <= 0) active = sections[i].id;
      }
      // bottom of page: last section that is visible
      if ((window.innerHeight + window.scrollY) >= doc.documentElement.scrollHeight - 4 && sections.length) {
        var last = sections[sections.length - 1];
        if (last.getBoundingClientRect().top < window.innerHeight) active = last.id;
      }
      setActive(active);
    }
    var ticking = false;
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
    window.addEventListener('resize', run, { passive: true });
    run();
  });

  /* ---------- placeholder links (social URLs not supplied yet) ---------- */
  safe('placeholders', function () {
    $$('a[data-placeholder]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });
  });

  /* ---------- FAQ accordion ---------- */
  safe('accordion', function () {
    var btns = $$('.acc__btn');
    function set(btn, open) {
      var panel = doc.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (panel) {
        panel.classList.toggle('is-collapsed', !open);
        if (open) panel.removeAttribute('inert'); else panel.setAttribute('inert', '');
      }
    }
    // progressive enhancement: everything is open in HTML; collapse all but the first
    btns.forEach(function (b, i) { set(b, i === 0); });
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var open = b.getAttribute('aria-expanded') !== 'true';
        btns.forEach(function (o) { if (o !== b) set(o, false); });
        set(b, open);
      });
    });
  });

  /* ---------- lazy Google map ---------- */
  safe('map', function () {
    var btn = $('#mapLoad');
    var canvas = $('#mapCanvas');
    if (!btn || !canvas) return;
    btn.addEventListener('click', function () {
      if ($('iframe', canvas)) return;
      var f = doc.createElement('iframe');
      f.title = 'Flowise Plumbing location — 4 Terry Rd, Box Hill NSW';
      f.src = 'https://www.google.com/maps?q=4+Terry+Rd,+Box+Hill+NSW+2765&output=embed';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      canvas.appendChild(f);
      btn.disabled = true;
      $('span', btn).textContent = 'Map loaded';
    });
  });

  /* ---------- libraries: deferred, so wait for DOMContentLoaded ---------- */
  function initLibs() {
    /* ---------- Sliders: infinite loop + accessible autoplay ---------- */
    var sliders = [];

    // Duplicate slides so Swiper's loop always has enough to work with.
    // Clones are hidden from AT, removed from tab order and carry no ids.
    function cloneSlides(wrapper, times) {
      var originals = $$('.swiper-slide', wrapper);
      originals.forEach(function (s, i) { s.setAttribute('data-real', i); });
      for (var t = 0; t < times; t++) {
        originals.forEach(function (s, i) {
          var c = s.cloneNode(true);
          c.setAttribute('aria-hidden', 'true');
          c.setAttribute('data-clone', '');
          c.setAttribute('data-real', i);
          c.removeAttribute('id');
          $$('[id]', c).forEach(function (n) { n.removeAttribute('id'); });
          $$('a, button, [tabindex]', c).forEach(function (n) { n.setAttribute('tabindex', '-1'); });
          $$('[data-fancybox]', c).forEach(function (n) { n.setAttribute('data-clone-of', i); n.removeAttribute('data-fancybox'); });
          wrapper.appendChild(c);
        });
      }
      return originals.length;
    }

    function makeSlider(key, el, opts, realCount) {
      if (!el || typeof window.Swiper !== 'function') return null;
      var toggle = $('[data-autoplay-toggle="' + key + '"]');
      var label = toggle ? toggle.getAttribute('aria-label').replace(/^Pause /, '') : '';
      var state = { key: key, el: el, toggle: toggle, userPaused: reduce(), focus: false, offscreen: false, swiper: null, realCount: realCount };
      opts.loop = true;
      opts.rewind = false;
      opts.autoplay = { delay: opts.delay, disableOnInteraction: false, pauseOnMouseEnter: true };
      delete opts.delay;
      state.swiper = new window.Swiper(el, opts);
      if (state.userPaused) state.swiper.autoplay.stop();

      function syncToggle() {
        if (!toggle) return;
        toggle.classList.add('is-ready');
        toggle.classList.toggle('is-paused', state.userPaused);
        toggle.setAttribute('aria-label', (state.userPaused ? 'Play ' : 'Pause ') + label);
      }
      state.update = function () {
        var sw = state.swiper;
        if (!sw || sw.destroyed) return;
        var blocked = state.userPaused || state.focus || state.offscreen || doc.hidden ||
          root.classList.contains('is-locked') || root.classList.contains('with-fancybox') || !!$('.fancybox__container');
        if (blocked) { if (sw.autoplay.running) sw.autoplay.stop(); }
        else if (!sw.autoplay.running) sw.autoplay.start();
      };
      if (toggle) {
        toggle.addEventListener('click', function () {
          state.userPaused = !state.userPaused;
          syncToggle();
          state.update();
        });
      }
      el.addEventListener('focusin', function () { state.focus = true; state.update(); });
      el.addEventListener('focusout', function (e) { if (!el.contains(e.relatedTarget)) { state.focus = false; state.update(); } });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          state.offscreen = !entries[0].isIntersecting;
          state.update();
        }, { threshold: 0.05 }).observe(el);
      }
      syncToggle();
      state.update();
      sliders.push(state);
      el.__flowise = state;
      return state;
    }

    function updateAll() { sliders.forEach(function (s) { try { s.update(); } catch (e) { /* ignore */ } }); }
    doc.addEventListener('visibilitychange', updateAll);
    // drawers + menu lock <html>; Fancybox adds .with-fancybox — watch both
    if ('MutationObserver' in window) {
      new MutationObserver(updateAll).observe(root, { attributes: true, attributeFilter: ['class'] });
      new MutationObserver(updateAll).observe(doc.body, { childList: true });
    }

    /* Work rail: stepped loop (10 projects, duplicated once so wide screens never run short) */
    safe('swiper-work', function () {
      if (typeof window.Swiper !== 'function') return;
      var el = $('.work-swiper');
      if (!el) return;
      var real = cloneSlides($('.swiper-wrapper', el), 1);
      // clones open the matching original in the lightbox
      el.addEventListener('click', function (e) {
        var c = e.target.closest && e.target.closest('[data-clone-of]');
        if (!c) return;
        e.preventDefault();
        var orig = $$('.work-item__link[data-fancybox="work"]', el)[+c.getAttribute('data-clone-of')];
        if (orig) orig.click();
      });
      makeSlider('work', el, {
        slidesPerView: 'auto',
        spaceBetween: 0,
        speed: reduce() ? 0 : 900,
        delay: 3800,
        grabCursor: true,
        loopAdditionalSlides: 2,
        keyboard: { enabled: true, onlyInViewport: true },
        a11y: { enabled: true, prevSlideMessage: 'Previous project', nextSlideMessage: 'Next project', slideLabelMessage: null },
        navigation: { prevEl: '#workPrev', nextEl: '#workNext' }
      }, real);
    });

    /* Reviews: one large quote at a time; 3 reviews duplicated once for a seamless loop */
    safe('swiper-reviews', function () {
      if (typeof window.Swiper !== 'function') return;
      var el = $('.rev-swiper');
      if (!el) return;
      var real = cloneSlides($('.swiper-wrapper', el), 1);
      $$('.swiper-slide:not([data-clone])', el).forEach(function (s, i) { s.setAttribute('aria-label', 'Review ' + (i + 1) + ' of ' + real); });
      var pag = $('#revPag');
      var renderPag = function (sw) {
        if (!pag) return;
        var n = (sw.realIndex % real) + 1;
        pag.innerHTML = '<span class="swiper-pagination-current">' + n + '</span> / <span class="swiper-pagination-total">' + real + '</span>';
      };
      makeSlider('reviews', el, {
        slidesPerView: 1,
        spaceBetween: 24,
        speed: reduce() ? 0 : 900,
        delay: 5000,
        grabCursor: true,
        keyboard: { enabled: true, onlyInViewport: true },
        a11y: { enabled: true, prevSlideMessage: 'Previous review', nextSlideMessage: 'Next review', slideLabelMessage: null },
        navigation: { prevEl: '#revPrev', nextEl: '#revNext' },
        on: { init: renderPag, slideChange: renderPag, realIndexChange: renderPag }
      }, real);
      if (pag) pag.setAttribute('aria-live', 'off');
    });

    /* Fancybox lightbox */
    safe('fancybox', function () {
      if (!window.Fancybox) return;
      window.Fancybox.bind('[data-fancybox="work"]', {
        Hash: false,
        groupAll: false,
        Images: { zoom: true },
        Carousel: { transition: reduce() ? false : 'slide' }
      });
    });

    /* GSAP reveals — only once GSAP + ScrollTrigger are confirmed */
    safe('gsap', function () {
      var gsap = window.gsap, ST = window.ScrollTrigger;
      if (!gsap || !ST || reduce()) return;
      gsap.registerPlugin(ST);
      root.classList.add('has-motion');

      var hero = $$('[data-hero]');
      gsap.fromTo(hero, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.09, delay: 0.05, clearProps: 'transform' });

      var items = $$('[data-reveal]');
      // anything already above the fold stays visible; only hide what is below
      var below = items.filter(function (el) { return el.getBoundingClientRect().top > window.innerHeight * 0.92; });
      gsap.set(below, { autoAlpha: 0, y: 32 });
      ST.batch(below, {
        start: 'top 90%',
        once: true,
        onEnter: function (batch) {
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.95, ease: 'power3.out', stagger: 0.08, overwrite: true, clearProps: 'transform' });
        }
      });

      // subtle hero parallax
      var heroImg = $('.hero__photo img');
      if (heroImg) {
        gsap.fromTo(heroImg, { scale: 1.06 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 } });
      }

      // safety net: at the bottom of the page, or after a while, reveal anything still hidden
      var sweep = function () {
        below.forEach(function (el) {
          if (getComputedStyle(el).visibility === 'hidden' && el.getBoundingClientRect().top < window.innerHeight) {
            gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.6, overwrite: true });
          }
        });
      };
      window.addEventListener('scroll', function () {
        if (window.innerHeight + window.scrollY >= doc.documentElement.scrollHeight - 40) sweep();
      }, { passive: true });
      window.addEventListener('load', function () { ST.refresh(); setTimeout(sweep, 2500); });
    });
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', function () { safe('libs', initLibs); });
  else safe('libs', initLibs);
})();
