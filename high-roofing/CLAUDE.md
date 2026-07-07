# High Roofing — Design & Development Guidelines

> The single source of truth for the **High Roofing** website (owner **Jacob Kikkert**).
> Read this before writing any markup, style, or script. Every visual and code decision
> should trace back to a rule in this document. If something here is wrong or missing,
> **update this file first**, then the code.

---

## 0. Overview — read this first

**In one line:** a modern, premium single-page site for **High Roofing** — navy + orange,
Poppins / DM Sans — populated with High Roofing's **real** business facts. Keep the business
info; do not invent staff/prices.

**Scope of this phase:** the **`index.html` page only.**

---

## 0.5 CURRENT DESIGN SYSTEM (v2) — ⚠️ AUTHORITATIVE

> **This section supersedes the older "Precision Trade Premium" spec below (§2, §4, §5,
> §10–13, §20 partial), which described a since-replaced red/black/Bebas concept. The live
> build follows the system described here.**

- **Palette (CSS vars in `main.scss`):** orange `#FE5D14` (accent) · navy `#0F1437` /
  `#131944` (dark sections, hero panel, footer) · white bg · ink `#1C1C1C` (headings) ·
  body `#61657E` · peach `#FDEEE6` & grey `#F4F5F9`/`#EEF1F7` (alt sections).
- **Type:** **Poppins** (headings, 600–900) + **DM Sans** (body) — loaded via Google Fonts.
- **Buttons:** orange, radius ~5px, generous padding; `.btn--arrow` adds a round arrow chip.
- **Container:** `--container: 1440px`.
- **Section order (index.html):** Header → Hero (navy panel + roofer photo, rotated
  "Roof Repairs" text) → 3 Feature cards → About (45+-years badge, photo collage) → navy
  Stats+Appointment slab → value props → Projects carousel (Swiper) → Testimonials (Swiper)
  → Why-Us (team-style cards) → FAQ (accordion + FAQ stamp) → Blog/Tips → "Need a Roof
  Repair?" CTA band → Footer (services / quick links / recent-work grid / phone bar).
- **CSS:** a single self-contained `assets/scss/main.scss` (fresh v2 — no longer imports the
  old 7-1 partials, which remain on disk but unused). Still compiled via the same
  `npm run build` pipeline to `style.min.css`.
- **JS:** self-contained `js/main.js` (sticky header, mobile drawer, accordion, counters,
  Swiper sliders, reveals, back-to-top, form demo) → `bundle.min.js`. Vendor: Swiper only.
- **Content rule:** High Roofing is **owner-operated by Jacob** — the team-style section is
  presented as trust-pillar cards, and the blog as roofing tips; testimonials/ratings stay
  **labelled placeholders**. No invented staff or prices.

---

## 1. Content & Facts (authoritative)

### Verified business facts (use exactly)

| Field            | Value                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Brand            | High Roofing                                                          |
| Owner / face     | Jacob Kikkert                                                         |
| Positioning      | "Roof Repair Specialist" — tile & metal roof leak repairs             |
| Phone / SMS      | `0410 615 900`  (tel: `+61410615900`)                                 |
| Address          | 53 Perrin Ave, Plumpton NSW 2761                                      |
| ABN              | 26 329 944 375                                                        |
| Licence          | NSW Fair Trading Contractor Licence **#105360C** (Roof Tiler, Roof Plumber) |
| Cert             | Qualified Supervisor Certificate **#2702S** (valid to 20/04/2027)     |
| Experience       | Roofing since **1981**; specialising in leak repairs since **2007**   |
| Service areas    | West Sydney — Blacktown, Mount Druitt, St Marys, Rooty Hill, Plumpton & surrounds |
| Socials          | Facebook `@highroofingsydney`; Google & Yotpo reviews                 |

### Hero / positioning copy (reuse, lightly polished)

- **Headline idea:** "Is your roof leaking? High Roofing can fix it." / "Your West Sydney
  roof repair specialist."
- **Support:** Licensed, insured and hands-on — Jacob has been on Sydney roofs since 1981
  and repairing tile & metal roof leaks since 2007. Free inspections, honest advice, and
  the job done right the first time.

### Services (derive cards from these — real service list)

1. **Roof Leak Repairs** — tile & metal roof leak detection and repair.
2. **Roof Repairs** — general tile and metal roof repairs.
3. **Valley Iron Replacement** — replace corroded/failed valley irons.
4. **Ridge Capping / Ridging** — re-bed & re-point ridge capping.
5. **Lead & Iron Flashings** — chimney, wall and penetration flashings.
6. **Broken Tile Supply & Fit** — source and replace cracked/broken tiles.
7. **Roof Replacement & New Roofs** — full tile/metal replacements & installs.
8. **Gutter Installation** — new gutters & downpipes.
9. **Roof Maintenance** — scheduled upkeep to prevent leaks.
10. **Free Roof Inspections** — no-obligation inspection & quote.

