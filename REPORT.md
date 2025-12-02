# MarVoy/InMaritime - Complete Product Specification & Roadmap

## Executive Summary

MarVoy (InMaritime) is a comprehensive maritime data and workflow hub that integrates voyage operations, laytime/demurrage calculations, and claims management into a unified platform. The system combines the operational capabilities of Dataloy VMS and Veson IMOS with specialized claims management features inspired by Marcura ClaimsHub, Voyager Portal, and PortLog.

**Vision**: Create a neutral, vendor-agnostic data hub that connects voyage, port call, performance, laytime, and claims data scattered across TMS, email, spreadsheets, and point solutions.

---

## Core Product Pillars

### 1. Multi-Tenant SaaS Platform
- **Three-tier access control**:
  - Root Admin (Platform Owner)
  - Customer Admin (Company Level)
  - End Users (Operators, Managers, Viewers)
- **Organization-level data isolation**
- **Subscription-based pricing** (Starter, Professional, Enterprise)
- **Feature flags per customer**
- **Usage analytics and billing**

### 2. Laytime & Demurrage Calculator
- **Core calculation engine** supporting:
  - Single and multi-cargo voyages
  - Single and multi-CP scenarios
  - Reversible terms
  - Proration logic
  - Cargo Match scenarios
- **Statement of Facts (SOF) management**
- **Professional laytime statements** (PDF generation)
- **Time-bar tracking and alerts**
- **"Once on demurrage, always on demurrage" logic**

### 3. Advanced Workflow & Collaboration

#### **NEW: Quality Control (QC) System**
- **Multi-level approval workflows**:
  - Operator creates calculation
  - Manager/QC person reviews
  - Customer Admin final approval
- **QC checklist templates**
- **Calculation validation rules**
- **Audit trail of all reviews**
- **Role-based QC permissions**

#### **NEW: Messaging & Collaboration**
- **Comment threads** per laytime calculation
- **@mentions and notifications**
- **Clause-specific discussions**
- **File attachments** (SOFs, emails, evidence)
- **Activity timeline** showing all interactions
- **Internal vs external comments**

#### **NEW: Third-Party Validation & Sending**
- **Share laytime calculations** with counterparties
- **Guest access** (view-only or comment-enabled)
- **Email distribution** with secure links
- **External approval workflow**:
  - Send for review
  - Counterparty comments/accepts/rejects
  - Negotiation thread
  - Final agreement
- **Digital signatures** for accepted claims
- **Expiry dates** for shared links

### 4. Version Control & Audit

#### **NEW: Comprehensive Version Tracking**
- **Automatic versioning** on every save
- **Version comparison** (diff view)
- **Rollback capability**
- **Version labels** (Draft, Internal Review, Sent to CP, Agreed, Invoiced)
- **Who changed what when** detailed logs
- **Export any historical version**

### 5. SOF Processing & Automation

#### **NEW: SOF Parser & Auto-Import**
- **Email integration** to receive SOFs automatically
- **OCR and NLP parsing** of SOF documents:
  - Extract port events (Arrival, NOR, Berthed, etc.)
  - Extract timestamps
  - Extract weather/stoppage remarks
  - Confidence scoring
- **Manual review & correction** workflow
- **Templates for common SOF formats**
- **Bulk import** from spreadsheets
- **Integration with PortLog and similar services**

#### **NEW: Master Database for SOF Data**
- **Global port database** (10,000+ ports)
- **Holiday calendars** by port/country
- **Working time definitions** (SHEX, SHINC, WWD, etc.)
- **Historical port performance** data
- **Standard event type taxonomy**
- **Reason code library** (Weather types, Mechanical issues, etc.)
- **Synced across all customers** (admin-managed)

### 6. Contract Management & Auto-Calculation

#### **NEW: Charter Party Library**
- **Store and manage CP documents**
- **Extract laytime clauses** (manual or AI-assisted)
- **Clause templates library**:
  - GENCON, NYPE, BPVOY, etc.
  - Custom templates per customer
- **Auto-calculate feature**:
  - Link CP to voyage
  - System auto-populates laytime rules
  - Auto-calculates as SOF events arrive
  - Real-time demurrage exposure tracking
- **Clause interpretation rules engine**
- **Exception alerts** (unusual clauses)

### 7. Comparison & Benchmarking

#### **NEW: Laytime Comparison Tool**
- **Upload third-party calculations** (PDF, Excel)
- **Side-by-side comparison** with your calculation
- **Highlight differences**:
  - Time discrepancies
  - Deduction differences
  - Rate differences
  - Amount differences
- **Reconciliation workflow**
- **Export comparison report**
- **Historical comparison** (our previous versions vs CP versions)

### 8. Security & Compliance

#### **NEW: Enterprise-Grade Security**
- **GDPR Compliance**:
  - Data encryption at rest and in transit
  - Right to be forgotten
  - Data export capability
  - Consent management
  - Data residency options (EU, US, Asia)
