"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Ship, MapPin, CheckCircle2, Clock } from "lucide-react"
import { ShipmentMap } from "@/components/tracking/ShipmentMap"

export function ProcurementTrackingDashboard() {
  const [schedules, setSchedules] = useState<any[]>([])
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/procurement/schedules")
      const data = await response.json()
      
      // Filter trackable schedules
      const trackableSchedules = (data.data || []).filter((s: any) => 
        s.status === "PORT_SELECTED" || 
        s.status === "IN_TRANSIT" || 
        s.status === "DELIVERED" ||
        s.status === "COMPLETED"
      )
      
      setSchedules(trackableSchedules)
      
      // Auto-select first schedule
      if (trackableSchedules.length > 0 && !selectedSchedule) {
        setSelectedSchedule(trackableSchedules[0])
      }
    } catch (error) {
      console.error("[Procurement] Failed to fetch schedules:", error)
    } finally {
      setLoading(false)
    }
  }

  const getMilestones = (schedule: any) => {
    const status = schedule.status
    return [
      { 
        label: "Schedule Created", 
        completed: true, 
        date: new Date(schedule.created_at).toLocaleDateString() 
      },
      { 
        label: "Port Selected", 
        completed: true, 
        date: schedule.selected_port || "Pending" 
      },
      { 
        label: "Vessel Sailed", 
        completed: status === "IN_TRANSIT" || status === "DELIVERED" || status === "COMPLETED", 
        date: status === "IN_TRANSIT" || status === "DELIVERED" || status === "COMPLETED" 
          ? new Date(schedule.sailing_date).toLocaleDateString() 
          : "Pending" 
      },
      { 
        label: "Arrived at Port", 
        completed: status === "DELIVERED" || status === "COMPLETED", 
        date: status === "DELIVERED" || status === "COMPLETED" 
          ? new Date(schedule.required_by_date).toLocaleDateString() 
          : "Pending" 
      },
      { 
        label: "Delivered to Plant", 
        completed: status === "COMPLETED", 
        date: status === "COMPLETED" ? "Completed" : "Pending" 
      },
    ]
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Side - Schedule List */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Shipments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                onClick={() => setSelectedSchedule(schedule)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                  selectedSchedule?.id === schedule.id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-bold text-sm text-primary">{schedule.schedule_code}</p>
                    <p className="text-xs text-muted-foreground">{schedule.vessel_name}</p>
                  </div>
                  <Badge className={`text-xs ${getStatusColor(schedule.status)}`}>
                    {schedule.status?.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{schedule.target_plant_code}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Map and Details */}
      <div className="lg:col-span-2 space-y-6">
        {selectedSchedule && (
          <>
            {/* Shipment Route Map */}
            <ShipmentMap scheduleId={selectedSchedule.id} />

            {/* Milestone Timeline */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Milestone Timeline</CardTitle>
                  <Badge className={getStatusColor(selectedSchedule.status)}>
                    {selectedSchedule.status?.replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedSchedule.schedule_code} • {selectedSchedule.vessel_name} • {selectedSchedule.quantity_t?.toLocaleString()}T {selectedSchedule.material?.replace("_", " ")}
                </p>
              </CardHeader>
              <CardContent>
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm font-medium">
                      {getProgress(selectedSchedule.status)}% complete
                    </span>
                  </div>
                  <Progress value={getProgress(selectedSchedule.status)} className="h-3" />
                </div>

                {/* Milestones */}
                <div className="space-y-4">
                  {getMilestones(selectedSchedule).map((milestone, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          milestone.completed ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        {milestone.completed ? (
                          <CheckCircle2 className="h-6 w-6 text-white" />
                        ) : (
                          <Clock className="h-6 w-6 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-semibold ${
                            milestone.completed ? "text-green-700" : "text-muted-foreground"
                          }`}
                        >
                          {milestone.label}
                        </p>
                        <p className="text-sm text-muted-foreground">{milestone.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Schedule Details */}
            <Card>
              <CardHeader>
                <CardTitle>Shipment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="font-bold text-primary">{selectedSchedule.load_port_code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">To Port</p>
                    <p className="font-bold text-primary">{selectedSchedule.selected_port || "TBD"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Target Plant</p>
                    <p className="font-bold text-primary">{selectedSchedule.target_plant_code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Arrival</p>
                    <p className="font-bold text-primary">
                      {new Date(selectedSchedule.required_by_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
