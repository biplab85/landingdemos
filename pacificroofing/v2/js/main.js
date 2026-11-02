/* ==========================================================================
   Pacific Roofing — V2
   ========================================================================== */
(function () {
    'use strict';

    var doc = document.documentElement;
    var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
    var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = function () { return window.matchMedia('(max-width: 991px)').matches; };

    /* ---------- Year ---------- */
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

    /* ---------- Header + app bar on scroll ---------- */
    var hdr = $('#hdr'), appbar = $('#appbar');
    var lastY = window.scrollY, ticking = false;
    var onScroll = function () {
        var y = window.scrollY;
        hdr.classList.toggle('is-scrolled', y > 40);
        var down = y > lastY && y > 400;
        if (!isMobile()) hdr.classList.toggle('is-hidden', down);
        if (appbar) appbar.classList.toggle('is-hidden', down && !document.body.classList.contains('is-locked'));
        lastY = y;
        ticking = false;
    };
    window.addEventListener('scroll', function () {
        if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();

    /* ---------- Scroll spy (desktop nav + app bar) ---------- */
    var spySections = $$('section[id]');
    var navLinks = $$('.nav a[data-nav]');
    var tabs = $$('.appbar__item[data-tab]');
    if ('IntersectionObserver' in window) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (!en.isIntersecting) return;
                var id = en.target.id;
                navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-nav') === id); });
                var tab = id === 'services' ? 'services' : (id === 'top' ? 'home' : null);
                tabs.forEach(function (t) { t.classList.toggle('is-active', t.getAttribute('data-tab') === tab); });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        spySections.forEach(function (s) { spy.observe(s); });
    }

    /* ---------- Overlay helpers (modal + sheet) ---------- */
    var openCount = 0;
    var lock = function () { openCount++; document.body.classList.add('is-locked'); };
    var unlock = function () { openCount = Math.max(0, openCount - 1); if (!openCount) document.body.classList.remove('is-locked'); };

    var addSwipeClose = function (panel, close) {
        var startY = null, dy = 0;
        panel.addEventListener('touchstart', function (e) {
            if (panel.scrollTop > 0) { startY = null; return; }
            startY = e.touches[0].clientY; dy = 0;
        }, { passive: true });
        panel.addEventListener('touchmove', function (e) {
            if (startY === null) return;
            dy = e.touches[0].clientY - startY;
            if (dy > 0) { panel.style.transition = 'none'; panel.style.transform = 'translateY(' + dy + 'px)'; }
        }, { passive: true });
        panel.addEventListener('touchend', function () {
            if (startY === null) return;
            panel.style.transition = ''; panel.style.transform = '';
            if (dy > 110) close();
            startY = null;
        });
    };

    /* Sheet */
    var sheet = $('#sheet'), sheetBtn = $('[data-sheet-open]');
    var openSheet = function () {
        if (sheet.classList.contains('is-open')) return;
        sheet.classList.add('is-open'); sheet.setAttribute('aria-hidden', 'false');
        if (sheetBtn) sheetBtn.setAttribute('aria-expanded', 'true');
        lock();
    };
    var closeSheet = function () {
        if (!sheet.classList.contains('is-open')) return;
        sheet.classList.remove('is-open'); sheet.setAttribute('aria-hidden', 'true');
        if (sheetBtn) sheetBtn.setAttribute('aria-expanded', 'false');
        unlock();
    };
    if (sheet) {
        if (sheetBtn) sheetBtn.addEventListener('click', openSheet);
        $$('[data-sheet-close]', sheet).forEach(function (el) { el.addEventListener('click', closeSheet); });
        $$('.sheet__nav a', sheet).forEach(function (a) { a.addEventListener('click', closeSheet); });
        addSwipeClose($('.sheet__panel', sheet), closeSheet);
    }

    /* Modal */
    var modal = $('#quote'), lastFocus = null;
    var serviceSelect = modal ? $('[data-service-select]', modal) : null;
    var openModal = function (service) {
        if (!modal || modal.classList.contains('is-open')) return;
        closeSheet();
        lastFocus = document.activeElement;
        if (serviceSelect && service) {
            $$('option', serviceSelect).forEach(function (o) { if (o.textContent.trim() === service) serviceSelect.value = o.value || o.textContent; });
        }
        modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false');
        lock();
        setTimeout(function () { var f = $('input', modal); if (f && !isMobile()) f.focus(); }, 350);
    };
    var closeModal = function () {
        if (!modal || !modal.classList.contains('is-open')) return;
        modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true');
        unlock();
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    $$('[data-modal-open]').forEach(function (btn) {
        btn.addEventListener('click', function (e) { e.preventDefault(); openModal(btn.getAttribute('data-service')); });
    });
    if (modal) {
        $$('[data-modal-close]', modal).forEach(function (el) { el.addEventListener('click', closeModal); });
        addSwipeClose($('.modal__panel', modal), closeModal);
    }
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeModal(); closeSheet(); }
    });

    /* ---------- Forms (front-end only, like V1) ---------- */
    $$('form[data-form]').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var ok = true;
            $$('[required]', form).forEach(function (input) {
                var valid = input.value.trim() !== '' && (input.type !== 'email' || /\S+@\S+\.\S+/.test(input.value));
                var field = input.closest('.field');
                if (field) field.classList.toggle('is-error', !valid);
                if (!valid) ok = false;
            });
            if (!ok) { var bad = $('.is-error input, .is-error textarea', form) || $('[required]', form); if (bad) bad.focus(); return; }
            var done = form.nextElementSibling;
            form.hidden = true;
            if (done && done.classList.contains('form-done')) done.hidden = false;
        });
        form.addEventListener('input', function (e) {
            var field = e.target.closest('.field');
            if (field) field.classList.remove('is-error');
        });
    });

    /* ---------- FAQ ---------- */
    var qas = $$('.qa');
    qas.forEach(function (qa) {
        var btn = $('.qa__q', qa);
        btn.addEventListener('click', function () {
            var open = !qa.classList.contains('is-open');
            qas.forEach(function (o) { o.classList.remove('is-open'); $('.qa__q', o).setAttribute('aria-expanded', 'false'); });
            qa.classList.toggle('is-open', open);
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    });

    /* ---------- Hero slideshow (CSS crossfade + Ken Burns) ---------- */
    var slides = $$('.hero__slide');
    var slideNum = $('[data-slide-num]'), slideCap = $('[data-slide-cap]'), countBar = $('.hero__count-bar i');
    var caps = ['New tile install', 'Terracotta tiled gable'];
    var SLIDE_DUR = 6500, si = 0;
    if (countBar) countBar.parentNode.parentNode.style.setProperty('--slide-dur', SLIDE_DUR + 'ms');
    var runBar = function () {
        if (!countBar) return;
        countBar.classList.remove('is-run'); void countBar.offsetWidth; countBar.classList.add('is-run');
    };
    if (slides.length > 1 && !reduceMotion) {
        runBar();
        setInterval(function () {
            slides[si].classList.remove('is-active');
            si = (si + 1) % slides.length;
            slides[si].classList.add('is-active');
            if (slideNum) slideNum.textContent = '0' + (si + 1);
            if (slideCap) slideCap.textContent = caps[si] || '';
            runBar();
        }, SLIDE_DUR);
    }

    /* ---------- Swiper ---------- */
    if (window.Swiper) {
        new Swiper('.proj-swiper', {
            slidesPerView: 1.12,
            spaceBetween: 16,
            grabCursor: true,
            speed: 800,
            navigation: { prevEl: '.proj-prev', nextEl: '.proj-next' },
            breakpoints: {
                640: { slidesPerView: 1.6, spaceBetween: 20 },
                992: { slidesPerView: 2.35, spaceBetween: 28 },
                1280: { slidesPerView: 2.8, spaceBetween: 32 }
            }
        });
        new Swiper('.rev-swiper', {
            slidesPerView: 1.06,
            spaceBetween: 16,
            grabCursor: true,
            speed: 700,
            autoHeight: false,
            autoplay: reduceMotion ? false : { delay: 6000, disableOnInteraction: true, pauseOnMouseEnter: true },
            navigation: { prevEl: '.rev-prev', nextEl: '.rev-next' },
            pagination: { el: '.rev-pagination', clickable: true },
            breakpoints: {
                640: { slidesPerView: 1.4, spaceBetween: 20 },
                992: { slidesPerView: 1.6, spaceBetween: 24 },
                1280: { slidesPerView: 2, spaceBetween: 24 }
            }
        });
    }

    /* ---------- Fancybox ---------- */
    if (window.Fancybox) {
        Fancybox.bind('[data-fancybox]', {
            Hash: false,
            Thumbs: { type: 'classic' },
            Toolbar: { display: { left: ['infobar'], middle: [], right: ['slideshow', 'fullscreen', 'close'] } }
        });
    }

    /* ---------- Gable aperture renderer ---------- */
    var stage = $('[data-stage]');
    var aperture = $('[data-aperture]');
    var outMain = $('.hero__outline-main'), outEcho = $('.hero__outline-echo');
    var ap = { rise: 1, open: 0 };
    var renderAperture = function () {
        if (!aperture) return;
        var side = (isMobile() ? 4 : 6) * (1 - ap.open);
        var L = side, R = 100 - side;
        var shoulder = 100 - ap.rise * (100 - 46);          // 100 → 46 while rising
        shoulder = shoulder * (1 - ap.open);                 // 46 → 0 while opening
        var peak = 100 - ap.rise * 100;                       // 100 → 0 while rising
        aperture.style.clipPath = 'polygon(' + L + '% 100%, ' + L + '% ' + shoulder + '%, 50% ' + peak + '%, ' + R + '% ' + shoulder + '%, ' + R + '% 100%)';
        var d = 'M' + L + ' ' + shoulder + ' L50 ' + peak + ' L' + R + ' ' + shoulder;
        if (outMain) outMain.setAttribute('d', d);
        if (outEcho) outEcho.setAttribute('d', d);
        if (stage) stage.style.setProperty('--open', ap.open);
    };
    renderAperture();
    window.addEventListener('resize', renderAperture);

    /* ---------- GSAP ---------- */
    var reveals = $$('.reveal');
    if (!window.gsap || reduceMotion) {
        doc.classList.add('no-gsap');
        return;
    }
    var gsap = window.gsap;
    var ST = window.ScrollTrigger;
    if (ST) gsap.registerPlugin(ST);

    // Safety net: if anything stalls, never leave content hidden.
    setTimeout(function () {
        reveals.forEach(function (el) { if (getComputedStyle(el).opacity === '0' && el.getBoundingClientRect().top < window.innerHeight) gsap.to(el, { opacity: 1, y: 0, duration: .6 }); });
    }, 4000);

    // Hero intro: roofline rises into a gable, then copy reveals
    ap.rise = 0; renderAperture();
    gsap.set([outMain, outEcho], { strokeDasharray: 1, strokeDashoffset: 1 });
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hdr__in', { y: -24, opacity: 0, duration: 1 }, 0)
      .fromTo('.hero__eyebrow', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, .1)
      .to('.hero__title .ln > span', { y: 0, duration: 1.4, stagger: .12 }, .15)
      .fromTo('.hero__lead', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, .55)
      .fromTo('.hero__ctas', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, .68)
      .to(ap, { rise: 1, duration: 1.8, ease: 'expo.inOut', onUpdate: renderAperture }, .3)
      .to(outMain, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 1.1)
      .to(outEcho, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 1.35)
      .from('.hero__badge', { y: 20, opacity: 0, duration: 1 }, 1.6)
      .from('.hero__count', { opacity: 0, duration: 1 }, 1.8);

    if (!ST) {
        gsap.set(reveals, { opacity: 1, y: 0 });
        return;
    }

    // Aperture opens from gable to full-bleed as the hero scrolls away
    tl.eventCallback('onComplete', function () {
        gsap.set([outMain, outEcho], { clearProps: 'strokeDasharray,strokeDashoffset' });
        gsap.to(ap, {
            open: 1, ease: 'none', onUpdate: renderAperture,
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 25%', scrub: .6 }
        });
        gsap.to('.hero__outline', {
            opacity: 0, ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: '35% top', scrub: true }
        });
        ST.refresh();
    });

    // Reveal on scroll
    ST.batch(reveals, {
        start: 'top 90%',
        once: true,
        onEnter: function (batch) {
            gsap.to(batch, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: .09, overwrite: true });
        }
    });

    // Counters
    $$('[data-count]').forEach(function (el) {
        var end = parseInt(el.getAttribute('data-count'), 10), obj = { v: 0 };
        el.textContent = '0';
        ST.create({
            trigger: el, start: 'top 92%', once: true,
            onEnter: function () {
                gsap.to(obj, { v: end, duration: 2.2, ease: 'power3.out', onUpdate: function () { el.textContent = Math.round(obj.v); } });
            }
        });
    });

    // Parallax images
    $$('[data-parallax]').forEach(function (img) {
        gsap.fromTo(img, { yPercent: -7 }, {
            yPercent: 7, ease: 'none',
            scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true }
        });
    });

    // Process line fills with scroll and lights each step
    var steps = $('[data-steps]');
    if (steps) {
        var line = $('.steps__line i', steps), stepEls = $$('.step', steps);
        var prop = isMobile() ? 'scaleY' : 'scaleX';
        var vars = { ease: 'none', scrollTrigger: { trigger: steps, start: 'top 75%', end: 'bottom 60%', scrub: .5,
            onUpdate: function (self) {
                stepEls.forEach(function (s, i) { s.classList.toggle('is-lit', self.progress >= (i / stepEls.length) + .02); });
            } } };
        vars[prop] = 1;
        gsap.to(line, vars);
    }

    // Subtle drift on the about badges
    if (!isMobile()) {
        gsap.to('.about__years', { y: -40, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
        gsap.to('.about__inset', { y: 30, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
    }

    window.addEventListener('load', function () { ST.refresh(); });
})();
