# Task: Rebuild Pacific Roofing Website

Rebuild of the existing Wix site **https://www.pacificroofing.com.au/** as a clean,
modern, hand-coded static site using **HTML + SCSS** (vanilla, no framework).

---

## 1. Project Goal

The current live site is a dated 2014 Wix template (dark charcoal background, orange
accent, generic stock imagery). We are rebuilding it with the **same content and the
same 3-page structure**, but a fresh, modern, responsive design driven by our own
brand styling.

- Keep ALL existing copy/content (do not invent new business claims).
- Keep the 3-page structure: **Home**, **Services**, **Contact**.
- Modernize layout, spacing, typography, and responsiveness.
- Mobile-first, fully responsive.

---

## 2. Brand / Design Tokens

| Token | Value |
|-------|-------|
| Primary color | `#00a0d9` (bright sky blue) |
| Font family | `"Open Sans", sans-serif` |
| Headings | Open Sans (700 / 800 weight, uppercase for brand & section titles) |
| Body | Open Sans (400 / 600) |

### Suggested supporting palette (derive in SCSS variables)
- `$primary: #00a0d9;`
- `$primary-dark: #007 aa;` (darker hover — compute a real value, e.g. `darken($primary, 12%)`)
- `$dark: #1f2933;` (text / dark sections)
- `$gray: #5c6770;` (body text)
- `$light: #f5f8fa;` (section background)
- `$white: #ffffff;`

> Original site used dark charcoal + orange. We replace the accent with our primary
> `#00a0d9`. Use white / light sections for a cleaner modern look, with the blue as the
> accent for buttons, links, the phone CTA, and section underlines.

---

## 3. Tech Stack & Structure

