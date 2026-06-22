# Task: Melbourne Wide Electrical — One-Page Website (index.html)

**Reference site:** https://melbournewideelectrical.com.au/
**Scope:** Single `index.html` (one page) + SCSS-based styles
**Date:** 2026-05-26

---

## 1. Designer Credit (mandatory header on EVERY .scss file)

Every `.scss` file MUST begin with this exact block:

```scss
// ─────────────────────────────────────────────────────────────
// Designed & developed by
// Biplab Kumar Paul — Web Designer & Developer
// Mobile: 01735 927356
// Email:  biplab.cse.85@gmail.com
// ─────────────────────────────────────────────────────────────
```

---

## 2. Tech Stack

- **HTML5** — semantic markup
- **SCSS** — compiled to CSS (single compiled `style.css` linked from `index.html`)
- **Vanilla JS** — for menu toggle, sticky header, smooth scroll, testimonial slider
- **No frameworks** — pure HTML/SCSS/JS only
- **Icons** — Font Awesome 6 (CDN) or inline SVGs
- **Responsive** — mobile-first; breakpoints at 480, 768, 992, 1200

---

## 3. Typography (font families to use)

```scss
$font-heading: 'Montserrat', Helvetica, Arial, sans-serif;
$font-body:    'Lato', sans-serif;
$font-alt:     'Roboto', sans-serif;
```

- Load from Google Fonts (Montserrat 400/500/600/700/800, Lato 300/400/700, Roboto 400/500/700).
- Headings → Montserrat
- Body / paragraphs → Lato
- Buttons, small UI text, badges → Roboto

---

## 4. Color Palette (derived from reference site)

```scss
$color-primary:    #1a2b5f;   // deep navy (header / headings)
$color-secondary:  #f57c1f;   // orange (CTA, accents, highlights)
$color-accent:     #ffc107;   // warm yellow (special offer / badges)
$color-dark:       #0d1a3d;   // footer dark navy
$color-text:       #4a4a4a;   // body text grey
$color-muted:      #6b7280;   // muted captions
$color-light:      #f5f7fb;   // section alt background
$color-white:      #ffffff;
$color-border:     #e5e7eb;
$color-success:    #16a34a;
```

---

## 5. File Structure

```
melbournewideelectrical/
├── index.html
├── task.md
├── README.md
├── css/
│   └── style.css            (compiled output)
├── scss/
│   ├── style.scss           (main entry — imports everything)
│   ├── _variables.scss      (colors, fonts, spacing, breakpoints)
│   ├── _mixins.scss         (responsive, button, flex helpers)
│   ├── _reset.scss          (normalize / base reset)
│   ├── _base.scss           (typography, body, links, headings)
│   ├── _buttons.scss
│   ├── _topbar.scss         (top contact bar)
│   ├── _header.scss         (logo + nav + mobile menu)
│   ├── _hero.scss
│   ├── _features.scss       (trust badges row)
│   ├── _services.scss
│   ├── _about.scss
│   ├── _why-choose.scss
│   ├── _emergency.scss      (emergency CTA strip)
│   ├── _testimonials.scss
│   ├── _service-areas.scss
│   ├── _cta.scss            (final call-to-action)
│   ├── _footer.scss
│   └── _responsive.scss     (global media-query overrides)
├── js/
│   └── main.js
└── image/                   (existing folder with logo.png + 50+ photos)
```

Every `_*.scss` and `style.scss` MUST start with the designer credit comment.

---

## 6. Page Sections (in order, single `index.html`)

### 6.1 Top Bar
- Left: phone `1300 635 294` + email `info@melbournewideelectrical.com.au`
- Right: hours `24/7 Emergency Service` + social icons (Facebook, LinkedIn)
- Background: deep navy, text white, ~36px tall

### 6.2 Header / Navigation (sticky on scroll)
- Logo (left) → `image/logo.png`
- Main nav (center/right):
  - Home
  - About
  - Services (dropdown: Domestic, Commercial, Emergency, Plumbing)
  - Why Us
  - Service Areas
  - Testimonials
  - Contact
- CTA button (right): "Request a Quote"
- Mobile: hamburger → slide-in off-canvas menu

### 6.3 Hero
- Full-width background (electrician at work — use one of `image/01 (xx).jpeg`)
- Dark gradient overlay
- Eyebrow: "LICENSED & INSURED ELECTRICIANS"
- H1: **Electrician in Melbourne**
- Sub: "Melbourne Wide Electrical can help with all your electrical work, big or small, for a fair price and quick turnaround."
- Special offer ribbon (yellow): "MAY 2026 SPECIAL — Book today & get **$50 OFF** any service"
- Two CTAs: `Request a Free Quote` (orange filled) and `Call 1300 635 294` (outline white)
- Bullet trust strip: ✓ Lifetime workmanship guarantee  ✓ Same-day service  ✓ Upfront pricing

### 6.4 Features / Trust Badges Row
4-card row directly under hero, white background, slight overlap:
1. **Upfront Pricing** — "No unpleasant surprises when the bill comes."
2. **Same-Day Service** — "95% of jobs completed same day."
3. **Lifetime Guarantee** — "Workmanship backed by a lifetime guarantee."
4. **Licensed & Insured** — "A-grade electricians, fully insured."

