/* ==========================================================================
   Melbourne Wide Electrical · V2 — interactions
   Fail-safe rule: content is visible by default. Pre-reveal hidden states are
   only applied after GSAP + ScrollTrigger are confirmed, and any error reveals
   everything.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = function () { return reduceMQ.matches; };

  /* ---------- fail-safe reveal ---------- */
  function revealAll() {
    root.classList.add('reveal-all');
    try {
      if (window.gsap) window.gsap.set('[data-reveal]', { clearProps: 'opacity,visibility,transform' });
    } catch (e) { /* ignore */ }
    $$('[data-reveal]').forEach(function (el) {
      el.style.opacity = ''; el.style.visibility = ''; el.style.transform = '';
    });
  }
  window.addEventListener('error', revealAll);

  function safe(name, fn) {
    try { fn(); } catch (err) {
      revealAll();
      if (window.console) console.warn('[MWE] ' + name + ' failed:', err);
    }
  }

  /* ---------- header state + back to top ---------- */
  safe('header', function () {
    var header = $('#header');
    var toTop = $('#toTop');
    var ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle('is-scrolled', y > 8);
      if (toTop) toTop.classList.toggle('is-visible', y > 700);
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  });

  /* ---------- scroll spy ---------- */
  safe('scrollspy', function () {
    var ids = ['home', 'about', 'services', 'why', 'reviews', 'areas', 'faq'];
    var sections = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var links = $$('[data-spy]');
    var current = null;
    var ticking = false;

    function setActive(id) {
      if (id === current) return;
      current = id;
      links.forEach(function (a) {
        var on = a.getAttribute('data-spy') === id;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }
    function compute() {
      ticking = false;
      var line = window.innerHeight * 0.38;
      var active = sections[0] ? sections[0].id : null;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top <= line) active = sections[i].id;
      }
      // bottom of page: last section wins
      if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 4) {
        active = sections[sections.length - 1].id;
      }
      setActive(active);
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(compute); }
    }, { passive: true });
    window.addEventListener('resize', compute);
    compute();
  });

  /* ---------- modal helper (menu + drawer) ---------- */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  var openStack = [];

  function lockScroll() {
    if (root.classList.contains('is-locked')) return;
    var sb = window.innerWidth - root.clientWidth;
    if (sb > 0) document.body.style.paddingRight = sb + 'px';
    root.classList.add('is-locked');
  }
  function unlockScroll() {
    if (openStack.length) return;
    root.classList.remove('is-locked');
    document.body.style.paddingRight = '';
  }

  function visibleFocusables(el) {
    return $$(FOCUSABLE, el).filter(function (n) {
      return n.offsetWidth > 0 || n.offsetHeight > 0 || n.getClientRects().length > 0;
    });
  }

  function Overlay(el, opts) {
    this.el = el;
    this.opts = opts || {};
    this.trigger = null;
    this.hideTimer = null;
    var self = this;
    $$('[data-close]', el).forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); self.close(); });
    });
  }
  Overlay.prototype.isOpen = function () { return !this.el.hidden && this.el.classList.contains('is-open'); };
  Overlay.prototype.open = function (trigger) {
    var el = this.el;
    clearTimeout(this.hideTimer);
    this.trigger = trigger || document.activeElement;
    el.hidden = false;
    void el.offsetWidth; // reflow so the transition runs
    el.classList.add('is-open');
    if (openStack.indexOf(this) === -1) openStack.push(this);
    lockScroll();
    if (this.opts.onOpen) this.opts.onOpen();
    var target = $(this.opts.initialFocus || '[data-close].icon-btn', el) || visibleFocusables(el)[0];
    if (target) {
      try { target.focus({ preventScroll: true }); } catch (e) { target.focus(); }
    }
  };
  Overlay.prototype.close = function (opts) {
    opts = opts || {};
    var el = this.el;
    if (el.hidden) return;
    el.classList.remove('is-open');
    var idx = openStack.indexOf(this);
    if (idx > -1) openStack.splice(idx, 1);
    unlockScroll();
    var delay = reduced() ? 0 : 480;
    this.hideTimer = setTimeout(function () { el.hidden = true; }, delay);
    if (this.opts.onClose) this.opts.onClose();
    var back = opts.returnFocus || this.trigger;
    if (back && opts.returnFocus !== false && document.contains(back) && back.offsetParent !== null) {
      try { back.focus({ preventScroll: true }); } catch (e) { back.focus(); }
    }
  };

  document.addEventListener('keydown', function (e) {
    var top = openStack[openStack.length - 1];
    if (!top) return;
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      top.close();
      return;
    }
    if (e.key === 'Tab') {
      var f = visibleFocusables(top.el);
      if (!f.length) { e.preventDefault(); return; }
      var first = f[0], last = f[f.length - 1];
      if (!top.el.contains(document.activeElement)) { e.preventDefault(); first.focus(); return; }
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- mobile menu ---------- */
  var menu = null;
  safe('menu', function () {
    var el = $('#menu');
    var btn = $('#menuBtn');
    if (!el || !btn) return;
    menu = new Overlay(el, {
      onOpen: function () { btn.setAttribute('aria-expanded', 'true'); },
      onClose: function () { btn.setAttribute('aria-expanded', 'false'); }
    });
    btn.addEventListener('click', function () { menu.isOpen() ? menu.close() : menu.open(btn); });
    // in-page links inside the menu: close, then let the browser scroll
    $$('.menu__link:not([data-quote]):not([data-contact])', el).forEach(function (a) {
      a.addEventListener('click', function () { menu.close({ returnFocus: false }); });
    });
    // close the menu if we grow into desktop
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (mq) {
      if (mq.matches && menu.isOpen()) menu.close({ returnFocus: false });
    });
  });

  /* ---------- Quote + Contact drawers ---------- */
  var RULES = {
    name: function (v) { return v.trim().length >= 2 ? '' : 'Please tell us your name.'; },
    phone: function (v, field) {
      if (!v.trim()) return field.required ? 'Please enter a phone number.' : '';
      var d = v.replace(/[^\d]/g, '');
      return (d.length >= 8 && d.length <= 12 && /^[\d\s()+-]+$/.test(v.trim())) ? '' : 'Please enter a valid Australian phone number.';
    },
    email: function (v) {
      if (!v.trim()) return 'Please enter your email.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address.';
    },
    service: function (v) { return v ? '' : 'Please pick a service.'; },
    message: function (v, field) { return (!field.required || v.trim().length >= 5) ? '' : 'Please add a short message.'; }
  };

  function setupForm(form, success, drawer) {
    var autoClose = null;
    function errEl(field) { return document.getElementById(field.id + '-err'); }
    function setError(field, msg) {
      var e = errEl(field);
      field.classList.toggle('is-invalid', !!msg);
      if (msg) field.setAttribute('aria-invalid', 'true'); else field.removeAttribute('aria-invalid');
      if (e) e.textContent = msg;
    }
    function validateField(field) {
      var rule = RULES[field.name];
      if (!rule || field.type === 'radio') return true;
      var msg = rule(field.value, field);
      setError(field, msg);
      return !msg;
    }
    var fields = $$('input, select, textarea', form).filter(function (f) { return RULES[f.name] && f.type !== 'radio'; });
    fields.forEach(function (field) {
      field.addEventListener('blur', function () { if (field.value || field.classList.contains('is-invalid')) validateField(field); });
      field.addEventListener('input', function () { if (field.classList.contains('is-invalid')) validateField(field); });
      field.addEventListener('change', function () { if (field.classList.contains('is-invalid')) validateField(field); });
    });
    function showForm() {
      clearTimeout(autoClose); autoClose = null;
      if (success) success.hidden = true;
      form.hidden = false;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      fields.forEach(function (f) { if (!validateField(f) && !firstBad) firstBad = f; });
      if (firstBad) { firstBad.focus(); return; }
      // Front-end only demo: no data leaves the page.
      form.reset();
      form.hidden = true;
      if (success) {
        success.hidden = false;
        try { success.focus(); } catch (err) { /* ignore */ }
      }
      clearTimeout(autoClose);
      autoClose = setTimeout(function () { if (drawer.isOpen()) drawer.close(); }, 7000);
    });
    var again = success ? $('[data-reset]', success) : null;
    if (again) again.addEventListener('click', function () {
      showForm();
      var f = fields[0]; if (f) f.focus();
    });
    return {
      prepare: function () { clearTimeout(autoClose); autoClose = null; if (success && !success.hidden) showForm(); },
      clearError: function (field) { setError(field, ''); }
    };
  }

  safe('drawers', function () {
    var defs = [
      { attr: 'data-quote', el: $('#quote'), form: $('#quoteForm'), success: $('#quoteSuccess'), select: $('#q-service'), key: 'data-service' },
      { attr: 'data-contact', el: $('#contact-us'), form: $('#contactForm'), success: $('#contactSuccess'), select: $('#c-topic'), key: 'data-topic' }
    ].filter(function (d) { return d.el; });

    defs.forEach(function (d) {
      d.drawer = new Overlay(d.el, { onOpen: function () { if (d.ctl) d.ctl.prepare(); } });
      if (d.form) d.ctl = setupForm(d.form, d.success, d.drawer);
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest) return;
      var def = null, t = null;
      for (var i = 0; i < defs.length; i++) {
        t = e.target.closest('[' + defs[i].attr + ']');
        if (t) { def = defs[i]; break; }
      }
      if (!def) return;
      e.preventDefault();
      var trigger = t;
      if (menu && menu.isOpen()) {
        menu.close({ returnFocus: false });
        trigger = $('#menuBtn');
      }
      // only one drawer at a time: swap cleanly, keep the original return target
      defs.forEach(function (o) {
        if (o !== def && o.drawer.isOpen()) {
          if (t.closest('#' + o.el.id)) trigger = o.drawer.trigger || trigger;
          o.drawer.close({ returnFocus: false });
          o.el.hidden = true;
        }
      });
      var val = t.getAttribute(def.key);
      if (def.ctl) def.ctl.prepare();
      if (def.select && val) {
        def.select.value = val;
        if (def.ctl) def.ctl.clearError(def.select);
      }
      if (!def.drawer.isOpen()) def.drawer.open(trigger);
    });
  });

  /* ---------- FAQ accordion ---------- */
  safe('accordion', function () {
    var btns = $$('.acc__btn');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btns.forEach(function (b) {
          b.setAttribute('aria-expanded', 'false');
          var p = document.getElementById(b.getAttribute('aria-controls'));
          if (p) p.hidden = true;
        });
        if (!open) {
          btn.setAttribute('aria-expanded', 'true');
          var panel = document.getElementById(btn.getAttribute('aria-controls'));
          if (panel) panel.hidden = false;
        }
      });
    });
  });

  /* ---------- suburbs: compact on phones ---------- */
  safe('suburbs', function () {
    var list = $('#suburbs');
    var btn = $('#suburbsToggle');
    if (!list || !btn) return;
    list.classList.add('is-collapsed');
    btn.hidden = false;
    btn.addEventListener('click', function () {
      var collapsed = list.classList.toggle('is-collapsed');
      btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      btn.firstChild.nodeValue = collapsed ? 'Show all 40 suburbs ' : 'Show fewer suburbs ';
    });
  });

  /* ---------- Swiper: reviews (infinite loop + managed autoplay) ---------- */
  safe('swiper', function () {
    if (typeof window.Swiper !== 'function') return;
    var el = $('#reviewsSlider');
    if (!el) return;
    var wrapper = $('.swiper-wrapper', el);
    var originals = $$('.swiper-slide', wrapper);
    var realCount = originals.length;
    if (!realCount) return;

    // Loop needs >= slidesPerView x 2 at every breakpoint (max 3 per view):
    // duplicate the set until there are at least 8 slides. Clones are hidden from AT
    // and removed from the tab order; ids are stripped so none are duplicated.
    var copies = 0;
    while (realCount * (copies + 1) < 8) {
      originals.forEach(function (s) {
        var c = s.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        c.setAttribute('data-clone', '');
        c.removeAttribute('id');
        $$('[id]', c).forEach(function (n) { n.removeAttribute('id'); });
        $$('a, button, input, select, textarea, [tabindex]', c).forEach(function (n) { n.setAttribute('tabindex', '-1'); });
        wrapper.appendChild(c);
      });
      copies++;
    }

    var dotsWrap = $('#revDots');
    var toggle = $('#revToggle');
    var dots = [];
    var canAutoplay = !reduced();

    var swiper = new window.Swiper(el, {
      loop: true,
      rewind: false,
      slidesPerView: 1.08,
      spaceBetween: 14,
      speed: 900,
      grabCursor: true,
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 18 },
        1024: { slidesPerView: 3, spaceBetween: 22 }
      },
      navigation: { prevEl: '#revPrev', nextEl: '#revNext' },
      keyboard: { enabled: true, onlyInViewport: true },
      a11y: { enabled: true, prevSlideMessage: 'Previous review', nextSlideMessage: 'Next review' },
      autoplay: canAutoplay ? { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true } : false
    });
    if (!canAutoplay && swiper.autoplay && swiper.autoplay.running) swiper.autoplay.stop();

    // pagination that reflects the REAL review (realIndex mod the original count)
    if (dotsWrap) {
      for (var i = 0; i < realCount; i++) {
        (function (n) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'swiper-pagination-bullet';
          b.setAttribute('aria-label', 'Go to review ' + (n + 1));
          b.addEventListener('click', function () { swiper.slideToLoop(n); });
          dotsWrap.appendChild(b);
          dots.push(b);
        })(i);
      }
    }
    function syncDots() {
      var r = swiper.realIndex % realCount;
      dots.forEach(function (d, n) {
        var on = n === r;
        d.classList.toggle('swiper-pagination-bullet-active', on);
        if (on) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
    }
    swiper.on('slideChange', syncDots);
    syncDots();

    // ---- autoplay controller: runs only when no pause reason is active ----
    var reasons = {};
    function apply() {
      if (!canAutoplay || !swiper.autoplay) return;
      var blocked = Object.keys(reasons).some(function (k) { return reasons[k]; });
      if (blocked && swiper.autoplay.running) swiper.autoplay.stop();
      else if (!blocked && !swiper.autoplay.running) swiper.autoplay.start();
    }
    function setReason(k, on) { reasons[k] = !!on; apply(); }

    // visible pause/play toggle (WCAG 2.2.2)
    if (toggle) {
      if (!canAutoplay) toggle.hidden = true;
      toggle.addEventListener('click', function () {
        var pause = toggle.getAttribute('aria-pressed') !== 'true';
        toggle.setAttribute('aria-pressed', pause ? 'true' : 'false');
        toggle.setAttribute('aria-label', pause ? 'Play automatic review rotation' : 'Pause automatic review rotation');
        toggle.classList.toggle('is-paused', pause);
        setReason('user', pause);
      });
    }
    // overlays: drawers + menu lock the page (html.is-locked); Fancybox adds html.with-fancybox
    function overlayState() { setReason('overlay', root.classList.contains('is-locked') || root.classList.contains('with-fancybox')); }
    if (window.MutationObserver) new MutationObserver(overlayState).observe(root, { attributes: true, attributeFilter: ['class'] });
    // tab hidden
    document.addEventListener('visibilitychange', function () { setReason('hidden', document.hidden); });
    // off-screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { setReason('offscreen', !en.isIntersecting); });
      }, { threshold: 0.15 }).observe(el);
    }
    // keyboard focus inside the slides
    el.addEventListener('focusin', function () { setReason('focus', true); });
    el.addEventListener('focusout', function (e) { if (!el.contains(e.relatedTarget)) setReason('focus', false); });
    overlayState();

    el.mweSlider = { swiper: swiper, realCount: realCount, reasons: reasons };
    var nav = $('#revNav');
    if (nav) nav.hidden = false;
  });

  /* ---------- Fancybox: gallery ---------- */
  safe('fancybox', function () {
    if (!window.Fancybox || typeof window.Fancybox.bind !== 'function') return;
    window.Fancybox.bind('[data-fancybox="work"]', {
      Hash: false,
      placeFocusBack: true,
      Thumbs: { type: 'classic' },
      Toolbar: { display: { left: ['infobar'], middle: [], right: ['slideshow', 'close'] } }
    });
  });

  /* ---------- GSAP: restrained reveals ---------- */
  safe('gsap', function () {
    var gsap = window.gsap;
    var ST = window.ScrollTrigger;
    if (!gsap || !ST || reduced()) return;   // no library = everything stays visible
    gsap.registerPlugin(ST);

    var vh = window.innerHeight;
    var heroEls = $$('.hero [data-reveal]');
    var rest = $$('[data-reveal]').filter(function (el) {
      return heroEls.indexOf(el) === -1 && el.getBoundingClientRect().top > vh * 0.92;
    });

    // hero intro on load
    gsap.fromTo(heroEls, { autoAlpha: 0, y: 26 }, {
      autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.09, delay: 0.05,
      clearProps: 'transform'
    });

    // hero loop line draws itself once
    var loop = $('.hero__loops .loop-path');
    if (loop && loop.getTotalLength) {
      var len = loop.getTotalLength();
      gsap.fromTo(loop, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2.6, ease: 'power2.inOut', delay: 0.2 });
    }

    // below-the-fold reveals: hidden state only applied now that GSAP is confirmed
    gsap.set(rest, { autoAlpha: 0, y: 28 });
    ST.batch(rest, {
      start: 'top 90%',
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true, clearProps: 'transform' });
      }
    });

    // stat counters (final values are already in the HTML)
    $$('[data-count]').forEach(function (el) {
      var end = parseInt(el.getAttribute('data-count'), 10);
      if (!end) return;
      var obj = { v: 0 };
      ST.create({
        trigger: el, start: 'top 92%', once: true,
        onEnter: function () {
          gsap.to(obj, { v: end, duration: 1.6, ease: 'power2.out', onUpdate: function () { el.textContent = Math.round(obj.v); } });
        }
      });
    });

    // safety net: anything that has scrolled into view but is still hidden gets revealed
    var netTicking = false;
    function net() {
      netTicking = false;
      var h = window.innerHeight;
      rest.forEach(function (el) {
        if (el.style.visibility !== 'hidden' && el.style.opacity !== '0') return;
        if (gsap.isTweening(el)) return;
        if (el.getBoundingClientRect().top < h * 0.98) {
          gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', clearProps: 'transform' });
        }
      });
    }
    window.addEventListener('scroll', function () {
      if (!netTicking) { netTicking = true; setTimeout(net, 180); }
    }, { passive: true });

    window.addEventListener('load', function () { try { ST.refresh(); } catch (e) { revealAll(); } });
  });
})();
