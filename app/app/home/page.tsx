"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gauge, Ship, MapPin, Factory, TrendingUp, AlertTriangle, Anchor, Package } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import type { Shipment } from "@/lib/types"

export default function HomePage() {
  const [shipments, setShipments] = useState<Shipment[]>([])

  useEffect(() => {
    fetch("/api/shipments")
      .then((res) => res.json())
      .then(setShipments)
      .catch(console.error)
  }, [])

  const activeVessels = shipments.filter((s) => s.status === "in_transit").length
  const portsInUse = new Set(shipments.flatMap((s) => s.candidate_ports)).size
  const totalPlannedTonnage = shipments.reduce((sum, s) => sum + s.quantity_t, 0)

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#004f6e] to-[#003d5c] rounded-xl p-8 text-white shadow-xl border border-white/10">
        <h1 className="text-4xl font-bold mb-3">Welcome to SAIL Logistics Optimizer</h1>
        <p className="text-lg text-blue-100 max-w-3xl">
          AI-enabled logistics platform for optimizing SAIL's coking coal and limestone imports across 5 integrated
          steel plants and east-coast ports.
        </p>
      </div>

      {/* Key KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Vessels</CardTitle>
            <Ship className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#004f6e]">{activeVessels}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently in transit</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ports in Use</CardTitle>
            <Anchor className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#004f6e]">{portsInUse}</div>
            <p className="text-xs text-muted-foreground mt-1">Discharge locations</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Planned Tonnage</CardTitle>
            <Package className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#004f6e]">{(totalPlannedTonnage / 1000000).toFixed(2)} Mt</div>
            <p className="text-xs text-muted-foreground mt-1">All shipments</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/app/bridge">
          <Card className="cursor-pointer hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3 shadow-md">
                <Gauge className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Captain's Bridge</CardTitle>
              <CardDescription>Executive dashboard with situational awareness</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/app/stem">
          <Card className="cursor-pointer hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-3 shadow-md">
                <Ship className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">STEM / Voyage Planning</CardTitle>
              <CardDescription>Manage shipments, vessels, and voyages</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/app/map">
          <Card className="cursor-pointer hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-3 shadow-md">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Vessel Tracker Map</CardTitle>
              <CardDescription>Geospatial tracking and route visualization</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/app/network">
          <Card className="cursor-pointer hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-3 shadow-md">
                <Factory className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Plant & Ports</CardTitle>
              <CardDescription>Network view and connectivity</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Additional Quick Links */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            Key Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <Link href="/app/cost-risk">
              <Button variant="outline" className="w-full justify-start h-auto py-3 hover:bg-blue-50 bg-transparent">
                <div className="text-left">
                  <div className="font-semibold text-sm">Cost & Risk Optimization</div>
                  <div className="text-xs text-muted-foreground">Run scenarios and minimize costs</div>
                </div>
              </Button>
            </Link>

            <Link href="/app/ai-lighthouse">
              <Button variant="outline" className="w-full justify-start h-auto py-3 hover:bg-blue-50 bg-transparent">
                <div className="text-left">
                  <div className="font-semibold text-sm">AI Lighthouse</div>
                  <div className="text-xs text-muted-foreground">AI-generated insights and recommendations</div>
                </div>
              </Button>
            </Link>

            <Link href="/app/tracking">
              <Button variant="outline" className="w-full justify-start h-auto py-3 hover:bg-blue-50 bg-transparent">
                <div className="text-left">
                  <div className="font-semibold text-sm">Predictive Tracking</div>
                  <div className="text-xs text-muted-foreground">AI-driven delay predictions and ETAs</div>
                </div>
              </Button>
            </Link>

            <Link href="/app/inventory">
              <Button variant="outline" className="w-full justify-start h-auto py-3 hover:bg-blue-50 bg-transparent">
                <div className="text-left">
                  <div className="font-semibold text-sm">Inventory Monitor</div>
                  <div className="text-xs text-muted-foreground">Real-time stock levels at plants and ports</div>
                </div>
              </Button>
            </Link>

            <Link href="/app/rail">
              <Button variant="outline" className="w-full justify-start h-auto py-3 hover:bg-blue-50 bg-transparent">
                <div className="text-left">
                  <div className="font-semibold text-sm">Rail Dispatch</div>
                  <div className="text-xs text-muted-foreground">Manage rake allocations and schedules</div>
                </div>
              </Button>
            </Link>

            <Link href="/app/reports">
              <Button variant="outline" className="w-full justify-start h-auto py-3 hover:bg-blue-50 bg-transparent">
                <div className="text-left">
                  <div className="font-semibold text-sm">Reports</div>
                  <div className="text-xs text-muted-foreground">Generate management reports</div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Alert Section */}
      <Card className="bg-amber-50 border-amber-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="h-5 w-5" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500 mt-1.5" />
              <div>
                <p className="font-medium text-amber-900">Stock Alert: BSL approaching minimum days cover</p>
                <p className="text-amber-700 text-xs">Bokaro plant requires replenishment within 5 days</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500 mt-1.5" />
              <div>
                <p className="font-medium text-amber-900">Weather Advisory: Tropical disturbance in Bay of Bengal</p>
                <p className="text-amber-700 text-xs">May affect ETAs for shipments to Paradip and Dhamra ports</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
