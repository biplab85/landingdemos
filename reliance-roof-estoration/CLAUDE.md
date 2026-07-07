# Reliance Roof Restoration — Design & Development Guidelines

> The single source of truth for the **Reliance Roof Restoration** website.
> Read this before writing any markup, style, or script. Every visual and code decision
> should trace back to a rule in this document. If something here is wrong or missing,
> **update this file first**, then the code.

---

## 0. Overview — read this first

**In one line:** a clean, premium, mobile-first single-page site for **Reliance Roof
Restoration** (Greater Western Sydney) — **deep navy + warm roof-tile orange**, Plus Jakarta
Sans / Inter — populated with Reliance's **real** business facts.

**Design intent:** clean, trustworthy, distinctly **Australian trade** — not busy. On
mobile it should feel like a **premium native app** with a fixed **bottom app bar**, not a
shrunken desktop page.

**Scope of this phase:** the **`index.html` (home page) only.**

**Content rule:** Use Reliance's real facts (phone, ABN, address, service area, the 6
services). **Do not invent** staff names, prices, review text, years-in-business, or licence
numbers. Anything not verified is a **labelled placeholder** (`data-placeholder="true"` +
HTML comment).

---

## 1. Content & Facts (authoritative)

### Verified business facts (use exactly)

| Field         | Value                                                             |
| ------------- | ---------------------------------------------------------------- |
| Brand         | Reliance Roof Restoration                                        |
| Tagline       | Reliance Roof Restoration — Greater Western Sydney               |
| Positioning   | Roof restoration, replacement & repair specialists              |
| Phone / call  | `0449 615 054`  (tel: `+61449615054`)                            |
| Address       | 12/44 Stanbury Place, Quakers Hill NSW 2763                      |
| ABN           | 85 143 978 090                                                   |
| Service area  | Greater Western Sydney (Quakers Hill & surrounds)               |
| Socials       | Facebook (link only — no handle captured)                        |
| Email         | Not published — use the quote form / phone as CTA                |

> There is **no** published licence number, staff names, prices, business hours, or
> testimonials. Do **not** fabricate them. Where a section needs them, use a clearly
> **labelled placeholder** or omit the section.

### Hero / positioning copy (reuse, lightly polished)

- **Headline idea:** "Storm-proof your home and add value — with a full roof restoration."
  / "Western Sydney's roof restoration specialists."
- **Support:** Worn, leaking or ageing roof? We restore, replace and repair tile and metal
  roofs across Greater Western Sydney — increasing your property's value and weatherproofing
  your home. Free, no-obligation quotes.
- **Primary CTA:** "Get a Free Quote" · **Secondary CTA:** "Call 0449 615 054"

### Services (the 6 real services — derive the services grid from these)

1. **Asbestos Roof Removal** — asbestos roofing safely removed and disposed of.
2. **Roof Restoration** — restore worn, faded or leaking roofs (clean, repair, re-coat).
3. **Roof Repairs** — urgent leak detection and repair.
4. **Roof Replacement** — full replacement of deteriorated tile/metal roofs.
5. **Gutter Repairs** — gutter maintenance and urgent repair work.
6. **Gutter Replacement** — complete gutter & downpipe replacement.

### Why Choose Us (trust pillars — factual/positioning, not invented credentials)

- **Local to Western Sydney** — based in Quakers Hill, serving the whole region.
- **Restoration specialists** — restore, replace or repair; tile and metal.
- **Adds value & weatherproofs** — restoration protects and lifts your property's value.
- **Safe asbestos handling** — proper removal and disposal.
- **Free, no-obligation quotes** — honest advice up front.
- **Urgent repairs** — fast response for active leaks and storm damage.

### Process (implied — safe to present)

Inspect → Free Quote → Restore / Repair → Weatherproof result.

### FAQ (build from real facts only)

- Do you offer free quotes? — Yes, free no-obligation quotes.
- What areas do you cover? — Greater Western Sydney (Quakers Hill & surrounds).
- Do you remove asbestos roofing? — Yes, safely removed and disposed of.
- Tile and metal roofs? — Both restored, repaired and replaced.

### Imagery & placeholder rules

1. **Logo:** use the real Reliance logo/wordmark → `assets/img/logo/`.
2. **Photos:** roofing/home **stock placeholders** until real job photos are supplied. Every
   placeholder image carries `<!-- PLACEHOLDER: replace with real Reliance job photo -->`.
   Never imply a stock photo is a specific Reliance job in the copy.
