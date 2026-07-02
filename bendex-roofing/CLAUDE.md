# Bendex Roofing — Design & Development Guidelines

> The single source of truth for the **Bendex Roofing Pty Ltd** website. Read this
> before writing any markup, style, or script. Every visual and code decision should
> trace back to a rule in this document. If something here is wrong or missing, update
> **this file first**, then the code.

## Reference site is:: https://linoxa.webflow.io/home-one

We are matching the **Linoxa** template's UI and motion **as closely as possible** — its
light, minimal, editorial-architecture look; its section rhythm; and its signature
animations (rolling number counters, marquee strips, button text slide-on-hover, image
mask reveals). We reproduce the **design language and layout**, writing our **own** markup,
styles, scripts and placeholder content for **Bendex Roofing** — we do not copy Linoxa's
proprietary images or copy text verbatim.

---

## 0. Project Status & Content Reality

**Bendex Roofing Pty Ltd** is a brand-new project. We have **only the company name** — no
existing website, copy, logo, photography, phone number, service area or reviews.
Everything on the page is **realistic Australian placeholder content** a real owner can
later swap for their own.

**Placeholder rules**

- All invented copy, stats, reviews, phone numbers, ABN/licence numbers, suburbs and
  images carry `data-placeholder="true"` and an adjacent HTML comment
  (`<!-- PLACEHOLDER: replace with real ... -->`).
- Never present placeholder testimonials, licence numbers or ratings as verified.
- Safe placeholder contact values: phone `1300 000 000`, email
  `hello@bendexroofing.com.au`, ABN `00 000 000 000`.
- Images are stand-ins (roofing/architecture stock via a placeholder service) with
  meaningful `alt`; a comment notes the client supplies real job photography.

**Scope of this phase:** the **`index.html` page only**. Architect tokens/components/
partials so extra pages can be added later with **zero refactoring**.

---

## 1. Project Overview & Objectives

**Bendex Roofing** — a premium, local **Australian roofing company**: restorations,
replacements, repairs, metal (Colorbond) & tile roofing, gutters, and storm-damage work.

**Objectives**

1. **Win the enquiry.** A "Get a quote" / call action reachable from any scroll position.
2. **Build instant trust.** Lead with experience, licensing, insurance, warranty and real
   job photos.
3. **Communicate full scope.** Present every service clearly.
4. **Feel premium & architectural.** Match Linoxa's calm, high-end, editorial minimalism —
   confident whitespace, huge quiet headings, refined motion.
5. **Convert.** Every section ends in a clear next step.
6. **Perform.** Sub-3-second mobile load, mobile-first, accessible.

---

## 2. Design Philosophy — Linoxa-matched

> **Minimal · Editorial · Architectural · Calm · Premium.**

- **Quiet confidence.** Huge, light-weight display headings; small, calm body text; vast
  whitespace. Nothing shouts.
- **Light & airy.** White and warm-cream surfaces dominate; navy is the grounding dark
  used for a couple of feature sections only.
- **Editorial grid.** Wide, near-full-bleed container; big image blocks; generous vertical
  rhythm (~140px section padding on desktop).
- **Motion is the signature.** Rolling odometer counters, horizontal marquee strips,
  button labels that slide on hover, and images/text that mask-reveal on scroll — subtle,
  smooth, never flashy.
- **Mobile is the default.** Design the small screen first; the desktop is the enhanced,
  more spacious version.

---

## 3. Design Direction & UX Principles

**Direction — "Editorial Warm-Neutral" (Linoxa palette)**

- A near-monochrome system: **white → warm cream → navy**, with an **ink** near-black for
  headings and a mid **grey** for body copy. One optional **terracotta** accent used very
  sparingly (a roofing-appropriate nod), never dominating.
- Big architectural roofing photography in tall/− wide framed blocks with rounded corners.
- Type does the work: size and weight contrast, not colour.

