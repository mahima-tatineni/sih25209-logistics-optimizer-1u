import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Demo credentials - hardcoded for quick testing
    const demoUsers: Record<string, any> = {
      'plant.bhilai@sail.in': { id: '1', email: 'plant.bhilai@sail.in', name: 'Ravi Kumar', role: 'PlantAdmin', assigned_location: 'Bhilai', plant_id: 'BSP', port_id: null },
      'plant.durgapur@sail.in': { id: '2', email: 'plant.durgapur@sail.in', name: 'Amit Sharma', role: 'PlantAdmin', assigned_location: 'Durgapur', plant_id: 'DSP', port_id: null },
      'plant.rourkela@sail.in': { id: '3', email: 'plant.rourkela@sail.in', name: 'Priya Singh', role: 'PlantAdmin', assigned_location: 'Rourkela', plant_id: 'RSP', port_id: null },
      'plant.bokaro@sail.in': { id: '4', email: 'plant.bokaro@sail.in', name: 'Suresh Patil', role: 'PlantAdmin', assigned_location: 'Bokaro', plant_id: 'BSL', port_id: null },
      'plant.iisco@sail.in': { id: '5', email: 'plant.iisco@sail.in', name: 'Anjali Reddy', role: 'PlantAdmin', assigned_location: 'Burnpur', plant_id: 'ISP', port_id: null },
      'port.vizag@sail.in': { id: '6', email: 'port.vizag@sail.in', name: 'Vikram Rao', role: 'PortAdmin', assigned_location: 'Vizag', plant_id: null, port_id: 'VIZAG' },
      'port.paradip@sail.in': { id: '7', email: 'port.paradip@sail.in', name: 'Kavita Nair', role: 'PortAdmin', assigned_location: 'Paradip', plant_id: null, port_id: 'PARADIP' },
      'procurement@sail.in': { id: '8', email: 'procurement@sail.in', name: 'Sanjay Gupta', role: 'ProcurementAdmin', assigned_location: 'Head Office', plant_id: null, port_id: null },
      'logistics@sail.in': { id: '9', email: 'logistics@sail.in', name: 'Rahul Verma', role: 'LogisticsTeam', assigned_location: 'Head Office', plant_id: null, port_id: null },
      'railway@sail.in': { id: '10', email: 'railway@sail.in', name: 'Anil Kumar', role: 'RailwayAdmin', assigned_location: 'Railway Coordination', plant_id: null, port_id: null },
      'admin@sail.in': { id: '11', email: 'admin@sail.in', name: 'System Administrator', role: 'SystemAdmin', assigned_location: 'IT Department', plant_id: null, port_id: null },
      'demo@sail.in': { id: '12', email: 'demo@sail.in', name: 'Demo User', role: 'SystemAdmin', assigned_location: 'Demo', plant_id: null, port_id: null },
    }

    // Check if email exists in demo users
    const user = demoUsers[email]
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // For demo purposes, accept "password" as password
    if (password !== "password") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Try to update database if available, but don't fail if it doesn't work
    try {
      const supabase = await createClient()
      await supabase.from("users").update({ last_login: new Date().toISOString() }).eq("email", email)
    } catch (dbError) {
      console.log("[v0] Database not available, using demo mode")
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
