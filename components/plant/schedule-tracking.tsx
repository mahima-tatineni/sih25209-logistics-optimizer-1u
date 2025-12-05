"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Ship, MapPin } from "lucide-react"
import { ShipmentMap } from "@/components/tracking/ShipmentMap"

interface PlantScheduleTrackingProps {
  plantId: string
}

export function PlantScheduleTracking({ plantId }: PlantScheduleTrackingProps) {
  const [schedules, setSchedules] = useState<any[]>([])
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchedules()
  }, [plantId])

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      // Fetch schedules that have been optimized by logistics (PORT_SELECTED status)
      const response = await fetch("/api/procurement/schedules")
      const data = await response.json()
      
      // Filter schedules for this plant that have been optimized
      const plantSchedules = (data.data || []).filter((s: any) => 
        s.target_plant_code === plantId && 
        (s.status === "PORT_SELECTED" || s.status === "IN_TRANSIT" || s.status === "DELIVERED")
      )
      
      setSchedules(plantSchedules)
      
      // Auto-select first schedule
      if (plantSchedules.length > 0 && !selectedSchedule) {
        setSelectedSchedule(plantSchedules[0])
      }
    } catch (error) {
      console.error("[Plant] Failed to fetch schedules:", error)
    } finally {
      setLoading(false)
    }
  }

  const getProgress = (status: string) => {
    switch (status) {
      case "PORT_SELECTED": return 25
      case "IN_TRANSIT": return 60
      case "DELIVERED": return 100
      default: return 0
    }
  }

  const getMilestones = (schedule: any) => {
    const status = schedule.status
    return [
      { 
        name: "Schedule Created", 
        completed: true, 
        date: new Date(schedule.created_at).toLocaleDateString() 
      },
      { 
        name: "Port Selected", 
        completed: status === "PORT_SELECTED" || status === "IN_TRANSIT" || status === "DELIVERED", 
        date: schedule.selected_port ? `${schedule.selected_port}` : "Pending" 
      },
      { 
        name: "Vessel Sailed", 
        completed: status === "IN_TRANSIT" || status === "DELIVERED", 
        date: status === "IN_TRANSIT" || status === "DELIVERED" ? new Date(schedule.sailing_date).toLocaleDateString() : "Pending" 
      },
      { 
        name: "Expected Arrival", 
        completed: status === "DELIVERED", 
        date: new Date(schedule.required_by_date).toLocaleDateString() 
      },
    ]
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading schedules...</p>
      </div>
    )
  }

  if (schedules.length === 0) {
    return (
      <Card className="border-2 border-primary/20">
        <CardContent className="py-12 text-center">
          <Ship className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Active Schedules</h3>
          <p className="text-muted-foreground">
            Schedules optimized by the Logistics team will appear here
          </p>
        </CardContent>
      </Card>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PORT_SELECTED": return "bg-blue-100 text-blue-800"
      case "IN_TRANSIT": return "bg-purple-100 text-purple-800"
      case "DELIVERED": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Side - Schedule List */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Incoming Shipments</CardTitle>
            <CardDescription>{schedules.length} active schedule{schedules.length !== 1 ? "s" : ""}</CardDescription>
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
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{schedule.quantity_t?.toLocaleString()} t</span>
                  <span className="text-muted-foreground">{new Date(schedule.required_by_date).toLocaleDateString()}</span>
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

            {/* Schedule Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-primary">{selectedSchedule.vessel_name}</CardTitle>
                    <CardDescription>
                      {selectedSchedule.material?.replace("_", " ")} from {selectedSchedule.load_port_code} → {selectedSchedule.selected_port || "Port TBD"}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(selectedSchedule.status)}>
                    {selectedSchedule.status?.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Schedule Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-bold text-primary">{selectedSchedule.quantity_t?.toLocaleString()} t</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Arrival</p>
                    <p className="font-bold text-primary">{new Date(selectedSchedule.required_by_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Schedule Code</p>
                    <p className="font-bold text-primary">{selectedSchedule.schedule_code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <p className="font-bold text-primary">{getProgress(selectedSchedule.status)}%</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-primary">Overall Progress</p>
                    <p className="text-xs text-muted-foreground">{getProgress(selectedSchedule.status)}% complete</p>
                  </div>
                  <Progress value={getProgress(selectedSchedule.status)} className="h-2" />
                </div>

                {/* Milestones */}
                <div>
                  <p className="text-sm font-semibold text-primary mb-3">Journey Milestones</p>
                  <div className="space-y-2">
                    {getMilestones(selectedSchedule).map((milestone, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div
                          className={`h-4 w-4 rounded-full border-2 flex-shrink-0 ${
                            milestone.completed ? "bg-green-500 border-green-500" : "border-primary/30 bg-white"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{milestone.name}</p>
                          <p className="text-xs text-muted-foreground">{milestone.date}</p>
                        </div>
                        {milestone.completed && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Completed
                          </Badge>
                        )}
                      </div>
                    ))}
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
