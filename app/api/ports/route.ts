import { NextResponse } from "next/server"
import { PORTS } from "@/lib/mock-data"

export async function GET() {
  return NextResponse.json(PORTS)
}