> Feature the 6 strongest as the primary services grid; the rest as a secondary row.

### Why hire High Roofing (trust pillars)

- **Fully licensed & insured** (licence #105360C) — not an unlicensed handyman.
- **40+ years on the tools** — experience since 1981.
- **Specialist, not generalist** — focused on finding & fixing leaks.
- **Free inspections & honest quotes** — no pressure, no hidden costs.
- **Done right the first time** — meticulous, warranty-backed workmanship.
- **Local & owner-operated** — you deal with Jacob directly.

### Process (implied)

Inspect (free) → Diagnose & Quote → Repair → Leak-free guarantee.

### FAQ (real facts)

- Free roof inspections & quotes offered.
- Minor repairs usually completed in **one day**; larger projects **3–5 days**.
- Services across West Sydney.
- Fully licensed (#105360C) and insured.

### Asset manifest (`assets/img/**`)

| Local                                    | Notes                                                     |
| ---------------------------------------- | --------------------------------------------------------- |
| `about/jacob-banner.jpg`                 | Real — Jacob Kikkert banner                               |
| `gallery/real-valley.jpg`                | Real — valley-iron project photo                          |
| `hero/*`, `services/*`, `gallery/*`, `backgrounds/*` | Roofing/home stock — **placeholders**         |

### Imagery rules

1. **Real first.** Use the real Jacob photo (About/founder) and the real valley-iron shot
   (a genuine repair) where they fit.
2. **Placeholders labelled.** Hero/service/gallery images are high-quality roofing/home
   **stock placeholders**. Each carries an HTML comment
   `<!-- PLACEHOLDER: replace with Jacob's real job photo -->`. Never imply a stock home is a
   specific High Roofing job in the copy.
3. **One image per slot** where possible; keep each section's imagery distinct.
4. Descriptive, contextual `alt` on every meaningful image.

### Placeholder rules (reviews / stats)

Real Google/Yotpo reviews exist but their text wasn't captured — testimonials shown are
**labelled placeholders** (`data-placeholder="true"` + comment). Stats (jobs, years) use
the real "since 1981 / since 2007" facts; any invented figure is labelled. Safe: ABN
`26 329 944 375`, licence `#105360C` are **real** — present them as such.

---

## 2. Design Philosophy — "Precision Trade Premium"

> **Confident · Engineered · Trustworthy · Clean · Premium.**

- **Cool, engineered palette.** Slate charcoal, steel greys and clean mist surfaces with a
  single confident **cobalt-blue** accent — reads licensed, professional and precise
  (fitting for metal & tile roofing), deliberately unlike the original's clashing colours.
- **Editorial confidence.** Large Sora display headings; calm Manrope body; generous
  whitespace; strong grid with the occasional bold, full-bleed dark feature band.
- **Credibility front-and-centre.** Licence number, ABN, "since 1981", free inspection and
  tap-to-call are never far from view — trust is the product.
- **Depth through structure, not clutter.** Crisp hairlines, soft cool shadows, rounded
  media frames, subtle grid/blueprint texture on dark bands.
- **Motion is a quiet signature.** Scroll reveals, rolling counters, hover zoom on photos,
  a before/after or gallery slider — smooth, restrained, reduced-motion aware.
- **Mobile is the default.** Design the small screen first.

---

## 3. UX Principles (AU homeowner with a leak)

1. **Persistent call/SMS.** Header tap-to-call + "Free Inspection" always visible; mobile
   bottom action bar (Call / SMS or Quote).
2. **Answer the panic fast.** "Roof leaking? We can fix it" + free inspection above the fold.
3. **Prove legitimacy early.** Licence #105360C, insured, 40+ years, owner-operated.
4. **Short enquiry form** (name, phone, suburb, service, message).
5. **Service clarity** — every service scannable.
6. **Local West-Sydney** tone; real suburbs; every section ends in a next step.

---

## 4. Colour Palette (bespoke — cool premium)

CSS custom properties in `assets/scss/abstracts/_variables.scss`. **Tokens only — never
hard-code a hex in a component.**

### Neutrals (cool)

| Token           | HEX       | Use                                        |
| --------------- | --------- | ------------------------------------------ |
| `--c-white`     | `#FFFFFF` | Cards, elevated surfaces                    |
| `--c-mist`      | `#F5F7FA` | Default page background                      |
| `--c-cloud`     | `#EDF1F6` | Alt section / nested surfaces               |
| `--c-steel-100` | `#E4E8EF` | Warm-cool borders                           |
| `--c-ink`       | `#12161C` | **Headings**, strongest text                |
| `--c-body`      | `#495260` | **Body text**                               |
| `--c-body-2`    | `#69727F` | Secondary body                              |
| `--c-muted`     | `#8A94A1` | Meta, captions, placeholders                |
| `--c-border`    | `#E2E7EE` | Hairline borders & dividers                 |

### Slate (dark feature sections / footer)

| Token           | HEX       | Use                                             |
| --------------- | --------- | ----------------------------------------------- |
| `--c-slate-900` | `#0E1218` | Deepest dark                                    |
| `--c-slate`     | `#151B24` | **Dark section background**                     |
| `--c-slate-700` | `#1F2733` | Dark cards, hovered dark surfaces               |
| `--c-slate-600` | `#2C3644` | Borders/dividers on dark                        |

### Accent — Cobalt blue (primary) + azure highlight

| Token            | HEX       | Use                                          |
| ---------------- | --------- | -------------------------------------------- |
| `--c-blue`       | `#1F5FD6` | **Primary accent** — CTAs, active, links     |
| `--c-blue-600`   | `#1A4FB4` | Blue hover / pressed; blue text on light (AA)|
| `--c-blue-soft`  | `#E5EDFC` | Soft blue chips / icon backgrounds           |
| `--c-azure`      | `#4D8DF7` | Bright highlight — glows, on-dark accents     |
| `--c-glow`       | `rgba(31,95,214,.24)` | Focus ring + button glow          |

### Functional aliases

```scss
--bg:        var(--c-mist);
--bg-white:  var(--c-white);
--bg-alt:    var(--c-cloud);
--bg-dark:   var(--c-slate);
--text:      var(--c-body);
--heading:   var(--c-ink);
--muted:     var(--c-muted);
--line:      var(--c-border);
--accent:    var(--c-blue);
--action:    var(--c-blue);   // primary button = cobalt, white text
```

**Contrast rule:** WCAG AA. `--c-body`/`--c-body-2` on mist/white pass AA. On slate use
`--c-white` / `rgba(255,255,255,.72)`. **Blue `#1F5FD6` takes white text** (passes AA). For
blue *text* on light use `--c-blue-600`. Azure is a graphic/glow colour and for on-dark
accents only.

---

## 5. Typography System (bespoke)

- **Display / headings:** **"Sora"** — a modern geometric grotesk with engineered,
  confident character; weights **600, 700, 800**. Self-hosted (`assets/fonts`).
- **Body & UI:** **"Manrope"** — clean, slightly rounded, highly legible; weights
  **400, 500, 600, 700**. Self-hosted.
- **Fallbacks:**
  ```scss
  --font-display: "Sora", "Manrope", system-ui, -apple-system, Arial, sans-serif;
  --font-body:    "Manrope", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  ```
- Always `font-display: swap`; `preconnect`; `preload` hero H1 face + hero image.

### Type scale (fluid `clamp()`)

| Token          | Size (clamp)                     | Element                 | Family  | Weight | Line-height | Tracking |
| -------------- | -------------------------------- | ----------------------- | ------- | ------ | ----------- | -------- |
| `--fs-display` | `clamp(2.75rem, 6vw, 5rem)`      | Hero H1                 | display | 800    | 1.03        | -0.02em  |
| `--fs-h1`      | `clamp(2.25rem, 4.4vw, 3.4rem)`  | Big section H2          | display | 700    | 1.08        | -0.015em |
| `--fs-h2`      | `clamp(1.9rem, 3.2vw, 2.6rem)`   | Section H2              | display | 700    | 1.14        | -0.01em  |
| `--fs-h3`      | `clamp(1.35rem, 2vw, 1.7rem)`    | Card / sub heading      | display | 600    | 1.2         | normal   |
| `--fs-h4`      | `1.2rem`                         | Minor heading           | display | 600    | 1.3         | normal   |
| `--fs-lead`    | `clamp(1.05rem, 1.4vw, 1.28rem)` | Intro / lead paragraph  | body    | 400    | 1.6         | normal   |
| `--fs-body`    | `1rem`                           | Body                    | body    | 400    | 1.7         | normal   |
| `--fs-sm`      | `0.9375rem`                      | Secondary text          | body    | 400    | 1.6         | normal   |
| `--fs-xs`      | `0.8125rem`                      | Captions, meta          | body    | 500    | 1.5         | normal   |
| `--fs-eyebrow` | `0.8125rem`                      | Eyebrow (letter-spaced) | body    | 700    | 1.4         | 0.18em   |

**Heading rules:** Sora for H1–H4 & big numbers only. Eyebrows uppercase, letter-spaced,
blue, with a small section-relevant icon chip. Body ≤ 68ch.

---

## 6. Spacing System

8px base scale as tokens; pick the nearest step.

```scss
--sp-1:.25rem; --sp-2:.5rem; --sp-3:.75rem; --sp-4:1rem; --sp-5:1.5rem;
--sp-6:2rem;   --sp-7:3rem;  --sp-8:4rem;   --sp-9:6rem;  --sp-10:8rem;
```

- `--section-y`: `clamp(4.5rem, 9vw, 8rem)`.
- `--container`: `1240px`; `--container-wide`: `1440px`; `--gutter`: `clamp(1.25rem,4vw,2.5rem)`.

---

## 7. Border Radius

```scss
--r-xs:6px; --r-sm:10px; --r-md:16px; --r-lg:24px; --r-xl:36px; --r-pill:999px;
```

Media frames `--r-lg`/`--r-xl`; controls `--r-sm`/`--r-pill`.

---

## 8. Shadow & Elevation (cool-tinted, restrained)

```scss
--shadow-xs: 0 1px 2px rgba(18, 22, 28, 0.06);
--shadow-sm: 0 4px 12px rgba(18, 22, 28, 0.07);
--shadow-md: 0 12px 30px rgba(18, 22, 28, 0.10);
--shadow-lg: 0 24px 60px rgba(18, 22, 28, 0.16);
--shadow-blue: 0 12px 26px rgba(31, 95, 214, 0.30);
--ring: 0 0 0 3px var(--c-glow);
```

At most one meaningful shadow per element; cards lift `sm`→`md` on hover.

---

## 9. Responsive Breakpoints (mobile-first, min-width)

```scss
$bp: (xs:360px, sm:480px, md:768px, lg:1024px, xl:1280px, xxl:1536px);
```

Test at 360, 390, 768, 1024, 1280, 1536.

---

## 10. SCSS Architecture (7-1)

Source `assets/scss/`, compiled `assets/css/`. Entry `main.scss` uses `@use`.

```
abstracts/  _variables _breakpoints _functions _mixins _index
base/       _reset _fonts _typography _global _utilities
components/ _section _buttons _eyebrow _badges _cards _counter _forms _marquee _accordion _modal
layout/     _container _header _mobilebar _footer
sections/   _hero _trustbar _about _services _whyus _process _stats _gallery _testimonials _serviceareas _faq _cta
vendor/     _swiper _fancybox
main.scss
```

- BEM-lite classes; flat specificity (≤ 2 nesting); tokens only; `.u-` utilities; `.js-`/`data-*` for JS.

---

## 11. Component / Section Structure (top → bottom)

1. **Header** — wordmark logo, nav, licence chip, tap-to-call, "Free Inspection" button;
   condenses on scroll; hamburger → drawer on mobile.
2. **Hero** — eyebrow, big headline ("Roof leaking? We'll fix it."), sub-copy, dual CTA
   (Free Inspection + Call), trust chips (Licensed #105360C · Insured · Since 1981); large
   roofing/home photo with a floating "licensed" / experience card.
3. **Trust strip** — marquee of trust signals (Licensed & Insured · Tile & Metal · Free
   Inspections · West Sydney · 40+ yrs · Owner-operated).
4. **About** — Jacob's real photo + story (1981 → 2007), credentials, signature.
5. **Services** — 6-card grid + secondary row.
6. **Why Us** — 6 trust pillars with blue icon chips.
7. **Process** — 4 numbered steps (Inspect → Diagnose → Repair → Guarantee).
8. **Stats** — rolling counters (years since 1981, years specialising, suburbs, jobs).
   *(Derived/placeholder numbers labelled.)*
9. **Gallery** — Swiper carousel (real valley photo + placeholder job photos); Fancybox.
10. **Testimonials** — clean static grid of reviews. *(Placeholder — labelled.)*
11. **Service Areas** — West Sydney suburbs + coverage note.
12. **FAQ** — accordion (real answers).
13. **CTA band** — dark, "Roof leaking? Get a free inspection" + phone/SMS.
14. **Footer** — wordmark, contact, licence/ABN, quick links (mobile accordion), services,
    areas, hours, socials, legal + "Made by capsuleDIGITAL".
15. **Quote/Enquiry modal** — Fancybox form.
16. **Mobile action bar** — fixed Call / Free Quote.

---

## 12. Animation Guidelines (GSAP + ScrollTrigger)

- Section reveals: fade + 24px rise, `power3.out`, ~0.7s, stagger ~0.08s.
- Hero: headline line mask-reveal on load; media parallax.
- Counters roll 0→target in view (~1.6s).
- Images: slow zoom on hover; clip reveal on scroll-in.
- Respect `prefers-reduced-motion`; prefer `transform`/`opacity`; page readable JS-off.

---

## 13. Third-Party Libraries

GSAP + ScrollTrigger (reveals/counters/parallax), Swiper (gallery), Fancybox (lightbox +
modal). Load vendor JS deferred; guard every init; vendor CSS overrides in `scss/vendor/`.

---

## 14. JavaScript Architecture (ES6+)

Modules in `js/`, bundled to `assets/js/bundle.min.js` (esbuild).

```
js/main.js
js/modules/  header nav-drawer animations counters sliders lightbox quote-modal forms accordion footer-accordion magnetic smooth-scroll
js/utils/    dom prefers-motion
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

AA contrast (blue is a surface, not light-mode text); visible focus (`--ring`); full
keyboard for drawer/modal/accordion/sliders (Esc closes, focus trap + restore); labelled
form fields + `aria-describedby` errors; skip link; descriptive links.

---

## 17. Performance Checklist

Ship minified `style.min.css` + `bundle.min.js`; `webp` + compressed `jpg` with width/height
to avoid CLS; hero eager + `fetchpriority=high`, rest `loading=lazy`; preconnect/preload
fonts+hero; defer JS; `content-visibility:auto` on long lower sections; Lighthouse ≥ 90;
SEO: title, meta, OG/Twitter, `RoofingContractor` JSON-LD (real NAP + licence), canonical,
favicon.

---

## 18. Node.js SCSS Workflow

```jsonc
"scripts": {
  "dev":           "npm-run-all --parallel watch:css watch:js serve",
  "serve":         "live-server --port=5174 --no-browser --entry-file=index.html",
  "watch:css":     "sass assets/scss/main.scss:assets/css/style.css --style=expanded --source-map --watch",
  "build:css:dev": "sass assets/scss/main.scss:assets/css/style.css --style=expanded --source-map",
  "prefix:css":    "postcss assets/css/style.css --use autoprefixer --replace --no-map",
  "build:css:min": "postcss assets/css/style.css --use cssnano --no-map --output assets/css/style.min.css",
  "watch:js":      "esbuild js/main.js --bundle --format=iife --sourcemap --outfile=assets/js/bundle.js --watch",
  "build:js":      "esbuild js/main.js --bundle --format=iife --minify --outfile=assets/js/bundle.min.js",
  "images":        "node scripts/optimize-images.mjs",
  "build":         "npm-run-all build:css:dev prefix:css build:css:min build:js"
}
```

Dev deps: `sass, postcss, postcss-cli, autoprefixer, cssnano, esbuild, npm-run-all,
live-server, sharp`. `index.html` links the **minified** CSS/JS. Never hand-edit compiled
output. Cache-bust the CSS/JS links (`?v=x.y.z`) when iterating.

## 19. CSS Minification Process

`sass` → `style.css` → `postcss autoprefixer` (in place) → `postcss cssnano` →
`style.min.css`. HTML references the minified file.

---

## 20. Folder Structure

```
high-roofing/
├── index.html  CLAUDE.md  README.md  package.json  package-lock.json
├── .browserslistrc  .gitignore  postcss.config.cjs
├── js/ (main.js + modules/ + utils/)
└── assets/
    ├── css/  scss/  js/  fonts/  vendor/
    └── img/{hero,services,gallery,about,icons,backgrounds,logo,favicon}
```

Root stays clean: only the essential files, `js/`, and `assets/`.

---

## 21. Definition of Done (this phase)

- [ ] `CLAUDE.md` complete (this file).
- [ ] Node build works (`npm run build` → minified CSS + JS).
- [ ] Premium, responsive `index.html` built to every rule, with real High Roofing facts.
- [ ] Real Jacob + valley photos used; stock imagery labelled placeholder.
- [ ] GSAP / Swiper / Fancybox working; accessible; AA contrast; 0 console errors.
- [ ] Responsive at 360 / 768 / 1024 / 1280 / 1536.

---

### Git / workflow note

All work goes to the **`feature/theme-clining`** branch. **Never push or merge to `main`.**
**Only build inside `high-roofing/` — never touch any other project.**
