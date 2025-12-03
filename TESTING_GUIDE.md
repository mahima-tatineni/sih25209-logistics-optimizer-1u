# SAIL PortLink AI - Complete Testing Guide

## Overview
This document provides comprehensive testing instructions for all role-based portals in the SAIL PortLink AI system.

## Demo Credentials

All demo accounts use password: **`password`**

### Plant Admins (5 accounts)
- **plant.bhilai@sail.in** → Bhilai Steel Plant
- **plant.durgapur@sail.in** → Durgapur Steel Plant
- **plant.rourkela@sail.in** → Rourkela Steel Plant
- **plant.bokaro@sail.in** → Bokaro Steel Plant
- **plant.iisco@sail.in** → IISCO Steel Plant

### Port Admins (5 accounts)
- **port.vizag@sail.in** → Visakhapatnam Port
- **port.paradip@sail.in** → Paradip Port
- **port.kolkata@sail.in** → Kolkata Port
- **port.dhamra@sail.in** → Dhamra Port
- **port.haldia@sail.in** → Haldia Port

### Other Roles
- **procurement@sail.in** → Procurement Admin
- **logistics@sail.in** → Logistics Team
- **railway@sail.in** → Railway Admin
- **admin@sail.in** → System Admin
- **demo@sail.in** → System Admin (alternative demo account)

## Testing Each Portal

### 1. Plant Admin Portal (/plant-portal)
**Login as:** plant.bhilai@sail.in

**Features to Test:**
- ✅ Dashboard with plant overview and current stock levels
- ✅ Stock Updates tab - Record rake receipts and consumption
- ✅ Stock Requests tab - Create new replenishment requests
- ✅ Schedule Tracking tab - Monitor incoming shipments
- ✅ Real-time data updates (5-second refresh)
- ✅ Low stock alerts and notifications
- ✅ Upcoming arrivals display

**Test Scenario:**
1. View current coking coal and limestone stock levels
2. Submit a stock consumption entry
3. Create a new stock request with priority level
4. Monitor the request status in requests list
5. Check upcoming vessel/rake arrivals

### 2. Procurement Admin Portal (/procurement)
**Login as:** procurement@sail.in

**Features to Test:**
- ✅ Dashboard with inventory snapshot across all plants
- ✅ Inventory Monitor tab - View plant and port stock levels
- ✅ Plant Requests tab - Review pending stock requests
- ✅ Vessel Planning tab - Create new vessel schedules
- ✅ Schedules tab - Manage draft and confirmed schedules
- ✅ Real-time stock data sync (10-second refresh)

**Test Scenario:**
1. Review pending stock requests from all plants
2. Check current inventory levels at plants and ports
3. Create a new vessel schedule with supplier port selection
4. Link vessel to specific plant requests
5. Confirm and send schedule to logistics

### 3. Logistics Team Portal (/logistics)
**Login as:** logistics@sail.in

**Features to Test:**
- ✅ Dashboard with KPIs and pending schedules
- ✅ Optimization Console - Run Quick Heuristic or Detailed MILP optimization
- ✅ Route Analysis tab - View cost breakdown by route
- ✅ Live Tracking tab - Monitor vessel positions and ETAs
- ✅ Cost Breakdown tab - Analyze all-in costs by component
- ✅ Fastest real-time refresh (5-second updates)
- ✅ Port congestion alerts

**Test Scenario:**
1. View all pending schedules awaiting optimization
2. Run Quick Heuristic optimization
3. View optimized routes and cost improvements
4. Monitor vessel positions on live tracking
5. Analyze cost breakdown showing ocean, port, and rail components

### 4. Port Admin Portal (/port-portal)
**Login as:** port.vizag@sail.in

**Features to Test:**
- ✅ Dashboard with port overview
- ✅ Vessel Operations tab - Manage vessel schedules and discharge progress
- ✅ Yard Inventory tab - Monitor port storage levels
- ✅ Schedules tab - View upcoming vessel arrivals
- ✅ Real-time stock updates (10-second refresh)
- ✅ Congestion score and berth utilization

