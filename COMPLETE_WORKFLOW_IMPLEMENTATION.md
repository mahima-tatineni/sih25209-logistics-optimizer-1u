# Complete SAIL Logistics Workflow Implementation Plan

## Current Status
- ✅ Basic plant portal exists
- ✅ Stock request form exists
- ✅ Procurement portal exists
- ✅ Logistics portal exists
- ❌ Database tables need to be created/updated
- ❌ Role-based routing needs implementation
- ❌ Complete workflow connections needed

## Phase 1: Database Schema (PRIORITY)

### 1.1 Create/Update Core Tables

```sql
-- profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('PLANT', 'PROCUREMENT', 'LOGISTICS', 'PORT', 'RAILWAY', 'ADMIN', 'DEMO')),
  plant_code TEXT CHECK (plant_code IN ('BSP', 'RSP', 'BSL', 'DSP', 'ISP')),
  port_code TEXT CHECK (port_code IN ('VIZAG', 'PARA', 'DHAM', 'HALD', 'KOLK')),
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- plant_requests (replaces stock_requests)
CREATE TABLE IF NOT EXISTS plant_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_code TEXT NOT NULL CHECK (plant_code IN ('BSP', 'RSP', 'BSL', 'DSP', 'ISP')),
  material TEXT NOT NULL CHECK (material IN ('COKING_COAL', 'LIMESTONE')),
  quantity_t NUMERIC NOT NULL,
  required_by_date DATE NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'IN_PLANNING', 'SCHEDULED', 'CLOSED')),
  grade TEXT,
  current_days_cover NUMERIC,
  note TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- schedules (created by procurement)
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_code TEXT UNIQUE NOT NULL,
  material TEXT NOT NULL,
  quantity_t NUMERIC NOT NULL,
  vessel_id UUID,
  vessel_name TEXT,
  load_port_code TEXT NOT NULL,
  sailing_date DATE,
  required_by_date DATE,
  target_plant_code TEXT,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'SENT_TO_LOGISTICS', 'PORT_SELECTED', 'IN_TRANSIT', 'DELIVERED')),
  linked_requests JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- schedule_port_candidates
CREATE TABLE IF NOT EXISTS schedule_port_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
  port_code TEXT NOT NULL,
  distance_nm NUMERIC,
  transit_days NUMERIC,
  rail_distance_km NUMERIC,
  ocean_freight_inr NUMERIC,
  port_charges_inr NUMERIC,
  storage_inr NUMERIC,
  rail_freight_inr NUMERIC,
  expected_demurrage_inr NUMERIC,
  total_cost_inr NUMERIC,
  weather_risk TEXT CHECK (weather_risk IN ('LOW', 'MEDIUM', 'HIGH')),
  congestion_risk TEXT CHECK (congestion_risk IN ('LOW', 'MEDIUM', 'HIGH')),
  depth_risk TEXT CHECK (depth_risk IN ('LOW', 'MEDIUM', 'HIGH')),
  overall_risk_score NUMERIC,
  feasibility_status TEXT CHECK (feasibility_status IN ('OPTIMISED', 'FEASIBLE', 'NON_FEASIBLE')),
  reason_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- transport_plans
CREATE TABLE IF NOT EXISTS transport_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
  selected_port_code TEXT NOT NULL,
  current_status TEXT NOT NULL DEFAULT 'PLANNED',
  eta_port TIMESTAMPTZ,
  eta_plant TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- transport_milestones
CREATE TABLE IF NOT EXISTS transport_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transport_plan_id UUID REFERENCES transport_plans(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  label TEXT NOT NULL,
  planned_time TIMESTAMPTZ,
  actual_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ai_scenarios
CREATE TABLE IF NOT EXISTS ai_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transport_plan_id UUID REFERENCES transport_plans(id) ON DELETE CASCADE,
  scenario_type TEXT NOT NULL,
  description TEXT,
  eta_port TIMESTAMPTZ,
  eta_plant TIMESTAMPTZ,
  total_cost_inr NUMERIC,
  delta_cost_inr NUMERIC,
  delta_days_port NUMERIC,
  delta_days_plant NUMERIC,
  reasons JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- port_responses
CREATE TABLE IF NOT EXISTS port_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
  port_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'CONFIRMED', 'REJECTED')),
  comments TEXT,
  extra_waiting_days NUMERIC DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- railway_responses
CREATE TABLE IF NOT EXISTS railway_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
  route_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'CONFIRMED', 'REDUCED_CAPACITY', 'REJECTED')),
  available_rakes_per_day NUMERIC,
  extra_transit_days NUMERIC DEFAULT 0,
  comments TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.2 Seed Demo Users

```sql
-- Insert demo users into profiles
INSERT INTO profiles (id, email, role, plant_code, full_name) VALUES
  (gen_random_uuid(), 'plant.bhilai@sail.in', 'PLANT', 'BSP', 'Bhilai Plant Admin'),
  (gen_random_uuid(), 'plant.rourkela@sail.in', 'PLANT', 'RSP', 'Rourkela Plant Admin'),
  (gen_random_uuid(), 'plant.bokaro@sail.in', 'PLANT', 'BSL', 'Bokaro Plant Admin'),
  (gen_random_uuid(), 'plant.durgapur@sail.in', 'PLANT', 'DSP', 'Durgapur Plant Admin'),
  (gen_random_uuid(), 'plant.iisco@sail.in', 'PLANT', 'ISP', 'IISCO Plant Admin'),
  (gen_random_uuid(), 'port.vizag@sail.in', 'PORT', NULL, 'Vizag Port Admin') WHERE port_code = 'VIZAG',
  (gen_random_uuid(), 'port.paradip@sail.in', 'PORT', NULL, 'Paradip Port Admin') WHERE port_code = 'PARA',
  (gen_random_uuid(), 'procurement@sail.in', 'PROCUREMENT', NULL, 'Procurement Team'),
  (gen_random_uuid(), 'logistics@sail.in', 'LOGISTICS', NULL, 'Logistics Team'),
  (gen_random_uuid(), 'railway@sail.in', 'RAILWAY', NULL, 'Railway Manager'),
  (gen_random_uuid(), 'admin@sail.in', 'ADMIN', NULL, 'System Admin')
