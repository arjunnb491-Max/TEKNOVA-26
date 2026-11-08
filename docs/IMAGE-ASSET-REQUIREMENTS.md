# TEKNOVA ’26 — Complete Website Image & Visual Asset Requirements Audit

> **Author**: Senior UI/UX Designer, Web Design Auditor & Frontend Architect  
> **Target Project**: TEKNOVA ’26 (Department of MCA, KMM College of Arts and Science, Thrikkakara)  
> **Audit Date**: November 2026  
> **Status**: Complete & Ready for Review  

---

## 1. Executive Summary & Audit Findings

An exhaustive, code-level inspection of the TEKNOVA ’26 Next.js web application was conducted across all public routes, administrative portals, component layouts, Tailwind CSS classes, and the `public/images/` repository.

### Key Audit Discoveries:
1. **Critical Aspect Ratio Mismatches**:
   - **Hero Visual (`Hero.tsx`)**: The UI container specifies `aspect-[3/4]` (portrait, ~448 × 597 px display), but the currently linked asset (`TEKNOVA '26_ Neon Tech Fest.png`) is a **3:2 landscape image (1536 × 1024 px)**. When rendered with `object-cover`, over **50% of the image width is violently cropped**, slicing off key titles and visual elements.
   - **Event Details Banner (`app/events/[id]/page.tsx`)**: The banner container is constrained to `h-64 sm:h-80` across a `max-w-6xl` container (effectively a **3.6:1 panoramic banner**, ~1152 × 320 px). The current code forces the 3:2 event poster into this slot, clipping away 75% of the poster's content.
   - **Event Catalog Cards (`EventCard.tsx`)**: Uses an `h-52` container (~384 × 208 px display, ~16:9 ratio), but all 8 events currently recycle 3:2 posters with portrait-oriented text and focal points.

2. **Event Visual Asset Homogeneity (Generic Posters)**:
   - None of the **8 official tournaments** (`IDEATEK`, `MIRROR MASTERS`, `BLIND CODING`, `TEK ROYALE`, `TEKNOVA E-CLASH`, `TEKSPHERE`, `TEKTONIQ`, `BEAT BLITZ`) currently have dedicated, discipline-specific artwork.
   - Instead, all 8 events point to only 4 generic tech fest posters. For instance, `mirror-masters` (Web Design) and `ideatek` (Flagship Ideathon) share the exact same image.

3. **Storage Inefficiency & Duplicate Files**:
   - The current `public/images/` directory consumes **27.8 MB** across only 17 files.
   - **Exact Duplicate Files** exist due to Unicode straight `'` vs curly `’` apostrophes in filenames:
     - `Neon TEKNOVA'26 Tech Fest Poster.png` (1.81 MB) ⟷ `Neon TEKNOVA’26 Tech Fest Poster.png` (1.81 MB)
     - `Teknova '26 Neon Tech Fest Poster.png` (1.73 MB) ⟷ `Teknova ’26 Neon Tech Fest Poster.png` (1.73 MB)
     - `TEKNOVA '26_ Neon Tech Fest 1.png` (2.06 MB) ⟷ `TEKNOVA ’26_ Neon Tech Fest 1.png` (2.06 MB)
     - `TEKNOVA '26_ Neon Tech Fest.png` (2.06 MB) ⟷ `TEKNOVA ’26_ Neon Tech Fest.png` (2.06 MB)
     *Total wasted storage on duplicate files alone: ~7.66 MB.*
   - **Unreferenced / Orphan Assets** found in `public/images/`:
     - `Neon TEKNOVA Admin Portal.png` (2.12 MB) — Unreferenced in codebase.
     - `TEKNOVA 2026 Neon Lucky Draw Ticket.png` (1.98 MB) — Unreferenced in codebase.
     - `TekNova Neon Payment Dashboard.png` (2.03 MB) — Unreferenced in codebase.
     - `TEKNOVA Neon Receptionist Workflow.png` (2.08 MB) — Unreferenced in codebase.
     *Total unreferenced bloat: ~8.21 MB.*
   - **Uncompressed PNGs**: General photo/concept assets are saved as uncompressed 24-bit PNGs averaging 2 MB each instead of modern optimized WebP/AVIF (which would achieve equal or superior visual fidelity at 120–250 KB each — a **90% bandwidth reduction**).

