"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { PortalNav } from "@/components/portal-nav"
import { RoleAlerts } from "@/components/alerts/RoleAlerts"
import { useRealtimeData } from "@/hooks/useRealtimeData"
import { PortVesselOperations } from "@/components/port/vessel-operations"
import { PortYardInventory } from "@/components/port/yard-inventory"
import { PortSchedules } from "@/components/port/schedules"

export default function PortPortalPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [portName] = useState("Visakhapatnam Port")
  const [activeTab, setActiveTab] = useState("operations")
  const { stocks, shipments, loading } = useRealtimeData({ refreshInterval: 10000 })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "PortAdmin") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <PortalNav title={portName} portal="port" />

      <div className="container mx-auto px-4 py-8">
        {/* Add role-specific alerts at the top for port admin */}
        <div className="mb-6">
          <RoleAlerts role="port" userId={user?.id} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 max-w-xl bg-secondary/20">
            <TabsTrigger value="operations">Vessel Operations</TabsTrigger>
            <TabsTrigger value="inventory">Yard Inventory</TabsTrigger>
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
          </TabsList>

          <TabsContent value="operations" className="space-y-4">
            <PortVesselOperations shipments={shipments} loading={loading} />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <PortYardInventory stocks={stocks} />
          </TabsContent>

          <TabsContent value="schedules" className="space-y-4">
            <PortSchedules shipments={shipments} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
