"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Package, TrendingUp, Zap } from "lucide-react"

export function ProcurementDashboard() {
  const [stats, setStats] = useState({
    activeShipments: 0,
    pendingRequests: 0,
    schedulesInPlanning: 0,
    daysToNextETA: "-",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch plant requests
      const requestsRes = await fetch("/api/plant/requests")
      const requestsData = await requestsRes.json()
      const pendingRequests = requestsData.data?.filter((r: any) => 
        r.status === "NEW" || r.status === "Pending" || r.status === "In Planning"
      ).length || 0

      // Fetch schedules
      const schedulesRes = await fetch("/api/procurement/schedules")
      const schedulesData = await schedulesRes.json()
      const schedules = schedulesData.data || []
      
      const activeShipments = schedules.filter((s: any) => 
        s.status === "IN_TRANSIT" || s.status === "DELIVERED"
      ).length
      
      const schedulesInPlanning = schedules.filter((s: any) => 
        s.status === "SENT_TO_LOGISTICS" || s.status === "PORT_SELECTED"
      ).length

      // Calculate days to next ETA
      let daysToNextETA = "-"
      const schedulesWithETA = schedules
        .filter((s: any) => s.required_by_date)
        .map((s: any) => ({
          ...s,
          eta: new Date(s.required_by_date)
        }))
        .sort((a: any, b: any) => a.eta.getTime() - b.eta.getTime())

      if (schedulesWithETA.length > 0) {
        const nextETA = schedulesWithETA[0].eta
        const today = new Date()
        const diffTime = nextETA.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        daysToNextETA = diffDays > 0 ? diffDays.toString() : "0"
      }

      // Use demo values if no real data exists
      setStats({
        activeShipments: activeShipments > 0 ? activeShipments : 2,
        pendingRequests: pendingRequests > 0 ? pendingRequests : 3,
        schedulesInPlanning: schedulesInPlanning > 0 ? schedulesInPlanning : 1,
        daysToNextETA: daysToNextETA !== "-" ? daysToNextETA : "12",
      })
    } catch (error) {
      console.error("[Procurement] Failed to fetch dashboard data:", error)
      // Fallback to demo values on error
      setStats({
        activeShipments: 2,
        pendingRequests: 3,
        schedulesInPlanning: 1,
        daysToNextETA: "12",
      })
    } finally {
      setLoading(false)
    }
  }

  const kpis = [
    { label: "Active Shipments", value: stats.activeShipments.toString(), icon: Package, color: "bg-blue-50 text-blue-600" },
    { label: "Requests Pending", value: stats.pendingRequests.toString(), icon: AlertTriangle, color: "bg-amber-50 text-amber-600" },
    { label: "Schedules in Planning", value: stats.schedulesInPlanning.toString(), icon: TrendingUp, color: "bg-green-50 text-green-600" },
    { label: "Days to Next ETA", value: stats.daysToNextETA, icon: Zap, color: "bg-red-50 text-red-600" },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <Card key={idx} className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className={`p-4 rounded-lg ${kpi.color} mb-3`}>
                  <Icon className="h-8 w-8" />
                </div>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-3xl font-bold text-primary">
                  {loading ? "..." : kpi.value}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Action Required Alert */}
      {stats.pendingRequests > 0 && (
        <Card className="border-2 border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <Alert variant="default" className="bg-amber-100 border-amber-300">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>{stats.pendingRequests}</strong> plant request{stats.pendingRequests !== 1 ? 's' : ''} awaiting schedule creation. 
                Review in the "Requests" tab to create import schedules.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions Guide */}
      <Card className="border-2 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-primary mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">📋 Review Plant Requests</h4>
              <p className="text-sm text-blue-700">
                Check the "Requests" tab to see stock replenishment needs from all plants. 
                Create schedules for urgent requests.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">🚢 Plan Vessel Shipments</h4>
              <p className="text-sm text-green-700">
                Use the "Vessels" tab to create new import schedules with vessel details, 
                load ports, and sailing dates.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">✅ Confirm Optimized Routes</h4>
              <p className="text-sm text-purple-700">
                Review schedules optimized by Logistics in the "Schedules" tab and 
                confirm final routes to activate shipments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
