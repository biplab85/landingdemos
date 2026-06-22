# Task: Premium Rebuild — Top of the Mark Electrical (Landing Page)

**Source:** https://topofthemarkelectrical.com.au/
**Scope:** Single landing page — `index.html` only (no inner pages)
**Goal:** A premium, professional, modern marketing site for a Sydney electrician — visibly higher-end than the original WordPress template, while preserving all real content (copy, imagery, contact details, testimonials).

---

## 1. Objectives

- Reuse 100% of the **content and imagery** from the live site (no invented copy, no placeholder Lorem Ipsum).
- Elevate visual quality: better typography hierarchy, generous whitespace, refined color palette, considered motion, polished components.
- Mobile-first, fully responsive (320px → 1920px).
- Fast: lazy-load images, optimized assets, no heavy frameworks unless justified.
- Accessible (WCAG AA): semantic HTML, keyboard navigation, alt text, color contrast.
- Single-file delivery preferred: `index.html` + sibling `assets/` (CSS, JS, images).

---

## 2. Deliverables

```
topofthemarkelectrical/
├── index.html
├── task.md                  (this file)
├── package.json             (dev deps: sass CLI for compilation)
├── assets/
│   ├── scss/
│   │   ├── main.scss        (entry — @use all partials)
│   │   ├── abstracts/
│   │   │   ├── _variables.scss   (colors, type scale, spacing, breakpoints)
│   │   │   ├── _mixins.scss      (media-queries, fluid-type, focus-ring)
│   │   │   └── _functions.scss
│   │   ├── base/
│   │   │   ├── _reset.scss
│   │   │   ├── _typography.scss
│   │   │   └── _global.scss
│   │   ├── layout/
│   │   │   ├── _header.scss
│   │   │   ├── _footer.scss
│   │   │   └── _grid.scss
│   │   ├── components/
│   │   │   ├── _button.scss
│   │   │   ├── _card.scss
│   │   │   ├── _form.scss
│   │   │   ├── _testimonial.scss
│   │   │   ├── _gallery.scss
│   │   │   ├── _value-prop.scss
│   │   │   └── _nav.scss
│   │   ├── sections/
│   │   │   ├── _hero.scss
│   │   │   ├── _intro.scss
│   │   │   ├── _services.scss
│   │   │   ├── _cta-band.scss
│   │   │   ├── _about.scss
│   │   │   ├── _tips.scss
│   │   │   └── _contact.scss
│   │   └── utilities/
│   │       └── _helpers.scss
│   ├── css/
│   │   ├── styles.css       (compiled output — do not edit by hand)
│   │   └── styles.css.map
│   ├── js/
│   │   └── main.js
│   └── images/
│       ├── logo.png
│       ├── hero/
│       ├── services/
│       ├── gallery/
│       ├── icons/
│       ├── testimonials/
│       └── blog/
└── README.md
```

---

## 3. Brand & Design System

### 3.1 Brand positioning
- **Tagline:** Sydney's neighbourly electrician — premium, reliable, 24/7.
- **Tone:** trustworthy, local, established, modern. Not flashy. Not corporate-cold.

### 3.2 Color palette (proposed — premium electric)
| Role | Color | Hex |
|---|---|---|
| Primary (deep navy) | Trust, premium | `#0B1B2B` |
| Accent (electric amber) | Energy, electricity | `#F5A623` |
| Accent alt (warm gold) | Premium highlight | `#D4A24C` |
| Surface | Off-white / paper | `#FAF8F5` |
| Surface 2 | Soft neutral | `#F1ECE4` |
| Text primary | Near-black | `#101820` |
| Text muted | Slate | `#5C6773` |
| Border | Hairline | `#E5DFD5` |
| Success / Trust | Forest | `#1F6B4A` |

### 3.3 Typography
- **Headings:** A refined serif or semi-serif (e.g., *Fraunces*, *Playfair Display*, or *DM Serif Display*) — gives "premium / established" feel vs. the original's generic sans-serif.
- **Body:** A clean modern grotesk (e.g., *Inter*, *Manrope*, or *General Sans*).
- Pair example: Fraunces (Display) + Inter (Body).
- Scale: 12 / 14 / 16 / 18 / 20 / 24 / 32 / 44 / 64 / 88 px.

### 3.4 Design principles
- Generous whitespace; sections breathe (96–160px vertical padding desktop).
- Strong hero with editorial typography (not "stock-photo + slogan").
- Subtle animations (fade-up on scroll, micro hover states) — never gimmicky.
- Real photography over illustrations.
- Cards with hairline borders, soft shadows; no heavy drop-shadows or gradients.
- Numeric proof points (years, jobs, response time) where defensible from source.

