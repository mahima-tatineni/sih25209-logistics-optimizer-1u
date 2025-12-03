"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { PortalNav } from "@/components/portal-nav"
import { RoleAlerts } from "@/components/alerts/RoleAlerts"
import { useRealtimeData } from "@/hooks/useRealtimeData"
import { RakeDispatchBoard } from "@/components/railway/dispatch-board"
import { RakePlanningForm } from "@/components/railway/rake-planning"
import { RakeTracking } from "@/components/railway/rake-tracking"

export default function RailwayPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dispatch")
  const { stocks, shipments, loading } = useRealtimeData({ refreshInterval: 10000 })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "RailwayAdmin") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <PortalNav title="Railway Portal" portal="railway" />

      <div className="container mx-auto px-4 py-8">
        {/* Add role-specific alerts at the top for railway admin */}
        <div className="mb-6">
          <RoleAlerts role="railway" userId={user?.id} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 max-w-xl bg-secondary/20">
            <TabsTrigger value="dispatch">Dispatch Board</TabsTrigger>
            <TabsTrigger value="planning">Rake Planning</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="dispatch" className="space-y-4">
            <RakeDispatchBoard shipments={shipments} loading={loading} />
          </TabsContent>

          <TabsContent value="planning" className="space-y-4">
            <RakePlanningForm shipments={shipments} />
          </TabsContent>

          <TabsContent value="tracking" className="space-y-4">
            <RakeTracking shipments={shipments} loading={loading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
