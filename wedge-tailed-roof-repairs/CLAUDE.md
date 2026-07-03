# Wedge Tailed Roof Repairs — Frontend Build Guide & Design System

> **Single source of truth.** Read this document in full before writing a single line of markup, style, or script. Every decision below is intentional. When in doubt, follow this file over habit or memory. Development begins with `index.html`.

---

## 1. Project Overview

**Wedge Tailed Roof Repairs** is a high-end Australian roofing company. The website must feel **clean, premium, modern, trustworthy, and professional** — the digital equivalent of a meticulously finished roof. It is a marketing/lead-generation site: the primary conversion goal is a **quote request / call**, the secondary goal is building **trust** (credentials, workmanship, reviews, guarantees).

The design language pairs **confident type, generous imagery, and a warm accent** with a **structured industrial grid and disciplined spacing**. We take these as *principles* — not fixed layouts, colour, or copy. **Wedge Tailed Roof Repairs must have its own identity.**

### Brand story (design driver)
The wedge-tailed eagle is Australia's largest bird of prey — soaring, precise, protective, and commanding. That is the emotional spine of the brand: **strength that protects, precision you can trust, a company that watches over your home.** This translates into a design language that is **grounded and solid** (weighty type, strong horizontals, confident dark tones) yet **open and elevated** (generous whitespace, airy hero, soaring scroll motion).

### Tech stack
| Concern | Tool |
|---|---|
| Markup | HTML5 (semantic, accessible) |
| Styling | SCSS → compiled via Node (Dart Sass) into **readable dev CSS** + **auto-minified prod CSS** |
| Scripting | JavaScript **ES6 modules** (`type="module"`) |
| Animation | **GSAP** + ScrollTrigger — subtle micro-interactions & scroll reveals only |
| Sliders / carousels | **Swiper.js** — every slider without exception |
| Gallery / video / modals | **Fancybox** (@fancyapps/ui) |
| Build | Node scripts (`npm run` — see §14) |

**Non-negotiables:** mobile-first & app-like; no CSS framework (Bootstrap/Tailwind) — the design system below *is* the framework; no jQuery; no layout-shifting animations; respect `prefers-reduced-motion`.

---

## 2. Brand Personality & Design Principles

### Personality
- **Trustworthy** over flashy — evidence beats adjectives (badges, guarantees, real photos, review counts).
- **Premium** over cheap — space, restraint, quality photography, one confident accent colour.
- **Solid** over trendy — the design should still look right in five years.
- **Precise** over decorative — every element earns its place; alignment is exact.
- **Australian** — plain-spoken, warm, practical. No corporate jargon.

### Core design principles
1. **Clarity first.** One primary action per screen. The visitor always knows the next step (get a quote / call).
2. **Whitespace is a feature.** Generous, rhythmic spacing communicates premium. Never cram.
3. **One accent, used sparingly.** The Ember accent marks *only* the things we want clicked. Overuse kills it.
4. **Show the work.** Real roofs, real crews, real before/afters. Photography carries the premium feel — treat images as first-class.
5. **Confident hierarchy.** Big, weighty headings; calm, readable body; a clear third tier for labels/eyebrows.
6. **Motion with meaning.** Animation reveals structure and rewards scrolling; it never blocks, distracts, or delays.
7. **Grounded grid.** Strong horizontal rhythm and consistent gutters give an industrial-solid feel.
8. **Accessible by default.** If it isn't usable by keyboard and screen reader, it isn't done.

---

## 3. Colour System

A restrained, premium palette: a deep warm **Ironstone** neutral spine, one confident **Ember** accent (echoing terracotta tile / eagle plumage / Colorbond warmth), and a supporting cool **Steel** for trust cues. Neutrals are *warm* grays so the whole site feels solid, not clinical.

### Palette

| Token | Hex | Role |
|---|---|---|
| **Brand / Ink** | | |
| `--c-ink-900` | `#14171A` | Primary dark surfaces, footer, hero overlay |
| `--c-ink-800` | `#1E2226` | Dark section backgrounds |
| `--c-ink-700` | `#2C3138` | Dark cards on dark |
| `--c-ink-600` | `#3D444C` | Borders on dark, muted dark text |
| **Accent / Ember** | | |
| `--c-ember-600` | `#C2410C` | Accent pressed / text-on-light accent |
| `--c-ember-500` | `#E8590C` | **Primary accent** — CTAs, links, active states |
| `--c-ember-400` | `#F97316` | Accent hover, highlights |
| `--c-ember-100` | `#FDEBD8` | Accent tint backgrounds, badges |
| **Support / Steel** | | |
| `--c-steel-700` | `#334155` | Trust text, secondary buttons on light |
| `--c-steel-500` | `#5B6B7F` | Muted labels |
| `--c-steel-100` | `#EEF2F6` | Cool section wash, info panels |
| **Neutrals (warm gray)** | | |
| `--c-white` | `#FFFFFF` | Base surface |
| `--c-sand-50` | `#FAF8F5` | Warm off-white section background |
| `--c-sand-100` | `#F4F1EC` | Alternating section wash |
| `--c-gray-200` | `#E7E4DF` | Borders, dividers, hairlines |
| `--c-gray-400` | `#B4AFA6` | Disabled, placeholder |
| `--c-gray-600` | `#6B6860` | Secondary body text |
| `--c-gray-900` | `#22252A` | **Primary body text** |
| **Semantic** | | |
| `--c-success` | `#15803D` | Success feedback |
| `--c-warning` | `#B45309` | Warning |
| `--c-error` | `#DC2626` | Errors, required, destructive |
| `--c-focus` | `#F97316` | Focus ring (WCAG-visible) |

