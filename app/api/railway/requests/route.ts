import { type NextRequest, NextResponse } from "next/server"

// Mock storage for railway requests
declare global {
  var railwayRequests: any[] | undefined
}

export async function GET(request: NextRequest) {
  try {
    if (!global.railwayRequests) {
      global.railwayRequests = []
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let data = global.railwayRequests

    if (status && status !== "all") {
      data = data.filter((r: any) => r.status === status)
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    console.error("[Railway Requests] GET error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!global.railwayRequests) {
      global.railwayRequests = []
    }

    const railwayRequest = {
      id: `rr-${Date.now()}`,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    global.railwayRequests.push(railwayRequest)

    return NextResponse.json({ success: true, data: railwayRequest }, { status: 201 })
  } catch (error: any) {
    console.error("[Railway Requests] POST error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
