# Sloan Electrical — Homepage Redesign Task

> **Scope:** Rebuild only `index.html` (single-page) for Sloan Electrical with a premium, modern, high-end professional design while preserving the brand's trust-led identity.

---

## 1. Brand Identity & Voice (preserve)

- **Company:** Sloan Electrical
- **Owner:** Jeremy Sloan — 15+ years experience
- **Tagline:** *"Your Trusted Local Electrician"*
- **Mission:** *"Giving You Peace Of Mind With Your Electrical Needs"*
- **Voice:** Trust-led, plain-spoken, locally rooted. Quietly confident — no hype.
- **Trust pillars:** Licensed, transparent pricing, punctual, 24/7, hospital-grade work.

---

## 2. Visual Design Direction

### Aesthetic
Sleek Australian service-business premium — think a blend of luxury Aesop-style restraint with the structured confidence of a high-end trades brand. Editorial spacing, generous whitespace, cinematic photography, refined micro-details.

### Color Palette (proposed)
| Token | Hex | Usage |
|---|---|---|
| `--ink` | `#0A0E12` | Primary text, deep backgrounds |
| `--charcoal` | `#1A1F26` | Section bg, cards |
| `--brass` | `#C8A24B` | Accent — premium gold/amber (electricity warmth) |
| `--brass-soft` | `#E5C77A` | Highlight, hover glow |
| `--cream` | `#F7F4ED` | Light section bg |
| `--bone` | `#FBFAF6` | Default page bg |
| `--mist` | `#E8E6DF` | Borders, dividers |
| `--slate` | `#5A6470` | Secondary text |

### Typography
- **Display/Headings:** "Fraunces" or "Canela" style serif — editorial, confident, slight contrast.
- **Body/UI:** "Inter" or "Söhne" — neutral, premium, highly legible.
- **Mono accent:** "JetBrains Mono" for small caps badges, numbers, codes.
- **Tracking:** Tight on display (-0.02em), wide on small caps (+0.18em).

### Spatial System
- 8pt baseline grid
- Container max-width: 1280px (with 1440px wide variant for hero)
- Section vertical rhythm: 120–160px desktop, 72–96px mobile
- Card padding: 32px / 40px

---

## 3. Page Architecture (sections, top → bottom)

### 3.1 Sticky Navigation
- Transparent on hero, transforms to glass blur + subtle border on scroll
- Logo (left), nav links (center): About · Residential · Commercial · Emergency · Contact
- Right: phone (with brass underline animation), CTA pill "Request Quote"
- Mobile: morphing hamburger → full-screen menu with staggered link reveal

### 3.2 Hero — Cinematic
- Full-viewport-height with editorial split layout
- Left: oversized serif headline — *"Trusted electrical work, done with quiet excellence."*
- Sub: *"Inner West Melbourne. Licensed A-Grade. 15 years. 24/7."*
- Two CTAs: primary "Request a Quote" (brass), ghost "Call 0406 876 849"
- Right: layered visual — hero photograph with masked SVG accent + floating trust card (rating + emergency badge)
- Subtle parallax on background, content fades up on load
- Animated marquee strip below: trust signals (Licensed · A-Grade · 24/7 · Upfront Pricing · Hospital-Grade · Inner West Melbourne)

### 3.3 Trust Bar
- Slim horizontal row of marks: license #, years in service (15+), suburbs served (60+), response time (24/7)
- Each stat counts up on scroll into view
- Hairline brass divider top + bottom

### 3.4 Services — Three Pillars (Residential · Commercial · Emergency)
- Three premium cards in an editorial grid
- Each card: large numeric label (01/02/03), serif title, summary, key services bullet list, hover state revealing "Explore →" with magnetic cursor effect
- Subtle layered backgrounds, glass blur overlays, image masks
- Stagger on scroll-in

### 3.5 Why Sloan — Differentiators
- 2-column layout: left = anchor headline with brass keyword highlight, right = vertical list of differentiators
- Differentiators (icon + headline + 1-line):
  1. Operates in hospital operating theatres
  2. Fully-licensed A-Grade female electrician on team
  3. Street-to-premise connection specialists (rare)
  4. Upfront written quotes — no hidden fees
  5. SMS reminders + guaranteed on-time arrival
  6. Same-day 24/7 emergency response
- Each row reveals with horizontal sweep on scroll

### 3.6 Process — How We Work
- 4-step horizontal timeline: Enquiry → Quote → Work → Sign-off
- Each step: number, short title, one-sentence detail
- Brass progress line draws across as user scrolls section
- Sticky scroll-pin variant on desktop

