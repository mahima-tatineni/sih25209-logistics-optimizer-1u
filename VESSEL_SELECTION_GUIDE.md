# Vessel Selection System

## Overview
The procurement schedule creation form now includes a **vessel dropdown** that intelligently filters vessels based on their draft compatibility with Indian discharge ports.

## Vessel Filtering Logic

### Requirement
Only vessels whose draft allows them to access **at least 2 Indian ports** are shown in the dropdown.

### Port Depth Specifications
- **VIZAG** (Visakhapatnam): 18.0m - Deepest port
- **DHAM** (Dhamra): 16.0m
- **PARA** (Paradip): 14.5m
- **HALD** (Haldia): 12.0m
- **KOLK** (Kolkata): 11.5m - Shallowest port

### Vessel Master Data
The system includes 8 vessels with varying specifications:

| Vessel Name | DWT | Draft (m) | Capacity (t) | Compatible Ports |
|-------------|-----|-----------|--------------|------------------|
| MV Pacific Glory | 180,000 | 18.5 | 170,000 | 1 port (VIZAG only) ❌ |
| MV Ocean Titan | 150,000 | 16.2 | 140,000 | 1 port (VIZAG only) ❌ |
| MV Steel Carrier | 120,000 | 14.8 | 110,000 | 3 ports ✅ |
| MV Bulk Master | 90,000 | 12.5 | 85,000 | 4 ports ✅ |
| MV Coal Express | 75,000 | 11.0 | 70,000 | 5 ports ✅ |
| MV Iron Duke | 200,000 | 19.8 | 190,000 | 0 ports ❌ |
| MV Cargo King | 60,000 | 10.2 | 55,000 | 5 ports ✅ |
| MV Trade Wind | 100,000 | 13.5 | 95,000 | 4 ports ✅ |

### Filtered Results
**5 vessels** meet the criteria (compatible with ≥2 ports):
- MV Steel Carrier (3 ports)
- MV Bulk Master (4 ports)
- MV Coal Express (5 ports)
- MV Cargo King (5 ports)
- MV Trade Wind (4 ports)

## User Experience

### Dropdown Display
Each vessel option shows:
- **Vessel name** (e.g., "MV Steel Carrier")
- **Capacity** (e.g., "110,000t")
- **Draft** (e.g., "Draft: 14.8m")
- **Port count** (e.g., "3 ports")

### Example
```
MV Steel Carrier
110,000t • Draft: 14.8m • 3 ports
```

## API Endpoint

### GET /api/vessels
Fetches vessel data with optional filtering.

**Query Parameters:**
- `minPorts` (optional): Minimum number of compatible ports (default: 0)

**Example:**
```
GET /api/vessels?minPorts=2
```

**Response:**
```json
{
  "data": [
    {
      "id": "v3",
      "name": "MV Steel Carrier",
      "dwt": 120000,
      "draft_m": 14.8,
      "capacity_t": 110000,
      "compatible_ports": ["VIZAG", "DHAM", "PARA"],
      "compatible_ports_count": 3
    }
  ],
  "port_depths": {
    "VIZAG": 18.0,
    "PARA": 14.5,
    "DHAM": 16.0,
    "HALD": 12.0,
    "KOLK": 11.5
  }
}
```

## Benefits

1. **Logistics Flexibility**: Ensures selected vessels can be routed to multiple ports, giving logistics team options
2. **Risk Mitigation**: If primary port is congested, vessel can be diverted to alternate port
3. **Cost Optimization**: More port options enable better cost-benefit analysis
4. **Automatic Validation**: Prevents selection of vessels that limit port choices

## Technical Implementation

### Files Modified
- `components/procurement/schedule-creation-form.tsx` - Added vessel dropdown with filtering
- `app/api/vessels/route.ts` - New API endpoint for vessel data

### Key Features
- Fetches vessels on form open
- Filters by minimum port compatibility
- Displays vessel specifications inline
- Stores both vessel_id and vessel_name in schedule