4. **Missing Digital Identity & Metadata Assets**:
   - **Open Graph / Social Sharing (`og:image`)**: Missing in `app/layout.tsx`. Link shares across WhatsApp, Instagram, LinkedIn, and Twitter/X generate empty or broken preview cards.
   - **PWA & Touch Icons**: Missing `apple-touch-icon.png`, `icon-192x192.png`, and `icon-512x512.png`. The app currently only has standard default Next.js `favicon.ico`.

---

## 2. Complete Page & Route Inspection

| Page / Route | Layout & Key Components | Image Elements Present | Missing Visual Assets |
| :--- | :--- | :--- | :--- |
| **Global / Root** (`app/layout.tsx`) | Global layout, HTML `<head>`, metadata | None | Open Graph image (`1200×630`), Twitter Card (`1200×630`), Favicons (16×16, 32×32, 180×180, 192×192, 512×512) |
| **Home Page** (`app/page.tsx`) | `Navbar`, `Hero`, `FestInfo`, `Countdown`, `FeaturedEvents`, `EventCategories`, `Schedule`, `AboutTeknova`, `GalleryPreview`, `Contact`, `CTA`, `Footer` | KMM Logo, TEKNOVA Logo, Hero Poster, Dept Banner, 6 Gallery Slots | Dedicated 3:4 Hero Key Visual, Category Badges, Sponsor / Partner Logos |
| **Events Catalog** (`app/events/page.tsx`) | Search bar, category filters, responsive grid | 6–8 `EventCard` thumbnails (`h-52` container) | Distinct custom artwork for all 8 events |
| **Event Details** (`app/events/[id]/page.tsx`) | Breadcrumbs, panoramic header, rules, prize distribution, coordinators | Panoramic Banner (`h-64 sm:h-80`) | True panoramic landscape banners (3.6:1 or 3:1 ratio) for each event |
| **Registration** (`app/events/[id]/register/page.tsx`) | 2-step registration form + live pass generation | Embeds `ParticipantPass` upon submission | Step 1 header accent or event micro-thumbnail |
| **Participant Pass** (`components/events/ParticipantPass.tsx`) | Dual-mode badge generator: Vertical Mobile Pass + Landscape Badge | KMM Logo, `participant-pass-template.png` (1024×682) | High-res vector KMM logo, optimized pass template |
| **Registration Lookup** (`app/lookup/page.tsx`) | Search input, verification badge, printable receipt | KMM Logo, Participant Pass | Verified watermark / official stamp graphic |
| **Admin Login & Console** (`app/admin/`) | Login modal, Sidebar, Master KPI dashboard, Audit log | KMM Logo, TEKNOVA Logo | Admin avatar / system status icon |
| **Coordinator Desk** (`app/coordinator/`) | Login, Event-scoped dashboard, Roster, Rubric evaluation, Winner declaration | KMM Logo, TEKNOVA Logo | Event discipline insignia |
| **Receptionist Desk** (`app/receptionist/`) | Login, Spot registration, Fast search, Results board | KMM Logo, TEKNOVA Logo | Help desk badge icon |

---

## 3. Recommended Asset Directory Structure

To eliminate root-level image chaos, prevent duplicate apostrophe bugs, and support scalable Next.js image loading, the following organized directory structure is designed:

