import { type NextRequest, NextResponse } from "next/server"
import { getMockShipments, updateMockShipment, deleteMockShipment } from "@/lib/mock-data"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const updates = await request.json()
    updateMockShipment(id, updates)

    const shipments = getMockShipments()
    const updated = shipments.find((s) => s.id === id)

    if (!updated) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[v0] Error updating shipment:", error)
    return NextResponse.json({ error: "Invalid update data" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    deleteMockShipment(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting shipment:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
