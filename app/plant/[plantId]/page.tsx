"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import { useRouter, useParams } from "next/navigation"
import { useStockAlerts } from "@/hooks/useStockAlerts"
import { Package, AlertTriangle, Plus, TrendingUp } from "lucide-react"
import Image from "next/image"
import { PlantStockUpdatesForm } from "@/components/plant/stock-updates-form"
import { PlantStockRequestForm } from "@/components/plant/stock-request-form"
import { PlantRequestsList } from "@/components/plant/requests-list"
import { PlantScheduleTracking } from "@/components/plant/schedule-tracking"
import { CurrentRequestsSummary } from "@/components/plant/current-requests-summary"
import { StockMovementHistory } from "@/components/plant/stock-movement-history"
import { UpcomingArrivals } from "@/components/plant/upcoming-arrivals"
import { PortalNav } from "@/components/portal-nav"

// Plant data mapping
const PLANT_DATA: Record<string, any> = {
  BSP: {
    name: "Bhilai Steel Plant",
    state: "Chhattisgarh",
    capacity: "7.5 MTPA",
    coalImport: "4.2 MT",
    limestoneImport: "0.9 MT",
    image: "/images/bhilai-steel-plant.webp",
  },
  DSP: {
    name: "Durgapur Steel Plant",
    state: "West Bengal",
    capacity: "4.5 MTPA",
    coalImport: "2.5 MT",
    limestoneImport: "0.5 MT",
    image: "/images/durgapur-steel-plant.jpg",
  },
  RSP: {
    name: "Rourkela Steel Plant",
    state: "Odisha",
    capacity: "4.5 MTPA",
    coalImport: "2.8 MT",
    limestoneImport: "0.6 MT",
    image: "/images/rourkela-steel-plant.jpg",
  },
  BSL: {
    name: "Bokaro Steel Plant",
    state: "Jharkhand",
    capacity: "4.5 MTPA",
    coalImport: "2.7 MT",
    limestoneImport: "0.6 MT",
    image: "/images/bokaro-steel-plant.jpg",
  },
  ISP: {
    name: "IISCO Steel Plant",
    state: "West Bengal",
    capacity: "2.5 MTPA",
    coalImport: "1.5 MT",
    limestoneImport: "0.3 MT",
    image: "/iisco-plant.jpg",
  },
}

export default function PlantPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const plantId = params.plantId as string
  
  const [currentStock, setCurrentStock] = useState({
    coking_coal: { quantity: 350000, days_cover: 28 },
    limestone: { quantity: 75000, days_cover: 28 },
  })
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const plantData = PLANT_DATA[plantId] || PLANT_DATA.BSP

  // Enable stock alerts for this plant
  useStockAlerts(plantId)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Verify user has access to this plant
    if (user?.role === "PlantAdmin" && user?.plant_id !== plantId) {
      router.push(`/plant/${user.plant_id}`)
      return
    }

    // Fetch plant-specific stock data
    fetchPlantStock()
  }, [isAuthenticated, user, plantId, router])

  const fetchPlantStock = async () => {
    try {
      const response = await fetch(`/api/plant/${plantId}/stock`)
      if (response.ok) {
        const data = await response.json()
        setCurrentStock(data.stock || currentStock)
      }
    } catch (error) {
      console.error("[v0] Error fetching plant stock:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStockUpdate = async (data: any) => {
    try {
      const response = await fetch(`/api/plant/${plantId}/stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        // Refresh stock data
        fetchPlantStock()
      }
    } catch (error) {
      console.error("[v0] Error updating stock:", error)
    }
  }

  if (!isAuthenticated || loading) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <PortalNav title={plantData.name} portal="plant" />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">Plant Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-80 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                <Image 
                  src={plantData.image} 
                  alt={plantData.name} 
                  fill 
                  className="object-cover"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Crude Steel Capacity</p>
                  <p className="text-lg font-bold text-primary">{plantData.capacity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annual Coal Import</p>
                  <p className="text-lg font-bold text-primary">{plantData.coalImport}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annual Limestone</p>
                  <p className="text-lg font-bold text-primary">{plantData.limestoneImport}</p>
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

          <TabsContent value="home" className="space-y-4">
            <CurrentRequestsSummary plantId={plantId} />
            <UpcomingArrivals plantId={plantId} plantName={plantData.name} />
          </TabsContent>

          <TabsContent value="stock-updates" className="space-y-4">
            <PlantStockUpdatesForm
              onSubmit={handleStockUpdate}
            />
            
            <StockMovementHistory plantId={plantId} />
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            {showRequestForm ? (
              <div>
                <Button variant="outline" onClick={() => setShowRequestForm(false)} className="mb-4">
                  Cancel
                </Button>
                <PlantStockRequestForm
                  plantId={plantId}
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

                <PlantRequestsList plantId={plantId} />
              </>
            )}
          </TabsContent>

          <TabsContent value="tracking" className="space-y-4">
            <PlantScheduleTracking plantId={plantId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
