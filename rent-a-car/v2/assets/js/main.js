/*!
 * ==========================================================================
 * Author : Biplab Paul
 * Email  : biplab.cse.85@gmail.com
 * Phone  : 01735927356
 * --------------------------------------------------------------------------
 * Rovix — Rent-a-Car · landing page v2 · main.js
 * UI: section nav + bottom tab bar (scroll-spy), search & newsletter forms, FAQ / journey accordions,
 * pricing tabs, location map, testimonial slider (phone).
 * Motion: GSAP + ScrollTrigger (load intro, heading reveals, pinned services
 * rail, scroll-driven process & testimonial ring, car orbit), Lenis on
 * desktop pointers. Hooks are js-* classes / data-* attributes only.
 * ==========================================================================
 */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var clamp = function (v, min, max) { return Math.min(max, Math.max(min, v)); };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var lenis = null;

  /* ------------------------------------------------------------------------
   * Year
   * ---------------------------------------------------------------------- */
  $$('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ------------------------------------------------------------------------
   * Scroll-spy: .js-spy-group menus hold .js-spy-link[data-spy] links.
   * The active section is the last spied section whose top has passed a
   * line 40% down the viewport. Positions are read live with
   * getBoundingClientRect, so tall sticky tracks / ScrollTrigger spacers
   * are always accounted for (no cached offsets to go stale).
   * ---------------------------------------------------------------------- */
  function initSpy() {
    // Each menu (desktop nav, phone tab bar) spies on its own targets, so a
    // section without a tab (e.g. Locations on phones) keeps the previous
    // tab lit instead of clearing the bar.
    var groups = $$('.js-spy-group').map(function (menu) {
      var links = $$('.js-spy-link', menu);
      var ids = [];
      links.forEach(function (l) {
        var id = l.getAttribute('data-spy');
        if (ids.indexOf(id) === -1 && document.getElementById(id)) ids.push(id);
      });
      return { links: links, ids: ids, current: null };
    }).filter(function (g) { return g.ids.length; });
    if (!groups.length) return;
    var ticking = false;

    function setActive(group, id) {
      if (id === group.current) return;
      group.current = id;
      group.links.forEach(function (l) {
        var on = l.getAttribute('data-spy') === id;
        l.classList.toggle('is-active', on);
        if (on) l.setAttribute('aria-current', 'true');
        else l.removeAttribute('aria-current');
      });
    }

    function update() {
      ticking = false;
      var line = window.innerHeight * 0.4;
      var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      groups.forEach(function (g) {
        var active = g.ids[0];
        for (var i = 0; i < g.ids.length; i++) {
          if (document.getElementById(g.ids[i]).getBoundingClientRect().top - line <= 0) active = g.ids[i];
        }
        if (atBottom) active = g.ids[g.ids.length - 1];
        setActive(g, active);
      });
    }

    function request() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    window.addEventListener('load', request);
    if (window.ScrollTrigger) window.ScrollTrigger.addEventListener('refresh', request);
    update();
  }

  /* ------------------------------------------------------------------------
   * Smooth anchor scrolling (Lenis-aware)
   * ---------------------------------------------------------------------- */
  function initAnchors() {
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var target = document.getElementById(id.slice(1));
        if (!target) return;
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(target, { offset: target.id === 'top' ? 0 : -16 });
        } else {
          target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
   * Forms (demo only — no backend)
   * ---------------------------------------------------------------------- */
  function initForms() {
    var search = $('.js-search-form');
    var searchNote = $('.js-search-note');
    if (search && searchNote) {
      search.addEventListener('submit', function (e) {
        e.preventDefault();
        searchNote.hidden = false;
      });
    }

    var news = $('.js-newsletter');
    var newsNote = $('.js-newsletter-note');
    if (news && newsNote) {
      news.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = news.querySelector('input[type="email"]');
        var ok = input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        newsNote.hidden = false;
        newsNote.textContent = ok
          ? 'You are on the list — new arrivals and offers will land in your inbox soon.'
          : 'Please enter a valid email address so we can reach you.';
        if (ok) news.reset();
      });
    }
  }

  /* ------------------------------------------------------------------------
   * FAQ accordion (one open at a time)
   * ---------------------------------------------------------------------- */
  function initFaq() {
    var items = $$('.js-faq-item');
    items.forEach(function (item) {
      var btn = $('.js-faq-question', item);
      if (!btn) return;
      btn.addEventListener('click', function () {
        var open = !item.classList.contains('is-open');
        items.forEach(function (other) {
          other.classList.remove('is-open');
          var b = $('.js-faq-question', other);
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        item.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
      });
    });
  }

  /* ------------------------------------------------------------------------
   * Journey finder accordion (one open; click again to close)
   * ---------------------------------------------------------------------- */
  function initFinder() {
    var rows = $$('.js-finder-row');
    rows.forEach(function (row) {
      var btn = $('.js-finder-trigger', row);
      if (!btn) return;
      btn.addEventListener('click', function () {
        var open = !row.classList.contains('is-open');
        rows.forEach(function (r) {
          r.classList.remove('is-open');
          var b = $('.js-finder-trigger', r);
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        row.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
        // Layout height changes: let ScrollTrigger re-measure after the tween.
        if (window.ScrollTrigger) setTimeout(function () { window.ScrollTrigger.refresh(); }, 750);
      });
    });
  }

  /* ------------------------------------------------------------------------
   * Pricing tabs: highlight the matching plan
   * ---------------------------------------------------------------------- */
  function initPricing() {
    var tabs = $$('.js-plan-tab');
    var plans = $$('.js-plan');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var idx = parseInt(tab.getAttribute('data-plan'), 10) || 0;
        tabs.forEach(function (t, i) {
          t.classList.toggle('is-active', i === idx);
          t.setAttribute('aria-selected', String(i === idx));
        });
        plans.forEach(function (plan, i) {
          plan.classList.toggle('is-featured', i === idx);
          var cta = $('.js-plan-cta', plan);
          if (cta) cta.classList.toggle('c-btn--outline', i !== idx);
        });
        // Phone rail: bring the chosen plan into view.
        var rail = plans[idx] && plans[idx].parentElement;
        if (rail && rail.scrollWidth > rail.clientWidth + 1) {
          var pad = parseFloat(window.getComputedStyle(rail).paddingLeft) || 0;
          rail.scrollTo({ left: rail.scrollLeft + plans[idx].getBoundingClientRect().left - rail.getBoundingClientRect().left - pad, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
   * Locations map: list items + pins switch photo, popup and states
   * ---------------------------------------------------------------------- */
  function initLocations() {
    var spots = $$('.js-spot');
    var pins = $$('.js-pin');
    var bgs = $$('.js-loc-bg');
    var popups = $$('.js-popup');

    function activate(idx) {
      spots.forEach(function (s, i) {
        s.classList.toggle('is-active', i === idx);
        s.setAttribute('aria-pressed', String(i === idx));
      });
      [pins, bgs, popups].forEach(function (group) {
        group.forEach(function (el, i) { el.classList.toggle('is-active', i === idx); });
      });
    }

    spots.concat(pins).forEach(function (el) {
      el.addEventListener('click', function () {
        activate(parseInt(el.getAttribute('data-spot'), 10) || 0);
      });
    });
  }

  /* ------------------------------------------------------------------------
   * About: pause / resume the ambient drift
   * ---------------------------------------------------------------------- */
  function initAboutPlay() {
    var btn = $('.js-about-play');
    var media = $('.js-about-media');
    if (!btn || !media) return;
    btn.addEventListener('click', function () {
      var paused = media.classList.toggle('is-paused');
      btn.classList.toggle('is-paused', paused);
      btn.setAttribute('aria-label', paused ? 'Play background motion' : 'Pause background motion');
    });
  }

  /* ------------------------------------------------------------------------
   * Process steps: shared state setter (scroll-driven on desktop,
   * click-driven everywhere)
   * ---------------------------------------------------------------------- */
  var processSteps = $$('.js-process-step');
  var processImages = $$('.js-process-image');
  var processCounters = $$('.js-process-counter');
  var processFills = $$('.js-process-fill');
  var processCurrent = -1;

  function setProcess(progress) {
    var total = processSteps.length || 3;
    var idx = clamp(Math.floor(progress * total), 0, total - 1);
    processFills.forEach(function (fill, i) {
      fill.style.transform = 'scaleX(' + clamp(progress * total - i, 0, 1) + ')';
    });
    if (idx === processCurrent) return;
    processCurrent = idx;
    [processSteps, processImages, processCounters].forEach(function (group) {
      group.forEach(function (el, i) { el.classList.toggle('is-active', i === idx); });
    });
  }

  function initProcessClicks() {
    processSteps.forEach(function (step, i) {
      step.style.cursor = 'pointer';
      step.addEventListener('click', function () {
        var track = $('.js-process-track');
        if (window.ScrollTrigger && track && track.offsetHeight > window.innerHeight * 1.5 && lenis) {
          var top = track.getBoundingClientRect().top + window.scrollY;
          var span = track.offsetHeight - window.innerHeight;
          lenis.scrollTo(top + span * ((i + 0.5) / processSteps.length));
        } else {
          setProcess((i + 0.999) / processSteps.length);
        }
      });
    });
    setProcess(0);
  }

  /* ------------------------------------------------------------------------
   * Testimonials: phone slider (Swiper) built from the review grid
   * ---------------------------------------------------------------------- */
  var testiReviews = $$('.js-testi-review');

  function initTestiSlider() {
    var slider = $('.js-testi-slider');
    var wrap = $('.js-testi-slides');
    if (!slider || !wrap || !testiReviews.length) return;

    testiReviews.forEach(function (review) {
      var slide = document.createElement('div');
      slide.className = 'swiper-slide';
      var clone = review.cloneNode(true);
      clone.classList.remove('is-hidden', 'js-testi-review');
      slide.appendChild(clone);
      wrap.appendChild(slide);
    });

    if (typeof window.Swiper !== 'function') return;
    var swiper = null;
    var mq = window.matchMedia('(max-width: 479.98px)');

    function sync() {
      if (mq.matches && !swiper) {
        swiper = new window.Swiper(slider, {
          slidesPerView: 1,
          spaceBetween: 28,
          loop: true,
          speed: 500,
          navigation: { nextEl: '.js-testi-next', prevEl: '.js-testi-prev' },
          a11y: { enabled: true }
        });
      } else if (!mq.matches && swiper) {
        swiper.destroy(true, true);
        swiper = null;
      }
    }

    sync();
    if (mq.addEventListener) mq.addEventListener('change', sync);
    else if (mq.addListener) mq.addListener(sync);
  }

  /* ------------------------------------------------------------------------
   * Motion (GSAP + ScrollTrigger + Lenis)
   * ---------------------------------------------------------------------- */
  function initMotion() {
    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger || reduceMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('has-motion');

    // Smooth wheel scrolling on desktop pointers only (native on touch).
    if (finePointer && typeof window.Lenis === 'function') {
      lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    var EASE = 'power3.out';

    // --- Hero intro ---------------------------------------------------------
    var heroIn = $$('[data-hero-in]');
    var intro = gsap.timeline({ defaults: { ease: EASE } });
    intro
      .from('.c-nav', { autoAlpha: 0, duration: 0.6, ease: 'power2.out' }, 0)
      .from('.c-hero__head .c-badge', { autoAlpha: 0, yPercent: 40, duration: 0.6 }, 0.1)
      .from('.c-hero__title', { autoAlpha: 0, yPercent: 30, duration: 0.7 }, 0.5)
      .from('.js-hero-image', {
        autoAlpha: 0, xPercent: -18, rotationY: 14, transformPerspective: 1200,
        transformOrigin: '50% 50%', duration: 1.6
      }, 0.2)
      .from('.js-hero-display', { autoAlpha: 0, duration: 1.2, ease: 'power2.out' }, 0.3)
      .from('.c-hero__booking', { autoAlpha: 0, y: 40, duration: 0.8 }, 0.7);
    if (!heroIn.length) intro.progress(1);

    // Idle float on the hero car.
    gsap.to('.js-hero-image', { yPercent: -2.5, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.8 });

    // --- Heading reveal (site-wide) -----------------------------------------
    $$('.js-reveal-heading').forEach(function (el) {
      gsap.from(el, {
        autoAlpha: 0, yPercent: 30, duration: 0.9, ease: EASE,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    });

    // --- Section heads (about / fleet / services / process) -----------------
    $$('.js-head').forEach(function (head) {
      gsap.from(head.children, {
        autoAlpha: 0, yPercent: 12, duration: 0.9, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: head, start: 'top 85%', once: true }
      });
    });

    // --- About ---------------------------------------------------------------
    var copy = $('.js-fade-copy');
    if (copy) {
      gsap.fromTo(copy, { opacity: 0.25 }, {
        opacity: 1, ease: 'none',
        scrollTrigger: { trigger: copy, start: 'top 85%', end: 'bottom 45%', scrub: 1 }
      });
    }
    $$('.js-stagger').forEach(function (group) {
      gsap.from(group.children, {
        autoAlpha: 0, y: 40, duration: 0.8, stagger: 0.12, ease: EASE,
        scrollTrigger: { trigger: group, start: 'top 85%', once: true }
      });
    });

    // --- Fleet ---------------------------------------------------------------
    $$('.js-car-body').forEach(function (body) {
      gsap.from(body, {
        autoAlpha: 0, yPercent: 12, duration: 0.7, ease: EASE,
        scrollTrigger: { trigger: body, start: 'top 85%', once: true }
      });
    });

    // --- Breakpoint-specific scroll scenes ----------------------------------
    var mm = gsap.matchMedia();

    mm.add('(min-width: 992px)', function () {
      // Hero: car shrinks & drives down into the next section; ghost word drifts.
      var hero = $('.js-hero');
      gsap.timeline({
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 }
      })
        .to('.js-hero-media', { scale: 0.55, yPercent: 148, ease: 'none', duration: 1 }, 0)
        .to('.js-hero-media', { autoAlpha: 0, ease: 'none', duration: 0.12 }, 0.86)
        .to('.js-hero-display', { xPercent: -8, ease: 'none', duration: 1 }, 0);

      // About: black veil lifts off the media panel.
      var tone = $('.js-about-tone');
      if (tone) {
        gsap.timeline({
          scrollTrigger: { trigger: '.js-about-media', start: 'top 90%', end: 'top 15%', scrub: 1 }
        }).fromTo(tone, { opacity: 1 }, { opacity: 0, duration: 0.12, ease: 'none' }, 0.38)
          .set({}, {}, 1);
      }

      // Fleet photo parallax.
      $$('.js-parallax').forEach(function (img) {
        gsap.fromTo(img, { yPercent: -6 }, {
          yPercent: 6, ease: 'none',
          scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 }
        });
      });

      // Services: horizontal rail driven by the 300vh track.
      var track = $('.js-services-track');
      var list = $('.js-services-list');
      if (track && list) {
        gsap.to(list, {
          x: function () { return -(list.scrollWidth - list.parentElement.clientWidth); },
          ease: 'none',
          scrollTrigger: {
            trigger: track, start: 'top top', end: 'bottom bottom', scrub: 1,
            invalidateOnRefresh: true
          }
        });
      }

      // Process: steps, images, counter and progress follow the track.
      var ptrack = $('.js-process-track');
      if (ptrack) {
        ScrollTrigger.create({
          trigger: ptrack, start: 'top top', end: 'bottom bottom',
          onUpdate: function (self) { setProcess(self.progress); }
        });
      }

      // Reasons: media zooms out, columns slide in from both sides.
      var reasons = $('.js-reasons');
      if (reasons) {
        var rtl = gsap.timeline({
          scrollTrigger: { trigger: reasons, start: 'top 80%', end: 'center 55%', scrub: 1 }
        });
        rtl.fromTo('.js-reasons-image', { scale: 1.5, xPercent: -25 }, { scale: 1, xPercent: 0, duration: 1, ease: 'power2.out' }, 0)
          .from('.js-reasons-head', { autoAlpha: 0, yPercent: -30, duration: 0.6, ease: 'power2.out' }, 0);
        $$('.js-reasons-col').forEach(function (col) {
          rtl.from(col, { autoAlpha: 0, xPercent: parseFloat(col.getAttribute('data-from')) || 0, duration: 0.8, ease: 'power2.out' }, 0.2);
        });
      }

      // Finder reveal.
      var finder = $('.js-finder');
      if (finder) {
        gsap.timeline({ scrollTrigger: { trigger: finder, start: 'top 80%', end: 'center 55%', scrub: 1 } })
          .from('.js-finder-head', { autoAlpha: 0, yPercent: -30, duration: 0.6, ease: 'power2.out' }, 0)
          .from('.js-finder-row', { autoAlpha: 0, yPercent: 30, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, 0.2);
      }

      // Locations reveal.
      var locs = $('.js-locations-section');
      if (locs) {
        gsap.timeline({ scrollTrigger: { trigger: locs, start: 'top 80%', end: 'center 55%', scrub: 1 } })
          .from('.js-locations-head', { autoAlpha: 0, yPercent: -30, duration: 0.6, ease: 'power2.out' }, 0)
          .from('.js-locations', { autoAlpha: 0, yPercent: 20, duration: 0.8, ease: 'power2.out' }, 0.2);
      }

      // Pricing reveal.
      var pricing = $('.js-pricing-section');
      if (pricing) {
        gsap.timeline({ scrollTrigger: { trigger: pricing, start: 'top 80%', end: 'center 55%', scrub: 1 } })
          .from('.js-pricing-head', { autoAlpha: 0, yPercent: -30, duration: 0.6, ease: 'power2.out' }, 0)
          .from(['.js-pricing-tabs', '.js-pricing-grid'], { autoAlpha: 0, yPercent: 20, duration: 0.8, ease: 'power2.out' }, 0.2);
      }

      // Testimonials: ring turns, avatars stay upright, quotes cross-fade.
      var testi = $('.js-testi');
      var ring = $('.js-testi-ring');
      if (testi && ring) {
        // Slot angles live in CSS (--a); the ring's turn is shared via --ring
        // so each avatar counter-rotates and stays upright.
        var fill = $('.js-testi-fill');
        var current = -1;
        var turn = { r: 0 };
        var applyTurn = function () {
          ring.style.setProperty('--ring', turn.r + 'deg');
          ring.style.transform = 'rotate(' + turn.r + 'deg)';
        };
        gsap.to(turn, {
          r: -150, ease: 'none', onUpdate: applyTurn,
          scrollTrigger: { trigger: testi, start: 'top top', end: 'bottom bottom', scrub: 1 }
        });
        ScrollTrigger.create({
          trigger: testi, start: 'top top', end: 'bottom bottom',
          onUpdate: function (self) {
            var p = self.progress;
            if (fill) gsap.set(fill, { xPercent: -83 + 83 * p });
            var idx = clamp(Math.floor(p * testiReviews.length), 0, testiReviews.length - 1);
            if (idx !== current) {
              current = idx;
              testiReviews.forEach(function (r, i) { r.classList.toggle('is-hidden', i !== idx); });
            }
          }
        });
      }

      // FAQ reveal.
      var faq = $('.js-faq-section');
      if (faq) {
        gsap.timeline({ scrollTrigger: { trigger: faq, start: 'top 80%', end: 'center 55%', scrub: 1 } })
          .from('.js-faq-copy', { autoAlpha: 0, xPercent: -30, duration: 0.8, ease: 'power2.out' }, 0)
          .from('.js-faq-item', { autoAlpha: 0, yPercent: 30, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, 0.2);
      }

      // Footer reveal.
      var footer = $('.js-footer');
      if (footer) {
        gsap.timeline({ scrollTrigger: { trigger: footer, start: 'top 90%', end: 'center 70%', scrub: 1 } })
          .from('.js-footer-part', { autoAlpha: 0, yPercent: 25, duration: 0.6, stagger: 0.15, ease: 'power2.out' }, 0)
          .from('.js-footer-mark', { autoAlpha: 0, yPercent: 40, duration: 0.8, ease: 'power2.out' }, 0.4);
      }

      return function () {
        // Reset JS-set inline states when leaving desktop.
        testiReviews.forEach(function (r, i) { r.classList.toggle('is-hidden', i !== 0); });
        if (ring) {
          ring.style.transform = '';
          ring.style.removeProperty('--ring');
        }
      };
    });

    // CTA orbit rotates with scroll on every size.
    var orbit = $('.js-cta-orbit');
    if (orbit) {
      var state = { r: 0 };
      gsap.to(state, {
        r: 90, ease: 'none',
        onUpdate: function () { orbit.style.setProperty('--orbit', state.r + 'deg'); orbit.style.transform = 'rotate(' + state.r + 'deg)'; },
        scrollTrigger: { trigger: '.js-cta', start: 'top bottom', end: 'bottom top', scrub: 2.5 }
      });
    }

    // Images that load late change layout heights — re-measure once.
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  /* ------------------------------------------------------------------------
   * Boot
   * ---------------------------------------------------------------------- */
  function boot() {
    initForms();
    initFaq();
    initFinder();
    initPricing();
    initLocations();
    initAboutPlay();
    initProcessClicks();
    initTestiSlider();
    try {
      initMotion();
    } catch (err) {
      // Motion is progressive enhancement; never block the page.
      document.documentElement.classList.remove('has-motion');
      if (window.console) window.console.warn('[rovix] motion disabled:', err);
    }
    initAnchors();
    initSpy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
