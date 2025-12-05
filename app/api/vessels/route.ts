import { type NextRequest, NextResponse } from "next/server"

// Vessel master data with draft specifications
const VESSELS = [
  { id: "v1", name: "MV Pacific Glory", dwt: 180000, draft_m: 18.5, capacity_t: 170000 },
  { id: "v2", name: "MV Ocean Titan", dwt: 150000, draft_m: 16.2, capacity_t: 140000 },
  { id: "v3", name: "MV Steel Carrier", dwt: 120000, draft_m: 14.8, capacity_t: 110000 },
  { id: "v4", name: "MV Bulk Master", dwt: 90000, draft_m: 12.5, capacity_t: 85000 },
  { id: "v5", name: "MV Coal Express", dwt: 75000, draft_m: 11.0, capacity_t: 70000 },
  { id: "v6", name: "MV Iron Duke", dwt: 200000, draft_m: 19.8, capacity_t: 190000 },
  { id: "v7", name: "MV Cargo King", dwt: 60000, draft_m: 10.2, capacity_t: 55000 },
  { id: "v8", name: "MV Trade Wind", dwt: 100000, draft_m: 13.5, capacity_t: 95000 },
]

// Port depth specifications (in meters)
const PORT_DEPTHS = {
  VIZAG: 18.0,  // Visakhapatnam - deepest
  PARA: 14.5,   // Paradip
  DHAM: 16.0,   // Dhamra
  HALD: 12.0,   // Haldia - shallowest
  KOLK: 11.5,   // Kolkata - very shallow
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const minPorts = parseInt(searchParams.get("minPorts") || "0")

    let vessels = VESSELS

    // Filter vessels that can access at least minPorts ports
    if (minPorts > 0) {
      vessels = vessels.filter(vessel => {
        const compatiblePorts = Object.values(PORT_DEPTHS).filter(
          depth => vessel.draft_m <= depth
        ).length
        return compatiblePorts >= minPorts
      })
    }

    // Add compatible ports info to each vessel
    const vesselsWithPorts = vessels.map(vessel => {
      const compatiblePorts = Object.entries(PORT_DEPTHS)
        .filter(([_, depth]) => vessel.draft_m <= depth)
        .map(([code, _]) => code)
      
      return {
        ...vessel,
        compatible_ports: compatiblePorts,
        compatible_ports_count: compatiblePorts.length,
      }
    })

    return NextResponse.json({ 
      data: vesselsWithPorts,
      port_depths: PORT_DEPTHS 
    }, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Vessels GET error:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to fetch vessels" 
    }, { status: 500 })
  }
}
