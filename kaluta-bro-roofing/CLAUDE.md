# Kaluta Bro Roofing — Design & Development Guidelines

> The single source of truth for the **Kaluta Bro Roofing Pty Ltd** website. Read this
> before writing any markup, style, or script. Every visual and code decision should trace
> back to a rule in this document. If something here is wrong or missing, update **this
> file first**, then the code.

---

## 0. Reference & Intent

- **Content source (what we preserve):**
  `https://roofrestohq.com.au/roofers/schofields/kaluta-bro-roofing-pty-ltd/`
  and the business's own listing. We keep **all real business facts, services and SEO
  value** (see §1). We do **not** copy that page's UI.
- **Design reference (what we emulate):** `https://zairoof.webflow.io/home-pages/home-v1`
  — a **bold, warm, high-contrast, industrial-premium** roofing look: condensed uppercase
  **Oswald** display headings, **amber/gold** accent, near-black ink, generous whitespace,
  carousels, numbered workflow, marquee, FAQ accordion, motion on scroll.
- We reproduce Zairoof's **design language, rhythm and motion** with our **own** markup,
  SCSS, JS, images and Kaluta's **own** content. We never copy Zairoof's proprietary
  images or copy verbatim.

**Scope of this milestone:** the **`index.html` (Home) page only.** Architect
tokens/components/partials so future pages (Services, About, Contact) drop in with **zero
refactoring**.

---

## 1. Business Content & SEO (real — preserve exactly)

**Kaluta Bro Roofing Pty Ltd** — a professional roofing contractor serving residential &
commercial clients in Schofields and Greater Western Sydney.

| Field           | Value                                                                     |
| --------------- | ------------------------------------------------------------------------- |
| Business name   | **Kaluta Bro Roofing Pty Ltd**                                            |
| Address         | Unit 415/91C Grima St, Schofields NSW 2762                                |
| Phone           | **0481 157 376** (tel: `+61481157376`)                                    |
| Email           | kalutabroroofing@gmail.com                                                |
| Website         | kalutabroroofing.com.au                                                   |
| Instagram       | @kaluta_bros_roofing_nsw                                                   |
| Primary suburb  | Schofields, NSW (Blacktown LGA, Greater Western Sydney)                    |
| Client types    | Residential **and** commercial                                            |
| Hook            | **Free estimates / free quotes**                                          |

**Services offered (preserve all):**

1. Roof installation
2. Roof repairs
3. Roof maintenance (preventative maintenance)
4. Roof inspections
5. Gutter installation & repair
6. Roof restorations
7. Skylight installation
8. Commercial roofing
9. Residential roofing

**Business hours** *(from listing — verify with client before treating as final; mark
`data-verify="true"`):* Mon 7:00 am–4:00 pm · Tue 7:00 am–4:30 pm · Wed 9:00 am–5:00 pm ·
Thu 9:00 am–4:00 pm · Fri 9:00 am–4:00 pm.

**Positioning copy (paraphrase, keep meaning):** high-quality roofing with premium
materials and expert craftsmanship; a focus on quality workmanship and customer
satisfaction; comprehensive, well-maintained roofing systems; free estimates so clients
understand scope and cost.

**SEO carry-over**

- **Title target:** `Kaluta Bro Roofing Pty Ltd | Roofing Contractor Schofields NSW`
- **Meta description:** professional roofing contractor in Schofields NSW 2762 —
  installation, repairs, maintenance, inspections & gutters for residential & commercial;
  free estimates. Call 0481 157 376.
- **Local SEO:** emit **LocalBusiness / RoofingContractor** JSON-LD (name, address, geo,
  phone, opening hours, `areaServed`, `sameAs` Instagram). Keywords: *roofing Schofields,
  roof repairs Sydney, roof restoration NSW, gutter installation, roof inspection*.
- One `<h1>`, logical heading order, descriptive `alt`, canonical URL, Open Graph + Twitter
  cards, mobile-friendly, fast.

**What we do NOT have (mark `data-placeholder="true"` + HTML comment; never present as
verified):** ABN/licence numbers, years-in-business, project counts, named team members,
customer testimonials/ratings, blog posts, full service-area suburb list. Use realistic AU
placeholders (e.g. testimonials as sample homeowners) clearly flagged for client sign-off.

