/*!
 * ==========================================================================
 * Loam — Handmade Home Goods · main.js (v1 root)
 * --------------------------------------------------------------------------
 * Author : Biplab Paul
 * Email  : biplab.cse.85@gmail.com
 * Phone  : 01735927356
 * --------------------------------------------------------------------------
 * Motion: GSAP 3.12 + ScrollTrigger (fade-up reveals, hero load-in),
 * Lenis smooth scroll, Swiper (spotlight + reviews). Client-side cart
 * count with toast, search sheet with live product suggestions, scroll-spy
 * shared by the desktop nav and the mobile tab bar.
 * JS hooks are js-* classes / data-* attributes; state classes are is-*.
 * Everything degrades gracefully: if a CDN library is missing the page
 * stays fully visible and usable.
 * ==========================================================================
 */
(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  if (hasGsap && !reduceMotion) {
    root.classList.add('has-motion');
  }

  /* ------------------------------------------------------------------------
   * Smooth scroll (Lenis)
   * --------------------------------------------------------------------- */
  let lenis = null;

  if (typeof window.Lenis !== 'undefined' && !reduceMotion) {
    lenis = new window.Lenis({ lerp: 0.1, wheelMultiplier: 1 });

    if (hasGsap) {
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add((time) => lenis.raf(time * 1000));
      window.gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  /* ------------------------------------------------------------------------
   * In-page anchors: smooth scroll, offset by whichever fixed bar is visible
   * --------------------------------------------------------------------- */
  const nav = $('.js-nav');
  const appbar = $('.js-appbar');
  const tabbar = $('.js-tabbar');
  const mqDesktop = window.matchMedia('(min-width: 992px)');

  function barOffset() {
    const bar = mqDesktop.matches ? nav : appbar;
    return bar ? bar.getBoundingClientRect().height : 0;
  }

  function scrollToTarget(target) {
    const offset = barOffset() + (mqDesktop.matches ? 24 : 8);
    const y = target.id === 'top'
      ? 0
      : Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
    if (lenis) {
      lenis.scrollTo(y, { duration: 1.2 });
    } else {
      window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) {
        e.preventDefault();
        return;
      }
      const target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      if (link.classList.contains('js-spy-link')) setActive(id.slice(1));
    });
  });

  /* ------------------------------------------------------------------------
   * Scroll-spy: desktop nav + mobile tab bar share js-spy-link hooks.
   * The active link gets is-active + aria-current="true"; the tab bar's
   * sliding pill follows via the --i custom property. A group that has no
   * link for the current section highlights the closest preceding one.
   * --------------------------------------------------------------------- */
  const spyLinks = $$('.js-spy-link');
  const spyIds = Array.from(new Set(spyLinks.map((l) => l.getAttribute('href').slice(1))));
  const spySections = spyIds.map((id) => document.getElementById(id)).filter(Boolean);
  const tabLinks = tabbar ? $$('.js-spy-link', tabbar) : [];
  const navLinks = nav ? $$('.js-spy-link', nav) : [];
  const linkGroups = [navLinks, tabLinks].filter((g) => g.length);
  const docOrder = spySections
    .slice()
    .sort((x, y) => (x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
    .map((el) => el.id);
  let currentId = null;
  let lockUntil = 0;

  function setActive(id, fromSpy) {
    if (fromSpy && Date.now() < lockUntil) return;
    if (!fromSpy) lockUntil = Date.now() + 1300;
    if (id === currentId) return;
    currentId = id;

    const pos = docOrder.indexOf(id);
    linkGroups.forEach((group) => {
      let match = null;
      group.forEach((link) => {
        const p = docOrder.indexOf(link.getAttribute('href').slice(1));
        if (p > -1 && p <= pos && (!match || p >= match.p)) match = { link, p };
      });
      group.forEach((link, index) => {
        const on = Boolean(match) && link === match.link;
        link.classList.toggle('is-active', on);
        if (on) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
        if (on && group === tabLinks && tabbar) tabbar.style.setProperty('--i', String(index));
      });
      if (group === tabLinks && tabbar) tabbar.classList.toggle('has-active', Boolean(match));
    });
  }

  function spy() {
    const line = barOffset() + window.innerHeight * 0.3;
    let active = spySections.length ? docOrder[0] : null;
    docOrder.forEach((id) => {
      const section = document.getElementById(id);
      if (section.getBoundingClientRect().top <= line) active = id;
    });
    // At the very bottom of the page the last section wins
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      active = docOrder[docOrder.length - 1];
    }
    if (active) setActive(active, true);

    const scrolled = window.scrollY > 24;
    if (nav) nav.classList.toggle('is-stuck', scrolled);
    if (appbar) appbar.classList.toggle('is-scrolled', scrolled);
  }

  let spyTicking = false;
  const requestSpy = () => {
    if (spyTicking) return;
    spyTicking = true;
    requestAnimationFrame(() => {
      spyTicking = false;
      spy();
    });
  };

  window.addEventListener('scroll', requestSpy, { passive: true });
  window.addEventListener('resize', requestSpy);
  ['wheel', 'touchstart', 'keydown'].forEach((evt) => {
    window.addEventListener(evt, () => { lockUntil = 0; }, { passive: true });
  });
  spy();

  /* ------------------------------------------------------------------------
   * Toast
   * --------------------------------------------------------------------- */
  const toast = $('.js-toast');
  const toastText = $('.js-toast-text');
  let toastTimer;

  function showToast(message) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
  }

  /* ------------------------------------------------------------------------
   * Cart: a small client-side counter (persisted per browser when storage
   * is available). Every js-add button increments it; badges bump.
   * --------------------------------------------------------------------- */
  const CART_KEY = 'loam-cart-count';
  const countEls = $$('.js-cart-count');
  const cartBtns = $$('.js-cart-btn');
  let cartCount = 0;

  try {
    cartCount = parseInt(window.localStorage.getItem(CART_KEY), 10) || 0;
  } catch (err) {
    cartCount = 0;
  }

  function renderCart(bump) {
    countEls.forEach((el) => {
      el.textContent = String(cartCount);
      if (bump) {
        el.classList.remove('is-bump');
        // restart the animation
        void el.offsetWidth;
        el.classList.add('is-bump');
      }
    });
    cartBtns.forEach((btn) => {
      btn.setAttribute('aria-label', 'Cart, ' + cartCount + (cartCount === 1 ? ' item' : ' items'));
    });
  }

  renderCart(false);

  $$('.js-add').forEach((btn) => {
    btn.addEventListener('click', () => {
      cartCount += 1;
      try {
        window.localStorage.setItem(CART_KEY, String(cartCount));
      } catch (err) { /* storage unavailable: keep the in-memory count */ }
      renderCart(true);
      showToast('Added to cart — ' + (btn.dataset.product || 'item'));

      if (btn.classList.contains('c-product__add')) {
        const label = btn.textContent;
        btn.classList.add('is-added');
        btn.textContent = 'Added';
        setTimeout(() => {
          btn.classList.remove('is-added');
          btn.textContent = label;
        }, 1400);
      }
    });
  });

  cartBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      showToast(cartCount
        ? 'Your cart holds ' + cartCount + (cartCount === 1 ? ' piece' : ' pieces')
        : 'Your cart is empty — add a piece you love');
    });
  });

  /* ------------------------------------------------------------------------
   * Search sheet: live suggestions from the products on the page
   * --------------------------------------------------------------------- */
  const search = $('.js-search');
  const searchInput = $('.js-search-input');
  const searchForm = $('.js-search-form');
  const searchResults = $('.js-search-results');
  let lastOpener = null;

  const catalogue = $$('.c-product, .c-tile, .c-spot__slide').map((card) => {
    const title = $('h3', card);
    return title ? { name: title.textContent.trim(), card } : null;
  }).filter(Boolean);

  function closeSearch() {
    if (!search || search.hidden) return;
    search.classList.remove('is-open');
    if (lenis) lenis.start();
    setTimeout(() => { search.hidden = true; }, 300);
    if (lastOpener) lastOpener.focus();
  }

  function openSearch(opener) {
    if (!search) return;
    lastOpener = opener;
    search.hidden = false;
    requestAnimationFrame(() => search.classList.add('is-open'));
    if (lenis) lenis.stop();
    setTimeout(() => searchInput && searchInput.focus(), 60);
  }

  function renderResults(query) {
    if (!searchResults) return;
    searchResults.innerHTML = '';
    const q = query.trim().toLowerCase();
    if (!q) return;
    const hits = catalogue.filter((item) => item.name.toLowerCase().includes(q)).slice(0, 6);
    if (!hits.length) {
      const li = document.createElement('li');
      li.className = 'c-search__empty';
      li.textContent = 'No pieces match “' + query.trim() + '” yet.';
      searchResults.appendChild(li);
      return;
    }
    hits.forEach((hit) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'c-search__hit';
      const name = document.createElement('span');
      name.textContent = hit.name;
      const go = document.createElement('span');
      go.textContent = 'View';
      btn.append(name, go);
      btn.addEventListener('click', () => {
        closeSearch();
        const section = hit.card.closest('section');
        setTimeout(() => scrollToTarget(section || hit.card), 320);
      });
      li.appendChild(btn);
      searchResults.appendChild(li);
    });
  }

  $$('.js-search-open').forEach((btn) => btn.addEventListener('click', () => openSearch(btn)));
  $$('.js-search-close').forEach((btn) => btn.addEventListener('click', closeSearch));
  if (search) {
    search.addEventListener('click', (e) => { if (e.target === search) closeSearch(); });
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSearch(); });
  if (searchInput) searchInput.addEventListener('input', () => renderResults(searchInput.value));
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      renderResults(searchInput ? searchInput.value : '');
      const first = searchResults && $('.c-search__hit', searchResults);
      if (first) first.focus();
    });
  }

  /* ------------------------------------------------------------------------
   * Sliders
   * --------------------------------------------------------------------- */
  if (typeof window.Swiper !== 'undefined') {
    if ($('.js-spot')) {
      // eslint-disable-next-line no-new
      new window.Swiper('.js-spot', {
        slidesPerView: 1,
        loop: true,
        speed: 600,
        grabCursor: true,
        navigation: { prevEl: '.js-spot-prev', nextEl: '.js-spot-next' },
      });
    }

    if ($('.js-reviews')) {
      // eslint-disable-next-line no-new
      new window.Swiper('.js-reviews', {
        slidesPerView: 1,
        loop: true,
        speed: 700,
        spaceBetween: 60,
        grabCursor: true,
        navigation: { prevEl: '.js-rev-prev', nextEl: '.js-rev-next' },
      });
    }
  }

  /* ------------------------------------------------------------------------
   * Footer: subscribe form + year
   * --------------------------------------------------------------------- */
  const year = $('.js-year');
  if (year) year.textContent = String(new Date().getFullYear());

  const form = $('.js-subscribe');
  const note = $('.js-subscribe-note');

  if (form && note) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const ok = input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      note.classList.toggle('is-success', ok);
      note.classList.toggle('is-error', !ok);
      note.textContent = ok
        ? 'Thank you — the next studio letter is on its way to you.'
        : 'Please enter a valid email address.';
      if (ok) form.reset();
    });
  }

  /* ------------------------------------------------------------------------
   * GSAP motion
   * --------------------------------------------------------------------- */
  if (!hasGsap || reduceMotion) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  // Hero load-in: photo settles, copy rises
  const heroImg = $('.js-hero-img');
  if (heroImg) {
    gsap.fromTo(heroImg, { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'power3.out' });
  }
  gsap.fromTo('[data-load]',
    { autoAlpha: 0, y: '3vh' },
    { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.18, delay: 0.2 }
  );

  // Scroll reveals (fade up from 3vh, as the reference)
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => gsap.fromTo(batch,
      { autoAlpha: 0, y: '3vh' },
      { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out', stagger: 0.1, overwrite: true }
    ),
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
