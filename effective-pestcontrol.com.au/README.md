# Effective Pest Control — Single-Page Website

A modern, editorial-style single-page rebuild of [effective-pestcontrol.com.au](https://effective-pestcontrol.com.au/) — Sydney's family-owned pest specialists.

> The smallest things make the biggest difference.

---

## ✨ Highlights

- **Single `index.html`** — every nav link is a smooth-scroll anchor.
- **Editorial design system** — brand-red + warm cream + clay orange palette derived from the EPC logo.
- **Poppins** typography across the full weight range (300 → 900, plus italics).
- **Modular SCSS** architecture (abstracts / base / layout / components / sections / utilities).
- **3D parallax team carousel** — drag, swipe, prev/next, autoplay, parallax background-position shift.
- **Continuous testimonials marquee** with edge-fade mask and pause-on-hover.
- **Services section** with layered radial-gradient background + 6 drifting pest-silhouette SVGs animated continuously.
- **Animated mesh background** on the testimonials section (4 radial blobs drifting on staggered timelines).
- **FAQ accordion** with grid-template-rows transition (no JS height calc, pure CSS).
- **Sticky header**, **back-to-top**, **floating mobile call button**, **scroll-reveal** on every major section.
- **Fully responsive** — desktop, tablet and mobile with a polished mobile nav drawer.

---

## 🏗 Project Structure

```
effective-pestcontrol/
├── index.html
├── favicon.png                       (real favicon from the live site)
├── apple-touch-icon.png
├── assets/
│   ├── css/
│   │   └── style.css                 (compiled stylesheet — the one index.html loads)
│   └── js/
│       └── main.js                   (vanilla JS interactions)
├── images/
│   ├── logo.png                      (EPC brand mark)
│   ├── 01 (1..46).jpeg/png/svg       (working pest-control photography)
│   └── team/                         (team portraits for the parallax ring)
└── scss/
    ├── style.scss                    (entry — forwards every partial)
    ├── abstracts/
    │   ├── _variables.scss
    │   ├── _mixins.scss
    │   └── _functions.scss
    ├── base/
    │   ├── _reset.scss
    │   ├── _typography.scss
    │   └── _global.scss
    ├── layout/
    │   ├── _container.scss
    │   ├── _grid.scss
    │   ├── _header.scss
    │   └── _footer.scss
    ├── components/
    │   ├── _buttons.scss
    │   ├── _navbar.scss
    │   ├── _section-heading.scss
    │   ├── _social-icons.scss
    │   ├── _hero.scss
    │   ├── _service-card.scss
    │   ├── _feature-card.scss
    │   ├── _testimonial-card.scss
    │   ├── _faq-accordion.scss
    │   └── _form.scss
    ├── sections/
    │   ├── _about.scss
    │   ├── _team.scss
    │   ├── _services.scss
    │   ├── _why-choose.scss
    │   ├── _cta-banner.scss
    │   ├── _preparation.scss
    │   ├── _testimonials.scss
    │   ├── _faq.scss
    │   └── _contact.scss
    └── utilities/
        ├── _helpers.scss
        └── _animations.scss
```

Every `.scss` partial carries the same designer-credit header block per project convention.

---

## 🎨 Design System

### Palette (derived from the EPC logo)

| Token            | Value     | Usage                                  |
|------------------|-----------|----------------------------------------|
| `--cream`        | `#F2EBE0` | Main background                        |
| `--cream-soft`   | `#F8F4EC` | Cards, alt sections                    |
| `--cream-deep`   | `#E8DEC9` | Contact section background             |
| `--moss`         | `#8E1F1F` | Deep brand red (dark sections)         |
| `--moss-soft`    | `#A82828` | Medium brand red                       |
| `--moss-light`   | `#C53030` | Logo red — buttons, accents            |
| `--clay`         | `#E68A1E` | Logo arc orange — eyebrows, highlights |
| `--clay-deep`    | `#BF6F12` | Clay hover state                       |
| `--ink`          | `#0D1410` | Headings, body                         |
| `--muted`        | `#6F7A72` | Secondary text                         |

### Type Scale

- Display: `clamp(2.8rem, 7vw, 6rem)` — Poppins 800
- Section titles: `clamp(2.1rem, 4.4vw, 3.6rem)` — Poppins 800
- Body: `16px / 1.7` — Poppins 400
- Eyebrows: `11px / .18em` uppercase — Poppins 600

### Breakpoints

| Token | Value   |
|-------|---------|
| `xl`  | 1240px  |
| `lg`  | 1100px  |
| `md`  | 960px   |
| `sm`  | 640px   |

---

## 🚀 Getting Started

### View

```bash
# Local: drop the folder into WAMP/XAMPP htdocs and open
http://localhost/effective-pestcontrol/
```

No build step required — `assets/css/style.css` is pre-compiled and `assets/js/main.js` is vanilla.

### Re-compile SCSS

```bash
# One-shot
sass scss/style.scss assets/css/style.css

# Watch mode
sass --watch scss/style.scss:assets/css/style.css --style=compressed
```

---

## 📑 Sections in `index.html`

1. **Top bar** — phone, email, area, rating, social (hidden on mobile)
2. **Header** — logo, primary nav, "Call us" CTA, mobile hamburger drawer
3. **Hero** — editorial split layout, `35` backdrop number, 3 trust stamps, photo card with 5★ badge
4. **Marquee** — scrolling pest list strip
5. **About** — overlapped two-photo collage, rotated "est. 1989" badge, 3 numbered brand principles, sticky photo column
6. **Team** — 3D parallax ring carousel with 8 EPC team portraits, autoplay + drag + arrows
7. **Services** — animated gradient background, 6 drifting pest SVGs, 3×2 service card grid (feature + 4 services + free-quote promo card)
8. **Why us** — 6 hairline feature tiles
9. **CTA banner** — phone-call focus
10. **Preparation** — 5-step prep checklist with sticky intro aside
11. **Testimonials** — animated mesh background + infinite marquee of 6 client quotes
12. **FAQ** — 13-item accordion with sticky intro
13. **Contact** — info column + form with pest-type chip selectors
14. **Footer** — brand, sitemap, services, contact + heart-animated credit

Floating utilities: mobile call button, back-to-top arrow.

---

## ⚙ JavaScript (`assets/js/main.js`)

Vanilla, no framework. Handles:

- Sticky header (`is-stuck` class on scroll)
- Mobile nav toggle (drawer animation)
- Active-link tracking via `IntersectionObserver`
- FAQ accordion (single-open)
- **Testimonials marquee** (HTML cards duplicated for seamless `translateX(-50%)` loop)
- **Team 3D parallax ring**
  - Drag (mouse + touch) with snap-to-nearest-step
  - Prev / next buttons and keyboard `←` / `→`
  - Autoplay every 3.8s (pauses on hover and when section is off-screen / tab is hidden)
  - Background-position shift on each face based on rotation angle (parallax)
- Back-to-top button visibility
- Scroll-reveal stagger
- Contact form HTML5 validation + demo success state
- Smooth-scroll for in-page anchor links

---

## ✦ Credits

- **Design &amp; development:** **Biplab Kumar Paul** — Web Designer &amp; Developer
  📱 01735 927356 · ✉️ [biplab.cse.85@gmail.com](mailto:biplab.cse.85@gmail.com)
- **Agency:** [CapsuleDIGITAL](https://www.capsuledigital.com.au/) — public footer credit
- **Reference site (source of truth):** [effective-pestcontrol.com.au](https://effective-pestcontrol.com.au/)
- **Brand:** © Effective Pest Control (Sydney)
- **Photography:** EPC field photography (provided in `images/`)
- **Type:** [Poppins](https://fonts.google.com/specimen/Poppins) via Google Fonts
