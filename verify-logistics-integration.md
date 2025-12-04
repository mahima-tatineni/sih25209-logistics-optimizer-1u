# Logistics Integration Verification Checklist

## Pre-Flight Checks

### 1. Environment Setup
- [ ] `.env.local` contains `LOGISTICS_BACKEND_URL=http://localhost:8000`
- [ ] Python dependencies installed: `cd sih-25209 && pip install -r requirements.txt`
- [ ] Node dependencies installed: `pnpm install`

### 2. Database Setup
- [ ] Supabase database is accessible
- [ ] User `logistics.marine@sail.in` exists in users table
- [ ] User has role `LogisticsTeam`

## Backend Verification

### 1. Start Backend
```bash
cd sih-25209
python backend/main.py
```

### 2. Check Backend Health
```bash
curl http://localhost:8000/health
# Expected: {"ok": true}
```

### 3. Check Logistics Endpoints
```bash
# List schedules
curl http://localhost:8000/api/logistics/schedules

# Should return array of schedules like:
# [
#   {
#     "id": 1,
#     "schedule_id": "SCH-2024-001",
#     "material": "Iron Ore",
#     "quantity_tons": 75000,
#     ...
#   }
# ]
```

## Frontend Verification

### 1. Start Frontend
```bash
pnpm dev
```

### 2. Check Login Page
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Page loads without errors
- [ ] Demo credentials section shows logistics email

### 3. Test Login Flow
- [ ] Enter email: `logistics.marine@sail.in`
- [ ] Enter password: `password`
- [ ] Click "Sign In"
- [ ] Should redirect to `/logistics`
- [ ] Should then redirect to `/logistics/schedules`

### 4. Check Schedules Inbox
- [ ] Page loads without errors
- [ ] "Schedules Inbox" heading is visible
- [ ] Table displays schedules (or "No Schedules Found" message)
- [ ] Search and filter controls are present
- [ ] Statistics cards show counts

### 5. Test API Proxy
```bash
# With frontend running, test proxy
curl http://localhost:3000/api/logistics/schedules

# Should return same data as backend endpoint
```

### 6. Test Port Selection (if schedules exist)
- [ ] Click on a schedule row with status "Pending Port Selection"
- [ ] Should navigate to `/logistics/port-selection/[id]`
- [ ] Page loads without errors
- [ ] Port candidates are displayed
- [ ] Cost breakdown is visible
- [ ] Risk assessment is shown

### 7. Test Tracking (if port selected)
- [ ] Click on a schedule with status "Port Selected" or "In Transit"
- [ ] Should navigate to `/logistics/tracking/[id]`
- [ ] Page loads without errors
- [ ] Timeline is displayed
- [ ] What-if analysis panel is visible

## Access Control Verification

### 1. Test Unauthorized Access
- [ ] Logout (if logged in)
- [ ] Try to access `/logistics/schedules` directly
- [ ] Should redirect to `/login`

### 2. Test Other User Roles
- [ ] Login as different user (e.g., `plant.bhilai@sail.in`)
- [ ] Try to access `/logistics/schedules`
- [ ] Should redirect to `/login` or show unauthorized message

### 3. Test Logistics User Access
- [ ] Login as `logistics.marine@sail.in`
- [ ] Can access `/logistics/schedules` ✓
- [ ] Can access `/logistics/port-selection/[id]` ✓
- [ ] Can access `/logistics/tracking/[id]` ✓

## Integration Points Verification

### 1. API Proxy Routes Created
- [ ] `app/api/logistics/schedules/route.ts` exists
- [ ] `app/api/logistics/schedules/[id]/route.ts` exists
- [ ] `app/api/logistics/schedules/[id]/port-candidates/route.ts` exists
- [ ] `app/api/logistics/schedules/[id]/select-port/route.ts` exists
- [ ] `app/api/logistics/schedules/[id]/timeline/route.ts` exists
- [ ] `app/api/logistics/schedules/[id]/whatif/route.ts` exists
- [ ] `app/api/logistics/schedules/[id]/scenarios/route.ts` exists

### 2. Middleware Created
- [ ] `lib/middleware/logistics-guard.ts` exists
- [ ] Contains `canAccessLogistics()` function
- [ ] Contains `requireLogisticsAccess()` function

