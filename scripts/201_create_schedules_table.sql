-- Create schedules table for linking requests, vessels, ports, and plants
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  vessel_id UUID REFERENCES vessels(id),
  supplier_port_id UUID REFERENCES supplier_ports(id),
  load_date DATE NOT NULL,
  material material_enum NOT NULL,
  grade TEXT,
  total_quantity_t NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Awaiting Logistics', 'Optimized', 'Confirmed', 'Active', 'Completed')),
  cost_estimate_inr NUMERIC,
  optimization_run_id UUID REFERENCES optimization_runs(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  confirmed_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  stem_id TEXT,
  contract_freight_usd_per_t NUMERIC,
  notes TEXT
);

-- Schedule to Stock Request links (many-to-many)
CREATE TABLE IF NOT EXISTS schedule_requests (
  schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
  request_id UUID REFERENCES stock_requests(id) ON DELETE CASCADE,
  PRIMARY KEY (schedule_id, request_id)
);

-- Schedule discharge port allocations
CREATE TABLE IF NOT EXISTS schedule_ports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
  port_id UUID REFERENCES ports(id),
  tonnes NUMERIC NOT NULL,
  eta TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schedule plant allocations
CREATE TABLE IF NOT EXISTS schedule_plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
  plant_id UUID REFERENCES plants(id),
  via_port_id UUID REFERENCES ports(id),
  tonnes NUMERIC NOT NULL,
  eta TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_schedules_status ON schedules(status);
CREATE INDEX idx_schedules_created_at ON schedules(created_at DESC);
CREATE INDEX idx_schedules_vessel ON schedules(vessel_id);
CREATE INDEX idx_schedule_requests_schedule ON schedule_requests(schedule_id);
CREATE INDEX idx_schedule_requests_request ON schedule_requests(request_id);
CREATE INDEX idx_schedule_ports_schedule ON schedule_ports(schedule_id);
CREATE INDEX idx_schedule_plants_schedule ON schedule_plants(schedule_id);

-- Enable RLS
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_ports ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_plants ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY schedules_select ON schedules FOR SELECT USING (TRUE);
CREATE POLICY schedules_insert ON schedules FOR INSERT WITH CHECK (TRUE);
CREATE POLICY schedules_update ON schedules FOR UPDATE USING (TRUE);

CREATE POLICY schedule_requests_select ON schedule_requests FOR SELECT USING (TRUE);
CREATE POLICY schedule_requests_insert ON schedule_requests FOR INSERT WITH CHECK (TRUE);

CREATE POLICY schedule_ports_select ON schedule_ports FOR SELECT USING (TRUE);
CREATE POLICY schedule_ports_insert ON schedule_ports FOR INSERT WITH CHECK (TRUE);

CREATE POLICY schedule_plants_select ON schedule_plants FOR SELECT USING (TRUE);
CREATE POLICY schedule_plants_insert ON schedule_plants FOR INSERT WITH CHECK (TRUE);

COMMENT ON TABLE schedules IS 'Vessel schedules created by Procurement and optimized by Logistics';
COMMENT ON TABLE schedule_requests IS 'Links schedules to stock requests';
COMMENT ON TABLE schedule_ports IS 'Discharge port allocations per schedule';
COMMENT ON TABLE schedule_plants IS 'Plant allocations per schedule';
