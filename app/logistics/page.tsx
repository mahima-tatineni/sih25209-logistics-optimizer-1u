"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Truck } from "lucide-react"
import { LogisticsDashboard } from "@/components/logistics/dashboard"
import { OptimizationConsole } from "@/components/logistics/optimization-console"
import { RouteAnalysis } from "@/components/logistics/route-analysis"
import { CostBreakdown } from "@/components/logistics/cost-breakdown"
import { LiveTracking } from "@/components/logistics/live-tracking"

export default function LogisticsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "LogisticsTeam") {
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
              <Truck className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Logistics Portal</h1>
                <p className="text-sm text-white/80">Route optimization and cost analysis</p>
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
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <LogisticsDashboard />
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimization">
            <OptimizationConsole />
          </TabsContent>

          {/* Routes Tab */}
          <TabsContent value="routes">
            <RouteAnalysis />
          </TabsContent>

          {/* Live Tracking Tab */}
          <TabsContent value="tracking">
            <LiveTracking />
          </TabsContent>

          {/* Cost Analysis Tab */}
          <TabsContent value="costs">
            <CostBreakdown />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
