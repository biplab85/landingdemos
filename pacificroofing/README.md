# Pacific Roofing — Website

A modern, hand-coded rebuild of the Pacific Roofing website (originally a 2014 Wix site).
Static **HTML + SCSS + vanilla JS**, with **GSAP** for smooth, tasteful motion.

> Over 25 years of roofing, guttering and roof repairs across Sydney & surrounds.
> Lic. 37159C · Fully insured · 3-year guarantee · Free quote: **0421 759 907**

---

## Pages

| Page | File | Contents |
|------|------|----------|
| Home | `index.html` | Hero showcase, stats, about, services grid, **how-it-works** process, CTA band, footer |
| Services | `services.html` | Page hero + 6 detailed service blocks + CTA band |
| Contact | `contact.html` | Contact info cards, contact form, Google map embed |

Every page shares the same **header**, **mobile app-style tab bar**, **footer**, and **quote modal**.

---

## Design system

| Token | Value |
|-------|-------|
| Primary colour | `#00a0d9` (sky blue) |
| Dark anchor | `#0c1620` (slate) |
| Font | `"Open Sans", sans-serif` (Google Fonts) |
| Motion | GSAP 3.12 + ScrollTrigger |

**Concept — "Engineered Shelter / Clear-Sky":** a roofline visual language (rooftop-peak
section dividers, chevron/tile motifs), a dramatic dark hero/CTA/footer with a glowing blue
accent, and Open Sans pushed hard via weight, scale and tracking.

---

## Tech & structure

```
pacificroofing/
├── index.html / services.html / contact.html
├── css/
│   └── main.css              # compiled output (do not edit by hand)
├── scss/
│   ├── main.scss             # entry — @use imports all partials
│   ├── _variables.scss       # colours, type, spacing, breakpoints, easing
│   ├── _mixins.scss          # media queries, container, grain
│   ├── _base.scss            # reset, typography, helpers, roofline, reveal
│   ├── _buttons.scss
│   ├── _forms.scss           # shared form fields + success state
│   ├── _header.scss          # sticky header + desktop nav
│   ├── _tabbar.scss          # mobile app-style bottom tab bar
│   ├── _page.scss            # inner-page hero (Services / Contact)
│   ├── _modal.scss           # quote modal
│   ├── _footer.scss          # footer (+ premium mobile overrides)
│   └── components/
│       ├── _hero.scss  _stats.scss  _about.scss  _services.scss
│       ├── _process.scss  _cta.scss
│       └── _services-page.scss  _contact-page.scss
├── js/
│   ├── main.js               # nav toggle, scrolled header, year, quote modal, form handling
│   └── animations.js         # GSAP hero timeline, ScrollTrigger reveals, stat counters
└── assets/
    └── images/               # roofing photos (house.jpg, roof-1.jpg, roof-2.jpg)
```

---

## Build (SCSS → CSS)

Requires [Node.js](https://nodejs.org/). Sass is run via `npx` (no global install needed).

```bash
# one-off compile
npx sass scss/main.scss css/main.css --no-source-map

# watch & recompile on save
npx sass --watch scss/main.scss css/main.css
```

## Run locally

It's a static site — open it through any web server (the `file://` protocol won't load
everything correctly). Two easy options:

```bash
# via WAMP (project lives in www/)
#   http://localhost/sklentr/pacificroofing/index.html

# or a quick throwaway server
npx http-server -p 8077 -c-1
#   http://127.0.0.1:8077/index.html
```

---

## Features

- **Responsive** — mobile-first, verified at 390 / 768 / 1024 / 1440px.
- **Mobile app shell** — fixed bottom tab bar (Home · Services · Contact · Call) with iOS
  safe-area support; the hamburger drawer is retired on mobile.
- **GSAP motion** — staggered hero load, scroll-reveals, stat count-ups; fully disabled under
  `prefers-reduced-motion`.
- **Quote modal** — every "Get a free quote" CTA opens a premium split modal (branded panel +
  form). Closes via ✕ / overlay / Escape.
- **Accessibility** — semantic landmarks, alt text, labelled fields, visible focus states,
  reduced-motion fallbacks.

---

## ⚠️ Forms need a backend

The quote and contact forms currently show a **front-end success message only** — submissions
are **not delivered anywhere yet**. Before going live, wire the `form[data-form]` elements to a
mail handler. Options:

- **[Formspree](https://formspree.io/)** (or similar) — set the form `action`/`method` and
  remove the `e.preventDefault()` short-circuit in `js/main.js`.
- **PHP mailer** — since the project runs under WAMP, post to a small `sendmail.php`.

Form submissions should reach **pacificroofing1@hotmail.com**.

---

## 👨‍💻 Credits

**Designed & developed by Biplab Kumar Paul** — Web Designer & Developer
📱 01735 927356 · ✉️ biplab.cse.85@gmail.com

Site credit: [Capsule DIGITAL](https://www.capsuledigital.com.au/)

Content & branding © Pacific Roofing.
