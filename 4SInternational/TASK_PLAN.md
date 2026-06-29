# 4S International — Website Build Task Plan

Static multi-page marketing website for **4S International Inc.** (www.4sinternational.ca).
Stack: **hand-written HTML pages + SCSS** (compiled to CSS). No framework, no JS build step required (vanilla JS only where needed).

---

## 1. Project Overview

| Item | Decision |
|------|----------|
| Type | Static multi-page site (one `.html` per page) |
| Styling | SCSS → compiled CSS (7-1 architecture) |
| JS | Vanilla JS + 3 libraries (see below) for nav, validation, FAQ, modals, sliders, animation |
| Lightbox / modal | **Fancybox** — https://fancyapps.com/fancybox/ (image lightbox, video, dialog modals) |
| Slider / carousel | **Swiper** — https://swiperjs.com/ (hero slider, product carousel, testimonials) |
| Micro animation | **GSAP** — https://gsap.com/ (scroll reveals, hover/stagger micro-interactions, ScrollTrigger) |
| Pages | Home, About, Products, Contact, Privacy Policy, Terms of Sale, 404 |
| Primary CTA | "Request a Quote" |
| Tone | Professional, technical, direct |
| Content source | `4S_International_Website_Copy.docx` (already written) |
| Responsive | Mobile-first, breakpoints at 480 / 768 / 1024 / 1280 |
| Hosting | Static (works under WAMP `www/` now; deploy to any static host) |

---

## 2. Project / Folder Structure

```
4sinternational/
├── index.html                  # Home
├── about.html
├── products.html
├── contact.html
├── privacy-policy.html
├── terms-of-sale.html
├── 404.html
│
├── assets/
│   ├── img/
│   │   ├── logo/               # logo.svg, logo-white.svg, favicon
│   │   ├── hero/               # hero background(s)
│   │   ├── products/           # bearing category images
│   │   ├── industries/         # industry icons
│   │   └── og/                 # social share images
│   ├── fonts/                  # self-hosted woff2 (optional, see §5)
│   └── icons/                  # SVG sprite / individual icons
│
├── css/
│   └── main.css                # COMPILED output (do not edit by hand)
│   └── main.css.map
│
├── scss/                       # SOURCE styles (7-1 pattern, see §4)
│   ├── main.scss               # single entry point, imports everything
│   ├── abstracts/
│   ├── base/
│   ├── components/
│   ├── layout/
│   ├── pages/
│   └── vendors/
│
├── js/
│   ├── main.js                 # nav toggle, accordion, form handling, lib init
│   ├── form-validation.js
│   ├── fancybox.init.js        # lightbox/modal config
│   ├── swiper.init.js          # slider config
│   └── animations.js           # GSAP + ScrollTrigger micro-animations
│
├── vendor/                     # 3rd-party libs (if self-hosting instead of CDN)
│   ├── fancybox/               # fancybox.umd.js + fancybox.css
│   ├── swiper/                 # swiper-bundle.min.js + swiper-bundle.min.css
│   └── gsap/                   # gsap.min.js + ScrollTrigger.min.js
│
├── partials/                   # OPTIONAL: shared HTML snippets (if using a builder)
│   ├── header.html
│   └── footer.html
│
├── package.json                # sass dev dependency + scripts
├── .gitignore
├── robots.txt
├── sitemap.xml
└── README.md
```

> Note: with plain HTML there's no native include for header/footer. Either (a) copy the
> header/footer markup into each page, or (b) add a tiny build step (see §9). Decide in Phase 0.

---

## 3. Pages & Sections

### `index.html` — Home
- Header / nav (sticky)
- Hero: "Industrial Bearings for Canadian Businesses" + sub + `[Request a Quote] [View Our Products]`
- What We Do (intro block)
- Products preview (8 bearing types, grid → links to products.html)
- Industries We Serve (6 cards: Manufacturing, Food & Beverage, Mining, Agriculture, HVAC/Maintenance, Automotive)
- How to Order (3 steps)
- Why 4S International (5 value points)
- CTA band
- Footer

