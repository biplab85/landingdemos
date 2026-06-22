# CLAUDE.md

Guidance for working in this repository.

## Project

Redesign of **Harrison Fencing and Carpentry** — a family-owned fencing and
carpentry contractor in Australia. We are rebuilding the marketing site from
scratch with a modern, hand-coded front end. Reference (old) site:
https://www.harrisonfencing.com/

**Current task:** build the home page as `indexx.html`, styled with SCSS.

**Design system:** see `design-system/MASTER.md` (authored with the
ui-ux-pro-max ruleset). Read it before building any page; per-page overrides go
in `design-system/pages/<page>.md` and win over MASTER. This CLAUDE.md is the
SCSS-implementation contract; MASTER.md is the design intent — keep them in sync.

### Status
- Fresh repo — no build output yet. The home page (`indexx.html`) is the first
  deliverable, then the inner pages follow.

## Tech stack & conventions

- **Markup:** static HTML5. Home page file is `indexx.html` (per project owner's
  naming — keep this exact name).
- **Styles:** SCSS, compiled to CSS. Use **smart / conditional SCSS** — maps,
  functions, mixins, and `@if`/`@each`/`@for` logic (see "Smart / conditional
  SCSS" below), not flat repetitive rules. Do **not** hand-write `.css` files
  that have a `.scss` source — edit the `.scss` and compile.
- **No CSS framework.** Plain HTML/SCSS. JS is progressive — the site works
  without it. Three vendor libraries are loaded from CDN and used as enhancement
  only (all guarded in `assets/js/main.js`):
  - **GSAP** (+ ScrollTrigger) — hero entrance, scroll reveals, stat counters.
  - **Swiper** — the "Our Work" gallery carousel.
  - **Fancybox v5** (`@fancyapps/ui`) — image popup/preview for gallery photos.
- **Assets live under `assets/`** — compiled CSS in `assets/css/`, scripts in
  `assets/js/`, images in `assets/img/`. Real job photos were pulled from the
  live Wix site (`assets/img/job-1..4.jpg`, `feature.jpg`).
- **Mobile-first, responsive.** This is a local-services site — most visitors are
  on phones looking for a quote. Prioritize fast load and a prominent
  click-to-call CTA.
- **Accessibility:** semantic landmarks, alt text on imagery, sufficient colour
  contrast, focus states, `tel:` links for all phone numbers.

### "Smart" / conditional SCSS — this is the required approach
Do **not** write flat, repetitive SCSS. Drive the styles from data (maps) and
logic (functions, mixins, conditionals). Concretely:

- **Tokens as maps, accessed via functions** — colours, spacing, font sizes, and
  breakpoints live in SCSS maps; expose them through small getter functions so
  components never touch raw hex or magic numbers.
  ```scss
  $colors: ( brand: #2B5E3F, charcoal: #23282D, timber: #C5732B, ... );
  @function color($key) { @return map.get($colors, $key); }   // color(brand)
  $space: ( xs: .25rem, sm: .5rem, md: 1rem, lg: 2rem, xl: 4rem );
  @function space($k) { @return map.get($space, $k); }
  ```
- **Conditional logic with `@if / @else`** — mixins branch on arguments
  (e.g. a `button($variant)` mixin that switches fill/outline/ghost; a
  `section($tone)` mixin that flips text colour when the background is dark).
  Use `@if` to guard against missing map keys and to pick AA-safe text colour.
- **Responsive via a breakpoint mixin**, not scattered raw media queries:
  ```scss
  $breakpoints: ( sm: 480px, md: 768px, lg: 1024px, xl: 1280px );
  @mixin bp($name) {
    @if map.has-key($breakpoints, $name) {
      @media (min-width: map.get($breakpoints, $name)) { @content; }
    } @else { @error "Unknown breakpoint: #{$name}"; }
  }
  // usage: .hero { padding: space(md); @include bp(lg) { padding: space(xl); } }
  ```
- **Loops to generate utilities/variants** — use `@each` / `@for` to emit
  spacing helpers, colour modifiers, and the type scale from the maps instead of
  hand-writing each rule.
- **Math** via `sass:math` (`math.div`, never the deprecated `/`).
- Keep all logic in partials; `main.scss` only orchestrates with `@use`.
- Prefer `@use` / `@forward` over the deprecated `@import`; namespace built-ins
  (`@use 'sass:map'`, `@use 'sass:math'`, `@use 'sass:color'`).

### Project structure (current)
```
indexx.html
/scss
  main.scss            // entry point — only @use-s the partials, no rules
  abstracts/  _tokens _functions _mixins _index   // maps + getters + @if logic
  base/       _reset _typography                   // type scale via @each
  layout/     _utilities _header _footer
  components/ _buttons _hero _stats _sections _services _about
              _locations _vendor _testimonial _cta
/assets
  /css  main.css        // compiled output — DO NOT edit by hand
  /js   main.js         // nav, GSAP, Swiper init, GLightbox init
  /img  job-1..4.jpg feature.jpg   // real photos from the live site
package.json            // sass build scripts
```

### Build
- Compile with Dart Sass (installed as a dev dep): `npm run css`
  (or `npm run watch`, `npm run css:min`). Output → `assets/css/main.css`.
- Dart Sass is required (the module system + `@use 'sass:*'` built-ins). Avoid
  the deprecated `node-sass`/LibSass.
- If a different toolchain (npm scripts, gulp) gets introduced, document it here.

## Brand & content (from the existing site)

**Business:** Harrison Fencing and Carpentry — family-owned fence contractor.
**Tagline:** "I quote the job, I do the job." (transparent pricing, one tradesman
sees the job through — lean into this trust message)
**Primary CTA:** "Call for your free quote today!"
**Tone:** reliable, skilled, friendly, local. Quality workmanship, precision and
care, customer satisfaction.

### Two locations (the site serves both)
- **The Hills Area (Sydney, NSW)** — Anthony Harrison
  - Phone: 0408 207 245 (`tel:0408207245`)
  - Email: anthonyharrisonfencing@gmail.com
  - Address: Unit 28/6 Abbott Rd, Seven Hills NSW 2147
- **Albury-Wodonga** — Jack Harrison
  - Phone: 0430 621 242 (`tel:0430621242`)
- **ABN:** 87 622 683 676
- Facebook & Instagram presence for both locations.

### Services (each is a card/section on the site)
- **Colorbond Fencing** — durable, low-maintenance, many profiles/colours.
- **Timber Fencing** — picket to lapped/paling; treated pine & hardwood, often
  with steel posts for durability.
- **Gates** — custom-fabricated in timber, steel, or aluminium; made to size.
- **Retaining Walls** — treated-timber walls holding back soil on sloped terrain;
  erosion control, levelling, natural look.
- **Pool Fencing** — safety-compliant steel/aluminium panels & colorbond,
  meeting regulatory standards.
- **Repairs** — fix leaning fences, damaged gates, cost-effective remediation.
- (Also mentioned: general carpentry & landscaping.)

### Navigation (old site, for reference)
Get to Know Us · Locations (The Hills Area / Albury-Wodonga) · Services ·
Gallery · Testimonials. The redesign can restructure this — confirm with the
owner before dropping or renaming sections.

### Testimonials
- **Ben T (Lalor Park)** — 2.7m custom-ratio gate. Praised professionalism,
  craftsmanship, communication, fair pricing, and finishing on time through a
  heat wave. Recommends them.

### Suggested home-page sections
1. Header with logo + nav + prominent click-to-call.
2. Hero: tagline, value prop, "Free quote" CTA, strong fencing imagery.
3. Services grid (the six services above).
4. Why choose us / about (family-owned, "I quote the job, I do the job").
5. Locations (two branches with contacts + service areas).
6. Gallery preview.
7. Testimonials.
8. Contact / final CTA (phone, email, free-quote prompt).
9. Footer: contacts, ABN, social links.

## Design direction
Rugged but clean. Trade/construction identity that reads trustworthy and local —
not the plain whites/greys of the old site. Tones nod to Colorbond steel
(charcoal), Australian outdoors (eucalypt green), and natural timber (warm
amber). Mobile-first, generous spacing, strong photography of completed jobs.

### Colour palette (define in `_variables.scss`)
Primary brand is the eucalypt green; charcoal anchors dark sections and
headings; timber amber is the warm accent. All foreground/background pairs below
meet WCAG AA (4.5:1) for the use noted.

| Token            | Hex       | Use                                                   |
|------------------|-----------|-------------------------------------------------------|
| `$brand`         | `#2B5E3F` | Primary — buttons, links, key accents (white text OK) |
| `$brand-dark`    | `#224B32` | Hover/active for primary                              |
| `$charcoal`      | `#23282D` | Dark sections, footer, headings (Colorbond "Monument")|
| `$timber`        | `#C5732B` | Warm accent — icons, underlines, highlights           |
| `$timber-dark`   | `#A85D1E` | Timber as text on light (passes AA for small text)    |
| `$steel`         | `#6B7280` | Secondary text, captions                              |
| `$line`          | `#E5E7EB` | Borders, dividers, hairlines                          |
| `$bg`            | `#F7F6F3` | Page background (warm off-white "paper")              |
| `$surface`       | `#FFFFFF` | Cards, panels                                         |
| `$ink`           | `#2A2E33` | Body text on light                                    |
| `$ink-muted`     | `#5B6168` | Muted/supporting body text                            |
| `$on-dark`       | `#F4F5F3` | Text on charcoal/brand backgrounds                    |

Usage notes:
- **Primary CTA** = `$brand` fill + white text (the safest high-contrast pair).
  Reserve `$timber` for accents (icon, hover detail, section eyebrow), not small
  body text — use `$timber-dark` if amber text must sit on white.
- Map these to semantic names too (`$color-primary`, `$color-surface`, etc.) so
  components never reference raw hex.

### Typography (Google Fonts — `font-display: swap`)
Industrial heading + clean neutral body — common, reliable trade pairing.
- **Headings:** **Oswald** (600/700). Condensed, sturdy, construction feel. Use
  uppercase + letter-spacing for small section "eyebrow" labels.
- **Body / UI:** **Inter** (400/500/600). Highly legible at all sizes, neutral.
- Alternative pairing if Oswald feels too tall: **Archivo** (headings) + **Source
  Sans 3** (body).
- Stacks:
  - `$font-head: 'Oswald', 'Arial Narrow', system-ui, sans-serif;`
  - `$font-body: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;`
- Type scale (rem): 0.75 0.875 1 1.125 1.25 1.5 2 2.5 3.25. Body 16px min on
  mobile, line-height 1.6 for body / 1.15 for display headings.

These are starting tokens — confirm colours, fonts, and logo with the owner.
Keep everything centralised in `_variables.scss` so a rebrand is one place to change.

## Working agreements
- Keep content factual to the business — don't invent services, reviews, or
  certifications that aren't confirmed.
- Phone numbers and email must always be real and `tel:`/`mailto:` linked.
- When unsure about brand decisions (palette, copy, which sections to keep),
  ask the owner rather than guessing.