3. **Reviews/stats:** none verified → any testimonial, star rating, or counter figure is a
   **labelled placeholder** (`data-placeholder="true"`). Real facts (ABN, phone, area) are
   presented as real.
4. Descriptive, contextual `alt` on every meaningful image.

---

## 2. Design Philosophy — "Clean Australian Trade Premium"

> **Trustworthy · Clean · Weatherproof · Premium · Local.**

- **Clear, conventional structure.** A familiar section rhythm (hero → about → tabbed/grid
  services → why-us → projects → FAQ → CTA → footer) with Reliance's clean navy + orange
  palette and generous whitespace.
- **Confident and calm.** Big Plus Jakarta Sans display headings, quiet Inter body, strong
  grid, one bold full-bleed **navy** feature band per major break.
- **Trust front-and-centre.** Phone, ABN, "Greater Western Sydney", and "Free Quote" are
  never far from view. Tap-to-call always reachable.
- **Depth through structure, not clutter.** Hairline borders, soft shadows, rounded media
  frames, a subtle texture on dark bands only.
- **Motion is a quiet signature.** Restrained GSAP reveals, rolling counters, hover zoom,
  Swiper sliders — always `prefers-reduced-motion` aware.
- **Mobile is the default and the showcase.** Design the small screen first; it must feel
  like a **premium app** with a fixed **bottom app bar** (see §11).

---

## 3. UX Principles (AU homeowner with a worn / leaking roof)

1. **Persistent call + quote.** Header tap-to-call + "Free Quote"; on mobile a fixed
   **bottom app bar** (Call · Quote · Services · Menu).
2. **Answer fast, above the fold.** "Storm-proof your home — free roof restoration quote."
3. **Prove legitimacy early.** ABN 85 143 978 090, local Quakers Hill address, Greater
   Western Sydney coverage.
4. **Short enquiry form** — name, phone, suburb, service, message → opens in a Fancybox modal.
5. **Service clarity** — all 6 services scannable at a glance.
6. **Local tone** — Western Sydney suburbs; every section ends in a clear next step.

---

## 4. Colour Palette (bespoke — navy + roof-tile orange)

CSS custom properties in `assets/scss/abstracts/_variables.scss`. **Tokens only — never
hard-code a hex in a component.**

### Neutrals (cool, clean)

| Token         | HEX       | Use                              |
| ------------- | --------- | -------------------------------- |
| `--c-white`   | `#FFFFFF` | Cards, elevated surfaces         |
| `--c-bg`      | `#F6F8FB` | Default page background          |
| `--c-alt`     | `#EEF2F7` | Alt section / nested surfaces    |
| `--c-border`  | `#E2E8F1` | Hairline borders & dividers      |
| `--c-ink`     | `#0B1220` | **Headings**, strongest text     |
| `--c-body`    | `#48546A` | **Body text**                    |
| `--c-body-2`  | `#5E6B80` | Secondary body                   |
| `--c-muted`   | `#8A94A6` | Meta, captions, placeholders     |

### Navy (dark feature sections / footer)

| Token          | HEX       | Use                                  |
| -------------- | --------- | ------------------------------------ |
| `--c-navy-900` | `#04122B` | Deepest dark                         |
| `--c-navy`     | `#081C3A` | **Dark section background** / footer |
| `--c-navy-700` | `#0F2B52` | Dark cards, hovered dark surfaces    |
| `--c-navy-600` | `#1B3A66` | Borders/dividers on dark             |

### Accent — roof-tile orange

| Token             | HEX                     | Use                                       |
| ----------------- | ----------------------- | ----------------------------------------- |
| `--c-orange`      | `#FF6A2B`               | **Primary accent** — CTAs, active, icons  |
| `--c-orange-600`  | `#E85A1E`               | Hover / pressed; orange text on light (AA)|
| `--c-orange-soft` | `#FFE9DE`               | Soft chips / icon backgrounds             |
| `--c-glow`        | `rgba(255,106,43,.28)`  | Focus ring + button glow                  |

### Functional aliases

```scss
--bg:        var(--c-bg);
--bg-white:  var(--c-white);
--bg-alt:    var(--c-alt);
--bg-dark:   var(--c-navy);
--text:      var(--c-body);
--heading:   var(--c-ink);
--muted:     var(--c-muted);
--line:      var(--c-border);
--accent:    var(--c-orange);
--action:    var(--c-orange);   // primary button = orange, white text
```

