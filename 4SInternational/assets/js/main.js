/* ═══════════════════════════════════════════════════════════════
   4S INTERNATIONAL — main.js
   nav · Swiper · Fancybox (quote modal) · GSAP reveals + counters
   ═══════════════════════════════════════════════════════════════ */
(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ── 1. Sticky header shadow ── */
  const header = $('#header');
  const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── 1b. App-bar reveal: hidden at top, show on scroll-down, hide on scroll-up ── */
  const appBar = $('.app-bar');
  if (appBar) {
    const TOP = 40, JITTER = 8;
    let lastY = window.scrollY, ticking = false;
    const updateBar = () => {
      const y = window.scrollY;
      if (y <= TOP)               appBar.classList.remove('is-visible'); // near top → hidden
      else if (y > lastY + JITTER) appBar.classList.add('is-visible');   // scrolling down → show
      else if (y < lastY - JITTER) appBar.classList.remove('is-visible');// scrolling up → hide
      lastY = y;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(updateBar); }
    }, { passive: true });
  }

  /* ── 2. Mobile nav ── */
  const toggle = $('.nav-toggle');
  const drawer = $('#mobile-nav');
  if (toggle && drawer) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      if (open) {
        drawer.hidden = false;
        requestAnimationFrame(() => drawer.classList.add('is-open'));
        document.body.style.overflow = 'hidden';
      } else {
        drawer.classList.remove('is-open');
        document.body.style.overflow = '';
        setTimeout(() => (drawer.hidden = true), 420);
      }
    };
    toggle.addEventListener('click', () =>
      setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    $$('.mobile-nav__link, .mobile-nav .btn', drawer)
      .forEach(a => a.addEventListener('click', () => setOpen(false)));

    // app-bar "Menu" button reuses the same drawer
    const appBarMenu = $('#appBarMenu');
    if (appBarMenu) appBarMenu.addEventListener('click', () =>
      setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  }

  /* ── 2b. Theme toggle (light / dark) ── */
  const themeBtn = $('#themeToggle');
  if (themeBtn) {
    const root = document.documentElement;
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      // brief global colour transition only while switching
      root.classList.add('theme-anim');
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      window.setTimeout(() => root.classList.remove('theme-anim'), 450);
    });
  }

  /* ── 3. Products slider (Swiper) ── */
  if (window.Swiper && $('.products__swiper')) {
    new Swiper('.products__swiper', {
      slidesPerView: 'auto',
      spaceBetween: 18,
      grabCursor: true,
      speed: 520,
      scrollbar: { el: '.swiper-scrollbar', draggable: true },
      navigation: { prevEl: '.sw-prev', nextEl: '.sw-next' },
      keyboard: { enabled: true },
      breakpoints: { 768: { spaceBetween: 24 } }
    });
  }

  /* ── 3b. About hero image slider (Swiper, fade + autoplay) ── */
  if (window.Swiper && $('.hero-slider')) {
    new Swiper('.hero-slider', {
      effect: 'fade',
      fadeEffect: { crossFade: true },
      loop: true,
      speed: 1400,
      grabCursor: true,
      // autoplay only when motion is allowed
      autoplay: reduceMotion ? false : { delay: 4500, disableOnInteraction: false },
      pagination: { el: '.about-hero__dots', clickable: true }
    });
  }

  /* ── 4. Quote modal (Fancybox, inline #quote) ── */
  if (window.Fancybox) {
    Fancybox.bind('[data-quote]', {
      src: '#quote',
      type: 'inline',
      dragToClose: false,
      autoFocus: true,
      on: {
        done: (fb) => {
          const form = $('.qform', fb.container);
          if (form && !form.dataset.bound) bindForm(form);
        }
      }
    });
    // image gallery lightbox
    if ($('[data-fancybox="gallery"]')) Fancybox.bind('[data-fancybox="gallery"]', { Carousel: { infinite: false } });
  }

  /* ── 4d. Masonry image gallery (relayout once images load) ── */
  if (window.Masonry && $('.masonry')) {
    const grid = $('.masonry');
    const msnry = new Masonry(grid, {
      itemSelector: '.masonry__item',
      columnWidth: '.masonry__sizer',
      gutter: '.masonry__gutter',
      percentPosition: true,
      transitionDuration: '0.3s'
    });
    if (window.imagesLoaded) imagesLoaded(grid).on('progress', () => msnry.layout());
  }

  /* form: lightweight client-side validation + success state */
  function bindForm(form) {
    form.dataset.bound = '1';
    const ok = $('.qform__ok', form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      // TODO: wire to backend / Formspree / PHP handler (see TASK_PLAN §11)
      form.querySelectorAll('input,select,textarea,button').forEach(el => el.disabled = true);
      if (ok) ok.hidden = false;
    });
  }

  /* ── 4b. FAQ accordion (accessible) ── */
  $$('.acc__trigger').forEach(btn => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.style.height = open ? '0px' : panel.scrollHeight + 'px';
      if (!open) {
        // settle to auto after the transition so content can reflow
        panel.addEventListener('transitionend', function te() {
          if (btn.getAttribute('aria-expanded') === 'true') panel.style.height = 'auto';
          panel.removeEventListener('transitionend', te);
        });
      }
    });
  });

  /* ── 4b-2. Footer column accordions (mobile only ≤520px) ── */
  (() => {
    const btns = $$('.footer__acc');
    if (!btns.length) return;
    const mq = window.matchMedia('(max-width: 520px)');
    const panelOf = b => document.getElementById(b.getAttribute('aria-controls'));
    const sync = () => {
      btns.forEach(b => {
        const p = panelOf(b);
        if (!p) return;
        // mobile: collapse unless expanded · desktop: clear inline height (stays fully open)
        p.style.height = mq.matches
          ? (b.getAttribute('aria-expanded') === 'true' ? 'auto' : '0px')
          : '';
      });
    };
    btns.forEach(b => {
      const p = panelOf(b);
      if (!p) return;
      b.addEventListener('click', () => {
        if (!mq.matches) return;                 // desktop: toggle is inert
        const open = b.getAttribute('aria-expanded') === 'true';
        b.setAttribute('aria-expanded', String(!open));
        p.style.height = open ? '0px' : p.scrollHeight + 'px';
        if (!open) {
          p.addEventListener('transitionend', function te() {
            if (b.getAttribute('aria-expanded') === 'true') p.style.height = 'auto';
            p.removeEventListener('transitionend', te);
          });
        }
      });
    });
    mq.addEventListener('change', sync);
    sync();
  })();

  /* ── 4c. On-page forms (quote + general) ── */
  $$('form.qform, form.cform').forEach(form => {
    if (form.dataset.bound) return;
    form.dataset.bound = '1';
    const ok = $('.qform__ok', form) || $('.cform__ok', form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      // TODO: wire to backend / Formspree / PHP handler (see TASK_PLAN §11)
      form.querySelectorAll('input,select,textarea,button').forEach(el => el.disabled = true);
      if (ok) ok.hidden = false;
    });
  });

  /* ── 5. GSAP reveals, counters, hero load ── */
  if (window.gsap && !reduceMotion) {
    const gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
    document.body.classList.add('is-ready');

    // hero entrance (staggered) — only on pages that have the home hero
    if ($('.hero')) {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero__title .line', { yPercent: 110, duration: .9, stagger: .08 })
        .from('.hero__sub', { y: 20, opacity: 0, duration: .7 }, '-=.5')
        .from('.hero__cta > *', { y: 16, opacity: 0, duration: .6, stagger: .1 }, '-=.45')
        .from('.hero__bearing', { scale: .82, opacity: 0, rotate: -22, duration: 1.1, ease: 'power2.out' }, '-=1.0');
    }

    // scroll reveals
    $$('.reveal').forEach(el => {
      const delay = parseFloat(el.dataset.delay || 0);
      gsap.to(el, {
        y: 0, opacity: 1, duration: .85, delay, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%' }
      });
    });

    // sticky stacking: previous product cards recede (scale down) as the next stacks over
    const stackCards = $$('.prodlist .pblock');
    if (window.ScrollTrigger && stackCards.length > 1) {
      stackCards.forEach((card, i) => {
        if (i === stackCards.length - 1) return; // front-most card stays full size
        gsap.to(card, {
          scale: 0.9, ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top ' + (82 + i * 38) + 'px',
            end: () => '+=' + Math.round(card.offsetHeight * 0.9 + 60),
            scrub: true
          }
        });
      });
    }

    // animated counters
    $$('.stat__num').forEach(el => {
      const target = +el.dataset.count;
      const obj = { v: 0 };
      window.ScrollTrigger && gsap.to(obj, {
        v: target, duration: 1.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
        onUpdate: () => {
          el.textContent = target >= 100
            ? Math.round(obj.v)
            : String(Math.round(obj.v)).padStart(2, '0');
        }
      });
    });
  } else {
    // no GSAP / reduced motion → ensure everything is visible
    document.body.classList.add('is-ready');
    $$('.reveal').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    $$('.stat__num').forEach(el => {
      const t = +el.dataset.count;
      el.textContent = t >= 100 ? t : String(t).padStart(2, '0');
    });
  }
})();
