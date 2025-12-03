import { NextResponse } from "next/server"
import { PLANTS } from "@/lib/mock-data"

export async function GET() {
  return NextResponse.json(PLANTS)
}
