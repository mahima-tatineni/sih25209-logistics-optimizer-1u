# 🚀 Database Migration Instructions

## Quick Steps to Fix "Request Failed" Error

The error is happening because the database tables don't exist yet. Follow these simple steps:

---

## ✅ Method 1: Supabase Dashboard (EASIEST - 2 minutes)

### Step 1: Open Supabase Dashboard
1. Go to: **https://supabase.com/dashboard**
2. Login to your account
3. Select your project: **gndzpmfdzvzlsdkjhtti**

### Step 2: Open SQL Editor
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button

### Step 3: Copy and Run SQL
1. Open the file: `scripts/102_plant_system_tables.sql`
2. Copy ALL the SQL code
3. Paste it into the SQL Editor
4. Click the **"Run"** button (or press Ctrl+Enter)

### Step 4: Verify Success
You should see:
```
Success. No rows returned
```

### Step 5: Test It
1. Go back to your app: http://localhost:3000
2. Refresh the page (Ctrl+F5)
3. Login as `plant.bhilai@sail.in` / `password`
4. Go to "Stock Requests" tab
5. Click "Create Request"
6. Fill the form and submit
7. ✅ Should work now!

---

## 📋 Method 2: Copy-Paste SQL (If you prefer)

If you don't want to open the file, just copy this SQL and paste it in Supabase SQL Editor:

```sql
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

CREATE TABLE IF NOT EXISTS current_stock (
  location_id VARCHAR(10) NOT NULL,
  location_type VARCHAR(10) NOT NULL CHECK (location_type IN ('plant', 'port')),
  material VARCHAR(20) NOT NULL CHECK (material IN ('coking_coal', 'limestone')),
  stock_t NUMERIC NOT NULL DEFAULT 0 CHECK (stock_t >= 0),
  days_cover NUMERIC,
  last_updated TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (location_id, location_type, material)
);

CREATE INDEX IF NOT EXISTS idx_stock_requests_plant ON stock_requests(plant_id);
CREATE INDEX IF NOT EXISTS idx_stock_requests_status ON stock_requests(status);
CREATE INDEX IF NOT EXISTS idx_stock_requests_created ON stock_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_plant_events_plant ON plant_events(plant_id);
CREATE INDEX IF NOT EXISTS idx_plant_events_date ON plant_events(date_time DESC);
CREATE INDEX IF NOT EXISTS idx_current_stock_location ON current_stock(location_id, location_type);

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
```

---

## 🎯 What This Does

1. **Creates 3 tables**:
   - `stock_requests` - Stores plant requests
   - `plant_events` - Logs stock movements
   - `current_stock` - Tracks current stock levels

2. **Adds indexes** for better performance

3. **Seeds initial data** for all 5 plants (BSP, DSP, RSP, BSL, ISP)

---

## ✅ After Running Migration

Your app will have:
- ✅ Working request creation
- ✅ Stock tracking for all plants
- ✅ Stock movement history
- ✅ Dynamic "Today's Snapshot"

---

## 🆘 Troubleshooting

### If you see "permission denied"
- Make sure you're logged into the correct Supabase account
- Check that you have admin access to the project

### If you see "relation already exists"
- That's OK! It means the table was already created
- The migration will skip existing tables

### If request creation still fails
1. Check browser console (F12) for errors
2. Make sure you refreshed the page after migration
3. Try logging out and logging back in

---

## 📞 Need Help?

If you're stuck, just:
1. Take a screenshot of any error
2. Let me know what step you're on
3. I'll help you fix it!

---

## 🎉 Summary

**To fix the "Request Failed" error:**

1. Go to https://supabase.com/dashboard
2. Open SQL Editor
3. Copy SQL from `scripts/102_plant_system_tables.sql`
4. Paste and Run
5. Refresh your app
6. Try creating a request again

**That's it!** Should take less than 2 minutes. 🚀
