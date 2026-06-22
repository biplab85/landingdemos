(() => {
  'use strict';

  const $  = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  // ── Sticky header shrink on scroll ────────────────────────────
  const header = $('[data-header]');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 16);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile nav drawer ─────────────────────────────────────────
  const menuBtn  = $('[data-menu-toggle]');
  const mobileNav = $('#mobile-nav');
  if (menuBtn && mobileNav && header) {
    const setOpen = (open) => {
      header.classList.toggle('is-menu-open', open);
      mobileNav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    menuBtn.addEventListener('click', () => setOpen(!mobileNav.classList.contains('is-open')));
    $$('#mobile-nav a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) setOpen(false);
    });
  }

  // ── Smooth anchor scroll with header offset ───────────────────
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    // Skip modal triggers — they should only open the modal, not scroll
    if (a.hasAttribute('data-open-modal')) return;
    const id = a.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = (header?.offsetHeight || 0) + 12;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });

  // ── Scroll-reveal ─────────────────────────────────────────────
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = $$('.reveal, .reveal-2, .reveal-3, .reveal-4');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealEls.forEach(el => io.observe(el));
  }

  // ── Fancybox lightbox config (loaded via CDN) ─────────────────
  if (window.Fancybox) {
    window.Fancybox.bind('[data-fancybox]', {
      Toolbar: { display: { left: ['infobar'], middle: [], right: ['slideshow', 'fullscreen', 'thumbs', 'close'] } },
      Thumbs: { type: 'classic' },
      animated: true,
      showClass: 'f-fadeIn',
      hideClass: 'f-fadeOut',
    });
  }

  // ── Form: light client-side validation ────────────────────────
  $$('[data-quote-form]').forEach(form => {
    form.addEventListener('submit', e => {
      const required = $$('[required]', form);
      let ok = true;
      required.forEach(field => {
        const empty = !String(field.value || '').trim();
        const invalidEmail = field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
        if (empty || invalidEmail) {
          ok = false;
          field.style.borderBottomColor = '#6BCDF5';
          field.addEventListener('input', () => { field.style.borderBottomColor = ''; }, { once: true });
        }
      });
      if (!ok) e.preventDefault();
    });
  });

  // ── Modal (quote popup) ───────────────────────────────────────
  const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  const openModal = (modal) => {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    // Focus first input after animation begins
    requestAnimationFrame(() => {
      const first = modal.querySelector('input, select, textarea, button');
      first?.focus({ preventScroll: true });
    });
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus({ preventScroll: true });
    }
  };

  // Open triggers
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-open-modal]');
    if (!trigger) return;
    const id = trigger.getAttribute('data-open-modal');
    const modal = document.getElementById(id);
    if (!modal) return;
    e.preventDefault();
    openModal(modal);
  });

  // Close triggers (X, backdrop)
  document.addEventListener('click', e => {
    const closer = e.target.closest('[data-modal-close]');
    if (!closer) return;
    const modal = closer.closest('.modal');
    closeModal(modal);
  });

  // Escape + focus trap
  document.addEventListener('keydown', e => {
    const openMod = document.querySelector('.modal.is-open');
    if (!openMod) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal(openMod);
      return;
    }
    if (e.key === 'Tab') {
      const focusables = Array.from(openMod.querySelectorAll(focusableSelector))
        .filter(el => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* Mobile app-bar "More" opens the existing mobile menu */
  const appBarMore = document.getElementById('appBarMore');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  if (appBarMore && menuToggle) {
    appBarMore.addEventListener('click', () => menuToggle.click());
  }

  /* Mobile-only footer accordions — Services + Sitemap */
  const footMq = window.matchMedia('(max-width: 767px)');
  document.querySelectorAll('.foot-col:not(.foot-brand):not(.foot-visit)').forEach(col => {
    const label = col.querySelector('.foot-col__label');
    if (!label) return;
    label.setAttribute('role', 'button');
    label.setAttribute('tabindex', '0');
    const toggle = () => { if (footMq.matches) col.classList.toggle('is-open'); };
    label.addEventListener('click', toggle);
    label.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });
})();
