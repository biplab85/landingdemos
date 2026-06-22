# Now On Electrical — Website

A single-page marketing website for **Now On Electrical Pty Ltd**, a fully licensed
and insured electrical contractor servicing Sydney, NSW. Hand-built with semantic
HTML and SCSS — no framework, no build tooling beyond the Sass compiler.

> _"An affordable, excellent and trustworthy service."_

## Overview

- **Single page** (`index.html`) — all navigation links scroll to sections on the same page (anchors).
- **Aesthetic:** "Live Circuit" — electric cobalt + power-button red, blueprint grid, cyan glow.
- **Font:** PT Sans (400/700) loaded from Google Fonts.
- Mobile-first, fully responsive, and accessibility-conscious (semantic HTML, alt text, focus rings, reduced-motion support).

## Sections

- Sticky header + animated mobile drawer nav, with click-to-call
- Hero — tagline, primary CTAs, credibility ribbon
- Services grid (13 services, color-coded icons)
- Why choose us (4 differentiators + stacked images)
- Service areas (tag pills)
- Philosophy / pull quote (dark band)
- Contact / quote section with a validating booking form
- CTA band + footer

## Project structure

```
.
├── index.html            # The entire site (markup + inline JS)
├── css/
│   ├── style.css         # Compiled stylesheet (expanded) — linked by index.html
│   └── style.min.css     # Compiled stylesheet (minified) — use in production
├── scss/
│   ├── main.scss         # Entry point — @use's every partial below
│   ├── _variables.scss   # Design tokens: colors, font stack, spacing, breakpoints
│   ├── _mixins.scss      # Responsive, layout & a11y helpers
│   ├── _base.scss        # Reset, typography, buttons, scroll-reveal
│   ├── _header.scss      # Nav + mobile hamburger drawer
│   ├── _hero.scss
│   ├── _services.scss
│   ├── _about.scss       # "Why us", service areas, philosophy quote
│   ├── _contact.scss     # Booking form
│   └── _footer.scss      # CTA band + footer
├── assets/img/           # Logo + section imagery
└── task.md               # Build brief & content reference
```

## Building the styles

The HTML links the compiled `css/style.css`, so recompile after any SCSS edit:

```bash
# Expanded (development build linked by index.html)
npx sass scss/main.scss css/style.css --style=expanded --no-source-map

# Minified (production build)
npx sass scss/main.scss css/style.min.css --style=compressed --no-source-map

# Watch while developing
npx sass --watch scss/main.scss css/style.css
```

To switch to the minified CSS for production, point the `<link>` in `index.html`
at `css/style.min.css`.

## Running locally

It's a static site — open `index.html` directly, or serve the folder:

```bash
npx serve .
```

## Contact

- **Phone:** 1300 780 287 (`tel:1300780287`)
- **Email:** nowonelectrical@gmail.com
- **Servicing:** Sydney, NSW & surrounds
