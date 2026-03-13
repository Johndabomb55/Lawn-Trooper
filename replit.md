# Lawn Trooper Website

## Overview
Lawn Trooper is a subscription-based residential lawn care service with a military-inspired brand. The website acts as a landing page and quote request system, aiming to convert visitors into customers. It features instant pricing calculations, tiered service plans (Basic Patrol $169, Premium Patrol $299, Executive Command $399), an optional Executive+ upgrade (+$99/mo), Landscape Allowance™ tiers (no dollar values exposed publicly), upgrade conversion (2 Basic → 1 Premium on eligible plans), and a promotional countdown timer (25th Anniversary Sale through March 25, 2026). The company email is John@lawn-trooper.com. The project's ambition is to create a streamlined, mobile-first user experience for lead generation, incorporating gamification and a robust promotions engine to maximize customer acquisition and retention.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
The frontend is built with React 18 and TypeScript, utilizing Wouter for routing and TanStack React Query for server state management. Styling is handled by Tailwind CSS v4 with custom theming, complemented by `shadcn/ui` components based on Radix UI. Form handling uses React Hook Form with Zod validation, and animations are powered by Framer Motion. Vite serves as the build tool. The application features two main entry points: a streamlined wizard at the root URL (`/`) for mobile-first lead capture and a more comprehensive wizard at `/full`.

### Backend
The backend is a Node.js Express.js application written in TypeScript (ESM modules). It exposes RESTful APIs under the `/api/*` prefix and integrates with the Resend API for transactional emails. Development includes hot module replacement via Vite middleware.

### Data Layer
Drizzle ORM is used with PostgreSQL for data persistence. Schema definitions are shared between client and server via `shared/schema.ts`, and Zod schemas are used for validation with `drizzle-zod` integration. The system supports graceful degradation, falling back to in-memory `MemStorage` if a `DATABASE_URL` for PostgreSQL is not provided.

### Project Structure
The project is organized into `client/` for the React application, `server/` for the Express backend, `shared/` for common types and schemas, and `migrations/` for Drizzle database migrations.

