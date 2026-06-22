/* FiXiT Fencing — front-end JS */
(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- FAQ accordion ---------- */
  const faqItems = document.querySelectorAll('.ff-faq-item');
  if (faqItems.length) {

    // Set initial heights for items that are open on page load.
    // max-height: 'none' lets the panel grow with the viewport without us re-measuring.
    faqItems.forEach((item) => {
      if (item.classList.contains('is-open')) {
        const panel = item.querySelector('.ff-faq-item__a');
        if (panel) panel.style.maxHeight = 'none';
      }
    });

    faqItems.forEach((item) => {
      const btn   = item.querySelector('.ff-faq-item__q');
      const panel = item.querySelector('.ff-faq-item__a');
      if (!btn || !panel) return;

      // After an opening transition finishes, release the explicit pixel value
      // so the panel can resize naturally if its content reflows.
      panel.addEventListener('transitionend', (e) => {
        if (e.propertyName !== 'max-height') return;
        if (item.classList.contains('is-open')) {
          panel.style.maxHeight = 'none';
        }
      });

      btn.addEventListener('click', () => {
        const opening = !item.classList.contains('is-open');

        if (opening) {
          // OPEN: 0 → exact scrollHeight
          panel.style.maxHeight = '0px';
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          // Next frame, with .is-open class applied (so any state-based padding is in place),
          // set the target height to the measured content height.
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              panel.style.maxHeight = panel.scrollHeight + 'px';
            });
          });
        } else {
          // CLOSE: current scrollHeight → 0. First lock the current pixel height
          // (panel might be at 'none'), then transition to 0 next frame.
          panel.style.maxHeight = panel.scrollHeight + 'px';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.classList.remove('is-open');
              btn.setAttribute('aria-expanded', 'false');
              panel.style.maxHeight = '0px';
            });
          });
        }
      });
    });

    // Smooth anchor scrolling for the jump-nav (custom because we want offset for the header)
    document.querySelectorAll('.ff-faq-jump__item').forEach((link) => {
      link.addEventListener('click', (e) => {
        const hash = link.getAttribute('href');
        if (!hash || hash[0] !== '#') return;
        const target = document.querySelector(hash);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
        history.replaceState(null, '', hash);
      });
    });

    // If the URL has a hash that matches an item question, open it
    const openIfHashMatches = () => {
      if (!location.hash || location.hash.length < 2) return;
      const id = location.hash.slice(1);
      // Hash could match a section id — open its first item
      const section = document.getElementById(id);
      if (!section) return;
      const first = section.querySelector('.ff-faq-item');
      if (first && !first.classList.contains('is-open')) {
        first.classList.add('is-open');
        first.querySelector('.ff-faq-item__q')?.setAttribute('aria-expanded', 'true');
      }
    };
    openIfHashMatches();
    window.addEventListener('hashchange', openIfHashMatches);
  }

  /* ---------- Mobile drawer (site menu) ---------- */
  const burger  = document.querySelector('.ff-burger');
  const mdrawer = document.getElementById('ff-mobile-drawer');
  if (burger && mdrawer) {
    let lastFocus = null;
    let inertT    = null;

    const openMDrawer = () => {
      lastFocus = document.activeElement;
      clearTimeout(inertT);
      mdrawer.removeAttribute('inert');
      mdrawer.setAttribute('aria-hidden', 'false');
      mdrawer.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      document.documentElement.classList.add('ff-mobile-open');
      document.body.classList.add('ff-mobile-open');
      const closeBtn = mdrawer.querySelector('.ff-mobile-drawer__close');
      setTimeout(() => closeBtn && closeBtn.focus(), 320);
    };

    const closeMDrawer = () => {
      mdrawer.classList.remove('is-open');
      mdrawer.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      document.documentElement.classList.remove('ff-mobile-open');
      document.body.classList.remove('ff-mobile-open');
      clearTimeout(inertT);
      inertT = setTimeout(() => mdrawer.setAttribute('inert', ''), 340);
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    };

    burger.addEventListener('click', () => {
      mdrawer.classList.contains('is-open') ? closeMDrawer() : openMDrawer();
    });
    mdrawer.addEventListener('click', (e) => {
      if (e.target.closest('[data-ff-mdrawer-close]')) closeMDrawer();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mdrawer.classList.contains('is-open')) closeMDrawer();
    });
    // Close drawer when a non-parent link is clicked (parent toggles handled below)
    mdrawer.querySelectorAll('.ff-mobile-nav__list a').forEach((a) => {
      a.addEventListener('click', () => {
        const li = a.parentElement;
        // Don't close if this link is a parent of a submenu (we let the toggle button handle expand)
        if (li && li.classList.contains('menu-item-has-children')) {
          // top-level parent link points to /services/ archive — still let it navigate, just close
        }
        // close drawer after navigation
        setTimeout(closeMDrawer, 80);
      });
    });
    // Close on resize to desktop
    const mql = window.matchMedia('(min-width: 981px)');
    if (mql.addEventListener) {
      mql.addEventListener('change', (e) => { if (e.matches && mdrawer.classList.contains('is-open')) closeMDrawer(); });
    }

    // Accordion: inject a toggle button into every parent <li> with children
    mdrawer.querySelectorAll('.ff-mobile-nav__list .menu-item-has-children').forEach((li) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ff-mobile-nav__toggle';
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Expand');
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const open = li.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      li.appendChild(btn);
    });
  }

  /* ---------- Fancybox v5 — image lightbox on service galleries ---------- */
  if (window.Fancybox) {
    window.Fancybox.bind('[data-fancybox]', {
      Hash: false,                  // don't change the URL hash
      Toolbar: { display: { left: ['infobar'], middle: [], right: ['slideshow', 'fullscreen', 'thumbs', 'close'] } },
      Thumbs: { type: 'modern' },
      animated: true,
      showClass: 'f-fadeIn',
      hideClass: 'f-fadeOut',
      dragToClose: true,
      contentClick: 'iterateZoom',
    });
  }

  /* ---------- Quote drawer ---------- */
  const drawer = document.getElementById('ff-quote-drawer');
  if (drawer) {
    const form   = drawer.querySelector('#ff-quote-form');
    const status = drawer.querySelector('.ff-drawer__status');
    const submit = drawer.querySelector('.ff-drawer__submit');
    const firstField = drawer.querySelector('#ff-q-name');
    let   lastFocused = null;
    let   inertTimer  = null;

    const openDrawer = () => {
      lastFocused = document.activeElement;
      clearTimeout(inertTimer);
      drawer.removeAttribute('inert');
      drawer.setAttribute('aria-hidden', 'false');
      drawer.classList.add('is-open');
      document.documentElement.classList.add('ff-drawer-open');
      // Defer focus so the slide-in animation runs first
      setTimeout(() => firstField && firstField.focus(), 320);
    };

    const closeDrawer = () => {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('ff-drawer-open');
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
      // Wait for the slide-out (.4s) to finish before disabling interaction
      clearTimeout(inertTimer);
      inertTimer = setTimeout(() => drawer.setAttribute('inert', ''), 420);
    };

    // Open from any matching trigger:
    //   - data-ff-quote attribute (preferred)
    //   - href="#quote" or "#quote-form" (existing CTAs across the site)
    //   - any link/button whose text contains the word "quote"
    const triggerSel = [
      '[data-ff-quote]',
      'a[href$="#quote"]',
      'a[href$="#quote-form"]',
    ].join(',');

    const isQuoteText = (el) => /\bquote\b/i.test((el.textContent || '').trim());

    const isQuoteTrigger = (el) => {
      if (!el || drawer.contains(el)) return false;
      // Opt-outs: any element that explicitly says no, or sits inside one of these
      // non-CTA contexts (FAQ accordion buttons say "quote" in their question text
      // but they are NOT quote triggers).
      if (el.hasAttribute('data-no-quote')) return false;
      if (el.closest('[data-no-quote], .ff-faq-item__q')) return false;
      return el.matches(triggerSel) || isQuoteText(el);
    };

    document.addEventListener('click', (e) => {
      if (drawer.contains(e.target)) return;
      const t = e.target.closest('a, button');
      if (!t) return;
      if (isQuoteTrigger(t)) {
        e.preventDefault();
        openDrawer();
      }
    });

    // Close: backdrop + close button + ESC
    drawer.addEventListener('click', (e) => {
      if (e.target.closest('[data-ff-drawer-close]')) closeDrawer();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
    });

    /* ---- Auto-prepend a stroke-style paper-plane icon to every quote button ---- */
    const quoteIcon = '<svg class="ff-btn__quote-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9 22 2z"/></svg>';

    document.querySelectorAll('a, button').forEach((el) => {
      if (drawer.contains(el)) return;
      if (el.classList.contains('ff-has-quote-icon')) return;
      if (!isQuoteTrigger(el)) return;
      el.classList.add('ff-has-quote-icon');
      el.insertAdjacentHTML('afterbegin', quoteIcon);
    });

  }

  /* ---- AJAX submit handler — attaches to EVERY .ff-quote-form on the page
   *      (drawer form + Contact-page inline form + anything future). ---- */
  if (window.FF_QUOTE) {
    document.querySelectorAll('.ff-quote-form').forEach((form) => {
      const status = form.querySelector('.ff-quote-form__status');
      const submit = form.querySelector('.ff-quote-form__submit');

      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (status) { status.textContent = ''; status.dataset.kind = ''; }
        form.querySelectorAll('.ff-field').forEach((f) => f.classList.remove('has-error'));

        // Native validation
        if (!form.checkValidity()) {
          form.querySelectorAll('[required]').forEach((input) => {
            if (!input.checkValidity()) input.closest('.ff-field')?.classList.add('has-error');
          });
          if (status) { status.textContent = 'Please check the highlighted fields.'; status.dataset.kind = 'error'; }
          return;
        }

        const fd = new FormData(form);
        if (!window.FF_QUOTE || !window.FF_QUOTE.ajax_url) { if (submit) { submit.disabled = false; submit.classList.remove('is-loading'); } return; } // static export: display-only form, no backend submit
        fd.append('action', window.FF_QUOTE.action);
        fd.append('nonce',  window.FF_QUOTE.nonce);

        if (submit) { submit.disabled = true; submit.classList.add('is-loading'); }

        try {
          const res  = await fetch(window.FF_QUOTE.ajax_url, { method: 'POST', body: fd, credentials: 'same-origin' });
          const json = await res.json().catch(() => ({}));

          if (res.ok && json && json.success) {
            if (status) {
              status.textContent  = (json.data && json.data.message) || 'Thanks — your request is in.';
              status.dataset.kind = 'success';
            }
            form.reset();
          } else {
            const msg = (json && json.data && json.data.message) || 'Sorry — that didn\'t go through. Try again or call us.';
            if (status) { status.textContent = msg; status.dataset.kind = 'error'; }
            if (json && json.data && json.data.fields) {
              Object.keys(json.data.fields).forEach((name) => {
                const input = form.querySelector('[name="' + name + '"]');
                if (input) input.closest('.ff-field')?.classList.add('has-error');
              });
            }
          }
        } catch (err) {
          if (status) { status.textContent = 'Network error — please try again, or give us a call.'; status.dataset.kind = 'error'; }
        } finally {
          if (submit) { submit.disabled = false; submit.classList.remove('is-loading'); }
        }
      });
    });
  }

  /* ---------- Testimonials marquee ----------
   * The continuous scroll is pure CSS (`@keyframes ff-marquee` in main.css).
   * Hover pauses via `:hover { animation-play-state: paused }`.
   * No JS needed — kept as a comment so future maintainers know where to look.
   */

  /* ---------- Projects page — category filter ---------- */
  const projGrid = document.getElementById('ff-projects-grid');
  if (projGrid) {
    const chips = document.querySelectorAll('.ff-projects__chip');
    const cards = Array.from(projGrid.querySelectorAll('.ff-project-card'));
    const empty = document.querySelector('.ff-projects__empty');

    // Populate the count badges
    const countsByCat = { '*': cards.length };
    cards.forEach((c) => {
      (c.dataset.categories || '').split(/\s+/).filter(Boolean).forEach((cat) => {
        countsByCat[cat] = (countsByCat[cat] || 0) + 1;
      });
    });
    chips.forEach((chip) => {
      const f = chip.dataset.filter;
      const span = chip.querySelector('.ff-projects__chip-count');
      if (span) span.textContent = countsByCat[f] || 0;
    });

    const applyFilter = (filter) => {
      let visible = 0;
      cards.forEach((c) => {
        const cats = (c.dataset.categories || '').split(/\s+/);
        const match = filter === '*' || cats.includes(filter);
        c.classList.toggle('is-hidden', !match);
        if (match) visible++;
      });
      if (empty) empty.hidden = visible !== 0;
    };

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => {
          c.classList.remove('is-active');
          c.setAttribute('aria-selected', 'false');
        });
        chip.classList.add('is-active');
        chip.setAttribute('aria-selected', 'true');
        applyFilter(chip.dataset.filter);
      });
    });
  }

  /* ---------- Hero slider ---------- */
  const settings = window.FF_HERO || {};
  const el = document.querySelector('.ff-hero__swiper');
  if (!el || typeof Swiper === 'undefined') return;

  const slidesCount = el.querySelectorAll('.swiper-slide').length;
  const wantsAutoplay = parseInt(settings.autoplay, 10) === 1 && !reducedMotion && slidesCount > 1;
  const wantsLoop     = parseInt(settings.loop, 10) === 1 && slidesCount > 1;
  const wantsDots     = parseInt(settings.show_dots, 10) === 1;
  const wantsArrows   = parseInt(settings.show_arrows, 10) === 1;
  const pauseOnHover  = parseInt(settings.pause_on_hover, 10) === 1;
  const duration      = Math.max(1, parseInt(settings.duration || 6, 10)) * 1000;
  const effect        = settings.transition === 'slide' ? 'slide' : 'fade';

  const config = {
    effect: effect,
    fadeEffect: { crossFade: true },
    speed: 900,
    loop: wantsLoop,
    grabCursor: true,
    a11y: {
      enabled: true,
      prevSlideMessage: 'Previous slide',
      nextSlideMessage: 'Next slide',
    },
    keyboard: { enabled: true, onlyInViewport: true },
  };

  if (wantsAutoplay) {
    config.autoplay = {
      delay: duration,
      disableOnInteraction: false,
      pauseOnMouseEnter: pauseOnHover,
    };
  }
  if (wantsDots) {
    config.pagination = {
      el: '.ff-hero__dots',
      clickable: true,
    };
  }
  if (wantsArrows) {
    config.navigation = {
      nextEl: '.ff-hero__arrow.swiper-button-next',
      prevEl: '.ff-hero__arrow.swiper-button-prev',
    };
  }

  /* eslint-disable-next-line no-new */
  new Swiper(el, config);
})();

/* Blog post share buttons: use the real current page URL (deploy-agnostic) */
(function () {
  var btns = document.querySelectorAll('.ff-post-share__btn');
  if (!btns.length) return;
  var url = encodeURIComponent(location.href.split('#')[0]);
  var title = encodeURIComponent(document.title);
  btns.forEach(function (a) {
    var h = a.getAttribute('href') || '';
    if (h.indexOf('facebook.com') > -1) a.href = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
    else if (h.indexOf('twitter.com') > -1 || h.indexOf('x.com') > -1) a.href = 'https://twitter.com/intent/tweet?url=' + url + '&text=' + title;
    else if (h.indexOf('linkedin.com') > -1) a.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + url;
    else if (h.indexOf('mailto:') === 0) a.href = 'mailto:?subject=' + title + '&body=' + url;
  });
})();
