# Flowise Plumbing

A single-page marketing website for **Flowise Plumbing** — a 5‑star, 24/7 plumbing
business based in Box Hill, NSW (Sydney's Hills District), Australia.

🔗 **Live (local):** served from WampServer at `http://localhost/sklentr/flowise-plumbing/`

---

## About the business

| Field        | Value                                              |
| ------------ | -------------------------------------------------- |
| Business     | Flowise Plumbing                                   |
| Category     | Plumber                                            |
| Rating       | ⭐ 5.0                                              |
| Address      | 4 Terry Rd, Box Hill NSW 2765, Australia           |
| Phone        | +61 490 528 490 (`tel:+61490528490`)               |
| Hours        | Open 24 hours / 7 days                             |
| Service area | Box Hill & Sydney's Hills District / North‑West    |

---

## Features

- **Single-page layout** — header, hero, services, about, work gallery,
  testimonials, CTA band, contact, and footer.
- **Conversion-focused** — click-to-call buttons and the phone number kept highly
  visible throughout.
- **Scroll-reveal animations** — sections fade/slide into view on scroll
  (progressively enhanced: content stays visible if JS is disabled).
- **Image gallery with lightbox** — work photos open in a Fancybox preview.
- **Responsive, mobile-first** — hamburger nav and fluid layout down to phone widths.
- **Embedded Google Map** of the Box Hill service location.

---

## Tech stack

- **HTML5** — hand-written semantic markup (`index.html`).
- **SCSS** — modular partials compiled into a single `css/style.css`.
- **Vanilla JavaScript** — scroll reveal, mobile nav, lightbox.
- **Fonts:** Archivo + Roboto (Google Fonts).
- **[Fancybox](https://fancyapps.com/)** for image previews.

---

## Project structure

```
flowise-plumbing/
├── index.html
├── css/
│   └── style.css            # compiled output (do not hand-edit)
├── scss/
│   ├── style.scss           # main file — imports all partials
│   ├── _variables.scss      # colors, fonts, breakpoints, spacing
│   ├── _mixins.scss         # reusable mixins
│   ├── _base.scss           # reset + base typography
│   ├── _header.scss         # nav / top bar
│   ├── _hero.scss           # hero section
│   ├── _services.scss       # services grid
│   ├── _about.scss          # about / why choose us
│   ├── _gallery.scss        # work gallery
│   ├── _testimonials.scss   # 5-star reviews
│   ├── _contact.scss        # contact + map + CTA
│   ├── _modal.scss          # modal / lightbox
│   └── _footer.scss         # footer + developer credit
└── images/                  # logo + work/about photos
```

---

## Getting started

This is a static site — no build step is required to view it.

### View it
Open `index.html` directly in a browser, or serve the folder over HTTP (e.g. via
WampServer/Apache, or `npx serve`).

### Edit the styles
Styles are authored in SCSS and compiled to `css/style.css`. Using
[Dart Sass](https://sass-lang.com/dart-sass/):

```bash
sass --watch scss/style.scss css/style.css
```

> `css/style.css` is generated output — edit the `scss/` partials, not the CSS.

---

## Credits

Designed & developed by **Biplab Kumar Paul** — Web Designer & Developer.
