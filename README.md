# MarVoy Laytime Calculator - Complete Project Specification

## Executive Summary

MarVoy is a modern, multi-tenant SaaS platform for maritime laytime, demurrage, and despatch calculations. The platform features three-tier access control (Root Admin, Customer Admin, End Users), comprehensive voyage management, advanced calculation engine supporting reversible terms, proration, and cargo match scenarios, plus complete customer management, billing, and analytics capabilities.

***

## 1. Product Overview

### 1.1 Vision
Build a production-ready laytime calculator that competes with industry leaders (Dataloy, Veson IMOS, Danaos) while being more modern, user-friendly, and cost-effective for shipping operators, charterers, and brokers.

### 1.2 Core Value Propositions
- **Accuracy**: Deterministic calculation engine with comprehensive test coverage
- **Flexibility**: Supports single/multi-cargo, single/multi-CP, reversible terms, proration, cargo match
- **Efficiency**: Single workspace UI showing ports, activities, and cargo laytime in synchronized panels
- **Scalability**: Multi-tenant architecture with organization-level data isolation
- **Compliance**: Audit trails, professional laytime statements, integration-ready APIs

### 1.3 Target Users
- **Shipping Operators**: Manage voyages and calculate laytime
- **Charterers**: Verify demurrage/despatch claims
- **Ship Owners**: Track time usage and financial exposure
- **Brokers**: Provide laytime calculation services to clients

***

## 2. Platform Architecture

### 2.1 Three-Tier Access Model

#### **Tier 1: Root Admin (Platform Owner)**
**Access Level**: Full platform control
**Primary Users**: MarVoy founders/administrators

**Capabilities**:
- Customer Management
  - Create, suspend, delete customer organizations
  - View all customer data across platform
  - Manage customer subscriptions and plans
- Feature Management
  - Enable/disable features per customer
  - Set usage limits (users, calculations, storage)
  - Control access to advanced features (reversible terms, API access, etc.)
- Billing & Revenue
  - View all invoices and payment status
  - Generate invoices manually or via automation
  - Track MRR, ARR, churn metrics
  - Manage payment methods per customer
- Master Data Management
  - Global port database (10,000+ ports worldwide)
  - Standard laytime profiles library (GENCON, NYPE, BPVOY, etc.)
  - Holiday calendars by country/region
  - Currency exchange rates
  - Industry directory (charterers, owners, vessels)
- Analytics & Monitoring
  - Platform usage metrics (DAU, MAU, calculations/day)
  - Customer health scores
  - System performance monitoring
  - Error logs and alerts
- Onboarding Management
  - Trial management (extend, convert, activate)
  - Email campaign templates
  - Customer pipeline tracking

**UI Routes**: `/admin/*`

***

#### **Tier 2: Customer Admin (Organization Administrator)**
**Access Level**: Full control of their organization
**Primary Users**: Company administrators, IT managers

**Capabilities**:
- User Management
  - Invite users via email with role assignment
  - Manage user roles: Admin, Manager, Operator, Viewer
  - Deactivate/reactivate users
  - Reset passwords
  - View audit logs (who did what, when)
- Organization Settings
  - Company profile (name, logo, address, contact)
  - Custom branding (if feature enabled)
  - Default laytime profiles and preferences
  - Default currency and timezone
  - Notification preferences (email alerts, summaries)
- Billing Portal
  - View current subscription plan and features
  - Upgrade/downgrade plan (self-service)
  - View invoices and payment history
  - Update payment method (Stripe integration)
  - Monitor usage vs limits (users, storage, calculations)
- Reports & Analytics
  - Organization-wide usage dashboard
  - Laytime calculations summary
  - Demurrage/despatch trends by vessel, charterer, period
  - User activity reports
  - Export data (CSV, Excel)
- Full Access to Core App
  - Can create and manage all voyages, calculations
  - See all organization data

**UI Routes**: `/org/*`

***

#### **Tier 3: Customer Users (End Users)**
**Access Level**: Restricted based on role
**Primary Users**: Operations staff, laytime analysts, managers, viewers

