import { type NextRequest, NextResponse } from "next/server"

const LOGISTICS_BACKEND_URL = process.env.LOGISTICS_BACKEND_URL || "http://localhost:8000"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    
    const response = await fetch(`${LOGISTICS_BACKEND_URL}/api/logistics/schedules/${id}/whatif`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to create scenario" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Logistics API error:", error)
    return NextResponse.json({ error: "Backend connection failed" }, { status: 503 })
  }
}
