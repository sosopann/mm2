# MM2 Shop - E-Commerce Platform

## Overview

This is a full-stack e-commerce platform for selling digital items from the Roblox game "Murder Mystery 2" (MM2). The platform targets Egyptian customers with local payment methods (Vodafone Cash and InstaPay). It features a dark gaming-themed UI with neon highlights, product catalog with categories and rarity tiers, shopping cart functionality, order management, and an admin dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React Context for cart state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom dark gaming theme (CSS variables for theming)
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with path aliases (@/, @shared/, @assets/)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ES modules)
- **API Design**: RESTful JSON API under /api prefix
- **Authentication**: Replit OpenID Connect (OIDC) with Passport.js, session-based auth stored in PostgreSQL
- **File Uploads**: Multer for receipt image uploads, stored in /uploads directory

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: shared/schema.ts (shared between client and server)
- **Sessions**: connect-pg-simple for session storage in PostgreSQL
- **Product Data**: Currently stored as static TypeScript data in client/src/lib/products.ts (not in database)

### Key Design Patterns
- **Shared Types**: Schema definitions in /shared directory are imported by both frontend and backend
- **Form Validation**: Zod schemas defined in shared/schema.ts, used with react-hook-form on client
- **Storage Interface**: IStorage interface in server/storage.ts abstracts database operations
- **Cart Persistence**: LocalStorage-based cart that syncs with product catalog

### Build System
- **Development**: Vite dev server with HMR, tsx for server
- **Production**: Vite builds client to dist/public, esbuild bundles server to dist/index.cjs
- **Database Migrations**: Drizzle Kit with `db:push` command

## External Dependencies

### Database
- PostgreSQL (required, connection via DATABASE_URL environment variable)
- Drizzle ORM for type-safe queries
- connect-pg-simple for session storage

### Authentication
- Replit OIDC provider (requires ISSUER_URL, REPL_ID, SESSION_SECRET environment variables)
- Passport.js with openid-client strategy

### Payment Integration
- Manual payment methods only (Vodafone Cash, InstaPay)
- No payment gateway integration - customers upload receipt images for verification

### Third-Party Services
- Google Fonts (Orbitron, Rajdhani, Inter, Roboto) for gaming typography
- No external APIs for product data (all hardcoded)

### Key NPM Packages
- @tanstack/react-query: Server state management
- drizzle-orm + drizzle-zod: Database ORM with Zod schema generation
- wouter: Client-side routing
- multer: File upload handling
- memoizee: OIDC config caching