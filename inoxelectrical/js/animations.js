/* =============================================================
 *  INOX ELECTRICAL · animations.js — GSAP motion layer
 *  Progressive enhancement. Fully disabled under
 *  prefers-reduced-motion (content shown in final state).
 *
 *  NOTE: CSS provides the initial HIDDEN state for [data-reveal]
 *  (no FOUC), so we animate TO the visible state with gsap.to().
 * ============================================================= */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = typeof window.gsap !== 'undefined';

  // Motion config (mirrors SCSS motion tokens)
  var M = { dur: 0.7, durFast: 0.5, ease: 'power3.out', stagger: 0.09 };

  // If motion is off or GSAP missing → reveal everything in final state.
  if (reduce || !hasGSAP) {
    document.querySelectorAll('[data-reveal], [data-hero]').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Hero load timeline (elements start visible in CSS) ---------- */
  var heroEls = gsap.utils.toArray('[data-hero]');
  if (heroEls.length) {
    gsap.timeline({ defaults: { ease: M.ease } })
      .from(heroEls, { y: 34, opacity: 0, duration: M.dur, stagger: 0.12, delay: 0.15 });
  }

  /* ---------- Hero background parallax ---------- */
  var heroBg = document.querySelector('.hero__bg img');
  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: 12, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* ---------- Reveal on scroll (batched → automatic stagger) ---------- */
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 86%',
    once: true,
    onEnter: function (batch) {
      gsap.to(batch, {
        opacity: 1, x: 0, y: 0, scale: 1,
        duration: M.durFast, ease: M.ease, stagger: M.stagger, overwrite: true
      });
    }
  });

  /* ---------- Animated counters ---------- */
  gsap.utils.toArray('[data-count]').forEach(function (el) {
    var raw = el.getAttribute('data-count');
    var end = parseFloat(raw);
    var decimals = (raw.split('.')[1] || '').length;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: function () {
        gsap.to(obj, {
          v: end, duration: 1.4, ease: 'power2.out',
          onUpdate: function () { el.textContent = prefix + obj.v.toFixed(decimals) + suffix; }
        });
      }
    });
  });

  // NOTE: the "How We Work" section no longer pins the page / converts vertical
  // scroll into horizontal movement. It is now a normal-flow horizontal swipe
  // carousel (see main.js for the progress-bar wiring).

  // Keep triggers accurate after fonts/images settle.
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
