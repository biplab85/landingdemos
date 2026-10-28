/* Harrison Fencing & Carpentry — V2
   Progressive enhancement only: every section is visible without JS.
   Hidden pre-reveal states are applied only after GSAP + ScrollTrigger are
   confirmed loaded, and any error reveals everything. */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  /* ---------- Fail-safe reveal ---------- */
  function revealAll() {
    root.classList.add('reveal-all');
    try {
      if (window.gsap) {
        window.gsap.set('[data-reveal], [data-hero], [data-hero-media]', { clearProps: 'opacity,visibility,transform' });
      }
    } catch (e) { /* ignore */ }
  }
  window.addEventListener('error', revealAll);
  window.addEventListener('unhandledrejection', revealAll);

  function safe(name, fn) {
    try { fn(); } catch (err) {
      revealAll();
      if (window.console) console.warn('[harrison] ' + name + ' failed:', err);
    }
  }

  /* ---------- Scroll lock (shared by menu + drawer) ---------- */
  var lockCount = 0;
  var lockY = 0;
  function lockScroll() {
    if (lockCount++ > 0) return;
    lockY = window.scrollY || window.pageYOffset;
    var sbw = window.innerWidth - root.clientWidth;
    root.classList.add('is-locked');
    if (sbw > 0) doc.body.style.paddingRight = sbw + 'px';
  }
  function unlockScroll() {
    if (lockCount === 0) return;
    if (--lockCount > 0) return;
    root.classList.remove('is-locked');
    doc.body.style.paddingRight = '';
    if (Math.abs((window.scrollY || 0) - lockY) > 1) {
      var prev = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      window.scrollTo(0, lockY);
      root.style.scrollBehavior = prev;
    }
  }

  function trapFocus(container, e) {
    if (e.key !== 'Tab') return;
    var items = $$(FOCUSABLE, container).filter(function (el) { return el.offsetParent !== null || el === doc.activeElement; });
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function afterTransition(el, ms, cb) {
    var done = false;
    var finish = function () { if (done) return; done = true; el.removeEventListener('transitionend', onEnd); cb(); };
    var onEnd = function (ev) { if (ev.target === el) finish(); };
    el.addEventListener('transitionend', onEnd);
    setTimeout(finish, reduceMotion ? 0 : ms);
  }

  /* ---------- Header state ---------- */
  safe('header', function () {
    var header = $('[data-header]');
    if (!header) return;
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  });

  /* ---------- Mobile menu ---------- */
  var menu = {
    el: $('[data-menu]'),
    trigger: null,
    isOpen: false,
    open: function (trigger) {
      if (!this.el || this.isOpen) return;
      this.trigger = trigger || $('[data-menu-open]');
      this.isOpen = true;
      this.el.hidden = false;
      lockScroll();
      var self = this;
      requestAnimationFrame(function () { requestAnimationFrame(function () { self.el.classList.add('is-open'); }); });
      $$('[data-menu-open]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
      var closeBtn = $('[data-menu-close].icon-btn', this.el);
      setTimeout(function () { if (closeBtn) closeBtn.focus({ preventScroll: true }); }, 30);
    },
    close: function (opts) {
      if (!this.el || !this.isOpen) return;
      opts = opts || {};
      this.isOpen = false;
      var el = this.el;
      el.classList.remove('is-open');
      $$('[data-menu-open]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
      var panel = $('.menu__panel', el);
      if (opts.instant) { el.hidden = true; } else { afterTransition(panel, 450, function () { if (!menu.isOpen) el.hidden = true; }); }
      unlockScroll();
      if (opts.returnFocus !== false && this.trigger) this.trigger.focus({ preventScroll: true });
    }
  };

  safe('menu', function () {
    if (!menu.el) return;
    $$('[data-menu-open]').forEach(function (btn) {
      btn.addEventListener('click', function () { menu.open(btn); });
    });
    $$('[data-menu-close]', menu.el).forEach(function (btn) {
      btn.addEventListener('click', function () { menu.close(); });
    });
    menu.el.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); menu.close(); }
      trapFocus($('.menu__panel', menu.el), e);
    });
    // Section links: close then scroll
    $$('.menu__link:not([data-contact]):not([data-quote])', menu.el).forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        var target = id && id.charAt(0) === '#' ? $(id) : null;
        if (!target) return;
        e.preventDefault();
        menu.close({ instant: true, returnFocus: false });
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        history.replaceState(null, '', id);
      });
    });
    window.addEventListener('resize', function () {
      if (menu.isOpen && window.innerWidth >= 1024) menu.close({ instant: true, returnFocus: false });
    });
  });

  /* ---------- Drawers: quote + contact (one open at a time) ---------- */
  var drawers = {};
  var activeDrawer = null;

  function setSelect(select, value) {
    if (!select) return;
    for (var i = 0; i < select.options.length; i++) {
      if (select.options[i].value === value) { select.selectedIndex = i; clearFieldError(select); return; }
    }
  }

  function makeDrawer(el) {
    var d = {
      el: el,
      name: el.getAttribute('data-drawer'),
      panel: $('.drawer__panel', el),
      form: $('[data-form]', el),
      view: $('[data-view]', el),
      success: $('[data-success]', el),
      trigger: null,
      isOpen: false,
      timer: null
    };

    function applyPreselect(trigger) {
      if (!trigger || !d.form) return;
      var svc = trigger.getAttribute('data-service');
      var br = trigger.getAttribute('data-branch');
      if (svc) setSelect(d.form.elements.service, svc);
      if (br) setSelect(d.form.elements.branch, br);
    }

    d.open = function (trigger) {
      clearTimeout(d.timer); d.timer = null;
      if (d.isOpen) { applyPreselect(trigger); return; }
      if (menu.isOpen) menu.close({ instant: true, returnFocus: false });
      var swapping = false;
      if (activeDrawer && activeDrawer !== d) {
        // Swap cleanly: keep the scroll lock and hand over the original page trigger
        var prevTrigger = activeDrawer.trigger;
        activeDrawer.close({ instant: true, keepLock: true, returnFocus: false });
        if (trigger && trigger.closest('[data-drawer]')) trigger = prevTrigger || null;
        swapping = true;
      }
      d.trigger = trigger || null;
      d.isOpen = true;
      activeDrawer = d;
      if (d.success && !d.success.hidden) { d.success.hidden = true; d.view.hidden = false; if (d.form) resetForm(d.form); }
      applyPreselect(trigger);
      el.hidden = false;
      if (!swapping) lockScroll();
      requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('is-open'); }); });
      var scroller = $('.drawer__scroll', el);
      if (scroller) scroller.scrollTop = 0;
      var closeBtn = $('.drawer__bar [data-drawer-close]', el);
      setTimeout(function () { if (closeBtn && d.isOpen) closeBtn.focus({ preventScroll: true }); }, 30);
    };

    d.close = function (opts) {
      if (!d.isOpen) return;
      opts = opts || {};
      clearTimeout(d.timer); d.timer = null;
      d.isOpen = false;
      if (activeDrawer === d) activeDrawer = null;
      el.classList.remove('is-open');
      if (opts.instant) el.hidden = true;
      else afterTransition(d.panel, 500, function () { if (!d.isOpen) el.hidden = true; });
      if (!opts.keepLock) unlockScroll();
      if (opts.returnFocus === false) return;
      var t = d.trigger;
      if (t && menu.el && menu.el.contains(t)) t = $('[data-menu-open]');
      if (t && doc.contains(t) && t.offsetParent !== null) t.focus({ preventScroll: true });
    };

    return d;
  }

  safe('drawers', function () {
    $$('[data-drawer]').forEach(function (el) {
      var d = makeDrawer(el);
      drawers[d.name] = d;
      $$('[data-drawer-close]', el).forEach(function (btn) { btn.addEventListener('click', function () { d.close(); }); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { e.preventDefault(); d.close(); }
        trapFocus(d.panel, e);
      });
      if (d.form) initForm(d);
    });
    doc.addEventListener('click', function (e) {
      if (!e.target.closest) return;
      var t = e.target.closest('[data-quote], [data-contact]');
      if (!t) return;
      var d = t.hasAttribute('data-quote') ? drawers.quote : drawers.contact;
      if (!d) return;
      e.preventDefault();
      d.open(t);
    });
  });

  /* ---------- Form validation (each form independent) ---------- */
  function fieldOf(input) { return input.closest('.field'); }
  function clearFieldError(input) {
    var f = fieldOf(input);
    if (f) f.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
  }
  function validateInput(input) {
    var v = (input.value || '').trim();
    var ok = true;
    if (input.required && !v) ok = false;
    if (ok && input.type === 'email' && v) ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    if (ok && input.type === 'tel' && v) ok = v.replace(/[^\d]/g, '').length >= 8;
    var f = fieldOf(input);
    if (f) f.classList.toggle('is-invalid', !ok);
    if (ok) input.removeAttribute('aria-invalid'); else input.setAttribute('aria-invalid', 'true');
    return ok;
  }
  function resetForm(form) {
    form.reset();
    $$('.field.is-invalid', form).forEach(function (f) { f.classList.remove('is-invalid'); });
    $$('[aria-invalid]', form).forEach(function (i) { i.removeAttribute('aria-invalid'); });
  }
  function initForm(d) {
    var form = d.form;
    var inputs = $$('input, select, textarea', form).filter(function (el) { return el.name; });
    inputs.forEach(function (input) {
      var f = fieldOf(input);
      input.addEventListener('blur', function () { if (input.value || (f && f.classList.contains('is-invalid'))) validateInput(input); });
      input.addEventListener('input', function () { if (f && f.classList.contains('is-invalid')) validateInput(input); });
      input.addEventListener('change', function () { if (input.tagName === 'SELECT') validateInput(input); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      inputs.forEach(function (input) { if (!validateInput(input) && !firstBad) firstBad = input; });
      if (firstBad) { firstBad.focus(); return; }
      var name = (form.elements.name.value || '').trim().split(/\s+/)[0] || 'there';
      var nameEl = $('[data-success-name]', d.el);
      if (nameEl) nameEl.textContent = name;
      d.view.hidden = true;
      d.success.hidden = false;
      d.success.focus({ preventScroll: true });
      clearTimeout(d.timer);
      d.timer = setTimeout(function () { d.close(); }, 9000);
    });
  }

  /* ---------- Scroll-spy (nav pills, menu tiles, app bar) ---------- */
  safe('scrollspy', function () {
    var ids = ['services', 'about', 'locations', 'work', 'reviews'];
    var sections = ids.map(function (id) { return doc.getElementById(id); }).filter(Boolean);
    var navLinks = $$('[data-spy]');
    var appItems = $$('[data-app]');
    var current = null;

    function setActive(id) {
      if (id === current) return;
      current = id;
      navLinks.forEach(function (a) {
        var on = a.getAttribute('data-spy') === id;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
      var appId = id === 'services' || id === 'work' ? id : (id ? null : 'top');
      appItems.forEach(function (a) {
        var on = a.getAttribute('data-app') === appId;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    }

    var ticking = false;
    function compute() {
      ticking = false;
      var line = window.innerHeight * 0.35;
      var active = null;
      for (var i = 0; i < sections.length; i++) {
        var r = sections[i].getBoundingClientRect();
        if (r.top <= line) active = sections[i].id;
      }
      setActive(active);
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(compute); }
    }, { passive: true });
    window.addEventListener('resize', compute);
    compute();
  });

  /* ---------- Services preview (desktop) ---------- */
  safe('services', function () {
    var items = $$('.svc');
    var previews = $$('[data-preview]');
    if (!items.length || !previews.length) return;
    function show(key) {
      items.forEach(function (it) { it.classList.toggle('is-active', it.getAttribute('data-svc') === key); });
      previews.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-preview') === key); });
      var item = items.filter(function (it) { return it.getAttribute('data-svc') === key; })[0];
      var numEl = $('[data-preview-num]'), nameEl = $('[data-preview-name]');
      if (item && numEl) numEl.textContent = $('.svc__num', item).textContent;
      if (item && nameEl) nameEl.textContent = $('.svc__title', item).firstChild.textContent.trim();
    }
    items.forEach(function (it) {
      var key = it.getAttribute('data-svc');
      it.addEventListener('mouseenter', function () { show(key); });
      it.addEventListener('focusin', function () { show(key); });
    });
    show('colorbond');
    // Follow scroll on desktop so the image tracks the row in view
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (window.innerWidth < 1024) return;
        entries.forEach(function (en) { if (en.isIntersecting) show(en.target.getAttribute('data-svc')); });
      }, { rootMargin: '-45% 0px -50% 0px' });
      items.forEach(function (it) { io.observe(it); });
    }
  });

  /* ---------- Sliders: infinite loop + accessible autoplay ---------- */
  var sliders = [];

  // Pause reasons shared by every slider: overlays (drawers, menu, lightbox) and tab visibility
  var globalPause = { overlay: false, hidden: false };
  function refreshAll() { sliders.forEach(function (s) { s.refresh(); }); }

  function overlayOpen() {
    return !!(doc.querySelector('.drawer.is-open, .menu.is-open') || doc.querySelector('.fancybox__container'));
  }

  // Duplicate slides until the loop has enough (Swiper 11 needs >= slidesPerView * 2)
  function ensureLoopSlides(container, minCount) {
    var wrapper = $('.swiper-wrapper', container);
    var originals = $$('.swiper-slide', wrapper);
    var realCount = originals.length;
    if (!realCount) return 0;
    var i = 0;
    while (wrapper.children.length < minCount) {
      var src = originals[i % realCount];
      var clone = src.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('data-clone-of', String(i % realCount));
      $$('[id]', clone).forEach(function (el) { el.removeAttribute('id'); });
      $$('a, button, input, select, textarea, [tabindex]', clone).forEach(function (el) { el.setAttribute('tabindex', '-1'); });
      // Clones must not add duplicate entries to the lightbox gallery: they open the original instead
      $$('[data-fancybox]', clone).forEach(function (el) {
        el.removeAttribute('data-fancybox');
        el.setAttribute('data-fancybox-proxy', String(i % realCount));
      });
      wrapper.appendChild(clone);
      i++;
    }
    return realCount;
  }

  function makeSlider(opts) {
    var el = opts.el;
    var realCount = ensureLoopSlides(el, opts.minSlides);
    var toggle = opts.toggle;
    var state = { userPaused: false, focus: false, inView: true };
    var canAutoplay = !reduceMotion;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };

    var config = {
      loop: true,
      rewind: false,
      slidesPerView: opts.slidesPerView,
      spaceBetween: opts.spaceBetween,
      speed: reduceMotion ? 0 : opts.speed,
      grabCursor: true,
      watchSlidesProgress: true,
      keyboard: { enabled: true, onlyInViewport: true },
      a11y: opts.a11y,
      navigation: { prevEl: opts.prev, nextEl: opts.next },
      breakpoints: opts.breakpoints,
      on: {
        init: function (sw) { report(sw); },
        realIndexChange: function (sw) { report(sw); }
      }
    };
    if (canAutoplay) {
      config.autoplay = { delay: opts.delay, disableOnInteraction: false, pauseOnMouseEnter: true };
    }

    function report(sw) {
      var real = realCount ? sw.realIndex % realCount : 0;
      if (opts.onIndex) opts.onIndex(real, realCount, pad);
    }

    var swiper = new window.Swiper(el, config);

    var api = {
      swiper: swiper,
      el: el,
      realCount: realCount,
      state: state,
      refresh: function () {
        if (!canAutoplay || !swiper.autoplay) return;
        var shouldRun = !state.userPaused && !state.focus && state.inView && !globalPause.overlay && !globalPause.hidden;
        if (shouldRun && !swiper.autoplay.running) swiper.autoplay.start();
        else if (!shouldRun && swiper.autoplay.running) swiper.autoplay.stop();
      }
    };

    // Visible pause/play toggle (WCAG 2.2.2)
    if (toggle) {
      var label = toggle.getAttribute('aria-label').replace(/^Pause /, '');
      if (!canAutoplay) { toggle.hidden = true; }
      toggle.addEventListener('click', function () {
        state.userPaused = !state.userPaused;
        toggle.setAttribute('aria-pressed', state.userPaused ? 'true' : 'false');
        toggle.setAttribute('aria-label', (state.userPaused ? 'Play ' : 'Pause ') + label);
        api.refresh();
      });
    }

    // Pause while keyboard focus is inside the slider or its controls
    var zone = [el].concat(opts.controls ? [opts.controls] : []);
    zone.forEach(function (z) {
      z.addEventListener('focusin', function (e) {
        if (e.target === toggle) return; // the toggle itself controls play state
        var kb = true;
        try { kb = e.target.matches(':focus-visible'); } catch (err) { kb = true; }
        if (!kb) return; // pointer clicks on arrows shouldn't stop autoplay
        state.focus = true; api.refresh();
      });
      z.addEventListener('focusout', function (e) {
        var next = e.relatedTarget;
        if (next && zone.some(function (zz) { return zz.contains(next); }) && next !== toggle) return;
        state.focus = false; api.refresh();
      });
    });

    // Pause when off-screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { state.inView = en.isIntersecting; });
        api.refresh();
      }, { threshold: 0.15 }).observe(el);
    }

    // Lightbox proxy: clicking a cloned photo opens the original in the gallery
    el.addEventListener('click', function (e) {
      var proxy = e.target.closest ? e.target.closest('[data-fancybox-proxy]') : null;
      if (!proxy) return;
      e.preventDefault();
      var originals = $$('.swiper-slide:not([data-clone-of]) [data-fancybox]', el);
      var target = originals[parseInt(proxy.getAttribute('data-fancybox-proxy'), 10)];
      if (target) target.click();
    });

    api.refresh();
    sliders.push(api);
    return api;
  }

  safe('swiper', function () {
    if (typeof window.Swiper !== 'function') return;

    var workEl = $('.work-swiper');
    if (workEl) {
      var bar = $('[data-work-bar]');
      var count = $('[data-work-count]');
      var workBar = $('.work__bar');
      // Up to ~3.4 cards visible at 1440 => keep >= 10 slides for a seamless loop
      makeSlider({
        el: workEl,
        minSlides: 10,
        slidesPerView: 'auto',
        spaceBetween: 16,
        breakpoints: { 768: { spaceBetween: 24 } },
        speed: 900,
        delay: 4000,
        prev: '[data-work-prev]',
        next: '[data-work-next]',
        toggle: workBar ? $('[data-slider-toggle]', workBar) : null,
        controls: workBar ? $('.slider-nav', workBar) : null,
        a11y: { enabled: true, prevSlideMessage: 'Previous photo', nextSlideMessage: 'Next photo', slideLabelMessage: 'Photo {{index}} of {{slidesLength}}' },
        onIndex: function (real, total, pad) {
          if (bar) bar.style.width = ((real + 1) / total * 100) + '%';
          if (count) count.textContent = pad(real + 1) + ' / ' + pad(total);
        }
      });
    }

    var revEl = $('.reviews-swiper');
    if (revEl) {
      var counter = $('[data-rev-count]');
      var revNav = $('.reviews__ctrl .slider-nav');
      // One review visible => 4 real slides already satisfy loop (>= 2); no clones needed
      makeSlider({
        el: revEl,
        minSlides: 2,
        slidesPerView: 1,
        spaceBetween: 16,
        speed: 900,
        delay: 5000,
        prev: '[data-rev-prev]',
        next: '[data-rev-next]',
        toggle: revNav ? $('[data-slider-toggle]', revNav) : null,
        controls: revNav,
        a11y: { enabled: true, prevSlideMessage: 'Previous review', nextSlideMessage: 'Next review', slideLabelMessage: 'Review {{index}} of {{slidesLength}}' },
        onIndex: function (real, total, pad) { if (counter) counter.textContent = pad(real + 1) + ' / ' + pad(total); }
      });
    }

    if (sliders.length) root.classList.add('sliders-ready');

    // Overlays: watch drawers + menu (class changes) and Fancybox (container added/removed)
    var syncOverlay = function () {
      var o = overlayOpen();
      if (o !== globalPause.overlay) {
        globalPause.overlay = o;
        // Focus restored by a closing overlay (e.g. Fancybox placeFocusBack) is not user
        // keyboard navigation, so it shouldn't keep the slider paused.
        if (!o) setTimeout(function () { sliders.forEach(function (s) { s.state.focus = false; }); refreshAll(); }, 250);
        refreshAll();
      }
    };
    if ('MutationObserver' in window) {
      var mo = new MutationObserver(syncOverlay);
      $$('.drawer, .menu').forEach(function (n) { mo.observe(n, { attributes: true, attributeFilter: ['class', 'hidden'] }); });
      mo.observe(doc.body, { childList: true });
    }
    doc.addEventListener('visibilitychange', function () {
      globalPause.hidden = doc.hidden;
      refreshAll();
    });
  });

  // Exposed for diagnostics/tests (read-only use)
  window.__hfSliders = sliders;

  /* ---------- Lightbox ---------- */
  safe('fancybox', function () {
    if (!window.Fancybox || typeof window.Fancybox.bind !== 'function') return;
    window.Fancybox.bind('[data-fancybox="work"]', {
      Hash: false,
      Thumbs: false,
      placeFocusBack: true,
      Toolbar: { display: { left: ['infobar'], middle: [], right: ['close'] } }
    });
  });

  /* ---------- Motion (GSAP) ---------- */
  safe('motion', function () {
    var gsap = window.gsap;
    var ST = window.ScrollTrigger;
    if (reduceMotion || !gsap || !ST) { revealAll(); return; }
    gsap.registerPlugin(ST);

    // Hero entrance (transform-led so the content is never long invisible)
    var heroBits = $$('[data-hero]');
    gsap.fromTo(heroBits, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.09, delay: 0.05, clearProps: 'transform' });
    var media = $('[data-hero-media]');
    if (media) {
      var photo = $('.hero__photo img', media);
      if (photo) gsap.fromTo(photo, { scale: 1.08 }, { scale: 1, duration: 1.6, ease: 'power3.out' });
      gsap.fromTo($$('.hero__inset, .hero__promise', media), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.35 });
    }

    // Scroll reveals
    var items = $$('[data-reveal]');
    gsap.set(items, { autoAlpha: 0, y: 28 });
    ST.batch(items, {
      start: 'top 90%',
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true, clearProps: 'transform' });
      }
    });

    // Insurance: if the user reaches the end of the page, show anything left
    var flushed = false;
    window.addEventListener('scroll', function () {
      if (flushed) return;
      if (window.innerHeight + window.scrollY < doc.documentElement.scrollHeight - 80) return;
      flushed = true;
      var left = items.filter(function (el) { return parseFloat(getComputedStyle(el).opacity) < 1; });
      if (left.length) gsap.to(left, { autoAlpha: 1, y: 0, duration: 0.5, overwrite: true, clearProps: 'transform' });
    }, { passive: true });

    // Counters
    $$('[data-count]').forEach(function (el) {
      var end = parseInt(el.getAttribute('data-count'), 10);
      if (!end) return;
      var obj = { v: 0 };
      el.textContent = '0';
      ST.create({
        trigger: el, start: 'top 92%', once: true,
        onEnter: function () {
          gsap.to(obj, { v: end, duration: end > 10 ? 1.6 : 1, ease: 'power2.out', onUpdate: function () { el.textContent = Math.round(obj.v); }, onComplete: function () { el.textContent = end; } });
        }
      });
    });

    // Subtle parallax on the about photo
    var aboutImg = $('.about__photo img');
    if (aboutImg && window.innerWidth >= 1024) {
      gsap.fromTo(aboutImg, { yPercent: -4, scale: 1.08 }, { yPercent: 4, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.about__photo', start: 'top bottom', end: 'bottom top', scrub: true } });
    }

    window.addEventListener('load', function () { ST.refresh(); });
  });
})();
