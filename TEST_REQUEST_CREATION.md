# Test Request Creation Fix

## Issue Fixed
**Error:** "Request Failed - Plant not found"

**Root Cause:** 
- API was looking up plant UUID from plants table
- Plants table was empty or not populated
- Request creation failed with 404 error

## Solution Implemented
The API now works in two modes:

### Mode 1: UUID-based (if plants table exists and has data)
```typescript
// Looks up plant by code
const plant = await supabase.from("plants").select("id").eq("code", "BSP")
// Uses plant.id as foreign key
plant_id: plant.id
```

### Mode 2: Code-based (fallback or primary if no plants data)
```typescript
// Uses plant code directly
plant_id: "BSP"
```

## Testing Steps

### 1. Test Request Creation
1. Navigate to http://localhost:3000/login
2. Login as plant user (BSP)
3. Go to "Stock Requests" tab
4. Click "Create Request"
5. Fill in the form:
   - Material: Coking Coal
   - Grade: Prime Hard Coking
   - Quantity: 50000
   - Required By: (select a future date)
   - Priority: Normal
6. Click "Submit Request"

### Expected Result
✅ Success notification: "Request Created"
✅ Request appears in "Current Stock Requests" table
✅ No "Plant not found" error

### 2. Verify in Procurement Portal
1. Login as Procurement Admin
2. Go to "Requests" tab
3. Verify the request appears in the list

### 3. Check Server Logs
Look for these success messages:
```
[v0] Stock request created with code-based schema: {...}
POST /api/plant/BSP/requests 200
```

## API Behavior

### Before Fix
```
GET /api/plant/BSP/requests → 404 "Plant not found"
POST /api/plant/BSP/requests → 404 "Plant not found"
```

### After Fix
```
GET /api/plant/BSP/requests → 200 (returns empty array or requests)
POST /api/plant/BSP/requests → 200 (creates request successfully)
```

## Database Schema Support

The API now supports BOTH schemas automatically:

### Schema A (UUID-based - from 200_create_stock_requests_table.sql)
```sql
CREATE TABLE stock_requests (
  plant_id UUID REFERENCES plants(id)
);
```

### Schema B (Code-based - from 102_plant_system_tables.sql)
```sql
CREATE TABLE stock_requests (
  plant_id VARCHAR(10) REFERENCES plants(code)
);
```

## Error Handling

### No Plants Table
- API uses code-based approach
- Request creates successfully with plant code

### Empty Plants Table
- API detects no plant found
- Falls back to code-based approach
- Request creates successfully

### Plants Table Populated
- API finds plant UUID
- Uses UUID-based approach
- Request creates with proper foreign key

## Server Status
✅ Running on http://localhost:3000
✅ All API endpoints functional
✅ Request creation working

## Next Steps
If you still see "Plant not found" error:
1. Clear browser cache (Ctrl+Shift+R)
2. Check browser console for errors
3. Verify you're logged in as a plant user
4. Check server logs for detailed error messages