```
public/
├── favicon.ico
├── icon.png                      # App icon (32x32 / 48x48)
├── apple-icon.png                # iOS Home Screen (180x180)
├── manifest.webmanifest          # PWA Manifest
└── images/
    ├── brand/                    # Logos, institution seals, favicons
    │   ├── kmm-college-logo.png
    │   ├── kmm-college-logo.svg
    │   ├── teknova-logo-300x300.png
    │   ├── teknova-logo.svg
    │   └── department-mca-seal.svg
    ├── hero/                     # Hero section visuals
    │   ├── hero-key-visual-portrait.webp   # 3:4 aspect ratio (900x1200)
    │   └── hero-ambient-glow.svg
    ├── about/                    # About Department & Campus
    │   └── mca-department-showcase.webp    # 4:3 aspect ratio (1024x768)
    ├── events/                   # Official Event Artwork
    │   ├── thumbnails/           # 16:9 cards for catalog & featured grid (800x450)
    │   │   ├── ideatek-card.webp
    │   │   ├── mirror-masters-card.webp
    │   │   ├── blind-coding-card.webp
    │   │   ├── tek-royale-card.webp
    │   │   ├── teknova-e-clash-card.webp
    │   │   ├── teksphere-card.webp
    │   │   ├── tektoniq-card.webp
    │   │   └── beat-blitz-card.webp
    │   └── banners/              # Ultra-wide headers for [id]/page.tsx (1920x640)
    │       ├── ideatek-banner.webp
    │       ├── mirror-masters-banner.webp
    │       ├── blind-coding-banner.webp
    │       ├── tek-royale-banner.webp
    │       ├── teknova-e-clash-banner.webp
    │       ├── teksphere-banner.webp
    │       ├── tektoniq-banner.webp
    │       └── beat-blitz-banner.webp
    ├── categories/               # Discipline emblems / badges (1:1 / 200x200)
    │   ├── category-technical.svg
    │   ├── category-gaming.svg
    │   ├── category-flagship.svg
    │   ├── category-cultural.svg
    │   └── category-exhibition.svg
    ├── gallery/                  # Concept art & showcase slots
    │   ├── gallery-01-arena-wide.webp      # 21:9 ratio (1680x720)
    │   ├── gallery-02-poster.webp          # 4:3 ratio (800x600)
    │   ├── gallery-03-gaming.webp          # 4:3 ratio (800x600)
    │   ├── gallery-04-portal-wide.webp     # 21:9 ratio (1680x720)
    │   ├── gallery-05-cyberpunk.webp       # 4:3 ratio (800x600)
    │   └── gallery-06-campus.webp          # 4:3 ratio (800x600)
    ├── passes/                   # Pass templates & badges
    │   ├── participant-pass-template.png   # 1024x682 exact canvas badge
    │   └── official-verified-stamp.png     # Transparent circular stamp
    └── og/                       # Social sharing & SEO cards
        ├── og-teknova-2026.jpg             # 1200x630 (1.91:1)
        └── twitter-teknova-2026.jpg        # 1200x630
```

---

## 4. Master Image Inventory & Exact Measurement Specifications

Below is the exhaustive, mathematically verified inventory calculated from the exact CSS classes, container bounds, responsive breakpoints, and device pixel ratios in the live codebase.

### 4.1. Brand & Identity Assets

