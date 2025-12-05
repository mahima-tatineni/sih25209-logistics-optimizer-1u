import { type NextRequest, NextResponse } from "next/server"

// Mock storage for port capacity
declare global {
  var portCapacity: any[] | undefined
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const port_code = searchParams.get("port_code")

    if (!global.portCapacity) {
      global.portCapacity = []
    }

    let data = global.portCapacity

    if (date) {
      data = data.filter((c: any) => c.date === date)
    }

    if (port_code) {
      data = data.filter((c: any) => c.port_code === port_code)
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    console.error("[Port Capacity] GET error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, port_code, available_berths, available_stockyard_t, congestion_index, notes, created_by } = body

    if (!global.portCapacity) {
      global.portCapacity = []
    }

    // Upsert: find existing or create new
    const existingIndex = global.portCapacity.findIndex(
      (c: any) => c.date === date && c.port_code === port_code
    )

    const capacity = {
      id: existingIndex >= 0 ? global.portCapacity[existingIndex].id : `pc-${Date.now()}`,
      date,
      port_code,
      available_berths,
      available_stockyard_t,
      congestion_index,
      notes,
      created_by,
      created_at: existingIndex >= 0 ? global.portCapacity[existingIndex].created_at : new Date().toISOString(),
    }

    if (existingIndex >= 0) {
      global.portCapacity[existingIndex] = capacity
    } else {
      global.portCapacity.push(capacity)
    }

    return NextResponse.json({ success: true, data: capacity }, { status: 200 })
  } catch (error: any) {
    console.error("[Port Capacity] POST error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
