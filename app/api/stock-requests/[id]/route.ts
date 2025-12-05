import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Declare global mock storage
declare global {
  var mockRequests: any[] | undefined
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, procurement_notes } = body

    console.log("[v0] Updating request:", id, "with status:", status)

    // Update mock request if it exists
    if (global.mockRequests) {
      const requestIndex = global.mockRequests.findIndex((r: any) => r.id === id)
      
      if (requestIndex !== -1) {
        global.mockRequests[requestIndex] = {
          ...global.mockRequests[requestIndex],
          status: status.toUpperCase(),
          procurement_comments: procurement_notes,
          updated_at: new Date().toISOString(),
        }

        console.log("[v0] Mock request updated:", global.mockRequests[requestIndex])

        return NextResponse.json({
          success: true,
          request: global.mockRequests[requestIndex],
        }, { status: 200 })
      }
    }

    // Try database update
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("stock_requests")
      .update({
        status,
        procurement_comments: procurement_notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Database update error:", error)
      return NextResponse.json({
        error: "Request not found or database not configured"
      }, { status: 404 })
    }

    return NextResponse.json({ success: true, request: data }, { status: 200 })

  } catch (error: any) {
    console.error("[v0] Request update error:", error)
    return NextResponse.json({
      error: error.message || "Failed to update request"
    }, { status: 500 })
  }
}
