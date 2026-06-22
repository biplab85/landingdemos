# Now On Electrical — Website Redesign

Redesign of **https://nowonelectrical.com.au/** — a Sydney-based electrical contractor.

## Brand & Content Reference (from existing site)

- **Company:** Now On Electrical Pty Ltd
- **Tagline:** "an Affordable, Excellent and Trustworthy Service"
- **Mission:** "A contractor in Sydney that gives joy to customers by offering a large range of services." Aim: "provide high quality services to our customers while being reasonable."
- **Philosophy quote:** "We love what we do but we love it the best when our customers are happy."
- **Credentials:** Fully insured and licensed contractor
- **Phone:** 1300 780 287
- **Email:** nowonelectrical@gmail.com
- **Location:** Sydney, NSW

### Value props / differentiators
- More affordable pricing than competitors
- High efficiency and speed without cutting corners
- Easy accessibility across Sydney
- Quality workmanship
- Connects with carpentry, plumbing & air-conditioning specialists
- Small jobs welcome (call directly); online booking form available

### Services
- Lighting — installation & replacement (switches, IXL units, ceiling fans)
- Power — wiring, rewiring, power points
- Switchboards — new install, upgrades, inspections
- Air-conditioning wiring
- Oven & cooktop wiring
- Electrical safety checks & smoke detector installation
- Data point installations
- TV point & antenna installation
- CCTV systems
- Communication systems (intercom)
- Hot water unit electrical repair
- Renovations & upgrades
- New builds

### Service areas
The Hills · Inner West · Sydney CBD · Eastern Suburbs · North Shore · Western Sydney · Southwest · & nearby areas

### Contact form fields (to replicate)
- Service type (select): Power points, Lighting, Switchboards, Renovation/Upgrade, Electrical repair/maintenance, Electrical safety check, Data point installation, Wall mounted TV installation, Smoke alarm/Oven/Cooktop, Other
- Additional service description
- Job description
- Phone number
- Preferred date (YYYY-MM-DD)

## Assets — source everything from the live site

All images, content, and the logo come from **https://nowonelectrical.com.au/**.
Download originals into `assets/img/` and reference locally (don't hotlink).

| Asset | Source URL | Use |
|-------|-----------|-----|
| Logo | `https://i0.wp.com/nowonelectrical.com.au/wp-content/uploads/2020/05/cropped-eca3bcec849d-2020-05-11-194442-1.png` (334×90) | Header + footer logo |
| Lighting | `https://i0.wp.com/nowonelectrical.com.au/wp-content/uploads/2020/05/a8a35e3dbde265bec6c3d645c42bac43__1__1_2-1.png` | Lighting service |
| Power / general | `https://i0.wp.com/nowonelectrical.com.au/wp-content/uploads/2020/05/istockphoto-1130913074-612x612-1.jpg` | Power install section |
| Safety | `https://i0.wp.com/www.safewise.com/app/uploads/iStock-121994223.jpg` | Electrical safety section |
| Antenna / comms | `https://i0.wp.com/www.australianantennas.com.au/wp-content/uploads/2019/02/rafter-mount-installation-1.jpg` | Comms / antenna section |

> Note: no favicon or dedicated gallery images were found in the page source — grab gallery images from the live `/gallery` page when building that page.

## Design Direction

- **Font stack:** `"PT Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`
  - Load PT Sans (400/700) from Google Fonts.
- Clean, modern, trustworthy electrician aesthetic.
- Mobile-first and fully responsive.
- Clear, prominent CTAs: **Call 1300 780 287** and **Get a Quote / Book Online**.
- Accessible (semantic HTML, alt text, sufficient contrast, keyboard-friendly).

## Styling — SCSS

Use **SCSS** (not plain CSS), compiled to `css/style.css` which the HTML links to.

```
scss/
  _variables.scss   # colors, font stack ($font-base), spacing, breakpoints
  _mixins.scss      # responsive mixins, button mixins, flex/grid helpers
  _base.scss        # reset, typography, body defaults
  _header.scss      # nav + mobile hamburger
  _hero.scss
  _services.scss
  _about.scss
  _contact.scss     # booking form
  _footer.scss
  main.scss         # @use/@import partials -> compiles to ../css/style.css
```

- Define brand colors + the PT Sans `$font-base` stack in `_variables.scss`.
- Use nesting, variables, and mixins for breakpoints (mobile-first).
- Compile: `sass scss/main.scss css/style.css` (or `--watch`).
- Commit compiled `css/style.css`; HTML links the compiled file only.

## Scope — SINGLE PAGE ONLY

Build **only `index.html`** (the front page). No inner pages. Nav links scroll to
sections on the same page (anchors).

- [x] **index.html** — Home (one-page) ✅ built & browser-verified
  - [x] Header / sticky nav (anchors: Services, Why us, Areas, Contact) + click-to-call
  - [x] Mobile drawer nav (animated hamburger, numbered links)
  - [x] Hero — tagline, value props, primary CTAs, power-button emblem
  - [x] Trust strip (Licensed & Insured · Sydney-wide · Small jobs welcome)
  - [x] Services grid (all 13 services, color-coded icons)
  - [x] Why choose us (4 differentiators + stacked images)
  - [x] Service areas (tag pills)
  - [x] Philosophy / pull quote (dark band)
  - [x] Contact / quote section + booking form (validates, success hint)
  - [x] CTA band + footer (company, phone, email, areas, nav)

### Build status
- Aesthetic: **"Live Circuit"** — electric cobalt + power-button red, blueprint grid, cyan glow.
- SCSS compiled clean (no warnings) → `css/style.css` (expanded) + `css/style.min.css` (minified).
- Verified in browser at 1280px + 390px; 0 console errors.
- **To switch to minified CSS for production:** point `index.html` `<link>` at `css/style.min.css`.
- Recompile after SCSS edits: `npx sass scss/main.scss css/style.css --no-source-map`
  (add `--watch` while developing).

## Tasks

- [ ] Download all images + logo from the live site into `assets/img/`
- [ ] Set up SCSS structure (`scss/` partials + `main.scss`) and compile to `css/style.css`
- [ ] Define `_variables.scss` (colors, font stack, spacing, breakpoints) + `_mixins.scss`
- [ ] Build `index.html` (first)
- [ ] Header + mobile nav (hamburger)
- [ ] Footer
- [ ] Contact / booking form (with the fields above)
- [ ] Responsive testing (mobile / tablet / desktop)
- [ ] Accessibility pass
- [ ] Cross-page consistency (nav, footer, styles)

## Notes

- Nav on current site: Home, About, Contact, Gallery (add Services if split out).
- Keep phone number click-to-call (`tel:1300780287`) everywhere.
- Email link: `mailto:nowonelectrical@gmail.com`.
