import { type NextRequest, NextResponse } from "next/server"
import { getMockShipments, addMockShipment } from "@/lib/mock-data"
import type { Shipment } from "@/lib/types"

export async function GET() {
  try {
    const shipments = getMockShipments()
    return NextResponse.json({ data: shipments })
  } catch (error) {
    console.error("[v0] Error fetching shipments:", error)
    return NextResponse.json({ data: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const shipment: Shipment = await request.json()
    addMockShipment(shipment)
    return NextResponse.json({ data: shipment }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating shipment:", error)
    return NextResponse.json({ error: "Invalid shipment data" }, { status: 400 })
  }
}
