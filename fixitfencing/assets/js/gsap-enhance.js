/* ============================================================
   GSAP scroll & interaction enhancements — ADDITIVE ONLY.
   - Attaches to existing classes/IDs; never alters markup, CSS,
     spacing, colours or layout.
   - All reveals use gsap.from(), so the END state is the element's
     natural CSS state → the site looks identical once animated in.
   - Honours prefers-reduced-motion (motion is skipped).
   - Skips the .ffhow section (it runs its own pinned scroll logic).
   - If GSAP fails to load, nothing is hidden and the site is unchanged.
   ============================================================ */
(function () {
  if (typeof window.gsap === 'undefined') return;
  var gsap = window.gsap;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var inHow = function (el) { return !!(el && el.closest && el.closest('.ffhow')); };
  var has = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var all = function (sel, ctx) {
    return gsap.utils.toArray(sel, ctx).filter(function (el) { return !inHow(el); });
  };

  /* ---------- 1) Scroll progress bar (new, isolated element) ---------- */
  (function () {
    var style = document.createElement('style');
    style.setAttribute('data-gsx', '');
    style.textContent =
      '.gsx-progress{position:fixed;top:0;left:0;height:3px;width:100%;' +
      'transform:scaleX(0);transform-origin:0 50%;z-index:9999;pointer-events:none;' +
      'background:linear-gradient(90deg,#4169E1,#8fb4ff);box-shadow:0 0 10px rgba(65,105,225,.5);}';
    document.head.appendChild(style);
    var bar = document.createElement('div');
    bar.className = 'gsx-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    if (window.ScrollTrigger) {
      gsap.to(bar, { scaleX: 1, ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
    } else {
      var upd = function () {
        var h = document.documentElement;
        var p = h.scrollHeight - h.clientHeight;
        bar.style.transform = 'scaleX(' + (p > 0 ? (h.scrollTop || window.scrollY) / p : 0) + ')';
      };
      window.addEventListener('scroll', upd, { passive: true });
      upd();
    }
  })();

  /* ---------- Social rail: vertical in hero → docks into the header on scroll ---------- */
  (function () {
    var rail = document.getElementById('ff-srail');
    if (!rail) return;
    var links = rail.querySelectorAll('.ff-srail__link');
    var extras = rail.querySelectorAll('.ff-srail__label, .ff-srail__line');
    var hero = has('.fxhero');
    var useFlip = !!window.Flip;
    if (useFlip) gsap.registerPlugin(window.Flip);
    var docked = false;

    function setDockedPos() {
      var cta = document.querySelector('.ff-header-cta');
      var header = document.querySelector('.ff-site-header');
      if (!cta || !header) return;
      var cr = cta.getBoundingClientRect(), hr = header.getBoundingClientRect();
      // sit in the empty gutter just to the RIGHT of the phone / Free-Quote cluster
      rail.style.top = (hr.top + hr.height / 2) + 'px';
      rail.style.left = (cr.right + 18) + 'px';
      rail.style.right = 'auto';
    }
    function dock(state) {
      if (state === docked) return;
      docked = state;
      var dur = reduce ? 0 : 0.55;
      var fs = useFlip ? window.Flip.getState(links) : null;
      if (state) { setDockedPos(); rail.classList.add('is-docked'); }
      else { rail.classList.remove('is-docked'); rail.style.top = ''; rail.style.right = ''; rail.style.left = ''; }
      if (useFlip) window.Flip.from(fs, { duration: dur, ease: 'power2.inOut', absolute: true });
      gsap.to(extras, { autoAlpha: state ? 0 : 1, duration: reduce ? 0 : 0.3 });
    }

    if (window.ScrollTrigger && hero) {
      window.ScrollTrigger.create({
        trigger: hero, start: 'bottom center',
        onEnter: function () { dock(true); },
        onLeaveBack: function () { dock(false); }
      });
    } else {
      var onScroll = function () {
        dock(window.scrollY > (hero ? hero.offsetTop + hero.offsetHeight * 0.5 : 400));
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    window.addEventListener('resize', function () { if (docked) setDockedPos(); });
  })();

  if (reduce || !window.ScrollTrigger) return; // a11y: keep the bar, skip motion

  /* ---------- helpers ---------- */
  function reveal(targets, vars) {
    targets = (typeof targets === 'string') ? all(targets) : targets.filter(function (el) { return !inHow(el); });
    if (!targets || !targets.length) return;
    vars = vars || {};
    gsap.from(targets, {
      opacity: 0,
      y: vars.y != null ? vars.y : 28,
      scale: vars.scale != null ? vars.scale : 1,
      duration: vars.duration || 0.7,
      ease: vars.ease || 'power2.out',
      stagger: vars.stagger != null ? vars.stagger : 0,
      // remove the inline transform once revealed so existing CSS :hover
      // transforms (card lift, etc.) keep working untouched
      clearProps: 'transform',
      scrollTrigger: {
        trigger: vars.trigger || targets[0],
        start: vars.start || 'top 86%',
        once: true
      }
    });
  }

  /* ---------- 2) Hero entrance (on load, above the fold) ---------- */
  (function () {
    var hero = has('.fxhero');
    if (!hero) return;
    var tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8, clearProps: 'transform' } });
    var lines = hero.querySelectorAll('.fxhero__line');
    if (lines.length) tl.from(lines, { opacity: 0, y: 34, stagger: 0.12 }, 0.05);
    var fig = hero.querySelector('.fxhero__figure');
    if (fig) tl.from(fig, { opacity: 0, scale: 0.96, duration: 1 }, 0.15);
    var card = hero.querySelector('.fxhero__card');
    if (card) tl.from(card, { opacity: 0, y: 24 }, 0.35);
    var intro = hero.querySelector('.fxhero__intro');
    if (intro) tl.from(intro, { opacity: 0, y: 24 }, 0.45);
  })();

  /* ---------- 3) Section reveals + parallax ----------
     Built AFTER load so positions are measured against the final layout
     (images decoded, fonts settled, .ffhow height applied). Creating
     ScrollTriggers earlier can mis-measure a still-growing document and
     fire the `once` reveals immediately. */
  function initScroll() {
  // Why-us
  reveal(all('.ff-why__head > *'), { stagger: 0.08, trigger: has('.ff-why__head') });
  reveal(all('.ff-why__card'), { stagger: 0.1, y: 34, scale: 0.98, trigger: has('.ff-why__grid') });

  // Services
  reveal(all('.ff-services__head > *'), { stagger: 0.08, trigger: has('.ff-services__head') });
  // Services cards — reveal ONE BY ONE with a subtle pop as the section enters
  (function () {
    var grid = has('.ff-services__grid');
    if (!grid) return;
    var cards = all('.ff-services__grid > *');
    if (!cards.length) return;
    gsap.from(cards, {
      opacity: 0, y: 46, scale: 0.9, transformOrigin: '50% 100%',
      duration: 0.6, ease: 'back.out(1.5)',
      stagger: { each: 0.12, from: 'start', grid: 'auto' },
      clearProps: 'transform',
      scrollTrigger: { trigger: grid, start: 'top 80%', once: true }
    });
  })();

  // Testimonials heading (the marquee track is left untouched)
  reveal(all('.ff-tests__head > *'), { stagger: 0.08, trigger: has('.ff-tests__head') });

  // Service areas
  var areasHead = has('.ff-areas__head') || has('.ff-areas__intro');
  if (areasHead) reveal(all('.ff-areas__head > *, .ff-areas__intro > *'), { stagger: 0.08, trigger: areasHead });
  reveal(all('.ff-areas__card'), { stagger: 0.09, y: 32, scale: 0.98, trigger: has('.ff-areas__grid') || has('.ff-areas') });

  // CTA band
  reveal(all('.ff-cta-band__copy, .ff-cta-band__contacts, .ff-cta-band__actions'),
    { stagger: 0.1, trigger: has('.ff-cta-band') });

  // Footer
  reveal(all('.ff-site-footer__blurb, .ff-site-footer__credentials, .ff-site-footer__legal'),
    { stagger: 0.08, y: 22, trigger: has('.ff-site-footer') });

  /* ---------- 4) Subtle parallax on decorative layers (safe, transform-only) ---------- */
  function parallax(sel, amount) {
    all(sel).forEach(function (el) {
      gsap.to(el, {
        yPercent: amount, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }
  parallax('.ff-cta-band__deco-fence', -12);
  parallax('.ff-cta-band__deco-grid', 8);
  parallax('.ff-site-footer__deco-wordmark', -10);

    window.ScrollTrigger.refresh();
  } // end initScroll

  /* ---------- 5) Run reveals once layout is final ---------- */
  if (document.readyState === 'complete') {
    initScroll();
  } else {
    window.addEventListener('load', function () {
      // let the .ffhow load handler set its height first, then measure
      requestAnimationFrame(function () { requestAnimationFrame(initScroll); });
    });
  }
})();
