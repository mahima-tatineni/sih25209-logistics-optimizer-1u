import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const plantId = searchParams.get("plant_id")
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")

    let query = supabase
      .from("stock_requests")
      .select(`
        *,
        plants!plant_id (id, code, name)
      `)
      .order("created_at", { ascending: false })

    if (plantId) {
      query = query.eq("plant_id", plantId)
    }
    if (status) {
      query = query.eq("status", status)
    }
    if (priority) {
      query = query.eq("priority", priority)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Stock requests GET error:", error)
      throw error
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Stock requests GET error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch stock requests" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("stock_requests")
      .insert({
        plant_id: body.plant_id,
        material: body.material,
        grade: body.grade,
        quantity_t: body.quantity_t,
        required_by_date: body.required_by_date,
        current_days_cover: body.current_days_cover,
        priority: body.priority,
        note: body.note,
        created_by: body.created_by,
        status: "Pending",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Stock requests POST error:", error)
    return NextResponse.json({ error: error.message || "Failed to create stock request" }, { status: 500 })
  }
}
