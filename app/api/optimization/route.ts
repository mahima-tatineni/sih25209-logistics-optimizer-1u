import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })

    const { shipment_ids, mode, parameters, created_by, name } = await request.json()

    if (!shipment_ids || !created_by) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: runData, error: runError } = await supabase
      .from("optimization_runs")
      .insert({
        name: name || `Optimization ${mode}`,
        status: "running",
        created_by,
        parameters: {
          shipment_ids,
          mode,
          ...parameters,
        },
        started_at: new Date().toISOString(),
        horizon_start: new Date().toISOString().split("T")[0],
        horizon_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      })
      .select()

    if (runError) {
      console.error("[v0] Optimization run error:", runError)
      return NextResponse.json({ error: runError.message }, { status: 500 })
    }

    const optimizationRun = runData?.[0]

    // TODO: Call actual optimization engine here
    // For now, return simulated results
    const mockResults = {
      total_cost_inr: 6975000,
      ocean_cost_inr: 4875000,
      port_cost_inr: 637000,
      rail_cost_inr: 1313000,
      demurrage_cost_inr: 150000,
      optimization_score: 0.887,
      allocations: [
        {
          shipment_id: shipment_ids[0],
          discharge_port: "Vizag",
          plants: [
            { plant_id: "bsp", tonnes: 40000 },
            { plant_id: "rsp", tonnes: 35000 },
          ],
          eta_port: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    }

    const { data: finalData } = await supabase
      .from("optimization_runs")
      .update({
        status: "completed",
        finished_at: new Date().toISOString(),
        summary: mockResults,
      })
      .eq("id", optimizationRun.id)
      .select()

    return NextResponse.json({ data: finalData?.[0] }, { status: 201 })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })

    const { searchParams } = new URL(request.url)
    const run_id = searchParams.get("run_id")

    if (run_id) {
      // Get specific optimization run
      const { data, error } = await supabase.from("optimization_runs").select("*").eq("id", run_id).single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data })
    } else {
      // Get recent optimization runs
      const { data, error } = await supabase
        .from("optimization_runs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data })
    }
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
