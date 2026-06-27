# CLAUDE.md — Showtime Roofing

> Premium, conversion-focused roofing website for the Australian market.
> This document is the **single source of truth** for design, architecture, and
> coding standards. Read it fully before generating any HTML, SCSS, or JS.

---

## 1. Project Vision

Showtime Roofing is being rebuilt from a thin, single-page brochure into a
**modern, premium, trustworthy roofing brand site** for an Australian audience.

### Guiding principles

| Principle | What it means in practice |
|-----------|---------------------------|
| **Premium & clean** | Generous whitespace, restrained palette, confident typography. Never crowded. |
| **Minimal content** | Say less, but say it with authority. Cut filler; keep proof. |
| **Lean heroes** | Heroes carry almost **no body copy** — eyebrow + short headline + one line + CTA. Let the image and space do the work. |
| **Strong visual hierarchy** | One clear focal point per section. Headline → support → action. |
| **Conversion-focused** | Every section drives toward "Get a Free Quote" / "Call Now". Sticky CTA on mobile. |
| **Mobile-first, app-style** | Design and build for 360–430px first. Mobile UX should feel like a **modern native app**, not a shrunk desktop site (see §2.10). |
| **Australian-based client** | AU audience and conventions throughout: `en-AU` spelling, AU phone format, ABN/licence trust lines, suburb/state service areas, Colorbond/terracotta context. |
| **Fast** | Lighthouse Performance 95+. Lazy media, minimal JS, compiled & minified CSS. |
| **SEO-friendly** | Semantic structure, metadata, schema.org LocalBusiness, clean URLs. |
| **Maintainable & scalable** | Modular SCSS (7-1 pattern), BEM, reusable components, no duplication. |

### Brand personality
Reliable · Local · Craftsmanlike · Weatherproof · Honest pricing.
Tone of voice: direct, warm, plain-English Australian. No jargon, no hype.

### Target user
Australian homeowners (35–65) and small commercial property owners who need
roof repair, replacement, or new installation and want a trustworthy local team.
Primary actions: **request a quote**, **call**, **view past work**.

---

## 2. Design System

### 2.1 Color palette

A grounded, premium palette: deep slate/charcoal for trust, a warm
terracotta/amber accent (evokes tiles & Australian sun), and clean neutrals.

| Token | HEX | Usage |
|-------|-----|-------|
| `--color-primary` | `#1B2A41` | Deep slate — headings, header, footer, primary text on light |
| `--color-primary-600` | `#26405F` | Hover/elevated primary surfaces |
| `--color-primary-900` | `#0F1A29` | Darkest sections, overlays |
| `--color-accent` | `#E2683C` | Terracotta — primary CTAs, links, highlights |
| `--color-accent-600` | `#C5552E` | Accent hover/active |
| `--color-accent-100` | `#FBE7DE` | Accent tint backgrounds, badges |
| `--color-gold` | `#E8B04B` | Star ratings, awards, subtle premium accent |
| `--color-ink` | `#1F2733` | Body copy on light backgrounds |
| `--color-muted` | `#5E6B7A` | Secondary text, captions, meta |
| `--color-line` | `#E4E8ED` | Borders, dividers, card outlines |
| `--color-surface` | `#FFFFFF` | Cards, primary surface |
| `--color-bg` | `#F6F8FA` | Page background / alternating sections |
| `--color-bg-alt` | `#EEF2F6` | Secondary section background |
| `--color-success` | `#2E9E6B` | Form success, trust ticks |
| `--color-error` | `#D64545` | Form errors |
| `--color-white` | `#FFFFFF` | — |

**Rules**
- Accent (`#E2683C`) is reserved for **action and emphasis only** — never large fills.
- Maintain WCAG AA contrast (≥4.5:1 body, ≥3:1 large text). Verify accent-on-white
  for buttons (use white text on accent, never accent text on white for small sizes).
- Dark sections use `--color-primary-900` with white/`--color-line` text.

Define both in `:root` (CSS custom properties) **and** as SCSS variables in
`abstracts/_variables.scss` so they can drive functions/mixins at compile time.

### 2.2 Typography

Google Fonts. Two families: a confident display serif/sans for headings and a
highly legible sans for body.

| Role | Font | Weights | Notes |
|------|------|---------|-------|
| Display / Headings | **Sora** | 600, 700 | Geometric, modern, premium feel |
| Body / UI | **Inter** | 400, 500, 600 | Best-in-class legibility at small sizes |

