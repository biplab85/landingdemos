# NV Plumbing — Project Task Plan

> Reference site: <https://nvplumbing.com.au/>
> Goal: rebuild the site as a modern, production-grade frontend that keeps the brand promise — *"Trust the Best, Flush the Rest"* — but with vastly better hierarchy, content depth, performance and design polish.

---

## 1. Project Identity (extracted from reference site)

| Field | Value |
|---|---|
| Business | **NV Plumbing** |
| Tagline | *"Trust the Best Flush the Rest"* |
| Sub-headline | *"We provide fast and reliable plumbing services for homeowners, real estates and strata at a fair price"* |
| Founded | 2010 (15+ years) |
| Phone | **0404 966 411** (tel:0404966411) |
| Service region | Sydney — Inner West, Eastern Suburbs, North Shore |
| Audience | Homeowners, real-estate agents, strata managers |
| Brand promise | Licensed plumbers, fair pricing, high-quality materials |

---

## 2. Pages / Sitemap

1. **Home** (`index.html`)
2. **About** (`about.html`)
3. **Services** (`services.html`)
4. **Hot Water Prices** (`hot-water.html`)
5. **Service Areas** (`service-areas.html`)
6. **Gallery** (`gallery.html`)
7. **Contact** (`contact.html`)

A single shared header + footer drives navigation across all pages.

---

## 3. Section Inventory

### 3.1 Home (`index.html`)
- [ ] **Top bar** — phone, hours strip, "24/7 Emergency" pill
- [ ] **Sticky header** — logo, nav, prominent "Call Now" CTA
- [ ] **Hero** — split layout: bold headline + tagline + dual CTAs (Call / Get a Quote) + accent visual (plumber illustration / photo / water wave SVG)
- [ ] **Trust strip** — Licensed · Insured · 15+ Years · Fair Price · Same-Day Service · Sydney-wide
- [ ] **Services grid** — 6–8 cards (icons + title + 1-line description + "Learn more")
- [ ] **Why Choose Us** — 4 feature blocks with iconography
- [ ] **Hot Water highlight** — Rheem range teaser → links to Hot Water Prices
- [ ] **Service Areas teaser** — map silhouette + suburb chip cloud
- [ ] **Testimonials carousel / wall** — placeholder cards (3–6)
- [ ] **CTA banner** — full-width "Got a leak? Call us now" with phone
- [ ] **Footer**

### 3.2 About
- [ ] Hero strip (short)
- [ ] Story block — founded 2010, mission, philosophy
- [ ] Stats row — Years · Jobs done · Suburbs served · Star rating
- [ ] Values / How we work — 3 columns
- [ ] Owner card (placeholder photo + bio slot)
- [ ] CTA banner

### 3.3 Services
- [ ] Hero strip
- [ ] Full services list with anchors:
  - Emergency Plumbing (24/7)
  - General Repairs & Maintenance
  - Hot Water Installation & Repair
  - Blocked Drains
  - Gas Fitting
  - Tap & Mixer Replacement
  - Toilet Repairs & Installation
  - Leak Detection
  - Strata & Real-Estate Plumbing
  - Bathroom & Kitchen Renovation Plumbing
- [ ] Each service: icon, description, common scenarios, CTA
- [ ] "How it works" 4-step strip (Call → Quote → Same-day visit → Fixed-price job)

### 3.4 Hot Water Prices
- [ ] Hero strip
- [ ] Brand row — Rheem (others noted as "by request")
- [ ] Pricing table:
  - Rheem 50L / 80L / 125L / 135L / 170L / 250L
  - Columns: model, capacity, suitable for, indicative price (placeholder), CTA
- [ ] FAQ accordion (3–5 questions)
- [ ] CTA banner

### 3.5 Service Areas
- [ ] Hero strip
- [ ] Region tabs: Inner West · Eastern Suburbs · North Shore · Other
- [ ] Suburb chip grid (all 50+ suburbs from reference site)
- [ ] CTA banner

### 3.6 Gallery
- [ ] Filterable grid (All / Hot Water / Drains / Bathrooms / Repairs)
- [ ] Lightbox on click
- [ ] Placeholder images using consistent aspect ratio

### 3.7 Contact
- [ ] Hero strip
- [ ] Two-column: contact info card + quote form
- [ ] Quote form fields: name, phone, email, suburb, service type (select), preferred time, message
- [ ] Map embed placeholder
- [ ] Socials + QR code for reviews

---

## 4. Reusable Components

- Top utility bar
- Sticky header / mobile drawer nav
- Hero (variant A: home, variant B: inner-page strip)
- Service card
- Feature / value block
- Stat counter
- Testimonial card + carousel
- Pricing row / table
- Suburb chip
- CTA banner (full-bleed)
- Accordion (FAQ)
- Form fields (input, select, textarea, button)
- Footer
- Back-to-top button
- Floating "Call" pill (mobile)

