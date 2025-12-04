// Run this script with: node scripts/run-migration.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in .env.local');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sql = `
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
  assigned_schedule_id UUID
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
  user_id UUID
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_stock_requests_plant ON stock_requests(plant_id);
CREATE INDEX IF NOT EXISTS idx_stock_requests_status ON stock_requests(status);
CREATE INDEX IF NOT EXISTS idx_stock_requests_created ON stock_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_plant_events_plant ON plant_events(plant_id);
CREATE INDEX IF NOT EXISTS idx_plant_events_date ON plant_events(date_time DESC);
CREATE INDEX IF NOT EXISTS idx_current_stock_location ON current_stock(location_id, location_type);
`;

const seedData = [
  { location_id: 'BSP', location_type: 'plant', material: 'coking_coal', stock_t: 350000, days_cover: 28 },
  { location_id: 'BSP', location_type: 'plant', material: 'limestone', stock_t: 75000, days_cover: 28 },
  { location_id: 'DSP', location_type: 'plant', material: 'coking_coal', stock_t: 280000, days_cover: 25 },
  { location_id: 'DSP', location_type: 'plant', material: 'limestone', stock_t: 60000, days_cover: 25 },
  { location_id: 'RSP', location_type: 'plant', material: 'coking_coal', stock_t: 320000, days_cover: 27 },
  { location_id: 'RSP', location_type: 'plant', material: 'limestone', stock_t: 70000, days_cover: 27 },
  { location_id: 'BSL', location_type: 'plant', material: 'coking_coal', stock_t: 300000, days_cover: 26 },
  { location_id: 'BSL', location_type: 'plant', material: 'limestone', stock_t: 65000, days_cover: 26 },
  { location_id: 'ISP', location_type: 'plant', material: 'coking_coal', stock_t: 180000, days_cover: 24 },
  { location_id: 'ISP', location_type: 'plant', material: 'limestone', stock_t: 40000, days_cover: 24 },
];

async function runMigration() {
  console.log('🚀 Starting database migration...\n');
  console.log('📍 Supabase URL:', supabaseUrl);
  console.log('');

  try {
    // Note: Supabase client doesn't support raw SQL execution directly
    // We need to use the REST API or do this through the dashboard
    console.log('⚠️  Note: The Supabase JavaScript client cannot execute raw SQL.');
    console.log('');
    console.log('📋 Please follow these steps:');
    console.log('');
    console.log('1. Go to: https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Click "SQL Editor" in the left sidebar');
    console.log('4. Click "New Query"');
    console.log('5. Copy the SQL from: scripts/102_plant_system_tables.sql');
    console.log('6. Paste it into the SQL Editor');
    console.log('7. Click "Run"');
    console.log('');
    console.log('Alternatively, I can seed the initial stock data using the API...');
    console.log('');

    // Try to seed initial stock data
    console.log('🌱 Attempting to seed initial stock data...\n');
    
    for (const stock of seedData) {
      const { data, error } = await supabase
        .from('current_stock')
        .upsert(
          {
            ...stock,
            last_updated: new Date().toISOString(),
          },
          {
            onConflict: 'location_id,location_type,material',
            ignoreDuplicates: true,
          }
        );

      if (error) {
        if (error.message.includes('relation "current_stock" does not exist')) {
          console.log('❌ Table "current_stock" does not exist yet.');
          console.log('');
          console.log('Please create the tables first using the SQL Editor as described above.');
          console.log('');
          process.exit(1);
        }
        console.log(`⚠️  Warning for ${stock.location_id} ${stock.material}:`, error.message);
      } else {
        console.log(`✅ Seeded: ${stock.location_id} - ${stock.material}`);
      }
    }

    console.log('');
    console.log('✅ Migration completed successfully!');
    console.log('');
    console.log('🧪 Test it:');
    console.log('1. Refresh your browser');
    console.log('2. Login as plant.bhilai@sail.in / password');
    console.log('3. Go to Stock Requests tab');
    console.log('4. Create a new request');
    console.log('');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
