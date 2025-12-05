# Immediate Next Steps to Fix and Implement Complete Workflow

## ✅ COMPLETED
1. Created comprehensive implementation plan (`COMPLETE_WORKFLOW_IMPLEMENTATION.md`)
2. Created complete database schema (`scripts/300_complete_workflow_schema.sql`)
3. Fixed request creation API to handle missing plants gracefully
4. Server is running on http://localhost:3000

## 🔧 TO FIX CURRENT ERROR

The current error "Plant configuration error" happens because:
- Database tables don't exist yet
- Need to run the migration script

### Option 1: Run Migration (RECOMMENDED)
```bash
# In Supabase SQL Editor, run:
scripts/300_complete_workflow_schema.sql
```

### Option 2: Quick Fix (Temporary)
The code now has a fallback that will work if `stock_requests` table exists with VARCHAR plant_id.

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Database Setup (30 minutes)
- [ ] Run `300_complete_workflow_schema.sql` in Supabase
- [ ] Verify all tables created
- [ ] Seed demo users (see script below)
- [ ] Test request creation works

### Phase 2: Role-Based Auth (1 hour)
- [ ] Update `lib/auth.tsx` to fetch role from profiles
- [ ] Create `lib/role-routing.ts` for redirects
- [ ] Update login to redirect based on role
- [ ] Test each role login

### Phase 3: Plant Portal (1 hour)
- [ ] Update request form to use `plant_requests` table
- [ ] Show requests list with new status values
- [ ] Add in-transit schedules view
- [ ] Test create request end-to-end

### Phase 4: Procurement Portal (2 hours)
- [ ] Create requests inbox component
- [ ] Create schedule creation form
- [ ] Link requests to schedules
- [ ] Add port/railway request forms

### Phase 5: Logistics Portal (2 hours)
- [ ] List schedules to route
- [ ] Connect port selection to `schedule_port_candidates`
- [ ] Create transport plan on port selection
- [ ] Add milestone tracking

### Phase 6: Port & Railway Portals (2 hours)
- [ ] Create port portal pages
- [ ] Create railway portal page
- [ ] Add response forms
- [ ] Connect to AI scenarios

### Phase 7: AI Scenarios (2 hours)
- [ ] Create scenario generation logic
- [ ] Display scenarios in logistics
- [ ] Auto-update on port/railway responses
- [ ] Show in plant/procurement views

### Phase 8: Polish (1 hour)
- [ ] Add tooltips to all fields
- [ ] Test complete workflow
- [ ] Fix any bugs
- [ ] Documentation

## 🚀 QUICK START COMMANDS

### 1. Seed Demo Users
```sql
-- Run in Supabase SQL Editor after creating tables
INSERT INTO profiles (id, email, role, plant_code, full_name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'plant.bhilai@sail.in', 'PLANT', 'BSP', 'Bhilai Plant Admin'),
  ('00000000-0000-0000-0000-000000000002', 'plant.rourkela@sail.in', 'PLANT', 'RSP', 'Rourkela Plant Admin'),
  ('00000000-0000-0000-0000-000000000003', 'procurement@sail.in', 'PROCUREMENT', NULL, 'Procurement Team'),
  ('00000000-0000-0000-0000-000000000004', 'logistics@sail.in', 'LOGISTICS', NULL, 'Logistics Team'),
  ('00000000-0000-0000-0000-000000000005', 'port.vizag@sail.in', 'PORT', NULL, 'Vizag Port Admin'),
  ('00000000-0000-0000-0000-000000000006', 'railway@sail.in', 'RAILWAY', NULL, 'Railway Manager'),
  ('00000000-0000-0000-0000-000000000007', 'admin@sail.in', 'ADMIN', NULL, 'System Admin')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role;

-- Update port_code for port users
UPDATE profiles SET port_code = 'VIZAG' WHERE email = 'port.vizag@sail.in';
UPDATE profiles SET port_code = 'PARA' WHERE email = 'port.paradip@sail.in';
```

### 2. Test Request Creation
1. Refresh browser (F5)
2. Try creating a request
3. Should now work with fallback method

### 3. Check Server Logs
```bash
# Look for these success messages:
[v0] Request created with fallback method
POST /api/plant/BSP/requests 200
```

## 📊 WORKFLOW DIAGRAM

```
PLANT (BSP)
  ↓ Creates Request
PLANT_REQUESTS (NEW)
  ↓ Procurement views
PROCUREMENT
  ↓ Creates Schedule
SCHEDULES (SENT_TO_LOGISTICS)
  ↓ Logistics evaluates
SCHEDULE_PORT_CANDIDATES
  ↓ Logistics selects port
TRANSPORT_PLANS + MILESTONES
  ↓ Port/Railway respond
PORT_RESPONSES + RAILWAY_RESPONSES
  ↓ AI generates scenarios
AI_SCENARIOS
  ↓ Updates visible to
PLANT + PROCUREMENT (read-only)
```

## 🎯 SUCCESS CRITERIA

- [ ] Plant can create request
- [ ] Procurement sees request
- [ ] Procurement creates schedule
- [ ] Logistics sees schedule
- [ ] Logistics selects port
- [ ] Transport plan created
- [ ] Port can respond
- [ ] Railway can respond
- [ ] AI scenarios generated
- [ ] Plant sees in-transit status

## 📝 CURRENT STATUS

**Server:** ✅ Running on http://localhost:3000
**Database:** ❌ Tables need to be created
**Request Creation:** ⚠️ Has fallback, needs proper tables
**Complete Workflow:** ❌ Not yet implemented

## 🔥 PRIORITY ACTIONS

1. **RIGHT NOW:** Run the migration script in Supabase
2. **NEXT:** Test request creation works
3. **THEN:** Implement role-based routing
4. **AFTER:** Build out each portal incrementally

Total estimated time: **12-15 hours** for complete implementation
