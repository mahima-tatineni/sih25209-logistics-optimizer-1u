import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { name, shipment_ids, load_date, discharge_ports, plant_allocations, status, created_by } =
      await request.json()

    if (!name || !shipment_ids || !created_by) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("scenarios")
      .insert({
        name,
        description: `Schedule for ${shipment_ids.length} shipments`,
        created_by,
        parameters: {
          shipment_ids,
          load_date,
          discharge_ports,
          plant_allocations,
          status,
        },
      })
      .select()

    if (error) {
      console.error("[v0] Schedule creation error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let query = supabase.from("scenarios").select("*").order("created_at", { ascending: false }).limit(limit)

    if (status) {
      query = query.contains("parameters", { status })
    }

    const { data, error } = await query

    if (error) {
      console.log("[v0] Error fetching scenarios from Supabase, using empty data:", error)
      return NextResponse.json({ data: [] })
    }

    return NextResponse.json({ data: data || [] })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ data: [] })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { id, status, parameters } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Schedule ID required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("scenarios")
      .update({
        parameters: {
          ...parameters,
          status,
          updated_at: new Date().toISOString(),
        },
      })
      .eq("id", id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