### Key Design Decisions
1.  **Centralized Pricing & Marketing Data**: All plan definitions, upgrades, promotions, and marketing content are stored in dedicated TypeScript files (`client/src/data/plans.ts`, `client/src/data/marketing.ts`, `client/src/data/promotions.ts`, `client/src/data/content.ts`) to ensure consistency and easy updates.
2.  **Graceful Degradation**: The application is designed to function even without a connected database (using in-memory storage) or email service (skipping emails but capturing leads), ensuring resilience.
3.  **Promotions Engine**: A simplified config-driven system in `client/src/data/promotions.ts`. Commitment bonuses only (1-year: +1mo, 2-year: +3mo), pay-in-full doubling. No month-to-month, no referral bonus on site. Minimum 12-month terms.
4.  **Quote Wizard Gamification**: The quote process incorporates military-themed rank progression, "Mission Ready" indicators, and local tips to enhance user engagement.
5.  **Property Type Selection**: The wizard intelligently adapts its flow based on whether the user selects "Residential" (standard pricing) or "HOA/Commercial" (custom quote request).
6.  **Accessibility**: The website adheres to accessibility standards with smooth scrolling, ARIA labels, proper heading hierarchy, and `data-testid` attributes.
7.  **Enhanced Landing Page**: Includes sections for plan overview, testimonials, trust messaging, "Why We're Different", "Limited Spots" messaging, and social media embeds (Facebook, Instagram).
8.  **Landscape Allowance™ Tiers**: REMOVED from customer-facing UI (comparison table, plan cards, FAQ, feature lists). Internal config fields still exist but set to null.
9.  **Executive+ Toggle**: Optional +$99/mo upgrade for Executive Command that adds +1 Basic, +1 Premium upgrade, Quarterly Strategy Session, Rapid Response Priority, and enhanced service coverage.
10. **Upgrade Conversion (Swap)**: Basic, Premium, and Executive plans support converting 2 Basic Upgrades → 1 Premium Upgrade. The `getSwapOptions()` function generates swap options for eligible plans.
11. **Dream Yard Recon™**: AI-generated landscape plan included with every plan. Premium/Executive get personalized review with Account Manager.
12. **Step 2 Plan Details Panel**: `PlanDetailsPanel.tsx` renders inline below the selected plan card in Step 3 (Plan Selection) of the Streamlined Wizard. Shows locked features, swappable upgrade slots with live counters, tabbed Basic/Premium upgrade selection, and conversion controls (2B→1P / reverse). Executive+ toggle is embedded in this panel. Selections carry to Step 4 via shared state (`basicAddons`, `premiumAddons`, `swapCount`, `executivePlus`).
13. **No Month-to-Month**: All subscriptions require minimum 12-month commitment. Two options only: 1-Year Subscription and 2-Year Subscription (Best Value). Complimentary months are applied as credits at the end of the agreement term.
14. **Slot Counts (Source of Truth)**: Basic=2B, Premium=3B+1P, Executive=3B+3P, Executive+ adds +1B+1P. Turf Defense only on Executive (7 apps/year).
15. **Company Logo**: Transparent logo at `attached_assets/LT_TRANSPARENT_LOGO_1772295732190.png`, imported via `@assets` alias.
16. **AI Yard Designer UX**: The quote wizard includes an "AI Yard Analysis" step (animated loading → Property Scorecard with 5 categories) and a "Transformation Preview" step (bulleted yard outcomes). The wizard is now 9 steps: Welcome → Yard Size → Plan → Upgrades → Yard Analysis → Transformation → Commitment → Contact → Complete.
17. **Unified Terminology**: All customer-facing text uses "Bundled Upgrades" in comparison/selection contexts and "Upgrades" in general references (not "Add-ons"). CTAs consistently say "See My Instant Price" (primary) and "Design Your Lawn Plan" (secondary). Wizard header says "See Your Instant Price". Submit button says "See My Instant Price".
18. **Plan Badges**: Premium cards show "Most Popular" badge, Executive cards show "Best Value" badge. Purely presentational. **Founder's Birthday Bonus** badges on each plan card: Basic/Premium get +1 Basic Upgrade, Executive gets +1 Premium Upgrade.
19. **Value Meter (Property Care Level)**: Each plan card shows "Property Care Level" progress bar (Basic=45% "Essential Care", Premium=75% "Complete Care", Executive=100% "Total Care") with descriptive text.
20. **Support Level Progression**: Basic = Standard support, Premium = Priority support, Executive = Dedicated account manager. Shown in comparison table and consistent across FAQ and plan features.
21. **Company Phone**: 256-795-2949 — displayed in footer, HOA form placeholder, and simple-home header.
22. **Plan Section Headings**: "Choose the Best Fit for Your Yard" used in wizard plan steps. Trust line ("Trusted by North Alabama homeowners for 25+ years") above plans. One-stop-shop messaging near plan cards.
23. **Comparison Table Order**: Shared features first (edging/trimming, weed control, service photos, Dream Yard Recon, fall leaf control), then differentiating features (mowing frequency, off-season, lawn treatments, property care level, support, bundled upgrades), then Executive-only features (turf guarantee, storm priority).
34. **Upgrade Examples Accordion**: Both wizards show a "View upgrade examples" accordion below plan cards with Basic and Premium upgrade category examples. Clearly labeled as examples only — customer chooses in the next step.
35. **Simplified Plan Cards**: Plan cards show "Includes X Basic Bundled Upgrades" / "Includes X Premium Bundled Upgrades" counts instead of listing specific pre-selected upgrades. No "Swap in next step" text.
36. **Softer Upgrade Instructions**: Upgrade step says "Choose your X bundled upgrades" instead of "Select exactly X to proceed".
24. **Dream Yard Recon™**: All plans show "AI-generated plan + personalized review" in comparison table.
25. **Fall Leaf Control**: Added to comparison table — Basic/Premium: Bi-weekly, Executive: Bi-weekly priority cleanup.
26. **Lawn Treatment Applications**: Basic=2, Premium=4, Executive=7 — shown with "Applications" label in comparison table.
27. **Upgrade Details Accordion**: Every upgrade in both wizards (MultiStep and Streamlined) has a tappable "View details" accordion showing What/When/Why, powered by centralized metadata in `client/src/data/upgradeDetails.ts`.
31. **Plan Selection Visual State**: Selected plan cards show a "Selected" pill badge (checkmark + text), stronger border/ring effects, and elevated shadow. Applied consistently across both wizards.
32. **Sticky Summary Footer**: Both quote wizards have a sticky footer that stays visible while scrolling, showing selected plan name, yard size, current monthly price, and a Continue button. Critical for mobile usability.
33. **Plan Image Card CTAs**: Each plan image card on the landing page includes a "See My Instant Price →" link that scrolls to the quote wizard, plus plan name, starting price, and value label (Essential Care / Most Popular / Total Care).
28. **Neighborhood Launch Offer**: Shown on the final quote page. "Invite Your Neighbors" button copies URL with `?ref=neighbor` param.
29. **Robot Mowing Waitlist**: "Coming Soon: Smart Robot Mowing" teaser on final quote page with email signup form posting to `/api/waitlist`.
30. **Anniversary Promo Banner**: Dismissible `PromoBanner` component showing "Anniversary Launch Special — ends March 25" with consistent copy across wizard and landing page.

## External Dependencies

### Third-Party Services
-   **Resend**: For sending transactional emails, integrated via Replit Connectors.
-   **PostgreSQL**: The primary database, configured via `DATABASE_URL`.
-   **Facebook Page Plugin**: Integrated for displaying the Lawn Trooper Facebook page.

### Key npm Packages
-   `@tanstack/react-query`: Server state management.
-   `drizzle-orm` / `drizzle-kit`: ORM and migration tools for PostgreSQL.
-   `zod`: Runtime type validation.
-   `framer-motion`: Animation library.
-   `react-hook-form`: Form management.
-   `lucide-react`: Icon library.
-   `tailwindcss`: CSS framework.
-   `shadcn/ui`: UI component library.

### Environment Variables
-   `DATABASE_URL`: Connection string for PostgreSQL.
-   Resend credentials are managed via Replit Connectors.