---

## 4. Page Sections (Top → Bottom)

> All section copy and image URLs below come directly from the source site.

### 4.1 Top utility bar (thin)
- Left: "Servicing Sydney's Northern Suburbs"
- Right: Phone `0414 647 661` · Email `info@topofthemarkelectrical.com.au`
- Sticky on scroll? No — collapses into header.

### 4.2 Header / Nav (sticky)
- Logo (left): `2023/01/cropped-topofthemarklogo-100x100.png`
- Nav (anchor links only — single page): Services · About · Work · Reviews · Contact
- CTA button (right): **Request a Quote** → scroll to form

### 4.3 Hero
- Heading: **"Electrician in Sydney, NSW"** (treated editorially — large display serif)
- Subhead: *"One that will give you a quote within 24 hours and have the job done quickly and efficiently. Sydney's neighbourly electrician — Top of the Mark Electrical."*
- Primary CTA: **Request a Free Quote** · Secondary CTA: **Call 0414 647 661**
- Visual: layered composition using `workvan-1024x483-1.webp` and award badge `2022-commercial-project-of-the-year-award...webp`
- Trust strip below hero: "Licensed · Insured · 24/7 · 2022 NSW Commercial Project of the Year"

### 4.4 Intro band
- Heading: **"Your Local 24-Hour Electrical Contractors in Sydney, NSW"**
- Body: *"We provide all your electrical and data services solutions."*
- Small location line: *"Servicing the entire Sydney metropolitan area — Macquarie Park, North Ryde, Ryde, Denistone, Epping, Killara, Pymble, Gladesville, Putney, Hunters Hill and surrounds."*

### 4.5 Services grid — "Your Trusted Electrical Company in Sydney"
Five service cards (image + title + 1-line description + arrow link):
1. **Residential Services** — `residential.webp`
2. **Emergency Repair Services** — `emergency-repairs.webp`
3. **Commercial Services** — `commercial.webp`
4. **Real Estate Agency Services** — `realestate.jpg`
5. **Strata Services** — `strata.jpg`

Layout: 3 columns desktop, 2 tablet, 1 mobile. Tall cards with image fill, hover lift.

### 4.6 Value props — "Why Top of the Mark"
Four icon blocks (use source PNG icons):
1. **Reliable and Affordable Pricing** — `Reliable-and-Affordable-Pricing.png`
2. **Licensed Professionals** — `Licensed-and-Professionals.png`
3. **Proud Local** — `Proud-Local.png`
4. **24/7 Electrician Availability** — `7-Electrician-Availability.png`

Each: icon · title · 1–2 line body (verbatim from source).

### 4.7 Mid-page CTA band
- Background: `darkwire.jpg` with dark overlay
- Heading: **"Don't hesitate to chat with us."**
- Button: **Request a Quote**
- Phone displayed prominently.

### 4.8 Work / Gallery
- Heading: **"Recent Work"** (small editorial)
- Masonry or 4-up grid using:
  - `1f0a792e-5964-4c6c-aa7e-01e38449992a-2.jpg`
  - `5b55aa29-089b-4c6e-a3cc-caa58e5a80eb-2.jpg`
  - `a34a91f4-c811-43cb-8320-42b3a1267da7-2.jpg`
  - `54bd859d-a371-45ea-bc93-e50992a7636b-2.jpg`
- Lightbox on click (vanilla, no library if possible).

### 4.9 Testimonials — "What our happy customers say"
Two-up premium quote cards (large quote mark, italic display serif body):
1. **Ian Giblett, Allworx Building & Maintenance** — full quote from source; logo `logo-allworx.png`
2. **Ward Partners Real Estate** — full quote from source; logo `logo-ward-real-estate.jpg`

### 4.10 About strip
- Image: `electricalteam-1.jpg` (team photo) left
- Right: short "About Mark and the team" paragraph synthesized from existing on-site language (no fabrication of credentials). Mention: licensed, 2022 NSW Commercial Project of the Year winner, led by Mark Mesiti, Sydney-local since long-term client relationships dating back to 2015.

### 4.11 Tips & insights — "Mark's electrical tips and safety guide"
Three article cards (image · title · "Read more" — linking to original blog posts on the live site):
1. *Top 9 Electrical Fixtures in Sydney Business Offices That Need a Licensed Commercial Electrician*
2. *Powering Up Your Business: The Importance of Commercial Electricians in Sydney*
3. *Emergency Electrical Services Offered by Electricians*

### 4.12 Contact — "Request a Quote"
Two-column layout:
- **Left:** Contact details card
  - Phone · Email · Address (18 Cathleen Street, North Ryde NSW 2113)
  - "24/7 emergency line available"
  - Embedded Google Map (lightweight iframe) of North Ryde
