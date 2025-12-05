"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { useRouter, useParams } from "next/navigation"
import { PortalNav } from "@/components/portal-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Ship, Anchor, CheckCircle2, Clock, MapPin, TrendingUp } from "lucide-react"
import { ShipmentMap } from "@/components/tracking/ShipmentMap"

export default function TrackingPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const scheduleId = params.id as string
  const [loading, setLoading] = useState(true)
  const [schedule, setSchedule] = useState<any>(null)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "LogisticsTeam") {
      router.push("/login")
      return
    }
    fetchScheduleDetails()
  }, [isAuthenticated, user, router, scheduleId])

  const fetchScheduleDetails = async () => {
    try {
      setLoading(true)
      
      // Fetch from procurement schedules API (where mock data is stored)
      const response = await fetch("/api/procurement/schedules")
      const data = await response.json()
      
      // Find the schedule with matching ID
      const foundSchedule = data.data?.find((s: any) => s.id === scheduleId)
      
      if (foundSchedule) {
        setSchedule(foundSchedule)
      } else {
        // Fallback: try schedules-full API
        const fallbackResponse = await fetch(`/api/schedules-full/${scheduleId}`)
        const fallbackData = await fallbackResponse.json()
        setSchedule(fallbackData.data)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch schedule:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || loading) return null

  const milestones = [
    { label: "Schedule Created", status: "completed", date: schedule?.created_at },
    {
      label: "Port Selected",
      status: schedule?.selected_port ? "completed" : "pending",
      date: schedule?.updated_at,
    },
    {
      label: "Vessel Sailed",
      status: schedule?.status === "IN_TRANSIT" ? "completed" : "pending",
      date: schedule?.sailing_date,
    },
    {
      label: "Vessel Arrived",
      status: schedule?.status === "DELIVERED" ? "completed" : "pending",
      date: schedule?.required_by_date,
    },
    { label: "Cargo Discharged", status: "pending", date: null },
    { label: "Rail Transport", status: "pending", date: null },
  ]

  const completedMilestones = milestones.filter((m) => m.status === "completed").length
  const progressPercentage = (completedMilestones / milestones.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <PortalNav title="Schedule Tracking" portal="logistics" />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-4" onClick={() => router.push("/logistics")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Schedules
        </Button>

        {schedule && (
          <>
            <Card className="p-6 mb-6 bg-gradient-to-r from-primary/10 to-primary/5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-primary mb-1">{schedule.vessel_name}</h1>
                  <p className="text-muted-foreground">
                    {schedule.schedule_code} • {schedule.material?.replace("_", " ")}
                  </p>
                </div>
                <Badge variant="default" className="text-lg py-2 px-4">
                  {schedule.status?.replace("_", " ").toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">From</p>
                  <p className="font-semibold">{schedule.load_port_code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">To</p>
                  <p className="font-semibold">{schedule.selected_port || "TBD"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Quantity</p>
                  <p className="font-semibold">{schedule.quantity_t?.toLocaleString()} T</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Estimated Cost</p>
                  <p className="font-semibold">
                    {schedule.cost_estimate_inr 
                      ? `₹${(schedule.cost_estimate_inr / 10000000).toFixed(2)} Cr`
                      : "TBD"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Shipment Route Map - Full Width */}
            <div className="mb-6">
              <ShipmentMap scheduleId={scheduleId} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ship className="h-5 w-5" />
                    Shipment Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm font-medium">
                        {completedMilestones} of {milestones.length} completed
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                  </div>

                  <div className="space-y-4">
                    {milestones.map((milestone, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            milestone.status === "completed" ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          {milestone.status === "completed" ? (
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          ) : (
                            <Clock className="h-5 w-5 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-semibold ${milestone.status === "completed" ? "text-green-700" : "text-muted-foreground"}`}
                          >
                            {milestone.label}
                          </p>
                          {milestone.date && (
                            <p className="text-sm text-muted-foreground">{new Date(milestone.date).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Current Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary mb-2">
                      {schedule.status === "IN_TRANSIT" ? "Indian Ocean" : schedule.load_port_code}
                    </p>
                    <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Anchor className="h-5 w-5" />
                      ETA Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-1">Expected Arrival</p>
                    <p className="text-lg font-bold text-primary mb-3">
                      {schedule.required_by_date ? new Date(schedule.required_by_date).toLocaleDateString() : "TBD"}
                    </p>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      On Schedule
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Target Plant</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 bg-secondary/30 rounded-lg">
                      <p className="font-semibold text-lg">{schedule.target_plant_code}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {schedule.quantity_t?.toLocaleString()} T {schedule.material?.replace("_", " ")}
                      </p>
                      {schedule.selected_port && (
                        <p className="text-sm text-primary mt-2">
                          Via {schedule.selected_port}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