---

## 2. Design Philosophy — Zairoof-matched

> **Bold · Warm · Confident · High-contrast · Industrial-premium.**

- **Loud, structured headings.** Huge **condensed uppercase Oswald** display type with
  tight negative tracking. Type is the hero — size and weight, warmed by amber.
- **Warm & grounded.** White and near-black dominate; **amber/gold** is the single brand
  accent (buttons, highlights, active states, icon chips); **pale cream** warms feature
  bands.
- **Confident whitespace.** Generous vertical rhythm (~120–140px desktop section padding),
  wide container, big framed roofing photography.
- **Motion is a feature, not decoration.** Scroll reveals, count-up stats, a continuous
  service marquee, Swiper carousels (services / projects / testimonials), a numbered
  workflow, and an FAQ accordion — all smooth, purposeful, GSAP-driven.
- **Mobile is the default.** Design the phone first; desktop is the spacious enhancement.
  Ship a **sticky bottom app bar** that makes the phone feel like a native app.

---

## 3. UX Principles (AU homeowner's checklist)

1. **Persistent call/quote.** Nav "Get a Quote" always reachable; mobile app bar with a
   centre **Call FAB**.
2. **Trust early.** Experience/quality signals, "residential & commercial", free estimate,
   local Schofields presence.
3. **Free-quote hook** repeated calmly through the page.
4. **Short quote form** (name, phone, suburb, service, message).
5. **Service transparency.** All nine services visible and understandable.
6. **Local & established** tone; every section ends in a clear next step; no dead ends.

---

## 4. Colour Palette

All colours are CSS custom properties in `scss/abstracts/_variables.scss`. Use tokens —
**never hard-code a hex in a component.** (Values sampled from the Zairoof reference.)

### Brand accent — Amber / Gold

| Token             | HEX       | Use                                             |
| ----------------- | --------- | ----------------------------------------------- |
| `--c-accent`      | `#F8B427` | **Primary CTA, highlights, active state, chips**|
| `--c-accent-600`  | `#E0A014` | Accent hover / pressed                          |
| `--c-accent-soft` | `#FDF1C8` | **Warm feature bands**, soft accent surfaces    |
| `--c-accent-tint` | `rgba(248,180,39,.12)` | Icon chip backgrounds, faint fills |

### Ink & neutrals

| Token          | HEX       | Use                                        |
| -------------- | --------- | ------------------------------------------ |
| `--c-ink`      | `#090909` | **Headings**, dark sections, strongest text|
| `--c-ink-800`  | `#1A1E23` | Dark cards / secondary dark surfaces        |
| `--c-body`     | `#4D4D4D` | **Body text**                              |
| `--c-muted`    | `#8A8A8A` | Captions, meta, placeholders               |
| `--c-white`    | `#FFFFFF` | Base background, cards                      |
| `--c-offwhite` | `#F8F8F8` | Alt light section background                |
| `--c-border`   | `#E7E7E3` | Hairline borders & dividers                |

### Functional aliases

```scss
--bg:        var(--c-white);
--bg-alt:    var(--c-offwhite);
--bg-warm:   var(--c-accent-soft);   // cream feature bands
--bg-dark:   var(--c-ink);           // dark sections (hero scrim, dark bands, footer)
--text:      var(--c-body);
--heading:   var(--c-ink);
--muted:     var(--c-muted);
--line:      var(--c-border);
--action:    var(--c-accent);        // primary button = amber
--on-accent: var(--c-ink);           // text on amber (dark for AA contrast)
--on-dark:   rgba(255,255,255,.82);  // body text on dark sections
```

**Contrast rule (WCAG AA):** `--c-body` on white/cream passes AA. On dark (`--c-ink`) use
`--c-white` / `rgba(255,255,255,.82)`. On amber buttons use **ink text** (`--on-accent`),
never white — white on `#F8B427` fails AA. Ink headings on white/cream pass easily.

---

## 5. Typography System — Zairoof-matched

