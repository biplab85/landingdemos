# APEX — Website Redesign Brief & Task Plan

> **Goal:** Redesign [apexeds.com.au](https://apexeds.com.au/) into a **more premium, professional, modern** website with an **Australian-based UI**. All logo, imagery, and content are sourced from the existing live site. Hero uses a **modern parallax** treatment.

---

## 1. Brand Snapshot (extracted from live site)

| Item | Detail |
|------|--------|
| **Company** | APEX Electrical, Data & Security |
| **Tagline** | "Expert Electrical Solutions for Every Need" |
| **Sub-brand line** | ELECTRICAL · DATA · SECURITY |
| **ABN** | 13 420 557 094 |
| **Phone** | 0425 062 333 |
| **Email** | michael@apexeds.com.au |
| **Service area** | Sydney Metropolitan and Beyond (Australia) |
| **Hours** | 6:00 AM – 5:00 PM |
| **Social** | Facebook, Instagram |
| **Logo asset** | `assets/images/logo.png` (downloaded — 2560×1811 PNG, transparent) |

### Logo / Visual DNA
- Bold black **APEX** wordmark sliced by an **electric-yellow lightning bolt**.
- Aggressive italic/forward slant → conveys speed, energy, power.
- Monospaced-style tracked-out tagline beneath.

---

## 2. Design Direction — "Premium Industrial"

A confident, high-end contractor brand. Think: **electric precision** meets **architectural professionalism**. Not a generic tradie template — a brand that wins government, school, and commercial tenders.

- **Mood:** Dark, premium, charged. Deep charcoal canvas with electric-yellow energy as the single sharp accent.
- **Australian UI cues:** AUD context, Sydney/NSW geographic framing, AU spelling (e.g. "specialise", "licence"), 24/7 emergency emphasis, local trust signals (ABN, licensed, insured).
- **Feel:** Editorial spacing, large confident type, restrained use of the yellow so it *hits* when it appears.

---

## 3. Typography (as specified)

```css
--font-display: "Lusitana", Georgia, serif;   /* headings, hero, section titles */
--font-body:    "Lato", Arial, sans-serif;     /* body copy, UI, buttons, labels */
```

- Load via Google Fonts: `Lusitana` (400, 700) + `Lato` (300, 400, 700, 900).
- Display serif (Lusitana) for elegance/premium gravitas; Lato for clean, legible body & UI.
- Pairing logic: serif headlines add the "premium/professional" weight the brief asks for; sans body keeps it modern and readable.

---

## 4. Colour System

```css
--ink:        #0E0F0F;   /* near-black canvas / text */
--ink-soft:   #1A1C1C;   /* raised panels */
--bolt:       #E6E72B;   /* electric yellow accent (from logo) */
--bolt-dim:   #C9CA1E;   /* pressed / hover */
--paper:      #F7F7F4;   /* light sections */
--smoke:      #9A9C99;   /* muted text */
--line:       rgba(255,255,255,0.08); /* hairline dividers on dark */
```
- Dominant: charcoal/black. Accent: electric yellow (used sparingly for impact). Light sections in warm off-white for rhythm.

---

## 5. Page Sections (order & content)

1. **Sticky Header / Nav**
   - Logo (left), nav links, phone CTA `0425 062 333`, "Get a Free Quote" button.
   - Nav: Home · Services · Our Work · Guarantee · Projects · Contact.

2. **Hero — PARALLAX (modern)**
   - Headline: *"Expert Electrical Solutions for Every Need"*
   - Sub: "Reliable residential & commercial electricians servicing Sydney Metropolitan and beyond."
   - Dual CTA: "Get a Free Quote" + "Call 0425 062 333".
   - Parallax: layered background (charcoal + lightning/energy motif), foreground content moves at different scroll speed; subtle grain + glow.
   - Trust strip: ABN · Licensed · Insured · 24/7 Emergency.

3. **About / Intro**
   - "We don't just get the job done — we get it done safely, on time, and to the highest standard."
   - Serving homes & businesses up to large-scale government and school projects. Emphasis on safety, compliance, excellence.

4. **Services (6)**
   - Residential (wiring, lighting, repairs)
   - Commercial & Industrial (installation, repair, maintenance)
   - Government & School Projects
   - 24/7 Emergency Electrical
   - Switchboard Upgrades & Installations
   - Electrical Safety Inspections
   - + Data & Security (per sub-brand: data cabling / security systems).

5. **Our Work / Portfolio**
   - "Our stunning electrical work in action." Gallery grid (placeholder slots until real images supplied), "Show More".

6. **7 Points of Guarantee** (signature trust section)
   1. 2-Year Guarantee on Workmanship (730 days)
   2. Quality Materials sourced appropriately per project
   3. Clean & Tidy work site on completion
   4. Costing Changes communicated transparently — no surprises
   5. Quality Staff — fully background-checked
   6. Accessible & Helpful throughout
   7. Communication maintained at every project stage

7. **Recent Projects** (timeline / list)
   - Oct 2025 — Saint Therese, Refurbishments
   - Sep 2025–Jul 2026 — Parker House, Mittagong
   - Sep 2025 — Christ the King, Internal Refurbishments
   - Sep 2025 — Caroline Chisolm, Amenities Upgrade
   - Aug 2025 — New House Build, Pennant Hills
   - Aug 2025 — Cerdon College, Merrylands, Classroom Refurbishments
   - Jul 2025 — Miller Technology, Lifts upgrade & submains redirection
   - Mar 2025 — Riverstone Industrial Dairy Factory
   - Feb 2025 — Emmaus Catholic College & St Columbus Catholic College
   - Jan 2025 — Berowra Complete Home Renovation
   - Dec 2024 — Mater Dei School & Annangrove renovations
   - Nov 2024 — Glendenning Office Refurbishment
   - Oct 2024 — Corpus Christian Primary School
   - Mar 2024 — St Patrick's Canteen & Cafe

8. **Contact / Free Quote**
   - Form: Name, Email, Phone, Address, Work description, Timeline.
   - Direct: phone, email, hours, service area, social links.

9. **Footer**
   - Logo, nav, contact, ABN, hours (6 AM – 5 PM), "Sydney Metropolitan and Beyond", social, copyright + cookie note.

---

## 6. Motion & Interaction Plan — powered by **GSAP**
Animation library: **[GSAP](https://gsap.com/)** + **ScrollTrigger** plugin (loaded via CDN).

- **Hero parallax** — GSAP ScrollTrigger with `scrub`, layered depth at multiple speeds (background / mid / foreground move at different rates).
- **On-load timeline** — staggered reveal of hero headline → sub → CTA (`gsap.timeline()` with stagger).
- **Scroll-triggered reveals** — fade/slide-up for each section via ScrollTrigger (`batch` for grids like services & gallery).
- **Lightning-bolt accent** — subtle pulse/draw animation tied to the brand mark.
- **Hover micro-interactions** — service cards, buttons, gallery tiles (GSAP or CSS).
- **Number count-up** — animate any stats/guarantee counters on scroll into view.
- Respect `prefers-reduced-motion` — guard GSAP animations; fall back to static layout.

### GSAP setup (CDN)
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```
- Register plugin in `main.js`: `gsap.registerPlugin(ScrollTrigger);`

---

## 7. Tech & Structure (confirmed)
- **Single page:** one `index.html` (all sections live on this one page; nav links scroll to anchors).
- **Styling:** **SCSS** → compiled to `assets/css/styles.css`. Source lives in `assets/scss/`.
- **JS:** vanilla JS + **GSAP** (with ScrollTrigger, via CDN) for parallax, hero timeline, and scroll reveals.
- Responsive, mobile-first; accessible (semantic HTML, alt text, focus states, contrast).

```
apexeds/
├── index.html                  (single page — all sections + anchor nav)
├── assets/
│   ├── scss/
│   │   ├── main.scss           (entry — imports partials)
│   │   ├── _variables.scss     (colours, fonts, breakpoints)
│   │   ├── _base.scss          (reset, typography, helpers)
│   │   ├── _header.scss
│   │   ├── _hero.scss          (parallax)
│   │   ├── _sections.scss      (about, services, work, guarantee, projects)
│   │   ├── _contact.scss
│   │   └── _footer.scss
│   ├── css/
│   │   └── styles.css          (compiled output + styles.css.map)
│   ├── js/main.js              (GSAP: parallax, ScrollTrigger reveals, hero timeline)
│   └── images/
│       └── logo.png            (✓ downloaded)
├── task.md                     (this file)
└── README.md
```

### SCSS compile
- Compile with Dart Sass: `sass assets/scss/main.scss assets/css/styles.css`
- Watch during dev: `sass --watch assets/scss/main.scss assets/css/styles.css`
- `index.html` links only the compiled `assets/css/styles.css`.

---

## 8. Outstanding / To Confirm
- [x] **Stack:** single `index.html` + **SCSS** (confirmed).
- [x] **Scope:** single landing page (confirmed).
- [ ] **Real portfolio images** — live site uses placeholders; need actual photos or use tasteful placeholders for now.
- [ ] Keep AU spelling throughout (specialise / licence / colour).

---

## 9. Build Checklist
- [x] Scaffold `index.html` + assets folders
- [x] Wire Google Fonts (Lusitana + Lato) + SCSS variables/colour system
- [x] Build sticky header + mobile nav
- [x] Build modern **parallax hero** + trust strip
- [x] About + Services (incl. Data & Security)
- [x] Portfolio gallery
- [x] 7 Points of Guarantee section
- [x] Recent Projects timeline
- [x] Contact / Free Quote form
- [x] Footer
- [x] Wire GSAP + ScrollTrigger (CDN) and register plugin
- [x] Motion: GSAP parallax hero, hero load timeline, ScrollTrigger reveals, hovers, reduced-motion
- [x] Responsive QA (mobile / tablet / desktop) + accessibility pass
- [x] SCSS compiled to `assets/css/styles.css` (clean, no warnings)
- [x] Verified in browser — desktop + mobile, 0 console errors

---

## 10. How to run / develop
- **View:** `http://localhost/sklentr/apexeds/index.html` (WAMP).
- **Edit styles:** change files in `assets/scss/`, then recompile:
  - `npx sass assets/scss/main.scss assets/css/styles.css --style=expanded`
  - Watch mode: `npx sass --watch assets/scss/main.scss assets/css/styles.css`
- **Pending content:** real portfolio photos (tiles are ready to drop images into `.work__media`).
