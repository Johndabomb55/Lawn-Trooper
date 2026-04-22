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
-   **Single-anchor CTA convention**: Every primary CTA across SiteHeader (desktop + mobile), `services.tsx`, `dream-yard-recon.tsx`, `service-area.tsx`, `hoa-partnerships.tsx`, `promotions.tsx`, legacy `home.tsx`, and `call-first.tsx` links to `/#builder`. The `home-v2.tsx` page exposes `id="builder"` on the `SimpleBuilder` section and a `hashchange`-aware effect smooth-scrolls there on mount and on in-page nav. `/quote-wizard` and `/quotewizard` routes redirect to `/#builder` via `ToBuilder` component in `App.tsx`. The convention is enforced by `tests/cta-routing.test.ts` (run via `npx vitest run`), which statically parses each landing page's JSX and verifies every registered CTA wraps a `Button` inside `<a href="/#builder">` or `<Link href="/#builder">` and that no link to `/#builder` is unregistered.
-   **Plan summary copy (customer-facing)**: Standard Patrol — *Bi-weekly mowing + 1 Seasonal Touch per season*. Premium Patrol — *Weekly mowing + 2 Seasonal Touches per season*. Executive Command — *Priority service + 3 Seasonal Touches per season*. Shared line under the plan grid: *"All new plans start with a Yard Reset boost in Month 1."*
-   **Anniversary wording**: All public mentions of the legacy "Birthday Bonus" use the marketing name `"25-Year Anniversary Client Rewards"` (sourced from `BIRTHDAY_BONUS.marketingName` in `client/src/data/promotions.ts`). The internal constant name `BIRTHDAY_BONUS` is kept for back-compat; `ANNIVERSARY_BONUS` is exported as an alias. The expired March 25 enrollment deadline has been removed from all customer-visible copy. `COMMITMENT_COPY.deadlineLine` is now an empty string.
-   **Restricted public copy**: Customer-visible surfaces (home-v2, SimpleBuilder, plan cards, comparison cards, services / HOA / recon / area pages, trust strip) avoid the phrases "year-long contract", "cancel anytime", and "credits". Internal data structures and the legacy `/quote-wizard` page may still use credits — they are not customer-facing primary surfaces.
-   **SimpleBuilder — 4-step flow** (Apr 2026): `SimpleBuilder.tsx` uses a 4-step wizard: Step 1 = yard size, Step 2 = plan selection, Step 3 = seasonal touches + scope + exec+ (all optional), Step 4 = contact info (name*, phone*, email optional, contact preference, notes). Submit fires on step 4. Progress bar shows 4 dots. `canAdvance` for step 3 is always `true`; step 4 requires name ≥ 2 chars and phone ≥ 7 digits. GHL webhook + Resend payload shape unchanged.
-   **What actually happens (90-Day Yard Reset) copy**: Day 1 — Dream Yard Recon (*"Quick property walk + AI / AR plan sent to you"*) → Days 2–30 — The Reset (*"Catch-up trim, mow, edge, beds, cleanup, turf work"*) → Days 31–90 — Dial it in (*"Add seasonal touches, settle into service rhythm, improve curb appeal"*).

### Mission Reports — Asset Status
The `MISSION_REPORTS` array in `client/src/pages/home-v2.tsx` uses real before/after photo pairs, all flagged `real: true`. Slots 1–3 use left/right column crops from the 4-row composite (`C6A0BDF6-...1776781204563.png`) — same real property, different angle. Slot 4 uses the explicit before/after pair from the stone-house composite (`CE43B283-...1776783692387.png`).
-   **Slot 1**: `mission-real-1-before.jpg` / `mission-real-1-after.jpg` — brick house with shutters
-   **Slot 2**: `mission-real-2-before.jpg` / `mission-real-2-after.jpg` — brick 2-story
-   **Slot 3**: `mission-real-3-before.jpg` / `mission-real-3-after.jpg` — brick ranch
-   **Slot 4**: `mission-1-stone-house-before.jpg` / `mission-1-stone-house-after.jpg` — stone house, manicured after (strongest pair)
When John provides matched polished-after photos, replace the corresponding imports and optionally add `videoSrc` + `story` for richer content.

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