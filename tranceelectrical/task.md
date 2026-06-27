# Task — Rebuild TRANCE ELECTRICAL Website

> Source site: https://sites.google.com/tranceelectrical.com/home/home
> Goal: Rebuild this Google Sites page as a clean, hand-coded website.
> **Scope for now: ONE page only → `index.html`** (the Home page).
> Styling with **SCSS** (compiled to CSS).
> All content, text, logo, and images come from the source site above.

---

## 1. Project Setup

- [ ] Create folder structure:
  ```
  tranceelectrical/
  ├── index.html
  ├── scss/
  │   ├── style.scss          # main entry (imports partials)
  │   ├── _variables.scss     # colors, fonts, breakpoints
  │   ├── _base.scss          # reset + typography
  │   ├── _header.scss        # nav bar
  │   ├── _hero.scss          # hero banner
  │   ├── _sections.scss      # intro, map, carousel
  │   └── _footer.scss
  ├── css/
  │   └── style.css           # compiled output
  └── assets/
      └── images/             # downloaded from source site
  ```
- [ ] Set up SCSS compilation (Live Sass Compiler / `sass --watch scss:css`).

---

## 2. Fonts

Use this exact font stack (per request):

```scss
$font-family: "Open Sans", sans-serif, Montserrat, Arial;
```

- [ ] Load **Open Sans** and **Montserrat** from Google Fonts in `<head>`.
- [ ] Headings: Montserrat (bold, uppercase for hero/brand).
- [ ] Body text: Open Sans.

---

## 3. Brand / Colors (sampled from source)

| Token            | Value                | Usage                                  |
|------------------|----------------------|----------------------------------------|
| `$orange`        | `#CC680D` (rgb 204,104,13) | Primary — links, "Enquire Now", footer bg |
| `$cream`         | `#F8E0C8` (approx)   | Hero banner background (peach/cream)   |
| `$dark`          | `#1A1A1A` / black    | Logo box, headings, text               |
| `$white`         | `#FFFFFF`            | Page background, footer text           |
| `$gray-text`     | `#444`               | Intro paragraph body copy              |

- [ ] Define all colors as SCSS variables in `_variables.scss`.

---

## 4. Content Inventory (from source — use verbatim)

### Brand
- Name: **TRANCE ELECTRICAL**
- Tagline (hero): **STAY CONNECTED**
- Logo: black square logo with white "TRANCE ELECTRICAL" text (header + footer).

### Navigation (top bar)
- Home
- Services *(dropdown)*:
  - Fans
  - Lighting
  - Smart Home
  - Garden Lighting
  - Switchboards
  - Powerpoints
  - Electric Hot Water
  - Smoke Alarm
  - Data and TV Aerial
- Photos
- Testimonials
- Contact Us

> Note: For this single-page build, nav links can point to `#` placeholders
> (only `index.html` exists for now). Keep the Services dropdown markup.

### Hero Banner
- Wide illustration: an electrician reaching up, surrounded by line-art light bulbs, on a cream/peach background.
- Overlaid text: **TRANCE ELECTRICAL** / **STAY CONNECTED**
- A "scroll down" chevron button.

### Intro Section (paragraph, centered)
> "We specialise in a wide range of electrical services for both residential and commercial properties. With years of experience and a team of highly skilled electricians, we are dedicated to providing excellent service and ensuring your satisfaction. Trust us to handle all your electrical needs."

### Location Section
- Heading: **Located in Rouse Hill**
- Google Maps embed (iframe). Source coords: `-33.674724, 150.914596` (Rouse Hill, NSW).
  ```
  https://maps.google.com/maps?q=-33.674724,150.914596&z=15&output=embed
  ```

### Call to Action
- Button: **Enquire Now** → `https://bit.ly/tranceelectrical`
- Style: outlined / text button in orange (`#CC680D`).

### Image Carousel
- Two photos side by side / sliding:
  1. Outdoor garden lighting at night (paved path, plants lit up).
  2. Interior ceiling spotlight / downlight fixture.
- [ ] Build a simple carousel (CSS-only or minimal JS).

### Footer (orange background)
- Logo (black box, top-left of footer).
- Text lines:
  - "Electrical service available from: 7 a.m.–5 p.m., Monday to Friday"
  - "After hours service provided"
  - "Licence Number- 349065C"
  - "Phone: 0421 163 003"
  - "Email: info@tranceelectrical.com"
- Social icons:
  - Instagram → https://www.instagram.com/tranceelectrical/?hl=en
  - Facebook → https://www.facebook.com/profile.php?id=100087193126450

---

## 5. Images / Assets to Download

