import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { PLANTS, PORTS } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const location_type = searchParams.get("type") || "plant" // plant or port

    let query

    if (location_type === "plant") {
      query = supabase
        .from("plant_stock")
        .select("*, plants(name, code, daily_coking_demand_t, daily_limestone_demand_t)")
        .order("as_of_date", { ascending: false })
        .limit(50)
    } else {
      // Get latest port stock
      query = supabase
        .from("port_stock")
        .select("*, ports(name, code)")
        .order("as_of_date", { ascending: false })
        .limit(50)
    }

    const { data, error } = await query

    if (error || !data || data.length === 0) {
      console.log("[v0] No stock data in Supabase, using mock data")

      // Generate mock stock snapshots
      const mockStockData =
        location_type === "plant"
          ? PLANTS.map((plant) => ({
              id: `mock-${plant.code}-coal`,
              location_id: plant.code,
              location_name: plant.name,
              material: "coking_coal",
              stock_t: Math.floor(Math.random() * 50000) + 30000,
              days_cover: Math.floor(Math.random() * 20) + 10,
              as_of_date: new Date().toISOString(),
            }))
          : PORTS.map((port) => ({
              id: `mock-${port.code}-coal`,
              location_id: port.code,
              location_name: port.name,
              material: "coking_coal",
              stock_t: Math.floor(Math.random() * 100000) + 50000,
              capacity_t: port.yard_capacity_t,
              as_of_date: new Date().toISOString(),
            }))

      return NextResponse.json({ data: mockStockData })
    }

    // Calculate days of cover for plants
    const processedData = data?.map((item: any) => {
      if (location_type === "plant" && item.plants) {
        const dailyDemand =
          item.material === "coking_coal" ? item.plants.daily_coking_demand_t : item.plants.daily_limestone_demand_t
        const days_cover = dailyDemand ? Math.round(item.stock_t / dailyDemand) : 0
        return { ...item, days_cover }
      }
      return item
    })

    return NextResponse.json({ data: processedData })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ data: [] })
  }
}
