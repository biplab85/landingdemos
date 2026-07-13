/* ==========================================================================
   Kaluta Bro Roofing — main.js
   Interactions: preloader, sticky header, mobile menu, scroll reveals,
   count-up, Swiper carousels, FAQ accordion, Fancybox, form, app bar.
   All motion respects prefers-reduced-motion.
   ========================================================================== */

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* --------------------------------------------------------------------------
   Preloader
   -------------------------------------------------------------------------- */
function initPreloader() {
  const pre = $('#preloader');
  if (!pre) return;
  const done = () => pre.classList.add('is-done');
  if (document.readyState === 'complete') done();
  else window.addEventListener('load', () => setTimeout(done, 250));
  // hard fallback
  setTimeout(done, 2500);
}

/* --------------------------------------------------------------------------
   Sticky header
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = $('#header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* --------------------------------------------------------------------------
   Mobile menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const burger = $('#burger');
  const menu = $('#mobileMenu');
  const header = $('#header');
  if (!burger || !menu) return;

  const setOpen = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('u-no-scroll', open);
    // Solid header while the (white) menu overlay is open so the brand stays visible
    if (header) header.classList.toggle('is-stuck', open || window.scrollY > 40);
  };

  burger.addEventListener('click', () =>
    setOpen(burger.getAttribute('aria-expanded') !== 'true')
  );
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

/* --------------------------------------------------------------------------
   Scroll reveals (GSAP ScrollTrigger, IO fallback)
   -------------------------------------------------------------------------- */
function initReveals() {
  const els = $$('[data-reveal]');
  if (!els.length) return;

  if (prefersReduced) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const hasGsap = window.gsap && window.ScrollTrigger;
  if (hasGsap) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    els.forEach((el) => {
      const delay = parseFloat(el.dataset.revealDelay || '0');
      window.gsap.fromTo(
        el,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onStart: () => el.classList.add('is-in'),
        }
      );
    });
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = parseFloat(el.dataset.revealDelay || '0');
            el.style.transitionDelay = `${delay}s`;
            el.classList.add('is-in');
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => io.observe(el));
  }
}

/* --------------------------------------------------------------------------
   Count-up
   -------------------------------------------------------------------------- */
function initCounters() {
  const nums = $$('[data-count]');
  if (!nums.length) return;

  const run = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (prefersReduced) {
      el.textContent = target + suffix;
      return;
    }
    const dur = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          run(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  nums.forEach((el) => io.observe(el));
}

/* --------------------------------------------------------------------------
   Swiper carousels
   -------------------------------------------------------------------------- */
function pad(n) {
  return String(n).padStart(2, '0');
}

function bindCount(swiper, countEl) {
  if (!countEl) return;
  const b = countEl.querySelector('b');
  const update = () => {
    if (b) b.textContent = pad(swiper.realIndex + 1);
  };
  swiper.on('slideChange', update);
  update();
}

function initSwipers() {
  if (!window.Swiper) return;

  // Showcase
  const showcaseEl = $('[data-showcase]');
  if (showcaseEl) {
    const s = new window.Swiper(showcaseEl, {
      slidesPerView: 1.15,
      spaceBetween: 20,
      grabCursor: true,
      speed: 650,
      navigation: { prevEl: '[data-showcase-prev]', nextEl: '[data-showcase-next]' },
      pagination: { el: '[data-showcase-progress]', type: 'progressbar' },
      breakpoints: {
        560: { slidesPerView: 2, spaceBetween: 24 },
        1024: { slidesPerView: 3, spaceBetween: 24 },
        1280: { slidesPerView: 4, spaceBetween: 28 },
      },
    });
    bindCount(s, showcaseEl.closest('.showcase')?.querySelector('[data-slider-count]'));
  }

  // Projects
  const projectsEl = $('[data-projects]');
  if (projectsEl) {
    const s = new window.Swiper(projectsEl, {
      slidesPerView: 1.1,
      spaceBetween: 20,
      grabCursor: true,
      speed: 650,
      loop: true,
      autoplay: prefersReduced ? false : { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true },
      navigation: { prevEl: '[data-projects-prev]', nextEl: '[data-projects-next]' },
      breakpoints: {
        560: { slidesPerView: 2, spaceBetween: 24 },
        1024: { slidesPerView: 3, spaceBetween: 28 },
      },
    });
    bindCount(s, projectsEl.closest('.projects')?.querySelector('[data-slider-count]'));
  }

  // Testimonials
  const testiEl = $('[data-testimonials]');
  if (testiEl) {
    new window.Swiper(testiEl, {
      slidesPerView: 1,
      spaceBetween: 24,
      grabCursor: true,
      speed: 650,
      autoHeight: false,
      autoplay: prefersReduced ? false : { delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true },
      navigation: { prevEl: '[data-testi-prev]', nextEl: '[data-testi-next]' },
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 28 },
        1200: { slidesPerView: 3, spaceBetween: 30 },
      },
    });
  }
}

