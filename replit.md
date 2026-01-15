# Lawn Trooper Website

## Overview

Lawn Trooper is a subscription-based residential lawn care service with a military-inspired brand theme. The website serves as a landing page and quote request system for converting visitors into paying customers. The application features instant pricing calculations, tiered service plans (Basic Patrol, Premium Patrol, Executive Patrol), and optional add-on services with a promotional countdown timer for anniversary sales.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React useState for local state
- **Styling**: Tailwind CSS v4 with custom CSS variables for theming
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Build Tool**: Vite with custom plugins for meta images and Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful endpoints under `/api/*` prefix
- **Email Integration**: Resend API for transactional emails (quote confirmations)
- **Development**: Hot module replacement via Vite middleware

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for shared types between client and server
- **Validation**: Zod schemas with drizzle-zod integration
- **Storage**: Currently uses in-memory storage (`MemStorage`) with database schema ready for PostgreSQL

### Project Structure
```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/ui/  # shadcn/ui components
│   │   ├── data/           # Centralized plan/pricing data
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and query client
│   │   └── pages/          # Route components
├── server/           # Express backend
├── shared/           # Shared types and schemas
└── migrations/       # Drizzle database migrations
```

### Key Design Decisions
1. **Centralized Pricing Data**: All plan definitions, add-ons, and promotional config stored in `client/src/data/plans.ts` to prevent content drift
2. **Path Aliases**: TypeScript path aliases (`@/`, `@shared/`, `@assets/`) for clean imports
3. **Single Page Application**: Client-side routing with server fallback to `index.html`
4. **Conditional Validation**: Quote form validates contact info based on preferred contact method selection

## External Dependencies

### Third-Party Services
- **Resend**: Email delivery service for quote request notifications (connected via Replit Connectors)
- **PostgreSQL**: Database (configured via `DATABASE_URL` environment variable)

### Key npm Packages
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm / drizzle-kit**: Database ORM and migration tooling
- **zod**: Runtime type validation
- **framer-motion**: Animation library
- **react-hook-form**: Form state management
- **lucide-react**: Icon library

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- Resend credentials via Replit Connectors (`REPLIT_CONNECTORS_HOSTNAME`, `REPL_IDENTITY`)

## Recent Changes (January 2026)

### Quote Wizard Gamification & Lead Capture
- **Marketing Config**: Created centralized config file (`client/src/data/marketing.ts`) with feature flags, military ranks, local tips, and social sharing templates
- **Military Rank Progress**: Steps now show rank progression (Recruit → Sergeant → Commander → General) with confetti animations
- **Add-on Validation**: "Mission Ready" indicator ensures users select required add-ons before proceeding
- **Local Tips Banner**: Rotating lawn care tips appear during add-on selection step
- **MissionAccomplished Page**: Confirmation page with quote summary, PDF download, waitlist signup, and social sharing
- **Lead Capture API**: `/api/leads` endpoint with PostgreSQL storage, `/api/waitlist` for early access signups
- **Feature Flags**: All gamification features can be toggled via `FEATURE_FLAGS` with defensive defaults

### Marketing Team Configuration Guide
All marketing content is in `client/src/data/marketing.ts`:
- `FEATURE_FLAGS`: Toggle confetti, waitlist, PDF download, social sharing
- `MILITARY_RANKS`: Customize rank names and icons for each step
- `LOCAL_TIPS`: Add/edit lawn care tips shown during wizard
- `CELEBRATION_MESSAGES`: Update step completion messages
- `SOCIAL_SHARING`: Configure sharing templates for each platform

### Promotions Engine (NEW - January 2026)

#### Overview
The promotions engine is a config-driven stacking discounts system. All promotions are defined in `client/src/data/promotions.ts`.

#### Stacking Rules
- All promotions can stack up to defined caps
- **Max 30% total discount** from percentage-based promos
- **Max 6 free months** from term-based promos
- If cap is exceeded, the last-applied benefit is reduced first

#### Commitment Model (Updated January 2026)
- **1-Year Commitment**: 1 free month (Flexible badge)
- **2-Year Commitment**: 2 free months (Popular badge)
- **3-Year Commitment**: 3 free months (Best Value badge)
- **Pay in Full Bonus**: +1 additional free month for paying upfront

#### Operation Price Drop - Loyalty Pricing
Future renewals earn automatic discounts:
- After Year 1: 5% off
- After Year 2: 10% off  
- After Year 3: 15% off