### 3.7 Commercial Capability Showcase
- Editorial photo collage / asymmetric grid highlighting commercial depth
- Industries served chips: Healthcare · Retail · Industrial · Office · Distribution
- Quote-style callout about hospital-grade work

### 3.8 Service Area — Inner West Melbourne
- Stylized map illustration (SVG, monochrome with brass accents) showing 4 LGAs
- Suburb chips animate in on hover over each LGA region
- Side panel: 4 LGAs listed (Brimbank · Hobsons Bay · Maribyrnong · Moonee Valley) + suburb count

### 3.9 Testimonial / Quiet Proof
- Single large pull-quote, serif italic, brass accent quote mark
- Soft layered background, gentle parallax on quote mark
- Carousel of 3–5 quotes with refined dot pagination

### 3.10 Emergency CTA Band
- Dark ink section, full-width, with subtle animated electrical line motif (faint sparking SVG path)
- "Power's out? We answer 24/7." → brass phone CTA pulsing softly
- Reinforces same-day response promise

### 3.11 FAQ (short — 5 questions)
- Refined accordion with serif questions, smooth height transitions
- Brass `+ / —` toggle, no heavy chrome

### 3.12 Final CTA / Quote Form Preview
- Two-column: left = headline + value prop, right = compact quote form (name, suburb, service, message) with floating labels
- Form has glass blur background + subtle inner glow on focus
- Confidence-building micro-copy under submit: *"We reply within 1 business hour."*

### 3.13 Footer
- Premium dark footer, multi-column
- Brand block (logo + short positioning statement)
- Quick links · Services · Service area · Contact (with QR code echo)
- License + ABN line (placeholder), Privacy · Terms
- Subtle scroll-to-top brass dot

---

## 4. Motion & Interaction Spec

### Library choice
- Lightweight: vanilla CSS + small JS (Intersection Observer + Lenis for smooth scroll)
- Optionally GSAP CDN for orchestration if needed for hero/timeline. Default = pure CSS + IO observers to keep page fast.

### Motion principles
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` (premium ease-out-quart) as default
- **Duration:** 400–700ms typical; nothing snappier than 200ms or slower than 900ms
- **Stagger:** 60–90ms between siblings
- **Respect:** `prefers-reduced-motion` — disable parallax, soften fades

### Specific interactions
- **Smooth scroll:** Lenis CDN (or pure CSS `scroll-behavior` fallback)
- **Hero parallax:** background image translates 0 → -60px on scroll
- **Scroll reveals:** opacity 0 → 1, translateY 24px → 0, stagger by group
- **Count-up stats:** lerp on intersect
- **Magnetic CTA buttons:** subtle 6–8px pull toward cursor on desktop
- **Hover on cards:** lift 4px, brass border activates, internal arrow translates
- **Nav transform:** transparent → glass(blur 14px) + 1px brass-tinted border on scroll past 80px
- **Process timeline:** brass line `stroke-dashoffset` animates as section progresses
- **Emergency band:** faint SVG sparking line loops on infinite slow animation
- **FAQ accordion:** height + opacity transition with crossfade icon rotate
- **Cursor (desktop only):** optional subtle custom dot following cursor near interactive elements

---

## 5. Technical Requirements

### Stack
- Single `index.html` (semantic, self-contained markup)
- **Styling: SCSS** — compiled to a single minified `assets/css/main.css`
- Vanilla JS in `assets/js/main.js` for interactions (no framework)
- CDN allowed: Google Fonts, Lenis (optional), GSAP (optional, only if needed)
- Reuse existing `/images/` assets — pick the strongest 8–12 photos that match the premium aesthetic
- Reuse `images/logo.png` for branding
- Lighthouse target: 90+ across Performance, Accessibility, Best Practices, SEO
- Mobile-first responsive: 360 / 768 / 1024 / 1280 / 1440 breakpoints
- Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- ARIA labels on icon buttons, accordion, nav toggle
- Lazy-load images below the fold
- Preload hero image + key fonts
- Meta: title, description, OG tags, canonical, favicon

### SCSS Architecture (7-1 inspired, trimmed)

```
assets/
└── scss/
    ├── main.scss                  # single entry — forwards everything
    ├── abstracts/
    │   ├── _variables.scss        # colors, type scale, spacing, motion tokens
    │   ├── _mixins.scss           # media-queries, fluid-type, container, focus-ring
    │   ├── _functions.scss        # rem(), clamp helpers
    │   └── _index.scss
    ├── base/
    │   ├── _reset.scss            # modern reset
    │   ├── _typography.scss       # heading scale, body, links
    │   ├── _global.scss           # html/body, ::selection, scrollbar
    │   └── _index.scss
    ├── layout/
    │   ├── _container.scss
    │   ├── _grid.scss
    │   ├── _header.scss           # sticky nav
    │   ├── _footer.scss
    │   └── _index.scss
    ├── components/
    │   ├── _button.scss
    │   ├── _card.scss
    │   ├── _badge.scss
    │   ├── _marquee.scss
    │   ├── _accordion.scss
    │   ├── _form.scss
    │   ├── _nav.scss
    │   └── _index.scss
    ├── sections/
    │   ├── _hero.scss
    │   ├── _trust-bar.scss
    │   ├── _services.scss
    │   ├── _why.scss
    │   ├── _process.scss
    │   ├── _commercial.scss
    │   ├── _service-area.scss
    │   ├── _testimonials.scss
    │   ├── _emergency-cta.scss
    │   ├── _faq.scss
    │   ├── _quote.scss
    │   └── _index.scss
    └── utilities/
        ├── _animations.scss       # keyframes + reveal classes
        ├── _helpers.scss          # visually-hidden, no-scroll
        └── _index.scss
