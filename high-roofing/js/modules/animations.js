// GSAP scroll reveals, hero intro, parallax. Degrades gracefully without GSAP.
import { $, $$ } from "../utils/dom.js";
import { prefersReducedMotion } from "../utils/prefers-motion.js";

function fallbackReveal() {
  // No GSAP (or reduced motion): reveal via IntersectionObserver + CSS class
  const els = $$(".reveal");
  if (!els.length || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  els.forEach((el) => io.observe(el));
}

export function init() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (!gsap || prefersReducedMotion()) {
    fallbackReveal();
    // still reveal any masked hero lines
    $$(".hero__line span").forEach((s) => (s.style.transform = "none"));
    return;
  }

  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  // --- Hero intro: masked line reveal + fade-up for supporting elements ---
  const heroLines = $$(".hero__line span");
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  if (heroLines.length) {
    gsap.set(heroLines, { yPercent: 110 });
    tl.to(heroLines, { yPercent: 0, duration: 0.9, stagger: 0.08 }, 0.1);
  }
  const heroFade = $$("[data-hero-fade]");
  if (heroFade.length) {
    gsap.set(heroFade, { opacity: 0, y: 22 });
    tl.to(heroFade, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.4);
  }
  const heroMedia = $(".hero__figure");
  if (heroMedia) {
    gsap.from(heroMedia, { opacity: 0, scale: 1.04, duration: 1.1, ease: "power2.out" }, 0);
  }

  if (!ScrollTrigger) {
    fallbackReveal();
    return;
  }

  // --- Generic scroll reveals ---
  $$(".reveal").forEach((el) => {
    const delay = parseFloat(el.dataset.delay || "0");
    gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      }
    );
  });

  // --- Staggered groups ---
  $$("[data-stagger]").forEach((group) => {
    const kids = Array.from(group.children);
    gsap.fromTo(
      kids,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: { trigger: group, start: "top 82%" },
      }
    );
  });

  // --- Parallax drift on tagged media ---
  $$("[data-parallax]").forEach((el) => {
    const amount = parseFloat(el.dataset.parallax || "40");
    gsap.to(el, {
      yPercent: amount * -0.1,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}