- **Display / headings:** **Oswald** — condensed, industrial, uppercase. Google Fonts,
  weights **500 / 600 / 700**. Large sizes, tight negative tracking.
- **Body & UI:** **Urbanist** — clean geometric sans. Google Fonts, weights
  **400 / 500 / 600 / 700**.
- Use `display=swap`; `preconnect` to `fonts.googleapis.com` + `fonts.gstatic.com`.

```scss
--font-display: "Oswald", "Arial Narrow", Arial, sans-serif;
--font-body:    "Urbanist", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
```

**Type scale** (fluid `clamp()`, mobile → desktop; matched to Zairoof H1 ~80px / H2 ~72px).
Display headings are **UPPERCASE** with tight tracking; body is sentence case.

| Token          | Size (clamp)                     | Element                | Family  | Weight | Line-height | Tracking | Case      |
| -------------- | -------------------------------- | ---------------------- | ------- | ------ | ----------- | -------- | --------- |
| `--fs-display` | `clamp(2.75rem, 7vw, 5rem)`      | Hero H1                | display | 700    | 1.06        | -0.03em  | UPPERCASE |
| `--fs-h1`      | `clamp(2.4rem, 5.4vw, 4.5rem)`   | Big section H2         | display | 600    | 1.08        | -0.03em  | UPPERCASE |
| `--fs-h2`      | `clamp(2rem, 4vw, 3.25rem)`      | Section H2             | display | 600    | 1.12        | -0.02em  | UPPERCASE |
| `--fs-h3`      | `clamp(1.4rem, 2.2vw, 1.9rem)`   | Card / sub heading     | display | 600    | 1.2         | -0.01em  | UPPERCASE |
| `--fs-h4`      | `1.25rem`                        | Minor heading          | display | 500    | 1.3         | normal   | UPPERCASE |
| `--fs-lead`    | `clamp(1.05rem, 1.4vw, 1.25rem)` | Intro / lead paragraph | body    | 400    | 1.6         | normal   | sentence  |
| `--fs-body`    | `1rem` (16px base; ~18px lead)   | Body                   | body    | 400    | 1.7         | normal   | sentence  |
| `--fs-sm`      | `0.9375rem`                      | Secondary text         | body    | 400    | 1.6         | normal   | sentence  |
| `--fs-xs`      | `0.8125rem`                      | Captions, meta         | body    | 500    | 1.5         | normal   | sentence  |
| `--fs-eyebrow` | `0.8125rem`                      | Eyebrow / kicker       | body    | 600    | 1.4         | 0.22em   | UPPERCASE |

**Heading rules**

- Exactly one `<h1>` (hero). Headings use `--font-display`, `color: var(--heading)`.
- **Eyebrow / kicker:** uppercase, wide `letter-spacing: 0.22em`, amber or muted, small;
  often preceded by a short amber rule/line or an icon.
- Body: `--font-body`, `--c-body`, `max-width ~62ch`.

---

## 6. Spacing System & Layout Grid

**Base unit: 4px.**

| Token      | Value  | Token      | Value   |
| ---------- | ------ | ---------- | ------- |
| `--sp-3xs` | `4px`  | `--sp-lg`  | `32px`  |
| `--sp-2xs` | `8px`  | `--sp-xl`  | `48px`  |
| `--sp-xs`  | `12px` | `--sp-2xl` | `64px`  |
| `--sp-sm`  | `16px` | `--sp-3xl` | `96px`  |
| `--sp-md`  | `24px` | `--sp-4xl` | `140px` |

**Section rhythm:** `--section-y: clamp(4.5rem, 10vw, 8.75rem)` (≈140px desktop, ~72px
mobile). Adjacent dark/cream bands may butt together intentionally (no double padding).

**Container / grid**

- Content max width **1290px** (`--container`); wide variant **1500px**
  (`--container-wide`) for full-bleed image bands; narrow **760px** for prose.
- Inline gutter: `clamp(18px, 4vw, 60px)`.
- 12-column mental model via CSS Grid/Flex + `gap`. Feature splits ~`1fr 1fr` or
  `1.1fr 0.9fr` with large gaps.

---

