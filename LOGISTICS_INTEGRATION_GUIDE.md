# Logistics Module Integration Guide

## Overview

This guide explains how the logistics team login is connected to the sih-25209 module without modifying its internal implementation.

## Architecture

```
Main Next.js App (Port 3000)
    ↓
Login System (Supabase Auth)
    ↓
Role-Based Routing
    ↓
Logistics Pages (/logistics/*)
    ↓
API Proxy Routes (/api/logistics/*)
    ↓
sih-25209 Python Backend (Port 8000)
```

## Authentication & User Setup

### Demo Credentials
- **Email**: `logistics.marine@sail.in`
- **Password**: `password`
- **Role**: `LogisticsTeam`

### User Database
The user is already seeded in the database via `scripts/101_seed_demo_users.sql`:
```sql
('logistics.marine@sail.in', '$2a$10$...', 'Pooja Mishra', 'LogisticsTeam', 'Head Office', NULL, NULL)
```

## Login Flow

1. User enters credentials at `/login`
2. Auth system validates against Supabase users table
3. On success, `lib/auth.tsx` stores user data
4. `lib/role-routing.ts` determines redirect based on role:
   - `LogisticsTeam` → `/logistics`
5. `/logistics` page redirects to `/logistics/schedules` (Schedules Inbox)

## Logistics Pages

### 1. Schedules Inbox (`/logistics/schedules`)
- Lists import schedules from procurement
- Filters by status (Pending Port Selection, Port Selected, In Transit, Completed)
- Click row to navigate to Port Selection or Tracking

### 2. Port Selection (`/logistics/port-selection/[id]`)
- Shows feasible and non-feasible ports
- Displays cost breakdown and risk assessment
- Highlights optimized port recommendation
- Allows port selection

### 3. Tracking & Timeline (`/logistics/tracking/[id]`)
- End-to-end shipment tracking
- Timeline visualization
- What-if scenario analysis

## API Proxy Routes

All logistics API calls are proxied to the sih-25209 backend:

| Frontend Route | Backend Route | Method | Purpose |
|---------------|---------------|--------|---------|
| `/api/logistics/schedules` | `/api/logistics/schedules` | GET | List all schedules |
| `/api/logistics/schedules/[id]` | `/api/logistics/schedules/{id}` | GET | Get schedule details |
| `/api/logistics/schedules/[id]/port-candidates` | `/api/logistics/schedules/{id}/port-candidates` | GET | Evaluate ports |
| `/api/logistics/schedules/[id]/select-port` | `/api/logistics/schedules/{id}/select-port` | POST | Select port |
| `/api/logistics/schedules/[id]/timeline` | `/api/logistics/schedules/{id}/timeline` | GET | Get timeline |
| `/api/logistics/schedules/[id]/whatif` | `/api/logistics/schedules/{id}/whatif` | POST | Create scenario |
| `/api/logistics/schedules/[id]/scenarios` | `/api/logistics/schedules/{id}/scenarios` | GET | List scenarios |

## Security & Access Control

### Route Protection
All `/logistics/*` pages check:
```typescript
if (!isAuthenticated || user?.role !== "LogisticsTeam") {
  router.push("/login")
}
```

### Middleware Guard
`lib/middleware/logistics-guard.ts` provides:
```typescript
canAccessLogistics(user) // Returns boolean
requireLogisticsAccess(user) // Throws error if unauthorized
```

### Access Rules
- User must be authenticated
- User role must be `LogisticsTeam` OR
- User email must be `logistics.marine@sail.in` OR
- User role must be `SystemAdmin`

## Running the System

### 1. Start the sih-25209 Backend
```bash
cd sih-25209
python backend/main.py
# or
./run_backend.bat  # Windows
./run_backend.sh   # Linux/Mac
```

Backend runs on: `http://localhost:8000`

### 2. Start the Main Next.js App
```bash
pnpm install
pnpm dev
```

Frontend runs on: `http://localhost:3000`

### 3. Login
1. Navigate to `http://localhost:3000/login`
2. Enter:
   - Email: `logistics.marine@sail.in`
   - Password: `password`
3. You'll be redirected to `/logistics/schedules`

## Environment Configuration

`.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://gndzpmfdzvzlsdkjhtti.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Logistics Backend (sih-25209 Python FastAPI)
LOGISTICS_BACKEND_URL=http://localhost:8000
```

## What Was NOT Modified

### sih-25209 Module (Untouched)
- ❌ No changes to `backend/main.py`
- ❌ No changes to `backend/logistics_models.py`
- ❌ No changes to `backend/ai_risk_engine.py`
- ❌ No changes to any controllers, services, or business logic

### What WAS Added

