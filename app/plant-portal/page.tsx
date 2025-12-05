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
  const [upcomingArrivals, setUpcomingArrivals] = useState<any[]>([])
  const [stockHistory, setStockHistory] = useState<any[]>([])
  const [loadingStock, setLoadingStock] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else if (user?.plant_id) {
      fetchCurrentStock()
      fetchUpcomingArrivals()
      fetchStockHistory()
    }
  }, [isAuthenticated, user, router])

  const fetchCurrentStock = async () => {
    try {
      const plantId = user?.plant_id || "BSP"
      const response = await fetch(`/api/plant/${plantId}/stock`)
      if (response.ok) {
        const data = await response.json()
        setCurrentStock(data.stock)
      }
    } catch (error) {
      console.error("[v0] Error fetching stock:", error)
    } finally {
      setLoadingStock(false)
    }
  }

  const fetchUpcomingArrivals = async () => {
    try {
      const plantId = user?.plant_id || "BSP"
      // Fetch schedules that are assigned to this plant
      const response = await fetch(`/api/schedules-full?plant_id=${plantId}&status=Confirmed,In Transit,optimized`)
      if (response.ok) {
        const data = await response.json()
        setUpcomingArrivals(data.data?.slice(0, 3) || [])
      }
    } catch (error) {
      console.error("[v0] Error fetching arrivals:", error)
    }
  }

  const fetchStockHistory = async () => {
    try {
      const plantId = user?.plant_id || "BSP"
      const response = await fetch(`/api/plant/${plantId}/events?limit=10`)
      if (response.ok) {
        const data = await response.json()
        setStockHistory(data.events || [])
      }
    } catch (error) {
      console.error("[v0] Error fetching history:", error)
    }
  }

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
              <div className="relative h-64 mb-4 rounded-lg overflow-hidden bg-gray-100">
                <Image 
                  src="/images/bhilai-steel-plant.webp" 
                  alt={plantName} 
                  fill 
                  className="object-cover"
                  style={{ objectFit: "cover" }}
                />
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
              {loadingStock ? (
                <div className="text-center py-4 text-muted-foreground">Loading stock data...</div>
              ) : (
                <>
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
                    <div className={`flex items-center gap-1 mt-2 text-sm ${
                      currentStock.coking_coal.days_cover < 15 
                        ? "text-red-600" 
                        : currentStock.coking_coal.days_cover < 20 
                        ? "text-yellow-600" 
                        : "text-green-600"
                    }`}>
                      <TrendingUp className="h-4 w-4" />
                      <span>
                        {currentStock.coking_coal.days_cover < 15 
                          ? "Critical - Order now" 
                          : currentStock.coking_coal.days_cover < 20 
                          ? "Low stock" 
                          : "On target"}
                      </span>
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
                    <div className={`flex items-center gap-1 mt-2 text-sm ${
                      currentStock.limestone.days_cover < 15 
                        ? "text-red-600" 
                        : currentStock.limestone.days_cover < 20 
                        ? "text-yellow-600" 
                        : "text-green-600"
                    }`}>
                      <TrendingUp className="h-4 w-4" />
                      <span>
                        {currentStock.limestone.days_cover < 15 
                          ? "Critical - Order now" 
                          : currentStock.limestone.days_cover < 20 
                          ? "Low stock" 
                          : "On target"}
                      </span>
                    </div>
                  </div>

                  {(currentStock.coking_coal.days_cover < 20 || currentStock.limestone.days_cover < 20) && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                      <AlertTriangle className="h-4 w-4" />
                      <p className="text-sm font-medium">Stock below minimum threshold</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="home" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl bg-secondary/20">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="stock-updates">Stock Updates</TabsTrigger>
            <TabsTrigger value="requests">Stock Requests</TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-4">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Upcoming Arrivals</CardTitle>
                <CardDescription>Scheduled shipments assigned to this plant</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingArrivals.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No upcoming arrivals scheduled</p>
                    <p className="text-sm mt-2">Create a stock request to initiate procurement</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingArrivals.map((arrival, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-primary">{arrival.vessel_name || "Vessel TBD"}</p>
                          <p className="text-sm text-muted-foreground">
                            {arrival.supplier_port_id} → {arrival.optimized_port_id || "Port TBD"} · {arrival.material_type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{arrival.quantity?.toLocaleString()} t</p>
                          <div className="flex items-center justify-end gap-2 mt-1">
                            <Badge variant={arrival.status === "In Transit" ? "default" : "secondary"}>
                              {arrival.status}
                            </Badge>
                            {arrival.eta_discharge && (
                              <p className="text-sm text-muted-foreground">
                                ETA: {new Date(arrival.eta_discharge).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
              onSubmit={async (data) => {
                console.log("[v0] Stock update submitted:", data)
                try {
                  const plantId = user?.plant_id || "BSP"
                  const response = await fetch(`/api/plant/${plantId}/stock`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      ...data,
                      user_id: user?.id,
                    }),
                  })
                  
                  if (response.ok) {
                    // Refresh stock and history
                    fetchCurrentStock()
                    fetchStockHistory()
                  }
                } catch (error) {
                  console.error("[v0] Error updating stock:", error)
                }
              }}
            />

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Stock Movement History</CardTitle>
                <CardDescription>Day-wise usage and receipt after each stock update</CardDescription>
              </CardHeader>
              <CardContent>
                {stockHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No stock movements recorded yet</p>
                    <p className="text-sm mt-2">Record receipts and consumption above</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-primary/10">
                          <th className="text-left py-3 px-4 font-semibold text-primary">Date & Time</th>
                          <th className="text-left py-3 px-4 font-semibold text-primary">Type</th>
                          <th className="text-left py-3 px-4 font-semibold text-primary">Material</th>
                          <th className="text-left py-3 px-4 font-semibold text-primary">Quantity (t)</th>
                          <th className="text-left py-3 px-4 font-semibold text-primary">Reference</th>
                          <th className="text-left py-3 px-4 font-semibold text-primary">Comment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stockHistory.map((event, idx) => (
                          <tr key={idx} className="border-b border-primary/5 hover:bg-primary/5">
                            <td className="py-3 px-4 text-foreground">
                              {new Date(event.date_time).toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={event.event_type === "rake_arrival" ? "default" : "secondary"}>
                                {event.event_type === "rake_arrival" ? "Receipt" : "Consumption"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 font-medium capitalize">
                              {event.material?.replace("_", " ")}
                            </td>
                            <td className="py-3 px-4 font-semibold text-primary">
                              {event.quantity_t?.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {event.rake_id || "Daily use"}
                            </td>
                            <td className="py-3 px-4 text-muted-foreground text-xs">
                              {event.comment || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
                  plantId={user?.plant_id}
                  onSubmit={(data) => {
                    console.log("[v0] Stock request submitted:", data)
                    setShowRequestForm(false)
                    // Refresh upcoming arrivals after request is created
                    fetchUpcomingArrivals()
                  }}
                />
              </div>
            ) : (
              <>
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-primary">Current Stock Requests</CardTitle>
                        <CardDescription>View and create replenishment requests sent to procurement</CardDescription>
                      </div>
                      <Button className="bg-accent hover:bg-accent/90" onClick={() => setShowRequestForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Request
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                <PlantRequestsList plantId={user?.plant_id} />
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
