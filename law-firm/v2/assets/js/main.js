/*!
 * ==========================================================================
 * Author : Biplab Paul
 * Email  : biplab.cse.85@gmail.com
 * Phone  : 01735927356
 * --------------------------------------------------------------------------
 * Sklentr — Law & Advisory · landing page v2 · main.js
 * GSAP + ScrollTrigger motion, Lenis (desktop), Swiper (desktop sliders),
 * Fancybox (firm tour), accordion, sheets, forms, toast, app scroll-spy.
 * Hooks are js-* classes / data-* attributes only (never styled).
 * ==========================================================================
 */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };

  var mqDesktop = window.matchMedia('(min-width: 992px)');
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var motionOK = !mqReduce.matches;
  var hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  if (!hasGSAP) root.classList.remove('js-motion');
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  // Year --------------------------------------------------------------------------
  $$('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // ===============================================================================
  // Smooth scroll (Lenis, desktop + motion only)
  // ===============================================================================
  var lenis = null;

  function startLenis() {
    if (lenis || !motionOK || !mqDesktop.matches || typeof window.Lenis === 'undefined') return;
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(lenisRaf);
      gsap.ticker.lagSmoothing(0);
    }
  }

  function lenisRaf(time) { if (lenis) lenis.raf(time * 1000); }

  function stopLenis() {
    if (!lenis) return;
    if (hasGSAP) gsap.ticker.remove(lenisRaf);
    lenis.destroy();
    lenis = null;
  }

  startLenis();

  function headerOffset() {
    return mqDesktop.matches ? 0 : -(parseFloat(getComputedStyle(root).getPropertyValue('--topbar-h')) || 60) - 8;
  }

  function scrollToTarget(target) {
    if (!target) return;
    var offset = headerOffset();
    if (lenis) {
      lenis.scrollTo(target, { offset: offset, duration: 1.4 });
    } else {
      var y = target.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top: y, behavior: motionOK ? 'smooth' : 'auto' });
    }
  }

  doc.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute('data-sheet')) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var target = doc.getElementById(id.slice(1));
    if (!target) return;
    e.preventDefault();
    closeSheet();
    scrollToTarget(target);
  });

  // ===============================================================================
  // Text splitting (no paid plugin)
  // ===============================================================================
  function splitChars(el) {
    var text = el.textContent.trim().replace(/\s+/g, ' ');
    el.setAttribute('aria-label', text);
    el.textContent = '';
    var chars = [];
    text.split(' ').forEach(function (word, i, arr) {
      var w = doc.createElement('span');
      w.className = 'c-split-word';
      w.setAttribute('aria-hidden', 'true');
      Array.prototype.forEach.call(word, function (ch) {
        var c = doc.createElement('span');
        c.className = 'c-split-char';
        c.textContent = ch;
        w.appendChild(c);
        chars.push(c);
      });
      el.appendChild(w);
      if (i < arr.length - 1) el.appendChild(doc.createTextNode(' '));
    });
    return chars;
  }

  function splitWords(el) {
    var text = el.textContent.trim().replace(/\s+/g, ' ');
    el.setAttribute('aria-label', text);
    el.textContent = '';
    var words = [];
    text.split(' ').forEach(function (word, i, arr) {
      var w = doc.createElement('span');
      w.className = 'c-split-word';
      w.setAttribute('aria-hidden', 'true');
      w.textContent = word;
      el.appendChild(w);
      words.push(w);
      if (i < arr.length - 1) el.appendChild(doc.createTextNode(' '));
    });
    return words;
  }

  function splitLines(el) {
    var original = el.getAttribute('data-text') || el.textContent.trim().replace(/\s+/g, ' ');
    el.setAttribute('data-text', original);
    el.setAttribute('aria-label', original);
    var words = (function () { el.textContent = original; return splitWords(el); })();
    var lines = [];
    var lastTop = null;
    words.forEach(function (w) {
      var top = w.offsetTop;
      if (lastTop === null || Math.abs(top - lastTop) > 4) { lines.push([]); lastTop = top; }
      lines[lines.length - 1].push(w.textContent);
    });
    el.textContent = '';
    return lines.map(function (ws) {
      var line = doc.createElement('span');
      line.className = 'c-split-line';
      line.setAttribute('aria-hidden', 'true');
      var inner = doc.createElement('span');
      inner.textContent = ws.join(' ');
      line.appendChild(inner);
      el.appendChild(line);
      return inner;
    });
  }

  // ===============================================================================
  // Motion
  // ===============================================================================
  function heroIntro() {
    var title = $('.js-hero-title');
    var text = $('.js-hero-text');
    if (!title) return;
    var chars = splitChars(title);
    var words = text ? splitWords(text) : [];
    if (!motionOK) return;

    var tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 });
    tl.from('.js-hero-tag', { y: 20, opacity: 0, duration: 1 })
      .from(chars, { yPercent: 60, opacity: 0, duration: 1.1, stagger: 0.018 }, 0.1)
      .from(words, { y: 14, opacity: 0, duration: 0.9, stagger: 0.012 }, 0.45)
      .from('.js-hero-actions > *', { y: 22, opacity: 0, duration: 1, stagger: 0.1 }, 0.7)
      .from('.js-hero-media', { yPercent: 12, scale: 0.94, opacity: 0, duration: 1.4 }, 0.55);
  }

  function scrollReveals() {
    // Section titles: scroll-scrubbed character fill (matches the reference)
    $$('[data-split="chars"]').forEach(function (el) {
      var chars = splitChars(el);
      if (!motionOK) return;
      gsap.fromTo(chars, { opacity: 0.18 }, {
        opacity: 1,
        ease: 'none',
        stagger: 0.06,
        scrollTrigger: { trigger: el, start: 'top 88%', end: 'bottom 52%', scrub: true }
      });
    });

    // Statement: line-by-line rise
    $$('[data-split="lines"]').forEach(function (el) {
      var lines = splitLines(el);
      if (!motionOK) return;
      gsap.from(lines, {
        yPercent: 100, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    });

    if (!motionOK) return;

    // Generic fade-up blocks
    ScrollTrigger.batch('[data-anim="up"]', {
      start: 'top 90%',
      once: true,
      onEnter: function (batch) {
        gsap.fromTo(batch, { y: 56, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.1, overwrite: 'auto' });
      }
    });

    // Banner parallax
    $$('.js-parallax').forEach(function (el) {
      gsap.fromTo(el, { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // Desktop-only scenes
    ScrollTrigger.matchMedia({
      '(min-width: 992px)': function () {
        // Case results: horizontal track scrubbed by vertical scroll inside sticky stage
        var section = $('.js-results');
        var track = $('.js-results-track');
        if (section && track) {
          var sticky = track.closest('.c-results__sticky');
          var viewport = track.parentElement;
          var distance = function () {
            var cs = getComputedStyle(viewport);
            var inner = viewport.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
            return Math.max(0, track.scrollWidth - inner);
          };
          gsap.to(track, {
            x: function () { return -distance(); },
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top+=120 top+=40',
              end: function () { return 'bottom top+=' + (40 + sticky.offsetHeight); },
              scrub: 1,
              invalidateOnRefresh: true
            }
          });
        }

        // CTA grows from 60% to full width
        var cta = $('.js-cta');
        if (cta) {
          gsap.fromTo(cta, { scale: 0.6, borderRadius: 24 }, {
            scale: 1, borderRadius: 0, ease: 'none',
            scrollTrigger: { trigger: cta, start: 'top bottom', end: 'top 20%', scrub: true }
          });
        }
      }
    });

    // Counters
    $$('.js-count').forEach(function (el) {
      var to = parseFloat(el.getAttribute('data-to')) || 0;
      var obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 92%', once: true,
        onEnter: function () {
          gsap.to(obj, { v: to, duration: 1.8, ease: 'power2.out', onUpdate: function () { el.textContent = Math.round(obj.v).toLocaleString(); } });
        }
      });
    });
  }

  function staticCounters() {
    $$('.js-count').forEach(function (el) { el.textContent = (+el.getAttribute('data-to')).toLocaleString(); });
  }

  // ===============================================================================
  // Sliders (Swiper on desktop; native snap rails on phones)
  // ===============================================================================
  var sliders = [];
  var sliderDefs = [
    { el: '.js-practice-slider', prev: '.js-practice-prev', next: '.js-practice-next', loop: false },
    { el: '.js-team-slider', prev: '.js-team-prev', next: '.js-team-next', loop: true },
    { el: '.js-reviews-slider', prev: '.js-reviews-prev', next: '.js-reviews-next', loop: false }
  ];

  function initSliders() {
    if (typeof window.Swiper === 'undefined' || sliders.length) return;
    sliderDefs.forEach(function (d) {
      var el = $(d.el);
      if (!el) return;
      sliders.push(new Swiper(el, {
        slidesPerView: 'auto',
        spaceBetween: 16,
        speed: 800,
        loop: d.loop,
        grabCursor: true,
        watchOverflow: true,
        keyboard: { enabled: true, onlyInViewport: true },
        a11y: { enabled: true },
        navigation: { prevEl: $(d.prev), nextEl: $(d.next) }
      }));
    });
  }

  function destroySliders() {
    sliders.forEach(function (s) { s.destroy(true, true); });
    sliders = [];
  }

  function syncSliders() {
    if (mqDesktop.matches) initSliders(); else destroySliders();
  }

  // ===============================================================================
  // Accordion
  // ===============================================================================
  function initAccordion() {
    $$('.js-accordion').forEach(function (acc) {
      var items = $$('.c-accordion__item', acc);
      function setOpen(item, open) {
        var btn = $('.c-accordion__trigger', item);
        var panel = $('.c-accordion__panel', item);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        item.classList.toggle('is-open', open);
        if (!hasGSAP || !motionOK) { panel.hidden = !open; refreshSoon(); return; }
        gsap.killTweensOf(panel);
        if (open) {
          panel.hidden = false;
          gsap.fromTo(panel, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.55, ease: 'power3.out', onComplete: refreshSoon });
        } else {
          gsap.to(panel, { height: 0, opacity: 0, duration: 0.45, ease: 'power3.inOut', onComplete: function () { panel.hidden = true; gsap.set(panel, { clearProps: 'height,opacity' }); refreshSoon(); } });
        }
      }
      items.forEach(function (item) {
        $('.c-accordion__trigger', item).addEventListener('click', function () {
          var willOpen = !item.classList.contains('is-open');
          items.forEach(function (other) { if (other !== item && other.classList.contains('is-open')) setOpen(other, false); });
          setOpen(item, willOpen);
        });
      });
    });
  }

  var refreshTimer;
  function refreshSoon() {
    if (!hasGSAP) return;
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () { ScrollTrigger.refresh(); }, 120);
  }

  // ===============================================================================
  // Media pause toggles (motion stand-ins for the reference's background video)
  // ===============================================================================
  function initMediaToggles() {
    $$('.js-media-toggle').forEach(function (btn) {
      if (!motionOK) btn.hidden = true;
      btn.addEventListener('click', function () {
        var paused = btn.getAttribute('aria-pressed') !== 'true';
        btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
        btn.setAttribute('aria-label', paused ? 'Play motion' : 'Pause motion');
        var scope = btn.parentElement;
        $$('.js-kenburns', scope).forEach(function (img) { img.classList.toggle('is-paused', paused); });
      });
    });
  }

  // ===============================================================================
  // Toast
  // ===============================================================================
  var toastEl = $('.js-toast');
  var toastTimer;
  function toast(msg, isError) {
    if (!toastEl) return;
    $('.js-toast-text', toastEl).textContent = msg;
    toastEl.classList.toggle('is-error', !!isError);
    var use = $('use', toastEl);
    if (use) use.setAttribute('href', isError ? '#i-alert' : '#i-check');
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 3800);
  }

  // ===============================================================================
  // Sheets (bottom sheet on phones, centred modal on desktop)
  // ===============================================================================
  var scrim = $('.js-scrim');
  var openSheetEl = null;
  var lastFocus = null;

  function openSheet(id) {
    var sheet = $('.js-sheet[data-sheet-id="' + id + '"]');
    if (!sheet) return;
    if (openSheetEl && openSheetEl !== sheet) closeSheet(true);
    lastFocus = doc.activeElement;
    openSheetEl = sheet;
    sheet.hidden = false;
    scrim.hidden = false;
    doc.body.classList.add('is-locked');
    if (lenis) lenis.stop();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        sheet.classList.add('is-open');
        scrim.classList.add('is-open');
        var first = $('input, select, textarea, a[href], button:not(.js-close-sheet)', sheet);
        if (first && mqDesktop.matches) first.focus({ preventScroll: true });
        else $('.js-close-sheet', sheet).focus({ preventScroll: true });
      });
    });
  }

  function closeSheet(immediate) {
    if (!openSheetEl) return;
    var sheet = openSheetEl;
    openSheetEl = null;
    sheet.classList.remove('is-open');
    scrim.classList.remove('is-open');
    sheet.style.transform = '';
    doc.body.classList.remove('is-locked');
    if (lenis) lenis.start();
    var done = function () { if (!sheet.classList.contains('is-open')) sheet.hidden = true; if (!openSheetEl) scrim.hidden = true; };
    if (immediate || !motionOK) done(); else setTimeout(done, 480);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  doc.addEventListener('click', function (e) {
    var opener = e.target.closest('.js-open-sheet');
    if (opener) {
      e.preventDefault();
      openSheet(opener.getAttribute('data-sheet'));
      return;
    }
    if (e.target.closest('.js-close-sheet') && !e.target.closest('a[href^="#"]')) closeSheet();
  });
  if (scrim) scrim.addEventListener('click', function () { closeSheet(); });

  doc.addEventListener('keydown', function (e) {
    if (!openSheetEl) return;
    if (e.key === 'Escape') { closeSheet(); return; }
    if (e.key === 'Tab') {
      var f = $$('a[href], button:not([disabled]), input, select, textarea', openSheetEl).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Swipe down to dismiss (phones)
  $$('.js-sheet').forEach(function (sheet) {
    var startY = 0, dy = 0, dragging = false;
    sheet.addEventListener('touchstart', function (e) {
      if (mqDesktop.matches || sheet.scrollTop > 0) return;
      dragging = true; startY = e.touches[0].clientY; dy = 0;
      sheet.style.transition = 'none';
    }, { passive: true });
    sheet.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      dy = Math.max(0, e.touches[0].clientY - startY);
      sheet.style.transform = 'translateY(' + dy + 'px)';
    }, { passive: true });
    sheet.addEventListener('touchend', function () {
      if (!dragging) return;
      dragging = false;
      sheet.style.transition = '';
      if (dy > 110) closeSheet(); else sheet.style.transform = '';
    });
  });

  // ===============================================================================
  // Forms (client-side validation, success toast — no backend)
  // ===============================================================================
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function fieldError(input) {
    var v = input.value.trim();
    if (input.required && !v) return input.tagName === 'SELECT' ? 'Please choose an option.' : 'This field is required.';
    if (input.type === 'email' && v && !EMAIL_RE.test(v)) return 'Please enter a valid email address.';
    if (input.type === 'tel' && v && v.replace(/[^\d]/g, '').length < 8) return 'Please enter a valid phone number.';
    return '';
  }

  function showError(input, msg) {
    input.classList.toggle('is-invalid', !!msg);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    var holder = input.closest('.c-field') || input.closest('form');
    var err = holder ? $('.c-field__error', holder) : null;
    if (err) err.textContent = msg;
  }

  $$('.js-form').forEach(function (form) {
    var inputs = $$('input, select, textarea', form);
    inputs.forEach(function (input) {
      input.addEventListener('blur', function () { if (input.value) showError(input, fieldError(input)); });
      input.addEventListener('input', function () { if (input.classList.contains('is-invalid')) showError(input, fieldError(input)); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      inputs.forEach(function (input) {
        var msg = fieldError(input);
        showError(input, msg);
        if (msg && !firstBad) firstBad = input;
      });
      if (firstBad) {
        firstBad.focus();
        toast('Please check the highlighted fields.', true);
        return;
      }
      var btn = $('[type="submit"]', form);
      if (btn) btn.disabled = true;
      setTimeout(function () {
        if (btn) btn.disabled = false;
        form.reset();
        inputs.forEach(function (i) { showError(i, ''); });
        if (form.closest('.js-sheet')) closeSheet();
        toast(form.getAttribute('data-success') || 'Thank you — we will be in touch shortly.');
      }, 650);
    });
  });

  // ===============================================================================
  // Desktop nav dropdown (keyboard / touch)
  // ===============================================================================
  $$('.c-nav__toggle').forEach(function (btn) {
    var drop = btn.parentElement;
    btn.addEventListener('click', function () {
      var open = !drop.classList.contains('is-open');
      drop.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    doc.addEventListener('click', function (e) {
      if (!drop.contains(e.target)) { drop.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); }
    });
  });

  // ===============================================================================
  // App mode: top bar state, tab scroll-spy, practice chips
  // ===============================================================================
  var topbar = $('.js-topbar');
  function onScrollTopbar() {
    if (topbar) topbar.classList.toggle('is-scrolled', window.pageYOffset > 8);
  }
  window.addEventListener('scroll', onScrollTopbar, { passive: true });
  onScrollTopbar();

  var tabs = $$('[data-tab-link]');
  function setTab(name) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-tab-link') === name;
      t.classList.toggle('is-active', on);
      if (on) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
    });
  }

  function initScrollSpy() {
    if (!hasGSAP) return;
    $$('[data-tab]').forEach(function (sec) {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: function (self) { if (self.isActive) setTab(sec.getAttribute('data-tab')); }
      });
    });
  }

  $$('.js-chips').forEach(function (bar) {
    var chips = $$('[data-filter]', bar);
    var rail = $('.c-practice__track');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.classList.toggle('is-active', c === chip); c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
        $$('.c-service', rail).forEach(function (card) {
          card.classList.toggle('is-hidden', f !== 'all' && card.getAttribute('data-cat') !== f);
        });
        if (rail) rail.scrollTo({ left: 0, behavior: motionOK ? 'smooth' : 'auto' });
        if (hasGSAP && motionOK) gsap.fromTo($$('.c-service:not(.is-hidden)', rail), { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' });
      });
    });
  });

  // ===============================================================================
  // Fancybox (firm tour)
  // ===============================================================================
  if (window.Fancybox) {
    Fancybox.bind('[data-fancybox]', {
      Hash: false,
      on: {
        init: function () { if (lenis) lenis.stop(); },
        destroy: function () { if (lenis) lenis.start(); }
      }
    });
  }

  // ===============================================================================
  // Boot
  // ===============================================================================
  syncSliders();
  initAccordion();
  initMediaToggles();

  function bootMotion() {
    if (!hasGSAP) {
      $$('[data-split]').forEach(function () {});
      staticCounters();
      return;
    }
    heroIntro();
    scrollReveals();
    if (!motionOK) staticCounters();
    initScrollSpy();
    ScrollTrigger.refresh();
  }

  var fontsReady = doc.fonts && doc.fonts.ready ? doc.fonts.ready : Promise.resolve();
  var booted = false;
  function boot() { if (booted) return; booted = true; bootMotion(); }
  fontsReady.then(boot);
  setTimeout(boot, 2500); // never wait forever on fonts

  window.addEventListener('load', function () { if (hasGSAP) ScrollTrigger.refresh(); });

  // Breakpoint changes: sliders + smooth scroll
  var onBp = function () {
    syncSliders();
    if (mqDesktop.matches) startLenis(); else stopLenis();
    closeSheet(true);
  };
  if (mqDesktop.addEventListener) mqDesktop.addEventListener('change', onBp); else mqDesktop.addListener(onBp);
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
      a.classList.toggle('is-active', on);
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
