/* ==========================================================================
   OB Plumbing — main.js
   Vanilla ES6. Progressive enhancement: the page works without JS;
   this layer adds nav, scroll reveals (GSAP), sliders (Swiper),
   lightbox (Fancybox), count-up stats and the booking form UX.
   ========================================================================== */
(() => {
  'use strict';

  document.documentElement.classList.remove('no-js');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ----------------------------------------------------------------------
     1. Sticky header — add shadow/border once scrolled
  ---------------------------------------------------------------------- */
  const header = $('.header');
  const onScroll = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ----------------------------------------------------------------------
     2. Off-canvas drawer (canvas expander)
  ---------------------------------------------------------------------- */
  const toggle = $('#menuToggle');
  const drawer = $('#offcanvas');
  const ocClose = $('#ocClose');
  const scrim  = $('#scrim');

  const setNav = (open) => {
    if (!drawer) return;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    if (scrim) scrim.classList.toggle('is-open', open);
    if (toggle) toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
  };

  toggle && toggle.addEventListener('click', () =>
    setNav(!drawer.classList.contains('is-open'))
  );
  ocClose && ocClose.addEventListener('click', () => setNav(false));
  scrim && scrim.addEventListener('click', () => setNav(false));
  drawer && $$('a', drawer).forEach((a) => a.addEventListener('click', () => setNav(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setNav(false);
  });

  /* ----------------------------------------------------------------------
     2b. Booking modal (opened by any link to #book / "Get a free quote")
  ---------------------------------------------------------------------- */
  const modal = $('#bookingModal');
  const modalClose = $('#bookClose');
  let lastFocus = null;

  const openModal = () => {
    if (!modal) return;
    lastFocus = document.activeElement;
    setNav(false); // close drawer if open
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    const firstField = $('#name', modal);
    if (firstField) setTimeout(() => firstField.focus(), 60);
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  if (modal) {
    // any link to #book opens the modal instead of jumping
    $$('a[href="#book"]').forEach((a) =>
      a.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      })
    );
    modalClose && modalClose.addEventListener('click', closeModal);
    $$('[data-close-modal]', modal).forEach((el) =>
      el.addEventListener('click', closeModal)
    );
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  /* ----------------------------------------------------------------------
     3. Scroll reveals (GSAP + ScrollTrigger, with IO fallback)
  ---------------------------------------------------------------------- */
  const revealEls = $$('.reveal');

  const showAll = () => revealEls.forEach((el) => el.classList.add('is-in'));

  if (prefersReduced) {
    showAll();
  } else if (window.gsap && window.ScrollTrigger) {
    const { gsap } = window;
    gsap.registerPlugin(window.ScrollTrigger);

    // Group reveals by an optional data-reveal-group for stagger
    revealEls.forEach((el) => {
      const delay = parseFloat(el.dataset.revealDelay || 0);
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          onComplete: () => el.classList.add('is-in'),
        }
      );
    });
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    showAll();
  }

  /* ----------------------------------------------------------------------
     4. Hero entrance timeline (load)
  ---------------------------------------------------------------------- */
  if (!prefersReduced && window.gsap) {
    const heroBits = $$('[data-hero]');
    if (heroBits.length) {
      window.gsap.fromTo(
        heroBits,
        { autoAlpha: 0, y: 26 },
        { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.1 }
      );
    }
  }

  /* ----------------------------------------------------------------------
     5. Count-up stats
  ---------------------------------------------------------------------- */
  const counters = $$('.count');
  if (counters.length) {
    const runCount = (el) => {
      const target = parseFloat(el.dataset.to || '0');
      const dur = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toString();
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toString();
      };
      requestAnimationFrame(tick);
    };

    if (prefersReduced || !('IntersectionObserver' in window)) {
      counters.forEach((el) => (el.textContent = el.dataset.to));
    } else {
      const cio = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runCount(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((el) => cio.observe(el));
    }
  }

  /* ----------------------------------------------------------------------
     6. Testimonials slider (Swiper)
  ---------------------------------------------------------------------- */
  if (window.Swiper && $('.testi-swiper')) {
    /* eslint-disable no-new */
    new window.Swiper('.testi-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      grabCursor: true,
      loop: true,
      speed: 550,
      autoplay: prefersReduced ? false : { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.testi-pagination', clickable: true },
      navigation: { nextEl: '#testiNext', prevEl: '#testiPrev' },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  }

  /* ----------------------------------------------------------------------
     7. Fancybox (gallery lightbox)
  ---------------------------------------------------------------------- */
  if (window.Fancybox) {
    window.Fancybox.bind('[data-fancybox]', {
      Toolbar: { display: { left: [], middle: [], right: ['close'] } },
    });
  }

  /* ----------------------------------------------------------------------
     8. Booking form (demo — no backend; show confirmation)
  ---------------------------------------------------------------------- */
  const form = $('#bookForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const ok = $('#bookOk');
      if (ok) {
        ok.hidden = false;
        ok.setAttribute('role', 'status');
      }
      form.querySelectorAll('input, select, textarea, button').forEach((el) => {
        if (el.type !== 'submit') el.value = '';
      });
      if (ok) ok.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'center' });
    });
  }

  /* ----------------------------------------------------------------------
     8b. Footer accordions (mobile only — desktop CSS keeps lists open)
  ---------------------------------------------------------------------- */
  $$('.footer__acc-toggle').forEach((h) => {
    h.addEventListener('click', () => {
      const col = h.closest('.footer__col--acc');
      if (!col) return;
      const open = col.classList.toggle('is-open');
      h.setAttribute('aria-expanded', String(open));
    });
  });

  /* ----------------------------------------------------------------------
     9. Mobile app tab bar — active state follows the section in view
  ---------------------------------------------------------------------- */
  const appTabs = $$('.appbar [data-appnav]');
  if (appTabs.length && 'IntersectionObserver' in window) {
    const byId = new Map();
    appTabs.forEach((tab) => {
      const id = (tab.getAttribute('href') || '').replace('#', '');
      const sec = id === 'top' ? $('#top') : document.getElementById(id);
      if (sec) byId.set(sec, tab);
    });

    const setActive = (tab) => {
      appTabs.forEach((t) => t.classList.toggle('is-active', t === tab));
    };

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tab = byId.get(entry.target);
            if (tab) setActive(tab);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    byId.forEach((_tab, sec) => spy.observe(sec));
  }

  /* ----------------------------------------------------------------------
     10. Footer year
  ---------------------------------------------------------------------- */
  const yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
