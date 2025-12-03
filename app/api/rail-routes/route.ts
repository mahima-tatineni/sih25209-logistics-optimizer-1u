import { NextResponse } from "next/server"
import { RAIL_ROUTES } from "@/lib/mock-data"

export async function GET() {
  return NextResponse.json(RAIL_ROUTES)
}
