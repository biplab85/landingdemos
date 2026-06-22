/* Harrison Fencing — progressive enhancement.
   Core UI works without JS. GSAP / Swiper / GLightbox add polish
   and are loaded from CDN before this file. All guarded so the
   page never breaks if a library fails to load. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
   * 1. Mobile nav drawer
   * ------------------------------------------------------- */
  var toggle = document.querySelector('[data-nav-toggle]');
  var drawer = document.querySelector('[data-nav-drawer]');

  if (toggle && drawer) {
    var panel = drawer.querySelector('.nav__panel');
    var navFocusables = function () {
      return Array.prototype.slice.call(
        (panel || drawer).querySelectorAll('a[href], button:not([disabled])')
      ).filter(function (el) { return el.offsetParent !== null; });
    };

    var setOpen = function (open, restoreFocus) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      drawer.classList.toggle('is-open', open);
      drawer.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('nav-open', open);

      if (open) {
        if (window.gsap && !reduceMotion && panel) {
          window.gsap.fromTo(
            panel.querySelectorAll('.nav__panel-links a, .nav__panel-foot > *'),
            { x: 28, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.05, delay: 0.14 }
          );
        }
        var f = navFocusables();
        if (f.length) setTimeout(function () { f[0].focus(); }, 80);
      } else if (restoreFocus !== false) {
        toggle.focus();
      }
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('[data-nav-close]')) setOpen(false);          // restore focus to toggle
      else if (e.target.closest('a')) setOpen(false, false);            // link/CTA manages focus
    });
    document.addEventListener('keydown', function (e) {
      if (drawer.getAttribute('aria-hidden') !== 'false') return;
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key === 'Tab') {
        var f = navFocusables();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (e) {
      if (e.matches) setOpen(false, false);
    });
  }

  /* ---------------------------------------------------------
   * 2. Sticky header shadow
   * ------------------------------------------------------- */
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------------------------------------
   * 2b. Scrollspy — highlight the nav item for the section in view
   * ------------------------------------------------------- */
  (function () {
    var links = Array.prototype.slice.call(
      document.querySelectorAll('.nav__links a[href^="#"], .nav__drawer a[href^="#"]')
    );
    if (!links.length) return;

    var byId = {};
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      (byId[id] = byId[id] || []).push(a);
    });

    var sections = Object.keys(byId)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean)
      .sort(function (a, b) { return a.offsetTop - b.offsetTop; });
    if (!sections.length) return;

    var current = null;
    var setActive = function (id) {
      if (id === current) return;
      current = id;
      links.forEach(function (a) { a.removeAttribute('aria-current'); });
      (byId[id] || []).forEach(function (a) { a.setAttribute('aria-current', 'page'); });
    };

    var update = function () {
      var offset = (header ? header.offsetHeight : 0) + 24;
      var pos = window.scrollY + offset;
      var atBottom = (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 2);
      var id = atBottom ? sections[sections.length - 1].id : null;
      if (!id) {
        for (var i = 0; i < sections.length; i++) {
          if (sections[i].offsetTop <= pos) id = sections[i].id;
        }
      }
      setActive(id || '');
    };

    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  })();

  /* ---------------------------------------------------------
   * 2c. Quote modal (premium dialog + form)
   * ------------------------------------------------------- */
  (function () {
    var modal = document.getElementById('quote-modal');
    if (!modal) return;

    var dialog = modal.querySelector('.modal__dialog');
    var overlay = modal.querySelector('.modal__overlay');
    var form = modal.querySelector('[data-quote-form]');
    var success = modal.querySelector('[data-quote-success]');
    var lastFocused = null;

    var focusables = function () {
      return Array.prototype.slice.call(
        modal.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')
      ).filter(function (el) { return el.offsetParent !== null; });
    };

    var open = function () {
      lastFocused = document.activeElement;
      // always reset to the form view
      if (form) form.hidden = false;
      if (success) success.hidden = true;
      if (typeof resetSelects === 'function') resetSelects();
      modal.hidden = false;
      document.body.classList.add('modal-open');

      if (window.gsap && !reduceMotion) {
        window.gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power1.out' });
        window.gsap.fromTo(dialog, { opacity: 0, y: 24, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' });
      }
      var first = modal.querySelector('#qf-name');
      if (first) setTimeout(function () { first.focus(); }, 60);
    };

    var close = function () {
      if (typeof closeAllSelects === 'function') closeAllSelects();
      var finish = function () {
        modal.hidden = true;
        document.body.classList.remove('modal-open');
        if (lastFocused && lastFocused.focus) lastFocused.focus();
      };
      if (window.gsap && !reduceMotion) {
        window.gsap.to(dialog, { opacity: 0, y: 16, scale: 0.98, duration: 0.2, ease: 'power1.in' });
        window.gsap.to(overlay, { opacity: 0, duration: 0.2, onComplete: finish });
      } else { finish(); }
    };

    // ---- Custom selects (branch / service) -------------------
    var customSelects = Array.prototype.slice.call(modal.querySelectorAll('[data-cselect]'));

    var closeSelect = function (cs) {
      cs.classList.remove('is-open');
      var t = cs.querySelector('[data-cselect-trigger]');
      var l = cs.querySelector('[data-cselect-list]');
      if (t) t.setAttribute('aria-expanded', 'false');
      if (l) l.hidden = true;
    };
    var closeAllSelects = function (except) {
      customSelects.forEach(function (cs) { if (cs !== except) closeSelect(cs); });
    };
    var resetSelects = function () {
      customSelects.forEach(function (cs) {
        var valueEl = cs.querySelector('[data-cselect-value]');
        var input = cs.querySelector('[data-cselect-input]');
        if (valueEl && valueEl.dataset.placeholder) {
          valueEl.textContent = valueEl.dataset.placeholder;
          valueEl.classList.add('is-placeholder');
        }
        if (input) input.value = '';
        cs.querySelectorAll('.cselect__option').forEach(function (o) {
          o.setAttribute('aria-selected', 'false');
          o.classList.remove('is-active');
        });
        closeSelect(cs);
      });
    };

    customSelects.forEach(function (cs, csIndex) {
      var trigger = cs.querySelector('[data-cselect-trigger]');
      var list = cs.querySelector('[data-cselect-list]');
      var valueEl = cs.querySelector('[data-cselect-value]');
      var input = cs.querySelector('[data-cselect-input]');
      var options = Array.prototype.slice.call(cs.querySelectorAll('.cselect__option'));
      var activeIndex = -1;

      if (valueEl) valueEl.dataset.placeholder = valueEl.textContent.trim();
      options.forEach(function (opt, i) { if (!opt.id) opt.id = 'cselect-' + csIndex + '-' + i; });

      var setActive = function (i) {
        options.forEach(function (o) { o.classList.remove('is-active'); });
        if (i >= 0 && i < options.length) {
          activeIndex = i;
          options[i].classList.add('is-active');
          options[i].scrollIntoView({ block: 'nearest' });
          if (list) list.setAttribute('aria-activedescendant', options[i].id);
        }
      };
      var openList = function () {
        closeAllSelects(cs);
        cs.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        list.hidden = false;
        var sel = options.findIndex(function (o) { return o.getAttribute('aria-selected') === 'true'; });
        setActive(sel >= 0 ? sel : 0);
        if (window.gsap && !reduceMotion) window.gsap.from(list, { opacity: 0, y: -6, duration: 0.16, ease: 'power2.out' });
      };
      var choose = function (opt) {
        options.forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
        opt.setAttribute('aria-selected', 'true');
        valueEl.textContent = opt.textContent;
        valueEl.classList.remove('is-placeholder');
        input.value = opt.getAttribute('data-value');
        cs.closest('.field').classList.remove('is-invalid');
        closeSelect(cs);
        trigger.focus();
      };

      trigger.addEventListener('click', function () {
        if (cs.classList.contains('is-open')) closeSelect(cs); else openList();
      });
      trigger.addEventListener('keydown', function (e) {
        var isOpen = cs.classList.contains('is-open');
        switch (e.key) {
          case 'ArrowDown': e.preventDefault(); if (!isOpen) openList(); else setActive(Math.min(activeIndex + 1, options.length - 1)); break;
          case 'ArrowUp': e.preventDefault(); if (isOpen) setActive(Math.max(activeIndex - 1, 0)); break;
          case 'Enter':
          case ' ': e.preventDefault(); if (!isOpen) openList(); else if (activeIndex >= 0) choose(options[activeIndex]); break;
          case 'Escape': if (isOpen) { e.preventDefault(); e.stopPropagation(); closeSelect(cs); } break;
          case 'Tab': if (isOpen) closeSelect(cs); break;
        }
      });
      options.forEach(function (opt, i) {
        opt.addEventListener('click', function () { choose(opt); });
        opt.addEventListener('mousemove', function () { setActive(i); });
      });
    });

    document.addEventListener('click', function (e) {
      if (modal.hidden) return;
      if (!e.target.closest('[data-cselect]')) closeAllSelects();
    });

    document.querySelectorAll('[data-quote-open]').forEach(function (btn) {
      btn.addEventListener('click', function (e) { e.preventDefault(); open(); });
    });
    modal.querySelectorAll('[data-quote-close]').forEach(function (btn) {
      btn.addEventListener('click', close);
    });

    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {                          // focus trap
        var f = focusables();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    if (form) {
      form.querySelectorAll('.field').forEach(function (field) {
        var ctrl = field.querySelector('input, select, textarea');
        if (ctrl) ctrl.addEventListener('input', function () { field.classList.remove('is-invalid'); });
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var firstInvalid = null;
        form.querySelectorAll('[required]').forEach(function (ctrl) {
          var field = ctrl.closest('.field');
          var bad = !ctrl.value.trim();
          field.classList.toggle('is-invalid', bad);
          if (bad && !firstInvalid) firstInvalid = ctrl;
        });
        var email = form.querySelector('#qf-email');
        if (email && email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
          email.closest('.field').classList.add('is-invalid');
          if (!firstInvalid) firstInvalid = email;
        }
        if (firstInvalid) {
          var ft = firstInvalid;
          if (ft.type === 'hidden') {
            var cs = ft.closest('[data-cselect]');
            if (cs) ft = cs.querySelector('[data-cselect-trigger]');
          }
          (ft || firstInvalid).focus();
          return;
        }

        var btn = form.querySelector('.quote-form__submit');
        btn.disabled = true; btn.textContent = 'Sending…';

        setTimeout(function () {
          var nameEl = form.querySelector('#qf-name');
          var nameOut = modal.querySelector('[data-success-name]');
          if (nameOut && nameEl && nameEl.value.trim()) nameOut.textContent = nameEl.value.trim().split(' ')[0];
          form.hidden = true;
          success.hidden = false;
          if (window.gsap && !reduceMotion) {
            window.gsap.from(success, { opacity: 0, y: 14, duration: 0.4, ease: 'power2.out' });
          }
          btn.disabled = false; btn.textContent = 'Request my free quote';
          form.reset();
        }, 750);
      });
    }
  })();

  /* ---------------------------------------------------------
   * 2d. Footer accordions (mobile only)
   * ------------------------------------------------------- */
  (function () {
    var cols = Array.prototype.slice.call(document.querySelectorAll('[data-footer-acc]'));
    if (!cols.length) return;
    var mqMobile = window.matchMedia('(max-width: 767px)');

    var sync = function () {
      cols.forEach(function (col) {
        var btn = col.querySelector('.footer__acc-trigger');
        if (!btn) return;
        if (mqMobile.matches) {
          btn.setAttribute('aria-expanded', String(col.classList.contains('is-open')));
        } else {
          col.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'true');   // always open on desktop
        }
      });
    };

    cols.forEach(function (col) {
      var btn = col.querySelector('.footer__acc-trigger');
      if (!btn) return;
      btn.addEventListener('click', function () {
        if (!mqMobile.matches) return;                  // accordion only on mobile
        var open = col.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
      });
    });

    sync();
    mqMobile.addEventListener('change', sync);
  })();

  /* ---------------------------------------------------------
   * 3. Swiper — work gallery carousel
   * ------------------------------------------------------- */
  if (window.Swiper && document.querySelector('.work-swiper')) {
    new window.Swiper('.work-swiper', {
      slidesPerView: 1.15,
      spaceBetween: 16,
      grabCursor: true,
      centeredSlides: false,
      loop: true,
      speed: 700,
      autoplay: reduceMotion ? false : {
        delay: 2600,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      a11y: { enabled: true },
      keyboard: { enabled: true },
      pagination: { el: '.work-swiper .swiper-pagination', clickable: true },
      breakpoints: {
        560:  { slidesPerView: 1.6, spaceBetween: 18 },
        768:  { slidesPerView: 2.2, spaceBetween: 22 },
        1024: { slidesPerView: 3,   spaceBetween: 24 }
      }
    });
  }

  /* ---------------------------------------------------------
   * 3c. Reviews slider — MOBILE ONLY (desktop keeps the stack)
   * ------------------------------------------------------- */
  (function () {
    var el = document.querySelector('.reviews2__list.swiper');
    if (!el || !window.Swiper) return;
    var mq = window.matchMedia('(max-width: 767px)');
    var sw = null;

    var apply = function () {
      if (mq.matches && !sw) {
        sw = new window.Swiper(el, {
          slidesPerView: 1.08,
          spaceBetween: 16,
          grabCursor: true,
          observer: true,
          observeParents: true,
          a11y: { enabled: true },
          pagination: { el: el.querySelector('.swiper-pagination'), clickable: true },
          breakpoints: { 560: { slidesPerView: 1.35, spaceBetween: 18 } }
        });
        requestAnimationFrame(function () { if (sw) sw.update(); });   // re-measure after layout
      } else if (!mq.matches && sw) {
        sw.destroy(true, true);     // clean up → desktop returns to the stack
        sw = null;
      }
    };

    apply();
    mq.addEventListener('change', apply);
  })();

  /* ---------------------------------------------------------
   * 4. Fancybox — image popup / preview
   * ------------------------------------------------------- */
  if (window.Fancybox) {
    window.Fancybox.bind('[data-fancybox]', {
      Carousel: { transition: 'slide' },
      Images: { zoom: true },
      Thumbs: { type: 'classic' }
    });
  }

  /* ---------------------------------------------------------
   * 5. GSAP micro-animations (+ ScrollTrigger)
   * ------------------------------------------------------- */
  var gsap = window.gsap;

  var clearPending = function () {
    document.documentElement.classList.remove('gsap-pending');
  };

  var showAll = function () {
    // Fallback: reveal everything, fill counters with final values.
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
    document.querySelectorAll('[data-count]').forEach(function (el) {
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
    clearPending();
  };

  if (gsap && !reduceMotion) {
    var hasST = !!window.ScrollTrigger;
    if (hasST) gsap.registerPlugin(window.ScrollTrigger);

    // Hero entrance — staggered rise (gsap.set then animate to visible).
    var heroBits = document.querySelectorAll('[data-hero-anim] > *');
    if (heroBits.length) {
      gsap.set(heroBits, { opacity: 0, y: 28 });
      gsap.to(heroBits, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.15 });
    }
    var heroMedia = document.querySelector('[data-hero-media]');
    if (heroMedia) {
      gsap.set(heroMedia, { opacity: 0, y: 40, scale: 0.97 });
      gsap.to(heroMedia, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out', delay: 0.3 });
    }

    // --- Hero micro-animations ---------------------------------
    // One-pass light sweep across the main photo.
    var shine = document.querySelector('.hero__shine');
    if (shine) {
      gsap.fromTo(shine, { xPercent: -160 },
        { xPercent: 220, duration: 1.15, ease: 'power2.inOut', delay: 1 });
    }
    // Gentle idle float on the floating badge.
    var badge = document.querySelector('.hero__badge');
    if (badge) {
      gsap.to(badge, { y: -9, duration: 2.4, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.1 });
    }
    // Bobbing scroll-cue chevron.
    var scrollIco = document.querySelector('.hero__scroll-ico');
    if (scrollIco) {
      gsap.to(scrollIco, { y: 4, duration: 0.9, ease: 'sine.inOut', repeat: -1, yoyo: true });
    }

    // Testimonials — continuously floating quote badge.
    var quoteBadge = document.querySelector('[data-quote-float]');
    if (quoteBadge) {
      gsap.to(quoteBadge, { y: -8, rotation: -5, duration: 2.3, ease: 'sine.inOut', repeat: -1, yoyo: true });
    }

    // GSAP now controls inline styles → safe to drop the CSS pre-hide.
    clearPending();

    // Subtle scroll parallax on the photo showcase.
    if (window.ScrollTrigger && heroMedia) {
      gsap.to(heroMedia, {
        yPercent: -7, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 }
      });
    }

    if (hasST) {
      gsap.utils.toArray('.reveal').forEach(function (el) {
        gsap.set(el, { opacity: 0, y: 30 });
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        });
      });

      // Staggered grids (stats, services, locations).
      gsap.utils.toArray('[data-stagger]').forEach(function (group) {
        gsap.set(group.children, { opacity: 0, y: 26 });
        gsap.to(group.children, {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08,
          scrollTrigger: { trigger: group, start: 'top 82%', once: true }
        });
      });

      // Reviews — sequential card reveal (sticky-stack storytelling).
      // Each card animates in (fade + slide + scale) as it enters view.
      gsap.utils.toArray('[data-review]').forEach(function (card) {
        gsap.set(card, { opacity: 0, y: 64, scale: 0.96 });
        gsap.to(card, {
          opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 86%', once: true }
        });
      });

      // Animated stat counters.
      gsap.utils.toArray('[data-count]').forEach(function (el) {
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 1.4, ease: 'power1.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: function () { el.textContent = Math.round(obj.v) + suffix; }
        });
      });

      window.ScrollTrigger.refresh();
    }
  } else {
    showAll();
  }
})();