**Roles & Permissions**:

| Role | Create Voyage | Edit Voyage | Create Calculation | Edit Calculation | Finalize Calculation | Generate Statement | View Only |
|------|--------------|-------------|-------------------|------------------|---------------------|-------------------|-----------|
| **Manager** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Operator** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Viewer** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

**Capabilities**:
- Access to core laytime calculator only
- Create/edit voyages, port calls, cargoes, charter parties
- Perform laytime calculations
- Generate laytime statements
- View data based on permissions (own data or shared data)
- No administrative functions
- No billing access

**UI Routes**: `/app/*`

***

### 2.2 Technology Stack

#### **Frontend**
- **Framework**: Next.js 14 (App Router) with TypeScript 5.3+
- **Styling**: Tailwind CSS 3.4 + shadcn/ui component library
- **State Management**: Zustand (lightweight, modern)
- **Data Fetching**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table (advanced sorting, filtering, pagination)
- **Charts**: Recharts (for analytics dashboards)
- **Date/Time**: date-fns + React Day Picker
- **PDF Generation**: react-pdf or jsPDF (for laytime statements)

#### **Backend**
- **API**: Next.js API Routes + tRPC for end-to-end type safety
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **ORM**: Prisma (type-safe database client with migrations)
- **Authentication**: Supabase Auth with custom JWT claims for roles
- **File Storage**: Supabase Storage (for documents, PDFs)
- **Email**: Resend (3,000 emails/month free) or SendGrid
- **Payments**: Stripe (subscriptions, invoicing, payment methods)

#### **DevOps & Infrastructure**
- **Hosting**: Vercel (frontend + API routes, free tier available)
- **Database**: Supabase (PostgreSQL, free tier: 500MB, 2GB bandwidth)
- **Version Control**: GitHub
- **CI/CD**: Vercel auto-deploy on push to main
- **Monitoring**: Vercel Analytics + Sentry (error tracking)
- **Environment**: .env.local for development, Vercel env vars for production

#### **Testing**
- **Unit Tests**: Vitest (fast, modern test runner)
- **Integration Tests**: Playwright (E2E testing)
- **API Tests**: tRPC testing utilities
- **Calculation Engine Tests**: Comprehensive test suite with 50+ scenarios

***

### 2.3 Project Structure

