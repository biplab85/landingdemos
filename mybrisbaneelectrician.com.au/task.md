# Task: Rebuild Home Page — My Brisbane Electrician

**Reference site:** https://www.mybrisbaneelectrician.com.au/
**Scope:** Only `index.html` (homepage) — no other pages.
**Font family:** `"Open Sans", sans-serif` (weights 400, 600, 700)
**Stylesheet:** SCSS (modular) — every `.scss` file starts with the designer credit block.
**Images:** All images downloaded from the original site into `/images/`.

---

## 1. Designer / Developer Credit (top of every .scss file)

```scss
// ─────────────────────────────────────────────────────────────
// Designed & developed by
// Biplab Kumar Paul — Web Designer & Developer
// Mobile: 01735 927356
// Email:  biplab.cse.85@gmail.com
// ─────────────────────────────────────────────────────────────
```

---

## 2. Folder Structure

```
mybrisbaneelectrician/
├── index.html
├── task.md
├── css/
│   └── style.css           (compiled from SCSS)
├── scss/
│   ├── style.scss          (master — imports partials)
│   ├── _variables.scss
│   ├── _base.scss
│   ├── _layout.scss
│   ├── _header.scss
│   ├── _navigation.scss
│   ├── _hero.scss
│   ├── _sections.scss
│   ├── _services.scss
│   ├── _cta.scss
│   ├── _footer.scss
│   └── _responsive.scss
├── js/
│   └── main.js             (mobile menu toggle)
└── images/
    ├── my-brisbane-electrician.svg     (logo)
    ├── favicon.png
    ├── hamburger-menu.svg
    ├── girl-with-electric-lamp.jpg     (hero bg)
    ├── domestic-electrical.jpg         (service card 1)
    ├── commercial-electrical.jpg       (service card 2)
    └── renovations-newbuilds.jpg       (service card 3)
```

---

## 3. Brand / Design Tokens

| Token            | Value      |
| ---------------- | ---------- |
| Primary (light)  | `#1b75bb`  |
| Primary (dark)   | `#002564`  |
| Subtitle blue    | `#83b0d3`  |
| Section subtitle | `#8097bc`  |
| Text (body)      | `#404040`  |
| Light gray text  | `#c6c6c6`  |
| Muted gray text  | `#818181`  |
| White            | `#ffffff`  |
| Hero overlay dim | rgba(0,0,0,0.45) |
| Font family      | `"Open Sans", sans-serif` |
| Container max-w  | 1200px     |
| Wide max-w       | 1500px     |

---

## 4. Page Sections (in order)

### 4.1 Header (sticky / standard)
- Left: Logo (SVG)
- Right: Site title + tagline ("We Prioritise Your Satisfaction") + phone CTA `Call 0420 334 559` (tel: link)

### 4.2 Primary Navigation
- Home (active)
- About
- Services (dropdown: Residential Electrical, Commercial Electrical, New Builds & Renovations)
- Contact
- Blog
- Hamburger button on mobile

### 4.3 Hero Cover Section
- Full-width background: `girl-with-electric-lamp.jpg` (1500×500)
- Dark overlay
- H1: **"Honest, Reliable, Affordable Electrical Services Brisbane"**
- H2: "Providing high quality electrical services for residential and commercial properties, renovations and new builds."
- Button (outline): "Click Here To Learn More"

### 4.4 Tagline Heading
- Centered H2: "Honest, Reliable, Affordable Electrical Services Brisbane"

### 4.5 Two-Column Difference + Mission
- Col 1: **Our Difference** — "If you are looking for an efficient, reliable, qualified electrician in Brisbane..." (2 paragraphs)
- Col 2: **Our Mission** — "With years in the business, we have staked our success on client satisfaction..." (with italic quote: *"If you have a job – no matter how big or small – reach out now."*)

### 4.6 Trust CTA Heading
- Centered H2: "We are a trusted, local business, and we provide transparency and affordable prices. [Contact us now](#) to book a visit or to discuss your project requirements."

### 4.7 Three Service Cards
| Card | Image | Button Link |
| ---- | ----- | ----------- |
| Domestic Electrical | `domestic-electrical.jpg` | Residential page |
| Commercial Electrical | `commercial-electrical.jpg` | Commercial page |
| Renovations & New Builds | `renovations-newbuilds.jpg` | Renovations page |

Cards: image on top, full-width dark-blue button below.

### 4.8 Our Services (descriptive copy)
- Centered H2: "Our Services"
- 4 paragraphs (centered):
  1. Air conditioning install/repair
  2. Hot water repair/install
  3. Entertainment system / surround / TV install
  4. Domestic electrical (power points, lighting, wiring, upgrades, appliance install)
- Italic line: *"Call today to learn more about what we can do for you."*
- Outline button: "Get in touch"

### 4.9 Call-to-Action Banner (full-width, light-blue background)
- H2 (centered, white): "Call My Brisbane Electrician"
- Paragraph: "We have the benefit of years in the industry and pride ourselves on being skilled and professional..."
- Outline button (dark-blue): "Call us!"

### 4.10 Footer Widgets (3 columns)
- **Locations Serviced:** North Brisbane / Brisbane City / South Brisbane
- **Services:** Electrical & Lighting Services / Commercial Fit Outs / Maintenance / Air Conditioning Installs / Switchboard Upgrades
- **Contact us:** 0420 334 559 / info@mybrisbaneelectrician.com.au / 27-29 Dunbar Road, Burpengary East, QLD 4505
  - **Credentials:** Licence Number: #91746 / ABN: 82 672 295 733

### 4.11 Site Info
- "Copyright 2022 My Brisbane Electrican. Website by kdesign."

---

## 5. Images to download

| Source URL | Local filename |
| ---------- | -------------- |
| `https://www.mybrisbaneelectrician.com.au/wp-content/uploads/2021/04/my-brisbane-electrician.svg` | `images/my-brisbane-electrician.svg` |
| `https://www.mybrisbaneelectrician.com.au/wp-content/uploads/2022/11/cropped-MBE-Site-Icon-180x180.png` | `images/favicon.png` |
| `https://www.mybrisbaneelectrician.com.au/wp-content/uploads/2022/10/girl-with-electric-lamp.jpg` | `images/girl-with-electric-lamp.jpg` |
| `https://www.mybrisbaneelectrician.com.au/wp-content/uploads/2026/02/MyBrisbaneElectrician-5SKY-1024x683.jpg` | `images/domestic-electrical.jpg` |
| `https://www.mybrisbaneelectrician.com.au/wp-content/uploads/2026/02/IMG_1116-e1771297008471-1024x684.jpg` | `images/commercial-electrical.jpg` |
| `https://www.mybrisbaneelectrician.com.au/wp-content/uploads/2024/04/MyBrisbaneElectrician-19-1024x683.jpg` | `images/renovations-newbuilds.jpg` |
| `https://mbe.kdesign.com.au/wp-content/themes/my-brisbane-electrician/img/hamburger-menu.svg` | `images/hamburger-menu.svg` |

---

## 6. Build steps

1. Create folder structure.
2. Download images.
3. Write SCSS partials with credit comment block at the top of each file.
4. Compile master `scss/style.scss` → `css/style.css`.
5. Write `index.html` linking the CSS and JS, using semantic markup.
6. Write `js/main.js` for hamburger menu toggle + submenu interaction.
7. Verify links to phone (`tel:0420334559`) and email (`mailto:info@mybrisbaneelectrician.com.au`).
8. Responsive breakpoints: 1024px / 768px / 480px.