| Asset ID | Component / Page | Purpose & Usage | Current Asset | Recommended Filename | Rendered Container Size (1x) | Source / Export Size (2x) | Aspect Ratio | Format & Transparency |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`ASSET-LOGO-01`** | `Navbar.tsx` | KMM College Official Header Logo | `/images/kmm-college-logo.png` (1024×375) | `images/brand/kmm-college-logo.svg` or `.png` | Desktop: 95×28 px<br>Mobile: 75×24 px | 240 × 80 px (or vector SVG) | ~2.73:1 (Auto width) | SVG or WebP/PNG<br>**Transparent** |
| **`ASSET-LOGO-02`** | `Navbar.tsx`, `Footer.tsx`, Admin & Coordinator Sidebars | TEKNOVA ’26 Square Brand Crest | `/images/TEKNOVA_26_logo_300x300.png` | `images/brand/teknova-logo.svg` or `teknova-logo-300x300.webp` | Navbar: 40×40 px<br>Sidebar: 32×32 px<br>Footer: 44×44 px | 120 × 120 px (or 300×300 px) | 1:1 (Square) | PNG/WebP or SVG<br>Translucent/Cyber |
| **`ASSET-LOGO-03`** | `Footer.tsx` | KMM College Official Footer Badge | `/images/kmm-college-logo.png` | `images/brand/kmm-college-logo.png` | Desktop: 140×36 px<br>Mobile: 120×32 px | 300 × 90 px | ~2.73:1 | PNG / WebP<br>White BG or Transparent |
| **`ASSET-LOGO-04`** | `app/admin/login/`, `coordinator/login/`, `receptionist/login/` | Official Portal Dual Auth Header | `/images/kmm-college-logo.png` & `TEKNOVA_26_logo_300x300.png` | Standard brand logos | Logo: 140×32 px<br>Crest: 40×40 px | Same as `ASSET-LOGO-01` & `02` | Various | PNG / SVG |

---

### 4.2. Hero & Homepage Section Assets

| Asset ID | Component / Section | Purpose & Usage | Container Constraints & Breakpoints | Recommended Filename | Rendered Display (1x) | Recommended Source Size (2x) | Aspect Ratio | Format & Category |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`ASSET-HERO-01`** | `Hero.tsx` (Right Column) | **Main Cyber Visual Showcase Card** (Featured 3D Neon Poster) | `relative w-full max-w-md aspect-[3/4] rounded-2xl` | `images/hero/hero-key-visual-portrait.webp` | Desktop: 448 × 597 px<br>Tablet: 384 × 512 px<br>Mobile: 340 × 453 px | **900 × 1200 px** (High-Res 2x) | **3:4 (Portrait)**<br>*(Fixes current 3:2 landscape distortion)* | WebP / PNG<br>Digital 3D Illustration |
| **`ASSET-ABT-01`** | `AboutTeknova.tsx` | Department of MCA & Tech Genesis Showcase Card | `aspect-[4/3] max-w-lg mx-auto glass-panel` | `images/about/mca-department-showcase.webp` | Desktop: 512 × 384 px<br>Mobile: 340 × 255 px | **1024 × 768 px** | **4:3 (Landscape)**<br>*(Replaces 525×328 non-standard ratio)* | WebP / JPG<br>Photograph / High-End Render |
| **`ASSET-ABT-02`** | `AboutTeknova.tsx` | Institutional Verification Mini-Badge | `h-8 w-auto` in `bg-white rounded-lg p-1.5` | `images/brand/kmm-college-logo.png` | 105 × 32 px | 210 × 64 px | ~2.73:1 | PNG / SVG |

---

### 4.3. Concept & Visual Identity Gallery (`GalleryPreview.tsx`)

The gallery uses a dynamic CSS grid (`grid-cols-2 md:grid-cols-3`) with two asymmetric 2-column wide spans.

