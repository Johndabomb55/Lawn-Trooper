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