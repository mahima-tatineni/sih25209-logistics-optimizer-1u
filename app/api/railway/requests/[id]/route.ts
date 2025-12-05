import { type NextRequest, NextResponse } from "next/server"

declare global {
  var railwayRequests: any[] | undefined
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!global.railwayRequests) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    const index = global.railwayRequests.findIndex((r: any) => r.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    global.railwayRequests[index] = {
      ...global.railwayRequests[index],
      ...body,
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, data: global.railwayRequests[index] }, { status: 200 })
  } catch (error: any) {
    console.error("[Railway Request] PATCH error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
