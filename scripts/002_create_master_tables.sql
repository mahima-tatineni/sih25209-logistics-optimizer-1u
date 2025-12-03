-- Create plants table for SAIL's 5 integrated steel plants
CREATE TABLE IF NOT EXISTS plants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  state text NOT NULL,
  latitude numeric(9,6),
  longitude numeric(9,6),
  crude_capacity_mtpa numeric(6,2),
  annual_coking_import_t numeric(12,0),
  annual_limestone_import_t numeric(12,0),
  daily_coking_demand_t numeric(12,2),
  daily_limestone_demand_t numeric(12,2),
  min_days_cover numeric(5,2) DEFAULT 15,
  target_days_cover numeric(5,2) DEFAULT 30,
  created_at timestamptz DEFAULT now()
);

-- Create Indian discharge ports table
CREATE TABLE IF NOT EXISTS ports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  state text NOT NULL,
  type text NOT NULL,
  latitude numeric(9,6),
  longitude numeric(9,6),
  max_draft_m numeric(4,1),
  panamax_berths integer,
  annual_coal_capacity_mt numeric(7,2),
  storage_capacity_t numeric(12,0),
  free_storage_days integer DEFAULT 7,
  storage_charge_inr_t_day numeric(10,2),
  handling_charge_inr_t numeric(10,2),
  port_dues_inr_t numeric(10,2),
  created_at timestamptz DEFAULT now()
);

-- Create supplier ports table
CREATE TABLE IF NOT EXISTS supplier_ports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  country text NOT NULL,
  latitude numeric(9,6),
  longitude numeric(9,6),
  created_at timestamptz DEFAULT now()
);

-- Create vessels table
CREATE TABLE IF NOT EXISTS vessels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  max_cargo_t numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create rake types table
CREATE TABLE IF NOT EXISTS rake_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  wagons_per_rake integer,
  payload_per_wagon_t numeric(8,2),
  rake_capacity_t numeric(8,2),
  created_at timestamptz DEFAULT now()
);

-- Create rail routes table
CREATE TABLE IF NOT EXISTS rail_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  port_id uuid REFERENCES ports(id) ON DELETE CASCADE,
  plant_id uuid REFERENCES plants(id) ON DELETE CASCADE,
  distance_km numeric(7,1),
  rake_type_id uuid REFERENCES rake_types(id),
  max_rakes_per_day integer,
  created_at timestamptz DEFAULT now(),
  UNIQUE (port_id, plant_id)
);

-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_id uuid REFERENCES supplier_ports(id) ON DELETE CASCADE,
  indian_port_id uuid REFERENCES ports(id) ON DELETE CASCADE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create route waypoints table
CREATE TABLE IF NOT EXISTS route_waypoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid REFERENCES routes(id) ON DELETE CASCADE,
  seq_no integer NOT NULL,
  code text,
  description text,
  latitude numeric(9,6),
  longitude numeric(9,6)
);

-- Enable RLS on master tables
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE ports ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_ports ENABLE ROW LEVEL SECURITY;
ALTER TABLE vessels ENABLE ROW LEVEL SECURITY;
ALTER TABLE rake_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE rail_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_waypoints ENABLE ROW LEVEL SECURITY;

-- Create policies for master data (read-only for authenticated users)
CREATE POLICY "plants_select" ON plants FOR SELECT TO authenticated USING (true);
CREATE POLICY "ports_select" ON ports FOR SELECT TO authenticated USING (true);
CREATE POLICY "supplier_ports_select" ON supplier_ports FOR SELECT TO authenticated USING (true);
CREATE POLICY "vessels_select" ON vessels FOR SELECT TO authenticated USING (true);
CREATE POLICY "rake_types_select" ON rake_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "rail_routes_select" ON rail_routes FOR SELECT TO authenticated USING (true);
CREATE POLICY "routes_select" ON routes FOR SELECT TO authenticated USING (true);
CREATE POLICY "route_waypoints_select" ON route_waypoints FOR SELECT TO authenticated USING (true);
