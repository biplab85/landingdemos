/* ─────────────────────────────────────────────────────────────
   Eco Pest Control Melbourne — main.js
   Designed & developed by
   Biplab Kumar Paul — Web Designer & Developer
   Mobile: 01735 927356
   Email:  biplab.cse.85@gmail.com
   ───────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initMobileNav();
    initMobileSubmenus();
    initAccordion();
    initReveal();
    initQuoteForm();
    initSmoothScroll();
    initModal();
  });

  /* ── Sticky header shadow on scroll ──────────────────────────── */
  function initStickyHeader() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile nav drawer ───────────────────────────────────────── */
  function initMobileNav() {
    const burger = document.getElementById('burgerBtn');
    const nav    = document.getElementById('primaryNav');
    if (!burger || !nav) return;

    const close = () => {
      burger.classList.remove('is-open');
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    const open = () => {
      burger.classList.add('is-open');
      nav.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    burger.addEventListener('click', () => {
      nav.classList.contains('is-open') ? close() : open();
    });

    // Close on nav link click (mobile)
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', (e) => {
        if (a.hasAttribute('data-sub') && window.innerWidth < 1024) {
          // submenu toggle is handled separately
          return;
        }
        if (window.innerWidth < 1024) close();
      });
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) close();
    });
  }

  /* ── Mobile submenu toggle ───────────────────────────────────── */
  function initMobileSubmenus() {
    document.querySelectorAll('.nav__item').forEach(item => {
      const trigger = item.querySelector('[data-sub]');
      const sub     = item.querySelector('.nav__sub');
      if (!trigger || !sub) return;

      trigger.addEventListener('click', (e) => {
        if (window.innerWidth >= 1024) return; // desktop: hover handles it
        e.preventDefault();
        sub.classList.toggle('is-open');
      });
    });
  }

  /* ── FAQ accordion ───────────────────────────────────────────── */
  function initAccordion() {
    const items = document.querySelectorAll('#faqAccordion .acc-item');
    if (!items.length) return;
    items.forEach(item => {
      const head = item.querySelector('.acc-item__head');
      head.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        // close siblings
        items.forEach(i => {
          i.classList.remove('is-open');
          i.querySelector('.acc-item__head').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          head.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ── Reveal on scroll ────────────────────────────────────────── */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // small stagger
          setTimeout(() => entry.target.classList.add('is-visible'), idx * 60);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    els.forEach(el => io.observe(el));
  }

  /* ── Smooth scroll for hash links ────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const headerOffset = 84;
        const y = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });
  }

  /* ── Modal: quote form open/close ─────────────────────────── */
  function initModal() {
    const modal = document.getElementById('quoteModal');
    if (!modal) return;
    let lastFocus = null;

    const open = (trigger) => {
      lastFocus = trigger || document.activeElement;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      // focus first field after transition starts
      setTimeout(() => {
        const first = modal.querySelector('input, select, textarea, button');
        if (first) first.focus();
      }, 80);
    };
    const close = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    // Open triggers (anywhere on the page)
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-modal-open="quote"]');
      if (trigger) {
        e.preventDefault();
        open(trigger);
        // close mobile nav if open
        const nav = document.getElementById('primaryNav');
        const burger = document.getElementById('burgerBtn');
        if (nav && nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          if (burger) {
            burger.classList.remove('is-open');
            burger.setAttribute('aria-expanded', 'false');
          }
        }
      }
    });

    // Close triggers (backdrop + close button)
    modal.querySelectorAll('[data-modal-close]').forEach(el => {
      el.addEventListener('click', close);
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });

    // Focus trap (basic)
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusables = modal.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* ── Quote form: tiny client-side validation + feedback ──────── */
  function initQuoteForm() {
    const form = document.getElementById('quoteForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const required = form.querySelectorAll('[required]');
      let firstInvalid = null;
      required.forEach(field => {
        const valid = field.checkValidity();
        field.style.borderColor = valid ? '' : '#A24A1F';
        if (!valid && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      // success state
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Thanks — we\'ll be in touch ✓';
      form.reset();
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = orig;
      }, 3200);
    });
  }
})();

/* ─────────────────────────────────────────────────────────────
   Footer accordions — mobile only (Services / Pests / Contact)
   ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';
  const init = () => {
    const mq = window.matchMedia('(max-width: 479px)');
    document.querySelectorAll('.site-footer__col:not(.site-footer__col--brand)').forEach((col) => {
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
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* ─────────────────────────────────────────────────────────────
   Mobile app-bar — "More" opens the existing nav menu
   ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';
  const init = () => {
    const more = document.getElementById('appBarMore');
    const burger = document.getElementById('burgerBtn');
    if (!more || !burger) return;
    more.addEventListener('click', () => burger.click());
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