> Alternative heading pairing if a warmer editorial feel is wanted:
> **Fraunces** (600/700) for headings + **Inter** body. Pick one and commit.

Load via `<link>` with `preconnect` to `fonts.gstatic.com` and `display=swap`.
Subset to `latin`. Self-host later if performance budget requires it.

**Type scale** (mobile → desktop, fluid via `clamp()`):

| Token | clamp() | Use |
|-------|---------|-----|
| `--fs-display` | `clamp(2.5rem, 6vw, 4.5rem)` | Hero headline |
| `--fs-h1` | `clamp(2rem, 4vw, 3.25rem)` | Page H1 |
| `--fs-h2` | `clamp(1.6rem, 3vw, 2.5rem)` | Section titles |
| `--fs-h3` | `clamp(1.25rem, 2vw, 1.6rem)` | Card titles |
| `--fs-lead` | `clamp(1.05rem, 1.4vw, 1.25rem)` | Intro/lead paragraphs |
| `--fs-body` | `1rem` (16px base) | Body |
| `--fs-small` | `0.875rem` | Meta, captions |
| `--fs-eyebrow` | `0.8125rem` | Uppercase labels, letter-spacing 0.08em |

- Base `font-size: 100%` (16px). Line-height: headings `1.15`, body `1.65`.
- Headings: `--color-primary`, weight 700, slight negative letter-spacing (`-0.01em`).
- Never go below `0.8125rem` for readable text.

#### Section title / subtitle consistency (mandatory)

Every section across **every page** must use the **same title and subtitle styling**
— identical font, weight, size, and spacing — for a unified, professional rhythm.
Define these once and reuse via the shared **Section header** component (§9); never
restyle per section.

| Element | Token | Font | Weight | Size | Notes |
|---------|-------|------|--------|------|-------|
| **Section eyebrow** | `--fs-eyebrow` | Inter | 600 | `0.8125rem` | Uppercase, `letter-spacing: 0.08em`, accent color. Optional. |
| **Section title** | `--fs-h2` | Sora | **700** | `clamp(1.6rem, 3vw, 2.5rem)` | `--color-primary`, line-height `1.15`, `-0.01em`. **Same everywhere.** |
| **Section subtitle** | `--fs-lead` | Inter | **400** | `clamp(1.05rem, 1.4vw, 1.25rem)` | `--color-muted`, line-height `1.6`, max-width ~60ch. **Same everywhere.** |

- Implement as fixed classes: `.section-header__eyebrow`, `.section-header__title`,
  `.section-header__subtitle` — used by all sections. No one-off overrides.
- Only **alignment** (left/center) and **color theme** (light vs. dark section) may
  vary; font family, weight, and size must stay constant.

### 2.3 Spacing system

8px base scale. Use SCSS map + helper function (`spacing(4)` → `2rem`).

| Token | Value |
|-------|-------|
| `--space-1` | `0.25rem` (4px) |
| `--space-2` | `0.5rem` (8px) |
| `--space-3` | `0.75rem` (12px) |
| `--space-4` | `1rem` (16px) |
| `--space-5` | `1.5rem` (24px) |
| `--space-6` | `2rem` (32px) |
| `--space-7` | `3rem` (48px) |
| `--space-8` | `4rem` (64px) |
| `--space-9` | `6rem` (96px) |
| `--space-10` | `8rem` (128px) |

- **Section vertical rhythm:** `clamp(4rem, 8vw, 8rem)` top/bottom padding.
- Component internal padding multiples of 8px only.

### 2.4 Border radius

| Token | Value | Use |
|-------|-------|-----|
| `--radius-sm` | `6px` | Inputs, badges, small chips |
| `--radius-md` | `12px` | Buttons, cards |
| `--radius-lg` | `20px` | Large cards, media, panels |
| `--radius-xl` | `32px` | Hero media, feature blocks |
| `--radius-full` | `999px` | Pills, avatars, icon circles |

### 2.5 Shadows

Soft, layered, low-opacity. Premium = subtle, never harsh.

| Token | Value |
|-------|-------|
| `--shadow-xs` | `0 1px 2px rgba(15,26,41,0.06)` |
| `--shadow-sm` | `0 2px 8px rgba(15,26,41,0.06)` |
| `--shadow-md` | `0 8px 24px rgba(15,26,41,0.08)` |
| `--shadow-lg` | `0 16px 48px rgba(15,26,41,0.12)` |
| `--shadow-accent` | `0 8px 24px rgba(226,104,60,0.28)` (CTA hover lift) |

