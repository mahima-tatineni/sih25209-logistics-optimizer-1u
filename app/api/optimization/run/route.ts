import { type NextRequest, NextResponse } from "next/server"
import { PLANTS, PORTS } from "@/lib/mock-data"
import type { OptimizationResult } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const { shipments } = await request.json()

    // Mock optimization: assign each shipment to nearest port by simple logic
    const results = shipments.map((shipmentId: string) => {
      // For demo, use simple nearest-port assignment
      const randomPort = PORTS[Math.floor(Math.random() * PORTS.length)]
      const randomPlant = PLANTS[Math.floor(Math.random() * PLANTS.length)]

      return {
        shipment_id: shipmentId,
        assigned_port: randomPort.code,
        assigned_plant: randomPlant.code,
        eta: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        discharge_days: Math.floor(Math.random() * 5) + 2,
      }
    })

    // Mock cost calculation
    const result: OptimizationResult = {
      id: `OPT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      shipments: results,
      cost_breakdown: {
        ocean_freight_usd: 4500000 + Math.random() * 500000,
        port_handling_inr: 32000000 + Math.random() * 3000000,
        port_storage_inr: 5000000 + Math.random() * 1000000,
        rail_freight_inr: 48000000 + Math.random() * 5000000,
        demurrage_usd: 250000 + Math.random() * 100000,
        total_inr: 420000000 + Math.random() * 20000000,
      },
      stock_forecast: PLANTS.map((plant) => ({
        plant: plant.code,
        material: "coking_coal",
        days_cover: 25 + Math.random() * 10,
      })),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Optimization error:", error)
    return NextResponse.json({ error: "Optimization failed" }, { status: 500 })
  }
}
