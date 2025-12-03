import { type NextRequest, NextResponse } from "next/server"
import { getCurrentStock } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const portId = searchParams.get("portId")

  if (!portId) {
    return NextResponse.json({ error: "portId is required" }, { status: 400 })
  }

  const stocks = getCurrentStock(portId)

  return NextResponse.json({
    port_id: portId,
    stocks: stocks,
    last_updated: new Date().toISOString(),
  })
}
