/* =============================================================
 *  INOX ELECTRICAL · main.js — behaviour (no motion library)
 *  nav · sticky header/app-bar · mobile menu · tab-bar ·
 *  scrollspy · carousel · Fancybox gallery · form validation
 * ============================================================= */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Sticky header / app-bar ---------- */
  var header = $('[data-header]');
  var appbar = $('[data-appbar]');
  function onScroll() {
    var y = window.scrollY > 40;
    if (header) header.classList.toggle('is-scrolled', y);
    if (appbar) appbar.classList.toggle('is-scrolled', y);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu overlay (shared by header + app-bar) ---------- */
  var menu = $('#mobileMenu');
  var openBtns = $$('[data-menu-open]');
  var closeBtn = $('#menuClose');

  function openMenu() {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    openBtns.forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    document.body.classList.add('is-locked');
  }
  function closeMenu() {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    openBtns.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    document.body.classList.remove('is-locked');
  }
  openBtns.forEach(function (b) { b.addEventListener('click', openMenu); });
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  $$('[data-menu-link]').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
  });

  /* ---------- Smooth anchor scroll (offset for fixed bar) ---------- */
  function headerOffset() {
    var v = getComputedStyle(document.documentElement).getPropertyValue('--header-h');
    return (parseInt(v, 10) || 70) + 12;
  }
  $$('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
      window.scrollTo({ top: top, behavior: 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* ---------- Scrollspy (desktop nav + mobile tab-bar) ---------- */
  var sections = ['home', 'services', 'about', 'projects', 'reviews'];
  var navLinks = $$('[data-nav]');
  var tabs = $$('[data-tab]');
  var indicator = $('[data-tab-indicator]');

  function moveIndicator(tab) {
    if (!indicator || !tab) return;
    indicator.style.left = tab.offsetLeft + 'px';
    indicator.style.width = tab.offsetWidth + 'px';
  }
  function setActive(id) {
    navLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
    });
    var activeTab = null;
    tabs.forEach(function (t) {
      var on = t.getAttribute('href') === '#' + id;
      t.classList.toggle('is-active', on);
      if (on) activeTab = t;
    });
    moveIndicator(activeTab);
  }

  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) setActive(en.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) spy.observe(el);
  });
  // init indicator on the active tab
  window.addEventListener('load', function () { setActive('home'); });
  window.addEventListener('resize', function () {
    var on = $('.tab-bar__tab.is-active');
    moveIndicator(on);
  });

  /* ---------- Reviews carousel ---------- */
  $$('[data-carousel]').forEach(function (root) {
    var track = $('[data-carousel-track]', root);
    var prev = $('[data-carousel-prev]') ;
    var next = $('[data-carousel-next]');
    var dotsWrap = $('[data-carousel-dots]', root);
    if (!track) return;

    var slides = $$('.carousel__slide', track);

    function step() {
      var slide = slides[0];
      var gap = parseInt(getComputedStyle(track).columnGap || getComputedStyle(track).gap, 10) || 24;
      return slide.getBoundingClientRect().width + gap;
    }
    function update() {
      if (prev) prev.disabled = track.scrollLeft < 8;
      if (next) next.disabled = track.scrollLeft > track.scrollWidth - track.clientWidth - 8;
      // active dot
      if (dotsWrap) {
        var idx = Math.round(track.scrollLeft / step());
        $$('.carousel__dot', dotsWrap).forEach(function (d, i) {
          d.classList.toggle('is-active', i === idx);
        });
      }
    }
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });

    // dots (one per slide)
    if (dotsWrap) {
      slides.forEach(function (s, i) {
        var b = document.createElement('button');
        b.className = 'carousel__dot' + (i === 0 ? ' is-active' : '');
        b.setAttribute('aria-label', 'Go to review ' + (i + 1));
        b.addEventListener('click', function () { track.scrollTo({ left: step() * i, behavior: 'smooth' }); });
        dotsWrap.appendChild(b);
      });
    }
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    update();
  });

  /* ---------- How We Work — horizontal swipe progress bar ---------- */
  (function () {
    var track = $('[data-hscroll-track]');
    var bar = $('[data-hscroll-bar]');
    if (!track || !bar) return;
    function update() {
      var max = track.scrollWidth - track.clientWidth;
      var p = max > 0 ? track.scrollLeft / max : 0;
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    }
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ---------- Footer accordions (mobile) ---------- */
  $$('[data-footer-acc] .footer__col-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var col = btn.closest('[data-footer-acc]');
      var open = col.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ---------- Project gallery lightbox (Fancybox) ---------- */
  if (window.Fancybox) {
    window.Fancybox.bind('[data-fancybox="projects"]', {
      // Plain fade for open/close. The default image zoom-morph
      // (is-zooming-out) hangs here — its transitionend never fires because
      // the thumbnail lives in an overflow:hidden tile with a GSAP transform —
      // leaving the modal stuck open. Fade closes reliably.
      Hash: false,
      Images: { zoom: false },
      showClass: 'f-fadeIn',
      hideClass: 'f-fadeOut',
      Toolbar: {
        display: { left: ['infobar'], middle: [], right: ['slideshow', 'fullscreen', 'thumbs', 'close'] }
      },
      Thumbs: { type: 'classic' }
    });
  }

  /* ---------- Form validation ---------- */
  var form = $('.quote-form');
  if (form) {
    var success = $('[data-form-success]', form);

    function validateField(field) {
      var input = $('input, select, textarea', field);
      if (!input || !input.hasAttribute('required') && input.value === '') return true;
      var ok = true;
      if (input.hasAttribute('required') && !input.value.trim()) ok = false;
      if (ok && input.type === 'email' && input.value) ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value);
      if (ok && input.type === 'tel' && input.value) ok = input.value.replace(/[^0-9]/g, '').length >= 8;
      field.classList.toggle('has-error', !ok);
      return ok;
    }

    $$('.field', form).forEach(function (field) {
      var input = $('input, select, textarea', field);
      if (input) input.addEventListener('blur', function () { validateField(field); });
      if (input) input.addEventListener('input', function () { if (field.classList.contains('has-error')) validateField(field); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      $$('.field', form).forEach(function (field) {
        if (!validateField(field)) valid = false;
      });
      if (!valid) {
        var firstErr = $('.field.has-error input, .field.has-error select, .field.has-error textarea', form);
        if (firstErr) firstErr.focus();
        return;
      }
      // No backend yet — show success state (wire to endpoint/email service later)
      form.reset();
      if (success) {
        success.classList.add('is-visible');
        setTimeout(function () { success.classList.remove('is-visible'); }, 6000);
      }
    });
  }
})();
