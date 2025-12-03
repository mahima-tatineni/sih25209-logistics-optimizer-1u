# SAIL Logistics Optimizer - Supabase Database Setup Guide

## Overview
This guide provides steps to set up and connect the Supabase database for the SAIL Logistics Optimizer application.

## Database Architecture

The database consists of:
- **5 SAIL Steel Plants**: Bhilai, Rourkela, Bokaro, Durgapur, IISCO
- **5 Indian Ports**: Vizag, Gangavaram, Paradip, Dhamra, Haldia
- **10 Supplier Ports**: Global ports from Australia, South Africa, Russia, Canada, etc.
- **9 Vessels**: Various Panamax and Capesize bulk carriers
- **Rail Routes**: Connectivity between ports and plants
- **Operational Tables**: Shipments, stock management, optimization runs, AI predictions

## Prerequisites

- Supabase project connected to this v0 workspace
- Database migrations already created in `/scripts` folder

## Step 1: Database Setup (Automated)

The database schema has been automatically applied using v0's Supabase integration. The following tables have been created:

### Master Data Tables
- `users` - User authentication and roles
- `plants` - 5 SAIL integrated steel plants
- `ports` - 5 Indian discharge ports
- `supplier_ports` - 10 global coking coal/limestone ports
- `vessels` - 9 bulk carriers for shipments
- `rail_routes` - Port-to-plant rail connectivity

### Operational Tables
- `shipments` - STEM/voyage planning records
- `stock_snapshots` - Current inventory at plants and ports
- `plant_events` - Rake arrivals, consumption, adjustments
- `port_events` - Vessel discharge, rail loading operations
- `vessel_events` - Vessel status tracking
- `optimization_runs` - Solver execution history
- `ai_predictions` - ML-based delay and arrival forecasts
- `risk_assessments` - Operational risk scoring

## Step 2: Frontend Integration

The frontend has been configured with:

### Supabase Client Files
- `/lib/supabase/client.ts` - Browser-side Supabase client
- `/lib/supabase/server.ts` - Server-side Supabase client
- `/lib/supabase-types.ts` - TypeScript types matching database schema
- `/lib/db-utils.ts` - Helper functions for common database operations

### Environment Variables (Already Configured)
\`\`\`
SUPABASE_URL
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_ANON_KEY
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
\`\`\`

## Step 3: Using the Database in Your App

### Fetching Plants
\`\`\`typescript
import { createBrowserClient } from '@/lib/supabase/client'

const supabase = createBrowserClient()
const { data: plants } = await supabase
  .from('plants')
  .select('*')
  .order('code')
\`\`\`

### Fetching Ports
\`\`\`typescript
const { data: ports } = await supabase
  .from('ports')
  .select('*')
  .order('code')
\`\`\`

### Creating a Shipment
\`\`\`typescript
const { data: shipment, error } = await supabase
  .from('shipments')
  .insert({
    vessel_id: vesselId,
    supplier_port_id: supplierPortId,
    discharge_port_id: dischargePortId,
    material: 'COKING_COAL',
    quantity_mt: 75000,
    laycan_start: '2025-01-15',
    laycan_end: '2025-01-20'
  })
  .select()
  .single()
\`\`\`

### Fetching Stock Levels
\`\`\`typescript
const { data: plantStock } = await supabase
  .from('stock_snapshots')
  .select('*, plants(*)')
  .eq('plant_id', plantId)
  .eq('material', 'COKING_COAL')
  .single()
\`\`\`

## Step 4: Update Pages to Use Real Data

The following pages need to be updated to replace mock data with Supabase queries:

1. **Plants & Ports Page** (`/plants-and-ports`) - Fetch from `plants` and `ports` tables
2. **STEM/Voyage Planning** (`/app/stem`) - CRUD operations on `shipments` table
3. **Plant Console** (`/plant-console`) - Query `stock_snapshots` and insert `plant_events`
4. **Port Console** (`/port-console`) - Query `stock_snapshots` and insert `port_events`
5. **Dashboard** (`/app/home`) - Aggregate queries for KPIs

## Step 5: Row Level Security (RLS)

RLS policies have been configured to ensure:
- **Public Access**: Plants, ports, vessels, and supplier ports can be read by anyone
- **Authenticated Users**: Shipments and stock data require authentication
- **Role-Based Access**: 
  - Central Planners: Full access to all operational data
  - Plant Users: Can only update data for their assigned plant
  - Port Users: Can only update data for their assigned port
  - Admins: Full system access

## Step 6: Testing the Integration

### Verify Tables Exist
Check that all tables were created successfully by viewing them in the Supabase dashboard.

### Test Data Queries
Run test queries in your frontend to verify data:
- Homepage should display 5 plants and 5 ports with real images
- STEM page should show list of supplier ports and vessels
- Console pages should display real stock levels

### Monitor for Errors
Check browser console and Supabase logs for any connection or query errors.

## Common Issues & Solutions

### Issue: "relation does not exist"
**Solution**: Ensure all migration scripts have been run in order (001 through 005)

### Issue: RLS policy blocks query
**Solution**: Check that user is authenticated and has proper role assigned

### Issue: Type mismatch errors
**Solution**: Regenerate TypeScript types using `supabase_generate_typescript_types` tool

## Next Steps

1. Replace mock data imports in pages with Supabase queries
2. Add real-time subscriptions for live updates
3. Implement authentication flow with Supabase Auth
4. Add form validation matching database constraints
5. Create indexes for frequently queried columns

## Support

For database schema questions, refer to the SQL scripts in `/scripts` folder.
For Supabase-specific issues, check the Supabase documentation or project logs.
