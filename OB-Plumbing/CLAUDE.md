# OB Plumbing — Design & Development Guidelines

> The single source of truth for the OB Plumbing website. Read this before writing
> any markup, style, or script. Every visual and code decision should trace back to
> a rule in this document. If something here is wrong or missing, update **this file
> first**, then the code.

---

## 1. Project Overview & Redesign Objectives

**OB Plumbing** is a local, owner-operated plumbing business servicing the **Hills
District & Hawkesbury region of Sydney, NSW** (Box Hill, Kellyville, Castle Hill,
Windsor, Richmond, The Ponds, and ~36 surrounding suburbs).

The current site (`obplumb.com.au`) is sparse: a logo, a tagline, a single headline,
a contact form, and a suburb list. It does not communicate trust, scope of services,
or professionalism — the things that win plumbing jobs.

**Redesign objectives**

1. **Win the call.** The phone number `0499 418 867` and a booking action must be
   reachable from any scroll position, on any device, within one tap.
2. **Build instant trust.** Lead with licensing, insurance, guarantees, reviews and
   real job photos — the proof an Australian homeowner looks for before they dial.
3. **Communicate full scope.** Clearly present all 11 services so visitors know OB
   handles the whole job, not just one tap.
4. **Feel premium.** Move from "template tradesperson site" to a refined, modern,
   high-end Australian business presence that justifies a premium rate.
5. **Convert.** Every section ends in a clear next step. The page is a funnel, not a
   brochure.
6. **Perform.** Sub-3-second mobile load, mobile-first, accessible, fast.

**Scope of this phase:** the **`index` page only**. Architect everything (tokens,
components, partials) so additional pages (service pages, suburb pages, about) can be
added later with zero refactoring.

---

## 2. Design Philosophy

> **Premium · Modern · Clean · Trustworthy · Conversion-focused.**

- **Expressive minimalism.** Clean, generous layouts with one confident accent and
  bold, large-scale typography. Whitespace is a feature, not empty space.
- **Trust before persuasion.** Proof elements (licence, insurance, guarantee,
  reviews, real photos) appear early and often. Nothing feels like a stock template.
- **Clarity over cleverness.** A stressed homeowner with a burst pipe should find the
  call button in under a second. Plain English, short sentences, obvious actions.
- **Calm confidence.** Restrained colour, measured motion, precise spacing. The
  design should feel like a company that turns up on time and does neat work.
- **Mobile is the default.** The majority of plumbing searches are mobile and urgent.
  Design the small screen first; the desktop is the enhanced version.
- **Every pixel earns its place.** If an element does not build trust, aid
  comprehension, or drive the call/booking, it is removed.

---

## 3. Australian-Inspired Design Direction & UX Principles

Grounded in research of contemporary premium Australian trade & B2B sites.

**Direction**

- **"Harbour & Brass."** A deep, dependable **navy** (authority, trust, water) paired
  with a refined **copper/brass** accent (the literal material of quality plumbing —
  warm, premium, and a clear point of difference from the generic all-blue plumber
  site). A clean **signal blue** carries primary actions.
- Real, high-quality job photography over stock imagery wherever possible.
- Bold, large headings; quiet, highly legible body copy; lots of breathing room.