## 7. Border Radius, Shadows & Elevation

```scss
--r-xs:    8px;   // chips, inputs
--r-sm:    12px;  // buttons, small cards
--r-md:    16px;  // cards
--r-lg:    24px;  // media frames
--r-xl:    32px;  // large image panels
--r-pill:  999px; // pills, round buttons, badges
--r-circle: 50%;
```

**Shadows** — restrained, warm-tinted:

```scss
--sh-sm: 0 2px 10px rgba(9, 9, 9, 0.06);
--sh-md: 0 18px 50px rgba(9, 9, 9, 0.10);
--sh-accent: 0 12px 30px rgba(248, 180, 39, 0.28); // amber glow on primary CTA hover
```

**Elevation:** mostly flat — hairline `--line` borders + whitespace. Reserve `--sh-md` for
the floating quote card, dropdown menu and app bar. Hover lifts images via scale/zoom, and
the primary CTA via a subtle amber glow — not heavy shadow.

---

## 8. Component Styling Guidelines

### Buttons (`.btn`)

- Shape: `--r-sm`/pill, `min-height 54px`, padding `0 32px`, `--font-body` weight 600,
  small size, often **UPPERCASE** with `0.04em` tracking to echo the display type.
- Optional trailing circular **arrow icon** (`.btn__icon`, ↗ / →) — the recurring Zairoof
  motif; rotates/slides on hover.
- **Variants:**
  - `.btn--primary` — **amber bg, ink text**; hover → `--c-accent-600` + `--sh-accent`.
  - `.btn--dark` — ink bg, white text; for light sections.
  - `.btn--light` — white bg, ink text, hairline border; for dark sections.
  - `.btn--ghost` — transparent, `1px` ink/white border; hover fills amber.
- Transition transform/opacity/background `0.35s` cubic ease.

### Forms

- Inputs: white bg, hairline-bordered, `--r-sm`, `min-height 54px`, `--fs-body`. Focus:
  amber border + soft amber ring (`0 0 0 3px var(--c-accent-tint)`). Labels small above.
- Submit = `.btn--primary` full-width on mobile. `aria-live` region for success/error.

### Cards

- **Service card:** amber icon chip + UPPERCASE title + short text + arrow link; hairline
  border, hover lifts border to amber and nudges the arrow.
- **Project card:** rounded image frame (`--r-lg`), overlay caption bottom-left with
  category tag; hover zoom + amber arrow reveal.
- **Why-choose / feature card:** number/check + title + text.
- **Testimonial card:** quote + circular avatar + name/role; used inside a Swiper slider.
- **Blog card:** image + category tag + date + UPPERCASE title + excerpt + read-more.

### Sections (`.section`)

- Padding `--section-y`. Modifiers: `.section--alt` (offwhite), `.section--warm` (cream),
  `.section--dark` (ink bg, light text).
- Header block: small **eyebrow with amber rule** → large UPPERCASE H2 → optional lead + CTA.

### Accordion (FAQ)

- `.accordion__item` with hairline divider; trigger is a `<button>` with
  `aria-expanded`/`aria-controls`; amber `+ / −` (or chevron) icon; smooth height/opacity
  reveal of the panel. One open at a time (optional).

---

## 9. Iconography & Imagery

- **Icons:** minimal line icons, ~1.5–2px stroke, 24px grid, inline SVG (`currentColor`),
  often inside an amber circular chip. Circular arrow is the recurring link/button motif.
- **Imagery:** large, well-lit **Australian roofing / trades** photography in rounded
  frames; consistent aspect ratios (4:5 tall, 16:10 wide). Hover zoom (`scale 1.05`);
  scroll mask-reveal. Explicit `width`/`height`; `loading="lazy"` below the fold, `eager`
  + `fetchpriority="high"` for the hero. Meaningful `alt`.
- Galleries/video open in **Fancybox**; sliders use **Swiper**.
- **Unique-image rule:** **never reuse the same image anywhere on the site.** Every section
  gets its own dedicated visual. Download & organise all unique, royalty-free images into
  `assets/images/<section>/` **before** building that section.

---

## 10. Animation & Interaction — Zairoof signatures

