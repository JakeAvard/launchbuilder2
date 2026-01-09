# Tither Admin Web App

## Overview

Tither is a Catholic tithing platform that enables parishes, dioceses, and Catholic organizations to set up their giving pages and accept donations online. The primary goal for v1 is to guide admins through onboarding (organization creation, KYC verification, bank account connection) and provide a dashboard to manage donations and donors.

The application follows a wizard-style onboarding flow inspired by GoFundMe, with a clean, whitespace-heavy design that prioritizes clarity for non-technical users. Core functionality includes donation tracking, donor management, customizable giving pages, and payment processing via "Tither Pay."

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens (CSS variables for theming)
- **Build Tool**: Vite with React plugin

**Design System Choices**:
- Typography: Inter (body) and DM Sans (headings) via Google Fonts
- Color scheme uses HSL CSS variables for light/dark mode support
- Material Design foundation with GoFundMe clarity and Duolingo playfulness
- Custom component examples live in `client/src/components/examples/`

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Style**: RESTful JSON endpoints under `/api/`
- **Build**: esbuild for production bundling with selective dependency bundling

**Route Structure**:
- `/api/organization/:id` - Organization CRUD
- `/api/organization/:id/funds` - Fund management
- `/api/organization/:id/donors` - Donor queries
- `/api/organization/:id/donations` - Donation records and stats
- `/api/onboarding/complete` - Onboarding completion endpoint

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with Zod schema validation
- **Schema Location**: `shared/schema.ts` (shared between frontend and backend)
- **Migrations**: Managed via `drizzle-kit push`

**Core Tables**:
- `organizations` - Parish/org details, verification status, bank connection status
- `funds` - Donation allocation buckets (General Fund, Building Fund, etc.)
- `donors` - Donor profiles with anonymity support
- `donations` - Individual donation records

### Authentication
- Session-based authentication using `express-session`
- Session store: `connect-pg-simple` for PostgreSQL-backed sessions
- Passport.js with local strategy for login

## External Dependencies

### Payment Processing
- **Stripe**: Payment processing integration (dependency present in package.json)
- Processing partner branded as "Tither Pay"
- Deposit timeline: 3-5 business days

### Third-Party Services
- **Google Fonts**: Inter and DM Sans typefaces
- **QR Code Generation**: `qrcode.react` for generating giving page QR codes

### Key NPM Packages
- `drizzle-orm` / `drizzle-zod` - Database ORM and validation
- `@tanstack/react-query` - Data fetching and caching
- `date-fns` - Date formatting utilities
- `wouter` - Client-side routing
- `zod` - Runtime schema validation
- Full shadcn/ui Radix component suite (@radix-ui/*)

## Deployment to Render with PostgreSQL

### Steps to Deploy on Render:

1. **Create PostgreSQL Database on Render**
   - Go to Render Dashboard → New → PostgreSQL
   - Choose a name (e.g., `tither-db`)
   - Select region closest to users
   - Copy the "Internal Database URL" after creation

2. **Create Web Service**
   - Go to Render Dashboard → New → Web Service
   - Connect your GitHub/GitLab repository
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Configure Environment Variables**
   - Add `DATABASE_URL` with your PostgreSQL connection string
   - Add `SESSION_SECRET` with a secure random string
   - Add `NODE_ENV=production`

4. **Custom Domain (tither.us)**
   - In Render Web Service Settings → Custom Domains
   - Add `tither.us` and `www.tither.us`
   - Update DNS records at your registrar:
     - CNAME record pointing to your Render service URL
   - Enable SSL (auto-provisioned by Render)

5. **Run Database Migrations**
   - After deployment, run: `npx drizzle-kit push`
   - This syncs the schema to your PostgreSQL database

### Environment Variables Required:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secret for session encryption
- `NODE_ENV` - Set to `production`

### render.yaml Configuration
The `render.yaml` file in the project root can be used for Infrastructure as Code deployment.