"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { ShoppingCart, Plus } from "lucide-react"
import { ProcurementDashboard } from "@/components/procurement/dashboard"
import { InventoryMonitor } from "@/components/procurement/inventory-monitor"
import { PlantRequestsList } from "@/components/procurement/plant-requests-list"
import { VesselPlanningForm } from "@/components/procurement/vessel-planning-form"
import { SchedulesList } from "@/components/procurement/schedules-list"

export default function ProcurementPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showVesselForm, setShowVesselForm] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ProcurementAdmin") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <header className="bg-gradient-to-r from-primary to-[#224EA9] text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Procurement Portal</h1>
                <p className="text-sm text-white/80">Global sourcing and vessel planning</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => router.push("/")}>
                Home
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  localStorage.removeItem("sail_user")
                  router.push("/login")
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 bg-secondary/20">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Monitor</TabsTrigger>
            <TabsTrigger value="requests">Plant Requests</TabsTrigger>
            <TabsTrigger value="planning">Vessel Planning</TabsTrigger>
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <ProcurementDashboard />
          </TabsContent>

          {/* Inventory Monitor Tab */}
          <TabsContent value="inventory">
            <InventoryMonitor />
          </TabsContent>

          {/* Plant Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            <PlantRequestsList />
          </TabsContent>

          {/* Vessel Planning Tab */}
          <TabsContent value="planning" className="space-y-4">
            {showVesselForm ? (
              <div>
                <Button variant="outline" onClick={() => setShowVesselForm(false)} className="mb-4">
                  Cancel
                </Button>
                <VesselPlanningForm
                  onSubmit={() => {
                    console.log("[v0] Vessel schedule created")
                    setShowVesselForm(false)
                  }}
                />
              </div>
            ) : (
              <>
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-primary">Vessel & Schedule Planning</CardTitle>
                        <CardDescription>Create and manage STEM-based vessel schedules</CardDescription>
                      </div>
                      <Button className="bg-accent hover:bg-accent/90" onClick={() => setShowVesselForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Schedule
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                <SchedulesList status="draft" />
              </>
            )}
          </TabsContent>

          {/* Schedules Tab */}
          <TabsContent value="schedules" className="space-y-4">
            <div className="space-y-4">
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary">Active Schedules for Logistics</CardTitle>
                  <CardDescription>Schedules awaiting logistics optimization</CardDescription>
                </CardHeader>
                <CardContent>
                  <SchedulesList status="draft" />
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary">Confirmed Schedules</CardTitle>
                  <CardDescription>Locked plans ready for execution</CardDescription>
                </CardHeader>
                <CardContent>
                  <SchedulesList status="confirmed" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
