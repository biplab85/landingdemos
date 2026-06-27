# Inox Electrical — Website

A fast, accessible, mobile-first **single-page marketing site** for Inox Electrical
Pty Ltd, a licensed electrical contractor serving the Greater Sydney Region.

Built with **hand-written SCSS** (no CSS frameworks) and **GSAP + ScrollTrigger**
for motion. The page is fully styled and usable without JavaScript — all motion is
progressive enhancement and respects `prefers-reduced-motion`.

> The full design system, content strategy, and rationale live in
> [`CLAUDE.md`](./CLAUDE.md) — the single source of truth for this project.

---

## Highlights

- **Two experiences, one codebase** — a premium editorial landing page on
  desktop/tablet, and an **app-style UI** on mobile (fixed top app-bar, bottom tab
  navigation, swipeable carousels, bottom-sheet patterns).
- **Conversion-focused** — one primary CTA ("Get a Free Quote") plus a persistent
  tap-to-call, an on-page lead form, and a sticky mobile action surface.
- **Motion as identity** — hero load timeline, scroll reveals, animated counters,
  parallax, a pinned horizontal-scroll "How We Work" section, and micro-interactions.
- **Accessible & fast** — semantic HTML, ARIA landmarks, WCAG 2.1 AA contrast,
  keyboard navigation, lazy-loaded images, and reduced-motion support.

---

## Tech stack

| Layer | Choice |
|---|---|
| Markup | Single `index.html` (semantic, ARIA) |
| Styling | Dart Sass (`@use`/`@forward`, 7-1 architecture) → `css/style.css` |
| Motion | GSAP 3 + ScrollTrigger (via CDN) |
| Behaviour | Vanilla ES JavaScript (`js/main.js`, `js/animations.js`) |
| Fonts | Poppins (display) + Open Sans (body), via Google Fonts |

---

## Getting started

### Prerequisites
- [Node.js](https://nodejs.org/) (for the Sass build tooling)

### Install
```bash
npm install
```

### Develop (watch + recompile SCSS)
```bash
npm run watch
```
Then open `index.html` in a browser. If you have a local server (e.g. WampServer,
`npx serve`, or VS Code Live Server), serve the project root so relative asset
paths resolve correctly.

### Build for production (minified, no source map)
```bash
npm run sass:build
```

| Script | Description |
|---|---|
| `npm run sass` | Compile once (expanded + source map) |
| `npm run watch` | Watch SCSS and recompile on change (expanded) |
| `npm run sass:build` | Compile minified for production (no source map) |

> `css/style.css` is **generated output — do not edit by hand.** Edit the SCSS
> sources in `scss/` and recompile.

---

## Project structure

```
inoxelectrical/
├── index.html              # The single page (all sections + anchors)
├── css/
│   └── style.css           # Compiled output (generated — do not edit)
├── scss/                   # Source styles (7-1 inspired)
│   ├── main.scss           # Entry — @use all layers in order
│   ├── abstracts/          # Tokens, functions, mixins (no CSS output)
│   ├── base/               # Reset, :root custom properties, typography, globals
│   ├── layout/             # Container, section rhythm, header, footer
│   ├── components/         # One partial per component (button, hero, carousel…)
│   └── utilities/          # Helpers
├── js/
│   ├── main.js             # Behaviour: nav, tab-bar, carousels, lightbox, form
│   └── animations.js       # GSAP timelines + reduced-motion guard
├── assets/img/             # brand · hero · projects · team · partners
├── CLAUDE.md               # Design system & project source of truth
└── package.json
```

The page sections (top to bottom): header / mobile app-bar → hero → trust bar →
services → about → "How We Work" (horizontal scroll) → why-choose → stats →
projects (with lightbox) → reviews carousel → special offer → contact / quote form
→ partners → footer, plus a mobile bottom tab bar.

---

## Design system (summary)

Full details in [`CLAUDE.md`](./CLAUDE.md). In brief:

- **Concept:** *"Trusted local tradesperson, presented like a premium brand."*
  Light-first, layered depth, generous spacing, one energetic accent.
- **Color:** brand green `#5BA535` (actions/highlights), deep ink neutrals for
  text and dark "anchor" sections, amber `#FFB400` for urgency/offer/ratings.
- **Type:** Poppins headings + Open Sans body, fluid `clamp()` scale.
- **Spacing/radius:** 8px base unit; rounded, tactile components; soft elevation.
- **Tokens:** all design values live in `scss/abstracts/_variables.scss` and are
  emitted as CSS custom properties — components reference `var(--token)` only.

---

## Editing content

- **Copy, sections, structure:** edit `index.html`.
- **Styles:** edit the relevant partial in `scss/`, then run `npm run watch` (or
  `npm run sass`).
- **Motion:** timelines live in `js/animations.js`; behaviour in `js/main.js`.
- **Images:** add to `assets/img/` and reference with explicit `width`/`height`
  (to avoid layout shift) and `loading="lazy"` for below-the-fold media.

---

## Client details

| | |
|---|---|
| **Client** | Inox Electrical Pty Ltd |
| **Service area** | Greater Sydney Region, NSW, Australia |
| **Phone** | 0432 191 303 |
| **Email** | support@inoxelectrical.com.au |
| **Facebook** | [facebook.com/inoxelectrical21](https://www.facebook.com/inoxelectrical21/) |

> A few content items remain pending client confirmation (see §2.4 of `CLAUDE.md`):
> the exact address (Box Hill vs Hassall Grove), electrical licence number,
> emergency availability, and exact Google rating/review count.
