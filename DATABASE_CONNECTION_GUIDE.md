# SAIL Logistics Optimizer - Supabase Database Connection Guide

## ✅ Current Status

Your Supabase database is **already set up** with all required tables and data:

- ✓ **plants** (5 rows) - All SAIL steel plants
- ✓ **ports** (5 rows) - Strategic east-coast Indian ports
- ✓ **supplier_ports** (10 rows) - Global supplier ports
- ✓ **vessels** (9 rows) - Vessel fleet
- ✓ **rail_routes** (13 rows) - Port-to-plant rail connections
- ✓ **routes** (16 rows) - Sea routes with waypoints
- ✓ **shipments** - STEM/voyage data
- ✓ **optimization_runs** - Optimization results
- ✓ **plant_stock** & **port_stock** - Inventory tracking
- ✓ **plant_events**, **port_events**, **vessel_events** - Operational logs
- ✓ **ai_delay_predictions** - AI prediction results
- ✓ **risk_assessments** - Risk scoring
- ✓ **profiles** - User management with RLS

## 🔗 Frontend Connection

### What Was Done

1. **Created Supabase Clients** (`lib/supabase/`)
   - `client.ts` - Browser client for client components
   - `server.ts` - Server client for server components/actions

2. **Created Server Actions** (`lib/db-actions.ts`)
   - `getPlants()` - Fetch all plants
   - `getPorts()` - Fetch all ports
   - `getVessels()` - Fetch vessel fleet
   - `getSupplierPorts()` - Fetch global supplier ports
   - `getShipments()` - Fetch shipments with relations
   - `getPlantStock()` - Fetch plant inventory
   - `getPortStock()` - Fetch port inventory
   - `getOptimizationRuns()` - Fetch optimization history

3. **Updated Pages to Use Real Data**
   - `app/page.tsx` - Homepage now fetches plants/ports from Supabase
   - `app/plants-and-ports/page.tsx` - Full network page uses real data
   - `components/facility-card.tsx` - Updated to work with Supabase types

## 📝 How to Use the Database

### Fetching Data in Server Components

\`\`\`tsx
// In any Server Component (default in Next.js App Router)
import { getPlants, getPorts } from "@/lib/db-actions"

export default async function MyPage() {
  const plants = await getPlants()
  const ports = await getPorts()
  
  return (
    <div>
      {plants.map(plant => (
        <div key={plant.id}>{plant.name}</div>
      ))}
    </div>
  )
}
\`\`\`

### Fetching Data in Client Components

\`\`\`tsx
"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function MyClientComponent() {
  const [plants, setPlants] = useState([])
  const supabase = createClient()
  
  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('plants').select('*')
      setPlants(data || [])
    }
    fetchData()
  }, [])
  
  return <div>{/* render plants */}</div>
}
\`\`\`

### Inserting Data

\`\`\`tsx
const supabase = createClient()

await supabase.from('shipments').insert({
  vessel_id: 'uuid-here',
  supplier_port_id: 'uuid-here',
  material: 'COKING_COAL',
  quantity_t: 75000,
  laycan_from: '2025-01-15',
  laycan_to: '2025-01-20'
})
\`\`\`

### Updating Data

\`\`\`tsx
await supabase
  .from('plant_stock')
  .update({ coking_stock_t: 12000 })
  .eq('plant_id', plantId)
\`\`\`

## 🔒 Row Level Security (RLS)

All tables have RLS enabled. The current policies allow:
- ✅ Public read access (SELECT) to all tables
- ✅ Authenticated users can INSERT/UPDATE/DELETE

To customize RLS policies, use the Supabase dashboard or SQL:

\`\`\`sql
-- Example: Restrict plant events to plant users
CREATE POLICY "Plant users can insert events"
ON plant_events
FOR INSERT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.plant_id = plant_events.plant_id
  )
);
\`\`\`

## 📊 Available Tables & Relationships

### Master Data
- **plants** → plant_stock, plant_events, rail_routes
- **ports** → port_stock, port_events, vessel_events, routes, cost_params
- **supplier_ports** → routes, cost_params, shipments
- **vessels** → shipments, vessel_events
- **rake_types** → rail_routes

### Operational Data
- **shipments** (vessel assignments)
- **routes** → route_waypoints (sea route tracking)
- **rail_routes** (port-plant rail connections)

### Tracking & Events
- **plant_events** (rake arrivals, consumption, adjustments)
- **port_events** (vessel discharge, rake loading)
- **vessel_events** (vessel movement tracking)
- **plant_stock** (current inventory at plants)
- **port_stock** (current yard stock at ports)

### Optimization & AI
- **optimization_runs** (optimization execution history)
- **optimization_results** (vessel-port-plant assignments)
- **ai_delay_predictions** (ML-based ETA predictions)
- **risk_assessments** (demurrage & delay risk scoring)
- **cost_params** (freight rates, handling charges)

### User Management
- **profiles** (extends auth.users with role and facility assignment)

## 🚀 Next Steps

### To Add More Data
Run additional SQL scripts in the Supabase SQL Editor or use the Supabase API.

### To Add Authentication
1. Set up Supabase Auth in your project (email/password, OAuth, etc.)
2. Use the `profiles` table to assign roles (CentralPlanner, PlantUser, PortUser, Admin)
3. Implement login/signup pages using `@supabase/ssr`

### To Add Real-Time Features
\`\`\`tsx
const supabase = createClient()

// Subscribe to vessel events
supabase
  .channel('vessel_updates')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'vessel_events'
  }, (payload) => {
    console.log('New vessel event:', payload.new)
  })
  .subscribe()
\`\`\`

## 🔗 Environment Variables

Already configured in your project:
- `NEXT_PUBLIC_SUPABASE_URL` ✅
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
- `SUPABASE_SERVICE_ROLE_KEY` ✅ (for admin operations)

## 📖 References

- [Supabase Docs](https://supabase.com/docs)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Your frontend is now fully connected to Supabase!** All public pages (home, plants-and-ports) are fetching real data from the database.
