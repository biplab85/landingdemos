# High Roofing — Website

Premium, responsive **Home page** for **High Roofing** — Jacob Kikkert, a licensed West
Sydney roof repair specialist (tile & metal roof leaks, valley iron, flashings, ridge
capping, replacements).

- **Content & facts:** the live site `highroofing.com.au` (real licence #105360C, ABN,
  services, areas, "since 1981").
- **Design:** bespoke "precision-trade premium" system (cool slate + cobalt-blue accent,
  Sora + Manrope). See **[`CLAUDE.md`](./CLAUDE.md)**.

## Tech

HTML5 · SCSS (7-1) via Dart Sass · ES6 JS bundled with esbuild · GSAP + ScrollTrigger ·
Swiper.js · Fancybox.

## Getting started

```bash
npm install
npm run images   # (once) resize photos → webp + compressed jpg
npm run build    # compile SCSS → minified CSS, bundle → minified JS
npm run dev      # live-server + watch (http://localhost:5174)
```

`index.html` links the **minified** `assets/css/style.min.css` and
`assets/js/bundle.min.js`. Edit SCSS/JS source and rebuild — never hand-edit compiled
output.

> Most photography is high-quality placeholder stock; the owner replaces it with real job
> photos. Jacob's portrait and the valley-iron shot are real.
