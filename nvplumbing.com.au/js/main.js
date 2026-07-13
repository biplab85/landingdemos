// ─────────────────────────────────────────────────────────────
// Designed & developed by
// Biplab Kumar Paul — Web Designer & Developer
// Mobile: 01735 927356
// Email:  biplab.cse.85@gmail.com
// ─────────────────────────────────────────────────────────────

import { initNav } from './nav.js';
import { initAccordion } from './accordion.js';
import { initReveals } from './reveals.js';
import { initForm } from './form.js';
import { initTestimonials } from './testimonials.js';
import { initWorkSlider } from './work-slider.js';
import { initHero, initCounters } from './hero.js';
import { initWwdStack } from './wwd-stack.js';
import { initQuoteModal } from './quote-modal.js';
import { initNavActive } from './nav-active.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initAccordion();
  initReveals();
  initForm();
  initTestimonials();
  initWorkSlider();
  initHero();
  initCounters();
  initWwdStack();
  initQuoteModal();
  initNavActive();

  // current year in footer
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // sticky header shadow
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // back-to-top
  const btt = document.getElementById('back-to-top');
  if (btt) {
    const toggleBtt = () => {
      btt.classList.toggle('is-visible', window.scrollY > 600);
    };
    toggleBtt();
    window.addEventListener('scroll', toggleBtt, { passive: true });
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // smooth anchor scroll for in-page nav
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
});
