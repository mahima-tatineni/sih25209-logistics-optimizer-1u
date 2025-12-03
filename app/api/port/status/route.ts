import { type NextRequest, NextResponse } from "next/server"
import { getCurrentStock, getPortCongestion, PORTS } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const portId = searchParams.get("portId")

  if (!portId) {
    return NextResponse.json({ error: "portId is required" }, { status: 400 })
  }

  const port = PORTS.find((p) => p.code === portId)
  const stocks = getCurrentStock(portId)
  const congestion = getPortCongestion(portId)

  const totalStock = stocks.reduce((sum, s) => sum + s.stock_t, 0)
  const utilization = port ? (totalStock / port.sail_yard_capacity_t) * 100 : 0

  return NextResponse.json({
    port_id: portId,
    stocks: stocks,
    total_stock_t: totalStock,
    capacity_t: port?.sail_yard_capacity_t || 0,
    utilization_percent: utilization,
    congestion: congestion,
    last_updated: new Date().toISOString(),
  })
}
