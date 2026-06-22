# Best Plumber Brisbane

A single-page, production-grade static site for **Best Plumber Brisbane** — a Brisbane plumbing service offering emergency repairs, blocked drains, hot water systems, gas fitting, pipe relining and more, available 7 days a week.

Built as a hand-crafted **editorial / industrial** design with a heritage-trade-mark feel. Bold display typography, an asymmetric bento services grid, a horizontal marquee ticker, oversized section numerals, a heraldic shield crest in the brand mark, and tactile micro-details throughout.

🔗 **Reference site:** https://bestplumberbrisbane.com.au/

---

## ✦ Tech Stack

| Layer       | Choice                                                     |
|-------------|-----------------------------------------------------------|
| Markup      | Single semantic `index.html` (HTML5)                       |
| Styling     | **SCSS** (compiled to a single `style.css`)                |
| Interaction | Vanilla JavaScript (sticky header, mobile nav toggle)      |
| Typography  | **Poppins** (300 / 400 / 500 / 600 / 700 / 800 / 900 + italic), with Helvetica · Arial · Lucida fallbacks |
| Compile     | Dart Sass via `npx sass` (no build framework, no bundler)  |

---

## ✦ Folder Structure

```
bestplumberbrisbane/
├── index.html              ← the single page (semantic markup, sticky header, mobile nav)
├── style.css               ← compiled output (do NOT hand-edit)
├── scss/
│   ├── style.scss          ← main entrypoint (@use imports all partials)
│   ├── _variables.scss     ← brand tokens (colors, fonts, spacing)
│   ├── _mixins.scss        ← responsive helpers, typography presets, flex/grain
│   ├── _reset.scss         ← box-sizing reset, ::selection
│   ├── _base.scss          ← body grain, container, eyebrow, sec-index, buttons
│   ├── _topbar.scss        ← thin dark utility bar (24/7 emergency badge)
│   ├── _header.scss        ← sticky header + heraldic shield crest brand + mobile nav
│   ├── _hero.scss          ← editorial hero (display title, stat card, image stage)
│   ├── _marquee.scss       ← infinite horizontal service-name ticker
│   ├── _services.scss      ← bento grid of 15 service tiles (mixed sizes, dark/copper/image)
│   ├── _why.scss           ← numbered "why us" panels with massive numerals
│   ├── _spotlight.scss     ← 4 alternating long-form service blocks
│   ├── _process.scss       ← sticky-headline 4-step process list
│   ├── _testimonials.scss  ← 3×2 review grid with rating block
│   ├── _areas.scss         ← Brisbane skyline + suburb list
│   ├── _hallmark.scss      ← dark brand-statement section with concentric rings
│   ├── _cta.scss           ← full-width copper CTA band
│   ├── _contact.scss       ← info column + dark form
│   └── _footer.scss        ← huge outline wordmark + columns + agency credit
├── images/                 ← plumber + Brisbane skyline assets
├── task.md                 ← original project brief / spec
└── README.md
```

Every `.scss` file carries the developer-credit header block at the top.

---

## ✦ Build / Local Development

### One-off compile

```bash
npx sass scss/style.scss style.css --no-source-map --style=expanded
```

### Watch mode (auto-recompile on save)

```bash
npx sass --watch scss/style.scss:style.css --no-source-map --style=expanded
```

### Production build (minified)

```bash
npx sass scss/style.scss style.css --no-source-map --style=compressed
```

### Run locally

Drop the folder into a web server root (e.g. **WAMP** at `E:\wampserver\www\sklentr\bestplumberbrisbane\`) and open
`http://localhost/sklentr/bestplumberbrisbane/`. No build server required — it's a flat static site.

---

## ✦ Design Tokens

### Brand palette

| Token         | Value      | Role                                          |
|---------------|-----------|------------------------------------------------|
| `$ink`        | `#0b1620` | Primary dark — body text, headings, header/footer bg |
| `$ink-2`      | `#142231` | Softer midnight for layered backgrounds       |
| `$ink-3`      | `#1d3145` | Muted navy text                               |
| `$copper`     | `#055493` | Primary navy accent (CTAs, italic emphasis)   |
| `$copper-deep`| `#043d6e` | Hover/darker navy                              |
| `$copper-soft`| `#4a8bc4` | Light navy tint                                |
| `$paper`      | `#f4efe7` | Warm cream background                          |
| `$paper-2`    | `#ede6d7` | Deeper cream for card surfaces                 |
| `$steel`      | `#7c8a99` | Muted slate for secondary text                 |

> The `$copper*` token names are kept for legacy compatibility — the values currently hold the **navy** accent.

### Typography presets

| Preset       | Spec                                                       |
|--------------|------------------------------------------------------------|
| `display-1`  | `clamp(56px, 9vw, 168px)` / 900 / `-0.045em`               |
| `display-2`  | `clamp(40px, 5.5vw, 96px)` / 800 / `-0.035em`              |
| `display-3`  | `clamp(28px, 3vw, 48px)` / 700 / `-0.02em`                 |
| `eyebrow`    | `11px` / 600 / uppercase / `0.22em`                        |
| `body`       | `16px` / 300 / `1.7`                                       |

---

## ✦ Page Sections (top → bottom)

1. **Topbar** — 24/7 emergency badge, contact info
2. **Header** — sticky, heraldic shield crest brand, primary nav, phone + CTA
3. **Hero** — editorial display title (italic + underline-soft), lede, dual CTAs, image stage with badges + stat card, belt strip
4. **Marquee** — infinite scrolling service-name ticker with outlined / accent variants
5. **Services** — 15-tile bento grid (dark · copper · image · standard variants in mixed sizes)
6. **Why Us** — 4 numbered panels on dark navy with concentric arcs decoration
7. **Spotlight** — 4 alternating image/text long-form service blocks
8. **Process** — sticky-headline 4-step process list
9. **Reviews** — 3×2 testimonial grid + average-rating block
10. **Areas We Service** — Brisbane skyline + suburb chip list
11. **Hallmark** — dark brand-statement section (concentric rings + glowing centered mark)
12. **CTA Banner** — full-width copper band with phone + dual CTAs
13. **Contact** — info column + dark form
14. **Footer** — huge outline wordmark, 4 columns (about / site / services / contact), agency credit

---

## ✦ Interactive Details

- **Sticky header** that gains a backdrop-blur + soft shadow on scroll
- **Smooth scroll** anchor navigation
- **Mobile slide-down nav** with animated hamburger
- **Service cards lift** on hover with rotating arrow
- **Marquee** pauses on hover
- **Floating quick-call** button on mobile with pulse animation
- **Beating heart** in the agency footer credit
- **Subtle SVG grain texture** overlay across the whole page

---

## ✦ Accessibility

- Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- Single `<h1>` in hero, ordered heading hierarchy
- All images include descriptive `alt` text (decorative ones are `aria-hidden`)
- Form labels properly bound to inputs
- ARIA labels on icon-only buttons (hamburger, floating phone)
- Adequate contrast (cream / midnight / navy combo well above WCAG AA)

---

## ✦ Credits

- **Design & development:** Biplab Kumar Paul — Web Designer & Developer
  📱 01735 927356 · ✉️ biplab.cse.85@gmail.com
- **Agency:** [CapsuleDIGITAL](https://www.capsuledigital.com.au/) — public footer credit
- **Reference content:** [bestplumberbrisbane.com.au](https://bestplumberbrisbane.com.au/)

---

## ✦ License

Private client project. All rights reserved.
