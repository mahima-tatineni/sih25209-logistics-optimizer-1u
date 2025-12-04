-- Plant System Tables Migration
-- Creates tables for stock requests, plant events, and current stock

-- Stock requests table
CREATE TABLE IF NOT EXISTS stock_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plant_id VARCHAR(10) NOT NULL,
  material VARCHAR(20) NOT NULL CHECK (material IN ('coking_coal', 'limestone')),
  grade VARCHAR(50),
  quantity_t NUMERIC NOT NULL CHECK (quantity_t > 0),
  required_by_date DATE NOT NULL,
  current_days_cover NUMERIC,
  priority VARCHAR(20) DEFAULT 'Normal' CHECK (priority IN ('Normal', 'High', 'Critical')),
  note TEXT,
  status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Planning', 'Scheduled', 'In Transit', 'Delivered')),
  created_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(255),
  procurement_comments TEXT,
  assigned_schedule_id UUID,
  CONSTRAINT fk_plant FOREIGN KEY (plant_id) REFERENCES plants(code) ON DELETE CASCADE
);

-- Plant events table
CREATE TABLE IF NOT EXISTS plant_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plant_id VARCHAR(10) NOT NULL,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('rake_arrival', 'consumption', 'manual_adjust')),
  material VARCHAR(20) NOT NULL CHECK (material IN ('coking_coal', 'limestone')),
  quantity_t NUMERIC NOT NULL CHECK (quantity_t > 0),
  rake_id VARCHAR(50),
  date_time TIMESTAMP NOT NULL DEFAULT NOW(),
  comment TEXT,
  user_id UUID,
  CONSTRAINT fk_plant_event FOREIGN KEY (plant_id) REFERENCES plants(code) ON DELETE CASCADE
);

-- Current stock table
CREATE TABLE IF NOT EXISTS current_stock (
  location_id VARCHAR(10) NOT NULL,
  location_type VARCHAR(10) NOT NULL CHECK (location_type IN ('plant', 'port')),
  material VARCHAR(20) NOT NULL CHECK (material IN ('coking_coal', 'limestone')),
  stock_t NUMERIC NOT NULL DEFAULT 0 CHECK (stock_t >= 0),
  days_cover NUMERIC,
  last_updated TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (location_id, location_type, material)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_stock_requests_plant ON stock_requests(plant_id);
CREATE INDEX IF NOT EXISTS idx_stock_requests_status ON stock_requests(status);
CREATE INDEX IF NOT EXISTS idx_stock_requests_created ON stock_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_plant_events_plant ON plant_events(plant_id);
CREATE INDEX IF NOT EXISTS idx_plant_events_date ON plant_events(date_time DESC);
CREATE INDEX IF NOT EXISTS idx_current_stock_location ON current_stock(location_id, location_type);

-- Insert initial stock data for all plants
INSERT INTO current_stock (location_id, location_type, material, stock_t, days_cover, last_updated) VALUES
  ('BSP', 'plant', 'coking_coal', 350000, 28, NOW()),
  ('BSP', 'plant', 'limestone', 75000, 28, NOW()),
  ('DSP', 'plant', 'coking_coal', 280000, 25, NOW()),
  ('DSP', 'plant', 'limestone', 60000, 25, NOW()),
  ('RSP', 'plant', 'coking_coal', 320000, 27, NOW()),
  ('RSP', 'plant', 'limestone', 70000, 27, NOW()),
  ('BSL', 'plant', 'coking_coal', 300000, 26, NOW()),
  ('BSL', 'plant', 'limestone', 65000, 26, NOW()),
  ('ISP', 'plant', 'coking_coal', 180000, 24, NOW()),
  ('ISP', 'plant', 'limestone', 40000, 24, NOW())
ON CONFLICT (location_id, location_type, material) DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE stock_requests IS 'Stock replenishment requests from plants to procurement';
COMMENT ON TABLE plant_events IS 'Log of all stock movements at plants (receipts and consumption)';
COMMENT ON TABLE current_stock IS 'Current stock levels at plants and ports';

COMMENT ON COLUMN stock_requests.priority IS 'Request priority: Normal, High, or Critical';
COMMENT ON COLUMN stock_requests.status IS 'Request status: Pending, In Planning, Scheduled, In Transit, or Delivered';
COMMENT ON COLUMN plant_events.event_type IS 'Event type: rake_arrival (receipt), consumption (usage), or manual_adjust';
COMMENT ON COLUMN current_stock.days_cover IS 'Number of days the current stock will last based on consumption rate';

-- Grant permissions (adjust as needed for your setup)
GRANT SELECT, INSERT, UPDATE ON stock_requests TO authenticated;
GRANT SELECT, INSERT ON plant_events TO authenticated;
GRANT SELECT, UPDATE ON current_stock TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Plant system tables created successfully!';
  RAISE NOTICE 'Tables: stock_requests, plant_events, current_stock';
  RAISE NOTICE 'Initial stock data inserted for all 5 plants';
END $$;
