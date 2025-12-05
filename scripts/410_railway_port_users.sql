-- Railway and Port User Accounts
-- Creates demo users for Railway and Port portals

-- Insert Railway user
INSERT INTO users (id, email, name, role, is_active, created_at)
VALUES (
  gen_random_uuid(),
  'railway@sail.in',
  'Railway Operations',
  'RailwayAdmin',
  true,
  NOW()
)
ON CONFLICT (email) DO UPDATE
SET role = 'RailwayAdmin', is_active = true;

-- Insert Port users
INSERT INTO users (id, email, name, role, port_id, is_active, created_at)
VALUES 
  (gen_random_uuid(), 'port.vizag@sail.in', 'Visakhapatnam Port', 'PortAdmin', 'VIZAG', true, NOW()),
  (gen_random_uuid(), 'port.paradip@sail.in', 'Paradip Port', 'PortAdmin', 'PARA', true, NOW()),
  (gen_random_uuid(), 'port.dhamra@sail.in', 'Dhamra Port', 'PortAdmin', 'DHAM', true, NOW()),
  (gen_random_uuid(), 'port.haldia@sail.in', 'Haldia Port', 'PortAdmin', 'HALD', true, NOW()),
  (gen_random_uuid(), 'port.kolkata@sail.in', 'Kolkata Port', 'PortAdmin', 'KOLK', true, NOW())
ON CONFLICT (email) DO UPDATE
SET role = 'PortAdmin', is_active = true;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Railway and Port users created successfully!';
  RAISE NOTICE 'Railway: railway@sail.in (password: password)';
  RAISE NOTICE 'Ports: port.vizag@sail.in, port.paradip@sail.in, etc. (password: password)';
END $$;
