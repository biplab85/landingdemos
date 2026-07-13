/* ─────────────────────────────────────────────────────────────
   Designed & developed by
   Biplab Kumar Paul — Web Designer & Developer
   Mobile: 01735 927356
   Email:  biplab.cse.85@gmail.com

   MELBOURNE WIDE ELECTRICAL — interactive behaviors
   ───────────────────────────────────────────────────────────── */
(function(){
  'use strict';

  /* ===== Sticky header on scroll ===== */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');

    // back-to-top visibility
    const top = document.getElementById('toTop');
    if (window.scrollY > 600) top.classList.add('is-visible');
    else top.classList.remove('is-visible');
  };
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* ===== Mobile nav toggle ===== */
  const nav = document.getElementById('mainNav');
  const burger = document.getElementById('hamburger');
  const navClose = document.getElementById('navClose');
  const closeNav = () => {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded','false');
    document.body.classList.remove('is-locked');
  };
  const toggleNav = () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('is-locked', open);
  };
  burger.addEventListener('click', toggleNav);
  navClose.addEventListener('click', closeNav);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if (nav.classList.contains('is-open')) closeNav();
  }));

  /* ===== Mobile bottom app-bar → menu button ===== */
  const appbarMenu = document.getElementById('appbarMenu');
  if (appbarMenu) appbarMenu.addEventListener('click', toggleNav);

  /* ===== Footer accordions (mobile only) ===== */
  const mqMobile = window.matchMedia('(max-width: 768px)');
  document.querySelectorAll('.footer__col--acc').forEach(col => {
    const head = col.querySelector('h4');
    if (!head) return;
    head.addEventListener('click', () => {
      if (!mqMobile.matches) return;            // desktop: do nothing
      col.classList.toggle('is-open');
    });
  });
  // reset any open state when returning to desktop
  mqMobile.addEventListener('change', (e) => {
    if (!e.matches) document.querySelectorAll('.footer__col--acc.is-open')
      .forEach(c => c.classList.remove('is-open'));
  });

  /* ===== Smooth scroll for in-page anchors ===== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const tgt = document.querySelector(id);
      if (!tgt) return;
      e.preventDefault();
      const headerH = header.offsetHeight + 12;
      window.scrollTo({
        top: tgt.getBoundingClientRect().top + window.scrollY - headerH,
        behavior: 'smooth'
      });
    });
  });

  /* ===== Back to top click ===== */
  document.getElementById('toTop').addEventListener('click', () => {
    window.scrollTo({ top:0, behavior:'smooth' });
  });

  /* ===== Active nav link on scroll (IntersectionObserver) ===== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = nav.querySelectorAll('.nav__list > li > a');
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting){
          const id = '#' + en.target.id;
          navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === id));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(s => io.observe(s));
  }

  /* ===== Stat counter (animate when visible) ===== */
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length){
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const duration = 1600;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const val = Math.round(easeOut(p) * target);
        el.textContent = val.toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting && !en.target.dataset.done){
          en.target.dataset.done = '1';
          animate(en.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(c => cio.observe(c));
  }

  /* ===== Testimonial slider ===== */
  const track = document.getElementById('quotesTrack');
  const prev  = document.getElementById('quotesPrev');
  const next  = document.getElementById('quotesNext');
  const dots  = document.getElementById('quotesDots');
  if (track && prev && next){
    const slides = Array.from(track.children);
    let perView = 3;
    let idx = 0;
    let timer = null;

    const calcPerView = () => {
      const w = window.innerWidth;
      if (w <= 680) perView = 1;
      else if (w <= 1024) perView = 2;
      else perView = 3;
    };

    const maxIdx = () => Math.max(0, slides.length - perView);

    const render = () => {
      calcPerView();
      const slideWidth = track.parentElement.clientWidth / perView;
      const gap = 24; // matches CSS gap
      slides.forEach(s => { s.style.flex = `0 0 calc(${100/perView}% - ${(gap*(perView-1))/perView}px)`; });
      idx = Math.min(idx, maxIdx());
      const offsetX = idx * (slideWidth);
      track.style.transform = `translateX(-${idx * (100/perView)}%)`;
      // dots
      dots.innerHTML = '';
      const pages = maxIdx() + 1;
      for (let i=0; i<pages; i++){
        const b = document.createElement('button');
        b.className = 'quotes__dot' + (i === idx ? ' is-active' : '');
        b.setAttribute('aria-label', `Go to review ${i+1}`);
        b.addEventListener('click', () => { idx = i; render(); restart(); });
        dots.appendChild(b);
      }
    };

    const go = (dir) => {
      const max = maxIdx();
      idx += dir;
      if (idx < 0) idx = max;
      if (idx > max) idx = 0;
      render();
    };

    prev.addEventListener('click', () => { go(-1); restart(); });
    next.addEventListener('click', () => { go(1); restart(); });

    const start = () => { timer = setInterval(() => go(1), 6000); };
    const stop  = () => { if (timer) clearInterval(timer); timer = null; };
    const restart = () => { stop(); start(); };

    track.parentElement.addEventListener('mouseenter', stop);
    track.parentElement.addEventListener('mouseleave', start);
    window.addEventListener('resize', render);

    render();
    start();
  }

  /* ===== Quote modal ===== */
  const modal = document.getElementById('quoteModal');
  let lastFocused = null;

  const openModal = () => {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-modal-open');
    // close mobile nav if open
    if (nav && nav.classList.contains('is-open')) closeNav();
    // focus first input after transition
    setTimeout(() => {
      const firstField = modal.querySelector('input, select, textarea');
      if (firstField) firstField.focus();
    }, 350);
  };

  const closeModal = () => {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-modal-open');
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  };

  // Bind all open triggers
  document.querySelectorAll('.js-open-quote').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Bind close triggers
  if (modal){
    modal.querySelectorAll('[data-modal-close]').forEach(el => {
      el.addEventListener('click', closeModal);
    });
    // Esc key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false'){
        closeModal();
      }
    });
  }

  /* ===== Quote form submission ===== */
  const form = document.getElementById('quoteForm');
  if (form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(f => {
        if (!f.value.trim()){
          valid = false;
          f.style.borderColor = '#ff6b6b';
          f.addEventListener('input', () => { f.style.borderColor = ''; }, { once:true });
        }
      });
      if (!valid) return;

      const success = document.getElementById('formSuccess');
      const submitBtn = form.querySelector('button[type="submit"]');
      success.hidden = false;
      submitBtn.textContent = 'Sent ✓';
      submitBtn.disabled = true;
      setTimeout(() => {
        form.reset();
        success.hidden = true;
        submitBtn.innerHTML = 'Send my quote request <span class="btn__arrow">→</span>';
        submitBtn.disabled = false;
        // auto-close modal a couple of seconds after success
        if (modal && modal.getAttribute('aria-hidden') === 'false') closeModal();
      }, 3500);
    });
  }

  /* ===== Reveal-on-scroll (subtle) ===== */
  if ('IntersectionObserver' in window){
    const reveals = document.querySelectorAll('.svc, .why__card, .quote, .stat, .about__shot');
    reveals.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity .8s cubic-bezier(.2,.7,.1,1), transform .8s cubic-bezier(.2,.7,.1,1)';
    });
    const rio = new IntersectionObserver((entries) => {
      entries.forEach((en, i) => {
        if (en.isIntersecting){
          setTimeout(() => {
            en.target.style.opacity = '1';
            en.target.style.transform = 'translateY(0)';
          }, i * 60);
          rio.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(el => rio.observe(el));
  }

  /* ===== Hover spark trail on copper buttons (subtle) ===== */
  document.querySelectorAll('.btn--primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top)  / r.height) * 100;
      btn.style.backgroundImage = `radial-gradient(circle at ${x}% ${y}%, rgba(255,210,63,.4) 0%, transparent 50%)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.backgroundImage = ''; });
  });

})();
