# Sloan Electrical — Homepage

A premium single-page marketing site for **Sloan Electrical**, the licensed
A-Grade electrical team serving Melbourne's Inner West.

> *"Trusted electrical work, done with quiet excellence."*

The brief: editorial, restrained, confidence-led — a blend of Aesop-style
restraint with the structured assurance of a high-end trades brand.
Cinematic dark hero, brass-on-ink palette, generous whitespace, refined
micro-details.

---

## Stack

| Layer       | Tech                                                          |
| ----------- | ------------------------------------------------------------- |
| Markup      | Semantic HTML5, single `index.html`                           |
| Styling     | **SCSS** (7-1 inspired) compiled to `assets/css/main.css`     |
| Behaviour   | Vanilla JavaScript (`assets/js/main.js`) — no framework       |
| Fonts       | Fraunces (display) · Geist (UI) · Geist Mono (eyebrows)       |
| Tooling     | Dart Sass CLI or VS Code *Live Sass Compiler*                 |

No build pipeline beyond Sass — drop the folder into any static host
or Apache/WAMP doc root and it runs.

---

## Project structure

```
sloanelectrical/
├── index.html                  # entire homepage
├── assets/
│   ├── css/main.css            # compiled stylesheet
│   ├── js/main.js              # interactions
│   └── scss/                   # source styles (7-1)
│       ├── main.scss
│       ├── abstracts/          # tokens, mixins, functions
│       ├── base/               # reset, typography, globals
│       ├── layout/             # container, grid, header, footer
│       ├── components/         # button, card, badge, accordion, form, nav
│       ├── sections/           # hero-alt, trust-bar, services, why, …
│       └── utilities/          # animations, helpers
├── images/                     # photography + logo
├── task.md                     # design & build brief
└── README.md
```

Every `.scss` partial carries the author header block specified in the
brief — stripped automatically from compressed output.

---

## Homepage sections

1. **Hero (cinematic bento)** — headline + on-site photo + 15-year stat + 24/7 call line
2. **Trust bar** — count-up stats (15 yrs · 60+ suburbs · 100% written quotes · 24/7)
3. **Services** — three pillars: Residential, Commercial, Emergency
4. **Why Sloan** — six differentiators, including hospital-theatre-grade work
5. **Process** — four-step rhythm with brass progress line
6. **Commercial showcase** — asymmetric photo stack + capability strip
7. **Service area** — stylised SVG map of the four Inner-West LGAs
8. **Testimonials** — refined carousel with serif pull-quotes
9. **Emergency CTA band** — dark, sparking SVG line, brass phone CTA
10. **FAQ** — accordion with five plain-spoken answers
11. **Quote form** — floating-label form, *"reply within 1 business hour"*
12. **Footer** — brand + Facebook link + nav + *Made by* credit

---

## Running locally

### Option 1 — WAMP / XAMPP (recommended on Windows)

Drop the project under your Apache doc root, then visit:

```
http://localhost/sklentr/sloanelectrical/
```

### Option 2 — any static server

```bash
npx serve .
# or
python -m http.server 8000
```

### Recompiling SCSS

The repo ships with a current `assets/css/main.css`, so no compile step
is required to run the site. To rebuild after editing partials:

```bash
sass assets/scss/main.scss assets/css/main.css --style=compressed
```

Or use the *Live Sass Compiler* VS Code extension — point its output at
`assets/css/main.css`.

---

## Motion & accessibility

- All scroll-reveal, marquee, parallax and count-up animations honour
  `prefers-reduced-motion`.
- Focus rings on every interactive element.
- Semantic landmarks, ARIA on the nav toggle, accordion, and form.
- Color contrast tuned to WCAG AA on body copy, AAA on long-form blocks.
- Mobile-first responsive: 360 / 768 / 1024 / 1280 / 1440.

---

## Brand & contact

- **Phone:** 0406 876 849 (answered 24/7)
- **Email:** admin@sloanelectrical.com
- **HQ:** 87 Cypress Ave, Brooklyn VIC
- **Coverage:** Brimbank · Hobsons Bay · Maribyrnong · Moonee Valley (60+ suburbs)
- **Social:** [facebook.com/SloanElectrical](https://www.facebook.com/SloanElectrical/)

---

## Credits

Designed & developed by **Biplab Kumar Paul**
Mobile: 01735 927356 · Email: biplab.cse.85@gmail.com

Made by [CapsuleDIGITAL](https://www.capsuledigital.com.au/).