> Smooth, purposeful, warm. **GSAP + ScrollTrigger** for all scroll work.

1. **Scroll reveals.** Text/blocks fade + rise `20–28px`, `0.7–0.9s`, `power3.out`, stagger
   `0.08`. Headings may reveal line-by-line. Trigger once at ~85% viewport.
2. **Count-up stats.** Numbers (years, projects, satisfaction %) count up on first view,
   ~1.2–1.8s ease-out. (Values are placeholder until client-confirmed.)
3. **Service marquee.** Continuous horizontal keyword strip (Roof Installation · Repairs ·
   Restorations · Gutters · Inspections · Skylights) — CSS keyframes, pause on hover,
   mask-faded edges.
4. **Carousels (Swiper).** Services, recent projects, testimonials — with numeric counter
   (e.g. `01/06`), arrow controls, drag/swipe, autoplay w/ pause-on-hover, loop.
5. **Numbered workflow.** 3 steps (01 Consultation → 02 Proposal → 03 Execution) reveal in
   sequence; the active step's amber accent animates in.
6. **Image mask reveal.** Media scales `1.08→1` and/or unclips (`clip-path` inset) on enter.
7. **Hover zoom.** Project/showcase images scale `1.05`, `0.6s` ease; card borders warm to
   amber.
8. **FAQ accordion.** Smooth expand/collapse; icon morphs `+ ↔ −`.
9. **Sticky nav.** Transparent over hero (light text) → white bg + hairline + soft shadow
   on scroll (ink text); condenses.
10. **Hero.** Headline reveals on load; background Ken-Burns/parallax subtle; amber video
    play button opens Fancybox.
11. **Performance & a11y:** animate only `transform`/`opacity`/`clip-path`. Honour
    `prefers-reduced-motion` — show all content, disable transforms/marquee/count-up/autoplay.

---

## 11. Responsive Breakpoints & Mobile-First

```scss
$bp-sm:  480px;
$bp-md:  768px;
$bp-lg:  1024px;
$bp-xl:  1280px;
$bp-2xl: 1440px;
```

`respond-to()` (min-width) and `respond-below()` (max-width) mixins in `_breakpoints.scss`.

**Rules**

- Base styles target ~360–414px phones; single column `< md`.
- Tap targets ≥ 44×44px; primary mobile CTAs full-width & thumb-reachable.
- Desktop 140px section padding compresses to ~72–96px on mobile.
- Nav collapses to a full-screen overlay menu below `lg`. **Mobile app bar** shows below
  `md`.
- Test at 360, 414, 768, 1024, 1280, 1440.

---

## 12. Mobile Experience — "Smart App" Style

- **Sticky bottom app bar** (`.appbar`, mobile-only): Home · Services · **Call FAB**
  (centre, elevated, amber) · Quote · Contact. `env(safe-area-inset-bottom)` padded; body
  gets matching bottom padding so content never hides behind it.
- **App top bar:** compact, white/blur on scroll, wordmark + menu button.
- App feel: rounded corners, card blocks, 48px+ targets, snappy `:active` states, optional
  snap-scroll carousels, momentum. Light, tactile motion; respect reduced-motion.
- Desktop unaffected — mobile enhancements layer via `respond-below(md)`.

---

## 13. File & Folder Structure

```
kaluta-bro-roofing/
├── index.html
├── CLAUDE.md
├── package.json                    # sass build scripts
├── .gitignore
├── assets/
│   ├── css/  style.css             # COMPILED, minified — never hand-edit
│   ├── js/   main.js               # ES6 module
│   └── images/                     # unique, organised per section (see §9)
│       ├── hero/  about/  services/  projects/  testimonials/  blog/
│       ├── favicon.svg  og-image.jpg
├── scss/
│   ├── main.scss                   # @forward-only entry
│   ├── abstracts/  _variables _breakpoints _functions _mixins
│   ├── base/       _reset _typography _global _utilities
│   ├── layout/     _container _header _footer
│   ├── components/ _buttons _cards _forms _section _marquee _counter _accordion _appbar _modal _badges
│   ├── sections/   _hero _services _about _showcase _why _process _projects _testimonials _blog _faq _cta
│   └── vendor/     _swiper _fancybox
```

