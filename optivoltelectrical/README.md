# Optivolt Electrical

Marketing site for **Optivolt Electrical** — a family-owned, licensed electrical contractor
servicing Sydney, the South Coast and Central Coast NSW (Lic. 484158C).

A single-page, single-scroll static site: hand-written semantic HTML, SCSS compiled to CSS,
and a small amount of vanilla JavaScript for progressive enhancement.

## Tech stack

- **HTML5** — one hand-written `index.html`, semantic markup.
- **SCSS → CSS** — authored in `scss/`, compiled to `css/main.css` (the file the page actually links).
- **Vanilla JS** — `js/app.js`: sticky-nav state, mobile menu, scroll-reveal (IntersectionObserver),
  stat count-up, and hero motion. No frameworks, no build step beyond the Sass compile.
- **Fonts** — Gentium Basic (display/headings) + Source Sans Pro (body/UI), loaded from Google Fonts.

## Project structure

```
optivoltelectrical/
├─ index.html              # the page
├─ css/
│  └─ main.css             # compiled stylesheet (linked by index.html — do not edit by hand*)
├─ scss/                   # source of truth for styles
│  ├─ main.scss            # entry — @use the partials
│  ├─ _tokens.scss         # colors, type, spacing, breakpoints
│  ├─ _base.scss           # reset, body, base typography
│  ├─ _layout.scss         # nav, .container, footer shells
│  ├─ _sections.scss       # trust, services, about, work, stats, process, cta
│  ├─ _components.scss     # buttons, cards, chips, etc.
│  └─ _hero.scss           # hero section
├─ js/
│  └─ app.js               # progressive-enhancement scripts
├─ assets/                 # logo.png, hero.jpg, work-1…6.jpg
├─ task.md                 # original build brief / history
└─ README.md
```

\* See **Editing styles** below — edits should be made in `scss/` and recompiled. The `css/main.css`
checked in here is the build output.

## Running locally

The site is plain static files served from WampServer's `www` directory.

- **Via WampServer (Apache):** with Wamp running, open
  <http://localhost/sklentr/optivoltelectrical/>
- **Without a server:** open `index.html` directly in a browser. (A local web server is recommended
  so relative asset paths and fonts resolve exactly as in production.)

## Editing styles

Styles live in `scss/`. After editing any partial, recompile to `css/main.css`:

```bash
npx sass scss/main.scss css/main.css --style=expanded --no-source-map
```

Or watch during development:

```bash
npx sass --watch scss/main.scss css/main.css --style=expanded --no-source-map
```

> **Cache busting:** `index.html` links the stylesheet and script with a version query
> (`css/main.css?v=18`, `js/app.js?v=18`). After deploying CSS/JS changes, bump that number
> so returning visitors fetch the new files instead of a cached copy.

## Layout conventions

All major bands (nav, hero, trust, sections, footer) share one container rhythm so their content
edges line up down the page:

- **max-width:** `1480px`, centered (`margin-inline: auto`)
- **horizontal gutter:** `clamp(1.25rem, 5vw, 7rem)` applied as `padding-inline` on the same element

The fixed nav stays full-width (for its background/border) but aligns its inner content to the same
1480px column via `padding: … max($pad, calc((100% - 1480px) / 2 + $pad))`.

## Brand tokens

Defined in `scss/_tokens.scss`:

| Token | Value | Use |
|---|---|---|
| `$red` | `#e21f27` | brand accent (matches logo) |
| `$ink` / `$ink-soft` | near-black | page / footer surfaces |
| `$paper` / `$paper-dim` / `$paper-faint` | off-white → muted | text shades |
| `$maxw` | `1480px` | container width |
| `$pad` | `clamp(1.25rem, 5vw, 7rem)` | horizontal page gutter |
| `$sans` | `"Source Sans Pro", arial, sans-serif` | body / UI |

## Possible next steps

- Self-host the two Google fonts as `.woff2` for performance / offline.
- Add a real contact form (the CTA is currently click-to-call only).
- Optimise images to `.webp` and add explicit `width`/`height` to reduce layout shift.
