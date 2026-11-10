// ==========================================================================
// Author : Biplab Paul
// Email  : biplab.cse.85@gmail.com
// Phone  : 01735927356
// --------------------------------------------------------------------------
// SCRIPTS / MAIN — Accuvia Accounting & Advisory landing page.
// Desktop: Lenis smooth scroll + GSAP/ScrollTrigger reveals mirroring the
// Zaitong "home v1" interactions (hero entrance, odometer counters, looping
// tickers + logo bands, fanned "why us" cards, hover process panel), plus
// header backdrop, section icon nav, card sliders, pricing switch, FAQ tabs.
// App (< 992px): app bar, tab bar scroll-spy, bottom sheet, snap rails.
// Shared: forms + toasts.
// ==========================================================================

(function () {
  'use strict';

  var hasGsap = typeof window.gsap !== 'undefined';
  var hasST = hasGsap && typeof window.ScrollTrigger !== 'undefined';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mqDesktop = window.matchMedia('(min-width: 992px)');
  var isDesktop = function () { return mqDesktop.matches; };

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  if (hasST) gsap.registerPlugin(ScrollTrigger);

  // ------------------------------------------------------------------------
  // Year
  // ------------------------------------------------------------------------
  $$('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // ------------------------------------------------------------------------
  // Lenis smooth scroll (desktop only)
  // ------------------------------------------------------------------------
  var lenis = null;
  if (isDesktop() && !reduced && window.Lenis) {
    lenis = new Lenis({ duration: 1.2 });
    window.lenis = lenis;
    if (hasST) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  // ------------------------------------------------------------------------
  // Scroll helpers (anchor links)
  // ------------------------------------------------------------------------
  function headerOffset() {
    if (isDesktop()) {
      var h = $('.js-header');
      return h ? h.offsetHeight - 30 : 0;
    }
    var bar = $('.js-appbar');
    var rail = $('.js-appnav');
    return (bar ? bar.offsetHeight : 0) + (rail ? rail.offsetHeight : 0) + 8;
  }

  function scrollToTarget(target) {
    if (!target) return;
    var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
    if (target.id === 'home') top = 0;
    if (lenis) lenis.scrollTo(top, { duration: 1.2 });
    else window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
  }

  $$('.js-scroll').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) !== '#') return;
      var t = document.getElementById(href.slice(1));
      if (!t) return;
      e.preventDefault();
      scrollToTarget(t);
    });
  });

  var header = $('.js-header');
  var appbar = $('.js-appbar');

  // ------------------------------------------------------------------------
  // Toasts
  // ------------------------------------------------------------------------
  var toastHost = $('.js-toasts');
  function toast(message, type) {
    if (!toastHost) return;
    var t = document.createElement('div');
    t.className = 'c-toast' + (type === 'error' ? ' c-toast--error' : '');
    t.innerHTML = '<span class="c-toast__icon"><svg aria-hidden="true"><use href="#' + (type === 'error' ? 'i-alert' : 'i-check') + '"/></svg></span><span class="c-toast__msg"></span>';
    $('.c-toast__msg', t).textContent = message;
    toastHost.appendChild(t);
    setTimeout(function () {
      t.classList.add('is-leaving');
      setTimeout(function () { t.remove(); }, 400);
    }, 4200);
  }

  // ------------------------------------------------------------------------
  // Forms: required + email validation, success toast
  // ------------------------------------------------------------------------
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function fieldOk(input) {
    var v = (input.value || '').trim();
    if (input.required && !v) return false;
    if (input.type === 'email' && v && !emailRe.test(v)) return false;
    return true;
  }
  function mark(input, ok) {
    var wrap = input.closest('.c-field, .c-footer__form');
    if (wrap) wrap.classList.toggle('is-invalid', !ok);
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
  }

  $$('.js-form').forEach(function (form) {
    var inputs = $$('input[required], textarea[required], input[type="email"]', form);
    inputs.forEach(function (input) {
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') mark(input, fieldOk(input));
      });
      input.addEventListener('blur', function () {
        if (input.value) mark(input, fieldOk(input));
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      inputs.forEach(function (input) {
        var ok = fieldOk(input);
        mark(input, ok);
        if (!ok && !firstBad) firstBad = input;
      });
      if (firstBad) {
        firstBad.focus();
        toast('Please complete the highlighted fields.', 'error');
        return;
      }
      toast(form.getAttribute('data-success') || 'Thanks! We will be in touch shortly.');
      form.reset();
      inputs.forEach(function (i) { mark(i, true); });
      if (form.closest('.js-sheet')) closeSheet();
    });
  });

  // ------------------------------------------------------------------------
  // Bottom sheet (app) — centred dialog on desktop
  // ------------------------------------------------------------------------
  var sheet = $('.js-sheet');
  var lastOpener = null;
  function openSheet(opener) {
    if (!sheet) return;
    lastOpener = opener || null;
    sheet.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('u-no-scroll');
    if (lenis) lenis.stop();
    var first = $('input, textarea', sheet);
    setTimeout(function () { if (first) first.focus({ preventScroll: true }); }, 350);
  }
  function closeSheet() {
    if (!sheet || !sheet.classList.contains('is-open')) return;
    sheet.classList.remove('is-open');
    sheet.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('u-no-scroll');
    var panel = $('.js-sheet-panel', sheet);
    if (panel) panel.style.transform = '';
    if (lenis) lenis.start();
    if (lastOpener) lastOpener.focus({ preventScroll: true });
  }
  $$('.js-open-sheet').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); openSheet(b); });
  });
  $$('.js-sheet-close').forEach(function (b) { b.addEventListener('click', closeSheet); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });

  // Drag the grab handle down to dismiss
  (function () {
    var grab = $('.js-sheet-grab');
    var panel = $('.js-sheet-panel');
    if (!grab || !panel) return;
    var startY = 0, dy = 0, dragging = false;
    grab.addEventListener('pointerdown', function (e) {
      dragging = true; startY = e.clientY; dy = 0;
      panel.style.transition = 'none';
      grab.setPointerCapture(e.pointerId);
    });
    grab.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      dy = Math.max(0, e.clientY - startY);
      panel.style.transform = 'translateY(' + dy + 'px)';
    });
    var end = function () {
      if (!dragging) return;
      dragging = false;
      panel.style.transition = '';
      if (dy > 110) closeSheet(); else panel.style.transform = '';
    };
    grab.addEventListener('pointerup', end);
    grab.addEventListener('pointercancel', end);
  })();

  // ------------------------------------------------------------------------
  // Card sliders (services, cases, testimonials, articles) — desktop only;
  // below 992px the tracks become native snap rails.
  // ------------------------------------------------------------------------
  $$('.js-slider').forEach(function (root) {
    var track = $('.js-slider-track', root);
    var slides = $$('.js-slide', root);
    if (!track || !slides.length) return;
    var prev = root.getAttribute('data-prev') ? $(root.getAttribute('data-prev')) : $('.js-slider-prev', root);
    var next = root.getAttribute('data-next') ? $(root.getAttribute('data-next')) : $('.js-slider-next', root);
    var dotsHost = $('.js-slider-dots', root);
    var index = parseInt(root.getAttribute('data-start'), 10) || 0;
    var dots = [];

    if (dotsHost) {
      slides.forEach(function (s, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Show slide ' + (i + 1));
        b.addEventListener('click', function () { go(i); });
        dotsHost.appendChild(b);
        dots.push(b);
      });
    }

    function step() {
      var s = slides[0];
      var mr = parseFloat(getComputedStyle(s).marginRight) || 0;
      return s.getBoundingClientRect().width + mr;
    }
    function go(i) {
      index = (i + slides.length) % slides.length;
      if (isDesktop()) track.style.transform = 'translate3d(' + (-index * step()) + 'px,0,0)';
      else track.style.transform = '';
      slides.forEach(function (s, n) { s.setAttribute('aria-hidden', n === index || !isDesktop() ? 'false' : 'true'); });
      dots.forEach(function (d, n) { d.classList.toggle('is-active', n === index); });
    }
    if (prev) prev.addEventListener('click', function () { go(index - 1); });
    if (next) next.addEventListener('click', function () { go(index + 1); });

    var sx = null;
    root.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (sx === null || !isDesktop()) { sx = null; return; }
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      sx = null;
    });
    window.addEventListener('resize', function () { go(index); });
    go(index);
  });

  // ------------------------------------------------------------------------
  // Process: hovering a step raises it and cross-fades its photo
  // ------------------------------------------------------------------------
  (function () {
    var panel = $('.js-process');
    if (!panel) return;
    var steps = $$('.js-step', panel);
    var photos = $$('.js-process-photo', panel);
    function activate(i) {
      steps.forEach(function (s, n) { s.classList.toggle('is-active', n === i); });
      photos.forEach(function (p, n) { p.classList.toggle('is-active', n === i); });
    }
    steps.forEach(function (s, i) {
      s.addEventListener('mouseenter', function () { activate(i); });
      s.addEventListener('focus', function () { activate(i); });
      s.addEventListener('click', function () { activate(i); });
    });
  })();

  // ------------------------------------------------------------------------
  // Pricing: Monthly / Yearly switch
  // ------------------------------------------------------------------------
  (function () {
    var bar = $('.js-price-switch');
    if (!bar) return;
    var tabs = $$('.c-pricing__tab', bar);
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var period = tab.getAttribute('data-period');
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        $$('.js-price').forEach(function (p) {
          var val = $('.js-price-value', p);
          var unit = $('.js-price-unit', p);
          val.textContent = p.getAttribute('data-' + period);
          unit.textContent = period === 'yearly' ? '/yr' : '/mo';
          if (hasGsap && !reduced) gsap.fromTo(p, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' });
        });
      });
    });
  })();

  // ------------------------------------------------------------------------
  // FAQ: question tabs drive the answer panel
  // ------------------------------------------------------------------------
  (function () {
    var root = $('.js-faq');
    if (!root) return;
    var tabs = $$('.js-faq-tab', root);
    var panes = $$('.js-faq-pane', root);
    function select(i, focus) {
      tabs.forEach(function (t, n) {
        var on = n === i;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      panes.forEach(function (p, n) {
        p.hidden = n !== i;
        if (n === i) {
          p.classList.remove('is-entering');
          void p.offsetWidth;
          p.classList.add('is-entering');
        }
      });
      if (focus) tabs[i].focus();
      if (hasST) ScrollTrigger.refresh();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); select((i + 1) % tabs.length, true); }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length, true); }
      });
    });
  })();

  // ------------------------------------------------------------------------
  // Odometer counters: first reel rolls down, the rest roll up
  // ------------------------------------------------------------------------
  $$('.js-odometer').forEach(function (wrap) {
    var value = String(wrap.getAttribute('data-value'));
    var suffix = wrap.getAttribute('data-suffix') || '';
    value.split('').forEach(function (d, i) {
      var reel = document.createElement('span');
      reel.className = 'c-counter__reel js-reel' + (i === 0 ? ' is-first' : '');
      reel.setAttribute('aria-hidden', 'true');
      var fill = d === '1' ? [2, 3, 4, 5, 6, 7, 8, 9] : [1, 2, 3, 4, 5, 6, 7, 8];
      [d].concat(fill, [d]).forEach(function (n) {
        var s = document.createElement('span');
        s.className = 'c-counter__digit';
        s.textContent = n;
        reel.appendChild(s);
      });
      wrap.appendChild(reel);
    });
    if (suffix) {
      var sx = document.createElement('span');
      sx.className = 'c-counter__digit';
      sx.setAttribute('aria-hidden', 'true');
      sx.textContent = suffix;
      wrap.appendChild(sx);
    }
  });

  // ------------------------------------------------------------------------
  // Scroll-spy: desktop nav + app tab bar
  // ------------------------------------------------------------------------
  var navLinks = $$('.js-nav');
  var tabs = $$('.js-tab');
  var tabFor = {
    home: 'home', services: 'services', about: 'services', why: 'services', process: 'services', cases: 'services',
    pricing: 'pricing', team: 'pricing', reviews: 'pricing', faq: 'contact', articles: 'contact', contact: 'contact'
  };
  function setNav(key) {
    navLinks.forEach(function (l) {
      var on = l.getAttribute('data-nav') === key;
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
    });
    // App chip rail: keep the active chip in view
    var rail = $('.js-appnav');
    var chip = rail ? $('.js-nav.is-active', rail) : null;
    if (chip && !isDesktop() && rail.getAttribute('data-active') !== key) {
      rail.setAttribute('data-active', key);
      rail.scrollTo({ left: chip.offsetLeft - (rail.clientWidth - chip.offsetWidth) / 2, behavior: reduced ? 'auto' : 'smooth' });
    }
  }
  function setTab(key) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-tab') === key;
      t.classList.toggle('is-active', on);
      if (on) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    });
  }
  function spy() {
    var line = window.innerHeight * 0.4;
    var secs = $$('.js-spy');
    var current = secs[0];
    secs.forEach(function (s) { if (s.getBoundingClientRect().top <= line) current = s; });
    if ((window.innerHeight + window.pageYOffset) >= document.documentElement.scrollHeight - 4) current = secs[secs.length - 1];
    var id = current.id || 'contact';
    setNav(current.getAttribute('data-spy'));
    setTab(tabFor[id] || 'home');
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      spy();
      var y = window.pageYOffset;
      if (header) header.classList.toggle('is-scrolled', y > 40);
      if (appbar) appbar.classList.toggle('is-scrolled', y > 8);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  if (lenis) lenis.on('scroll', onScroll);
  onScroll();

  // ------------------------------------------------------------------------
  // Motion (GSAP)
  // ------------------------------------------------------------------------
  if (!hasST || reduced) return;

  // Seamless loops (hero ticker + logo bands): clone the content once and
  // slide by half the track width.
  $$('.js-loop').forEach(function (track) {
    Array.prototype.slice.call(track.children).forEach(function (c) {
      var k = c.cloneNode(true);
      k.setAttribute('aria-hidden', 'true');
      track.appendChild(k);
    });
    var speed = parseFloat(track.getAttribute('data-speed')) || 40;
    var right = track.getAttribute('data-dir') === 'right';
    gsap.fromTo(track, { xPercent: right ? -50 : 0 }, { xPercent: right ? 0 : -50, duration: speed, ease: 'none', repeat: -1 });
  });

  // Section reveals: fade up 40px
  $$('.js-reveal').forEach(function (el) {
    var delay = parseFloat(el.getAttribute('data-delay')) || 0;
    gsap.fromTo(el, { autoAlpha: 0, y: 40 }, {
      autoAlpha: 1, y: 0, duration: 0.9, delay: delay, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    });
  });

  // Odometers: 3s linear roll when the number enters the viewport
  $$('.js-odometer').forEach(function (wrap) {
    var first = $$('.js-reel.is-first', wrap);
    var rest = $$('.js-reel:not(.is-first)', wrap);
    gsap.set(first, { yPercent: -90 });
    gsap.set(rest, { yPercent: 0 });
    var tl = gsap.timeline({ paused: true });
    tl.to(first, { yPercent: 0, duration: 2.6, ease: 'power2.out' }, 0)
      .to(rest, { yPercent: -90, duration: 2.6, ease: 'power2.out' }, 0);
    ScrollTrigger.create({ trigger: wrap, start: 'top 90%', once: true, onEnter: function () { tl.play(); } });
  });

  var mm = gsap.matchMedia();

  mm.add('(min-width: 992px)', function () {
    // Hero load: headline lines rise, photos scale in, copy fades up
    var heroTl = gsap.timeline({ delay: 0.1 });
    heroTl
      .fromTo('.js-hero-line', { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 }, 0)
      .fromTo('.c-hero__spark', { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, 0.5)
      .fromTo('.js-hero-img', { autoAlpha: 0, y: 80 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.15 }, 0.35)
      .fromTo('.js-hero-fade', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.12 }, 0.6);

    // Hero line-art drifts with scroll
    gsap.to('.c-hero__shape', {
      yPercent: -30, rotation: 8, ease: 'none',
      scrollTrigger: { trigger: '.c-hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // Why-us cards fan in from flat into their tilted collage
    var chooseTl = gsap.timeline({ scrollTrigger: { trigger: '.js-choose', start: 'top 85%', toggleActions: 'play none none none' } });
    $$('.js-choice').forEach(function (card, i) {
      var x = parseFloat(card.getAttribute('data-x')) || 0;
      var y = parseFloat(card.getAttribute('data-y')) || 0;
      var r = parseFloat(card.getAttribute('data-r')) || 0;
      chooseTl.fromTo(card,
        { x: x, y: y + 140, rotation: 0, autoAlpha: 0 },
        { x: x, y: y, rotation: r, autoAlpha: 1, duration: 1.1, ease: 'power3.out' }, i * 0.12);
    });

    return function () {
      gsap.set('.js-hero-line, .js-hero-img, .js-hero-fade, .c-hero__shape, .js-choice', { clearProps: 'all' });
    };
  });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
