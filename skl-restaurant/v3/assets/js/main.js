/*!
 * ==========================================================================
 * Sklentr v3 — main.js (split-screen night edition)
 * --------------------------------------------------------------------------
 * Author : Biplab Paul
 * Email  : biplab.cse.85@gmail.com
 * Phone  : 01735927356
 * --------------------------------------------------------------------------
 * Loader sweep, Swiper hero, section-synced photo panel, scroll reveals,
 * app-style phone UI (tab bar, chips), reservation form, Fancybox.
 * ==========================================================================
 */
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animate = hasGsap && !reduceMotion;
  const desktopMQ = window.matchMedia('(min-width: 992px)');

  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  let lenis = null;

  /* ---------------------------------------------------------------------
   * Toast
   * ------------------------------------------------------------------- */
  const Toast = (() => {
    const el = $('.js-toast');
    const text = $('.js-toast-text');
    let timer;
    return {
      show(msg) {
        if (!el) return;
        text.textContent = msg;
        el.classList.add('is-visible');
        clearTimeout(timer);
        timer = setTimeout(() => el.classList.remove('is-visible'), 3200);
      },
    };
  })();

  /* ---------------------------------------------------------------------
   * Smooth scroll (desktop only — phones keep native momentum)
   * ------------------------------------------------------------------- */
  function initSmoothScroll() {
    if (!animate || typeof window.Lenis === 'undefined' || !desktopMQ.matches) return;
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  function initAnchors() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const offset = desktopMQ.matches ? 0 : -(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--topbar-h')) || 64) - (link.classList.contains('js-chip') ? 70 : 0);
      if (lenis) {
        lenis.scrollTo(target, { offset, duration: 1.4 });
      } else {
        const y = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  }

  /* ---------------------------------------------------------------------
   * Loader + intro
   * ------------------------------------------------------------------- */
  function initLoader(onDone) {
    const loader = $('.js-loader');
    if (!animate) {
      if (loader) loader.remove();
      onDone();
      return;
    }
    const fill = $('.js-loader-fill');
    const dark = $('.js-loader-dark');
    gsap.set([fill, dark], { scaleX: 0, transformOrigin: 'left center' });
    gsap.timeline({ onComplete: () => { loader.remove(); } })
      .to(fill, { scaleX: 1, duration: 0.6, ease: 'power3.inOut' })
      .to(dark, { scaleX: 1, duration: 0.6, ease: 'power3.inOut' }, '-=0.3')
      .set(fill, { autoAlpha: 0 })
      .set(loader, { background: 'transparent' })
      .set(dark, { transformOrigin: 'right center' })
      .add(onDone)
      .to(dark, { scaleX: 0, duration: 0.85, ease: 'power3.inOut' });
  }

  /* ---------------------------------------------------------------------
   * Display titles: split into masked lines for the reveal
   * ------------------------------------------------------------------- */
  function splitLines(el) {
    const words = [];
    const walk = (node, accent) => {
      node.childNodes.forEach((child) => {
        if (child.nodeType === 3) {
          child.textContent.split(/\s+/).filter(Boolean).forEach((w) => words.push({ w, accent }));
        } else if (child.nodeType === 1) {
          walk(child, accent || child.tagName === 'EM');
        }
      });
    };
    walk(el, false);
    el.setAttribute('aria-label', el.textContent.trim().replace(/\s+/g, ' '));
    el.innerHTML = words.map(({ w, accent }) => `<span class="c-word" style="display:inline-block">${accent ? `<em>${w}</em>` : w}</span>`).join(' ');

    // Group words by their rendered line
    const lines = [];
    let top = null;
    $$('.c-word', el).forEach((span) => {
      if (span.offsetTop !== top) {
        top = span.offsetTop;
        lines.push([]);
      }
      lines[lines.length - 1].push(span.innerHTML);
    });
    el.innerHTML = lines.map((l) => `<span class="c-line" aria-hidden="true"><span>${l.join(' ')}</span></span>`).join('');
    return $$('.c-line > span', el);
  }

  /* ---------------------------------------------------------------------
   * Scroll reveals
   * ------------------------------------------------------------------- */
  function initReveals() {
    if (!animate) return;

    const heroLines = [];
    $$('.js-lines').forEach((el) => {
      const lines = splitLines(el);
      if (el.closest('#home')) {
        heroLines.push(...lines);
        gsap.set(lines, { yPercent: 105 });
      } else {
        gsap.from(lines, {
          yPercent: 105,
          duration: 1.1,
          stagger: 0.1,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      }
    });

    // Hero copy waits for the loader
    const heroFades = $$('#home .js-fade');
    gsap.set(heroFades, { autoAlpha: 0, y: 30 });

    $$('.js-fade').filter((el) => !el.closest('#home')).forEach((el) => {
      gsap.from(el, {
        autoAlpha: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });

    ScrollTrigger.batch('.js-row', {
      start: 'top 92%',
      onEnter: (batch) => gsap.fromTo(batch, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out', overwrite: true }),
    });
    gsap.set('.js-row', { autoAlpha: 0 });

    // Counters
    $$('.js-count').forEach((el) => {
      const to = Number(el.dataset.to);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: to,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%' },
        onUpdate: () => { el.textContent = Math.round(obj.v); },
      });
    });

    return () => {
      const tl = gsap.timeline();
      tl.to(heroLines, { yPercent: 0, duration: 1.2, stagger: 0.12, ease: 'power4.out' })
        .to(heroFades, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' }, '-=0.8')
        .from('.c-aside__media', { scale: 1.12, duration: 1.8, ease: 'power3.out' }, 0)
        .from('.c-aside__top > *, .c-aside__foot', { autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.12, ease: 'power3.out' }, 0.2);
    };
  }

  /* ---------------------------------------------------------------------
   * Hero slider (Swiper) with counter + progress
   * ------------------------------------------------------------------- */
  function initSlider() {
    const el = $('.js-hero-swiper');
    if (!el || typeof window.Swiper === 'undefined') return;
    const DELAY = 5500;
    const current = $('.js-slide-current');
    const bar = $('.js-slide-bar');
    const total = el.querySelectorAll('.swiper-slide').length;
    $('.js-slide-total').textContent = String(total).padStart(2, '0');

    const runBar = () => {
      if (!bar) return;
      if (hasGsap) gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: DELAY / 1000, ease: 'none', overwrite: true });
      else bar.style.transform = 'scaleX(1)';
    };

    const swiper = new Swiper(el, {
      effect: 'fade',
      fadeEffect: { crossFade: true },
      loop: true,
      speed: 1400,
      allowTouchMove: true,
      autoplay: reduceMotion ? false : { delay: DELAY, disableOnInteraction: false },
      navigation: { prevEl: '.js-slide-prev', nextEl: '.js-slide-next' },
      on: {
        init: runBar,
        slideChange(s) {
          current.textContent = String(s.realIndex + 1).padStart(2, '0');
          runBar();
        },
      },
    });
    return swiper;
  }

  /* ---------------------------------------------------------------------
   * Sections: nav + tab bar active state, photo panel swap, caption
   * ------------------------------------------------------------------- */
  function initSections() {
    const navLinks = $$('.js-nav-link');
    const tabs = $$('.js-tab');
    const layers = $$('.js-aside-layer');
    const caption = $('.js-aside-caption');
    let currentId = 'home';
    let currentLayer = null;
    let zTop = 1;

    const swapLayer = (id) => {
      if (!desktopMQ.matches) return;
      const next = layers.find((l) => l.dataset.for === id) || null;
      if (next === currentLayer) return;
      const prev = currentLayer;
      currentLayer = next;

      if (!animate) {
        layers.forEach((l) => { l.style.visibility = l === next ? 'visible' : 'hidden'; l.style.clipPath = 'none'; });
        return;
      }
      if (next) {
        zTop += 1;
        gsap.set(next, { zIndex: zTop, visibility: 'visible' });
        gsap.fromTo(next, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power4.inOut', overwrite: true });
        gsap.fromTo($('img', next), { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'power3.out', overwrite: true });
        if (prev) gsap.to($('img', prev), { scale: 1.08, duration: 1.1, ease: 'power3.inOut', onComplete: () => gsap.set(prev, { visibility: 'hidden' }) });
      } else if (prev) {
        // Back to the hero slider: wipe the photo away downwards
        gsap.to(prev, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'power4.inOut', onComplete: () => gsap.set(prev, { visibility: 'hidden' }) });
      }
    };

    const setActive = (section) => {
      const id = section.id;
      if (id === currentId) return;
      currentId = id;
      navLinks.forEach((a) => {
        const on = a.getAttribute('href') === `#${id}`;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
      tabs.forEach((t) => t.classList.toggle('is-active', t.dataset.for === id || (id === 'about' && t.dataset.for === 'home')));
      swapLayer(id);
      // Caption only for sections that have one (none in the hero)
      if (caption) {
        const text = section.dataset.caption || '';
        if (animate) {
          gsap.to(caption, { autoAlpha: 0, y: -8, duration: 0.25, onComplete: () => { caption.textContent = text; if (text) gsap.to(caption, { autoAlpha: 0.85, y: 0, duration: 0.4 }); } });
        } else {
          caption.textContent = text;
        }
      }
    };

    if (hasGsap) {
      $$('.js-section').forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setActive(section),
        });
      });
    }
  }

  /* ---------------------------------------------------------------------
   * Phone app chrome: top bar shadow, menu chips scroll-spy
   * ------------------------------------------------------------------- */
  function initAppChrome() {
    const topbar = $('.js-topbar');
    const onScroll = () => topbar && topbar.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const chips = $$('.js-chip');
    const rail = $('.c-chips__rail');
    if (!hasGsap || !chips.length) return;
    $$('.js-menu-group').forEach((group) => {
      ScrollTrigger.create({
        trigger: group,
        start: 'top 40%',
        end: 'bottom 40%',
        onToggle: (self) => {
          if (!self.isActive) return;
          chips.forEach((c) => {
            const on = c.getAttribute('href') === `#${group.id}`;
            c.classList.toggle('is-active', on);
            if (on && rail) rail.scrollTo({ left: c.offsetLeft - 16, behavior: 'smooth' });
          });
        },
      });
    });
  }

  /* ---------------------------------------------------------------------
   * Reservation form
   * ------------------------------------------------------------------- */
  function initBooking() {
    const form = $('.js-book-form');
    if (!form) return;
    const date = $('.js-date', form);
    const today = new Date();
    const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    date.min = iso;
    date.value = iso;

    const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v);
    const fields = $$('.c-field__input', form);
    const invalid = (f) => (f.required && !f.value.trim()) || (f.type === 'email' && f.value.trim() && !isEmail(f.value.trim()));

    form.addEventListener('input', (e) => e.target.classList.remove('is-invalid'));
    form.addEventListener('change', (e) => e.target.classList.remove('is-invalid'));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = fields.filter(invalid);
      fields.forEach((f) => f.classList.toggle('is-invalid', bad.includes(f)));
      if (bad.length) {
        bad[0].focus({ preventScroll: true });
        Toast.show(bad.some((f) => f.type === 'email' && f.value.trim()) ? 'Please enter a valid email address' : 'Please fill in the highlighted fields');
        return;
      }
      const data = new FormData(form);
      const day = data.get('date') === iso ? 'today' : new Date(`${data.get('date')}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      $('.js-book-summary', form).textContent = `${data.get('first')}, your table for ${data.get('guests')} is booked for ${day} at ${data.get('time')}. A confirmation is on its way.`;
      const success = $('.c-form__success', form);
      success.hidden = false;
      if (animate) gsap.from(success, { autoAlpha: 0, scale: 0.96, duration: 0.5, ease: 'power3.out' });
      Toast.show('Table reserved — see you soon!');
      setTimeout(() => {
        form.reset();
        date.value = iso;
        success.hidden = true;
      }, 6000);
    });
  }

  /* ---------------------------------------------------------------------
   * Open / closed status (Mon closed · Tue–Fri 12–22 · Sat–Sun 11–23)
   * ------------------------------------------------------------------- */
  function initStatus() {
    const el = $('.js-open-status');
    if (!el) return;
    const now = new Date();
    const d = now.getDay();
    const h = now.getHours() + now.getMinutes() / 60;
    const hours = { 0: [11, 23], 6: [11, 23] };
    const [open, close] = d === 1 ? [0, 0] : hours[d] || [12, 22];
    const isOpen = h >= open && h < close;
    el.textContent = isOpen ? 'Open now' : 'Closed';
    el.classList.toggle('is-closed', !isOpen);
  }

  /* ---------------------------------------------------------------------
   * Lightbox
   * ------------------------------------------------------------------- */
  function initLightbox() {
    if (typeof window.Fancybox === 'undefined') return;
    Fancybox.bind('[data-fancybox]', {
      on: {
        init: () => lenis && lenis.stop(),
        destroy: () => lenis && lenis.start(),
      },
    });
  }

  /* ---------------------------------------------------------------------
   * Boot
   * ------------------------------------------------------------------- */
  const year = $('.js-year');
  if (year) year.textContent = new Date().getFullYear();

  initSmoothScroll();
  initAnchors();
  initSlider();
  initStatus();
  initBooking();
  initLightbox();

  // Line-splitting needs the real fonts, so wait for them (max 2s)
  const fontsReady = document.fonts ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2000))]) : Promise.resolve();
  fontsReady.then(() => {
    const playIntro = initReveals();
    initSections();
    initAppChrome();
    initLoader(() => playIntro && playIntro());
  });

  if (hasGsap) {
    window.addEventListener('load', () => ScrollTrigger.refresh());
    // Rebuild layout-dependent pieces when crossing the desktop breakpoint
    desktopMQ.addEventListener('change', () => window.location.reload());
  }
})();
