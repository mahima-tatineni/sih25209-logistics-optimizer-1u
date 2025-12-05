"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { PortalNav } from "@/components/portal-nav"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Ship, MapPin, CheckCircle, Clock, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"

export default function LogisticsTrackingPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [schedules, setSchedules] = useState<any[]>([])
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "LogisticsTeam") {
      router.push("/login")
    } else {
      fetchSchedules()
    }
  }, [isAuthenticated, user, router])

  const fetchSchedules = async () => {
    try {
      const response = await fetch("/api/procurement/schedules")
      const data = await response.json()
      const activeSchedules = data.data?.filter((s: any) => 
        s.status === "PORT_SELECTED" || s.status === "optimized" || s.status === "IN_TRANSIT"
      ) || []
      setSchedules(activeSchedules)
      if (activeSchedules.length > 0) {
        setSelectedSchedule(activeSchedules[0])
      }
    } catch (error) {
      console.error("[v0] Error fetching schedules:", error)
    } finally {
      setLoading(false)
    }
  }

  // Generate mock milestones for demonstration
  const getMilestones = (schedule: any) => {
    const baseDate = new Date(schedule.sailing_date || Date.now())
    return [
      {
        code: "SCHEDULE_CREATED",
        label: "Schedule Created",
        status: "completed",
        date: new Date(schedule.created_at),
        icon: CheckCircle,
      },
      {
        code: "PORT_SELECTED",
        label: "Discharge Port Selected",
        status: "completed",
        date: new Date(schedule.updated_at),
        port: schedule.optimized_port_id || schedule.selected_port,
        icon: MapPin,
      },
      {
        code: "VESSEL_SAILED",
        label: "Vessel Sailed from Load Port",
        status: schedule.status === "IN_TRANSIT" ? "completed" : "pending",
        date: baseDate,
        port: schedule.load_port_code,
        icon: Ship,
      },
      {
        code: "IN_TRANSIT",
        label: "In Transit to Discharge Port",
        status: schedule.status === "IN_TRANSIT" ? "active" : "pending",
        date: new Date(baseDate.getTime() + 15 * 24 * 60 * 60 * 1000),
        icon: Ship,
      },
      {
        code: "ARRIVE_PORT",
        label: "Arrived at Discharge Port",
        status: "pending",
        date: new Date(baseDate.getTime() + 19 * 24 * 60 * 60 * 1000),
        port: schedule.optimized_port_id || schedule.selected_port,
        icon: MapPin,
      },
      {
        code: "DISCHARGE_COMPLETE",
        label: "Discharge Complete",
        status: "pending",
        date: new Date(baseDate.getTime() + 22 * 24 * 60 * 60 * 1000),
        icon: CheckCircle,
      },
      {
        code: "RAIL_LOADING",
        label: "Rail Loading Started",
        status: "pending",
        date: new Date(baseDate.getTime() + 23 * 24 * 60 * 60 * 1000),
        icon: Clock,
      },
      {
        code: "ARRIVED_PLANT",
        label: "Arrived at Plant",
        status: "pending",
        date: new Date(baseDate.getTime() + 26 * 24 * 60 * 60 * 1000),
        plant: schedule.target_plant_code,
        icon: CheckCircle,
      },
    ]
  }

  // Generate AI scenarios
  const getAIScenarios = (schedule: any) => {
    return [
      {
        type: "BASE",
        title: "Base Scenario (Current Plan)",
        description: "Current optimized route with selected port",
        eta_port: new Date(new Date(schedule.sailing_date).getTime() + 19 * 24 * 60 * 60 * 1000),
        eta_plant: new Date(new Date(schedule.sailing_date).getTime() + 26 * 24 * 60 * 60 * 1000),
        total_cost: 45000000,
        delta_cost: 0,
        delta_days: 0,
        probability: 75,
        risk_level: "LOW",
        icon: CheckCircle,
        color: "green",
      },
      {
        type: "WEATHER_RISK",
        title: "Weather Delay Scenario",
        description: "Cyclone warning in Bay of Bengal - potential 3-day delay",
        eta_port: new Date(new Date(schedule.sailing_date).getTime() + 22 * 24 * 60 * 60 * 1000),
        eta_plant: new Date(new Date(schedule.sailing_date).getTime() + 29 * 24 * 60 * 60 * 1000),
        total_cost: 46500000,
        delta_cost: 1500000,
        delta_days: 3,
        probability: 35,
        risk_level: "MEDIUM",
        icon: AlertTriangle,
        color: "amber",
        reasons: ["Cyclone forecast in route", "Recommended speed reduction", "Additional demurrage expected"],
      },
      {
        type: "PORT_CONGESTION",
        title: "Port Congestion Scenario",
        description: "High vessel queue at selected port - 2-day waiting time",
        eta_port: new Date(new Date(schedule.sailing_date).getTime() + 21 * 24 * 60 * 60 * 1000),
        eta_plant: new Date(new Date(schedule.sailing_date).getTime() + 28 * 24 * 60 * 60 * 1000),
        total_cost: 46000000,
        delta_cost: 1000000,
        delta_days: 2,
        probability: 45,
        risk_level: "MEDIUM",
        icon: Clock,
        color: "amber",
        reasons: ["12 vessels in queue", "Average waiting time: 2.3 days", "Berth availability limited"],
      },
      {
        type: "ALTERNATE_PORT",
        title: "Alternate Port Option",
        description: "Switch to alternate port - faster but higher cost",
        eta_port: new Date(new Date(schedule.sailing_date).getTime() + 17 * 24 * 60 * 60 * 1000),
        eta_plant: new Date(new Date(schedule.sailing_date).getTime() + 24 * 24 * 60 * 60 * 1000),
        total_cost: 47000000,
        delta_cost: 2000000,
        delta_days: -2,
        probability: 90,
        risk_level: "LOW",
        icon: TrendingUp,
        color: "blue",
        reasons: ["Shorter ocean distance", "No congestion", "Higher port charges", "Faster rail route"],
      },
    ]
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <PortalNav title="Logistics Team Portal" portal="logistics" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Real-Time Tracking & AI Scenarios</h1>
          <p className="text-muted-foreground">
            Monitor active shipments with milestone tracking and AI-powered what-if analysis
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading tracking data...</p>
          </div>
        ) : schedules.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Ship className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Shipments</h3>
              <p className="text-muted-foreground">
                No schedules with selected ports yet. Complete port selection first.
              </p>
              <Button className="mt-4" onClick={() => router.push("/logistics")}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Schedule List Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Active Shipments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {schedules.map((schedule) => (
                    <button
                      key={schedule.id}
                      onClick={() => setSelectedSchedule(schedule)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition ${
                        selectedSchedule?.id === schedule.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-primary/50"
                      }`}
                    >
                      <p className="font-semibold text-sm">{schedule.schedule_code}</p>
                      <p className="text-xs text-muted-foreground">{schedule.vessel_name}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {schedule.target_plant_code}
                      </Badge>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Tracking Content */}
            <div className="lg:col-span-3">
              {selectedSchedule && (
                <Tabs defaultValue="timeline" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="timeline">Milestone Timeline</TabsTrigger>
                    <TabsTrigger value="scenarios">AI Scenarios</TabsTrigger>
                    <TabsTrigger value="alerts">Alerts & Risks</TabsTrigger>
                  </TabsList>

                  {/* Timeline Tab */}
                  <TabsContent value="timeline" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Shipment Timeline</CardTitle>
                        <CardDescription>
                          {selectedSchedule.schedule_code} • {selectedSchedule.vessel_name} • 
                          {selectedSchedule.quantity_t?.toLocaleString()}t {selectedSchedule.material?.replace("_", " ")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {getMilestones(selectedSchedule).map((milestone, index) => {
                            const Icon = milestone.icon
                            return (
                              <div key={milestone.code} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                  <div
                                    className={`rounded-full p-2 ${
                                      milestone.status === "completed"
                                        ? "bg-green-100 text-green-600"
                                        : milestone.status === "active"
                                          ? "bg-blue-100 text-blue-600 animate-pulse"
                                          : "bg-gray-100 text-gray-400"
                                    }`}
                                  >
                                    <Icon className="h-5 w-5" />
                                  </div>
                                  {index < getMilestones(selectedSchedule).length - 1 && (
                                    <div
                                      className={`w-0.5 h-12 ${
                                        milestone.status === "completed" ? "bg-green-300" : "bg-gray-200"
                                      }`}
                                    />
                                  )}
                                </div>
                                <div className="flex-1 pb-8">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <p className="font-semibold">{milestone.label}</p>
                                      {milestone.port && (
                                        <p className="text-sm text-muted-foreground">Port: {milestone.port}</p>
                                      )}
                                      {milestone.plant && (
                                        <p className="text-sm text-muted-foreground">Plant: {milestone.plant}</p>
                                      )}
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {milestone.status === "completed"
                                          ? `Completed: ${milestone.date.toLocaleDateString()}`
                                          : milestone.status === "active"
                                            ? "In Progress"
                                            : `Expected: ${milestone.date.toLocaleDateString()}`}
                                      </p>
                                    </div>
                                    <Badge
                                      variant={
                                        milestone.status === "completed"
                                          ? "default"
                                          : milestone.status === "active"
                                            ? "secondary"
                                            : "outline"
                                      }
                                    >
                                      {milestone.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* AI Scenarios Tab */}
                  <TabsContent value="scenarios" className="space-y-4">
                    <Card className="border-2 border-blue-200 bg-blue-50">
                      <CardHeader>
                        <CardTitle className="text-blue-900">AI-Powered What-If Analysis</CardTitle>
                        <CardDescription className="text-blue-700">
                          Automatically generated scenarios based on real-time data, weather forecasts, and historical patterns
                        </CardDescription>
                      </CardHeader>
                    </Card>

                    {getAIScenarios(selectedSchedule).map((scenario) => {
                      const Icon = scenario.icon
                      return (
                        <Card
                          key={scenario.type}
                          className={`border-2 ${
                            scenario.color === "green"
                              ? "border-green-200 bg-green-50"
                              : scenario.color === "amber"
                                ? "border-amber-200 bg-amber-50"
                                : "border-blue-200 bg-blue-50"
                          }`}
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                              <div
                                className={`rounded-full p-3 ${
                                  scenario.color === "green"
                                    ? "bg-green-100 text-green-600"
                                    : scenario.color === "amber"
                                      ? "bg-amber-100 text-amber-600"
                                      : "bg-blue-100 text-blue-600"
                                }`}
                              >
                                <Icon className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-bold text-lg">{scenario.title}</h3>
                                    <p className="text-sm text-muted-foreground">{scenario.description}</p>
                                  </div>
                                  <div className="text-right">
                                    <Badge
                                      variant={
                                        scenario.risk_level === "LOW"
                                          ? "default"
                                          : scenario.risk_level === "MEDIUM"
                                            ? "secondary"
                                            : "destructive"
                                      }
                                    >
                                      {scenario.risk_level} RISK
                                    </Badge>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {scenario.probability}% probability
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                  <div>
                                    <p className="text-xs text-muted-foreground">ETA Port</p>
                                    <p className="font-semibold">{scenario.eta_port.toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">ETA Plant</p>
                                    <p className="font-semibold">{scenario.eta_plant.toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Total Cost</p>
                                    <p className="font-semibold">₹{(scenario.total_cost / 10000000).toFixed(2)} Cr</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">vs Base</p>
                                    <p
                                      className={`font-semibold flex items-center gap-1 ${
                                        scenario.delta_days > 0
                                          ? "text-red-600"
                                          : scenario.delta_days < 0
                                            ? "text-green-600"
                                            : "text-gray-600"
                                      }`}
                                    >
                                      {scenario.delta_days > 0 ? (
                                        <TrendingDown className="h-4 w-4" />
                                      ) : scenario.delta_days < 0 ? (
                                        <TrendingUp className="h-4 w-4" />
                                      ) : null}
                                      {scenario.delta_days > 0 ? "+" : ""}
                                      {scenario.delta_days} days
                                    </p>
                                  </div>
                                </div>

                                {scenario.reasons && (
                                  <div className="mt-4 p-3 bg-white/50 rounded-lg">
                                    <p className="text-xs font-semibold mb-2">Key Factors:</p>
                                    <ul className="text-xs space-y-1">
                                      {scenario.reasons.map((reason, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                          <span className="text-primary">•</span>
                                          <span>{reason}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </TabsContent>

                  {/* Alerts Tab */}
                  <TabsContent value="alerts" className="space-y-4">
                    <Card className="border-2 border-amber-200 bg-amber-50">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <AlertTriangle className="h-6 w-6 text-amber-600" />
                          <div>
                            <h3 className="font-bold text-amber-900">Weather Alert</h3>
                            <p className="text-sm text-amber-700">
                              Cyclone warning issued for Bay of Bengal. Monitor vessel progress closely.
                            </p>
                            <p className="text-xs text-amber-600 mt-2">Issued: 2 hours ago</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-blue-200 bg-blue-50">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Clock className="h-6 w-6 text-blue-600" />
                          <div>
                            <h3 className="font-bold text-blue-900">Port Congestion Update</h3>
                            <p className="text-sm text-blue-700">
                              Selected port has 12 vessels in queue. Expected waiting time: 2.3 days.
                            </p>
                            <p className="text-xs text-blue-600 mt-2">Updated: 30 minutes ago</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-green-200 bg-green-50">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                          <div>
                            <h3 className="font-bold text-green-900">On Schedule</h3>
                            <p className="text-sm text-green-700">
                              Vessel is maintaining schedule. No delays expected at current speed.
                            </p>
                            <p className="text-xs text-green-600 mt-2">Last updated: 1 hour ago</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
