-- Create stock_requests table
CREATE TABLE IF NOT EXISTS stock_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID NOT NULL REFERENCES plants(id),
  material material_enum NOT NULL,
  grade TEXT NOT NULL,
  quantity_t NUMERIC NOT NULL,
  required_by_date DATE NOT NULL,
  current_days_cover NUMERIC,
  priority TEXT NOT NULL CHECK (priority IN ('Normal', 'High', 'Critical')),
  note TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Planning', 'Scheduled', 'In Transit', 'Delivered')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  procurement_comments TEXT,
  assigned_schedule_id UUID,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_stock_requests_plant ON stock_requests(plant_id);
CREATE INDEX idx_stock_requests_status ON stock_requests(status);
CREATE INDEX idx_stock_requests_priority ON stock_requests(priority);
CREATE INDEX idx_stock_requests_created_at ON stock_requests(created_at DESC);

-- Enable RLS
ALTER TABLE stock_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY stock_requests_select ON stock_requests FOR SELECT USING (TRUE);
CREATE POLICY stock_requests_insert ON stock_requests FOR INSERT WITH CHECK (TRUE);
CREATE POLICY stock_requests_update ON stock_requests FOR UPDATE USING (TRUE);

COMMENT ON TABLE stock_requests IS 'Stock replenishment requests from plant admins to procurement';
