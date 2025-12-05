# Logistics Data Synchronization Fix

## Problem
Schedules created in the procurement portal were not appearing in the logistics schedules inbox page, and tracking pages were not showing the correct schedule data.

## Root Cause
The application has multiple logistics pages fetching from different API endpoints:

1. **Main Logistics Page** (`/logistics`) - ✅ Fetches from `/api/procurement/schedules` (has mock data)
2. **Schedules Inbox Page** (`/logistics/schedules`) - ❌ Was fetching from `/api/schedules-full` (no mock data)
3. **Tracking Page** (`/logistics/tracking/[id]`) - ❌ Was fetching from `/api/schedules-full/${id}` (no mock data)

Since mock schedules are stored in `global.mockSchedules` via the `/api/procurement/schedules` endpoint, the other pages couldn't see them.

## Solution

### 1. Fixed Schedules Inbox Page
**File:** `app/logistics/schedules/page.tsx`

Changed `fetchSchedules()` to:
- Fetch from `/api/procurement/schedules` instead of `/api/schedules-full`
- Map schedule fields correctly (schedule_code, material, quantity_t, etc.)
- Convert status values (SENT_TO_LOGISTICS → "Pending Port Selection", PORT_SELECTED → "Port Selected")
- Remove fallback mock data (use empty array instead)

### 2. Fixed Tracking Detail Page
**File:** `app/logistics/tracking/[id]/page.tsx`

Changed `fetchScheduleDetails()` to:
- Fetch all schedules from `/api/procurement/schedules`
- Find the schedule with matching ID
- Fallback to `/api/schedules-full/${id}` if not found

Updated display fields to match mock data structure:
- `schedule.schedule_code` instead of `schedule.id.substring(0, 12)`
- `schedule.material` instead of `schedule.material_type`
- `schedule.quantity_t` instead of `schedule.quantity`
- `schedule.load_port_code` instead of `schedule.supplier_port_id`
- `schedule.selected_port` instead of `schedule.optimized_port_id`
- `schedule.cost_estimate_inr` for cost display

Updated milestone logic:
- Check `schedule.selected_port` for port selection completion
- Check `schedule.status === "IN_TRANSIT"` for sailing
- Check `schedule.status === "DELIVERED"` for arrival

Fixed navigation:
- "Back to Schedules" now goes to `/logistics` instead of `/logistics/schedules`

## Data Flow Now

```
Procurement Portal
    ↓
Creates Schedule → Stored in global.mockSchedules
    ↓
/api/procurement/schedules (GET) ← All logistics pages fetch from here
    ↓
├─ /logistics (Main page) ✅
├─ /logistics/schedules (Inbox) ✅
└─ /logistics/tracking/[id] (Detail) ✅
```

## Status Mapping

| Backend Status | Display Status |
|---------------|----------------|
| SENT_TO_LOGISTICS | Pending Port Selection |
| PORT_SELECTED | Port Selected |
| IN_TRANSIT | In Transit |
| DELIVERED | Completed |

## Field Mapping

| Mock Data Field | Display Field |
|----------------|---------------|
| schedule_code | Schedule ID |
| material | Material Type |
| quantity_t | Quantity |
| vessel_name | Vessel |
| load_port_code | Load Port |
| target_plant_code | Target Plant |
| selected_port | Discharge Port |
| cost_estimate_inr | Estimated Cost |

## Testing Checklist

✅ Create schedule in procurement portal
✅ Verify it appears in `/logistics` main page
✅ Verify it appears in `/logistics/schedules` inbox page
✅ Click "Select Discharge Port" - opens correct schedule
✅ Select a port - updates schedule status to PORT_SELECTED
✅ Verify updated schedule appears in "Port Selected" section
✅ Click "View Details" - opens tracking page with correct data
✅ Verify tracking page shows correct vessel, ports, quantity, cost
✅ Verify milestones reflect actual schedule status

## Files Modified

1. `app/logistics/schedules/page.tsx` - Fixed data fetching and mapping
2. `app/logistics/tracking/[id]/page.tsx` - Fixed data fetching and display fields
3. `app/api/procurement/schedules/[id]/route.ts` - Created PATCH endpoint (previous fix)

## Benefits

✅ All logistics pages now show consistent data
✅ Schedules created in procurement immediately visible in logistics
✅ Port selection updates reflect across all pages
✅ Tracking page shows accurate schedule information
✅ No more "No Schedules Found" when schedules exist