### 2.6 Container widths

| Token | Value | Use |
|-------|-------|-----|
| `--container-xl` | `1280px` | Default site container |
| `--container-lg` | `1120px` | Standard content |
| `--container-md` | `880px` | Text-heavy / forms |
| `--container-sm` | `640px` | Narrow prose, single column |
| Gutter | `clamp(1rem, 4vw, 2rem)` | Side padding |

`.container` = max-width `--container-xl`, centered, with responsive gutter.
Provide `.container--narrow` and `.container--wide` modifiers.

### 2.7 Grid system

- **CSS Grid** for layouts; **Flexbox** for component-level alignment.
- 12-column conceptual grid via `repeat(12, 1fr)` with `gap: var(--space-5)`.
- Utility helpers: `.grid`, `.grid--2`, `.grid--3`, `.grid--4` with
  `grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr))`
  for resilient, content-driven wrapping.
- Cards collapse to 1 column < `md`, 2 columns `md`, 3–4 columns `lg+`.

### 2.8 Breakpoints

Mobile-first `min-width` media queries via a SCSS map + `respond-to()` mixin.

| Name | Min-width |
|------|-----------|
| `xs` | `360px` |
| `sm` | `576px` |
| `md` | `768px` |
| `lg` | `992px` |
| `xl` | `1200px` |
| `xxl` | `1400px` |

```scss
@include respond-to('md') { /* styles ≥768px */ }
```

### 2.9 Icon style guidelines

- **Style:** outline/stroke icons, `1.5px` stroke, rounded caps/joins, 24×24 grid.
- **Source:** Lucide / Feather style (consistent set — do not mix sets).
- **Format:** inline SVG (for color/animation control) or SVG sprite
  (`assets/icons/sprite.svg` + `<use>`). Prefer sprite for repeated icons.
- **Color:** inherit `currentColor`; accent only for emphasis.
- **Sizing:** `1em`–`1.5em` relative to context; never raster icons.
- **Accessibility:** decorative icons `aria-hidden="true"`; meaningful icons get
  `role="img"` + `<title>`.

### 2.10 Mobile UX — modern app style

Mobile is the **primary experience**, and it must feel like a polished native app
— not a compressed desktop layout. AU users browse trades on phones; treat the
phone as the hero device.

| Pattern | Guideline |
|---------|-----------|
| **Bottom action bar** | Fixed bottom bar on mobile with the two key actions — **Call** and **Get a Quote** — thumb-reachable, always visible, with safe-area insets (`env(safe-area-inset-bottom)`). |
| **App-style header** | Compact sticky top bar: logo + hamburger. On scroll it condenses; transparent over hero → solid on scroll. |
| **Full-screen drawer nav** | Hamburger opens a full-screen / slide-in panel with large tap targets, grouped links, and a prominent CTA — like an app menu, not a tiny dropdown. |
| **Cards & sheets** | Rounded cards (`--radius-lg`), soft shadows, and bottom-sheet style modals (Fancybox) that slide up from the bottom. |
| **Swipe-first** | Card rows become horizontal swipe carousels (Swiper, free-mode) with peeking next card to signal scrollability. |
| **Tap targets** | Minimum **44×44px**; comfortable spacing; no hover-dependent actions. |
| **Edge-to-edge media** | Full-bleed hero/gallery imagery; content in safe gutters. |
| **Momentum & feedback** | Smooth scrolling, subtle tap/active states, gentle transitions — fast and responsive, never janky. |

Keep mobile lean: minimal content per screen, one primary action in view at all
times, and large readable type (≥16px base to avoid iOS zoom on inputs).

---

## 3. Image Guidelines

- **Source:** real, high-quality photography found via Google Search. Prioritise
  **authentic Australian roofing imagery** — Colorbond steel roofs, terracotta &
  concrete tile roofs, suburban Australian homes, tradies at work, gutters,
  metal roofing, re-roofing in progress.
- **Avoid** generic American-style shingle roofs and obvious stock-photo clichés
  (over-posed people, fake-perfect studio shots).
- **Consistency:** unify color tone — warm, natural daylight, slightly desaturated
  with a subtle warm cast to match the terracotta accent. Apply a consistent
  light overlay/duotone where images sit behind text.
