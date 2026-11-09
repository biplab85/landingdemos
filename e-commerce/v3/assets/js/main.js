/*!
 * ==========================================================================
 * Aurin v3 — Fine Jewellery Store Landing Page (champagne gold edition)
 * Author : Biplab Paul
 * Email  : biplab.cse.85@gmail.com
 * Phone  : 01735927356
 * --------------------------------------------------------------------------
 * Motion  : hero rise-in on load, fade-up reveals on scroll, soft parallax
 *           on the editorial banners.
 * UI      : sticky header with icon links + scroll-spy (is-active /
 *           aria-current), smooth in-page scrolling, phone app bar + bottom
 *           tab bar (<= 991px, same scroll-spy), FAQ accordion, client-side
 *           cart counter with "Added to cart" toast, flash-sale countdown,
 *           validated newsletter form.
 * Hooks   : js-* classes only (never styled).
 * ==========================================================================
 */
(function () {
  'use strict';

  var doc = document;
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var appView = window.matchMedia('(max-width: 991px)');

  /* ------------------------------------------------------------------
   * Hero entrance
   * ------------------------------------------------------------------ */
  function initHero() {
    var hero = $('.js-hero');
    if (!hero) return;
    if (reduceMotion) { hero.classList.add('is-in'); return; }
    window.requestAnimationFrame(function () {
      window.setTimeout(function () { hero.classList.add('is-in'); }, 80);
    });
  }

  /* ------------------------------------------------------------------
   * Header: shadow / glass state once the page scrolls
   * ------------------------------------------------------------------ */
  function initNavState() {
    var nav = $('.js-nav');
    if (!nav) return;
    var onScroll = function () { nav.classList.toggle('is-scrolled', window.pageYOffset > 60); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------------
   * Smooth scroll for in-page links (offset by the sticky bar)
   * ------------------------------------------------------------------ */
  function navOffset() {
    if (appView.matches) {
      var nav = $('.js-nav');
      return nav ? nav.offsetHeight : 0;
    }
    var bar = $('.c-header__bar');
    return bar ? bar.offsetHeight : 0;
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
   * Scroll-spy: highlights header links + tab bar tabs (shared data-target)
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
        var also = (l.getAttribute('data-also') || '').split(' ');
        var on = l.getAttribute('data-target') === id || also.indexOf(id) !== -1;
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
   * Scroll reveal (fade-up)
   * ------------------------------------------------------------------ */
  function initReveal() {
    var items = $$('.c-reveal');
    if (!items.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
   * Soft parallax on the editorial banner photos
   * ------------------------------------------------------------------ */
  function initParallax() {
    var imgs = $$('.js-parallax');
    if (!imgs.length || reduceMotion) return;
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      imgs.forEach(function (img) {
        var r = img.parentNode.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var p = (r.top + r.height / 2 - vh / 2) / vh; // -1 .. 1
        img.style.transform = 'translate3d(0,' + (p * -30).toFixed(1) + 'px,0) scale(1.08)';
      });
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------
   * FAQ accordion (one open at a time per grid)
   * ------------------------------------------------------------------ */
  function initFaq() {
    var grid = $('.js-faq');
    if (!grid) return;
    var buttons = $$('.c-faq__q', grid);
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.c-faq__item');
        var open = !item.classList.contains('is-open');
        buttons.forEach(function (b) {
          b.setAttribute('aria-expanded', 'false');
          b.closest('.c-faq__item').classList.remove('is-open');
        });
        item.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
      });
    });
  }

  /* ------------------------------------------------------------------
   * Cart counter + toast (client side only)
   * ------------------------------------------------------------------ */
  var STORE_KEY = 'aurin-v3-cart-count';

  function readCount() {
    try { return parseInt(window.localStorage.getItem(STORE_KEY), 10) || 0; } catch (e) { return 0; }
  }

  function writeCount(n) {
    try { window.localStorage.setItem(STORE_KEY, String(n)); } catch (e) { /* storage blocked: keep in memory */ }
  }

  var toastTimer = null;
  function toast(html) {
    var el = $('.js-toast');
    var text = $('.js-toast-text');
    if (!el || !text) return;
    text.innerHTML = html;
    el.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { el.classList.remove('is-visible'); }, 2600);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function initCart() {
    var count = readCount();
    var badges = $$('.js-cart-count');
    var openBtns = $$('.js-cart-open');

    function render(bump) {
      badges.forEach(function (b) {
        b.textContent = String(count);
        if (bump) {
          b.classList.remove('is-bump');
          void b.offsetWidth; // restart the animation
          b.classList.add('is-bump');
        }
      });
      openBtns.forEach(function (btn) {
        btn.setAttribute('aria-label', 'Shopping bag, ' + count + (count === 1 ? ' item' : ' items'));
      });
    }

    $$('.js-add-to-cart').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        count += 1;
        writeCount(count);
        render(true);
        var name = btn.getAttribute('data-name') || 'Item';
        toast('<strong>Added to cart</strong> — ' + escapeHtml(name));
        btn.classList.add('is-added');
        window.setTimeout(function () { btn.classList.remove('is-added'); }, 1200);
      });
    });

    openBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        toast(count
          ? 'Your bag holds <strong>' + count + (count === 1 ? ' piece' : ' pieces') + '</strong>'
          : 'Your bag is empty — find something golden');
      });
    });

    render(false);
  }

  /* ------------------------------------------------------------------
   * Flash-sale countdown (rolls over at local midnight)
   * ------------------------------------------------------------------ */
  function initCountdown() {
    var wrap = $('.js-countdown');
    if (!wrap) return;
    var h = $('.js-cd-h', wrap), m = $('.js-cd-m', wrap), s = $('.js-cd-s', wrap);
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    function tick() {
      var now = new Date();
      var end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      var left = Math.max(0, Math.floor((end - now) / 1000));
      h.textContent = pad(Math.floor(left / 3600));
      m.textContent = pad(Math.floor((left % 3600) / 60));
      s.textContent = pad(left % 60);
    }
    tick();
    window.setInterval(tick, 1000);
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
    initReveal();
    initParallax();
    initFaq();
    initCart();
    initCountdown();
    initNewsletter();
    initYear();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();
})();
