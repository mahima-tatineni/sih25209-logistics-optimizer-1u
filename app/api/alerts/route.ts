import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { PLANTS } from "@/lib/mock-data"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const plantId = searchParams.get("plantId")

    console.log("[v0] Fetching alerts for role:", role, "plantId:", plantId)

    const supabase = await createClient()

    if (role === "plant" && plantId) {
      const { data: plantData, error: plantError } = await supabase
        .from("plants")
        .select("code, name, id")
        .eq("code", plantId)
        .maybeSingle()

      let plant = plantData
      if (!plant) {
        console.log("[v0] Plant not in Supabase, using mock data")
        plant = PLANTS.find((p) => p.code === plantId)
      }

      if (plant) {
        // Check stock levels
        const { data: stockData } = await supabase
          .from("plant_events")
          .select("material, quantity_t")
          .eq("plant_id", plant.id)
          .order("event_time", { ascending: false })
          .limit(10)

        // Calculate current stock and days cover
        const alerts = []

        if (!stockData || stockData.length === 0) {
          // Mock alert for demonstration
          alerts.push({
            id: `stock-${plant.code}`,
            type: "warning",
            title: "Low Stock Warning",
            message: `${plant.code}: coking_coal at 13.0 days cover`,
            details: `Below minimum threshold of 15 days. Request replenishment urgently.`,
            timestamp: new Date(),
          })
        } else {
          const currentStock = stockData[0]
          const daysCover = 13.0 // Mock calculation

          if (daysCover < 15) {
            alerts.push({
              id: `stock-${plant.code}`,
              type: "warning",
              title: "Low Stock Warning",
              message: `${plant.code}: ${currentStock.material} at ${daysCover} days cover`,
              details: `Below minimum threshold of 15 days. Request replenishment urgently.`,
              timestamp: new Date(),
            })
          }
        }

        return NextResponse.json({ alerts })
      }
    }

    if (role === "procurement") {
      const { data: requests } = await supabase
        .from("stock_requests")
        .select("*, plants(code, name)")
        .eq("status", "pending")
        .order("priority", { ascending: false })
        .limit(5)

      const alerts = []

      if (!requests || requests.length === 0) {
        alerts.push({
          id: "mock-request-1",
          type: "critical",
          title: "Urgent Stock Request",
          message: `BSP requires 15000t coking_coal - Priority: URGENT`,
          details: `Required by: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}`,
          timestamp: new Date(),
        })
      } else {
        requests.forEach((req: any) => {
          if (req.priority === "urgent") {
            alerts.push({
              id: `request-${req.id}`,
              type: "critical",
              title: "Urgent Stock Request",
              message: `${req.plants?.code} requires ${req.quantity}t ${req.material} - Priority: URGENT`,
              details: `Required by: ${req.required_date}`,
              timestamp: new Date(req.created_at),
            })
          }
        })
      }

      // Check for new schedules
      const { data: schedules } = await supabase
        .from("schedules")
        .select("*")
        .eq("status", "draft")
        .order("created_at", { ascending: false })
        .limit(1)

      if (schedules && schedules.length > 0) {
        const schedule = schedules[0]
        alerts.push({
          id: `schedule-${schedule.id}`,
          type: "info",
          title: "Schedule Created",
          message: `New vessel schedule created`,
          details: `Vessel: ${schedule.vessel_name}, Status: ${schedule.status}`,
          timestamp: new Date(schedule.created_at),
        })
      }

      return NextResponse.json({ alerts })
    }

    if (role === "logistics") {
      const { data: schedules } = await supabase
        .from("schedules")
        .select("*")
        .eq("status", "pending_optimization")
        .order("created_at", { ascending: false })

      const alerts = []

      if (!schedules || schedules.length === 0) {
        alerts.push({
          id: "mock-schedule",
          type: "info",
          title: "New Schedules for Optimization",
          message: `2 new schedules pending port selection`,
          details: `Review and optimize routes for cost efficiency`,
          timestamp: new Date(),
        })
      } else if (schedules.length > 0) {
        alerts.push({
          id: "pending-schedules",
          type: "info",
          title: "New Schedules for Optimization",
          message: `${schedules.length} new schedules pending port selection`,
          details: `Review and optimize routes for cost efficiency`,
          timestamp: new Date(),
        })
      }

      return NextResponse.json({ alerts })
    }

    if (role === "port") {
      const alerts = [
        {
          id: "vessel-arrival",
          type: "info",
          title: "Vessel Arriving Soon",
          message: "MV Ocean Star ETA: 2 days",
          details: "Prepare berth allocation and discharge crew",
          timestamp: new Date(),
        },
      ]
      return NextResponse.json({ alerts })
    }

    if (role === "railway") {
      const alerts = [
        {
          id: "rake-demand",
          type: "warning",
          title: "High Rake Demand",
          message: "5 plants requesting rakes for next week",
          details: "Review allocation priorities and capacity",
          timestamp: new Date(),
        },
      ]
      return NextResponse.json({ alerts })
    }

    if (role === "admin") {
      const alerts = [
        {
          id: "system-health",
          type: "info",
          title: "System Health Check",
          message: "All systems operational",
          details: "Last backup: 2 hours ago",
          timestamp: new Date(),
        },
      ]
      return NextResponse.json({ alerts })
    }

    // Return empty alerts for other roles
    return NextResponse.json({ alerts: [] })
  } catch (error) {
    console.error("[v0] Error fetching alerts:", error)
    return NextResponse.json({ alerts: [] })
  }
}