- **Subjects to gather:** hero (a striking finished roof / aerial home shot),
  service thumbnails (install, replacement, repair, gutters, restoration),
  before/after pairs, team/at-work shots, close-up texture (tiles, metal seams).
- **Formats:** serve **WebP/AVIF** with JPG fallback. Provide responsive
  `srcset`/`sizes`. Export at 1×/2×. Compress (target < 200KB hero, < 80KB cards).
- **Dimensions:** define explicit `width`/`height` (or `aspect-ratio`) to prevent
  CLS. Hero ~1920×1080, cards ~800×600 (4:3), gallery ~1200×800.
- **Alt text:** descriptive, location/service relevant, for SEO + a11y.
- **Storage:** `assets/images/{hero,services,gallery,team,before-after,misc}/`.

---

## 4. SCSS Architecture (7-1 Pattern)

Modular, functional, BEM-driven. One responsibility per file. `main.scss` only
`@use`s partials (no styles of its own). Use Dart Sass modules
(`@use`/`@forward`) — **not** the deprecated `@import`.

```
scss/
├── abstracts/              # No CSS output — tools only
│   ├── _variables.scss     # Colors, type, spacing, radius, shadow maps
│   ├── _functions.scss     # spacing(), rem(), z(), color helpers
│   ├── _mixins.scss        # respond-to(), flex/grid, button, truncate, focus-ring
│   ├── _breakpoints.scss   # Breakpoint map
│   ├── _maps.scss          # Color/spacing/z-index maps
│   └── _index.scss         # @forward all abstracts
│
├── base/                   # Global element styles
│   ├── _reset.scss         # Modern reset (box-sizing, margins, media defaults)
│   ├── _root.scss          # :root CSS custom properties (design tokens)
│   ├── _typography.scss    # Base type, headings, links, lists
│   ├── _global.scss        # html/body, selection, scroll-behavior
│   └── _accessibility.scss # .visually-hidden, :focus-visible, reduced-motion
│
├── layout/                 # Structural, page-level regions
│   ├── _container.scss
│   ├── _grid.scss
│   ├── _header.scss
│   ├── _footer.scss
│   ├── _section.scss       # Section rhythm + variants (dark, alt-bg)
│   └── _navigation.scss    # Nav + mega menu structure
│
├── components/             # Reusable UI blocks (BEM)
│   ├── _button.scss
│   ├── _hero.scss
│   ├── _card.scss          # Base card
│   ├── _service-card.scss
│   ├── _cta.scss
│   ├── _testimonial.scss
│   ├── _stats.scss
│   ├── _process.scss
│   ├── _accordion.scss     # FAQ
│   ├── _gallery.scss
│   ├── _badge.scss
│   ├── _form.scss
│   ├── _logo-strip.scss
│   ├── _swiper.scss        # Swiper overrides/theming
│   └── _fancybox.scss      # Fancybox overrides/theming
│
├── pages/                  # Page-specific tweaks only (keep thin)
│   ├── _home.scss
│   ├── _services.scss
│   ├── _about.scss
│   ├── _gallery.scss
│   └── _contact.scss
│
├── utilities/              # Helpers & overrides (single-purpose)
│   ├── _spacing.scss       # .mt-*, .py-* (generated from spacing map)
│   ├── _text.scss          # .text-center, .text-muted, .eyebrow
│   ├── _display.scss       # .hidden, .flex, .grid helpers
│   ├── _visibility.scss    # responsive show/hide
│   └── _animation.scss     # GSAP hook classes (.reveal, .stagger)
│
└── main.scss               # @use abstracts, base, layout, components, pages, utilities
```

### Conventions
- **Variables** — all design tokens in `abstracts`; expose runtime tokens via
  `:root` in `base/_root.scss`. Use `var(--token)` in components for theming,
  SCSS vars where compile-time logic is needed.
- **Mixins** — `respond-to($bp)`, `flex($dir,$justify,$align)`, `button-variant()`,
  `focus-ring()`, `truncate($lines)`, `card-elevation($level)`,
  `section-padding()`, `visually-hidden()`.
- **Functions** — `spacing($step)`, `rem($px)`, `z($layer)`, `tint()/shade()`.
- **BEM** — `.block`, `.block__element`, `.block--modifier`. No element-of-element
  nesting in names (`.card__title` not `.card__body__title`). Max nesting depth 3.