```

### Compilation
- Sass compiled via Dart Sass (CLI) or VS Code Live Sass Compiler
- Output: `assets/css/main.css` (expanded for dev, compressed for production)
- Source map enabled in dev

### Mandatory file header (every `.scss` file)

Every SCSS file — partials and entry alike — **must** begin with the following comment block before any code:

```scss
// ─────────────────────────────────────────────────────────────
// Designed & developed by
// Biplab Kumar Paul — Web Designer & Developer
// Mobile: 01735 927356
// Email:  biplab.cse.85@gmail.com
// ─────────────────────────────────────────────────────────────
```

- Block uses `//` line comments so it is stripped automatically from the compressed CSS output (no visible leak to production).
- Header appears as the very first content of the file; no blank lines above it.
- One blank line below the block, then a second comment indicating the file's purpose (e.g. `// abstracts/_variables.scss — design tokens`).

---

## 6. Accessibility

- Color contrast AA minimum (AAA on body text)
- Focus rings: brass 2px outline + 2px offset on all interactive
- Keyboard navigation across nav, accordion, form, CTAs
- `prefers-reduced-motion` honored — disables parallax/marquee/heavy stagger
- Alt text on all imagery
- Form labels properly associated; error states announced

---

## 7. Content Source of Truth

All copy derived from the existing site:
- Contact: 0406 876 849 · admin@sloanelectrical.com · 87 Cypress Ave, Brooklyn, VIC
- Hours: 24/7
- Service area: Brimbank, Hobsons Bay, Maribyrnong, Moonee Valley (60+ suburbs)
- Services: Residential · Commercial · Emergency (24/7)
- Differentiators per section 3.5 above

---

## 8. Build Steps (execution order)

1. **Scaffold** `index.html` with semantic structure, meta, font preloads
2. **Set up SCSS architecture** — create folder tree (abstracts / base / layout / components / sections / utilities), `main.scss` entry, configure Sass compile to `assets/css/main.css`. Add the mandatory Biplab Kumar Paul header to every partial as it is created.
3. **Design tokens** — `abstracts/_variables.scss` (colors, type scale, spacing, motion) + matching CSS custom properties exposed on `:root`
4. **Base layout** — container, grid, typography rules
5. **Navigation** + mobile menu
6. **Hero** with parallax + entry animation
7. **Trust bar** with count-up stats
8. **Services pillars** cards + hover states
9. **Why Sloan** differentiators
10. **Process** timeline with scroll-progress
11. **Commercial showcase** asymmetric grid
12. **Service area** map + LGA chips
13. **Testimonials** carousel
14. **Emergency CTA band** with sparking SVG
15. **FAQ** accordion
16. **Final CTA / quote form**
17. **Footer**
18. **Motion layer** — IO observers, smooth scroll, magnetic CTAs, reveal sequencer
19. **Polish pass** — responsive QA, reduced-motion, accessibility, performance
20. **Visual review** — open in browser, screenshot, iterate on hierarchy/spacing

---

## 9. Definition of Done

- Homepage renders cleanly at 360 / 768 / 1024 / 1280 / 1440
- All animations respect reduced-motion
- All CTAs functional (tel:, mailto:, form submits to placeholder action)
- No console errors
- Visual hierarchy makes the trust + 24/7 + licensed messages unmissable in the first viewport
- Feels distinctly more premium than the current site while remaining authentically a local Australian electrician — not corporate-cold, not over-designed