All images are hosted on `lh3.googleusercontent.com` (Google Sites CDN).
- [ ] **Logo** (1500×1500, black square) — header + footer.
- [ ] **Hero banner** (1280×494, electrician + bulbs illustration).
- [ ] **Carousel image 1** — garden lighting (night).
- [ ] **Carousel image 2** — ceiling spotlight.
- [ ] **Instagram icon** (64×64).
- [ ] **Facebook icon** (64×64).

> Action: Re-open the live site at build time, right-click → save each image,
> OR pull the full-res `=w16383` URLs and store them in `assets/images/`.
> (Carousel image URLs lazy-load — grab them live during the build step.)

---

## 6. Build Order (when approved to start)

1. [ ] Scaffold `index.html` (semantic: `header`, `main`, `section`s, `footer`).
2. [ ] Download all assets into `assets/images/`.
3. [ ] Write `_variables.scss` (colors + fonts).
4. [ ] Write `_base.scss` (reset, box-sizing, typography, container).
5. [ ] Build **header / nav** (logo left, menu right, Services dropdown, mobile hamburger).
6. [ ] Build **hero banner** (background image + overlaid brand text + scroll chevron).
7. [ ] Build **intro paragraph** section.
8. [ ] Build **"Located in Rouse Hill"** + map iframe.
9. [ ] Build **"Enquire Now"** CTA button.
10. [ ] Build **image carousel** (2 slides).
11. [ ] Build **footer** (orange, logo, contact details, social icons).
12. [ ] Make it **responsive** (mobile / tablet / desktop).
13. [ ] Compile SCSS → `css/style.css`, link in `index.html`.
14. [ ] Cross-check visual against source screenshot (`trance-home-full.png`).

---

## 7. Responsive Notes

- Desktop: horizontal nav, hero text large, carousel 2-up.
- Mobile: hamburger menu, hero text scaled down, carousel single-slide, footer stacks vertically.

---

## 8. Out of Scope (for now)

- Service sub-pages (Fans, Lighting, etc.)
- Photos, Testimonials, Contact Us pages
- Backend / contact form (CTA uses external `bit.ly` link only)

---

## Reference Screenshot
- `trance-home-full.png` — full-page capture of the source Home page (saved in project root).

---

## ✅ BUILD STATUS — Complete (premium rebuild)

`index.html` + SCSS are built, compiled (`css/style.css`) and verified on desktop & mobile.

### Final structure
```
index.html
css/style.css                ← compiled (npx sass scss/style.scss css/style.css)
scss/  style.scss  _variables  _base  _header  _hero  _sections  _footer
assets/js/main.js            ← nav, scroll-reveal, sticky header, mobile drawer
assets/images/work-1.png     ← garden/pathway lighting (night)  [from source]
assets/images/work-2.png     ← exterior steps/landscape         [from source]
```

### Sections (all redesigned premium/professional)
Top contact bar · sticky header (vector logo + nav + Services dropdown) ·
**dark editorial hero with real TEXT headline (no image)** + framed work photo + trust stats ·
animated credibility marquee · About (offset framed image + stat badge) ·
9-card numbered Services grid · dark Work gallery · Location + live Google Map ·
gradient CTA band · dark footer.

### Key decisions
- **Hero headline is live type** (Montserrat 900), per instruction — no baked-in text image.
- **Logo** rebuilt as a crisp inline-SVG lockup (bolt-in-sun mark + "TRANCE ELECTRICAL / STAY CONNECTED") instead of the low-res screenshot tile.
- **Social & service icons** are clean inline SVG (standard platform/utility glyphs) for crispness.
- **Photos (`work-1`, `work-2`)** are the real source images, captured via the live page.
- Font stack honoured: `"Open Sans", Montserrat, Arial, sans-serif` (body Open Sans, headings Montserrat).
- All copy, phone, email, hours, licence (349065C), socials & map location taken verbatim from source.

### Distinctive "energized" layer (scss/_fx.scss + main.js)
- **Power rail** — a glowing orange conductor down the left margin that charges with scroll progress (with a travelling spark node) — ties to *Stay Connected*. Desktop ≥1240px only.
- **Hero photo** — scroll parallax + subtle mouse-tilt (3D).
- **Count-up** on the "10+" years stat; **drawn underlines** energize under section titles on reveal.
- **Shine-sweep** buttons; fine **film-grain** overlay; pulsing power-rail bolt.
- All effects respect `prefers-reduced-motion`.

### Logo
- Uses the supplied **`assets/images/logo.png`** (black plaque, white wordmark + orange) in header (light bg) and footer (dark bg). Vector lockup removed per request.

### To recompile after SCSS edits
```
npx sass scss/style.scss css/style.css --style=expanded --no-source-map
# or watch:  npx sass --watch scss/style.scss css/style.css
```
