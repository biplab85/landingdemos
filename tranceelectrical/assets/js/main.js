/* Trance Electrical — interactions */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Sticky header shadow ---- */
  const header = document.querySelector('[data-header]');
  const onScroll = () => header && header.classList.toggle('is-stuck', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile nav ---- */
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-menu]');

  // scrim
  const scrim = document.createElement('div');
  scrim.className = 'nav-scrim';
  document.body.appendChild(scrim);

  const closeNav = () => {
    if (!menu) return;
    menu.classList.remove('is-open');
    scrim.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      scrim.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('nav-open', open);
    });
    scrim.addEventListener('click', closeNav);

    // Mobile: tap "Services" toggles its submenu instead of navigating
    const sub = document.querySelector('[data-sub]');
    if (sub) {
      const top = sub.querySelector('.menu__top');
      top.addEventListener('click', (e) => {
        if (window.matchMedia('(max-width: 819px)').matches) {
          e.preventDefault();
          sub.classList.toggle('is-open');
        }
      });
    }

    // Close when a real link is clicked
    menu.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', closeNav);
    });

    // Close on Escape / resize to desktop
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 820) closeNav();
    });
  }

  /* ---- Scroll reveal ---- */
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---- Work slider (Swiper) ---- */
  const sliderEl = document.querySelector('[data-swiper]');
  if (sliderEl && window.Swiper) {
    /* eslint-disable no-new */
    new window.Swiper(sliderEl, {
      slidesPerView: 1.1,
      centeredSlides: true,
      spaceBetween: 18,
      loop: true,
      grabCursor: true,
      speed: 700,
      autoplay: reduce ? false : { delay: 4200, disableOnInteraction: false },
      pagination: { el: sliderEl.querySelector('.swiper-pagination'), clickable: true },
      navigation: {
        prevEl: sliderEl.querySelector('[data-prev]'),
        nextEl: sliderEl.querySelector('[data-next]'),
      },
      keyboard: { enabled: true },
      breakpoints: {
        680:  { slidesPerView: 1.5, spaceBetween: 24 },
        980:  { slidesPerView: 2.1, spaceBetween: 28 },
        1280: { slidesPerView: 2.4, spaceBetween: 32 },
      },
    });
  }

  /* ---- Footer year ---- */
  const yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- Power rail: charge with scroll progress ---- */
  const rail = document.querySelector('[data-rail]');
  const frame = document.querySelector('.hero__frame');
  let ticking = false;

  function onFrame() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    if (rail) rail.style.height = (progress * 100).toFixed(2) + '%';

    // hero photo parallax
    if (frame && !reduce && window.scrollY < window.innerHeight * 1.2) {
      frame.style.setProperty('--py', (window.scrollY * 0.06).toFixed(1) + 'px');
    }
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(onFrame); ticking = true; }
  }, { passive: true });
  onFrame();

  /* ---- Hero frame: subtle mouse tilt (desktop) ---- */
  const visual = document.querySelector('.hero__visual');
  if (visual && frame && !reduce && window.matchMedia('(hover: hover)').matches) {
    visual.addEventListener('mousemove', (e) => {
      const r = visual.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      frame.style.setProperty('--ry', (dx * 8).toFixed(2) + 'deg');
      frame.style.setProperty('--rx', (-dy * 8).toFixed(2) + 'deg');
    });
    visual.addEventListener('mouseleave', () => {
      frame.style.setProperty('--ry', '0deg');
      frame.style.setProperty('--rx', '0deg');
    });
  }

  /* ---- Count-up numbers on reveal ---- */
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        cio.unobserve(el);
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        if (reduce) { el.textContent = target + suffix; return; }
        const dur = 1100; const start = performance.now();
        const step = (now) => {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));
  }

  /* ---- Enquiry modal ---- */
  const modal = document.getElementById('enquireModal');
  if (modal) {
    const triggers = document.querySelectorAll('a[href*="bit.ly/tranceelectrical"]');
    const closers = modal.querySelectorAll('[data-modal-close]');
    let lastFocus = null;

    const openModal = (e) => {
      if (e) { e.preventDefault(); lastFocus = e.currentTarget; }
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      closeNav();
      const first = modal.querySelector('#ef-name');
      window.setTimeout(() => { if (first) first.focus(); }, 320);
    };
    const closeModal = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    triggers.forEach((t) => t.addEventListener('click', openModal));
    closers.forEach((c) => c.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    const form = modal.querySelector('[data-enquire-form]');
    if (form) {
      form.querySelectorAll('input, select, textarea').forEach((el) => {
        el.addEventListener('input', () => { el.style.borderColor = ''; });
      });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const name = (data.get('name') || '').trim();
        const phone = (data.get('phone') || '').trim();
        if (!name || !phone) {
          const bad = !name ? form.querySelector('#ef-name') : form.querySelector('#ef-phone');
          if (bad) { bad.style.borderColor = '#d9534f'; bad.focus(); }
          return;
        }
        const lines = [
          'Name: ' + name,
          'Phone: ' + phone,
          'Email: ' + ((data.get('email') || '').trim() || '—'),
          'Service: ' + ((data.get('service') || '').trim() || '—'),
          '',
          'Details:',
          (data.get('message') || '').trim() || '—',
        ];
        const subject = encodeURIComponent('Website enquiry — ' + name);
        const body = encodeURIComponent(lines.join('\n'));
        window.location.href = 'mailto:info@tranceelectrical.com?subject=' + subject + '&body=' + body;
      });
    }
  }
})();
