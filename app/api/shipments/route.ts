import { type NextRequest, NextResponse } from "next/server"
import { getMockShipments, addMockShipment } from "@/lib/mock-data"
import type { Shipment } from "@/lib/types"

export async function GET() {
  const shipments = getMockShipments()
  return NextResponse.json(shipments)
}

export async function POST(request: NextRequest) {
  try {
    const shipment: Shipment = await request.json()
    addMockShipment(shipment)
    return NextResponse.json(shipment, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating shipment:", error)
    return NextResponse.json({ error: "Invalid shipment data" }, { status: 400 })
  }
}