- Plain HTML5 (3 pages) — `index.html` (Home), `services.html`, `contact.html`.
- SCSS compiled to CSS.
- Google Fonts: Open Sans.
- **GSAP** (https://gsap.com/) for smooth animations (+ ScrollTrigger for scroll reveals).
- No JS framework. Vanilla JS for: mobile nav toggle, contact form handling, and GSAP setup.

### Proposed file structure
```
pacificroofing/
├── index.html            # Home
├── services.html         # Services
├── contact.html          # Contact
├── scss/
│   ├── main.scss         # entry — imports all partials
│   ├── _variables.scss   # colors, fonts, breakpoints, spacing
│   ├── _mixins.scss      # media queries, helpers
│   ├── _base.scss        # reset, typography, body defaults
│   ├── _layout.scss      # container, grid, section spacing
│   ├── _header.scss      # top banner / logo / phone CTA
│   ├── _nav.scss         # primary navigation + mobile toggle
│   ├── _buttons.scss     # button styles
│   ├── _footer.scss      # footer
│   └── components/
│       ├── _hero.scss
│       ├── _services-list.scss
│       └── _contact.scss
├── css/
│   └── main.css          # compiled output
├── js/
│   ├── main.js           # mobile nav + form
│   └── animations.js     # GSAP timelines + ScrollTrigger reveals
└── assets/
    └── images/           # roofing photos (replace stock)
```

---

## 4. Site-Wide Components (appear on every page)

### Header / Banner
- Brand logo lockup: **"PACIFIC"** over **"ROOFING"** (stacked, uppercase, bold).
  - Use `$primary` for "PACIFIC" or "ROOFING" accent; keep strong contrast.
- License badge: **`Lic. 37159C`**.
- CTA on the right: **"FOR A FREE QUOTE"** with phone **`0421 759 907`** (click-to-call
  `tel:0421759907`), styled prominently in `$primary`.

### Primary Navigation
- Links: **HOME** → `index.html`, **SERVICES** → `services.html`, **CONTACT** → `contact.html`.
- Sticky on scroll (optional, nice modern touch).
- Mobile: hamburger toggle.
- Active-page highlight.

### Footer
- Copyright line: **"© Pacific Roofing"** (original says "© 2014 by PACIFIC ROOFING. Proudly
  created with Wix.com" — DROP the Wix credit, update year/keep generic).
- Repeat nav links (HOME / SERVICES / CONTACT).
- Brand lockup PACIFIC / ROOFING.
- CTA: **"FOR AN OBLIGATION FREE QUOTE 0421 759 907"** (click-to-call).

---

## 5. Page Content

### 5.1 HOME (`index.html`)

**Hero section**
- Brand lockup + license `Lic. 37159C`.
- Roofing hero image (house / roof).

**About Us**
> With over 25 years experience in the roofing industry, we offer the finest workmanship
> to our clients. We are fully insured and we guarantee all our work for 3 years.

**Home (residential repairs)**
> At Pacific Roofing, one of the many areas we excel in is the repair of homes in the
> domestic and commercial sector. Replacing terracotta and concrete tiles on roofs is the
> job for us. Where possible, we will repair broken roof tiles to your home. We specialise
> in the repair of leaking roofs, cracked tiles and slipped slate.

**Our Services** (bulleted list — consider rendering as a styled icon grid):
- Free quote
- Replace broken tiles
- Replace valleys
- Gutter replacement
- Gutter cleaning
- Rebed and point ridge capping
- Replace lead flashing
- Installation of whirlybirds and skylights
- 24/7 call out
- Installation of gutter guard
- Insurance work

**CTA band**: "For a free quote, call 0421 759 907" → button to Contact page.

---

### 5.2 SERVICES (`services.html`)

**Intro**
> Pacific Roofing specialises in all aspects of the roofing industry. Our experienced and
> professional tradesmen provide a comprehensive range of roofing, guttering and downpipe
> repairs and replacement as well as the installation of whirlybirds and skylights.

**Service blocks** (each = heading + paragraph; lay out as cards or alternating rows):

1. **ROOF REPAIRS** — Pacific Roofing can replace all cracked and broken tiles. We also
   inspect all ridge cappings and report if any are loose, broken or in need of rebed and
   pointing.

2. **VALLEY REPLACEMENT** — Poorly maintained or rusted valleys are a common cause of roof
   leaks. Leaves can often bunch together to form a plug in the middle of a valley that will
   cause water to back up and overflow the edges of the valley into the roof space. Pacific
   Roofing can replace all your rusted valleys and supply and install new galvanised or
   colourbond valleys.

3. **GUTTER REPAIRS** — Replacing rusting or leaking gutters is also a specialty for our
   experienced roofing tradesmen. We can replace your rusted or leaking gutter with new
   colourbond gutters and downpipes available in a wide range of colours to suit all house
   styles. Downpipe replacements are also available in both colourbond and PVC whichever is
   your preference.

4. **INSURANCE AND STRATA MAINTENANCE** — Pacific Roofing services Strata and Real Estate
   managed properties. We clearly understand that roofing problems threaten the owners and/or
   occupants lifestyles, so our skilled tradesmen are coached to look after them personally
   as well as technically.

5. **REBED AND RE-POINTING OF RIDGE CAPPINGS** — As the roof ages, the cement underneath the
   ridge caps can deteriorate to the extent that the ridge caps need to be removed completely
   and bedded down on a new layer of cement. Once the ridge caps have been re-bedded, the
   ridge caps are re-pointed in flexible pointing. Re-pointing can add years to the life of
   your existing roof and the flexible pointing will flex with the natural movements of the
   house.

6. **GUTTER CLEANING** — Blocked gutters and downpipes can lead to flooded eaves and flooded
   ceiling spaces. Avoid damage to your home by taking preventative action; make sure your
   gutters and downpipes are clear of leaves. Pacific Roofing can clean all types of gutters
   from domestic to commercial — no job is too small. We also unblock any downpipes, if
   required. We can arrange a 3-, 6- or 12-month regular gutter clean so you never have to
   worry about gutter overflow and blockages. Leaf build-up can easily start a fire in
   gutters, especially towards the hot summer months in bush-fire-prone areas.

---

### 5.3 CONTACT (`contact.html`)

**Contact details**
- Name: **Mark Leotta**
- Address: **34 Rivergum Way, ROUSE HILL NSW 2155**
- Mobile: **0421 759 907** (`tel:`)
- Home: **02 9836 3206** (`tel:`)
- Email: **pacificroofing1@hotmail.com** (`mailto:`)

**Map**
- Embed a Google Map for *34 Rivergum Way, Rouse Hill NSW 2155*
  (original used a placeholder "Wix Lounge NYC" pin — use the REAL address).

**Contact form**
- Fields: Name *, Email *, Subject, Message, **Send** button.
- Wire to a mail handler (mailto fallback, or a form service like Formspree). Note: static
  hosting has no backend — decide handling approach before building.

---

## 5.4 Animations (GSAP)

Use **GSAP** (https://gsap.com/) for smooth, tasteful motion — not heavy/distracting.
Load via CDN (`gsap.min.js` + `ScrollTrigger.min.js`) before `js/animations.js`.

- **Header / hero load**: stagger-fade the brand lockup (PACIFIC / ROOFING), license badge,
  and phone CTA in on page load (`gsap.from` timeline).
- **Scroll reveals (ScrollTrigger)**: fade/slide-up sections as they enter the viewport —
  About, Home, Services grid items (staggered), Services blocks, Contact card.
- **Services list/cards**: staggered reveal of list items / cards.
- **Nav**: subtle sticky-header show/hide or shrink on scroll (optional).
- **Buttons / CTA**: subtle hover scale (can be CSS, GSAP optional).
- **Respect `prefers-reduced-motion`**: disable/scale back animations when set.
- Keep durations short (0.4–0.8s) and easing smooth (`power2.out`).

---

## 6. Build Steps (checklist)

- [ ] 1. Scaffold folders + files per structure above.
- [ ] 2. Set up SCSS: `_variables.scss` with `$primary: #00a0d9`, Open Sans, breakpoints.
- [ ] 3. Add Open Sans via Google Fonts in each HTML `<head>`.
- [ ] 4. Build base/reset + typography.
- [ ] 5. Build shared Header + Nav (with mobile toggle).
- [ ] 6. Build shared Footer.
- [ ] 7. Build Home page sections (hero, about, home, services grid, CTA).
- [ ] 8. Build Services page (intro + 6 service blocks).
- [ ] 9. Build Contact page (details + map embed + form).
- [ ] 10. Add GSAP (CDN) + `animations.js`: hero load timeline + ScrollTrigger reveals.
- [ ] 11. Source/replace imagery (real roofing photos, optimized).
- [ ] 12. Responsive QA at 320 / 768 / 1024 / 1440.
- [ ] 13. Accessibility pass (alt text, labels, contrast against `#00a0d9`, focus states,
        `prefers-reduced-motion`).
- [ ] 14. Compile SCSS → `css/main.css`; verify in browser.
- [ ] 15. Cross-browser check.

---

## 7. Notes / Decisions

- **Drop** the Wix.com credit in the footer.
- **Replace** the fake "Wix Lounge NYC" map pin with the real Rouse Hill address.
- Phone numbers must be click-to-call on mobile.
- Keep copy faithful to the original (only fix obvious typos like "dometic" → "domestic",
  "trademen"/"tradesmen").
- Primary CTA everywhere: **free quote → 0421 759 907**.
- Reference screenshots saved in repo root: `home.png`, `contact.png`.
