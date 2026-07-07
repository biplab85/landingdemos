# Kangaroo Roof Repairs — Website

Premium, responsive **Home page** for **Kangaroo Roof Repairs and Construction Pty Ltd**,
Sydney's leading roof repairs & restoration company.

- **Content & assets:** sourced from the live site `kangarooroofrepairs.com.au`.
- **Design reference:** the _Roofer_ template (`getroofer.webflow.io`) — a warm-neutral,
  editorial, high-trust look, elevated to a more premium execution.
- Full design system, tokens and conventions live in **[`CLAUDE.md`](./CLAUDE.md)**.

## Tech

HTML5 · SCSS (7‑1) compiled with Dart Sass · modern ES6 JS bundled with esbuild ·
GSAP + ScrollTrigger · Swiper.js · Fancybox.

## Getting started

```bash
npm install          # install dev tooling
npm run images       # (once) resize photos → webp + compressed jpg
npm run build        # compile SCSS → minified CSS, bundle → minified JS
npm run dev          # live-server + Sass/JS watch (http://localhost:5173)
```

## Scripts

| Script                | Does                                                            |
| --------------------- | -------------------------------------------------------------- |
| `npm run dev`         | Watch SCSS + JS and serve with live reload                      |
| `npm run build`       | Production build: `style.min.css` + `bundle.min.js`             |
| `npm run build:css:min` | SCSS → autoprefixed → **minified** `assets/css/style.min.css`  |
| `npm run build:js`    | Bundle + **minify** JS → `assets/js/bundle.min.js`             |
| `npm run images`      | Optimise `assets/img/**` (resize + WebP + mozjpeg)             |

## Structure

```
index.html
assets/
  css/   scss/   js/   fonts/   img/{hero,about,services,gallery,logo,icons,...}
js/      main.js + modules/ + utils/   (bundled to assets/js)
```

`index.html` links the **minified** `assets/css/style.min.css` and
`assets/js/bundle.min.js`. Edit SCSS/JS source and rebuild — never hand-edit compiled
output.

> All work lives on the `feature/theme-clining` branch.
