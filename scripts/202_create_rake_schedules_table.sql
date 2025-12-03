-- Create rake_schedules table for railway admin
CREATE TABLE IF NOT EXISTS rake_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
  rail_route_id UUID REFERENCES rail_routes(id),
  from_port_id UUID REFERENCES ports(id),
  to_plant_id UUID REFERENCES plants(id),
  material material_enum NOT NULL,
  quantity_t NUMERIC NOT NULL,
  rake_count INTEGER NOT NULL,
  planned_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Requested' CHECK (status IN ('Requested', 'Confirmed', 'Scheduled', 'In Transit', 'Completed')),
  confirmed_by UUID REFERENCES users(id),
  confirmed_at TIMESTAMPTZ,
  comments TEXT,
  actual_departure TIMESTAMPTZ,
  actual_arrival TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_rake_schedules_schedule ON rake_schedules(schedule_id);
CREATE INDEX idx_rake_schedules_status ON rake_schedules(status);
CREATE INDEX idx_rake_schedules_planned_date ON rake_schedules(planned_date);
CREATE INDEX idx_rake_schedules_plant ON rake_schedules(to_plant_id);

-- Enable RLS
ALTER TABLE rake_schedules ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY rake_schedules_select ON rake_schedules FOR SELECT USING (TRUE);
CREATE POLICY rake_schedules_insert ON rake_schedules FOR INSERT WITH CHECK (TRUE);
CREATE POLICY rake_schedules_update ON rake_schedules FOR UPDATE USING (TRUE);

COMMENT ON TABLE rake_schedules IS 'Rake allocations and schedules for port-to-plant transport';
