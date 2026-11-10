/*!
 * ==========================================================================
 * Author : Biplab Paul
 * Email  : biplab.cse.85@gmail.com
 * Phone  : 01735927356
 * --------------------------------------------------------------------------
 * Inox Electrical: landing page behaviour
 * Scroll-spy nav, smooth anchors, sliders, accordion, tabs, quote sheet,
 * form validation, toasts, counters and GSAP reveals.
 * Every feature is guarded, so the same file runs on v2 and v3.
 * ==========================================================================
 */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var mqApp = window.matchMedia('(max-width: 991.98px)');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';

  /* ---------- Header state ---------------------------------------------- */
  var header = $('.js-header');
  var appbar = $('.js-appbar');
  function onScrollState() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 40);
    if (appbar) appbar.classList.toggle('is-scrolled', y > 8);
    document.body.classList.toggle('is-past-hero', y > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', onScrollState, { passive: true });
  onScrollState();

  /* ---------- Smooth anchors with header offset -------------------------- */
  function headerOffset() {
    if (mqApp.matches) return (appbar ? appbar.offsetHeight : 60) + 8;
    return (header ? header.offsetHeight : 90) - 1;
  }
  function scrollToId(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var top = id === 'home' ? 0 : el.getBoundingClientRect().top + window.scrollY - headerOffset();
    window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
  }
  $$('.js-scroll').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) !== '#' || href.length < 2) return;
      e.preventDefault();
      scrollToId(href.slice(1));
      if (history.replaceState) history.replaceState(null, '', href);
    });
  });

  /* ---------- Scroll-spy -------------------------------------------------- */
  var navLinks = $$('.js-nav');
  var spies = $$('.js-spy');
  var current = '';
  function setNav(key) {
    if (!key || key === current) return;
    current = key;
    navLinks.forEach(function (l) {
      var on = l.getAttribute('data-nav') === key;
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
    });
  }
  function spy() {
    var line = headerOffset() + window.innerHeight * 0.25;
    var key = spies.length ? spies[0].getAttribute('data-spy') : '';
    spies.forEach(function (s) {
      if (s.getBoundingClientRect().top <= line) key = s.getAttribute('data-spy');
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      var contact = $('.js-spy[data-spy="contact"]');
      if (contact) key = 'contact';
    }
    setNav(key);
  }
  var spyTick = false;
  window.addEventListener('scroll', function () {
    if (spyTick) return;
    spyTick = true;
    requestAnimationFrame(function () { spy(); spyTick = false; });
  }, { passive: true });
  window.addEventListener('resize', spy);
  spy();

  /* ---------- Sliders (native scroll-snap + buttons + dots) -------------- */
  $$('.js-slider').forEach(function (root) {
    var track = $('.js-slider-track', root);
    if (!track) return;
    var slides = Array.prototype.slice.call(track.children);
    var prev = $('.js-slider-prev', root);
    var next = $('.js-slider-next', root);
    var dotsWrap = $('.js-slider-dots', root);
    var dots = [];
    var auto = root.hasAttribute('data-autoplay') && !reduced;
    var timer = null;

    function step() { return slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth; }
    function perView() { return Math.max(1, Math.round(track.clientWidth / step())); }
    function pages() { return Math.max(1, slides.length - perView() + 1); }
    function index() { return Math.round(track.scrollLeft / step()); }
    function go(i) {
      var max = pages() - 1;
      if (i > max) i = 0;
      if (i < 0) i = max;
      track.scrollTo({ left: i * step(), behavior: reduced ? 'auto' : 'smooth' });
    }
    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      dots = [];
      for (var i = 0; i < pages(); i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'c-dot';
        b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        b.addEventListener('click', (function (n) { return function () { go(n); restart(); }; })(i));
        dotsWrap.appendChild(b);
        dots.push(b);
      }
      sync();
    }
    function sync() {
      var i = index();
      dots.forEach(function (d, n) { d.classList.toggle('is-active', n === i); });
    }
    function restart() {
      if (!auto) return;
      clearInterval(timer);
      timer = setInterval(function () { go(index() + 1); }, 5000);
    }
    if (prev) prev.addEventListener('click', function () { go(index() - 1); restart(); });
    if (next) next.addEventListener('click', function () { go(index() + 1); restart(); });
    track.addEventListener('scroll', function () { requestAnimationFrame(sync); }, { passive: true });
    root.addEventListener('mouseenter', function () { clearInterval(timer); });
    root.addEventListener('mouseleave', restart);
    window.addEventListener('resize', buildDots);
    buildDots();
    restart();
  });

  /* ---------- Accordion --------------------------------------------------- */
  $$('.js-acc').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentElement;
      var list = item.parentElement;
      var open = !item.classList.contains('is-open');
      $$('.c-acc', list).forEach(function (o) {
        o.classList.remove('is-open');
        $('.js-acc', o).setAttribute('aria-expanded', 'false');
      });
      if (open) { item.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* ---------- Tabs -------------------------------------------------------- */
  $$('.js-tabs').forEach(function (root) {
    var tabs = $$('.js-tab', root);
    var panels = $$('.js-tab-panel', root);
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var key = t.getAttribute('data-tab');
        tabs.forEach(function (x) { var on = x === t; x.classList.toggle('is-active', on); x.setAttribute('aria-selected', on); });
        panels.forEach(function (p) {
          var on = p.getAttribute('data-panel') === key;
          p.hidden = !on;
          if (on && hasGsap && !reduced) gsap.fromTo(p, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' });
        });
      });
    });
  });

  /* ---------- Quote sheet ------------------------------------------------- */
  var sheet = $('.js-sheet');
  var lastFocus = null;
  function openSheet() {
    if (!sheet) return;
    lastFocus = document.activeElement;
    sheet.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('is-locked');
    setTimeout(function () { var f = $('input', sheet); if (f) f.focus({ preventScroll: true }); }, 350);
  }
  function closeSheet() {
    if (!sheet || !sheet.classList.contains('is-open')) return;
    sheet.classList.remove('is-open');
    sheet.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  $$('.js-sheet-open').forEach(function (b) { b.addEventListener('click', openSheet); });
  $$('.js-sheet-close').forEach(function (b) { b.addEventListener('click', closeSheet); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });
  if (sheet) {
    var panel = $('.c-sheet__panel', sheet);
    var startY = null;
    panel.addEventListener('touchstart', function (e) { if (panel.scrollTop <= 0) startY = e.touches[0].clientY; }, { passive: true });
    panel.addEventListener('touchmove', function (e) {
      if (startY === null) return;
      var dy = e.touches[0].clientY - startY;
      if (dy > 0) panel.style.transform = 'translateY(' + dy + 'px)';
    }, { passive: true });
    panel.addEventListener('touchend', function (e) {
      if (startY === null) return;
      var dy = e.changedTouches[0].clientY - startY;
      panel.style.transform = '';
      startY = null;
      if (dy > 110) closeSheet();
    });
  }

  /* ---------- Toast ------------------------------------------------------- */
  var toast = $('.js-toast');
  var toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    $('.js-toast-text', toast).textContent = msg;
    toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-show'); }, 3600);
  }

  /* ---------- Forms ------------------------------------------------------- */
  function validField(input) {
    var v = (input.value || '').trim();
    if (input.required && !v) return false;
    if (input.type === 'email' && v) return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    if (input.type === 'tel' && v) return v.replace(/\D/g, '').length >= 8;
    return true;
  }
  $$('.js-form').forEach(function (form) {
    var fields = $$('input, textarea, select', form);
    fields.forEach(function (f) {
      f.addEventListener('input', function () {
        if (f.closest('.c-field')) f.closest('.c-field').classList.toggle('is-invalid', !validField(f));
        f.classList.toggle('is-invalid', !validField(f));
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      fields.forEach(function (f) {
        var good = validField(f);
        f.classList.toggle('is-invalid', !good);
        if (f.closest('.c-field')) f.closest('.c-field').classList.toggle('is-invalid', !good);
        if (!good && ok) { ok = false; f.focus(); }
      });
      if (!ok) { showToast('Please check the highlighted fields.'); return; }
      form.reset();
      closeSheet();
      showToast("Thanks! We've received your request and will be in touch shortly.");
    });
  });

  /* ---------- Counters ---------------------------------------------------- */
  function runCounter(el) {
    var end = parseFloat(el.getAttribute('data-count'));
    var dec = (el.getAttribute('data-count').split('.')[1] || '').length;
    if (reduced || !hasGsap) { el.textContent = end.toFixed(dec); return; }
    var o = { v: 0 };
    gsap.to(o, { v: end, duration: 1.6, ease: 'power2.out', onUpdate: function () { el.textContent = o.v.toFixed(dec); } });
  }
  var counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCounter(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { io.observe(c); });
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- GSAP reveals ------------------------------------------------ */
  if (hasGsap && !reduced) {
    gsap.registerPlugin(window.ScrollTrigger);
    document.documentElement.classList.add('has-motion');

    var title = $('.js-hero-title');
    if (title) gsap.fromTo(title, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'power3.out', delay: 0.1 });

    $$('.js-rise').forEach(function (el) {
      gsap.fromTo(el, { y: 28, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
    });

    $$('.js-reveal').forEach(function (el) {
      gsap.fromTo(el, { clipPath: 'inset(12% 12% 12% 12% round 18px)', autoAlpha: 0 }, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)', autoAlpha: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onComplete: function () { el.style.clipPath = ''; }
      });
    });

    $$('.js-rail').forEach(function (rail) {
      var cards = $$('.js-card', rail);
      gsap.fromTo(cards, { y: 40, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: rail, start: 'top 88%', once: true }
      });
    });

    $$('.js-parallax').forEach(function (el) {
      gsap.fromTo(el, { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }
})();
