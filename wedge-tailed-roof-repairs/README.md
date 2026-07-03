# Wedge Tailed Roof Repairs

Premium marketing site for an Australian roofing company. Built with HTML5, SCSS
(7-1 pattern), vanilla ES6 modules, GSAP, Swiper and Fancybox.

> **`CLAUDE.md` is the single source of truth** for the design system, architecture
> and conventions. Read it before making changes.

## Prerequisites
- Node.js ≥ 18

## Setup
```bash
npm install
```

## Develop
```bash
npm run dev        # watch SCSS + JS and serve at http://localhost:5173
```
Or run pieces individually:
```bash
npm run watch:css  # compile scss → assets/css/style.css (expanded + sourcemap)
npm run watch:js   # bundle js → assets/js/bundle.js
```
During development `index.html` links the readable `assets/css/style.css` and the
native ES module entry `js/main.js` (vendor libs load from CDN).

## Production build
```bash
npm run build
```
Produces:
- `assets/css/style.css` — readable, autoprefixed (dev)
- `assets/css/style.min.css` — minified via cssnano (prod)
- `assets/js/bundle.min.js` — minified JS bundle (prod)

For production, switch `index.html` to link `style.min.css` and
`assets/js/bundle.min.js`, and self-host/pin the vendor libraries.

## Images
Drop source `.jpg/.png` into `assets/images/**`, then:
```bash
npm run images     # generate AVIF + WebP responsive variants (sharp)
```

## Placeholder assets
The demo currently pulls hero/gallery/avatar imagery from `picsum.photos` so the
layout renders immediately. **Replace these with optimised local roofing
photography** before launch (see `CLAUDE.md` §13).