### Semantic tokens (use these in components, not raw palette)
```scss
:root {
  // Surfaces
  --surface-base:        var(--c-white);
  --surface-alt:         var(--c-sand-50);
  --surface-muted:       var(--c-sand-100);
  --surface-inverse:     var(--c-ink-900);
  --surface-inverse-alt: var(--c-ink-800);

  // Text
  --text-primary:        var(--c-gray-900);
  --text-secondary:      var(--c-gray-600);
  --text-on-inverse:     #F5F3EF;
  --text-on-inverse-mut: #A7ACB2;
  --text-accent:         var(--c-ember-600);

  // Interactive
  --action-primary:      var(--c-ember-500);
  --action-primary-hov:  var(--c-ember-400);
  --action-primary-act:  var(--c-ember-600);
  --action-secondary:    var(--c-steel-700);

  // Lines & focus
  --border-subtle:       var(--c-gray-200);
  --border-strong:       var(--c-steel-700);
  --ring-focus:          var(--c-focus);
}
```

### Contrast rules (WCAG AA minimum, AAA where cheap)
- Body text on light surfaces uses `--c-gray-900` (≈ 13:1). Never lighter than `--c-gray-600` (≥ 4.5:1) for meaningful text.
- **Ember on white** passes AA for large/UI text; for small body links use `--c-ember-600`. Never place `--c-ember-500` text smaller than 18px/700 on white without checking contrast.
- On dark surfaces use `--text-on-inverse` for body, `--text-on-inverse-mut` only for large/secondary.
- Colour is **never** the sole signal — pair with icon, text, weight, or underline.

> **Dark mode:** This is a marketing site; a full dark theme is **out of scope** for v1. Dark *sections* (hero, footer, CTA band) are handled via `--surface-inverse` and are designed intentionally, not auto-inverted. Do not build a theme toggle unless requested.

---

## 4. Typography

**Pairing:** a confident geometric grotesque for headings + a highly legible neutral sans for body. Distinctive while staying premium.