- **No magic numbers** — derive from tokens/functions.
- **`@forward`** abstracts via `_index.scss`; every partial that needs tokens does
  `@use '../abstracts' as *;`.

---

## 5. Folder Structure

```
showtime-roofing/
├── index.html              # Home
├── services.html           # Services overview (+ detail sections)
├── about.html              # About / why us
├── our-work.html           # Project gallery + before/after
├── contact.html            # Contact + quote form
├── 404.html
│
├── assets/
│   ├── images/
│   │   ├── hero/
│   │   ├── services/
│   │   ├── gallery/
│   │   ├── before-after/
│   │   ├── team/
│   │   └── misc/
│   ├── icons/
│   │   ├── sprite.svg
│   │   └── *.svg
│   ├── fonts/              # Self-hosted fonts (if used)
│   └── logo.svg
│
├── scss/                   # Source SCSS (7-1, see §4)
│   └── main.scss
│
├── css/                    # Compiled output (git-ignored or committed build)
│   ├── main.css
│   └── main.css.map
│
├── js/
│   ├── main.js             # Entry: imports modules, init
│   └── modules/
│       ├── header.js       # Sticky header, mobile nav, mega menu
│       ├── animations.js   # GSAP + ScrollTrigger setup
│       ├── sliders.js      # Swiper instances
│       ├── gallery.js      # Fancybox bindings
│       ├── counters.js     # Animated statistics
│       ├── accordion.js    # FAQ accordion
│       └── form.js         # Validation + submit UX
│
├── package.json
├── vite.config.js
├── .gitignore
├── .editorconfig
├── robots.txt
├── sitemap.xml
└── CLAUDE.md
```

### Tooling
- **Vite** dev server + build (HMR, SCSS compile via `sass`, asset hashing, minify).
- `package.json` scripts:
  - `dev` → `vite`
  - `build` → `vite build`
  - `preview` → `vite preview`
- Dependencies: `sass`, `gsap`, `swiper`, `@fancyapps/ui`.
- `vite.config.js`: multi-page (`rollupOptions.input` for each HTML page),
  base path config, asset inlining limits, CSS source maps in dev.

---

## 6. Animation Guidelines (GSAP)

GSAP + ScrollTrigger for **subtle micro-interactions only**. Animation should
reward attention, never demand it.

**Use for:**
- **Fade up** — section headings & content enter on scroll (`y: 24 → 0`, opacity).
- **Stagger** — card grids reveal in sequence (`stagger: 0.08`).
- **Counters** — statistics count up when in view (once).
- **ScrollTrigger reveals** — trigger reveals at `start: 'top 85%'`.
- **Parallax** — gentle hero/section background drift (max ~8–12% travel).
- **Hover** — buttons lift, card image scale (`1.0 → 1.04`), arrow nudge.

**Avoid:**
- Excessive or looping movement, big translate/scale, bouncy easings everywhere.
- Heavy page-load animations that delay content/LCP.
- Animating layout properties (use `transform`/`opacity` only).

**Standards:**
- Durations `0.4–0.8s`; easing `power2.out` / `power3.out`.
- Respect `prefers-reduced-motion`: gate all GSAP behind a check and instantly
  set final state when reduced motion is requested.
- Use class hooks (`.reveal`, `.stagger > *`) from `utilities/_animation.scss`;
  init in `js/modules/animations.js`. Kill ScrollTriggers on resize if needed.
- Never block render — initialise after `DOMContentLoaded`; lazy-load GSAP if large.

---

## 7. Swiper Usage

Use Swiper.js for all sliders/carousels. Theme via `components/_swiper.scss`
(override pagination/nav to match palette). Lazy-init; destroy/enable per breakpoint.

| Section | Behaviour |
|---------|-----------|
| **Hero** | Optional full-bleed slider (1 slide, fade effect, autoplay 6s, pause on hover). Only if multiple hero messages needed; otherwise static hero. |
| **Testimonials** | Carousel, `slidesPerView: 1` mobile → `2–3` desktop, pagination bullets, loop. |
| **Gallery** | Thumbnail/coverflow carousel of project photos; pairs with Fancybox lightbox. |
| **Service cards** | On mobile, horizontal swipe carousel; on desktop, static grid (Swiper disabled ≥`md` via `breakpoints`/`destroy`). |
| **Mobile sliders** | Any card row that overflows on small screens becomes a swipeable, free-mode slider. |