### `about.html` — About
- Page hero / breadcrumb
- About 4S International (company intro, warehouse, HS 8482 range)
- Our Founder (Fatema Islam bio)
- Company Facts table
- CTA band + Footer

### `products.html` — Products
- Page hero + cross-reference note (SKF, NTN, Timken, Schaeffler, NSK)
- 9 product blocks, each: name, HS code, MFN duty, description, applications, popular specs, `[Get a Quote]`
  1. Deep Groove Ball Bearings (8482.10, Free)
  2. Angular Contact Ball Bearings (8482.10, Free)
  3. Self-Aligning Ball Bearings (8482.10, Free)
  4. Tapered Roller Bearings (8482.20, 6.5% / 0% CPTPP)
  5. Spherical Roller Bearings (8482.30, Free)
  6. Cylindrical Roller Bearings (8482.50, 6.5% / 0% CPTPP)
  7. Needle Roller Bearings (8482.40)
  8. Thrust Bearings (8482.80)
  9. Bearing Accessories & Mounted Units (8482.99, Free)
- CTA band + Footer

### `contact.html` — Contact
- Contact details (address, email, phone placeholder, hours)
- Directions block
- **Quote Request Form** (Name*, Company*, Email*, Phone, Industry dropdown, Bearing Details* textarea, Delivery Location, Notes)
- **General Contact Form** (Name, Email, Phone, Subject dropdown, Message)
- FAQ accordion (9 Q&A from website copy)
- Footer

### `privacy-policy.html` / `terms-of-sale.html`
- Simple legal text layout (typography-only page template)

### `404.html`
- Friendly message + link back home

---

## 4. SCSS Architecture (7-1 Pattern)

`scss/main.scss` is the only file compiled. It `@use`s everything in order:

```
scss/
├── main.scss
│
├── abstracts/          # no CSS output — tokens & tools
│   ├── _index.scss     # forwards all abstracts
│   ├── _variables.scss # colors, spacing, radius, shadows, z-index
│   ├── _typography.scss# font families, scale, weights, line-heights
│   ├── _breakpoints.scss
│   ├── _functions.scss # rem(), z(), spacing helpers
│   └── _mixins.scss    # respond-to(), flex-center, container, button-base
│
├── base/
│   ├── _reset.scss     # modern reset / normalize
│   ├── _root.scss      # :root CSS custom properties (design tokens)
│   ├── _base.scss      # html, body, defaults
│   ├── _typography.scss# h1–h6, p, a, lists, blockquote rules
│   └── _utilities.scss # .container, .visually-hidden, spacing utils, .text-center
│
├── layout/
│   ├── _header.scss
│   ├── _nav.scss
│   ├── _footer.scss
│   ├── _grid.scss
│   └── _section.scss   # section spacing rhythm
│
├── components/
│   ├── _button.scss    # primary (red), secondary (outline), ghost
│   ├── _card.scss      # product card, industry card, value card
│   ├── _hero.scss
│   ├── _cta-band.scss
│   ├── _table.scss     # company facts / spec tables
│   ├── _form.scss      # inputs, selects, textarea, labels, validation states
│   ├── _accordion.scss # FAQ
│   ├── _breadcrumb.scss
│   ├── _badge.scss     # HS code / duty badges
│   ├── _steps.scss     # "How to Order" 3-step
│   ├── _slider.scss    # Swiper wrapper/pagination/nav-arrow brand styling
│   ├── _lightbox.scss  # Fancybox toolbar/caption/modal brand styling
│   └── _animations.scss# GSAP helper classes (.reveal, .stagger, [data-gsap]) + reduced-motion
│
├── pages/
│   ├── _home.scss
│   ├── _about.scss
│   ├── _products.scss
│   ├── _contact.scss
│   └── _legal.scss
│
└── vendors/            # 3rd-party CSS overrides
    ├── _swiper.scss    # restyle swiper-bundle defaults to brand palette
    └── _fancybox.scss  # restyle fancybox defaults to brand palette
```