**Test Scenario:**
1. View scheduled vessel arrivals
2. Update vessel status (arrival, berthing, discharge)
3. Monitor yard storage capacity utilization
4. Check stock levels by material type
5. View discharge progress and ETA adjustments

### 5. Railway Admin Portal (/railway)
**Login as:** railway@sail.in

**Features to Test:**
- ✅ Dispatch Board - View all rake requirements by date
- ✅ Rake Planning tab - Allocate rakes to specific routes
- ✅ Tracking tab - Monitor rake positions and transit status
- ✅ Capacity indicators by route
- ✅ Real-time tracking data (10-second refresh)

**Test Scenario:**
1. Review rake requirements by destination plant
2. Allocate available rakes to pending requirements
3. Monitor rake transit progress
4. Update rake status as they move between ports and plants
5. Check capacity utilization on high-demand routes

### 6. System Admin Portal (/admin)
**Login as:** admin@sail.in

**Features to Test:**
- ✅ Overview tab - System health and metrics
- ✅ Users tab - View and manage system users
- ✅ System tab - Database and API configuration
- ✅ Logs tab - View recent system activity
- ✅ Real-time monitoring (15-second refresh)
- ✅ Alert and warning display

**Test Scenario:**
1. Review system health status
2. Check all active users and their roles
3. View recent system logs and activities
4. Check configuration settings
5. Monitor system performance metrics

## Real-time Features Testing

### Stock Updates
- Plant stocks update when rake receipts are recorded
- Port stocks update when vessels discharge
- Days-of-cover calculation refreshes automatically
- Low stock alerts trigger when below thresholds

### Notifications
- Stock alerts appear in notification center (top-right)
- Multiple alerts stack and can be dismissed individually
- Critical alerts show in red, warnings in yellow
- Auto-dismiss after 5 seconds (customizable per notification)

### Data Sync
Each portal has appropriate refresh intervals:
- **Plant Portal**: 5 seconds
- **Procurement Portal**: 10 seconds
- **Logistics Portal**: 5 seconds (fastest for optimization)
- **Port Portal**: 10 seconds
- **Railway Portal**: 10 seconds
- **Admin Portal**: 15 seconds (system-wide metrics)

## Navigation Testing

All portals include:
- **Portal Nav** component at top with role-appropriate links
- **Home** button to return to homepage
- **Logout** button with proper session cleanup
- Portal-specific sub-navigation (tabs within each page)

**Test Navigation Flow:**
1. Login to any portal
2. Verify PortalNav shows correct portal name
3. Click Home button → should return to public homepage
4. Login again to same portal
5. Click Logout → should clear session and redirect to login page
6. Attempt to access portal directly → should redirect to login

## API Routes Testing

Verify these backend API endpoints are working:

\`\`\`bash
# Stock data
GET /api/stock-snapshot

# Schedules and shipments
GET /api/schedules
GET /api/shipments

# Plant and port events
GET /api/plant-events
GET /api/port-events

# Stock status
GET /api/plant/current-stock
GET /api/port/current-stock

# Port operations
GET /api/port/status
\`\`\`

## Error Handling Testing

**Test scenarios:**
1. Network timeout - Notifications show error state
2. Invalid login - Proper error message displayed
3. Unauthorized access - Redirect to /unauthorized
4. Session timeout - Automatic redirect to login
5. Component data fetch failure - Fallback to mock data

## Performance Testing

- Initial load should complete within 3 seconds
- Real-time updates should refresh within configured interval
- Notification animations should be smooth (60fps)
- Portal navigation should be instant (no loading states)

## Conclusion

All 6 role-based portals are fully functional with:
- Role-based authentication and authorization
- Real-time data synchronization
- Comprehensive notification system
- Unified portal navigation
- Complete backend API integration
- Responsive design for all screen sizes

Test each portal with the provided credentials and follow the scenarios for a complete system validation.
