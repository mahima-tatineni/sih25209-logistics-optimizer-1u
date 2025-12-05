# Port Selection Routing Fix

## Problem
When clicking "Select Discharge Port" on a schedule in the logistics portal, the port selection page was showing a different schedule instead of the clicked one.

## Root Cause
The port selection page was fetching data from `/api/schedules-full/${scheduleId}` which didn't have the mock schedule data. The mock schedules were stored in `global.mockSchedules` via the `/api/procurement/schedules` endpoint.

## Solution

### 1. Updated Port Selection Data Fetching
**File:** `app/logistics/port-selection/[id]/page.tsx`

Changed the `fetchScheduleAndPorts` function to:
- First fetch from `/api/procurement/schedules` (where mock data is stored)
- Find the schedule with matching ID
- Fallback to `/api/schedules-full/${scheduleId}` if not found
- Use the correct schedule data for port candidate generation

### 2. Created Schedule Update Endpoint
**File:** `app/api/procurement/schedules/[id]/route.ts`

New PATCH endpoint that:
- Updates schedule in `global.mockSchedules`
- Handles port selection updates
- Updates schedule status

### 3. Fixed Port Selection Handler
**File:** `app/logistics/port-selection/[id]/page.tsx`

Updated `handlePortSelection` to:
- Call `/api/procurement/schedules/${scheduleId}` PATCH endpoint
- Update schedule with selected port and status
- Redirect to `/logistics` (main logistics page)

### 4. Fixed Navigation
- Changed "Back to Schedules" button to go to `/logistics` instead of `/logistics/schedules`
- Updated "Send Back to Procurement" to use correct API endpoint

## How It Works Now

1. **User clicks "Select Discharge Port"** on schedule SCH-2025-888243
   - Navigates to `/logistics/port-selection/schedule-1733407363243`

2. **Port selection page loads**
   - Fetches all schedules from `/api/procurement/schedules`
   - Finds schedule with ID `schedule-1733407363243`
   - Uses that exact schedule's data (vessel, quantity, load port, target plant)

3. **Port candidates are generated**
   - Based on the actual schedule's vessel draft and quantity
   - Calculates feasibility for each Indian port
   - Shows optimized, feasible, and non-feasible ports

4. **User selects a port**
   - Updates the schedule via PATCH `/api/procurement/schedules/schedule-1733407363243`
   - Changes status to `PORT_SELECTED`
   - Stores selected port and cost estimate
   - Redirects back to logistics dashboard

## Testing

To test the fix:

1. Go to Procurement Portal
2. Create a schedule with specific vessel and quantity
3. Go to Logistics Portal
4. Click "Select Discharge Port" on that schedule
5. Verify the port selection page shows the correct schedule details
6. Verify port candidates are calculated based on that vessel's draft
7. Select a port and verify it updates correctly

## Files Modified

- `app/logistics/port-selection/[id]/page.tsx` - Fixed data fetching and routing
- `app/api/procurement/schedules/[id]/route.ts` - New PATCH endpoint for updates

## Key Changes

✅ Port selection now uses the correct schedule ID
✅ Schedule data is fetched from the right source (mock storage)
✅ Port candidates are generated based on actual vessel specifications
✅ Port selection updates the correct schedule
✅ Navigation flows correctly between pages