**Contrast rule:** WCAG AA. `--c-body` on bg/white passes AA. On navy use `--c-white` /
`rgba(255,255,255,.72)`. **Orange `#FF6A2B` takes white text** on buttons; for orange *text*
on light use `--c-orange-600`.

---

## 5. Typography System

- **Display / headings:** **"Plus Jakarta Sans"** — modern, geometric, premium; weights
  **600, 700, 800**.
- **Body & UI:** **"Inter"** — clean, highly legible; weights **400, 500, 600, 700**.
- **Loading:** Google Fonts with `preconnect` + `display=swap` (self-hosting to
  `assets/fonts/` optional later). `preload` the hero H1 face + hero image.
- **Fallbacks:**
  ```scss
  --font-display: "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
  --font-body:    "Inter", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  ```

### Type scale (fluid `clamp()`)

| Token          | Size (clamp)                     | Element                 | Family  | Weight | Line-height | Tracking |
| -------------- | -------------------------------- | ----------------------- | ------- | ------ | ----------- | -------- |
| `--fs-display` | `clamp(2.6rem, 6vw, 4.75rem)`    | Hero H1                 | display | 800    | 1.04        | -0.02em  |
| `--fs-h1`      | `clamp(2.1rem, 4.4vw, 3.25rem)`  | Big section H2          | display | 700    | 1.08        | -0.015em |
| `--fs-h2`      | `clamp(1.8rem, 3.2vw, 2.5rem)`   | Section H2              | display | 700    | 1.14        | -0.01em  |
| `--fs-h3`      | `clamp(1.3rem, 2vw, 1.65rem)`    | Card / sub heading      | display | 600    | 1.2         | normal   |
| `--fs-h4`      | `1.15rem`                        | Minor heading           | display | 600    | 1.3         | normal   |
| `--fs-lead`    | `clamp(1.05rem, 1.4vw, 1.25rem)` | Intro / lead paragraph  | body    | 400    | 1.6         | normal   |
| `--fs-body`    | `1rem`                           | Body                    | body    | 400    | 1.7         | normal   |
| `--fs-sm`      | `0.9375rem`                      | Secondary text          | body    | 400    | 1.6         | normal   |
| `--fs-xs`      | `0.8125rem`                      | Captions, meta          | body    | 500    | 1.5         | normal   |
| `--fs-eyebrow` | `0.8125rem`                      | Eyebrow (letter-spaced) | body    | 700    | 1.4         | 0.18em   |

**Heading rules:** Plus Jakarta Sans for H1–H4 & big numbers only. Eyebrows uppercase,
letter-spaced, orange, with a small section-relevant icon chip. Body line length ≤ 68ch.

---

## 6. Spacing System

8px base scale as tokens; pick the nearest step.

```scss
--sp-1:.25rem; --sp-2:.5rem; --sp-3:.75rem; --sp-4:1rem; --sp-5:1.5rem;
--sp-6:2rem;   --sp-7:3rem;  --sp-8:4rem;   --sp-9:6rem;  --sp-10:8rem;
```

- `--section-y`: `clamp(4.5rem, 9vw, 8rem)`.
- `--container`: `1240px`; `--container-wide`: `1440px`; `--gutter`: `clamp(1.25rem,4vw,2.5rem)`.
- On mobile, reserve bottom padding for the fixed app bar: `--appbar-h: 64px` (add
  `padding-bottom` / `scroll-margin` so content is never hidden behind it).

---

## 7. Border Radius

```scss
--r-xs:6px; --r-sm:10px; --r-md:16px; --r-lg:24px; --r-xl:36px; --r-pill:999px;
```

Media frames `--r-lg`/`--r-xl`; controls `--r-sm`/`--r-pill`; app-bar buttons `--r-md`.

---

## 8. Shadow & Elevation (restrained)

```scss
--shadow-xs: 0 1px 2px rgba(11, 18, 32, 0.06);
--shadow-sm: 0 4px 12px rgba(11, 18, 32, 0.07);
--shadow-md: 0 12px 30px rgba(11, 18, 32, 0.10);
--shadow-lg: 0 24px 60px rgba(11, 18, 32, 0.16);
--shadow-orange: 0 12px 26px rgba(255, 106, 43, 0.30);
--shadow-appbar: 0 -6px 24px rgba(11, 18, 32, 0.12);
--ring: 0 0 0 3px var(--c-glow);
```

At most one meaningful shadow per element; cards lift `sm`→`md` on hover.

---

## 9. Responsive Breakpoints (mobile-first, min-width)

```scss
$bp: (xs:360px, sm:480px, md:768px, lg:1024px, xl:1280px, xxl:1536px);
```

