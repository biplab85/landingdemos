/*!
 * ==========================================================================
 * Sklentr v2 — main.js (scroll-scene edition)
 * --------------------------------------------------------------------------
 * Author : Biplab Paul
 * Email  : biplab.cse.85@gmail.com
 * Phone  : 01735927356
 * --------------------------------------------------------------------------
 * GSAP + ScrollTrigger scenes, Lenis smooth scroll, Fancybox gallery.
 * Desktop (≥992px) gets the pinned scenes; smaller screens get a light,
 * flowing layout with simple reveals.
 * ==========================================================================
 */
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animate = hasGsap && !reduceMotion;

  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  let lenis = null;

  /* ---------------------------------------------------------------------
   * Smooth scroll (Lenis) wired into ScrollTrigger
   * ------------------------------------------------------------------- */
  function initSmoothScroll() {
    if (!animate || typeof window.Lenis === 'undefined') return;
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function initAnchors() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href');
      if (id.length < 2) { e.preventDefault(); return; }
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeDrawer();
      scrollToTarget(target);
    });
  }

  /* ---------------------------------------------------------------------
   * Header: hide on scroll down, show on scroll up, active link
   * ------------------------------------------------------------------- */
  const header = $('.js-header');
  const burger = $('.js-burger');
  const drawer = $('.js-drawer');

  function closeDrawer() {
    if (!drawer || !drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }

  function initHeader() {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 20);
      const goingDown = y > last + 4;
      const goingUp = y < last - 4;
      if (goingDown && y > 200 && !drawer.classList.contains('is-open')) header.classList.add('is-hidden');
      else if (goingUp || y < 200) header.classList.remove('is-hidden');
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    burger.addEventListener('click', () => {
      const open = !drawer.classList.contains('is-open');
      drawer.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
  }

  /* ---------------------------------------------------------------------
   * Active menu link (created after the pinned scenes so the extra
   * scroll they add is counted)
   * ------------------------------------------------------------------- */
  function initActiveNav() {
    // Active link follows the section in view
    const links = $$('.js-nav-link');
    const setActive = (id) => {
      links.forEach((a) => {
        const on = a.getAttribute('href') === `#${id}`;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });
    };
    if (!hasGsap) return;
    const ids = [...new Set(links.map((a) => a.getAttribute('href')))];
    ids.forEach((href) => {
      const sec = $(href);
      if (!sec) return;
      ScrollTrigger.create({
        trigger: sec,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => self.isActive && setActive(sec.id),
      });
    });
  }

  /* ---------------------------------------------------------------------
   * Scroll-scrubbed letters on headings (.js-split)
   * ------------------------------------------------------------------- */
  function initSplitHeadings() {
    if (!animate) return;
    $$('.js-split').forEach((el) => {
      const text = el.textContent.trim();
      el.setAttribute('aria-label', text);
      el.innerHTML = text.split(/\s+/).map((word) =>
        `<span class="c-split-word" aria-hidden="true">${[...word].map((ch) => `<span class="c-split-letter">${ch}</span>`).join('')}</span>`
      ).join(' ');
      gsap.fromTo($$('.c-split-letter', el), { opacity: 0.15 }, {
        opacity: 1,
        stagger: 0.06,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 45%', scrub: true },
      });
    });
  }

  /* ---------------------------------------------------------------------
   * Accordions (menu + FAQ)
   * ------------------------------------------------------------------- */
  function initAccordions() {
    $$('.js-accordion').forEach((group) => {
      const single = group.hasAttribute('data-single');
      const items = $$('.js-acc-item', group);
      const setOpen = (item, open) => {
        item.classList.toggle('is-open', open);
        $('.js-acc-toggle', item).setAttribute('aria-expanded', String(open));
      };
      items.forEach((item) => {
        $('.js-acc-toggle', item).addEventListener('click', () => {
          const open = !item.classList.contains('is-open');
          if (single) items.forEach((other) => other !== item && setOpen(other, false));
          setOpen(item, open);
          // Heights change: let pinned scenes below recalculate
          if (hasGsap) setTimeout(() => ScrollTrigger.refresh(), 600);
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
   * Category rows: photo that follows the cursor
   * ------------------------------------------------------------------- */
  function initFollower() {
    const list = $('.js-cat-list');
    const card = $('.js-follower');
    if (!list || !card || !hasGsap) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const imgs = $$('img', card);
    const xTo = gsap.quickTo(card, 'x', { duration: 0.55, ease: 'power3.out' });
    const yTo = gsap.quickTo(card, 'y', { duration: 0.55, ease: 'power3.out' });
    const rTo = gsap.quickTo(card, 'rotation', { duration: 0.8, ease: 'power3.out' });
    let visible = false;
    let px = 0;
    let py = 0;
    let lastX = 0;

    const target = (x, y) => [x - card.offsetWidth / 2, y - card.offsetHeight / 2];
    const show = (x, y) => {
      if (visible) return;
      visible = true;
      const [tx, ty] = target(x, y);
      gsap.set(card, { x: tx, y: ty });
      xTo(tx); yTo(ty);
      gsap.to(card, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
    };
    const hide = () => {
      if (!visible) return;
      visible = false;
      gsap.to(card, { autoAlpha: 0, scale: 0.85, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
    };
    const setImage = (i) => imgs.forEach((img, n) => img.classList.toggle('is-active', n === i));

    gsap.set(card, { scale: 0.85 });

    $$('.js-cat-row', list).forEach((row) => {
      row.addEventListener('mouseenter', (e) => {
        setImage(Number(row.dataset.img));
        show(e.clientX, e.clientY);
      });
    });

    list.addEventListener('mousemove', (e) => {
      px = e.clientX; py = e.clientY;
      if (!visible) return;
      const [tx, ty] = target(px, py);
      xTo(tx); yTo(ty);
      rTo(gsap.utils.clamp(-12, 12, (px - lastX) * 0.6));
      lastX = px;
    });
    list.addEventListener('mouseleave', hide);

    // Wheel-scrolling away keeps the pointer still: re-check what is under it
    const recheck = () => {
      if (!visible) return;
      const el = document.elementFromPoint(px, py);
      if (!el || !el.closest('.js-cat-list')) hide();
    };
    window.addEventListener('scroll', recheck, { passive: true });
    window.addEventListener('blur', hide);
    gsap.ticker.add(() => visible && rTo(0));
  }

  /* ---------------------------------------------------------------------
   * Desktop scroll scenes
   * ------------------------------------------------------------------- */
  const vw = () => window.innerWidth;
  const vh = () => window.innerHeight;

  function pin(scene, end) {
    return {
      trigger: scene,
      start: 'top top',
      end,
      pin: $('.o-scene__stage', scene),
      scrub: 1,
      invalidateOnRefresh: true,
    };
  }

  // HERO — media card grows to full screen, side photos drift inward
  function heroScene() {
    const scene = $('.js-hero');
    const stage = $('.o-scene__stage', scene);
    const media = $('.js-hero-media', scene);
    const content = $('.js-hero-content', scene);
    const left = $('.js-hero-left', scene);
    const right = $('.js-hero-right', scene);

    const startClip = () => {
      const top = content.getBoundingClientRect().bottom - stage.getBoundingClientRect().top + 36;
      const w = Math.min(576, vw() * 0.42);
      const side = (vw() - w) / 2;
      return `inset(${top}px ${side}px 0px ${side}px round 12px 12px 0px 0px)`;
    };

    // Half of each photo peeks in from the edge (x: 0 clears the CSS fallback offset)
    gsap.set(left, { x: 0, xPercent: -50, rotation: 20 });
    gsap.set(right, { x: 0, xPercent: 50, rotation: -20 });

    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: pin(scene, '+=170%') });
    tl.fromTo(media, { clipPath: startClip }, { clipPath: 'inset(0px 0px 0px 0px round 0px 0px 0px 0px)', duration: 0.6, ease: 'power1.inOut' }, 0)
      .fromTo($('img', media), { scale: 1.25 }, { scale: 1, duration: 1 }, 0)
      .fromTo(media, { '--shade': 0.2 }, { '--shade': 1, duration: 0.45 }, 0.1)
      .to([$('.js-hero-title', scene), $('.js-hero-text', scene)], { color: '#ffffff', duration: 0.3 }, 0.25)
      .to(left, { x: () => vw() * 0.19, y: () => vh() * 0.2, scale: 0.55, rotation: 13, duration: 0.8, ease: 'power1.inOut' }, 0)
      .to(right, { x: () => -vw() * 0.19, y: () => vh() * 0.2, scale: 0.55, rotation: -13, duration: 0.8, ease: 'power1.inOut' }, 0)
      .to({}, { duration: 0.2 });
  }

  // DISH — curtain lifts, plates fly from the centre to the corners
  function dishScene() {
    const scene = $('.js-dish');
    const stage = $('.o-scene__stage', scene);
    const curtain = $('.js-dish-curtain', scene);
    const circle = $('.js-dish-circle', scene);
    const content = $('.js-dish-content', scene);
    const imgs = $$('.js-dish-img', scene);

    const toCenterX = (i, el) => stage.offsetWidth / 2 - (el.offsetLeft + el.offsetWidth / 2);
    const toCenterY = (i, el) => stage.offsetHeight / 2 - (el.offsetTop + el.offsetHeight / 2);
    const tilt = [-9, 7, 5, -6];

    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: pin(scene, '+=200%') });
    tl.fromTo(circle, { scale: 0.86, y: 0 }, { scale: 1, y: () => -vh() * 0.22, duration: 0.25 }, 0)
      .to(circle, { y: () => -vh() * 0.8, autoAlpha: 0, duration: 0.2, ease: 'power1.in' }, 0.22)
      .to(curtain, { autoAlpha: 0, duration: 0.2 }, 0.24)
      .fromTo(imgs, { x: toCenterX, y: toCenterY, scale: 0.45, rotation: (i) => tilt[i], autoAlpha: 0 },
        { scale: 0.72, autoAlpha: 1, duration: 0.12, stagger: 0.02 }, 0.24)
      .to(imgs, { x: 0, y: 0, scale: 1, rotation: 0, duration: 0.45, stagger: 0.03, ease: 'power2.inOut' }, 0.4)
      .fromTo(content, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 0.62)
      .to({}, { duration: 0.15 });
  }

  // TESTIMONIAL — word sinks, review cards deal in one by one
  function testiScene() {
    const scene = $('.js-testi');
    const title = $('.js-testi-title', scene);
    const intro = $('.js-testi-intro', scene);
    const cards = $$('.js-review', scene);
    const tilt = [-2, 1.5, -3];

    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: pin(scene, '+=240%') });
    tl.fromTo(title, { y: () => -vh() * 0.36, scale: 0.7 }, { y: () => vh() * 0.2, scale: 1.08, duration: 0.45, ease: 'power1.inOut' }, 0)
      .fromTo(intro, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.2);

    cards.forEach((card, i) => {
      const at = 0.06 + i * 0.27;
      tl.fromTo(card,
        { y: () => vh() * 0.95, rotation: tilt[i] * 2.5, filter: 'brightness(0.72)' },
        { y: i * 104, rotation: tilt[i], filter: 'brightness(1)', duration: 0.3, ease: 'power2.out' }, at);
    });
    tl.to({}, { duration: 0.12 });
  }

  // FAQ — giant word lifts, photos dock, questions slide in
  function faqScene() {
    const scene = $('.js-faq');
    const word = $('.js-faq-word', scene);
    const thumbs = $$('.js-faq-thumb', scene);
    const list = $('.js-faq-list', scene);
    const copy = $('.js-faq-copy', scene);

    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: pin(scene, '+=170%') });
    tl.fromTo(word, { yPercent: 0, autoAlpha: 1 }, { yPercent: -110, autoAlpha: 0, duration: 0.4, ease: 'power1.in' }, 0.1)
      .fromTo(thumbs[0], { x: () => vw() * 0.02, y: () => vh() * 0.42, scale: 2.6, rotation: 0 }, { x: 0, y: 0, scale: 1, rotation: -12, duration: 0.55, ease: 'power1.inOut' }, 0)
      .fromTo(thumbs[1], { x: () => vw() * 0.5, y: () => vh() * 0.18, scale: 1.3, rotation: 0 }, { x: 0, y: 0, scale: 1, rotation: 10, duration: 0.55, ease: 'power1.inOut' }, 0)
      .fromTo(list, { x: () => -vw() * 0.16, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.out' }, 0.25)
      .fromTo(copy, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 0.55)
      .to({}, { duration: 0.15 });
  }

  // GALLERY — cascade deals into a row that slides sideways
  function galleryScene() {
    const scene = $('.js-gallery');
    const track = $('.js-gallery-track', scene);
    const head = $('.js-gallery-head', scene);
    const shots = $$('.js-shot', scene);
    const gap = 16;

    const stackX = (i, el) => {
      const w = el.offsetWidth;
      return 15 + Math.min(i, 4) * w * 0.45 - i * (w + gap);
    };
    const stackY = (i) => -vh() * 0.16 + Math.min(i, 4) * 30;
    const stackA = (i) => (i < 4 ? 1 : i === 4 ? 0.35 : 0);
    const travel = () => -(track.scrollWidth - vw() + 40);

    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: pin(scene, '+=260%') });
    tl.fromTo(shots, { x: stackX, y: stackY, scale: 0.88, autoAlpha: stackA }, { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.3, stagger: 0.012, ease: 'power2.inOut' }, 0)
      .fromTo(head, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.15 }, 0.2)
      .to(track, { x: travel, duration: 0.6 }, 0.38);
  }

  function initScenes() {
    if (!animate) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 992px)', () => {
      heroScene();
      dishScene();
      testiScene();
      faqScene();
      galleryScene();
    });

    // All sizes: blog cards tilt into place, footer wordmark rises
    gsap.from('.js-post', {
      y: 90,
      rotation: 4,
      rotationX: -18,
      transformOrigin: '50% 100%',
      stagger: 0.08,
      ease: 'none',
      scrollTrigger: { trigger: '.c-blog__grid', start: 'top 95%', end: 'top 45%', scrub: 1 },
    });

    gsap.from('.js-footer-word', {
      yPercent: 45,
      ease: 'none',
      scrollTrigger: { trigger: '.c-footer__bottom', start: 'top bottom', end: 'bottom bottom', scrub: 1 },
    });

    // Small screens: gentle fade-up for scene content
    mm.add('(max-width: 991.98px)', () => {
      $$('.c-hero__content, .c-dish__content, .c-dish__img, .c-review, .c-faq__intro, .c-faq__list').forEach((el) => {
        gsap.from(el, { y: 40, autoAlpha: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
      });
    });
  }

  /* ---------------------------------------------------------------------
   * Lightbox
   * ------------------------------------------------------------------- */
  function initLightbox() {
    if (typeof window.Fancybox === 'undefined') return;
    Fancybox.bind('[data-fancybox]', {
      Thumbs: { type: 'classic' },
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
  initHeader();
  initSplitHeadings();
  initAccordions();
  initFollower();
  initScenes();
  initActiveNav();
  initLightbox();

  if (hasGsap) {
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
})();
