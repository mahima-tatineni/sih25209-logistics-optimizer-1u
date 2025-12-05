import { type NextRequest, NextResponse } from "next/server"

// Mock storage for port requests
declare global {
  var portRequests: any[] | undefined
}

export async function GET(request: NextRequest) {
  try {
    if (!global.portRequests) {
      global.portRequests = []
    }

    const { searchParams } = new URL(request.url)
    const port_code = searchParams.get("port_code")
    const status = searchParams.get("status")

    let data = global.portRequests

    if (port_code) {
      data = data.filter((r: any) => r.port_code === port_code)
    }

    if (status && status !== "all") {
      data = data.filter((r: any) => r.status === status)
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    console.error("[Port Requests] GET error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!global.portRequests) {
      global.portRequests = []
    }

    const portRequest = {
      id: `pr-${Date.now()}`,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    global.portRequests.push(portRequest)

    return NextResponse.json({ success: true, data: portRequest }, { status: 201 })
  } catch (error: any) {
    console.error("[Port Requests] POST error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
