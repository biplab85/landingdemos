/* ─────────────────────────────────────────────────────────────
 * Designed & developed by
 * Biplab Kumar Paul — Web Designer & Developer
 * Mobile: 01735 927356
 * Email:  biplab.cse.85@gmail.com
 * ───────────────────────────────────────────────────────────── */

(() => {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 1. Header scroll state ──────────────────────────────────
  const header = document.getElementById('siteHeader');
  const toTop = document.getElementById('toTop');
  const heroAlt = document.querySelector('.hero-alt');

  // Trigger threshold: just before the bottom of the dark hero-alt
  // leaves the viewport — so the nav swaps to light glass + dark text
  // only over light sections.
  const getScrollThreshold = () => {
    if (heroAlt) return Math.max(80, heroAlt.offsetHeight - 80);
    return 60;
  };
  let scrollThreshold = getScrollThreshold();
  window.addEventListener('resize', () => { scrollThreshold = getScrollThreshold(); });

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > scrollThreshold);
    if (toTop) toTop.classList.toggle('is-visible', y > 720);

    // Process line progress
    if (procLine) {
      const rect = procLine.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.25;
      const raw = (start - rect.top) / (start - end);
      const p = Math.max(0, Math.min(1, raw));
      procLineFill.style.width = (p * 100) + '%';
    }
  };

  const procLine = document.getElementById('processLine');
  const procLineFill = procLine ? procLine.querySelector('i') : null;
  if (procLineFill) {
    procLineFill.style.display = 'block';
    procLineFill.style.position = 'absolute';
    procLineFill.style.left = '0';
    procLineFill.style.top = '0';
    procLineFill.style.bottom = '0';
    procLineFill.style.background = 'var(--brass)';
    procLineFill.style.width = '0%';
    procLineFill.style.transition = 'width 600ms cubic-bezier(0.22,1,0.36,1)';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  // ── 2. Mobile menu ──────────────────────────────────────────
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const body = document.body;
  const closeMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle?.setAttribute('aria-expanded', 'false');
    body.classList.remove('no-scroll');
  };
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('is-open');
      mobileMenu.setAttribute('aria-hidden', String(!open));
      menuToggle.setAttribute('aria-expanded', String(open));
      body.classList.toggle('no-scroll', open);
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }

  // ── 3. Scroll-reveal observer ───────────────────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-up, .reveal-l, .reveal-r, [data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach((el) => io.observe(el));

    // Group stagger: add transition-delay if child of [data-reveal-group]
    document.querySelectorAll('[data-reveal-group]').forEach((group) => {
      const children = group.querySelectorAll('.reveal, .reveal-up, .reveal-l, .reveal-r');
      children.forEach((c, i) => {
        c.style.transitionDelay = (i * 0.08) + 's';
      });
    });
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // ── 4. Count-up stats ───────────────────────────────────────
  const counters = document.querySelectorAll('[data-count-to]');
  const animateCount = (el) => {
    if (reduce) {
      el.textContent = el.dataset.countTo;
      return;
    }
    const target = parseInt(el.dataset.countTo, 10);
    const dur = 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toString();
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach((c) => cio.observe(c));
  } else {
    counters.forEach(animateCount);
  }

  // ── 5. Hero parallax ────────────────────────────────────────
  const parallaxTargets = document.querySelectorAll('[data-parallax-target]');
  if (!reduce && parallaxTargets.length) {
    const img = parallaxTargets[0].querySelector('img');
    let raf = null;
    const onHeroScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (img) {
          const max = 80;
          img.style.transform = `translateY(${Math.min(y * 0.18, max)}px) scale(1.04)`;
        }
        raf = null;
      });
    };
    window.addEventListener('scroll', onHeroScroll, { passive: true });
  }

  // ── 6. Magnetic CTA hover (desktop only) ────────────────────
  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isDesktop && !reduce) {
    document.querySelectorAll('.btn').forEach((btn) => {
      let raf = null;
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = (e.clientX - cx) * 0.10;
        const dy = (e.clientY - cy) * 0.18;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          btn.style.transform = `translate(${dx}px, ${dy}px)`;
        });
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ── 7. Accordion ────────────────────────────────────────────
  document.querySelectorAll('.accordion').forEach((acc) => {
    acc.querySelectorAll('.acc-item').forEach((item) => {
      const btn = item.querySelector('.acc-item__btn');
      btn?.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        // close siblings (single-open accordion)
        acc.querySelectorAll('.acc-item.is-open').forEach((sib) => {
          if (sib !== item) {
            sib.classList.remove('is-open');
            sib.querySelector('.acc-item__btn')?.setAttribute('aria-expanded', 'false');
          }
        });
        item.classList.toggle('is-open', !isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  });

  // ── 8. Testimonials slider ─────────────────────────────────
  const slides = document.querySelectorAll('.tlist__slide');
  const dots = document.querySelectorAll('.tlist__dots button');
  let activeSlide = 0;
  let slideTimer = null;

  const setSlide = (i) => {
    activeSlide = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle('is-active', idx === activeSlide));
    dots.forEach((d, idx) => d.classList.toggle('is-active', idx === activeSlide));
  };
  const tick = () => setSlide(activeSlide + 1);
  const startAutoSlide = () => {
    if (reduce) return;
    if (slideTimer) clearInterval(slideTimer);
    slideTimer = setInterval(tick, 6500);
  };
  dots.forEach((d) => {
    d.addEventListener('click', () => {
      setSlide(parseInt(d.dataset.slide || '0', 10));
      startAutoSlide();
    });
  });
  if (slides.length) startAutoSlide();

  // ── 9. Active nav link on scroll ────────────────────────────
  const navLinks = document.querySelectorAll('.site-header__nav a[href^="#"]');
  const sections = Array.from(navLinks).map((a) => document.querySelector(a.getAttribute('href')));
  if ('IntersectionObserver' in window) {
    const navIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const idx = sections.indexOf(entry.target);
        if (entry.isIntersecting && idx >= 0) {
          navLinks.forEach((l) => l.classList.remove('is-active'));
          navLinks[idx]?.classList.add('is-active');
        }
      });
    }, { threshold: 0.4, rootMargin: '-30% 0px -40% 0px' });
    sections.forEach((s) => s && navIo.observe(s));
  }

  // ── 10. Smooth-scroll anchor links ─────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      const offset = 80;
      const top = t.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  // ── 11. Year in footer ──────────────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* ───────────────────────────────────────────────────────────────
 * Mobile app-bar "More" + footer accordions (mobile only)
 * ─────────────────────────────────────────────────────────────── */
