/* ==========================================================================
   Top of the Mark Electrical — V2
   Header, app bar, scroll spy, modal / bottom sheet, forms,
   GSAP animations, Swiper carousels, Fancybox gallery.
   ========================================================================== */
(function () {
    'use strict';

    var doc = document.documentElement;
    var body = document.body;
    var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
    var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = function () { return window.matchMedia('(max-width: 991px)').matches; };

    /* ---------- Year ---------- */
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

    /* ---------- Header + app bar on scroll ---------- */
    var header = $('#header');
    var lastY = window.scrollY;
    var ticking = false;

    function onScroll() {
        var y = window.scrollY;
        header.classList.toggle('is-scrolled', y > 40);

        var goingDown = y > lastY && y > 400;
        header.classList.toggle('is-hidden', goingDown && !body.classList.contains('is-locked'));
        lastY = y;
        ticking = false;
    }
    window.addEventListener('scroll', function () {
        if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();

    /* ---------- Scroll lock helpers ---------- */
    var openLayers = 0;
    function lock() { openLayers++; body.classList.add('is-locked'); }
    function unlock() { openLayers = Math.max(0, openLayers - 1); if (!openLayers) body.classList.remove('is-locked'); }

    /* ---------- Quote modal ---------- */
    var modal = $('#quoteModal');
    var lastFocus = null;

    function openModal(service) {
        if (!modal || modal.classList.contains('is-open')) return;
        closeSheet();
        lastFocus = document.activeElement;
        if (service) {
            var sel = $('#m-service');
            if (sel) {
                $$('option', sel).forEach(function (o) { if (o.textContent.trim() === service) sel.value = o.value; });
            }
        }
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        lock();
        setTimeout(function () {
            var first = $('input', modal);
            if (first && !isMobile()) first.focus();
            else $('.modal__close', modal).focus();
        }, 80);
    }
    function closeModal() {
        if (!modal || !modal.classList.contains('is-open')) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        unlock();
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    $$('[data-modal-open]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            openModal(btn.getAttribute('data-service'));
        });
    });
    $$('[data-modal-close]').forEach(function (btn) { btn.addEventListener('click', closeModal); });

    // Focus trap inside open dialogs
    function trapFocus(container, e) {
        var focusables = $$('a[href], button:not([disabled]), input, select, textarea', container)
            .filter(function (el) { return el.offsetParent !== null; });
        if (!focusables.length) return;
        var first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    /* ---------- Mobile menu sheet ---------- */
    var sheet = $('#menuSheet');
    var menuBtn = $('#appbarMenu');

    function openSheet() {
        if (!sheet || sheet.classList.contains('is-open')) return;
        sheet.classList.add('is-open');
        sheet.setAttribute('aria-hidden', 'false');
        if (menuBtn) { menuBtn.setAttribute('aria-expanded', 'true'); menuBtn.classList.add('is-active'); }
        lock();
    }
    function closeSheet() {
        if (!sheet || !sheet.classList.contains('is-open')) return;
        sheet.classList.remove('is-open');
        sheet.setAttribute('aria-hidden', 'true');
        if (menuBtn) { menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.classList.remove('is-active'); }
        unlock();
    }
    if (menuBtn) menuBtn.addEventListener('click', function () {
        sheet.classList.contains('is-open') ? closeSheet() : openSheet();
    });
    $$('[data-sheet-close]').forEach(function (el) { el.addEventListener('click', closeSheet); });
    $$('[data-sheet-link]').forEach(function (el) { el.addEventListener('click', closeSheet); });

    // Swipe-down to dismiss bottom sheets on touch devices
    function swipeToClose(panel, closeFn) {
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
            if (dy > 110) closeFn();
            startY = null;
        });
    }
    swipeToClose($('.sheet__panel'), closeSheet);
    if (modal) swipeToClose($('.modal__panel', modal), function () { if (isMobile()) closeModal(); });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeModal(); closeSheet(); }
        if (e.key === 'Tab') {
            if (modal && modal.classList.contains('is-open')) trapFocus(modal, e);
            else if (sheet && sheet.classList.contains('is-open')) trapFocus(sheet, e);
        }
    });

    /* ---------- Scroll spy (desktop nav + app bar) ---------- */
    var spySections = $$('[data-spy]');
    var navLinks = $$('[data-spy-link]');
    var appItems = $$('[data-appbar]');

    function setActive(id) {
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-spy-link') === id); });
        var appId = id === 'services' ? 'services' : (id === 'home' ? 'home' : null);
        appItems.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-appbar') === appId); });
    }
    if ('IntersectionObserver' in window && spySections.length) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) setActive(entry.target.getAttribute('data-spy'));
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        spySections.forEach(function (s) { spy.observe(s); });
    }

    /* ---------- Forms ---------- */
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    $$('[data-quote-form]').forEach(function (form) {
        var status = $('.form__status', form);
        form.addEventListener('submit', function (e) {
            var ok = true;
            $$('[required]', form).forEach(function (input) {
                var valid = input.value.trim() !== '' && (input.type !== 'email' || emailRe.test(input.value.trim()));
                input.closest('.field').classList.toggle('is-invalid', !valid);
                if (!valid) ok = false;
            });
            if (!ok) {
                e.preventDefault();
                if (status) { status.textContent = 'Please complete the required fields.'; status.className = 'form__status is-error'; }
                var bad = $('.is-invalid input', form);
                if (bad) bad.focus();
                return;
            }
            if (status) { status.textContent = 'Opening your email app — thanks, we’ll reply within 24 hours.'; status.className = 'form__status is-ok'; }
        });
        $$('input, textarea, select', form).forEach(function (input) {
            input.addEventListener('input', function () {
                var f = input.closest('.field');
                if (f) f.classList.remove('is-invalid');
            });
        });
    });

    // Close sibling FAQ items for a tidy accordion
    $$('.faq-item').forEach(function (item) {
        item.addEventListener('toggle', function () {
            if (!item.open) return;
            $$('.faq-item').forEach(function (other) { if (other !== item) other.open = false; });
        });
    });

    /* ---------- Swiper ---------- */
    if (window.Swiper) {
        new Swiper('.work-swiper', {
            slidesPerView: 1.15,
            spaceBetween: 14,
            grabCursor: true,
            speed: 700,
            navigation: { prevEl: '.work-prev', nextEl: '.work-next' },
            pagination: { el: '.work-pagination', clickable: true },
            breakpoints: {
                640: { slidesPerView: 2.1, spaceBetween: 18 },
                992: { slidesPerView: 3.1, spaceBetween: 22 },
                1300: { slidesPerView: 3.6, spaceBetween: 24 }
            }
        });

        new Swiper('.reviews-swiper', {
            slidesPerView: 1,
            spaceBetween: 18,
            autoHeight: false,
            grabCursor: true,
            speed: 700,
            loop: false,
            autoplay: reduceMotion ? false : { delay: 7000, disableOnInteraction: true },
            navigation: { prevEl: '.reviews-prev', nextEl: '.reviews-next' },
            pagination: { el: '.reviews-pagination', clickable: true },
            breakpoints: { 992: { slidesPerView: 2, spaceBetween: 24 } }
        });
    }

    /* ---------- Fancybox ---------- */
    if (window.Fancybox) {
        window.Fancybox.bind('[data-fancybox="work"]', {
            Hash: false,
            Thumbs: { type: 'classic' },
            Toolbar: { display: { left: ['infobar'], middle: [], right: ['slideshow', 'fullscreen', 'close'] } }
        });
    }

    /* ---------- Hero: rotating headline word ---------- */
    var rotator = $('[data-rotator]');
    if (rotator && !reduceMotion) {
        var words = $$('span', rotator), wi = 0;
        setInterval(function () {
            var cur = words[wi];
            wi = (wi + 1) % words.length;
            cur.classList.remove('is-active');
            cur.classList.add('is-leaving');
            words[wi].classList.add('is-active');
            setTimeout(function () { cur.classList.remove('is-leaving'); }, 800);
        }, 2800);
    }

    /* ---------- Hero: interactive service stage ---------- */
    var stage = $('[data-stage]');
    if (stage) {
        var slides = $$('.hero__slide', stage), tabs = $$('.hero__tab', stage);
        var info = $('.hero__info', stage), infoK = $('[data-stage-k]', stage), infoT = $('[data-stage-t]', stage);
        var DUR = 6000, cur = 0, timer = null, paused = false;
        stage.style.setProperty('--stage-dur', DUR + 'ms');

        var show = function (i) {
            if (i === cur) return;
            slides[cur].classList.remove('is-active');
            tabs[cur].classList.remove('is-active');
            tabs[cur].setAttribute('aria-selected', 'false');
            cur = i;
            slides[cur].classList.add('is-active');
            tabs[cur].classList.add('is-active');
            tabs[cur].setAttribute('aria-selected', 'true');
            info.classList.add('is-swapping');
            setTimeout(function () {
                infoK.innerHTML = tabs[cur].getAttribute('data-k');
                infoT.innerHTML = tabs[cur].getAttribute('data-t');
                info.classList.remove('is-swapping');
            }, 380);
            if (isMobile()) {
                var bar = tabs[cur].parentNode;
                bar.scrollTo({ left: tabs[cur].offsetLeft - 10, behavior: 'smooth' });
            }
        };
        var schedule = function () {
            clearTimeout(timer);
            if (reduceMotion || paused) return;
            timer = setTimeout(function () { show((cur + 1) % slides.length); schedule(); }, DUR);
        };
        var restartBar = function () {
            var b = $('.hero__tab-bar b', tabs[cur]);
            b.style.animation = 'none'; void b.offsetWidth; b.style.animation = '';
        };

        tabs.forEach(function (tab, i) {
            tab.addEventListener('click', function () { show(i); restartBar(); schedule(); });
        });
        stage.addEventListener('mouseenter', function () { paused = true; stage.classList.add('is-paused'); clearTimeout(timer); });
        stage.addEventListener('mouseleave', function () { paused = false; stage.classList.remove('is-paused'); restartBar(); schedule(); });
        stage.addEventListener('mousemove', function (ev) {
            var r = stage.getBoundingClientRect();
            stage.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
            stage.style.setProperty('--my', (ev.clientY - r.top) + 'px');
        });
        // Pause when off-screen
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (en) {
                if (en[0].isIntersecting) { if (!paused) schedule(); } else clearTimeout(timer);
            }).observe(stage);
        } else schedule();
    }

    /* ---------- GSAP ---------- */
    if (!window.gsap || reduceMotion) {
        doc.classList.add('no-gsap');
        $$('[data-count]').forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
        return;
    }

    var gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    // Hero intro
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.header .navbar', { y: -20, opacity: 0, duration: 1 }, .1)
      .from('.hero__orb', { opacity: 0, scale: .6, duration: 2.4, ease: 'power2.out' }, 0)
      .to('.hero__title .line > span', { y: 0, duration: 1.3, stagger: .14 }, .2)
      .to('.hero__anim', { opacity: 1, duration: 1, stagger: .1 }, .45)
      .from('.hero__anim', { y: 22, duration: 1.1, stagger: .1 }, .45)
      .to('.hero__stage-anim', { opacity: 1, duration: .8 }, .7)
      .fromTo('.hero__stage', { y: 80, scale: .94 }, { y: 0, scale: 1, duration: 1.6, ease: 'expo.out' }, .7)
      .from('.hero__slide.is-active', { scale: 1.3, duration: 2.4, ease: 'power3.out' }, .7)
      .from('.hero__chip', { opacity: 0, y: 20, scale: .9, duration: 1, stagger: .12 }, 1.3)
      .from('.hero__info > *', { opacity: 0, y: 16, duration: .9, stagger: .08 }, 1.4)
      .from('.hero__tab', { opacity: 0, y: 16, duration: .8, stagger: .07 }, 1.5);

    // Desktop micro-interaction: magnetic CTAs
    if (!isMobile() && window.matchMedia('(pointer: fine)').matches) {
        $$('.hero__magnet').forEach(function (btn) {
            var xTo = gsap.quickTo(btn, 'x', { duration: .5, ease: 'power3.out' });
            var yTo = gsap.quickTo(btn, 'y', { duration: .5, ease: 'power3.out' });
            btn.addEventListener('mousemove', function (ev) {
                var r = btn.getBoundingClientRect();
                xTo((ev.clientX - r.left - r.width / 2) * .25);
                yTo((ev.clientY - r.top - r.height / 2) * .35);
            });
            btn.addEventListener('mouseleave', function () { xTo(0); yTo(0); });
        });
    }

    if (!window.ScrollTrigger) {
        gsap.set('.reveal', { opacity: 1, y: 0 });
        return;
    }

    // Reveal on scroll (batched for staggered groups)
    window.ScrollTrigger.batch('.reveal', {
        start: 'top 88%',
        once: true,
        onEnter: function (batch) {
            gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: .09, overwrite: true });
        }
    });

    // Counters
    $$('[data-count]').forEach(function (el) {
        var end = parseInt(el.getAttribute('data-count'), 10);
        var noComma = el.hasAttribute('data-nocomma');
        var start = end > 1000 ? end - 40 : 0;
        var obj = { v: start };
        el.textContent = start;
        window.ScrollTrigger.create({
            trigger: el,
            start: 'top 90%',
            once: true,
            onEnter: function () {
                gsap.to(obj, {
                    v: end, duration: 2, ease: 'power3.out',
                    onUpdate: function () {
                        var n = Math.round(obj.v);
                        el.textContent = noComma ? n : n.toLocaleString('en-AU');
                    }
                });
            }
        });
    });

    // Parallax images
    $$('[data-parallax]').forEach(function (img) {
        var isHero = !!img.closest('.hero');
        gsap.fromTo(img, { yPercent: isHero ? 0 : -6 }, {
            yPercent: isHero ? 10 : 6,
            ease: 'none',
            scrollTrigger: {
                trigger: img.closest('section') || img,
                start: isHero ? 'top top' : 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });

    // Award seal spin
    gsap.from('.award-band__seal', {
        rotate: -180, scale: .6, duration: 1.4, ease: 'back.out(1.6)',
        scrollTrigger: { trigger: '.award-band', start: 'top 80%' }
    });

    // Area chips pop-in
    gsap.from('.areas__chips li', {
        opacity: 0, y: 20, scale: .9, duration: .6, ease: 'back.out(1.8)', stagger: .04,
        scrollTrigger: { trigger: '.areas__chips', start: 'top 85%' }
    });

    // Refresh once images load so trigger positions are accurate
    window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
})();
