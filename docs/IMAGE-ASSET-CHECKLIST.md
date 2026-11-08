# TEKNOVA ’26 — Image Asset Production & Integration Checklist

> **Purpose**: Operational tracker for designing, generating, optimizing, and integrating all required visual assets for TEKNOVA ’26.  
> **Status Lifecycle**: `[ ] Pending` ➔ `[x] Generated` ➔ `[x] Downloaded` ➔ `[x] Optimized` ➔ `[x] Integrated`  

---

## Progress Overview
- **Total Required Assets**: 32 Assets
- **Already Existing & Valid**: 3 Assets (`kmm-college-logo.png`, `TEKNOVA_26_logo_300x300.png`, `participant-pass-template.png`)
- **Needs Generation / Tailoring**: 29 Assets (8 Event Cards, 8 Event Banners, 1 Hero Portrait, 1 About Showcase, 6 Gallery Assets, 5 Category Badges, 3 SEO/Favicon items)

---

## 1. Brand & Institutional Identity

| Asset ID | Asset Name & Description | Target Path | Target Dimensions | Format | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `ASSET-LOGO-01` | KMM College Primary Header Logo | `public/images/brand/kmm-college-logo.png` | 1024 × 375 px (or SVG) | PNG/SVG | `[x] Existing` | Clean transparent background recommended |
| `ASSET-LOGO-02` | TEKNOVA ’26 Brand Crest | `public/images/brand/teknova-logo.svg` | 300 × 300 px | SVG/PNG | `[x] Existing` | Current PNG in use; vector SVG recommended |
| `ASSET-LOGO-03` | KMM College Footer Logo Card | `public/images/brand/kmm-college-logo.png` | 1024 × 375 px | PNG | `[x] Existing` | High contrast for dark footer backdrop |
| `ASSET-LOGO-04` | Department of MCA Seal / Emblem | `public/images/brand/department-mca-seal.svg` | 200 × 200 px | SVG | `[ ] Pending` | Institutional accreditation seal |

---

## 2. Hero & Core Sections

| Asset ID | Asset Name & Description | Target Path | Target Dimensions | Format | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `ASSET-HERO-01` | **Hero Showcase Card Key Visual** | `public/images/hero/hero-key-visual-portrait.webp` | **900 × 1200 px (3:4)** | WebP | `[ ] Pending` | **Critical fix**: Replaces 3:2 landscape poster that gets cropped |
| `ASSET-ABT-01` | MCA Department & Tech Genesis Banner | `public/images/about/mca-department-showcase.webp` | **1024 × 768 px (4:3)** | WebP | `[ ] Pending` | Replaces `TEKNOVA_26_525x328.jpg` to fit container ratio |

---

## 3. Official Tournament Cards (`EventCard.tsx` — 16:9 Display)

| Asset ID | Event Name | Target Path | Target Dimensions | Format | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `ASSET-EVT-IDEATEK-CRD` | IDEATEK Thumbnail | `public/images/events/thumbnails/ideatek-card.webp` | 800 × 450 px | WebP | `[ ] Pending` | AI Brain, ideation, 48hr hackathon theme |
| `ASSET-EVT-MIRROR-CRD` | MIRROR MASTERS Thumbnail | `public/images/events/thumbnails/mirror-masters-card.webp` | 800 × 450 px | WebP | `[ ] Pending` | Dual screen replica, cyberpunk UI mockup |
| `ASSET-EVT-BLIND-CRD` | BLIND CODING Thumbnail | `public/images/events/thumbnails/blind-coding-card.webp` | 800 × 450 px | WebP | `[ ] Pending` | Dark terminal, glowing code, keyboard keycaps |
| `ASSET-EVT-ROYALE-CRD` | TEK ROYALE Thumbnail | `public/images/events/thumbnails/tek-royale-card.webp` | 800 × 450 px | WebP | `[ ] Pending` | Battle royale airdrop, military combat visor |
| `ASSET-EVT-ECLASH-CRD` | TEKNOVA E-CLASH Thumbnail | `public/images/events/thumbnails/teknova-e-clash-card.webp` | 800 × 450 px | WebP | `[ ] Pending` | Neon stadium, cyber soccer player, e-football |
| `ASSET-EVT-SPHERE-CRD` | TEKSPHERE Thumbnail | `public/images/events/thumbnails/teksphere-card.webp` | 800 × 450 px | WebP | `[ ] Pending` | IoT hardware, robotics workbench, AI sphere |
| `ASSET-EVT-TONIQ-CRD` | TEKTONIQ Thumbnail | `public/images/events/thumbnails/tektoniq-card.webp` | 800 × 450 px | WebP | `[ ] Pending` | Tech quiz buzzer, electric arcs, binary brain |
| `ASSET-EVT-BLITZ-CRD` | BEAT BLITZ Thumbnail | `public/images/events/thumbnails/beat-blitz-card.webp` | 800 × 450 px | WebP | `[ ] Pending` | Neon dancer silhouette, audio waveform equalizer |