### 3. No sih-25209 Modifications
- [ ] `sih-25209/backend/main.py` unchanged
- [ ] `sih-25209/backend/logistics_models.py` unchanged
- [ ] `sih-25209/backend/ai_risk_engine.py` unchanged
- [ ] No controllers, services, or business logic modified

## Regression Testing

### 1. Other Users Unaffected
- [ ] Login as `plant.bhilai@sail.in` / `password`
- [ ] Redirects to `/plant-portal` (not `/logistics`)
- [ ] Plant portal functions normally

- [ ] Login as `procurement@sail.in` / `password`
- [ ] Redirects to `/procurement` (not `/logistics`)
- [ ] Procurement portal functions normally

- [ ] Login as `admin@sail.in` / `password`
- [ ] Redirects to `/admin` (not `/logistics`)
- [ ] Admin portal functions normally

### 2. Existing APIs Unaffected
- [ ] `/api/plants` still works
- [ ] `/api/ports` still works
- [ ] `/api/schedules` still works
- [ ] `/api/shipments` still works

## Performance Checks

### 1. Backend Response Time
```bash
time curl http://localhost:8000/api/logistics/schedules
# Should complete in < 1 second
```

### 2. Frontend Load Time
- [ ] Login page loads in < 2 seconds
- [ ] Schedules inbox loads in < 3 seconds
- [ ] Port selection page loads in < 3 seconds

### 3. API Proxy Overhead
```bash
# Direct backend call
time curl http://localhost:8000/api/logistics/schedules

# Proxied call
time curl http://localhost:3000/api/logistics/schedules

# Proxy should add < 100ms overhead
```

## Error Handling

### 1. Backend Down
- [ ] Stop backend: Kill Python process
- [ ] Try to access `/logistics/schedules`
- [ ] Should show "Backend connection failed" or graceful error
- [ ] Should not crash frontend

### 2. Invalid Schedule ID
- [ ] Navigate to `/logistics/port-selection/invalid-id`
- [ ] Should show error message or 404
- [ ] Should not crash application

### 3. Network Timeout
- [ ] Simulate slow network
- [ ] Should show loading state
- [ ] Should timeout gracefully after reasonable time

## Final Acceptance Criteria

- [ ] ✅ Login as `logistics.marine@sail.in` / `password` succeeds
- [ ] ✅ User redirected to `/logistics` → `/logistics/schedules`
- [ ] ✅ All logistics pages accessible and functional
- [ ] ✅ API calls proxied through `/api/logistics/*`
- [ ] ✅ Backend handles requests correctly
- [ ] ✅ Other users' behavior unchanged
- [ ] ✅ No regressions in existing features
- [ ] ✅ No sih-25209 internal files modified
- [ ] ✅ Only glue code (routing, auth, proxy) added

## Sign-Off

**Tested By**: _________________  
**Date**: _________________  
**Status**: [ ] PASS  [ ] FAIL  
**Notes**: _________________

---

## Quick Test Commands

```bash
# Test backend health
curl http://localhost:8000/health

# Test backend schedules
curl http://localhost:8000/api/logistics/schedules

# Test frontend proxy
curl http://localhost:3000/api/logistics/schedules

# Test login (requires jq)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"logistics.marine@sail.in","password":"password"}' | jq

# Check if backend is running
netstat -an | grep 8000

# Check if frontend is running
netstat -an | grep 3000
```

## Troubleshooting Guide

### Issue: Backend won't start
**Solution**: 
```bash
cd sih-25209
pip install -r requirements.txt
python backend/main.py
```

### Issue: Frontend won't start
**Solution**:
```bash
pnpm install
pnpm dev
```

### Issue: Login fails
**Solution**:
- Check Supabase connection in `.env.local`
- Verify user exists: Check `scripts/101_seed_demo_users.sql`
- Check browser console for errors

### Issue: API proxy returns 503
**Solution**:
- Ensure backend is running on port 8000
- Check `LOGISTICS_BACKEND_URL` in `.env.local`
- Verify backend health: `curl http://localhost:8000/health`

### Issue: Unauthorized access
**Solution**:
- Verify user role is `LogisticsTeam`
- Check `lib/middleware/logistics-guard.ts` logic
- Clear browser localStorage and login again
