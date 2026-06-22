# Harrison Fencing &amp; Carpentry — Website

A modern, hand-coded marketing site for **Harrison Fencing &amp; Carpentry**, a
family-owned fencing and carpentry contractor serving **The Hills District
(Sydney)** and **Albury-Wodonga**. Redesign of the original
[harrisonfencing.com](https://www.harrisonfencing.com/).

> Tagline: *"I quote the job, I do the job."*

---

## Tech stack

- **HTML5** — single static page (`indexx.html`), semantic and accessible.
- **SCSS → CSS** — "smart" SCSS using maps, getter functions, mixins and
  `@if`/`@each`/`@for` logic (Dart Sass module system, `@use`/`@forward`).
- **Vanilla JS** — progressive enhancement; the site works without it.
- **Libraries (CDN):**
  - [GSAP](https://gsap.com/) + ScrollTrigger — entrance, scroll reveals, stat
    counters, idle micro-animations, modal transitions.
  - [Swiper](https://swiperjs.com/) — the "Our Work" gallery carousel (autoplay,
    infinite loop, pause-on-hover).
  - [Fancybox v5](https://fancyapps.com/fancybox/) — gallery image lightbox.
- **No CSS framework.** Mobile-first and fully responsive.

---

## Project structure

```
indexx.html                 # the home page
/scss
  main.scss                 # entry point — only @use-s partials, no rules
  abstracts/                # _tokens _functions _mixins _index (maps, getters, @if logic)
  base/                     # _reset _typography (type scale via @each)
  layout/                   # _utilities _header _footer
  components/               # _buttons _hero _stats _sections _services _about
                            # _locations _vendor _testimonial _cta _modal
/assets
  /css  main.css            # compiled output — DO NOT edit by hand
  /js   main.js             # nav, scrollspy, modal, GSAP, Swiper, Fancybox init
  /img  job-1..4.jpg feature.jpg   # real photos from the live site
        favicon.svg favicon.ico favicon-16/32.png apple-touch-icon.png
/scripts
  gen-favicons.mjs          # one-off: render favicons from the logo emblem
/design-system
  MASTER.md                 # design system (tokens, rules) — source of intent
CLAUDE.md                   # contributor/build guidance
package.json                # build scripts + dev dependencies
```

---

## Getting started

### Prerequisites
- [Node.js](https://nodejs.org/) (for the Sass build + favicon script).
- A local web server. The project lives under WampServer's `www`, so it's served
  at `http://localhost/sklentr/harrisonfencing/indexx.html`. Any static server
  works too.

### Install
```bash
npm install
```

### Build the CSS
```bash
npm run css        # compile once (expanded)
npm run watch      # recompile on change
npm run css:min    # compressed production build
```
Output → `assets/css/main.css`. **Never edit the compiled CSS directly** — edit
the SCSS partials and recompile.

### Regenerate favicons (only if the logo changes)
```bash
node scripts/gen-favicons.mjs
```
Renders `assets/img/favicon.svg` into the PNG/ICO icon set.

---

## Design system

Tokens live in `scss/abstracts/_tokens.scss` and are accessed via functions
(`color()`, `space()`, `fs()`, `radius()`, `shadow()`, `bp()` …) — components
never use raw hex or magic numbers. See `design-system/MASTER.md` for the full
intent (palette, type, spacing, motion, a11y).

| Token            | Value     | Use                          |
|------------------|-----------|------------------------------|
| `primary`        | `#2B5E3F` | Eucalypt green — CTAs, links |
| `accent`         | `#C5732B` | Timber amber — accents       |
| `ink`            | `#23282D` | Charcoal — dark sections     |
| `bg` / `surface` | `#F7F6F3` / `#FFFFFF` | Page / cards      |

**Type:** Oswald (headings) + Inter (body), via Google Fonts.

---

## Page sections

Header (scrollspy nav + click-to-call) · Hero (premium, layered photos + GSAP
micro-animations) · Stats band (animated counters) · Services (bento grid with a
featured image card) · About (layered photos + signature) · Locations (branch
cards) · Our Work (Swiper carousel + Fancybox lightbox) · Reviews (sticky
heading + scroll-revealed card stack) · Final CTA (contact band) · Footer ·
sticky mobile call-bar.

## Quote modal

Every **"Free quote"** button opens a premium two-panel modal with a
quote-request form:
- Custom-built **branch** and **service** dropdowns (accessible listbox pattern).
- Client-side validation, success state, focus trap, scroll lock, Esc/overlay
  close, and a GSAP entrance.
- **Note:** the form is currently **front-end only** — submissions show a success
  message but are not sent anywhere yet. Wire it to an endpoint
  (Formspree/Web3Forms, a `mailto:` fallback, or a PHP mailer) before launch.

---

## Accessibility &amp; performance

- Semantic landmarks, sequential headings, skip link, visible focus rings.
- `aria-*` on the nav, modal dialog, and custom selects; full keyboard support.
- All animations respect `prefers-reduced-motion`.
- Real `tel:`/`mailto:` links; images carry `width`/`height` + `alt`; lazy
  loading below the fold; `LocalBusiness` JSON-LD structured data.

---

## Contacts (content reference)

- **The Hills Area** — Anthony Harrison · 0408 207 245 ·
  anthonyharrisonfencing@gmail.com · Unit 28/6 Abbott Rd, Seven Hills NSW 2147
- **Albury-Wodonga** — Jack Harrison · 0430 621 242
- **ABN:** 87 622 683 676

---

Made by [capsuleDIGITAL](https://capsuledigital.com.au)
