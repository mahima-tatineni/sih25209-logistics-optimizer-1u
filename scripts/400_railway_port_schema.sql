-- Railway and Port Portal Schema
-- Adds capacity management and request confirmation tables

-- ============================================================================
-- 1. RAILWAY DAILY CAPACITY
-- ============================================================================

CREATE TABLE IF NOT EXISTS railway_daily_capacity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  port_code TEXT NOT NULL CHECK (port_code IN ('VIZAG', 'PARA', 'DHAM', 'HALD', 'KOLK')),
  plant_code TEXT NOT NULL CHECK (plant_code IN ('BSP', 'RSP', 'BSL', 'DSP', 'ISP')),
  available_rakes INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, port_code, plant_code)
);

CREATE INDEX idx_railway_capacity_date ON railway_daily_capacity(date);
CREATE INDEX idx_railway_capacity_route ON railway_daily_capacity(port_code, plant_code);

COMMENT ON TABLE railway_daily_capacity IS 'Daily rake availability per port-plant route updated by Railway officials';
COMMENT ON COLUMN railway_daily_capacity.available_rakes IS 'Number of rakes Railway can provide on this route on this date';

-- ============================================================================
-- 2. RAILWAY SCHEDULE REQUESTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS railway_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id TEXT NOT NULL,
  port_code TEXT NOT NULL CHECK (port_code IN ('VIZAG', 'PARA', 'DHAM', 'HALD', 'KOLK')),
  plant_code TEXT NOT NULL CHECK (plant_code IN ('BSP', 'RSP', 'BSL', 'DSP', 'ISP')),
  required_rakes INTEGER NOT NULL,
  required_window_start DATE NOT NULL,
  required_window_end DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'CONFIRMED', 'PARTIAL', 'REJECTED', 'CLOSED')),
  confirmed_start DATE,
  confirmed_end DATE,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_railway_requests_schedule ON railway_requests(schedule_id);
CREATE INDEX idx_railway_requests_status ON railway_requests(status);
CREATE INDEX idx_railway_requests_route ON railway_requests(port_code, plant_code);

COMMENT ON TABLE railway_requests IS 'Railway rake allocation requests created when port is selected for a schedule';
COMMENT ON COLUMN railway_requests.required_window_start IS 'Preferred date window start for loading rakes before laydays expire';
COMMENT ON COLUMN railway_requests.required_window_end IS 'Preferred date window end for loading rakes before laydays expire';

-- ============================================================================
-- 3. PORT DAILY CAPACITY
-- ============================================================================

CREATE TABLE IF NOT EXISTS port_daily_capacity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  port_code TEXT NOT NULL CHECK (port_code IN ('VIZAG', 'PARA', 'DHAM', 'HALD', 'KOLK')),
  available_berths INTEGER NOT NULL DEFAULT 0,
  available_stockyard_t NUMERIC NOT NULL DEFAULT 0,
  congestion_index NUMERIC NOT NULL DEFAULT 0 CHECK (congestion_index >= 0 AND congestion_index <= 100),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, port_code)
);

CREATE INDEX idx_port_capacity_date ON port_daily_capacity(date);
CREATE INDEX idx_port_capacity_port ON port_daily_capacity(port_code);

COMMENT ON TABLE port_daily_capacity IS 'Daily port capacity and congestion data updated by Port officials';
COMMENT ON COLUMN port_daily_capacity.available_berths IS 'Number of berths available for SAIL vessels';
COMMENT ON COLUMN port_daily_capacity.available_stockyard_t IS 'Free storage capacity in tonnes for SAIL cargo';
COMMENT ON COLUMN port_daily_capacity.congestion_index IS 'Port congestion level 0-100, higher = more congested';

-- ============================================================================
-- 4. PORT SCHEDULE REQUESTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS port_schedule_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id TEXT NOT NULL,
  port_code TEXT NOT NULL CHECK (port_code IN ('VIZAG', 'PARA', 'DHAM', 'HALD', 'KOLK')),
  vessel_id TEXT,
  vessel_name TEXT NOT NULL,
  material TEXT NOT NULL,
  quantity_t NUMERIC NOT NULL,
  eta_port DATE NOT NULL,
  laydays_end DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'CONFIRMED', 'WINDOW_ADJUSTED', 'REJECTED', 'CLOSED')),
  confirmed_window_start DATE,
  confirmed_window_end DATE,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_port_requests_schedule ON port_schedule_requests(schedule_id);
CREATE INDEX idx_port_requests_port ON port_schedule_requests(port_code);
CREATE INDEX idx_port_requests_status ON port_schedule_requests(status);

COMMENT ON TABLE port_schedule_requests IS 'Port berth and stockyard requests created when port is selected for a schedule';
COMMENT ON COLUMN port_schedule_requests.confirmed_window_start IS 'Confirmed berth + stockyard window start during which vessel can discharge without extra waiting';
COMMENT ON COLUMN port_schedule_requests.confirmed_window_end IS 'Confirmed berth + stockyard window end during which vessel can discharge without extra waiting';

-- ============================================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE railway_daily_capacity ENABLE ROW LEVEL SECURITY;
ALTER TABLE railway_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE port_daily_capacity ENABLE ROW LEVEL SECURITY;
ALTER TABLE port_schedule_requests ENABLE ROW LEVEL SECURITY;

-- Basic policies (allow authenticated users)
CREATE POLICY railway_capacity_all ON railway_daily_capacity FOR ALL USING (TRUE);
CREATE POLICY railway_requests_all ON railway_requests FOR ALL USING (TRUE);
CREATE POLICY port_capacity_all ON port_daily_capacity FOR ALL USING (TRUE);
CREATE POLICY port_requests_all ON port_schedule_requests FOR ALL USING (TRUE);

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Railway and Port portal schema created successfully!';
  RAISE NOTICE 'Tables created: railway_daily_capacity, railway_requests,';
  RAISE NOTICE '               port_daily_capacity, port_schedule_requests';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Create Railway and Port user profiles';
  RAISE NOTICE '2. Implement Railway and Port portal pages';
  RAISE NOTICE '3. Add hooks to create requests when port is selected';
END $$;