> Import the libraries' base CSS (Swiper/Fancybox) **before** `vendors/` overrides — either via
> CDN `<link>` in `<head>` or by `@use`-ing the vendor CSS, then your `_swiper.scss`/`_fancybox.scss`
> partials override on top. GSAP ships no CSS.

**Import order in `main.scss`:** abstracts → vendors → base → layout → components → pages.
Use modern Sass module system: `@use 'abstracts' as *;` at top of each partial that needs tokens.

---

## 5. Fonts

**Recommendation — Google Fonts pairing (professional, industrial, highly legible):**

| Role | Font | Weights | Use |
|------|------|---------|-----|
| Headings / display | **Archivo** (or *Saira*) | 600, 700, 800 | h1–h3, hero, section titles, buttons |
| Body / UI | **Inter** | 400, 500, 600 | paragraphs, nav, forms, tables |
| Mono (optional) | **JetBrains Mono** | 400, 500 | HS codes, part numbers, specs |

Alternative single-family option for simplicity: **Inter** for everything (400/500/600/700).

**Loading (choose one):**
- **Self-host** (recommended for speed/privacy): download woff2 into `assets/fonts/`, declare with `@font-face` in `scss/base/_fonts.scss`, use `font-display: swap`.
- **Google CDN** (fastest to start): `<link>` + preconnect in `<head>` of each page.

**Design tokens (in `_typography.scss`):**
```scss
$font-heading: 'Archivo', system-ui, sans-serif;
$font-body:    'Inter', system-ui, -apple-system, sans-serif;
$font-mono:    'JetBrains Mono', ui-monospace, monospace;

// Type scale (1.250 major-third)
$fs-xs: 0.8rem;  $fs-sm: 0.9rem;  $fs-base: 1rem;
$fs-md: 1.25rem; $fs-lg: 1.563rem; $fs-xl: 1.953rem;
$fs-2xl: 2.441rem; $fs-3xl: 3.052rem;
```

---

## 6. Design Tokens / Color System

Reuse the brand palette from the existing business-plan document for consistency.

```scss
// abstracts/_variables.scss
$navy:        #0d1b2a;   // primary dark / headers / footer
$navy-mid:    #1b2d45;
$steel:       #324a5f;   // secondary text on dark, accents
$accent:      #c0392b;   // primary CTA red (buttons, links hover)
$accent-light:#e74c3c;
$gold:        #d4a843;   // highlights, badges, dividers
$bg:          #ffffff;
$bg-subtle:   #f8f9fb;   // alt section background
$bg-blue:     #f0f4f8;
$text:        #1a1a1a;
$text-mid:    #4a4a4a;
$text-light:  #6b7280;
$border:      #d1d5db;
$success:     #059669;

// Spacing scale (8px base)
$space: (0:0, 1:.25rem, 2:.5rem, 3:.75rem, 4:1rem, 6:1.5rem, 8:2rem, 12:3rem, 16:4rem, 24:6rem);

// Radius / shadow / layout
$radius-sm:4px; $radius:8px; $radius-lg:16px;
$shadow-sm: 0 1px 2px rgba(0,0,0,.06);
$shadow:    0 4px 12px rgba(13,27,42,.08);
$shadow-lg: 0 12px 32px rgba(13,27,42,.12);
$container-max: 1200px;
$container-pad: clamp(1rem, 4vw, 2rem);
```

Mirror these into `:root` CSS custom properties in `base/_root.scss` so JS/runtime can read them too.

**Breakpoints:**
```scss
$bp: (sm:480px, md:768px, lg:1024px, xl:1280px);
@mixin respond-to($key) { @media (min-width: map.get($bp,$key)) { @content; } }
```

