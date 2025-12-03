"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Package, AlertTriangle, Plus, TrendingUp } from "lucide-react"
import Image from "next/image"
import { PlantStockUpdatesForm } from "@/components/plant/stock-updates-form"
import { PlantStockRequestForm } from "@/components/plant/stock-request-form"
import { PlantRequestsList } from "@/components/plant/requests-list"
import { PlantScheduleTracking } from "@/components/plant/schedule-tracking"
import { PortalNav } from "@/components/portal-nav"
import { RoleAlerts } from "@/components/alerts/RoleAlerts"

export default function PlantPortalPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [currentStock, setCurrentStock] = useState({
    coking_coal: { quantity: 350000, days_cover: 28 },
    limestone: { quantity: 75000, days_cover: 28 },
  })
  const [showRequestForm, setShowRequestForm] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const plantName = "Bhilai Steel Plant"
  const plantState = "Chhattisgarh"
  const plantCapacity = "7.5 MTPA"

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <PortalNav title={plantName} portal="plant" />

      <div className="container mx-auto px-4 py-8">
        {/* Add role-specific alerts at the top */}
        <div className="mb-6">
          <RoleAlerts role="plant" plantId={user?.plant_id} userId={user?.id} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">Plant Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                <Image src="/images/bhilai-steel-plant.webp" alt={plantName} fill className="object-cover" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Crude Steel Capacity</p>
                  <p className="text-lg font-bold text-primary">{plantCapacity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annual Coal Import</p>
                  <p className="text-lg font-bold text-primary">4.2 MT</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annual Limestone</p>
                  <p className="text-lg font-bold text-primary">0.9 MT</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target Days Cover</p>
                  <p className="text-lg font-bold text-primary">30 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Package className="h-5 w-5" />
                Today's Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">Coking Coal</p>
                  <Badge variant={currentStock.coking_coal.days_cover < 20 ? "destructive" : "default"}>
                    {currentStock.coking_coal.days_cover} days
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {(currentStock.coking_coal.quantity / 1000).toFixed(1)} kt
                </p>
                <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>On target</span>
                </div>
              </div>

              <div className="p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">Limestone</p>
                  <Badge variant={currentStock.limestone.days_cover < 20 ? "destructive" : "default"}>
                    {currentStock.limestone.days_cover} days
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {(currentStock.limestone.quantity / 1000).toFixed(1)} kt
                </p>
                <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>On target</span>
                </div>
              </div>

              {(currentStock.coking_coal.days_cover < 20 || currentStock.limestone.days_cover < 20) && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                  <AlertTriangle className="h-4 w-4" />
                  <p className="text-sm font-medium">Stock below minimum threshold</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="home" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl bg-secondary/20">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="stock-updates">Stock Updates</TabsTrigger>
            <TabsTrigger value="requests">Stock Requests</TabsTrigger>
            <TabsTrigger value="tracking">Schedule Tracking</TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-4">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Upcoming Arrivals</CardTitle>
                <CardDescription>Next 3 scheduled vessels/rakes to this plant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      vessel: "Cape Mercury",
                      origin: "Gladstone",
                      eta: "2025-01-15",
                      material: "Coking Coal",
                      qty: "75,000",
                      status: "In Transit",
                    },
                    {
                      vessel: "Rail Rake #R-2401",
                      origin: "Paradip Port",
                      eta: "2025-01-08",
                      material: "Coking Coal",
                      qty: "4,000",
                      status: "In Transit",
                    },
                    {
                      vessel: "Ocean Giant",
                      origin: "Richards Bay",
                      eta: "2025-01-20",
                      material: "Limestone",
                      qty: "35,000",
                      status: "Planned",
                    },
                  ].map((arrival, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-primary">{arrival.vessel}</p>
                        <p className="text-sm text-muted-foreground">
                          From {arrival.origin} · {arrival.material}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{arrival.qty} t</p>
                        <div className="flex items-center justify-end gap-2 mt-1">
                          <Badge variant={arrival.status === "In Transit" ? "default" : "secondary"}>
                            {arrival.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground">ETA: {arrival.eta}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Plant Metrics & Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <p className="font-semibold text-blue-900">Stock Status</p>
                      <p className="text-sm text-blue-700">Both materials within target range</p>
                    </div>
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                      Healthy
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div>
                      <p className="font-semibold text-amber-900">Demand Forecast</p>
                      <p className="text-sm text-amber-700">Next 14 days requires 2,500t coal/day</p>
                    </div>
                    <Badge variant="secondary" className="bg-amber-600 text-white hover:bg-amber-700">
                      Monitor
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stock Updates Tab */}
          <TabsContent value="stock-updates" className="space-y-4">
            <PlantStockUpdatesForm
              onSubmit={(data) => {
                console.log("[v0] Stock update submitted:", data)
                // Update stock based on receipt or consumption
                if (data.event_type === "receipt") {
                  setCurrentStock((prev) => ({
                    ...prev,
                    [data.material as keyof typeof prev]: {
                      ...prev[data.material as keyof typeof prev],
                      quantity: prev[data.material as keyof typeof prev].quantity + data.quantity,
                      days_cover: 28, // Recalculate in real implementation
                    },
                  }))
                }
              }}
            />

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Stock Movement History</CardTitle>
                <CardDescription>Last 7 days of receipts and consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-primary/10">
                        <th className="text-left py-3 px-4 font-semibold text-primary">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-primary">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-primary">Material</th>
                        <th className="text-left py-3 px-4 font-semibold text-primary">Quantity (t)</th>
                        <th className="text-left py-3 px-4 font-semibold text-primary">Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          date: "2025-01-05",
                          type: "Receipt",
                          material: "Coking Coal",
                          qty: "4,000",
                          ref: "Rake #R-2398",
                        },
                        {
                          date: "2025-01-04",
                          type: "Consumption",
                          material: "Limestone",
                          qty: "1,200",
                          ref: "Daily use",
                        },
                        {
                          date: "2025-01-04",
                          type: "Receipt",
                          material: "Limestone",
                          qty: "2,000",
                          ref: "Rake #R-2397",
                        },
                        {
                          date: "2025-01-03",
                          type: "Consumption",
                          material: "Coking Coal",
                          qty: "3,500",
                          ref: "Daily use",
                        },
                        {
                          date: "2025-01-02",
                          type: "Receipt",
                          material: "Coking Coal",
                          qty: "5,000",
                          ref: "Rake #R-2396",
                        },
                        {
                          date: "2025-01-02",
                          type: "Consumption",
                          material: "Limestone",
                          qty: "1,100",
                          ref: "Daily use",
                        },
                        {
                          date: "2025-01-01",
                          type: "Consumption",
                          material: "Coking Coal",
                          qty: "3,400",
                          ref: "Daily use",
                        },
                      ].map((event, idx) => (
                        <tr key={idx} className="border-b border-primary/5 hover:bg-primary/5">
                          <td className="py-3 px-4 text-foreground">{event.date}</td>
                          <td className="py-3 px-4">
                            <Badge variant={event.type === "Receipt" ? "default" : "secondary"}>{event.type}</Badge>
                          </td>
                          <td className="py-3 px-4 font-medium">{event.material}</td>
                          <td className="py-3 px-4 font-semibold text-primary">{event.qty}</td>
                          <td className="py-3 px-4 text-muted-foreground">{event.ref}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stock Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            {showRequestForm ? (
              <div>
                <Button variant="outline" onClick={() => setShowRequestForm(false)} className="mb-4">
                  Cancel
                </Button>
                <PlantStockRequestForm
                  onSubmit={(data) => {
                    console.log("[v0] Stock request submitted:", data)
                    setShowRequestForm(false)
                  }}
                />
              </div>
            ) : (
              <>
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-primary">Create Stock Request</CardTitle>
                        <CardDescription>Submit replenishment requirements to procurement</CardDescription>
                      </div>
                      <Button className="bg-accent hover:bg-accent/90" onClick={() => setShowRequestForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Request
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                <PlantRequestsList />
              </>
            )}
          </TabsContent>

          {/* Schedule Tracking Tab */}
          <TabsContent value="tracking" className="space-y-4">
            <PlantScheduleTracking />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