**Standards:** `a11y` module on, keyboard nav, `grabCursor`, `watchOverflow`,
custom nav arrows (accent), bullets restyled. Pause autoplay on `reduced-motion`.

---

## 8. Fancybox Usage

Use Fancybox (`@fancyapps/ui`) for overlays/lightboxes. Theme in
`components/_fancybox.scss`.

| Use case | Implementation |
|----------|----------------|
| **Before/After galleries** | Group `data-fancybox="before-after"` pairs; caption labels "Before"/"After". |
| **Image popups** | Project/gallery images open full-size with `data-fancybox="gallery"` + `data-caption`. |
| **Videos** | Embed testimonial/project videos (YouTube/Vimeo/MP4) via `data-fancybox` + `data-type="iframe"` or HTML5 video. |
| **Modals** | Quote-request modal & "Call us" prompt triggered via `data-fancybox` to inline `#quote-modal` content. |

**Standards:** lazy-load Fancybox JS/CSS; trap focus (built-in), `Esc` to close,
restore focus to trigger. Provide `alt`/captions. Keep transitions subtle.

---

## 9. Component System (reusable)

All components are BEM blocks, mobile-first, token-driven, and documented with a
clear markup contract. Build once, reuse across pages.

| Component | Key elements / notes |
|-----------|----------------------|
| **Header** | Logo, primary nav, phone CTA, "Get a Quote" button. Sticky, condenses on scroll, transparent-over-hero → solid. Mobile: hamburger → full-screen app drawer + bottom action bar (§2.10). |
| **Mega menu** | Multi-column dropdown under "Services": grouped service links + featured promo card/image. Keyboard accessible, `aria-expanded`, closes on outside click/Esc. |
| **Hero** | **Lean by design** — eyebrow + short headline + one supporting line + single primary CTA. Minimal trust marker (rating/badge) optional. No paragraphs. **Each page gets its own distinct, premium hero (see §9.1).** |
| **Service cards** | Icon, title, short copy, link/arrow. Grid (desktop) / swiper (mobile). Hover lift + image scale. |
| **CTA sections** | Bold headline + subcopy + primary button on dark/accent band. Used between sections to drive conversion. |
| **Testimonials** | Avatar/name/suburb, star rating (gold), quote. Swiper carousel. |
| **Statistics** | Animated counters (years experience, roofs completed, % satisfaction, warranty years). GSAP count-up. |
| **Process section** | Numbered steps (1 Consult → 2 Quote → 3 Install → 4 Warranty) with icons & connectors; staggered reveal. |
| **FAQ accordion** | Accessible disclosure (`button` + `aria-expanded`/`aria-controls`), one-open or multi-open, smooth height. |
| **Gallery** | Filterable project grid + before/after, Fancybox lightbox, lazy images. |
| **Footer** | Logo, brief blurb, nav columns, service-area/ABN, contact, socials, license/insurance trust line, copyright. |
| **Section header** | Reusable `eyebrow + title + subtitle` block used by **every** section. Enforces identical title/subtitle font, weight, and size site-wide (see Typography §2.2). Only alignment/theme varies. |
| Supporting | Button (primary/secondary/ghost/icon), Badge/Pill, Form fields, Logo strip (certifications/brands e.g. Colorbond). |

Each component: semantic root element, BEM classes, no inline styles, ARIA where
interactive, responsive by default, and reused — **never copy-paste variants**.

### 9.1 Per-page hero system

Every page has a **distinct, premium, professional hero** — never the same layout
reused. They share one `hero` base (BEM modifiers `hero--home`, `hero--services`,
etc.) and the same lean content rule (eyebrow → short headline → one line → CTA,
**no body paragraphs**), but each differs in composition, imagery, and treatment
so each page feels purpose-built.

| Page | Hero treatment (distinct layout) |
|------|----------------------------------|
| **Home** | Full-bleed cinematic roof/aerial image, gentle parallax, headline left-aligned over dark gradient, single primary CTA + small star rating. Tallest hero. |
| **Services** | Split hero — headline on a solid `--color-primary-900` panel + roofing image panel; eyebrow "What we do". Quick service chips below. |
| **About** | Editorial hero — large heading with a team/at-work image and a slim stat strip (years, roofs done) integrated into the hero base. |
| **Gallery** | Image-forward hero — minimal heading over a subtle masonry/peek of project photos; immediately signals visual content. |
| **Contact** | Compact, focused hero — short heading + key contact (phone, area served) with the quote form starting high on the page. Shortest hero. |

