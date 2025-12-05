import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ plantId: string }> }) {
  try {
    const { plantId } = await params
    const supabase = await createClient()

    // Get current stock for this plant
    const { data: stocks, error } = await supabase
      .from("current_stock")
      .select("*")
      .eq("location_id", plantId)
      .eq("location_type", "plant")

    if (error) {
      console.error("[v0] Error fetching stock:", error)
    }

    // Plant-specific demo values (varies by plant)
    const plantDemoData: Record<string, any> = {
      BSP: { coal: 350000, coalDays: 28, limestone: 75000, limestoneDays: 28 },
      RSP: { coal: 280000, coalDays: 26, limestone: 65000, limestoneDays: 27 },
      BSL: { coal: 320000, coalDays: 27, limestone: 70000, limestoneDays: 28 },
      DSP: { coal: 220000, coalDays: 22, limestone: 55000, limestoneDays: 25 },
      ISP: { coal: 180000, coalDays: 20, limestone: 45000, limestoneDays: 23 },
    }

    const demo = plantDemoData[plantId] || plantDemoData.BSP

    // Transform to expected format
    const stockData = {
      coking_coal: {
        quantity: stocks?.find((s) => s.material === "coking_coal")?.stock_t || demo.coal,
        days_cover: stocks?.find((s) => s.material === "coking_coal")?.days_cover || demo.coalDays,
      },
      limestone: {
        quantity: stocks?.find((s) => s.material === "limestone")?.stock_t || demo.limestone,
        days_cover: stocks?.find((s) => s.material === "limestone")?.days_cover || demo.limestoneDays,
      },
    }

    return NextResponse.json({ stock: stockData })
  } catch (error) {
    console.error("[v0] Stock API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ plantId: string }> }) {
  try {
    const { plantId } = await params
    const body = await request.json()
    const { event_type, material, quantity, rake_id, comment, user_id } = body

    const supabase = await createClient()

    // Create plant event
    const { data: event, error: eventError } = await supabase
      .from("plant_events")
      .insert({
        plant_id: plantId,
        event_type: event_type === "receipt" ? "rake_arrival" : "consumption",
        material,
        quantity_t: quantity,
        rake_id,
        date_time: new Date().toISOString(),
        comment,
        user_id,
      })
      .select()
      .single()

    if (eventError) {
      console.error("[v0] Error creating event:", eventError)
      return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
    }

    // Update current stock
    const { data: currentStock } = await supabase
      .from("current_stock")
      .select("*")
      .eq("location_id", plantId)
      .eq("location_type", "plant")
      .eq("material", material)
      .single()

    const newQuantity = event_type === "receipt" 
      ? (currentStock?.stock_t || 0) + quantity
      : Math.max(0, (currentStock?.stock_t || 0) - quantity)

    // Calculate days cover (assuming daily consumption rate)
    const dailyConsumption = material === "coking_coal" ? 3500 : 1200
    const daysCover = Math.round(newQuantity / dailyConsumption)

    if (currentStock) {
      // Update existing stock
      await supabase
        .from("current_stock")
        .update({
          stock_t: newQuantity,
          days_cover: daysCover,
          last_updated: new Date().toISOString(),
        })
        .eq("location_id", plantId)
        .eq("location_type", "plant")
        .eq("material", material)
    } else {
      // Insert new stock record
      await supabase.from("current_stock").insert({
        location_id: plantId,
        location_type: "plant",
        material,
        stock_t: newQuantity,
        days_cover: daysCover,
        last_updated: new Date().toISOString(),
      })
    }

    return NextResponse.json({ success: true, event })
  } catch (error) {
    console.error("[v0] Stock update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
