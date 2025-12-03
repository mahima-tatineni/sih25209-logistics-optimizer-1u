-- Insert demo users for all roles
-- Password for all users: "password" (hashed using bcrypt)
-- In production, use proper password hashing

INSERT INTO users (email, password_hash, name, role, assigned_location, plant_id, port_id) VALUES
  -- Plant Admins (one for each plant)
  ('plant.bhilai@sail.in', '$2a$10$rZJ6RZxGJEKPCKK5JQxQkOYl7uFmxX5L3xQvJ9yF5WqH3xZQfJ9yG', 'Ravi Kumar', 'PlantAdmin', 'Bhilai', 'BSP', NULL),
  ('plant.durgapur@sail.in', '$2a$10$rZJ6RZxGJEKPCKK5JQxQkOYl7uFmxX5L3xQvJ9yF5WqH3xZQfJ9yG', 'Amit Sharma', 'PlantAdmin', 'Durgapur', 'DSP', NULL),
  ('plant.rourkela@sail.in', '$2a$10$rZJ6RZxGJEKPCKK5JQxQkOYl7uFmxX5L3xQvJ9yF5WqH3xZQfJ9yG', 'Priya Singh', 'PlantAdmin', 'Rourkela', 'RSP', NULL),
  ('plant.bokaro@sail.in', '$2a$10$rZJ6RZxGJEKPCKK5JQxQkOYl7uFmxX5L3xQvJ9yF5WqH3xZQfJ9yG', 'Suresh Patil', 'PlantAdmin', 'Bokaro', 'BSL', NULL),
  ('plant.iisco@sail.in', '$2a$10$rZJ6RZxGJEKPCKK5JQxQkOYl7uFmxX5L3xQvJ9yF5WqH3xZQfJ9yG', 'Anjali Reddy', 'PlantAdmin', 'Burnpur', 'ISP', NULL),

  -- Port Admins (one for each port)
  ('port.vizag@sail.in', '$2a$10$rZJ6RZxGJEKPCKK5JQxQkOYl7uFmxX5L3xQvJ9yF5WqH3xZQfJ9yG', 'Vikram Rao', 'PortAdmin', 'Vizag', NULL, 'VIZAG'),
  ('port.paradip@sail.in', '$2a$10$rZJ6RZxGJEKPCKK5JQxQkOYl7uFmxX5L3xQvJ9yF5WqH3xZQfJ9yG', 'Kavita Nair', 'PortAdmin', 'Paradip', NULL, 'PARADIP'),
  ('port.kolkata@sail.in', '$2a$10$rZJ6RZxGJEKPCKK5JQxQkOYl7uFmxX5L3xQvJ9yF5WqH3xZQfJ9yG', 'Rajesh Ghosh', 'PortAdmin', 'Kolkata', NULL, 'KOLKATA'),
  ('port.dhamra@sail.in', '$2a$10$rZJ6RZxGJEKPCKK5JQxQkOYl7uFmxX5L3xQvJ9yF5WqH3xZQfJ9yG', 'Deepa Mohan', 'PortAdmin', 'Dhamra', NULL, 'DHAMRA'),
  ('port.haldia@sail.in', '$2a$10$rZJ6RZxGJEKPCKK5JQxQkOYl7uFmxX5L3xQvJ9yF5WqH3xZQfJ9yG', 'Arjun Das', 'PortAdmin', 'Haldia', NULL, 'HALDIA'),

  -- Procurement Admin
  ('procurement@sail.in', '$2a$10$rZJ6RZxGJEKPCKK5JQxQkOYl7uFmxX5L3xQvJ9yF5WqH3xZQfJ9yG', 'Sanjay Gupta', 'ProcurementAdmin', 'Head Office', NULL, NULL),
  ('procurement.coal@sail.in', '$2a$10$rZJ6RZxGJEKPCKK5JQxQkOYl7uFmxX5L3xQvJ9yF5WqH3xZQfJ9yG', 'Meena Iyer', 'ProcurementAdmin', 'Head Office', NULL, NULL),

  -- Logistics Team
  ('logistics@sail.in', '$2a$10$rZJ6RZxGJEKPCKK5JQxQkOYl7uFmxX5L3xQvJ9yF5WqH3xZQfJ9yG', 'Rahul Verma', 'LogisticsTeam', 'Head Office', NULL, NULL),
  ('logistics.marine@sail.in', '$2a$10$rZJ6RZxGJEKPCKK5JQxQkOYl7uFmxX5L3xQvJ9yF5WqH3xZQfJ9yG', 'Pooja Mishra', 'LogisticsTeam', 'Head Office', NULL, NULL),

  -- Railway Admin
  ('railway@sail.in', '$2a$10$rZJ6RZxGJEKPCKK5JQxQkOYl7uFmxX5L3xQvJ9yF5WqH3xZQfJ9yG', 'Anil Kumar', 'RailwayAdmin', 'Railway Coordination', NULL, NULL),

  -- System Admin
  ('admin@sail.in', '$2a$10$rZJ6RZxGJEKPCKK5JQxQkOYl7uFmxX5L3xQvJ9yF5WqH3xZQfJ9yG', 'System Administrator', 'SystemAdmin', 'IT Department', NULL, NULL),

  -- Demo account (can access all roles)
  ('demo@sail.in', '$2a$10$rZJ6RZxGJEKPCKK5JQxQkOYl7uFmxX5L3xQvJ9yF5WqH3xZQfJ9yG', 'Demo User', 'SystemAdmin', 'Demo', NULL, NULL)
ON CONFLICT (email) DO NOTHING;

COMMENT ON TABLE users IS 'Demo users - all passwords are "password"';
