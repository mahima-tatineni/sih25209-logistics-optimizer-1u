-- Complete SAIL Logistics Workflow Schema
-- Run this migration to set up the complete end-to-end workflow

-- ============================================================================
-- 1. PROFILES TABLE (Role-based access)
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('PLANT', 'PROCUREMENT', 'LOGISTICS', 'PORT', 'RAILWAY', 'ADMIN', 'DEMO')),
  plant_code TEXT CHECK (plant_code IN ('BSP', 'RSP', 'BSL', 'DSP', 'ISP')),
  port_code TEXT CHECK (port_code IN ('VIZAG', 'PARA', 'DHAM', 'HALD', 'KOLK')),
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'User profiles with role-based access control';
COMMENT ON COLUMN profiles.role IS 'User role: PLANT, PROCUREMENT, LOGISTICS, PORT, RAILWAY, ADMIN, DEMO';
COMMENT ON COLUMN profiles.plant_code IS 'Plant code for PLANT role users (BSP/RSP/BSL/DSP/ISP)';
COMMENT ON COLUMN profiles.port_code IS 'Port code for PORT role users (VIZAG/PARA/DHAM/HALD/KOLK)';

-- ============================================================================
-- 2. PLANT_REQUESTS TABLE (Replaces stock_requests)
-- ============================================================================

CREATE TABLE IF NOT EXISTS plant_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_code TEXT NOT NULL CHECK (plant_code IN ('BSP', 'RSP', 'BSL', 'DSP', 'ISP')),
  material TEXT NOT NULL CHECK (material IN ('COKING_COAL', 'LIMESTONE')),
  quantity_t NUMERIC NOT NULL CHECK (quantity_t > 0),
  required_by_date DATE NOT NULL,
  priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'IN_PLANNING', 'SCHEDULED', 'CLOSED')),
  grade TEXT,
  current_days_cover NUMERIC,
  note TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_plant_requests_plant ON plant_requests(plant_code);
CREATE INDEX idx_plant_requests_status ON plant_requests(status);
CREATE INDEX idx_plant_requests_created ON plant_requests(created_at DESC);

COMMENT ON TABLE plant_requests IS 'Stock replenishment requests raised by plants when projected stock cover falls below target';
COMMENT ON COLUMN plant_requests.material IS 'Imported input material (COKING_COAL or LIMESTONE) requested by plant';
COMMENT ON COLUMN plant_requests.quantity_t IS 'Quantity in tonnes required by plant';
COMMENT ON COLUMN plant_requests.required_by_date IS 'Latest date by which plant needs stock to maintain minimum cover';
COMMENT ON COLUMN plant_requests.priority IS 'Request urgency: LOW (routine), MEDIUM (standard), HIGH (urgent)';
COMMENT ON COLUMN plant_requests.status IS 'Request lifecycle: NEW → IN_PLANNING → SCHEDULED → CLOSED';

-- ============================================================================
-- 3. SCHEDULES TABLE (Created by Procurement)
-- ============================================================================

CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_code TEXT UNIQUE NOT NULL,
  material TEXT NOT NULL CHECK (material IN ('COKING_COAL', 'LIMESTONE')),
  quantity_t NUMERIC NOT NULL CHECK (quantity_t > 0),
  vessel_id UUID,
  vessel_name TEXT,
  load_port_code TEXT NOT NULL,
  sailing_date DATE,
  required_by_date DATE,
  target_plant_code TEXT CHECK (target_plant_code IN ('BSP', 'RSP', 'BSL', 'DSP', 'ISP')),
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'SENT_TO_LOGISTICS', 'PORT_SELECTED', 'IN_TRANSIT', 'DELIVERED')),
  linked_requests JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_schedules_status ON schedules(status);
CREATE INDEX idx_schedules_plant ON schedules(target_plant_code);
CREATE INDEX idx_schedules_created ON schedules(created_at DESC);

COMMENT ON TABLE schedules IS 'Import voyage schedules created by procurement, defining one shipment that logistics must route to an Indian port';
COMMENT ON COLUMN schedules.schedule_code IS 'Unique schedule identifier (e.g., SCH-2025-001)';
COMMENT ON COLUMN schedules.load_port_code IS 'Supplier port where vessel loads material (e.g., Gladstone, Richards Bay)';
COMMENT ON COLUMN schedules.sailing_date IS 'Date when vessel departs from load port';
COMMENT ON COLUMN schedules.linked_requests IS 'JSON array of plant_request IDs combined into this schedule';
COMMENT ON COLUMN schedules.status IS 'Schedule lifecycle: NEW → SENT_TO_LOGISTICS → PORT_SELECTED → IN_TRANSIT → DELIVERED';

-- ============================================================================
-- 4. SCHEDULE_PORT_CANDIDATES TABLE (Port evaluation)
-- ============================================================================

