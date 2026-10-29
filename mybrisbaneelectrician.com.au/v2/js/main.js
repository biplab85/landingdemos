/* ─────────────────────────────────────────────────────────────
 * Designed & developed by
 * Biplab Kumar Paul — Web Designer & Developer
 * Mobile: 01735 927356
 * Email:  biplab.cse.85@gmail.com
 * ─────────────────────────────────────────────────────────────
 *
 * My Brisbane Electrician V2 — front-end interactions
 *  1. Sticky header + scroll-to-top
 *  2. Off-canvas nav + dropdowns
 *  3. Scroll reveal (fail-safe)
 *  4. Rolling digit counters
 *  5. Specialist services slider
 *  6. Quote modal
 *  7. Mobile app bar scroll-spy
 *  8. Swipe carousel dots
 *  9. Footer accordions (mobile)
 * 10. Forms (demo submit)
 */

(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── 1. Sticky header + scroll-to-top ───────────────────────
    const header = document.getElementById('header');
    const toTop  = document.getElementById('toTop');

    function onScroll() {
        const y = window.scrollY;
        header.classList.toggle('is-stuck', y > 160);
        toTop.classList.toggle('is-visible', y > 600);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

    // ── 2. Off-canvas nav + dropdowns ──────────────────────────
    const nav      = document.getElementById('navMenu');
    const menuBtn  = document.getElementById('menuBtn');
    const navClose = document.getElementById('navClose');
    const backdrop = document.getElementById('navBackdrop');

    const appbarMenu = document.getElementById('appbarMenu');

    function setNav(open) {
        nav.classList.toggle('is-open', open);
        backdrop.classList.toggle('is-open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        if (appbarMenu) appbarMenu.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('is-locked', open);
    }

    menuBtn.addEventListener('click', () => setNav(true));
    if (appbarMenu) appbarMenu.addEventListener('click', () => setNav(true));
    navClose.addEventListener('click', () => setNav(false));
    backdrop.addEventListener('click', () => setNav(false));

    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNav(false)));

    nav.querySelectorAll('.has-dropdown > .nav-link').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const item = toggle.parentElement;
            const open = !item.classList.contains('is-open');
            nav.querySelectorAll('.has-dropdown.is-open').forEach(i => {
                i.classList.remove('is-open');
                i.querySelector('.nav-link').setAttribute('aria-expanded', 'false');
            });
            item.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
        });
    });

    // close desktop dropdowns when clicking elsewhere
    document.addEventListener('click', e => {
        if (!e.target.closest('.has-dropdown')) {
            nav.querySelectorAll('.has-dropdown.is-open').forEach(i => i.classList.remove('is-open'));
        }
    });

    // ── 3. Scroll reveal (fail-safe) ───────────────────────────
    const revealEls = document.querySelectorAll('.reveal, .img-reveal, .reveal-line');

    if (!('IntersectionObserver' in window) || reduceMotion) {
        revealEls.forEach(el => el.classList.add('is-visible'));
    } else {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.classList.add('is-visible');
                    // clear stagger delay after the reveal so hovers aren't delayed
                    setTimeout(() => el.classList.add('is-done'), 1400);
                    io.unobserve(el);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => io.observe(el));

        // safety net: never leave content hidden
        setTimeout(() => revealEls.forEach(el => el.classList.add('is-visible')), 4000);
    }

    // ── 4. Rolling digit counters ──────────────────────────────
    // Each digit becomes a vertical 0–9 strip that rolls to its value.
    document.querySelectorAll('.roll[data-roll]').forEach(el => {
        const digits = el.dataset.roll.split('');
        el.textContent = '';
        el.setAttribute('aria-label', el.dataset.roll);

        const cols = digits.map((d, i) => {
            const col = document.createElement('span');
            col.className = 'roll-col';
            col.setAttribute('aria-hidden', 'true');
            for (let n = 0; n <= 9; n++) {
                const s = document.createElement('span');
                s.textContent = n;
                col.appendChild(s);
            }
            col.style.transitionDelay = (i * 0.15) + 's';
            el.appendChild(col);
            return { col, value: Number(d) };
        });

        const run = () => cols.forEach(({ col, value }) => {
            col.style.transform = `translateY(-${value * 46}px)`;
        });

        if (reduceMotion || !('IntersectionObserver' in window)) {
            cols.forEach(({ col }) => { col.style.transition = 'none'; });
            run();
            return;
        }

        const cio = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                requestAnimationFrame(run);
                cio.disconnect();
            }
        }, { threshold: 0.6 });
        cio.observe(el);
    });

    // ── 5. Specialist services slider ──────────────────────────
    document.querySelectorAll('[data-slider]').forEach(slider => {
        const track  = slider.querySelector('[data-track]');
        const slides = track.children;
        const prev   = slider.querySelector('[data-prev]');
        const next   = slider.querySelector('[data-next]');
        let index = 0;
        let timer = null;

        function go(i) {
            index = (i + slides.length) % slides.length;
            track.style.transform = `translateX(-${index * 100}%)`;
        }

        function autoplay() {
            if (reduceMotion) return;
            clearInterval(timer);
            timer = setInterval(() => go(index + 1), 6000);
        }

        prev.addEventListener('click', () => { go(index - 1); autoplay(); });
        next.addEventListener('click', () => { go(index + 1); autoplay(); });

        slider.addEventListener('mouseenter', () => clearInterval(timer));
        slider.addEventListener('mouseleave', autoplay);
        slider.addEventListener('focusin', () => clearInterval(timer));

        // basic swipe
        let startX = null;
        track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; clearInterval(timer); }, { passive: true });
        track.addEventListener('touchend', e => {
            if (startX === null) return;
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
            startX = null;
            autoplay();
        });

        autoplay();
    });

    // ── 6. Quote modal ─────────────────────────────────────────
    let lastFocus = null;

    function openModal(id, service) {
        const modal = document.getElementById(id);
        if (!modal) return;
        lastFocus = document.activeElement;
        setNav(false);

        if (service) {
            const select = modal.querySelector('select[name="service"]');
            if (select) select.value = service;
        }

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('is-locked');
        setTimeout(() => {
            const first = modal.querySelector('input, select, textarea, button');
            if (first) first.focus({ preventScroll: true });
        }, 300);
    }

    function closeModals() {
        document.querySelectorAll('.modal.is-open').forEach(m => {
            m.classList.remove('is-open');
            m.setAttribute('aria-hidden', 'true');
        });
        document.body.classList.remove('is-locked');
        if (lastFocus) lastFocus.focus({ preventScroll: true });
    }

    document.querySelectorAll('[data-modal-open]').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            openModal(btn.dataset.modalOpen, btn.dataset.service);
        });
    });

    document.addEventListener('click', e => {
        if (e.target.closest('[data-modal-close]')) closeModals();
    });

    document.addEventListener('keydown', e => {
        if (e.key !== 'Escape') return;
        if (document.querySelector('.modal.is-open')) closeModals();
        else if (nav.classList.contains('is-open')) setNav(false);
    });

    // ── 7. Mobile app bar — active tab follows scroll ──────────
    const spyHome     = document.querySelector('.appbar [data-spy="home"]');
    const spyServices = document.querySelector('.appbar [data-spy="services"]');
    const servicesSec = document.getElementById('services');
    const contactSec  = document.getElementById('contact');

    function spy() {
        if (!spyHome || !servicesSec) return;
        const line = window.innerHeight * 0.4;
        const inServices = servicesSec.getBoundingClientRect().top <= line &&
                           contactSec.getBoundingClientRect().top > line;
        spyServices.classList.toggle('is-active', inServices);
        spyHome.classList.toggle('is-active', !inServices && servicesSec.getBoundingClientRect().top > line);
    }
    window.addEventListener('scroll', spy, { passive: true });
    spy();

    // ── 8. Swipe carousels — dot indicators ────────────────────
    document.querySelectorAll('.snap-row').forEach(row => {
        const items = Array.from(row.children);
        const dots = document.createElement('div');
        dots.className = 'snap-dots';
        dots.setAttribute('aria-hidden', 'true');
        items.forEach(() => dots.appendChild(document.createElement('span')));
        row.after(dots);

        function update() {
            const left = row.getBoundingClientRect().left;
            let active = 0, best = Infinity;
            items.forEach((item, i) => {
                const d = Math.abs(item.getBoundingClientRect().left - left - 16);
                if (d < best) { best = d; active = i; }
            });
            dots.querySelectorAll('span').forEach((s, i) => s.classList.toggle('is-active', i === active));
        }
        row.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
        update();
    });

    // ── 9. Footer accordions (mobile) ──────────────────────────
    const mqMobile = window.matchMedia('(max-width: 767px)');
    document.querySelectorAll('.footer-acc .acc-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!mqMobile.matches) return;
            const open = btn.closest('.footer-acc').classList.toggle('is-open');
            btn.setAttribute('aria-expanded', String(open));
        });
    });

    // ── 10. Forms (demo submit — no backend wired) ─────────────
    function demoSubmit(form, onDone) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            const btn = form.querySelector('[type="submit"]');
            if (btn) btn.disabled = true;
            setTimeout(() => {
                onDone(form);
                if (btn) btn.disabled = false;
            }, 600);
        });
    }

    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        demoSubmit(quoteForm, form => {
            form.innerHTML =
                '<div class="form-success">' +
                    '<div class="ok"><svg aria-hidden="true"><use href="#i-check"/></svg></div>' +
                    '<h2>Request sent</h2>' +
                    '<p>Thanks! We\'ll be in touch within 60 minutes during business hours. For anything urgent, call <a href="tel:0420334559">0420 334 559</a>.</p>' +
                '</div>';
        });
    }

    ['callbackForm', 'urgentForm'].forEach(id => {
        const form = document.getElementById(id);
        if (!form) return;
        demoSubmit(form, f => {
            f.reset();
            const note = f.querySelector('.form-note');
            if (note) note.textContent = 'Thanks! We\'ll call you back shortly.';
        });
    });

})();
