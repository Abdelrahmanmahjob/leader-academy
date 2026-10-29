# Design System: Leader Academy (GymTech Platform)

A comprehensive design specification document extracted from the **Leader Academy** web application and brand presence.

---

## 1. Brand Identity & Overview

- **Brand Name:** Leader Academy (تأسست 2023 / Established 2023)
- **Sector:** Youth Sports, Athletic Performance, Football & Fitness Academy (Diriyah / Riyadh, Saudi Arabia)
- **Audience:** Youth athletes (ages 10–12, 13–15), parents, fitness enthusiasts, and aspiring competitive athletes.
- **Brand Personality:** Athletic, modern, disciplined, energetic, community-oriented, and high-performance.
- **Visual Identity Core:** Dark-mode dominant with high-contrast monochrome tones, clean white typography, and vibrant green accents (evoking football turf and athletic vitality).

---

## 2. Color Palette & Tokens

### Primary & Base Colors

- **Canvas / Background Primary:** `#121212` / `#161616` (Deep Obsidian / Pitch Black)
- **Canvas / Background Secondary (Cards & Panels):** `#1E1E1E` to `#242424` (Subtle elevated dark gray)
- **Card Border / Divider:** `#2D2D2D` to `#383838` (Low-contrast stroke for surface elevation)
- **Text Primary (Headings, Lead Copy):** `#FFFFFF` (Pure White)
- **Text Secondary (Subtitles, Metadata, Body):** `#A1A1AA` to `#BBBBBB` (Muted Zinc)
- **Text Inverse (Inside CTA buttons):** `#111111` (Deep Black)

### Brand Accent & Highlights

- **Pitch Green (WhatsApp / Turf / Highlights):** `#25D366` / `#22C55E`
- **Surface Hover / Highlight:** `#2A2A2A`
- **Button Primary Background:** `#FFFFFF` (Solid White on dark cards)
- **Button Primary Text:** `#111111` (Bold uppercase or semi-bold)
- **Button Secondary / Outline:** Border `#FFFFFF` or `#3A3A3A`, Background `transparent`, Text `#FFFFFF`

---

## 3. Typography & Hierarchy

### Font Families

- **Display / Headers (English):** Modern athletic grotesque or bold geometric sans-serif (e.g., `Montserrat`, `Oswald`, `Barlow Condensed`, or system `Inter` / `system-ui`).
- **Body & Interface:** Clean sans-serif (`Inter`, `Roboto`, `system-ui`).
- **Arabic Typography:** Geometic Arabic sans-serif (`Cairo`, `IBM Plex Sans Arabic`, `Tajawal`).

### Scale & Hierarchy

- **Hero Title / Massive Display:** `48px` – `64px` | Font-weight: `800` or `900` | Uppercase | Letter spacing: `tight` / `-0.02em`
  - _Special visual styling:_ Dual-treatment typography with outlined text paired with solid text (e.g., `"CHOOSE"` in outlined stroke + `"OUR PATH TO FITNESS"` in solid bold white).
- **Section Headers (H2):** `32px` – `40px` | Font-weight: `800` | Uppercase | High contrast
- **Card / Subsection Headers (H3):** `20px` – `24px` | Font-weight: `700`
- **Stat Metrics / Large Numbers:** `36px` – `48px` | Font-weight: `800` | Pure White
- **Body Text:** `14px` – `16px` | Font-weight: `400` / `500` | Line-height: `1.5` | Zinc `#A1A1AA`
- **Buttons & Tags:** `13px` – `15px` | Font-weight: `700` | Uppercase tracking: `+0.05em`

---

## 4. Layout & Grid Architecture

- **Max Container Width:** `max-w-7xl` (standard desktop container)
- **Content Padding:** `16px` (mobile), `24px` (tablet), `32px` – `48px` (desktop)
- **Grid Layouts:**
  - **Hero Stats Ribbon:** 4-column flexible stat grid (`500+ Happy Members`, `30+ Weekly Classes`, `10 Certified Trainers`, `99% Satisfaction`).
  - **Programs / Age Category Cards:** 3-column responsive grid (`10-12`, `13-15`, `Yoga & Flexibility`).
  - **Membership Pricing Plans:** 3-column equal-width pricing card grid.
  - **Value Proposition / Feature List:** 2-column layout (Text feature checklist with tick icons on left, photography showcase on right).
  - **Footer:** 4-column informational layout (Brand info + newsletter + quick links + contact details).

