import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const plantId = searchParams.get("plantId")

    const supabase = await createClient()

    let query = supabase
      .from("stock_requests")
      .select(`
        *,
        plants:plant_id (
          code,
          name,
          state
        )
      `)
      .order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    if (plantId) {
      query = query.eq("plant_id", plantId)
    }

    const { data: requests, error } = await query

    if (error) {
      console.error("[v0] Error fetching requests:", error)
      return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 })
    }

    return NextResponse.json({ requests: requests || [] })
  } catch (error) {
    console.error("[v0] Procurement requests API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, procurement_comments, assigned_schedule_id } = body

    const supabase = await createClient()

    const updateData: any = {}
    if (status) updateData.status = status
    if (procurement_comments) updateData.procurement_comments = procurement_comments
    if (assigned_schedule_id) updateData.assigned_schedule_id = assigned_schedule_id

    const { data: updatedRequest, error } = await supabase
      .from("stock_requests")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating request:", error)
      return NextResponse.json({ error: "Failed to update request" }, { status: 500 })
    }

    return NextResponse.json({ success: true, request: updatedRequest })
  } catch (error) {
    console.error("[v0] Request update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
