// ==========================================================================
// Bendex Roofing — main.js  (Linoxa-matched interactions)
// Header, mobile menu, GSAP reveals + image masks, odometer counters,
// Swiper sliders, Fancybox, quote form, mobile app bar.
// ==========================================================================

'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

/* 1. Header — solid on scroll ------------------------------------------- */
const header = $('[data-header]');
const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* 2. Mobile menu -------------------------------------------------------- */
const menu = $('#mobileMenu');
const toggle = $('#navToggle');
const closeBtn = $('#menuClose');

const openMenu = () => {
  if (!menu) return;
  menu.classList.add('is-open');
  menu.setAttribute('aria-hidden', 'false');
  toggle?.setAttribute('aria-expanded', 'true');
  document.body.classList.add('no-scroll');
};
const closeMenu = () => {
  if (!menu) return;
  menu.classList.remove('is-open');
  menu.setAttribute('aria-hidden', 'true');
  toggle?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('no-scroll');
};
toggle?.addEventListener('click', () => (menu?.classList.contains('is-open') ? closeMenu() : openMenu()));
closeBtn?.addEventListener('click', closeMenu);
$$('.mobile-menu__link, .mobile-menu__actions a').forEach((a) => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => e.key === 'Escape' && closeMenu());

/* 3. GSAP reveals + image masks ----------------------------------------- */
function initReveals() {
  // Hero content animates on load (not on scroll); everything else on scroll.
  const heroItems = $$('.hero [data-reveal]');
  const items = $$('[data-reveal]').filter((el) => !el.closest('.hero'));
  const imgs = $$('[data-reveal-img]');

  if (reduceMotion || typeof gsap === 'undefined') {
    [...heroItems, ...items, ...imgs].forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.clipPath = 'none';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Hero load intro — staggered rise/fade, plays immediately on first paint.
  if (heroItems.length) {
    gsap.to(heroItems, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.1,
    });
  }

  items.forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
    });
  });

  imgs.forEach((el) => {
    gsap.to(el, {
      opacity: 1, scale: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
    });
  });

  // stagger rows within lists
  ['.services__list', '.overview__list', '.projects__grid', '.showcase__carousel .swiper-wrapper'].forEach((sel) => {
    const grid = $(sel);
    if (!grid) return;
    const kids = $$('[data-reveal]', grid);
    if (kids.length < 2) return;
    ScrollTrigger.create({
      trigger: grid, start: 'top 84%', once: true,
      onEnter: () => gsap.to(kids, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.08 }),
    });
  });
}

/* 3b. Hero ghost — letter-by-letter load reveal ------------------------- */
function initHeroGhost() {
  const ghost = $('[data-hero-ghost]');
  if (!ghost) return;

  // Split text into per-letter spans.
  const text = ghost.textContent;
  ghost.textContent = '';
  const letters = [...text].map((ch) => {
    const s = document.createElement('span');
    s.className = 'hero__ghost-letter';
    s.textContent = ch;
    ghost.appendChild(s);
    return s;
  });

  if (reduceMotion || typeof gsap === 'undefined') return; // shown as-is

  gsap.set(letters, { opacity: 0, yPercent: 55 });
  gsap.to(letters, {
    opacity: 1, yPercent: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12, delay: 0.15,
  });
}

/* 3c. Scroll-driven letter fill (Linoxa about heading) ------------------ */
function initScrollFill() {
  const els = $$('[data-scroll-fill]');
  if (!els.length) return;

  // Recursively rebuild: split text into per-letter spans while preserving
  // line-wrapper spans, <br> breaks and inline elements (e.g. <strong>).
  const build = (source, target, letters) => {
    [...source.childNodes].forEach((node) => {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach((token) => {
          if (token === '') return;
          if (/^\s+$/.test(token)) { target.appendChild(document.createTextNode(token)); return; }
          const w = document.createElement('span');
          w.className = 'fill-word';
          [...token].forEach((ch) => {
            const l = document.createElement('span');
            l.className = 'fill-letter';
            l.textContent = ch;
            w.appendChild(l);
            letters.push(l);
          });
          target.appendChild(w);
        });
      } else if (node.nodeName === 'BR') {
        target.appendChild(document.createElement('br'));
      } else {
        const clone = node.cloneNode(false);
        build(node, clone, letters);
        target.appendChild(clone);
      }
    });
  };

  els.forEach((el) => {
    const source = el.cloneNode(true);
    el.innerHTML = '';
    const letters = [];
    build(source, el, letters);

    if (reduceMotion || typeof gsap === 'undefined') return; // full colour, no scrub

    gsap.registerPlugin(ScrollTrigger);
    gsap.set(letters, { opacity: 0.28 });
    gsap.to(letters, {
      opacity: 1,
      ease: 'none',
      stagger: 1,
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
        end: 'bottom 58%',
        scrub: 0.6,
      },
    });
  });
}

