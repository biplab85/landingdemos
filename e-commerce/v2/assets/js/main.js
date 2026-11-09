/*!
 * ==========================================================================
 * Author : Biplab Paul
 * Email  : biplab.cse.85@gmail.com
 * Phone  : 01735927356
 * --------------------------------------------------------------------------
 * Dewra Skincare — e-commerce landing page v2 · main.js
 * UI: section nav + bottom tab bar (scroll-spy), smooth anchors, client-side
 * cart (badge + toast, remembered per browser), product search & category
 * chips, "see more" products, review slider (desktop) / snap rail (phone),
 * newsletter forms.
 * Motion: GSAP + ScrollTrigger (hero intro, reveals, hero & collage
 * parallax, floating bubbles), Lenis on desktop pointers.
 * Hooks are js-* classes / data-* attributes only.
 * ==========================================================================
 */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var appView = window.matchMedia('(max-width: 991.98px)');
  var lenis = null;

  /* ------------------------------------------------------------------------
   * Year
   * ---------------------------------------------------------------------- */
  $$('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ------------------------------------------------------------------------
   * Header shadow once the page scrolls
   * ---------------------------------------------------------------------- */
  function initHeader() {
    var header = $('.js-header');
    if (!header) return;
    var on = false;
    function check() {
      var s = window.scrollY > 8;
      if (s !== on) {
        on = s;
        header.classList.toggle('is-scrolled', s);
      }
    }
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  /* ------------------------------------------------------------------------
   * Scroll-spy: every .js-spy-group menu holds .js-spy-link[data-spy] links.
   * The active section is the last spied section whose top has passed a
   * line 40% down the viewport (read live, so layout changes never go stale).
   * Desktop nav is split in two lists, so links are pooled per "spy set":
   * both desktop lists share one set; the tab bar is its own set.
   * ---------------------------------------------------------------------- */
  function initSpy() {
    var sets = [];
    var desktop = { links: [], ids: [], current: null };
    $$('.js-spy-group').forEach(function (menu) {
      var target = menu.classList.contains('c-tabbar') ? { links: [], ids: [], current: null } : desktop;
      if (target !== desktop) sets.push(target);
      $$('.js-spy-link', menu).forEach(function (l) {
        target.links.push(l);
        var id = l.getAttribute('data-spy');
        if (target.ids.indexOf(id) === -1 && document.getElementById(id)) target.ids.push(id);
      });
    });
    if (desktop.links.length) sets.push(desktop);
    sets = sets.filter(function (s) { return s.ids.length; });
    if (!sets.length) return;

    // Keep ids in document order.
    sets.forEach(function (s) {
      s.ids.sort(function (a, b) {
        var pos = document.getElementById(a).compareDocumentPosition(document.getElementById(b));
        return pos & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });
    });

    var ticking = false;

    function setActive(set, id) {
      if (id === set.current) return;
      set.current = id;
      set.links.forEach(function (l) {
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
      sets.forEach(function (s) {
        var active = s.ids[0];
        for (var i = 0; i < s.ids.length; i++) {
          if (document.getElementById(s.ids[i]).getBoundingClientRect().top - line <= 0) active = s.ids[i];
        }
        if (atBottom) active = s.ids[s.ids.length - 1];
        setActive(s, active);
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
    update();
  }

  /* ------------------------------------------------------------------------
   * Smooth anchor scrolling (Lenis-aware, offset for the sticky bar)
   * ---------------------------------------------------------------------- */
  function scrollToEl(target) {
    var header = $('.js-header');
    var offset = target.id === 'top' ? 0 : -((header ? header.offsetHeight : 0) + 8);
    if (lenis) {
      lenis.scrollTo(target.id === 'top' ? 0 : target, { offset: offset });
    } else {
      var y = target.id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }

  function initAnchors() {
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var target = document.getElementById(id.slice(1));
        if (!target) return;
        e.preventDefault();
        scrollToEl(target);
        if (target.id !== 'top' && history.replaceState) history.replaceState(null, '', id);
      });
    });
  }

  /* ------------------------------------------------------------------------
   * Toast
   * ---------------------------------------------------------------------- */
  var toastTimer = null;
  function toast(msg) {
    var el = $('.js-toast');
    var text = $('.js-toast-text');
    if (!el || !text) return;
    text.textContent = msg;
    el.classList.remove('is-visible');
    void el.offsetWidth; // restart the transition
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-visible'); }, 2400);
  }

  /* ------------------------------------------------------------------------
   * Cart: badge count (remembered in this browser when storage allows)
   * ---------------------------------------------------------------------- */
  function initCart() {
    var KEY = 'dewra-v2-cart';
    var count = 0;
    try { count = parseInt(window.localStorage.getItem(KEY), 10) || 0; } catch (e) { count = 0; }

    var badges = $$('.js-cart-count');
    var buttons = $$('.js-cart-btn');

    function render(bump) {
      badges.forEach(function (b) { b.textContent = count > 99 ? '99+' : String(count); });
      buttons.forEach(function (btn) {
        btn.setAttribute('aria-label', 'Cart, ' + count + (count === 1 ? ' item' : ' items'));
        if (bump) {
          btn.classList.remove('is-bump');
          void btn.offsetWidth;
          btn.classList.add('is-bump');
        }
      });
    }

    $$('.js-add').forEach(function (btn) {
      btn.addEventListener('click', function () {
        count += 1;
        try { window.localStorage.setItem(KEY, String(count)); } catch (e) { /* storage unavailable */ }
        render(true);
        toast('Added to cart · ' + (btn.getAttribute('data-product') || 'item'));
        btn.classList.add('is-added');
        setTimeout(function () { btn.classList.remove('is-added'); }, 900);
      });
    });

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        toast(count ? 'Your cart has ' + count + (count === 1 ? ' item' : ' items') : 'Your cart is empty — add a favourite');
      });
    });

    render(false);
  }

  /* ------------------------------------------------------------------------
   * Products: search + category chips + "see more"
   * ---------------------------------------------------------------------- */
  function initProducts() {
    var items = $$('.js-product');
    if (!items.length) return;
    var moreBtn = $('.js-more');
    var empty = $('.js-empty');
    var state = { query: '', cat: 'all', expanded: false };

    function apply(animate) {
      var q = state.query.trim().toLowerCase();
      var filtering = q !== '' || state.cat !== 'all';
      var shown = 0;
      items.forEach(function (item) {
        var extra = item.classList.contains('js-more-item');
        var matchQ = !q || (item.getAttribute('data-name') || '').toLowerCase().indexOf(q) !== -1;
        var matchC = state.cat === 'all' || item.getAttribute('data-cat') === state.cat;
        var visible = matchQ && matchC && (filtering || state.expanded || !extra);
        var wasHidden = item.hidden;
        item.hidden = !visible;
        if (visible) {
          shown++;
          if (wasHidden && animate) {
            item.classList.remove('is-entering');
            void item.offsetWidth;
            item.classList.add('is-entering');
            item.style.opacity = '';
            item.style.transform = '';
          }
        }
      });
      if (empty) empty.hidden = shown > 0;
      if (moreBtn) moreBtn.parentNode.hidden = filtering;
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    }

    if (moreBtn) {
      moreBtn.addEventListener('click', function () {
        state.expanded = !state.expanded;
        moreBtn.setAttribute('aria-expanded', String(state.expanded));
        moreBtn.textContent = state.expanded ? 'Show fewer products' : 'See more products';
        apply(true);
      });
    }

    $$('.js-chip').forEach(function (chip, i, all) {
      chip.addEventListener('click', function () {
        state.cat = chip.getAttribute('data-filter') || 'all';
        all.forEach(function (c) {
          var on = c === chip;
          c.classList.toggle('is-active', on);
          c.setAttribute('aria-pressed', String(on));
        });
        apply(true);
      });
    });

    // Search drawer
    var toggle = $('.js-search-toggle');
    var panel = $('.js-search');
    var input = $('.js-search-input');
    var form = $('.js-search-form');
    var close = $('.js-search-close');

    function openSearch(open) {
      if (!panel || !toggle) return;
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      if (open && input) setTimeout(function () { input.focus(); }, 30);
      if (!open && input && input.value) {
        input.value = '';
        state.query = '';
        apply(false);
      }
    }

    if (toggle) toggle.addEventListener('click', function () { openSearch(panel.hidden); });
    if (close) close.addEventListener('click', function () { openSearch(false); toggle.focus(); });
    if (input) {
      input.addEventListener('input', function () {
        state.query = input.value;
        apply(true);
      });
    }
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var shop = document.getElementById('shop');
        if (shop) scrollToEl(shop);
        if (input) input.blur();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel && !panel.hidden) openSearch(false);
    });

    apply(false);
  }

  /* ------------------------------------------------------------------------
   * Review slider: translated track on desktop (dots + autoplay),
   * native snap rail in the app view (dots follow the scroll).
   * ---------------------------------------------------------------------- */
  function initSlider() {
    var slider = $('.js-slider');
    if (!slider) return;
    var track = $('.js-slider-track', slider);
    var slides = $$('.js-slide', slider);
    var dots = $$('.c-slider__dot', slider);
    var index = 0;
    var timer = null;

    function mark(i) {
      dots.forEach(function (d, k) {
        d.classList.toggle('is-active', k === i);
        d.setAttribute('aria-selected', String(k === i));
      });
      slides.forEach(function (s, k) { s.classList.toggle('is-past', k < i && !appView.matches); });
    }

    function go(i, user) {
      index = (i + slides.length) % slides.length;
      mark(index);
      if (appView.matches) {
        track.scrollTo({ left: slides[index].offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft || 0), behavior: reduceMotion ? 'auto' : 'smooth' });
      } else {
        track.style.transform = 'translate3d(' + (-slides[index].offsetLeft) + 'px,0,0)';
      }
      if (user) restart();
    }

    function restart() {
      clearInterval(timer);
      if (reduceMotion || appView.matches) return;
      timer = setInterval(function () { go(index + 1); }, 5000);
    }

    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i, true); }); });

    track.addEventListener('scroll', function () {
      if (!appView.matches) return;
      var x = track.scrollLeft;
      var best = 0;
      var bestD = Infinity;
      slides.forEach(function (s, i) {
        var d = Math.abs(s.offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft || 0) - x);
        if (d < bestD) { bestD = d; best = i; }
      });
      if (best !== index) { index = best; mark(index); }
    }, { passive: true });

    slider.addEventListener('mouseenter', function () { clearInterval(timer); });
    slider.addEventListener('mouseleave', restart);

    function onMode() {
      if (appView.matches) track.style.transform = '';
      go(index);
      restart();
    }
    if (appView.addEventListener) appView.addEventListener('change', onMode);
    window.addEventListener('resize', function () { if (!appView.matches) go(index); });
    restart();
  }

  /* ------------------------------------------------------------------------
   * Newsletter forms (demo only — no backend)
   * ---------------------------------------------------------------------- */
  function initForms() {
    $$('.js-subscribe').forEach(function (form) {
      var note = form.parentNode.querySelector('.js-form-note');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"]');
        var ok = input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        if (note) {
          note.hidden = false;
          note.textContent = ok
            ? 'Welcome to Dewra! Your 10% code is on its way to your inbox.'
            : 'Please enter a valid email address so we can send your code.';
        }
        if (ok) {
          form.reset();
          toast('Subscribed — check your inbox');
        } else if (input) {
          input.focus();
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
   * Motion (GSAP + ScrollTrigger + Lenis)
   * ---------------------------------------------------------------------- */
  function initMotion() {
    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger || reduceMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    if (finePointer && typeof window.Lenis === 'function') {
      lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    // Hero intro: arch rises & opens, both headline copies lift together.
    var arch = $('.js-hero-arch');
    var heroImg = $('.js-hero-image');
    var titles = $$('.js-hero-title');
    var intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (arch) intro.from(arch, { y: 60, scale: 0.94, opacity: 0, duration: 1.2 }, 0);
    if (heroImg) intro.from(heroImg, { scale: 1.2, duration: 1.8 }, 0);
    if (titles.length) intro.from(titles, { y: 80, opacity: 0, duration: 1.2 }, 0.2);

    // Hero image drifts slower than the page.
    if (heroImg && arch) {
      gsap.to(heroImg, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: arch, start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    // Generic reveals (fade-in-on-scroll).
    $$('[data-reveal]').forEach(function (el) {
      if (el.closest('.c-hero')) {
        gsap.from(el, { y: 30, opacity: 0, duration: 1, delay: 0.6, ease: 'power3.out' });
        return;
      }
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    // Collage tiles move at different speeds.
    $$('.c-story__img').forEach(function (fig, i) {
      gsap.to(fig, {
        y: [-40, 30, -20, 50][i % 4],
        ease: 'none',
        scrollTrigger: { trigger: '.c-story__collage', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // Benefit bubbles pop in, then float.
    var bubbles = $$('[data-bubble]');
    if (bubbles.length) {
      gsap.from(bubbles, {
        scale: 0.4,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '.c-bubbles', start: 'top 85%', once: true },
        onComplete: function () {
          bubbles.forEach(function (b, i) {
            gsap.to(b, { y: i % 2 ? 10 : -10, duration: 2.6 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
          });
        }
      });
    }

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  initHeader();
  initSpy();
  initAnchors();
  initCart();
  initProducts();
  initSlider();
  initForms();
  initMotion();
})();
