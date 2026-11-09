// ==========================================================================
// Author : Biplab Paul
// Email  : biplab.cse.85@gmail.com
// Phone  : 01735927356
// --------------------------------------------------------------------------
// SCRIPT / MAIN — Sklentr Accounting & Advisory · landing page v2
// Lenis (desktop) + GSAP/ScrollTrigger: header re-pin on scroll-up,
// scroll-spy (nav chips + app tab bar), Swiper hero with Ken-Burns and
// progress tabs, scroll reveals, image reveals, service-card expansion,
// accordions, testimonial marquee, consultation modal / bottom sheet with
// validation and toast.
// ==========================================================================
(function () {
  'use strict';

  var d = document;
  var root = d.documentElement;
  var mqDesk = window.matchMedia('(min-width: 992px)');
  var canHover = window.matchMedia('(hover: hover)').matches;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var lenis = null;

  root.classList.add('js');
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.ScrollToPlugin) gsap.registerPlugin(ScrollToPlugin);
  }

  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  /* ---------------------------------------------------------------------
     Smooth scrolling (desktop only)
     --------------------------------------------------------------------- */
  function initLenis() {
    if (!mqDesk.matches || !window.Lenis || reduced) return;
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  function scrollToTarget(target) {
    var offset = mqDesk.matches ? 0 : -(($('.c-appbar') || {}).offsetHeight || 64) - 8;
    if (lenis) {
      lenis.scrollTo(target, { offset: offset, duration: 1.2 });
    } else {
      var y = target.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
    }
  }

  d.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.classList.contains('js-open-consult') || a.classList.contains('js-chip')) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var target = d.getElementById(id.slice(1));
    if (!target) return;
    e.preventDefault();
    // service sub-links: open that card on desktop
    if (target.classList.contains('js-svc-card')) {
      if (mqDesk.matches) setServiceOpen($$('.js-svc-card').indexOf(target));
      target = $('#services');
    }
    scrollToTarget(target);
  });

  /* ---------------------------------------------------------------------
     Header: scrolls away with the page, re-appears (solid) on scroll-up
     --------------------------------------------------------------------- */
  var header = $('.js-header');
  var appbar = $('.c-appbar');
  var lastY = window.pageYOffset;

  function onScroll() {
    var y = window.pageYOffset;
    var dir = y > lastY ? 1 : y < lastY ? -1 : 0;
    if (appbar) appbar.classList.toggle('is-scrolled', y > 10);
    if (header && mqDesk.matches) {
      var pinned = header.classList.contains('is-pinned');
      if (y <= 4) {
        header.classList.remove('is-pinned', 'is-hidden');
      } else if (dir < 0 && y > 160 && !pinned) {
        header.style.transition = 'none';
        header.classList.add('is-pinned', 'is-hidden');
        void header.offsetHeight;
        header.style.transition = '';
        header.classList.remove('is-hidden');
      } else if (dir < 0 && pinned) {
        header.classList.remove('is-hidden');
      } else if (dir > 0 && pinned) {
        header.classList.add('is-hidden');
        if (y < 120) header.classList.remove('is-pinned', 'is-hidden');
      }
    }
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------------------------------------------------------------
     Scroll-spy: desktop nav chips + mobile tab bar
     --------------------------------------------------------------------- */
  var navLinks = $$('.js-spy-link');
  var tabs = $$('.js-tab');

  function setActive(key, tabKey) {
    navLinks.forEach(function (l) { l.classList.toggle('is-active', l.dataset.spy === key); });
    tabs.forEach(function (t) { t.classList.toggle('is-active', t.dataset.tab === tabKey); });
  }

  function initSpy() {
    var sections = $$('.js-section');
    if (hasGsap) {
      sections.forEach(function (s) {
        ScrollTrigger.create({
          trigger: s,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: function (self) { if (self.isActive) setActive(s.dataset.section, s.dataset.tab); }
        });
      });
    } else if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.dataset.section, en.target.dataset.tab); });
      }, { rootMargin: '-45% 0px -55% 0px' });
      sections.forEach(function (s) { io.observe(s); });
    }
    setActive('home', 'home');
  }

  /* ---------------------------------------------------------------------
     Hero: Swiper fade + Ken-Burns + progress tabs (timings from reference)
     --------------------------------------------------------------------- */
  function initHero() {
    var el = $('.js-hero');
    if (!el || !window.Swiper) return;
    var bgs = $$('.js-hero-bg', el);
    var bars = $$('.js-hero-progress', el);
    var heroTabs = $$('.js-hero-tab', el);
    var tl = null;

    function play(i) {
      heroTabs.forEach(function (t, k) {
        t.classList.toggle('is-active', k === i);
        t.setAttribute('aria-selected', k === i ? 'true' : 'false');
      });
      if (!hasGsap) return;
      if (tl) tl.kill();
      bgs.forEach(function (b, k) { if (k !== i) gsap.set(b, { scale: 1.3 }); });
      bars.forEach(function (b, k) { if (k !== i) gsap.set(b, { xPercent: -100 }); });
      tl = gsap.timeline();
      tl.fromTo(bgs[i], { scale: 1.3 }, { scale: 1, duration: reduced ? 0 : 3.4, delay: 0.2, ease: 'circ.out' }, 0)
        .fromTo(bars[i], { xPercent: -100 }, { xPercent: 0, duration: 3.4, delay: 0.5, ease: 'power1.inOut' }, 0)
        .to(bars[i], { xPercent: 100, duration: 1.5, ease: 'circ.inOut' });
    }

    var swiper = new window.Swiper(el, {
      effect: 'fade',
      fadeEffect: { crossFade: true },
      speed: 400,
      rewind: true,
      autoplay: { delay: 5250, disableOnInteraction: false },
      allowTouchMove: !mqDesk.matches,
      on: {
        init: function (s) { play(s.activeIndex); },
        slideChange: function (s) { play(s.activeIndex); }
      }
    });

    heroTabs.forEach(function (t, k) {
      t.addEventListener('click', function () { swiper.slideTo(k); });
    });
  }

  /* ---------------------------------------------------------------------
     Scroll reveals (slide up / slide left / slide right, 500ms + delays)
     --------------------------------------------------------------------- */
  function initReveals() {
    if (!hasGsap || reduced) return;
    $$('.js-reveal').forEach(function (el) {
      var type = el.dataset.reveal;
      var delay = parseFloat(el.dataset.delay || 0);
      var from = type === 'left' ? { x: 20 } : type === 'right' ? { x: -20 } : { y: 20 };
      from.opacity = 0;
      gsap.set(el, from);
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        once: true,
        onEnter: function () {
          gsap.to(el, { opacity: 1, x: 0, y: 0, duration: 0.5, delay: delay, ease: 'power2.out', overwrite: 'auto' });
        }
      });
    });

    $$('.js-img-reveal').forEach(function (el) {
      ScrollTrigger.create({
        trigger: el.parentNode,
        start: 'top bottom',
        once: true,
        onEnter: function () { gsap.to(el, { yPercent: -100, y: 0, duration: 1.5, ease: 'power4.inOut' }); }
      });
    });
  }

  /* ---------------------------------------------------------------------
     Services: hovered card expands (middle card open by default)
     --------------------------------------------------------------------- */
  function setServiceOpen(idx) {
    $$('.js-svc-card').forEach(function (c, i) { c.classList.toggle('is-open', i === idx); });
  }

  function initServices() {
    var wrap = $('.js-services');
    if (!wrap) return;
    var cards = $$('.js-svc-card', wrap);
    cards.forEach(function (c, i) {
      c.addEventListener('mouseenter', function () { if (mqDesk.matches && canHover) setServiceOpen(i); });
      c.addEventListener('mouseleave', function () { if (mqDesk.matches && canHover) setServiceOpen(-1); });
      c.addEventListener('focusin', function () { if (mqDesk.matches) setServiceOpen(i); });
    });
    wrap.addEventListener('mouseleave', function () { if (mqDesk.matches) setServiceOpen(1); });

    // mobile chips <-> rail
    var chips = $$('.js-chip');
    chips.forEach(function (chip, i) {
      chip.addEventListener('click', function (e) {
        e.preventDefault();
        var card = cards[i];
        wrap.scrollTo({ left: card.offsetLeft - wrap.offsetLeft - 16, behavior: 'smooth' });
      });
    });
    wrap.addEventListener('scroll', function () {
      var mid = wrap.scrollLeft + wrap.clientWidth * 0.35;
      var idx = 0;
      cards.forEach(function (c, i) { if (c.offsetLeft - wrap.offsetLeft <= mid) idx = i; });
      chips.forEach(function (ch, i) { ch.classList.toggle('is-active', i === idx); });
    }, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Accordions (features list + FAQ) — one open at a time per group
     --------------------------------------------------------------------- */
  function animateHeight(panel, open) {
    if (hasGsap) {
      if (open) {
        gsap.fromTo(panel, { height: panel.offsetHeight }, { height: 'auto', duration: 0.5, ease: 'power2.out', onComplete: function () { ScrollTrigger.refresh(); } });
      } else {
        gsap.to(panel, { height: 0, duration: 0.5, ease: 'power2.out', onComplete: function () { ScrollTrigger.refresh(); } });
      }
    } else {
      panel.style.height = open ? 'auto' : '0px';
    }
  }

  function initAccordion(groupSel, toggleSel, panelSel) {
    $$(groupSel).forEach(function (group) {
      var toggles = $$(toggleSel, group);
      toggles.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var item = btn.parentNode;
          var willOpen = !item.classList.contains('is-open');
          toggles.forEach(function (other) {
            var it = other.parentNode;
            if (it !== item && it.classList.contains('is-open')) {
              it.classList.remove('is-open');
              other.setAttribute('aria-expanded', 'false');
              animateHeight($(panelSel, it), false);
            }
          });
          item.classList.toggle('is-open', willOpen);
          btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
          animateHeight($(panelSel, item), willOpen);
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
     Testimonials marquee: duplicate the track for a seamless loop
     --------------------------------------------------------------------- */
  function initReviews() {
    var block = $('.js-reviews');
    if (!block) return;
    var track = $('.c-reviews__track', block);
    var clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    $$('a, button', clone).forEach(function (n) { n.setAttribute('tabindex', '-1'); });
    block.appendChild(clone);
    if (!reduced) { track.classList.add('is-running'); clone.classList.add('is-running'); }
  }

  /* ---------------------------------------------------------------------
     Consultation: Fancybox modal (desktop) / bottom sheet (mobile)
     --------------------------------------------------------------------- */
  var sheet = $('.js-sheet');
  var lastFocus = null;

  function openConsult() {
    lastFocus = d.activeElement;
    if (mqDesk.matches && window.Fancybox) {
      window.Fancybox.show([{ src: '#consult', type: 'inline' }], {
        mainClass: 'c-consult-modal',
        dragToClose: false,
        closeButton: false,
        on: { done: function () { var f = $('input', sheet); if (f) f.focus(); } }
      });
      if (lenis) lenis.stop();
      return;
    }
    sheet.classList.add('is-open');
    root.classList.add('is-locked');
    setTimeout(function () { var f = $('input', sheet); if (f) f.focus({ preventScroll: true }); }, 350);
  }

  function closeConsult() {
    if (window.Fancybox && window.Fancybox.getInstance && window.Fancybox.getInstance()) {
      window.Fancybox.close();
    }
    sheet.classList.remove('is-open');
    root.classList.remove('is-locked');
    if (lenis) lenis.start();
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function initConsult() {
    if (!sheet) return;
    d.addEventListener('click', function (e) {
      var opener = e.target.closest('.js-open-consult');
      if (opener) { e.preventDefault(); openConsult(); return; }
      if (e.target.closest('.js-sheet-close')) { e.preventDefault(); closeConsult(); }
    });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sheet.classList.contains('is-open')) closeConsult();
    });
    if (window.Fancybox && window.Fancybox.bind === undefined) { /* v5 always exposes show() */ }
    d.addEventListener('fancybox:destroy', function () { if (lenis) lenis.start(); });
  }

  /* ---------------------------------------------------------------------
     Form validation + toast
     --------------------------------------------------------------------- */
  var toastTimer = null;
  function toast(msg) {
    var t = $('.js-toast');
    if (!t) return;
    $('.js-toast-text', t).textContent = msg;
    t.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-visible'); }, 3800);
  }

  function initForms() {
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    $$('.js-form').forEach(function (form) {
      form.addEventListener('input', function (e) {
        var f = e.target.closest('.c-form__field');
        if (f) f.classList.remove('is-invalid');
      });
      form.addEventListener('change', function (e) {
        var f = e.target.closest('.c-form__field');
        if (f) f.classList.remove('is-invalid');
      });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var firstBad = null;
        $$('[required]', form).forEach(function (input) {
          var v = (input.value || '').trim();
          var bad = !v || (input.type === 'email' && !emailRe.test(v));
          input.closest('.c-form__field').classList.toggle('is-invalid', bad);
          input.setAttribute('aria-invalid', bad ? 'true' : 'false');
          if (bad && !firstBad) firstBad = input;
        });
        if (firstBad) { firstBad.focus(); return; }
        var name = (form.elements.name.value || '').trim().split(' ')[0];
        form.reset();
        closeConsult();
        toast('Thanks' + (name ? ', ' + name : '') + '! An accountant will call you within one business day.');
      });
    });
  }

  /* ---------------------------------------------------------------------
     Boot
     --------------------------------------------------------------------- */
  $$('.js-year').forEach(function (n) { n.textContent = new Date().getFullYear(); });

  initLenis();
  initHero();
  initReviews();
  initReveals();
  initServices();
  initAccordion('.js-accordion', '.js-acc-toggle', '.js-acc-panel');
  initAccordion('.js-faq', '.js-faq-toggle', '.js-faq-panel');
  initConsult();
  initForms();
  initSpy();
  onScroll();

  window.addEventListener('load', function () { if (hasGsap) ScrollTrigger.refresh(); });

  // Re-evaluate behaviour when crossing the desktop / app breakpoint
  var wasDesk = mqDesk.matches;
  window.addEventListener('resize', function () {
    if (mqDesk.matches !== wasDesk) { wasDesk = mqDesk.matches; window.location.reload(); }
  });
})();
