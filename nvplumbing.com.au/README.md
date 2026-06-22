# NV Plumbing &mdash; Sydney

A single-page marketing site for **NV Plumbing**, a Sydney-based plumbing trade serving the Inner West, Eastern Suburbs and North Shore. Built as a hand-coded editorial site &mdash; semantic HTML5, modular SCSS, vanilla ES6 modules. No frameworks.

> *&ldquo;Trust the best, flush the rest.&rdquo;*

---

## Live preview

The site is served by Apache (WAMP) at `http://localhost/sklentr/nvplumbing/` on the dev machine. The compiled CSS sits under `dist/css/` so `index.html` can also be opened directly with `file://` &mdash; no build step needed to view.

---

## Run / develop

```bash
npm install        # one-time
npm run watch:css  # live-rebuild dist/css/styles.css on SCSS edits
npm run build      # produces both expanded and minified CSS
```

## Stack

| Layer | Choice |
|---|---|
| Markup | Semantic HTML5, single `index.html` |
| Styling | Modular SCSS &rarr; `dist/css/styles.css` (Dart Sass CLI) |
| Scripts | Vanilla ES6 modules &mdash; no framework |
| Icons | Inline SVG |
| Browsers | Evergreen + iOS Safari 14+ |

## Typography

- **Body / UI** &mdash; `Helvetica, Arial, sans-serif`
- **Display / editorial** &mdash; `Bitter, serif` (Google Fonts, weights 400&ndash;700)

## Design system

- **Palette** &mdash; navy `#0E2A47`, water blue `#1E6FB2`, copper `#C46B2D`, cream `#F6F1E8`, ink `#0B1320`
- **Editorial motifs** &mdash; folio chips, hairline rules with center diamonds, fleurons, italic accents, giant decorative roman numerals
- **Motion** &mdash; staggered hero entrance, `IntersectionObserver` scroll reveals, refined hover-lift on tiles, sticky header shadow on scroll, ticker marquee, `prefers-reduced-motion` respected

## Sections (single page)

1. **Header** &mdash; sticky with custom crest logo (NV monogram, copper hairline ring, `EST · MMX` microtype), nav, big phone CTA
2. **Hero** &mdash; magazine-cover treatment: top masthead ticker with feathered edges, giant translucent `XV` numeral, hairline-framed folio `Vol. XV · SYDNEY METRO · MMXXVI`, oversized italic Bitter headline with copper fleuron, italic drop-cap intro, hand-signed signature block, refined hairline phone card, framed feature plate with `FEATURE · RECENT` badge, secondary offset plate, editorial review card, navy stat bar
3. **Trust strip** &mdash; licensed, experienced, 24/7, fair-price, Sydney-wide
4. **Services** &mdash; 8-card grid (hot water, drains, burst pipes, taps, toilets, gas, strata, renovation)
5. **Marquee** &mdash; italic crawling tagline
6. **Why us** &mdash; editorial split with image + 4 value blocks
7. **Hot water pricing** &mdash; Rheem 50 / 80 / 125 / 135 / 170 / 250 with indicative "from $X" pricing
8. **Process** &mdash; 4-step "call &rarr; quote &rarr; we fix &rarr; done" flow
9. **Stats strip** &mdash; navy, gold serif numerals
10. **Service areas** &mdash; Inner West / Eastern Suburbs / North Shore region cards with chip clouds
11. **Reviews** &mdash; navy-glow testimonial cards
12. **See our work** &mdash; premium editorial bento: hairline folio chip, oversized italic display heading with copper fleuron, giant outlined `02` backdrop numeral, counter chip `07 jobs on file`, italic aside, 7-tile bento grid with job IDs and always-readable captions
13. **FAQ** &mdash; accordion with single-open behavior
14. **Contact** &mdash; form (front-end validation) + info card with phone, region, hours
15. **CTA banner** &mdash; full-bleed gradient with phone pill
16. **Footer** &mdash; editorial dark: top headline strip with phone card, light-variant logo + Licensed/Insured/24/7 badges, services list, hours table, suburb tag cloud, refined bottom row with credit

## Folder map

```
nvplumbing/
├─ index.html
├─ scss/
│  ├─ abstracts/   variables · breakpoints · mixins
│  ├─ base/        reset · typography · global
│  ├─ layout/      header · footer
│  ├─ components/  buttons · cards · chip · form · accordion · cta-banner · floating-call · logo
│  ├─ sections/    hero · trust-strip · services-grid · hot-water · areas · testimonials · process · contact · gallery · work
│  └─ main.scss
├─ js/             main · nav · accordion · reveals · form
├─ dist/css/       styles.css · styles.min.css
├─ assets/         (images, fonts)
├─ task.md
├─ package.json
└─ README.md
```

Every SCSS file carries the author header block.

## Accessibility

- WCAG AA contrast on all text
- Visible focus rings (custom, brand-coloured)
- Skip-to-content link
- `aria-label`s on icon-only buttons
- Form labels always present
- `prefers-reduced-motion` honoured

## Repo

<https://github.com/biplab85/nvplumbing>

## Author

Designed &amp; developed by **Biplab Kumar Paul** &mdash; Web Designer &amp; Developer
Mobile: 01735 927356 &nbsp;&middot;&nbsp; Email: <biplab.cse.85@gmail.com>
