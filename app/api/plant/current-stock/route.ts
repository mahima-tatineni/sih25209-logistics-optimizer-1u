import { type NextRequest, NextResponse } from "next/server"
import { getCurrentStock } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const plantId = searchParams.get("plantId")

  if (!plantId) {
    return NextResponse.json({ error: "plantId is required" }, { status: 400 })
  }

  const stocks = getCurrentStock(plantId)

  return NextResponse.json({
    plant_id: plantId,
    stocks: stocks,
    last_updated: new Date().toISOString(),
  })
}
