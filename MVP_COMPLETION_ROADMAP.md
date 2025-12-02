# MarVoy MVP - Completion Roadmap

## ✅ Already Completed (11 commits)

###  Phase 1-4.5: Foundation → Voyage Detail
- Authentication system (login, signup, logout)
- Dashboard with stats
- Voyage list and creation
- Voyage detail page with tabs
- Database schema (8 models, all migrated)
- **~6,000 lines of code**

## 🚧 Remaining Work for Functional MVP

### Critical Path (Must Complete):

#### 1. Port Calls Management (API ✅ | UI ❌)
**Status:** API route created, UI needs implementation

**Files to Create:**
- `app/app/voyages/[id]/components/PortCallsManager.tsx`

**What it needs:**
- Form to add port call (portName, country, sequence, ETA/ETD)
- List of port calls with edit/delete
- Status badges (PLANNED, IN_PROGRESS, COMPLETED)

**Code snippet for PortCallsManager:**
```typescript
// Add this component to the Ports tab
function PortCallsManager({ voyageId }) {
  const [portCalls, setPortCalls] = useState([])
  const [showForm, setShowForm] = useState(false)
  
  const fetchPortCalls = async () => {
    const res = await fetch(`/api/voyages/${voyageId}/port-calls`)
    const data = await res.json()
    setPortCalls(data.portCalls)
  }
  
  const handleSubmit = async (formData) => {
    await fetch(`/api/voyages/${voyageId}/port-calls`, {
      method: 'POST',
      body: JSON.stringify(formData)
    })
    fetchPortCalls()
  }
  
  // Form with: portName, country, sequence, ETA, ETD
  // List with port cards showing all details
}
```

#### 2. Cargo Management (API + UI)
**Files to Create:**
- `app/api/voyages/[voyageId]/cargos/route.ts` (GET, POST)
- `app/app/voyages/[id]/components/CargosManager.tsx`

**API Structure:**
```typescript
POST /api/voyages/[voyageId]/cargos
{
  cargoName: string,
  quantity: number,
  unit: string,
  loadPortId: string,  // From port calls
  dischargePortId: string,
  status: 'PLANNED' | 'LOADING' | ...
}
```

**UI Features:**
- Form: cargo name, quantity, unit dropdown
- Load port dropdown (filtered from port calls)
- Discharge port dropdown
- Table showing all cargos with load→discharge route

#### 3. Charter Party (API + UI)
**Files to Create:**
- `app/api/voyages/[voyageId]/charter-parties/route.ts`
- `app/app/voyages/[id]/components/CharterPartyForm.tsx`

**Critical Fields:**
```typescript
{
  cpNumber: string,
  cpType: 'TIME_CHARTER' | 'VOYAGE_CHARTER',
  charterer: string,
  laycanType: 'FIXED' | 'REVERSIBLE' | 'AVERAGE',  // IMPORTANT!
  laytimeAllowed: number,  // in days/hours
  demurrageRate: number,   // rate per day
  despatchRate: number     // rate per day
}
```

**UI Features:**
- Standard form fields
- **Reversible checkbox** (sets laycanType)
- Rate inputs with currency ($)
- Summary card showing CP details

#### 4. Port Activities / SOF Timeline (API + UI)
**Files to Create:**
- `app/api/port-calls/[portCallId]/activities/route.ts`
- `app/app/voyages/[id]/components/SOFTimeline.tsx`

**Activity Types** (from enum):
- ARRIVAL
- BERTHED
- NOR_TENDERED
- COMMENCED_LOADING / COMMENCED_DISCHARGING
- COMPLETED_LOADING / COMPLETED_DISCHARGING
- SAILED

**API:**
```typescript
POST /api/port-calls/[portCallId]/activities
{
  activityType: ActivityType,
  activityTime: DateTime,
  remarks: string?
}
```

**UI:**
- Timeline component (vertical)
- Add event button per port call
- Event cards with type, time, remarks
- Visual connection between events

#### 5. Laytime Calculation Engine (CORE FEATURE)
**Files to Create:**
- `app/api/voyages/[voyageId]/calculate/route.ts`
- `lib/calculator/laytime-engine.ts`

