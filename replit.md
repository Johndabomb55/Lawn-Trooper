# Lawn Trooper Website

## Overview
Lawn Trooper is a subscription-based residential lawn care service with a military-inspired brand. The website serves as a landing page and quote request system, designed to convert visitors into customers. Key features include instant pricing calculations, tiered service plans (Basic Patrol, Premium Patrol, Executive Command), an optional Executive+ upgrade, and a promotional countdown timer. The primary goal is to create a streamlined, mobile-first user experience for lead generation, leveraging gamification and a robust promotions engine to maximize customer acquisition and retention. The company email is John@lawn-trooper.com.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
The frontend uses React 18 with TypeScript, Wouter for routing, and TanStack React Query for state management. Styling is handled by Tailwind CSS v4 and `shadcn/ui` (based on Radix UI). Forms are managed with React Hook Form and Zod validation. Framer Motion is used for animations, and Vite for building. The application offers a streamlined wizard at the root URL (`/`) for mobile-first lead capture, with a more comprehensive wizard available at `/full`. The root route `/` features `pages/home-v2.tsx` for a "90-Day Yard Reset" marketing page, embedding a `SimpleBuilder.tsx` component.

### Backend
The backend is an Express.js application written in TypeScript (ESM modules), exposing RESTful APIs under `/api/*`. It integrates with the Resend API for transactional emails.

### Data Layer
Drizzle ORM is used with PostgreSQL for data persistence. Shared schema definitions and Zod validation are implemented. The system supports graceful degradation, falling back to in-memory `MemStorage` if a PostgreSQL database is unavailable.

### Key Design Decisions
-   **Mobile-First Approach**: The homepage features a single-scroll, mobile-first design centered around a simplified 3-step plan builder (Yard Size → Patrol Level → Seasonal Touches).
-   **Centralized Data Management**: Plan definitions, upgrades, promotions, and marketing content are stored in dedicated TypeScript files for consistency.
-   **Promotions Engine**: A config-driven system supports commitment bonuses (e.g., free months for 1 or 2-year subscriptions) and pay-in-full doubling, with a minimum 12-month term.
-   **Gamified Quote Wizard**: The quote process incorporates military-themed elements like rank progression and "Mission Ready" indicators.
-   **Accessibility**: Adherence to accessibility standards including ARIA labels, proper heading hierarchy, and smooth scrolling.
-   **Dynamic Content**: Enhanced landing page sections include plan overviews, testimonials, trust messaging, and social media embeds.
-   **Upgrade System**: Plans include bundled upgrades with a flexible system allowing conversion of 2 Basic upgrades to 1 Premium upgrade. An Executive+ toggle offers additional features.
-   **AI Yard Designer**: The quote wizard includes an "AI Yard Analysis" step and a "Transformation Preview."
-   **Unified Terminology & UI**: Consistent CTAs, plan card badges ("Most Popular," "Best Value"), and a "Value Meter" (Property Care Level) across the site.
-   **Sticky Summary Footer**: A sticky footer in both quote wizards displays selected plan details and pricing, enhancing mobile usability.

