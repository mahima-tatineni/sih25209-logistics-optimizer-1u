"use client"

import { useState, useEffect } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { PortalNav } from "@/components/portal-nav"
import { useRealtimeData } from "@/hooks/useRealtimeData"
import { RoleAlerts } from "@/components/alerts/RoleAlerts"
import { ProcurementDashboard } from "@/components/procurement/dashboard"
import { InventoryMonitor } from "@/components/procurement/inventory-monitor"
import { PlantRequestsList } from "@/components/procurement/plant-requests-list"
import { VesselPlanningForm } from "@/components/procurement/vessel-planning-form"
import { SchedulesList } from "@/components/procurement/schedules-list"
import { ProcurementTrackingDashboard } from "@/components/procurement/tracking-dashboard"

export default function ProcurementPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showVesselForm, setShowVesselForm] = useState(false)
  const { stocks, shipments, loading } = useRealtimeData({ refreshInterval: 10000 })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ProcurementAdmin") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <PortalNav title="Procurement Portal" portal="procurement" />

      <div className="container mx-auto px-4 py-8">
        {/* Add role-specific alerts at the top for procurement */}
        <div className="mb-6">
          <RoleAlerts role="procurement" userId={user?.id} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6 max-w-4xl bg-secondary/20">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="vessels">Vessels</TabsTrigger>
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <ProcurementDashboard stocks={stocks} loading={loading} />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <InventoryMonitor stocks={stocks} />
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <PlantRequestsList />
          </TabsContent>

          <TabsContent value="vessels" className="space-y-4">
            {showVesselForm ? (
              <div>
                <Button variant="outline" onClick={() => setShowVesselForm(false)} className="mb-4">
                  Cancel
                </Button>
                <VesselPlanningForm onSubmit={() => setShowVesselForm(false)} />
              </div>
            ) : (
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-primary">Plan Vessel Shipments</CardTitle>
                      <CardDescription>Create STEM-based vessel schedules</CardDescription>
                    </div>
                    <Button className="bg-accent hover:bg-accent/90" onClick={() => setShowVesselForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Plan Vessel
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="schedules" className="space-y-4">
            <SchedulesList shipments={shipments} />
          </TabsContent>

          <TabsContent value="tracking" className="space-y-4">
            <ProcurementTrackingDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
