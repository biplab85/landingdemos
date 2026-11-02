/* Showtime Roofing — V2 interactions */
(function () {
    'use strict';

    var doc = document;
    var $ = function (s, ctx) { return (ctx || doc).querySelector(s); };
    var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(s)); };
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = function () { return window.matchMedia('(max-width: 991px)').matches; };

    /* ── Header shadow + app bar hide-on-scroll-down ─────────────────── */
    var header = $('#header');
    var appbar = $('#appbar');
    var lastY = window.scrollY;
    function onScroll() {
        var y = window.scrollY;
        header.classList.toggle('is-scrolled', y > 10);
        if (appbar) {
            var down = y > lastY && y > 400;
            var nearBottom = window.innerHeight + y >= doc.documentElement.scrollHeight - 40;
            appbar.classList.toggle('is-hidden', down && !nearBottom && Math.abs(y - lastY) > 4);
        }
        lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ── Scroll spy (desktop nav + app bar tabs) ─────────────────────── */
    var spyTargets = $$('[data-spy]');
    if ('IntersectionObserver' in window) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                var id = e.target.getAttribute('data-spy');
                $$('[data-spy-link]').forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-spy-link') === id); });
                var tabId = id === 'services' ? 'services' : (id === 'home' ? 'home' : null);
                $$('[data-spy-tab]').forEach(function (t) { t.classList.toggle('is-active', t.getAttribute('data-spy-tab') === tabId); });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        spyTargets.forEach(function (s) { spy.observe(s); });
    }

    /* ── Overlays: modal + bottom sheet ──────────────────────────────── */
    var lastFocus = null;
    function lock(on) { doc.body.classList.toggle('is-locked', on); }

    function openModal(id, service) {
        var m = doc.getElementById(id);
        if (!m) return;
        closeSheet();
        lastFocus = doc.activeElement;
        if (service) {
            var sel = $('[data-service-select]', m);
            if (sel) $$('option', sel).forEach(function (o) { if (o.textContent.trim() === service) sel.value = o.value; });
        }
        m.classList.add('is-open');
        m.setAttribute('aria-hidden', 'false');
        lock(true);
        setTimeout(function () { var f = $('input', m); if (f && !isMobile()) f.focus(); }, 350);
    }
    function closeModal(m) {
        if (!m) return;
        m.classList.remove('is-open');
        m.setAttribute('aria-hidden', 'true');
        lock(false);
        if (lastFocus) lastFocus.focus({ preventScroll: true });
    }

    var sheet = $('#menuSheet');
    var sheetBtn = $('#sheetOpen');
    function openSheet() {
        if (!sheet) return;
        sheet.classList.add('is-open');
        sheet.setAttribute('aria-hidden', 'false');
        sheetBtn.setAttribute('aria-expanded', 'true');
        lock(true);
    }
    function closeSheet() {
        if (!sheet || !sheet.classList.contains('is-open')) return;
        sheet.classList.remove('is-open');
        sheet.setAttribute('aria-hidden', 'true');
        sheetBtn.setAttribute('aria-expanded', 'false');
        lock(false);
    }

    doc.addEventListener('click', function (e) {
        var opener = e.target.closest('[data-modal-open]');
        if (opener) { e.preventDefault(); openModal(opener.getAttribute('data-modal-open'), opener.getAttribute('data-service')); return; }
        if (e.target.closest('[data-modal-close]')) { closeModal(e.target.closest('.modal')); return; }
        if (e.target.closest('#sheetOpen')) { sheet.classList.contains('is-open') ? closeSheet() : openSheet(); return; }
        if (e.target.closest('[data-sheet-close]')) closeSheet();
    });
    doc.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        closeModal($('.modal.is-open'));
        closeSheet();
    });

    /* Swipe-down to dismiss the bottom sheet */
    if (sheet) {
        var panel = $('.sheet__panel', sheet), startY = null, dy = 0;
        panel.addEventListener('touchstart', function (e) { if (panel.scrollTop <= 0) startY = e.touches[0].clientY; }, { passive: true });
        panel.addEventListener('touchmove', function (e) {
            if (startY === null) return;
            dy = Math.max(0, e.touches[0].clientY - startY);
            panel.style.transition = 'none';
            panel.style.transform = 'translateY(' + dy + 'px)';
        }, { passive: true });
        panel.addEventListener('touchend', function () {
            panel.style.transition = '';
            panel.style.transform = '';
            if (dy > 90) closeSheet();
            startY = null; dy = 0;
        });
    }

    /* ── Quote forms (front-end only demo) ───────────────────────────── */
    $$('[data-quote-form]').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var ok = true;
            $$('[required]', form).forEach(function (input) {
                var valid = input.value.trim() !== '' && (input.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
                input.closest('.field').classList.toggle('is-invalid', !valid);
                if (!valid) ok = false;
            });
            if (!ok) { var bad = $('.is-invalid input', form); if (bad) bad.focus(); return; }
            var done = $('.qform__done', form);
            done.hidden = false;
            if (window.gsap && !reduced) gsap.from(done.children, { y: 16, opacity: 0, stagger: .08, duration: .5, ease: 'power3.out' });
            setTimeout(function () { form.reset(); done.hidden = true; var m = form.closest('.modal'); if (m) closeModal(m); }, 3800);
        });
        $$('input', form).forEach(function (i) { i.addEventListener('input', function () { i.closest('.field').classList.remove('is-invalid'); }); });
    });

    /* ── FAQ accordion ───────────────────────────────────────────────── */
    $$('.acc__btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var item = btn.closest('.acc');
            var open = !item.classList.contains('is-open');
            $$('.acc', item.parentNode).forEach(function (a) { a.classList.remove('is-open'); $('.acc__btn', a).setAttribute('aria-expanded', 'false'); });
            item.classList.toggle('is-open', open);
            btn.setAttribute('aria-expanded', String(open));
        });
    });

    /* ── Before / after compare ──────────────────────────────────────── */
    $$('.compare').forEach(function (c) {
        var range = $('input[type=range]', c);
        range.addEventListener('input', function () { c.style.setProperty('--pos', range.value + '%'); });
    });

    /* ── Gallery filter ──────────────────────────────────────────────── */
    $$('[data-filter]').forEach(function (chip) {
        chip.addEventListener('click', function () {
            var f = chip.getAttribute('data-filter');
            $$('[data-filter]').forEach(function (c) { c.classList.toggle('is-active', c === chip); });
            var tiles = $$('.gallery .tile');
            tiles.forEach(function (t) { t.classList.toggle('is-hidden', f !== 'all' && t.getAttribute('data-cat') !== f); });
            if (window.gsap && !reduced) gsap.fromTo(tiles.filter(function (t) { return !t.classList.contains('is-hidden'); }), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .5, stagger: .05, ease: 'power3.out' });
            if (window.ScrollTrigger) ScrollTrigger.refresh();
        });
    });

    /* ── Libraries (deferred CDN scripts) ────────────────────────────── */
    function initLibraries() {
        /* Fancybox */
        if (window.Fancybox) {
            Fancybox.bind('[data-fancybox="work"]', {
                Thumbs: { type: 'classic' },
                Toolbar: { display: { left: ['infobar'], middle: [], right: ['slideshow', 'thumbs', 'close'] } }
            });
        }

        /* Swiper */
        if (window.Swiper) {
            var count = $('.hero__count');
            var bar = $('.hero__bar i');
            var restartBar = function () { if (!bar) return; bar.classList.remove('is-running'); void bar.offsetWidth; bar.classList.add('is-running'); };
            new Swiper('.hero-swiper', {
                effect: 'fade', fadeEffect: { crossFade: true }, loop: true, speed: 1400, allowTouchMove: false,
                autoplay: reduced ? false : { delay: 6000, disableOnInteraction: false },
                on: {
                    init: restartBar,
                    slideChange: function (s) { if (count) count.textContent = ('0' + (s.realIndex + 1)).slice(-2); restartBar(); }
                }
            });
            new Swiper('.reviews-swiper', {
                slidesPerView: 1.08, spaceBetween: 14, grabCursor: true, speed: 700,
                autoplay: reduced ? false : { delay: 5500, pauseOnMouseEnter: true, disableOnInteraction: false },
                navigation: { prevEl: '.rv-prev', nextEl: '.rv-next' },
                pagination: { el: '.reviews-pagination', clickable: true },
                breakpoints: { 640: { slidesPerView: 1.6, spaceBetween: 18 }, 992: { slidesPerView: 2.4, spaceBetween: 22 }, 1240: { slidesPerView: 3, spaceBetween: 24 } }
            });
        }

        /* GSAP */
        var revealEls = $$('[data-reveal]');
        if (!window.gsap || !window.ScrollTrigger || reduced) {
            revealEls.forEach(function (el) { el.style.opacity = 1; });
            $$('[data-count]').forEach(function (el) { el.textContent = formatCount(parseFloat(el.dataset.count), +(el.dataset.decimals || 0)); });
            var line = $('.steps__line i'); if (line) line.style.transform = 'none';
            return;
        }
        gsap.registerPlugin(ScrollTrigger);

        /* Hero intro */
        var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.from('.hero__title .line > span', { yPercent: 110, duration: 1.2, stagger: .12 })
          .from('.hero__eyebrow', { opacity: 0, y: 14, duration: .8 }, 0.1)
          .from('.hero__lead, .hero__ctas, .hero__ticks', { opacity: 0, y: 24, duration: .9, stagger: .1 }, 0.5)
          .from('.hero__card', { opacity: 0, y: 40, scale: .96, duration: 1.1 }, 0.7)
          .from('.hero__foot', { opacity: 0, duration: .8 }, 1);

        /* Hero content drifts on scroll */
        gsap.to('.hero__content', { yPercent: -12, opacity: .35, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

        /* Generic reveals */
        ScrollTrigger.batch(revealEls, {
            start: 'top 88%', once: true,
            onEnter: function (batch) { gsap.fromTo(batch, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, stagger: .09, ease: 'power3.out', overwrite: true }); }
        });

        /* Parallax images */
        $$('[data-parallax]').forEach(function (img) {
            gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
        });

        /* Gallery tiles */
        gsap.from('.gallery .tile', { opacity: 0, y: 50, scale: .96, duration: 1, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.gallery', start: 'top 85%', once: true } });

        /* Process line */
        var stepsLine = $('.steps__line i');
        if (stepsLine) {
            gsap.to(stepsLine, { scaleX: 1, scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 75%', end: 'bottom 60%', scrub: true } });
        }

        /* Counters */
        $$('[data-count]').forEach(function (el) {
            var target = parseFloat(el.dataset.count), dec = +(el.dataset.decimals || 0), obj = { v: 0 };
            ScrollTrigger.create({
                trigger: el, start: 'top 90%', once: true,
                onEnter: function () { gsap.to(obj, { v: target, duration: 2.2, ease: 'power2.out', onUpdate: function () { el.textContent = formatCount(obj.v, dec); } }); }
            });
        });

        /* Why badge float */
        gsap.to('.why__badge', { y: -14, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });

        window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    }

    function formatCount(v, dec) {
        return dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-AU');
    }

    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', initLibraries);
    else initLibraries();
})();