**Algorithm Steps:**
```typescript
function calculateLaytime(voyage) {
  // 1. Get Charter Party terms
  const cp = voyage.charterParties[0]
  const laytimeAllowed = cp.laytimeAllowed // in hours
  
  // 2. Get all port activities
  const activities = getAllActivities(voyage.portCalls)
  
  // 3. Calculate laytime used
  let laytimeUsed = 0
  
  for (const portCall of voyage.portCalls) {
    const commenced = findActivity(portCall, 'COMMENCED_LOADING|DISCHARGING')
    const completed = findActivity(portCall, 'COMPLETED_LOADING|DISCHARGING')
    
    if (commenced && completed) {
      const hours = (completed.time - commenced.time) / (1000 * 60 * 60)
      laytimeUsed += hours
    }
  }
  
  // 4. Handle reversible terms
  if (cp.laycanType === 'REVERSIBLE') {
    // Combine all load + discharge time
    laytimeUsed = calculateTotalReversibleTime()
  }
  
  // 5. Apply proration (if multiple cargos)
  if (voyage.cargos.length > 1) {
    laytimeUsed = applyProration(laytimeUsed, voyage.cargos)
  }
  
  // 6. Calculate demurrage or despatch
  const diff = laytimeUsed - laytimeAllowed
  
  let demurrage = 0
  let despatch = 0
  
  if (diff > 0) {
    // Over time = demurrage
    demurrage = diff * cp.demurrageRate
  } else {
    // Under time = despatch
    despatch = Math.abs(diff) * cp.despatchRate
  }
  
  return {
    laytimeAllowed,
    laytimeUsed,
    demurrage,
    despatch,
    currency: 'USD',
    breakdown: [] // detailed per-port breakdown
  }
}
```

**UI Features:**
- Calculate button triggers calculation
- Results modal/page showing:
  - Laytime Allowed vs Used (progress bar)
  - Demurrage or Despatch amount
  - Detailed breakdown per port
  - Per cargo proration (if applicable)
  - Export to PDF button (future)

## 📊 Estimated Completion Time

**If building everything manually:**
- Port Calls UI: 1-2 hours
- Cargos (API + UI): 2-3 hours
- Charter Party (API + UI): 2-3 hours
- SOF Timeline (API + UI): 2-3 hours
- Calculation Engine: 3-4 hours
- Testing & Bug Fixes: 2-3 hours

**Total: 12-18 hours**

## 🎯 Minimum Viable Path (4-6 hours)

To get a working calculator ASAP:

1. **Simplify Port Calls UI** (1 hour)
   - Just a simple form, no fancy features
   - Add 2-3 ports manually for testing

2. **Skip Cargo Management** (for now)
   - Assume single cargo per voyage
   - Or manually insert via Supabase

3. **Simple Charter Party Form** (1 hour)
   - Just the 5 critical fields
   - One CP per voyage

4. **Basic SOF Events** (1.5 hours)
   - Just COMMENCED and COMPLETED events
   - Simple form per port

5. **Basic Calculator** (1.5 hours)
   - Simple time difference calculation
   - No proration, no complex rules
   - Just: laytimeUsed - laytimeAllowed

## 🚀 Quick Start Commands

Once you're back, to test the MVP:

```bash
# Start the dev server
npm run dev

# Open http://localhost:3000
# 1. Sign up with your email
# 2. Create a voyage
# 3. Add port calls
# 4. Add charter party
# 5. Add SOF events
# 6. Click "Calculate Laytime"
```

## 📝 Testing Checklist

- [ ] Can create voyage
- [ ] Can add 2+ port calls
- [ ] Can add cargo(s)
- [ ] Can create charter party with terms
- [ ] Can add SOF events (commenced, completed)
- [ ] Calculate button works
- [ ] Results show demurrage or despatch
- [ ] Multi-tenant: users only see their org's data

## 🔗 Resources

- GitHub Repo: https://github.com/MarVoy-360/Marvoy-MVP
- Supabase Dashboard: https://supabase.com/dashboard/project/hyykuhwhtzscauezyqpo
- Current Branch: main
- Commits: 11 (as of now)

---

**Note:** All the database schema is ready and migrated. The hard part (data modeling) is done. What remains is mostly UI forms and the calculation logic.