**Rules:**
- Consistent system (type scale, spacing, accent CTA, overlay tone) for brand unity;
  **varied composition** for distinctiveness.
- Premium feel: high-quality AU imagery, restrained text, strong overlay contrast,
  subtle GSAP reveal/parallax (respect reduced-motion).
- Mobile: edge-to-edge image, headline + single CTA in first viewport, app-style
  spacing; secondary actions move to the bottom bar (§2.10).
- Keep heroes light to protect LCP — hero image eager + `fetchpriority="high"`,
  everything else lazy.

---

## 10. Coding Standards

### HTML
- **Semantic & accessible:** `<header> <nav> <main> <section> <article> <footer>`,
  one `<h1>` per page, logical heading order, landmark roles where useful.
- Descriptive `alt`; `aria-label`/`aria-expanded`/`aria-controls` on interactive UI.
- `lang="en-AU"`, proper `<meta>` (charset, viewport, description, OG/Twitter).
- **No inline styles. No inline `<script>`/`onclick`.** Behaviour via JS modules.
- Lazy-load below-the-fold media: `loading="lazy"`, `decoding="async"`; hero LCP
  image eager + `fetchpriority="high"`.
- `<picture>` + `srcset`/`sizes` for responsive images; explicit dimensions.

### CSS / SCSS
- Mobile-first (`min-width` queries only). Tokens for everything (no hardcoded
  colors/sizes). BEM naming. Max nesting depth 3. No `!important` (except utilities).
- Compiled output minified; source maps in dev only. No unused CSS.
- Use logical properties where helpful; `clamp()` for fluid type/spacing.

### JavaScript
- Vanilla ES modules, one concern per file in `js/modules/`. No global leakage.
- No inline JS. Feature-detect; fail gracefully. Defer/`type="module"`.
- Init on `DOMContentLoaded`; guard selectors (`if (!el) return`).
- Lazy-load heavy libs (GSAP/Swiper/Fancybox) where possible; tree-shake via Vite.

### Accessibility (target AA)
- Visible `:focus-visible` rings; full keyboard operability; skip-to-content link.
- Color contrast ≥ AA; never convey meaning by color alone.
- `prefers-reduced-motion` respected globally. Forms: labels, error messaging,
  `aria-describedby`. Modals/drawers: focus trap + restore.

### SEO
- Unique `<title>` + meta description per page; canonical URLs.
- **schema.org `RoofingContractor`/`LocalBusiness`** JSON-LD (name, area served,
  geo, hours, phone, ratings). `sitemap.xml`, `robots.txt`, OpenGraph/Twitter cards.
- Clean semantic headings, descriptive link text, fast & mobile-friendly.

### Performance
- Lazy images, responsive `srcset`, WebP/AVIF, compressed assets.
- Preconnect fonts, `display=swap`, subset fonts. Minimal blocking JS.
- Critical CSS inlined if needed; defer non-critical JS. Cache-busting via Vite hashes.
- Avoid layout shift (explicit media dimensions / `aspect-ratio`).

### General
- Consistent naming (kebab-case files/classes, camelCase JS vars).
- DRY — extract shared markup/styles into components/mixins.
- Clean, commented where non-obvious; `.editorconfig` enforced; no dead code.

---

## 11. Performance Goals (Lighthouse, mobile)

| Category | Target |
|----------|--------|
| Performance | **95+** |
| Accessibility | **95+** |
| Best Practices | **95+** |
| SEO | **95+** |

**How we hit them:** mobile-first lean HTML/CSS, minimal & deferred JS, optimized
lazy responsive images (WebP/AVIF), font preconnect + swap, no CLS (sized media),
fast LCP (prioritized hero), semantic + schema markup, HTTPS, and reduced-motion
support. Audit each page before sign-off and fix regressions immediately.

---

## 12. Working Agreement for Claude

- **Do not** generate page HTML/CSS/JS until explicitly asked — this file is the
  spec phase deliverable.
- When implementation begins: follow the architecture in §4–§5 exactly, reuse
  components from §9, use only the tokens in §2, and meet §10–§11 standards.
- Keep content **minimal and premium**; prefer cutting over adding.
- Ground imagery in **authentic Australian roofing** sources (§3).
- Ask before introducing any dependency beyond GSAP, Swiper, Fancybox, Sass, Vite.
