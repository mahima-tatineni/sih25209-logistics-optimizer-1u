import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Declare global mock storage for demo purposes
declare global {
  var mockRequests: any[] | undefined
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ plantId: string }> }) {
  try {
    const { plantId } = await params
    
    // Return mock requests if they exist
    if (global.mockRequests) {
      const plantRequests = global.mockRequests.filter((r: any) => r.plant_id === plantId)
      console.log("[v0] Returning mock requests for plant:", plantId, plantRequests.length)
      return NextResponse.json({ requests: plantRequests })
    }

    const supabase = await createClient()

    // Try to get the plant UUID from the code
    const { data: plant } = await supabase
      .from("plants")
      .select("id")
      .eq("code", plantId)
      .maybeSingle()

    let requests
    let error

    // If plant UUID exists, try UUID-based query first
    if (plant?.id) {
      const uuidResult = await supabase
        .from("stock_requests")
        .select(`
          *,
          plants (code, name)
        `)
        .eq("plant_id", plant.id)
        .order("created_at", { ascending: false })

      if (!uuidResult.error) {
        return NextResponse.json({ requests: uuidResult.data || [] })
      }
      
      console.log("[v0] UUID schema failed, trying code-based schema")
      error = uuidResult.error
    }

    // Try code-based schema (102) - either as fallback or primary
    const codeResult = await supabase
      .from("stock_requests")
      .select("*")
      .eq("plant_id", plantId)
      .order("created_at", { ascending: false })

    if (codeResult.error) {
      console.error("[v0] Error fetching requests:", codeResult.error)
      return NextResponse.json({ requests: [] })
    }

    return NextResponse.json({ requests: codeResult.data || [] })
  } catch (error) {
    console.error("[v0] Requests API error:", error)
    return NextResponse.json({ requests: [] })
  }
}

// Helper function to convert material format
function normalizeMaterial(material: string): string {
  // Convert to uppercase for enum-based schemas
  return material.toUpperCase()
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ plantId: string }> }) {
  try {
    const { plantId } = await params
    const body = await request.json()
    const { material, grade, quantity_t, required_by_date, current_days_cover, priority, note, created_by } = body

    const supabase = await createClient()

    // Normalize material for enum (COKING_COAL, LIMESTONE)
    const materialEnum = normalizeMaterial(material)

    console.log("[v0] Creating request for plant:", plantId, "material:", materialEnum)

    // Create a simple mock request that always succeeds
    // This allows the UI to work while database is being set up
    const mockRequest = {
      id: `mock-${Date.now()}`,
      plant_id: plantId,
      material: materialEnum,
      grade,
      quantity_t,
      required_by_date,
      current_days_cover,
      priority,
      note,
      status: "Pending",
      created_by,
      created_at: new Date().toISOString(),
    }

    console.log("[v0] Mock request created (database tables not ready):", mockRequest)
    
    // Store in a global array for demo purposes (will be lost on server restart)
    if (!global.mockRequests) {
      global.mockRequests = []
    }
    global.mockRequests.push(mockRequest)
    
    return NextResponse.json({ 
      success: true, 
      request: mockRequest,
      warning: "Request created in memory only. Run database migrations to persist data."
    })

  } catch (error) {
    console.error("[v0] Request creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