- **Display / Headings:** `Sora` (geometric, weighty, modern-industrial).
- **Body / UI:** `Inter` (neutral, superb legibility, tabular figures).
- **Fallback stack:** `system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.

> *Approved premium alternative* (if a more distinctive edge is wanted): headings **Clash Display** + body **Satoshi** (Fontshare). Pick one pairing and commit — do not mix.

### Loading
- Self-host WOFF2 in `assets/fonts/` (preferred) or Google Fonts with `&display=swap`.
- `<link rel="preload">` **only** the two above-the-fold weights (Sora 700, Inter 400). `font-display: swap` on all.

### Type scale (fluid, `clamp()` — mobile → desktop)
| Token | clamp() | Use |
|---|---|---|
| `--fs-display` | `clamp(2.75rem, 6vw, 5rem)` | Hero H1 |
| `--fs-h1` | `clamp(2.25rem, 4.5vw, 3.5rem)` | Page/section lead |
| `--fs-h2` | `clamp(1.875rem, 3.5vw, 2.75rem)` | Section titles |
| `--fs-h3` | `clamp(1.375rem, 2.2vw, 1.75rem)` | Card / sub-section titles |
| `--fs-h4` | `clamp(1.125rem, 1.6vw, 1.25rem)` | Small headings |
| `--fs-lead` | `clamp(1.125rem, 1.6vw, 1.375rem)` | Intro paragraphs |
| `--fs-body` | `1rem` (16px) | Base body — **never below 16px on mobile** |
| `--fs-small` | `0.875rem` | Captions, meta |
| `--fs-eyebrow`| `0.8125rem` | Uppercase eyebrow labels |

### Rules
- **Base 16px.** `html { font-size: 100%; }` — respect user zoom, never disable it.
- **Line-height:** headings `1.1–1.2`; body `1.6`; lead `1.5`.
- **Weights:** Display/H1 700; H2–H3 600; body 400; labels/buttons 500–600. Weight carries hierarchy, not just size.
- **Eyebrows:** uppercase, `letter-spacing: 0.08em`, `--c-ember-600` or `--c-steel-500`, small — used above section titles for rhythm.
- **Measure:** body max ~68ch; mobile 40–60 chars/line.
- **Headings** use `text-wrap: balance`; lead paragraphs use `text-wrap: pretty`.
- **Numbers** in stats/prices use `font-variant-numeric: tabular-nums`.

---

## 5. Spacing, Grid & Layout

### Spacing scale (8-point base, 4px half-steps)
```scss
--space-0:  0;      --space-1:  0.25rem;  // 4
--space-2:  0.5rem; --space-3:  0.75rem;  // 8 / 12
--space-4:  1rem;   --space-5:  1.5rem;   // 16 / 24
--space-6:  2rem;   --space-7:  2.5rem;   // 32 / 40
--space-8:  3rem;   --space-9:  4rem;     // 48 / 64
--space-10: 5rem;   --space-11: 6rem;     // 80 / 96
--space-12: 8rem;                          // 128
```
Use tokens only — no arbitrary pixel gaps.

### Section rhythm
- **Section vertical padding:** `clamp(4rem, 9vw, 8rem)` top & bottom (`--section-pad`).
- **Intra-section blocks:** `--space-8` to `--space-9`.
- **Card internal padding:** `--space-6` (mobile `--space-5`).

### Containers
```scss
--container-xs:  33.75rem;  // 540 — narrow prose
--container-sm:  45rem;     // 720
--container-md:  60rem;     // 960
--container-lg:  90rem;     // 1440 — PRIMARY site container width
--container-xl:  90rem;     // 1440 — same as lg so every section aligns
--container-full: 100%;     // bleed sections (hero media, marquees)
--gutter: clamp(1.25rem, 5vw, 2.5rem); // responsive side padding
```
`.container` = `max-width: var(--container-lg); margin-inline: auto; padding-inline: var(--gutter);`
**All page sections use `.container` / `.container--xl` (both 1440) with the same `--gutter`, so every section's left/right content edges align.** The narrower widths (`xs`–`md`) are reserved for isolated prose blocks only.

### Grid
- Layout with **CSS Grid** for page/section structure; **Flexbox** for component-internal alignment.
- A **12-column** conceptual grid; declare only the columns a section needs.
- Standard content gap: `--space-6` (desktop), `--space-5` (mobile).
- Cards: `repeat(auto-fit, minmax(min(100%, 18rem), 1fr))` for resilient responsive grids.

### Z-index scale (never hardcode)
```scss
--z-base: 0; --z-raised: 10; --z-sticky: 100; --z-header: 500;
--z-drawer: 800; --z-overlay: 900; --z-modal: 1000; --z-toast: 1100;
```

---

## 6. Elevation (Shadows) & Border Radius

### Shadow scale — soft, warm-tinted, premium (never harsh black)
```scss
--shadow-xs: 0 1px 2px rgba(20, 23, 26, 0.06);
--shadow-sm: 0 2px 6px rgba(20, 23, 26, 0.08);
--shadow-md: 0 8px 24px rgba(20, 23, 26, 0.10);
--shadow-lg: 0 18px 48px rgba(20, 23, 26, 0.12);
--shadow-xl: 0 30px 80px rgba(20, 23, 26, 0.16);
--shadow-accent: 0 10px 30px rgba(232, 89, 12, 0.28); // ember CTA glow, sparingly
```
- Rest cards: `--shadow-sm`. Hover lift: `--shadow-md`/`--shadow-lg`. Modals: `--shadow-xl`.
- Consistent elevation = consistent meaning. Don't invent one-off shadows.

### Border radius
```scss
--radius-xs: 4px;  --radius-sm: 8px;   --radius-md: 12px;
--radius-lg: 18px; --radius-xl: 28px;  --radius-pill: 999px;
--radius-round: 50%;
```
- Buttons: `--radius-md` (or `--radius-pill` for the hero primary CTA — pick one and stay consistent).
- Cards / images / inputs: `--radius-lg`.
- Chips / tags / badges: `--radius-pill`.

---

## 7. Responsive Breakpoints

Mobile-first. Author base styles for the smallest screen, then scale **up** with `min-width` media queries.

```scss
$bp-xs:  360px;   // small phones (base — no MQ needed)
$bp-sm:  480px;   // large phones
$bp-md:  768px;   // tablets / landscape phones
$bp-lg:  1024px;  // small laptops
$bp-xl:  1280px;  // desktops
$bp-2xl: 1440px;  // large desktops
```

Use the `respond()` mixin (see §10) — never write raw media queries in components:
```scss
.card { padding: var(--space-5); @include respond(md) { padding: var(--space-6); } }
```

**Rules:** no horizontal scroll at any width; test 360, 768, 1024, 1440; verify landscape phone; use `min-h: 100dvh` (not `100vh`) for full-height sections.

---

## 8. Component Guidelines (reusable)

Every reusable UI piece is a BEM block with its own partial in `scss/components/`. Build these as the shared vocabulary:

- **Button** (`.btn`): variants `--primary`, `--secondary`, `--ghost`, `--on-dark`; sizes `--sm`, `--lg`; states hover/active/focus-visible/disabled/loading. Min height **48px**, min touch target **44×44**. Icon+label; never icon-only for primary actions. Includes `.btn--icon` slot with consistent 20–24px SVG.
- **Section header** (`.section-head`): eyebrow + H2 + lead, with alignment modifiers `--center`/`--start`. Reused above most sections for rhythm.
- **Card** (`.card`): base for service, feature, project, testimonial, team, blog. Radius `--radius-lg`, `--shadow-sm`, hover lift + `--shadow-md`. Image slot with fixed `aspect-ratio`.
- **Service card** (`.service-card`): icon, title, blurb, "Learn more" link; whole card clickable (nested `<a>` with accessible label).
- **Stat / counter** (`.stat`): big tabular number + label; GSAP count-up on scroll into view.
- **Testimonial** (`.testimonial`): quote, author, role, star rating, avatar; used inside Swiper.
- **Accordion / FAQ** (`.accordion`): `<details>`-based or button+`aria-expanded`; smooth height animation; one primary open at a time optional.
- **Trust bar** (`.trust-bar`): logos/badges (licensed, insured, warranty, years) — Swiper marquee on mobile, static row on desktop.
- **CTA band** (`.cta-band`): dark inverse surface, headline + phone + quote button; recurring conversion anchor.
- **Form field** (`.field`): visible `<label>`, input, helper text, inline error, required marker. See §12.
- **Header / nav** (`.site-header`, `.nav`): sticky, transparent-over-hero → solid-on-scroll; desktop inline nav; mobile drawer.
- **Mobile drawer** (`.drawer`): full-height slide-in panel, focus-trapped, `Esc`/scrim/close-button dismiss.
- **Badge / chip** (`.badge`): pill, tint background, optional icon.
- **Media / lightbox trigger** (`.media`): image with Fancybox binding for gallery/video.
- **Footer** (`.site-footer`): dark, multi-column, contact, service links, ABN/licence, socials.
- **Sticky mobile action bar** (`.action-bar`): fixed bottom bar on mobile with **Call** + **Get Quote** (app-like). Hidden ≥ `lg`.

### Component contract
- Self-contained partial; no dependence on page context.
- Semantic tokens only (no raw hex/px).
- All states defined (rest, hover, active, `:focus-visible`, disabled).
- Keyboard operable; correct roles/ARIA.
- One consistent SVG icon set (e.g. **Lucide** or **Phosphor**) — never emoji as icons, consistent stroke width.

---

## 9. Animation & Motion

**Library:** GSAP + ScrollTrigger for scroll reveals and micro-interactions; Swiper for slider motion; CSS transitions for simple state changes.

### Principles
- **Subtle & purposeful.** Reveal structure, reward scroll, confirm interaction. Never decorative-only.
- **Fast.** Micro-interactions 150–250ms; entrance reveals 400–600ms; nothing > 800ms.
- **Performant.** Animate **only** `transform` and `opacity`. Never animate width/height/top/left (use transforms). No layout thrash / CLS.
- **Easing:** enter `ease-out` / `power2.out`; exit faster (~60–70% duration), `ease-in`. Prefer GSAP `power`/spring-like curves over linear.
- **Restraint:** animate 1–2 key elements per view; stagger list items 40–80ms.
- **Interruptible & non-blocking:** input is never locked during animation.

### Motion tokens
```scss
--dur-fast: 150ms; --dur-base: 250ms; --dur-slow: 450ms;
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

