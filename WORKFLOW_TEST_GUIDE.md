# Complete Workflow Test Guide

## ✅ What's Been Implemented

### 1. Plant → Procurement → Logistics Workflow

**Flow:**
1. Plant creates stock request
2. Procurement sees request
3. Procurement creates schedule with vessel details
4. Schedule sent to Logistics
5. Logistics selects discharge port (next step)

## 🧪 How to Test

### Step 1: Create Request (Plant Portal)
1. Login as plant user (e.g., BSP)
2. Go to "Stock Requests" tab
3. Click "Create Request"
4. Fill in:
   - Material: Coking Coal
   - Grade: Prime Hard Coking
   - Quantity: 25,000 tonnes
   - Required By: (future date)
   - Priority: Normal
5. Click "Submit Request"
6. ✅ Should see "Request Created" success message

### Step 2: View Request (Procurement Portal)
1. Login as procurement user
2. Go to "Requests" tab
3. ✅ Should see the request from BSP plant
4. Note the request details

### Step 3: Create Schedule (Procurement Portal)
1. In the Requests list, click the **Ship icon** (🚢) button
2. Schedule creation form opens with:
   - **Request Details** (read-only):
     - Plant: BSP
     - Material: COKING COAL
     - Quantity: 25,000 tonnes
     - Required By: (date)
     - Priority: Normal
   
3. Fill in **Vessel & Voyage Details**:
   - **Vessel Name**: MV Pacific Glory
   - **Load Port**: Gladstone, Australia
   - **Sailing Date**: (select a date)

4. Review "Next Steps" section:
   - Schedule will be sent to Logistics Team
   - Logistics will select discharge port
   - Target plant: BSP

5. Click "Create Schedule & Send to Logistics"
6. ✅ Should see success message with schedule code (e.g., SCH-2025-123456)

### Step 4: View Schedule (Logistics Portal)
1. Login as logistics user
2. Dashboard shows "Schedules for Port Selection"
3. ✅ Should see the schedule created by procurement
4. Schedule card shows:
   - Schedule ID: SCH-2025-XXXXXX
   - Vessel: MV Pacific Glory
   - Material: COKING COAL · 25,000t
   - Target Plant: BSP
   - Load Port: GLAD
   - Sailing Date: (date)
   - Required By: (date)
   - Status: SENT TO LOGISTICS

5. Click "Select Discharge Port" button
6. (Next step: Port selection page - to be implemented)

## 📊 Data Flow

```
PLANT REQUEST
  ↓
  id: mock-176
  plant_id: BSP
  material: COKING_COAL
  quantity_t: 25000
  status: NEW
  ↓
PROCUREMENT CREATES SCHEDULE
  ↓
  schedule_code: SCH-2025-123456
  vessel_name: MV Pacific Glory
  load_port_code: GLAD
  sailing_date: 2025-01-15
  target_plant_code: BSP
  status: SENT_TO_LOGISTICS
  linked_requests: [mock-176]
  ↓
REQUEST STATUS UPDATED
  ↓
  status: SCHEDULED
  assigned_schedule_id: schedule-123456
  ↓
LOGISTICS SEES SCHEDULE
  ↓
  Ready for port selection
```

## 🎯 Success Criteria

- [x] Plant can create request
- [x] Procurement sees request
- [x] Procurement can create schedule
- [x] Schedule includes vessel details
- [x] Schedule sent to logistics
- [x] Logistics sees schedule
- [ ] Logistics can select port (next)
- [ ] Port selection creates transport plan (next)

## 🔄 Current Status

**Working:**
- ✅ Plant request creation
- ✅ Request visible in procurement
- ✅ Schedule creation form
- ✅ Schedule sent to logistics
- ✅ Logistics dashboard

**Next to Implement:**
- Port selection page
- Transport plan creation
- Milestone tracking
- Port/Railway responses
- AI scenarios

## 💡 Tips

1. **Server Restart**: Mock data is lost when server restarts
2. **Create Fresh**: Always create a new request after server restart
3. **Check Console**: Look for success messages in browser console
4. **Notifications**: Green success notifications confirm actions

## 🐛 Troubleshooting

**Request not showing in procurement:**
- Refresh the page
- Check if server restarted (data lost)
- Create a new request

**Schedule not showing in logistics:**
- Refresh the logistics page
- Check if schedule was created successfully
- Look for success notification

**Form not opening:**
- Check browser console for errors
- Refresh the page
- Try clicking the ship icon again

## 📝 Notes

- All data is stored in server memory (temporary)
- Data persists until server restarts
- For permanent storage, run database migration
- See `RUN_THIS_MIGRATION_NOW.md` for migration instructions

## 🚀 Server Status

**Running:** http://localhost:3000
**Status:** Ready for testing
**Mode:** Mock data (temporary storage)
