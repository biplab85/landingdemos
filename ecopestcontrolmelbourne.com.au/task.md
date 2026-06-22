# Eco Pest Control Melbourne – Project Task List

> Reference website: https://www.ecopestcontrolmelbourne.com.au/
> Deliverable: A single `index.html` page styled with modular SCSS files, plus all original images downloaded locally.

---

## 1. Project Setup

- [ ] Create folder structure
  - `/index.html`
  - `/assets/images/` (all downloaded site images)
  - `/assets/css/style.css` (compiled output)
  - `/assets/scss/` (modular SCSS partials)
  - `/assets/js/main.js` (small interactive bits — mobile menu, FAQ accordion, form)
- [ ] Add the designer credit comment block at the top of `index.html`, `style.scss`, and `main.js`:

```
// ─────────────────────────────────────────────────────────────
// Designed & developed by
// Biplab Kumar Paul — Web Designer & Developer
// Mobile: 01735 927356
// Email:  biplab.cse.85@gmail.com
// ─────────────────────────────────────────────────────────────
```

---

## 2. Asset Download (from live site)

Download every image used on the live homepage into `assets/images/`:

- [ ] `eco-pest-control-melbourne-logo.png` (header logo)
- [ ] `eco-pest-control-melbourne-favicon.png`
- [ ] `eco-pest-control-melbourne-favicon-52x50.png`
- [ ] `eco-pest-control-melbourne-favicon-300x300.png`
- [ ] `eco-pest-control-melbourne-banner.jpg` (hero/banner)
- [ ] `residential-pest-control-melbourne.jpg`
- [ ] `pest-control-melbourne.gif` (commercial section)
- [ ] `termite-control-melbourne.jpg` (termite section)
- [ ] `pest-control-contact-us.jpg`
- [ ] `pesticide-chemical-brands.png` (BASF / Termidor brands)
- [ ] `pest-control-melbourne-packages.jpg` (areas / packages)
- [ ] `pattern7.png` (background texture)

---

## 3. SCSS Architecture (modular — every file gets added)

`assets/scss/style.scss` is the entry point. It `@use`s every partial below.

### Abstracts (configuration & helpers)
- [ ] `abstracts/_variables.scss` — colors, fonts, spacing, breakpoints
- [ ] `abstracts/_mixins.scss` — media queries, flex/grid helpers, button mixin
- [ ] `abstracts/_functions.scss` — rem, color tint/shade
- [ ] `abstracts/_index.scss` — forwards all abstracts

### Base (resets & global)
- [ ] `base/_reset.scss` — modern CSS reset
- [ ] `base/_typography.scss` — heading scale, body, links
- [ ] `base/_global.scss` — body, container, utility wrappers
- [ ] `base/_index.scss`

### Components (reusable UI)
- [ ] `components/_buttons.scss` — primary "Request a Quote", secondary, ghost
- [ ] `components/_card.scss` — service cards, feature cards
- [ ] `components/_form.scss` — quote form (inputs, selects, checkboxes, textarea)
- [ ] `components/_testimonial.scss` — review card with stars
- [ ] `components/_accordion.scss` — FAQ accordion
- [ ] `components/_socials.scss` — social icon row
- [ ] `components/_badge.scss` — trust badges (12-month warranty, $20M insurance, etc.)
- [ ] `components/_index.scss`

### Layout (structural areas)
- [ ] `layout/_header.scss` — top bar (phone + hours), logo, nav, CTA
- [ ] `layout/_nav.scss` — desktop nav + mobile burger
- [ ] `layout/_hero.scss` — banner section
- [ ] `layout/_footer.scss` — links, socials, copyright
- [ ] `layout/_index.scss`