---

## 5. Tech Stack

| Layer | Choice |
|---|---|
| Markup | Semantic HTML5, one file per page |
| Styling | **SCSS** compiled to a single `dist/css/styles.css` |
| Scripts | Vanilla JS (ES6 modules) — no framework |
| Icons | Inline SVG (own set) |
| Build | `sass` CLI watch (no bundler dependency for v1) |
| Browser support | Evergreen + iOS Safari 14+ |

---

## 6. Folder Structure

```
nvplumbing/
├─ index.html
├─ about.html
├─ services.html
├─ hot-water.html
├─ service-areas.html
├─ gallery.html
├─ contact.html
├─ assets/
│  ├─ img/                 (photos, hero art, gallery)
│  ├─ icons/               (svg)
│  └─ fonts/               (Bitter local fallback if needed)
├─ scss/
│  ├─ main.scss            (entry — @use everything)
│  ├─ abstracts/
│  │  ├─ _variables.scss
│  │  ├─ _mixins.scss
│  │  ├─ _functions.scss
│  │  └─ _breakpoints.scss
│  ├─ base/
│  │  ├─ _reset.scss
│  │  ├─ _typography.scss
│  │  └─ _global.scss
│  ├─ layout/
│  │  ├─ _container.scss
│  │  ├─ _grid.scss
│  │  ├─ _header.scss
│  │  └─ _footer.scss
│  ├─ components/
│  │  ├─ _buttons.scss
│  │  ├─ _cards.scss
│  │  ├─ _service-card.scss
│  │  ├─ _testimonial.scss
│  │  ├─ _pricing.scss
│  │  ├─ _chip.scss
│  │  ├─ _accordion.scss
│  │  ├─ _form.scss
│  │  ├─ _cta-banner.scss
│  │  └─ _floating-call.scss
│  ├─ sections/
│  │  ├─ _hero.scss
│  │  ├─ _trust-strip.scss
│  │  ├─ _services-grid.scss
│  │  ├─ _why-us.scss
│  │  ├─ _hot-water-teaser.scss
│  │  ├─ _service-areas.scss
│  │  ├─ _testimonials.scss
│  │  └─ _gallery.scss
│  ├─ pages/
│  │  ├─ _home.scss
│  │  ├─ _about.scss
│  │  ├─ _services.scss
│  │  ├─ _hot-water.scss
│  │  ├─ _service-areas.scss
│  │  ├─ _gallery.scss
│  │  └─ _contact.scss
│  └─ utilities/
│     ├─ _spacing.scss
│     ├─ _text.scss
│     └─ _helpers.scss
├─ js/
│  ├─ main.js
│  ├─ nav.js
│  ├─ carousel.js
│  ├─ accordion.js
│  ├─ lightbox.js
│  └─ form.js
├─ dist/
│  └─ css/styles.css        (compiled)
├─ task.md
└─ README.md
```

---

## 7. SCSS File Header (mandatory on EVERY .scss file)

```scss
// ─────────────────────────────────────────────────────────────
// Designed & developed by
// Biplab Kumar Paul — Web Designer & Developer
// Mobile: 01735 927356
// Email:  biplab.cse.85@gmail.com
// ─────────────────────────────────────────────────────────────
```

---

## 8. Typography

- **Body / UI**: `Helvetica, Arial, sans-serif`
- **Display / headings / accents**: `'Bitter', serif` (load via Google Fonts: 400, 500, 600, 700)
- Type scale (rem):
  - h1: 3.25 / 2.25 (mobile)
  - h2: 2.5 / 1.75
  - h3: 1.75 / 1.375
  - h4: 1.25
  - body: 1.0625 (17px) — line-height 1.65
  - small: 0.875
- Letter-spacing: -0.01em on display, 0.02em on uppercase labels
- Bitter used selectively (headlines, callouts, prices) so it stays distinctive

---

## 9. Color Palette (proposed)

```
$brand-navy        #0E2A47   (primary, headings, header)
$brand-water       #1E6FB2   (links, accents, water motif)
$brand-water-light #5FB0E6   (gradients, highlights)
$brand-copper      #C46B2D   (CTA accent — pipework copper)
$ink               #0B1320   (body text)
$muted             #5B6675   (secondary text)
$cream             #F6F1E8   (warm neutral background blocks)
$paper             #FFFFFF
$line              #E3E7EC   (dividers)
$ok                #2BAA6C   (form success)
$warn              #D24A2B   (errors, emergency badge)
```

Aesthetic direction: **trust-built modern** — deep navy + water-blue + copper accent, with cream warmth so it doesn't feel cold/corporate. Bitter serif gives editorial gravitas; Helvetica keeps the UI clean.

---

