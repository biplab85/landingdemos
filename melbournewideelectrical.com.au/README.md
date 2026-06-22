# Melbourne Wide Electrical

Single-page marketing site for Melbourne Wide Electrical — a Melbourne-based
electrical contractor (est. 2003). Built as a static `index.html` + compiled
CSS + vanilla JavaScript, with SCSS source partials for editing.

**Reference site:** https://melbournewideelectrical.com.au/
**Live preview (WAMP):** http://localhost/sklentr/melbournewideelectrical/

---

## Design direction

> **Industrial-Editorial with Electric Soul.**
> Wired magazine meets a Tokyo architecture studio meets an electrician's
> blueprint. Deep navy + warm cream + copper + volt-yellow. Massive editorial
> typography paired with refined body type. Layered shadows, asymmetric
> compositions, custom round-mask shapes, and a single signature motion
> moment per section.

- **Palette:** ink `#0a1228` · cream `#f5efe5` · copper `#e8762c` · volt `#ffd23f`
- **Type:** Montserrat (display 800/900) · Lato (body) · Roboto (UI / mono captions)
- **Signature elements:**
  - Sticky vertical `EMERGENCY · 1300 635 294 · 24/7` rail (desktop)
  - Editorial dome-arch mask on the team portrait
  - Six light pastel backgrounds + six round-derived icon shapes in *Why Us*
  - Premium two-column quote modal with copper→volt accent stripe

---

## File structure

```
melbournewideelectrical/
├── index.html              # complete one-page site
├── css/
│   └── style.css           # compiled, production stylesheet
├── scss/                   # source — every partial carries the credit header
│   ├── style.scss          # main entry — imports all partials
│   ├── _variables.scss
│   ├── _mixins.scss
│   ├── _reset.scss
│   ├── _base.scss
│   ├── _buttons.scss
│   ├── _topbar.scss
│   ├── _header.scss
│   ├── _hero.scss
│   ├── _features.scss
│   ├── _about.scss
│   ├── _services.scss
│   ├── _why-choose.scss
│   ├── _emergency.scss
│   ├── _testimonials.scss
│   ├── _service-areas.scss
│   ├── _cta.scss
│   ├── _footer.scss
│   └── _responsive.scss
├── js/
│   └── main.js             # sticky header, mobile nav, slider, modal, form
├── image/                  # logo + photos
└── task.md                 # original brief
```

---

## Sections (in DOM order)

1. **Header** — fixed/overlay, becomes solid navy with backdrop-blur on scroll
2. **Hero** — three-line editorial headline, $50 OFF special-offer card, services marquee
3. **Stats** — by-the-numbers row with counter animations on scroll-in
4. **About** — dome-arch team photo + detail shot + vertical EST rail
5. **Services** — 10-card numbered grid with two image-backed feature cards
6. **Why Us** — six cards, six light backgrounds, six different round-mask icon tiles
7. **Emergency band** — full-width copper CTA strip
8. **Testimonials** — auto-rotating 3-card slider, six real Google review excerpts
9. **Service areas** — 40+ Melbourne suburb chips with copper hover
10. **CTA banner** — final dark-navy call-to-action with copper/ghost buttons
11. **Footer** — 4-column dark navy with social, services, company, contact
12. **Quote modal** — premium two-column popup, triggered by every "Get a Quote" / "Book now" button

---

## JavaScript behaviours (`js/main.js`)

- Sticky/overlay header — adds `.is-scrolled` past 40px scroll
- Mobile off-canvas nav with body scroll lock
- Smooth-scroll for in-page anchors (respects sticky header offset)
- IntersectionObserver: active nav link highlight + counter animations + card reveals
- Testimonial slider — auto-rotates every 6s, recalculates `perView` on resize
- **Quote modal** — opens from any `.js-open-quote` element; closes on backdrop click, X button, or Escape
- Form: client-side validation + success state, auto-closes modal after submit
- Back-to-top button after 600px scroll

---

## Build

The compiled `css/style.css` is checked in so the page works directly. To
edit styles, modify the SCSS partials and recompile:

```bash
# Using Dart Sass
sass scss/style.scss css/style.css --style=compressed --watch
```

…or use VS Code's *Live Sass Compiler* extension.

---

## Responsive

Tested at **1440 / 1024 / 768 / 480 / 375**. Major breakpoints:

| Breakpoint | Behaviour |
|---|---|
| 1100px | Sticky EMERGENCY rail hides |
| 1024px | Desktop nav → hamburger + off-canvas slide-in |
| 900px  | About switches to single column |
| 768px  | Hero offer card moves to inline flow |
| 760px  | Quote modal becomes a bottom-sheet |
| 600px  | Service cards collapse to single column |

`scroll-margin-top: 5rem` on all `<section id>` elements so anchor jumps clear
the fixed header.

---

## Designer / Developer credit

```text
Designed & developed by
Biplab Kumar Paul — Web Designer & Developer
Mobile: 01735 927356
Email:  biplab.cse.85@gmail.com
```

The credit header appears at the top of every `.scss` file. The visible
footer credit reads *"Made by ♥ [CapsuleDIGITAL](https://www.capsuledigital.com.au/)"*.

---

## License

This is a client / portfolio project. Photos and logo are property of
Melbourne Wide Electrical (sourced from melbournewideelectrical.com.au).
The code and design are © Biplab Kumar Paul · CapsuleDIGITAL, 2026.
