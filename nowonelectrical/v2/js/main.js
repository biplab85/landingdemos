/* ==========================================================================
   Now On Electrical — V2 "Master Switch"
   ========================================================================== */
(function () {
    'use strict';

    var doc = document.documentElement;
    var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
    var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = function () { return window.matchMedia('(max-width: 991px)').matches; };
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* ---------- Year + date min ---------- */
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
    var today = new Date().toISOString().split('T')[0];
    $$('[data-min-today]').forEach(function (el) { el.min = today; });

    /* ---------- Header + app bar on scroll ---------- */
    var hdr = $('#hdr'), appbar = $('#appbar');
    var lastY = window.scrollY, ticking = false;
    var onScroll = function () {
        var y = window.scrollY;
        hdr.classList.toggle('is-scrolled', y > 30);
        var down = y > lastY && y > 500;
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
        $$('section[id]').forEach(function (s) { spy.observe(s); });
    }

    /* ---------- Overlays (sheet + modal) ---------- */
    var openCount = 0;
    var lock = function () { openCount++; document.body.classList.add('is-locked'); };
    var unlock = function () { openCount = Math.max(0, openCount - 1); if (!openCount) document.body.classList.remove('is-locked'); };

    var addSwipeClose = function (panel, close) {
        if (!panel) return;
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

    var sheet = $('#sheet'), sheetBtn = $('[data-sheet-open]');
    var openSheet = function () {
        if (!sheet || sheet.classList.contains('is-open')) return;
        sheet.classList.add('is-open'); sheet.setAttribute('aria-hidden', 'false');
        if (sheetBtn) sheetBtn.setAttribute('aria-expanded', 'true');
        lock();
    };
    var closeSheet = function () {
        if (!sheet || !sheet.classList.contains('is-open')) return;
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
        setTimeout(function () { var f = $('select, input', modal); if (f && !isMobile()) f.focus(); }, 350);
    };
    var closeModal = function () {
        if (!modal || !modal.classList.contains('is-open')) return;
        modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true');
        unlock();
        if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
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
                var valid = input.value.trim() !== '';
                var field = input.closest('.field');
                if (field) field.classList.toggle('is-error', !valid);
                if (!valid) ok = false;
            });
            if (!ok) { var bad = $('.is-error select, .is-error input, .is-error textarea', form); if (bad) bad.focus(); return; }
            var done = form.nextElementSibling;
            form.hidden = true;
            if (done && done.classList.contains('form-done')) done.hidden = false;
        });
        form.addEventListener('input', function (e) {
            var field = e.target.closest('.field');
            if (field) field.classList.remove('is-error');
        });
        form.addEventListener('change', function (e) {
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

    /* ---------- Hero service stage (split shutters) ---------- */
    var stage = $('[data-stage]');
    var stageApi = null;
    if (stage) {
        var stabs = $$('.stab', stage), simgs = $$('.hero__img', stage);
        var body = $('.hero__card-body', stage), shutters = $$('.hero__shutters i', stage);
        var kEl = $('[data-stage-k]', stage), tEl = $('[data-stage-t]', stage), codeEl = $('[data-stage-code]', stage);
        var DUR = 6500, cur = 0, timer = null, paused = false, inView = true, busy = false;
        stage.style.setProperty('--stage-dur', DUR + 'ms');

        var swapImg = function (i) {
            simgs[cur].classList.remove('is-active');
            simgs[i].classList.add('is-active');
            cur = i;
        };
        var show = function (i) {
            if (i === cur || busy) return;
            stabs[cur].classList.remove('is-on'); stabs[cur].setAttribute('aria-selected', 'false');
            stabs[i].classList.add('is-on'); stabs[i].setAttribute('aria-selected', 'true');
            body.classList.add('is-swap');
            if (window.gsap && !reduceMotion) {
                busy = true;
                window.gsap.timeline({ onComplete: function () { busy = false; } })
                    .set(shutters, { transformOrigin: '50% 100%' })
                    .to(shutters, { scaleY: 1, duration: .45, ease: 'power3.in', stagger: .05 })
                    .add(function () { swapImg(i); })
                    .set(shutters, { transformOrigin: '50% 0%' })
                    .to(shutters, { scaleY: 0, duration: .7, ease: 'power3.out', stagger: .05 });
            } else { swapImg(i); }
            setTimeout(function () {
                kEl.innerHTML = stabs[i].getAttribute('data-k');
                tEl.innerHTML = stabs[i].getAttribute('data-t');
                codeEl.textContent = 'CCT 0' + (i + 1) + ' / 0' + stabs.length;
                body.classList.remove('is-swap');
            }, 380);
        };
        var restartBar = function () {
            var b = $('.stab.is-on .stab__bar b', stage);
            if (!b) return;
            b.style.animation = 'none'; void b.offsetWidth; b.style.animation = '';
        };
        var schedule = function () {
            clearTimeout(timer);
            if (reduceMotion || paused || !inView) return;
            timer = setTimeout(function () { show((cur + 1) % stabs.length); restartBar(); schedule(); }, DUR);
        };
        stabs.forEach(function (b, i) {
            b.addEventListener('click', function () { if (busy) return; show(i); restartBar(); schedule(); });
        });
        if (finePointer) {
            stage.addEventListener('pointermove', function (e) {
                var r = stage.getBoundingClientRect();
                stage.style.setProperty('--mx', (e.clientX - r.left) + 'px');
                stage.style.setProperty('--my', (e.clientY - r.top) + 'px');
            });
            var card = $('.hero__card', stage);
            card.addEventListener('mouseenter', function () { paused = true; stage.classList.add('is-paused'); clearTimeout(timer); });
            card.addEventListener('mouseleave', function () { paused = false; stage.classList.remove('is-paused'); restartBar(); schedule(); });
        }
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (en) {
                inView = en[0].isIntersecting;
                stage.classList.toggle('is-paused', !inView || paused);
                if (inView) { restartBar(); schedule(); } else clearTimeout(timer);
            }).observe(stage);
        }
        stageApi = { start: function () { restartBar(); schedule(); } };
    }

    /* ---------- Areas: list ↔ radar points ---------- */
    var areaItems = $$('.areas__list li');
    var setArea = function (key) {
        areaItems.forEach(function (li) { li.classList.toggle('is-active', li.getAttribute('data-area') === key); });
        $$('.pt').forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-pt') === key); });
    };
    areaItems.forEach(function (li) {
        li.addEventListener('mouseenter', function () { setArea(li.getAttribute('data-area')); });
        li.addEventListener('click', function () { setArea(li.getAttribute('data-area')); });
    });
    setArea('cbd');

    /* ---------- Service card spotlight ---------- */
    if (finePointer) {
        $$('.svc').forEach(function (card) {
            card.addEventListener('pointermove', function (e) {
                var r = card.getBoundingClientRect();
                card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
                card.style.setProperty('--my', (e.clientY - r.top) + 'px');
            });
        });
    }

    /* ---------- Swiper ---------- */
    if (window.Swiper) {
        new Swiper('.work-swiper', {
            slidesPerView: 1.08,
            spaceBetween: 14,
            grabCursor: true,
            speed: 800,
            navigation: { prevEl: '.work-prev', nextEl: '.work-next' },
            pagination: { el: '.work-pagination', type: 'progressbar' },
            breakpoints: {
                640: { slidesPerView: 1.6, spaceBetween: 20 },
                992: { slidesPerView: 2.3, spaceBetween: 26 },
                1280: { slidesPerView: 2.7, spaceBetween: 30 }
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

    /* ---------- GSAP ---------- */
    var hls = $$('.hl');
    var reveals = $$('.reveal');
    if (!window.gsap || reduceMotion) {
        doc.classList.add('no-gsap');
        if (stageApi) stageApi.start();
        hls.forEach(function (h) { h.classList.add('is-on'); });
        $$('.step').forEach(function (s) { s.classList.add('is-lit'); });
        return;
    }
    var gsap = window.gsap;
    var ST = window.ScrollTrigger;
    if (ST) gsap.registerPlugin(ST);

    // Safety net: never leave content hidden
    setTimeout(function () {
        hls.forEach(function (h) { h.classList.add('is-on'); });
        reveals.forEach(function (el) {
            if (getComputedStyle(el).opacity === '0' && el.getBoundingClientRect().top < window.innerHeight) gsap.to(el, { opacity: 1, y: 0, duration: .6 });
        });
    }, 4500);

    // Hero intro: shutters split open, lines rise, rockers flip on in sequence
    var shut = $$('.hero__shutters i');
    gsap.set(shut, { scaleY: 1, transformOrigin: '50% 0%' });
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hdr__in', { y: -24, opacity: 0, duration: 1 }, 0)
      .to(shut, { scaleY: 0, duration: 1.2, ease: 'power4.inOut', stagger: .08 }, .15)
      .fromTo('.hero__media', { scale: 1.18 }, { scale: 1, duration: 2.4, ease: 'power3.out' }, .15)
      .fromTo('.hero__wire i', { scaleY: 0 }, { scaleY: 1, duration: 1.6, ease: 'power2.inOut' }, .7)
      .fromTo('.hero__eyebrow', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, .1)
      .fromTo('.hl__in', { yPercent: 115 }, { yPercent: 0, duration: 1.3, stagger: .1 }, .2)
      .fromTo('.hero__lead', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, .55)
      .fromTo('.hero__ctas', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, .66)
      .fromTo('.hcount', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: .08 }, .8)
      .fromTo('.hero__chip', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: .15 }, 1.1)
      .fromTo('.hero__card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, .95)
      .fromTo('.hero__scroll', { opacity: 0 }, { opacity: 1, duration: 1 }, 1.4);
    hls.forEach(function (h, i) { tl.call(function () { h.classList.add('is-on'); }, null, 1 + i * .32); });
    $$('.hero [data-count]').forEach(function (el) {
        var end = parseInt(el.getAttribute('data-count'), 10), obj = { v: 0 };
        el.textContent = '0';
        tl.to(obj, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: function () { el.textContent = Math.round(obj.v); } }, .9);
    });
    tl.eventCallback('onComplete', function () { if (stageApi) stageApi.start(); });

    // Magnetic CTAs (desktop pointer only)
    if (finePointer) {
        $$('.hero__magnet').forEach(function (btn) {
            var xTo = gsap.quickTo(btn, 'x', { duration: .5, ease: 'power3' });
            var yTo = gsap.quickTo(btn, 'y', { duration: .5, ease: 'power3' });
            btn.addEventListener('pointermove', function (e) {
                var r = btn.getBoundingClientRect();
                xTo((e.clientX - r.left - r.width / 2) * .25);
                yTo((e.clientY - r.top - r.height / 2) * .35);
            });
            btn.addEventListener('pointerleave', function () { xTo(0); yTo(0); });
        });
    }

    if (!ST) {
        gsap.set(reveals, { opacity: 1, y: 0 });
        return;
    }

    // Layered depth: media drifts down, copy + glass card drift up
    if (!isMobile()) {
        gsap.to('.hero__media', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to('.hero__copy', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to('.hero__card', { y: -60, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    // Reveal on scroll
    ST.batch(reveals, {
        start: 'top 90%',
        once: true,
        onEnter: function (batch) {
            gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: .07, overwrite: true });
        }
    });

    // Counters
    $$('[data-count]').filter(function (el) { return !el.closest('.hero'); }).forEach(function (el) {
        var end = parseInt(el.getAttribute('data-count'), 10), obj = { v: 0 };
        el.textContent = '0';
        ST.create({
            trigger: el, start: 'top 92%', once: true,
            onEnter: function () {
                gsap.to(obj, { v: end, duration: 2, ease: 'power3.out', onUpdate: function () { el.textContent = Math.round(obj.v); } });
            }
        });
    });

    // Parallax images
    $$('[data-parallax]').forEach(function (img) {
        gsap.fromTo(img, { yPercent: -6 }, {
            yPercent: 6, ease: 'none',
            scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true }
        });
    });

    // Process line fills with scroll and lights each step
    var steps = $('[data-steps]');
    if (steps) {
        var line = $('.steps__line i', steps), stepEls = $$('.step', steps);
        var vertical = window.matchMedia('(max-width: 640px)').matches;
        var vars = { ease: 'none', scrollTrigger: { trigger: steps, start: 'top 75%', end: 'bottom 55%', scrub: .5,
            onUpdate: function (self) {
                stepEls.forEach(function (s, i) { s.classList.toggle('is-lit', self.progress >= (i / stepEls.length) + .02); });
            } } };
        vars[vertical ? 'scaleY' : 'scaleX'] = 1;
        gsap.to(line, vars);
    }

    window.addEventListener('load', function () { ST.refresh(); });
})();
