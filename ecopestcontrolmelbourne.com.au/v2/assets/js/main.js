/* ─────────────────────────────────────────────────────────────
   Eco Pest Control Melbourne — V2 main.js
   Designed & developed by
   Biplab Kumar Paul — Web Designer & Developer
   Mobile: 01735 927356 · Email: biplab.cse.85@gmail.com
   ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function trapFocus(container, e) {
    if (e.key !== 'Tab') return;
    var items = $$(FOCUSABLE, container).filter(function (el) { return el.offsetParent !== null; });
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  var lockCount = 0;
  function lockScroll(on) {
    lockCount = Math.max(0, lockCount + (on ? 1 : -1));
    document.body.classList.toggle('is-locked', lockCount > 0);
  }

  /* ── Header state ─────────────────────────────────────────── */
  function initHeader() {
    var header = $('#header');
    if (!header) return;
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Desktop dropdowns (click + hover + keyboard) ─────────── */
  function initDropdowns() {
    var drops = $$('.nav__drop');
    var hoverable = window.matchMedia('(hover: hover) and (pointer: fine)');
    var setOpen = function (drop, open) {
      drop.classList.toggle('is-open', open);
      $('.nav__trigger', drop).setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    var closeAll = function (except) { drops.forEach(function (d) { if (d !== except) setOpen(d, false); }); };

    drops.forEach(function (drop) {
      var trigger = $('.nav__trigger', drop);
      var timer;
      trigger.addEventListener('click', function () {
        var open = !drop.classList.contains('is-open');
        closeAll(drop);
        setOpen(drop, open);
      });
      drop.addEventListener('mouseenter', function () {
        if (!hoverable.matches) return;
        clearTimeout(timer); closeAll(drop); setOpen(drop, true);
      });
      drop.addEventListener('mouseleave', function () {
        if (!hoverable.matches) return;
        timer = setTimeout(function () { setOpen(drop, false); }, 140);
      });
      drop.addEventListener('focusout', function (e) {
        if (!drop.contains(e.relatedTarget)) setOpen(drop, false);
      });
      $$('.nav__panel a', drop).forEach(function (a) {
        a.addEventListener('click', function () { setOpen(drop, false); });
      });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav__drop')) closeAll();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var open = drops.filter(function (d) { return d.classList.contains('is-open'); })[0];
      if (open) { setOpen(open, false); $('.nav__trigger', open).focus(); }
    });
  }

  /* ── Bottom-sheet menu ────────────────────────────────────── */
  var sheetApi = { close: function () {} };
  function initSheet() {
    var sheet = $('#menuSheet');
    var btn = $('#menuOpen');
    if (!sheet || !btn) return;
    var lastFocus = null;
    var isOpen = false;

    var open = function () {
      if (isOpen) return;
      isOpen = true;
      lastFocus = document.activeElement;
      sheet.hidden = false;
      // force reflow so the transition runs
      void sheet.offsetWidth;
      sheet.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      lockScroll(true);
      setTimeout(function () { var c = $('[data-sheet-close].icon-btn', sheet); if (c) c.focus({ preventScroll: true }); }, 60);
    };
    var close = function (restore) {
      if (!isOpen) return;
      isOpen = false;
      sheet.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      lockScroll(false);
      setTimeout(function () { if (!isOpen) sheet.hidden = true; }, reduceMotion ? 0 : 400);
      if (restore !== false && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    };
    sheetApi.close = close;

    btn.addEventListener('click', open);
    $$('[data-sheet-close]', sheet).forEach(function (el) { el.addEventListener('click', function () { close(); }); });
    $$('a', sheet).forEach(function (a) {
      a.addEventListener('click', function () { close(false); });
    });
    sheet.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      trapFocus($('.sheet__panel', sheet), e);
    });
  }

  /* ── Drawers: Quote (#quote) and Contact (#contact-us) ────── */
  function initDrawers() {
    var drawers = {};
    var current = null;      // key of the open drawer
    var returnFocus = null;  // trigger to restore focus to when the last drawer closes

    var preselect = function (form, trigger) {
      if (!form || !trigger) return;
      var pick = function (select, text) {
        if (!select || !text) return;
        Array.prototype.forEach.call(select.options, function (o) { if (o.text === text) select.value = o.value; });
      };
      pick($('[name="service"]', form), trigger.getAttribute('data-service'));
      pick($('[name="pest"]', form), trigger.getAttribute('data-pest'));
      var type = trigger.getAttribute('data-type');
      if (type) {
        var box = $('input[name="type"][value="' + type + '"]', form);
        if (box) box.checked = true;
      }
    };

    var hide = function (key, instant) {
      var d = drawers[key];
      d.el.classList.remove('is-open');
      var done = function () { if (current !== key) d.el.hidden = true; };
      if (instant || reduceMotion) done(); else setTimeout(done, 460);
    };

    var open = function (key, trigger) {
      var d = drawers[key];
      if (!d) return;
      if (current === key) return;
      if (current) {
        // swap: close the other drawer instantly, keep the original focus target and scroll lock
        var prev = current;
        current = null;
        hide(prev, true);
      } else {
        returnFocus = trigger && trigger.closest('#menuSheet') ? $('#menuOpen') : (trigger || document.activeElement);
        lockScroll(true);
      }
      current = key;
      preselect(d.form, trigger);
      d.el.hidden = false;
      void d.el.offsetWidth;
      d.el.classList.add('is-open');
      setTimeout(function () { var c = $('[data-drawer-close].icon-btn', d.el); if (c) c.focus({ preventScroll: true }); }, 60);
    };

    var close = function () {
      if (!current) return;
      var key = current;
      current = null;
      hide(key);
      lockScroll(false);
      if (returnFocus && returnFocus.focus && returnFocus.offsetParent !== null) returnFocus.focus({ preventScroll: true });
    };

    [['quote', '#quote'], ['contact', '#contact-us']].forEach(function (pair) {
      var el = $(pair[1]);
      if (!el) return;
      drawers[pair[0]] = { el: el, panel: $('.drawer__panel', el), form: $('form', el) };
      $$('[data-drawer-close]', el).forEach(function (c) { c.addEventListener('click', close); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { e.stopPropagation(); close(); }
        trapFocus(drawers[pair[0]].panel, e);
      });
    });

    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-quote], [data-contact]');
      if (!t) return;
      e.preventDefault();
      sheetApi.close(false);
      open(t.hasAttribute('data-contact') ? 'contact' : 'quote', t);
    });
  }

  /* ── Termite tabs (WAI-ARIA tabs pattern) ─────────────────── */
  var termiteApi = { select: function () {} };
  function initTabs() {
    var tabs = $$('.termite__tabs [role="tab"]');
    if (!tabs.length) return;
    var select = function (i, focus) {
      tabs.forEach(function (t, k) {
        var on = k === i;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        if (on && panel.hidden) {
          panel.hidden = false;
          panel.classList.remove('is-entering'); void panel.offsetWidth; panel.classList.add('is-entering');
        } else if (!on) {
          panel.hidden = true;
        }
      });
      if (focus) tabs[i].focus();
      // keep the selected chip visible in the horizontal mobile strip
      var strip = tabs[i].parentElement;
      if (strip.scrollWidth > strip.clientWidth) {
        strip.scrollTo({ left: tabs[i].offsetLeft - 16, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    };
    termiteApi.select = select;
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        var n = tabs.length, k = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') k = (i + 1) % n;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') k = (i - 1 + n) % n;
        else if (e.key === 'Home') k = 0;
        else if (e.key === 'End') k = n - 1;
        if (k !== null) { e.preventDefault(); select(k, true); }
      });
    });
    $$('[data-termite-tab]').forEach(function (a) {
      a.addEventListener('click', function () { select(parseInt(a.getAttribute('data-termite-tab'), 10) || 0); });
    });
  }

  /* ── FAQ accordion ────────────────────────────────────────── */
  function initAccordion() {
    var items = $$('#faqAccordion .acc');
    if (!items.length) return;
    var animate = function (panel, opening) {
      if (reduceMotion || !panel.animate) { panel.hidden = !opening; return; }
      if (opening) panel.hidden = false;
      var h = panel.scrollHeight;
      var anim = panel.animate(
        opening ? [{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }] : [{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }],
        { duration: 320, easing: 'cubic-bezier(.22,.8,.24,1)' }
      );
      if (!opening) anim.onfinish = function () { panel.hidden = true; };
    };
    var set = function (item, open) {
      var btn = $('.acc__btn', item), panel = $('.acc__panel', item);
      var was = btn.getAttribute('aria-expanded') === 'true';
      if (was === open) return;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      item.classList.toggle('is-open', open);
      animate(panel, open);
    };
    items.forEach(function (item) {
      if ($('.acc__btn', item).getAttribute('aria-expanded') === 'true') item.classList.add('is-open');
      $('.acc__btn', item).addEventListener('click', function () {
        var open = $('.acc__btn', item).getAttribute('aria-expanded') !== 'true';
        items.forEach(function (o) { if (o !== item) set(o, false); });
        set(item, open);
      });
    });
  }

  /* ── Forms (demo validation + feedback) ───────────────────── */
  function initForms() {
    ['#quoteForm', '#contactForm'].forEach(function (sel) {
      var form = $(sel);
      if (!form) return;
      var status = $('.form-status', form);
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var firstBad = null;
        $$('[required]', form).forEach(function (f) {
          var ok = f.checkValidity();
          f.classList.toggle('is-invalid', !ok);
          f.setAttribute('aria-invalid', ok ? 'false' : 'true');
          if (!ok && !firstBad) firstBad = f;
        });
        if (firstBad) {
          status.textContent = 'Please complete the highlighted fields.';
          status.classList.add('is-error');
          firstBad.focus();
          return;
        }
        status.classList.remove('is-error');
        status.textContent = form.getAttribute('data-success');
        form.reset();
      });
      form.addEventListener('input', function (e) {
        if (e.target.classList.contains('is-invalid') && e.target.checkValidity()) {
          e.target.classList.remove('is-invalid');
          e.target.setAttribute('aria-invalid', 'false');
        }
      });
    });
  }

  /* ── Footer columns: collapsible on mobile only ────────────── */
  function initFooter() {
    var cols = $$('.footer__col');
    var mq = window.matchMedia('(min-width: 768px)');
    var apply = function () { cols.forEach(function (c) { c.open = mq.matches; }); };
    apply();
    if (mq.addEventListener) mq.addEventListener('change', apply);
    cols.forEach(function (c) {
      $('summary', c).addEventListener('click', function (e) { if (mq.matches) e.preventDefault(); });
    });
  }

  /* ── Active-section highlighting (app bar, nav, sheet) ────── */
  function initScrollSpy() {
    var ids = ['top', 'welcome', 'services', 'termite', 'packages', 'why', 'reviews', 'faq', 'areas'];
    var sections = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var appGroup = { top: 'top', welcome: 'top', services: 'services', termite: 'services', packages: 'packages', why: 'packages', reviews: 'packages', faq: null, areas: null };
    var appItems = $$('.appbar [data-spy]');
    var navItems = $$('.nav [data-spy]');
    var sheetLinks = $$('.sheet__links [data-spy]');
    var svcTrigger = $('[aria-controls="drop-services"]');
    var pestTrigger = $('[aria-controls="drop-pests"]');
    var current = null;

    var update = function () {
      var line = window.innerHeight * 0.35;
      var active = sections[0];
      sections.forEach(function (s) { if (s.getBoundingClientRect().top <= line) active = s; });
      if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 4) active = sections[sections.length - 1];
      var id = active.id;
      if (id === current) return;
      current = id;
      appItems.forEach(function (a) {
        var on = a.getAttribute('data-spy') === appGroup[id];
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
      navItems.forEach(function (a) {
        var on = a.getAttribute('data-spy') === id;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
      [[svcTrigger, id === 'services' || id === 'termite'], [pestTrigger, false]].forEach(function (p) {
        if (!p[0]) return;
        p[0].classList.toggle('is-active', p[1]);
        if (p[1]) p[0].setAttribute('aria-current', 'location'); else p[0].removeAttribute('aria-current');
      });
      sheetLinks.forEach(function (a) {
        var on = a.getAttribute('data-spy') === id;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    };
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; update(); });
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ── Sliders (Swiper) — infinite loop + accessible autoplay ── */
  var sliderRegistry = [];

  // Duplicate slides so Swiper's loop always has enough (>= 2 × slidesPerView + 1).
  function padSlides(el, minCount) {
    var wrapper = $('.swiper-wrapper', el);
    var originals = $$(':scope > .swiper-slide', wrapper);
    var n = originals.length;
    if (!n || n >= minCount) return n;
    var copies = Math.ceil(minCount / n) - 1;
    for (var c = 0; c < copies; c++) {
      originals.forEach(function (s) {
        var clone = s.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.setAttribute('data-loop-clone', '');
        $$('[id]', clone).forEach(function (x) { x.removeAttribute('id'); });
        $$('a, button, input, select, textarea, [tabindex]', clone).forEach(function (x) { x.setAttribute('tabindex', '-1'); });
        wrapper.appendChild(clone);
      });
    }
    return n;
  }

  // Pagination dots that reflect the real slide (realIndex % original count).
  function buildDots(container, swiper, count, label) {
    if (!container) return;
    container.className += ' slider-dots';
    container.setAttribute('role', 'group');
    container.setAttribute('aria-label', label + ' pagination');
    var dots = [];
    for (var i = 0; i < count; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1) + ' of ' + count);
      (function (k) {
        b.addEventListener('click', function () {
          var cur = swiper.realIndex % count;
          var step = (k - cur + count) % count;
          swiper.slideToLoop(swiper.realIndex + step);
        });
      })(i);
      container.appendChild(b);
      dots.push(b);
    }
    var sync = function () {
      var r = swiper.realIndex % count;
      dots.forEach(function (d, k) { if (k === r) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
    };
    swiper.on('realIndexChange', sync);
    sync();
  }

  // Central autoplay controller: runs only when no pause reason is active.
  function makeController(swiper, el, toggle, name) {
    var reasons = {};
    var ctl = {
      name: name, swiper: swiper, el: el, reasons: reasons,
      set: function (reason, on) {
        if (on) reasons[reason] = true; else delete reasons[reason];
        ctl.apply();
      },
      apply: function () {
        if (!swiper.autoplay) return;
        var blocked = Object.keys(reasons).length > 0; // reduced motion seeds a 'user' pause
        if (blocked && swiper.autoplay.running) swiper.autoplay.stop();
        else if (!blocked && !swiper.autoplay.running) swiper.autoplay.start();
        el.classList.toggle('is-paused', blocked);
      }
    };
    if (reduceMotion) reasons.user = true; // never autoplay with reduced motion
    if (toggle) {
      var sync = function () {
        var paused = !!reasons.user;
        toggle.setAttribute('aria-pressed', paused ? 'true' : 'false');
        toggle.setAttribute('aria-label', (paused ? 'Play ' : 'Pause ') + name);
      };
      toggle.addEventListener('click', function () { ctl.set('user', !reasons.user); sync(); });
      sync();
    }
    // pause on keyboard focus inside the slider
    el.addEventListener('focusin', function (e) {
      var t = e.target;
      if (t.closest('[data-slider-toggle]')) return;
      var keyboard = true;
      try { keyboard = t.matches(':focus-visible'); } catch (err) { /* older browsers */ }
      if (keyboard) ctl.set('focus', true);
    });
    el.addEventListener('focusout', function (e) { if (!el.contains(e.relatedTarget)) ctl.set('focus', false); });
    // pause while off-screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { ctl.set('offscreen', !en.isIntersecting); });
      }, { threshold: 0.15 }).observe(el);
    }
    sliderRegistry.push(ctl);
    return ctl;
  }

  // Global pause reasons: hidden tab, open drawer / menu sheet (body.is-locked), Fancybox (html.with-fancybox)
  function watchGlobalPauses() {
    var check = function () {
      var overlay = document.body.classList.contains('is-locked') ||
        document.documentElement.classList.contains('with-fancybox') || !!document.querySelector('.fancybox__container');
      sliderRegistry.forEach(function (c) {
        c.set('overlay', overlay);
        c.set('hidden', document.hidden);
      });
    };
    document.addEventListener('visibilitychange', check);
    var mo = new MutationObserver(check);
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'], childList: true });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    check();
  }

  function initSliders() {
    if (typeof window.Swiper !== 'function') return;
    var autoplayFor = function (delay) {
      return { delay: delay, disableOnInteraction: false, pauseOnMouseEnter: true };
    };

    /* Hero — fade, 4 slides (enough for loop at 1 per view) */
    var heroEl = $('.hero-swiper');
    if (heroEl) {
      var heroDelay = 5000;
      heroEl.style.setProperty('--hero-delay', heroDelay + 'ms');
      var hero = new window.Swiper(heroEl, {
        effect: 'fade', fadeEffect: { crossFade: true }, loop: true, speed: 1000,
        autoplay: autoplayFor(heroDelay),
        pagination: { el: '.hero-swiper__pagination', clickable: true },
        a11y: { enabled: true, slideLabelMessage: 'Photo {{index}} of {{slidesLength}}', paginationBulletMessage: 'Show photo {{index}}' }
      });
      makeController(hero, heroEl, $('.slider-toggle--hero', heroEl), 'slideshow').apply();
    }

    /* Specialist treatments — step slider, 3 real slides padded to 9 (max 3 per view) */
    var svcEl = $('.svc-swiper');
    if (svcEl) {
      var svcCount = padSlides(svcEl, 7);
      var svc = new window.Swiper(svcEl, {
        loop: true, speed: 900, slidesPerView: 1.12, spaceBetween: 14, grabCursor: true,
        autoplay: autoplayFor(4000),
        navigation: { prevEl: '#svcPrev', nextEl: '#svcNext' },
        breakpoints: { 600: { slidesPerView: 2.1, spaceBetween: 16 }, 1024: { slidesPerView: 3, spaceBetween: 20 } },
        a11y: { enabled: true }
      });
      buildDots($('.svc-swiper__pagination'), svc, svcCount, 'Specialist treatments');
      makeController(svc, svcEl.closest('.specialist') || svcEl, $('.specialist [data-slider-toggle]'), 'specialist treatments slider').apply();
    }

    /* Reviews — step slider, 3 real slides padded to 6 (max 1.3 per view) */
    var revEl = $('.rev-swiper');
    if (revEl) {
      var revCount = padSlides(revEl, 5);
      var rev = new window.Swiper(revEl, {
        loop: true, speed: 900, slidesPerView: 1.06, spaceBetween: 14, grabCursor: true,
        autoplay: autoplayFor(5000),
        navigation: { prevEl: '#revPrev', nextEl: '#revNext' },
        breakpoints: { 640: { slidesPerView: 1.3, spaceBetween: 18 }, 1024: { slidesPerView: 1, spaceBetween: 24 } },
        a11y: { enabled: true }
      });
      buildDots($('.rev-swiper__pagination'), rev, revCount, 'Reviews');
      makeController(rev, revEl.closest('.reviews__grid') || revEl, $('.reviews [data-slider-toggle]'), 'reviews slider').apply();
    }

    watchGlobalPauses();
    window.__sliders = sliderRegistry; // exposed for QA tooling
  }

  /* ── Gallery (Fancybox) ───────────────────────────────────── */
  function initGallery() {
    if (!window.Fancybox) return;
    window.Fancybox.bind('[data-fancybox="field"]', {
      Hash: false,
      Thumbs: { type: 'classic' },
      Images: { zoom: true }
    });
  }

  /* ── Motion (GSAP + ScrollTrigger) — restrained reveals ───── */
  function initMotion() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (reduceMotion || !gsap || !ST) return;
    gsap.registerPlugin(ST);
    root.classList.add('anim-ready');
    var ease = 'power3.out';

    var tl = gsap.timeline({ defaults: { ease: ease } });
    tl.fromTo('[data-hero]', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .9, stagger: .08 })
      .fromTo('[data-hero-visual]', { opacity: 0, y: 30, scale: .97 }, { opacity: 1, y: 0, scale: 1, duration: 1.1 }, .15);

    gsap.set('[data-reveal]', { y: 28 });
    ST.batch('[data-reveal]', {
      start: 'top 88%', once: true,
      onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: .9, ease: ease, stagger: .1, overwrite: true }); }
    });

    $$('[data-stagger]').forEach(function (group) {
      var kids = group.children;
      gsap.set(kids, { y: 22 });
      ST.create({
        trigger: group, start: 'top 88%', once: true,
        onEnter: function () { gsap.to(kids, { opacity: 1, y: 0, duration: .75, ease: ease, stagger: .06, overwrite: true }); }
      });
    });

    // gentle drift on the hero photo frame
    gsap.to('.hero__frame', {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    window.addEventListener('load', function () { ST.refresh(); });
  }

  /* Fail-safe: never leave content hidden */
  function revealAll() {
    root.classList.remove('anim-ready');
    if (window.gsap) window.gsap.set('[data-reveal], [data-stagger] > *, [data-hero], [data-hero-visual]', { clearProps: 'opacity,transform' });
  }
  window.addEventListener('error', revealAll);

  /* ── Boot ─────────────────────────────────────────────────── */
  function boot() {
    [initHeader, initDropdowns, initSheet, initDrawers, initTabs, initAccordion, initForms, initFooter, initScrollSpy].forEach(function (fn) {
      try { fn(); } catch (err) { console.warn(fn.name + ' failed', err); }
    });
    try { initSliders(); } catch (err) { console.warn('Slider init failed', err); }
    try { initGallery(); } catch (err) { console.warn('Gallery init failed', err); }
    try { initMotion(); } catch (err) { revealAll(); console.warn('Motion init failed', err); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
