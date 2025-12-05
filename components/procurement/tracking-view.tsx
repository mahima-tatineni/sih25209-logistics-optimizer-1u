"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Ship, MapPin } from "lucide-react"
import { ShipmentMap } from "@/components/tracking/ShipmentMap"

export function ProcurementTrackingView() {
  const [schedules, setSchedules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/procurement/schedules")
      const data = await response.json()
      
      // Filter schedules that have been sent to logistics or are in transit
      const trackableSchedules = (data.data || []).filter((s: any) => 
        s.status === "PORT_SELECTED" || 
        s.status === "IN_TRANSIT" || 
        s.status === "DELIVERED" ||
        s.status === "COMPLETED"
      )
      
      setSchedules(trackableSchedules)
    } catch (error) {
      console.error("[Procurement] Failed to fetch schedules:", error)
    } finally {
      setLoading(false)
    }
  }

  const getProgress = (status: string) => {
    switch (status) {
      case "PORT_SELECTED": return 30
      case "IN_TRANSIT": return 65
      case "DELIVERED": return 90
      case "COMPLETED": return 100
      default: return 0
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PORT_SELECTED": return "bg-blue-100 text-blue-800"
      case "IN_TRANSIT": return "bg-purple-100 text-purple-800"
      case "DELIVERED": return "bg-green-100 text-green-800"
      case "COMPLETED": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading tracking data...</p>
      </div>
    )
  }

  if (schedules.length === 0) {
    return (
      <Card className="border-2 border-primary/20">
        <CardContent className="py-12 text-center">
          <Ship className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Active Shipments</h3>
          <p className="text-muted-foreground">
            Schedules sent to logistics will appear here for tracking
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Active Shipment Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {schedules.filter(s => s.status === "PORT_SELECTED").length}
              </div>
              <div className="text-sm text-muted-foreground">Port Selected</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {schedules.filter(s => s.status === "IN_TRANSIT").length}
              </div>
              <div className="text-sm text-muted-foreground">In Transit</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {schedules.filter(s => s.status === "DELIVERED").length}
              </div>
              <div className="text-sm text-muted-foreground">Delivered</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {schedules.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Active</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {schedules.map((schedule) => {
        const progress = getProgress(schedule.status)
        
        return (
          <Card key={schedule.id} className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-primary">{schedule.vessel_name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {schedule.schedule_code} • {schedule.material?.replace("_", " ")}
                  </p>
                </div>
                <Badge className={getStatusColor(schedule.status)}>
                  {schedule.status?.replace("_", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Schedule Details */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="font-bold text-primary">{schedule.load_port_code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">To Port</p>
                  <p className="font-bold text-primary">{schedule.selected_port || "TBD"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target Plant</p>
                  <p className="font-bold text-primary">{schedule.target_plant_code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-bold text-primary">{schedule.quantity_t?.toLocaleString()} t</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expected Arrival</p>
                  <p className="font-bold text-primary">
                    {new Date(schedule.required_by_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-primary">Shipment Progress</p>
                  <p className="text-xs text-muted-foreground">{progress}% complete</p>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              {/* Milestones */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className={`p-3 rounded-lg border-2 ${schedule.status ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                  <p className="text-xs text-muted-foreground mb-1">Port Selected</p>
                  <p className="text-sm font-semibold">{schedule.selected_port || "Pending"}</p>
                </div>
                <div className={`p-3 rounded-lg border-2 ${schedule.status === "IN_TRANSIT" || schedule.status === "DELIVERED" || schedule.status === "COMPLETED" ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                  <p className="text-xs text-muted-foreground mb-1">Vessel Sailed</p>
                  <p className="text-sm font-semibold">
                    {schedule.status === "IN_TRANSIT" || schedule.status === "DELIVERED" || schedule.status === "COMPLETED" 
                      ? new Date(schedule.sailing_date).toLocaleDateString() 
                      : "Pending"}
                  </p>
                </div>
                <div className={`p-3 rounded-lg border-2 ${schedule.status === "DELIVERED" || schedule.status === "COMPLETED" ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                  <p className="text-xs text-muted-foreground mb-1">Arrived at Port</p>
                  <p className="text-sm font-semibold">
                    {schedule.status === "DELIVERED" || schedule.status === "COMPLETED" 
                      ? new Date(schedule.required_by_date).toLocaleDateString() 
                      : "Pending"}
                  </p>
                </div>
                <div className={`p-3 rounded-lg border-2 ${schedule.status === "COMPLETED" ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                  <p className="text-xs text-muted-foreground mb-1">Delivered to Plant</p>
                  <p className="text-sm font-semibold">
                    {schedule.status === "COMPLETED" ? "Completed" : "Pending"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
