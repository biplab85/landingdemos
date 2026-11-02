/* ==========================================================================
   Optivolt Electrical — V2
   ========================================================================== */
(function () {
    'use strict';

    var doc = document.documentElement;
    var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
    var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = function () { return window.matchMedia('(max-width: 991px)').matches; };

    /* ---------- Header: scrolled / hide on scroll down ---------- */
    var header = $('#header'), appbar = $('#appbar');
    var lastY = window.scrollY;
    var onScroll = function () {
        var y = window.scrollY;
        header.classList.toggle('is-scrolled', y > 20);
        var down = y > lastY && y > 420;
        if (!isMobile()) header.classList.toggle('is-hidden', down);
        if (appbar) appbar.classList.toggle('is-hidden', down && isMobile());
        lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Scroll spy (nav + app bar) ---------- */
    var navLinks = $$('.nav a[data-nav]');
    var spyTargets = ['top', 'services', 'about', 'work', 'reviews', 'faq', 'contact']
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

    /* ---------- Body lock helpers ---------- */
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
            if (sel) $$('option', sel).forEach(function (o) { if (o.textContent === service) sel.value = o.value || o.textContent; });
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
        btn.addEventListener('click', function (e) { e.preventDefault(); openModal(btn.getAttribute('data-service')); });
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
    $$('.sheet__grid a').forEach(function (a) { a.addEventListener('click', closeSheet); });

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

    /* ---------- Live open / after-hours status (Sydney time) ---------- */
    (function () {
        var led = $('[data-status-led]'), txt = $('[data-status-text]'), shortTxt = $('[data-status-short]');
        var parts;
        try {
            parts = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Sydney', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false })
                .formatToParts(new Date()).reduce(function (o, p) { o[p.type] = p.value; return o; }, {});
        } catch (e) { return; }
        var mins = (parseInt(parts.hour, 10) % 24) * 60 + parseInt(parts.minute, 10);
        var open = parts.weekday !== 'Sun' && mins >= 7 * 60 && mins <= 23 * 60 + 45;
        if (txt) txt.textContent = open ? 'Open now · until 11:45pm' : 'After hours · 24/7 emergency line open';
        if (led) led.classList.toggle('is-after', !open);
        if (shortTxt) shortTxt.textContent = open ? 'Open now · until 11:45pm' : '24/7 emergency line open';
    })();

    /* ---------- Hero card deck ---------- */
    var deck = $('[data-deck]');
    if (deck) {
        var cards = $$('.deck-card', deck), order = cards.map(function (c, i) { return i; });
        var DUR = 4500, deckTimer = null, busy = false;
        deck.style.setProperty('--deck-dur', DUR + 'ms');
        var paint = function () { order.forEach(function (ci, pos) { cards[ci].setAttribute('data-pos', pos); }); };
        var restartRing = function () {
            deck.classList.remove('is-timing'); void deck.offsetWidth;
            if (!reduceMotion) deck.classList.add('is-timing');
        };
        var next = function () {
            if (busy) return; busy = true;
            var top = cards[order[0]];
            top.classList.add('is-out');
            setTimeout(function () {
                order.push(order.shift());
                top.classList.remove('is-out');
                paint();
                busy = false;
            }, 520);
        };
        var schedule = function () {
            clearTimeout(deckTimer);
            if (reduceMotion) return;
            restartRing();
            deckTimer = setTimeout(function () { next(); schedule(); }, DUR);
        };
        paint();
        $('[data-deck-next]', deck).addEventListener('click', function () { next(); schedule(); });
        deck.addEventListener('mouseenter', function () { clearTimeout(deckTimer); deck.classList.remove('is-timing'); });
        deck.addEventListener('mouseleave', schedule);
        // swipe on touch
        var sx = null;
        deck.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
        deck.addEventListener('touchend', function (e) {
            if (sx === null) return;
            if (Math.abs(e.changedTouches[0].clientX - sx) > 40) { next(); schedule(); }
            sx = null;
        });
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (en) { if (en[0].isIntersecting) schedule(); else clearTimeout(deckTimer); }).observe(deck);
        } else schedule();
    }

    /* ---------- Swiper ---------- */
    if (window.Swiper) {
        new Swiper('.work-swiper', {
            slidesPerView: 1.2,
            spaceBetween: 16,
            grabCursor: true,
            speed: 700,
            navigation: { prevEl: '.work-prev', nextEl: '.work-next' },
            pagination: { el: '.work-pagination', clickable: true },
            breakpoints: {
                640: { slidesPerView: 2.2, spaceBetween: 18 },
                992: { slidesPerView: 3.2, spaceBetween: 22 },
                1400: { slidesPerView: 4, spaceBetween: 24 }
            }
        });
        new Swiper('.reviews-swiper', {
            slidesPerView: 1.06,
            spaceBetween: 14,
            grabCursor: true,
            speed: 700,
            autoplay: reduceMotion ? false : { delay: 6500, disableOnInteraction: true },
            navigation: { prevEl: '.reviews-prev', nextEl: '.reviews-next' },
            pagination: { el: '.reviews-pagination', clickable: true },
            breakpoints: {
                768: { slidesPerView: 2, spaceBetween: 20 },
                1200: { slidesPerView: 3, spaceBetween: 24 }
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
    if (!window.gsap || reduceMotion) {
        doc.classList.add('no-gsap');
        return;
    }
    var gsap = window.gsap;
    var ST = window.ScrollTrigger;
    if (ST) gsap.registerPlugin(ST);

    // Hero intro. Deck card transforms are owned by CSS data-pos, so GSAP animates the deck wrapper only.
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.header .navbar', { y: -20, opacity: 0, duration: 1 }, .1)
      .to('.hero__title .line > span', { y: 0, duration: 1.3, stagger: .12 }, .2)
      .fromTo('.hero__volt', { '--volt-line': 0 }, { '--volt-line': 1, duration: 1.1, ease: 'power3.inOut' }, .95)
      .to('.hero__anim', { opacity: 1, duration: 1, stagger: .1 }, .5)
      .from('.hero__anim', { y: 24, duration: 1.1, stagger: .1 }, .5)
      .fromTo('.hero__deck', { opacity: 0, y: 70, rotate: 4 }, { opacity: 1, y: 0, rotate: 0, duration: 1.5 }, .45)
      .fromTo('.deck-badge', { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.8)' }, 1.1)
      .fromTo('.deck-next', { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .9, ease: 'back.out(1.8)' }, 1.25)
      .to('.hero__board', { opacity: 1, duration: 1 }, 1.1)
      .from('.board-item', { y: 18, opacity: 0, duration: .9, stagger: .1 }, 1.1);

    // Magnetic CTAs (desktop pointer only)
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
        var glow = $('.hero__glow');
        $('.hero').addEventListener('mousemove', function (ev) {
            gsap.to(glow, { x: (ev.clientX / window.innerWidth - .5) * 80, y: (ev.clientY / window.innerHeight - .5) * 60, duration: 1.4, ease: 'power3.out' });
        });
    }

    if (!ST) { gsap.set('.reveal', { opacity: 1, y: 0 }); return; }

    // Reveals
    ST.batch('.reveal', {
        start: 'top 88%',
        once: true,
        onEnter: function (batch) { gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: .08, overwrite: true }); }
    });

    // Counters
    $$('.stat [data-count], .deck-badge [data-count]').forEach(function (el) {
        var end = parseInt(el.getAttribute('data-count'), 10), obj = { v: 0 };
        el.textContent = '0';
        ST.create({
            trigger: el, start: 'top 92%', once: true,
            onEnter: function () {
                gsap.to(obj, { v: end, duration: 2, ease: 'power3.out', delay: el.closest('.deck-badge') ? 1.1 : 0, onUpdate: function () { el.textContent = Math.round(obj.v); } });
            }
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
            yPercent: 6, ease: 'none',
            scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true }
        });
    });

    window.addEventListener('load', function () { ST.refresh(); });
})();
