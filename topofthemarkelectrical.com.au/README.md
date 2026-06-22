# Top of the Mark Electrical — Premium Landing Page

A premium rebuild of the landing page for **Top of the Mark Electrical**, a Sydney-based licensed electrician serving the Northern Suburbs (Macquarie Park, North Ryde, Ryde, Epping, Killara, Pymble, Hunters Hill and more).

The original site (https://topofthemarkelectrical.com.au/) is a standard WordPress build. This rebuild reuses 100% of the real content and imagery but elevates the visual treatment to an editorial / magazine-quality experience.

---

## ✨ Aesthetic Direction

> **"Trade Quarterly"** — editorial-industrial premium

A refined magazine-cover treatment for a Sydney electrician: heavy use of variable-axis serif display type, asymmetric grids, hairline rules, mono section numbers (§01), and one dramatic dark-navy midsection breaking up warm cream-paper editorial pages. Restraint over maximalism — every element has intent.

### Type
- **Display:** [Fraunces](https://fonts.google.com/specimen/Fraunces) (variable opsz + SOFT + WONK axes)
- **Body:** [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans)
- **Mono / editorial labels:** [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)

### Palette
| Role | Hex | Use |
|---|---|---|
| Paper | `#F4EFE6` | Warm cream background |
| Midnight | `#0E1B2C` | Primary ink, hero, CTA band, contact, footer |
| Electric Blue (brand) | `#00AEEF` | Accent, italic emphasis, copper-foil treatment |
| Cream | `#E8DCC4` | Secondary surface, soft type |
| Hairline | `rgba(14, 27, 44, 0.14)` | Section rules |

---

## 🏗️ Tech Stack

- **HTML5** — single landing page, semantic, anchor-nav driven
- **SCSS (Dart Sass)** — modular 7-1-ish architecture, compiled to a single `styles.css`
- **Vanilla JS** — no framework: sticky header, mobile drawer, smooth scroll, scroll-reveal (IntersectionObserver), modal popup with focus trap, lightweight form validation
- **[Fancybox v5](https://fancyapps.com/fancybox/)** — gallery lightbox (via CDN)
- **Google Fonts** — display + body + mono families

No bundler, no framework runtime. Just `sass` CLI for compilation.

---

## 📁 Project Structure

```
topofthemarkelectrical/
├── index.html               Single-page landing
├── package.json             sass devDep + npm scripts
├── README.md
├── task.md                  Project plan & specification
├── images/                  Source imagery (logos, hero, gallery, etc.)
└── assets/
    ├── css/
    │   └── styles.css       Compiled output (do not edit)
    ├── js/
    │   └── main.js          Nav, modal, scroll-reveal, form, Fancybox init
    └── scss/
        ├── main.scss        Entry — @use all partials
        ├── abstracts/       _variables, _mixins, _functions
        ├── base/            _reset, _typography, _global
        ├── layout/          _header, _footer, _grid
        ├── components/      _button, _card, _form, _testimonial,
        │                    _gallery, _value-prop, _nav, _modal
        ├── sections/        _hero, _intro, _services, _cta-band,
        │                    _about, _tips, _contact
        └── utilities/       _helpers
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS)

### Install
```bash
npm install
```

### Dev (watch mode)
Compiles SCSS on save with source maps:
```bash
npm run dev
```

### Production build
Compiles SCSS minified, no source map:
```bash
npm run build
```

### Serve
Drop the project under any web server. A local WAMP / MAMP / `npx serve` works. Default URL during development:
```
http://localhost/sklentr/topofthemarkelectrical/
```

---

## 🧱 Page Anatomy

The single-page experience flows top → bottom through these sections:

1. **Utility bar** — Pulsing status dot, phone, email
2. **Sticky header** — Logo, icon-driven anchor nav, modal-trigger CTA
3. **Hero** — Editorial display headline with italic accent + foil underline, work-van portrait in a copper-rimmed offset frame, spinning 2022 award medallion, 3-up trust strip, infinite suburb marquee
4. **Intro** — Premium meta strip (eyebrow + live "Available" status pill), big editorial heading, "Direct Line · 24/7" card, drifting electrical-theme icons on a light gradient
5. **Services** — Six editorial service cards (§01–§06), the last is a "Talk to Mark" CTA card
6. **Why Sydney calls us** — 4-up value proposition grid with line icons, hover lift
7. **CTA band** — Full-bleed dark navy with "Don't hesitate to chat" + direct phone
8. **About** — Premium framed crew portrait (offset frame + corner crop-marks) + about copy + 3-up stat strip
9. **Selected work** — Asymmetric editorial gallery (Fancybox lightbox)
10. **Reviews** — Two pull-quote testimonials (Allworx, Ward Partners) with Google review badge
11. **Tips & insights** — 3 blog teasers linking to the live blog
12. **Contact** — Dark navy section with details + inline form
13. **Footer** — CTA strip, 4-column grid (brand / services / sitemap / visit), credentials pills, social, locale

---

## 🪄 Notable Interactions

- **Quote modal** — Every "Request a Quote" button (header, hero, CTA band, footer, sitemap) opens a centered modal with the quote form. Focus-trapped, ESC-to-close, backdrop-click-to-close, focus restored to trigger on close.
- **Gallery lightbox** — Fancybox v5 with thumbnails, slideshow, fullscreen, keyboard nav.
- **Drifting decorative icons** — 6 electrical-theme SVGs in the intro section drift on independent eased keyframes (5–24s, staggered delays). Disabled under `prefers-reduced-motion`.
- **Premium image frames** — Hero and About images feature offset accent frames with hairline corner crop-marks; coordinated multi-element hover motion (lift, scale, frame slide, color shift).
- **Scroll-reveal** — Sections fade-up on enter via IntersectionObserver. Reduced-motion compliant.
- **Sticky header** — Shrinks on scroll, logo scales with viewport via `clamp()`.
- **Mobile drawer** — Full-screen dark navy drawer with large serif menu, icon-prefixed items, X close in cream.

---

## ♿ Accessibility

- Semantic landmarks (`<header> <main> <section> <footer> <nav>`)
- Skip-to-content link
- `aria-label` / `aria-labelledby` on regions, modals, buttons
- Form labels visible, not placeholder-only
- Focus rings (`outline: 2px solid` with offset) on all interactive elements
- Focus trap inside open modal
- `prefers-reduced-motion` respected for all decorative animations

---

## 🔍 SEO

- `<title>` + `<meta name="description">` tuned for "Sydney electrician North Ryde"
- Open Graph + canonical
- `LocalBusiness` JSON-LD with real NAP (name, address, phone), service area, opening hours, award
- Favicon set from brand mark

---

## 📜 Content Notes

All copy, imagery, testimonials, contact details and service descriptions are sourced verbatim from the live site at https://topofthemarkelectrical.com.au/. No content has been invented.

- **Phone:** 0414 647 661
- **Email:** info@topofthemarkelectrical.com.au
- **Address:** 18 Cathleen Street, North Ryde NSW 2113

---

## 📦 Out of Scope (v1)

- Inner pages (service sub-pages, suburb pages, blog detail) — links point to live site
- CMS / backend form handling — form uses `mailto:` action
- Live chat
- Multi-language

---

## 📄 License

This rebuild is a private project for Top of the Mark Electrical. All brand imagery, content and testimonials belong to Top of the Mark Electrical.
