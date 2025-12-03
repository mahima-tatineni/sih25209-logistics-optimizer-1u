-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  role user_role_enum NOT NULL DEFAULT 'CentralPlanner',
  plant_id uuid REFERENCES plants(id),
  port_id uuid REFERENCES ports(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Create shipments/STEM table
CREATE TABLE IF NOT EXISTS shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_no text UNIQUE,
  vessel_id uuid REFERENCES vessels(id),
  material material_enum NOT NULL,
  quality_grade text,
  incoterm incoterm_enum NOT NULL,
  supplier_port_id uuid REFERENCES supplier_ports(id),
  loadport_eta timestamptz,
  laycan_start date,
  laycan_end date,
  sail_date timestamptz,
  base_eta_india timestamptz,
  candidate_ports text[],
  quantity_t numeric(12,2) NOT NULL,
  status text DEFAULT 'PLANNED',
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shipments_select" ON shipments FOR SELECT TO authenticated USING (true);
CREATE POLICY "shipments_insert" ON shipments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "shipments_update" ON shipments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "shipments_delete" ON shipments FOR DELETE TO authenticated USING (true);

-- Create vessel events table
CREATE TABLE IF NOT EXISTS vessel_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vessel_id uuid REFERENCES vessels(id),
  shipment_id uuid REFERENCES shipments(id) ON DELETE CASCADE,
  port_id uuid REFERENCES ports(id),
  event_type event_type_vessel_enum NOT NULL,
  event_time timestamptz NOT NULL,
  eta_update timestamptz,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vessel_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vessel_events_select" ON vessel_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "vessel_events_insert" ON vessel_events FOR INSERT TO authenticated WITH CHECK (true);

-- Create plant events and stock tables
CREATE TABLE IF NOT EXISTS plant_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id uuid REFERENCES plants(id),
  event_type event_type_plant_enum NOT NULL,
  material material_enum NOT NULL,
  quantity_t numeric(12,2) NOT NULL,
  rake_id text,
  event_time timestamptz NOT NULL DEFAULT now(),
  comment text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS plant_stock (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id uuid REFERENCES plants(id),
  material material_enum NOT NULL,
  quality text,
  as_of_date date NOT NULL,
  stock_t numeric(12,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (plant_id, material, quality, as_of_date)
);

ALTER TABLE plant_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_stock ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plant_events_select" ON plant_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "plant_events_insert" ON plant_events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "plant_stock_select" ON plant_stock FOR SELECT TO authenticated USING (true);

-- Create port events and stock tables
CREATE TABLE IF NOT EXISTS port_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  port_id uuid REFERENCES ports(id),
  event_type event_type_port_enum NOT NULL,
  shipment_id uuid REFERENCES shipments(id),
  material material_enum NOT NULL,
  quantity_t numeric(12,2) NOT NULL,
  event_time timestamptz NOT NULL DEFAULT now(),
  comment text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS port_stock (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  port_id uuid REFERENCES ports(id),
  material material_enum NOT NULL,
  quality text,
  as_of_date date NOT NULL,
  stock_t numeric(12,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (port_id, material, quality, as_of_date)
);

ALTER TABLE port_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE port_stock ENABLE ROW LEVEL SECURITY;

CREATE POLICY "port_events_select" ON port_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "port_events_insert" ON port_events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "port_stock_select" ON port_stock FOR SELECT TO authenticated USING (true);

-- Create cost parameters table
CREATE TABLE IF NOT EXISTS cost_params (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  valid_from date NOT NULL,
  valid_to date,
  material material_enum,
  origin_id uuid REFERENCES supplier_ports(id),
  port_id uuid REFERENCES ports(id),
  ocean_freight_usd_t numeric(10,2),
  ocean_diff_usd_t numeric(10,2),
  demurrage_usd_day numeric(12,2),
  handling_inr_t numeric(10,2),
  storage_inr_t_day numeric(10,2),
  rail_freight_inr_t numeric(10,2),
  fx_usd_inr numeric(10,4),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cost_params ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cost_params_select" ON cost_params FOR SELECT TO authenticated USING (true);

-- Create optimization tables
CREATE TABLE IF NOT EXISTS optimization_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  created_by uuid REFERENCES profiles(id),
  started_at timestamptz DEFAULT now(),
  finished_at timestamptz,
  status text DEFAULT 'PENDING',
  horizon_start date,
  horizon_end date,
  parameters jsonb,
  summary jsonb
);

CREATE TABLE IF NOT EXISTS optimization_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid REFERENCES optimization_runs(id) ON DELETE CASCADE,
  shipment_id uuid REFERENCES shipments(id),
  discharge_port_id uuid REFERENCES ports(id),
  plant_id uuid REFERENCES plants(id),
  material material_enum,
  tonnes numeric(12,2),
  num_rakes integer,
  eta_port timestamptz,
  eta_plant timestamptz,
  total_cost_inr numeric(14,2),
  ocean_cost_inr numeric(14,2),
  port_cost_inr numeric(14,2),
  rail_cost_inr numeric(14,2),
  demurrage_cost_inr numeric(14,2),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE optimization_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimization_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "optimization_runs_select" ON optimization_runs FOR SELECT TO authenticated USING (true);
CREATE POLICY "optimization_runs_insert" ON optimization_runs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "optimization_results_select" ON optimization_results FOR SELECT TO authenticated USING (true);

-- Create AI prediction and risk tables
CREATE TABLE IF NOT EXISTS ai_delay_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid REFERENCES shipments(id) ON DELETE CASCADE,
  route_id uuid REFERENCES routes(id),
  port_id uuid REFERENCES ports(id),
  predicted_eta timestamptz,
  predicted_waiting_days numeric(6,2),
  risk_level risk_level_enum,
  confidence numeric(4,2),
  model_version text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS risk_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  context_type text,
  context_id uuid,
  risk_level risk_level_enum,
  weather_risk numeric(4,2),
  congestion_risk numeric(4,2),
  technical_risk numeric(4,2),
  overall_score numeric(4,2),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_delay_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_delay_predictions_select" ON ai_delay_predictions FOR SELECT TO authenticated USING (true);
CREATE POLICY "risk_assessments_select" ON risk_assessments FOR SELECT TO authenticated USING (true);

-- Create scenarios and reports tables
CREATE TABLE IF NOT EXISTS scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  base_run_id uuid REFERENCES optimization_runs(id),
  parameters jsonb,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  scenario_id uuid REFERENCES scenarios(id),
  type text,
  generated_at timestamptz DEFAULT now(),
  metadata jsonb,
  storage_path text
);

ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scenarios_select" ON scenarios FOR SELECT TO authenticated USING (true);
CREATE POLICY "scenarios_insert" ON scenarios FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "reports_select" ON reports FOR SELECT TO authenticated USING (true);

-- Create indexes for performance
CREATE INDEX ON shipments (supplier_port_id);
CREATE INDEX ON shipments (vessel_id);
CREATE INDEX ON plant_events (plant_id, material, event_time);
CREATE INDEX ON port_events (port_id, material, event_time);
CREATE INDEX ON vessel_events (vessel_id, port_id, event_time);
CREATE INDEX ON optimization_results (run_id);
CREATE INDEX ON ai_delay_predictions (shipment_id, port_id);
