/* ─────────────────────────────────────────────────────────────
   Effective Pest Control — main.js
   Designed & developed by
   Biplab Kumar Paul — Web Designer & Developer
   Mobile: 01735 927356
   Email:  biplab.cse.85@gmail.com
   ───────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  // ── 1. Sticky header ──────────────────────────────────────
  const header = document.getElementById('header');
  const onScroll = () => {
    if (window.scrollY > 12) header.classList.add('is-stuck');
    else header.classList.remove('is-stuck');

    const backTop = document.getElementById('backTop');
    if (backTop) {
      if (window.scrollY > 600) backTop.classList.add('is-visible');
      else backTop.classList.remove('is-visible');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── 2. Mobile nav toggle ──────────────────────────────────
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
      if (open) mobileNav.removeAttribute('hidden');
      else mobileNav.setAttribute('hidden', '');
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('hidden', '');
      });
    });
  }

  // ── 3. Active nav link on scroll ──────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  if (sections.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = document.querySelector(`.nav a[href="#${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => sectionObserver.observe(s));
  }

  // ── 4. FAQ accordion ──────────────────────────────────────
  document.querySelectorAll('.faq__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // close siblings (single-open behavior)
      document.querySelectorAll('.faq__q').forEach(other => {
        if (other !== btn) other.setAttribute('aria-expanded', 'false');
      });
      btn.setAttribute('aria-expanded', String(!expanded));
    });
  });

  // ── 5b. Team coverflow slider (progress-ring driven, seamless loop) ──
  const teamStage = document.getElementById('teamStage');
  const teamRow = document.getElementById('teamRing');
  const teamName = document.getElementById('teamName');
  const teamDesc = document.getElementById('teamDesc');
  const teamProgress = document.getElementById('teamProgress');
  if (teamStage && teamRow) {
    const originals = Array.from(teamRow.querySelectorAll('.team-cf__ava'));
    const N = originals.length;
    // clone a full set BEFORE and AFTER so both sides are always populated
    const before = document.createDocumentFragment();
    originals.forEach((n) => before.appendChild(n.cloneNode(true)));
    teamRow.insertBefore(before, teamRow.firstChild);
    originals.forEach((n) => teamRow.appendChild(n.cloneNode(true)));
    const avas = Array.from(teamRow.querySelectorAll('.team-cf__ava'));
    const ringBar = teamProgress ? teamProgress.querySelector('.team-cf__progress-bar') : null;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let vindex = N;
    let dragging = false, startX = 0, moved = 0;
    let hover = false, inView = true;

    const center = (animate) => {
      const box = avas[0].offsetWidth;
      const gap = parseFloat(getComputedStyle(teamRow).columnGap) || 0;
      const step = box + gap;
      const padL = parseFloat(getComputedStyle(teamStage).paddingLeft) || 0;
      const tx = (teamStage.clientWidth / 2) - padL - (vindex * step + box / 2);
      teamRow.style.transition = animate === false ? 'none' : '';
      teamRow.style.transform = 'translate3d(' + tx + 'px,0,0)';
    };

    const paint = () => {
      avas.forEach((a, k) => a.classList.toggle('is-active', k === vindex));
      const a = avas[vindex];
      if (teamName) teamName.textContent = a.dataset.name || '';
      if (teamDesc) teamDesc.textContent = a.dataset.desc || '';
    };

    // (re)start the progress ring for the current active image
    if (teamProgress) teamProgress.classList.add('is-running');
    const startRing = () => {
      if (!ringBar || reduce) return;
      ringBar.style.animation = 'none';
      void teamStage.offsetWidth; // reflow → guarantees the fill animation restarts
      ringBar.style.animation = '';
    };

    const move = (delta) => { vindex += delta; paint(); center(true); startRing(); };

    // once the slide settles, hop back into the middle set (identical view)
    teamRow.addEventListener('transitionend', (e) => {
      if (e.target !== teamRow || e.propertyName !== 'transform') return;
      if (vindex >= 2 * N) { vindex -= N; center(false); paint(); }
      else if (vindex < N) { vindex += N; center(false); paint(); }
    });

    // the ring reaching 100% advances to the next image
    if (ringBar) ringBar.addEventListener('animationend', () => { move(1); });

    avas.forEach((a, k) => a.addEventListener('click', () => {
      if (Math.abs(moved) < 6) { vindex = k; paint(); center(true); startRing(); }
    }));

    document.querySelectorAll('[data-team-dir]').forEach((btn) => {
      btn.addEventListener('click', () => { move(btn.dataset.teamDir === 'next' ? 1 : -1); });
    });

    // drag / swipe
    const down = (x) => { dragging = true; startX = x; moved = 0; teamRow.classList.add('is-dragging'); };
    const onmove = (x) => { if (dragging) moved = x - startX; };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      teamRow.classList.remove('is-dragging');
      if (Math.abs(moved) > avas[0].offsetWidth * 0.22) move(moved < 0 ? 1 : -1);
      else { center(true); startRing(); }
    };
    teamStage.addEventListener('mousedown', (e) => { e.preventDefault(); down(e.clientX); });
    window.addEventListener('mousemove', (e) => onmove(e.clientX));
    window.addEventListener('mouseup', up);
    teamStage.addEventListener('touchstart', (e) => down(e.touches[0].clientX), { passive: true });
    teamStage.addEventListener('touchmove', (e) => onmove(e.touches[0].clientX), { passive: true });
    teamStage.addEventListener('touchend', up);

    teamStage.tabIndex = 0;
    teamStage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
    });

    // pause the ring (and auto-advance) on hover, off-screen, or hidden tab
    const updatePaused = () => teamStage.classList.toggle('is-paused', hover || !inView || document.hidden);
    teamStage.addEventListener('mouseenter', () => { hover = true; updatePaused(); });
    teamStage.addEventListener('mouseleave', () => { hover = false; updatePaused(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => { es.forEach((e) => { inView = e.isIntersecting; }); updatePaused(); }, { threshold: 0 }).observe(teamStage);
    }
    document.addEventListener('visibilitychange', updatePaused);

    window.addEventListener('resize', () => center(false));

    paint();
    center(false);
    startRing();
  }

  // ── 6. Back to top ────────────────────────────────────────
  const backTop = document.getElementById('backTop');
  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── 7. Scroll reveal ──────────────────────────────────────
  if ('IntersectionObserver' in window) {
    const revealTargets = [
      '.about__content > *',
      '.about__media',
      '.team__header > *',
      '.team-card',
      '.services__header > *',
      '.service-card',
      '.feature',
      '.cta-banner__text > *',
      '.cta-banner__actions',
      '.prep__aside > *',
      '.prep__list li',
      '.testimonials__header > *',
      '.t-card',
      '.faq__aside > *',
      '.faq__item',
      '.contact__info > *',
      '.contact__form'
    ];

    document.querySelectorAll(revealTargets.join(',')).forEach((el, i) => {
      el.setAttribute('data-reveal', '');
      el.style.transitionDelay = `${(i % 6) * 70}ms`;
    });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
  }

  // ── 8. Contact form ───────────────────────────────────────
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      // Demo handler — replace with actual POST/endpoint
      if (success) {
        success.hidden = false;
        form.reset();
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => { success.hidden = true; }, 6000);
      }
    });
  }

  // ── 9. Copyright year ─────────────────────────────────────
  const yearEl = document.getElementById('copyYear');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ── 10. Smooth scroll for nav anchors (with header offset) ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();

/* ─────────────────────────────────────────────────────────────
   Footer accordions — mobile only (Sitemap / Services / Contact)
   ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';
  const init = () => {
    const mq = window.matchMedia('(max-width: 640px)');
    document.querySelectorAll('.site-footer__col').forEach((col) => {
      const h = col.querySelector('h5');
      if (!h) return;
      h.setAttribute('role', 'button');
      h.setAttribute('tabindex', '0');
      const toggle = () => { if (mq.matches) col.classList.toggle('is-open'); };
      h.addEventListener('click', toggle);
      h.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* ─────────────────────────────────────────────────────────────
   Mobile app-bar — "More" opens the existing mobile nav
   ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';
  const init = () => {
    const more = document.getElementById('appBarMore');
    const toggle = document.querySelector('.nav-toggle');
    if (!more || !toggle) return;
    more.addEventListener('click', () => toggle.click());
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* ─── Hero crossfade slider ─────────────────────────────────────
   Cycles the left-side hero images with a smooth fade (CSS handles
   the crossfade; this only toggles the active slide). ───────────── */
