# TEKNOVA ’26

**IDEAS TODAY. A BRIGHTER TOMORROW.**  
*Theme: IDEAS • PEOPLE • POSSIBILITIES | MORE THAN JUST TECH*

Official website and event-management system for **TEKNOVA ’26**, organized by the **Department of MCA**, **KMM College of Arts and Science, Thrikkakara**.

- **Fest Dates**: December 2–3, 2026
- **Location**: KMM College of Arts and Science Campus, Thrikkakara, Kochi, Kerala

---

## Overview

TEKNOVA ’26 is a unified web application serving participants, event coordinators, reception desks, and administrators for the premier intercollegiate technical & cultural confluence.

### Key Capabilities
- **Public Fest Hub**: Hero countdown, flagship events catalogue, schedule, guidelines, interactive FAQ, and registration lookup.
- **Participant Registration**: Event registration with team support, receipt generation, reference codes, and status verification.
- **Coordinator Workspace (`/coordinator`)**: Event-specific candidate rosters, attendance check-ins, score inputs, and winner declarations.
- **Reception Desk (`/receptionist`)**: Spot registration desk, centralized participant lookups, and fast badge verification.
- **Admin Command Portal (`/admin`)**: Institutional overview, registration audits, financial summaries, coordinator assignment, and live notifications.

---

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database / Backend**: Supabase (PostgreSQL with in-memory fallback for testing)
- **Icons**: Lucide React

---

## Getting Started

1. Clone or navigate to the repository:
   ```bash
   cd TEKNOVA
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional, fallback in-memory store included):
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment on Vercel

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete TEKNOVA 26 platform"
   git push origin main
   ```
2. Import the repository in [Vercel](https://vercel.com).
3. Ensure the **Framework Preset** is set to **Next.js**.
4. If the project is in a subdirectory, configure the **Root Directory** accordingly.
5. Deploy!