ON CONFLICT (email) DO NOTHING;
```

## Phase 2: API Routes

### 2.1 Plant APIs
- `GET /api/plant/[plantCode]/dashboard` - Stock, requests, schedules
- `POST /api/plant/[plantCode]/requests` - Create request (FIXED)
- `GET /api/plant/[plantCode]/requests` - List requests (FIXED)
- `GET /api/plant/[plantCode]/schedules` - View in-transit schedules

### 2.2 Procurement APIs
- `GET /api/procurement/requests` - All plant requests
- `POST /api/procurement/schedules` - Create schedule from requests
- `GET /api/procurement/schedules` - List all schedules
- `POST /api/procurement/port-requests` - Request port availability
- `POST /api/procurement/railway-requests` - Request railway capacity

### 2.3 Logistics APIs
- `GET /api/logistics/schedules` - Schedules to route
- `POST /api/logistics/port-candidates` - Generate port options
- `POST /api/logistics/select-port` - Select port and create transport plan
- `GET /api/logistics/transport-plans` - Active plans
- `POST /api/logistics/milestones` - Update milestone
- `GET /api/logistics/ai-scenarios` - AI what-if scenarios

### 2.4 Port APIs
- `GET /api/port/[portCode]/schedules` - Schedules for this port
- `POST /api/port/[portCode]/responses` - Confirm/reject/update

### 2.5 Railway APIs
- `GET /api/railway/schedules` - Schedules needing railway
- `POST /api/railway/responses` - Provide capacity/constraints

## Phase 3: UI Components

### 3.1 Role-Based Routing
- Update `lib/auth.tsx` to include role and plant_code/port_code
- Create `lib/role-routing.ts` with redirect logic
- Update `app/layout.tsx` to handle role-based home

### 3.2 Plant Portal (`/plant/[plantCode]`)
- Dashboard with stock cards
- Request creation form (EXISTS - needs update)
- Requests list with status
- In-transit schedules viewer

### 3.3 Procurement Portal (`/procurement`)
- Requests inbox
- Schedule creation form
- Port/Railway request forms
- Schedules list with responses

### 3.4 Logistics Portal (`/logistics`)
- Schedules to route
- Port selection page (EXISTS - needs connection)
- Transport plans tracking
- AI scenarios display

### 3.5 Port Portal (`/port/[portCode]`)
- Schedules list for this port
- Response forms (confirm/reject/delay)

### 3.6 Railway Portal (`/railway`)
- Schedules list needing railway
- Capacity response forms

## Phase 4: Tooltips & UX

Add hover tooltips to all key fields using shadcn/ui Tooltip component.

## Implementation Priority

### IMMEDIATE (Fix current error)
1. ✅ Handle missing plants table gracefully
2. ✅ Fix request creation to work with current schema
3. Create migration script for new tables

### SHORT TERM (Next 2-3 hours)
1. Create all database tables
2. Seed demo users
3. Implement role-based routing
4. Connect plant requests to procurement

### MEDIUM TERM (Next day)
1. Implement procurement schedule creation
2. Connect logistics port selection
3. Add transport plans and milestones
4. Implement port and railway portals

### LONG TERM (Next 2-3 days)
1. AI scenarios engine
2. Real-time updates
3. Complete tooltips
4. Testing and refinement

## Files to Create/Modify

### New Files
- `scripts/300_complete_workflow_schema.sql`
- `app/api/procurement/requests/route.ts`
- `app/api/procurement/schedules/route.ts`
- `app/api/logistics/port-candidates/route.ts`
- `app/api/logistics/transport-plans/route.ts`
- `app/api/port/[portCode]/route.ts`
- `app/api/railway/route.ts`
- `app/procurement/page.tsx` (UPDATE)
- `app/logistics/page.tsx` (UPDATE)
- `app/port/[portCode]/page.tsx` (NEW)
- `app/railway/page.tsx` (NEW)
- `components/procurement/requests-inbox.tsx`
- `components/procurement/schedule-form.tsx`
- `components/logistics/transport-tracking.tsx`
- `components/port/response-form.tsx`
- `components/railway/capacity-form.tsx`

### Modified Files
- `lib/auth.tsx` - Add role, plant_code, port_code
- `app/plant-portal/page.tsx` - Update to use new schema
- `app/api/plant/[plantId]/requests/route.ts` - Fix for new schema
- `components/plant/stock-request-form.tsx` - Update field names

## Next Steps

1. Run the SQL migration to create tables
2. Fix immediate request creation error
3. Implement role-based routing
4. Build out each portal incrementally
