import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (body.status) updateData.status = body.status
    if (body.procurement_comments) updateData.procurement_comments = body.procurement_comments
    if (body.assigned_schedule_id) updateData.assigned_schedule_id = body.assigned_schedule_id

    const { data, error } = await supabase
      .from("stock_requests")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Stock request PATCH error:", error)
    return NextResponse.json({ error: error.message || "Failed to update stock request" }, { status: 500 })
  }
}
