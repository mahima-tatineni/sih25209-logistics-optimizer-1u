# Plant System - Quick Start Guide

## 🚀 Setup (5 Minutes)

### 1. Run Database Migration
```bash
# Connect to your Supabase database and run:
psql -h your-db-host -U postgres -d your-database -f scripts/102_plant_system_tables.sql
```

Or use Supabase SQL Editor:
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `scripts/102_plant_system_tables.sql`
3. Click "Run"

### 2. Start the Application
```bash
# Terminal 1 - Backend
cd sih-25209
python backend/main.py

# Terminal 2 - Frontend
npm run dev
```

### 3. Open Browser
```
http://localhost:3000/login
```

---

## 🔐 Test Credentials

### Plant Users
```
Email: plant.bhilai@sail.in       → Goes to /plant/BSP (Bhilai)
Email: plant.durgapur@sail.in     → Goes to /plant/DSP (Durgapur)
Email: plant.rourkela@sail.in     → Goes to /plant/RSP (Rourkela)
Email: plant.bokaro@sail.in       → Goes to /plant/BSL (Bokaro)
Email: plant.iisco@sail.in        → Goes to /plant/ISP (IISCO)

Password: password (for all)
```

### Procurement User
```
Email: procurement@sail.in
Password: password
```

---

## ✅ Testing Workflow

### Test 1: Plant-Specific Login
1. Login as `plant.bhilai@sail.in`
2. Should redirect to `/plant/BSP`
3. Should show "Bhilai Steel Plant" in header
4. Should show Bhilai-specific stock data

5. Logout and login as `plant.durgapur@sail.in`
6. Should redirect to `/plant/DSP`
7. Should show "Durgapur Steel Plant" in header
8. Should show different stock data

✅ **Expected**: Each plant sees only their own data

---

### Test 2: Stock Updates
1. Login as any plant user
2. Go to "Stock Updates" tab
3. Add a receipt:
   - Event Type: Receipt
   - Material: Coking Coal
   - Quantity: 5000 tons
   - Rake ID: R-2025-001
4. Click "Submit"

✅ **Expected**: 
- Stock increases by 5000 tons
- Days cover recalculates
- Event logged in history

5. Add consumption:
   - Event Type: Consumption
   - Material: Coking Coal
   - Quantity: 3500 tons
6. Click "Submit"

✅ **Expected**:
- Stock decreases by 3500 tons
- Days cover recalculates
- Cannot go negative

---

### Test 3: Stock Request Creation
1. Login as `plant.bhilai@sail.in`
2. Go to "Stock Requests" tab
3. Click "Create Request"
4. Fill form:
   - Material: Coking Coal
   - Grade: Prime Hard Coking Coal
   - Quantity: 50000 tons
   - Required By: (select future date)
   - Current Days Cover: 15
   - Priority: High
   - Note: "Urgent requirement for blast furnace"
5. Click "Submit"

✅ **Expected**:
- Request created successfully
- Appears in plant's request list
- Status: "Pending"

---

### Test 4: Procurement View
1. Logout from plant account
2. Login as `procurement@sail.in`
3. Go to "Requests" tab

✅ **Expected**:
- See all requests from all plants
- See plant name, material, quantity, priority
- Can filter by plant, status, material

4. Click on a request
5. Update status to "In Planning"
6. Add comment: "Scheduling vessel for Feb delivery"
7. Save

✅ **Expected**:
- Status updated
- Comment saved
- Plant user can see updated status

---

### Test 5: Home Navigation
1. Login as any user
2. Click "Home" button in navigation

✅ **Expected**:
- Plant users → Go to their plant page
- Procurement → Go to /procurement
- Logistics → Go to /logistics
- **NOT logged out**

3. Click "Logout" button

✅ **Expected**:
- Session cleared
- Redirected to login page

---

### Test 6: Image Display
1. Login as any plant user
2. Check plant overview image

✅ **Expected**:
- Full image visible (not cropped)
- Image fits container properly
- No overflow or clipping