/* 3d. Showcase — cards scale up & spread apart on scroll (Linoxa) -------- */
function initShowcase() {
  const row = $('[data-showcase]');
  if (!row || reduceMotion || typeof gsap === 'undefined') return;

  const col2 = $('[data-showcase-col="2"]', row);
  const col3 = $('[data-showcase-col="3"]', row);
  if (!col2 || !col3) return;

  gsap.registerPlugin(ScrollTrigger);

  // Only on desktop, where the cards sit in the overlapping row.
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: row, start: 'top 85%', end: 'top 28%', scrub: 0.6 },
    });
    // start compressed & pulled left (overlapping), settle out spread & full size
    tl.from(col2, { xPercent: -46, scale: 0.82, ease: 'none' }, 0)
      .from(col3, { xPercent: -92, scale: 0.82, ease: 'none' }, 0);
  });
}

/* 3e. Parallax layers (Linoxa overview) --------------------------------- */
function initParallax() {
  const els = $$('[data-parallax]');
  if (!els.length || reduceMotion || typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);
  els.forEach((el) => {
    const amp = parseFloat(el.dataset.parallax) || 8; // yPercent amplitude
    const scope = el.closest('.overview') || el.closest('section') || el;
    gsap.fromTo(el, { yPercent: amp }, {
      yPercent: -amp, ease: 'none',
      scrollTrigger: { trigger: scope, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* 3f. Services v2 — hover-swap tabs <-> left preview -------------------- */
function initServiceTabs() {
  const tabs = $$('.service2__tab');
  const panels = $$('.service2__panel');
  if (!tabs.length || !panels.length) return;

  const activate = (id) => {
    tabs.forEach((t) => t.classList.toggle('is-active', t.dataset.tab === id));
    panels.forEach((p) => p.classList.toggle('is-active', p.dataset.panel === id));
  };

  tabs.forEach((t) => {
    t.addEventListener('mouseenter', () => activate(t.dataset.tab));
    t.addEventListener('focus', () => activate(t.dataset.tab));
    t.addEventListener('click', () => activate(t.dataset.tab)); // touch / keyboard
  });
}

/* 4. Odometer counters -------------------------------------------------- */
function buildCounter(el) {
  const raw = el.dataset.count || '0';
  const suffix = el.dataset.suffix || '';
  const formatted = Number(raw).toLocaleString('en-US');

  el.textContent = '';
  el.setAttribute('aria-label', formatted + suffix);

  [...formatted].forEach((ch) => {
    if (/\d/.test(ch)) {
      const digit = document.createElement('span');
      digit.className = 'counter__digit';
      const roll = document.createElement('span');
      roll.className = 'counter__roll';
      for (let i = 0; i <= 9; i++) {
        const s = document.createElement('span');
        s.textContent = i;
        roll.appendChild(s);
      }
      digit.appendChild(roll);
      digit.dataset.target = ch;
      el.appendChild(digit);
    } else {
      const s = document.createElement('span');
      s.textContent = ch;
      el.appendChild(s);
    }
  });

  if (suffix) {
    const s = document.createElement('span');
    s.className = 'counter__suffix';
    s.textContent = suffix;
    el.appendChild(s);
  }
}

function playCounter(el) {
  $$('.counter__digit', el).forEach((d, i) => {
    const roll = d.querySelector('.counter__roll');
    const target = Number(d.dataset.target || '0');
    setTimeout(() => { roll.style.transform = `translateY(-${target}em)`; }, i * 90);
  });
}

function initCounters() {
  const els = $$('.counter[data-count]');
  if (!els.length) return;

  if (reduceMotion) return; // keep static fallback text already in HTML

  els.forEach(buildCounter);

  const trigger = (el) => playCounter(el);
  if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
    els.forEach((el) => ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => trigger(el) }));
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => { if (e.isIntersecting) { trigger(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.4 });
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach(trigger);
  }
}

/* 5. Swiper sliders ----------------------------------------------------- */
function initSwipers() {
  if (typeof Swiper === 'undefined') return;

  if ($('.hero-slider')) {
    new Swiper('.hero-slider', {
      slidesPerView: 1, speed: 500, loop: true, grabCursor: true,
      autoplay: reduceMotion ? false : { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: '.hero-slider .swiper-pagination', clickable: true },
    });
  }

  if ($('.about__avatars')) {
    new Swiper('.about__avatars', {
      slidesPerView: 'auto', spaceBetween: 0, loop: true, speed: 600, grabCursor: true,
      autoplay: reduceMotion ? false : { delay: 1600, disableOnInteraction: false, pauseOnMouseEnter: true },
    });
  }

  if ($('.feature-slider')) {
    const featureSlider = new Swiper('.feature-slider', {
      effect: 'fade', fadeEffect: { crossFade: true },
      loop: true, speed: 1200, allowTouchMove: true,
      autoplay: reduceMotion ? false : { delay: 4200, disableOnInteraction: false },
    });
    const sliderEl = $('.feature-slider');
    const toggle = $('#featurePlay');
    if (toggle && sliderEl) {
      if (reduceMotion) {
        sliderEl.classList.add('is-paused');
        toggle.classList.remove('is-playing');
        toggle.setAttribute('aria-label', 'Play slideshow');
      }
      toggle.addEventListener('click', () => {
        const paused = sliderEl.classList.toggle('is-paused');
        toggle.classList.toggle('is-playing', !paused);
        toggle.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
        if (featureSlider.autoplay) {
          paused ? featureSlider.autoplay.stop() : featureSlider.autoplay.start();
        }
      });
    }
  }

  if ($('.showcase__carousel')) {
    new Swiper('.showcase__carousel', {
      slidesPerView: 1.1, spaceBetween: 20, grabCursor: true, speed: 550,
      navigation: { prevEl: '#wPrev', nextEl: '#wNext' },
      breakpoints: { 560: { slidesPerView: 2, spaceBetween: 24 }, 1024: { slidesPerView: 3, spaceBetween: 32 } },
    });
  }

  // Testimonials are now a static 4-card grid (no slider).
}

/* 6. Fancybox ----------------------------------------------------------- */
function initFancybox() {
  if (typeof Fancybox === 'undefined') return;
  Fancybox.bind('[data-fancybox="work"]', {});
  Fancybox.bind('[data-fancybox="recent"]', {});
  Fancybox.bind('[data-fancybox="gallery"]', {});
}

/* 6b. Masonry gallery (desandro) --------------------------------------- */
function initMasonry() {
  const grid = $('[data-masonry]');
  if (!grid || typeof Masonry === 'undefined') return;

  let msnry = null;
  // Masonry only from tablet up; on mobile the gallery is a scroll-snap slider (CSS).
  const mq = window.matchMedia('(min-width: 768px)');

  const build = () => {
    if (mq.matches) {
      if (!msnry) {
        msnry = new Masonry(grid, {
          itemSelector: '.gallery__item',
          columnWidth: '.gallery__sizer',
          gutter: '.gallery__gutter',
          percentPosition: true,
          transitionDuration: reduceMotion ? 0 : '0.3s',
        });
        if (typeof imagesLoaded !== 'undefined') {
          imagesLoaded(grid).on('progress', () => msnry && msnry.layout());
        } else {
          window.addEventListener('load', () => msnry && msnry.layout());
        }
      } else {
        msnry.layout();
      }
    } else if (msnry) {
      // drop Masonry so the CSS mobile slider takes over
      msnry.destroy();
      msnry = null;
    }
  };

  build();
  mq.addEventListener('change', build);
}

/* 7. Quote forms (demo validation) — page + modal --------------------- */
function initForm() {
  const forms = $$('[data-quote-form]');
  if (!forms.length) return;
  const setError = (field, on) => field && field.classList.toggle('field--error', on);

  forms.forEach((form) => {
    const status = $('.form__status', form);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      $$('[required]', form).forEach((input) => {
        const empty = !input.value.trim();
        setError(input.closest('.field'), empty);
        if (empty) valid = false;
      });

      const phone = $('input[type="tel"]', form);
      if (phone && phone.value.trim()) {
        const ok = phone.value.replace(/\D/g, '').length >= 8;
        setError(phone.closest('.field'), !ok);
        if (!ok) valid = false;
      }

      if (!valid) { $('.field--error .input, .field--error .select', form)?.focus(); return; }

      status?.classList.add('is-visible');
      form.reset();
      status?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      setTimeout(() => status?.classList.remove('is-visible'), 6000);
    });

    $$('.input, .select, .textarea', form).forEach((input) =>
      input.addEventListener('input', () => input.closest('.field')?.classList.remove('field--error'))
    );
  });
}

/* 7c. Custom select (premium dropdown) --------------------------------- */
function initCustomSelects() {
  $$('select.select').forEach((native) => {
    if (native.dataset.enhanced) return;
    native.dataset.enhanced = '1';

    const options = [...native.options];
    const placeholder = options.find((o) => o.disabled) || options[0];
    const choices = options.filter((o) => !o.disabled);

    const wrap = document.createElement('div');
    wrap.className = 'cselect';
    native.parentNode.insertBefore(wrap, native);
    native.classList.add('cselect__native');
    native.setAttribute('tabindex', '-1');
    wrap.appendChild(native);

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'cselect__trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML =
      `<span class="cselect__value cselect__value--placeholder">${placeholder ? placeholder.textContent : 'Select'}</span>` +
      '<svg class="cselect__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
    const valueSpan = trigger.querySelector('.cselect__value');

    const ul = document.createElement('ul');
    ul.className = 'cselect__list';
    ul.setAttribute('role', 'listbox');

    const close = () => { wrap.classList.remove('is-open'); trigger.setAttribute('aria-expanded', 'false'); };

    choices.forEach((opt) => {
      const li = document.createElement('li');
      li.className = 'cselect__option';
      li.setAttribute('role', 'option');
      li.innerHTML =
        `<span>${opt.textContent}</span>` +
        '<svg class="cselect__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
      li.addEventListener('click', () => {
        native.value = opt.value;
        valueSpan.textContent = opt.textContent;
        valueSpan.classList.remove('cselect__value--placeholder');
        ul.querySelectorAll('.cselect__option').forEach((o) => o.classList.remove('is-selected'));
        li.classList.add('is-selected');
        native.dispatchEvent(new Event('change', { bubbles: true }));
        native.dispatchEvent(new Event('input', { bubbles: true }));
        close();
      });
      ul.appendChild(li);
    });

    wrap.appendChild(trigger);
    wrap.appendChild(ul);

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !wrap.classList.contains('is-open');
      // close any other open custom selects
      $$('.cselect.is-open').forEach((w) => { if (w !== wrap) w.classList.remove('is-open'); });
      wrap.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    // keep the custom UI in sync when the form is reset
    native.form?.addEventListener('reset', () => setTimeout(() => {
      valueSpan.textContent = placeholder ? placeholder.textContent : 'Select';
      valueSpan.classList.add('cselect__value--placeholder');
      ul.querySelectorAll('.cselect__option').forEach((o) => o.classList.remove('is-selected'));
    }, 0));
  });
}

/* 7b. Quote modal ------------------------------------------------------- */
function initQuoteModal() {
  const modal = $('#quoteModal');
  if (!modal) return;
  const dialog = $('.modal__dialog', modal);
  let lastFocused = null;

  const open = (e) => {
    if (e) e.preventDefault();
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    setTimeout(() => $('input, select, textarea, button', dialog)?.focus(), 80);
  };
  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    lastFocused?.focus?.();
  };

  $$('[data-quote-open]').forEach((o) => o.addEventListener('click', open));
  $$('[data-quote-close]', modal).forEach((c) => c.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
}

/* 7d. Header nav scroll-spy (section-wise active menu) ------------------ */
function initNavSpy() {
  const links = $$('.header__link[href^="#"]');
  if (!links.length || !('IntersectionObserver' in window)) return;

  const map = links
    .map((l) => { const id = l.getAttribute('href'); const el = id && id.length > 1 ? $(id) : null; return el ? { l, el } : null; })
    .filter(Boolean);
  if (!map.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const m = map.find((x) => x.el === entry.target);
        if (m) { links.forEach((l) => l.classList.remove('is-active')); m.l.classList.add('is-active'); }
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  map.forEach((m) => io.observe(m.el));
}

/* 8. Mobile app bar active tab ----------------------------------------- */
function initAppbar() {
  const tabs = $$('[data-appbar]');
  if (!tabs.length || !('IntersectionObserver' in window)) return;

  const map = tabs
    .map((t) => { const id = t.getAttribute('href'); const el = id && id.startsWith('#') ? $(id) : null; return el ? { t, el } : null; })
    .filter(Boolean);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const m = map.find((x) => x.el === entry.target);
        if (m) { tabs.forEach((t) => t.classList.remove('is-active')); m.t.classList.add('is-active'); }
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  map.forEach((m) => io.observe(m.el));
}

/* 9. Misc --------------------------------------------------------------- */
function initMisc() {
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
}

/* Boot ------------------------------------------------------------------ */
function boot() {
  initReveals();
  initHeroGhost();
  initScrollFill();
  initShowcase();
  initParallax();
  initServiceTabs();
  initCounters();
  initSwipers();
  initFancybox();
  initMasonry();
  initForm();
  initCustomSelects();
  initQuoteModal();
  initNavSpy();
  initAppbar();
  initMisc();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
