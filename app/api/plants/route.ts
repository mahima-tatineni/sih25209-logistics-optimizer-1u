import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { PLANTS } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const code = searchParams.get("code")
    const id = searchParams.get("id")

    let query = supabase.from("plants").select("*")

    if (code) {
      query = query.eq("code", code)
    }
    if (id) {
      query = query.eq("id", id)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Plants GET error:", error)
      // Fallback to mock data
      let mockData = PLANTS
      if (code) {
        mockData = PLANTS.filter((p) => p.code === code)
      }
      if (id) {
        mockData = PLANTS.filter((p) => p.id === id)
      }
      return NextResponse.json({ data: mockData }, { status: 200 })
    }

    if (!data || data.length === 0) {
      console.log("[v0] No plants in Supabase, using mock data")
      let mockData = PLANTS
      if (code) {
        mockData = PLANTS.filter((p) => p.code === code)
      }
      if (id) {
        mockData = PLANTS.filter((p) => p.id === id)
      }
      return NextResponse.json({ data: mockData }, { status: 200 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Plants API error:", error)
    return NextResponse.json({ data: PLANTS }, { status: 200 })
  }
}