### Signature patterns
- **Hero:** headline lines mask-reveal up (stagger), CTA fade+rise, subtle image scale-in / parallax on scroll.
- **Section reveals:** eyebrow → title → content fade-up stagger via one reusable ScrollTrigger batch.
- **Stat counters:** count-up when 60% in view.
- **Card hover:** lift (`translateY(-6px)`) + shadow deepen, 200ms.
- **Sticky header:** shrink + background solidify on scroll past hero.
- **Marquee trust bar:** slow continuous Swiper autoplay (mobile).

### Reduced motion (mandatory)
```scss
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
```
In JS, guard GSAP scroll reveals: if `matchMedia('(prefers-reduced-motion: reduce)').matches`, set final state instantly and skip timelines. Content must be fully readable without motion.

---

## 10. SCSS Architecture — 7-1 Pattern

```
scss/
├── abstracts/          # No CSS output — tools only
│   ├── _variables.scss   # SCSS vars, breakpoint map, config
│   ├── _tokens.scss      # CSS custom properties (:root) — colour, space, type, radius, shadow, motion
│   ├── _functions.scss   # rem(), fluid(), token helpers
│   ├── _mixins.scss      # respond(), container, focus-ring, visually-hidden, truncate, grid helpers
│   └── _index.scss       # @forward all abstracts
│
├── base/               # Global element defaults
│   ├── _reset.scss       # modern reset (box-sizing, margins, media defaults)
│   ├── _root.scss        # html/body base, font smoothing, scroll behaviour
│   ├── _typography.scss  # element type defaults (h1–h6, p, a, lists)
│   ├── _accessibility.scss # focus-visible, skip-link, sr-only, reduced-motion
│   └── _utilities.scss   # small utility classes (.container, .u-hidden, .text-center)
│
├── components/         # Reusable UI blocks (BEM) — one file each
│   ├── _button.scss   _card.scss   _badge.scss   _form.scss
│   ├── _accordion.scss _stat.scss  _testimonial.scss _trust-bar.scss
│   ├── _section-head.scss _media.scss _breadcrumb.scss ...
│
├── layout/             # Structural, page-level regions
│   ├── _header.scss   _nav.scss   _drawer.scss   _footer.scss
│   ├── _grid.scss     _section.scss _action-bar.scss
│
├── pages/              # Page-specific composition only (rare)
│   └── _home.scss        # home section wiring; keep thin
│
├── vendor/             # Third-party overrides
│   ├── _swiper.scss      # Swiper theme (colours, bullets, arrows)
│   └── _fancybox.scss    # Fancybox theme overrides
│
├── themes/             # Optional surface themes
│   └── _inverse.scss     # dark-section (.is-inverse) tokens
│
└── main.scss           # Manifest — @use order below
```

