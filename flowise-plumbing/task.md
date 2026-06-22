<!-- ─────────────────────────────────────────────────────────────
     Designed & developed by
     Biplab Kumar Paul — Web Designer & Developer
     Mobile: 01735 927356
     Email:  biplab.cse.85@gmail.com
     ───────────────────────────────────────────────────────────── -->

# Task — Flowise Plumbing Website

A single-page marketing website (`index.html`) for **Flowise Plumbing**, a 5-star plumbing
business based in Box Hill, NSW, Australia.

---

## 1. Business Details (source: Google Maps listing)

| Field           | Value                                           |
| --------------- | ----------------------------------------------- |
| Business name   | Flowise Plumbing                                |
| Category        | Plumber                                         |
| Rating          | ⭐ 5.0                                          |
| Address         | 4 Terry Rd, Box Hill NSW 2765, Australia        |
| Phone           | +61 490 528 490 (`tel:+61490528490`)            |
| Hours           | Open 24 hours / 7 days                          |
| Plus Code       | 8VRW+86 Box Hill, NSW, Australia                |
| Service area    | Box Hill & Sydney's Hills District / North-West |
| Website         | None yet — this project will be the first       |
| Google Place ID | /g/11njp1wq8j                                   |
| Coordinates     | -33.6591659, 150.8955319                        |

---

## 2. Project Constraints / Requirements

- **Single page only** — build `index.html`. No multi-page routing.
- **Styling with SCSS** — multiple `.scss` partials compiled into one CSS file.
- **Every `.scss` file** must begin with the developer credit comment block (see below).
- **Image reuse** — the same image asset(s) will be reused across multiple sections;
  reference shared assets rather than duplicating files.
- Do **not** start coding yet — this file defines the plan only.

---

## 3. Proposed File Structure

```
flowise-plumbing/
├── index.html
├── css/
│   └── style.css            # compiled output (do not hand-edit)
├── scss/
│   ├── style.scss           # main file — @use/@import all partials
│   ├── _variables.scss      # colors, fonts, breakpoints, spacing
│   ├── _mixins.scss         # reusable mixins (flex, media queries, buttons)
│   ├── _base.scss           # reset + base typography
│   ├── _header.scss         # nav / hero top bar
│   ├── _hero.scss           # hero section
│   ├── _services.scss       # services grid
│   ├── _about.scss          # about / why choose us
│   ├── _gallery.scss        # work gallery (reused images)
│   ├── _testimonials.scss   # 5-star reviews section
│   ├── _contact.scss        # contact + map + call CTA
│   └── _footer.scss         # footer + developer credit
├── images/
│   └── (shared image assets — reused across sections)
└── task.md
```

> Each SCSS partial carries the developer credit block at the top.

---

## 4. Page Sections (index.html)

1. **Header / Navbar** — logo "Flowise Plumbing", nav links (anchor scroll),
   click-to-call button `+61 490 528 490`.
2. **Hero** — headline (e.g. "24/7 Trusted Plumbers in Box Hill, Sydney"),
   subtext, "Call Now" + "Get a Quote" CTAs, background image.
3. **Services** — grid of plumbing services (emergency repairs, blocked drains,
   hot water systems, leak detection, gas fitting, bathroom/kitchen plumbing).
4. **About / Why Choose Us** — 5.0 rating, 24-hour availability, licensed & local,
   honest pricing. Reuse shared image.
5. **Gallery** — showcase of work (reuse the same image asset in multiple tiles).
6. **Testimonials** — 5-star reviews / trust badges.
7. **Contact** — address (4 Terry Rd, Box Hill NSW 2765), phone, hours,
   embedded Google Map, simple contact form (front-end only).
8. **Footer** — quick links, business info, social, and developer credit
   (Biplab Kumar Paul).

---

## 5. Design Notes

- **Theme:** clean, trustworthy, water/plumbing feel — blues + a warm accent.
- **Responsive:** mobile-first; hamburger nav on small screens.
- **Conversion focus:** phone number and "Call Now" highly visible (sticky CTA
  on mobile is a good option).
- **Image reuse:** define a single hero/feature image; reference it via shared
  CSS classes / multiple `<img>` references to the same file in `images/`.
- **Map:** embed using the listing coordinates / Plus Code.

---

## 6. Build Steps (when approved)

1. Scaffold folder structure (`scss/`, `css/`, `images/`).
2. Add developer credit block to each SCSS partial.
3. Define `_variables` and `_mixins` first.
4. Build `index.html` markup section by section.
5. Style each section via its SCSS partial.
6. Compile SCSS → `css/style.css`.
7. Add responsive breakpoints + sticky call CTA.
8. Test on desktop + mobile widths.

---

## 7. Open Questions (confirm before build)

- [ ] Do you have a **logo** and **real images**, or should placeholders be used?
- [ ] Preferred **color scheme** (default: blue + accent)?
- [ ] Should the SCSS use modern **`@use`** or classic **`@import`**?
- [ ] How will SCSS be compiled (Dart Sass CLI, VS Code Live Sass, build tool)?
- [ ] Any **email address** for the contact form / business contact?
