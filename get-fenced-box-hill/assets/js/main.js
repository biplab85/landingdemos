/* =====================================================================
   Get Fenced Box Hill — main.js
   Nav, mobile app UI, drawer/sheet, accordion, sliders, lightbox, form.
   ===================================================================== */
(function () {
  'use strict';

  // Flag for CSS: JS is available (used to gate reveal hidden state)
  document.documentElement.classList.add('js');

  var body = document.body;

  /* ---------- Sticky header shrink ---------- */
  var header = document.querySelector('[data-header]');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Drawer (mobile menu) + overlay ---------- */
  var drawer = document.querySelector('[data-drawer]');
  var overlay = document.querySelector('[data-overlay]');
  var burger = document.querySelector('[data-burger]');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('is-open');
    if (overlay) overlay.classList.add('is-open');
    if (burger) burger.classList.add('is-open');
    body.classList.add('no-scroll');
    if (burger) burger.setAttribute('aria-expanded', 'true');
  }
  function closeDrawer() {
    if (drawer) drawer.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-open');
    if (burger) burger.classList.remove('is-open');
    body.classList.remove('no-scroll');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }

  if (burger) {
    burger.addEventListener('click', function () {
      drawer && drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
    });
  }
  if (overlay) overlay.addEventListener('click', closeDrawer);
  document.querySelectorAll('[data-drawer-close]').forEach(function (el) {
    el.addEventListener('click', closeDrawer);
  });
  document.querySelectorAll('[data-drawer] a').forEach(function (a) {
    a.addEventListener('click', closeDrawer);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ---------- Smooth-scroll for in-page links (offset for header) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 68;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---------- Scroll-spy (desktop nav + app nav) ---------- */
  var spyLinks = Array.prototype.slice.call(
    document.querySelectorAll('[data-spy]')
  );
  var sections = spyLinks
    .map(function (l) {
      return document.querySelector(l.getAttribute('href'));
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = '#' + entry.target.id;
          spyLinks.forEach(function (l) {
            l.classList.toggle('is-active', l.getAttribute('href') === id);
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach(function (s) {
      spy.observe(s);
    });
  }

  /* ---------- Accordion (FAQ) ---------- */
  document.querySelectorAll('[data-accordion]').forEach(function (root) {
    root.querySelectorAll('.accordion__trigger').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.accordion__item');
        var panel = item.querySelector('.accordion__panel');
        var isOpen = item.classList.contains('is-open');

        // close siblings
        root.querySelectorAll('.accordion__item').forEach(function (i) {
          i.classList.remove('is-open');
          i.querySelector('.accordion__panel').style.maxHeight = null;
          i.querySelector('.accordion__trigger').setAttribute(
            'aria-expanded',
            'false'
          );
        });

        if (!isOpen) {
          item.classList.add('is-open');
          panel.style.maxHeight = panel.scrollHeight + 'px';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });

  /* ---------- Swiper sliders ---------- */
  if (window.Swiper) {
    // Gallery
    if (document.querySelector('.gallery-swiper')) {
      new Swiper('.gallery-swiper', {
        slidesPerView: 1.15,
        spaceBetween: 16,
        grabCursor: true,
        freeMode: false,
        loop: true,
        loopAdditionalSlides: 3,
        autoplay: {
          delay: 2600,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        navigation: {
          nextEl: '[data-gallery-next]',
          prevEl: '[data-gallery-prev]',
        },
        breakpoints: {
          480: { slidesPerView: 1.6, spaceBetween: 18 },
          768: { slidesPerView: 2.4, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        },
      });
    }

    // Testimonials
    if (document.querySelector('.testimonials-swiper')) {
      new Swiper('.testimonials-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        grabCursor: true,
        autoHeight: false,
        pagination: { el: '.testimonials-pagination', clickable: true },
        breakpoints: {
          768: { slidesPerView: 2, spaceBetween: 22 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        },
      });
    }
  }

  /* ---------- Fancybox ---------- */
  if (window.Fancybox) {
    Fancybox.bind('[data-fancybox]', {
      Toolbar: {
        display: { left: ['infobar'], middle: [], right: ['slideshow', 'close'] },
      },
    });
  }

  /* ---------- Contact form (front-end validation demo) ---------- */
  var form = document.querySelector('[data-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var note = form.querySelector('[data-form-note]');
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending…';
      }
      // Placeholder: wire to a real endpoint / mail service here.
      window.setTimeout(function () {
        form.reset();
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Request my free quote';
        }
        if (note) {
          note.textContent =
            "Thanks! We've received your request and will call you within 1 business day.";
          note.style.color = 'var(--success)';
        }
      }, 900);
    });
  }

  /* ---------- Solutions tabs (What we offer) ---------- */
  var solutionsRoot = document.querySelector('[data-solutions]');
  if (solutionsRoot) {
    var solBtns = solutionsRoot.querySelectorAll('[data-solution]');
    var solImg = solutionsRoot.querySelector('[data-solution-img]');
    var solDesc = solutionsRoot.querySelector('[data-solution-desc]');
    var solTags = solutionsRoot.querySelector('[data-solution-tags]');

    function activateSolution(btn) {
      if (btn.classList.contains('is-active')) return;
      solBtns.forEach(function (b) {
        b.classList.remove('is-active');
      });
      btn.classList.add('is-active');
      solutionsRoot.classList.add('is-switching');

      window.setTimeout(function () {
        if (solImg) {
          solImg.src = btn.getAttribute('data-img');
          solImg.alt = btn.getAttribute('data-alt') || '';
        }
        if (solDesc) solDesc.textContent = btn.getAttribute('data-desc');
        if (solTags) {
          solTags.innerHTML = (btn.getAttribute('data-tags') || '')
            .split('|')
            .map(function (t) {
              return '<span class="tag">' + t + '</span>';
            })
            .join('');
        }
        solutionsRoot.classList.remove('is-switching');
      }, 200);
    }

    solBtns.forEach(function (btn) {
      // Swap on hover (per design) and on click/focus for touch + keyboard.
      btn.addEventListener('mouseenter', function () {
        activateSolution(btn);
      });
      btn.addEventListener('click', function () {
        activateSolution(btn);
      });
      btn.addEventListener('focus', function () {
        activateSolution(btn);
      });
    });
  }

  /* ---------- Footer accordions (mobile only) ---------- */
  var footerAccMq = window.matchMedia('(max-width: 767.98px)');
  document.querySelectorAll('[data-facc]').forEach(function (col) {
    var head = col.querySelector('.footer__col-head');
    if (!head) return;
    head.addEventListener('click', function () {
      if (!footerAccMq.matches) return; // desktop: headings are not interactive
      var open = col.classList.toggle('is-open');
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