---

## 4. Event Header Panoramic Banners (`[id]/page.tsx` — 3:1 Banner Display)

| Asset ID | Event Name | Target Path | Target Dimensions | Format | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `ASSET-EVT-IDEATEK-BNR` | IDEATEK Banner | `public/images/events/banners/ideatek-banner.webp` | 1920 × 640 px | WebP | `[ ] Pending` | Panoramic ideation lab atmosphere |
| `ASSET-EVT-MIRROR-BNR` | MIRROR MASTERS Banner | `public/images/events/banners/mirror-masters-banner.webp` | 1920 × 640 px | WebP | `[ ] Pending` | Panoramic web developer studio workstation |
| `ASSET-EVT-BLIND-BNR` | BLIND CODING Banner | `public/images/events/banners/blind-coding-banner.webp` | 1920 × 640 px | WebP | `[ ] Pending` | Panoramic hacker laboratory stream |
| `ASSET-EVT-ROYALE-BNR` | TEK ROYALE Banner | `public/images/events/banners/tek-royale-banner.webp` | 1920 × 640 px | WebP | `[ ] Pending` | Panoramic dystopian combat terrain |
| `ASSET-EVT-ECLASH-BNR` | TEKNOVA E-CLASH Banner | `public/images/events/banners/teknova-e-clash-banner.webp` | 1920 × 640 px | WebP | `[ ] Pending` | Panoramic holographic esports stadium |
| `ASSET-EVT-SPHERE-BNR` | TEKSPHERE Banner | `public/images/events/banners/teksphere-banner.webp` | 1920 × 640 px | WebP | `[ ] Pending` | Panoramic tech expo showroom floor |
| `ASSET-EVT-TONIQ-BNR` | TEKTONIQ Banner | `public/images/events/banners/tektoniq-banner.webp` | 1920 × 640 px | WebP | `[ ] Pending` | Panoramic quiz arena stage with buzzer pods |
| `ASSET-EVT-BLITZ-BNR` | BEAT BLITZ Banner | `public/images/events/banners/beat-blitz-banner.webp` | 1920 × 640 px | WebP | `[ ] Pending` | Panoramic festival amphitheatre concert stage |

---

## 5. Concept & Identity Gallery (`GalleryPreview.tsx`)

| Asset ID | Slot & Layout | Target Path | Target Dimensions | Format | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `ASSET-GAL-01` | Slot 1 (Ultrawide Span) | `public/images/gallery/gallery-01-arena-wide.webp` | **1680 × 720 px (21:9)** | WebP | `[ ] Pending` | Replaces vertically clipped 3:2 poster |
| `ASSET-GAL-02` | Slot 2 (Standard Grid) | `public/images/gallery/gallery-02-poster.webp` | 800 × 600 px (4:3) | WebP | `[ ] Pending` | High-voltage neon typography concept |
| `ASSET-GAL-03` | Slot 3 (Standard Grid) | `public/images/gallery/gallery-03-gaming.webp` | 800 × 600 px (4:3) | WebP | `[ ] Pending` | Console & gaming arena ambient render |
| `ASSET-GAL-04` | Slot 4 (Ultrawide Span) | `public/images/gallery/gallery-04-portal-wide.webp` | **1680 × 720 px (21:9)** | WebP | `[ ] Pending` | Replaces `TEKNOVA_ Neon Portal of Possibility.png` |
| `ASSET-GAL-05` | Slot 5 (Standard Grid) | `public/images/gallery/gallery-05-cyberpunk.webp` | 800 × 600 px (4:3) | WebP | `[ ] Pending` | Cyberpunk AI circuits & data flow |
| `ASSET-GAL-06` | Slot 6 (Standard Grid) | `public/images/gallery/gallery-06-campus.webp` | 800 × 600 px (4:3) | WebP | `[ ] Pending` | Campus innovation center & MCA dept vibes |