### `main.scss` load order (strict)
```scss
@use 'abstracts' as *;   // tools first (no output)
@use 'base/reset';
@use 'base/root';
@use 'base/typography';
@use 'base/accessibility';
@use 'base/utilities';
@use 'layout/grid';
@use 'layout/section';
@use 'layout/header';
@use 'layout/nav';
@use 'layout/drawer';
@use 'layout/action-bar';
@use 'layout/footer';
@use 'components/button';
// ...all components
@use 'vendor/swiper';
@use 'vendor/fancybox';
@use 'themes/inverse';
@use 'pages/home';
```

### File responsibilities
- **abstracts/** — pure Sass logic; imported everywhere, emits **zero** CSS. All design decisions live in `_tokens.scss` (CSS vars) + `_variables.scss` (Sass maps).
- **base/** — the "blank canvas": reset, root defaults, element typography, a11y helpers, tiny utilities.
- **components/** — self-contained BEM blocks. A component partial never reaches outside its block.
- **layout/** — page skeleton (header, footer, nav, section wrapper, grid, mobile action bar).
- **pages/** — only composition/overrides unique to a page. Keep minimal; push reusables to components.
- **vendor/** — restyle Swiper/Fancybox to brand tokens; keep third-party overrides quarantined here.
- **themes/** — `.is-inverse` remaps semantic tokens for dark sections.

### Modern Sass
Use `@use` / `@forward` (module system), **never** `@import`. Namespaced via `abstracts/_index.scss` → `@use 'abstracts' as *;`.

### Key mixins (in `_mixins.scss`)
```scss
@mixin respond($bp)      { @media (min-width: map.get($breakpoints, $bp)) { @content; } }
@mixin container($max: lg){ width: 100%; max-width: var(--container-#{$max}); margin-inline: auto; padding-inline: var(--gutter); }
@mixin focus-ring        { &:focus-visible { outline: 3px solid var(--ring-focus); outline-offset: 2px; } }
@mixin visually-hidden   { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
```

---

## 11. Build System (Node + Dart Sass)

Dual output: **readable dev CSS** (expanded, sourcemaps, live watch) and **minified prod CSS** (compressed, no map, autoprefixed).

### `package.json` scripts
The CSS pipeline is deliberately ordered: **(1)** Sass compiles the readable
expanded `style.css`; **(2)** autoprefixer rewrites that expanded file in place;
**(3)** cssnano minifies the *already-prefixed* `style.css` into `style.min.css`.
> Do **not** run autoprefixer directly on Sass `--style=compressed` output —
> PostCSS re-serialises compressed CSS back to expanded, producing a "minified"
> file *larger* than the readable one. Autoprefix the expanded file, then minify.

```jsonc
{
  "scripts": {
    "dev":          "npm-run-all --parallel watch:css watch:js serve",
    "serve":        "live-server --port=5173 --no-browser",

    // Readable development CSS (expanded + sourcemap, rebuilds on save)
    "watch:css":    "sass scss/main.scss:assets/css/style.css --style=expanded --source-map --watch",
    "build:css:dev":"sass scss/main.scss:assets/css/style.css --style=expanded --source-map",

    // Autoprefix the expanded file in place
    "prefix:css":   "postcss assets/css/style.css --use autoprefixer --replace --no-map",

    // Minify the prefixed expanded file → production CSS
    "build:css:min":"postcss assets/css/style.css --use cssnano --no-map --output assets/css/style.min.css",

    // JS bundle (ES modules → minified prod bundle)
    "build:js":     "esbuild js/main.js --bundle --format=esm --minify --outfile=assets/js/bundle.min.js",
    "watch:js":     "esbuild js/main.js --bundle --format=esm --sourcemap --outfile=assets/js/bundle.js --watch",

    // Image optimisation (see §13)
    "images":       "node scripts/optimize-images.mjs",

    // Full production pipeline
    "build":        "npm-run-all build:css:dev prefix:css build:css:min build:js"
  }
}
```
Config note: keep the browserslist query in **`.browserslistrc` only** — declaring
it in both `.browserslistrc` and `package.json` makes browserslist throw.

### Dev dependencies
`sass`, `postcss`, `postcss-cli`, `autoprefixer`, `cssnano`, `esbuild`, `npm-run-all`, `live-server`, `sharp` (image optimisation).

### HTML linking
- **Dev:** link `assets/css/style.css` (readable, mapped).
- **Prod:** link `assets/css/style.min.css`.
- Manage via a build flag or a simple pre-deploy find/replace; document which is live. Preload the critical CSS file.
- `.browserslistrc`: `> 0.5%, last 2 versions, not dead, iOS >= 14`.

### Vendor libraries
Prefer npm + bundle via esbuild for GSAP/Swiper/Fancybox; CDN with SRI is acceptable if kept version-pinned. Load `defer`/`type="module"`.

---

## 12. Production Folder Architecture

```
wedge-tailed-roof-repairs/
├── index.html                # build starts here
├── services.html  about.html  contact.html  gallery.html  (as needed)
├── CLAUDE.md                  # THIS FILE — source of truth
├── package.json  .browserslistrc  .gitignore
├── postcss.config.cjs
│
├── scss/                      # source styles (7-1, see §10)
│
├── js/                        # source ES modules
│   ├── main.js                # entry: imports + init
│   ├── modules/
│   │   ├── header.js          # sticky + scroll state
│   │   ├── nav-drawer.js      # mobile drawer + focus trap
│   │   ├── sliders.js         # Swiper instances
│   │   ├── lightbox.js        # Fancybox bindings
│   │   ├── animations.js      # GSAP + ScrollTrigger reveals
│   │   ├── counters.js        # stat count-up
│   │   ├── accordion.js       # FAQ
│   │   ├── forms.js           # validation + submit UX
│   │   └── smooth-scroll.js   # anchor scrolling
│   └── utils/
│       ├── dom.js             # $ , $$, on() helpers
│       └── prefers-motion.js  # reduced-motion guard
│
├── assets/
│   ├── css/                   # COMPILED output (git-ignored or committed per policy)
│   │   ├── style.css  style.css.map   # readable dev
│   │   └── style.min.css              # minified prod
│   ├── js/                    # bundled output (bundle.js / bundle.min.js)
│   ├── fonts/                 # self-hosted WOFF2
│   ├── images/
│   │   ├── hero/  services/  projects/  team/  icons/  logos/
│   │   └── (optimized/ generated WebP/AVIF + fallbacks)
│   └── favicon/               # favicons, webmanifest, og-image
│
└── scripts/
    └── optimize-images.mjs    # sharp pipeline
```

**`.gitignore`:** `node_modules/`. Compiled `assets/css` & `assets/js` — commit for static hosting, or ignore if built in CI. Decide once and note it here.

---

## 13. Image & Asset Strategy

Photography is the premium payload — treat it accordingly.

- **Formats:** ship **AVIF + WebP** with a JPEG fallback via `<picture>`. Use `sharp` (`scripts/optimize-images.mjs`) to generate variants.
- **Responsive:** `srcset` + `sizes` for hero and gallery; serve appropriate resolutions (1x/2x).
- **Dimensions:** always set `width`/`height` or `aspect-ratio` to prevent CLS.
- **Lazy loading:** `loading="lazy"` + `decoding="async"` on all below-the-fold images. Hero image is **eager** and `fetchpriority="high"`.
- **Alt text:** descriptive on meaningful images; `alt=""` on purely decorative.
- **SVG:** inline UI icons (one set, consistent stroke); logos as SVG.
- **Weight budget:** hero < 250KB (AVIF), other images < 150KB. Total initial page < 1.2MB.
- **Naming:** `kebab-case`, descriptive (`metal-roof-restoration-brisbane.webp`).

```
<picture>
  <source type="image/avif" srcset="…-800.avif 800w, …-1600.avif 1600w" sizes="(min-width:768px) 50vw, 100vw">
  <source type="image/webp" srcset="…-800.webp 800w, …-1600.webp 1600w" sizes="…">
  <img src="…-800.jpg" width="1600" height="1067" alt="Restored terracotta tile roof, before and after" loading="lazy" decoding="async">
</picture>
```

---

## 14. Development Conventions

### HTML
- Semantic landmarks: `<header> <nav> <main> <section> <article> <aside> <footer>`.
- One `<h1>` per page; sequential heading order (no skips).
- Every section gets `aria-labelledby` pointing at its heading id.
- Skip-link (`Skip to content`) first focusable element.
- Buttons for actions, `<a>` for navigation. Never a `<div>` with a click handler for primary actions.
- Forms: `<label for>`, correct `type` (`tel`, `email`), `autocomplete`, `required`.
- SEO/meta: title, description, canonical, Open Graph + Twitter card, `LocalBusiness`/`RoofingContractor` JSON-LD (name, ABN, phone, address, geo, hours, `areaServed`, rating).

### BEM naming
`.block`, `.block__element`, `.block--modifier`.
```
.service-card
.service-card__icon
.service-card__title
.service-card__cta
.service-card--featured
```
- Blocks map 1:1 to SCSS component partials.
- State via modifier or `is-`/`has-` state classes toggled by JS (`.is-open`, `.is-active`, `.has-error`).
- No deep nesting in Sass (max 2 levels); no element-selector styling for components — class-based only.
- Utilities prefixed `u-` (`.u-visually-hidden`, `.u-text-center`).

### JavaScript (ES6 modules)
- `type="module"`, `defer`. One responsibility per module in `js/modules/`.
- `main.js` imports modules and calls their `init()` after `DOMContentLoaded`; each module guards for the presence of its target element (`if (!el) return;`) so pages only run what they need.
- Shared DOM helpers in `utils/dom.js`; centralise reduced-motion check in `utils/prefers-motion.js`.
- Register `gsap.registerPlugin(ScrollTrigger)` once. Initialise Swiper/Fancybox from their modules with brand config.
- No global namespace pollution; no inline `onclick`. Use event delegation where sensible.
- Debounce/throttle scroll & resize handlers; prefer ScrollTrigger over manual scroll math.
- Progressive enhancement: content and core navigation work without JS; JS layers on animation/enhancement.

### Code quality
- Prettier for formatting; consistent 2-space indent.
- Comments explain *why*, not *what*. Section-banner comments in SCSS partials.

---

## 15. Accessibility Standards (WCAG 2.1 AA)

- **Contrast:** text ≥ 4.5:1 (large ≥ 3:1); UI/borders ≥ 3:1. Verify Ember usages.
- **Keyboard:** every interactive element reachable & operable; logical tab order matching visual order; visible `:focus-visible` ring (§10 mixin) — never remove outlines without replacement.
- **Focus management:** drawer & modals trap focus, restore on close, `Esc` closes.
- **Screen readers:** `aria-label` on icon buttons; `aria-expanded`/`aria-controls` on toggles; `aria-live="polite"` for form status/toasts; decorative SVGs `aria-hidden="true"`.
- **Motion:** honour `prefers-reduced-motion` (§9).
- **Forms:** visible labels, errors tied via `aria-describedby`, `role="alert"` on error summary, auto-focus first invalid field.
- **Targets:** ≥ 44×44px with ≥ 8px spacing.
- **Media:** captions/transcript for video; meaningful `alt`.
- **Zoom:** usable at 200% with no loss of content/function; never `user-scalable=no`.

---

## 16. Performance Considerations

- **Core Web Vitals targets:** LCP < 2.5s, CLS < 0.1, INP < 200ms.
- Preload critical font (2 weights) + hero image; `font-display: swap`.
- Inline or early-load critical CSS; defer non-critical JS.
- Minified prod CSS + bundled/minified JS; tree-shake vendor imports (import only used GSAP/Swiper modules).
- Optimised responsive images (§13); reserve space for all media.
- Lazy-load below-the-fold media and heavy sections; consider lazy-init Swiper/Fancybox on interaction/scroll.
- Throttle scroll/resize; batch DOM reads/writes; animate transform/opacity only.
- Self-host fonts; limit third-party scripts, load `async`/`defer`.
- Lighthouse target: **90+** across Performance, Accessibility, Best Practices, SEO before launch.

---

## 17. SEO-Ready Structure

- Semantic HTML + logical heading hierarchy per page.
- `<title>` (≤ 60 chars) and meta description (≤ 155) unique per page; keyword focus on service + Australian location.
- Canonical URLs; clean descriptive slugs.
- Open Graph + Twitter Card meta + branded `og-image`.
- **JSON-LD:** `RoofingContractor` / `LocalBusiness` with `name, telephone, address, geo, openingHours, areaServed, aggregateRating, sameAs`. Add `FAQPage` schema on the FAQ, `BreadcrumbList` on inner pages.
- `sitemap.xml` + `robots.txt`.
- Descriptive `alt`, meaningful link text (no "click here").
- Fast, mobile-friendly, HTTPS — all SEO signals covered by §15/§16.
- Local SEO: NAP (Name/Address/Phone) consistent in footer and schema; embed service-area list.

---

## 18. Recommended Homepage Structure

Section sequence engineered for trust → desire → action. Alternate `--surface-base` / `--surface-alt` (with 1–2 `.is-inverse` dark bands for drama). Each section: eyebrow → H2 → content, revealed with staggered fade-up.

| # | Section | Content hierarchy | Animation | Mobile behaviour |
|---|---|---|---|---|
| 1 | **Header / Nav** | Logo · nav links · phone · **Get a Quote** CTA | Transparent over hero → solid + shrink on scroll | Logo + hamburger; drawer nav; phone & quote pinned |
| 2 | **Hero** | Eyebrow · big H1 (value prop) · sub-lead · primary CTA + phone · trust chips (licensed/insured/★ rating) · hero roof image | Headline line-mask stagger, CTA rise, subtle image parallax/scale | Full-height `100dvh`, single-column, CTA thumb-reachable, image art-directed |
| 3 | **Trust bar** | Badges/logos: licensed, insured, warranty, years, review score | Fade-in; marquee on mobile | Swiper auto-marquee |
| 4 | **Services** | Eyebrow + H2 · grid of service cards (metal, tile, restoration, gutters, leaks, repointing) · card CTA | Cards fade-up stagger; hover lift | 1-col stack; horizontal Swiper optional |
| 5 | **Why us / USP** | H2 · 3–4 value pillars (precision, guarantee, local, clean finish) · supporting image | Two-column reveal; icon pop | Stack; image first |
| 6 | **Stats band** (`.is-inverse`) | Roofs completed · years · ★ rating · suburbs served | Count-up on view | 2×2 grid |
| 7 | **Process** | H2 · numbered steps (Inspect → Quote → Repair → Guarantee) | Connected timeline reveal, step stagger | Vertical stepper |
| 8 | **Projects / Gallery** | H2 · before/after grid · Fancybox lightbox | Masonry fade-up; hover zoom | Swiper carousel + tap-to-lightbox |
| 9 | **Testimonials** | H2 · star reviews · author + suburb · Google rating | Swiper slide + fade | 1-per-view swipe, pagination dots |
| 10 | **About / Team** (optional) | Brief story (eagle-inspired ethos) · crew photo · credentials | Image reveal + text fade-up | Stack |
| 11 | **FAQ** | H2 · accordion of common roofing questions | Accordion height animate | Full-width accordion |
| 12 | **CTA band** (`.is-inverse`) | Headline · phone (tap-to-call) · **Get a Free Quote** | Ember CTA subtle pulse/glow | Prominent full-width buttons |
| 13 | **Contact / Quote form** | H2 · form (name, phone, email, service, suburb, message) · map/service area · direct contact | Field focus states; submit → loading → success | Single-column, correct mobile keyboards, ≥44px inputs |
| 14 | **Footer** (`.is-inverse`) | Logo · nav · services · contact · ABN/licence · socials · hours | Fade-in | Stacked accordion columns |
| — | **Sticky action bar** | **Call** + **Get Quote** | Slide up after hero | Mobile-only fixed bottom bar |

### Content hierarchy guidance
- Every section leads with the benefit, not the feature ("Leak fixed today", not "We do leaks").
- One primary CTA colour (Ember) throughout; secondary actions are `--ghost`/steel.
- Repeat the conversion action at hero, mid-page (CTA band), and contact — plus the sticky mobile bar.

---

## 19. Mobile-First / App-Like Behaviour

- Design at 360px first; enhance upward.
- **Sticky bottom action bar** (Call + Quote) — the app-like conversion anchor; hidden ≥ `lg`.
- **Drawer nav:** slide-in, focus-trapped, scrim dismiss, `Esc` close, body scroll lock while open.
- Tap-to-call (`tel:`) and tap-to-map links everywhere the phone/address appears.
- Touch targets ≥ 44px, ≥ 8px apart; press feedback within 100ms (scale 0.97 / opacity).
- Momentum-smooth scroll; swipeable Swiper carousels for services/gallery/testimonials.
- Correct input keyboards (`type="tel"`, `email`); inputs ≥ 44px, ≥ 16px font (prevents iOS zoom).
- Respect safe areas (`env(safe-area-inset-*)`) for sticky bars.
- `min-height: 100dvh` for full-height sections; no horizontal overflow.
- Progressive disclosure: accordions/FAQ, "show more" for long lists.

---

## 20. Definition of Done (pre-launch checklist)

- [ ] Builds clean: `npm run build` produces readable `style.css` **and** minified `style.min.css` (+ bundled JS).
- [ ] Prod HTML links minified CSS/JS; critical assets preloaded.
- [ ] Validates: HTML valid, no console errors, no layout shift (CLS < 0.1).
- [ ] Responsive verified at 360 / 768 / 1024 / 1440 + landscape phone; no horizontal scroll.
- [ ] Keyboard-only pass: focus visible, drawer/modal trap+restore, `Esc` works.
- [ ] `prefers-reduced-motion` respected; content readable without motion.
- [ ] Contrast AA verified (esp. Ember usages); alt text present; JSON-LD valid.
- [ ] Lighthouse ≥ 90 across all four categories.
- [ ] Images optimised (AVIF/WebP + fallback, sized, lazy where appropriate).
- [ ] All CTAs work; tap-to-call live; form validates + shows loading/success/error.
- [ ] Cross-browser: latest Chrome, Safari (incl. iOS), Firefox, Edge.

---

*Build in this order: tokens & abstracts → base → layout (header/nav/footer/action-bar) → components → `index.html` section by section → JS modules → animation pass → optimise → QA against §20.*
