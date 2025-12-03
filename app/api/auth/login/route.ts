import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const supabase = await createClient()

    // Query users table
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("is_active", true)
      .limit(1)

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = users[0]

    // For demo purposes, accept "password" as password
    // In production, use bcrypt to compare: await bcrypt.compare(password, user.password_hash)
    if (password !== "password") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Update last login timestamp
    await supabase.from("users").update({ last_login: new Date().toISOString() }).eq("id", user.id)

    // Return user data (excluding password hash)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      assigned_location: user.assigned_location,
      plant_id: user.plant_id,
      port_id: user.port_id,
    }

    return NextResponse.json({ user: userData })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
