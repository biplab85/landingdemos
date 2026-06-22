# APEX — Electrical, Data & Security

A premium, single-page marketing website for **APEX Electrical, Data & Security**, a Sydney-based electrical, data and security contractor servicing the Sydney Metropolitan area and beyond.

The site is a redesign of [apexeds.com.au](https://apexeds.com.au/) with a "Premium Industrial" direction — a dark, charged charcoal canvas with a single electric-yellow accent, editorial typography, and modern GSAP-powered parallax and scroll motion.

## Highlights

- **Single page** — all sections live in `index.html` with anchor-based navigation.
- **Modern parallax hero** — layered depth, on-load timeline, and a draw-on lightning bolt.
- **GSAP + ScrollTrigger** motion — scroll reveals, clip-reveal portfolio tiles, per-image parallax drift, staggered grids, and count-up stats.
- **Accessible & responsive** — semantic HTML, alt text, focus states, mobile app-style bottom bar, and full `prefers-reduced-motion` fallback.
- **Australian UI cues** — AU spelling, Sydney/NSW framing, ABN, licensed/insured trust signals, 24/7 emergency emphasis.

## Tech Stack

- **HTML** — one static `index.html`.
- **SCSS** — authored in `assets/scss/`, compiled to `assets/css/styles.css`.
- **Vanilla JS** — `assets/js/main.js` for interactions.
- **[GSAP](https://gsap.com/) 3.12.5 + ScrollTrigger** — loaded via CDN.
- **Google Fonts** — Lusitana (display/serif headings) + Lato (body/UI).

## Project Structure

```
apexeds/
├── index.html                  # single page — all sections + anchor nav
├── assets/
│   ├── scss/
│   │   ├── main.scss           # entry — imports partials
│   │   ├── _variables.scss     # colours, fonts, breakpoints
│   │   ├── _base.scss          # reset, typography, helpers
│   │   ├── _header.scss
│   │   ├── _appbar.scss        # mobile bottom bar
│   │   ├── _hero.scss          # parallax hero
│   │   ├── _sections.scss      # about, services, work, guarantee, projects
│   │   ├── _contact.scss
│   │   └── _footer.scss
│   ├── css/
│   │   ├── styles.css          # compiled output
│   │   └── styles.css.map
│   ├── js/
│   │   └── main.js             # GSAP parallax, ScrollTrigger reveals, hero timeline
│   └── images/
│       ├── logo.png
│       ├── hero.jpg
│       ├── about.jpg
│       └── work/               # portfolio photos
├── task.md                     # design brief & build plan
└── README.md                   # this file
```

## Page Sections

1. **Header / Nav** — sticky header, logo, nav links, phone CTA, free-quote button, mobile menu.
2. **Hero** — parallax headline, dual CTA, trust strip (ABN · Licensed · Insured · 24/7).
3. **About** — brand statement, key points, count-up stats.
4. **Services** — 8 service cards (Residential, Commercial & Industrial, Government & Schools, 24/7 Emergency, Switchboard Upgrades, Safety Inspections, Data & Networking, Security & CCTV).
5. **Our Work** — portfolio gallery grid.
6. **Guarantee** — the 7 Points of Guarantee.
7. **Recent Projects** — a dated timeline.
8. **Contact** — free-quote form plus direct contact details.
9. **Footer** — CTA band, navigation, contact, social, copyright.

## Getting Started

### View locally

Served via WAMP at:

```
http://localhost/sklentr/apexeds/index.html
```

Or open `index.html` directly in a browser.

### Edit styles

Styles are authored in SCSS and compiled to `assets/css/styles.css`. Recompile after editing any partial in `assets/scss/`:

```bash
# one-off build
npx sass assets/scss/main.scss assets/css/styles.css --style=expanded

# watch mode during development
npx sass --watch assets/scss/main.scss assets/css/styles.css
```

`index.html` links only the compiled `assets/css/styles.css`.

## Design System

| Token | Value | Use |
|-------|-------|-----|
| `--ink` | `#0E0F0F` | near-black canvas / text |
| `--ink-soft` | `#1A1C1C` | raised panels |
| `--bolt` | `#E6E72B` | electric-yellow accent |
| `--bolt-dim` | `#C9CA1E` | pressed / hover |
| `--paper` | `#F7F7F4` | light sections |
| `--smoke` | `#9A9C99` | muted text |

**Fonts:** Lusitana (serif) for display headings, Lato (sans) for body and UI.

## Brand Details

- **Phone:** 0425 062 333
- **Email:** michael@apexeds.com.au
- **ABN:** 13 420 557 094
- **Service area:** Sydney Metropolitan & Beyond
- **Hours:** Mon–Sat · 6:00 AM – 5:00 PM

See [`task.md`](task.md) for the full design brief, motion plan, and build checklist.

## 👨‍💻 Credits

> Designed & developed by **Biplab Kumar Paul** — Web Designer & Developer
>
> 📱 01735 927356 · ✉️ biplab.cse.85@gmail.com
