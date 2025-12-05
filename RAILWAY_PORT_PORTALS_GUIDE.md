# Railway and Port Portals Implementation Guide

## Overview
This implementation adds dedicated portals for Railway and Port officials to manage daily capacity and respond to schedule requests from the Logistics team. When a port is selected for a schedule, requests are automatically created for both Railway and Port confirmation.

## Database Schema

### New Tables Created

#### 1. railway_daily_capacity
Daily rake availability per port-plant route.

**Fields:**
- `date` - Date for capacity
- `port_code` - Discharge port (VIZAG, PARA, DHAM, HALD, KOLK)
- `plant_code` - Target plant (BSP, RSP, BSL, DSP, ISP)
- `available_rakes` - Number of rakes available on this route
- `notes` - Optional notes

**Unique constraint:** (date, port_code, plant_code)

#### 2. railway_requests
Rake allocation requests created when port is selected.

**Fields:**
- `schedule_id` - Reference to schedule
- `port_code` - Selected discharge port
- `plant_code` - Target plant
- `required_rakes` - Calculated from quantity / 3500T per rake
- `required_window_start` - ETA at port (required_by_date - 15 days)
- `required_window_end` - Laydays end (required_by_date - 3 days)
- `status` - REQUESTED, CONFIRMED, PARTIAL, REJECTED, CLOSED
- `confirmed_start` - Railway confirmed start date
- `confirmed_end` - Railway confirmed end date
- `comment` - Railway notes

#### 3. port_daily_capacity
Daily port capacity and congestion data.

**Fields:**
- `date` - Date for capacity
- `port_code` - Port code
- `available_berths` - Number of berths available for SAIL
- `available_stockyard_t` - Free storage in tonnes
- `congestion_index` - 0-100 (0=no congestion, 100=severe)
- `notes` - Optional notes

**Unique constraint:** (date, port_code)

#### 4. port_schedule_requests
Berth and stockyard requests created when port is selected.

**Fields:**
- `schedule_id` - Reference to schedule
- `port_code` - Selected port
- `vessel_id`, `vessel_name` - Vessel details
- `material`, `quantity_t` - Cargo details
- `eta_port` - Estimated arrival date
- `laydays_end` - Laydays completion date
- `status` - REQUESTED, CONFIRMED, WINDOW_ADJUSTED, REJECTED, CLOSED
- `confirmed_window_start` - Port confirmed window start
- `confirmed_window_end` - Port confirmed window end
- `comment` - Port notes

## Automatic Request Creation

### When Port is Selected (Logistics)

When logistics selects a discharge port in `/logistics/port-selection/[id]`, the system automatically:

1. **Updates Schedule Status** to PORT_SELECTED
2. **Creates Railway Request:**
   - Calculates required_rakes = ceil(quantity_t / 3500)
   - Sets required_window_start = required_by_date - 15 days
   - Sets required_window_end = required_by_date - 3 days
   - Status = REQUESTED

3. **Creates Port Request:**
   - Copies vessel and cargo details
   - Sets eta_port and laydays_end
   - Status = REQUESTED

## Railway Portal

### Access
- **Role:** Railway
- **Email:** railway@sail.in
- **Routes:** `/railway`, `/railway/capacity`, `/railway/requests`

### Pages

#### 1. Railway Home (`/railway`)
**Features:**
- Today's total available rakes across all routes
- Count of pending schedule requests
- Quick links to capacity and requests pages
- Responsibilities overview

#### 2. Daily Capacity (`/railway/capacity`)
**Features:**
- Date picker (default: today)
- Grid of all 25 port-plant routes (5 ports × 5 plants)
- For each route:
  - Port → Plant label
  - Available rakes input (number)
  - Notes input (text)
- Save All button (upserts all routes for selected date)

**Usage:**
Railway officials update this daily to specify how many rakes they can provide per route.

#### 3. Schedule Requests (`/railway/requests`)
**Features:**
- Table of all railway_requests where status != CLOSED
- Columns: Schedule, Route, Required Rakes, Window, Status
- Click row → Detail dialog showing:
  - Schedule information
  - Required rakes and window
  - Status dropdown (REQUESTED, CONFIRMED, PARTIAL, REJECTED)
  - Confirmed start/end date inputs
  - Comment textarea
- Save updates the request

**Workflow:**
1. Railway official reviews request
2. Checks daily_capacity for that route during required window
3. Either confirms dates or adjusts/rejects with comments
4. System can trigger AI scenario recalculation (rail constraint)

## Port Portal

### Access
- **Role:** Port
- **Emails:** 
  - port.vizag@sail.in (VIZAG)
  - port.paradip@sail.in (PARA)
  - port.dhamra@sail.in (DHAM)
  - port.haldia@sail.in (HALD)
  - port.kolkata@sail.in (KOLK)
- **Routes:** `/port`, `/port/capacity`, `/port/requests`

**Note:** Port code is extracted from email (e.g., port.vizag@sail.in → VIZAG)

### Pages

#### 1. Port Home (`/port`)
**Features:**
- Today's snapshot: berths, stockyard, congestion, upcoming vessels
- Quick links to capacity and requests pages
- Responsibilities overview

