import { type NextRequest, NextResponse } from "next/server"

// Mock storage for railway capacity
declare global {
  var railwayCapacity: any[] | undefined
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!global.railwayCapacity) {
      global.railwayCapacity = []
    }

    let data = global.railwayCapacity

    if (date) {
      data = data.filter((c: any) => c.date === date)
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    console.error("[Railway Capacity] GET error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, port_code, plant_code, available_rakes, notes, created_by } = body

    if (!global.railwayCapacity) {
      global.railwayCapacity = []
    }

    // Upsert: find existing or create new
    const existingIndex = global.railwayCapacity.findIndex(
      (c: any) => c.date === date && c.port_code === port_code && c.plant_code === plant_code
    )

    const capacity = {
      id: existingIndex >= 0 ? global.railwayCapacity[existingIndex].id : `rc-${Date.now()}-${Math.random()}`,
      date,
      port_code,
      plant_code,
      available_rakes,
      notes,
      created_by,
      created_at: existingIndex >= 0 ? global.railwayCapacity[existingIndex].created_at : new Date().toISOString(),
    }

    if (existingIndex >= 0) {
      global.railwayCapacity[existingIndex] = capacity
    } else {
      global.railwayCapacity.push(capacity)
    }

    return NextResponse.json({ success: true, data: capacity }, { status: 200 })
  } catch (error: any) {
    console.error("[Railway Capacity] POST error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