(function () {
  'use strict';
  const init = () => {
    const slider = document.querySelector('[data-hero-slider]');
    if (!slider) return;
    const slides = slider.querySelectorAll('.hero__slide');
    if (slides.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let i = 0;
    setInterval(() => {
      slides[i].classList.remove('is-active');
      i = (i + 1) % slides.length;
      slides[i].classList.add('is-active');
    }, 4500);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* ─── Get in touch modal ──────────────────────────────────── */
(function () {
  'use strict';
  const init = () => {
    const modal = document.getElementById('getInTouchModal');
    if (!modal) return;
    const openers = document.querySelectorAll('[data-gt-open]');
    const closers = modal.querySelectorAll('[data-gt-close]');
    const form = document.getElementById('gtForm');
    const success = document.getElementById('gtSuccess');
    let lastFocus = null;

    const open = (e) => {
      if (e) e.preventDefault();
      lastFocus = document.activeElement;
      modal.hidden = false;
      document.body.classList.add('gt-open');
      requestAnimationFrame(() => modal.classList.add('is-open'));
      const f = modal.querySelector('input, textarea, button');
      if (f) setTimeout(() => f.focus(), 60);
    };
    const close = () => {
      modal.classList.remove('is-open');
      document.body.classList.remove('gt-open');
      setTimeout(() => { modal.hidden = true; }, 400);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    openers.forEach((b) => b.addEventListener('click', open));
    closers.forEach((b) => b.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        if (success) success.hidden = false;
        form.querySelectorAll('input, textarea').forEach((i) => { i.value = ''; });
        setTimeout(() => { if (success) success.hidden = true; close(); }, 2400);
      });
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