- **SOC 2 Type II** compliance roadmap
- **ISO 27001** certification roadmap
- **Role-based access control (RBAC)**
- **Two-factor authentication (2FA)**
- **IP whitelisting**
- **Audit logging** (every action tracked)
- **Data retention policies**
- **Secure file storage** (encrypted)
- **Session management and timeout**
- **API rate limiting**
- **Penetration testing** (annual)

### 9. AI & Machine Learning

#### **NEW: AI-Powered Features**
- **SOF Intelligence**:
  - Auto-extract events from unstructured SOFs
  - Predict likely deductions based on remarks
  - Flag suspicious or missing data
- **Clause Interpretation Assistant**:
  - AI explains complex clauses in plain language
  - Suggests how to apply unusual terms
- **Predictive Demurrage**:
  - Estimate demurrage risk mid-voyage
  - Recommend actions to minimize exposure
- **Smart Search**:
  - Natural language query across all calculations
  - "Find all voyages where weather delays exceeded 48 hours"
- **Historical Pattern Analysis**:
  - Port performance trends
  - Charterer behavior patterns
  - Common dispute areas
- **Document Classification**:
  - Auto-tag uploaded files (SOF, CP, DA, Invoice, etc.)
  - Extract relevant clauses automatically

---

## InMaritime Data Hub Vision

### Neutral Maritime Data Platform

**Goal**: Become the "single source of truth" for voyage and claims data across the maritime organization.

#### **Core Data Entities** (Extended from current schema):
- Voyages, Vessels, Ports, Port Calls
- Statements of Facts (SOF) + validated SOF events
- Charter Parties, clauses, laytime rules
- Laytime and demurrage claims + line items
- Documents (SOFs, C/Ps, DAs, invoices, correspondence)
- Workflows, tasks, approvals
- Counterparties, companies, contacts
- **NEW**: Performance data (noon reports, weather, bunkers)
- **NEW**: AIS and vessel tracking data
- **NEW**: Port risk scores and benchmarks
- **NEW**: Market data (freight rates, bunker indices)

### Integration Ecosystem

#### **Inbound Integrations** (Data Sources)
1. **Voyage Management Systems**:
   - Dataloy VMS API
   - Veson IMOS API
   - Generic CSV/Excel import
   - Manual entry

2. **Email & Document Channels**:
   - Email parser for SOFs/documents
   - Drag-and-drop file upload
   - Cloud storage connectors (Google Drive, Dropbox)

3. **External Data Providers**:
   - AIS data (vessel positions)
   - Weather services
   - Port restriction databases
   - Bunker price indices
   - PortLog risk scores

4. **Accounting/ERP Systems**:
   - Export to invoicing systems
   - Integration with AP/AR

#### **Outbound Integrations** (Data Consumers)
1. **Claims Platforms**:
   - Push final claims to Marcura ClaimsHub
   - Export to customer's internal systems

2. **Business Intelligence**:
   - Data lake export (CSV, Parquet)
   - Power BI / Tableau connectors
   - Custom API queries

3. **Communication**:
   - Email notifications
   - Slack/Teams webhooks
   - SMS alerts (time-bar approaching)

### REST API v1

**Public API** for all core resources:
- `GET/POST/PUT/DELETE /api/v1/voyages`
- `GET/POST/PUT/DELETE /api/v1/port-calls`
- `GET/POST/PUT/DELETE /api/v1/sofs`
- `GET/POST/PUT/DELETE /api/v1/claims`
- `GET/POST /api/v1/documents`
- `GET/POST /api/v1/workflows`
- `POST /api/v1/webhooks` (event subscriptions)
- `GET /api/v1/analytics/*` (aggregated KPIs)

**Webhooks** for key events:
- `sof.received`
- `sof.validated`
- `laytime.recalculated`
- `claim.submitted_for_review`
- `claim.approved`
- `time_bar.approaching`
- `counterparty.commented`
- `version.created`

---

## Technical Architecture

### Tech Stack (Current Implementation)
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes + tRPC
- **Database**: Supabase PostgreSQL + Prisma ORM
- **Authentication**: Supabase Auth with JWT claims
- **File Storage**: Supabase Storage
- **Hosting**: Vercel (frontend), Supabase (database)
- **Email**: Resend / SendGrid
- **Payments**: Stripe (subscriptions)

### Future Tech Additions
- **AI/ML**: OpenAI API, LangChain (document parsing, clause interpretation)
- **OCR**: Tesseract, Google Vision API
- **Search**: Algolia or Elasticsearch
- **Analytics**: Segment, Mixpanel
- **Monitoring**: Sentry (errors), Vercel Analytics
- **Queue**: BullMQ / Redis (for async processing)
- **Cache**: Redis

---

## Database Schema Extensions

### Additional Tables Needed