CREATE TABLE IF NOT EXISTS schedule_port_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
  port_code TEXT NOT NULL CHECK (port_code IN ('VIZAG', 'PARA', 'DHAM', 'HALD', 'KOLK')),
  
  -- Static factors
  distance_nm NUMERIC,
  transit_days NUMERIC,
  rail_distance_km NUMERIC,
  
  -- Cost breakdown
  ocean_freight_inr NUMERIC,
  port_charges_inr NUMERIC,
  storage_inr NUMERIC,
  rail_freight_inr NUMERIC,
  expected_demurrage_inr NUMERIC,
  total_cost_inr NUMERIC,
  
  -- Risk assessment
  weather_risk TEXT CHECK (weather_risk IN ('LOW', 'MEDIUM', 'HIGH')),
  congestion_risk TEXT CHECK (congestion_risk IN ('LOW', 'MEDIUM', 'HIGH')),
  depth_risk TEXT CHECK (depth_risk IN ('LOW', 'MEDIUM', 'HIGH')),
  overall_risk_score NUMERIC,
  
  -- Feasibility
  feasibility_status TEXT NOT NULL CHECK (feasibility_status IN ('OPTIMISED', 'FEASIBLE', 'NON_FEASIBLE')),
  reason_summary TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_port_candidates_schedule ON schedule_port_candidates(schedule_id);
CREATE INDEX idx_port_candidates_feasibility ON schedule_port_candidates(feasibility_status);

COMMENT ON TABLE schedule_port_candidates IS 'Candidate discharge ports evaluated by logistics for each schedule';
COMMENT ON COLUMN schedule_port_candidates.distance_nm IS 'Ocean distance in nautical miles from load port to discharge port';
COMMENT ON COLUMN schedule_port_candidates.expected_demurrage_inr IS 'Expected demurrage cost derived from predicted pre-berthing delay and laytime terms';
COMMENT ON COLUMN schedule_port_candidates.weather_risk IS 'Weather risk assessment: LOW (clear), MEDIUM (moderate seas), HIGH (cyclone/heavy seas predicted)';
COMMENT ON COLUMN schedule_port_candidates.congestion_risk IS 'Port congestion risk based on current vessel queue and berth availability';
COMMENT ON COLUMN schedule_port_candidates.feasibility_status IS 'OPTIMISED (best option), FEASIBLE (acceptable), NON_FEASIBLE (not recommended)';
COMMENT ON COLUMN schedule_port_candidates.total_cost_inr IS 'Sum of ocean freight, port charges, storage, rail freight, and expected demurrage for this port option';

-- ============================================================================
-- 5. TRANSPORT_PLANS TABLE (Active end-to-end plans)
-- ============================================================================

CREATE TABLE IF NOT EXISTS transport_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
  selected_port_code TEXT NOT NULL,
  current_status TEXT NOT NULL DEFAULT 'PLANNED' CHECK (current_status IN (
    'PLANNED', 'SAILED', 'AT_ANCHORAGE', 'AT_BERTH', 'DISCHARGING', 
    'RAIL_LOADING', 'RAIL_IN_TRANSIT', 'ARRIVED_PLANT', 'CLOSED'
  )),
  eta_port TIMESTAMPTZ,
  eta_plant TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transport_plans_schedule ON transport_plans(schedule_id);
CREATE INDEX idx_transport_plans_status ON transport_plans(current_status);

COMMENT ON TABLE transport_plans IS 'Active end-to-end transport plan from load port to target plant via selected discharge port';
COMMENT ON COLUMN transport_plans.current_status IS 'Current stage in transport lifecycle';
COMMENT ON COLUMN transport_plans.eta_port IS 'Estimated time of arrival at discharge port';
COMMENT ON COLUMN transport_plans.eta_plant IS 'Estimated time of arrival at target plant';

-- ============================================================================
-- 6. TRANSPORT_MILESTONES TABLE (Standardized checkpoints)
-- ============================================================================

CREATE TABLE IF NOT EXISTS transport_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transport_plan_id UUID NOT NULL REFERENCES transport_plans(id) ON DELETE CASCADE,
  code TEXT NOT NULL CHECK (code IN (
    'SCHEDULE_CREATED', 'VESSEL_SAILED', 'ARRIVE_ANCHORAGE', 'BERTHED', 
    'DISCHARGE_COMPLETE', 'RAKE_LOADING_COMPLETE', 'RAKES_IN_TRANSIT', 
    'ARRIVED_PLANT', 'STOCK_POSTED'
  )),
  label TEXT NOT NULL,
  planned_time TIMESTAMPTZ,
  actual_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_milestones_plan ON transport_milestones(transport_plan_id);
CREATE INDEX idx_milestones_code ON transport_milestones(code);

