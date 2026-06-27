# Trance Electrical

A premium, single-page marketing website for **Trance Electrical** — licensed electricians
based in Rouse Hill, NSW. Built with hand-written HTML and SCSS, with a small amount of
vanilla JavaScript for interactions.

> **Stay Connected.**

---

## ✨ Features

- **Dark editorial hero** with a live-text headline (no baked-in image), trust stats and a framed photo.
- **Sticky header** that matches the hero, with a Services dropdown and an app-style mobile drawer.
- **"Energized" current concept** — a glowing power rail that charges as you scroll, a flickering bolt, film grain.
- **Animated section titles** — self-drawing hand-made SVG underlines, a different shape per section.
- **Services grid** — 9 numbered service cards with hover states.
- **Recent Projects gallery** — a premium [Swiper.js](https://swiperjs.com/) slider (coverflow peek, autoplay, captions).
- **Location** section with a live Google Map embed (Rouse Hill).
- **Premium enquiry modal** — split brand/form dialog opened by every "Enquire Now" button (`mailto:` submit).
- **Mobile app feel** — fixed bottom action bar (Call · Email · Enquire), clean app header.
- **Scroll reveals, count-up stat, shine-sweep buttons** and full `prefers-reduced-motion` support.
- Responsive across mobile / tablet / desktop, with a favicon set and social/SEO meta.

---

## 🗂 Project structure

```
tranceelectrical/
├── index.html                 # the page
├── css/
│   └── style.css              # compiled CSS (do not edit by hand)
├── scss/                      # source styles
│   ├── style.scss             # entry — @use's all partials
│   ├── _variables.scss        # colours, fonts, breakpoints, tokens
│   ├── _base.scss             # reset, typography, buttons, section titles
│   ├── _header.scss           # top bar, header, nav, mobile drawer + bottom app bar
│   ├── _hero.scss             # hero + credibility marquee
│   ├── _sections.scss         # about, services, work slider, location, CTA
│   ├── _footer.scss           # footer + bottom credit bar
│   ├── _fx.scss               # grain, power rail, logo pulse
│   └── _modal.scss            # enquiry modal
├── assets/
│   ├── js/main.js             # nav, reveals, slider, power rail, count-up, modal
│   ├── favicon.svg            # primary favicon
│   ├── favicon-32.png         # PNG fallback
│   ├── apple-touch-icon.png   # iOS icon
│   └── images/                # hero, about, gallery photos, logo
├── task.md                    # build notes / scope
└── README.md
```

---

## 🛠 Tech

- **HTML5** (semantic, accessible: ARIA on nav, dialog, icons).
- **SCSS** (Dart Sass, `@use` modules) → compiled to `css/style.css`.
- **Vanilla JS** — no framework.
- **Swiper.js 11** (via jsDelivr CDN) for the projects gallery.
- **Fonts:** Montserrat (display) + Open Sans (body), with Arial / sans-serif fallback.

### Colour palette

| Token        | Value     | Use                         |
|--------------|-----------|-----------------------------|
| Ink          | `#121214` | Dark surfaces, header, hero |
| Cream        | `#f7e8d6` | Warm section backgrounds    |
| Orange       | `#f6911e` | Brand accent                |
| Orange (ink) | `#c9610a` | Links, buttons              |

---

## 🚀 Getting started

The site is static — just serve the folder (e.g. via WAMP/XAMPP or any static host) and open
`index.html`.

### Editing styles

Styles are written in SCSS. After changing anything in `scss/`, recompile:

```bash
# one-off build
npx sass scss/style.scss css/style.css --style=expanded --no-source-map

# or auto-rebuild while editing
npx sass --watch scss/style.scss css/style.css
```

> Edit the `scss/` partials, **not** `css/style.css` (it is generated).

### Editing content

- **Gallery:** add an image to `assets/images/`, copy a `.swiper-slide` block in `index.html`,
  update its `src` / tag / title. Pagination scales automatically.
- **Title underlines:** tweak the `d="…"` path inside each `<svg class="uline">` in `index.html`.
- **Enquiry form:** submissions open the visitor's mail client via `mailto:info@tranceelectrical.com`.
  Swap for a service like Formspree if real form handling is needed.

---

## 📇 Business details

- **Phone:** 0421 163 003
- **Email:** info@tranceelectrical.com
- **Hours:** Mon–Fri 7 a.m.–5 p.m. (after-hours available)
- **Licence No:** 349065C
- **Area:** Rouse Hill & North West Sydney
- [Instagram](https://www.instagram.com/tranceelectrical/?hl=en) ·
  [Facebook](https://www.facebook.com/profile.php?id=100087193126450)

---

## 👨‍💻 Credits

Designed & developed by **Biplab Kumar Paul** — Web Designer & Developer
📱 01735 927356 · ✉️ biplab.cse.85@gmail.com

Site credit: [Capsule DIGITAL](https://www.capsuledigital.com.au/)
