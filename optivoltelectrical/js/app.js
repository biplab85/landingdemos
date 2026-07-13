/* ============================================================
   Optivolt Electrical — theme interactions
   ============================================================ */
(function () {
  'use strict';

  const header = document.getElementById('siteHeader');
  const toTop = document.getElementById('toTop');

  /* ---------- Scroll-spy: active nav item per section ---------- */
  const spyLinks = [...document.querySelectorAll('.mainnav > a, .mainnav__item > a, .app-bar a[href^="#"]')]
    .filter(a => (a.getAttribute('href') || '').startsWith('#'));
  const spySections = spyLinks
    .map(a => ({ link: a, el: document.getElementById(a.getAttribute('href').slice(1)) }))
    .filter(s => s.el);
  const spy = () => {
    const y = window.scrollY + 130;
    const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
    let active = spySections[0];
    spySections.forEach(s => {
      if (s.el.offsetTop <= y && s.el.offsetTop >= active.el.offsetTop) active = s;
    });
    if (atBottom) active = spySections.reduce((a, b) => b.el.offsetTop > a.el.offsetTop ? b : a, active);
    const activeHref = active ? active.link.getAttribute('href') : null;
    spyLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === activeHref));
  };

  /* ---------- Mobile app-bar "Menu" opens the mobile panel ---------- */
  const appBarMenu = document.getElementById('appBarMenu');
  if (appBarMenu) appBarMenu.addEventListener('click', () => document.getElementById('burger').click());

  /* ---------- Footer columns: accordion on mobile only ---------- */
  const footerMobile = window.matchMedia('(max-width:768px)');
  document.querySelectorAll('.footer__col-head').forEach(head => {
    head.setAttribute('role', 'button');
    head.setAttribute('tabindex', '0');
    const toggle = () => {
      if (!footerMobile.matches) return;
      const col = head.parentElement;
      col.classList.toggle('open');
      head.setAttribute('aria-expanded', col.classList.contains('open'));
    };
    head.addEventListener('click', toggle);
    head.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });
  footerMobile.addEventListener('change', e => {
    if (!e.matches) document.querySelectorAll('.footer__col.open').forEach(c => c.classList.remove('open'));
  });

  /* ---------- Sticky header + back-to-top visibility ---------- */
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    toTop.classList.toggle('show', window.scrollY > 500);
    spy();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('burger');
  const panel = document.getElementById('mobilePanel');
  const backdrop = document.createElement('div');
  backdrop.className = 'backdrop';
  document.body.appendChild(backdrop);

  const closeMenu = () => {
    burger.classList.remove('open');
    panel.classList.remove('open');
    backdrop.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  const openMenu = () => {
    burger.classList.add('open');
    panel.classList.add('open');
    backdrop.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  burger.addEventListener('click', () =>
    burger.classList.contains('open') ? closeMenu() : openMenu()
  );
  backdrop.addEventListener('click', closeMenu);
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  toTop.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  /* ---------- FAQ accordion ---------- */
  const accs = document.querySelectorAll('.acc');
  const setH = (acc, open) => {
    const a = acc.querySelector('.acc__a');
    a.style.maxHeight = open ? a.scrollHeight + 'px' : '0px';
  };
  accs.forEach(acc => {
    if (acc.classList.contains('acc--open')) setH(acc, true);
    acc.querySelector('.acc__q').addEventListener('click', () => {
      const isOpen = acc.classList.contains('acc--open');
      accs.forEach(o => { o.classList.remove('acc--open'); setH(o, false); });
      if (!isOpen) { acc.classList.add('acc--open'); setH(acc, true); }
    });
  });
  window.addEventListener('resize', () => {
    const open = document.querySelector('.acc--open');
    if (open) setH(open, true);
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Cursor-following disc (magnetic button) ---------- */
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.querySelectorAll('.cursor-wrap').forEach(wrap => {
    const disc = wrap.querySelector('.cursor-disc');
    if (!disc || !canHover) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, active = false, seeded = false;
    wrap.addEventListener('mouseenter', () => { active = true; disc.classList.add('on'); });
    wrap.addEventListener('mouseleave', () => { active = false; disc.classList.remove('on'); });
    wrap.addEventListener('mousemove', e => {
      const r = wrap.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!seeded) { cx = tx; cy = ty; seeded = true; }
    });
    const loop = () => {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      disc.style.left = cx + 'px';
      disc.style.top = cy + 'px';
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });

  /* ---------- Fancybox lightbox (gallery) ---------- */
  if (window.Fancybox) {
    Fancybox.bind('[data-fancybox="gallery"]', {
      Toolbar: { display: { left: ['infobar'], middle: [], right: ['slideshow', 'fullscreen', 'thumbs', 'close'] } },
      Thumbs: { type: 'classic' }
    });
  }

  /* ---------- Testimonial slider ---------- */
  const slider = document.getElementById('testiSlider');
  if (slider) {
    const slides = [...slider.querySelectorAll('.testi__slide')];
    const dotsWrap = document.getElementById('testiDots');
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = 'testi__dot' + (idx === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (idx + 1));
      dot.addEventListener('click', () => { go(idx); restart(); });
      dotsWrap.appendChild(dot);
    });
    const dots = [...dotsWrap.children];
    let i = 0, timer;
    const go = n => {
      slides[i].classList.remove('is-active');
      dots[i] && dots[i].classList.remove('is-active');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('is-active');
      dots[i] && dots[i].classList.add('is-active');
    };
    const restart = () => { clearInterval(timer); timer = setInterval(() => go(i + 1), 6000); };
    slider.querySelectorAll('[data-testi-prev]').forEach(b =>
      b.addEventListener('click', () => { go(i - 1); restart(); }));
    slider.querySelectorAll('[data-testi-next]').forEach(b =>
      b.addEventListener('click', () => { go(i + 1); restart(); }));
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', restart);
    restart();
  }

  /* ---------- Count-up ---------- */
  const counters = document.querySelectorAll('.count');
  const runCount = el => {
    const target = +el.dataset.count;
    const dur = 1600, start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(c => cio.observe(c));
  } else {
    counters.forEach(c => (c.textContent = c.dataset.count));
  }
})();
