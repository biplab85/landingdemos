/* ─────────────────────────────────────────────────────────────
 * Designed & developed by
 * Biplab Kumar Paul — Web Designer & Developer
 * Mobile: 01735 927356
 * Email:  biplab.cse.85@gmail.com
 * ─────────────────────────────────────────────────────────────
 *
 * My Brisbane Electrician — front-end interactions
 *  1. Mobile nav (open/close)
 *  2. Scroll-reveal (IntersectionObserver)
 *  3. Header shadow on scroll
 */

(function () {
    'use strict';

    // ── 1. Mobile nav ──────────────────────────────────────────
    const toggle    = document.getElementById('menuToggle');
    const closeBtn  = document.getElementById('mobileClose');
    const mobileNav = document.getElementById('mobileNav');

    function openMenu() {
        if (!mobileNav || !toggle) return;
        mobileNav.classList.add('is-open');
        mobileNav.setAttribute('aria-hidden', 'false');
        toggle.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        if (!mobileNav || !toggle) return;
        mobileNav.classList.remove('is-open');
        mobileNav.setAttribute('aria-hidden', 'true');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (toggle)   toggle.addEventListener('click', () => {
        mobileNav.classList.contains('is-open') ? closeMenu() : openMenu();
    });
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    // Close on link click
    document.querySelectorAll('.mobile-nav a').forEach(a => {
        a.addEventListener('click', closeMenu);
    });

    // Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('is-open')) {
            closeMenu();
        }
    });

    // ── 2. Scroll-reveal ───────────────────────────────────────
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        document.querySelectorAll('.service-card, .block, .copy-list li, .value, .float-card, .badge-circle')
            .forEach(el => {
                el.classList.add('reveal');
                io.observe(el);
            });
    }

    // ── 3. Modal (Book a visit) ────────────────────────────────
    const allModals = document.querySelectorAll('.modal');
    let lastFocus = null;

    function openModalById(id) {
        const m = document.getElementById(id);
        if (!m) return;
        lastFocus = document.activeElement;
        m.classList.add('is-open');
        m.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        setTimeout(() => {
            const first = m.querySelector('input, select, textarea, [data-modal-close]');
            if (first) first.focus({ preventScroll: true });
        }, 400);
    }
    function closeAllModals() {
        allModals.forEach(m => {
            if (!m.classList.contains('is-open')) return;
            m.classList.remove('is-open');
            m.setAttribute('aria-hidden', 'true');
        });
        document.body.classList.remove('modal-open');
        if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    document.querySelectorAll('[data-modal-open]').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            openModalById(btn.getAttribute('data-modal-open'));
        });
    });

    document.addEventListener('click', e => {
        const closer = e.target.closest('[data-modal-close]');
        if (closer) {
            e.preventDefault();
            closeAllModals();
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            const anyOpen = Array.from(allModals).some(m => m.classList.contains('is-open'));
            if (anyOpen) closeAllModals();
        }
    });

    // Book-a-Visit form — fake submit with success state
    const bookForm = document.getElementById('bookVisitForm');
    if (bookForm) {
        bookForm.addEventListener('submit', e => {
            e.preventDefault();
            if (!bookForm.checkValidity()) {
                bookForm.reportValidity();
                return;
            }
            const submit = bookForm.querySelector('button[type="submit"]');
            if (submit) {
                submit.disabled = true;
                submit.style.opacity = '.7';
            }
            setTimeout(() => {
                bookForm.innerHTML =
                    '<div class="form-success">' +
                        '<div class="success-icon">' +
                            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                                '<polyline points="20 6 9 17 4 12"/>' +
                            '</svg>' +
                        '</div>' +
                        '<h3>Request sent</h3>' +
                        '<p>Thanks — we\'ll be in touch within 60 minutes during business hours. For anything urgent, call <a href="tel:0420334559">0420 334 559</a>.</p>' +
                    '</div>';
            }, 700);
        });
    }

    // ── 3b. Footer accordions (mobile) ─────────────────────────
    document.querySelectorAll('.footer-col--acc h4').forEach(head => {
        head.addEventListener('click', () => {
            head.parentElement.classList.toggle('is-open');
        });
    });

    // ── 3c. Mobile app bar — menu button opens the mobile nav ──
    const appbarMenu = document.getElementById('appbarMenu');
    if (appbarMenu) appbarMenu.addEventListener('click', openMenu);

    // ── 3d. Mobile app bar — reveal on scroll ──────────────────
    // Hidden at the top of the page. Scrolling down reveals it,
    // scrolling up (or returning to the top) tucks it away.
    const appbar = document.querySelector('.mobile-appbar');
    if (appbar) {
        let lastAppbarY = window.scrollY;
        const topGuard = 80;
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y <= topGuard) {
                appbar.classList.remove('is-visible');       // near top → hide
            } else if (y > lastAppbarY + 4) {
                appbar.classList.add('is-visible');          // scrolling down → show
            } else if (y < lastAppbarY - 4) {
                appbar.classList.remove('is-visible');       // scrolling up → hide
            }
            lastAppbarY = y;
        }, { passive: true });
    }

    // ── 4. Header shadow on scroll ─────────────────────────────
    const header = document.querySelector('.site-header');
    let lastY = 0;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y > 8 && lastY <= 8) header.classList.add('is-scrolled');
        else if (y <= 8 && lastY > 8) header.classList.remove('is-scrolled');
        lastY = y;
    }, { passive: true });

})();
