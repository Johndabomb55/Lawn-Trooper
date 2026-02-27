# Lawn Trooper Website

## Overview
Lawn Trooper is a subscription-based residential lawn care service with a military-inspired brand. The website acts as a landing page and quote request system, aiming to convert visitors into customers. It features instant pricing calculations, tiered service plans (Basic Patrol, Premium Patrol, Executive Patrol), optional add-on services, and a promotional countdown timer. The project's ambition is to create a streamlined, mobile-first user experience for lead generation, incorporating gamification and a robust promotions engine to maximize customer acquisition and retention.

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
1.  **Centralized Pricing & Marketing Data**: All plan definitions, add-ons, promotions, and marketing content are stored in dedicated TypeScript files (`client/src/data/plans.ts`, `client/src/data/marketing.ts`, `client/src/data/promotions.ts`, `client/src/data/content.ts`) to ensure consistency and easy updates.
2.  **Graceful Degradation**: The application is designed to function even without a connected database (using in-memory storage) or email service (skipping emails but capturing leads), ensuring resilience.
3.  **Promotions Engine**: A config-driven stacking discount system defined in `client/src/data/promotions.ts` allows for flexible promotion management, including commitment bonuses, anniversary bonuses, and loyalty pricing.
4.  **Quote Wizard Gamification**: The quote process incorporates military-themed rank progression, "Mission Ready" indicators, and local tips to enhance user engagement.
5.  **Property Type Selection**: The wizard intelligently adapts its flow based on whether the user selects "Residential" (standard pricing) or "HOA/Commercial" (custom quote request).
6.  **Accessibility**: The website adheres to accessibility standards with smooth scrolling, ARIA labels, proper heading hierarchy, and `data-testid` attributes.
7.  **Enhanced Landing Page**: Includes sections for plan overview, testimonials, and trust messaging, with social media embeds (Facebook, Instagram) to boost engagement.

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