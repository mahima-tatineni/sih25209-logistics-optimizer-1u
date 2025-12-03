import { NextResponse } from "next/server"
import { SUPPLIER_PORTS } from "@/lib/mock-data"

export async function GET() {
  return NextResponse.json(SUPPLIER_PORTS)
}
