# Database Migration Instructions for MarVoy MVP

## Problem Encountered

Prisma 7.x requires either an adapter or Prisma Accelerate when using connection pooling with Supabase. Since we're using Supabase's built-in pooler, I've generated a raw SQL migration file that you can execute directly in Supabase.

## Solution

I've created `migration.sql` with all 8 database tables and their relationships:

### Tables Created:
1. **Organization** - Multi-tenant organizations with subscription plans
2. **User** - Users with roles (ROOT_ADMIN, ORG_ADMIN, ORG_USER)
3. **Voyage** - Core voyage tracking
4. **PortCall** - Port rotation for each voyage
5. **Cargo** - Shipment details linked to load/discharge ports
6. **CharterParty** - Contract terms and laytime parameters
7. **LaytimeCalculation** - Calculation results (demurrage/despatch)
8. **PortActivity** - SOF (Statement of Facts) events

### Enums Created:
- OrganizationStatus, SubscriptionPlan, UserRole
- VoyageStatus, PortCallStatus, CargoStatus
- CharterPartyType, LaycanType, ActivityType

## How to Apply the Migration

### Option 1: Supabase SQL Editor (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/hyykuhwhtzscauezyqpo
2. Click on **SQL Editor** in the left sidebar
3. Click **+ New Query**
4. Copy the entire contents of `migration.sql` from this codespace
5. Paste it into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Wait for all statements to execute (should take 5-10 seconds)
8. You should see success messages for each CREATE statement

### Option 2: Using psql Command Line

```bash
# Get the direct connection string (not pooler)
# Format: postgresql://postgres:[YOUR-PASSWORD]@db.hyykuhwhtzscauezyqpo.supabase.co:5432/postgres

# Execute the migration
psql "YOUR_DIRECT_CONNECTION_STRING" < migration.sql
```

### Option 3: Supabase CLI

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Link to your project
supabase link --project-ref hyykuhwhtzscauezyqpo

# Apply migration
supabase db push
```

## Verify Migration Success

After running the migration, verify in Supabase Dashboard:

1. Go to **Table Editor**
2. You should see all 8 tables listed
3. Click on each table to see the columns and structure
4. Check that Row Level Security is enabled (shield icon)

## What's Next

Once the tables are created in Supabase:

1. ✅ The authentication system will work (uses Supabase Auth)
2. ✅ We can start building the Voyage Management UI
3. ✅ We can create API routes for CRUD operations
4. ✅ The Prisma Client will be able to query the database

## Troubleshooting

### If you get "type already exists" errors:
This means some enum types were created in a previous attempt. You can either:
- Drop them first: `DROP TYPE IF EXISTS "OrganizationStatus" CASCADE;` (repeat for each enum)
- Or skip the enum creation lines and just run the table creation

### If you get foreign key errors:
Make sure tables are created in order (they are in the migration.sql file)

### If Row Level Security causes issues:
You can disable RLS temporarily for testing:
```sql
ALTER TABLE "TableName" DISABLE ROW LEVEL SECURITY;
```

## Current Status

- ✅ Prisma schema defined
- ✅ Migration SQL generated 
- ⏳ **WAITING: You need to run the SQL in Supabase Dashboard**
- ⏳ Once done, I'll continue with Phase 4: Voyage Management UI

## File Locations

- Prisma Schema: `prisma/schema.prisma`
- Migration SQL: `migration.sql` (in project root)
- Environment: `.env.local` (has your Supabase credentials)

---

**Please run the migration and let me know when it's complete so we can continue!**