/* --------------------------------------------------------------------------
   FAQ accordion
   -------------------------------------------------------------------------- */
function initAccordion() {
  const root = $('[data-accordion]');
  if (!root) return;
  const items = $$('.accordion__item', root);

  items.forEach((item) => {
    const trigger = $('.accordion__trigger', item);
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      items.forEach((other) => {
        other.classList.remove('is-open');
        $('.accordion__trigger', other)?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Fancybox
   -------------------------------------------------------------------------- */
function initFancybox() {
  if (window.Fancybox) {
    window.Fancybox.bind('[data-fancybox]', {
      Toolbar: { display: { right: ['slideshow', 'thumbs', 'close'] } },
    });
  }
}

/* --------------------------------------------------------------------------
   Quote form (placeholder handler)
   -------------------------------------------------------------------------- */
function initForm() {
  const form = $('#quoteForm');
  const status = $('#quoteStatus');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#q-name');
    const phone = form.querySelector('#q-phone');
    if (!name.value.trim() || !phone.value.trim()) {
      status.textContent = 'Please add your name and phone so we can reach you.';
      status.dataset.state = 'error';
      (!name.value.trim() ? name : phone).focus();
      return;
    }
    // PLACEHOLDER: connect to a real backend/email service before launch.
    status.textContent = 'Thanks! Your request has been noted — we’ll be in touch shortly.';
    status.dataset.state = 'success';
    form.reset();
  });
}

/* --------------------------------------------------------------------------
   Active section highlight (nav + app bar)
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = $$('section[id], main span[id="top"]');
  const map = new Map();
  $$('.appbar__item[href^="#"]').forEach((a) => map.set(a.getAttribute('href').slice(1), a));
  if (!map.size) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (map.has(id)) {
            map.forEach((a) => a.classList.remove('is-active'));
            map.get(id).classList.add('is-active');
          }
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px' }
  );
  sections.forEach((s) => s.id && io.observe(s));
}

/* --------------------------------------------------------------------------
   Footer accordions (Explore / Services) — mobile only
   -------------------------------------------------------------------------- */
function initFooterAccordion() {
  const cols = $$('.footer__col--acc');
  if (!cols.length) return;
  const mq = window.matchMedia('(max-width: 767.98px)');

  cols.forEach((col) => {
    const head = $('.footer__acc-head', col);
    if (!head) return;
    head.addEventListener('click', () => {
      if (!mq.matches) return; // desktop: no-op, list stays visible
      const open = col.classList.toggle('is-open');
      head.setAttribute('aria-expanded', String(open));
    });
  });

  const sync = () => {
    cols.forEach((col) => {
      const head = $('.footer__acc-head', col);
      col.classList.remove('is-open'); // start collapsed on mobile
      // desktop: list is always visible via CSS → report expanded
      head.setAttribute('aria-expanded', String(!mq.matches));
    });
  };
  sync();
  mq.addEventListener('change', sync);
}

/* --------------------------------------------------------------------------
   Misc
   -------------------------------------------------------------------------- */
function initMisc() {
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
}

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */
function boot() {
  initPreloader();
  initHeader();
  initMobileMenu();
  initReveals();
  initCounters();
  initSwipers();
  initAccordion();
  initFooterAccordion();
  initFancybox();
  initForm();
  initScrollSpy();
  initMisc();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