### Sections (page-specific)
- [ ] `sections/_welcome.scss` — "Welcome To Eco Pest Control Melbourne"
- [ ] `sections/_services.scss` — Residential + Commercial cards
- [ ] `sections/_termite.scss` — termite inspection / treatment / barrier / baiting
- [ ] `sections/_why-choose.scss` — Why Choose Us trust grid
- [ ] `sections/_testimonials.scss` — Reviews
- [ ] `sections/_faq.scss` — FAQ
- [ ] `sections/_areas.scss` — Areas We Service
- [ ] `sections/_contact.scss` — Contact Us + Request Quote form
- [ ] `sections/_index.scss`

### Pages
- [ ] `pages/_home.scss` — page-level composition tweaks

### Entry
- [ ] `style.scss` — `@use` every `_index.scss` above

---

## 4. `index.html` Build (single page — all content from live site)

Sections in order (top → bottom):

- [ ] **Top utility bar**: phone `03 8595 9880`, hours `Mon–Fri 9am–5pm · Weekends by appointment`, address `10/117 Hardware St, Melbourne VIC 3000`, social icons
- [ ] **Header**: logo + main navigation + "Request a Quote" CTA
  - Nav items: Home · About Us · Services (Residential / Commercial) · Termite Control (Barriers / Baiting / Inspections / Reticulation / Termidor) · Pests (Ant, Bed Bug, Cockroach, Flea, Rodent, Spider, Silverfish, White Ant, Tick) · Testimonials · FAQ · Quotes · Locations · Contact Us
- [ ] **Hero**: "Welcome To Eco Pest Control Melbourne" + "The Pest Management & Termite Treatment Experts" + CTA buttons (Request a Quote / Call Us)
- [ ] **Welcome / intro paragraph** (full text from site)
- [ ] **Services**: Residential Pest Control card + Commercial Pest Control card (with commercial specialties list: Strata/Offices, Retail, Shopping Centres, Restaurants, Schools, Childcare, Hotels, Government)
- [ ] **Termite section** (4 blocks):
  - Termite Inspections (with detection tools list: borescope, Termatrac T3i, thermal imaging, moisture metres, termite tapper)
  - Termite Treatment (Termidor / BASF copy)
  - Termite Barrier (physical & chemical)
  - Termite Baiting Systems (Sentricon, Exterra, Trelona)
- [ ] **Brands strip**: `pesticide-chemical-brands.png`
- [ ] **Why Choose Us** (7 trust items): Licensed PCOs · $20M Public Liability · 10 Years Experience · Eco-friendly Products · One-off or Regular Plans · Friendly & Reliable · Competitive Prices
- [ ] **Reviews / Testimonials**: 3 reviews (Stephen Wright, Freddie John, Samantha)
- [ ] **FAQ accordion**: 3 questions (cost / duration / DIY)
- [ ] **Areas We Service**: Central, CBD, Inner City, Eastern, South East, Northern, Western, Mornington Peninsula
- [ ] **Contact + Quote form**: name, email, phone, service dropdown, checkboxes (Residential / Commercial / Termite / Building & Pest / Other), message, submit
- [ ] **Footer**: contact block, quick links (Home/Privacy/Terms/Disclaimer/Contact/Sitemap), socials, copyright `© 2026 Eco Pest Control Melbourne`

---

## 5. JS (minimal)

- [ ] Mobile nav toggle (burger)
- [ ] FAQ accordion open/close
- [ ] Smooth scroll for in-page anchor links
- [ ] Form: prevent default + simple required-field check

---

## 6. Polish & QA

- [ ] Responsive: 360 / 768 / 1024 / 1440 breakpoints
- [ ] All images use local `assets/images/...` paths (no external URLs)
- [ ] Compile SCSS → `assets/css/style.css` (or link `style.scss` if dev server handles it)
- [ ] Validate HTML structure (single `<h1>`, semantic landmarks: header/nav/main/section/footer)
- [ ] Accessibility: alt text on every image, aria-labels on icon-only buttons, focus states on links/buttons
- [ ] Designer credit block present in `index.html`, `style.scss`, and `main.js`

---

_Last updated: 2026-05-26_
