/* Best Plumber Brisbane — V2 interactions
   Vanilla JS + GSAP/ScrollTrigger, Swiper, Fancybox (all optional: page works without them). */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header state ---------- */
  const header = $('#siteHeader');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Sheets: menu + booking drawer (modal dialogs) ---------- */
  const makeSheet = (sheet, { trigger, focusSel } = {}) => {
    const panel = $('.sheet__panel', sheet);
    let lastFocus = null;
    let hideTimer = 0;
    const focusables = () => $$('a[href], button:not([disabled]), input, select, textarea', panel)
      .filter(el => !el.disabled && el.offsetParent !== null);

    const open = (opener) => {
      if (!sheet.hidden && sheet.classList.contains('is-open')) return;
      lastFocus = opener || document.activeElement;
      clearTimeout(hideTimer);
      sheet.hidden = false;
      document.body.style.overflow = 'hidden';
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('is-open')));
      setTimeout(() => {
        const target = focusSel && window.matchMedia('(hover: hover)').matches ? $(focusSel, panel) : panel;
        (target || panel).focus({ preventScroll: true });
      }, reduceMotion ? 0 : 380);
    };
    const close = (restoreFocus = true) => {
      if (sheet.hidden) return;
      sheet.classList.remove('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      const done = () => { sheet.hidden = true; };
      if (reduceMotion) done(); else hideTimer = setTimeout(done, 420);
      if (restoreFocus && lastFocus) lastFocus.focus({ preventScroll: true });
    };

    $$('[data-close]', sheet).forEach(el => el.addEventListener('click', () => close()));
    sheet.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      const f = focusables();
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    return { open, close, isOpen: () => sheet.classList.contains('is-open'), lastFocus: () => lastFocus };
  };

  const menuBtn = $('#menuBtn');
  const menuSheet = $('#menuSheet');
  const menu = makeSheet(menuSheet, { trigger: menuBtn });
  menuBtn.addEventListener('click', () => (menu.isOpen() ? menu.close() : menu.open()));
  $$('.sheet__panel a:not([data-quote]):not([data-contact])', menuSheet).forEach(a => a.addEventListener('click', () => menu.close(false)));
  window.matchMedia('(min-width: 1080px)').addEventListener('change', m => { if (m.matches) menu.close(false); });

  // Two separate drawers: Quote (book / quote CTAs) and Contact (contact links).
  const drawers = {
    quote: makeSheet($('#quoteDrawer'), { focusSel: '#q-name' }),
    contact: makeSheet($('#contactDrawer'), { focusSel: '#c-name' }),
  };
  const openDrawer = (name, opener) => {
    const target = drawers[name];
    // Only one sheet open at a time: close the menu / the other drawer first, then swap.
    let swapped = false;
    let origin = opener;
    if (menu.isOpen()) { origin = menuBtn; menu.close(false); swapped = true; }
    Object.entries(drawers).forEach(([key, d]) => {
      if (key !== name && d.isOpen()) { origin = d.lastFocus() || origin; d.close(false); swapped = true; }
    });
    if (swapped && !reduceMotion) setTimeout(() => target.open(origin), 300);
    else target.open(origin);
  };
  $$('[data-quote]').forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault();
    const service = btn.dataset.service;
    if (service) {
      const select = $('#q-service');
      const opt = Array.from(select.options).find(o => o.text === service);
      if (opt) select.value = opt.value;
    }
    openDrawer('quote', btn);
  }));
  $$('[data-contact]').forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault();
    openDrawer('contact', btn);
  }));

  /* ---------- Active section (desktop nav + app bar) ---------- */
  const sectionIds = ['top', 'services', 'why', 'process', 'spotlight', 'reviews', 'areas'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  const navLinks = $$('.nav a[data-nav], .sheet__links a[data-nav]');
  const appLinks = $$('.appbar [data-appnav]');
  const navKeys = navLinks.map(a => a.dataset.nav);
  const appKeys = appLinks.map(a => a.dataset.appnav);

  const nearestKey = (currentIdx, keys) => {
    for (let i = currentIdx; i >= 0; i--) if (keys.includes(sectionIds[i])) return sectionIds[i];
    return null;
  };

  let ticking = false;
  const updateActive = () => {
    ticking = false;
    const line = window.innerHeight * 0.38;
    let idx = 0;
    sections.forEach(sec => {
      if (sec.getBoundingClientRect().top <= line) idx = sectionIds.indexOf(sec.id);
    });
    // Bottom of page -> last section
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) idx = sectionIds.length - 1;

    const navKey = idx === 0 ? null : nearestKey(idx, navKeys);
    navLinks.forEach(a => {
      const on = a.dataset.nav === navKey;
      a.classList.toggle('is-active', on);
      on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
    });
    const appKey = nearestKey(idx, appKeys);
    appLinks.forEach(a => {
      const on = a.dataset.appnav === appKey;
      a.classList.toggle('is-active', on);
      on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
    });
  };
  const requestActive = () => { if (!ticking) { ticking = true; requestAnimationFrame(updateActive); } };
  document.addEventListener('scroll', requestActive, { passive: true });
  window.addEventListener('resize', requestActive);
  updateActive();

  /* ---------- Spotlight tabs (WAI-ARIA tabs pattern) ---------- */
  const tabs = $$('.spot__tab');
  const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
  const selectTab = (i, focus = false) => {
    tabs.forEach((t, j) => {
      const on = i === j;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panels[j].hidden = !on;
      panels[j].classList.toggle('is-entering', on && !reduceMotion);
    });
    if (focus) tabs[i].focus();
    // keep the active chip visible on the mobile scroller
    const list = tabs[i].parentElement;
    if (list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: tabs[i].offsetLeft - 20, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(i));
    t.addEventListener('keydown', e => {
      const n = tabs.length;
      const map = { ArrowRight: (i + 1) % n, ArrowDown: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, ArrowUp: (i - 1 + n) % n, Home: 0, End: n - 1 };
      if (e.key in map) { e.preventDefault(); selectTab(map[e.key], true); }
    });
  });
  if (tabs.length) panels.forEach((p, j) => { if (j) p.hidden = true; });

  /* ---------- Sliders: infinite loop + smooth, pausable autoplay ---------- */
  // Autoplay is held while any "reason" is active: user pause, an open sheet/lightbox,
  // hidden tab, slider off-screen, or keyboard focus inside. Reduced motion never autoplays.
  const sliders = [];
  const overlayOpen = () => !!document.querySelector('.sheet.is-open, .fancybox__container');

  const makeSlider = (el, { label, ctrl, delay, speed, options }) => {
    const wrapper = $('.swiper-wrapper', el);
    const originals = $$(':scope > .swiper-slide', wrapper);
    const total = originals.length;
    originals.forEach((s, i) => s.setAttribute('aria-label', `${label} ${i + 1} of ${total}`));

    // Swiper 11 loop needs >= 2 x the largest slidesPerView: duplicate the set until it's safe.
    const maxPerView = Math.max(options.slidesPerView || 1, ...Object.values(options.breakpoints || {}).map(b => b.slidesPerView || 1));
    const needed = Math.ceil(maxPerView * 2) + 2;
    const clones = [];
    while (originals.length + clones.length < needed) {
      originals.forEach(s => {
        const c = s.cloneNode(true);
        c.classList.add('is-clone');
        c.setAttribute('aria-hidden', 'true');
        c.removeAttribute('aria-label');
        c.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
        c.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach(n => n.setAttribute('tabindex', '-1'));
        clones.push(c);
      });
    }
    clones.forEach(c => wrapper.appendChild(c));

    const fill = ctrl && $('.slider-ctrl__fill', ctrl);
    const cur = ctrl && $('.slider-ctrl__cur', ctrl);
    const totalEl = ctrl && $('.slider-ctrl__total', ctrl);
    const toggle = ctrl && $('.slider-btn--toggle', ctrl);
    const pad = n => String(n).padStart(2, '0');
    if (totalEl) totalEl.textContent = pad(total);
    const showIndex = sw => {
      const real = sw.realIndex % total; // real position, ignoring duplicates
      if (fill) fill.style.transform = `scaleX(${(real + 1) / total})`;
      if (cur) cur.textContent = pad(real + 1);
    };

    let swiper;
    try {
      swiper = new window.Swiper(el, {
        ...options,
        loop: true,
        rewind: false,
        speed: reduceMotion ? 300 : speed,
        autoplay: reduceMotion ? false : { delay, disableOnInteraction: false, pauseOnMouseEnter: true },
        a11y: { ...(options.a11y || {}), enabled: true, slideLabelMessage: '' },
        on: { init: showIndex, slideChange: showIndex },
      });
    } catch (err) {
      clones.forEach(c => c.remove()); // fall back to the native scroll row with the original slides
      return null;
    }

    const reasons = new Set();
    const sync = () => {
      if (!swiper.autoplay || reduceMotion) return;
      if (overlayOpen()) reasons.add('overlay'); else reasons.delete('overlay');
      if (document.hidden) reasons.add('hidden'); else reasons.delete('hidden');
      if (reasons.size) { if (swiper.autoplay.running) swiper.autoplay.stop(); }
      else if (!swiper.autoplay.running) swiper.autoplay.start();
    };

    if (toggle && !reduceMotion) {
      toggle.hidden = false;
      toggle.addEventListener('click', () => {
        const paused = toggle.getAttribute('aria-pressed') !== 'true';
        toggle.setAttribute('aria-pressed', String(paused));
        toggle.setAttribute('aria-label', `${paused ? 'Play' : 'Pause'} automatic sliding of ${label.toLowerCase()}s`);
        paused ? reasons.add('user') : reasons.delete('user');
        sync();
      });
    }
    // Pause while keyboard focus is inside (except on the play/pause toggle itself).
    el.addEventListener('focusin', e => {
      let keyboard = true;
      try { keyboard = e.target.matches(':focus-visible'); } catch (_) { /* older browsers: treat as keyboard */ }
      if (e.target !== toggle && keyboard) { reasons.add('focus'); sync(); }
    });
    el.addEventListener('focusout', e => { if (!el.contains(e.relatedTarget) || e.relatedTarget === toggle) { reasons.delete('focus'); sync(); } });
    // Pause when off-screen.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        entry.isIntersecting ? reasons.delete('offscreen') : reasons.add('offscreen');
        sync();
      }, { threshold: 0.15 }).observe(el);
    }
    const api = { el, swiper, sync, reasons, total, clones: clones.length };
    el.sliderApi = api;
    sliders.push(api);
    return api;
  };

  if (window.Swiper) {
    const reviewsEl = $('.reviews__slider');
    if (reviewsEl) makeSlider(reviewsEl, {
      label: 'Review',
      ctrl: $('.slider-ctrl', reviewsEl),
      delay: 5000,
      speed: 900,
      options: {
        slidesPerView: 1.08,
        spaceBetween: 14,
        grabCursor: true,
        watchSlidesProgress: true,
        keyboard: { enabled: true, onlyInViewport: true },
        a11y: { containerMessage: 'Customer reviews', prevSlideMessage: 'Previous review', nextSlideMessage: 'Next review' },
        navigation: { prevEl: '.reviews__prev', nextEl: '.reviews__next' },
        breakpoints: {
          640: { slidesPerView: 1.6, spaceBetween: 16 },
          1000: { slidesPerView: 2.4, spaceBetween: 20 },
          1280: { slidesPerView: 3, spaceBetween: 20 },
        },
      },
    });

    // Global pause triggers: drawers / menu (class changes), lightbox (body children), tab visibility.
    const syncAll = () => sliders.forEach(s => s.sync());
    const mo = new MutationObserver(syncAll);
    $$('.sheet').forEach(s => mo.observe(s, { attributes: true, attributeFilter: ['class'] }));
    mo.observe(document.body, { childList: true });
    document.addEventListener('visibilitychange', syncAll);
  }

  /* ---------- Gallery (Fancybox) ---------- */
  if (window.Fancybox) {
    window.Fancybox.bind('[data-fancybox="jobs"]', {
      Hash: false,
      Thumbs: { type: 'classic' },
      Toolbar: { display: { left: ['infobar'], middle: [], right: ['close'] } },
    });
  }

  /* ---------- Booking forms (page + drawer): inline validation + submit feedback ---------- */
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const allRules = {
    name: v => (v.trim() ? '' : 'Please enter your name.'),
    phone: v => (v.trim().length >= 6 ? '' : 'Please enter a phone number we can reach you on.'),
    email: v => (emailRe.test(v.trim()) ? '' : 'Please enter a valid email address.'),
    message: v => (v.trim().length >= 5 ? '' : 'Please tell us a little about how we can help.'),
  };
  // Each form validates only the fields it marks as required, plus optional fields once filled in.
  const initForm = form => {
    const status = $('.form__status', form);
    const btn = $('button[type="submit"]', form);
    const btnLabel = btn.innerHTML;
    const rules = {};
    Object.keys(allRules).forEach(name => {
      const input = form.elements[name];
      if (!input || !input.getAttribute('aria-describedby')) return;
      rules[name] = input.required ? allRules[name] : v => (v.trim() ? allRules[name](v) : '');
    });
    const setError = (input, msg) => {
      const err = document.getElementById(input.getAttribute('aria-describedby'));
      input.closest('.field').classList.toggle('has-error', !!msg);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) err.textContent = msg;
      return !msg;
    };
    Object.keys(rules).forEach(name => {
      const input = form.elements[name];
      input.addEventListener('blur', () => { if (input.value) setError(input, rules[name](input.value)); });
      input.addEventListener('input', () => {
        if (input.closest('.field').classList.contains('has-error')) setError(input, rules[name](input.value));
      });
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      status.textContent = '';
      status.removeAttribute('data-state');
      let firstInvalid = null;
      Object.keys(rules).forEach(name => {
        const input = form.elements[name];
        if (!setError(input, rules[name](input.value)) && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) {
        status.setAttribute('data-state', 'error');
        status.textContent = 'Please fix the highlighted fields and try again.';
        firstInvalid.focus();
        return;
      }
      btn.setAttribute('aria-busy', 'true');
      btn.textContent = 'Sending…';
      status.textContent = form.dataset.sending || 'Sending…';
      setTimeout(() => {
        btn.removeAttribute('aria-busy');
        btn.innerHTML = btnLabel;
        form.reset();
        if (form.elements.service) form.elements.service.selectedIndex = 0;
        status.setAttribute('data-state', 'success');
        status.textContent = form.dataset.success || 'Thanks — we will be in touch shortly.';
      }, 1100);
    });
  };
  initForm($('#quoteForm'));
  initForm($('#contactForm'));

  /* ---------- Motion (GSAP) ---------- */
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger || reduceMotion) {
    root.classList.remove('motion');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // Hero intro
  gsap.fromTo('[data-hero]',
    { opacity: 0, y: 22 },
    { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, delay: 0.05, clearProps: 'transform' });

  // Section reveals
  const revealEls = $$('[data-reveal]');
  gsap.set(revealEls, { opacity: 0, y: 26 });
  ScrollTrigger.batch(revealEls, {
    start: 'top 90%',
    once: true,
    onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.07, overwrite: true, clearProps: 'transform' }),
  });

  // Process "pipe" fills as you scroll
  const flow = $('.steps__flow');
  if (flow) {
    const horizontal = window.matchMedia('(min-width: 900px)').matches;
    gsap.fromTo(flow, horizontal ? { scaleX: 0 } : { scaleY: 0 }, {
      [horizontal ? 'scaleX' : 'scaleY']: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.steps', start: 'top 75%', end: 'bottom 60%', scrub: 0.6 },
    });
  }

  // Stat count-up
  $$('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const obj = { v: 0 };
    const fmt = v => decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString('en-AU');
    el.textContent = fmt(0);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => gsap.to(obj, { v: target, duration: 1.6, ease: 'power2.out', onUpdate: () => { el.textContent = fmt(obj.v); } }),
    });
  });

  // Gentle parallax on the skyline
  const sky = $('.areas__media img');
  if (sky) {
    gsap.fromTo(sky, { yPercent: -6, scale: 1.12 }, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: '.areas', start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