- **Right:** Quote form (matches source fields)
  - Your Full Name
  - Email Address
  - Phone Number
  - Your Complete Address
  - What services would you like to enquire about? (dropdown of the 5 services)
  - Job Description Summary (Optional, textarea)
  - Submit: **Send My Request**

> Form submission: client-side validation only for v1; action attribute left as TODO (`mailto:` fallback or Formspree/Web3Forms placeholder).

### 4.13 Footer
- Brand block: logo + tagline + license note placeholder
- Service list (anchor links)
- Suburbs served list
- Contact column
- Bottom bar: © 2026 Top of the Mark Electrical · Privacy · Sitemap

---

## 5. Technical Plan

### 5.1 Stack
- Static HTML5.
- **Styling: SCSS (Dart Sass)** — compiled to a single `assets/css/styles.css` (+ source map). Modular 7-1-ish architecture: `abstracts / base / layout / components / sections / utilities`, all `@use`'d from `main.scss`. CSS custom properties still used at runtime for theming tokens; SCSS handles structure, mixins, math, and partials.
- Vanilla JS for: mobile nav toggle, smooth scroll, scroll-reveal, lightbox, form validation.
- Build: `sass` CLI only (no bundler, no framework). `package.json` scripts:
  - `npm run sass` — one-shot compile (compressed)
  - `npm run dev` — `sass --watch assets/scss/main.scss assets/css/styles.css --style=expanded --source-map`
  - `npm run build` — `sass assets/scss/main.scss assets/css/styles.css --style=compressed --no-source-map`
- The HTML links only the compiled `assets/css/styles.css` — never the SCSS directly.
- Use modern Sass: `@use` / `@forward` (no legacy `@import`); namespaces explicit; `math.div` instead of `/`.
- Google Fonts via `<link rel="preconnect">`.

### 5.2 Performance budget
- LCP < 2.0s on 4G
- Total page weight (excluding hero image) < 800 KB
- All non-critical images `loading="lazy"` + `decoding="async"`
- Hero image preloaded
- Self-host downloaded source images into `assets/images/` (do not hot-link the WP uploads dir)
- Use `<picture>` with WebP where source provides it

### 5.3 Accessibility
- Landmarks: `<header> <main> <section> <footer>`
- Skip-to-content link
- Form labels (visible, not placeholder-only)
- Focus rings preserved
- Color contrast ≥ 4.5:1 for body text
- `prefers-reduced-motion` respected for scroll animations

### 5.4 SEO basics
- `<title>` and `<meta name="description">` written for "Sydney electrician North Ryde"
- Open Graph + Twitter card tags
- `LocalBusiness` JSON-LD structured data using real NAP (name/address/phone) from source
- Canonical URL
- Favicon set from existing logo

### 5.5 Cross-browser
- Latest Chrome / Edge / Firefox / Safari. Mobile Safari + Chrome Android.

---

## 6. Implementation Phases

### Phase 1 — Asset acquisition
- [ ] Download all 24 source images listed in `task.md §7` into `assets/images/` (organized by section)
- [ ] Rename to clear, kebab-case filenames
- [ ] Generate WebP versions where missing
- [ ] Create favicon set from logo

### Phase 2 — Structure
- [ ] Scaffold `index.html` with semantic sections (top → bottom per §4)
- [ ] Insert all real copy verbatim from source
- [ ] Wire anchor nav
- [ ] Initialize `package.json`, install `sass` as a dev dependency, add `dev` / `build` scripts
- [ ] Scaffold SCSS folder structure (7-1-ish per §2) with empty partials and `main.scss` entry that `@use`s them all

### Phase 3 — Visual design (SCSS)
- [ ] Define design tokens in `abstracts/_variables.scss` (colors, type scale, spacing, breakpoints, radii, shadows) and expose runtime CSS custom properties from `base/_global.scss`
- [ ] Author mixins in `abstracts/_mixins.scss`: `respond-to($bp)`, `fluid-type($min,$max)`, `focus-ring`, `container`
- [ ] Build hero (`sections/_hero.scss`)
- [ ] Build services grid (`sections/_services.scss` + `components/_card.scss`)
- [ ] Build value-prop row (`components/_value-prop.scss`)
- [ ] Build mid-CTA band (`sections/_cta-band.scss`)
- [ ] Build gallery (`components/_gallery.scss`)
- [ ] Build testimonials (`components/_testimonial.scss`)
- [ ] Build about + tips + contact + footer (`sections/_about.scss`, `_tips.scss`, `_contact.scss`, `layout/_footer.scss`)
- [ ] Run `npm run build` and verify compiled `assets/css/styles.css` is minified, no Sass deprecation warnings

