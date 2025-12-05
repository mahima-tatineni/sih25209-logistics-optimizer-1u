import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Declare global mock storage
declare global {
  var mockSchedules: any[] | undefined
}

export async function GET(request: NextRequest) {
  try {
    // Return mock schedules if they exist
    if (global.mockSchedules && global.mockSchedules.length > 0) {
      console.log("[v0] Returning mock schedules:", global.mockSchedules.length)
      return NextResponse.json({ data: global.mockSchedules }, { status: 200 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let query = supabase
      .from("schedules")
      .select("*")
      .order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Schedules GET error:", error)
      return NextResponse.json({ data: [] }, { status: 200 })
    }

    return NextResponse.json({ data: data || [] }, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Schedules GET error:", error)
    return NextResponse.json({ data: [] }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      request_ids,
      vessel_id,
      vessel_name,
      load_port_code,
      sailing_date,
      material,
      quantity_t,
      target_plant_code,
      required_by_date,
      created_by,
    } = body

    // Generate schedule code
    const scheduleCode = `SCH-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

    const newSchedule = {
      id: `schedule-${Date.now()}`,
      schedule_code: scheduleCode,
      material,
      quantity_t,
      vessel_id,
      vessel_name,
      load_port_code,
      sailing_date,
      required_by_date,
      target_plant_code,
      status: "SENT_TO_LOGISTICS",
      linked_requests: request_ids,
      created_by,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Store in mock storage
    if (!global.mockSchedules) {
      global.mockSchedules = []
    }
    global.mockSchedules.push(newSchedule)

    // Update linked requests status
    if (global.mockRequests && request_ids && request_ids.length > 0) {
      global.mockRequests = global.mockRequests.map((req: any) => {
        if (request_ids.includes(req.id)) {
          return {
            ...req,
            status: "SCHEDULED",
            assigned_schedule_id: newSchedule.id,
            updated_at: new Date().toISOString(),
          }
        }
        return req
      })
    }

    console.log("[v0] Schedule created:", newSchedule)

    return NextResponse.json({
      success: true,
      schedule: newSchedule,
      message: "Schedule created and sent to logistics team",
    }, { status: 201 })

  } catch (error: any) {
    console.error("[v0] Schedule creation error:", error)
    return NextResponse.json({
      error: error.message || "Failed to create schedule"
    }, { status: 500 })
  }
}
