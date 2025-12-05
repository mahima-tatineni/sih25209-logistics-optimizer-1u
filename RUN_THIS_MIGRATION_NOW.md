# 🚨 RUN THIS MIGRATION TO FIX THE ERROR

## Why the Error Keeps Happening

The database tables don't match what the code expects. The error will keep appearing until you run the migration.

## ✅ SOLUTION: Run Migration (5 minutes)

### Step 1: Open Supabase
1. Go to https://supabase.com
2. Open your project
3. Click "SQL Editor" in the left sidebar

### Step 2: Run the Migration
1. Click "New Query"
2. Copy the ENTIRE contents of `scripts/300_complete_workflow_schema.sql`
3. Paste into the SQL editor
4. Click "Run" button
5. Wait for "Success" message

### Step 3: Verify
You should see a success message like:
```
✅ Complete workflow schema created successfully!
Tables created: profiles, plant_requests, schedules, ...
```

### Step 4: Test
1. Refresh your browser (F5)
2. Try creating a request again
3. Should work now! ✅

## 🔄 Alternative: Use Mock Data (Temporary)

I've updated the code to create mock requests that work without the database.

**Current behavior:**
- Request appears to succeed
- Shows warning: "Request created in memory only"
- Data is NOT saved to database
- Will be lost on page refresh

**To make it permanent:**
- Run the migration above

## 📋 What the Migration Does

Creates these tables:
1. `profiles` - User roles (PLANT, PROCUREMENT, LOGISTICS, etc.)
2. `plant_requests` - Stock requests from plants
3. `schedules` - Import schedules from procurement
4. `schedule_port_candidates` - Port evaluation
5. `transport_plans` - Active shipment tracking
6. `transport_milestones` - Progress checkpoints
7. `ai_scenarios` - AI what-if analysis
8. `port_responses` - Port feedback
9. `railway_responses` - Railway capacity

## 🎯 Quick Copy-Paste

If you want to run just the essential tables:

```sql
-- Minimal schema to fix the error
CREATE TABLE IF NOT EXISTS plant_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_code TEXT NOT NULL,
  material TEXT NOT NULL,
  quantity_t NUMERIC NOT NULL,
  required_by_date DATE NOT NULL,
  priority TEXT NOT NULL DEFAULT 'MEDIUM',
  status TEXT NOT NULL DEFAULT 'NEW',
  grade TEXT,
  current_days_cover NUMERIC,
  note TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable access
ALTER TABLE plant_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY plant_requests_all ON plant_requests FOR ALL USING (TRUE);
```

Paste this in Supabase SQL Editor and click Run.

## ❓ Need Help?

If you can't access Supabase or don't have permissions:
1. The mock version will work for testing
2. Contact your database administrator
3. Or provide me with Supabase credentials to run it for you

## 🚀 After Migration

Once migration is complete:
1. Request creation will save to database
2. Requests will persist across page refreshes
3. Procurement can see plant requests
4. Complete workflow will be functional

**Current Status:** Mock mode (temporary)
**After Migration:** Full database persistence ✅
