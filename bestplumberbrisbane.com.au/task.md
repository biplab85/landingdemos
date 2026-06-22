# Best Plumber Brisbane — Project Task File

> **Reference site:** https://bestplumberbrisbane.com.au/
> **Goal:** Build a single-page static clone of the reference site.

---

## 1. Project Setup

### Tech Stack
- **HTML:** Single file → `index.html`
- **CSS:** Written in **SCSS**, compiled to `style.css`
- **JS:** Vanilla JS (only if needed for mobile nav toggle / smooth scroll)
- **Images:** Local `assets/images/` folder

### Font Stack (global)
```css
font-family: Poppins, Helvetica, Arial, Lucida, sans-serif;
```
- Load Poppins from Google Fonts (weights: 300, 400, 500, 600, 700, 800)
- Apply to `body` and inherit everywhere

### Folder Structure
```
bestplumberbrisbane/
├── index.html
├── style.css            (compiled)
├── scss/
│   ├── style.scss       (main file – imports all partials)
│   ├── _variables.scss  (colors, fonts, breakpoints)
│   ├── _mixins.scss     (media queries, flex helpers)
│   ├── _reset.scss      (normalize/reset)
│   ├── _base.scss       (typography, body)
│   ├── _header.scss
│   ├── _hero.scss
│   ├── _services.scss
│   ├── _about.scss
│   ├── _why-choose.scss
│   ├── _cta.scss
│   ├── _contact.scss
│   └── _footer.scss
├── assets/
│   ├── images/
│   └── icons/
└── task.md
```

---

## 2. Design Tokens

### Colors (plumbing-industry palette — blue / orange CTA)
| Token             | Value      | Usage                          |
|-------------------|------------|--------------------------------|
| `$primary`        | `#0a3d62`  | Dark navy blue – headings, header bg |
| `$primary-light`  | `#1e6091`  | Hover states, links            |
| `$accent`         | `#f39c12`  | Orange CTA buttons, highlights |
| `$accent-hover`   | `#e67e22`  | Button hover                   |
| `$white`          | `#ffffff`  | Cards, text on dark bg         |
| `$light-bg`       | `#f5f7fa`  | Alternating section bg         |
| `$text-dark`      | `#2c3e50`  | Body text                      |
| `$text-muted`     | `#7f8c8d`  | Secondary text                 |
| `$border`         | `#e0e6ed`  | Card borders, dividers         |

### Typography Scale
- `h1`: 48px / 700 (mobile 32px)
- `h2`: 36px / 700 (mobile 26px)
- `h3`: 22px / 600
- `h4`: 18px / 600
- `body`: 16px / 400, line-height 1.7
- `small`: 14px

### Spacing
- Section padding: `100px 0` (desktop), `60px 0` (mobile)
- Container max-width: `1200px` with `0 20px` padding

### Breakpoints (mixins)
- `mobile`: max-width 576px
- `tablet`: max-width 768px
- `desktop`: max-width 1024px

---

## 3. Page Sections (top → bottom)

### 3.1 Header (Sticky)
- Logo (left): "Best Plumber Brisbane" with small plumber icon
- Nav menu (center/right): **Home, Services, About, Why Choose Us, Contact**
- Phone CTA (right): orange button "Call Now"
- Mobile: hamburger menu (toggle nav drawer)
- Background: white with subtle shadow on scroll

### 3.2 Hero Section
- **Headline:** "Best Plumber Brisbane: Your Trusted Experts for All Your Plumbing Needs!"
- **Subheadline:** "Best Plumber Brisbane delivers reliable, professional plumbing services across Brisbane and surrounding areas. We pride ourselves on high quality workmanship, honest pricing, and dependable service."
- **Two CTAs:**
  - Primary (orange): "Contact Us" → scrolls to #contact
  - Secondary (outline white): "Our Services" → scrolls to #services
- **Hero image:** right side — plumber at work (use placeholder `hero-plumber.jpg`)
- Background: dark navy gradient overlay or full-width image with overlay
- Layout: 2 columns desktop (text left, image right), stacked on mobile

### 3.3 Services Overview Grid
- **Heading:** "Our Plumbing Services"
- **Subheading:** "Licensed plumbers serving all of Brisbane — 7 days a week"
- **Grid:** 3 columns × 5 rows (15 services total), 2 cols on tablet, 1 col on mobile
- Each card: icon (top), title, short 1-line description, "Learn More" link

**Service Cards (15 total):**
1. **Emergency Plumbing** — Urgent repairs to minimise damage and restore functionality quickly.
2. **Blocked Drains** — We clear blocked drains efficiently using proven methods.
3. **Hot Water Systems** — Installation, repair, and maintenance for reliable hot water year-round.
4. **Gas Fitting** — Licensed plumbers providing safe and compliant gas fitting services.
5. **Pipe Repairs & Replacements** — From leaking pipes to burst mains.
6. **Leak Detection** — Advanced acoustic & ultrasonic listening equipment for non-invasive detection.
7. **CCTV Drain Inspection** — Identify blockage causes including tree roots, paper towels, and hair.
8. **Toilet Plumbing** — Most toilet leaks go unnoticed and cost hundreds in water fees yearly.
9. **High-Pressure Water Jetting** — 5,000 PSI jetters blast through tree roots and debris.
10. **Gas Plumbing** — Complete gas line installation and repair services.
11. **Broken / Leaking Taps** — Bathroom plumbing including taps, showers, toilets.
12. **Kitchen Plumbing** — Sinks, dishwashers, InSinkErator, fridges, gas cooktops & stoves.
13. **Leaking Shower** — Quick and affordable repairs with various shower head options.
14. **Pipe Relining** — "No Dig" pipe repair solution lasting up to 50 years.
15. **Plumbing Inspections** — 95% of homes have plumbing issues. Book a pre-purchase inspection.