---

## 6. Discipline Badges & Emblems (`EventCategories.tsx`)

| Asset ID | Category | Target Path | Target Dimensions | Format | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `ASSET-CAT-TECH` | Technical Discipline | `public/images/categories/category-technical.svg` | 200 × 200 px (1:1) | SVG | `[ ] Pending` | Stylized neon CPU / Code Emblem |
| `ASSET-CAT-GAME` | Gaming Discipline | `public/images/categories/category-gaming.svg` | 200 × 200 px (1:1) | SVG | `[ ] Pending` | Stylized cyber gamepad / esports crest |
| `ASSET-CAT-FLAG` | Flagship Discipline | `public/images/categories/category-flagship.svg` | 200 × 200 px (1:1) | SVG | `[ ] Pending` | Ideathon innovation star / torch |
| `ASSET-CAT-CULT` | Cultural Discipline | `public/images/categories/category-cultural.svg` | 200 × 200 px (1:1) | SVG | `[ ] Pending` | Music / dance frequency rhythm badge |
| `ASSET-CAT-EXPO` | Exhibition Discipline | `public/images/categories/category-exhibition.svg` | 200 × 200 px (1:1) | SVG | `[ ] Pending` | Hardware / IoT hologram cube |

---

## 7. Accreditation & Participant Pass

| Asset ID | Asset Name | Target Path | Exact Code Dimensions | Format | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `ASSET-PASS-01` | Official Landscape Pass Template | `public/images/passes/participant-pass-template.png` | **1024 × 682 px** | PNG | `[x] Existing` | Hardcoded coordinates in `ParticipantPass.tsx` |
| `ASSET-PASS-02` | Mobile Vertical Pass Logo | `public/images/brand/kmm-college-logo.png` | 260 × 70 px (Drawn on 1080×1620) | PNG | `[x] Existing` | Handled via canvas `drawImage` |
| `ASSET-PASS-03` | Receipt Verified Accreditation Stamp | `public/images/passes/official-verified-stamp.png` | 160 × 160 px | PNG (Transp.) | `[ ] Pending` | Adds official watermark to `/lookup` receipt |

---

## 8. SEO, Social Graph & Web App Favicons

| Asset ID | Target Tag / Usage | Target Path | Target Dimensions | Format | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `ASSET-SEO-01` | Open Graph Social Preview | `public/images/og/og-teknova-2026.jpg` | **1200 × 630 px (1.91:1)** | JPG | `[ ] Pending` | For WhatsApp, LinkedIn, Discord preview cards |
| `ASSET-SEO-02` | Twitter / X Summary Card | `public/images/og/twitter-teknova-2026.jpg` | **1200 × 630 px (1.91:1)** | JPG | `[ ] Pending` | Twitter card metadata |
| `ASSET-ICO-01` | Browser Tab Favicon | `public/favicon.ico` & `public/icon.png` | 32 × 32 px & 48 × 48 px | ICO/PNG | `[ ] Pending` | Replaces Next.js default icon |
| `ASSET-ICO-02` | iOS Apple Touch Icon | `public/apple-icon.png` | **180 × 180 px** | PNG | `[ ] Pending` | Apple Home Screen icon |
| `ASSET-ICO-03` | PWA Android Manifest Icons | `public/icon-192x192.png` & `public/icon-512x512.png` | 192 × 192 & 512 × 512 px | PNG | `[ ] Pending` | PWA installation support |

---

## 9. Cleanup & Removal of Redundant Assets

- [ ] Delete `public/images/Neon TEKNOVA’26 Tech Fest Poster.png` (Duplicate)
- [ ] Delete `public/images/Teknova ’26 Neon Tech Fest Poster.png` (Duplicate)
- [ ] Delete `public/images/TEKNOVA ’26_ Neon Tech Fest 1.png` (Duplicate)
- [ ] Delete `public/images/TEKNOVA ’26_ Neon Tech Fest.png` (Duplicate)
- [ ] Move unreferenced `Neon TEKNOVA Admin Portal.png` to archive
- [ ] Move unreferenced `TekNova Neon Payment Dashboard.png` to archive
- [ ] Move unreferenced `TEKNOVA Neon Receptionist Workflow.png` to archive
- [ ] Move unreferenced `TEKNOVA 2026 Neon Lucky Draw Ticket.png` to archive

