import { type NextRequest, NextResponse } from "next/server"

const LOGISTICS_BACKEND_URL = process.env.LOGISTICS_BACKEND_URL || "http://localhost:8000"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const response = await fetch(`${LOGISTICS_BACKEND_URL}/api/logistics/schedules/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch schedule" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Logistics API error:", error)
    return NextResponse.json({ error: "Backend connection failed" }, { status: 503 })
  }
}