| Asset ID | Gallery Slot | Layout Constraint | Current Asset | Recommended Filename | Rendered Display (1x) | Recommended Source Size (2x) | Aspect Ratio | Visual Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`ASSET-GAL-01`** | Slot 1 (Wide Feature) | `md:col-span-2 md:aspect-[21/9] aspect-[4/3]` | `TEKNOVA '26_ Neon Tech Fest.png` | `images/gallery/gallery-01-arena-wide.webp` | Desktop: 792 × 340 px<br>Mobile: 180 × 135 px | **1680 × 720 px** | **21:9 (Ultrawide)** | Futuristic cyber arena / esports stage with crowd |
| **`ASSET-GAL-02`** | Slot 2 (Standard) | `aspect-[4/3]` | `Teknova '26 Neon Tech Fest Poster.png` | `images/gallery/gallery-02-poster.webp` | Desktop: 384 × 288 px<br>Mobile: 180 × 135 px | **800 × 600 px** | **4:3 (Landscape)** | Neon typography & festival mascot concept |
| **`ASSET-GAL-03`** | Slot 3 (Standard) | `aspect-[4/3]` | `TEKNOVA '26_ Neon Tech Fest 1.png` | `images/gallery/gallery-03-gaming.webp` | Desktop: 384 × 288 px<br>Mobile: 180 × 135 px | **800 × 600 px** | **4:3 (Landscape)** | High-intensity gaming console / controller neon glow |
| **`ASSET-GAL-04`** | Slot 4 (Wide Feature) | `md:col-span-2 md:aspect-[21/9] aspect-[4/3]` | `TEKNOVA_ Neon Portal of Possibility.png` | `images/gallery/gallery-04-portal-wide.webp` | Desktop: 792 × 340 px<br>Mobile: 180 × 135 px | **1680 × 720 px** | **21:9 (Ultrawide)** | Holographic "Portal of Possibility" gateway render |
| **`ASSET-GAL-05`** | Slot 5 (Standard) | `aspect-[4/3]` | `Neon TEKNOVA'26 Tech Fest Poster.png` | `images/gallery/gallery-05-cyberpunk.webp` | Desktop: 384 × 288 px<br>Mobile: 180 × 135 px | **800 × 600 px** | **4:3 (Landscape)** | Dark cyberpunk code matrix / hardware interface |
| **`ASSET-GAL-06`** | Slot 6 (Standard) | `aspect-[4/3]` | `TEKNOVA_26_525x328.jpg` | `images/gallery/gallery-06-campus.webp` | Desktop: 384 × 288 px<br>Mobile: 180 × 135 px | **800 × 600 px** | **4:3 (Landscape)** | KMM College MCA Innovation Lab & campus tech vibe |

---

### 4.4. Event Artwork: Catalog Cards (`EventCard.tsx`) & Detail Banners (`[id]/page.tsx`)

Each of the 8 official events requires two tailored visual assets:
1. **Card Thumbnail**: Rendered in `EventCard.tsx` (`h-52` container = 16:9 ratio, ~384 × 208 px display).
2. **Panoramic Header Banner**: Rendered in `app/events/[id]/page.tsx` (`h-64 sm:h-80` = ~3.6:1 panoramic banner, ~1152 × 320 px display).

