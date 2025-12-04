import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { plantId: string } }) {
  try {
    const { plantId } = params
    const supabase = await createClient()

    // Get last 30 days of events for this plant
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: events, error } = await supabase
      .from("plant_events")
      .select("*")
      .eq("plant_id", plantId)
      .gte("date_time", thirtyDaysAgo.toISOString())
      .order("date_time", { ascending: false })
      .limit(50)

    if (error) {
      console.error("[v0] Error fetching events:", error)
      return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
    }

    return NextResponse.json({ events: events || [] })
  } catch (error) {
    console.error("[v0] Events API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