(() => {
  // "More" opens the existing mobile menu
  const more = document.getElementById('appBarMore');
  const menuToggle = document.getElementById('menuToggle');
  if (more && menuToggle) more.addEventListener('click', () => menuToggle.click());

  // Footer Services / Service Area / Contact accordions
  const mq = window.matchMedia('(max-width: 767.98px)');
  document.querySelectorAll('.site-footer__col').forEach((col) => {
    const h = col.querySelector('h4');
    if (!h) return;
    h.setAttribute('role', 'button');
    h.setAttribute('tabindex', '0');
    const toggle = () => { if (mq.matches) col.classList.toggle('is-open'); };
    h.addEventListener('click', toggle);
    h.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });
})();

/* ───────────────────────────────────────────────────────────────
 * Mobile app-bar — scroll-direction reveal
 * Hidden initially; slides IN while scrolling DOWN, OUT while scrolling UP.
 * (mobile only; CSS handles the desktop hide and the transition)
 * ─────────────────────────────────────────────────────────────── */
(() => {
  const bar = document.querySelector('.app-bar');
  if (!bar) return;
  const getY = () => window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  let lastY = getY();
  let ticking = false;

  const update = () => {
    const y = getY();
    if (y <= 48) {
      bar.classList.remove('is-visible');          // near the top: hidden
    } else if (y > lastY + 4) {
      bar.classList.add('is-visible');             // scrolling DOWN: show
    } else if (y < lastY - 4) {
      bar.classList.remove('is-visible');          // scrolling UP: hide
    }
    lastY = y;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
})();