COMMENT ON TABLE transport_milestones IS 'Standardized milestone tracking; when actual_time is set the step is completed';
COMMENT ON COLUMN transport_milestones.code IS 'Fixed milestone code for consistent tracking across all plans';
COMMENT ON COLUMN transport_milestones.planned_time IS 'Originally planned time for this milestone';
COMMENT ON COLUMN transport_milestones.actual_time IS 'Actual completion time (NULL if not yet reached)';

-- ============================================================================
-- 7. AI_SCENARIOS TABLE (Automatic what-if analysis)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transport_plan_id UUID NOT NULL REFERENCES transport_plans(id) ON DELETE CASCADE,
  scenario_type TEXT NOT NULL CHECK (scenario_type IN (
    'BASE', 'WEATHER_RISK', 'PORT_CONGESTION', 'RAIL_CONSTRAINT', 'ALTERNATE_PORT'
  )),
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

CREATE INDEX idx_scenarios_plan ON ai_scenarios(transport_plan_id);
CREATE INDEX idx_scenarios_type ON ai_scenarios(scenario_type);

COMMENT ON TABLE ai_scenarios IS 'AI-generated scenarios showing impact of detected risks or alternate decisions';
COMMENT ON COLUMN ai_scenarios.scenario_type IS 'Type of scenario: BASE (current plan), WEATHER_RISK, PORT_CONGESTION, RAIL_CONSTRAINT, ALTERNATE_PORT';
COMMENT ON COLUMN ai_scenarios.delta_cost_inr IS 'Cost difference compared to base scenario';
COMMENT ON COLUMN ai_scenarios.delta_days_port IS 'Days delay/advance at port compared to base';
COMMENT ON COLUMN ai_scenarios.reasons IS 'JSON array of cause strings explaining the scenario';

-- ============================================================================
-- 8. PORT_RESPONSES TABLE (Port feedback)
-- ============================================================================

CREATE TABLE IF NOT EXISTS port_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
  port_code TEXT NOT NULL CHECK (port_code IN ('VIZAG', 'PARA', 'DHAM', 'HALD', 'KOLK')),
  status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'CONFIRMED', 'REJECTED')),
  comments TEXT,
  extra_waiting_days NUMERIC DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_port_responses_schedule ON port_responses(schedule_id);
CREATE INDEX idx_port_responses_port ON port_responses(port_code);

COMMENT ON TABLE port_responses IS 'Port responses to logistics/procurement requests, including likely delays or constraints';
COMMENT ON COLUMN port_responses.extra_waiting_days IS 'Additional waiting days signaled by port due to congestion or capacity issues';

-- ============================================================================
-- 9. RAILWAY_RESPONSES TABLE (Railway feedback)
-- ============================================================================

CREATE TABLE IF NOT EXISTS railway_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
  route_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'CONFIRMED', 'REDUCED_CAPACITY', 'REJECTED')),
  available_rakes_per_day NUMERIC,
  extra_transit_days NUMERIC DEFAULT 0,
  comments TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_railway_responses_schedule ON railway_responses(schedule_id);
CREATE INDEX idx_railway_responses_route ON railway_responses(route_code);

COMMENT ON TABLE railway_responses IS 'Railway commitment or constraints on rake availability for schedules';
COMMENT ON COLUMN railway_responses.available_rakes_per_day IS 'Number of rakes railway can provide per day for this route';
COMMENT ON COLUMN railway_responses.extra_transit_days IS 'Additional transit days due to railway constraints';

-- ============================================================================
-- 10. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_port_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE port_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE railway_responses ENABLE ROW LEVEL SECURITY;

-- Basic policies (allow authenticated users)
CREATE POLICY profiles_select ON profiles FOR SELECT USING (TRUE);
CREATE POLICY plant_requests_all ON plant_requests FOR ALL USING (TRUE);
CREATE POLICY schedules_all ON schedules FOR ALL USING (TRUE);
CREATE POLICY port_candidates_all ON schedule_port_candidates FOR ALL USING (TRUE);
CREATE POLICY transport_plans_all ON transport_plans FOR ALL USING (TRUE);
CREATE POLICY milestones_all ON transport_milestones FOR ALL USING (TRUE);
CREATE POLICY scenarios_all ON ai_scenarios FOR ALL USING (TRUE);
CREATE POLICY port_responses_all ON port_responses FOR ALL USING (TRUE);
CREATE POLICY railway_responses_all ON railway_responses FOR ALL USING (TRUE);

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Complete workflow schema created successfully!';
  RAISE NOTICE 'Tables created: profiles, plant_requests, schedules, schedule_port_candidates,';
  RAISE NOTICE '               transport_plans, transport_milestones, ai_scenarios,';
  RAISE NOTICE '               port_responses, railway_responses';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Seed demo users with INSERT INTO profiles';
  RAISE NOTICE '2. Update application code to use new schema';
  RAISE NOTICE '3. Test end-to-end workflow';
END $$;