### Phase 4 — Interaction
- [ ] Sticky header w/ shrink on scroll
- [ ] Mobile nav drawer
- [ ] Smooth-scroll anchor links
- [ ] Scroll-reveal animations (IntersectionObserver, respect reduced motion)
- [ ] Gallery lightbox
- [ ] Form client-side validation

### Phase 5 — Polish & QA
- [ ] Lighthouse audit (Performance / A11y / Best Practices / SEO all ≥ 95)
- [ ] Responsive check at 320, 375, 414, 768, 1024, 1280, 1440, 1920
- [ ] Verify all links resolve to anchors or external blog posts
- [ ] Verify all images have alt text
- [ ] Cross-browser smoke test

---

## 7. Asset Manifest (from source)

### Logos
- `cropped-topofthemarklogo-100x100.png` → `assets/images/logo.png`
- `brandlogo.png` → `assets/images/logo-footer.png`

### Hero / awards
- `workvan-1024x483-1.webp` → `assets/images/hero/workvan.webp`
- `2022-commercial-project-of-the-year-award-...webp` → `assets/images/hero/award-2022.webp`

### Services
- `residential.webp` · `emergency-repairs.webp` · `commercial.webp` · `realestate.jpg` · `strata.jpg`
- CTA band background: `darkwire.jpg`

### Value-prop icons
- `Reliable-and-Affordable-Pricing.png`
- `Licensed-and-Professionals.png`
- `Proud-Local.png`
- `7-Electrician-Availability.png`

### Testimonial logos
- `logo-allworx.png`
- `logo-ward-real-estate.jpg`

### Gallery
- `1f0a792e-5964-4c6c-aa7e-01e38449992a-2.jpg`
- `5b55aa29-089b-4c6e-a3cc-caa58e5a80eb-2.jpg`
- `a34a91f4-c811-43cb-8320-42b3a1267da7-2.jpg`
- `54bd859d-a371-45ea-bc93-e50992a7636b-2.jpg`

### Team
- `electricalteam-1.jpg`

### Blog thumbnails
- `Top-9-Electrical-Fixtures-...jpg`
- `Benefits-of-Hiring-a-Commercial-Electrician-in-Sydney.jpg`
- `Emergency-Electrical-Services-Offered-by-Electricians.jpg`

---

## 8. Content Manifest (verbatim from source)

**Contact:**
- Phone: `0414 647 661`
- Email: `info@topofthemarkelectrical.com.au`
- Address: `18 Cathleen Street, North Ryde NSW 2113`

**Service suburbs:** Macquarie Park · North Ryde · Ryde · West Ryde · East Ryde · Denistone · Denistone East · Epping · North Epping · Killara · Pymble · West Pymble · Gladesville · Putney · Hunters Hill

**Headlines used as-is:**
- Electrician in Sydney, NSW
- Your Local 24-Hour Electrical Contractors in Sydney, NSW
- We provide all your electrical and data services solutions.
- Your Trusted Electrical Company in Sydney
- Don't hesitate to chat with us.
- What our happy customers say
- Mark's electrical tips and safety guide
- Request a Quote

**Value-prop body copy:** (verbatim from source — see §4.6)

**Testimonials:** Two full quotes (Allworx + Ward Partners) — verbatim.

---

## 9. Out of Scope (v1)

- Inner pages (services sub-pages, suburb pages, blog detail) — links point to live site.
- CMS / backend form handling.
- Booking / scheduling integration.
- Live chat widget.
- Multi-language.

---

## 10. Acceptance Criteria

- [ ] `index.html` opens standalone (file:// or local server) with all assets loaded
- [ ] No dead images, no broken anchors
- [ ] Looks visibly more premium than the source (peer review judgment call)
- [ ] All real copy is correctly preserved from source — no Lorem Ipsum
- [ ] Lighthouse: ≥ 95 across all four categories on desktop, ≥ 90 on mobile
- [ ] Mobile usable down to 320px
- [ ] Phone number and email are click-to-call / click-to-mail

---

## 11. Open Questions (resolve before Phase 3)

1. Final type pairing — Fraunces + Inter, or alternative? (default: Fraunces + Inter)
2. Accent color — electric amber `#F5A623` or warm gold `#D4A24C`? (default: amber, more "electric")
3. Form submission backend — Formspree / Web3Forms / mailto fallback? (default: mailto for v1)
4. Include map embed, or static styled image of map area? (default: lightweight iframe, lazy-loaded)
5. Show suburb list as chips in footer, or full sentence? (default: chips — more premium)
