/*!
 * ==========================================================================
 * Velora — Rent-a-Car · main.js (v1 root)
 * --------------------------------------------------------------------------
 * Author : Biplab Paul
 * Email  : biplab.cse.85@gmail.com
 * Phone  : 01735927356
 * --------------------------------------------------------------------------
 * Motion: GSAP 3.12 + ScrollTrigger (gsap.matchMedia for desktop / tablet /
 * reduced motion), Lenis smooth scroll, Swiper (member stories).
 * JS hooks are js-* classes / data-* attributes; state classes are is-*.
 * Everything degrades gracefully: if a CDN library is missing the page
 * stays fully visible and usable.
 * ==========================================================================
 */
(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  if (hasGsap && !reduceMotion) {
    root.classList.add('has-motion');
  }

  /* ------------------------------------------------------------------------
   * Smooth scroll (Lenis) + in-page anchors
   * --------------------------------------------------------------------- */
  let lenis = null;

  if (typeof window.Lenis !== 'undefined' && !reduceMotion) {
    lenis = new window.Lenis({ lerp: 0.1, wheelMultiplier: 1 });

    if (hasGsap) {
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add((time) => lenis.raf(time * 1000));
      window.gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  /* ------------------------------------------------------------------------
   * In-page anchors: smooth scroll (Lenis when running), offset by the
   * fixed bar that is visible (desktop nav or mobile app bar)
   * --------------------------------------------------------------------- */
  const nav = $('.js-nav');
  const appbar = $('.js-appbar');
  const tabbar = $('.js-tabbar');
  const mqDesktop = window.matchMedia('(min-width: 992px)');

  function barOffset() {
    const bar = mqDesktop.matches ? nav : appbar;
    return bar ? bar.getBoundingClientRect().height : 0;
  }

  function scrollToTarget(target) {
    // Desktop sections carry generous top padding, so they slide in under the
    // glass bar; on mobile the sheet stops just below the app bar.
    const offset = mqDesktop.matches ? 0 : barOffset() + 8;
    const y = target.id === 'top'
      ? 0
      : Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
    if (lenis) {
      lenis.scrollTo(y, { duration: 1.2 });
    } else {
      window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      if (link.classList.contains('js-spy-link')) setActive(id.slice(1));
    });
  });

  /* ------------------------------------------------------------------------
   * Scroll-spy: desktop nav + mobile tab bar share js-spy-link hooks.
   * The active link gets is-active + aria-current="true"; the tab bar's
   * sliding pill follows via the --i custom property.
   * --------------------------------------------------------------------- */
  const spyLinks = $$('.js-spy-link');
  const spyIds = Array.from(new Set(spyLinks.map((l) => l.getAttribute('href').slice(1))));
  const spySections = spyIds.map((id) => document.getElementById(id)).filter(Boolean);
  const tabLinks = tabbar ? $$('.js-spy-link', tabbar) : [];
  const navLinks = nav ? $$('.js-spy-link', nav) : [];
  const linkGroups = [navLinks, tabLinks].filter((g) => g.length);
  const docOrder = spySections
    .slice()
    .sort((x, y) => (x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
    .map((el) => el.id);
  let currentId = null;
  let lockUntil = 0;

  function setActive(id, fromSpy) {
    if (fromSpy && Date.now() < lockUntil) return;
    if (!fromSpy) lockUntil = Date.now() + 1300;
    if (id === currentId) return;
    currentId = id;

    // Each link group (desktop nav, tab bar) highlights the exact section,
    // or the closest preceding section it has a link for.
    const pos = docOrder.indexOf(id);
    linkGroups.forEach((group) => {
      let match = null;
      group.forEach((link) => {
        const p = docOrder.indexOf(link.getAttribute('href').slice(1));
        if (p > -1 && p <= pos && (!match || p >= match.p)) match = { link, p };
      });
      group.forEach((link, index) => {
        const on = Boolean(match) && link === match.link;
        link.classList.toggle('is-active', on);
        if (on) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
        if (on && group === tabLinks && tabbar) tabbar.style.setProperty('--i', String(index));
      });
      if (group === tabLinks && tabbar) tabbar.classList.toggle('has-active', Boolean(match));
    });
  }

  function spy() {
    const line = barOffset() + window.innerHeight * 0.3;
    let active = spySections.length ? spySections[0].id : null;
    spySections.forEach((section) => {
      if (section.getBoundingClientRect().top <= line) active = section.id;
    });
    if (active) setActive(active, true);

    const scrolled = window.scrollY > 24;
    if (nav) nav.classList.toggle('is-stuck', scrolled);
    if (appbar) appbar.classList.toggle('is-scrolled', scrolled);
  }

  let spyTicking = false;
  const requestSpy = () => {
    if (spyTicking) return;
    spyTicking = true;
    requestAnimationFrame(() => {
      spyTicking = false;
      spy();
    });
  };

  window.addEventListener('scroll', requestSpy, { passive: true });
  window.addEventListener('resize', requestSpy);
  // If a click-scroll is interrupted (wheel / touch), let the spy take over again
  ['wheel', 'touchstart', 'keydown'].forEach((evt) => {
    window.addEventListener(evt, () => { lockUntil = 0; }, { passive: true });
  });
  spy();

  /* ------------------------------------------------------------------------
   * Hero: fit the display word to the container, motion pause toggle
   * --------------------------------------------------------------------- */
  const fitEl = $('.js-fit');

  function fitTitle() {
    if (!fitEl) return;
    fitEl.style.fontSize = '';
    const parent = fitEl.parentElement;
    // Measure the word itself (inline-block clone of the text box) and scale
    // it so the display word spans the full container, edge to edge.
    const cs = getComputedStyle(parent);
    const avail = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const range = document.createRange();
    range.selectNodeContents(fitEl);
    const width = range.getBoundingClientRect().width;
    if (width && Math.abs(width - avail) / avail > 0.01) {
      const size = parseFloat(getComputedStyle(fitEl).fontSize);
      fitEl.style.fontSize = (size * (avail / width) * 0.995).toFixed(2) + 'px';
    }
  }

  fitTitle();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitTitle);
  }
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitTitle, 120);
  });

  const hero = $('.js-hero');
  const heroToggle = $('.js-hero-toggle');

  if (hero && heroToggle) {
    if (reduceMotion) hero.classList.add('is-paused');
    heroToggle.addEventListener('click', () => {
      const paused = hero.classList.toggle('is-paused');
      heroToggle.setAttribute('aria-pressed', String(paused));
      heroToggle.setAttribute('aria-label', paused ? 'Play background motion' : 'Pause background motion');
    });
  }

  /* ------------------------------------------------------------------------
   * Rental categories: hover / focus reveals the matching image layer
   * --------------------------------------------------------------------- */
  const catList = $('.js-cat-list');

  if (catList) {
    const items = $$('.js-cat-item', catList);
    const layers = $$('.js-cat-layer');

    const activate = (key) => {
      catList.classList.toggle('is-hovering', Boolean(key));
      items.forEach((el) => el.classList.toggle('is-active', el.dataset.cat === key));
      layers.forEach((el) => el.classList.toggle('is-active', el.dataset.cat === key));
    };

    items.forEach((item) => {
      item.addEventListener('mouseenter', () => activate(item.dataset.cat));
      item.addEventListener('focus', () => activate(item.dataset.cat));
    });

    catList.addEventListener('mouseleave', () => activate(null));
    catList.addEventListener('focusout', (e) => {
      if (!catList.contains(e.relatedTarget)) activate(null);
    });
  }

  /* ------------------------------------------------------------------------
   * FAQ accordion (single open)
   * --------------------------------------------------------------------- */
  $$('.js-acc').forEach((group) => {
    const buttons = $$('.js-acc-btn', group);

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.c-acc');
        const willOpen = !item.classList.contains('is-open');

        buttons.forEach((other) => {
          other.closest('.c-acc').classList.remove('is-open');
          other.setAttribute('aria-expanded', 'false');
        });

        if (willOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }

        if (hasGsap) {
          setTimeout(() => window.ScrollTrigger.refresh(), 520);
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
   * Member stories slider
   * --------------------------------------------------------------------- */
  if (typeof window.Swiper !== 'undefined' && $('.js-reviews')) {
    // eslint-disable-next-line no-new
    new window.Swiper('.js-reviews', {
      slidesPerView: 'auto',
      spaceBetween: 30,
      speed: 600,
      grabCursor: true,
      navigation: {
        prevEl: '.js-rev-prev',
        nextEl: '.js-rev-next',
      },
      breakpoints: {
        0: { spaceBetween: 20 },
        768: { spaceBetween: 30 },
      },
    });
  }

  /* ------------------------------------------------------------------------
   * Footer: subscribe form + year
   * --------------------------------------------------------------------- */
  const year = $('.js-year');
  if (year) year.textContent = String(new Date().getFullYear());

  const form = $('.js-subscribe');
  const note = $('.js-subscribe-note');

  if (form && note) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const ok = input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      note.classList.toggle('is-success', ok);
      note.textContent = ok
        ? 'You are on the list. Expect a note from our concierge within 24 hours.'
        : 'Please enter a valid email address.';
      if (ok) form.reset();
    });
  }

  /* ------------------------------------------------------------------------
   * Counters (count up once in view)
   * --------------------------------------------------------------------- */
  const counters = $$('.js-count');

  /* ------------------------------------------------------------------------
   * GSAP motion
   * --------------------------------------------------------------------- */
  if (!hasGsap || reduceMotion) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  // Load-in (hero)
  gsap.fromTo('[data-load]',
    { autoAlpha: 0, y: 60 },
    { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.14, delay: 0.15 }
  );

  // Scroll reveals
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => gsap.fromTo(batch,
      { autoAlpha: 0, y: 50 },
      { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12, overwrite: true }
    ),
  });

  // Counters
  counters.forEach((el) => {
    const target = parseFloat(el.dataset.target) || 0;
    const obj = { value: 0 };
    el.textContent = '0';
    gsap.to(obj, {
      value: target,
      duration: 3,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: () => { el.textContent = Math.round(obj.value).toLocaleString(); },
      onComplete: () => { el.textContent = target.toLocaleString(); },
    });
  });

  // Showroom background drift
  $$('.js-parallax').forEach((img) => {
    gsap.fromTo(img, { yPercent: -6 }, {
      yPercent: 6,
      ease: 'none',
      scrollTrigger: { trigger: img.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  const mm = gsap.matchMedia();

  // Desktop-only scroll choreography (matches the reference: tablet and
  // mobile get the static layouts)
  mm.add('(min-width: 992px)', () => {
    // About: side photos fan out from behind the centre one
    const fan = $('.js-fan');
    if (fan) {
      $$('.js-fan-item', fan).forEach((item) => {
        const dir = parseFloat(item.dataset.fan) || 0;
        gsap.from(item, {
          x: dir * 150,
          rotate: 0,
          scale: 0.85,
          autoAlpha: 0,
          ease: 'power3.out',
          duration: 1.4,
          scrollTrigger: { trigger: fan, start: 'top 80%', once: true },
        });
      });
    }

    // How it works: outer cards slide out from behind the middle one
    const steps = $('.js-steps');
    if (steps) {
      $$('.js-step', steps).forEach((card) => {
        const dir = parseFloat(card.dataset.dir) || 0;
        gsap.from(card, {
          xPercent: dir * 104,
          rotate: dir * -4,
          ease: 'power2.out',
          scrollTrigger: { trigger: steps, start: 'top 85%', end: 'top 35%', scrub: 0.8 },
        });
      });
    }

    // Reserve gallery: stacked photos fly out to the edges of the viewport
    const gallery = $('.js-gallery');
    if (gallery) {
      const imgs = $$('.js-gallery-img', gallery);
      const caption = $('.js-gallery-caption', gallery);
      // [x as share of viewport width, y as share of viewport height, scale, rotation]
      const spots = [
        [-0.36, -0.26, 0.5, -6],
        [0.36, -0.28, 0.46, 5],
        [-0.40, 0.22, 0.44, 4],
        [0.38, 0.24, 0.5, -4],
        [-0.14, -0.40, 0.3, -3],
        [0.15, 0.40, 0.32, 3],
        [-0.17, 0.39, 0.3, -2],
      ];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gallery,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      imgs.forEach((img, i) => {
        const s = spots[i % spots.length];
        tl.to(img, {
          x: () => s[0] * window.innerWidth,
          y: () => s[1] * window.innerHeight,
          scale: s[2],
          rotate: s[3],
          ease: 'power2.inOut',
          duration: 1,
        }, i * 0.06);
      });

      if (caption) {
        tl.fromTo(caption, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.45);
      }
    }

    return () => {};
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