#### Early Bird Promotions (Time-Decaying)
- Jan 25 - Apr 25, 2026 promotion window
- Starts at 3 free months, decays by 1 month each month
- Configure in `EARLY_BIRD_CONFIG` in promotions.ts

#### HOA Promo Codes
- Promo code input field in Contact step
- Validate codes via `validatePromoCode()` function
- Add partner codes to `HOA_PROMO_CODES` object in promotions.ts

#### HOA Partnership Form (NEW)
- Standalone form on home page at #hoa-partnership section
- Fields: HOA Name, Contact Name, Phone, Email, Notes
- For HOA board members to inquire about partnership benefits

#### Plan Comparison Table (NEW)
- Compact comparison table shown in Step 2 of quote wizard
- Displays: Mowing frequency, Weed Control apps, Bush Trimming frequency, Included Add-ons
- Helps customers quickly compare plan differences at a glance

#### Confirmation Page Enhancements (NEW)
- Displays selected plan, term, and all applied promotions
- Shows "Operation Price Drop" loyalty benefits (5%/10%/15% off on renewal)
- Clear messaging: "No payment required. No obligation. Free Dream Yard Recon."

#### Promotion Types
1. **termFreeMonths**: Free months at end of agreement (commitment rewards)
2. **prepayPercentOff**: Discount for paying upfront (legacy - now uses Pay Full bonus)
3. **segmentPercentOff**: Discount for customer segments (renter/veteran/senior - 5% each)
4. **referralFreeMonth**: Free month for referrals (pending until friend commits)

#### How to Update Promotions
1. Open `client/src/data/promotions.ts`
2. Find the `PROMOTIONS` array
3. Add/edit promotion objects with these fields:
   - `id`: Unique identifier
   - `title`: Display name
   - `shortDescription`: Brief description
   - `type`: One of the promotion types above
   - `stackGroup`: 'freeMonths' or 'percentOff'
   - `value`: Number (months or percent)
   - `eligibility`: Object with conditions (term, payUpfront, segment, hasReferral)
   - `displayOrder`: Sort order for UI
   - `active`: Boolean to enable/disable

#### How to Update Term Options
Edit `CONTRACT_TERMS` array in `client/src/data/promotions.ts`

#### How to Update Segment Discounts
Edit `SEGMENT_OPTIONS` array in `client/src/data/promotions.ts`

#### Trust Messaging
All trust messages are in `TRUST_MESSAGES` object in `client/src/data/promotions.ts`:
- `ctaTop`: Message at top of wizard
- `contactStep`: Message on contact form
- `confirmation`: Message on confirmation page
- `commitment`: "Commit to us..." tagline
- `miguelNote`: Recon scheduling note
- `referralNudge`: Referral encouragement message

#### Lead Capture Fields
The `/api/leads` endpoint now captures:
- All original fields (name, email, phone, address, plan, addons, etc.)
- `term`: '1-year', '2-year', or '3-year'
- `payUpfront`: 'true' or 'false'
- `segments`: Array of segment IDs ['renter', 'veteran', 'senior']
- `appliedPromos`: Array of applied promotion titles
- `promoCode`: HOA partner promo code if applied
- `freeMonths`: Total free months earned
- `totalPrice`: Calculated monthly price

### Streamlined Quote Wizard (NEW - January 2026)

#### Overview
New simplified quote wizard at root URL (`/`) designed for Facebook ad compliance and mobile-first UX. Original full wizard still available at `/full` route.

#### Key Features
- **One Choice Per Screen**: Each step focuses on one decision with big, tappable buttons
- **7-Step Flow**: Welcome → Yard Size → Plan → Add-ons → Commitment → Contact → Complete
- **Info Pop-ups**: Additional details available via info buttons without cluttering the UI
- **Progress Tracking**: Visual progress bar and "Free Months Unlocked" counter
- **Minimal Landing Page**: Wizard-focused design with simple header/footer

#### Route Structure
- `/` - Streamlined wizard with minimal landing page (`simple-home.tsx`)
- `/full` - Original full landing page with multi-step wizard

#### Component Files
- `client/src/components/StreamlinedWizard.tsx` - Main wizard component
- `client/src/pages/simple-home.tsx` - Minimal landing page wrapper

#### Schema Updates
- `address` and `contactMethod` fields now optional in leads schema
- Added `freeMonths` and `promoCode` fields for streamlined wizard submissions