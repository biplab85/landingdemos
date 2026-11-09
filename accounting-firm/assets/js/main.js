// ==========================================================================
// Author : Biplab Paul
// Email  : biplab.cse.85@gmail.com
// Phone  : 01735927356
// --------------------------------------------------------------------------
// SCRIPTS / MAIN — Sklentr Accounting & Advisory landing page.
// Desktop: Lenis smooth scroll + GSAP/ScrollTrigger scenes replicating the
// reference timings (hero load, char reveals, odometers, pinned services,
// fanning cards, motion-path team, process slide-ins, sticky CTA reveal).
// App (< 992px): app bar, tab bar scroll-spy, bottom sheet, snap rails,
// chip filters. Shared: nav scroll-spy, forms + toasts, FAQ, testimonials.
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

  if (hasST) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.MotionPathPlugin) gsap.registerPlugin(MotionPathPlugin);
  }

  // ------------------------------------------------------------------------
  // Year
  // ------------------------------------------------------------------------
  $$('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // ------------------------------------------------------------------------
  // Lenis smooth scroll (desktop only) — same duration as the reference
  // ------------------------------------------------------------------------
  var lenis = null;
  if (isDesktop() && !reduced && window.Lenis) {
    lenis = new Lenis({ duration: 1.4 });
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
  // Text helpers: char roll (hover) and split (reveal)
  // ------------------------------------------------------------------------
  function charsFrom(text, cls) {
    var frag = document.createDocumentFragment();
    Array.prototype.forEach.call(text, function (ch) {
      var s = document.createElement('span');
      s.className = cls;
      s.textContent = ch;
      frag.appendChild(s);
    });
    return frag;
  }

  function buildRoll(el) {
    var text = el.textContent.trim();
    el.textContent = '';
    el.setAttribute('aria-label', text);
    var a = document.createElement('span');
    a.className = 'c-roll__line';
    a.setAttribute('aria-hidden', 'true');
    a.appendChild(charsFrom(text, 'c-roll__char'));
    var b = a.cloneNode(true);
    b.className = 'c-roll__line c-roll__line--hover';
    el.appendChild(a);
    el.appendChild(b);
  }

  $$('.js-roll').forEach(buildRoll);

  // Hover roll: chars move up 100% with an even stagger (power2.out)
  if (hasGsap && !reduced) {
    $$('.js-btn, .c-nav__link').forEach(function (host) {
      var roll = $('.js-roll', host);
      if (!roll) return;
      var chars = $$('.c-roll__char', roll);
      var dur = parseFloat(roll.getAttribute('data-roll-duration')) || 0.5;
      var trigger = host.closest('.c-case, .c-news') || host;
      trigger.addEventListener('mouseenter', function () {
        gsap.to(chars, { yPercent: -100, duration: dur, ease: 'power2.out', stagger: { amount: 0.2 }, overwrite: true });
      });
      trigger.addEventListener('mouseleave', function () {
        gsap.to(chars, { yPercent: 0, duration: dur, ease: 'power2.out', stagger: { amount: 0.2, from: 'end' }, overwrite: true });
      });
    });
  }

  // Split headings into words > chars, keeping forced line-break spans
  function splitInto(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        var parts = child.textContent.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span');
          w.className = 'c-split__word';
          w.appendChild(charsFrom(part, 'c-split__char'));
          frag.appendChild(w);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) {
        splitInto(child);
      }
    });
  }

  $$('.js-split').forEach(function (el) {
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    splitInto(el);
    $$('.c-split__word', el).forEach(function (w) { w.setAttribute('aria-hidden', 'true'); });
  });

  // ------------------------------------------------------------------------
  // Odometer counters (reels of 10 digits; first reel rolls down, others up)
  // ------------------------------------------------------------------------
  $$('.js-odometer').forEach(function (wrap) {
    var value = String(wrap.getAttribute('data-value'));
    var suffix = wrap.firstElementChild;
    value.split('').forEach(function (d, i) {
      var col = document.createElement('span');
      col.className = 'c-stat__col';
      col.setAttribute('aria-hidden', 'true');
      var reel = document.createElement('span');
      reel.className = 'c-stat__reel js-reel' + (i === 0 ? ' is-first' : '');
      var digits = [d];
      var fill = d === '1' ? [2, 3, 4, 5, 6, 7, 8, 9] : [1, 2, 3, 4, 5, 6, 7, 8];
      digits = digits.concat(fill, [d]);
      digits.forEach(function (n) {
        var s = document.createElement('span');
        s.className = 'c-stat__digit';
        s.style.display = 'block';
        s.textContent = n;
        reel.appendChild(s);
      });
      col.appendChild(reel);
      wrap.insertBefore(col, suffix);
    });
    suffix.setAttribute('aria-hidden', 'true');
  });

  // ------------------------------------------------------------------------
  // Scroll helpers (anchor links)
  // ------------------------------------------------------------------------
  function headerOffset() {
    if (isDesktop()) {
      var h = $('.js-header');
      return h ? h.offsetHeight : 0;
    }
    var bar = $('.js-appbar');
    return bar ? bar.offsetHeight + 8 : 0;
  }

  function scrollToTarget(target) {
    if (!target) return;
    var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
    if (target.id === 'home') top = 0;
    if (lenis) lenis.scrollTo(top, { duration: 1.4 });
    else window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
  }

  $$('.js-scroll').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) !== '#') return;
      if (a.classList.contains('js-open-sheet-app') && !isDesktop()) return; // handled by sheet
      var t = document.getElementById(href.slice(1));
      if (!t) return;
      e.preventDefault();
      scrollToTarget(t);
    });
  });

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
    var wrap = input.closest('.c-field, .c-newsletter');
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
  // Bottom sheet (app) — also usable on desktop as a centred dialog
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
  $$('.js-open-sheet-app').forEach(function (b) {
    b.addEventListener('click', function (e) {
      if (isDesktop()) return;
      e.preventDefault();
      openSheet(b);
    });
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
  // FAQ accordion (height 0 <-> auto, plus collapses to minus)
  // ------------------------------------------------------------------------
  $$('.js-faq-item').forEach(function (item) {
    var btn = $('.js-faq-toggle', item);
    var panel = $('.js-faq-panel', item);
    btn.addEventListener('click', function () {
      var open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (hasGsap && !reduced) {
        gsap.to(panel, {
          height: open ? 'auto' : 0, duration: 0.5, ease: 'power1.out',
          onComplete: function () { if (hasST) ScrollTrigger.refresh(); }
        });
      } else {
        panel.style.height = open ? 'auto' : '0px';
      }
    });
  });

  // ------------------------------------------------------------------------
  // Testimonials: cross-fade slider (arrows, dots, swipe)
  // ------------------------------------------------------------------------
  (function () {
    var root = $('.js-reviews');
    if (!root) return;
    var slides = $$('.js-review-slide', root);
    var dots = $$('.js-review-dots span', root);
    var index = 0;
    function go(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        s.classList.toggle('is-active', n === index);
        s.setAttribute('aria-hidden', n === index ? 'false' : 'true');
      });
      dots.forEach(function (d, n) { d.classList.toggle('is-active', n === index); });
    }
    $('.js-review-prev', root).addEventListener('click', function () { go(index - 1); });
    $('.js-review-next', root).addEventListener('click', function () { go(index + 1); });
    var sx = null;
    root.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      sx = null;
    });
    go(0);
  })();

  // ------------------------------------------------------------------------
  // Background video play / pause
  // ------------------------------------------------------------------------
  (function () {
    var v = $('.js-cta-video');
    var b = $('.js-video-toggle');
    if (!v || !b) return;
    if (reduced) { v.removeAttribute('autoplay'); v.pause(); b.classList.add('is-paused'); }
    b.addEventListener('click', function () {
      if (v.paused) { v.play(); b.classList.remove('is-paused'); b.setAttribute('aria-label', 'Pause background video'); }
      else { v.pause(); b.classList.add('is-paused'); b.setAttribute('aria-label', 'Play background video'); }
    });
  })();

  // ------------------------------------------------------------------------
  // App: team rail (cloned from the motion-path cards) + case filter chips
  // ------------------------------------------------------------------------
  (function () {
    var rail = $('.js-rail[data-rail="team"]');
    if (!rail) return;
    $$('.js-motion-item .c-member').forEach(function (m) {
      var c = m.cloneNode(true);
      c.classList.remove('js-member');
      $$('img', c).forEach(function (img) { img.loading = 'lazy'; });
      rail.appendChild(c);
    });
    $$('a.js-scroll', rail).forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        scrollToTarget(document.getElementById('contact'));
      });
    });
  })();

  $$('.js-chips').forEach(function (bar) {
    var chips = $$('.c-chip', bar);
    var cards = $$('.js-case');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.getAttribute('data-filter');
        chips.forEach(function (c) {
          var on = c === chip;
          c.classList.toggle('is-active', on);
          c.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        cards.forEach(function (card) {
          card.hidden = !(f === 'all' || card.getAttribute('data-cat') === f);
        });
      });
    });
  });

  // ------------------------------------------------------------------------
  // Scroll-spy: desktop nav icon chip + app tab bar
  // ------------------------------------------------------------------------
  var navLinks = $$('.js-nav');
  var tabs = $$('.js-tab');
  var tabFor = {
    home: 'home', about: 'home', services: 'services', why: 'services', team: 'services',
    process: 'services', results: 'results', reviews: 'results', faq: 'contact', contact: 'contact', insights: 'contact'
  };
  function setNav(key) {
    navLinks.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('data-nav') === key); });
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
    var current = null;
    $$('.js-spy').forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) current = s;
    });
    if (!current) {
      var secs = $$('.js-spy');
      current = window.pageYOffset < 50 ? secs[0] : secs[secs.length - 1];
      if ((window.innerHeight + window.pageYOffset) < document.documentElement.scrollHeight - 4 && window.pageYOffset >= 50) {
        // between sections (e.g. marquee band): keep the last one passed
        secs.forEach(function (s) { if (s.getBoundingClientRect().top <= line) current = s; });
      }
    }
    if (!current) return;
    setNav(current.getAttribute('data-spy'));
    setTab(tabFor[current.id] || 'home');
  }

  var appbar = $('.js-appbar');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      spy();
      if (appbar) appbar.classList.toggle('is-scrolled', window.pageYOffset > 8);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  if (lenis) lenis.on('scroll', onScroll);
  spy();

  // ------------------------------------------------------------------------
  // Motion (GSAP) — reference interactions
  // ------------------------------------------------------------------------
  if (!hasST || reduced) {
    $$('.js-motion-item').forEach(function (i) { i.style.visibility = 'visible'; i.style.opacity = 1; });
    $$('.c-member__tag').forEach(function (t) { t.style.opacity = 1; t.style.transform = 'none'; });
    return;
  }

  var mm = gsap.matchMedia();

  // Shared on all sizes ---------------------------------------------------------------

  // Section headings: eyebrow up, title chars grow (scaleY) from the baseline
  $$('.js-heading').forEach(function (box) {
    var eyebrow = $('.js-eyebrow', box);
    var chars = $$('.c-split__char', box);
    var btn = box.parentElement ? $('.js-heading-btn', box.parentElement) : null;
    var tl = gsap.timeline({ scrollTrigger: { trigger: box, start: 'top bottom', toggleActions: 'play none none none' } });
    if (eyebrow) tl.fromTo(eyebrow, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.inOut' }, 0);
    if (chars.length) tl.fromTo(chars, { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'power2.inOut', stagger: 0.02 }, 0.1);
    if (btn) tl.fromTo(btn, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.inOut' }, 0.5);
  });

  // Parallax images (-10% -> 10%)
  $$('.js-parallax').forEach(function (wrap) {
    var img = $('.js-parallax-img', wrap) || $('img', wrap);
    gsap.fromTo(img, { yPercent: -10 }, {
      yPercent: 10, ease: 'none',
      scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  // Odometers: 3s linear roll when the number enters the viewport
  $$('.js-odometer').forEach(function (wrap) {
    var first = $$('.js-reel.is-first', wrap);
    var rest = $$('.js-reel:not(.is-first)', wrap);
    gsap.set(first, { yPercent: -90 });
    gsap.set(rest, { yPercent: 0 });
    var tl = gsap.timeline({ paused: true });
    tl.to(first, { yPercent: 0, duration: 3, ease: 'none' }, 0)
      .to(rest, { yPercent: -90, duration: 3, ease: 'none' }, 0);
    ScrollTrigger.create({ trigger: wrap, start: 'top bottom', once: true, onEnter: function () { tl.play(); } });
  });

  // Right-to-left tickers (20s loop)
  $$('.js-ticker').forEach(function (track) {
    gsap.to(track, { xPercent: -50, duration: 20, ease: 'none', repeat: -1 });
  });

  // Slide-in presets (Webflow "slide in": 100px, outQuart, 1s)
  $$('.js-slide').forEach(function (el) {
    var from = el.getAttribute('data-from') || 'bottom';
    var delay = parseFloat(el.getAttribute('data-delay')) || 0;
    var vars = { autoAlpha: 0 };
    if (from === 'left') vars.x = -100;
    else if (from === 'right') vars.x = 100;
    else vars.y = 100;
    gsap.fromTo(el, vars, {
      autoAlpha: 1, x: 0, y: 0, duration: 1, delay: delay, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' }
    });
  });

  // Case cards slide up (staggered by grid order)
  $$('.js-case').forEach(function (el) {
    gsap.fromTo(el, { autoAlpha: 0, y: 100 }, {
      autoAlpha: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' }
    });
  });

  // Insight cards: fade up 30px, stagger 0.2
  (function () {
    var grid = $('.js-news-grid');
    if (!grid) return;
    gsap.fromTo($$('.js-news', grid), { autoAlpha: 0, y: 30 }, {
      autoAlpha: 1, y: 0, duration: 0.4, delay: 0.2, stagger: 0.2, ease: 'power1.out',
      scrollTrigger: { trigger: grid, start: 'top 70%', toggleActions: 'play none none none' }
    });
  })();

  // FAQ items slide in from the right
  (function () {
    var grid = $('.js-faq');
    if (!grid) return;
    gsap.fromTo($$('.js-faq-item', grid), { autoAlpha: 0, x: 60 }, {
      autoAlpha: 1, x: 0, duration: 0.6, delay: 0.5, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: grid, start: 'top 85%', toggleActions: 'play none none none' }
    });
  })();

  // Team member hover: image zoom + tags slide in
  $$('.c-member').forEach(function (m) {
    var img = $('.c-member__media img', m);
    var tags = $$('.c-member__tag', m);
    var tl = gsap.timeline({ paused: true });
    tl.to(img, { scale: 1.05, duration: 0.3, ease: 'power1.inOut' }, 0)
      .to(tags, { x: 0, autoAlpha: 1, duration: 0.3, ease: 'power1.inOut', stagger: 0.1 }, 0.1);
    m.addEventListener('mouseenter', function () { tl.play(); });
    m.addEventListener('mouseleave', function () { tl.reverse(); });
    m.addEventListener('focus', function () { tl.play(); });
    m.addEventListener('blur', function () { tl.reverse(); });
  });

  // Desktop-only scenes ---------------------------------------------------------------
  mm.add('(min-width: 992px)', function () {

    // Hero load timeline (reference t-fd401045 + t-38aae3c7)
    var heroTl = gsap.timeline({ delay: 0.15 });
    heroTl
      .fromTo('.js-hero-rating', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power1.out' }, 0)
      .fromTo('.js-hero-title .c-split__char', { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'power2.inOut', stagger: 0.02 }, 0.2)
      .fromTo('.js-hero-text', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power1.out' }, 1)
      .fromTo('.js-hero-actions', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power1.out' }, 1.3)
      .fromTo('.js-hero-images', { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power1.out' }, 1.7)
      .fromTo('.js-hero-img[data-img="1"]', { xPercent: 201, y: 210 }, { xPercent: 105, y: 110, duration: 0.5, ease: 'power1.out' }, 2)
      .fromTo('.js-hero-img[data-img="5"]', { xPercent: -201, y: 210 }, { xPercent: -105, y: 110, duration: 0.5, ease: 'power1.out' }, 2)
      .fromTo('.js-hero-img[data-img="2"]', { xPercent: 116, y: 100 }, { xPercent: 0, y: 0, duration: 0.5, ease: 'power1.out' }, 2)
      .fromTo('.js-hero-img[data-img="4"]', { xPercent: -116, y: 100 }, { xPercent: 0, y: 0, duration: 0.5, ease: 'power1.out' }, 2)
      .to('.js-hero-img[data-img="1"]', { xPercent: 0, y: 0, duration: 0.5, ease: 'power1.out' }, 2.6)
      .to('.js-hero-img[data-img="5"]', { xPercent: 0, y: 0, duration: 0.5, ease: 'power1.out' }, 2.6);

    // Marquee portrait rises from below (scrub 0.8)
    gsap.fromTo('.js-marquee-figure', { yPercent: 100 }, {
      yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '.js-marquee-section', start: 'top 200%', end: 'bottom 100%', scrub: 0.8 }
    });

    // Services: horizontal travel of the full-width cards
    gsap.fromTo('.js-practice-item', { xPercent: 0 }, {
      xPercent: -204, ease: 'none',
      scrollTrigger: { trigger: '.js-practice-stage', start: 'top 10%', end: '65% top', scrub: 0.8 }
    });

    // Why cards: fan in with scroll progress (0-40% tilted, 60% settled)
    var startX = { 1: 400, 2: 80, 3: -80, 4: -400 };
    var startR = { 1: 15, 2: -15, 3: 15, 4: -15 };
    var whyTl = gsap.timeline({
      scrollTrigger: { trigger: '.js-why', start: 'top bottom', end: 'bottom top', scrub: 1.2 }
    });
    $$('.js-why-card').forEach(function (card) {
      var i = card.getAttribute('data-i');
      gsap.set(card, { x: startX[i], rotation: startR[i] });
      whyTl.to(card, { x: 0, duration: 0.6, ease: 'none' }, 0)
        .to(card, { rotation: 0, duration: 0.2, ease: 'none' }, 0.4);
    });
    whyTl.to({}, { duration: 0.4 }, 0.6);

    // Team: cards travel along the SVG path (reference initImagesOnPathScroll)
    (function () {
      var wrap = $('.js-motion-wrap');
      if (!wrap || !window.MotionPathPlugin) return;
      var path = $('.js-motion-path', wrap);
      var items = $$('.js-motion-item', wrap);
      gsap.set(items, { zIndex: function (i, t, all) { return all.length - i; } });
      var tl = gsap.timeline({
        scrollTrigger: { trigger: wrap, start: 'top top', end: 'bottom bottom', scrub: true },
        defaults: { ease: 'none', stagger: 0.3 }
      });
      tl.to(items, { duration: 1, motionPath: { path: path, align: path, curviness: 2, alignOrigin: [0.5, 0.5] } })
        .fromTo(items, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0)
        .fromTo(items, { filter: 'blur(1.5em)' }, { filter: 'blur(0em)', duration: 0.5 }, 0)
        .fromTo(items, { scale: 0.4 }, { scale: 1, duration: 0.65 }, 0)
        .to(items, { autoAlpha: 0, filter: 'blur(1em)', duration: 0.15 }, 0.85);
      $$('.js-member', wrap).forEach(function (m) {
        gsap.fromTo(m, { autoAlpha: 0, y: 30 }, {
          autoAlpha: 1, y: 0, duration: 0.4, delay: 0.2, ease: 'power1.out',
          scrollTrigger: { trigger: wrap, start: 'top 70%', toggleActions: 'play none none none' }
        });
      });
    })();

    // Process steps slide in from the right (scrub 0.8)
    (function () {
      var grid = $('.js-process');
      if (!grid) return;
      var steps = $$('.js-step', grid);
      var tl = gsap.timeline({ scrollTrigger: { trigger: grid, start: 'top bottom', end: 'bottom 80%', scrub: 0.8 } });
      tl.fromTo(steps[0], { xPercent: 110, opacity: 0.35 }, { xPercent: 0, opacity: 1, duration: 0.5, ease: 'none' }, 0)
        .fromTo(steps[1], { xPercent: 113, opacity: 0.35 }, { xPercent: 0, opacity: 1, duration: 0.37, ease: 'none' }, 0.28)
        .fromTo(steps[2], { xPercent: 113, opacity: 0.35 }, { xPercent: 0, opacity: 1, duration: 0.37, ease: 'none' }, 0.45)
        .to({}, { duration: 0.18 }, 0.82);
    })();

    return function () {
      gsap.set('.js-hero-img, .js-practice-item, .js-why-card, .js-marquee-figure', { clearProps: 'all' });
    };
  });

  // App-only: light entrance for cards
  mm.add('(max-width: 991.98px)', function () {
    gsap.fromTo('.js-hero-title .c-split__char', { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'power2.inOut', stagger: 0.015, delay: 0.1 });
    $$('.js-motion-item').forEach(function (i) { i.style.visibility = 'visible'; i.style.opacity = 1; });
  });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
