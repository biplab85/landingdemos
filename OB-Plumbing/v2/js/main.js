/* ==========================================================================
   OB Plumbing — V2
   Header states, app bar scroll-spy, bottom sheet, quote modal, GSAP motion,
   Swiper carousels, Fancybox gallery, accordion, suburb finder, demo forms.
   ========================================================================== */
(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOBILE = window.matchMedia('(max-width: 991px)');

  const init = () => {
    initHeader();
    initOverlays();
    initSpy();
    initAccordion();
    initSuburbs();
    initForms();
    initSwipers();
    initFancybox();
    initMotion();
    const yr = $('[data-year]');
    if (yr) yr.textContent = new Date().getFullYear();
  };

  /* ---------- 1. Header: solid on scroll, hide on scroll-down (desktop) ---------- */
  function initHeader() {
    const hdr = $('#hdr');
    if (!hdr) return;
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      hdr.classList.toggle('is-scrolled', y > 30);
      const hide = !MOBILE.matches && y > 600 && y > lastY + 4 && !document.body.classList.contains('is-locked');
      if (hide) hdr.classList.add('is-hidden');
      else if (y < lastY - 4 || y < 600) hdr.classList.remove('is-hidden');
      lastY = y;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- 2. Bottom sheet menu + quote modal ---------- */
  function initOverlays() {
    const sheet = $('#sheet');
    const modal = $('#quote');
    let lastFocus = null;

    const open = (el) => {
      if (!el) return;
      closeAll();
      lastFocus = document.activeElement;
      el.classList.add('is-open');
      el.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      if (el === sheet) $$('[data-sheet-open]').forEach((b) => b.setAttribute('aria-expanded', 'true'));
      const focusTarget = $('input, button, a', $('[role="dialog"]', el));
      setTimeout(() => focusTarget && focusTarget.focus({ preventScroll: true }), 320);
    };
    const close = (el) => {
      if (!el || !el.classList.contains('is-open')) return;
      el.classList.remove('is-open');
      el.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      if (el === sheet) $$('[data-sheet-open]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    };
    const closeAll = () => { close(sheet); close(modal); };

    $$('[data-sheet-open]').forEach((b) => b.addEventListener('click', () => open(sheet)));
    $$('[data-modal-open]').forEach((b) => b.addEventListener('click', (e) => {
      e.preventDefault();
      open($('#' + b.getAttribute('data-modal-open')));
    }));
    $$('[data-sheet-close]').forEach((b) => b.addEventListener('click', () => close(sheet)));
    $$('[data-modal-close]').forEach((b) => b.addEventListener('click', () => close(modal)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

    // Swipe-down to dismiss on touch devices
    [sheet, modal].forEach((el) => {
      if (!el) return;
      const panel = $('[role="dialog"]', el);
      let startY = null;
      panel.addEventListener('touchstart', (e) => {
        startY = panel.scrollTop <= 0 ? e.touches[0].clientY : null;
      }, { passive: true });
      panel.addEventListener('touchmove', (e) => {
        if (startY === null) return;
        const dy = e.touches[0].clientY - startY;
        if (dy > 0) panel.style.transform = `translateY(${dy}px)`;
      }, { passive: true });
      panel.addEventListener('touchend', (e) => {
        if (startY === null) return;
        const dy = e.changedTouches[0].clientY - startY;
        panel.style.transform = '';
        startY = null;
        if (dy > 110) close(el);
      });
    });
  }

  /* ---------- 3. Scroll spy: desktop nav + app bar ---------- */
  function initSpy() {
    const sections = $$('main section[id]');
    const navLinks = $$('.nav a[data-nav]');
    const tabs = $$('.appbar [data-tab]');
    const TAB_FOR = {
      top: 'home', trust: 'home', about: 'home',
      services: 'services', process: 'services', work: 'services',
      book: 'book'
    };
    let current = '';

    const setActive = (id) => {
      if (id === current) return;
      current = id;
      navLinks.forEach((a) => a.classList.toggle('is-active', a.dataset.nav === id));
      const tab = TAB_FOR[id];
      tabs.forEach((t) => t.classList.toggle('is-active', t.dataset.tab === tab));
    };

    const onScroll = () => {
      const line = window.innerHeight * 0.35;
      let id = sections[0] ? sections[0].id : '';
      for (const s of sections) {
        if (s.getBoundingClientRect().top - line <= 0) id = s.id;
      }
      setActive(id);
    };
    let raf = 0;
    window.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(onScroll);
    }, { passive: true });
    onScroll();
  }

  /* ---------- 4. FAQ accordion ---------- */
  function initAccordion() {
    const items = $$('.acc__item');
    const toggle = (item, force) => {
      const q = $('.acc__q', item);
      const a = $('.acc__a', item);
      const willOpen = force !== undefined ? force : !item.classList.contains('is-open');
      if (willOpen) {
        item.classList.add('is-open');
        a.style.height = a.scrollHeight + 'px';
        a.addEventListener('transitionend', function done() {
          if (item.classList.contains('is-open')) a.style.height = 'auto';
          a.removeEventListener('transitionend', done);
        });
      } else {
        a.style.height = a.scrollHeight + 'px';
        requestAnimationFrame(() => { a.style.height = '0px'; });
        item.classList.remove('is-open');
      }
      q.setAttribute('aria-expanded', String(willOpen));
    };
    items.forEach((item) => {
      $('.acc__q', item).addEventListener('click', () => {
        const opening = !item.classList.contains('is-open');
        if (opening) items.forEach((o) => o !== item && o.classList.contains('is-open') && toggle(o, false));
        toggle(item);
      });
    });
    if (items[0]) toggle(items[0], true);
  }

  /* ---------- 5. Suburb finder ---------- */
  function initSuburbs() {
    const input = $('#suburbSearch');
    const list = $$('#suburbs li');
    const out = $('#suburbResult');
    if (!input || !list.length) return;
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      let hits = 0;
      list.forEach((li) => {
        const match = q.length > 1 && li.textContent.toLowerCase().includes(q);
        if (match) hits++;
        li.classList.toggle('is-match', match);
        li.classList.toggle('is-dim', q.length > 1 && !match);
      });
      out.className = 'areas__result';
      if (q.length < 2) { out.textContent = ''; return; }
      if (hits) {
        out.classList.add('is-yes');
        out.textContent = `✓ Good news — we service ${hits === 1 ? 'that suburb' : hits + ' matching suburbs'}.`;
      } else {
        out.classList.add('is-no');
        out.innerHTML = 'Not on the list? <a href="tel:0499418867">Call 0499 418 867</a> — chances are we cover it.';
      }
    });
  }

  /* ---------- 6. Demo forms (no backend — show confirmation) ---------- */
  function initForms() {
    $$('[data-form]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let ok = true;
        $$('[required]', form).forEach((el) => {
          const bad = !el.value.trim();
          el.closest('.field').classList.toggle('has-error', bad);
          if (bad && ok) { el.focus(); ok = false; }
        });
        if (!ok) return;
        const msg = $('.qform__ok', form);
        form.reset();
        if (msg) {
          msg.hidden = false;
          setTimeout(() => { msg.hidden = true; }, 6000);
        }
      });
      form.addEventListener('input', (e) => {
        const f = e.target.closest('.field');
        if (f && e.target.value.trim()) f.classList.remove('has-error');
      });
    });
  }

  /* ---------- 7. Swiper carousels ---------- */
  function initSwipers() {
    if (typeof window.Swiper === 'undefined') return;
    new window.Swiper('.work__swiper', {
      slidesPerView: 'auto',
      spaceBetween: 16,
      speed: 650,
      grabCursor: true,
      navigation: { prevEl: '#workPrev', nextEl: '#workNext' },
      pagination: { el: '.work__pag', clickable: true },
      breakpoints: { 992: { spaceBetween: 24 } }
    });
    new window.Swiper('.rev__swiper', {
      slidesPerView: 1.08,
      spaceBetween: 14,
      speed: 600,
      loop: true,
      grabCursor: true,
      autoplay: REDUCED ? false : { delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true },
      navigation: { prevEl: '#revPrev', nextEl: '#revNext' },
      pagination: { el: '.rev__pag', clickable: true },
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 20 },
        1100: { slidesPerView: 3, spaceBetween: 24 }
      }
    });
  }

  /* ---------- 8. Fancybox gallery ---------- */
  function initFancybox() {
    if (typeof window.Fancybox === 'undefined') return;
    window.Fancybox.bind('[data-fancybox="work"]', {
      Hash: false,
      Thumbs: { type: 'classic' },
      Toolbar: { display: { left: ['infobar'], middle: [], right: ['slideshow', 'thumbs', 'close'] } }
    });
  }

  /* ---------- 9. Motion (GSAP + ScrollTrigger) ---------- */
  function initMotion() {
    const reveals = $$('.rv');
    const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

    if (REDUCED) {
      reveals.forEach((el) => el.classList.add('is-in'));
      $$('.count').forEach((el) => { el.textContent = el.dataset.to; });
      return;
    }

    if (!hasGsap) {
      // Fallback: IntersectionObserver reveals + counters
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        });
      }, { rootMargin: '0px 0px -10% 0px' });
      reveals.forEach((el) => io.observe(el));
      $$('.count').forEach((el) => { el.textContent = el.dataset.to; });
      return;
    }

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    // Scroll reveals — staggered per batch, CSS handles the easing
    ScrollTrigger.batch(reveals, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) => batch.forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.08}s`;
        el.classList.add('is-in');
        setTimeout(() => { el.style.transitionDelay = ''; }, 1200 + i * 80);
      })
    });

    // Hero intro
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.hero__title .h-word', { yPercent: 115, duration: 1.1, stagger: 0.06 })
      .from('.h-anim', { y: 26, opacity: 0, duration: 0.9, stagger: 0.1 }, '-=0.75')
      .from('.hero__arch', { scaleY: 0.6, opacity: 0, transformOrigin: '50% 100%', duration: 1.2 }, 0.1)
      .from('.hero__man', { y: 60, opacity: 0, duration: 1.2 }, 0.25)
      .from('.float', { y: 24, opacity: 0, scale: 0.9, duration: 0.8, stagger: 0.12, ease: 'back.out(1.6)' }, 0.75);

    // Floating cards drift with the pointer (desktop only)
    if (!MOBILE.matches && window.matchMedia('(pointer: fine)').matches) {
      const media = $('.hero__media');
      const floats = $$('.float');
      const hero = $('.hero');
      hero && hero.addEventListener('pointermove', (e) => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        floats.forEach((f) => {
          const d = parseFloat(f.dataset.depth || 1);
          gsap.to(f, { x: x * 26 * d, y: y * 20 * d, duration: 1, ease: 'power3.out' });
        });
        media && gsap.to('.hero__man', { x: x * -10, duration: 1.2, ease: 'power3.out' });
      });
    }

    // Hero content eases away as you scroll
    gsap.to('.hero__copy', {
      yPercent: -8, opacity: 0.35, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // Image parallax
    $$('.parallax').forEach((img) => {
      gsap.fromTo(img, { yPercent: -8 }, {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: img.closest('.parallax-wrap') || img, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // Counters
    $$('.count').forEach((el) => {
      const to = parseFloat(el.dataset.to) || 0;
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: () => gsap.to(obj, {
          v: to, duration: 1.8, ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(obj.v); }
        })
      });
    });

    // Process connector draws across
    const line = $('.steps__line');
    if (line) {
      gsap.from(line, {
        scaleX: 0, transformOrigin: '0 50%', duration: 1.6, ease: 'power2.inOut',
        scrollTrigger: { trigger: '.steps', start: 'top 80%', once: true }
      });
    }

    // Step icons pop in sequence
    gsap.from('.step__ico', {
      scale: 0.4, rotate: -25, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.8)',
      scrollTrigger: { trigger: '.steps', start: 'top 80%', once: true }
    });

    // Recalculate after images/fonts settle
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