Test at 360, 390, 768, 1024, 1280, 1536. **The bottom app bar shows below `md` (768px)** and
hides at `md`+ (desktop uses the header CTA instead).

---

## 10. SCSS Architecture — **CONDITIONAL / pragmatic**

Source `assets/scss/`, compiled to `assets/css/`. Entry point is **`main.scss`**.

> **The SCSS structure is CONDITIONAL — there is no mandatory 7-1 folder tree.** Start from a
> **single, well-sectioned `main.scss`** (design tokens at the top, then base, then one clearly
> commented block per section). **Extract a partial only when a block grows large enough to
> warrant its own file** — then `@use` it from `main.scss`. Grow the structure to fit the
> code, not the other way around.

**When you do split**, use `@use` (not `@import`) and this natural grouping as a guide — add a
file only when its section earns it:

```
assets/scss/
  main.scss                     ← always: tokens + base + sections until they need splitting
  abstracts/  _variables _mixins _breakpoints   ← extract once tokens/mixins are reused widely
  base/       _reset _typography _utilities
  sections/   _hero _services _about … (one file per section that outgrows main.scss)
  vendor/     _swiper _fancybox                  ← only if vendor CSS overrides are needed
```

- Keep all design tokens (§4–§8) as CSS custom properties defined once at the top of
  `main.scss` (or in `abstracts/_variables` if extracted).
- BEM-lite classes; flat specificity (≤ 2 nesting); **tokens only** (no hard-coded hex in a
  component); `.u-` utilities; `.js-` / `data-*` hooks for JS. Never hand-edit compiled CSS.

---

## 11. Component / Section Structure (top → bottom)

1. **Header** — logo (real Reliance mark), nav, tap-to-call chip, "Get Free Quote" button;
   condenses on scroll; hamburger → drawer on mobile.
2. **Hero** — eyebrow, big headline ("Storm-proof your home"), sub-copy, dual CTA (Free Quote
   + Call), trust chips (ABN · Greater Western Sydney · Free Quotes); large roof photo with a
   floating trust card.
3. **Trust strip** — marquee of trust signals (Restoration · Repairs · Replacement · Asbestos
   Removal · Gutters · Western Sydney).
4. **About** — restoration story / value proposition + image collage. *(No invented years —
   keep copy factual.)*
5. **Services** — 6-card grid (the real 6 services).
6. **Why Choose Us** — trust-pillar cards with orange icon chips.
7. **Process** — Inspect → Free Quote → Restore/Repair → Weatherproof.
8. **Stats** — rolling counters. *(Figures are labelled placeholders.)*
9. **Gallery / Projects** — Swiper carousel + Fancybox lightbox. *(Placeholder photos.)*
10. **Testimonials** — Swiper/grid of reviews. *(Placeholder — labelled.)*
11. **Service Areas** — Greater Western Sydney suburbs + coverage note.
12. **FAQ** — accordion (real answers only).
13. **CTA band** — navy, "Ready to restore your roof? Get a free quote" + phone/quote.
14. **Footer** — logo, contact, ABN, quick links (mobile accordion), services, area, social,
    legal + credit line.
15. **Quote modal** — Fancybox enquiry form.
16. **Mobile bottom app bar** — fixed 4-item bar: **Call · Quote · Services · Menu** (active
    state, safe-area inset aware, hidden ≥768px).

---

## 12. Animation Guidelines (GSAP + ScrollTrigger)

- Section reveals: fade + 24px rise, `power3.out`, ~0.7s, stagger ~0.08s.
- Hero: headline line mask-reveal on load; subtle media parallax.
- Counters roll 0→target in view (~1.6s).
- Images: slow zoom on hover; clip reveal on scroll-in.
- App bar: gentle slide-up on first paint; active tab micro-bounce.
- Respect `prefers-reduced-motion`; prefer `transform`/`opacity`; page fully readable JS-off.

---

## 13. Third-Party Libraries

- **Swiper** — projects gallery + testimonials sliders.
- **Fancybox** — image lightbox + the quote/enquiry modal.
- **GSAP + ScrollTrigger** — reveals, counters, parallax, app-bar micro-motion.

Load vendor JS deferred; **guard every init** (no-op if target absent); vendor CSS overrides
live in `assets/scss/vendor/`.

---

## 14. JavaScript Architecture (ES6+)

Source in `assets/js/`, bundled to `assets/js/bundle.min.js` (esbuild). **All JS lives under
`assets/js/` — nothing at project root.**

