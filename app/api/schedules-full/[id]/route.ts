import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Declare global mock storage
declare global {
  var mockSchedules: any[] | undefined
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    console.log("[v0] Updating schedule:", id, "with data:", body)

    // Update mock schedule if it exists
    if (global.mockSchedules) {
      const scheduleIndex = global.mockSchedules.findIndex((s: any) => s.id === id)
      
      if (scheduleIndex !== -1) {
        global.mockSchedules[scheduleIndex] = {
          ...global.mockSchedules[scheduleIndex],
          ...body,
          updated_at: new Date().toISOString(),
        }

        console.log("[v0] Mock schedule updated:", global.mockSchedules[scheduleIndex])

        return NextResponse.json({
          success: true,
          data: global.mockSchedules[scheduleIndex],
        }, { status: 200 })
      }
    }

    const supabase = await createClient()
    const body2 = body

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (body2.status) {
      updateData.status = body2.status

      // If confirming schedule, record confirmation
      if (body2.status === "Confirmed") {
        updateData.confirmed_at = new Date().toISOString()
        updateData.confirmed_by = body2.confirmed_by

        // Update linked requests to "Scheduled"
        const { data: links } = await supabase
          .from("schedule_requests")
          .select("request_id")
          .eq("schedule_id", id)

        if (links && links.length > 0) {
          const requestIds = links.map((l) => l.request_id)
          await supabase.from("stock_requests").update({ status: "Scheduled" }).in("id", requestIds)
        }
      }
    }

    if (body2.optimization_run_id) updateData.optimization_run_id = body2.optimization_run_id
    if (body2.cost_estimate_inr) updateData.cost_estimate_inr = body2.cost_estimate_inr
    if (body2.notes) updateData.notes = body2.notes

    const { data, error } = await supabase.from("schedules").update(updateData).eq("id", id).select().single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Schedule PATCH error:", error)
    return NextResponse.json({ error: error.message || "Failed to update schedule" }, { status: 500 })
  }
}
