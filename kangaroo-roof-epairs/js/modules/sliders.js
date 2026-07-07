// Swiper sliders: gallery + testimonials. No-op if Swiper absent.
import { $ } from "../utils/dom.js";

export function init() {
  const Swiper = window.Swiper;
  if (!Swiper) return;

  // Gallery — free, peek slides
  if ($(".gallery__carousel")) {
    new Swiper(".gallery__carousel", {
      slidesPerView: "auto",
      spaceBetween: 20,
      grabCursor: true,
      speed: 600,
      navigation: {
        prevEl: ".gallery .swiper-nav-prev",
        nextEl: ".gallery .swiper-nav-next",
        disabledClass: "is-disabled",
      },
      breakpoints: {
        768: { spaceBetween: 28 },
      },
    });
  }

  // Testimonials
  if ($(".testimonials__carousel")) {
    new Swiper(".testimonials__carousel", {
      slidesPerView: 1,
      spaceBetween: 24,
      speed: 600,
      autoHeight: false,
      pagination: {
        el: ".testimonials .swiper-pagination",
        clickable: true,
      },
      navigation: {
        prevEl: ".testimonials .swiper-nav-prev",
        nextEl: ".testimonials .swiper-nav-next",
        disabledClass: "is-disabled",
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  }
}
