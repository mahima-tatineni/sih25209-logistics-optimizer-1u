import { type NextRequest, NextResponse } from "next/server"

// Port coordinates (Indian ports and major supplier ports)
const PORT_COORDINATES: Record<string, { lat: number; lon: number; name: string }> = {
  // Indian Ports
  VIZAG: { lat: 17.6868, lon: 83.2185, name: "Visakhapatnam" },
  PARA: { lat: 20.2644, lon: 86.6289, name: "Paradip" },
  DHAM: { lat: 20.8667, lon: 87.0833, name: "Dhamra" },
  HALD: { lat: 22.0333, lon: 88.1167, name: "Haldia" },
  KOLK: { lat: 22.5726, lon: 88.3639, name: "Kolkata" },
  
  // Supplier Ports (Australia, Indonesia, USA)
  GLAD: { lat: -23.8500, lon: 151.2667, name: "Gladstone, Australia" },
  NEWC: { lat: -32.9167, lon: 151.7833, name: "Newcastle, Australia" },
  RICH: { lat: -21.1833, lon: 149.2167, name: "Richards Bay, South Africa" },
  INDO: { lat: -6.1167, lon: 106.8833, name: "Jakarta, Indonesia" },
  USA: { lat: 37.7749, lon: -122.4194, name: "San Francisco, USA" },
  NEWC_US: { lat: 36.8529, lon: -76.2859, name: "Newport News, USA" },
}

// Plant coordinates
const PLANT_COORDINATES: Record<string, { lat: number; lon: number; name: string }> = {
  BSP: { lat: 21.2094, lon: 81.3797, name: "Bhilai Steel Plant" },
  RSP: { lat: 22.2497, lon: 84.8828, name: "Rourkela Steel Plant" },
  BSL: { lat: 23.6693, lon: 86.1511, name: "Bokaro Steel Plant" },
  DSP: { lat: 23.5204, lon: 87.3119, name: "Durgapur Steel Plant" },
  ISP: { lat: 23.6693, lon: 86.9842, name: "IISCO Steel Plant" },
}

// Generate sea waypoints between two points (simplified great circle route)
function generateSeaWaypoints(
  from: { lat: number; lon: number },
  to: { lat: number; lon: number },
  numPoints: number = 20
): Array<{ lat: number; lon: number; seq: number }> {
  const waypoints: Array<{ lat: number; lon: number; seq: number }> = []
  
  for (let i = 0; i <= numPoints; i++) {
    const fraction = i / numPoints
    // Simple linear interpolation (for production, use great circle calculation)
    const lat = from.lat + (to.lat - from.lat) * fraction
    const lon = from.lon + (to.lon - from.lon) * fraction
    
    waypoints.push({ lat, lon, seq: i })
  }
  
  return waypoints
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Fetch schedule data from mock storage or database
    let schedule: any = null

    // Try to get from global mock storage first
    if (global.mockSchedules) {
      schedule = global.mockSchedules.find((s: any) => s.id === id)
    }

    if (!schedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      )
    }

    // Get coordinates
    const loadPort = PORT_COORDINATES[schedule.load_port_code] || PORT_COORDINATES.GLAD
    const dischargePort = schedule.selected_port 
      ? PORT_COORDINATES[schedule.selected_port] 
      : PORT_COORDINATES.VIZAG
    const plant = PLANT_COORDINATES[schedule.target_plant_code] || PLANT_COORDINATES.BSP

    // Generate sea waypoints
    const seaWaypoints = generateSeaWaypoints(
      { lat: loadPort.lat, lon: loadPort.lon },
      { lat: dischargePort.lat, lon: dischargePort.lon },
      25
    )

    // Determine current status and position
    let currentStatus = "SCHEDULED"
    let currentPosition = null

    if (schedule.status === "SENT_TO_LOGISTICS" || schedule.status === "PORT_SELECTED") {
      currentStatus = "SCHEDULED"
    } else if (schedule.status === "IN_TRANSIT") {
      currentStatus = "AT_SEA"
      // Calculate approximate position (midpoint for demo)
      const midpoint = Math.floor(seaWaypoints.length / 2)
      currentPosition = seaWaypoints[midpoint]
    } else if (schedule.status === "DELIVERED" || schedule.status === "COMPLETED") {
      currentStatus = "COMPLETED"
    }

    const mapData = {
      loadPort: {
        name: loadPort.name,
        code: schedule.load_port_code,
        lat: loadPort.lat,
        lon: loadPort.lon,
      },
      dischargePort: {
        name: dischargePort.name,
        code: schedule.selected_port || "TBD",
        lat: dischargePort.lat,
        lon: dischargePort.lon,
      },
      plant: {
        name: plant.name,
        code: schedule.target_plant_code,
        lat: plant.lat,
        lon: plant.lon,
      },
      seaWaypoints,
      railSegment: {
        from: { lat: dischargePort.lat, lon: dischargePort.lon },
        to: { lat: plant.lat, lon: plant.lon },
      },
      status: currentStatus,
      currentPosition,
      schedule: {
        id: schedule.id,
        code: schedule.schedule_code,
        vessel: schedule.vessel_name,
        material: schedule.material,
        quantity: schedule.quantity_t,
      },
    }

    return NextResponse.json(mapData, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Map data error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch map data" },
      { status: 500 }
    )
  }
}
