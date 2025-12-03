import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (body.status) {
      updateData.status = body.status
      if (body.status === "Confirmed") {
        updateData.confirmed_at = new Date().toISOString()
        updateData.confirmed_by = body.confirmed_by
      }
    }
    if (body.comments) updateData.comments = body.comments
    if (body.actual_departure) updateData.actual_departure = body.actual_departure
    if (body.actual_arrival) updateData.actual_arrival = body.actual_arrival

    const { data, error } = await supabase
      .from("rake_schedules")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Rake schedule PATCH error:", error)
    return NextResponse.json({ error: error.message || "Failed to update rake schedule" }, { status: 500 })
  }
}