### 3.4 About / Why Choose Us
- **Heading:** "Why Brisbane Trusts Us"
- **Intro:** "We offer faster response times, strong local knowledge, and a personalised approach to every job."
- **4-column features row** (icons + title + 1-line):
  1. **Licensed & Insured** — Fully qualified Brisbane plumbers
  2. **24/7 Emergency** — Available 7 days a week
  3. **Honest Pricing** — Upfront quotes, no hidden fees
  4. **Quality Workmanship** — Guaranteed work on every job

### 3.5 Featured Service Spotlight (alternating image/text rows)
4 blocks alternating left/right image-text layout:
1. **Emergency Plumbing** (full description + bullet list of common emergencies)
2. **Blocked Drains & CCTV Inspection** (combined section with technology mention)
3. **Hot Water Systems** (gas, electric, solar)
4. **Pipe Relining – The "No Dig" Solution** (50-year guarantee, environmentally friendly)

Each block: image one side, heading + paragraph + 3-4 bullet points + "Get a Quote" button.

### 3.6 CTA Banner (full-width)
- Dark navy background
- **Heading:** "Need a Plumber in Brisbane? Call Today!"
- **Subtext:** "Available 7 days a week for all your plumbing needs."
- Large orange button: "Contact Us Now"

### 3.7 Contact Section (`#contact`)
- **Heading:** "Get in Touch"
- **Two-column layout:**
  - **Left (info):**
    - Email: `info@bestplumberbrisbane.com.au`
    - Address: Brisbane CBD, Brisbane, QLD 4000
    - Hours: 7 days a week
    - Service area: All of Brisbane & surrounding suburbs
  - **Right (form):** simple contact form
    - Name (text)
    - Email (email)
    - Phone (tel)
    - Service needed (select)
    - Message (textarea)
    - Submit button (orange)

### 3.8 Footer
- Dark navy background, white text
- **3 columns:**
  1. **About column:** Logo + short tagline + service-area note
  2. **Quick Links:** Home, Services, About, Contact
  3. **Contact column:** Email, address, hours
- Bottom strip: `© 2026 Best Plumber Brisbane. All rights reserved. | Site by Apex Agency`

---

## 4. SCSS Build Strategy

### Approach
1. Write all partials inside `scss/`
2. Main file `scss/style.scss` imports them in order:
   ```scss
   @use 'variables' as *;
   @use 'mixins' as *;
   @use 'reset';
   @use 'base';
   @use 'header';
   @use 'hero';
   @use 'services';
   @use 'about';
   @use 'why-choose';
   @use 'cta';
   @use 'contact';
   @use 'footer';
   ```
3. Compile with Dart Sass: `sass scss/style.scss style.css --watch --style=compressed`
4. Link the compiled `style.css` in `index.html`

### Conventions
- BEM-ish naming: `.hero`, `.hero__title`, `.hero__cta--primary`
- Mobile-first media queries via `@include respond-to(tablet)` mixin
- Use SCSS nesting max 3 levels deep
- Variables for ALL colors, font-sizes, spacing

---

## 5. Functional / Interactive Details

- **Sticky header** — `position: sticky; top: 0;` with box-shadow on scroll (small JS class toggle)
- **Smooth scroll** — `html { scroll-behavior: smooth; }`
- **Mobile nav toggle** — vanilla JS, toggle `.is-open` class on nav
- **Hover effects** — service cards lift on hover (`transform: translateY(-4px)`, shadow)
- **Button transitions** — 0.3s ease on bg/color
- **Lazy load images** — `loading="lazy"` attribute

---

## 6. Accessibility & SEO Basics

- Semantic HTML5 tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- All images get descriptive `alt` text
- Form labels properly linked to inputs
- Heading hierarchy h1 → h2 → h3 (single h1 in hero)
- Meta tags: title, description, viewport
- Favicon link
- ARIA labels on icon-only buttons (hamburger menu)

---

## 7. Asset Checklist

- [ ] Logo (SVG or PNG)
- [ ] Favicon
- [ ] Hero image (plumber working)
- [ ] 15 service icons (use icon font like Font Awesome OR SVG)
- [ ] 4 spotlight section images
- [ ] Optional: Brisbane background image

---

## 8. Build Order (when starting)

1. Create folder structure + empty files
2. Set up SCSS variables, mixins, reset, base
3. Build `index.html` skeleton with all sections marked up (semantic)
4. Style header + hero
5. Style services grid
6. Style about / why-choose
7. Style spotlight sections
8. Style CTA banner + contact
9. Style footer
10. Add mobile responsive styles (media queries)
11. Add small JS for sticky header + mobile nav
12. Test all breakpoints (mobile, tablet, desktop)
13. Optimize images, minify CSS
14. Final cross-browser check

---

## 9. Deliverables

- `index.html` (single page, semantic markup)
- `style.css` (compiled from SCSS, minified)
- `scss/` source folder
- `assets/images/` with optimized images
- Fully responsive (mobile/tablet/desktop)
- Font stack: **Poppins, Helvetica, Arial, Lucida, sans-serif**

---

> **Status:** Awaiting approval to start implementation.