---

## 5. UI Components & Patterns

### 1. Navigation Header

- **Structure:** Floating or sticky dark header (`rgba(18, 18, 18, 0.9)` with backdrop blur).
- **Elements:**
  - Academy Monogram Logo (`L` inside geometric hexagon badge).
  - Primary Navigation Links (`Home`, `About Us`, `Services`, `Classes ▾`, `Trainers`, `Contact`).
  - Localization Switcher (`EN` / `ع` toggle pill).
  - Auth Actions: `LOGIN` (Ghost button with border) & `GET STARTED` (Solid White CTA).

### 2. Hero Section

- **Visuals:** Full-bleed team celebration / youth sports high-energy action photo with dark gradient overlay (`rgba(0,0,0,0.65)` to bottom-heavy gradient).
- **Typography:** Multi-line bold impact heading (`"TRAIN WITH PURPOSE"`).
- **Actions:** Dual button group (`VIEW SERVICES` [Solid White] & `MEET TRAINERS` [Transparent / Glass Outline]).
- **Key Metrics Bar:** Transparent glassmorphic counter strip pinned beneath the hero.

### 3. Program Cards

- **Image Aspect Ratio:** `16:10` or `4:3` showcasing actual academy athletes.
- **Card Background:** Deep charcoal `#1E1E1E` with rounded corners (`12px` – `16px`).
- **Content:** Age range / Program name (`10-12`, `13-15`), concise benefit description, hover zoom or elevate interaction.
- **Carousel Controls:** Subtle pill indicators / dots underneath.

### 4. Pricing & Membership Cards

- **Container:** Dark card `#1C1C1C` with subtle border `#2E2E2E` and rounded radius `16px`.
- **Badge / Category:** Subtle uppercase category pill (`Volume Plan 01a11b8d`).
- **Price Display:**
  - Currency & Amount: `SAR 199`, `SAR 200`, `SAR 201` in massive bold white numerals (`36px`).
  - Cadence: `/ month` in muted gray.
- **Inclusions:** Checklist with circular checked icons (`8 classes`, `Gym access`).
- **CTA:** Full-width rounded button (`Get Started`) in solid high-contrast white.

### 5. Benefits & Trust Section

- **Left Column:** Icon-bulleted items with bold titles and descriptive secondary text:
  - Personalized Training
  - Flexible Schedules
  - Expert Coaches
  - Membership Plans
- **Right Column:** High-quality portrait/coaching photo (Coach working with young child, lush green turf backdrop).

### 6. Call to Action Banner (Pre-Footer)

- **Background:** Wide photographic banner with academy team lineup.
- **Content:** `"READY TO KICK THINGS OFF WITH Leader Academy?"` + `"Reserve your spot today"`.
- **CTA:** Prominent centered `"JOIN NOW"` button.

### 7. Footer & Utility Bar

- **Branding Block:** Logo, mission statement, social media circle icons (Instagram, YouTube, X, TikTok).
- **Newsletter Subscription:** Input field with inline or adjacent `"SUBSCRIBE"` button and privacy checkbox.
- **Contact Details:** Physical location (Startup Hub, Diriyah, Riyadh, Saudi Arabia), email (`info@anansky.net`), and phone (`+966 57 360 9846`).
- **Payment & Compliance Badges:** Credit card badges (Visa, Mastercard, Apple Pay, Mada, Amex) and floating WhatsApp support widget (`#25D366`).

---

## 6. Iconography & Visual Assets

- **Brand Logo:** Distinctive geometric hexagonal shield with bold stylized "L", subtext "LEADER ACADEMY", and foundation year "2023".
- **Icons:** Feather / Lucide style line icons with `1.75px` stroke weight, filled checkmarks inside circles for feature confirmations.
- **Imagery Tone:** Authentic academy training photography, outdoor green football pitch, youthful energy, natural lighting, high dynamic range.