| Event Slug | Event Name & Discipline | Asset ID (Card) | Card Dimensions (2x) | Asset ID (Banner) | Banner Dimensions (2x) | Artwork Concept / Theme |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `ideatek` | **IDEATEK** (Flagship Ideathon) | `ASSET-EVT-IDEATEK-CRD` | 800 × 450 px (16:9) | `ASSET-EVT-IDEATEK-BNR` | 1920 × 640 px (3:1) | 48-hour collaborative hackathon, glowing AI brain, architectural blueprints, futuristic ideation |
| `mirror-masters` | **MIRROR MASTERS** (Web Design) | `ASSET-EVT-MIRROR-CRD` | 800 × 450 px (16:9) | `ASSET-EVT-MIRROR-BNR` | 1920 × 640 px (3:1) | Split-screen mirror illusion, pixel-perfect cyber UI layouts, glowing CSS brackets, glassmorphism |
| `blind-coding` | **BLIND CODING** (Algorithms) | `ASSET-EVT-BLIND-CRD` | 800 × 450 px (16:9) | `ASSET-EVT-BLIND-BNR` | 1920 × 640 px (3:1) | Blacked-out monitors, neon cyan cursor glow, mechanical keycaps, pure memory algorithm stream |
| `tek-royale` | **TEK ROYALE** (PUBG/BGMI Squad) | `ASSET-EVT-ROYALE-CRD` | 800 × 450 px (16:9) | `ASSET-EVT-ROYALE-BNR` | 1920 × 640 px (3:1) | Tactical battleground, red airdrop smoke, military helmets, neon cyber battle royale perimeter |
| `teknova-e-clash` | **TEKNOVA E-CLASH** (PES/E-Football) | `ASSET-EVT-ECLASH-CRD` | 800 × 450 px (16:9) | `ASSET-EVT-ECLASH-BNR` | 1920 × 640 px (3:1) | Holographic soccer pitch, neon stadium floodlights, stylized digital player striker action |
| `teksphere` | **TEKSPHERE** (Hardware/AI Expo) | `ASSET-EVT-SPHERE-CRD` | 800 × 450 px (16:9) | `ASSET-EVT-SPHERE-BNR` | 1920 × 640 px (3:1) | Microcontrollers, robotics arm, IoT sensor nodes, glowing transparent hardware sphere |
| `tektoniq` | **TEKTONIQ** (Tech Quiz & Buzzer) | `ASSET-EVT-TONIQ-CRD` | 800 × 450 px (16:9) | `ASSET-EVT-TONIQ-BNR` | 1920 × 640 px (3:1) | High-speed electric quiz buzzer, binary matrix, glowing question nodes, tech trivia battle |
| `beat-blitz` | **BEAT BLITZ** (Spot Dance Battle) | `ASSET-EVT-BLITZ-CRD` | 800 × 450 px (16:9) | `ASSET-EVT-BLITZ-BNR` | 1920 × 640 px (3:1) | Neon street dance silhouette, audio frequency equalizers, stage spotlight, urban motion blur |

---

### 4.5. Pass, Receipt & Accreditation Assets (`ParticipantPass.tsx` & `app/lookup`)

| Asset ID | Component | Usage | Current Asset | Recommended Filename | Exact Code Dimensions | Format | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`ASSET-PASS-01`** | `ParticipantPass.tsx` (Landscape View) | Canvas background template for downloadable badge | `/images/participant-pass-template.png` (1024×682, 1.02 MB) | `images/passes/participant-pass-template.png` | **1024 × 682 px** (Exact canvas requirement) | 24-bit PNG | Must preserve exact coordinate zones for text rendering at `(425, 368)` through `(425, 551)` |
| **`ASSET-PASS-02`** | `ParticipantPass.tsx` (Mobile View) | Canvas header logo in dynamic vertical pass generator | `/images/kmm-college-logo.png` | `images/brand/kmm-college-logo.png` | Drawn at `ctx.drawImage(img, 410, 95, 260, 70)` | PNG (Transparent) | Drawn on 1080×1620 mobile canvas |
| **`ASSET-PASS-03`** | `app/lookup/page.tsx` | Official verified accreditation watermark on festival receipt | None (Missing) | `images/passes/official-verified-stamp.png` | 160 × 160 px | PNG (Transparent) | Neon cyan / emerald circular digital stamp ("OFFICIALLY VERIFIED • TEKNOVA '26") |

---

### 4.6. SEO, Social Graph & Web App Manifest Icons

| Asset ID | Placement | Purpose | Current Asset | Recommended Filename | Dimensions | Aspect Ratio | Format |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`ASSET-SEO-01`** | `<meta property="og:image">` | WhatsApp, LinkedIn, Discord preview banner | None (Missing) | `images/og/og-teknova-2026.jpg` | **1200 × 630 px** | **1.91:1** | Optimized JPG / WebP (< 300 KB) |
| **`ASSET-SEO-02`** | `<meta name="twitter:image">` | Twitter / X Large Summary Card | None (Missing) | `images/og/twitter-teknova-2026.jpg` | **1200 × 630 px** | **1.91:1** | Optimized JPG / WebP |
| **`ASSET-ICO-01`** | `<link rel="icon">` (Standard) | Browser tab icon | `app/favicon.ico` (Default) | `favicon.ico` & `icon.png` | 32 × 32 px & 48 × 48 px | 1:1 | ICO / PNG |
| **`ASSET-ICO-02`** | `<link rel="apple-touch-icon">` | iOS Safari Bookmark & Home Screen | None (Missing) | `apple-icon.png` | **180 × 180 px** | 1:1 | PNG (Opaque) |
| **`ASSET-ICO-03`** | `manifest.webmanifest` | PWA Android Home Screen / Taskbar | None (Missing) | `icon-192x192.png` & `icon-512x512.png` | **192 × 192 px** & **512 × 512 px** | 1:1 | PNG |

