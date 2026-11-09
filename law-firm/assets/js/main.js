/*!
 * ==========================================================================
 * Sklentr — Law & Advisory · main.js
 * --------------------------------------------------------------------------
 * Author : Biplab Paul
 * Email  : biplab.cse.85@gmail.com
 * Phone  : 01735927356
 * --------------------------------------------------------------------------
 * Motion: GSAP 3.12 + ScrollTrigger (gsap.matchMedia for desktop / app
 * mode / reduced motion), Lenis smooth scroll (desktop only), Swiper
 * (testimonials, desktop), Fancybox (case images).
 * App mode (< 992px): tab-bar scroll-spy, bottom sheet, case filter chips,
 * toasts. JS hooks are js-* classes; state classes are is-*.
 * ==========================================================================
 */
(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const root = document.documentElement;
  const DESK = '(min-width: 992px)';
  const mqDesk = window.matchMedia(DESK);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  if (!hasGSAP || reduceMotion) root.classList.add('is-static-motion');
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  /* ------------------------------------------------------------------
   * Year
   * ---------------------------------------------------------------- */
  $$('.js-year').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  /* ------------------------------------------------------------------
   * Letter-roll labels (buttons, nav, links)
   * ---------------------------------------------------------------- */
  function buildRoll(el) {
    const text = el.textContent.trim();
    el.textContent = '';
    const sr = document.createElement('span');
    sr.className = 'u-visually-hidden';
    sr.textContent = text;
    el.appendChild(sr);
    ['', ' c-roll__line--clone'].forEach((mod) => {
      const line = document.createElement('span');
      line.className = 'c-roll__line' + mod;
      line.setAttribute('aria-hidden', 'true');
      Array.from(text).forEach((ch, i) => {
        const c = document.createElement('span');
        c.className = 'c-roll__char';
        c.style.setProperty('--i', i);
        c.textContent = ch;
        line.appendChild(c);
      });
      el.appendChild(line);
    });
  }
  $$('.js-roll').forEach(buildRoll);

  /* ------------------------------------------------------------------
   * Split headings into words > chars (scaleY rise reveal)
   * ---------------------------------------------------------------- */
  function splitHeading(el) {
    const label = el.textContent.replace(/\s+/g, ' ').trim();
    const nodes = Array.from(el.childNodes);
    el.textContent = '';
    nodes.forEach((node) => {
      if (node.nodeType === 3) {
        const parts = node.textContent.split(/(\s+)/);
        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { el.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span');
          w.className = 'c-split__word';
          w.setAttribute('aria-hidden', 'true');
          Array.from(part).forEach((ch) => {
            const c = document.createElement('span');
            c.className = 'c-split__char';
            c.textContent = ch;
            w.appendChild(c);
          });
          el.appendChild(w);
        });
      } else {
        el.appendChild(node); // <br> etc.
      }
    });
    el.setAttribute('aria-label', label);
  }
  $$('.js-split').forEach(splitHeading);

  /* ------------------------------------------------------------------
   * Odometer counters
   * ---------------------------------------------------------------- */
  function buildOdometer(el) {
    const value = String(el.dataset.value || el.textContent.replace(/\D/g, ''));
    const suffix = el.dataset.suffix || '';
    el.textContent = '';
    el.setAttribute('aria-label', value + suffix);
    const strips = [];
    Array.from(value).forEach((d) => {
      const digit = parseInt(d, 10);
      const col = document.createElement('span');
      col.className = 'c-odo__col';
      col.setAttribute('aria-hidden', 'true');
      const strip = document.createElement('span');
      strip.className = 'c-odo__strip';
      for (let k = 0; k < 10; k += 1) {
        const n = document.createElement('span');
        n.textContent = String((digit + 1 + k) % 10);
        strip.appendChild(n);
      }
      col.appendChild(strip);
      el.appendChild(col);
      strips.push(strip);
    });
    if (suffix) {
      const s = document.createElement('span');
      s.className = 'c-odo__suffix' + (suffix === '%' ? ' c-odo__suffix--pct' : '');
      s.setAttribute('aria-hidden', 'true');
      s.textContent = suffix;
      el.appendChild(s);
    }
    el._strips = strips;
  }
  const odometers = $$('.js-odometer');
  odometers.forEach(buildOdometer);
  const settleOdometers = () => odometers.forEach((el) => el._strips.forEach((s) => { s.style.transform = 'translateY(-90%)'; }));
  if (!hasGSAP || reduceMotion) settleOdometers();

  /* ------------------------------------------------------------------
   * Toasts
   * ---------------------------------------------------------------- */
  const toastHost = $('.js-toasts');
  function toast(message, type) {
    if (!toastHost) return;
    const t = document.createElement('div');
    t.className = 'c-toast' + (type === 'error' ? ' c-toast--error' : '');
    t.innerHTML = '<span class="c-toast__icon"><svg aria-hidden="true"><use href="#' + (type === 'error' ? 'i-alert' : 'i-check') + '"/></svg></span><span></span>';
    t.lastChild.textContent = message;
    toastHost.appendChild(t);
    setTimeout(() => {
      t.classList.add('is-leaving');
      setTimeout(() => t.remove(), 400);
    }, 4200);
  }

  /* ------------------------------------------------------------------
   * Lenis (desktop only, not with reduced motion)
   * ---------------------------------------------------------------- */
  let lenis = null;
  if (hasGSAP && !reduceMotion && mqDesk.matches && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.4 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ------------------------------------------------------------------
   * Bottom sheet (consultation)
   * ---------------------------------------------------------------- */
  const sheet = $('.js-sheet');
  const sheetPanel = $('.js-sheet-panel');
  let sheetOpener = null;

  function openSheet(opener) {
    if (!sheet) return;
    sheetOpener = opener || document.activeElement;
    sheet.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
    document.body.classList.add('u-no-scroll');
    if (lenis) lenis.stop();
    setTimeout(() => { const f = $('input, textarea', sheet); if (f) f.focus({ preventScroll: true }); }, 420);
  }

  function closeSheet() {
    if (!sheet || !sheet.classList.contains('is-open')) return;
    sheet.classList.remove('is-open');
    sheet.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('u-no-scroll');
    sheetPanel.style.transform = '';
    if (lenis) lenis.start();
    if (sheetOpener && sheetOpener.focus) sheetOpener.focus({ preventScroll: true });
  }

  $$('.js-sheet-close').forEach((b) => b.addEventListener('click', closeSheet));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

  // Drag the grab handle down to dismiss
  (function dragToClose() {
    const grab = $('.js-sheet-grab');
    if (!grab || !sheetPanel) return;
    let startY = 0;
    let dy = 0;
    let dragging = false;
    grab.addEventListener('pointerdown', (e) => {
      dragging = true; startY = e.clientY; dy = 0;
      sheetPanel.style.transition = 'none';
      grab.setPointerCapture(e.pointerId);
    });
    grab.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      dy = Math.max(0, e.clientY - startY);
      sheetPanel.style.transform = 'translateY(' + dy + 'px)';
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      sheetPanel.style.transition = '';
      if (dy > 110) closeSheet(); else sheetPanel.style.transform = '';
    };
    grab.addEventListener('pointerup', end);
    grab.addEventListener('pointercancel', end);
  }());

  /* ------------------------------------------------------------------
   * Anchor scrolling (+ sheet triggers in app mode)
   * ---------------------------------------------------------------- */
  function headerOffset() {
    return mqDesk.matches ? 74 : (($('.c-appbar') || {}).offsetHeight || 64) + 8;
  }

  function scrollToTarget(target) {
    const y = target.getBoundingClientRect().top + window.scrollY - headerOffset();
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  document.addEventListener('click', (e) => {
    const sheetBtn = e.target.closest('.js-open-sheet');
    if (sheetBtn && (!mqDesk.matches || sheetBtn.tagName === 'BUTTON')) {
      e.preventDefault();
      openSheet(sheetBtn);
      return;
    }
    const link = e.target.closest('a.js-scroll');
    if (!link) return;
    const id = link.getAttribute('href');
    if (!id || id.charAt(0) !== '#') return;
    const target = id === '#home' ? document.body : $(id);
    if (!target) return;
    e.preventDefault();
    if (id === '#home') {
      if (lenis) lenis.scrollTo(0, { duration: 1.4 });
      else window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    } else {
      scrollToTarget(target);
    }
  });

  /* ------------------------------------------------------------------
   * Accordion (one open at a time)
   * ---------------------------------------------------------------- */
  const accs = $$('.js-acc');
  accs.forEach((acc) => {
    const btn = $('.c-accordion__toggle', acc);
    btn.addEventListener('click', () => {
      const open = !acc.classList.contains('is-open');
      accs.forEach((a) => {
        a.classList.remove('is-open');
        $('.c-accordion__toggle', a).setAttribute('aria-expanded', 'false');
      });
      if (open) {
        acc.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
      if (hasGSAP) setTimeout(() => ScrollTrigger.refresh(), 520);
    });
  });

  /* ------------------------------------------------------------------
   * Forms — required + email validation, success toast (no backend)
   * ---------------------------------------------------------------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function fieldValid(input) {
    if (input.type === 'checkbox') return !input.required || input.checked;
    const v = input.value.trim();
    if (input.required && !v) return false;
    if (input.type === 'email' && v && !EMAIL_RE.test(v)) return false;
    return true;
  }

  function markField(input, ok) {
    const holder = input.closest('.c-field, .c-check') || input.closest('form');
    if (holder) holder.classList.toggle('is-invalid', !ok);
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
  }

  $$('.js-form').forEach((form) => {
    const inputs = $$('input, textarea, select', form).filter((i) => i.type !== 'radio');
    inputs.forEach((i) => {
      const evt = i.type === 'checkbox' || i.tagName === 'SELECT' ? 'change' : 'input';
      i.addEventListener(evt, () => { if (i.getAttribute('aria-invalid') === 'true') markField(i, fieldValid(i)); });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let firstBad = null;
      inputs.forEach((i) => {
        const ok = fieldValid(i);
        markField(i, ok);
        if (!ok && !firstBad) firstBad = i;
      });
      if (firstBad) {
        firstBad.focus({ preventScroll: false });
        toast('Please check the highlighted fields and try again.', 'error');
        return;
      }
      form.classList.add('is-sending');
      setTimeout(() => {
        form.classList.remove('is-sending');
        form.reset();
        inputs.forEach((i) => i.removeAttribute('aria-invalid'));
        toast(form.dataset.success || 'Thank you — we will be in touch shortly.');
        if (form.closest('.js-sheet')) closeSheet();
      }, 900);
    });
  });

  /* ------------------------------------------------------------------
   * Case filter chips (app mode)
   * ---------------------------------------------------------------- */
  const chips = $$('.js-chips [data-filter]');
  const cases = $$('.js-case');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      chips.forEach((c) => {
        const on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      const shown = [];
      cases.forEach((c) => {
        const match = f === 'all' || c.dataset.cat === f;
        c.classList.toggle('is-hidden', !match);
        if (match) shown.push(c);
      });
      if (hasGSAP && !reduceMotion) gsap.fromTo(shown, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out', clearProps: 'transform' });
      if (hasGSAP) ScrollTrigger.refresh();
    });
  });

  /* ------------------------------------------------------------------
   * App bar shadow
   * ---------------------------------------------------------------- */
  const appbar = $('.c-appbar');
  const onScroll = () => { if (appbar) appbar.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------
   * Fancybox (case images)
   * ---------------------------------------------------------------- */
  if (window.Fancybox) {
    Fancybox.bind('[data-fancybox="cases"]', { Thumbs: false, Toolbar: { display: { left: [], middle: [], right: ['close'] } } });
  }

  /* ------------------------------------------------------------------
   * Swiper — testimonials (desktop only; app mode uses a snap rail)
   * ---------------------------------------------------------------- */
  let reviews = null;
  function syncSwiper() {
    if (typeof window.Swiper === 'undefined') return;
    if (mqDesk.matches && !reviews) {
      reviews = new Swiper('.js-reviews', {
        effect: 'fade',
        fadeEffect: { crossFade: true },
        loop: true,
        speed: 600,
        autoHeight: false,
        autoplay: reduceMotion ? false : { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true },
        navigation: { prevEl: '.js-review-prev', nextEl: '.js-review-next' },
        a11y: { prevSlideMessage: 'Previous testimonial', nextSlideMessage: 'Next testimonial' },
      });
    } else if (!mqDesk.matches && reviews) {
      reviews.destroy(true, true);
      reviews = null;
    }
  }
  syncSwiper();
  mqDesk.addEventListener('change', syncSwiper);

  /* ------------------------------------------------------------------
   * Scroll-spy: desktop nav + app tab bar
   * ---------------------------------------------------------------- */
  const tabs = $$('.js-tab');
  const navLinks = $$('.c-nav__link');
  function setTab(key) {
    tabs.forEach((t) => {
      const on = t.dataset.tab === key;
      t.classList.toggle('is-active', on);
      if (on) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    });
  }
  function setNav(id) {
    navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + id));
  }

  if (!hasGSAP) return;

  $$('[data-spy]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => { if (self.isActive) setTab(sec.dataset.spy); },
    });
  });
  ['home', 'about', 'practice', 'cases', 'insights'].forEach((id) => {
    const sec = document.getElementById(id);
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => { if (self.isActive) setNav(id); },
    });
  });

  /* ------------------------------------------------------------------
   * Motion
   * ---------------------------------------------------------------- */
  const mm = gsap.matchMedia();

  mm.add({ isDesk: DESK, isMob: '(max-width: 991.98px)', reduce: '(prefers-reduced-motion: reduce)' }, (ctx) => {
    const { isDesk, reduce } = ctx.conditions;
    if (reduce) { settleOdometers(); return undefined; }

    // Hero intro ---------------------------------------------------------
    const heroTitle = $('.c-hero__title');
    gsap.from($$('.c-split__char', heroTitle), { scaleY: 0, duration: 0.9, ease: 'power3.out', stagger: 0.018, delay: 0.15 });
    gsap.from('.js-hero-in', { autoAlpha: 0, y: 28, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.25 });
    gsap.from('.c-hero__shot', { autoAlpha: 0, y: 80, duration: 1.2, ease: 'power3.out', stagger: 0.08, delay: 0.35 });

    // Heading letters rise -----------------------------------------------
    $$('.js-split').forEach((el) => {
      if (el === heroTitle) return;
      gsap.from($$('.c-split__char', el), {
        scaleY: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.016,
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      });
    });

    // Simple reveals -------------------------------------------------------
    $$('.js-reveal').forEach((el) => {
      gsap.from(el, { autoAlpha: 0, y: 40, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
    });
    ScrollTrigger.batch('.js-reveal-item', {
      start: 'top 90%',
      onEnter: (els) => gsap.from(els, { autoAlpha: 0, y: 40, duration: 0.9, ease: 'power3.out', stagger: 0.1, overwrite: true }),
    });
    ScrollTrigger.batch('.js-case', {
      start: 'top 90%',
      onEnter: (els) => gsap.from(els, { autoAlpha: 0, y: 40, duration: 0.9, ease: 'power3.out', stagger: 0.12, overwrite: true }),
    });
    ScrollTrigger.batch('.js-post', {
      start: 'top 92%',
      onEnter: (els) => gsap.from(els, { autoAlpha: 0, y: 30, duration: 0.9, ease: 'power3.out', stagger: 0.14, overwrite: true }),
    });
    gsap.from('.js-faq-item', {
      autoAlpha: 0,
      x: isDesk ? 60 : 24,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: { trigger: '.c-faq__list', start: 'top 85%' },
    });

    // Odometers --------------------------------------------------------------
    odometers.forEach((el) => {
      el._strips.forEach((s, i) => {
        gsap.fromTo(s, { yPercent: 0 }, {
          yPercent: -90,
          duration: 1.6 + i * 0.35,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%' },
        });
      });
    });

    // Image parallax ------------------------------------------------------------
    $$('.js-parallax').forEach((wrap) => {
      const img = $('img', wrap);
      gsap.fromTo(img, { yPercent: -8 }, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    // Marquee: endless loop + scroll-linked drift ----------------------------
    const loop = gsap.to('.js-marquee-track', { xPercent: -50, ease: 'none', duration: isDesk ? 40 : 26, repeat: -1 });
    gsap.fromTo('.js-marquee-shift', { x: 0 }, {
      x: isDesk ? -320 : -140,
      ease: 'none',
      scrollTrigger: { trigger: '.c-marquee', start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.fromTo('.js-marquee-statue', { y: 70 }, {
      y: 0,
      ease: 'none',
      scrollTrigger: { trigger: '.c-marquee', start: 'top bottom', end: 'center center', scrub: true },
    });
    gsap.to('.js-marquee-ring', {
      rotation: 90,
      ease: 'none',
      scrollTrigger: { trigger: '.c-marquee', start: 'top bottom', end: 'bottom top', scrub: true },
    });

    // CTA background slow zoom -------------------------------------------------------
    gsap.fromTo('.js-cta-bg', { scale: 1.18 }, {
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.c-reveal', start: 'center bottom', end: 'bottom bottom', scrub: true },
    });

    if (!isDesk) {
      return () => loop.kill();
    }

    // ===== Desktop-only scenes =================================================

    // Practice: horizontal track while the stage is stuck ------------------------
    const pin = $('.js-practice-pin');
    const track = $('.js-practice-track');
    const stage = $('.c-practice__sticky');
    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top 135px',
        end: () => 'bottom ' + (135 + stage.offsetHeight) + 'px',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    // Why us: tilted stack fans out into the row -----------------------------
    const whyCards = $$('.js-why-card');
    const fan = [
      { x: 150, y: 70, rotation: 14 },
      { x: 50, y: 110, rotation: -11 },
      { x: -50, y: 50, rotation: 10 },
      { x: -150, y: 95, rotation: -12 },
    ];
    whyCards.forEach((card, i) => {
      gsap.fromTo(card, fan[i % fan.length], {
        x: 0,
        y: 0,
        rotation: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.js-why', start: 'top 98%', end: 'top 42%', scrub: 0.6 },
      });
    });

    // Team: cards travel along the SVG path ------------------------------------
    const teamWrap = $('.js-team');
    const path = $('.js-team-path');
    const svg = path.ownerSVGElement;
    const stageEl = $('.c-team__stage');
    const items = $$('.js-team-item');
    const details = $$('.js-team-details');
    const L = path.getTotalLength();
    const SAMPLES = 240;
    const samples = [];
    for (let s = 0; s <= SAMPLES; s += 1) {
      const p = path.getPointAtLength((s / SAMPLES) * L);
      samples.push({ x: p.x, y: p.y });
    }
    let geo = null;
    const measure = () => {
      const r = svg.getBoundingClientRect();
      const st = stageEl.getBoundingClientRect();
      geo = { ox: r.left - st.left, oy: r.top - st.top, sx: r.width / 1366, sy: r.height / 603 };
    };
    measure();
    const proxies = items.map(() => ({ p: 0 }));
    const render = () => {
      if (!geo) return;
      proxies.forEach((pr, i) => {
        const f = Math.min(Math.max(pr.p, 0), 1) * SAMPLES;
        const a = samples[Math.floor(f)];
        const b = samples[Math.min(Math.ceil(f), SAMPLES)];
        const t = f - Math.floor(f);
        const x = geo.ox + (a.x + (b.x - a.x) * t) * geo.sx;
        const y = geo.oy + (a.y + (b.y - a.y) * t) * geo.sy;
        const el = items[i];
        gsap.set(el, { x: x - el.offsetWidth / 2, y: y - el.offsetHeight / 2 });
      });
    };
    gsap.set(items, { zIndex: (i, t, all) => all.length - i, transformOrigin: '50% 50%' });
    const tl = gsap.timeline({
      defaults: { ease: 'none', stagger: 0.3 },
      onUpdate: render,
      scrollTrigger: {
        trigger: teamWrap,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: () => { measure(); render(); },
      },
    });
    tl.to(proxies, { p: 1, duration: 1 }, 0)
      .fromTo(items, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0)
      .fromTo(items, { filter: 'blur(24px)' }, { filter: 'blur(0px)', duration: 0.5 }, 0)
      .fromTo(details, { autoAlpha: 0, yPercent: 25 }, { autoAlpha: 1, yPercent: 0, duration: 0.1 }, 0.5)
      .fromTo(items, { scale: 0.4 }, { scale: 1, duration: 0.65 }, 0)
      .to(items, { autoAlpha: 0, filter: 'blur(16px)', duration: 0.15 }, 0.85)
      .to(details, { autoAlpha: 0, duration: 0.05 }, 0.9);
    render();

    // Process steps glide in from the right ---------------------------------------
    gsap.fromTo('.js-step', { x: () => $('.js-steps').offsetWidth * 1.1, autoAlpha: 0.35 }, {
      x: 0,
      autoAlpha: 1,
      ease: 'none',
      stagger: 0.12,
      scrollTrigger: { trigger: '.js-steps', start: 'top bottom', end: 'top 35%', scrub: 0.6, invalidateOnRefresh: true },
    });

    return () => { loop.kill(); };
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
}());
