# CLAUDE.md — Inox Electrical Website Redesign

> Single source of truth for the Inox Electrical redesign. Read this fully before
> writing any HTML, SCSS, or JS. **No code is to be written until this plan, the
> design system, and the task roadmap are approved.**

---

## 0. Project Snapshot

| | |
|---|---|
| **Client** | Inox Electrical Pty Ltd |
| **Industry** | Licensed electrical contractor (residential, commercial, maintenance, emergency) |
| **Service area** | Greater Sydney Region, NSW, Australia |
| **Current site** | http://inoxelectrical.com.au (WordPress + Elementor) |
| **Tagline (current)** | "Your Go-To Electricians for Quality Electrical Services" |
| **Phone** | 0432 191 303 |
| **Email** | support@inoxelectrical.com.au |
| **Address** | Box Hill NSW 2765 *(About text says "Hassall Grove" — needs client confirmation, see §2.4)* |
| **Social** | Facebook: facebook.com/inoxelectrical21 |
| **Key person** | Harry Atuatika (named repeatedly in reviews — strong personal-brand asset) |
| **Credentials** | Accredited Master Electricians; Lifetime Workmanship Warranty |
| **Current offer** | FREE Electrical Safety Report — a $180 value (first job booking) |

### Build target for phase 1
A **single-page `index.html`** styled with **SCSS only** (compiled to CSS). No CSS
frameworks (no Bootstrap/Tailwind). **Motion powered by GSAP** (+ ScrollTrigger)
for scroll reveals, parallax, counters, and micro-interactions; vanilla JS for
behaviour (nav, carousels, lightbox, form). Mobile-first, accessible, fast.

**Two distinct experiences from one codebase:**
- **Desktop/tablet:** classic premium marketing landing page (§4 layout).
- **Mobile:** an **app-style UI** — feels like a native mobile app, not a shrunk
  website (see §10.1): fixed top app-bar, bottom tab navigation, card/sheet
  surfaces, swipeable carousels, and GSAP micro-animations on tap/scroll.

### Design inspiration references (from `sesource-link.txt`)
> These are the **authoritative direction references** for this project. Match
> their motion confidence, sectioning rhythm, and polish (not their color/copy).
- https://helo.crowdytheme-demo.com/renovation/ — bold construction/renovation layout, strong hero, sectioned services, on-scroll reveals.
- https://preview.treethemes.com/elementor/pine/maindemo/home-6/ — clean studio/industrial aesthetic; high-contrast accent shapes, generous whitespace, hover-expand cards, alternating text/visual blocks, scroll-prompt cues.
- https://themexriver.com/wp/technox/home-2-onepage/ — one-page IT/industrial flow (best structural match to our single-page brief): hero→stats→logos→about→services grid→why-choose→portfolio→4-step process→footer, with reveal-on-scroll, animated counters, and hover-interactive cards.

Use these for **layout rhythm, motion confidence, and presentation polish**, not
for color or literal copying. Our visual identity is defined in §5–§8.

---

## 1. Current Site Audit

The existing site is a dark-grey Elementor template with a green accent. It
communicates the basics but reads as a generic, dated builder template and leaks
trust and conversions. Findings below are grouped by area.

### 1.1 Structure & Navigation
- **Nav items:** Home · About Us · Services (dropdown) · Projects · Reviews · `Contact Us` (button).
- Single-page anchors (`#about`, `#service`, `#projects`, `#reviews`) mixed with
  real sub-pages (`/commercial-electrician/`, `/residential-electrician/`,
  `/electrical-maintenance/`, `/emergency-work/`, `/contact-us/`). Inconsistent
  mental model — some "pages" are anchors, some are routes.
- **Inconsistent CTAs:** the special offer links to `/contact` (no trailing
  slash, likely 404), while everything else uses `/contact-us/`.
- No sticky header behaviour communicated; phone number is small in a top utility bar.

### 1.2 Content
- **Typos / errors that erode trust:** "offics" (offices), "promote turnaround"
  (prompt), "Box Hill" vs "Hassall Grove" address conflict.
- **Mismatched service copy:** "Emergency work" card describes *"Fast lighting
  upgrades and repairs to brighten up any space"* — that's lighting copy, not
  emergency copy.
- **Service set is duplicated** between the hero icon strip and the "Our Full
  Range of Services" grid — redundant, no new information.
- **"Installation & Wiring"** has no dedicated page; its links dump users to
  `/contact-us/`.
