import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const scheduleId = searchParams.get("schedule_id")
    const status = searchParams.get("status")
    const plantId = searchParams.get("plant_id")

    let query = supabase
      .from("rake_schedules")
      .select(`
        *,
        schedules (name, status),
        from_port:ports!rake_schedules_from_port_id_fkey (code, name),
        to_plant:plants!rake_schedules_to_plant_id_fkey (code, name),
        rail_routes (distance_km, max_rakes_per_day)
      `)
      .order("planned_date", { ascending: true })

    if (scheduleId) query = query.eq("schedule_id", scheduleId)
    if (status) query = query.eq("status", status)
    if (plantId) query = query.eq("to_plant_id", plantId)

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Rake schedules GET error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch rake schedules" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("rake_schedules")
      .insert({
        schedule_id: body.schedule_id,
        rail_route_id: body.rail_route_id,
        from_port_id: body.from_port_id,
        to_plant_id: body.to_plant_id,
        material: body.material,
        quantity_t: body.quantity_t,
        rake_count: body.rake_count,
        planned_date: body.planned_date,
        status: "Requested",
        comments: body.comments,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Rake schedule POST error:", error)
    return NextResponse.json({ error: error.message || "Failed to create rake schedule" }, { status: 500 })
  }
}