```
marvoy-mvp/
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions CI/CD
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── migrations/                   # SQL migrations
│   └── seed.ts                       # Seed data (master ports, profiles)
├── public/
│   ├── logo.svg
│   └── fonts/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth routes (login, signup, password reset)
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── reset-password/
│   │   ├── (root-admin)/             # Root Admin dashboard
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Overview dashboard
│   │   │   ├── customers/            # Customer management
│   │   │   ├── features/             # Feature flags
│   │   │   ├── billing/              # Invoicing & revenue
│   │   │   ├── master-data/          # Ports, profiles, calendars
│   │   │   └── analytics/            # Platform analytics
│   │   ├── (customer-admin)/         # Customer Admin dashboard
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Org overview
│   │   │   ├── users/                # User management
│   │   │   ├── settings/             # Company settings
│   │   │   ├── billing/              # Billing portal
│   │   │   └── reports/              # Org reports
│   │   ├── (app)/                    # Core Laytime App
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Dashboard
│   │   │   ├── voyages/              # Voyage CRUD
│   │   │   ├── calculations/         # Laytime calculations
│   │   │   │   ├── [id]/             # Calculation workspace
│   │   │   │   └── new/              # Create calculation
│   │   │   └── statements/           # Generated statements
│   │   └── api/                      # API routes
│   │       ├── trpc/[trpc]/          # tRPC router
│   │       └── webhooks/             # Stripe webhooks
│   ├── components/
│   │   ├── ui/                       # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── select.tsx
│   │   │   └── ...
│   │   ├── layouts/                  # Layout components
│   │   │   ├── root-admin-layout.tsx
│   │   │   ├── customer-admin-layout.tsx
│   │   │   ├── app-layout.tsx
│   │   │   └── sidebar.tsx
│   │   └── features/                 # Feature-specific components
│   │       ├── customers/
│   │       ├── voyages/
│   │       ├── calculations/
│   │       │   ├── port-calls-panel.tsx
│   │       │   ├── port-activities-panel.tsx
│   │       │   ├── cargo-laytime-grid.tsx
│   │       │   └── calculation-summary.tsx
│   │       └── statements/
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Supabase client (browser)
│   │   │   ├── server.ts             # Supabase server client
│   │   │   └── middleware.ts         # Auth middleware
│   │   ├── prisma/
│   │   │   └── client.ts             # Prisma client singleton
│   │   ├── calculations/             # Laytime calculation engine
│   │   │   ├── engine.ts             # Core calculation logic
│   │   │   ├── reversible.ts         # Reversible terms logic
│   │   │   ├── proration.ts          # Proration logic
│   │   │   ├── cargo-match.ts        # Cargo match logic
│   │   │   ├── time-counter.ts       # Time counting utilities
│   │   │   └── validators.ts         # Calculation validators
│   │   ├── trpc/
│   │   │   ├── server.ts             # tRPC server setup
│   │   │   ├── client.ts             # tRPC client
│   │   │   └── routers/              # tRPC routers
│   │   │       ├── customers.ts
│   │   │       ├── users.ts
│   │   │       ├── voyages.ts
│   │   │       ├── calculations.ts
│   │   │       └── ...
│   │   ├── stripe/
│   │   │   ├── client.ts             # Stripe client
│   │   │   └── webhooks.ts           # Webhook handlers
│   │   └── utils/
│   │       ├── date.ts
│   │       ├── currency.ts
│   │       └── validators.ts
│   ├── types/
│   │   ├── database.ts               # Prisma-generated types
│   │   ├── calculations.ts           # Calculation types
│   │   ├── api.ts                    # API request/response types
│   │   └── enums.ts                  # Shared enums
│   └── middleware.ts                 # Next.js middleware (auth)
├── tests/
│   ├── unit/
│   │   └── calculations/             # Calculation engine tests
│   ├── integration/
│   │   └── api/                      # API integration tests
│   └── e2e/
│       └── workflows/                # E2E user flow tests
├── .env.example                      # Environment variables template
├── .env.local                        # Local environment (gitignored)
├── .eslintrc.json
├── .prettierrc
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

***

## 3. Database Schema

### 3.1 Multi-Tenancy & Authentication

#### **organizations**
Primary tenant/customer table. Each customer organization is isolated.

```prisma
model Organization {
  id                String   @id @default(uuid())
  name              String
  slug              String   @unique
  status            OrganizationStatus @default(ACTIVE)
  subscriptionPlan  SubscriptionPlan   @default(STARTER)
  trialEndsAt       DateTime?
  stripeCustomerId  String?  @unique
  
  // Contact & Billing
  contactEmail      String
  contactName       String?
  billingAddress    String?
  phone             String?
  
  // Settings
  defaultCurrency   String   @default("USD")
  defaultTimezone   String   @default("UTC")
  logoUrl           String?
  
  // Metadata
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  users             User[]
  subscriptions     Subscription[]
  invoices          Invoice[]
  features          OrganizationFeature[]
  voyages           Voyage[]
  auditLogs         AuditLog[]
}

enum OrganizationStatus {
  ACTIVE
  SUSPENDED
  CANCELLED
  TRIAL
}

enum SubscriptionPlan {
  STARTER
  PROFESSIONAL
  ENTERPRISE
  CUSTOM
}
```

#### **users**
All platform users (Root Admin, Customer Admin, End Users).

```prisma
model User {
  id              String   @id @default(uuid())
  email           String   @unique
  organizationId  String?  // NULL for root admin
  
  // Profile
  firstName       String?
  lastName        String?
  avatarUrl       String?
  
  // Access Control
  role            UserRole
  status          UserStatus @default(ACTIVE)
  
  // Auth (handled by Supabase, but tracked here)
  supabaseUserId  String   @unique
  lastLoginAt     DateTime?
  
  // Metadata
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