**UX principles (AU homeowner's checklist), delivered the Linoxa way**

1. **Persistent quote/call.** Nav "Get a quote" always visible; mobile app-style bar.
2. **Trust early.** Experience counter, "trusted on N+ roofs", licensed & insured.
3. **Free-quote hook** repeated calmly through the page.
4. **Short quote form** (name, phone, suburb, service, message).
5. **Service transparency.** All services visible and understandable.
6. **Local & established** tone; no dead ends.

---

## 4. Visual Style Guidelines

- **Layout:** wide editorial container (max ~1600–1790px) with small gutters; asymmetric
  splits (text + tall image), full-bleed image bands, overlapping counters.
- **Density:** very generous. Desktop section padding ~120–140px; large heading margins.
- **Colour use:** white base; **cream** for warm feature bands; **navy** for one or two
  dark feature sections (showcase/services) with light text; ink headings, grey body.
- **Imagery:** large, calm, well-lit roofing/architecture shots in `--r-lg`/`--r-xl`
  rounded frames; subtle zoom on hover; mask/clip reveal on scroll.
- **Texture & depth:** almost flat. Hairline borders, very soft shadows only where needed.
  No heavy gloss. Depth comes from whitespace and scale, not shadow.
- **Tone of voice:** calm, assured, plain-spoken Australian. Understated expertise.

---

## 5. Colour Palette

All colours are CSS custom properties (`scss/abstracts/_variables.scss`). Use tokens —
**never hard-code a hex in a component.**

### Core neutrals

| Token           | HEX       | Use                                                |
| --------------- | --------- | -------------------------------------------------- |
| `--c-white`     | `#FFFFFF` | Base background, cards                              |
| `--c-offwhite`  | `#F8F8F8` | Alt light section background                        |
| `--c-cream`     | `#FCF2E8` | **Warm feature bands** (overview sections)          |
| `--c-cream-200` | `#F4E6D6` | Cream borders / nested warm surfaces                |
| `--c-ink`       | `#111111` | **Headings**, strongest text                        |
| `--c-body`      | `#525252` | **Body text**                                       |
| `--c-muted`     | `#8A8A8A` | Captions, meta, placeholders                        |
| `--c-border`    | `#E7E7E3` | Hairline borders & dividers                         |

### Navy (dark feature sections)

| Token           | HEX       | Use                                                |
| --------------- | --------- | -------------------------------------------------- |
| `--c-navy-900`  | `#0B1626` | Deepest navy                                        |
| `--c-navy`      | `#0F1E36` | **Dark section background** (showcase/services)     |
| `--c-navy-700`  | `#1B2E4A` | Navy cards, hovered dark surfaces                   |
| `--c-navy-600`  | `#2A3F5F` | Borders/dividers on navy                            |

### Accent — Terracotta (very sparing)

| Token             | HEX       | Use                                              |
| ----------------- | --------- | ------------------------------------------------ |
| `--c-accent`      | `#C6633C` | Rare highlight — active dot, small emphasis      |
| `--c-accent-soft` | `#E7A17E` | Accent on navy backgrounds                       |

### Functional aliases

```scss
--bg:        var(--c-white);
--bg-alt:    var(--c-offwhite);
--bg-warm:   var(--c-cream);
--bg-dark:   var(--c-navy);
--text:      var(--c-body);
--heading:   var(--c-ink);
--muted:     var(--c-muted);
--line:      var(--c-border);
--action:    var(--c-navy);     // primary button = navy
```

**Contrast rule:** WCAG AA. Body `--c-body` on white/cream passes AA. On navy use
`--c-white` / `rgba(255,255,255,.72)`. Ink headings on cream/white pass easily.

---

## 6. Typography System — Linoxa-matched

- **Display / headings:** **Nohemi** — geometric, modern, slightly condensed. Loaded via
  CDN (cdnfonts). Used at light-to-medium weights (400–600) at large sizes.
- **Body & UI:** **Inter** (Google Fonts), weights 400–600.
- **Fallback:** `Nohemi, "Arial Narrow", Arial, sans-serif` (display);
  `Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif` (body).

```scss
--font-display: "Nohemi", "Arial Narrow", Arial, sans-serif;
--font-body:    "Inter", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
```

> If Nohemi fails to load, the display face falls back gracefully. Load Nohemi weights
> `400, 500, 600`; Inter `400, 500, 600`. Use `display=swap`; preconnect to font origins.

**Type scale** (fluid, `clamp()` — mobile → desktop). Matched to Linoxa (H1 ~80px,
H2 ~45px):

| Token          | Size (clamp)                       | Element                | Family  | Weight | Line-height | Tracking |
| -------------- | ---------------------------------- | ---------------------- | ------- | ------ | ----------- | -------- |
| `--fs-display` | `clamp(3rem, 6.2vw, 5rem)`         | Hero H1                | display | 400    | 1.04        | -0.01em  |
| `--fs-h1`      | `clamp(2.5rem, 4.6vw, 3.5rem)`     | Big section H2         | display | 500    | 1.1         | normal   |
| `--fs-h2`      | `clamp(2rem, 3.4vw, 2.8rem)`       | Section H2 (~45px)     | display | 500    | 1.15        | 0.01em   |
| `--fs-h3`      | `clamp(1.4rem, 2vw, 1.75rem)`      | Card / sub heading     | display | 500    | 1.2         | normal   |
| `--fs-h4`      | `1.2rem`                           | Minor heading          | display | 500    | 1.3         | normal   |
| `--fs-lead`    | `clamp(1.05rem, 1.4vw, 1.25rem)`   | Intro / lead paragraph | body    | 400    | 1.6         | normal   |
| `--fs-body`    | `1rem` (16px base)                 | Body                   | body    | 400    | 1.7         | normal   |
| `--fs-sm`      | `0.9375rem`                        | Secondary text         | body    | 400    | 1.6         | normal   |
| `--fs-xs`      | `0.8125rem`                        | Captions, meta         | body    | 500    | 1.5         | normal   |
| `--fs-eyebrow` | `0.8125rem`                        | Eyebrow (letter-spaced)| body    | 500    | 1.4         | 0.28em   |

**Heading rules**

- One `<h1>` (hero). Headings use `--font-display`, `color: var(--heading)`.
- Headings are **sentence case**, light/medium weight, large — the Linoxa signature.
- **Eyebrow / kicker:** uppercase, wide `letter-spacing: 0.28em`, `--c-muted` or
  `--c-ink`, small; often preceded by a short rule/line.
- Body: `--font-body`, `--c-body`, `max-width ~62ch`.

---

## 7. Spacing System & Layout Grid

**Base unit: 4px.**

| Token       | Value   | Token       | Value   |
| ----------- | ------- | ----------- | ------- |
| `--sp-3xs`  | `4px`   | `--sp-lg`   | `32px`  |
| `--sp-2xs`  | `8px`   | `--sp-xl`   | `48px`  |
| `--sp-xs`   | `12px`  | `--sp-2xl`  | `64px`  |
| `--sp-sm`   | `16px`  | `--sp-3xl`  | `96px`  |
| `--sp-md`   | `24px`  | `--sp-4xl`  | `140px` |

**Section rhythm:** vertical padding `clamp(4.5rem, 10vw, 8.75rem)` (`--section-y`, ≈140px
desktop). Dark/cream bands can butt together intentionally (no double padding).

**Container / grid**

- Max content width **1600px** (`--container`); wide variant **1790px**
  (`--container-wide`) for full-bleed image bands; narrow **760px** for prose.
- Inline gutter: `clamp(18px, 4vw, 60px)`.
- 12-column mental model via CSS Grid/Flex + `gap`. Feature splits are ~`1fr 1fr` or
  `1.1fr 0.9fr` with large gaps.

---

## 8. Border Radius, Shadows & Elevation

```scss
--r-xs:  10px;   // chips, inputs
--r-sm:  14px;   // buttons (Linoxa uses soft, near-pill on small / rounded on large)
--r-md:  18px;   // cards
--r-lg:  24px;   // media frames
--r-xl:  32px;   // large image panels
--r-pill:999px;  // pills, round buttons
--r-circle:50%;
```

**Shadows** — minimal:

```scss
--sh-sm: 0 2px 10px rgba(17,17,17,.05);
--sh-md: 0 18px 50px rgba(17,17,17,.08);
```

**Elevation:** mostly flat. Use hairline `--line` borders + whitespace. Reserve `--sh-md`
for the floating quote card and menu. Hover lifts images via scale/zoom, not shadow.

---

## 9. Component Styling Guidelines

### Buttons (`.btn`) — Linoxa slide-label

- Shape: `--r-sm`/pill, `min-height 52px`, padding `0 30px`, `--font-body` weight 500,
  small size, no text-transform.
- **Signature hover:** the label is duplicated in a masked track; on hover the current
  label slides up and out while the duplicate slides in from below (`.btn__label` inside
  `.btn__labels` with `overflow:hidden`).
- **Variants:**
  - `.btn--primary` — navy bg, white text; hover keeps navy, plays label slide.
  - `.btn--light` — white bg, ink text, hairline border; for dark sections.
  - `.btn--ghost` — transparent, `1px` ink border; hover fills navy.
  - Optional trailing circular arrow icon (`.btn__icon`).
- Transition on transform/opacity; `0.4s` cubic ease.

### Forms

- Inputs: transparent/white bg, **underline or hairline-bordered** minimal style,
  `min-height 52px`, `--fs-body`. Focus: ink/navy border + soft ring. Labels small above.

### Cards

- **Project/showcase card:** rounded image frame (`--r-lg`), title + meta beneath or
  overlaid; hover zoom on the image.
- **Capability/list item:** number or check + title + text, hairline divider between rows.
- **Testimonial:** quote + author; used in a Swiper slider.

### Sections (`.section`)

- Padding `--section-y`. Modifiers: `.section--alt` (offwhite), `.section--warm` (cream),
  `.section--dark` (navy, light text).
- Header block: small **eyebrow with rule** → large H2 → optional lead + CTA.

---

## 10. Iconography & Imagery

- **Icons:** minimal line icons, ~1.5px stroke, 24px grid, inline SVG (`currentColor`).
  Circular arrow (↗ / →) is the recurring motif for links/buttons.
- **Imagery:** large calm roofing/architecture photos, rounded frames, consistent aspect
  ratios (4:5 tall, 16:10 wide). Hover zoom; scroll mask-reveal. Explicit dimensions,
  `loading="lazy"` below the fold, `eager` for hero. Meaningful `alt`.
- Galleries open in **Fancybox**; sliders use **Swiper**. Placeholder images until real
  photos exist.

---

## 11. Animation & Interaction — Linoxa signatures

> Smooth, editorial, subtle. **GSAP + ScrollTrigger** for scroll work.

1. **Rolling number counters (odometer).** Stats roll their digits vertically into place on
   first view (e.g. experience years, roofs completed). Implement as stacked digit columns
   that translateY into position, or an eased count-up as fallback. Duration ~1.2–1.8s,
   ease-out.
2. **Marquee strips.** Continuous horizontal scrolling text/keyword bands (CSS keyframes),
   pause on hover, mask-faded edges.
3. **Button label slide.** On hover, button text slides up and a duplicate slides in.
4. **Scroll reveals.** Text fades/rises `20–28px`, `0.7–0.9s`, `power3.out`, stagger
   `0.08`. Headings may reveal line-by-line. Trigger once at ~85% viewport.
5. **Image mask reveal.** Media scales from `1.08→1` and/or unclips (`clip-path` inset)
   as it enters — the calm Linoxa image entrance.
6. **Hover zoom.** Showcase images scale `1.05` on hover, `0.6s` ease.
7. **Sticky nav.** Transparent over hero; on scroll gains white bg + hairline + shadow;
   condenses.
8. **Performance:** animate only `transform`/`opacity` (and `clip-path`). Honour
   `prefers-reduced-motion` — show everything, disable transforms/marquee/counter motion.

---

## 12. Responsive Breakpoints & Mobile-First

```scss
$bp-sm:  480px;
$bp-md:  768px;
$bp-lg:  1024px;
$bp-xl:  1280px;
$bp-2xl: 1440px;
```

`respond-to()` (min-width) and `respond-below()` (max-width) mixins in `_breakpoints.scss`.

**Rules**

- Base styles target ~360–414px phones; single column < `md`.
- Tap targets ≥ 44×44px; primary mobile CTAs full-width & thumb-reachable.
- Desktop 140px section padding compresses to ~72–96px on mobile.
- Nav collapses to a full-screen menu below `lg`. Mobile app bar shows below `md`.
- Test at 360, 414, 768, 1024, 1280, 1440.

---

## 13. File & Folder Structure

```
bendex-roofing/
├── index.html
├── CLAUDE.md
├── package.json
├── .gitignore
├── css/  (style.css — COMPILED, minified; never hand-edit)
├── scss/
│   ├── main.scss                 # forwards all partials
│   ├── abstracts/  _variables _breakpoints _functions _mixins
│   ├── base/       _reset _typography _global _utilities
│   ├── layout/     _container _header _footer
│   ├── components/ _buttons _cards _forms _section _marquee _counter _appbar
│   ├── sections/   _hero _about _showcase _overview _projects _services _cta _quote
│   └── vendor/     _swiper _fancybox
├── js/  main.js                  # ES6 module
└── images/                       # placeholder roofing photos, og, favicons
```

- GSAP, Swiper, Fancybox via **CDN**. Nohemi via cdnfonts, Inter via Google Fonts.
- Edit `scss/` only; recompile to minified `css/style.css`.

---

## 14. Naming Conventions & Coding Standards

- **CSS — BEM**: `.block__el--mod`, lowercase-hyphen, ≤2 nesting levels, state classes
  `.is-*`. Tokens via CSS variables only — no raw hex/px in components.
- **SCSS**: `@use`/`@forward` (no `@import`); one concern per partial; `main.scss` only
  forwards. Mixins for repeated patterns.
- **HTML**: semantic HTML5, one `<h1>`, landmarks + `aria-*`, `alt` on every `<img>`,
  kebab-case section ids matching nav anchors.
- **JS (ES6+)**: modules, `const`/`let`, small pure functions, feature-detect & guard
  missing nodes, `camelCase`/`PascalCase`/`UPPER_SNAKE`.
- **Formatting**: 2-space indent, single quotes in JS, ~100 col.

---

## 15. Accessibility & Performance

- WCAG 2.1 AA contrast; visible focus ring; keyboard operable; skip link; logical order.
- `aria-expanded/controls` on nav toggle; `aria-label` on icon buttons; `aria-live` on
  form success. Respect `prefers-reduced-motion`.
- Minified CSS; deferred/module JS; CDN libs only as used; right-sized lazy images with
  explicit dimensions; preconnect font/CDN origins; animate only transform/opacity/clip.
- Target sub-3s mobile, Lighthouse ≥ 90.

---

## 16. Reusable Component Strategy

Composable, content-agnostic components; build once, vary by modifier + content:

- **Section shell** (`.section` + `.section__head` eyebrow/title/lead).
- **Button** (`.btn` + slide-label + variants + arrow icon).
- **Counter** (`.counter` odometer stat).
- **Marquee** (`.marquee`).
- **Project card**, **capability row**, **testimonial card**, **field**, **media frame**.
- Promote any 4th bespoke instance to a component.

---

## 17. Development Workflow

**Tooling:** HTML5 + SCSS (Dart Sass via Node) + ES6. **GSAP**(+ScrollTrigger),
**Swiper**, **Fancybox** via CDN.

**Scripts** (`package.json`)

```bash
npm install          # sass
npm run dev          # sass --watch, expanded + source map
npm run build        # sass compressed, no source map (production)
```

Edit `scss/` only; recompile & visually verify after every change. Match the reference,
keep content marked as placeholder, keep markup semantic/accessible, commit small.

**Definition of done (per section):** semantic markup, tokenised styles, responsive,
accessible, Linoxa-matched motion, placeholder content marked, ends in a clear next step.

---

## 18. Page Blueprint — `index.html` (Linoxa-matched, roofing content)

Section order mirrors Linoxa's Home-One, re-themed for Bendex Roofing.

| #  | Section (Linoxa analog)        | Bendex content                                                                                      |
|----|--------------------------------|-----------------------------------------------------------------------------------------------------|
| 1  | **Nav** (transparent→sticky)   | Wordmark · menu (Services, About, Work, Process, Areas) · "Get a quote" · mobile hamburger.          |
| 2  | **Hero v1** (full-bleed image) | Spaced eyebrow, huge H1 ("Roofs built to stand the test of time"), sub, 2 CTAs, big roofing image.   |
| 3  | **About v1** (rolling counters)| Stat counters (years, roofs done, satisfaction %), big statement H2 + paragraph + CTA.               |
| 4  | **Showcase v1**                | "Roofs we're proud of" — image showcase (Swiper/grid) with project captions.                         |
| 5  | **Overview v7** (cream)        | "What we do, done properly" — capability list (checkmark rows) + tall image.                         |
| 6  | **Overview v1** (cream)        | Split feature — Colorbond/metal & tile roofing, image + copy + stats.                                |
| 7  | **Showcase v2** (navy)         | Dark projects band — "Recent work" cards on navy, light text.                                        |
| 8  | **Services v2** (navy)         | Dark services list — all roofing services as numbered rows with hover.                               |
| 9  | **Marquee band** (offwhite)    | Big scrolling keyword marquee + "Ready for a roof that lasts?" CTA (Overview v2 analog).             |
| 10 | **Testimonials**               | Swiper reviews (placeholder AU homeowners).                                                          |
| 11 | **Quote / contact**            | Copy + short form (name, phone, suburb, service, message) + call.                                    |
| 12 | **Footer**                     | Big "Stay connected" heading, columns, contact, marquee/social, ABN/licence note (placeholder).      |
| —  | **Mobile app bar**             | Home · Services · Call (FAB) · Quote · Areas.                                                        |

### Hero notes
Full-bleed rounded image (or full-viewport) with light text overlay + scrim; spaced
eyebrow above a large light-weight H1; two buttons (primary navy + light/ghost); a small
scroll cue. Image mask-reveals; headline reveals on load.

### About counters
2–4 odometer stats (e.g. **15+** years, **2,500+** roofs, **98%** satisfaction). Numbers
roll on first view. Beside/under them a large statement heading + paragraph + CTA.

### Marquee band
Continuous keyword strip (Roof Restoration · Colorbond · Leak Repairs · Gutters · Storm
Damage · Ridge Repointing) scrolling; edges mask-faded; pause on hover.

### Testimonials & content
Placeholder AU reviews with `data-placeholder`; never presented as verified. All copy is
placeholder pending client sign-off.

---

## 19. Brand Assets & Logo Usage

- **Logo:** none yet. Use a **temporary wordmark** — "Bendex" in `--font-display` + a small
  roof mark — marked `data-placeholder="true"`. Provide dark-on-light (default nav over
  light) and light-on-dark (over hero image / navy sections / footer) treatments.
- Nav is **transparent over the hero** (light text), turning **white with a hairline** on
  scroll (ink text). Swap in the real logo in `images/` + nav/footer partials only.

---

## 20. Mobile Experience — "Smart App" Style

- **Bottom tab bar** (`.appbar`, mobile-only): Home · Services · **Call FAB** (centre,
  elevated) · Quote · Areas. Safe-area padded; body gets matching bottom padding.
- **App top bar:** compact, white/blur on scroll, wordmark + menu button.
- App feel: rounded corners, card blocks, 48px+ targets, snappy `:active` states, optional
  snap-scroll carousels. Light, tactile motion; respect reduced-motion.
- Desktop unaffected — mobile enhancements layer via `respond-below(md)`.

---

## 21. Quick Reference — Do / Don't

**Do:** use tokens; match Linoxa's light minimal look + motion; build mobile-first; mark
placeholder content; recompile to minified CSS (edit `scss/` only); animate only
transform/opacity/clip; honour reduced-motion.

**Don't:** hand-edit `css/style.css`; hard-code hex/px in components; present placeholder
reviews/licences as real; copy Linoxa's proprietary images or verbatim text; add sections
beyond §18 without reason; overuse the terracotta accent.