### Homepage Builder Conventions (Apr 2026)
-   **Single-anchor CTA convention**: Every primary CTA across SiteHeader (desktop + mobile), `services.tsx`, `dream-yard-recon.tsx`, `service-area.tsx`, `hoa-partnerships.tsx`, `promotions.tsx`, legacy `home.tsx`, and `call-first.tsx` links to `/#builder`. The `home-v2.tsx` page exposes `id="builder"` on the `SimpleBuilder` section and a `hashchange`-aware effect smooth-scrolls there on mount and on in-page nav. Legacy `/quote-wizard` route stays available for back-compat but is not linked from any primary CTA. The convention is enforced by `tests/cta-routing.test.ts` (run via `npx vitest run`), which statically parses each landing page's JSX and verifies every registered CTA wraps a `Button` inside `<a href="/#builder">` or `<Link href="/#builder">` and that no link to `/#builder` is unregistered.
-   **Plan summary copy (customer-facing)**: Standard Patrol — *Bi-weekly mowing + 1 Seasonal Touch per season*. Premium Patrol — *Weekly mowing + 2 Seasonal Touches per season*. Executive Command — *Priority service + 3 Seasonal Touches per season*. Shared line under the plan grid: *"All new plans start with a Yard Reset boost in Month 1."*
-   **Anniversary wording**: All public mentions of the legacy "Birthday Bonus" use the marketing name `"25-Year Anniversary Client Rewards"` (sourced from `BIRTHDAY_BONUS.marketingName` in `client/src/data/promotions.ts`). The internal constant name `BIRTHDAY_BONUS` is kept for back-compat; `ANNIVERSARY_BONUS` is exported as an alias. PromoBanner, plan cards, and mobile comparison cards all read from this single source.
-   **Restricted public copy**: Customer-visible surfaces (home-v2, SimpleBuilder, plan cards, comparison cards, services / HOA / recon / area pages, trust strip) avoid the phrases "year-long contract", "cancel anytime", and "credits". Internal data structures and the legacy `/quote-wizard` page may still use credits — they are not customer-facing primary surfaces.
-   **Seasonal Touches step**: Step 3 of `SimpleBuilder` shows a 9-option visual icon grid (Mulch refresh, Weed control, Flower bed flowers, Trash can cleaning, Shrub trimming, Leaf cleanup, Aeration, Flower bed weeding, Seasonal flower pop). Each touch maps to an existing `ADDON_CATALOG` id via `mapTouchesToAddons`, so the GHL webhook + Resend payloads keep the existing `basicAddons` / `premiumAddons` shape — no schema change.
-   **What actually happens (90-Day Yard Reset) copy**: Day 1 — Dream Yard Recon (*"Quick property walk + AI / AR plan sent to you"*) → Days 2–30 — The Reset (*"Catch-up trim, mow, edge, beds, cleanup, turf work"*) → Days 31–90 — Dial it in (*"Add seasonal touches, settle into service rhythm, improve curb appeal"*).

### Mission Reports — Asset Placeholder List
The `MISSION_REPORTS` array in `client/src/pages/home-v2.tsx` uses the `MissionReport` type with optional `videoSrc` and `story` fields, ready for richer story content as real assets arrive. Pairs flagged `real: false` render a "Sample transformation" badge with the tooltip *"Sample transformation — your results will vary"*. The following slots still need real photo/video pairs from John (replace the corresponding `before` / `after` import in `home-v2.tsx`):
-   **Slot 1 — Overgrown beds → mulch refresh** (`missionBefore1` / `missionAfter1`): real-job (kept). Optional `videoSrc` + `story` for upgrade.
-   **Slot 2 — Patchy lawn → green turf** (`missionBefore2` / `missionAfter2`): currently flagged `Sample transformation`. Needs matched real before/after.
-   **Slot 3 — HOA entry refresh** (`missionBefore3` / `missionAfter3`): currently flagged `Sample transformation`. Needs matched real before/after.
-   **Slot 4 — Manicured garden showcase** (`missionBefore4` / `missionAfter4`): currently flagged `Sample transformation`. Needs matched real before/after, ideally with a short walkthrough `videoSrc`.

## External Dependencies

### Third-Party Services
-   **Resend**: For transactional email delivery.
-   **PostgreSQL**: Primary database for data storage.
-   **Facebook Page Plugin**: For integrating the Lawn Trooper Facebook page.

### Key npm Packages
-   `@tanstack/react-query`
-   `drizzle-orm`, `drizzle-kit`
-   `zod`
-   `framer-motion`
-   `react-hook-form`
-   `lucide-react`
-   `tailwindcss`
-   `shadcn/ui`

### Environment Variables
-   `DATABASE_URL`: PostgreSQL connection string.
-   Resend credentials handled via Replit Connectors.

### Testing
-   Static guard for builder CTAs: `tests/cta-routing.test.ts` (vitest, `npx vitest run`).
-   Runtime browser check that primary CTAs scroll the homepage builder into view: `tests/e2e/cta-scroll.spec.ts` (Playwright, `npx playwright test` or `npm run e2e`). Requires the dev server running on port 5000 (`Start application` workflow). Bundled Chromium is auto-installed via `scripts/post-merge.sh`.