### 6.5 About
Two-column layout:
- Left: image grid (electrician photos)
- Right:
  - Eyebrow: "ABOUT US"
  - H2: "Your trusted local electricians for 20+ years"
  - Paragraphs about small local business, going the extra mile, A-grade electricians, licensed & insured
  - Bullet list of credentials (NECA Member, Energy Safe Victoria, fully insured)
  - CTA: "Learn More" + phone link

### 6.6 Services (main grid)
Section title: "Our Electrical Services" — subtitle: "Domestic • Commercial • Emergency — No Job Too Big or Too Small"

Service cards (8 minimum, with icon + image + title + description + "Learn more" link):
1. **Switchboard & Safety Switch Upgrades**
2. **LED Lighting & Downlights**
3. **Power Point Installation**
4. **Home Security & CCTV**
5. **Smoke Detectors**
6. **Electrical House Wiring**
7. **Data Cabling**
8. **Home Theatre Installation**
9. **Antenna Installations**
10. **Sensor Lighting**

Optional secondary block: "Commercial" + "Emergency" highlighted differently.

### 6.7 Why Choose Us
6-feature grid with icons:
- ✅ Upfront Pricing
- ⚡ Same Day Service
- 🧹 Clean Work
- 🛡️ Trained & Insured
- 🚐 Well-Stocked Vans
- 🏆 Lifetime Guarantee

Background: subtle pattern or light grey.

### 6.8 Emergency Services Strip
Full-width orange/red CTA band:
- H3: "24/7 Emergency Electrician"
- Text: "Blown fuse? Electrical fire? Power failure? We respond fast — day or night."
- Big button: `Call 1300 635 294`

### 6.9 Testimonials
- Eyebrow: "608 GOOGLE REVIEWS — EXCELLENT ⭐⭐⭐⭐⭐"
- H2: "What our customers say"
- Slider/carousel (3 cards visible on desktop, 1 on mobile):
  - Tippi Coulter: "Friendly and professional, would recommend."
  - Jelo Oo: "James was thorough, honest, and prioritised safety."
  - Courtney Kim: "Meticulous workmanship — clear pride in delivering quality results."
  - Add 2–3 more about "Lenny" — friendly, efficient, professional.
- Auto-rotate every 6s, manual prev/next.

### 6.10 Service Areas
- H2: "Areas We Service Across Melbourne"
- Tag/chip grid of suburbs: Coburg, Craigieburn, Eltham, Epping, Watsonia, Bundoora, Heidelberg, Preston, Brunswick, Reservoir, Thomastown, Mill Park, Greensborough, Diamond Creek, Plenty, Doncaster, Templestowe, Ivanhoe, Northcote, Fitzroy, Carlton, Essendon, Pascoe Vale, Glenroy, etc.
- Optional map placeholder image.

### 6.11 Final CTA / Quote Form
Two-column:
- Left: contact info card (address, phone, email, hours) + tagline
- Right: simple quote form (Name, Phone, Email, Service Type dropdown, Message, Submit button) — frontend only.

### 6.12 Footer (dark navy)
4 columns:
1. **Brand col** — logo (white version), short blurb, social icons
2. **Services** — top 6 service links
3. **Quick Links** — About, Why Us, Testimonials, Service Areas, Contact
4. **Contact** — Address `6 Edmund Rice Parade, Watsonia North, VIC 3087`, phone, email, hours

Bottom bar: `© 2026 Melbourne Wide Electrical. All rights reserved.` + Sitemap + Privacy + designer credit line.

---

## 7. JavaScript Behaviors

- Sticky header — add `.is-scrolled` class after 60px scroll
- Mobile hamburger — toggles off-canvas nav + body lock
- Smooth scroll for in-page anchors
- Testimonial slider (vanilla, no library)
- Back-to-top button (appears after 400px scroll)
- Quote form basic validation (HTML5 + JS), `preventDefault()` + simple "Thanks!" message
- Active nav link highlight on scroll (IntersectionObserver)

---

## 8. Performance & Quality Bar

- Compress all hero/section images to web sizes (use existing JPEGs as-is for now)
- `loading="lazy"` on below-the-fold images
- Semantic HTML5: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Accessible: alt text on every image, aria-labels on icon buttons, focus states on all interactives
- Mobile-first SCSS, mobile breakpoint behaviour reviewed at 360, 480, 768, 1024, 1440
- All copy proofread — no lorem ipsum

---

## 9. Build / Compile

User compiles SCSS → CSS manually (Live Sass Compiler / `sass scss/style.scss css/style.css`). `index.html` links the compiled `css/style.css`.

---

## 10. Deliverables Checklist

- [ ] `index.html` — complete, semantic, all 12 sections
- [ ] `scss/style.scss` + all partials with credit header
- [ ] `css/style.css` — compiled output (or instructions to compile)
- [ ] `js/main.js` — all behaviors wired
- [ ] Uses logo from `image/logo.png`
- [ ] Uses photos from `image/` folder
- [ ] Fully responsive
- [ ] No console errors

---

*Created 2026-05-26 — Biplab Kumar Paul*