#### API Proxy Routes (New Files)
- ✅ `app/api/logistics/schedules/route.ts`
- ✅ `app/api/logistics/schedules/[id]/route.ts`
- ✅ `app/api/logistics/schedules/[id]/port-candidates/route.ts`
- ✅ `app/api/logistics/schedules/[id]/select-port/route.ts`
- ✅ `app/api/logistics/schedules/[id]/timeline/route.ts`
- ✅ `app/api/logistics/schedules/[id]/whatif/route.ts`
- ✅ `app/api/logistics/schedules/[id]/scenarios/route.ts`

#### Middleware & Guards (New Files)
- ✅ `lib/middleware/logistics-guard.ts`

#### Configuration (Modified)
- ✅ `.env.local` - Added `LOGISTICS_BACKEND_URL`

#### Existing Files (Already Present)
- ✅ `app/logistics/page.tsx` - Entry point
- ✅ `app/logistics/schedules/page.tsx` - Schedules inbox
- ✅ `app/logistics/port-selection/[id]/page.tsx` - Port selection
- ✅ `app/logistics/tracking/[id]/page.tsx` - Tracking & timeline
- ✅ `lib/auth.tsx` - Auth context (already has LogisticsTeam support)
- ✅ `lib/role-routing.ts` - Role routing (already has LogisticsTeam → /logistics)
- ✅ `scripts/101_seed_demo_users.sql` - User seeding (already has logistics.marine)

## Testing the Integration

### 1. Verify Backend is Running
```bash
curl http://localhost:8000/health
# Should return: {"ok": true}
```

### 2. Test Login
1. Go to `http://localhost:3000/login`
2. Login with `logistics.marine@sail.in` / `password`
3. Should redirect to `/logistics/schedules`

### 3. Test API Proxy
```bash
curl http://localhost:3000/api/logistics/schedules
# Should return list of schedules from backend
```

### 4. Test Port Selection
1. Click on any schedule in the inbox
2. Should navigate to `/logistics/port-selection/[id]`
3. Should display port candidates with cost breakdown

### 5. Test Tracking
1. Select a port for a schedule
2. Should navigate to `/logistics/tracking/[id]`
3. Should display timeline and what-if analysis

## Troubleshooting

### Backend Connection Failed
- **Error**: "Backend connection failed" (503)
- **Solution**: Ensure sih-25209 backend is running on port 8000
- **Check**: `curl http://localhost:8000/health`

### Unauthorized Access
- **Error**: Redirected to `/login`
- **Solution**: Ensure you're logged in with correct credentials
- **Check**: User role is `LogisticsTeam` or email is `logistics.marine@sail.in`

### Port Already in Use
- **Error**: Backend fails to start (port 8000 in use)
- **Solution**: Kill existing process or change port in `.env.local`

### CORS Errors
- **Error**: CORS policy blocking requests
- **Solution**: Backend already has CORS middleware configured for `*`

## Future Enhancements

### Converting to Real User/Role Model
Currently, the logistics user is hard-coded. To convert to a real role-based system:

1. **Database Schema**: Add `role` column to users table (already exists)
2. **Role Assignment**: Update user records with `role = 'LogisticsTeam'`
3. **Remove Email Check**: Update `logistics-guard.ts` to only check role
4. **Multiple Users**: Seed multiple logistics users with same role

### Adding More Logistics Users
```sql
INSERT INTO users (email, password_hash, name, role, assigned_location)
VALUES 
  ('logistics.user2@sail.in', '$2a$10$...', 'User Name', 'LogisticsTeam', 'Head Office'),
  ('logistics.user3@sail.in', '$2a$10$...', 'User Name', 'LogisticsTeam', 'Head Office');
```

### Scaling the Backend
- Deploy sih-25209 backend to a separate server
- Update `LOGISTICS_BACKEND_URL` to production URL
- Add authentication tokens between frontend and backend
- Implement rate limiting and caching

## Acceptance Criteria ✅

- ✅ Logging in as `logistics.marine@sail.in` / `password` succeeds
- ✅ User is redirected to `/logistics` then `/logistics/schedules`
- ✅ All logistics pages are accessible
- ✅ API calls go through `/api/logistics/*` proxy routes
- ✅ Backend functions in sih-25209 handle requests
- ✅ Other users' behavior is unchanged
- ✅ No internal business logic files in sih-25209 were modified
- ✅ Only glue code (routing, auth checks, proxy) was added

## Summary

The logistics module integration is complete with clean separation:
- **Main app** handles authentication and routing
- **API proxy routes** forward requests to sih-25209 backend
- **sih-25209 module** remains untouched and self-contained
- **Logistics user** can access all functionality without breaking existing features