---

## 7. Reusable Components

- **Button** — `.btn`, `.btn--primary` (red fill), `.btn--secondary` (navy outline), `.btn--ghost`
- **Header/Nav** — sticky, logo left, links right, mobile hamburger → slide-in drawer
- **Footer** — company info, address, email, nav links, legal links, copyright
- **Hero** — full-width, gradient/navy overlay, headline + 2 CTAs
- **Card** — product card, industry card, value-point card
- **Badge** — HS code & duty (e.g. `8482.10 · Free`)
- **Steps** — numbered "How to Order"
- **Table** — company facts, product specs (responsive: stack on mobile)
- **Form** — labeled inputs, required indicator, error/success states, select, textarea
- **Accordion** — FAQ (vanilla JS toggle, accessible `aria-expanded`)
- **CTA band** — repeated "Request a Quote" strip
- **Breadcrumb** — interior pages
- **Lightbox (Fancybox)** — product image zoom, warehouse/gallery images, and "Request a Quote" as a modal dialog triggered from any `[Request a Quote]` button
- **Slider (Swiper)** — hero slider (Home), product category carousel, "Industries We Serve" carousel on mobile, optional logo/credential strip
- **Animated reveal (GSAP)** — section fade/slide-in on scroll (ScrollTrigger), staggered card entrances, button/hover micro-interactions, animated number counters (financial/credibility stats)

---

## 8. Build / Tooling

`package.json` scripts (dev dependency: `sass`):

```json
{
  "scripts": {
    "css:dev":   "sass --watch scss/main.scss:css/main.css --style=expanded --source-map",
    "css:build": "sass scss/main.scss:css/main.css --style=compressed --no-source-map",
    "serve":     "npx live-server --port=5500"
  },
  "devDependencies": { "sass": "^1.77.0" }
}
```

- Run `npm install` then `npm run css:dev` while developing.
- Optional: add `autoprefixer` via PostCSS for vendor prefixes before launch.
- `.gitignore`: `node_modules/`, `css/main.css.map` (keep compiled `main.css` if deploying without build).

### Third-party libraries (Fancybox / Swiper / GSAP)

**Option A — CDN (fastest to start).** Add to each page (CSS in `<head>`, JS before `</body>`):
```html
<!-- in <head> -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fancyapps/ui@5/dist/fancybox/fancybox.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">

<!-- before </body> -->
<script src="https://cdn.jsdelivr.net/npm/@fancyapps/ui@5/dist/fancybox/fancybox.umd.js"></script>
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
<script src="js/main.js" defer></script>   <!-- inits Fancybox/Swiper/GSAP -->
```

**Option B — self-host / npm (recommended for production).** `npm i @fancyapps/ui swiper gsap`,
copy the dist files into `vendor/` (see §2), reference locally. More resilient, no CDN dependency,
pin exact versions. Your brand overrides live in `scss/vendors/_swiper.scss` & `_fancybox.scss`.

- Load order matters: library JS must load **before** `js/main.js` (which initializes them).
- Use `defer` so scripts don't block render; init inside `DOMContentLoaded`.
- GSAP: `gsap.registerPlugin(ScrollTrigger)` once in `animations.js`.
- Respect `prefers-reduced-motion`: gate GSAP reveals + Swiper autoplay behind a media-query check.

---

## 9. Shared Header/Footer Strategy (decide in Phase 0)

Plain HTML has no include. Options:
1. **Copy-paste** header/footer into every page (simplest, fine for 7 pages — keep one canonical copy in `partials/` to sync from).
2. **Tiny build step** — use `posthtml-include` or `eleventy (11ty)` to inject `partials/header.html` & `footer.html`. Recommended if pages will grow.
3. **JS injection** — `fetch()` partials at runtime (hurts SEO/no-JS; not recommended).

Default plan: **Option 1** now, with partials kept as source of truth.

---

## 10. Task Breakdown (Phased Checklist)

