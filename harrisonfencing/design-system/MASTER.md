# Harrison Fencing — Design System (MASTER)

Source of truth for the redesign. Built with the **ui-ux-pro-max** ruleset
(priorities 1→10: Accessibility → Touch → Performance → Style → Layout →
Type/Color → Animation → Forms → Nav → Charts). When building a page, read this
first; page-specific overrides live in `design-system/pages/<page>.md` and win
over this file.

> Note: the skill's curated palette/font database wasn't installed on this
> machine, so the values below are authored to the skill's rules rather than
> pulled from its CSVs. They mirror the tokens in `CLAUDE.md` — keep the two in
> sync (CLAUDE.md is the SCSS-implementation contract; this is the design intent).

## 1. Product & style
- **Product type:** local service business / lead-gen landing site (trade,
  construction). Goal = phone call / free-quote request.
- **Style:** clean, rugged, photo-led. Flat with restrained depth — solid fills,
  one consistent soft shadow tier, ~6–10px radius. No glassmorphism, no
  gradients-as-decoration, no skeuomorphism. (`style-match`, `consistency`)
- **Icons:** SVG line icons, single set (Lucide), 1.75–2px stroke. **Never
  emoji.** (`no-emoji-icons`, `icon-style-consistent`)
- **One primary CTA per view** = "Get a free quote" / click-to-call; everything
  else subordinate. (`primary-action`)

## 2. Color (semantic tokens → map in `_tokens.scss`)
| Semantic            | Value     | Notes / contrast                                  |
|---------------------|-----------|---------------------------------------------------|
| `primary`           | `#2B5E3F` | eucalypt green; white text = ~7:1 ✓ AA            |
| `primary-hover`     | `#224B32` | hover/active                                       |
| `accent`            | `#C5732B` | timber amber — accents/icons only                 |
| `accent-text`       | `#A85D1E` | amber when it must be text on white (AA small)     |
| `ink`               | `#23282D` | headings / dark surfaces (Colorbond charcoal)     |
| `on-surface`        | `#2A2E33` | body text on light (~12:1 on `surface`) ✓         |
| `on-surface-muted`  | `#5B6168` | secondary text (~5.6:1) ✓                          |
| `on-dark`           | `#F4F5F3` | text on `ink`/`primary` (≥9:1) ✓                  |
| `surface`           | `#FFFFFF` | cards/panels                                       |
| `bg`                | `#F7F6F3` | warm paper page background                         |
| `line`              | `#E5E7EB` | borders/dividers (visible, not invisible-gray)    |
| `success`           | `#2E7D46` | form success — pair with icon, not color-only      |
| `danger`            | `#B3261E` | form error — pair with icon/text                   |

Rules enforced: `color-semantic` (no raw hex in components — go through
`color()`), `color-accessible-pairs` (every pair above ≥4.5:1 for its use),
`color-not-only` (status always has icon/text, never color alone),
`visual-hierarchy` (hierarchy via size/space/contrast, not hue).
No dark mode for v1 (marketing site) — if added later, design it as a paired
theme, don't invert (`dark-mode-pairing`).

## 3. Typography
- **Headings:** Oswald 600/700. Uppercase + ~0.04em tracking for small eyebrows
  only; sentence case for real headings.
- **Body/UI:** Inter 400/500/600.
- `font-display: swap`; preload only the two critical weights. (`font-loading`,
  `font-preload`)
- **Type scale (rem):** 0.75 · 0.875 · 1 · 1.125 · 1.25 · 1.5 · 2 · 2.5 · 3.25.
  Body **≥16px** on mobile (`readable-font-size`). Line-height 1.6 body / 1.15
  display (`line-height`). Measure 60–75ch desktop, 35–60ch mobile
  (`line-length-control`). Weight = hierarchy, not just size (`weight-hierarchy`).

## 4. Spacing, layout, responsive
- **Spacing scale** (4/8 rhythm), `$space` map: 4 · 8 · 12 · 16 · 24 · 32 · 48 ·
  64 · 96px → `xs…3xl`. (`spacing-scale`)
- **Section vertical rhythm:** 48 (mobile) / 96 (desktop) between major sections.
- **Container:** max-width ~1200px, centered; gutters 16px mobile → 24/32px up.
  (`container-width`, adaptive gutters)
- **Breakpoints** (mobile-first, in `bp()` mixin): sm 480 · md 768 · lg 1024 ·
  xl 1280. (`mobile-first`, `breakpoint-consistency`)
- No horizontal scroll; `min-height: 100dvh` not `100vh`; never disable zoom
  (`viewport-meta`: `width=device-width, initial-scale=1`).
- **z-index scale:** 0 base · 10 sticky bar · 40 dropdown · 100 mobile-nav drawer
  · 1000 modal/toast. (`z-index-management`)

## 5. Touch & interaction (CRITICAL)
- Tap targets ≥44×44px, ≥8px apart — phone numbers, nav, buttons.
  (`touch-target-size`, `touch-spacing`)
- `cursor: pointer` + `touch-action: manipulation` on all controls
  (`cursor-pointer`, `tap-delay`).
- Visible feedback on every press (≤150ms); no hover-only behaviour — mobile is
  primary (`hover-vs-tap`, `press-feedback`).
- Sticky mobile bottom call-bar is allowed; reserve body padding so it never
  covers content (`fixed-element-offset`), keep clear of the safe area.

## 6. Motion
- 150–300ms micro / ≤400ms larger; ease-out enter, ease-in exit; exit ~70% of
  enter. Animate **transform/opacity only**. (`duration-timing`,
  `transform-performance`, `easing`, `exit-faster-than-enter`)
- 1–2 animated elements per view; subtle reveal-on-scroll fine.
- **Must** honour `prefers-reduced-motion` (`reduced-motion`).

## 7. Quote form (when added)
Visible labels (not placeholder-only); `type="tel"`/`email` for correct mobile
keyboards; validate on blur; error below the field with cause+fix and an icon;
auto-focus first invalid field; loading→success on submit; inputs ≥44px tall.
(`input-labels`, `input-type-keyboard`, `inline-validation`, `error-clarity`,
`focus-management`, `touch-friendly-input`, `submit-feedback`)

## 8. Performance
WebP/AVIF with `srcset/sizes`; width/height or `aspect-ratio` on every image to
stop CLS; `loading="lazy"` below the fold (hero eager); inline/early critical
CSS. (`image-optimization`, `image-dimension`, `lazy-load-below-fold`,
`critical-css`)

## 9. Accessibility (gate before ship)
Sequential headings (one h1); skip-link; visible 2–4px focus rings (never
removed); descriptive `alt`; `aria-label` on icon-only buttons; full keyboard
nav in DOM/visual order; all phones as `tel:` links. (`heading-hierarchy`,
`skip-links`, `focus-states`, `alt-text`, `aria-labels`, `keyboard-nav`)

## 10. Home page (`indexx.html`) section order
Header (logo · nav · click-to-call) → Hero (tagline + free-quote CTA + job
photo) → Services grid (6) → Why us / about → Locations (2 branches) → Gallery
preview → Testimonials → Final CTA → Footer (contacts · ABN · social). One
primary CTA repeated; secondary actions subdued. (`landing` hero + social-proof)

## Anti-patterns to avoid
Emoji icons · raw hex in components · placeholder-as-label · removing focus
rings · color-only status · hover-only actions · `100vh` on mobile · animating
width/height/top/left · decorative gradients/glass that fight the photography ·
more than one primary CTA per view.