- GSAP (+ScrollTrigger), Swiper, Fancybox via **CDN**. Oswald + Urbanist via Google Fonts.
- Edit `scss/` only; recompile to minified `assets/css/style.css`.

---

## 14. Naming Conventions & Coding Standards

- **CSS — BEM:** `.block__el--mod`, lowercase-hyphen, ≤2 nesting levels, state classes
  `.is-*`. Tokens via CSS variables only — **no raw hex/px in components.**
- **SCSS:** `@use`/`@forward` (no `@import`); one concern per partial; `main.scss` only
  forwards. Mixins for repeated patterns; `_variables` holds all tokens.
- **HTML:** semantic HTML5, one `<h1>`, landmarks + `aria-*`, `alt` on every `<img>`,
  kebab-case section ids matching nav anchors, JSON-LD in `<head>`.
- **JS (ES6+):** modules, `const`/`let`, small pure functions, feature-detect & guard
  missing nodes, `camelCase` / `PascalCase` / `UPPER_SNAKE`.
- **Formatting:** 2-space indent, single quotes in JS, ~100 col.

---

## 15. Accessibility & Performance

- WCAG 2.1 AA contrast (see §4 amber rule); visible focus ring; keyboard operable; skip
  link; logical order.
- `aria-expanded/controls` on nav toggle & accordion; `aria-label` on icon buttons;
  `aria-live` on form success; carousels keyboard/swipe accessible with labelled controls.
  Respect `prefers-reduced-motion`.
- Minified CSS; deferred/module JS; CDN libs only as used; right-sized lazy images
  (WebP/AVIF where possible) with explicit dimensions; preconnect font/CDN origins; animate
  only transform/opacity/clip.
- Target sub-3s mobile, Lighthouse ≥ 90 across the board.

---

## 16. Image Optimization Workflow

1. Source **unique**, royalty-free, high-res AU roofing/trades images (Unsplash, Pexels,
   Pixabay) — one per section, none reused.
2. Crop to the section's target aspect ratio; export **WebP** (quality ~78) with a JPG
   fallback for the hero/OG.
3. Right-size: hero ≤ ~1920px wide; cards ≤ ~800px; thumbnails ≤ ~480px. Compress.
4. Always set explicit `width`/`height` (prevent CLS); `loading="lazy"` below the fold,
   `eager` + `fetchpriority="high"` for the hero; descriptive `alt`.
5. Organise into `assets/images/<section>/` before building that section.

---

## 17. Reusable Component Strategy

Composable, content-agnostic components; build once, vary by modifier + content:

- **Section shell** (`.section` + `.section__head` eyebrow/title/lead).
- **Button** (`.btn` + variants + arrow icon).
- **Counter** (`.counter` count-up stat).
- **Marquee** (`.marquee`).
- **Cards:** service, project, why/feature, testimonial, blog.
- **Accordion** (FAQ), **field** (form), **media frame**, **badge/tag**, **app bar**.
- Promote any 4th bespoke instance to a shared component.

---

## 18. Third-Party Libraries

| Library                 | Purpose                                     | Load        |
| ----------------------- | ------------------------------------------- | ----------- |
| **GSAP + ScrollTrigger**| Reveals, count-up, workflow, parallax       | CDN, defer  |
| **Swiper.js**           | Services / projects / testimonials carousels| CDN, defer  |
| **Fancybox**            | Image galleries, hero video, modals         | CDN, defer  |
| **Google Fonts**        | Oswald (display) + Urbanist (body)          | preconnect  |

Init each library in `main.js` behind an existence guard; destroy/disable motion under
`prefers-reduced-motion`. Pin CDN versions.

---

## 19. Development Workflow

**Tooling:** HTML5 + SCSS (Dart Sass via Node) + ES6. Libraries via CDN.

**`package.json` scripts**

```bash
npm install          # dev dependency: sass
npm run dev          # sass --watch scss/main.scss assets/css/style.css --style=expanded --source-map
npm run build        # sass scss/main.scss assets/css/style.css --style=compressed --no-source-map  (production: MINIFIED)
```