## 10. Layout & Spacing System

- Max container: `1240px`
- Grid: 12-col, gutter `24px` desktop / `16px` mobile
- Spacing scale (rem): 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8
- Breakpoints (mobile-first):
  - sm: 480px
  - md: 768px
  - lg: 1024px
  - xl: 1280px

---

## 11. Motion & Micro-interactions

- Hero: staggered fade-up on load (headline → sub → CTAs → visual)
- Service cards: lift + accent underline on hover
- Header: shrinks + adds shadow on scroll
- Buttons: subtle scale + color shift; primary has water-ripple SVG hover
- Section reveals: `IntersectionObserver` adds `.is-in` for fade-up
- Carousel: snap scrolling + dot indicators
- Floating call pill: pulse animation (mobile only)
- Respect `prefers-reduced-motion`

---

## 12. Accessibility & Quality Bar

- WCAG AA contrast for all text
- Visible focus rings (custom, brand-coloured)
- Skip-to-content link
- `aria-label` on icon-only buttons
- Form labels always present (no placeholder-as-label)
- Lighthouse target: Performance ≥ 95, A11y ≥ 95, SEO ≥ 95
- All images lazy-loaded with width/height
- Meta tags + OpenGraph per page

---

## 13. Content Source-of-Truth (from reference site)

**Services** (expanded from reference): Emergency · General repairs · Hot water · Blocked drains · Gas fitting · Taps & mixers · Toilets · Leak detection · Strata · Reno plumbing
**Hot water (Rheem)**: 50L, 80L, 125L, 135L, 170L, 250L
**Suburbs**: Ashfield, Annandale, Glebe, Balmain, Leichhardt, Chatswood, Chiswick, Artarmon, Lilyfield, Five Dock, Alexandria, Zetland, Meadowbank, Cremorne, Neutral Bay, Mosman, Bondi, Kensington, Maroubra, Ryde, Kellyville Ridge, Newtown, Coogee, Rozelle, Pyrmont, Botany, Marrickville, Lane Cove, Elizabeth Bay, Lewisham, Mascot, Homebush, Cammeray, Crows Nest, Hillsdale, Strathfield, Forest Lodge, North Sydney, Erskineville, Redfern, Waterloo, Rosebery, Randwick, Bondi Beach, Bronte, Bellevue Hill, Rose Bay, Double Bay, Matraville, Concord, Surry Hills, Paddington

---

## 14. Build Phases (execution checklist)

### Phase 1 — Foundation
- [ ] Scaffold folder structure
- [ ] Set up `scss/main.scss` with `@use` imports
- [ ] Configure `sass` watch script in `package.json` (or document CLI command)
- [ ] Write `_reset.scss`, `_variables.scss`, `_typography.scss`, `_breakpoints.scss`, `_mixins.scss`
- [ ] Add author header block to every SCSS file
- [ ] Wire Bitter from Google Fonts in shared `<head>`

### Phase 2 — Shared chrome
- [ ] Header (top bar + sticky main nav + mobile drawer)
- [ ] Footer (4-column: brand, services, service areas, contact)
- [ ] Floating call pill (mobile)
- [ ] Back-to-top

### Phase 3 — Home page
- [ ] Hero with water-motif SVG
- [ ] Trust strip
- [ ] Services grid (8 cards)
- [ ] Why Choose Us
- [ ] Hot Water teaser
- [ ] Service Areas teaser
- [ ] Testimonials carousel
- [ ] CTA banner

### Phase 4 — Inner pages
- [ ] About
- [ ] Services
- [ ] Hot Water Prices (table)
- [ ] Service Areas (chip grid + tabs)
- [ ] Gallery (filter + lightbox)
- [ ] Contact (form + map embed)

### Phase 5 — Polish
- [ ] Motion pass (hero stagger, scroll reveals, hover states)
- [ ] Responsive QA at 360 / 768 / 1024 / 1440
- [ ] Lighthouse pass
- [ ] Cross-page link audit
- [ ] Final README with run instructions

---

## 15. Deliverables

- 7 fully styled HTML pages
- Single compiled `dist/css/styles.css` from modular SCSS
- Vanilla JS modules for nav, carousel, accordion, lightbox, form validation
- README with: how to compile SCSS, folder map, customisation notes
- Every SCSS file carries the Biplab Kumar Paul author header

---

## 16. Open Questions (to confirm before/during build)

1. Real photography or stock/illustrative placeholders? (default: tasteful placeholders)
2. Hot water prices — list real numbers or "from $X"? (default: indicative "from $X" placeholders)
3. Logo — do you have one, or should I design a wordmark in Bitter + a water-drop mark?
4. Form submission — front-end only (mailto / formspree placeholder) or PHP handler (since WAMP is available)?
5. Any extra trade certifications/license numbers to display?