---

## 🐛 Troubleshooting

### Issue: "Table does not exist"
**Solution**: Run the migration script
```bash
psql -f scripts/102_plant_system_tables.sql
```

### Issue: "Cannot access /plant/BSP"
**Solution**: Check user has `plant_id` set in database
```sql
SELECT email, plant_id FROM users WHERE role = 'PlantAdmin';
```

### Issue: Stock not updating
**Solution**: Check API response in browser console
```javascript
// Should see successful response
{ success: true, event: {...} }
```

### Issue: Requests not visible to procurement
**Solution**: Check database
```sql
SELECT * FROM stock_requests ORDER BY created_at DESC;
```

---

## 📊 Database Queries

### Check Current Stock
```sql
SELECT * FROM current_stock WHERE location_type = 'plant';
```

### Check Plant Events
```sql
SELECT * FROM plant_events 
WHERE plant_id = 'BSP' 
ORDER BY date_time DESC 
LIMIT 10;
```

### Check Stock Requests
```sql
SELECT 
  sr.*,
  p.name as plant_name
FROM stock_requests sr
JOIN plants p ON sr.plant_id = p.code
ORDER BY sr.created_at DESC;
```

### Check User Plant Mapping
```sql
SELECT email, name, role, plant_id, port_id 
FROM users 
WHERE role IN ('PlantAdmin', 'PortAdmin');
```

---

## 🎯 Key Features

### 1. Plant-Specific Pages
- Each plant user sees only their plant's data
- URL: `/plant/{PLANT_CODE}`
- Automatic routing based on user's `plant_id`

### 2. Stock Management
- Receipt: Adds to stock
- Consumption: Subtracts from stock
- Prevents negative stock
- Auto-calculates days cover

### 3. Request Workflow
- Plant creates request
- Procurement sees all requests
- Procurement updates status
- Status flows back to plant

### 4. Navigation
- "Home" goes to role-specific page
- "Logout" clears session
- No accidental logouts

---

## 📝 API Endpoints

### Plant APIs
```
GET  /api/plant/BSP/stock           - Get Bhilai stock
POST /api/plant/BSP/stock           - Update Bhilai stock
GET  /api/plant/BSP/requests        - Get Bhilai requests
POST /api/plant/BSP/requests        - Create Bhilai request
```

### Procurement APIs
```
GET   /api/procurement/requests     - Get all requests
PATCH /api/procurement/requests     - Update request
```

---

## 🔄 Data Flow

```
Plant User Login
    ↓
Check plant_id in user record
    ↓
Route to /plant/{plant_id}
    ↓
Fetch plant-specific stock
    ↓
Display plant dashboard

Stock Update
    ↓
POST /api/plant/{plant_id}/stock
    ↓
Create event in plant_events
    ↓
Update current_stock table
    ↓
Return updated stock

Request Creation
    ↓
POST /api/plant/{plant_id}/requests
    ↓
Insert into stock_requests
    ↓
Status: Pending
    ↓
Visible to procurement immediately

Procurement View
    ↓
GET /api/procurement/requests
    ↓
Fetch all requests with plant details
    ↓
Display in requests inbox
    ↓
Update status
    ↓
PATCH /api/procurement/requests
    ↓
Status flows back to plant
```

---

## ✨ What's Fixed

1. ✅ Plant logins open correct plant pages
2. ✅ Stock updates work correctly
3. ✅ Requests created and visible to procurement
4. ✅ Home navigation doesn't log out
5. ✅ Images display fully
6. ✅ Plant-specific data isolation
7. ✅ Proper stock calculations

---

## 🚀 Ready to Test!

1. Run migration: `scripts/102_plant_system_tables.sql`
2. Start backend: `python backend/main.py`
3. Start frontend: `npm run dev`
4. Login as different plant users
5. Test stock updates and requests
6. Verify procurement can see all requests

**Everything should work perfectly!** 🎉