Edit `scss/` only; **production CSS must always be minified** (`--style=compressed`).
Recompile & visually verify after every change. Match the reference, mark unverified
content as placeholder, keep markup semantic/accessible, commit small.

**Git:** work only on the current feature branch — **never push or merge to `main`.**

**Definition of done (per section):** semantic markup · tokenised styles · responsive ·
accessible · Zairoof-matched motion · unique images · real content preserved (placeholders
flagged) · ends in a clear next step.

---

## 20. Page Blueprint — `index.html`

Section order mirrors the Zairoof Home-V1, re-themed with Kaluta's real content.

| #   | Section (Zairoof analog)      | Kaluta content                                                                                                   |
| --- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1   | **Nav** (transparent→sticky)  | Wordmark · menu (Services, About, Process, Projects, Contact) · "Get a Quote" · phone · mobile hamburger.        |
| 2   | **Hero** (full-bleed + video) | Amber eyebrow, huge UPPERCASE H1, sub, "Get a Quote"/"Call 0481 157 376" CTAs, amber video play, big roof image. |
| 3   | **Services overview**         | 6 service cards (Installation, Repairs, Restorations, Inspections, Gutters, Skylights) + arrow links.            |
| 4   | **Marquee band**              | Scrolling keyword strip of services.                                                                             |
| 5   | **About**                     | "Experience, craftsmanship & client satisfaction" — copy + framed image + count-up stats (placeholder).         |
| 6   | **Why choose us**             | 4 feature cards: premium materials, expert craftsmanship, residential & commercial, free estimates.             |
| 7   | **Process / workflow**        | 3 numbered steps: 01 Consultation → 02 Proposal → 03 Execution.                                                  |
| 8   | **Services showcase**         | Swiper carousel of key services with imagery + captions.                                                         |
| 9   | **Recent projects**           | Swiper/grid of project cards with category tags (placeholder photos, flagged).                                   |
| 10  | **Testimonials**              | Swiper reviews (placeholder AU homeowners, flagged).                                                             |
| 11  | **Blog / news** (optional)    | 3 blog cards (placeholder posts) — keep only if time permits; else omit.                                         |
| 12  | **FAQ accordion**             | Common roofing questions (materials, areas served, free quote, timelines).                                       |
| 13  | **Quote / CTA**               | "Find your roofing solution with us" — copy + short form (name, phone, suburb, service, message) + call.         |
| 14  | **Footer**                    | Wordmark, contact (address, phone, email), hours, service links, Instagram, JSON-LD note.                       |
| —   | **Mobile app bar**            | Home · Services · **Call FAB** · Quote · Contact.                                                                |

**Contact facts used across the page (real):** Unit 415/91C Grima St, Schofields NSW 2762 ·
0481 157 376 · kalutabroroofing@gmail.com · Instagram @kaluta_bros_roofing_nsw.

---

## 21. Brand Assets & Logo Usage

- **Logo:** none supplied. Use a **temporary wordmark** — "Kaluta Bro Roofing" in
  `--font-display` (Oswald) with a small amber roof mark — flagged `data-placeholder="true"`.
  Provide light-on-dark (nav over hero / dark sections / footer) and dark-on-light
  (nav on scroll) treatments.
- Nav is **transparent over the hero** (light text), turning **white with a hairline** on
  scroll (ink text). Swap the real logo into `assets/images/` + nav/footer partials only.

---

## 22. Quick Reference — Do / Don't

**Do:** use tokens; match Zairoof's bold amber look + motion; build mobile-first; preserve
Kaluta's real content & SEO; flag unverified content as placeholder; use a **unique image
per section**; compile production CSS **minified** (edit `scss/` only); animate only
transform/opacity/clip; honour reduced-motion; keep amber-on-ink / ink-on-amber contrast.

**Don't:** hand-edit `assets/css/style.css`; hard-code hex/px in components; put white text
on amber; reuse any image; present placeholder reviews/stats/licences as real; copy
Zairoof's proprietary images or verbatim copy; push/merge to `main`; add sections beyond §20
without reason.