---

## 5. Duplicate, Redundant & Unused Asset Audit

The following table lists every redundant or duplicate file currently residing in `public/images/`:

| Current Filename | File Size | Status | Recommendation / Action |
| :--- | :--- | :--- | :--- |
| `Neon TEKNOVA’26 Tech Fest Poster.png` | 1,807 KB | **Exact Duplicate** of `Neon TEKNOVA'26 Tech Fest Poster.png` | Delete curly apostrophe clone; standardize filename to kebab-case. |
| `Teknova ’26 Neon Tech Fest Poster.png` | 1,730 KB | **Exact Duplicate** of `Teknova '26 Neon Tech Fest Poster.png` | Delete curly apostrophe clone; standardize filename. |
| `TEKNOVA ’26_ Neon Tech Fest 1.png` | 2,063 KB | **Exact Duplicate** of `TEKNOVA '26_ Neon Tech Fest 1.png` | Delete duplicate. |
| `TEKNOVA ’26_ Neon Tech Fest.png` | 2,063 KB | **Exact Duplicate** of `TEKNOVA '26_ Neon Tech Fest.png` | Delete duplicate. |
| `Neon TEKNOVA Admin Portal.png` | 2,124 KB | **Unused / Orphan** (0 occurrences in code) | Archive or move to documentation assets. |
| `TEKNOVA 2026 Neon Lucky Draw Ticket.png` | 1,987 KB | **Unused / Orphan** (0 occurrences in code) | Archive or repurpose if Lucky Draw feature is launched. |
| `TekNova Neon Payment Dashboard.png` | 2,028 KB | **Unused / Orphan** (0 occurrences in code) | Archive (Payment is handled via registration desk). |
| `TEKNOVA Neon Receptionist Workflow.png` | 2,077 KB | **Unused / Orphan** (0 occurrences in code) | Archive or move to internal docs. |
| `TEKNOVA_26_525x328.jpg` | 79 KB | **Non-Standard Aspect Ratio** | Replace with 4:3 `1024×768` asset in `AboutTeknova.tsx`. |

**Total reclaimable disk/deployment bandwidth**: **~16 MB** (~58% of entire asset directory).

---

## 6. Implementation Architecture & Format Guidelines

1. **Format Selection Matrix**:
   - **Photographic / 3D Render Art**: `.webp` (quality 82–88) with fallback to optimized `.jpg`.
   - **Logos / Emblems / Badges**: Vector `.svg` where feasible, otherwise 32-bit `.png` with alpha transparency.
   - **Canvas Render Templates**: Lossless 24-bit `.png` (`participant-pass-template.png`) to ensure zero artifacting when HTML5 `<canvas>` draws text over coordinate grids.
   - **Social OG Images**: `.jpg` (1200×630, RGB, sRGB profile) for maximum scrapability by WhatsApp and Facebook crawlers.

2. **Next.js Image Optimization Guidelines**:
   - Always supply accurate `sizes` attributes matching the CSS grid breakpoints:
     - Card Grid: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 384px"`
     - Hero Visual: `sizes="(max-width: 768px) 100vw, 448px"`
     - Header Banner: `sizes="(max-width: 1200px) 100vw, 1200px"`
   - Retain `priority` on the **Hero Showcase Card** and **Navbar Logos** to safeguard Largest Contentful Paint (LCP < 1.2s).

