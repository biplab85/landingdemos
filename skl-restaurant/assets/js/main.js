/*!
 * Sklentr — Restaurant Landing Page
 * Author : Biplab Paul
 * Email  : biplab.cse.85@gmail.com
 * Phone  : 01735927356
 *
 * Vendors (CDN): GSAP + ScrollTrigger, Swiper 11, Fancybox 5.
 * Every module degrades gracefully if a vendor fails to load.
 */
(() => {
  'use strict';

  // ------------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------------
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const mqDesktop = window.matchMedia('(min-width: 992px)');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined';
  const hasST = hasGsap && typeof window.ScrollTrigger !== 'undefined';
  const animate = hasGsap && !reduced;

  if (hasST) gsap.registerPlugin(ScrollTrigger);

  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) { /* storage unavailable — ignore */ }
    },
  };

  const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const money = (n) => `$${n.toFixed(2)}`;

  // ------------------------------------------------------------------------
  // Toast
  // ------------------------------------------------------------------------
  const Toast = (() => {
    const el = $('.js-toast');
    const text = $('.js-toast-text');
    let timer;
    return {
      show(message) {
        if (!el) return;
        text.textContent = message;
        el.classList.add('is-visible');
        clearTimeout(timer);
        timer = setTimeout(() => el.classList.remove('is-visible'), 2600);
      },
      hide() {
        if (el) el.classList.remove('is-visible');
      },
    };
  })();

  // ------------------------------------------------------------------------
  // Split headings into masked words
  // ------------------------------------------------------------------------
  function splitWords(root) {
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(' '));
              return;
            }
            const outer = document.createElement('span');
            const inner = document.createElement('span');
            outer.className = 'u-word';
            inner.textContent = part;
            outer.appendChild(inner);
            frag.appendChild(outer);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
          walk(child);
        }
      });
    };
    walk(root);
  }

  // ------------------------------------------------------------------------
  // Opening hours, greeting, open/closed status
  // ------------------------------------------------------------------------
  function initClock() {
    // [open, close] in 24h, index = day of week (0 = Sunday)
    const hours = [[12, 21], [12, 22], [12, 22], [12, 22], [12, 22], [12, 23], [12, 23]];
    const now = new Date();
    const h = now.getHours() + now.getMinutes() / 60;
    const [open, close] = hours[now.getDay()];
    const fmt = (x) => `${x > 12 ? x - 12 : x}:00 ${x >= 12 ? 'PM' : 'AM'}`;

    const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    $$('.js-greeting').forEach((el) => (el.textContent = greeting));
    $$('.js-today-hours').forEach((el) => (el.textContent = `${fmt(open).replace(' PM', '')} – ${fmt(close)}`));

    const isOpen = h >= open && h < close;
    $$('.js-open-status').forEach((el) => {
      el.classList.toggle('is-closed', !isOpen);
      el.textContent = isOpen ? `Open now · until ${fmt(close)}` : `Closed · opens ${fmt(open)}`;
    });

    $$('.js-year').forEach((el) => (el.textContent = now.getFullYear()));
  }

  // ------------------------------------------------------------------------
  // Preloader
  // ------------------------------------------------------------------------
  function initPreloader(onDone) {
    const el = $('.js-preloader');
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      document.body.classList.remove('is-loading');
      document.body.style.overflow = '';
      if (!el) return onDone();

      if (animate) {
        gsap.to(el, { yPercent: -100, duration: 0.9, ease: 'power4.inOut', onComplete: () => el.remove() });
        gsap.delayedCall(0.35, onDone);
      } else {
        el.remove();
        onDone();
      }
    };

    if (!el || !animate) return finish();

    document.body.style.overflow = 'hidden';
    const count = $('.js-preloader-count');
    const bar = $('.js-preloader-bar');
    const progress = { v: 0 };

    gsap.to(progress, {
      v: 100,
      duration: 1.3,
      ease: 'power2.inOut',
      onUpdate() {
        count.textContent = Math.round(progress.v);
        bar.style.width = `${progress.v}%`;
      },
      onComplete() {
        if (document.readyState === 'complete') return finish();
        window.addEventListener('load', finish, { once: true });
        setTimeout(finish, 2000);
      },
    });
  }

  // ------------------------------------------------------------------------
  // Hero intro + scroll animations
  // ------------------------------------------------------------------------
  function heroIntro() {
    if (!animate) return;
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.from('.c-hero__title .u-word > span', { yPercent: 110, duration: 1.1, stagger: 0.06 })
      .from('.c-hero__greeting, .js-hero-in', { y: 30, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.15)
      .from('.c-hero__frame', {
        clipPath: 'inset(100% 0% 0% 0%)',
        duration: 1.4,
        ease: 'power3.inOut',
        clearProps: 'clipPath',
      }, 0)
      .from('.c-hero__card', { y: 40, opacity: 0, duration: 0.9 }, 0.8)
      .from('.c-seal', { scale: 0, rotate: -120, duration: 1.1 }, 0.7)
      .from('.c-hero__pager', { opacity: 0, duration: 0.6 }, 1)
      .from('.c-hero__info li', { y: 24, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.7);
  }

  function initScrollAnimations() {
    if (!animate || !hasST) return;

    // Split headings outside the hero
    $$('.js-split').forEach((heading) => {
      if (heading.closest('.c-hero')) return;
      gsap.from($$('.u-word > span', heading), {
        yPercent: 110,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.05,
        scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
      });
    });

    // Fade-up reveals, batched for natural stagger
    const ups = $$('[data-reveal="up"]');
    gsap.set(ups, { y: 40, opacity: 0 });
    ScrollTrigger.batch(ups, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.08,
          overwrite: true,
          clearProps: 'transform',
        }),
    });

    // Clip reveals for feature imagery
    $$('[data-reveal="clip"]').forEach((el) => {
      gsap.from(el, {
        clipPath: 'inset(100% 0% 0% 0%)',
        duration: 1.5,
        ease: 'power4.inOut',
        clearProps: 'clipPath',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });

    // Parallax images
    $$('[data-parallax]').forEach((img) => {
      const amount = parseFloat(img.dataset.parallax) || 0.1;
      gsap.fromTo(img,
        { yPercent: -amount * 50 },
        {
          yPercent: amount * 50,
          ease: 'none',
          scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        });
    });

    // Footer watermark rises into place
    const watermark = $('.js-watermark');
    if (watermark) {
      gsap.from(watermark, {
        yPercent: 45,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: watermark, start: 'top bottom', end: 'bottom bottom', scrub: true },
      });
    }

    // Counters
    $$('[data-count]').forEach((el) => {
      const target = parseInt(el.dataset.count, 10);
      const obj = { v: 0 };
      el.textContent = '0';
      gsap.to(obj, {
        v: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => (el.textContent = Math.round(obj.v)),
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      });
    });
  }

  // ------------------------------------------------------------------------
  // Header + active section tracking (desktop nav and app bar)
  // ------------------------------------------------------------------------
  function initHeader() {
    const header = $('.js-header');
    if (!header) return;
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 40);
      const sheetOpen = document.body.classList.contains('is-locked');
      header.classList.toggle('is-hidden', mqDesktop.matches && !sheetOpen && y > lastY && y > 500);
      lastY = y;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();

    // Active links
    const navLinks = $$('.c-nav__link');
    const appItems = $$('[data-appbar]');
    const sections = $$('main section[id], footer[id]');

    const setActive = (id) => {
      navLinks.forEach((a) => {
        const on = a.getAttribute('href') === `#${id}`;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
      const appId = id === 'menu' || id === 'kitchen' ? 'menu' : 'top';
      appItems.forEach((a) => a.classList.toggle('is-active', a.dataset.appbar === appId));
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach((s) => io.observe(s));
  }

  // ------------------------------------------------------------------------
  // Sliders
  // ------------------------------------------------------------------------
  function initSliders() {
    if (typeof window.Swiper === 'undefined') return;

    const heroEl = $('.js-hero-swiper');
    if (heroEl) {
      const progress = $('.js-hero-progress');
      const current = $('.js-hero-current');
      new Swiper(heroEl, {
        effect: 'fade',
        fadeEffect: { crossFade: true },
        loop: true,
        speed: 1200,
        autoplay: reduced ? false : { delay: 5000, disableOnInteraction: false },
        on: {
          autoplayTimeLeft(_s, _time, ratio) {
            if (progress) progress.style.width = `${(1 - ratio) * 100}%`;
          },
          slideChange(s) {
            if (current) current.textContent = String(s.realIndex + 1).padStart(2, '0');
          },
        },
      });
    }

    const reviewsEl = $('.js-reviews-swiper');
    if (reviewsEl) {
      new Swiper(reviewsEl, {
        slidesPerView: 1.08,
        spaceBetween: 14,
        grabCursor: true,
        speed: 700,
        navigation: { prevEl: '.js-reviews-prev', nextEl: '.js-reviews-next' },
        pagination: { el: '.js-reviews-progress', type: 'progressbar' },
        breakpoints: {
          768: { slidesPerView: 2, spaceBetween: 24 },
          1200: { slidesPerView: 3, spaceBetween: 24 },
        },
      });
    }

    const journalEl = $('.js-journal-swiper');
    if (journalEl) {
      new Swiper(journalEl, {
        slidesPerView: 1.12,
        spaceBetween: 16,
        grabCursor: true,
        breakpoints: {
          768: { slidesPerView: 2, spaceBetween: 24 },
          1200: { slidesPerView: 3, spaceBetween: 32, allowTouchMove: false },
        },
      });
    }
  }

  // ------------------------------------------------------------------------
  // Lightbox
  // ------------------------------------------------------------------------
  function initLightbox() {
    if (typeof window.Fancybox === 'undefined') return;
    Fancybox.bind('[data-fancybox]', {
      Hash: false,
      Thumbs: { type: 'classic' },
    });
  }

  // ------------------------------------------------------------------------
  // Category list → hover preview + jump to filtered menu
  // ------------------------------------------------------------------------
  function initCategories(setFilter) {
    const links = $$('[data-filter-link]');
    links.forEach((link) => {
      link.addEventListener('click', () => setFilter(link.dataset.filterLink));
    });

    // Cursor-following image preview (desktop, real pointer only) ----------
    const preview = $('.js-catpreview');
    const img = $('.js-catpreview-img');
    if (!preview || !animate || !canHover) return;

    // Warm the cache so the first hover never shows an empty frame.
    links.forEach((link) => { new Image().src = link.dataset.preview; });

    const GAP = 32;
    const EDGE = 16;
    const xTo = gsap.quickTo(preview, 'x', { duration: 0.55, ease: 'power3' });
    const yTo = gsap.quickTo(preview, 'y', { duration: 0.55, ease: 'power3' });
    let pointer = { x: 0, y: 0 };
    let active = null;

    gsap.set(preview, { scale: 0.8, opacity: 0 });

    // Keep the card fully on screen: flip to the left of the cursor near the
    // right edge and clamp vertically.
    const target = () => {
      const w = preview.offsetWidth;
      const h = preview.offsetHeight;
      let x = pointer.x + GAP;
      if (x + w > window.innerWidth - EDGE) x = pointer.x - GAP - w;
      const y = Math.min(Math.max(pointer.y - h / 2, EDGE), window.innerHeight - h - EDGE);
      return { x, y };
    };

    const show = (link) => {
      if (!mqDesktop.matches) return;
      const fromHidden = !active;
      active = link;
      if (img.getAttribute('src') !== link.dataset.preview) img.src = link.dataset.preview;
      const pos = target();
      // Appear at the cursor instead of flying in from the previous spot.
      if (fromHidden) gsap.set(preview, pos);
      xTo(pos.x);
      yTo(pos.y);
      gsap.to(preview, { opacity: 1, scale: 1, rotate: -3, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
    };

    const hide = () => {
      active = null;
      gsap.to(preview, { opacity: 0, scale: 0.8, rotate: 0, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
    };

    window.addEventListener('mousemove', (e) => {
      pointer = { x: e.clientX, y: e.clientY };
      if (!active) return;
      const pos = target();
      xTo(pos.x);
      yTo(pos.y);
    }, { passive: true });

    links.forEach((link) => {
      link.addEventListener('mouseenter', () => show(link));
      link.addEventListener('mouseleave', hide);
    });

    // Wheel-scrolling moves rows under a still cursor without firing
    // mouseenter/leave, so re-check what is under the pointer.
    window.addEventListener('scroll', () => {
      if (!pointer.x && !pointer.y) return;
      const under = document.elementFromPoint(pointer.x, pointer.y);
      const link = under && under.closest('[data-filter-link]');
      if (link && link !== active) show(link);
      else if (!link && active) hide();
    }, { passive: true });

    window.addEventListener('blur', () => active && hide());
  }

  // ------------------------------------------------------------------------
  // Menu filter
  // ------------------------------------------------------------------------
  function initMenu() {
    const tabs = $$('.js-tabs [data-filter]');
    const tabsEl = $('.js-tabs');
    const dishes = $$('.c-dish');
    const empty = $('.js-menu-empty');

    // Phones show the price next to the add button.
    dishes.forEach((dish) => {
      const price = $('.c-dish__price', dish);
      const foot = $('.c-dish__foot', dish);
      if (!price || !foot) return;
      const mobile = document.createElement('span');
      mobile.className = 'c-dish__price--mobile';
      mobile.textContent = price.textContent;
      foot.prepend(mobile);
    });

    const setFilter = (filter) => {
      tabs.forEach((t) => {
        const active = t.dataset.filter === filter;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active);
        if (active && tabsEl && tabsEl.scrollWidth > tabsEl.clientWidth) {
          tabsEl.scrollTo({ left: t.offsetLeft - 24, behavior: 'smooth' });
        }
      });

      const visible = dishes.filter((d) => filter === 'all' || d.dataset.cat === filter);
      dishes.forEach((d) => d.classList.toggle('is-hidden', !visible.includes(d)));
      if (empty) empty.hidden = visible.length > 0;

      if (animate) {
        gsap.fromTo(visible,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out', clearProps: 'all' });
      }
      if (hasST) ScrollTrigger.refresh();
    };

    tabs.forEach((t) => t.addEventListener('click', () => setFilter(t.dataset.filter)));
    return setFilter;
  }

  // ------------------------------------------------------------------------
  // Cart
  // ------------------------------------------------------------------------
  function initCart() {
    const KEY = 'sklentr-cart';
    let items = store.get(KEY, []);
    if (!Array.isArray(items)) items = [];

    const list = $('.js-cart-list');
    const empty = $('.js-cart-empty');
    const foot = $('.js-cart-foot');
    const total = $('.js-cart-total');
    const badges = $$('.js-cart-count');

    const render = (bump = false) => {
      const count = items.reduce((n, i) => n + i.qty, 0);
      const sum = items.reduce((n, i) => n + i.qty * i.price, 0);

      badges.forEach((b) => {
        b.textContent = count;
        b.classList.toggle('is-visible', count > 0);
        if (bump) {
          b.classList.remove('is-bump');
          void b.offsetWidth;
          b.classList.add('is-bump');
        }
      });

      if (!list) return;
      list.innerHTML = items.map((i) => `
        <li class="c-cart__item" data-id="${escapeHtml(i.id)}">
          <img src="${escapeHtml(i.img)}" alt="" width="60" height="60">
          <div>
            <span class="c-cart__name">${escapeHtml(i.name)}</span>
            <span class="c-cart__price">${money(i.price * i.qty)}</span>
          </div>
          <div class="c-cart__stepper">
            <button type="button" data-step="-1" aria-label="Remove one ${escapeHtml(i.name)}"><svg class="c-icon"><use href="#i-minus"/></svg></button>
            <span>${i.qty}</span>
            <button type="button" data-step="1" aria-label="Add one ${escapeHtml(i.name)}"><svg class="c-icon"><use href="#i-plus"/></svg></button>
          </div>
        </li>`).join('');

      empty.hidden = items.length > 0;
      foot.hidden = items.length === 0;
      total.textContent = money(sum);
    };

    const save = () => store.set(KEY, items);

    document.addEventListener('click', (e) => {
      const add = e.target.closest('.js-add');
      if (add) {
        const { id, name, price, img } = add.dataset;
        const found = items.find((i) => i.id === id);
        if (found) found.qty += 1;
        else items.push({ id, name, img, price: parseFloat(price), qty: 1 });
        save();
        render(true);
        add.classList.remove('is-added');
        void add.offsetWidth;
        add.classList.add('is-added');
        Toast.show(`${name} added to your order`);
        return;
      }

      const step = e.target.closest('[data-step]');
      if (step) {
        const id = step.closest('.c-cart__item').dataset.id;
        const item = items.find((i) => i.id === id);
        if (!item) return;
        item.qty += parseInt(step.dataset.step, 10);
        if (item.qty <= 0) items = items.filter((i) => i !== item);
        save();
        render();
      }
    });

    const checkout = $('.js-checkout');
    if (checkout) {
      checkout.addEventListener('click', () => Toast.show('Online checkout is coming soon — call (415) 555-0142'));
    }

    render();
  }

  // ------------------------------------------------------------------------
  // Sheets (bottom sheet / drawer)
  // ------------------------------------------------------------------------
  function initSheets() {
    const sheets = {};
    $$('[data-sheet]').forEach((s) => (sheets[s.dataset.sheet] = s));
    let current = null;
    let lastFocus = null;

    const focusables = (el) =>
      $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', el)
        .filter((n) => n.offsetParent !== null);

    const open = (name) => {
      const sheet = sheets[name];
      if (!sheet) return;
      if (current) close(false);
      lastFocus = document.activeElement;
      current = sheet;
      Toast.hide();
      sheet.classList.add('is-open');
      sheet.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      const panel = $('.c-sheet__panel', sheet);
      panel.style.transform = '';
      setTimeout(() => panel.focus({ preventScroll: true }), 60);
    };

    const close = (restoreFocus = true) => {
      if (!current) return;
      current.classList.remove('is-open');
      current.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      current = null;
      if (restoreFocus && lastFocus) lastFocus.focus({ preventScroll: true });
    };

    document.addEventListener('click', (e) => {
      const opener = e.target.closest('[data-sheet-open]');
      if (opener) {
        e.preventDefault();
        open(opener.dataset.sheetOpen);
        return;
      }
      if (e.target.closest('[data-sheet-close]')) close(false);
    });

    document.addEventListener('keydown', (e) => {
      if (!current) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        const nodes = focusables(current);
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // Swipe-down to dismiss (phones)
    Object.values(sheets).forEach((sheet) => {
      const panel = $('.c-sheet__panel', sheet);
      const grip = [$('.c-sheet__handle', sheet), $('.c-sheet__head', sheet)];
      let startY = 0;
      let dy = 0;
      let dragging = false;

      grip.forEach((g) => {
        if (!g) return;
        g.addEventListener('touchstart', (e) => {
          if (mqDesktop.matches) return;
          dragging = true;
          startY = e.touches[0].clientY;
          dy = 0;
          panel.style.transition = 'none';
        }, { passive: true });
      });

      panel.addEventListener('touchmove', (e) => {
        if (!dragging) return;
        dy = Math.max(0, e.touches[0].clientY - startY);
        panel.style.transform = `translateY(${dy}px)`;
      }, { passive: true });

      panel.addEventListener('touchend', () => {
        if (!dragging) return;
        dragging = false;
        panel.style.transition = '';
        panel.style.transform = '';
        if (dy > 110) close(false);
      });
    });

    return { open, close };
  }

  // ------------------------------------------------------------------------
  // Forms
  // ------------------------------------------------------------------------
  function initForms(sheetsApi) {
    const today = new Date();
    const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v);

    const isInvalid = (field) => {
      const value = field.value.trim();
      if (field.required && !value) return true;
      if (field.type === 'email' && value && !isEmail(value)) return true;
      return false;
    };

    $$('.js-validate-form').forEach((form) => {
      const date = $('.js-date', form);
      if (date) {
        date.min = iso;
        date.value = iso;
      }

      // Live booking summary ("Table for 2 · Fri, Nov 7 · 7:30 PM")
      const summary = $('.js-book-summary', form);
      const updateSummary = () => {
        if (!summary) return;
        const guests = ($('[name="guests"]:checked', form) || {}).value || '2';
        const time = ($('[name="time"]', form) || {}).value || 'Select a time';
        let day = 'Select a date';
        if (date && date.value) {
          day = date.value === iso
            ? 'Today'
            : new Date(`${date.value}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        }
        summary.textContent = `Table for ${guests} · ${day} · ${time}`;
      };
      form.addEventListener('change', updateSummary);
      updateSummary();

      form.addEventListener('input', (e) => e.target.classList.remove('is-invalid'));

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fields = $$('input, select, textarea', form).filter((f) => f.type !== 'radio');
        const invalid = fields.filter(isInvalid);
        fields.forEach((f) => f.classList.toggle('is-invalid', invalid.includes(f)));
        if (invalid.length) {
          invalid[0].focus();
          Toast.show(invalid.some((f) => f.type === 'email' && f.value.trim())
            ? 'Please enter a valid email address'
            : 'Please fill in the highlighted fields');
          return;
        }

        const success = $('.c-form__success', form);
        success.hidden = false;
        if (animate) gsap.from(success, { opacity: 0, scale: 0.96, duration: 0.5, ease: 'power3.out' });

        const closes = form.dataset.successClose;
        setTimeout(() => {
          form.reset();
          if (date) date.value = iso;
          updateSummary();
          success.hidden = true;
          if (closes) sheetsApi.close(false);
        }, closes ? 2800 : 6000);
      });
    });

    $$('.js-newsletter').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = $('input', form);
        if (!/^\S+@\S+\.\S+$/.test(input.value.trim())) {
          input.focus();
          Toast.show('Please enter a valid email address');
          return;
        }
        input.value = '';
        input.placeholder = "Thanks — you're on the list!";
        form.classList.add('is-done');
      });
    });
  }

  // ------------------------------------------------------------------------
  // Accordion
  // ------------------------------------------------------------------------
  function initAccordion() {
    $$('.js-accordion').forEach((acc) => {
      const items = $$('.c-accordion__item', acc);
      items.forEach((item) => {
        const trigger = $('.c-accordion__trigger', item);
        trigger.addEventListener('click', () => {
          const willOpen = !item.classList.contains('is-open');
          items.forEach((other) => {
            other.classList.remove('is-open');
            $('.c-accordion__trigger', other).setAttribute('aria-expanded', 'false');
          });
          if (willOpen) {
            item.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
          }
          if (hasST) setTimeout(() => ScrollTrigger.refresh(), 520);
        });
      });
    });
  }

  // ------------------------------------------------------------------------
  // Boot
  // ------------------------------------------------------------------------
  $$('.js-split').forEach(splitWords);
  initClock();
  initHeader();
  initSliders();
  initLightbox();
  const setFilter = initMenu();
  initCategories(setFilter);
  initCart();
  const sheetsApi = initSheets();
  initForms(sheetsApi);
  initAccordion();
  if (window.location.hash === '#book') sheetsApi.open('book');

  initPreloader(() => {
    heroIntro();
    initScrollAnimations();
  });
})();
