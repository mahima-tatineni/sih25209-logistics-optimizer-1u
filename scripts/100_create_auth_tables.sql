-- Create users table for role-based authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role user_role_enum NOT NULL,
  assigned_location VARCHAR(50),
  plant_id VARCHAR(10),
  port_id VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY users_select_own ON users
  FOR SELECT
  USING (TRUE); -- For demo, allow all reads. In production, restrict to auth.uid()

-- Policy: Only system admins can insert/update users
CREATE POLICY users_manage ON users
  FOR ALL
  USING (TRUE); -- For demo purposes. In production, check role = 'SystemAdmin'

COMMENT ON TABLE users IS 'User authentication and role management for SAIL PortLink AI';
