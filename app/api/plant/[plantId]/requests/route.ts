import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { plantId: string } }) {
  try {
    const { plantId } = params
    const supabase = await createClient()

    // Get all requests for this plant
    const { data: requests, error } = await supabase
      .from("stock_requests")
      .select("*")
      .eq("plant_id", plantId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching requests:", error)
      return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 })
    }

    return NextResponse.json({ requests: requests || [] })
  } catch (error) {
    console.error("[v0] Requests API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { plantId: string } }) {
  try {
    const { plantId } = params
    const body = await request.json()
    const { material, grade, quantity_t, required_by_date, current_days_cover, priority, note, created_by } = body

    const supabase = await createClient()

    // Create new stock request
    const { data: newRequest, error } = await supabase
      .from("stock_requests")
      .insert({
        plant_id: plantId,
        material,
        grade,
        quantity_t,
        required_by_date,
        current_days_cover,
        priority,
        note,
        status: "Pending",
        created_at: new Date().toISOString(),
        created_by,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating request:", error)
      return NextResponse.json({ error: "Failed to create request" }, { status: 500 })
    }

    return NextResponse.json({ success: true, request: newRequest })
  } catch (error) {
    console.error("[v0] Request creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
