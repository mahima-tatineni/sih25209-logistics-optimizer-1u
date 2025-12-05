# Plant Schedule Tracking with Map - Implementation

## Overview
Redesigned the Plant Schedule Tracking component to use a single map with a clickable schedule list, matching the logistics tracking dashboard pattern.

## Changes Made

### Before
- Multiple schedule cards stacked vertically
- No map visualization
- Each schedule showed details inline
- Cluttered interface with lots of scrolling

### After
- **Left Sidebar**: Clickable list of incoming shipments
- **Right Panel**: Single map + selected schedule details
- Clean, focused interface
- Map updates when clicking different schedules

## Component Structure

### Layout
```
┌─────────────────────────────────────────────────────┐
│  Plant Schedule Tracking                            │
├──────────────┬──────────────────────────────────────┤
│              │                                       │
│  Incoming    │     Shipment Route Map               │
│  Shipments   │     (with country boundaries)        │
│  (List)      │                                       │
│              ├──────────────────────────────────────┤
│  - SCH-001   │     Schedule Details                 │
│    30,000t   │     (Quantity, ETA, Code, Progress)  │
│    18/12/25  │                                       │
│              ├──────────────────────────────────────┤
│  - SCH-002   │     Progress Bar                     │
│    20,000t   │     (Visual progress indicator)      │
│    11/12/25  │                                       │
│              ├──────────────────────────────────────┤
│  - SCH-003   │     Journey Milestones               │
│    40,000t   │     (4-stage timeline)               │
│    06/12/25  │                                       │
│              │                                       │
└──────────────┴──────────────────────────────────────┘
```

### Left Sidebar - Schedule List
**Features**:
- Compact schedule cards
- Schedule code + vessel name
- Status badge (color-coded)
- Quantity + expected arrival date
- Click to select
- Highlighted when selected (primary border + background)
- Scrollable list (max-height with overflow)

**Visual States**:
- **Selected**: Primary border, light primary background
- **Hover**: Primary border (50% opacity), gray background
- **Default**: Gray border

### Right Panel - Map & Details

#### 1. Shipment Route Map
- Full-width map component
- Shows route from load port → discharge port → plant
- Country boundaries (India, Australia, Southeast Asia, Africa)
- Animated routes and vessel position
- Updates when different schedule is selected

#### 2. Schedule Details Card
**Header**:
- Vessel name (title)
- Route description (subtitle)
- Status badge (color-coded)

**Details Grid** (4 columns):
- Quantity (tonnes)
- Expected Arrival (date)
- Schedule Code
- Progress (percentage)

**Progress Bar**:
- Visual progress indicator
- Percentage label
- Color-coded by status

**Journey Milestones** (4 stages):
1. ✅ Schedule Created (always completed)
2. ✅ Port Selected (completed when port assigned)
3. 🚢 Vessel Sailed (completed when IN_TRANSIT)
4. ⚓ Expected Arrival (completed when DELIVERED)

## State Management

### Component State
```typescript
const [schedules, setSchedules] = useState<any[]>([])
const [selectedSchedule, setSelectedSchedule] = useState<any>(null)
const [loading, setLoading] = useState(true)
```

### Auto-Selection
```typescript
// Auto-select first schedule on load
if (plantSchedules.length > 0 && !selectedSchedule) {
  setSelectedSchedule(plantSchedules[0])
}
```

### Click Handler
```typescript
onClick={() => setSelectedSchedule(schedule)}
```

## Status Color Coding

```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case "PORT_SELECTED": return "bg-blue-100 text-blue-800"
    case "IN_TRANSIT": return "bg-purple-100 text-purple-800"
    case "DELIVERED": return "bg-green-100 text-green-800"
    default: return "bg-gray-100 text-gray-800"
  }
}
```

## Progress Calculation

```typescript
const getProgress = (status: string) => {
  switch (status) {
    case "PORT_SELECTED": return 25
    case "IN_TRANSIT": return 60
    case "DELIVERED": return 100
    default: return 0
  }
}
```

## Responsive Design

### Desktop (lg+)
- 3-column grid: 1 column list, 2 columns map/details
- Side-by-side layout
- Optimal use of screen space

### Tablet/Mobile
- Stacked layout
- List on top
- Map and details below
- Full-width components

## User Experience

### For Plant Teams
1. **Quick Overview**: See all incoming shipments at a glance
2. **Visual Tracking**: Click any schedule to see its route on map
3. **Progress Monitoring**: Track each shipment's progress
4. **ETA Visibility**: Know when materials will arrive
5. **Focused View**: One map, one schedule at a time

### Benefits
- ✅ **Cleaner Interface**: No clutter from multiple maps
- ✅ **Faster Loading**: Only one map rendered at a time
- ✅ **Better Focus**: Attention on selected shipment
- ✅ **Easy Switching**: Click to view different schedules
- ✅ **Consistent Experience**: Matches logistics tracking pattern

## Integration Points

### Plant Portal
**Location**: Schedule Tracking tab in plant portal

**Navigation**:
```
Plant Portal → Schedule Tracking Tab → List + Map View
```

**Data Source**:
- Fetches from `/api/procurement/schedules`
- Filters by `target_plant_code === plantId`
- Shows schedules with status: PORT_SELECTED, IN_TRANSIT, DELIVERED

## Performance Benefits

### Before (Multiple Cards)
- Multiple schedule cards rendered
- No map (but lots of DOM elements)
- Heavy scrolling required
- Cluttered interface

### After (List + Single Map)
- Compact list items
- One map rendered at a time
- Minimal scrolling
- Clean, focused interface

## Comparison with Logistics Dashboard

### Similarities
- Left sidebar with schedule list
- Right panel with map + details
- Click to select schedule
- Auto-select first schedule
- Same map component
- Similar layout structure

### Differences
- **Plant View**: Shows only schedules for specific plant
- **Simpler Milestones**: 4 stages vs 5 stages
- **No AI Scenarios**: Plant view focuses on tracking only
- **No Alerts**: Simplified view for plant operations

## Files Modified

### Modified Files
1. `components/plant/schedule-tracking.tsx` - Complete redesign

### Unchanged Files
- `components/tracking/ShipmentMap.tsx` - Reused existing component
- `app/api/schedules/[id]/map-data/route.ts` - Existing API endpoint

## Testing Checklist

- [x] Schedule list displays correctly
- [x] Clicking schedule updates map
- [x] Map shows correct route for selected schedule
- [x] Schedule details display correctly
- [x] Progress bar shows accurate percentage
- [x] Milestones display correctly
- [x] Status badges show correct colors
- [x] Auto-selects first schedule on load
- [x] Responsive layout works on mobile
- [x] No console errors
- [x] Smooth transitions between schedules

## User Feedback Expected

### Positive
- "Much cleaner interface!"
- "Easy to see where my materials are coming from"
- "Love the map visualization"
- "Quick to switch between shipments"

### Potential Concerns
- "Can I see multiple schedules at once?" → No, focused view is intentional
- "Where did the old cards go?" → Replaced with cleaner list + map

## Future Enhancements

1. **Search/Filter**: Add search box to filter schedule list
2. **Sort Options**: Sort by ETA, quantity, status
3. **Notifications**: Alert when shipment status changes
4. **Export**: Download schedule details as PDF
5. **Comparison**: View two schedules side-by-side
6. **Historical View**: Show past deliveries

---

**Implementation Date**: December 2025
**Status**: ✅ Complete and Production Ready
**User Experience**: Significantly Improved - Cleaner, Faster, More Focused
