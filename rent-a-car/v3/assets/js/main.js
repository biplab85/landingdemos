/*!
 * ==========================================================================
 * Drivo v3 — Rent-a-Car Landing Page (tangerine drive edition)
 * Author : Biplab Paul
 * Email  : biplab.cse.85@gmail.com
 * Phone  : 01735927356
 * --------------------------------------------------------------------------
 * Motion  : hero rise-in on load, count-up stats on scroll (2s, ease-out).
 * UI      : fixed navbar with icon links + scroll-spy (is-active /
 *           aria-current), smooth in-page scrolling, phone app bar +
 *           bottom tab bar (<= 991px, same scroll-spy), validated newsletter form with success / error states.
 * Hooks   : js-* classes only (never styled).
 * ==========================================================================
 */
(function () {
  'use strict';

  var doc = document;
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
   * Hero entrance
   * ------------------------------------------------------------------ */
  function initHero() {
    var hero = $('.js-hero-content');
    if (!hero) return;
    if (reduceMotion) { hero.classList.add('is-in'); return; }
    window.requestAnimationFrame(function () {
      window.setTimeout(function () { hero.classList.add('is-in'); }, 120);
    });
  }

  /* ------------------------------------------------------------------
   * Navbar / app bar: glass state once the page scrolls
   * ------------------------------------------------------------------ */
  function initNavState() {
    var nav = $('.js-nav');
    if (!nav) return;
    var onScroll = function () { nav.classList.toggle('is-scrolled', window.pageYOffset > 12); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------------
   * Smooth scroll for in-page links (offset by the fixed bar)
   * ------------------------------------------------------------------ */
  function navOffset() {
    var nav = $('.js-nav');
    return nav ? nav.offsetHeight : 0;
  }

  function initSmoothScroll() {
    doc.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href').slice(1);
      var target = id && doc.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var y = id === 'top' ? 0 : target.getBoundingClientRect().top + window.pageYOffset - navOffset() + 1;
      window.scrollTo({ top: Math.max(0, y), behavior: reduceMotion ? 'auto' : 'smooth' });
      if (window.history && window.history.replaceState) window.history.replaceState(null, '', '#' + id);
    });
  }

  /* ------------------------------------------------------------------
   * Scroll-spy: highlights nav links + tab bar tabs (shared data-target)
   * ------------------------------------------------------------------ */
  function initScrollSpy() {
    var links = $$('.js-spy-link');
    if (!links.length) return;
    var ids = [];
    links.forEach(function (l) {
      var t = l.getAttribute('data-target');
      if (ids.indexOf(t) === -1 && doc.getElementById(t)) ids.push(t);
    });
    var sections = ids.map(function (id) { return doc.getElementById(id); });
    var current = null;
    var ticking = false;

    function setActive(id) {
      links.forEach(function (l) {
        var on = l.getAttribute('data-target') === id;
        l.classList.toggle('is-active', on);
        if (on) l.setAttribute('aria-current', 'true');
        else l.removeAttribute('aria-current');
      });
    }

    function spy() {
      ticking = false;
      var line = navOffset() + window.innerHeight * 0.3;
      var id = ids[0];
      sections.forEach(function (sec) {
        if (sec.getBoundingClientRect().top <= line) id = sec.id;
      });
      // Bottom of the page: the last section wins even if it is short.
      if (window.innerHeight + window.pageYOffset >= doc.documentElement.scrollHeight - 4) id = ids[ids.length - 1];
      if (id !== current) { current = id; setActive(id); }
    }

    function onScroll() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(spy); }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    spy();
  }

  /* ------------------------------------------------------------------
   * Count-up stats (2s, starts once visible)
   * ------------------------------------------------------------------ */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduceMotion) { el.textContent = String(target); return; }
    var duration = 2000;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = $$('.js-count');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCount);
      return;
    }

    if (!reduceMotion) counters.forEach(function (el) { el.textContent = '0'; });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
   * Newsletter
   * ------------------------------------------------------------------ */
  function initNewsletter() {
    var form = $('.js-newsletter');
    if (!form) return;
    var input = $('.js-newsletter-email', form);
    var success = $('.js-newsletter-success');
    var error = $('.js-newsletter-error');
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = input && emailRe.test(input.value.trim());
      if (input) {
        input.classList.toggle('is-invalid', !ok);
        input.setAttribute('aria-invalid', String(!ok));
      }
      if (error) error.classList.toggle('is-visible', !ok);
      if (!ok) { if (input) input.focus(); return; }

      form.classList.add('is-hidden');
      if (success) success.classList.add('is-visible');
    });

    if (input) {
      input.addEventListener('input', function () {
        input.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
        if (error) error.classList.remove('is-visible');
      });
    }
  }

  /* ------------------------------------------------------------------
   * Misc
   * ------------------------------------------------------------------ */
  function initYear() {
    var y = $('.js-year');
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function init() {
    initHero();
    initNavState();
    initSmoothScroll();
    initScrollSpy();
    initCounters();
    initNewsletter();
    initYear();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();
})();
