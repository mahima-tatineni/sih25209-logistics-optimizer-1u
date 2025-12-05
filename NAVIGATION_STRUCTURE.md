# Navigation Structure & Button Functions

## 🏠 Home Button

### Purpose
Takes users back to their role-specific home page based on their login.

### Behavior by Role

| Role | Home Destination | Description |
|------|-----------------|-------------|
| **Plant Admin** | `/plant/[plantCode]` | Plant-specific dashboard (BSP, RSP, etc.) |
| **Procurement** | `/procurement` | Procurement dashboard with requests |
| **Logistics** | `/logistics` | Logistics dashboard with schedules |
| **Port Admin** | `/port/[portCode]` | Port-specific dashboard |
| **Railway** | `/railway` | Railway dashboard |
| **Admin** | `/admin` | System admin dashboard |

### How It Works
```typescript
// Defined in lib/role-routing.ts
getHomeRouteForUser(user) {
  if (user.role === "LogisticsTeam") return "/logistics"
  if (user.role === "ProcurementAdmin") return "/procurement"
  // ... etc
}
```

## 📊 Logistics Navigation Buttons

### Updated Structure

**Before:**
- Dashboard
- Optimization (broken - just query param)

**After:**
- **Dashboard** - Main schedules view (current page)
- **Schedules** - Detailed schedules list
- **Tracking** - Active shipment tracking

### Button Functions

#### 1. Dashboard Button
- **Route:** `/logistics`
- **Purpose:** Main landing page for logistics team
- **Shows:**
  - ⏳ Pending Port Selection (schedules needing action)
  - ✅ Port Selected (completed optimizations)
  - 🚢 In Transit (active shipments)
- **Actions:** Select discharge port, view details

#### 2. Schedules Button
- **Route:** `/logistics/schedules`
- **Purpose:** Detailed view of all schedules
- **Shows:**
  - Complete schedule list
  - Filtering and search
  - Status tracking
  - Historical data
- **Actions:** View, filter, export

#### 3. Tracking Button
- **Route:** `/logistics/tracking`
- **Purpose:** Real-time shipment tracking
- **Shows:**
  - Active transport plans
  - Milestone progress
  - ETA updates
  - Delay alerts
- **Actions:** Update status, view timeline

## 🎯 Why This Structure?

### Dashboard (Home)
- **Quick overview** of what needs attention
- **Action-oriented** - shows pending tasks first
- **Status-based** organization (pending → completed → in-transit)

### Schedules
- **Comprehensive list** of all schedules
- **Search and filter** capabilities
- **Historical view** for reporting

### Tracking
- **Real-time monitoring** of active shipments
- **Milestone tracking** (sailed → arrived → discharged → delivered)
- **AI scenarios** and what-if analysis
- **Delay predictions** and alerts

## 🔄 User Flow

```
LOGISTICS USER LOGS IN
  ↓
LANDS ON DASHBOARD (/logistics)
  ↓
SEES PENDING SCHEDULES
  ↓
CLICKS "Select Discharge Port"
  ↓
GOES TO PORT SELECTION PAGE
  ↓
SELECTS OPTIMAL PORT
  ↓
RETURNS TO DASHBOARD
  ↓
SCHEDULE MOVES TO "PORT SELECTED" SECTION
  ↓
CLICKS "View Details" OR "Tracking" BUTTON
  ↓
SEES REAL-TIME TRACKING
```

## 🚀 Current Implementation Status

### ✅ Working
- Home button (role-based routing)
- Dashboard button (main schedules view)
- Port selection workflow
- Status-based organization

### 🔨 To Implement
- Schedules page (detailed list view)
- Tracking page (real-time monitoring)
- AI scenarios display
- Milestone tracking

## 💡 Recommendations

### Keep Dashboard Simple
- Focus on **actionable items**
- Show **pending tasks** prominently
- Use **color coding** for status

### Make Schedules Comprehensive
- Add **search** functionality
- Add **filters** (date, plant, status, port)
- Add **export** capability
- Show **historical data**

### Make Tracking Real-Time
- Show **live updates**
- Display **milestone timeline**
- Show **AI predictions**
- Alert on **delays**

## 📝 Next Steps

1. **Test Home Button**
   - Login as different roles
   - Click Home button
   - Verify correct destination

2. **Implement Schedules Page**
   - Create `/logistics/schedules/page.tsx`
   - Add search and filters
   - Show all schedules with details

3. **Implement Tracking Page**
   - Create `/logistics/tracking/page.tsx`
   - Add milestone timeline
   - Show AI scenarios
   - Real-time updates

4. **Add Breadcrumbs**
   - Show current location
   - Easy navigation back
   - Clear hierarchy

## 🎨 UI Improvements

### Dashboard
- ✅ Color-coded sections (amber, green, blue)
- ✅ Clear action buttons
- ✅ Status badges
- ⏳ Add quick stats cards

### Navigation
- ✅ Clear button labels
- ✅ Active state indication
- ⏳ Breadcrumb trail
- ⏳ Quick actions menu

### Tracking
- ⏳ Timeline visualization
- ⏳ Map view (optional)
- ⏳ Progress indicators
- ⏳ Alert notifications

## 🔧 Technical Notes

### Home Button Implementation
```typescript
// In portal-nav.tsx
const handleHomeClick = (e: React.MouseEvent) => {
  e.preventDefault()
  const homeRoute = getHomeRouteForUser(user)
  router.push(homeRoute)
}
```

### Navigation Links
```typescript
const portalLinks = {
  logistics: [
    { label: "Dashboard", href: "/logistics" },
    { label: "Schedules", href: "/logistics/schedules" },
    { label: "Tracking", href: "/logistics/tracking" },
  ]
}
```

### Status-Based Filtering
```typescript
// Pending schedules
schedules.filter(s => s.status === "SENT_TO_LOGISTICS")

// Completed schedules
schedules.filter(s => s.status === "PORT_SELECTED" || s.status === "optimized")

// In transit
schedules.filter(s => s.status === "IN_TRANSIT")
```

## ✅ Summary

**Home Button:** ✅ Works - takes you to role-specific home
**Dashboard Button:** ✅ Works - main schedules view
**Schedules Button:** 🔨 To be implemented - detailed list
**Tracking Button:** 🔨 To be implemented - real-time monitoring

The current dashboard serves as the main hub for logistics operations, with clear sections for different schedule statuses. Additional pages can be added for more detailed views and tracking capabilities.
