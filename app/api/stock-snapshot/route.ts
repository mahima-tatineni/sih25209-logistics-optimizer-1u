import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })

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

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