### Phase 0 — Setup
- [ ] Init `package.json`, install `sass`
- [ ] Create folder structure (§2)
- [ ] Add `.gitignore`, `README.md`, `robots.txt`, `sitemap.xml`
- [ ] Decide header/footer strategy (§9)
- [ ] Add favicon + logo assets (placeholder ok)

### Phase 1 — SCSS Foundation & Libraries
- [ ] `abstracts/` — variables, typography, breakpoints, functions, mixins
- [ ] `base/` — reset, root tokens, base, typography, utilities, fonts
- [ ] `layout/` — header, nav, footer, grid, section
- [ ] Add Fancybox / Swiper / GSAP (CDN now, or `npm i` for self-host) — confirm they load (§8)
- [ ] `vendors/_swiper.scss` & `_fancybox.scss` brand overrides
- [ ] Wire up `main.scss` + confirm `npm run css:dev` compiles

### Phase 2 — Components
- [ ] Button, Card, Badge, Steps, Table
- [ ] Hero, CTA band, Breadcrumb
- [ ] Form (inputs/select/textarea + validation states)
- [ ] Accordion (FAQ)
- [ ] Slider component (Swiper) — `_slider.scss` + `swiper.init.js`
- [ ] Lightbox/modal (Fancybox) — `_lightbox.scss` + `fancybox.init.js` (incl. Quote modal)
- [ ] Animation helpers (GSAP) — `_animations.scss` + `animations.js` (reveal/stagger, reduced-motion gate)

### Phase 3 — Pages (HTML + page SCSS)
- [ ] `index.html` (Home) — all sections (§3)
- [ ] `about.html`
- [ ] `products.html` (9 product blocks)
- [ ] `contact.html` (2 forms + FAQ)
- [ ] `privacy-policy.html`, `terms-of-sale.html`
- [ ] `404.html`

### Phase 4 — JS Behavior
- [ ] Mobile nav toggle (accessible)
- [ ] FAQ accordion
- [ ] Form client-side validation + submit handling (mailto or backend endpoint — TBD)
- [ ] Init Fancybox — bind product image galleries + open Quote form as a modal dialog
- [ ] Init Swiper — hero slider, product carousel, industries carousel (mobile)
- [ ] GSAP + ScrollTrigger — scroll reveals, staggered cards, stat counters, hover micro-interactions
- [ ] Verify all libs respect `prefers-reduced-motion` and degrade gracefully without JS

### Phase 5 — Polish & QA
- [ ] Responsive pass (480/768/1024/1280)
- [ ] Accessibility: landmarks, alt text, focus states, color contrast, `aria-*`
- [ ] SEO: `<title>`, meta description, Open Graph tags, sitemap, robots
- [ ] Performance: compress images, `font-display: swap`, minified CSS
- [ ] Cross-browser check (Chrome, Firefox, Edge, Safari/iOS)
- [ ] Fill placeholders: **phone number**, real logo, product images
- [ ] Final `npm run css:build` (compressed CSS)

---

## 11. Open Items / Decisions Needed

- [ ] **Phone number** — currently `[to be added]` in copy
- [ ] **Form backend** — static mailto, Formspree, or a PHP handler (WAMP is available)?
- [ ] **Logo** — do we have brand assets, or design needed?
- [ ] **Product photography** — real images vs. illustrated/icon placeholders
- [ ] Header/footer include strategy (§9)
- [ ] Self-host fonts vs. Google CDN (§5)
- [ ] Libraries: CDN vs. self-host/npm for Fancybox, Swiper, GSAP (§8) — pin versions for production
- [ ] Confirm GSAP usage stays within the free/standard plugins (ScrollTrigger is free; avoid Club-only plugins unless licensed)

---

*Prepared for the 4S International website build. Content source: `4S_International_Website_Copy.docx`. Brand palette inherited from `4S_International_C11_Business_Plan.html`.*
