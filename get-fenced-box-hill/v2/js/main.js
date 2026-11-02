/* ==========================================================================
   Get Fenced Box Hill — V2
   Header, app bar, sheets, modal, accordion, sliders, lightbox, GSAP motion
   ========================================================================== */
(function () {
    'use strict';

    var root = document.documentElement;
    var body = document.body;
    var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
    var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = function () { return window.matchMedia('(max-width: 991px)').matches; };

    /* ── Year ─────────────────────────────────────────── */
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

    /* ── Header state + app bar auto-hide ─────────────── */
    var header = $('#header');
    var appbar = $('.appbar');
    var lastY = window.scrollY;
    var ticking = false;

    function onScroll() {
        var y = window.scrollY;
        header.classList.toggle('is-scrolled', y > 24);
        if (appbar) {
            var nearBottom = (window.innerHeight + y) >= (document.body.scrollHeight - 40);
            var hide = y > lastY && y > 400 && !nearBottom && !body.classList.contains('is-locked');
            appbar.classList.toggle('is-hidden', hide);
        }
        lastY = y;
        ticking = false;
    }
    window.addEventListener('scroll', function () {
        if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();

    /* ── Scroll spy (desktop nav + app bar) ───────────── */
    var spyLinks = $$('[data-spy]');
    var sections = $$('[data-section]');
    var spyMap = { home: 'home', about: 'home', services: 'services', why: 'services' };

    function setActive(id) {
        spyLinks.forEach(function (link) {
            var target = link.getAttribute('data-spy');
            var isAppbar = link.classList.contains('appbar__item');
            var match = isAppbar ? (spyMap[id] || null) === target : target === id;
            link.classList.toggle('is-active', match);
        });
    }

    if ('IntersectionObserver' in window && sections.length) {
        var spyObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) setActive(entry.target.getAttribute('data-section'));
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(function (s) { spyObserver.observe(s); });
    }

    /* ── Overlay helpers (sheet + modal) ──────────────── */
    var lastFocus = null;

    function lock(on) { body.classList.toggle('is-locked', on); }

    function openLayer(layer) {
        if (!layer) return;
        closeAll();
        lastFocus = document.activeElement;
        layer.classList.add('is-open');
        layer.setAttribute('aria-hidden', 'false');
        lock(true);
        if (appbar) appbar.classList.remove('is-hidden');
        var focusable = layer.querySelector('input, button, a[href]');
        if (focusable) window.setTimeout(function () { focusable.focus({ preventScroll: true }); }, 350);
    }

    function closeLayer(layer) {
        if (!layer || !layer.classList.contains('is-open')) return;
        layer.classList.remove('is-open');
        layer.setAttribute('aria-hidden', 'true');
        lock(false);
        $$('[data-sheet-open]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
        if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }

    function closeAll() {
        $$('.sheet.is-open, .modal.is-open').forEach(function (l) {
            l.classList.remove('is-open');
            l.setAttribute('aria-hidden', 'true');
        });
        lock(false);
    }

    var sheet = $('#menuSheet');
    var modal = $('#quoteModal');

    $$('[data-sheet-open]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (sheet.classList.contains('is-open')) { closeLayer(sheet); return; }
            openLayer(sheet);
            btn.setAttribute('aria-expanded', 'true');
        });
    });
    $$('[data-sheet-close]').forEach(function (el) {
        el.addEventListener('click', function () { closeLayer(sheet); });
    });

    $$('[data-modal-open]').forEach(function (btn) {
        btn.addEventListener('click', function () { openLayer(modal); });
    });
    $$('[data-modal-close]').forEach(function (el) {
        el.addEventListener('click', function () { closeLayer(modal); });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeLayer(modal); closeLayer(sheet); }
    });

    // Swipe-down to dismiss bottom sheets on touch devices
    $$('.sheet__panel, .modal__panel').forEach(function (panel) {
        var startY = 0, delta = 0, dragging = false;
        panel.addEventListener('touchstart', function (e) {
            if (!isMobile() || panel.scrollTop > 0) return;
            startY = e.touches[0].clientY; delta = 0; dragging = true;
            panel.style.transition = 'none';
        }, { passive: true });
        panel.addEventListener('touchmove', function (e) {
            if (!dragging) return;
            delta = Math.max(0, e.touches[0].clientY - startY);
            if (delta > 0) panel.style.transform = 'translateY(' + delta + 'px)';
        }, { passive: true });
        panel.addEventListener('touchend', function () {
            if (!dragging) return;
            dragging = false;
            panel.style.transition = '';
            panel.style.transform = '';
            if (delta > 110) closeLayer(panel.closest('.sheet, .modal'));
        });
    });

    /* ── Accordion ────────────────────────────────────── */
    $$('[data-accordion]').forEach(function (acc) {
        var items = $$('.acc', acc);

        function close(item) {
            var panel = $('.acc__panel', item);
            panel.style.height = panel.scrollHeight + 'px';
            void panel.offsetHeight;
            item.classList.remove('is-open');
            panel.style.height = '0px';
            $('.acc__trigger', item).setAttribute('aria-expanded', 'false');
        }

        function open(item) {
            var panel = $('.acc__panel', item);
            panel.style.height = '0px';
            item.classList.add('is-open');
            panel.style.height = panel.scrollHeight + 'px';
            $('.acc__trigger', item).setAttribute('aria-expanded', 'true');
            panel.addEventListener('transitionend', function done(e) {
                if (e.propertyName !== 'height') return;
                if (item.classList.contains('is-open')) panel.style.height = '';
                panel.removeEventListener('transitionend', done);
            });
        }

        items.forEach(function (item) {
            $('.acc__trigger', item).addEventListener('click', function () {
                var wasOpen = item.classList.contains('is-open');
                items.forEach(function (other) { if (other.classList.contains('is-open')) close(other); });
                if (!wasOpen) open(item);
            });
        });
    });

    /* ── Forms (demo handling) ────────────────────────── */
    $$('[data-form]').forEach(function (form) {
        var note = $('[data-form-note]', form);
        var original = note ? note.textContent : '';

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var valid = true;
            $$('[required]', form).forEach(function (input) {
                var ok = input.value.trim().length > 1;
                input.closest('.field').classList.toggle('is-invalid', !ok);
                if (!ok) valid = false;
            });
            if (!note) return;
            note.classList.remove('is-success', 'is-error');
            if (!valid) {
                note.textContent = 'Please add your name and phone so we can call you back.';
                note.classList.add('is-error');
                return;
            }
            note.textContent = 'Thanks! We’ll be in touch within one business day.';
            note.classList.add('is-success');
            form.reset();
            window.setTimeout(function () {
                note.textContent = original;
                note.classList.remove('is-success');
            }, 6000);
        });

        $$('input, textarea', form).forEach(function (input) {
            input.addEventListener('input', function () {
                var field = input.closest('.field');
                if (field) field.classList.remove('is-invalid');
            });
        });
    });

    /* ── Libraries (deferred CDN scripts) ─────────────── */
    function initSwiper() {
        if (typeof window.Swiper === 'undefined') return;

        new window.Swiper('.work-swiper', {
            slidesPerView: 'auto',
            spaceBetween: 20,
            grabCursor: true,
            speed: 700,
            freeMode: { enabled: true, momentumRatio: 0.6, sticky: false },
            navigation: { prevEl: '[data-work-prev]', nextEl: '[data-work-next]' },
            scrollbar: { el: '.work-progress', draggable: true },
            breakpoints: { 992: { spaceBetween: 24 } }
        });

        new window.Swiper('.reviews-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            grabCursor: true,
            speed: 700,
            rewind: true,
            autoplay: reduceMotion ? false : { delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true },
            pagination: { el: '.reviews-pagination', clickable: true },
            navigation: { prevEl: '[data-rev-prev]', nextEl: '[data-rev-next]' },
            breakpoints: { 640: { slidesPerView: 1.25 }, 1200: { slidesPerView: 1.35, spaceBetween: 24 } }
        });
    }

    function initFancybox() {
        if (typeof window.Fancybox === 'undefined') return;
        window.Fancybox.bind('[data-fancybox="work"]', {
            Thumbs: { type: 'classic' },
            Toolbar: { display: { left: ['infobar'], middle: [], right: ['slideshow', 'thumbs', 'close'] } },
            Hash: false
        });
    }

    function setCounters(final) {
        $$('[data-count]').forEach(function (el) {
            el.textContent = final ? el.getAttribute('data-count') : '0';
        });
    }

    function initMotion() {
        var gsap = window.gsap;
        var ST = window.ScrollTrigger;

        if (reduceMotion || !gsap || !ST) {
            root.classList.add('no-motion');
            setCounters(true);
            return;
        }

        gsap.registerPlugin(ST);
        gsap.defaults({ ease: 'power3.out' });

        // Hero intro
        var tl = gsap.timeline({ delay: 0.1 });
        tl.from('[data-hero-frame]', { clipPath: 'inset(12% 8% 12% 8% round 32px)', scale: 1.04, duration: 1.3, ease: 'expo.out' }, 0)
          .from('[data-hero-line]', { yPercent: 110, duration: 1, stagger: 0.1, ease: 'expo.out' }, 0.1)
          .fromTo('[data-hero]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.35)
          .fromTo('[data-hero-float]', { autoAlpha: 0, y: 30, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.12, ease: 'back.out(1.4)' }, 0.8);

        // Reveal on scroll (batched for staggering siblings)
        gsap.set('[data-reveal]', { autoAlpha: 0, y: 34 });
        ST.batch('[data-reveal]', {
            start: 'top 88%',
            once: true,
            onEnter: function (batch) {
                gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.08, overwrite: true });
            }
        });

        // Counters
        $$('[data-count]').forEach(function (el) {
            var end = parseFloat(el.getAttribute('data-count'));
            var obj = { v: 0 };
            el.textContent = '0';
            ST.create({
                trigger: el,
                start: 'top 92%',
                once: true,
                onEnter: function () {
                    gsap.to(obj, {
                        v: end, duration: end > 50 ? 2 : 1.4, ease: 'power2.out',
                        onUpdate: function () { el.textContent = Math.round(obj.v); }
                    });
                }
            });
        });

        // Parallax images
        $$('[data-parallax]').forEach(function (img) {
            gsap.to(img, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top top', end: 'bottom top', scrub: true } });
        });
        $$('[data-parallax-sm]').forEach(function (img) {
            gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
        });

        // Process line fill
        var fill = $('[data-steps-fill]');
        if (fill) {
            gsap.fromTo(fill, { scaleX: isMobile() ? 1 : 0, scaleY: isMobile() ? 0 : 1 }, {
                scaleX: 1, scaleY: 1, ease: 'none',
                scrollTrigger: { trigger: '.steps', start: 'top 75%', end: 'bottom 60%', scrub: 0.6 }
            });
        }

        // Make sure positions are right once images/fonts land
        window.addEventListener('load', function () { ST.refresh(); });
    }

    function boot() {
        initSwiper();
        initFancybox();
        initMotion();
    }

    // Deferred CDN scripts run before this one (all deferred, in order),
    // but guard in case something failed to load.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    // Safety net: never leave content hidden if an animation lib stalls
    window.setTimeout(function () {
        if (!window.gsap) { root.classList.add('no-motion'); setCounters(true); }
    }, 2500);
})();