**UX principles (the AU homeowner's checklist)**

1. **Sticky tap-to-call.** A persistent call affordance on mobile at all times.
2. **Emergency clarity.** "24/7 emergencies" stated plainly, up top.
3. **Trust signals high.** Licensed & insured, guarantee, and ★ reviews above and
   near the fold.
4. **Suburb proof.** An explicit, scannable list of serviced suburbs ("you cover my
   area") — a known conversion driver for local trades.
5. **One-tap quote.** A short, low-friction booking form (name, phone, suburb,
   service) — never a long form.
6. **Service transparency.** All services visible and understandable at a glance.
7. **Local & human.** Owner-operated, genuinely local tone — not a faceless call
   centre.
8. **No dead ends.** Every section offers a call or a booking nudge.

---

## 4. Visual Style Guidelines

- **Layout:** confident, mostly grid-aligned, with intentional asymmetry in feature
  sections (image offset, overlapping cards). Avoid rigid, evenly-weighted columns.
- **Density:** generous. Large section padding, comfortable line-length (60–75ch),
  cards with airy internal padding.
- **Colour use:** navy and neutrals dominate; signal blue for actions; copper used
  *sparingly* as a premium accent (eyebrows, rules, icon details, hover states).
  Never let accents become the dominant area of colour.
- **Imagery:** real plumbing work, warm and well-lit; consistent subtle navy duotone
  or gradient scrim where text overlays images for contrast.
- **Texture & depth:** soft, navy-tinted shadows; thin hairline borders; the
  occasional subtle blueprint/grid or gradient mesh in dark sections for atmosphere.
  No heavy gloss, no harsh drop shadows.
- **Tone of voice:** confident, warm, plain-spoken Australian. A touch of the
  brand's existing wit is welcome but always secondary to clarity and trust.

---

## 5. Colour Palette

All colours are exposed as CSS custom properties (see `scss/abstracts/_variables.scss`).
Use the tokens — never hard-code a hex in a component.

### Primary — Navy (brand, authority, dark surfaces)

| Token            | HEX       | Use                                            |
| ---------------- | --------- | ---------------------------------------------- |
| `--c-navy-900`   | `#08203A` | Darkest sections, footer                       |
| `--c-navy-800`   | `#0E2A47` | **Brand primary**, dark section background     |
| `--c-navy-700`   | `#143656` | Dark gradients, hovered dark surfaces          |
| `--c-navy-600`   | `#1D456B` | Borders/dividers on dark, secondary dark fills |

### Accent — Signal Blue (water, primary actions, links)

| Token            | HEX       | Use                                      |
| ---------------- | --------- | ---------------------------------------- |
| `--c-blue-600`   | `#1B79D0` | **Primary buttons, links, active state** |
| `--c-blue-500`   | `#2E90E0` | Hover, gradients                         |
| `--c-blue-400`   | `#5AAEEC` | Accents on dark backgrounds              |
| `--c-blue-50`    | `#EAF4FC` | Tinted backgrounds, icon chips           |

### Secondary Accent — Copper / Brass (premium warmth, sparing)

| Token            | HEX       | Use                                            |
| ---------------- | --------- | ---------------------------------------------- |
| `--c-copper-600` | `#B26A2E` | Eyebrow text, hairline accents                 |
| `--c-copper-500` | `#C8853C` | **Premium accent**, icon detail, hover rules   |
| `--c-copper-400` | `#DBA465` | Accent on dark backgrounds, subtle highlights  |

### Neutrals

| Token            | HEX       | Use                                  |
| ---------------- | --------- | ------------------------------------ |
| `--c-ink`        | `#13202E` | Headings, strongest text             |
| `--c-slate-700`  | `#33485B` | **Body text**                        |
| `--c-slate-500`  | `#5E7488` | Muted text, captions, placeholders   |
| `--c-slate-300`  | `#A9B8C5` | Disabled text, faint icons           |
| `--c-border`     | `#E1E8EF` | **Default borders & dividers**       |
| `--c-surface`    | `#F4F8FB` | **Alt section background**           |
| `--c-surface-2`  | `#ECF2F8` | Nested surfaces, input backgrounds   |
| `--c-white`      | `#FFFFFF` | Base background, cards               |

### Semantic

| Token         | HEX       | Use                              |
| ------------- | --------- | -------------------------------- |
| `--c-success` | `#1E9E6A` | Success states, ticks, valid     |
| `--c-warning` | `#E0A52E` | Warnings, attention              |
| `--c-danger`  | `#D9544D` | Errors, emergency emphasis       |
| `--c-border`  | `#E1E8EF` | Border (also listed in neutrals) |

### Functional aliases

```
--bg:           var(--c-white);
--bg-alt:       var(--c-surface);
--text:         var(--c-slate-700);
--heading:      var(--c-ink);
--muted:        var(--c-slate-500);
--action:       var(--c-blue-600);
--accent:       var(--c-copper-500);
```

**Contrast rule:** all text must meet **WCAG AA** (≥4.5:1 body, ≥3:1 large headings).
Body text on white uses `--c-slate-700`; on navy use `--c-white` / `rgba(255,255,255,.78)`.

---

## 6. Typography System

**Font family** — a single, consistent typeface across the whole site:
**Montserrat** (loaded from Google Fonts), with a robust web-safe fallback chain.

- **All type — headings, body & UI:** `Montserrat`.
- **Fallback stack:** `Helvetica, Arial, "Lucida Grande", Lucida, sans-serif`.
- Headings use heavier weights (700–800) and tight tracking for presence; body uses
  400–500. One family, varied by weight — clean, professional, dependable.

```scss
--font-display: "Montserrat", Helvetica, Arial, "Lucida Grande", Lucida, sans-serif;
--font-body:    "Montserrat", Helvetica, Arial, "Lucida Grande", Lucida, sans-serif;
```

> Both `--font-display` and `--font-body` resolve to the same Montserrat stack. Keep the
> two tokens (don't collapse to one) so a future display face can be swapped in without
> touching components. Load Montserrat weights `400, 500, 600, 700, 800` with
> `display=swap`; never rely on the bare fallback for headings if the web font is available.

**Type scale** (fluid, `clamp()`-based — mobile → desktop):

| Token          | Size (clamp)                       | Element                  | Weight | Line-height |
| -------------- | ---------------------------------- | ------------------------ | ------ | ----------- |
| `--fs-display` | `clamp(2.75rem, 6vw, 4.75rem)`     | Hero H1                  | 800    | 1.04        |
| `--fs-h1`      | `clamp(2.25rem, 4.5vw, 3.25rem)`   | Page H1                  | 800    | 1.08        |
| `--fs-h2`      | `clamp(1.9rem, 3.4vw, 2.85rem)`    | Section H2               | 700    | 1.12        |
| `--fs-h3`      | `clamp(1.35rem, 2vw, 1.75rem)`     | Card / sub heading       | 700    | 1.2         |
| `--fs-h4`      | `1.2rem`                           | Minor heading            | 700    | 1.3         |
| `--fs-lead`    | `clamp(1.075rem, 1.5vw, 1.3rem)`   | Intro / lead paragraph   | 500    | 1.6         |
| `--fs-body`    | `1rem` (16px base)                 | Body                     | 400    | 1.65        |
| `--fs-sm`      | `0.9375rem`                        | Secondary text           | 400    | 1.6         |
| `--fs-xs`      | `0.8125rem`                        | Captions, meta           | 500    | 1.5         |
| `--fs-eyebrow` | `0.8125rem`                        | Eyebrow / kicker         | 700    | 1.4         |

**Weights:** Montserrat `400 / 500 / 600 / 700 / 800`. Body `400` (`500` for emphasis);
section headings `700`; hero/display `800`. Reserve `800` for the largest display type.

**Heading hierarchy & rules**

- One `<h1>` per page (the hero headline).
- Headings use `--font-display`, `color: var(--heading)`, `letter-spacing: -0.02em`.
- **Eyebrow / kicker:** uppercase, `letter-spacing: 0.14em`, `--c-copper-600`, paired
  above an H2 to label the section.
- Body copy: `--font-body`, `color: var(--text)`, `max-width: 65ch` for readability.
- Never set body line-height below 1.55 or heading below 1.04.

---

## 7. Spacing System & Layout Grid

**Base unit: 4px.** Use the scale; avoid arbitrary pixel values.

| Token       | Value   | Token       | Value   |
| ----------- | ------- | ----------- | ------- |
| `--sp-3xs`  | `4px`   | `--sp-lg`   | `32px`  |
| `--sp-2xs`  | `8px`   | `--sp-xl`   | `48px`  |
| `--sp-xs`   | `12px`  | `--sp-2xl`  | `64px`  |
| `--sp-sm`   | `16px`  | `--sp-3xl`  | `96px`  |
| `--sp-md`   | `24px`  | `--sp-4xl`  | `128px` |

**Section rhythm:** vertical padding `clamp(4rem, 9vw, 8rem)` (`--section-y`).
Adjacent sections never both use full padding against a colour change without intent.

**Container / grid**

- Max content width: **1240px** (`--container`). Wide variant `1380px` for full-bleed
  feature rows; narrow `760px` for prose.
- Inline padding (gutter): `clamp(20px, 5vw, 40px)`.
- Grid: a **12-column** mental model, implemented with CSS Grid / Flex and `gap`.
  Card grids use `repeat(auto-fit, minmax(min(100%, 280px), 1fr))` with `--sp-md`–`--sp-lg` gaps.
- Maintain a consistent gutter (`--sp-md` mobile, `--sp-lg` desktop) between cards.

---

## 8. Border Radius, Shadows & Elevation

**Radius**

```
--r-xs:    8px;    // chips, inputs, small controls
--r-sm:    12px;   // buttons
--r-md:    16px;   // cards (default)
--r-lg:    24px;   // feature cards, media frames
--r-xl:    32px;   // large panels
--r-pill:  999px;  // pills, tags, round buttons
--r-circle:50%;
```

**Shadows** (soft, navy-tinted — never pure black, never harsh):

```
--sh-xs:   0 1px 2px rgba(8,32,58,.06);
--sh-sm:   0 2px 8px rgba(8,32,58,.07);
--sh-md:   0 10px 30px rgba(8,32,58,.10);
--sh-lg:   0 24px 60px rgba(8,32,58,.14);
--sh-blue: 0 12px 28px rgba(27,121,208,.30);   // raised primary buttons
```

**Elevation rules**

- **e0** flat (borders only): inputs, list items, alt sections.
- **e1** `--sh-sm`: resting cards.
- **e2** `--sh-md`: hovered cards, sticky header on scroll, popovers.
- **e3** `--sh-lg`: modals (Fancybox), the booking panel, hero media frame.
- Elevation increases on hover by **one** step + a `-4px` translate, never more.
- Prefer **border + subtle shadow** over heavy shadow for a premium, crisp feel.

---

## 9. Component Styling Guidelines

### Buttons (`.btn`)

- Shape: `--r-sm` radius, `min-height: 52px` (desktop) / `48px` (mobile), padding
  `0 28px`, `--font-body` weight 700, `letter-spacing: 0.01em`, no text-transform.
- **Variants:**
  - `.btn--primary` — `--c-blue-600` bg, white text, `--sh-blue`; hover `--c-blue-500`
    + lift `-2px`.
  - `.btn--dark` — navy bg, white text; for light sections needing contrast.
  - `.btn--accent` — copper bg, white text; rare, premium CTAs only.
  - `.btn--ghost` — transparent, `1.5px` current-colour border; hover fills.
  - `.btn--lg` size modifier; `.btn--block` full width (mobile CTAs).
- Always include an accessible label; icon-only buttons need `aria-label`.
- Transition: `transform .25s, background .25s, box-shadow .25s`.

### Forms (`.field`, `.input`, `.select`, `.textarea`)

- Inputs: `--c-surface-2` (or white) bg, `1.5px solid --c-border`, `--r-xs` radius,
  `min-height: 52px`, padding `0 16px`, `--fs-body`.
- Label above input, `--fs-sm`, weight 600, `--c-ink`.
- **Focus:** `border-color: --c-blue-600` + `box-shadow: 0 0 0 4px rgba(27,121,208,.15)`.
  Never remove focus outlines without a visible replacement.
- **Error:** `--c-danger` border + helper text. **Success:** `--c-success`.
- Placeholders use `--c-slate-500`. Generous vertical spacing (`--sp-sm`) between fields.

### Cards (`.card`)

- White bg, `--r-md` radius, `1px solid --c-border`, `--sh-sm`, padding `--sp-lg`.
- Hover (interactive cards only): `--sh-md` + `translateY(-4px)` + border tightens to
  `--c-blue-200`-ish tint; `.25s` ease.
- Media cards: image in `--r-lg` frame, `object-fit: cover`, consistent aspect ratio
  (4:3 or 16:10). Optional navy gradient scrim for overlaid text.
- Icon chips inside cards: `--c-blue-50` bg, `--r-sm`, copper or blue icon.

### Sections (`.section`)

- Vertical padding `--section-y`; `.section--alt` uses `--bg-alt`; `.section--dark`
  uses navy bg with light text and a subtle grid/gradient texture.
- Each section: optional **eyebrow** → **H2** → optional **lead** → content → CTA.
- Use the `.section__head` block (max-width ~720px) for consistent header rhythm;
  centre it for full-width grids, left-align for split layouts.

---

## 10. Iconography & Imagery Guidelines

**Icons**

- Style: **line icons**, `1.75px` stroke, rounded caps/joins, on a **24px** grid.
- Use inline SVG (so colour follows `currentColor`); never raster icons.
- Place service/feature icons in a tinted chip (`--c-blue-50`) with a blue or copper
  stroke. Keep the set visually consistent (one library / one stroke weight).
- Decorative icons are `aria-hidden="true"`; meaningful icons get a label.

**Imagery**

- Prefer **real job photography**: cleared drains, new hot-water units, neat
  re-pipes, the plumber on the job. Authenticity outperforms stock.
- Treatment: warm, well-lit, natural; optional subtle navy duotone/scrim for
  consistency and text contrast.
- Always set explicit `width`/`height` or aspect-ratio to prevent layout shift;
  `loading="lazy"` for below-the-fold, `eager` for the hero.
- Provide meaningful `alt` text; decorative images use empty `alt=""`.
- Galleries open in **Fancybox**; sliders use **Swiper**.

---

## 11. Animation & Interaction Principles

> Subtle, meaningful, fast. Motion guides attention and adds polish — it never
> performs for its own sake.

- **Library:** **GSAP** (+ ScrollTrigger) for scroll-reveal and micro-interactions.
- **Scroll reveals:** fade + rise `16–24px`, `0.6–0.8s`, `power2.out`/`power3.out`,
  `stagger 0.08` for groups. Trigger once at ~85% viewport; never re-hide on scroll up.
- **Hover:** `translateY(-2px → -4px)`, shadow step-up, copper underline draw on links.
  Durations `0.2–0.3s`, easing `ease`/`power2.out`.
- **Counters:** stats count up once on first view.
- **Page load:** a single, orchestrated hero reveal (staggered headline → sub → CTA →
  media) beats scattered effects.
- **Sliders:** Swiper with gentle `400–600ms` transitions, soft easing.
- **Performance:** animate only `transform` and `opacity`. No layout-thrashing props.
- **Accessibility:** honour `prefers-reduced-motion: reduce` — disable transforms,
  keep content instantly visible, no parallax/auto-play motion.

---

## 12. Responsive Breakpoints & Mobile-First

Author mobile-first; layer enhancements upward with `min-width` media queries.

```scss
$bp-sm:  480px;   // large phones
$bp-md:  768px;   // tablets / split layouts begin
$bp-lg:  1024px;  // small laptops / full nav
$bp-xl:  1280px;  // desktop
$bp-2xl: 1440px;  // wide desktop
```

Use the `respond-to()` mixin (in `_breakpoints.scss`): `@include respond-to(md) { … }`.

**Rules**

- Base styles target ~360–414px phones.
- Single column < `md`; introduce multi-column grids at `md`+.
- Tap targets ≥ **44×44px**; primary mobile CTAs are full-width and thumb-reachable.
- The **sticky mobile call bar** shows below `md` only; the header call button shows
  at `md`+.
- Navigation collapses to an accessible toggle menu below `lg`.
- Test at 360, 414, 768, 1024, 1280, 1440.

---

## 13. File & Folder Structure

```
OB-Plumbing/
├── index.html                 # the only page this phase
├── CLAUDE.md                  # this file
├── package.json               # sass build scripts + dev deps
├── .gitignore
├── css/
│   ├── style.css              # COMPILED output — do not edit by hand
│   └── style.css.map
├── scss/                      # SCSS source (7-1 inspired)
│   ├── main.scss              # the single entry: forwards all partials
│   ├── abstracts/
│   │   ├── _variables.scss    # tokens (colour, type, space, radius, shadow)
│   │   ├── _breakpoints.scss  # $bp-* + respond-to() mixin
│   │   ├── _functions.scss    # helpers
│   │   └── _mixins.scss       # reusable mixins
│   ├── base/
│   │   ├── _reset.scss
│   │   ├── _typography.scss
│   │   ├── _global.scss
│   │   └── _utilities.scss
│   ├── layout/
│   │   ├── _container.scss
│   │   ├── _header.scss
│   │   └── _footer.scss
│   ├── components/
│   │   ├── _buttons.scss
│   │   ├── _cards.scss
│   │   ├── _forms.scss
│   │   ├── _badges.scss
│   │   ├── _section.scss
│   │   └── _marquee.scss
│   ├── sections/
│   │   ├── _topbar.scss
│   │   ├── _hero.scss
│   │   ├── _trust.scss
│   │   ├── _services.scss
│   │   ├── _why.scss
│   │   ├── _process.scss
│   │   ├── _gallery.scss
│   │   ├── _testimonials.scss
│   │   ├── _areas.scss
│   │   ├── _cta.scss
│   │   └── _booking.scss
│   └── vendor/
│       ├── _swiper.scss        # Swiper overrides
│       └── _fancybox.scss      # Fancybox overrides
├── js/
│   └── main.js                 # ES6 module: nav, gsap, swiper, fancybox, form, etc.
└── images/                     # real job photos, og image, favicons
```

- Third-party libs (GSAP, Swiper, Fancybox) load via **CDN** in `index.html`.
- `css/` is build output — **never hand-edit**; change `scss/` and recompile.

---

## 14. Naming Conventions & Coding Standards

**CSS — BEM**

- Block `.card`, Element `.card__title`, Modifier `.card--featured`.
- Lowercase, hyphen-separated. No deep nesting (> 2 levels) in SCSS output.
- State classes: `.is-open`, `.is-active`, `.has-error`, `is-scrolled`.
- Never style by tag for components; use classes. Tokens via CSS variables only —
  no raw hex/px in component files.

**SCSS**

- One concern per partial; `@use`/`@forward` (no `@import`). `main.scss` only forwards.
- Variables in `_variables.scss` exposed as `:root` CSS custom properties, plus Sass
  vars for breakpoints/maps where needed at compile time.
- Mixins for repeated patterns (`respond-to`, `focus-ring`, `clamp-lines`, `card-base`).

**HTML**

- Semantic HTML5: `header`, `nav`, `main`, `section`, `article`, `footer`,
  `figure/figcaption`. One `<h1>`; logical heading order.
- Landmarks and `aria-*` where needed; `alt` on every `<img>`.
- Section ids are kebab-case and match nav anchors (`#services`, `#book`).

**JavaScript (ES6+)**

- Modules / IIFE; `const`/`let`, no `var`. Small, single-purpose functions.
- Feature-detect before use; guard against missing nodes (`el && …`).
- No inline JS in HTML beyond the single `main.js` include + CDN libs.
- Names: `camelCase` for vars/functions, `PascalCase` for classes, `UPPER_SNAKE` for
  constants.

**Formatting:** 2-space indent, single quotes in JS, trailing semicolons, ~100 col
soft wrap. Keep diffs clean and reviewable.

---

## 15. Accessibility & Performance Guidelines

**Accessibility (target WCAG 2.1 AA)**

- Colour contrast AA for all text (see §5).
- Full keyboard operability; visible focus ring on every interactive element
  (`focus-visible` ring: `0 0 0 4px rgba(27,121,208,.15)` + border/outline).
- Semantic landmarks; skip-to-content link; logical tab order.
- `aria-expanded`/`aria-controls` on the nav toggle; `aria-label` on icon buttons and
  social links; `aria-live` on the form success message.
- Respect `prefers-reduced-motion`.
- Forms: associated `<label>`s, `required`, helpful inline errors, large tap targets.

**Performance (target: sub-3s mobile, Lighthouse ≥ 90)**

- Compressed CSS in production (`--style=compressed`), single stylesheet.
- Defer non-critical JS (`defer`/module); load GSAP/Swiper/Fancybox from CDN, only
  what's used.
- Images: right-sized, lazy-loaded below the fold, explicit dimensions, modern formats
  where possible; eager-load only the hero.
- Preconnect to font/CDN origins; `display=swap` on web fonts.
- Avoid layout shift (reserve image space); animate only `transform`/`opacity`.
- Minimise DOM depth; reuse components rather than duplicating markup.

---

## 16. Reusable Component Strategy

The page is assembled from **composable, content-agnostic components**. Build the
component once; vary it with modifiers and content — never copy-paste bespoke markup.

**Core reusable components**

- **Section shell** (`.section` + `.section__head` eyebrow/title/lead) — wraps every
  section for consistent rhythm.
- **Button** (`.btn` + variants/sizes) — every action.
- **Card** (`.card` + `--service`, `--feature`, `--media`, `--testimonial`).
- **Icon chip** (`.chip`) — tinted square holding an SVG icon.
- **Badge / pill** (`.badge`) — trust signals (Licensed, Insured, 24/7, ★ rating).
- **Stat** (`.stat`) — number + label, used in the stats band.
- **Step** (`.step`) — numbered process item.
- **Field** (`.field`) — label + control + error, used across all forms.
- **Marquee** (`.marquee`) — scrolling suburb/keyword strip.
- **Media frame** (`.frame`) — consistent image framing + scrim.

**Rules**

- A component owns its styles in one partial and its markup pattern is documented by
  example in `index.html`.
- Variants are **modifier classes**, not new blocks.
- Content (text, images, counts) is the only thing that changes between instances.
- When a fourth bespoke instance of anything appears, promote it to a component.

---

## 17. Development Workflow & Best Practices

**Tooling**

- **HTML5** + **SCSS** (compiled with Dart Sass via Node) + **vanilla ES6 JS**.
- **GSAP** (+ ScrollTrigger): scroll reveals & micro-interactions.
- **Swiper.js** (`https://swiperjs.com/`): all sliders/carousels (testimonials,
  services, gallery if carousel-style).
- **Fancybox** (`https://fancyapps.com/fancybox/`): image galleries & modal popups.

**Build / scripts** (`package.json`)

```bash
npm install            # one-time: installs sass
npm run dev            # sass --watch, expanded + source maps (local dev)
npm run build          # sass compressed, no source map (production)
```

- Edit **`scss/`** only; let the compiler write `css/style.css`. Never edit compiled CSS.
- Recompile and visually verify after every styling change.

**Working method**

1. Check this `CLAUDE.md` for the relevant rule/token before coding.
2. Build mobile-first; verify at each breakpoint (§12).
3. Use existing components; add a component only when a pattern repeats.
4. Keep markup semantic and accessible (§15) as you write it, not after.
5. Verify trust elements, the sticky call action, and the booking form work on mobile.
6. Run a quick a11y pass (keyboard, contrast, labels) and a performance sanity check.
7. Commit small, descriptive changes. Update this document when conventions evolve.

**Definition of done (per section):** semantic markup, tokenised styles, responsive
at all breakpoints, accessible, animated subtly, and ending in a clear next step.

---

## 18. Page Blueprint — `index.html` (reference-informed)

This blueprint is derived from three approved references and adapted to OB Plumbing's
premium-AU direction. **We borrow structure and patterns, never visual style** — the
look is defined by §4–§11 of this document, not by the references.

**References & what we take from each**

- **PipeX** (`themejunction.net/html/pipex`) — overall **section inventory & order**,
  numbered service cards, split hero, projects grid, testimonial carousel, 4-column
  footer. (We drop its teal+orange palette and decorative-shape clutter in favour of
  our Harbour-&-Brass system and expressive minimalism.)
- **CleanupFlow** (`cleanupflow-template.webflow.io`) — the **"How it works"** pattern:
  a short, friendly *"…in 3 Easy Steps"* flow with oversized step numbers and a closing
  CTA. (We adapt orange → copper/blue and keep it premium.)
- **OB Plumbing** (`obplumb.com.au`) — brand voice, phone `0499 418 867`, the 11
  services, the ~36 suburb list, and the booking form. **Note:** the live site has **no
  testimonials**, so testimonial copy is realistic AU **placeholder content** clearly
  marked `data-placeholder` for the client to replace with real Google reviews.

### Section order (top → bottom)

| # | Section            | Purpose / notes                                                                 |
|---|--------------------|---------------------------------------------------------------------------------|
| 0 | **Top bar**        | Tagline + hours + tap-to-call. Thin, navy.                                       |
| 1 | **Header / nav**   | Logo · nav · "Book us in" · prominent call button. Sticky, condenses on scroll.  |
| 2 | **Hero**           | Split: copy left, framed plumber photo right. Eyebrow, H1, lead, 2 CTAs, trust chips, ★ rating. Subtle navy gradient/blueprint atmosphere — **no busy SVG blobs**. |
| 3 | **Trust strip**    | Licensed & insured · 24/7 · upfront pricing · guarantee · ★ Google rating. Badges/logos row. |
| 4 | **About / intro**  | Image + content split. Local owner-operator story, signature, "Why OB" lead-in.  |
| 5 | **Services**       | All 11 services as numbered cards (`01–11`) in a responsive grid; icon chips; one featured/wide card. Ends with a call nudge. |
| 6 | **Offer / CTA band** | Full-width navy band with a single strong message + call button (replaces Pipex "10% offer" with an honest "Backed up? Get a local plumber today"). |
| 7 | **Process — "How it works"** | **CleanupFlow style** (see below).                               |
| 8 | **Projects / gallery** | 3-col real job photos; **Fancybox** lightbox; hover zoom + caption overlay.  |
| 9 | **Why OB / features** | Differentiators grid (upfront pricing, on-time, licensed, guaranteed, local, 24/7). May sit on a `--section--dark` navy background. |
| 10| **Stats band**     | Count-up stats (years, suburbs, 24/7, % licensed).                              |
| 11| **Testimonials**   | **Swiper** carousel (see below).                                                |
| 12| **Service areas**  | Full scannable suburb grid + intro. "Can't see yours? Call us." Optional marquee. |
| 13| **Booking**        | Split: copy + short form (name, phone, suburb, service, details). Send + Call.    |
| 14| **Footer**         | 4-column: brand+contact, services, company, CTA. Bottom bar with licence note.   |
| —  | **Sticky call bar** | Mobile-only persistent tap-to-call.                                            |

> Sections we deliberately **omit** from Pipex for a leaner premium feel: team carousel,
> blog grid, and brand-logo carousel. They add no conversion value for a local
> owner-operator and dilute focus. Add later if the business grows.

### Process — "How it works" (CleanupFlow-informed) — `.process` / `.step`

- Header: eyebrow "How it works" + H2 like **"Sorted in 3 easy steps"** + short lead.
- **Exactly 3 steps**, horizontal at `md+`, stacked on mobile:
  1. **Get in touch** — "Call or book online and tell us what's gone wrong."
  2. **We quote upfront** — "A clear, fixed price before any work starts — no surprises."
  3. **We fix it right** — "On-time, tidy and guaranteed. Job done."
- Visual: **oversized step number** (`--font-display`, `clamp(3.5rem,8vw,6rem)`,
  `--c-blue-50`/copper tint) behind a small icon chip; title (H3) + 1-line description.
- A subtle **connecting line / arrow** between steps at `md+` (copper, thin). Animate the
  line draw + staggered card reveal with GSAP.
- Closing CTA row beneath the steps: *"Ready to get it sorted?"* + a `.btn--primary`
  with a trailing arrow (CleanupFlow's closing-CTA pattern).

### Testimonials (Pipex-informed structure, placeholder content) — `.testimonials`

- **Swiper** carousel: 1 slide (mobile) → 2 (md) → 3 (lg); pagination dots + optional
  arrows; gentle 500ms transitions; autoplay slow with pause-on-hover; loop.
- **Testimonial card** (`.card--testimonial`): quote mark, ★★★★★ rating (copper/gold
  stars), quote text (`--fs-lead`-ish), then author = avatar/initial + **name** +
  **suburb** (e.g. "Sarah M. — Castle Hill") + small "via Google" tag.
- Content is **placeholder AU reviews** (realistic, local, varied) on the wrapper's
  `data-placeholder="true"`; include an HTML comment instructing replacement with real
  Google reviews. Never present placeholder reviews as if verified.
- Section header eyebrow "What locals say" + H2 (e.g. "Trusted across the Hills &
  Hawkesbury").

### Hero & atmosphere note

PipeX leans on scattered SVG "blob" shapes — **we do not**. Our hero atmosphere comes
from: a restrained navy gradient, an optional faint blueprint grid, a single copper
hairline accent, the framed hero photo with soft `--sh-lg`, and a small floating
trust/rating badge. Calm, premium, intentional — not decorative noise.

---

## 19. Brand Assets & Logo Usage

- **Logo:** `images/obplumb-logo.png` — a **white wordmark with a green brand tick**,
  designed for **dark backgrounds only**.
  - Use it on dark surfaces: the **header** (which is therefore navy), the **footer**,
    and the **mobile app top bar**. Never place the white logo on a light background.
  - Keep clear-space around it ≥ the height of the "O". Render at ~150–180px wide
    desktop, ~132px mobile. Always set `alt="OB Plumbing"` and explicit dimensions.
  - The logo introduces a **green** accent. Treat green as the **brand/logo colour**;
    keep our copper accent for editorial details (eyebrows, hairlines). Don't let green
    and copper compete in the same cluster — logo green lives in the header/footer chrome.
- **Footer graphic:** `images/footer-bg.png` (375×556 portrait) — a decorative image
  anchored to **one side of the footer** (left or right), bleeding to the edge, behind/
  beside the columns. It must never reduce text contrast: sit it under a navy scrim or to
  the side of the content, `aria-hidden`, and hide it on small screens if it crowds copy.
- **Header is dark** (navy) to carry the white logo. Nav links become light; the primary
  call button stays signal-blue. The sticky-scroll state deepens the navy + adds shadow.

---

## 20. Mobile Experience — "Smart App" Style

On phones the site should **feel like a native app**, not a shrunken website.

- **Bottom tab bar** (`.appbar`, mobile-only, `display:none` at `md+`): a fixed, floating
  navigation dock with 4–5 icon+label tabs — **Home · Services · Call · Book · Areas**.
  - The **Call** action is the centre, elevated **FAB** (signal-blue circle, raised with
    `--sh-blue`) — the primary always-available conversion action. It replaces the old
    sticky call bar.
  - Tabs: line icon + tiny label; active tab tinted (blue) with a small indicator.
  - Safe-area aware: pad with `env(safe-area-inset-bottom)`; add matching bottom padding
    to `body`/last section so content never hides behind the dock.
- **App top bar:** compact, navy, white logo left, a single round icon button (menu) right
  — like a native app header. Sticky, condenses on scroll.
- **App feel throughout mobile:** generous rounded corners (`--r-lg`/`--r-xl`), card-based
  blocks with clear separation, large 48px+ tap targets, snappy press states
  (`:active` scale), horizontal **snap-scroll** carousels for services/【work】 where it
  suits, and section tops that can use a soft rounded "sheet" transition.
- **Motion:** quick, tactile micro-interactions (button press, tab switch). Respect
  `prefers-reduced-motion`. Keep it light — app polish, not animation noise.
- **Desktop is unaffected:** the tab bar, app top-bar treatment and snap-carousels are
  mobile-only enhancements layered via `respond-below(md)`; the desktop layout (§18) stands.
