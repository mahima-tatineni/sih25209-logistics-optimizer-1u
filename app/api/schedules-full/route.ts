import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get("status")
    const plantId = searchParams.get("plant_id")

    let query = supabase
      .from("schedules")
      .select(`
        *,
        vessels (name, max_cargo_t),
        supplier_ports (name, country),
        schedule_requests (
          request_id,
          stock_requests (*)
        ),
        schedule_ports (
          *,
          ports (code, name)
        ),
        schedule_plants (
          *,
          plants (code, name),
          via_port:ports!schedule_plants_via_port_id_fkey (code, name)
        ),
        rake_schedules (*)
      `)
      .order("created_at", { ascending: false })

    if (status) {
      // Support multiple statuses separated by comma
      const statuses = status.split(",")
      if (statuses.length > 1) {
        query = query.in("status", statuses)
      } else {
        query = query.eq("status", status)
      }
    }

    const { data, error } = await query

    if (error) throw error

    // Filter by plant if specified
    let filteredData = data
    if (plantId && data) {
      filteredData = data.filter((schedule: any) => 
        schedule.schedule_plants?.some((sp: any) => sp.plant_id === plantId)
      )
    }

    return NextResponse.json({ data: filteredData }, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Schedules GET error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch schedules" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Create schedule
    const { data: schedule, error: scheduleError } = await supabase
      .from("schedules")
      .insert({
        name: body.name,
        vessel_id: body.vessel_id,
        supplier_port_id: body.supplier_port_id,
        load_date: body.load_date,
        material: body.material,
        grade: body.grade,
        total_quantity_t: body.total_quantity_t,
        status: body.status || "Draft",
        stem_id: body.stem_id,
        contract_freight_usd_per_t: body.contract_freight_usd_per_t,
        notes: body.notes,
        created_by: body.created_by,
      })
      .select()
      .single()

    if (scheduleError) throw scheduleError

    // Link to stock requests
    if (body.request_ids && body.request_ids.length > 0) {
      const requestLinks = body.request_ids.map((reqId: string) => ({
        schedule_id: schedule.id,
        request_id: reqId,
      }))

      const { error: linksError } = await supabase.from("schedule_requests").insert(requestLinks)

      if (linksError) throw linksError

      // Update request statuses
      await supabase
        .from("stock_requests")
        .update({
          status: "In Planning",
          assigned_schedule_id: schedule.id,
        })
        .in("id", body.request_ids)
    }

    // Add port allocations
    if (body.discharge_ports && body.discharge_ports.length > 0) {
      const portAllocations = body.discharge_ports.map((port: any) => ({
        schedule_id: schedule.id,
        port_id: port.port_id,
        tonnes: port.tonnes,
        eta: port.eta,
      }))

      const { error: portsError } = await supabase.from("schedule_ports").insert(portAllocations)

      if (portsError) throw portsError
    }

    // Add plant allocations
    if (body.plant_allocations && body.plant_allocations.length > 0) {
      const plantAllocations = body.plant_allocations.map((plant: any) => ({
        schedule_id: schedule.id,
        plant_id: plant.plant_id,
        via_port_id: plant.via_port_id,
        tonnes: plant.tonnes,
        eta: plant.eta,
      }))

      const { error: plantsError } = await supabase.from("schedule_plants").insert(plantAllocations)

      if (plantsError) throw plantsError
    }

    return NextResponse.json({ data: schedule }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Schedule POST error:", error)
    return NextResponse.json({ error: error.message || "Failed to create schedule" }, { status: 500 })
  }
}
