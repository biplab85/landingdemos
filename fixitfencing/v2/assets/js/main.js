/* FiXiT Fencing V2 — site interactions */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header state ---------- */
  var hdr = d.querySelector('.hdr');
  function onScroll() { if (hdr) hdr.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Sheets (native <dialog>) ---------- */
  function unlockIfIdle() {
    if (d.querySelector('dialog.sheet[open]')) return;
    root.style.overflow = '';
    if (root.classList.contains('sheet-open')) { root.classList.remove('sheet-open'); d.dispatchEvent(new CustomEvent('fixit:sheet', { detail: { open: false } })); }
  }
  function closeSheet(dlg, instant) {
    if (!dlg || !dlg.open) return;
    if (instant || reduce) { dlg.close(); unlockIfIdle(); return; }
    dlg.classList.add('is-closing');
    var done = false;
    var finish = function () { if (done) return; done = true; dlg.classList.remove('is-closing'); dlg.close(); unlockIfIdle(); };
    dlg.addEventListener('animationend', function h(e) {
      if (e.target === dlg && /sheet-(down|right)/.test(e.animationName)) { dlg.removeEventListener('animationend', h); finish(); }
    });
    setTimeout(finish, 380);
  }
  function openSheet(id, trigger) {
    var dlg = d.getElementById(id);
    if (!dlg || typeof dlg.showModal !== 'function') return false;
    d.querySelectorAll('dialog.sheet[open]').forEach(function (o) { if (o !== dlg) closeSheet(o, true); });
    dlg._trigger = trigger || null;
    dlg.classList.remove('is-closing');
    if (!dlg.open) dlg.showModal();
    root.style.overflow = 'hidden';
    if (!root.classList.contains('sheet-open')) { root.classList.add('sheet-open'); d.dispatchEvent(new CustomEvent('fixit:sheet', { detail: { open: true } })); }
    return true;
  }
  d.querySelectorAll('dialog.sheet').forEach(function (dlg) {
    dlg.addEventListener('close', function () {
      unlockIfIdle();
      var t = dlg._trigger;
      if (t && t.isConnected && typeof t.focus === 'function') t.focus({ preventScroll: true });
    });
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); closeSheet(dlg); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) closeSheet(dlg); });
    dlg.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', function () { closeSheet(dlg); }); });
    // in-page anchors inside a sheet close it first
    dlg.querySelectorAll('a[href^="#"]:not([data-quote]):not([data-contact])').forEach(function (a) { a.addEventListener('click', function () { closeSheet(dlg, true); }); });
  });
  // Trigger routing: [data-quote] -> quote drawer, [data-contact] -> contact drawer, [data-open="menu"] -> menu sheet.
  d.addEventListener('click', function (e) {
    var t = e.target.closest('[data-quote], [data-contact], [data-open="menu"]');
    if (!t) return;
    var id = t.hasAttribute('data-quote') ? 'quote' : (t.hasAttribute('data-contact') ? 'contact-us' : 'menu-sheet');
    e.preventDefault();
    if (!openSheet(id, t)) return;
    if (id === 'quote') {
      var svc = t.getAttribute('data-service');
      var sel = d.querySelector('#quote select[name="fencing_type"]');
      if (sel && svc) sel.value = svc;
    }
  });

  /* ---------- Desktop mega menu ---------- */
  d.querySelectorAll('.nav__item--mega').forEach(function (item) {
    var btn = item.querySelector('.nav__toggle'), timer;
    var open = function () { clearTimeout(timer); item.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
    var close = function () { item.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', function () { item.classList.contains('is-open') ? close() : open(); });
    item.addEventListener('mouseenter', open);
    item.addEventListener('mouseleave', function () { timer = setTimeout(close, 160); });
    item.addEventListener('keydown', function (e) { if (e.key === 'Escape' && item.classList.contains('is-open')) { close(); btn.focus(); } });
    item.addEventListener('focusout', function (e) { if (!item.contains(e.relatedTarget)) close(); });
  });

  /* ---------- Quote forms (static demo handler) ---------- */
  d.querySelectorAll('form[data-qform]').forEach(function (f) {
    var status = f.querySelector('.qform__status');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var hp = f.querySelector('.hp input');
      if (hp && hp.value) return;
      var firstBad = null;
      f.querySelectorAll('[required]').forEach(function (inp) {
        var field = inp.closest('.field'), ok = inp.checkValidity();
        var err = field && field.querySelector('.field__err');
        if (field) field.classList.toggle('is-invalid', !ok);
        inp.setAttribute('aria-invalid', String(!ok));
        if (err) err.textContent = ok ? '' : (inp.validity.valueMissing ? 'This field is required.' : (inp.type === 'email' ? 'Please enter a valid email address.' : 'Please check this field.'));
        if (!ok && !firstBad) firstBad = inp;
      });
      status.className = 'qform__status'; status.textContent = '';
      if (firstBad) {
        status.className = 'qform__status is-err';
        status.textContent = 'Please complete the highlighted fields.';
        firstBad.focus();
        return;
      }
      var btn = f.querySelector('[type="submit"]'), label = btn.innerHTML;
      btn.disabled = true; btn.textContent = 'Sending…';
      setTimeout(function () {
        status.className = 'qform__status is-ok';
        status.textContent = f.getAttribute('data-success') || 'Thanks, we will be in touch soon.';
        f.reset(); btn.disabled = false; btn.innerHTML = label;
      }, 700);
    });
    f.addEventListener('input', function (e) {
      var field = e.target.closest('.field');
      if (field && field.classList.contains('is-invalid') && e.target.checkValidity()) {
        field.classList.remove('is-invalid'); e.target.setAttribute('aria-invalid', 'false');
        var err = field.querySelector('.field__err'); if (err) err.textContent = '';
      }
    });
  });

  /* ---------- FAQ accordion ---------- */
  d.querySelectorAll('.acc__btn').forEach(function (btn) {
    var item = btn.closest('.acc__item');
    var panel = d.getElementById(btn.getAttribute('aria-controls'));
    var set = function (open) {
      btn.setAttribute('aria-expanded', String(open));
      item.classList.toggle('is-open', open);
      if (panel) panel.inert = !open;
    };
    set(btn.getAttribute('aria-expanded') === 'true');
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
  });

  /* ---------- Projects filter ---------- */
  var group = d.querySelector('[data-filter-group]');
  if (group) {
    var chips = group.querySelectorAll('[data-filter]');
    var items = d.querySelectorAll('.proj');
    var countEl = d.querySelector('[data-proj-count]');
    var empty = d.querySelector('.proj-empty');
    var apply = function (cat, push) {
      var n = 0, shown = [];
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-filter') === cat)); });
      items.forEach(function (it) {
        var show = cat === 'all' || it.getAttribute('data-cat') === cat;
        it.hidden = !show;
        it.querySelector('a').setAttribute('data-fancybox', show ? 'projects' : 'projects-off');
        if (show) { n++; shown.push(it); }
      });
      if (countEl) countEl.textContent = 'Showing ' + n + ' of ' + items.length + ' projects';
      if (empty) empty.hidden = n > 0;
      if (push && history.replaceState) history.replaceState(null, '', cat === 'all' ? location.pathname : '#' + cat);
      if (push && !reduce && window.gsap) window.gsap.fromTo(shown, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .025, ease: 'power2.out', overwrite: true });
    };
    chips.forEach(function (c) { c.addEventListener('click', function () { apply(c.getAttribute('data-filter'), true); }); });
    var h = decodeURIComponent(location.hash.slice(1));
    var valid = Array.prototype.some.call(chips, function (c) { return c.getAttribute('data-filter') === h; });
    apply(valid ? h : 'all', false);
  }

  /* ---------- Service sub-nav highlighting ---------- */
  var subnav = d.querySelector('.subnav');
  if (subnav && 'IntersectionObserver' in window) {
    var links = subnav.querySelectorAll('a[href^="#"]:not([data-quote]):not([data-contact])');
    var list = subnav.querySelector('.subnav__list');
    var map = {};
    links.forEach(function (a) { var s = d.getElementById(a.getAttribute('href').slice(1)); if (s) map[s.id] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('is-active'); l.removeAttribute('aria-current'); });
          var a = map[en.target.id];
          if (a) {
            a.classList.add('is-active'); a.setAttribute('aria-current', 'true');
            var left = a.offsetLeft - 16;
            if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: left, behavior: reduce ? 'auto' : 'smooth' });
          }
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    Object.keys(map).forEach(function (id) { io.observe(d.getElementById(id)); });
  }

  /* ---------- Share buttons ---------- */
  d.querySelectorAll('[data-share]').forEach(function (a) {
    var url = encodeURIComponent(location.href), title = encodeURIComponent(d.title);
    a.href = a.getAttribute('data-share').replace('{url}', url).replace('{title}', title);
  });
  d.querySelectorAll('[data-copy-link]').forEach(function (b) {
    b.addEventListener('click', function () {
      var live = d.getElementById('share-live');
      var done = function () { if (live) live.textContent = 'Link copied to clipboard'; b.classList.add('is-done'); };
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, done); else done();
    });
  });

  d.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Sliders: infinite loop + accessible autoplay ---------- */
  var sliders = [];
  // Only Tab navigation counts as 'keyboard focus inside a slider' (not focus restored by a lightbox or a click).
  var tabNav = false;
  d.addEventListener('keydown', function (e) { tabNav = e.key === 'Tab'; }, true);
  d.addEventListener('pointerdown', function () { tabNav = false; }, true);
  var syncToggle = function (btn, paused) {
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(paused));
    var sr = btn.querySelector('.sr-only'); if (sr) sr.textContent = paused ? 'Play slideshow' : 'Pause slideshow';
    var ip = btn.querySelector('[data-icon-pause]'), pl = btn.querySelector('[data-icon-play]');
    if (ip) ip.style.display = paused ? 'none' : '';
    if (pl) pl.style.display = paused ? '' : 'none';
  };
  // One controller per slider. Autoplay runs only when no pause reason is active.
  function controller(swiper, focusRoot, toggle) {
    var ctl = { swiper: swiper, reasons: {} };
    ctl.set = function (reason, on) {
      if (on) ctl.reasons[reason] = true; else delete ctl.reasons[reason];
      ctl.apply();
    };
    ctl.apply = function () {
      if (reduce || !swiper.autoplay || swiper.destroyed) return;
      var paused = Object.keys(ctl.reasons).length > 0;
      if (paused && swiper.autoplay.running) swiper.autoplay.stop();
      else if (!paused && !swiper.autoplay.running) swiper.autoplay.start();
    };
    if (toggle) {
      if (reduce) toggle.hidden = true;
      else toggle.addEventListener('click', function () { var p = !ctl.reasons.user; ctl.set('user', p); syncToggle(toggle, p); });
    }
    // Pause while keyboard focus is inside the slides (not on the controls).
    focusRoot.addEventListener('focusin', function () { if (tabNav) ctl.set('focus', true); });
    focusRoot.addEventListener('focusout', function (e) { if (!focusRoot.contains(e.relatedTarget)) ctl.set('focus', false); });
    // Pause while off-screen.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { ctl.set('offscreen', !en[0].isIntersecting); }, { threshold: 0.1 }).observe(focusRoot);
    }
    if (d.hidden) ctl.reasons.hidden = true;
    sliders.push(ctl);
    swiper.__ctl = ctl;
    return ctl;
  }
  var pauseAll = function (reason, on) { sliders.forEach(function (ctl) { ctl.set(reason, on); }); };
  d.addEventListener('fixit:sheet', function (e) { pauseAll('sheet', e.detail.open); });
  d.addEventListener('visibilitychange', function () { pauseAll('hidden', d.hidden); });
  // Lightbox open/close (works whether or not Fancybox events fire).
  if ('MutationObserver' in window) {
    var lbOpen = false;
    new MutationObserver(function () {
      var now = !!d.querySelector('.fancybox__container');
      if (now !== lbOpen) { lbOpen = now; pauseAll('lightbox', now); }
    }).observe(d.body, { childList: true });
  }

  // Make sure a loop always has enough slides: clone the set (aria-hidden, not focusable,
  // no ids, lightbox links proxy to the original photo).
  function ensureLoopSlides(el) {
    var wrapper = el.querySelector('.swiper-wrapper');
    var originals = Array.prototype.slice.call(wrapper.children);
    var n = originals.length;
    if (!n) return n;
    var slideW = Math.max(160, originals[0].getBoundingClientRect().width || 300);
    var visible = Math.ceil(Math.max(window.innerWidth, 1920) / slideW) + 1;
    var need = visible * 2 + 1;
    var fbLinks = Array.prototype.slice.call(wrapper.querySelectorAll('[data-fancybox]'));
    var round = 0;
    while (wrapper.children.length < need && round < 6) {
      round++;
      originals.forEach(function (sl) {
        var cl = sl.cloneNode(true);
        cl.setAttribute('aria-hidden', 'true');
        cl.setAttribute('data-loop-clone', '');
        cl.removeAttribute('id');
        cl.querySelectorAll('[id]').forEach(function (x) { x.removeAttribute('id'); });
        cl.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach(function (x) { x.setAttribute('tabindex', '-1'); });
        cl.querySelectorAll('[data-fancybox]').forEach(function (a) {
          var orig = sl.querySelector('[data-fancybox]');
          a.setAttribute('data-proxy', String(fbLinks.indexOf(orig)));
          a.removeAttribute('data-fancybox');
        });
        wrapper.appendChild(cl);
      });
    }
    wrapper.__fbLinks = fbLinks;
    return n;
  }
  d.addEventListener('click', function (e) {
    var a = e.target.closest('[data-proxy]');
    if (!a) return;
    var wrapper = a.closest('.swiper-wrapper');
    var orig = wrapper && wrapper.__fbLinks && wrapper.__fbLinks[+a.getAttribute('data-proxy')];
    if (orig) { e.preventDefault(); orig.click(); }
  });

  function initSwipers() {
    if (typeof window.Swiper === 'undefined') return;
    var a11y = { enabled: true, prevSlideMessage: 'Previous slide', nextSlideMessage: 'Next slide' };

    var heroEl = d.querySelector('.hero-swiper');
    if (heroEl) {
      try {
        var cap = d.querySelector('[data-hero-caption]');
        var bar = d.querySelector('.hero__progress span');
        var hero = new window.Swiper(heroEl, {
          effect: 'fade', fadeEffect: { crossFade: true }, loop: true, rewind: false, speed: 1000,
          autoplay: reduce ? false : { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
          navigation: { nextEl: '.hero [data-next]', prevEl: '.hero [data-prev]' },
          a11y: a11y, keyboard: { enabled: true, onlyInViewport: true },
          on: {
            slideChange: function (s) { var sl = s.slides[s.activeIndex]; if (cap && sl) cap.textContent = sl.getAttribute('data-caption') || ''; },
            autoplayTimeLeft: function (s, t, p) { if (bar) bar.style.width = ((1 - p) * 100) + '%'; },
            autoplayStop: function () { if (bar) bar.style.width = '0%'; }
          }
        });
        controller(hero, heroEl, d.querySelector('.hero [data-pause]'));
      } catch (err) { if (window.console) console.warn('[fixit] hero slider: ' + err.message); }
    }

    d.querySelectorAll('[data-carousel]').forEach(function (wrap) {
      try {
        var el = wrap.querySelector('.swiper');
        var realCount = ensureLoopSlides(el);
        var fill = null, pb = wrap.querySelector('.progressbar');
        if (pb) { fill = d.createElement('span'); fill.className = 'swiper-pagination-progressbar-fill'; pb.appendChild(fill); pb.setAttribute('aria-hidden', 'true'); }
        var showProgress = function (s) {
          if (!fill) return;
          var ri = ((s.realIndex % realCount) + realCount) % realCount;
          fill.style.transform = 'scaleX(' + ((ri + 1) / realCount) + ')';
        };
        var sw = new window.Swiper(el, {
          slidesPerView: 'auto', spaceBetween: 16, speed: 900, grabCursor: true,
          loop: true, rewind: false,
          autoplay: reduce ? false : { delay: parseInt(wrap.getAttribute('data-delay'), 10) || 4500, disableOnInteraction: false, pauseOnMouseEnter: true },
          navigation: { nextEl: wrap.querySelector('[data-next]'), prevEl: wrap.querySelector('[data-prev]') },
          keyboard: { enabled: true, onlyInViewport: true }, a11y: a11y,
          breakpoints: { 900: { spaceBetween: 22 } },
          on: { init: showProgress, slideChange: showProgress }
        });
        sw.__realCount = realCount;
        controller(sw, el, wrap.querySelector('[data-pause]'));
      } catch (err) { if (window.console) console.warn('[fixit] carousel: ' + err.message); }
    });
  }

  /* ---------- Fancybox ---------- */
  function initFancybox() {
    if (!window.Fancybox) return;
    window.Fancybox.bind('[data-fancybox]', {
      Hash: false,
      Thumbs: { type: 'classic' },
      Toolbar: { display: { left: ['infobar'], middle: [], right: ['slideshow', 'thumbs', 'close'] } },
      Images: { zoom: true },
      on: {
        init: function () { pauseAll('lightbox', true); },
        destroy: function () { pauseAll('lightbox', false); }
      }
    });
  }

  /* ---------- GSAP motion (restrained) ---------- */
  function initMotion() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (!gsap || !ST || reduce) return;
    gsap.registerPlugin(ST);
    root.classList.add('anim');

    var vh = window.innerHeight;
    var els = gsap.utils.toArray('[data-reveal]').filter(function (el) { return el.getBoundingClientRect().top > vh * 0.9; });
    if (els.length) {
      gsap.set(els, { autoAlpha: 0, y: 26 });
      ST.batch(els, {
        start: 'top 90%', once: true,
        onEnter: function (batch) { gsap.to(batch, { autoAlpha: 1, y: 0, duration: .9, ease: 'power3.out', stagger: .08, overwrite: true }); }
      });
    }

    var frame = d.querySelector('[data-hero-frame]');
    if (frame) gsap.from(frame, { clipPath: 'inset(6% 6% 6% 6% round 34px)', duration: 1.3, ease: 'power3.out' });
    var stamp = d.querySelector('.hero__stamp');
    if (stamp) gsap.from(stamp, { scale: .6, autoAlpha: 0, duration: .9, delay: .5, ease: 'back.out(1.6)' });

    var steps = d.querySelector('.steps');
    if (steps && window.matchMedia('(min-width: 900px)').matches) {
      var line = steps.querySelector('.steps__line span');
      var items = steps.querySelectorAll('.step');
      if (line) {
        gsap.fromTo(line, { scaleX: 0 }, {
          scaleX: 1, ease: 'none',
          scrollTrigger: {
            trigger: steps, start: 'top 80%', end: 'bottom 60%', scrub: .5,
            onUpdate: function (self) { items.forEach(function (it, i) { it.classList.toggle('is-active', self.progress >= i / items.length + .02); }); }
          }
        });
      }
    }

    d.querySelectorAll('[data-count]').forEach(function (el) {
      var end = parseFloat(el.getAttribute('data-count')), node = el.firstChild, obj = { v: 0 };
      if (!node || node.nodeType !== 3) return;
      node.nodeValue = '0';
      gsap.to(obj, {
        v: end, duration: 1.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        onUpdate: function () { node.nodeValue = Math.round(obj.v).toLocaleString('en-AU'); }
      });
    });

    d.querySelectorAll('[data-parallax]').forEach(function (el) {
      gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  function showAll() {
    root.classList.remove('anim');
    d.querySelectorAll('[data-reveal], [data-hero-frame], .hero__stamp').forEach(function (el) {
      el.style.opacity = ''; el.style.visibility = ''; el.style.transform = ''; el.style.clipPath = '';
    });
  }
  function safe(fn, onFail) { try { fn(); } catch (err) { if (window.console) console.warn('[fixit] ' + (err && err.message)); if (onFail) onFail(); } }
  function boot() {
    safe(initSwipers); safe(initFancybox); safe(initMotion, showAll);
    // Last-resort guard: anything still invisible after the page has settled is shown.
    setTimeout(function () {
      d.querySelectorAll('[data-reveal]').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0 && parseFloat(getComputedStyle(el).opacity) < 0.05) { el.style.opacity = ''; el.style.visibility = ''; el.style.transform = ''; }
      });
    }, 3500);
  }
  window.addEventListener('error', function () { if (!window.gsap) showAll(); });
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot); else boot();
})();
