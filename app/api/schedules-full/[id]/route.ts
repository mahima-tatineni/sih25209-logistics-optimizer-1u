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

      // If confirming schedule, record confirmation
      if (body.status === "Confirmed") {
        updateData.confirmed_at = new Date().toISOString()
        updateData.confirmed_by = body.confirmed_by

        // Update linked requests to "Scheduled"
        const { data: links } = await supabase
          .from("schedule_requests")
          .select("request_id")
          .eq("schedule_id", params.id)

        if (links && links.length > 0) {
          const requestIds = links.map((l) => l.request_id)
          await supabase.from("stock_requests").update({ status: "Scheduled" }).in("id", requestIds)
        }
      }
    }

    if (body.optimization_run_id) updateData.optimization_run_id = body.optimization_run_id
    if (body.cost_estimate_inr) updateData.cost_estimate_inr = body.cost_estimate_inr
    if (body.notes) updateData.notes = body.notes

    const { data, error } = await supabase.from("schedules").update(updateData).eq("id", params.id).select().single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Schedule PATCH error:", error)
    return NextResponse.json({ error: error.message || "Failed to update schedule" }, { status: 500 })
  }
}