- Strong raw assets are underused: 9 detailed 5★ Google reviews, a named/trusted
  tradesperson (Harry), real project photos, and genuine credentials (Master
  Electricians, Lifetime Warranty).

### 1.3 UX / UI & Visual Design
- **Broken/empty media:** service icons render as grey/green placeholder boxes;
  the **Projects gallery is blank** (images not loading); **Trusted Partners
  logos are blank**. Several large empty bands of dead space result. (Console
  showed 40+ errors on load.)
- **Heavy, monotonous palette:** large slabs of `#343434`/`#444` charcoal with a
  single green make the page feel dark, flat, and template-like.
- **Poor hero legibility:** white headline over a busy, bright photo with no
  scrim/overlay — low contrast, hard to read.
- **Dated component styling:** square buttons (`border-radius: 0`), thin grey
  card borders, no depth, no hover states of note.
- **Generic typography:** Poppins everywhere at one weight; no type hierarchy or
  rhythm; body falls back to system font in places (inconsistent).
- **Weak trust surfacing:** Master Electricians accreditation and Lifetime
  Workmanship Warranty are buried in a paragraph instead of being hero-level
  trust badges.

### 1.4 Branding
- Logo is a simple "IE" mark + wordmark; fine but small and low-contrast in header.
- No consistent brand voice; copy alternates between confident and filler
  ("brighten up any space").
- Green accent (`#70B857`) is the one real brand equity — keep and refine it.

### 1.5 Conversion Flow (the biggest problem)
- **No dominant primary action.** "Contact Us", "Read More", "Quick Quote",
  "Book Online" all compete with equal weight. The user is never told the one
  thing to do.
- **Phone is the highest-intent action for a tradie** yet it's a small top-bar
  link, not a prominent tap-to-call button (critical on mobile).
- **No lead-capture form on the homepage** — every conversion bounces to a
  separate `/contact-us/` page (added friction, drop-off).
- The **$180 free safety report offer is strong but buried** mid-page on a black
  band with a likely-broken link.
- **No urgency/availability cues** for emergency work (no "24/7", no response-time
  promise) despite emergency being a headline service.

### 1.6 Audit Summary — what to fix
1. Establish **one primary CTA** (Get a Free Quote) + **one persistent secondary**
   (tap-to-call), everywhere.
2. **Surface trust** (Master Electricians, Lifetime Warranty, 5★ Google, licence
   no.) above the fold.
3. **Replace dead media** with real project photography and working logos; never
   ship empty bands.
4. **Modernise the visual system:** lighter, layered palette; refined type scale;
   rounded, tactile components; generous spacing.
5. **Capture leads on-page** (embedded quote form) + sticky mobile call/quote bar.
6. **Fix all copy** (typos, mismatched service descriptions, address conflict).

---

## 2. Redesign — Project Goals

### 2.1 Primary objective
Convert visitors into **quote requests and phone calls**. Every design decision is
judged against: *does this move a homeowner/business closer to contacting Inox?*

### 2.2 Goals (in priority order)
1. **Lift conversions** — clear, repeated, single primary CTA + frictionless
   on-page quote form + sticky tap-to-call.
2. **Build instant trust** — credentials, warranty, real reviews, real project
   photos, local Sydney signalling, above the fold.
3. **Look modern & premium** — distance the brand from the generic Elementor look;
   feel like a established, safety-first professional outfit.
4. **Be fast & accessible** — mobile-first, Lighthouse-friendly, WCAG 2.1 AA
   contrast, keyboard-navigable, semantic HTML.
5. **Be maintainable & scalable** — clean SCSS architecture and a documented
   component library so future pages reuse the same system.

### 2.3 Success criteria (qualitative for phase 1)
- A first-time visitor knows *who, what, where, and how to act* within 5 seconds.
- Primary CTA reachable within one thumb-tap from any scroll position on mobile.
- Zero broken media, zero placeholder boxes, zero copy typos.
- Consistent spacing/typography across all sections (no ad-hoc values).

### 2.4 Open questions for the client (resolve before/at approval)
- **Address:** Box Hill NSW 2765 vs "Hassall Grove" — which is correct (or both: HQ
  vs service area)?
- **Electrical licence number** — needed for a credible footer/trust badge (AU
  electricians should display this).
