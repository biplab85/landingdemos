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

  // ── 5. Testimonial marquee (continuous autoplay) ──────────
  const tInner = document.getElementById('testimonialInner');
  if (tInner) {
    // Duplicate cards once so translateX(-50%) loops seamlessly
    tInner.innerHTML = tInner.innerHTML + tInner.innerHTML;
  }

  // ── 5b. Team 3D parallax carousel ─────────────────────────
  const teamStage = document.getElementById('teamStage');
  const teamRing  = document.getElementById('teamRing');
  const teamIndexLabel = document.getElementById('teamIndex');
  if (teamStage && teamRing) {
    const slides = Array.from(teamRing.querySelectorAll('.team-px__slide'));
    const N = slides.length;
    const STEP = 360 / N;
    let rotation = 0;        // current rotation (deg)
    let target   = 0;        // target rotation (deg)
    let dragging = false;
    let dragStartX = 0;
    let dragStartRot = 0;

    const pad = String(n => n).toString;
    const formatIdx = (n) => (n + 1).toString().padStart(2, '0');

    const updateParallax = () => {
      // For each slide, calculate how far its facing-angle is from the camera
      // and shift its background-position to create the parallax illusion.
      slides.forEach((slide, i) => {
        let angle = ((i * STEP) + rotation) % 360;
        if (angle > 180) angle -= 360;
        if (angle < -180) angle += 360;
        // -180..180 → -1..1
        const t = Math.max(-1, Math.min(1, angle / 90));
        const xShift = (50 - t * 18).toFixed(1) + '%';
        const img = slide.querySelector('.team-px__img');
        if (img) img.style.backgroundPosition = xShift + ' 50%';
      });

      // counter — find the slide nearest to facing the camera
      let nearest = 0;
      let min = Infinity;
      slides.forEach((_, i) => {
        let a = ((i * STEP) + rotation) % 360;
        if (a > 180) a -= 360;
        if (a < -180) a += 360;
        const d = Math.abs(a);
        if (d < min) { min = d; nearest = i; }
      });
      if (teamIndexLabel) teamIndexLabel.textContent = formatIdx(nearest);
    };

    const applyTransform = () => {
      teamRing.style.transform = `rotateY(${rotation}deg)`;
      updateParallax();
    };

    const snap = (toAngle) => {
      // snap to nearest STEP
      target = Math.round(toAngle / STEP) * STEP;
      teamRing.classList.remove('is-dragging');
      rotation = target;
      applyTransform();
    };

    // Drag handlers ─────────────────────────────────────────
    const onDragStart = (clientX) => {
      dragging = true;
      dragStartX = clientX;
      dragStartRot = rotation;
      teamRing.classList.add('is-dragging');
    };
    const onDragMove = (clientX) => {
      if (!dragging) return;
      const delta = clientX - dragStartX;
      rotation = dragStartRot - delta * 0.4;
      teamRing.style.transform = `rotateY(${rotation}deg)`;
      updateParallax();
    };
    const onDragEnd = () => {
      if (!dragging) return;
      dragging = false;
      snap(rotation);
    };

    teamStage.addEventListener('mousedown', (e) => { e.preventDefault(); onDragStart(e.clientX); });
    window.addEventListener('mousemove', (e) => onDragMove(e.clientX));
    window.addEventListener('mouseup', onDragEnd);

    teamStage.addEventListener('touchstart', (e) => { onDragStart(e.touches[0].clientX); }, { passive: true });
    teamStage.addEventListener('touchmove',  (e) => { onDragMove(e.touches[0].clientX); },  { passive: true });
    teamStage.addEventListener('touchend',   onDragEnd);

    // Arrow buttons ─────────────────────────────────────────
    document.querySelectorAll('[data-team-dir]').forEach(btn => {
      btn.addEventListener('click', () => {
        const dir = btn.dataset.teamDir === 'next' ? -1 : 1; // next rotates -STEP
        rotation += dir * STEP;
        applyTransform();
      });
    });

    // Keyboard ──────────────────────────────────────────────
    teamStage.tabIndex = 0;
    teamStage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { rotation += STEP; applyTransform(); }
      if (e.key === 'ArrowRight') { rotation -= STEP; applyTransform(); }
    });

    applyTransform();

    // ── Autoplay ──────────────────────────────────────────
    let autoplay = null;
    let pausedByHover = false;
    const startAutoplay = () => {
      stopAutoplay();
      autoplay = setInterval(() => {
        if (dragging || pausedByHover) return;
        // Pause when section is off-screen
        const rect = teamStage.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        rotation -= STEP;
        applyTransform();
      }, 3800);
    };
    const stopAutoplay = () => {
      if (autoplay) { clearInterval(autoplay); autoplay = null; }
    };
    teamStage.addEventListener('mouseenter', () => { pausedByHover = true; });
    teamStage.addEventListener('mouseleave', () => { pausedByHover = false; });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay(); else startAutoplay();
    });
    startAutoplay();
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