#### 2. Daily Capacity (`/port/capacity`)
**Features:**
- Date picker (default: today)
- Form for that port only:
  - Available berths (number input)
  - Available stockyard capacity in tonnes (number input)
  - Congestion index (0-100 slider)
  - Notes (textarea)
- Save button (upserts for selected date and port)

**Usage:**
Port officials update this daily to specify berth/stockyard availability and congestion.

#### 3. Vessel Requests (`/port/requests`)
**Features:**
- Table of port_schedule_requests for this port where status != CLOSED
- Columns: Schedule, Vessel, Material & Quantity, ETA, Status
- Click row → Detail dialog showing:
  - Vessel and cargo information
  - ETA and laydays end
  - Status dropdown (REQUESTED, CONFIRMED, WINDOW_ADJUSTED, REJECTED)
  - Confirmed window start/end date inputs
  - Comment textarea
- Save updates the request

**Workflow:**
1. Port official reviews vessel request
2. Checks port_daily_capacity around ETA (±7 days)
3. Confirms berth window or adjusts dates based on availability
4. System can trigger AI scenario recalculation (port congestion/waiting time)

## API Endpoints

### Railway APIs

**GET /api/railway/capacity?date=YYYY-MM-DD**
- Returns railway_daily_capacity for specified date

**POST /api/railway/capacity**
- Upserts railway_daily_capacity (unique on date, port_code, plant_code)

**GET /api/railway/requests?status=REQUESTED**
- Returns railway_requests filtered by status

**POST /api/railway/requests**
- Creates new railway request

**PATCH /api/railway/requests/[id]**
- Updates railway request (status, confirmed dates, comment)

### Port APIs

**GET /api/port/capacity?date=YYYY-MM-DD&port_code=VIZAG**
- Returns port_daily_capacity for specified date and port

**POST /api/port/capacity**
- Upserts port_daily_capacity (unique on date, port_code)

**GET /api/port/requests?port_code=VIZAG&status=REQUESTED**
- Returns port_schedule_requests filtered by port and status

**POST /api/port/requests**
- Creates new port request

**PATCH /api/port/requests/[id]**
- Updates port request (status, confirmed window, comment)

## Integration with Existing System

### Minimal Changes to Existing Code

**Modified Files:**
- `app/logistics/port-selection/[id]/page.tsx` - Added request creation in `handlePortSelection`

**No Changes Required:**
- Authentication system (uses existing role-based auth)
- Plant, Procurement, Logistics pages (unchanged)
- Database schema for existing tables (only added new tables)

### Navigation

**Railway Role:**
- Home
- Daily Capacity
- Schedule Requests
- Logout

**Port Role:**
- Home
- Daily Capacity
- Vessel/Schedule Requests
- Logout

**Other Roles:** No access to Railway/Port pages

## AI Integration (Future Enhancement)

When Railway or Port officials update requests, the system can:

1. **Detect Changes:**
   - Railway confirms different dates → rail constraint
   - Port adjusts window → port congestion/waiting time

2. **Recalculate Scenarios:**
   - Update expected waiting time at port
   - Update expected rail transit delay
   - Recalculate demurrage and storage costs

3. **Create AI Scenarios:**
   - Write new rows to `ai_scenarios` table
   - Label: "Railway Constraint" or "Port Window Adjusted"
   - Show cost and time deltas

4. **Display in Logistics:**
   - Tracking page shows updated scenarios automatically
   - No manual input from logistics required

## Testing Checklist

### Railway Portal
- [ ] Login as railway@sail.in
- [ ] View home page with stats
- [ ] Update daily capacity for multiple routes
- [ ] View schedule requests
- [ ] Confirm a request with dates
- [ ] Reject a request with comment

### Port Portal
- [ ] Login as port.vizag@sail.in
- [ ] View home page with port-specific stats
- [ ] Update daily capacity (berths, stockyard, congestion)
- [ ] View vessel requests for VIZAG only
- [ ] Confirm a request with berth window
- [ ] Adjust window with comment

### Integration
- [ ] Create schedule in procurement
- [ ] Select port in logistics
- [ ] Verify railway request created automatically
- [ ] Verify port request created automatically
- [ ] Confirm request in railway portal
- [ ] Confirm request in port portal
- [ ] Verify logistics can see confirmations (future)

## Files Created

### Database
- `scripts/400_railway_port_schema.sql`

### Railway Portal
- `app/railway/page.tsx` - Home
- `app/railway/capacity/page.tsx` - Daily Capacity
- `app/railway/requests/page.tsx` - Schedule Requests

### Port Portal
- `app/port/page.tsx` - Home
- `app/port/capacity/page.tsx` - Daily Capacity
- `app/port/requests/page.tsx` - Vessel Requests

### APIs
- `app/api/railway/capacity/route.ts`
- `app/api/railway/requests/route.ts`
- `app/api/railway/requests/[id]/route.ts`
- `app/api/port/capacity/route.ts`
- `app/api/port/requests/route.ts`
- `app/api/port/requests/[id]/route.ts`

## Benefits

✅ Railway and Port officials can manage capacity independently
✅ Automatic request creation reduces manual coordination
✅ Structured data enables AI-driven delay prediction
✅ Logistics team gets realistic ETAs based on actual capacity
✅ Minimal changes to existing system
✅ Role-based access ensures data security