- **Emergency availability** — is it genuinely 24/7? Stated response time?
- **Google rating + review count** — exact figures to display (e.g. "5.0 ★ from 30+
  reviews").
- **Real partner/brand logos** for the "Trusted Partners" strip (current ones don't load).
- **Hi-res project photos** with permission to use, ideally with short captions
  (suburb + job type).

---

## 3. Homepage Information Architecture

Single-page, top-to-bottom narrative ordered by buyer psychology: *hook → trust →
what we do → proof → offer → act*.

| # | Section | Job of the section | Primary CTA |
|---|---------|--------------------|-------------|
| 0 | **Top utility bar** (optional, slim) | Phone, email, service area, Google rating | Tap-to-call |
| 1 | **Header / Nav** (sticky) | Wayfinding + persistent CTA | "Get a Free Quote" |
| 2 | **Hero** | Hook + value prop + dual CTA + trust strip | Quote / Call |
| 3 | **Trust bar** | Credentials at a glance (Master Electricians, Lifetime Warranty, Licensed & Insured, 5★ Google) | — |
| 4 | **Services** | What we do (5 services, scannable cards) | Per-card "Learn more" |
| 5 | **Why Choose Inox** | Differentiators (expert team, quality, emergency response, warranty) | — |
| 6 | **About / Meet the team** | Local credibility + human face (Harry & team) | "About us" / Call |
| 7 | **Projects** | Visual proof (real photo gallery, filterable later) | "See our work" |
| 8 | **Reviews** | Social proof (Google reviews carousel) | "Read all reviews" |
| 9 | **Special Offer** | Incentive ($180 free safety report) | "Claim offer" |
| 10 | **Quote / Contact** | On-page lead capture form + details + map | Submit form |
| 11 | **Footer** | Nav, services, contact, social, licence, legal | Tap-to-call |
| — | **Sticky mobile action bar** | Persistent Call + Quote on small screens | Both |

Anchor IDs: `#home`, `#services`, `#why`, `#about`, `#projects`, `#reviews`,
`#offer`, `#contact`.

---

## 4. Section-by-Section Layout Strategy

### 1. Header (sticky) — *light "Helo" style (implemented)*
- **Solid light/white** header (translucent + blur), subtle shadow on scroll.
- Left: logo. Inline **utility**: phone + email (icon + label), divider rule.
- Right: **"Get a Free Quote"** pill + **hamburger** that opens the full-screen
  overlay menu (primary nav lives in the overlay on all breakpoints — matches the
  reference's hamburger-first pattern).
- Mobile: app-bar (logo + tap-to-call + hamburger) over the light hero.

### 2. Hero — *editorial light split (implemented, per `helo/renovation` ref)*
- **Light background**, asymmetric split — not a dark full-bleed image.
- **Giant uppercase display headline** (Poppins, ~`clamp(2.9rem,8.5vw,6.6rem)`),
  last word in brand green, with a small **inline pill image** embedded in the text.
- **Framed portrait photo** on the right; the green accent word overlaps its edge.
- **Bordered stat card** bottom-left (e.g. "Greater Sydney's Trusted Electricians /
  5.0 ★ Google Rated", green circle accent).
- **Intro sentence + dual CTA** (Get a Free Quote / Call Now) below the headline.
- **Vertical "Follow" social rail** + **rotating circular seal** ("Inox Electrical ·
  Licensed & Insured") with a scroll-down arrow over the image.
- Mobile: stacks (headline → image → card → intro/CTA); rail/seal simplify or hide.

### 3. Trust bar
- Slim horizontal band, 4 items with small icons + label. Light background.
- Items: "Accredited Master Electricians", "Lifetime Workmanship Warranty",
  "Licensed & Fully Insured", "5★ Google Reviews".

### 4. Services
- Section intro (left): H2 "Our Full Range of Services" + one-line + a CTA.
- Card grid: 3-up desktop / 2-up tablet / 1-up mobile. 5 cards:
  Residential, Commercial, Maintenance, Emergency Work, Installation & Wiring.
- Each card: icon, title, one-line benefit-led description, "Learn more →".
- One card may be a **feature/highlight card** (different accent) — e.g. Emergency.
- Replace broken icon set with a consistent inline-SVG icon family.

### 5. Why Choose Inox
- H2 + 3–4 value props in a row (icon, title, short copy).
- Optional: a stat band ("X+ jobs completed", "5.0★", "Lifetime warranty",
  "Same-day emergency"). Use only real, client-confirmed numbers.

### 6. About / Meet the team
- Two-column: left = real photo (Harry/team/van); right = concise about copy
  (rewritten, typo-free) + credential chips + "About us" CTA.
- Emphasise local Sydney presence and the personal, named service reviewers praise.

### 7. Projects
- H2 "Real projects. Reliable outcomes." + masonry/grid gallery of real photos.
- Hover: zoom + caption (job type / suburb). Lightbox on click.
- Must not ship empty — if photos pending, gate this section behind asset delivery.

### 8. Reviews
- Google Reviews carousel: card per review (avatar, name, 5 stars, text, "Google"
  badge). Show aggregate rating + count prominently.
- Auto-advance with manual prev/next; pause on hover; swipe on touch.

### 9. Special Offer
- Eye-catching band (brand accent, not flat black). Headline "$180 Value — FREE
  Electrical Safety Report", subtext "Valid on your first job booking",
  prominent CTA scrolling to the contact form (fix the broken `/contact` link).

### 10. Quote / Contact
- Two-column: left = **lead form** (Name, Phone, Email, Service type select,
  Message, submit "Request My Free Quote"); right = contact details, hours,
  service area, embedded map, social.
- Form is the page's main conversion event — make it the visual focus.

### 11. Footer
- 4 columns: brand + blurb + social; Services links; Quick links; Contact details.
- Bottom bar: copyright, **licence number**, privacy link, credit.

### Sticky mobile action bar
- Fixed bottom bar on ≤ tablet: two buttons — **Call** and **Get Quote**.

---

## 5. Modern Design Direction

**Concept:** *"Trusted local tradesperson, presented like a premium brand."*
Clean, confident, safety-forward. Lots of white space, layered depth (soft
shadows, rounded corners), one energetic accent doing the heavy lifting against a
calm neutral base. Photography-led (real work, real people) instead of stock
icons-on-grey.

**Principles**
- **Light-first, not dark-slab.** Default to white/off-white sections with
  occasional dark "anchor" sections for rhythm — invert the current dark-heavy feel.
- **Accent with intent.** Use the brand green only for actions, highlights, and key
  trust marks — not as large flat fills. Scarcity makes it read as energy.
- **Depth & softness.** Rounded corners (`8–16px`), soft elevation shadows, subtle
  borders — replaces the flat square-bordered cards.
- **Generous, rhythmic spacing.** Consistent vertical section padding; never cramped.
- **Motion as identity (GSAP).** Purposeful, premium micro-animations — scroll
  reveals, parallax, counters, magnetic/hover lifts, staggered card entrances —
  give the brand an "expensive" feel. Always respect `prefers-reduced-motion`.
  Full system in §5.1.
- **App-like on mobile.** Mobile is designed as a native-feeling app, not a
  squeezed desktop page (§10.1).
- **Proof everywhere.** Stars, badges, real photos, named reviews — trust is a
  design element, not an afterthought.

### 5.1 Motion & Animation System (GSAP)

**Library:** GSAP 3 + **ScrollTrigger** (and `Flip`/`Observer` only if needed).
Load via CDN or npm. All motion is progressive enhancement — the page is fully
usable and styled without JS.

**Animation catalogue (where each is used)**
| Pattern | Implementation | Where |
|---|---|---|
| **Hero intro** | Timeline: staggered fade-up of eyebrow → H1 → text → CTAs → trust strip on load | Hero |
| **Reveal on scroll** | `ScrollTrigger` fade/slide-up as sections enter (stagger for grids) | All sections |
| **Animated counters** | Numbers count up when stat block enters viewport | Why-choose / stats |
| **Parallax** | Subtle background/image y-shift on scroll | Hero, About, Offer band |
| **Card hover lift** | translateY + shadow + accent border (CSS; GSAP for magnetic option) | Service/project/review cards |
| **Stagger grids** | Children animate in sequence (`stagger: 0.08`) | Services, projects, partners |
| **Sticky header morph** | Transparent→solid, height/logo tween on scroll | Header |
| **Carousel transitions** | Eased slide + opacity for reviews/partners | Carousels |
| **Lightbox** | Scale/opacity open-close | Projects |
| **Button micro-interactions** | Hover fill sweep, icon nudge, press scale | Buttons/CTAs |
| **Mobile tab feedback** | Active-tab indicator slide, tap scale, page-section snap | App bottom nav (§10.1) |
| **Horizontal scroll** | Section pinned (`ScrollTrigger pin`), vertical scroll mapped to track `translateX` via `scrub`; progress bar fills; releases at end. `gsap.matchMedia` enables it only on `≥1024px + no-reduced-motion`; native scroll-snap swipe carousel is the fallback. | "How We Work" section (`.hscroll`) |

**Motion principles**
- Durations 0.3–0.8s; easing `power2.out` / `power3.out` (no linear, no bounce-heavy).
- Animate `transform` + `opacity` only (GPU-friendly, no layout thrash).
- Stagger ≈ 0.06–0.1s for groups; never animate more than needed (perf budget).
- **`prefers-reduced-motion: reduce`** → disable scroll/parallax/counters; show
  final state instantly. This is mandatory, not optional.
- Motion tokens (durations/eases) centralised in `abstracts/_variables.scss` and a
  JS motion config so timings stay consistent.

---

## 6. Color Palette

Refines the existing brand green and pairs it with a deep professional ink + warm
electric accent + clean neutrals. All combinations chosen to meet WCAG AA.

### Brand
| Token | Hex | Use |
|---|---|---|
| `--c-brand` | `#5BA535` | Primary brand green (refined from current `#70B857`) — primary buttons, key accents |
| `--c-brand-600` | `#4E9230` | Hover/active for brand green |
| `--c-brand-300` | `#A9D69A` | Tints, subtle backgrounds, focus rings |
| `--c-brand-50` | `#EEF7E9` | Soft section/section-tint backgrounds |

### Ink / neutrals
| Token | Hex | Use |
|---|---|---|
| `--c-ink-900` | `#14181C` | Darkest — dark "anchor" sections, headings on light |
| `--c-ink-700` | `#2A3138` | Footer, dark surfaces |
| `--c-ink-500` | `#5A646E` | Body text on light |
| `--c-ink-300` | `#9AA4AE` | Muted text, captions |
| `--c-line` | `#E3E8EC` | Borders, dividers |
| `--c-surface` | `#FFFFFF` | Default section background |
| `--c-surface-alt` | `#F5F7F8` | Alternating section background |

### Accent / utility (use sparingly)
| Token | Hex | Use |
|---|---|---|
| `--c-energy` | `#FFB400` | Safety/electric amber — offer band, emergency, ratings stars |
| `--c-danger` | `#E5484D` | Emergency/urgent cues, form errors |
| `--c-success` | `#2E9E5B` | Success states / form confirmation |
| `--c-star` | `#FBBC04` | Google review stars (Google-accurate) |

> **Rule:** green = primary action & brand; amber = urgency/offer/ratings only;
> dark ink sections used for rhythm (~1 per 2–3 light sections), never as the
> default. Confirm final accent direction at approval.

---

## 7. Typography System

**Font pairing** (final)
- **Headings/Display:** `Poppins, sans-serif` — weights 500/600/700 (keeps brand
  continuity; geometric, confident).
- **Body/UI:** `"Open Sans", sans-serif` — weights 400/500/600/700 (highly legible
  at all sizes; replaces the inconsistent system-font fallback).
- Load via Google Fonts with `display=swap` (or self-host for performance). Only
  pull the weights actually used.

```scss
// abstracts/_variables.scss
$font-heading: 'Poppins', sans-serif;
$font-body:    'Open Sans', sans-serif;
```

**Type scale** (modular, ~1.25 ratio; fluid with `clamp()`)
| Token | Size (desktop) | Fluid | Weight | Use |
|---|---|---|---|---|
| `--fs-display` | 60px | `clamp(2.5rem, 5vw, 3.75rem)` | 700 | Hero H1 |
| `--fs-h2` | 40px | `clamp(2rem, 3.5vw, 2.5rem)` | 700 | Section titles |
| `--fs-h3` | 28px | `clamp(1.5rem, 2.5vw, 1.75rem)` | 600 | Card / sub titles |
| `--fs-h4` | 20px | — | 600 | Minor headings |
| `--fs-lead` | 19px | — | 400 | Intro paragraphs |
| `--fs-body` | 16px | — | 400 | Default body |
| `--fs-sm` | 14px | — | 400/500 | Captions, labels |
| `--fs-xs` | 12px | — | 600 | Eyebrows/overlines (uppercase, letter-spaced) |

**Rules**
- Line-height: 1.1–1.2 headings, 1.6 body.
- Headings `--c-ink-900` on light, `#fff` on dark; body `--c-ink-500`.
- Eyebrows: uppercase, `letter-spacing: 0.08em`, brand green.
- Max line length ~65ch for paragraphs.

---

## 8. Spacing, Layout & Radius System

**8px base unit.** All spacing is a multiple of 4/8 — no arbitrary values.

| Token | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 48px |
| `--space-8` | 64px |
| `--space-9` | 96px |
| `--space-10` | 128px |

**Layout**
- Container max-width: `1200px`, side gutters `--space-5` (24px), `--space-4` on mobile.
- Section vertical padding: `--space-9` (96px) desktop, `--space-7` (48px) mobile.
- Grid: 12-col mental model; cards use CSS Grid with `gap: --space-5/6`.

**Radius & elevation**
| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 8px | Inputs, chips, small elements |
| `--radius-md` | 12px | Buttons, cards |
| `--radius-lg` | 20px | Large cards, image frames |
| `--radius-pill`| 999px | Pills, tap-to-call |
| `--shadow-sm` | `0 1px 3px rgba(20,24,28,.08)` | Subtle |
| `--shadow-md` | `0 8px 24px rgba(20,24,28,.10)` | Cards |
| `--shadow-lg` | `0 18px 48px rgba(20,24,28,.14)` | Hover lift, modals |

---

## 9. Component Library (phase 1)

Each component is one SCSS partial under `components/`, BEM-named, themable via the
CSS custom properties above.

| Component | Notes / variants |
|---|---|
| **Button** | `.btn` + `--primary` (green), `--secondary` (ink), `--ghost`/`--outline`, `--lg`, `--block`; hover lift + color shift; pill option for call |
| **Tap-to-call** | Phone pill with icon; `tel:` link; prominent on mobile |
| **Header / Navbar** | Sticky, transparent→solid on scroll; desktop links + mobile overlay |
| **Hero** | Scrim overlay, eyebrow, display heading, dual CTA, inline trust strip |
| **Trust bar** | Icon + label items, responsive wrap |
| **Service card** | Icon, title, text, link; default + `--feature` (accent) variant |
| **Why-choose item** | Icon, title, copy; optional stat variant |
| **Stat block** | Big number + label |
| **Review card** | Avatar, name, date, stars, text, Google badge; "read more" expand |
| **Carousel** | Reusable for reviews + partner logos; prev/next, autoplay, swipe, a11y |
| **Project tile** | Image, hover zoom, caption, lightbox trigger |
| **Offer band** | Accent background, headline, CTA |
| **Horizontal scroll (`.hscroll`)** | Pinned section + horizontal track of step panels (`.hpanel`); GSAP pin+scrub on desktop, native swipe carousel fallback; progress bar. Used for "How We Work" (§5.1) |
| **Form / input** | Label, input, select, textarea, validation states, focus ring |
| **Footer** | Multi-column + bottom bar |
| **Mobile app-bar** | Fixed top bar (≤ tablet): logo + call + menu; condenses on scroll |
| **Mobile tab bar** | Fixed bottom nav (≤ tablet): icon+label tabs, sliding active indicator (§10.1) |
| **Bottom sheet / modal** | Slide-up surface for quote form & lightbox on mobile |
| **Section header** | Eyebrow + H2 + lead, left or centered variant |
| **Chip / badge** | Credential chips, rating badge |
| **Icon system** | Consistent inline-SVG set (sprite or partials) |

**Interaction/behaviour:** mobile menu + bottom-tab nav, sticky/condensing header,
swipeable carousels, scroll-reveal & parallax & counters (**GSAP + ScrollTrigger**),
lightbox/bottom-sheet, smooth anchor scroll (GSAP ScrollTo), form client-side
validation. All progressive-enhancement and `prefers-reduced-motion`-aware (§5.1).

---

## 10. Responsive Approach

**Mobile-first.** Base styles target small screens; `min-width` media queries add
complexity upward.

| Breakpoint | Token | Min-width | Layout shift |
|---|---|---|---|
| Base | — | 0 | 1-col, stacked, sticky action bar visible |
| `sm` | `--bp-sm` | 480px | minor type/spacing bumps |
| `md` | `--bp-md` | 768px | 2-col grids, nav still collapsible |
| `lg` | `--bp-lg` | 1024px | full desktop nav, 3-col service grid, hide sticky bar |
| `xl` | `--bp-xl` | 1280px | max container, larger hero |

**Rules**
- Min tap target 44×44px. Tap-to-call and Quote always reachable on mobile.
- Fluid type via `clamp()`; fluid section padding.
- Images: `srcset`/sizes, lazy-load below the fold, explicit width/height to avoid CLS.
- Test at 360 / 768 / 1024 / 1440 widths.

### 10.1 App-Style Mobile Experience

On `< lg` (≤ tablet) the homepage is presented as a **native-feeling mobile app**,
not a shrunk desktop site. Goal: thumb-driven, card-based, smooth, familiar.

**Shell**
- **Fixed top app-bar:** compact — logo + tap-to-call icon + menu/notification
  icon. Condenses/elevates on scroll (GSAP).
- **Fixed bottom tab bar (primary nav):** 4–5 icon+label tabs mapping to key
  anchors, e.g. **Home · Services · Projects · Reviews · Call**. Active tab has a
  sliding indicator + accent; tapping smooth-scrolls (GSAP ScrollTo) to the
  section. Replaces the desktop top-nav and the earlier "sticky action bar".
- **Safe-area aware:** honour `env(safe-area-inset-bottom/top)` for notched
  devices so bars don't clip.

**Surfaces & interactions**
- **Card/sheet aesthetic:** rounded cards, soft shadows, content in tappable
  tiles; section headers feel like app screens.
- **Swipe everywhere:** services, reviews, projects, partners are horizontal
  **swipeable carousels** with snap + dot indicators (touch/drag).
- **Bottom-sheet / modal** pattern for the quote form and project lightbox (slides
  up from bottom, draggable handle feel).
- **Tap feedback:** press-scale + ripple/accent on buttons and tabs (GSAP).
- **Scroll snapping** optional between hero/services for an app-like paged feel.
- **Floating quick-action** (Quote) can sit above the tab bar if needed.

**Implementation notes**
- Same HTML; the app shell (top app-bar, bottom tab bar) is shown/hidden purely by
  breakpoint via CSS — no separate markup tree, no duplicated content.
- Desktop nav and the app bottom-tab nav are mutually exclusive by media query.
- Keep it accessible: tabs are real `<a>`/`<button>` with `aria-current`, focus
  states, and labels (not icon-only).

---

## 11. Scalable SCSS Architecture

**7-1–inspired** pattern, adapted for a single page now but ready for multi-page
later. Compiled with Dart Sass (`@use`/`@forward`, **no** deprecated `@import`).

```
scss/
├── main.scss                # entry — @use all layers in order
│
├── abstracts/               # no CSS output — tokens & tools
│   ├── _variables.scss      # design tokens → CSS custom properties (:root)
│   ├── _functions.scss      # rem(), spacing helpers, color helpers
│   ├── _mixins.scss         # media queries, flex/grid, typography, focus-ring
│   └── _index.scss          # @forward the above
│
├── base/
│   ├── _reset.scss          # modern reset / normalize
│   ├── _root.scss           # :root custom properties from tokens
│   ├── _typography.scss     # base element type styles
│   └── _global.scss         # body, links, selection, scroll-behavior
│
├── layout/
│   ├── _container.scss      # .container, grid scaffolding
│   ├── _header.scss
│   ├── _footer.scss
│   └── _section.scss        # section padding/rhythm, alt backgrounds
│
├── components/              # one file per component from §9
│   ├── _button.scss
│   ├── _hero.scss
│   ├── _trust-bar.scss
│   ├── _service-card.scss
│   ├── _why-item.scss
│   ├── _stat.scss
│   ├── _review-card.scss
│   ├── _carousel.scss
│   ├── _project-tile.scss
│   ├── _offer.scss
│   ├── _form.scss
│   ├── _app-bar.scss        # mobile top app-bar (§10.1)
│   ├── _tab-bar.scss        # mobile bottom tab nav (§10.1)
│   ├── _bottom-sheet.scss   # mobile sheet/modal surface
│   ├── _chip.scss
│   └── _icons.scss
│
├── sections/                # page-section composition (homepage)
│   ├── _hero.scss (compose), _services.scss, _why.scss, _about.scss,
│   ├── _projects.scss, _reviews.scss, _offer.scss, _contact.scss
│
└── utilities/
    └── _helpers.scss        # .u-text-center, .u-mt-*, visually-hidden, etc.
```

**Conventions**
- **Tokens once:** all design values live in `abstracts/_variables.scss` and are
  emitted as CSS custom properties in `base/_root.scss`; components reference
  `var(--token)` so future theming is trivial.
- **Naming:** BEM (`.block__element--modifier`). One component = one partial.
- **Mixins** for breakpoints (`@include mq(md){…}`), focus rings, visually-hidden.
- **No magic numbers** — spacing/type/color/radius/shadow come from tokens only.
- **Order in `main.scss`:** abstracts → base → layout → components → sections →
  utilities (utilities last to win specificity ties).
- **Build:** `sass scss/main.scss css/style.css` (compressed for prod, source maps
  in dev). Autoprefixing strategy confirmed at approval (PostCSS optional).

**Motion tokens:** GSAP durations/eases/stagger values live in
`abstracts/_variables.scss` (mirrored as CSS custom props for CSS transitions) and
in a JS `motion` config object, so timings are consistent and tunable in one place.

**File/asset layout**
```
/index.html
/css/style.css            # compiled output (do not edit by hand)
/scss/…                   # source (above)
/js/
│   ├── main.js           # init + behaviours (nav, tab-bar, carousels, form, lightbox)
│   └── animations.js     # GSAP + ScrollTrigger timelines, reduced-motion guard
/assets/img/…             # optimized images (hero, projects, team)
/assets/icons/…           # SVG icons / sprite
```

**JS approach:** vanilla ES modules; GSAP (+ ScrollTrigger/ScrollTo) for motion.
`animations.js` checks `prefers-reduced-motion` first and no-ops all motion if set.

---

## 12. Task Roadmap

> Execute **only after approval of §1–§11**. Sequenced for clean, reviewable steps.

### Phase A — Approval & assets (no code)
- [ ] A1. Client review & sign-off of this CLAUDE.md (palette, fonts, IA).
- [ ] A2. Resolve §2.4 open questions (address, licence no., 24/7, rating count).
- [ ] A3. Collect assets: logo (SVG), real project photos, team photo, partner logos.
- [ ] A4. Finalise rewritten, typo-free copy for every section.

### Phase B — Scaffolding
- [ ] B1. Create folder structure (§11); init Sass build + npm script.
- [ ] B2. `abstracts/` tokens (color, type, space, radius, shadow, breakpoints) + mixins/functions.
- [ ] B3. `base/` reset, `:root` custom properties, base typography, globals.
- [ ] B4. `layout/` container, section rhythm, header/footer shells.

### Phase C — Components (build in isolation, mobile-first)
- [ ] C1. Button + tap-to-call.  C2. Header/nav + mobile overlay.
- [ ] C3. Hero.  C4. Trust bar.  C5. Service card grid.
- [ ] C6. Why-choose / stats.  C7. Review card + carousel.
- [ ] C8. Project tile + gallery/lightbox.  C9. Offer band.
- [ ] C10. Form/inputs.  C11. Footer.  C12. Icon set.
- [ ] C13. **App shell** — mobile top app-bar + bottom tab nav + bottom-sheet (§10.1).

### Phase D — Page assembly (`index.html`)
- [ ] D1. Semantic HTML structure with all sections (§3) + anchors.
- [ ] D2. Wire real content/assets; ARIA, alt text, landmarks.
- [ ] D3. `js/main.js`: nav, app tab-bar, condensing header, carousels, lightbox/sheet, form validation.

### Phase E — Motion (GSAP)
- [ ] E1. Set up GSAP + ScrollTrigger + motion config; `prefers-reduced-motion` guard.
- [ ] E2. Hero load timeline; section reveal/stagger; counters; parallax.
- [ ] E3. Micro-interactions: button sweeps, card lifts, header morph, tab-bar feedback.

### Phase F — QA & polish
- [ ] F1. Responsive + app-mobile pass (360/768/1024/1440).  F2. A11y (contrast, keyboard, screen-reader, reduced-motion).
- [ ] F3. Performance (image optimisation, lazy-load, CLS, GSAP perf, Lighthouse).
- [ ] F4. Cross-browser check.  F5. Final copy proofread.  F6. Client review.

---

## 13. Working Agreement / Guardrails

- **Do not generate HTML, SCSS, or JS until this document is approved.**
- Single-page `index.html` + **SCSS only** for styling (no CSS frameworks).
- **GSAP** for motion/micro-animations; **app-style mobile** experience (§5.1, §10.1).
- Follow the `sesource-link.txt` references for motion confidence & layout rhythm.
- All motion is progressive enhancement and must honour `prefers-reduced-motion`.
- Keep brand green equity; modernise rather than reinvent the identity.
- Every value from a token — no hard-coded colors/spacing in components.
- Mobile-first, WCAG 2.1 AA, semantic, fast. No empty/placeholder media ships.
- Fix all known content errors (typos, mismatched copy, address conflict, broken links).
- Update this file as decisions are finalised; it remains the source of truth.
