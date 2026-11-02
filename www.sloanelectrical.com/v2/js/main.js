/* ==========================================================================
   Sloan Electrical — V2
   ========================================================================== */
(function () {
    'use strict';

    var doc = document.documentElement;
    var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
    var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = function () { return window.matchMedia('(max-width: 991px)').matches; };
    var hasGsap = !!window.gsap && !reduceMotion;
    if (!hasGsap) doc.classList.add('no-gsap');

    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

    /* ---------- Header: scrolled / hide on scroll down ---------- */
    var header = $('#header'), appbar = $('#appbar');
    var lastY = window.scrollY;
    var onScroll = function () {
        var y = window.scrollY;
        header.classList.toggle('is-scrolled', y > 20);
        var down = y > lastY && y > 420;
        if (!isMobile()) header.classList.toggle('is-hidden', down);
        else header.classList.remove('is-hidden');
        if (appbar) appbar.classList.toggle('is-hidden', down && isMobile());
        lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Scroll spy (nav + app bar) ---------- */
    var navLinks = $$('.nav a[data-nav]');
    var spyTargets = ['top', 'services', 'why', 'process', 'commercial', 'work', 'area', 'reviews', 'emergency', 'faq', 'quote']
        .map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var setActive = function (id) {
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-nav') === id); });
        var tab = id === 'services' ? 'services' : (id === 'top' ? 'home' : null);
        $$('.appbar__item[data-appbar]').forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-appbar') === tab); });
    };
    if ('IntersectionObserver' in window) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
        }, { rootMargin: '-45% 0px -50% 0px' });
        spyTargets.forEach(function (s) { spy.observe(s); });
    }

    /* ---------- Body lock ---------- */
    var openLayers = 0;
    var lock = function () { openLayers++; document.body.classList.add('is-locked'); };
    var unlock = function () { openLayers = Math.max(0, openLayers - 1); if (!openLayers) document.body.classList.remove('is-locked'); };

    /* ---------- Quote modal ---------- */
    var modal = $('#quoteModal');
    var lastFocus = null;
    var openModal = function (service) {
        if (!modal || modal.classList.contains('is-open')) return;
        closeSheet();
        lastFocus = document.activeElement;
        if (service) {
            var sel = $('[data-service-select]', modal);
            if (sel) $$('option', sel).forEach(function (o) { if (o.textContent === service) sel.value = o.textContent; });
        }
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        lock();
        setTimeout(function () { var f = $('input', modal); if (f && !isMobile()) f.focus(); }, 350);
    };
    var closeModal = function () {
        if (!modal || !modal.classList.contains('is-open')) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        unlock();
        if (lastFocus) lastFocus.focus({ preventScroll: true });
    };
    $$('[data-modal-open]').forEach(function (btn) {
        btn.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); openModal(btn.getAttribute('data-service')); });
    });
    $$('[data-modal-close]').forEach(function (el) { el.addEventListener('click', closeModal); });

    /* ---------- Menu sheet ---------- */
    var sheet = $('#menuSheet'), sheetBtn = $('#appbarMenu');
    function openSheet() {
        if (!sheet || sheet.classList.contains('is-open')) return;
        sheet.classList.add('is-open');
        sheet.setAttribute('aria-hidden', 'false');
        if (sheetBtn) sheetBtn.setAttribute('aria-expanded', 'true');
        lock();
    }
    function closeSheet() {
        if (!sheet || !sheet.classList.contains('is-open')) return;
        sheet.classList.remove('is-open');
        sheet.setAttribute('aria-hidden', 'true');
        if (sheetBtn) sheetBtn.setAttribute('aria-expanded', 'false');
        unlock();
    }
    if (sheetBtn) sheetBtn.addEventListener('click', function () { sheet.classList.contains('is-open') ? closeSheet() : openSheet(); });
    $$('[data-sheet-close]').forEach(function (el) { el.addEventListener('click', closeSheet); });
    $$('.sheet__grid a, .sheet__call').forEach(function (a) { a.addEventListener('click', closeSheet); });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeModal(); closeSheet(); }
    });

    // Swipe down to dismiss bottom sheets
    var dragClose = function (panel, close) {
        if (!panel) return;
        var startY = null, dy = 0;
        panel.addEventListener('touchstart', function (e) {
            if (panel.scrollTop > 0) return;
            startY = e.touches[0].clientY; dy = 0; panel.style.transition = 'none';
        }, { passive: true });
        panel.addEventListener('touchmove', function (e) {
            if (startY === null) return;
            dy = Math.max(0, e.touches[0].clientY - startY);
            panel.style.transform = 'translateY(' + dy + 'px)';
        }, { passive: true });
        panel.addEventListener('touchend', function () {
            if (startY === null) return;
            panel.style.transition = ''; panel.style.transform = '';
            if (dy > 90) close();
            startY = null;
        });
    };
    dragClose($('.sheet__panel'), closeSheet);
    if (modal) dragClose($('.modal__panel', modal), function () { if (isMobile()) closeModal(); });

    /* ---------- Quote forms (client-side only) ---------- */
    $$('[data-quote-form]').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var ok = true;
            $$('[required]', form).forEach(function (input) {
                var bad = !input.value.trim();
                input.closest('.field').classList.toggle('is-invalid', bad);
                if (bad) ok = false;
            });
            if (!ok) return;
            $('.qform__ok', form).hidden = false;
            form.reset();
        });
        form.addEventListener('input', function (e) {
            var f = e.target.closest('.field');
            if (f && e.target.value.trim()) f.classList.remove('is-invalid');
        });
    });

    /* ---------- FAQ accordion ---------- */
    $$('.acc').forEach(function (item) {
        var q = $('.acc__q', item);
        q.addEventListener('click', function () {
            var open = !item.classList.contains('is-open');
            $$('.acc').forEach(function (o) {
                o.classList.remove('is-open');
                $('.acc__q', o).setAttribute('aria-expanded', 'false');
            });
            if (open) { item.classList.add('is-open'); q.setAttribute('aria-expanded', 'true'); }
        });
    });

    /* ---------- Melbourne clock ---------- */
    var clockEls = $$('[data-clock]'), clockLong = $('[data-clock-long]');
    var tick = function () {
        var t;
        try {
            t = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Melbourne', hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date());
        } catch (e) { return; }
        t = t.replace(/\s/g, '').toLowerCase();
        clockEls.forEach(function (el) { el.textContent = 'Melbourne \u00b7 ' + t; });
        if (clockLong) clockLong.textContent = 'It’s ' + t + ' in Melbourne — the line is open.';
    };
    tick();
    setInterval(tick, 30000);

    /* ---------- Hero: hover spotlight (CSS vars only) ---------- */
    var hero = $('[data-hero]');
    if (hero && window.matchMedia('(pointer: fine)').matches) {
        hero.addEventListener('mousemove', function (ev) {
            var r = hero.getBoundingClientRect();
            hero.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
            hero.style.setProperty('--my', (ev.clientY - r.top) + 'px');
        });
    }

    /* ---------- Service pillars ---------- */
    var pillars = $$('.pillar');
    var activatePillar = function (p) {
        if (isMobile() || p.classList.contains('is-active')) return;
        pillars.forEach(function (o) { o.classList.toggle('is-active', o === p); });
    };
    pillars.forEach(function (p) {
        p.addEventListener('mouseenter', function () { activatePillar(p); });
        p.addEventListener('click', function () { activatePillar(p); });
        p.addEventListener('focus', function () { activatePillar(p); });
    });

    /* ---------- Service area map ---------- */
    var lgaBtns = $$('[data-lga]'), regions = $$('.map__r'), lgaOut = $('[data-lga-out]');
    var setLga = function (key) {
        lgaBtns.forEach(function (b) {
            var on = b.getAttribute('data-lga') === key;
            b.classList.toggle('is-active', on);
            b.setAttribute('aria-selected', on ? 'true' : 'false');
            if (on && lgaOut) lgaOut.textContent = $('b', b).textContent + ' · ' + $('span', b).textContent.split(' · ')[0];
        });
        regions.forEach(function (r) { r.classList.toggle('is-active', r.getAttribute('data-region') === key); });
    };
    lgaBtns.forEach(function (b) {
        b.addEventListener('click', function () { setLga(b.getAttribute('data-lga')); });
        b.addEventListener('mouseenter', function () { if (!isMobile()) setLga(b.getAttribute('data-lga')); });
    });
    regions.forEach(function (r) { r.addEventListener('click', function () { setLga(r.getAttribute('data-region')); }); });

    /* ---------- Swiper ---------- */
    if (window.Swiper) {
        new Swiper('.work-swiper', {
            slidesPerView: 1.15,
            spaceBetween: 14,
            grabCursor: true,
            speed: 750,
            navigation: { prevEl: '.work-prev', nextEl: '.work-next' },
            pagination: { el: '.work-pagination', clickable: true },
            breakpoints: {
                560: { slidesPerView: 1.8, spaceBetween: 16 },
                768: { slidesPerView: 2.4, spaceBetween: 18 },
                1200: { slidesPerView: 3.3, spaceBetween: 22 }
            }
        });
        new Swiper('.reviews-swiper', {
            slidesPerView: 1,
            spaceBetween: 14,
            grabCursor: true,
            speed: 750,
            autoplay: reduceMotion ? false : { delay: 6500, disableOnInteraction: true },
            navigation: { prevEl: '.reviews-prev', nextEl: '.reviews-next' },
            pagination: { el: '.reviews-pagination', clickable: true },
            breakpoints: {
                768: { slidesPerView: 1.6, spaceBetween: 18 },
                1200: { slidesPerView: 2.2, spaceBetween: 22 }
            }
        });
    }

    /* ---------- Fancybox ---------- */
    if (window.Fancybox) {
        Fancybox.bind('[data-fancybox="work"]', {
            Hash: false,
            Thumbs: { type: 'classic' },
            Toolbar: { display: { left: ['infobar'], middle: [], right: ['slideshow', 'fullscreen', 'close'] } }
        });
    }

    /* ---------- GSAP ---------- */
    if (!hasGsap) return;
    var ST = window.ScrollTrigger;
    if (ST) gsap.registerPlugin(ST);

    // Hero intro: headline rises → current line draws → triptych slices unmask → glass panels settle.
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.header__bar', { y: -20, opacity: 0, duration: 1 }, .1)
      .to('.hero__title .line > span', { y: 0, duration: 1.4, stagger: .14 }, .15)
      .to('.hero__anim', { opacity: 1, duration: 1, stagger: .1 }, .45)
      .from('.hero__anim', { y: 22, duration: 1.1, stagger: .1 }, .45)
      .to('.current__base', { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, .6)
      .fromTo('.slice', { clipPath: 'inset(100% 0% 0% 0% round 36px)' }, { clipPath: 'inset(0% 0% 0% 0% round 36px)', duration: 1.5, stagger: .14, ease: 'expo.inOut' }, .7)
      .fromTo('.slice__img img', { scale: 1.35 }, { scale: 1, duration: 2.2, stagger: .14, ease: 'expo.out' }, .9)
      .fromTo('.glass', { opacity: 0, scale: .92 }, { opacity: 1, scale: 1, duration: 1.2, stagger: .15, ease: 'back.out(1.4)' }, 1.6)
      .add(function () { gsap.set('.slice', { clearProps: 'clipPath' }); });

    // Safety net: never leave hero content hidden.
    setTimeout(function () {
        gsap.set('.hero__title .line > span', { y: 0 });
        gsap.set('.hero__anim, .glass', { opacity: 1 });
        gsap.set('.current__base', { strokeDashoffset: 0 });
        gsap.set('.slice', { clipPath: 'none' });
    }, 4200);

    // Magnetic CTAs + glass depth (desktop pointer only)
    if (!isMobile() && window.matchMedia('(pointer: fine)').matches) {
        $$('.hero__magnet').forEach(function (btn) {
            var xTo = gsap.quickTo(btn, 'x', { duration: .5, ease: 'power3.out' });
            var yTo = gsap.quickTo(btn, 'y', { duration: .5, ease: 'power3.out' });
            btn.addEventListener('mousemove', function (ev) {
                var r = btn.getBoundingClientRect();
                xTo((ev.clientX - r.left - r.width / 2) * .22);
                yTo((ev.clientY - r.top - r.height / 2) * .32);
            });
            btn.addEventListener('mouseleave', function () { xTo(0); yTo(0); });
        });
        var stage = $('[data-stage]');
        var layers = $$('[data-depth]').map(function (el) {
            return { d: parseFloat(el.getAttribute('data-depth')), x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3.out' }) };
        });
        stage.addEventListener('mousemove', function (ev) {
            var r = stage.getBoundingClientRect();
            var nx = (ev.clientX - r.left) / r.width - .5, ny = (ev.clientY - r.top) / r.height - .5;
            layers.forEach(function (l) { l.x(nx * l.d); l.y(ny * l.d); });
        });
        stage.addEventListener('mouseleave', function () { layers.forEach(function (l) { l.x(0); l.y(0); }); });
    }

    if (!ST) { gsap.set('.reveal', { opacity: 1, y: 0 }); return; }

    // Triptych depth on scroll (wrapper yPercent — the img itself only carries the intro scale)
    $$('.slice__img').forEach(function (w, i) {
        gsap.fromTo(w, { yPercent: 0 }, { yPercent: [6, 10, 4][i] || 6, ease: 'none', scrollTrigger: { trigger: '.hero__stage', start: 'top 70%', end: 'bottom top', scrub: true } });
    });

    // Reveals
    ST.batch('.reveal', {
        start: 'top 90%',
        once: true,
        onEnter: function (batch) { gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: .08, overwrite: true }); }
    });

    // Counters
    $$('[data-count]').forEach(function (el) {
        var end = parseInt(el.getAttribute('data-count'), 10), obj = { v: 0 };
        el.textContent = '0';
        ST.create({
            trigger: el, start: 'top 92%', once: true,
            onEnter: function () { gsap.to(obj, { v: end, duration: 2, ease: 'power3.out', onUpdate: function () { el.textContent = Math.round(obj.v); } }); }
        });
    });

    // Process line fills on scroll
    var line = $('.steps__line i');
    if (line) {
        gsap.fromTo(line, { '--progress': 0 }, {
            '--progress': 1, ease: 'none',
            scrollTrigger: { trigger: '.steps', start: 'top 75%', end: 'bottom 60%', scrub: true }
        });
    }

    // Parallax images
    $$('[data-parallax]').forEach(function (img) {
        gsap.fromTo(img, { yPercent: -6 }, {
            yPercent: 0, ease: 'none',
            scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true }
        });
    });

    window.addEventListener('load', function () { ST.refresh(); });
})();
