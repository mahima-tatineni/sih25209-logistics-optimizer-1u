import { type NextRequest, NextResponse } from "next/server"

// Declare global mock storage
declare global {
  var mockSchedules: any[] | undefined
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { selected_port, status, cost_estimate_inr, notes } = body

    // Update in mock storage
    if (global.mockSchedules) {
      const scheduleIndex = global.mockSchedules.findIndex((s: any) => s.id === id)
      
      if (scheduleIndex !== -1) {
        global.mockSchedules[scheduleIndex] = {
          ...global.mockSchedules[scheduleIndex],
          selected_port,
          status: status || global.mockSchedules[scheduleIndex].status,
          cost_estimate_inr,
          notes: notes || global.mockSchedules[scheduleIndex].notes,
          updated_at: new Date().toISOString(),
        }

        console.log("[v0] Schedule updated:", global.mockSchedules[scheduleIndex])

        return NextResponse.json({
          success: true,
          schedule: global.mockSchedules[scheduleIndex],
          message: "Schedule updated successfully",
        }, { status: 200 })
      }
    }

    return NextResponse.json({
      error: "Schedule not found"
    }, { status: 404 })

  } catch (error: any) {
    console.error("[v0] Schedule update error:", error)
    return NextResponse.json({
      error: error.message || "Failed to update schedule"
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Delete from mock storage
    if (global.mockSchedules) {
      const scheduleIndex = global.mockSchedules.findIndex((s: any) => s.id === id)
      
      if (scheduleIndex !== -1) {
        const deletedSchedule = global.mockSchedules[scheduleIndex]
        global.mockSchedules.splice(scheduleIndex, 1)

        console.log("[v0] Schedule deleted:", deletedSchedule.schedule_code)

        return NextResponse.json({
          success: true,
          message: "Schedule deleted successfully",
        }, { status: 200 })
      }
    }

    return NextResponse.json({
      error: "Schedule not found"
    }, { status: 404 })

  } catch (error: any) {
    console.error("[v0] Schedule delete error:", error)
    return NextResponse.json({
      error: error.message || "Failed to delete schedule"
    }, { status: 500 })
  }
}
