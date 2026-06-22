# Eco Pest Control Melbourne

A single-page marketing site for Eco Pest Control Melbourne — built as a static `index.html` with a modular SCSS architecture and a small vanilla-JS layer. Designed as a "botanical editorial" pest-control brand: confident serif typography (Fraunces) paired with a clean geometric sans (Manrope), warm cream surfaces, deep forest darks, and the eco-green primary `#92C14D`.

---

## Tech

- **Markup:** HTML5, single `index.html`
- **Styles:** SCSS (Dart Sass) compiled to `assets/css/style.css`
- **Scripts:** Vanilla JS (`assets/js/main.js`) — no framework
- **Fonts:** Fraunces (display) + Manrope (body) via Google Fonts
- **Brand primary:** `#92C14D`

---

## Project structure

```
.
├── index.html                # Single-page site
├── task.md                   # Original project task list
├── assets/
│   ├── css/
│   │   └── style.css         # Compiled SCSS output
│   ├── js/
│   │   └── main.js           # Sticky header, mobile nav, modal, FAQ, reveal
│   ├── images/               # All local images (logo, hero, services, etc.)
│   └── scss/
│       ├── style.scss        # Entry — @use's every layer
│       ├── abstracts/        # Variables, mixins, functions
│       ├── base/             # Reset, typography, global
│       ├── components/       # Buttons, card, form, accordion, modal, …
│       ├── layout/           # Header, nav, hero, footer
│       ├── sections/         # Welcome, services, termite, areas, …
│       └── pages/            # Page-level composition
```

Every SCSS folder has an `_index.scss` that `@forward`s its partials, and `style.scss` `@use`s each layer in order. To add a new module, create the partial and add a `@forward` line to that layer's `_index.scss`.

---

## Sections

1. **Header** — sticky logo + nav with hover dropdowns (Services, Termite, Pests); "Request a Quote" CTA on desktop; hamburger drawer on mobile
2. **Hero** — editorial split: big serif headline with italic-WONK "done" accent and wavy underline, scroll-reveal animated lines, primary CTA + phone CTA, photo plate with animated conic-gradient border and spinning eco stamp
3. **Welcome** — intro copy + the full "Pests we treat" grid
4. **Services** — Residential + Commercial cards (one card has dark variant)
5. **Termite** — editorial index: headline, 1/3 stat, tools-we-use list, vertical numbered list of 4 services
6. **Brands strip** — typography marquee scrolling partner brand names (BASF · Termidor · Sentricon · Exterra · Trelona · Bayer · Syngenta · Termatrac)
7. **Why Choose Us** — 6-item trust grid with leaf-green icon badges
8. **Reviews** — 3 testimonials with 5-star ratings and 4.9 aggregate
9. **FAQ** — 5-item accordion + "Talk to a person" side panel
10. **Areas** — Melbourne service-area list with city skyline photo
11. **Quote Modal** — full-page modal (forest aside + cream form) wired to every "Request a Quote" / "Request a free quote" / "Book inspection" / "Contact" CTA across the page
12. **Footer** — CTA block with headline + lede + button + phone, four-column link grid (Services / Pests / Contact with icons), socials under the brand column, copyright + "Made by CapsuleDIGITAL"

---

## Local development

### Compile SCSS

The repo ships with the compiled `assets/css/style.css`, so it can be opened directly. To rebuild from source:

```bash
# One-off compile
npx sass assets/scss/style.scss assets/css/style.css --style=expanded --no-source-map

# Watch mode while editing
npx sass --watch assets/scss/style.scss:assets/css/style.css --style=expanded --no-source-map
```

### Run it

Any static file server works. The site is also designed to drop into WAMP/MAMP under `www/sklentr/ecopestcontrolmelbourne/`. Or:

```bash
python -m http.server 8000
# then visit http://localhost:8000/
```

---

## Responsive

Tested at 360 px (small Android), 390 px (iPhone), 768 px (tablet), 1024 px (small desktop), 1440 px (desktop).

Mobile fixes shipped during build:
- Burger drawer is `position: fixed; inset: 0`, full-viewport — `backdrop-filter` only applied to the sticky header at `≥1024 px` so it doesn't create a containing block that constrains the drawer
- "Request a Quote" button hidden in the header at `<480 px` (still accessible via hero CTA, footer CTA, and Contact in the burger)
- Hero eco-stamp scales down at `<1024 px` and again at `<480 px` so it never overflows the photo
- `scroll-margin-top: 80px` on every `<section>` so anchor jumps don't hide the eyebrow behind the sticky header

---

## Credits

Built by [CapsuleDIGITAL](https://www.capsuledigital.com.au/).
