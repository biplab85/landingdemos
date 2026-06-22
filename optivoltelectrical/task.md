# OptiVolt Electrical — Rebuild Task

## Goal
Rebuild the existing `index.html` as a clean, maintainable static site.
This pass: **`index.html` only**. No other pages yet.

## Tech & Conventions
- **Markup:** hand-written semantic HTML5 (single `index.html`).
- **Styles:** **SCSS** (compiled to CSS). No inline `<style>` block in final — link compiled stylesheet.
- **JS:** vanilla, progressive-enhancement only (reveals, nav, count-up, hero current).
- **Fonts (locked):**
  - Display / headings → `"Gentium Basic", Georgia, serif`
  - Body / UI / labels → `"Source Sans Pro", arial, sans-serif`
  - (Replaces the old Big Shoulders / Spline Mono pairing — softer, editorial, serif-led tone.)

## Reference Site — Structure (from current index.html)
The page is a single-scroll electrical-contractor landing page. Sections in order:

1. **Top utilities** — hazard stripe + custom cursor + atmospheric glow blobs.
2. **Nav** (fixed) — brand mark (lightning bolt) "OptiVolt", links (Services, By the Numbers, Process, Contact), "Request a Quote" CTA, mobile menu button. Gains blurred bg + border on scroll.
3. **Hero** — full-viewport, bottom-aligned. Grid background, animated "live electric current" SVG (reacts to cursor). Eyebrow, big headline "We Keep The *Current* Flowing.", supporting paragraph, two buttons. Top status bar (system status / license / est. 2004).
4. **Marquee** — infinite scroll of service keywords with bolt icons; pauses on hover.
5. **Services** `#services` — `[01 / SERVICES]` head + 3×2 bordered grid of 6 cards: Residential, Commercial, Industrial, EV Charging, Solar & Storage, 24/7 Emergency. Each: index, icon, title, copy, hover "Explore →".
6. **Stats** `#numbers` — `[02 / BY THE NUMBERS]` + 4 stat cells with count-up: 20+ yrs, 6400+ jobs, 100% code pass, 24/7 dispatch.
7. **Process** `#process` — `[03 / THE PROCESS]` + 4 hover-expanding steps: Assess, Quote, Install, Verify.
8. **Quote** — testimonial blockquote (Dana Reyes, Hartwell Manufacturing) on hazard accent.
9. **CTA** `#contact` — clipped amber block, "Let's Get Wired.", phone `1-800-OPTIVOLT`, dispatcher-online indicator, "Request a Free Quote" button.
10. **Footer** — brand blurb + 3 link columns (Services / Company / Reach Us) + legal bar.
11. Bottom hazard stripe.

## Aesthetic Re-direction
Keep the **high-voltage industrial** bones (dark canvas, amber `--volt` accent, hazard stripes, animated current) but let the **serif (Gentium Basic) headings** shift it toward an *editorial / engineered-craft* tone instead of pure signage. Body in Source Sans Pro for clean legibility.

## Proposed File Layout
```
optivoltelectrical/
├─ index.html
├─ scss/
│  ├─ main.scss          // entry — @use the partials
│  ├─ _tokens.scss       // colors, type, spacing vars ($volt, $ink, fonts…)
│  ├─ _base.scss         // reset, body, typography, selection, grain
│  ├─ _layout.scss       // nav, sections, footer shells
│  ├─ _components.scss   // buttons, cards, marquee, stats, steps, cursor
│  └─ _hero.scss         // hero + current animation styles
├─ css/
│  └─ main.css           // compiled output (linked by index.html)
└─ js/
   └─ app.js             // cursor, reveals, count-up, hero current, marquee
```

## SCSS Token Map (from current `:root`)
| Token | Value | Use |
|---|---|---|
| `$ink` | `#0a0a0c` | page bg |
| `$ink-2` | `#101013` | alt surface |
| `$surface` / `$surface-2` | `#141418` / `#1b1b21` | cards |
| `$line` / `$line-bright` | `#26262e` / `#34343f` | borders |
| `$paper` / `$paper-dim` / `$paper-faint` | `#f4f1ea` / `#a9a59b` / `#6c6960` | text |
| `$volt` / `$volt-hot` / `$volt-deep` | `#ffc400` / `#ff8a00` / `#3a2c00` | accent |
| `$spark` | `#d8ff3e` | secondary spark |
| `$danger` | `#ff4d3d` | alerts |
| `$font-display` | `"Gentium Basic", Georgia, serif` | headings |
| `$font-body` | `"Source Sans Pro", arial, sans-serif` | body |

## Build Checklist (this pass) — ✅ DONE
- [x] Scaffold `scss/` partials (`_tokens _base _layout _hero _components _sections` + `main`) + `js/app.js`.
- [x] Compile to `css/main.css` via `npx sass scss/main.scss css/main.css --style=expanded`.
- [x] Title-case Gentium Basic headings with red italic emphasis; Source Sans Pro body.
- [x] Scroll-reveal IntersectionObserver, stat count-up, refined hero current SVG (cursor-reactive). Custom-cursor dropped (kept native for a pro feel); marquee replaced by a static trust strip.
- [x] Responsive breakpoints (1000 / 900 / 720 / 600) + `prefers-reduced-motion`.
- [x] Author credit banner on every `.scss`, `.js`, and the HTML head comment.

## Rebranded to the REAL company — optivoltelectrical.com.au
- Brand colour: gold → **Optivolt red `#e21f27`** on near-black (matches their logo).
- Real assets pulled into `/assets`: `logo.png` (transparent), `hero.jpg`, `work-1…6.jpg`. Favicon = logo.png.
- Real content: family-owned (Jaime Harrison), Lic. 484158C, ph 0415 304 984,
  Sydney / South Coast / Central Coast, Mon–Sat 7am–11:45pm + 24/7 emergencies, FB + IG.
- Sections: Hero (real photo bg) → Trust → Services (6) → About (founder) →
  Recent Work (6 real photos) → Promise stats → Process → Founder quote → CTA → Footer.
- No fabricated testimonials — the quote block uses the founder's own ethos.

## To recompile after SCSS edits
```
npx sass scss/main.scss css/main.css --style=expanded --no-source-map
```

## Possible next steps
- Self-host the two Google fonts as `.woff2` for offline/perf (URLs captured during build).
- Add a real contact form (currently the CTA is click-to-call only).
- Optimise images to `.webp`; add width/height attrs to reduce layout shift.
