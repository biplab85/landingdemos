# CLAUDE.md — Get Fenced Box Hill

Project guide for building the **Get Fenced Box Hill** landing site — a premium, single-page
marketing site for a fencing company in Box Hill (Melbourne, AU). This file is the source of
truth for stack, structure, tokens and conventions. Read it before writing any code.

## 0. Design Principles (non-negotiable)

1. **LIGHT MODE ONLY.** Never dark mode. The canvas is cool blue-white ("Ocean Blue Serenity").
   Text is deep ocean-navy ink. (The Fancybox image viewer is the only place a dim overlay is
   allowed, because it's an image lightbox — not a theme.)
2. **Cleanliness first.** This is the #1 priority. Generous whitespace, calm hairline borders,
   soft neutral shadows, restrained use of the accent colour, strong type hierarchy. When in
   doubt, remove — don't add. No visual clutter, no heavy gradients, no noise.
3. **Premium & professional.** Editorial spacing, refined logo/wordmark, confident but quiet.
   Think high-end trade brand, not busy template.
4. Layout language follows the **VoltPro** help site (bracketed service cards `[01]`, avatar
   social-proof strip, two-column "built on trust", stat cards, FAQ) — reinterpreted in light.

---

## 1. Project Snapshot

| Item | Value |
|------|-------|
| Business | Get Fenced Box Hill — timber, Colorbond, steel & aluminium fencing |
| Location | Box Hill, Melbourne, Australia |
| Type | Single-page marketing landing site (`index.html` only) |
| Design language | Premium **light**, clean trade site (layout ref: VoltPro) |
| Mobile | Modern **native-app style** UI (bottom nav, sheets, large touch targets) |

### Reference sites (from `help-site.txt`)
- **Primary / help site:** https://voltpro-ttm.webflow.io/ — dark, premium trade services
- https://nestbes.webflow.io/home/home-one — hero cards, animated counters
- https://optik-template.webflow.io/
- https://housent.webflow.io/
- Business FB: https://www.facebook.com/p/Get-Fenced-Box-Hill-100077330281869/

---

## 2. Tech Stack

- **HTML** — a single `index.html` (no multi-page routing).
- **SCSS** — all styles authored in SCSS, compiled with **Node** (Dart Sass), no CDN CSS.
- **CSS output** — one compiled `main.css`, **minified** for production.
- **GSAP** — micro-animations, scroll reveals, counters, parallax (`ScrollTrigger`).
- **Fancybox** (fancyapps.com/fancybox) — all image / gallery / lightbox viewing.
- **Swiper** (swiperjs.com) — every slider/carousel (testimonials, gallery, logos).
- **Vanilla JS** — small custom module for nav, menu, form, GSAP init. No framework.

CDN is acceptable for GSAP, Fancybox and Swiper; keep our own CSS/JS local.

---

## 3. Folder Structure

```
get-fenced-box-hill/
├─ index.html                 # the only HTML page
├─ CLAUDE.md
├─ help-site.txt
├─ package.json               # scripts + sass devDependency
│
├─ src/
│  └─ scss/
│     ├─ main.scss            # single entry — @use everything below
│     ├─ abstracts/
│     │  ├─ _variables.scss   # colors, spacing, radius, z-index
│     │  ├─ _typography.scss  # font vars + type scale
│     │  ├─ _mixins.scss      # media queries, flex/grid helpers
│     │  └─ _functions.scss
│     ├─ base/
│     │  ├─ _reset.scss       # modern reset + box-sizing
│     │  ├─ _root.scss        # :root CSS custom properties
│     │  └─ _global.scss      # body, headings, links, container
│     ├─ layout/
│     │  ├─ _header.scss
│     │  ├─ _footer.scss
│     │  ├─ _navbar.scss      # desktop nav
│     │  └─ _mobile-nav.scss  # app-style bottom nav / drawer
│     ├─ components/
│     │  ├─ _button.scss
│     │  ├─ _card.scss
│     │  ├─ _accordion.scss   # FAQ
│     │  ├─ _swiper.scss      # slider overrides
│     │  ├─ _fancybox.scss    # lightbox overrides
│     │  ├─ _form.scss
│     │  └─ _counter.scss
│     ├─ sections/
│     │  ├─ _hero.scss
│     │  ├─ _services.scss
│     │  ├─ _about.scss
│     │  ├─ _gallery.scss
│     │  ├─ _process.scss
│     │  ├─ _testimonials.scss
│     │  ├─ _cta.scss
│     │  └─ _faq.scss
│     └─ utilities/
│        └─ _helpers.scss     # spacing, text, visibility utils
│
├─ assets/
│  ├─ css/
│  │  └─ main.css             # compiled + minified output
│  ├─ js/
│  │  ├─ main.js              # nav, menu, form
│  │  └─ animations.js        # GSAP + ScrollTrigger init
│  ├─ img/                    # optimised webp/jpg + svg icons
│  └─ fonts/                  # self-hosted woff2 (see §5)
│
└─ node_modules/
```

---

## 4. Color Palette — "Ocean Blue Serenity" (Light, clean, premium)

Cool blue-white canvas, deep ocean-navy ink, **one restrained ocean-blue accent**. Serene teal
is a quiet secondary for trust/success only. Keep colour usage minimal — cleanliness comes from
white space + ink type, not from colour. Defined once as SCSS `$vars` **and** mirrored as CSS
custom properties in `base/_root.scss`.

| Token | Hex | Use |
|-------|-----|-----|
| `--white` | `#FFFFFF` | Page background, cards |
| `--mist` | `#F4F8FB` | Alternating section surface (cool off-white) |
| `--haze` | `#E7F0F7` | Deeper surface / subtle fills |
| `--ink` | `#0F2A3F` | Deep ocean-navy — primary text **and** primary buttons |
| `--ink-700` | `#1E4258` | Strong secondary text / hovers |
| `--muted` | `#5C7488` | Body / secondary text (cool slate) |
| `--line` | `#DCE7EF` | Hairline borders, dividers |
| `--line-2` | `#C7D9E5` | Slightly stronger border |
| `--ocean-500` | `#1E88C7` | **Accent** — overlines, links, numbers, highlights |
| `--ocean-600` | `#156B9E` | Accent hover / pressed |
| `--ocean-tint` | `#DCEBF7` | Accent icon backgrounds (soft) |
| `--teal-500` | `#14A6B8` | Secondary accent (trust) |
| `--teal-600` | `#0E7E8C` | Secondary hover |
| `--success` | `#1F9D74` | Form valid |
| `--danger`  | `#D5484B` | Errors / form invalid |

Shadows (soft, cool-tinted — never harsh):
- `--sh-sm: 0 4px 14px rgba(15, 42, 63, 0.06)`
- `--sh-md: 0 14px 34px rgba(15, 42, 63, 0.09)`
- `--sh-lg: 0 26px 60px rgba(15, 42, 63, 0.12)`

Accents:
- **Primary button:** solid `--ink` (ocean navy) with white text (premium, clean).
- **Accent button / links:** `--ocean-500`. Use sparingly.
- No busy gradients. At most a barely-there cool radial glow behind the hero image.

---

## 5. Fonts & Typography

**Self-host** woff2 in `assets/fonts/` (do not rely on Google CDN in production).

- **Display / Headings:** `Space Grotesk` — geometric, industrial, confident.
- **Body / UI:** `Inter` — highly legible at small sizes.
- Fallback stack: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.

### Type scale (fluid where useful — `clamp()`)

| Level | Font | Size (desktop) | Weight | Line-height | Use |
|-------|------|----------------|--------|-------------|-----|
| Display | Space Grotesk | `clamp(2.75rem, 6vw, 4.5rem)` | 700 | 1.05 | Hero headline |
| H1 | Space Grotesk | `clamp(2.25rem, 4vw, 3rem)` | 700 | 1.1 | Section titles |
| H2 | Space Grotesk | `2rem` | 600 | 1.15 | Sub-sections |
| H3 | Space Grotesk | `1.5rem` | 600 | 1.2 | Card titles |
| H4 | Space Grotesk | `1.25rem` | 500 | 1.3 | Small headings |
| Body-L | Inter | `1.125rem` | 400 | 1.6 | Lead paragraphs |
| Body | Inter | `1rem` | 400 | 1.65 | Default text |
| Small | Inter | `0.875rem` | 400 | 1.5 | Meta, captions |
| Overline | Space Grotesk | `0.8125rem` | 600 | 1.4 | Eyebrow labels, `letter-spacing: .12em; text-transform: uppercase` |

Base: `html { font-size: 100%; }` (16px). Use `rem` for type, `rem`/`clamp()` for spacing.

---

## 6. Page Sections (single `index.html`)

1. **Header / Nav** — logo, anchor links, phone + "Get a Quote" CTA. Sticky, shrinks on scroll.
2. **Hero** — headline, sub-copy, dual CTA, trust badges, hero image; GSAP intro reveal.
3. **Services** — cards: Timber, Colorbond, Aluminium, Steel/Gates, Repairs.
4. **Why Us / Stats** — animated counters (jobs done, years, suburbs, warranty).
5. **Process** — 3–4 step "How we work" timeline.
6. **Gallery** — Swiper slider + Fancybox lightbox of completed fences.
7. **Testimonials** — Swiper carousel of reviews.
8. **About** — short story + service-area (Box Hill & surrounds).
9. **FAQ** — accordion.
10. **CTA band** — "Book a free measure & quote".
11. **Footer** — contact, hours, socials (FB), ABN, service areas, copyright.

---

## 7. Mobile — Modern App Style

Mobile is not a shrunk desktop; it should feel like a native app.

- **Bottom navigation bar** (fixed): Home, Services, Gallery, Call, Quote — icon + label,
  safe-area padding (`env(safe-area-inset-bottom)`).
- **Bottom sheet / drawer** for the menu and quote form (slide-up, rounded top corners).
- Large touch targets (min `48px`), generous spacing, thumb-reachable CTAs.
- Sticky "Call now" / "Get quote" action button.
- Momentum-style horizontal scroll (Swiper `freeMode`) for service/gallery cards.
- Subtle GSAP transitions between states; respect `prefers-reduced-motion`.

---

## 8. Animation Rules (GSAP)

- Init all animations in `assets/js/animations.js`; use `ScrollTrigger` for reveals.
- Keep it **micro**: fade/slide-up on section enter, counter count-up, hero stagger,
  button hover lifts, subtle parallax on hero image.
- Durations `0.4–0.8s`, ease `power2.out` / `power3.out`. No bouncy/gimmicky motion.
- Always gate motion behind `@media (prefers-reduced-motion: reduce)`.
- Never block content on JS — content is visible without animation.

---

## 9. Node / SCSS Build

`package.json` scripts (Dart Sass):

```json
{
  "scripts": {
    "sass":       "sass src/scss/main.scss assets/css/main.css --style=expanded --source-map",
    "watch":      "sass --watch src/scss/main.scss assets/css/main.css --style=expanded",
    "build:css":  "sass src/scss/main.scss assets/css/main.css --style=compressed --no-source-map",
    "build":      "npm run build:css"
  },
  "devDependencies": { "sass": "^1.77.0" }
}
```

- **Dev:** `npm run watch`.
- **Production:** `npm run build` → **minified** `assets/css/main.css` (`--style=compressed`).
- Use modern `@use` / `@forward` (not deprecated `@import`).

---

## 10. Conventions

- **BEM** class naming: `.block__element--modifier`.
- Mobile-first media queries via mixin. Breakpoints: `sm 480`, `md 768`, `lg 1024`, `xl 1280`.
- Semantic HTML5 (`header`, `nav`, `main`, `section`, `footer`), one `<h1>` (hero).
- Accessibility: alt text, focus states, `aria-*` on nav/accordion/sheets, AA contrast.
- Images: `webp` with fallback, lazy-load below the fold, explicit width/height.
- Performance: defer JS, preload fonts, minified CSS, compressed images.
- Container: `max-width: 1240px`, side padding `clamp(1rem, 4vw, 2rem)`.
- Spacing scale (rem): `0.25 0.5 0.75 1 1.5 2 3 4 6 8`.
- Radius: `--r-sm 8px`, `--r-md 14px`, `--r-lg 24px`, `--r-pill 999px`.

---

## 11. Git

- **Never push or merge to `main`.** All work goes to `feature/theme-clining`.
