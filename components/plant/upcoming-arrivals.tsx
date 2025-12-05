"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Ship, Calendar, Package } from "lucide-react"
import { ShipmentMap } from "@/components/tracking/ShipmentMap"

interface UpcomingArrivalsProps {
  plantId: string
  plantName: string
}

export function UpcomingArrivals({ plantId, plantName }: UpcomingArrivalsProps) {
  const [schedules, setSchedules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchedules()
  }, [plantId])

  const fetchSchedules = async () => {
    try {
      const response = await fetch("/api/procurement/schedules")
      const data = await response.json()
      
      // Filter schedules for this plant that are active
      const plantSchedules = (data.data || []).filter((s: any) => 
        s.target_plant_code === plantId && 
        (s.status === "PORT_SELECTED" || s.status === "IN_TRANSIT")
      )
      
      // Sort by required date
      plantSchedules.sort((a: any, b: any) => 
        new Date(a.required_by_date).getTime() - new Date(b.required_by_date).getTime()
      )
      
      setSchedules(plantSchedules)
    } catch (error) {
      console.error("[Plant] Error fetching schedules:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="border-2 border-primary/20">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading upcoming arrivals...</p>
        </CardContent>
      </Card>
    )
  }

  if (schedules.length === 0) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Upcoming Arrivals</CardTitle>
          <CardDescription>Scheduled vessels/rakes to {plantName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Ship className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No upcoming arrivals scheduled</p>
            <p className="text-sm mt-1">Arrivals will appear here after procurement assigns vessels</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary">Upcoming Arrivals</CardTitle>
        <CardDescription>{schedules.length} shipment{schedules.length !== 1 ? "s" : ""} scheduled to {plantName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="flex items-start justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition border border-primary/10"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Ship className="h-4 w-4 text-primary" />
                  <p className="font-semibold text-primary">{schedule.vessel_name}</p>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Package className="h-3 w-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground capitalize">
                    {schedule.material?.replace("_", " ")} · {schedule.quantity_t?.toLocaleString()} tonnes
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Expected: {new Date(schedule.required_by_date).toLocaleDateString()}
                  </p>
                </div>
                {schedule.selected_port && (
                  <p className="text-xs text-blue-600 mt-1">
                    Via {schedule.selected_port} Port
                  </p>
                )}
              </div>
              <div className="text-right">
                <Badge
                  variant={schedule.status === "IN_TRANSIT" ? "default" : "secondary"}
                  className={schedule.status === "IN_TRANSIT" ? "bg-blue-600" : ""}
                >
                  {schedule.status?.replace("_", " ")}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {schedule.schedule_code}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
