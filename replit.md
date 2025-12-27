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