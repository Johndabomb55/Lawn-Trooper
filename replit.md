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
- **Month-to-Month**: No complimentary months, 15% flexibility premium over 1-year rate
- **1-Year Commitment**: Commitment Bonus +1 complimentary month (Save More badge)
- **2-Year Commitment**: Commitment Bonus +2 complimentary months (Best Value badge)
- **Payment Options**: Monthly or Pay in Full

#### 25-Year Birthday Bonus (Phased Enrollment Bonus)
- **Marketing name**: "25-Year Birthday Bonus"
- **Formal name**: "25th Anniversary Enrollment Bonus"
- **Enroll by Jan 25**: +2 bonus months (Tier 1)
- **Enroll by Feb 25**: +1 bonus month (Tier 2)
- **After Feb 25**: +0 bonus months (Bonus concluded - show muted text, don't hide)
- **Important**: Bonus months are NOT doubled by Pay-in-Full
- Configure in `BIRTHDAY_BONUS` in promotions.ts

#### Step 5 Layout (Commitment Step)
Step 5 now shows two clearly separated sections:
1. **Commitment Bonus** section - shows 1Y/2Y base months and PIF doubling
2. **25-Year Birthday Bonus** section - shows phased enrollment schedule with dates

#### Pay-in-Full Option
- **Effect**: Doubles ONLY commitment months (bonus months NOT doubled)
- **Examples (Dec-Jan enrollment)**:
  - 1-Year (monthly): 1 + 2 = 3 complimentary months
  - 1-Year + PIF: 2 + 2 = 4 complimentary months
  - 2-Year (monthly): 2 + 2 = 4 complimentary months
  - 2-Year + PIF: 4 + 2 = 6 complimentary months
- **Max outcomes**: 1-Year PIF + Dec bonus = 4, 2-Year PIF + Dec bonus = 6
- **Note**: Always optional - monthly payment is always available

#### Complimentary Months Definition
**Complimentary months are skipped billing months at the END of your term.**
- Your subscription still ends on your 12-month or 24-month anniversary date
- You receive the same term length—you simply pay for fewer months
- This is NOT extra service beyond the contract end date

#### Operation Price Drop - Loyalty Pricing
Future renewals earn automatic discounts:
- After Year 1: 5% off
- After Year 2: 10% off  
- After Year 3: 15% off

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
- `term`: 'month-to-month', '1-year', or '2-year' (or 'custom' for HOA)
- `payUpfront`: 'true' or 'false'
- `paymentMethod`: 'monthly', 'yearly', or 'pay-in-full'
- `propertyType`: 'residential' or 'hoa'
- `hoaName`, `hoaAcreage`, `hoaUnits`, `hoaNotes`: HOA-specific fields
- `segments`: Array of segment IDs ['renter', 'veteran', 'senior']
- `appliedPromos`: Array of applied promotion titles
- `promoCode`: HOA partner promo code if applied
- `freeMonths`: Total free months earned
- `totalPrice`: Calculated monthly price (or 'custom' for HOA)

#### Property Type Selection (NEW - January 2026)
- Step 1 of wizard asks: "What are you servicing?"
- **Residential**: Standard pricing flow with yard size, plan, add-ons, commitment
- **HOA/Commercial**: Custom quote flow that skips pricing steps
  - Collects: HOA Name, Acreage, Units (optional), Notes (optional)
  - Jumps directly from Step 1 to Step 6 (Contact)
  - Shows "Custom Quote Request" badge instead of free months counter
  - Confirmation shows "Custom Quote Pending" badge
  - All lead data flagged as "custom" for plan/term/pricing fields

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

### Enhanced Landing Page (January 2026)

#### New Sections Added
1. **Plan Overview Section**: Three responsive cards showing Basic Patrol, Premium Patrol, and Executive Command with "Build My Plan" buttons that scroll to wizard
2. **Why Lawn Trooper Section**: Four bullet points (Electric Equipment, 25+ Years Experience, AI-Powered Efficiency, Licensed & Insured)
3. **Testimonials Section**: Six customer reviews with star ratings and verified customer labels
4. **Final CTA**: Bottom call-to-action section before footer

#### Marketing Content Organization
- All marketing copy centralized in `client/src/data/content.ts`
- Includes: HERO_CONTENT, WHY_LAWN_TROOPER, PLAN_SUMMARIES, TESTIMONIALS, TRUST_BAR, FOOTER_CONTENT, CTA_BUTTONS

#### Commitment Option Labels (Updated)
- "Flexible (Month-to-Month)" - 0 free months, 15% premium
- "Save More (1-Year Commitment)" - 1 free month
- "Best Value (2-Year Commitment)" - 2 free months

#### Add-ons UX Improvements
- Selection counter shows basic and premium add-ons selected
- Labels show "X/Y included free" for each category
- Clearer pricing note: "Extra add-ons: $20-40/mo each"

#### Accessibility
- Smooth scrolling enabled via HTML scroll-behavior
- ARIA labels on all sections, cards, and star ratings
- Proper heading hierarchy with aria-labelledby references
- data-testid attributes on all interactive and display elements