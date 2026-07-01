/* =====================================================================
   Get Fenced Box Hill — animations.js
   GSAP micro-animations + ScrollTrigger reveals + counter count-up.
   Fully gated behind prefers-reduced-motion.
   ===================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = !!window.gsap;

  // If reduced motion OR no GSAP: make sure everything is visible and bail.
  if (reduce || !hasGSAP) {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
    // Still run counters (instant set) for reduced motion
    document.querySelectorAll('[data-count]').forEach(function (el) {
      el.textContent = el.getAttribute('data-count');
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Hero intro (staggered) ---------- */
  var heroItems = gsap.utils.toArray('[data-hero-item]');
  if (heroItems.length) {
    gsap.to(heroItems, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.12,
      delay: 0.15,
    });
  }

  /* ---------- Generic scroll reveals ---------- */
  gsap.utils.toArray('.reveal').forEach(function (el) {
    // skip hero items (handled above)
    if (el.hasAttribute('data-hero-item')) return;
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  /* ---------- Staggered groups (cards) ---------- */
  gsap.utils.toArray('[data-stagger]').forEach(function (group) {
    var items = group.querySelectorAll('[data-stagger-item]');
    if (!items.length) return;
    gsap.set(items, { opacity: 0, y: 24 });
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: { trigger: group, start: 'top 82%' },
    });
  });

  /* ---------- Hero image subtle parallax ---------- */
  var heroImg = document.querySelector('[data-parallax]');
  if (heroImg) {
    gsap.to(heroImg, {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: heroImg,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  /* ---------- Floating decorative icons (offer section) ---------- */
  gsap.utils.toArray('[data-deco] .deco__item').forEach(function (el) {
    // Continuous, smooth wander — new random target each cycle (repeatRefresh).
    gsap.to(el, {
      x: function () { return gsap.utils.random(-55, 55); },
      y: function () { return gsap.utils.random(-45, 45); },
      rotation: function () { return gsap.utils.random(-28, 28); },
      duration: function () { return gsap.utils.random(5, 9); },
      ease: 'sine.inOut',
      repeat: -1,
      repeatRefresh: true,
      yoyo: true,
    });
    // Gentle opacity breathing on its own timing.
    gsap.to(el, {
      opacity: gsap.utils.random(0.08, 0.2),
      duration: gsap.utils.random(3, 5),
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  });

  /* ---------- Our Excellence ring (fade-in items, no rotation) ---------- */
  var exSection = document.querySelector('[data-excellence]');
  if (exSection && window.matchMedia('(min-width: 1024px)').matches) {
    exSection.classList.add('is-animated');
    var contents = exSection.querySelectorAll('[data-item-content]');

    // Hide items initially (only when animated — keeps them visible without JS).
    gsap.set(contents, { opacity: 0, scale: 0.8 });

    var exTl = gsap.timeline({
      scrollTrigger: {
        trigger: exSection,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    });
    // Items stay fixed around the ring and fade + scale in one-by-one as you
    // scroll (matches Housent — no rotation). Trailing hold lands the last
    // item ~82% through the pinned scroll.
    exTl.to(
      contents,
      {
        opacity: 1,
        scale: 1,
        ease: 'none',
        duration: 1,
        stagger: { each: 0.8 },
      },
      0
    );
    exTl.to({}, { duration: 1.4 });

    ScrollTrigger.refresh();
  }

  /* ---------- Counter count-up ---------- */
  gsap.utils.toArray('[data-count]').forEach(function (el) {
    var end = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: function () {
        gsap.to(obj, {
          val: end,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.round(obj.val).toLocaleString() + suffix;
          },
        });
      },
    });
  });
})();