```
assets/js/main.js
assets/js/modules/  header nav-drawer appbar animations counters sliders lightbox quote-modal forms accordion footer-accordion smooth-scroll
assets/js/utils/    dom prefers-motion
```

Each module exports `init()` that no-ops if its target is absent; reduced-motion aware; no
inline JS.

---

## 15. Coding Conventions

Semantic HTML5, one `<h1>`, landmarks, `alt` on meaningful images, `aria-*` on toggles. No
inline styles; no duplicated CSS; BEM-lite; progressive enhancement; 2-space indent;
kebab-case files; double-quoted lowercase attributes; brief "why" comments.

---

## 16. Accessibility (WCAG 2.1 AA)

AA contrast; visible focus (`--ring`); full keyboard for drawer/modal/accordion/sliders (Esc
closes, focus trap + restore); the bottom app bar items are real links/buttons with
`aria-label` and an `aria-current` active state; labelled form fields + `aria-describedby`
errors; skip link; descriptive links.

---

## 17. Performance Checklist

Ship minified `style.min.css` + `bundle.min.js`; `webp` + compressed `jpg` with width/height
to avoid CLS; hero image eager + `fetchpriority=high`, the rest `loading=lazy`;
preconnect/preload fonts + hero; defer JS; `content-visibility:auto` on long lower sections;
Lighthouse ≥ 90; SEO: title, meta description, OG/Twitter, `RoofingContractor` JSON-LD (real
NAP + ABN), canonical, favicon.

---

## 18. Node.js SCSS Workflow

```jsonc
"scripts": {
  "dev":           "npm-run-all --parallel watch:css watch:js serve",
  "serve":         "live-server --port=5175 --no-browser --entry-file=index.html",
  "watch:css":     "sass assets/scss/main.scss:assets/css/style.css --style=expanded --source-map --watch",
  "build:css:dev": "sass assets/scss/main.scss:assets/css/style.css --style=expanded --source-map",
  "prefix:css":    "postcss assets/css/style.css --use autoprefixer --replace --no-map",
  "build:css:min": "postcss assets/css/style.css --use cssnano --no-map --output assets/css/style.min.css",
  "watch:js":      "esbuild assets/js/main.js --bundle --format=iife --sourcemap --outfile=assets/js/bundle.js --watch",
  "build:js":      "esbuild assets/js/main.js --bundle --format=iife --minify --outfile=assets/js/bundle.min.js",
  "images":        "node scripts/optimize-images.mjs",
  "build":         "npm-run-all build:css:dev prefix:css build:css:min build:js"
}
```

Dev deps: `sass, postcss, postcss-cli, autoprefixer, cssnano, esbuild, npm-run-all,
live-server, sharp`. `index.html` links the **minified** CSS/JS. Never hand-edit compiled
output. Cache-bust CSS/JS links (`?v=x.y.z`) when iterating.

---

## 19. Folder Structure (everything under `assets/`)

```
reliance-roof-estoration/
├── index.html  CLAUDE.md  README.md  package.json  package-lock.json
├── .browserslistrc  .gitignore  postcss.config.cjs
└── assets/
    ├── scss/    (source — starts as a single main.scss; partials added only as needed, §10)
    ├── css/     (compiled style.css + style.min.css)
    ├── js/      (main.js + modules/ + utils/ + compiled bundle.min.js)
    ├── fonts/   (optional self-hosted faces)
    ├── vendor/  (swiper / fancybox / gsap if self-hosted)
    └── img/{logo,hero,services,about,gallery,icons,backgrounds,favicon}
```

Root stays clean: only the essential files and the `assets/` folder. **All images, CSS, and
JS live inside `assets/`.**

---

## 20. Definition of Done (this phase)

- [ ] `CLAUDE.md` complete (this file).
- [ ] Node build works (`npm run build` → minified CSS + JS).
- [ ] Clean, premium, mobile-first `index.html` built to every rule, with real Reliance facts.
- [ ] Real Reliance logo used; stock imagery labelled placeholder; no invented facts.
- [ ] Mobile **bottom app bar** works (Call/Quote/Services/Menu), safe-area aware, hidden ≥768px.
- [ ] GSAP / Swiper / Fancybox working; accessible; AA contrast; 0 console errors.
- [ ] Responsive at 360 / 768 / 1024 / 1280 / 1536.

---

### Git / workflow note

All work goes to the **`feature/theme-clining`** branch. **Never push or merge to `main`.**
**Only build inside `reliance-roof-estoration/` — never touch any other project.**
