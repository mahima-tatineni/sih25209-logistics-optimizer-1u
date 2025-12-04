# 🔧 QUICK FIX - Request Creation Error

## The Problem
You're seeing: **"Request Failed - Failed to create request"**

## The Solution (2 minutes)
The database tables don't exist yet. Let's create them!

---

## 📋 Step-by-Step Fix

### 1️⃣ Open Supabase
```
🌐 Go to: https://supabase.com/dashboard
```

### 2️⃣ Find SQL Editor
```
Click: SQL Editor (in left sidebar)
Then: Click "New Query" button
```

### 3️⃣ Copy the SQL
```
📁 Open file: scripts/102_plant_system_tables.sql
📋 Copy ALL the code (Ctrl+A, Ctrl+C)
```

### 4️⃣ Paste and Run
```
📝 Paste into SQL Editor (Ctrl+V)
▶️  Click "Run" button
✅ Wait for "Success. No rows returned"
```

### 5️⃣ Test It
```
🔄 Refresh your app (Ctrl+F5)
🔐 Login: plant.bhilai@sail.in / password
📝 Go to: Stock Requests tab
➕ Click: Create Request
📤 Fill form and Submit
✅ Should work now!
```

---

## 🎯 Quick Copy-Paste

**Your Supabase Project:**
- URL: `https://gndzpmfdzvzlsdkjhtti.supabase.co`
- Project ID: `gndzpmfdzvzlsdkjhtti`

**Direct Link to SQL Editor:**
```
https://supabase.com/dashboard/project/gndzpmfdzvzlsdkjhtti/sql/new
```

---

## ✅ What Gets Created

After running the SQL, you'll have:

1. **stock_requests** table
   - Stores all plant requests
   - Tracks status (Pending → In Planning → Scheduled)

2. **plant_events** table
   - Logs stock receipts and consumption
   - Shows in Stock Movement History

3. **current_stock** table
   - Tracks real-time stock levels
   - Powers "Today's Snapshot"

4. **Initial data** for all 5 plants
   - BSP, DSP, RSP, BSL, ISP
   - Starting stock levels

---

## 🧪 After Migration Works

You'll be able to:
- ✅ Create stock requests (Coking Coal & Limestone)
- ✅ See requests in Home tab
- ✅ View stock movement history
- ✅ See dynamic "Today's Snapshot"
- ✅ Track request status
- ✅ Update stock levels

---

## ⚡ Super Quick Version

1. **Supabase Dashboard** → SQL Editor → New Query
2. **Copy** `scripts/102_plant_system_tables.sql`
3. **Paste** and **Run**
4. **Refresh** app and **test**

Done! 🎉

---

## 🆘 Still Not Working?

Check these:

**Browser Console (F12):**
- Look for red errors
- Screenshot and share

**Supabase SQL Editor:**
- Did you see "Success"?
- Any error messages?

**App Behavior:**
- Did you refresh after migration?
- Are you logged in as plant user?

---

## 💡 Pro Tip

After migration, you can:
- Create multiple requests
- Test with different materials (Coal & Limestone)
- Try different priorities (Normal, High, Critical)
- See them all in the Home tab

---

**Need help?** Just let me know what step you're stuck on! 🚀
