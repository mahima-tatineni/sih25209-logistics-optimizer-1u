# Complete Supabase Integration Guide for SAIL Logistics Optimizer

This guide provides detailed steps to set up and connect your Supabase database to the frontend application.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Data Population](#data-population)
4. [Frontend Connection](#frontend-connection)
5. [Testing the Integration](#testing-the-integration)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

✅ **You already have:**
- Supabase project created (ID: `gndzpmfdzvzlsdkjhtti`)
- Environment variables configured in your v0 project
- Database enums and types already created

---

## Database Setup

### Step 1: Understanding the Schema

Your SAIL Logistics Optimizer uses the following database structure:

**Master Data Tables:**
- `plants` - 5 SAIL integrated steel plants
- `ports` - 5 Indian discharge ports
- `supplier_ports` - 10 global supplier ports
- `vessels` - 9 vessel fleet
- `rake_types` - Rail rake specifications
- `rail_routes` - Port-to-plant connectivity
- `routes` - Sea routes (origin to Indian port)
- `route_waypoints` - Navigation waypoints for tracking

**Operational Tables:**
- `shipments` - Vessel movements (STEM)
- `vessel_events` - Vessel status updates
- `plant_events` - Plant operations (rake arrivals, consumption)
- `port_events` - Port operations (discharge, loading)
- `plant_stock` - Plant inventory levels
- `port_stock` - Port yard inventory

**Optimization & AI:**
- `optimization_runs` - Optimization executions
- `optimization_results` - Allocation decisions
- `cost_params` - Cost parameters for optimization
- `ai_delay_predictions` - ML-based ETA predictions
- `risk_assessments` - Risk scoring

**User Management:**
- `profiles` - User profiles linked to auth.users

---

## Data Population

### Step 2: Run Migration Scripts

The database has been populated with **5 comprehensive SQL migration scripts**:

#### Script 1: Create Master Tables (002_create_master_tables.sql)
Creates all master data tables: plants, ports, supplier_ports, vessels, rake_types, rail_routes, routes, route_waypoints

#### Script 2: Seed Master Data (003_seed_master_data.sql)
Inserts:
- **5 SAIL Plants:** Bhilai (BSP), Rourkela (RSP), Bokaro (BSL), Durgapur (DSP), IISCO (ISP)
- **5 Indian Ports:** Visakhapatnam (VIZAG), Gangavaram (GANG), Paradip (PARA), Dhamra (DHAM), Haldia (HALD)
- **10 Supplier Ports:** Gladstone, Hay Point, Maputo, Murmansk, Newcastle, Jebel Ali, Brisbane, Qingdao, Richards Bay, Vancouver
- **9 Vessels:** MV ARJUN, MV BHIMA, MV DHARMA, MV INDRA, MV NAKULA, MV SAHADEVA, MV SHAKTI, MV VIKRAM, MV YUDHISTHIRA
- **1 Rake Type:** BOXNHL_4000 (58 wagons, 4,000t capacity)

#### Script 3: Seed Routes (004_create_operational_tables.sql)
Inserts:
- **13 Rail Routes** connecting ports to plants with realistic distances
- **40+ Sea Routes** from supplier ports to Indian ports
- **Sample waypoints** for route tracking

#### Script 4: Create Operational Tables (004_create_operational_tables.sql)
Creates tables for shipments, events, stock, optimization runs

#### Script 5: Seed Sample Data (005_seed_sample_operational_data.sql)
Inserts sample operational data for testing:
- 15 shipments in various states
- Vessel events (arrivals, berthing, sailing)
- Plant and port stock levels
- Cost parameters
- Sample optimization runs

---

## Frontend Connection

### Step 3: Supabase Client Configuration

Your project already has Supabase client configured:

**File: `lib/supabase/client.ts`**
\`\`\`typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
\`\`\`

**File: `lib/supabase/server.ts`**
\`\`\`typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
\`\`\`

### Step 4: Data Fetching Functions

**File: `lib/db-actions.ts`** contains server actions to fetch data:

\`\`\`typescript
// Fetch all plants
export async function getPlants() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .order('code')
  
  if (error) throw error
  return data
}

// Fetch all ports
export async function getPorts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('ports')
    .select('*')
    .order('code')
  
  if (error) throw error
  return data
}

// Fetch all vessels
export async function getVessels() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('vessels')
    .select('*')
    .order('name')
  
  if (error) throw error
  return data
}

// Fetch shipments with related data
export async function getShipments() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('shipments')
    .select(`
      *,
      vessel:vessels(name, code),
      supplier_port:supplier_ports(name, country)
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}
\`\`\`

### Step 5: Update Pages to Use Real Data

Pages have been updated to fetch from Supabase:

**Homepage (`app/page.tsx`):**
- Fetches plants and ports using `getPlants()` and `getPorts()`
- Displays real facility cards with data from database

**Plants & Ports Page (`app/plants-and-ports/page.tsx`):**
- Shows complete list of all facilities
- Links to detail views

---

## Testing the Integration

### Step 6: Verify Data Loading

1. **Check Homepage:**
   - Navigate to `/`
   - Verify 5 plants are displayed (Bhilai, Rourkela, Bokaro, Durgapur, IISCO)
   - Verify 5 ports are displayed (Vizag, Gangavaram, Paradip, Dhamra, Haldia)

2. **Check Plants & Ports Page:**
   - Navigate to `/plants-and-ports`
   - Verify all facilities show with correct details
   - Check that capacities and locations are displayed

3. **Check Central Planner Dashboard:**
   - Login to `/app/home`
   - Verify shipments load from database
   - Check vessel tracking data

### Step 7: Test CRUD Operations

**Create a New Shipment:**
\`\`\`typescript
const supabase = createClient()
const { data, error } = await supabase
  .from('shipments')
  .insert({
    vessel_id: 'vessel-uuid-here',
    material: 'COKING_COAL',
    incoterm: 'CFR',
    supplier_port_id: 'supplier-port-uuid',
    quantity_t: 70000,
    status: 'PLANNED'
  })
  .select()
\`\`\`

**Update Vessel Status:**
\`\`\`typescript
const { data, error } = await supabase
  .from('vessel_events')
  .insert({
    vessel_id: 'vessel-uuid',
    shipment_id: 'shipment-uuid',
    port_id: 'port-uuid',
    event_type: 'berthed',
    event_time: new Date().toISOString()
  })
\`\`\`

**Query Plant Stock:**
\`\`\`typescript
const { data, error } = await supabase
  .from('plant_stock')
  .select('*')
  .eq('plant_id', 'plant-uuid')
  .eq('material', 'COKING_COAL')
  .order('as_of_date', { ascending: false })
  .limit(1)
\`\`\`

---

## Troubleshooting

### Common Issues

**Issue: "relation does not exist"**
- Solution: Run all migration scripts in order (001 → 005)
- Verify tables exist using Supabase dashboard → Table Editor

**Issue: "Row Level Security" errors**
- Solution: RLS is enabled but policies may need adjustment
- For development, you can temporarily disable RLS on specific tables
- Or add permissive policies for authenticated users

**Issue: "Environment variables not found"**
- Solution: Verify in v0 sidebar → Vars section:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)

**Issue: Data not showing on frontend**
- Check browser console for errors
- Verify Supabase client is initialized correctly
- Check that server components are using `await` for async data fetching
- Verify database contains data (check Supabase dashboard → Table Editor)

### Debugging Tips

1. **Enable Query Logging:**
\`\`\`typescript
const supabase = createClient()
const { data, error } = await supabase
  .from('plants')
  .select('*')

console.log('[v0] Query result:', { data, error })
\`\`\`

2. **Check RLS Policies:**
\`\`\`sql
-- View existing policies
SELECT * FROM pg_policies WHERE tablename = 'plants';

-- Create permissive policy for testing
CREATE POLICY "Allow all for authenticated users" 
ON plants FOR ALL 
TO authenticated 
USING (true);
\`\`\`

3. **Verify Data Exists:**
\`\`\`sql
-- Check record counts
SELECT 'plants' as table_name, COUNT(*) as count FROM plants
UNION ALL
SELECT 'ports', COUNT(*) FROM ports
UNION ALL
SELECT 'vessels', COUNT(*) FROM vessels
UNION ALL
SELECT 'shipments', COUNT(*) FROM shipments;
\`\`\`

---

## Next Steps

1. ✅ Database schema created
2. ✅ Master data populated  
3. ✅ Sample operational data inserted
4. ✅ Frontend connected to Supabase
5. ✅ Server actions configured

**Ready for Development:**
- Build Plant Console to update plant_stock and plant_events
- Build Port Console to manage port_stock and port_events
- Implement optimization engine to create optimization_runs
- Add AI prediction service to populate ai_delay_predictions
- Create reports and dashboards

**Database is live and ready to use!** 🚢⚡
