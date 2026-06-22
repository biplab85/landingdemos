# Effective Pest Control — Build Log

> Source reference: <https://effective-pestcontrol.com.au/>
> Deliverable: single `index.html` with modular SCSS and a Made-with-♥ credit to **CapsuleDIGITAL** (<https://www.capsuledigital.com.au/>).
> Font family (global): `Poppins, sans-serif` — weights 300, 400, 500, 600, 700, 800, 900 (+ italics).

---

## ✅ Build status — all milestones complete

### 1 · Foundation
- [x] Project scaffolded under WAMP at `E:\wampserver\www\sklentr\effective-pestcontrol`
- [x] Folder structure: `assets/`, `scss/`, `images/`, `images/team/`
- [x] Real `favicon.png` + `apple-touch-icon.png` downloaded from the live site
- [x] Brand red + arc-orange palette derived from the EPC logo (`#8E1F1F`, `#C53030`, `#E68A1E`)
- [x] Poppins loaded from Google Fonts (full weight range)
- [x] `.gitignore` to exclude verification screenshots and Playwright cache

### 2 · Markup (`index.html`)
- [x] Top bar (phone, email, area, rating, social) — hidden on mobile
- [x] Sticky header with logo (logo.png), 8-link nav, Call-Now CTA
- [x] Mobile hamburger + slide-in drawer (auto-closes on link tap)
- [x] Hero — editorial split, `35` backdrop number, 3 trust stamps, photo + 5★ badge, 4 corner `+` marks
- [x] Pest marquee strip (scrolling pest list)
- [x] About — overlapped two-photo collage, rotated "est. 1989" badge, 3 numbered brand principles
- [x] **Team — 3D parallax ring carousel** with 8 EPC team portraits
- [x] Services — 6 cards total (4 services + Commercial & Strata + Free-Quote promo)
- [x] Why us — 6 hairline feature tiles
- [x] CTA banner — big phone-call button
- [x] Preparation — 5-step prep checklist (sticky aside)
- [x] Testimonials — 6 quotes (now an infinite marquee)
- [x] FAQ — 13-item accordion (sticky aside)
- [x] Contact — info column + form with pest-type chip selectors
- [x] Footer — brand, sitemap, services, contact + "Made by ♥ CapsuleDIGITAL" credit

### 3 · Styling
- [x] `assets/css/style.css` — full compiled stylesheet (single source of truth for the browser)
- [x] `scss/style.scss` — entry that forwards every partial via `@use`
- [x] **Abstracts:** `_variables.scss`, `_mixins.scss`, `_functions.scss`
- [x] **Base:** `_reset.scss`, `_typography.scss`, `_global.scss`
- [x] **Layout:** `_container.scss`, `_grid.scss`, `_header.scss`, `_footer.scss`
- [x] **Components:** `_buttons.scss`, `_navbar.scss`, `_section-heading.scss`, `_social-icons.scss`, `_hero.scss`, `_service-card.scss`, `_feature-card.scss`, `_testimonial-card.scss`, `_faq-accordion.scss`, `_form.scss`
- [x] **Sections:** `_about.scss`, `_team.scss`, `_services.scss`, `_why-choose.scss`, `_cta-banner.scss`, `_preparation.scss`, `_testimonials.scss`, `_faq.scss`, `_contact.scss`
- [x] **Utilities:** `_helpers.scss`, `_animations.scss`
- [x] Every `.scss` file carries the standard designer-credit header block

### 4 · JavaScript (`assets/js/main.js`)
- [x] Sticky-header class toggle on scroll
- [x] Mobile nav drawer toggle + auto-close on anchor tap
- [x] Active-link tracking via `IntersectionObserver`
- [x] FAQ accordion (single-open)
- [x] Testimonials marquee — cards duplicated in JS so `translateX(-50%)` loops seamlessly
- [x] Team 3D parallax ring — drag, touch, prev/next, keyboard, parallax bg-position shift, autoplay (pauses on hover / off-screen / hidden tab)
- [x] Back-to-top button
- [x] Scroll-reveal stagger
- [x] Contact form HTML5 validation + demo success state
- [x] Smooth-scroll for in-page anchors

---

## 🎨 Visual / behavioural decisions made during build

- **Editorial-confidence aesthetic** — generous whitespace, dramatic type stress, asymmetric layouts, recurring "+" mark motif.
- **Logo palette swap** — replaced the original moss-green theme with brand red (`#8E1F1F → #C53030`) + arc orange (`#E68A1E`) once the EPC logo became the source of truth.
- **Photography swap** — Unsplash placeholders replaced with the real EPC field photography from `images/`.
- **Services section** — solid dark background replaced with layered radial-gradient + diagonal stripe overlay + 6 SVG pest silhouettes drifting on staggered timelines.
- **Testimonials section** — converted snap-scroll to a continuous marquee (cards duplicated, edge-fade mask, pause-on-hover); background became an animated gradient mesh (4 radial blobs drifting on staggered timelines).
- **Team section** — initial flat card slider was upgraded to a 3D parallax ring per the gosnippets pattern, then made auto-playing.

---

## 🐞 Fixes that came up after the first build

- **Mobile nav drawer was invisible** — base `display:none` on `.mobile-nav` left the drawer hidden even after JS removed the `hidden` attribute. Scoped a `.mobile-nav:not([hidden]) { display: block }` inside `@media (max-width: 960px)`.
- **Mobile call button text invisible** — moss text colour inherited from `.mobile-nav a` onto `.btn--call`, painting cream-on-red as moss-on-red. Narrowed the rule to `.mobile-nav ul a` and gave the CTA its own `.mobile-nav__cta` class.
- **Top bar removed on mobile** — added `display: none` inside the `@media (max-width: 960px)` block.
- **Services note** — broke awkwardly on mobile. Rewritten as a `display: block` inset card with a clay left-border accent inside `@media (max-width: 640px)`.
- **About principles text "broken"** — H4s were rendering ~100px wide on 3 lines because each `<li>` had 3 grid children (span + h4 + p) flowing into a 2-column `auto 1fr` grid; the description text inflated col-1 and squeezed the heading. Fixed by wrapping `<h4>` + `<p>` in `<div class="about__principle-body">` so each `<li>` has exactly 2 grid children. H4 widths went from 100px / 3 lines → 560px / 1 line.
- **Team ring overlapping heading on mobile** — perspective scaling pushed the front-facing slide ~1.4× bigger than its declared box, so it visually overflowed the stage and overlapped the section heading. Added `overflow: hidden` to `.team-px__stage` and tuned mobile `--ring-r`, `height` and `margin-top`. Desktop unchanged.
- **About section requested layout tweak** — `align-items: center` → `align-items: self-start`; `.about__media.is-in` now `position: sticky; top: 110px` so the photo column stays visible while the principles scroll past.

---

## 📐 Responsive notes

- Audited at `390 × 844` (iPhone 12 Pro viewport).
- Every breakpoint fix lives inside an `@media` query — desktop CSS was never touched during mobile work, per the brief.
- Mobile-only changes: top bar hidden, hamburger drawer styling, services-note inset card, team ring dimensions, mobile services grid collapses from `3 → 2 → 1` columns.

---

## 🧰 Credits

- **Build:** [CapsuleDIGITAL](https://www.capsuledigital.com.au/) — *Made with ♥*
- **Brand & photography:** Effective Pest Control (Sydney)
- **Reference site:** <https://effective-pestcontrol.com.au/>

*End of build log.*
