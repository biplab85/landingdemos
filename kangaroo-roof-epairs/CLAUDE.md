# Kangaroo Roof Repairs — Design & Development Guidelines

> The single source of truth for the **Kangaroo Roof Repairs and Construction Pty Ltd**
> website. Read this before writing any markup, style, or script. Every visual and code
> decision should trace back to a rule in this document. If something here is wrong or
> missing, **update this file first**, then the code.

---

## 0. The Source — read this first

All **content and assets** come from the live **Kangaroo Roof Repairs** site
(**https://kangarooroofrepairs.com.au/**): the logo, real project photos, all copy,
services, contact details and service areas.

**In one line:** build the **Kangaroo Roof Repairs** business (its logo, photos, words)
inside a **significantly more modern, premium redesign** — write our own
markup/styles/scripts to a warm-neutral, editorial, high-trust design language.

**Scope of this phase:** the **`index.html` page only.** Architect tokens, components and
partials so extra pages (About, Services, Contact) drop in later with **zero refactoring**.

---

## 1. Content & Asset Source — kangarooroofrepairs.com.au

All **real content and imagery comes from the live Kangaroo site**. Download assets into
`assets/img/**` and reference them locally (never hot-link the WordPress URLs in prod).

### Verified business facts (authoritative — use exactly)

| Field           | Value                                                              |
| --------------- | ----------------------------------------------------------------- |
| Legal name      | Kangaroo Roof Repairs and Construction Pty Ltd                    |
| Short name      | Kangaroo Roof Repairs                                             |
| Phone           | `0470 208 455`  (tel: `+61470208455`)                             |
| Email           | `contact@kangarooroofrepairs.com.au`                             |
| Address         | 75 Railway Road, Quakers Hill NSW 2763                            |
| Positioning     | "Sydney's leading roof repairs and maintenance company"          |
| Socials         | Facebook, Twitter/X, YouTube, Instagram                          |

### Verbatim copy to reuse (lightly polished, meaning preserved)

- **Tagline / hero:** "Safeguarding your home's most crucial defence. Expert roof repairs
  and restoration for lasting peace of mind."
- **Hero sub:** "A strong and well-maintained roof is crucial to the integrity and
  longevity of your property, and we are here to ensure just that."
- **Intro:** "At Kangaroo Roof Repairs and Construction Pty Ltd, we take pride in
  safeguarding your home with our top-notch roofing services. With years of experience in
  the industry, we offer a comprehensive range of roofing services to cater to all your
  needs. All household repairs and maintenance up to your satisfaction is guaranteed."
- **Services intro:** "Sydney's leading roof repairs and maintenance company, specialised
  in all types of roof — tile and/or metal roof repairs, maintenance, high-pressure
  cleaning, painting, roof leakage repairs/damage, re-pointing and broken tile
  replacements. Our highly skilled team is customer-focused; customer satisfaction with
  quality workmanship and quality materials is our top priority."

### Services (derive cards from these)

1. **Roof Restoration** — residential tile roof restoration (various colours).
2. **Tile Roof Repairs** — cracked/broken tile replacement & repairs.
3. **Metal Roof Repairs** — repairs & maintenance for metal/Colorbond roofs.
4. **Re-pointing & Re-bedding** — ridge capping re-point/re-bed.
5. **Roof Leak Repairs** — leak detection & storm/damage repair.
6. **High-Pressure Cleaning** — moss/lichen wash & surface prep.
7. **Roof Painting** — premium **Dulux** protective coatings.
8. **Maintenance & Inspections** — scheduled upkeep & reports.

> Show the 6 strongest as the primary services grid; the rest can live in a "more" row.

### Why Choose Us (6 — real copy, condense for cards)

1. **Expert Advice** — thorough full-roof inspection to assess damage and recommend the
   right solution: cleaning, repairs, re-pointing and protective coatings.
2. **Flexible Schedule** — appointment times that suit you: early mornings, evenings or
   weekends.
3. **Workmanship Quality** — meticulous attention to detail with top-grade **Dulux**
   premium materials for durable, long-lasting, great-looking results.
4. **Affordable Cost** — competitive, transparent, upfront pricing with no hidden costs.
5. **Quality Professionals** — a highly skilled, experienced team with a strong work
   ethic and commitment to excellence.
6. **Customer Satisfaction** — exceptional service from first consult to final inspection;
   clear communication and long-term relationships.

### Process (4 steps — implied by copy)

Inspect → Free Quote → Repair/Restore → Guarantee.

### Service areas (real — council regions + suburbs)

- **The Hills Shire** — Annangrove, Baulkham Hills, Beaumont Hills, Bella Vista, Castle
  Hill, Dural, Glenhaven, Glenorie, Kellyville, Kenthurst, North Kellyville, North Rocks,
  Norwest, Rouse Hill, West Pennant Hills, Winston Hills.
- **Hornsby** — Asquith, Berowra, Brooklyn, Cowan, Dural, Galston, Hornsby, Hornsby
  Heights, Mount Colah, Mount Kuring-gai, Normanhurst, Pennant Hills, Thornleigh,
  Wahroonga, Waitara, Westleigh.
- **Willoughby City** — Artarmon, Castle Cove, Castlecrag, Chatswood, Chatswood West,
  Middle Cove, Naremburn, Northbridge, North Willoughby, Roseville, St Leonards,
  Willoughby, Willoughby East.

### Quote form fields (match the live form)

Name*, Email*, Phone*, "How did you hear about us?" (Google Reviews / Referred by a friend
/ Social Media), Subject*, Comment or Message*. Submit → "Send Request". Note required
fields. (Static demo — no backend; JS validates client-side.)

### Asset manifest — download from live site → save locally

| Local path                              | Source URL (kangarooroofrepairs.com.au)                                        |
| --------------------------------------- | ------------------------------------------------------------------------------ |
| `assets/img/logo/logo.png`              | `/wp-content/uploads/2024/12/cropped-cropped-logo-1-1-1.png`                    |
| `assets/img/logo/logo-footer.png`       | `/wp-content/uploads/2024/12/logo-2.png`                                        |
| `assets/img/hero/roofing-residential.jpg` | `/wp-content/uploads/2020/08/roofing-service-residential.jpg`                 |
| `assets/img/gallery/project-01…24.jpg`  | `/wp-content/uploads/2025/01/IMG_*-scaled.jpeg` + `/2024/12/IMG_*-scaled.jpeg`  |

Real project photos available (rename sequentially into `gallery/`, pick the best for
`hero/`, `about/`, `services/`):
`IMG_2127, 2129, 2130, 2666, 2667, 2668, 4322, 5989-1, 0512, 4799-1, 4800-1, 4817-1,
4832-2, 4833-1, 4834-3, 4855-2, 4848-1, 1366, 5252-1, 8509, 4147, 5888-1, 5884, 5252,
7139, Photo4-1` and the `20F8B0EB…`, `FC17ADE3…` files — all `*-scaled.jpeg`.

> **Logo note:** the Kangaroo logo art dictates the brand mark. Sample its actual colours
> when finalising accents; the warm-neutral palette below may be nudged to sit well beside
> the real logo.

### Imagery rules (mandatory)

1. **Project-related only.** Every photo on the page must be a **real Kangaroo Roof
   Repairs project image** from the live site's asset library. No generic stock, no
   unrelated imagery, no AI filler.
2. **No image reused across sections.** Each downloaded photo is used **once** — a given
   file appears in exactly one place (one hero, one about slot, one service card, one
   gallery tile, etc.). Never repeat the same image in two different sections or twice in
   the same grid. There are ~30 real photos — plenty to give every slot a unique image.
3. **Right photo, right slot.** Match the image to its context (e.g. a restored tile roof
   for "Roof Restoration", a ridge-capping shot for "Re-pointing"). Give each a
   descriptive, contextual `alt`.
4. **Rename on download** to sequential, meaningful names per folder (e.g.
   `gallery/project-01.jpg`, `about/about-collage-01.jpg`) so usage stays traceable and
   duplication is obvious at a glance.

### Placeholder rules (only where the live site has nothing)

The live site has **no written reviews, no team bios, no stats**. Anything we add there is
a **labelled placeholder**: `data-placeholder="true"` + a
`<!-- PLACEHOLDER: replace with real … -->` comment. Never present placeholder
testimonials, licence numbers or ratings as verified. Safe placeholders: ABN
`00 000 000 000`, licence `NSW-000000`.

---

## 2. Design Philosophy

> **Warm-neutral · Editorial · Confident · Premium · Calm.**

The design language is a warm, editorial, high-trust roofing aesthetic. Its signature:

- **Warm-neutral canvas.** Cream/off-white backgrounds (`#F4F4EB`), warm near-black text
  (`#171714`), and a single **amber accent** (`#FFA12E`) used decisively for CTAs, badges
  and highlights. No cold corporate blue.
- **Big, tight display headings** (Plus Jakarta Sans, 700) over calm grey body (Inter);
  large sizes, generous whitespace, confident section rhythm (~80–100px vertical gaps).
- **Editorial layout.** Two-column hero (headline + imagery), a client/trust strip, a
  benefits-and-stats block, a clean 6-card services grid, a numbered "how it works"
  experience block, testimonial cards with stars, a strong dark CTA band, and an FAQ
  accordion — then footer.
- **Rounded, photographic cards** with soft shadows; icons in soft amber/cream chips.
- **Depth through warmth, not gloss.** Soft warm shadows, hairline borders, rounded media.
- **Motion is a subtle signature.** Scroll reveals, rolling stat counters, hover zoom on
  photos, magnetic buttons — smooth, never flashy. Respect reduced-motion.
- **Mobile is the default.** Design small first; desktop is the roomier version.

We aim for sharp spacing, rich imagery framing and refined micro-interactions — a
*significantly premium* execution.

---

## 3. UX Principles (AU homeowner's checklist)

1. **Persistent quote/call.** Header "Get a Free Quote" + tap-to-call always visible; a
   mobile app-style bottom action bar (Call / Quote).
2. **Trust early.** Experience counter, "roofs protected", licensed & insured, Dulux
   materials, guaranteed workmanship — above or just below the fold.
3. **Free-quote hook** repeated calmly through the page (hero, mid-page band, final CTA).
4. **Short quote form** (name, email, phone, source, subject, message) — low friction.
5. **Service transparency.** All services visible and understandable at a glance.
6. **Local & established** tone; real suburb coverage; every section resolves to a next
   step; no dead ends.

---

## 4. Colour Palette — warm neutral + amber

All colours are CSS custom properties in `assets/scss/abstracts/_variables.scss`. **Use
tokens — never hard-code a hex in a component.**

### Core neutrals (warm)

| Token           | HEX       | Use                                        |
| --------------- | --------- | ------------------------------------------ |
| `--c-white`     | `#FFFFFF` | Cards, elevated surfaces                    |
| `--c-cream`     | `#F4F4EB` | **Default warm page background**             |
| `--c-cream-200` | `#EDEDE2` | Alt cream / nested warm surface             |
| `--c-sand`      | `#E7E4D8` | Warm border on cream / soft chips           |
| `--c-ink`       | `#171714` | **Headings**, strongest text                |
| `--c-body`      | `#434338` | **Body text** — warm grey                   |
| `--c-body-2`    | `#606057` | Secondary body / captions                   |
| `--c-muted`     | `#8C8C82` | Meta, placeholders                          |
| `--c-border`    | `#E2E0D5` | Hairline borders & dividers                 |

### Dark (feature sections / CTA / footer)

| Token          | HEX       | Use                                             |
| -------------- | --------- | ----------------------------------------------- |
| `--c-dark-900` | `#141412` | Deepest dark                                    |
| `--c-dark`     | `#1D1D1A` | **Dark section background** (CTA/footer/showcase)|
| `--c-dark-700` | `#28292A` | Dark cards, hovered dark surfaces               |
| `--c-dark-600` | `#3A3A34` | Borders/dividers on dark                        |

### Accent — Kangaroo Orange (primary, from logo) + Amber (secondary)

The **brand mark is a black kangaroo on a vivid orange disc** (`≈#EE4E1E`). The primary
accent is that **brand orange** for full logo cohesion; **amber** is the warm
secondary highlight. Together: a punchy orange CTA over a calm cream canvas.

| Token             | HEX       | Use                                          |
| ----------------- | --------- | -------------------------------------------- |
| `--c-brand`       | `#EE4E1E` | **Primary accent** — CTAs, active, links (logo orange) |
| `--c-brand-600`   | `#D23F14` | Brand hover / pressed; brand text on light (AA) |
| `--c-brand-soft`  | `#FBE0D3` | Soft brand chips / icon backgrounds          |
| `--c-amber`       | `#FFA12E` | **Secondary** highlight — stars, small accents, glows |
| `--c-amber-soft`  | `#FBE4C4` | Soft amber chips                             |
| `--c-glow`        | `rgba(238,78,30,.26)` | Focus ring + button glow            |

### Functional aliases

```scss
--bg:        var(--c-cream);   // default page background
--bg-white:  var(--c-white);
--bg-alt:    var(--c-cream-200);
--bg-dark:   var(--c-dark);
--text:      var(--c-body);
--heading:   var(--c-ink);
--muted:     var(--c-muted);
--line:      var(--c-border);
--accent:    var(--c-brand);
--action:    var(--c-brand);   // primary button = brand orange, white text
```

**Contrast rule:** WCAG AA. `--c-body`/`--c-body-2` on cream/white pass AA. On dark use
`--c-white` / `rgba(255,255,255,.72)`. **Brand orange `#EE4E1E` takes white text** on its
button surface (passes AA). For brand-coloured *text* on a light background use
`--c-brand-600`. **Amber `#FFA12E` is a surface/graphic colour, not light-mode text** —
use it for stars, glows, chips and on dark backgrounds only.

---

## 5. Typography System

- **Display / headings:** **"Plus Jakarta Sans"** — modern
  geometric sans; weights **600, 700, 800**. Self-hosted from `assets/fonts` (woff2) with
  Google Fonts fallback.
- **Body & UI:** **"Inter"** — weights **400, 500, 600**.
- **Fallbacks:**
  ```scss
  --font-display: "Plus Jakarta Sans", "Inter", system-ui, -apple-system, Arial, sans-serif;
  --font-body:    "Inter", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  ```
- Always `font-display: swap`; `preconnect` to any font origin; `preload` the hero H1 face.

### Type scale (fluid `clamp()`, mobile → desktop)

| Token          | Size (clamp)                     | Element                 | Family  | Weight | Line-height | Tracking |
| -------------- | -------------------------------- | ----------------------- | ------- | ------ | ----------- | -------- |
| `--fs-display` | `clamp(2.75rem, 6vw, 5rem)`      | Hero H1                 | display | 800    | 1.03        | -0.02em  |
| `--fs-h1`      | `clamp(2.25rem, 4.4vw, 3.4rem)`  | Big section H2          | display | 700    | 1.08        | -0.015em |
| `--fs-h2`      | `clamp(1.9rem, 3.2vw, 2.6rem)`   | Section H2              | display | 700    | 1.14        | -0.01em  |
| `--fs-h3`      | `clamp(1.35rem, 2vw, 1.7rem)`    | Card / sub heading      | display | 600    | 1.2         | normal   |
| `--fs-h4`      | `1.2rem`                         | Minor heading           | display | 600    | 1.3         | normal   |
| `--fs-lead`    | `clamp(1.05rem, 1.4vw, 1.28rem)` | Intro / lead paragraph  | body    | 400    | 1.6         | normal   |
| `--fs-body`    | `1rem` (16px base)               | Body                    | body    | 400    | 1.7         | normal   |
| `--fs-sm`      | `0.9375rem`                      | Secondary text          | body    | 400    | 1.6         | normal   |
| `--fs-xs`      | `0.8125rem`                      | Captions, meta          | body    | 500    | 1.5         | normal   |
| `--fs-eyebrow` | `0.8125rem`                      | Eyebrow (letter-spaced) | body    | 600    | 1.4         | 0.22em   |

**Heading rules**

- Display face for H1–H4 and big stat numbers only. Never for long body copy.
- Eyebrows: uppercase, letter-spaced, **amber (`--c-amber-600`)**, preceded by a short tick/rule.
- Body copy caps at ~68ch line length.

---

## 6. Spacing System

An **8px base scale** exposed as tokens. Never invent one-off margins — pick the nearest step.

```scss
--sp-1: 0.25rem;  //  4px
--sp-2: 0.5rem;   //  8px
--sp-3: 0.75rem;  // 12px
--sp-4: 1rem;     // 16px
--sp-5: 1.5rem;   // 24px
--sp-6: 2rem;     // 32px
--sp-7: 3rem;     // 48px
--sp-8: 4rem;     // 64px
--sp-9: 6rem;     // 96px
--sp-10: 8rem;    // 128px
```

**Section rhythm**

- `--section-y`: `clamp(4.5rem, 9vw, 8rem)` vertical padding per section.
- `--container`: `1240px` max content width; `--container-wide`: `1440px` for image bands.
- `--gutter`: `clamp(1.25rem, 4vw, 2.5rem)` side padding.

---

## 7. Border Radius

```scss
--r-xs:   6px;    // chips, small controls
--r-sm:   10px;   // buttons, inputs
--r-md:   16px;   // cards
--r-lg:   24px;   // media frames, large cards
--r-xl:   36px;   // hero media, feature panels
--r-pill: 999px;  // pills, avatars, icon buttons
```

Media frames use `--r-lg`/`--r-xl`; interactive controls use `--r-sm`/`--r-pill`.

---

## 8. Shadow & Elevation System

Warm-tinted, soft, restrained. Depth mostly from whitespace and scale.

```scss
--shadow-xs: 0 1px 2px rgba(23, 23, 20, 0.06);
--shadow-sm: 0 4px 12px rgba(23, 23, 20, 0.06);
--shadow-md: 0 12px 30px rgba(23, 23, 20, 0.10);
--shadow-lg: 0 24px 60px rgba(23, 23, 20, 0.14);
--shadow-amber: 0 14px 30px rgba(255, 161, 46, 0.30);  // amber button glow on hover
--ring: 0 0 0 3px var(--c-amber-glow);                 // focus ring
```

Rules: at most one meaningful shadow per element; cards lift `--shadow-sm` → `--shadow-md`
on hover; never stack heavy shadows.

---

## 9. Responsive Breakpoints

Mobile-first. `min-width` media queries via the `respond-to()` mixin.

```scss
$bp: (
  xs:  360px,
  sm:  480px,
  md:  768px,
  lg:  1024px,
  xl:  1280px,
  xxl: 1536px,
);
```

- Base styles target ~360–480px.
- `md` (768px): tablet — two-column grids, nav still compact.
- `lg` (1024px): desktop — full nav, multi-column sections, larger type.
- `xl`/`xxl`: max container widths, roomier rhythm.

Test at 360, 390, 768, 1024, 1280, 1536.

---

## 10. SCSS Architecture (7-1 pattern)

Source in `assets/scss/`, compiled to `assets/css/`. Single entry `main.scss` uses
`@use` (no deprecated `@import`).

```
assets/scss/
├── main.scss                 # forwards/uses all partials in order
├── abstracts/
│   ├── _variables.scss       # :root tokens (colour, type, space, radius, shadow, z)
│   ├── _breakpoints.scss     # $bp map
│   ├── _functions.scss       # rem(), z(), clamp helpers
│   └── _mixins.scss          # respond-to, flex/grid helpers, focus-ring, container
├── base/
│   ├── _reset.scss           # modern reset
│   ├── _fonts.scss           # @font-face (Plus Jakarta Sans, Inter)
│   ├── _typography.scss      # base element type styles
│   ├── _global.scss          # html/body, selection, scrollbar, base bg
│   └── _utilities.scss       # .u-* helpers (visually-hidden, container, reveal)
├── components/
│   ├── _buttons.scss         # .btn variants (primary amber / ghost / outline), magnetic
│   ├── _eyebrow.scss         # eyebrow label
│   ├── _cards.scss           # service/feature cards
│   ├── _badges.scss          # trust pills, rating badge
│   ├── _counter.scss         # rolling stat counter
│   ├── _forms.scss           # inputs, selects, quote form
│   ├── _marquee.scss         # trust/logo marquee strip
│   ├── _accordion.scss       # FAQ accordion
│   └── _modal.scss           # quote modal shell
├── layout/
│   ├── _container.scss       # .container / .container--wide
│   ├── _header.scss          # sticky header + nav + drawer
│   ├── _mobilebar.scss       # mobile bottom action bar
│   └── _footer.scss          # footer
├── sections/
│   ├── _hero.scss
│   ├── _trustbar.scss
│   ├── _about.scss
│   ├── _services.scss
│   ├── _whyus.scss
│   ├── _process.scss
│   ├── _stats.scss
│   ├── _gallery.scss
│   ├── _testimonials.scss
│   ├── _serviceareas.scss
│   ├── _faq.scss
│   └── _cta.scss
└── vendor/
    ├── _swiper.scss          # Swiper style overrides
    └── _fancybox.scss        # Fancybox style overrides
```

**Conventions**

- One selector root per partial; keep specificity flat (max ~2 levels of nesting).
- Tokens only — no raw hex/px magic numbers in components (spacing tokens excepted).
- Class naming: **BEM-lite** — `.block`, `.block__element`, `.block--modifier`.
- Namespaced utilities: `.u-`. JS hooks: `.js-` or `data-*` (never style `.js-`).

---

## 11. Component / Section Structure (top → bottom)

1. **Header** — logo, nav (Home, About, Services, Why Us, Areas, Contact), phone
   (tap-to-call), amber "Get a Free Quote" button; condenses on scroll; hamburger → slide-in
   drawer on mobile.
2. **Hero** — eyebrow, big headline (the safeguarding tagline), sub-copy, dual CTA (Quote +
   Call), trust chips, rating badge; large roofing photograph with parallax + floating stat
   card. (Two-column.)
3. **Trust strip** — marquee/row of trust signals (Licensed & Insured · Dulux materials ·
   Guaranteed workmanship · 7-day availability · Local Sydney team).
4. **About** — split: image collage (real project photos) + story, credentials, guarantee.
5. **Services** — 6-card grid (icon chip, title, blurb, link) with hover lift/reveal;
   secondary row for the remaining services.
6. **Why Us** — the 6 real differentiators as feature cards/list with amber icon chips.
7. **Process** — 4 numbered steps (Inspect → Free Quote → Repair/Restore → Guarantee),
   numbered-experience style.
8. **Stats** — rolling counters (years experience, roofs protected, suburbs served,
   satisfaction %). *(Placeholder numbers — labelled.)*
9. **Gallery** — Swiper carousel of real project photos; Fancybox lightbox on click.
10. **Testimonials** — Swiper slider of reviews with star ratings + author.
    *(Placeholder reviews — labelled.)*
11. **Service Areas** — the three council regions + suburb chips + coverage note.
12. **FAQ** — accordion of common homeowner questions.
13. **CTA band** — dark, final "Need a Free Quote?" + phone + amber button.
14. **Footer** — footer logo, contact, quick links, service areas, hours, socials, legal.
15. **Quote Modal** — Fancybox-triggered form (Name, Email, Phone, Source, Subject, Message).
16. **Mobile action bar** — fixed bottom Call / Quote (mobile only).

---

## 12. Animation Guidelines (GSAP + ScrollTrigger)

- **Library:** GSAP + ScrollTrigger for scroll-reveals, counters, parallax, pinning.
- **Signatures:**
  - Section reveals: fade + 24px rise, `power3.out`, ~0.7s, staggered children ~0.08s.
  - Hero: headline word/line mask-reveal on load; media subtle parallax on scroll.
  - Counters: roll 0 → target when in view, ~1.6s ease-out.
  - Buttons: magnetic pull on cursor (desktop, `pointer: fine` only); label slide on hover.
  - Images: `scale(1.06)` slow zoom on hover; clip-path reveal on scroll-in.
- **Rules:**
  - Respect `prefers-reduced-motion` — disable transforms/scroll effects, keep opacity.
  - Prefer `transform`/`opacity`; `will-change` sparingly. No layout thrash.
  - Page must be fully readable with JS disabled. Durations 0.4–0.9s.

---

## 13. Third-Party Libraries

| Library            | Purpose                                   | Load                          |
| ------------------ | ----------------------------------------- | ----------------------------- |
| **GSAP + ScrollTrigger** | Scroll reveals, counters, parallax, magnetic | CDN (with SRI) or `assets/vendor` |
| **Swiper.js**      | Gallery + testimonials carousels          | CDN or `assets/vendor`        |
| **Fancybox** (@fancyapps/ui) | Image lightbox, video popups, quote modal | CDN or `assets/vendor`  |

- Load vendor JS **deferred**; initialise in dedicated JS modules.
- Only import the parts we use. Guard every init (`if (!el) return;`).
- Vendor CSS overrides live in `assets/scss/vendor/`.

---

## 14. JavaScript Architecture (ES6+)

Authored as ES modules in `js/`, **bundled** to `assets/js/bundle.min.js` via esbuild.

```
js/
├── main.js                   # entry: imports + init on DOMContentLoaded
├── modules/
│   ├── header.js             # sticky/condense + scrollspy
│   ├── nav-drawer.js         # mobile drawer open/close, focus trap
│   ├── animations.js         # GSAP scroll reveals + hero + parallax
│   ├── counters.js           # rolling stat counters
│   ├── sliders.js            # Swiper: gallery + testimonials
│   ├── lightbox.js           # Fancybox bindings
│   ├── quote-modal.js        # open/close quote modal
│   ├── forms.js              # client-side validation
│   ├── accordion.js          # FAQ accordion
│   ├── magnetic.js           # magnetic buttons (desktop, pointer: fine)
│   └── smooth-scroll.js      # anchor smooth-scroll with header offset
└── utils/
    ├── dom.js                # $ / $$ / on helpers
    └── prefers-motion.js     # reduced-motion guard
```

**Conventions**

- Module scope (implicit strict mode); no globals except intentional library ones.
- Every module exports an `init()` that no-ops if its target element is absent.
- Feature-detect and respect reduced-motion. No inline JS in HTML.

---

## 15. Coding Conventions

- **HTML5, semantic & accessible.** Landmarks (`header/nav/main/section/footer`), one
  `<h1>`, logical heading order, `alt` on every meaningful image, `aria-label` on icon
  buttons, `aria-expanded`/`aria-controls` on toggles.
- **No inline styles.** No duplicated CSS. Prefer reusable components/utilities.
- **Meaningful class names** (BEM-lite). `data-*` for JS state and animation hooks.
- **Progressive enhancement:** content and core CTAs work with CSS/JS disabled.
- **Formatting:** 2-space indent; Prettier defaults; kebab-case files; lowercase HTML
  attributes; double-quoted attributes.
- **Comments:** brief section banners in HTML/SCSS; explain *why*, not *what*.

---

## 16. Accessibility Standards (WCAG 2.1 AA)

- Colour contrast AA for text and UI (see §4 — amber is a surface, not light-mode text).
- Visible, non-default focus states (`--ring`) on every interactive element.
- Full keyboard operability: drawer, modal, accordion, sliders reachable & escapable
  (`Esc` closes overlays; focus trapped in open modal/drawer; focus restored on close).
- Respect `prefers-reduced-motion`.
- Semantic form labels (`<label for>`), `aria-describedby` for errors, `:required`.
- Skip-to-content link; landmark roles; descriptive link text.
- Sliders: pause-on-interaction, keyboard arrows.

---

## 17. Performance Optimisation Checklist

- [ ] Mobile-first CSS; ship **minified** `style.min.css` + `bundle.min.js` in prod.
- [ ] Images: modern formats (`webp`/`avif`) with fallbacks; correct `width`/`height` to
      prevent CLS; `loading="lazy"` + `decoding="async"` below the fold; hero eager +
      `fetchpriority="high"`; responsive `srcset`/`sizes`. Compress the heavy WP JPEGs.
- [ ] `preconnect` to font/CDN origins; `preload` hero image + primary font.
- [ ] Defer all non-critical JS; vendor libs deferred.
- [ ] Prefer `transform`/`opacity`; `content-visibility:auto` on long lower sections.
- [ ] No unused CSS/JS shipped; tree-shake vendor imports.
- [ ] Target Lighthouse ≥ 90 across Performance / Accessibility / Best-Practices / SEO.
- [ ] SEO: title, meta description, Open Graph/Twitter, `RoofingContractor`/`LocalBusiness`
      JSON-LD (real NAP), canonical, favicon set.

---

## 18. Node.js SCSS Workflow

Node build (mirrors sibling projects). Scripts in `package.json`:

```jsonc
{
  "scripts": {
    "dev":          "npm-run-all --parallel watch:css watch:js serve",
    "serve":        "live-server --port=5173 --no-browser",
    "watch:css":    "sass assets/scss/main.scss:assets/css/style.css --style=expanded --source-map --watch",
    "build:css:dev":"sass assets/scss/main.scss:assets/css/style.css --style=expanded --source-map",
    "prefix:css":   "postcss assets/css/style.css --use autoprefixer --replace --no-map",
    "build:css:min":"postcss assets/css/style.css --use cssnano --no-map --output assets/css/style.min.css",
    "watch:js":     "esbuild js/main.js --bundle --format=iife --sourcemap --outfile=assets/js/bundle.js --watch",
    "build:js":     "esbuild js/main.js --bundle --format=iife --minify --outfile=assets/js/bundle.min.js",
    "build":        "npm-run-all build:css:dev prefix:css build:css:min build:js"
  }
}
```

- **Dev:** `npm run dev` → live server + Sass/JS watch with source maps.
- **Prod:** `npm run build` → compiles SCSS, autoprefixes, **minifies** to
  `assets/css/style.min.css`, and bundles/minifies JS to `assets/js/bundle.min.js`.
- `index.html` links **`style.min.css`** and **`bundle.min.js`** for production.

Dev dependencies: `sass`, `postcss`, `postcss-cli`, `autoprefixer`, `cssnano`, `esbuild`,
`npm-run-all`, `live-server`. Browser targets in `.browserslistrc`.

## 19. CSS Minification Process

1. `sass` compiles `assets/scss/main.scss` → `assets/css/style.css` (expanded + map).
2. `postcss autoprefixer` rewrites vendor prefixes in place per `.browserslistrc`.
3. `postcss cssnano` minifies → `assets/css/style.min.css` (no map in prod).
4. HTML references the minified file. Never hand-edit compiled CSS — edit SCSS and rebuild.

---

## 20. Project Folder Structure

```
kangaroo-roof-epairs/
├── index.html                # Home page (only page this phase)
├── CLAUDE.md                 # this guide
├── README.md                 # setup & build instructions
├── package.json
├── package-lock.json
├── .browserslistrc
├── .gitignore
├── postcss.config.cjs
├── js/                       # ES module source (bundled to assets/js)
│   ├── main.js
│   ├── modules/
│   └── utils/
└── assets/
    ├── css/                  # compiled: style.css, style.css.map, style.min.css
    ├── scss/                 # SCSS source (7-1, see §10)
    ├── js/                   # bundled output: bundle.js, bundle.min.js
    ├── fonts/                # self-hosted Plus Jakarta Sans + Inter (woff2)
    ├── vendor/               # locally-vendored 3rd-party libs (optional)
    └── img/
        ├── hero/             # hero roofing photo(s)
        ├── services/         # service imagery
        ├── gallery/          # real project photos (from live site)
        ├── team/
        ├── about/            # about collage photos
        ├── icons/            # svg service/ui icons
        ├── backgrounds/      # textures / section backgrounds
        ├── logo/             # logo.png, logo-footer.png (from live site)
        └── favicon/          # favicon set
```

> **Root stays clean:** only `index.html`, `CLAUDE.md`, `README.md`, `package.json`,
> `package-lock.json`, config dotfiles, `js/`, and `assets/`.

---

## 21. Definition of Done (this phase)

- [ ] `CLAUDE.md` complete and accurate (this file).
- [ ] Project scaffold + Node build environment working (`npm run build` succeeds).
- [ ] Premium, responsive `index.html` home page built to every rule above and filled with
      **real Kangaroo content + assets**.
- [ ] Logo + real project photos downloaded to `assets/img/**` and used locally.
- [ ] Placeholders (reviews/stats/team) clearly labelled.
- [ ] SCSS compiles to minified `style.min.css`; JS bundles to `bundle.min.js`.
- [ ] GSAP animations, Swiper sliders, Fancybox lightbox/modal all working.
- [ ] Accessible (keyboard, focus, reduced-motion), AA contrast, no console errors.
- [ ] Responsive at 360 / 768 / 1024 / 1280 / 1536.

---

### Git / workflow note

All work goes to the **`feature/theme-clining`** branch. **Never push or merge to `main`.**
