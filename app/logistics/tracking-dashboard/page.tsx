"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { PortalNav } from "@/components/portal-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Ship, MapPin, CheckCircle2, Clock } from "lucide-react"
import { ShipmentMap } from "@/components/tracking/ShipmentMap"

export default function TrackingDashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [schedules, setSchedules] = useState<any[]>([])
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "LogisticsTeam") {
      router.push("/login")
      return
    }
    fetchSchedules()
  }, [isAuthenticated, user, router])

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
      console.error("[Logistics] Failed to fetch schedules:", error)
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

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <PortalNav title="Real-Time Tracking & AI Scenarios" portal="logistics" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
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
                Schedules with selected ports will appear here for tracking
              </p>
            </CardContent>
          </Card>
        ) : (
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

                  {/* AI Scenarios - What-If Analysis */}
                  <Card className="border-2 border-purple-200 bg-purple-50/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-purple-900">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        AI Scenarios
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        AI-powered what-if analysis and predictive insights
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Weather Delay Scenario */}
                      <div className="p-4 bg-white rounded-lg border border-purple-200">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                            <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm mb-1">Weather Delay Risk</p>
                            <p className="text-xs text-muted-foreground mb-2">
                              Cyclone forecast in Indian Ocean region during transit window
                            </p>
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-300">
                                Medium Risk
                              </Badge>
                              <span className="text-xs text-muted-foreground">+2-3 days delay possible</span>
                            </div>
                            {/* Cost Impact */}
                            <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                              <p className="text-xs font-semibold text-yellow-900 mb-2">Cost Impact Analysis:</p>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Vessel Demurrage (3 days @ ₹45L/day):</span>
                                  <span className="font-semibold text-yellow-900">₹1.35 Cr</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Port Waiting Charges:</span>
                                  <span className="font-semibold text-yellow-900">₹0.25 Cr</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Plant Production Loss (3 days):</span>
                                  <span className="font-semibold text-yellow-900">₹2.80 Cr</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-yellow-300">
                                  <span className="font-bold text-yellow-900">Total Potential Cost:</span>
                                  <span className="font-bold text-yellow-900">₹4.40 Cr</span>
                                </div>
                              </div>
                              <p className="text-xs text-yellow-700 mt-2 font-medium">
                                💡 Mitigation: Consider rerouting via southern route (+₹0.8 Cr but avoids cyclone)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Port Congestion Scenario */}
                      <div className="p-4 bg-white rounded-lg border border-purple-200">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm mb-1">Port Congestion Alert</p>
                            <p className="text-xs text-muted-foreground mb-2">
                              {selectedSchedule.selected_port || "Selected port"} currently has 8 vessels waiting for berth
                            </p>
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-300">
                                High Impact
                              </Badge>
                              <span className="text-xs text-muted-foreground">+4-5 days demurrage risk</span>
                            </div>
                            {/* Cost Impact */}
                            <div className="p-3 bg-orange-50 rounded border border-orange-200">
                              <p className="text-xs font-semibold text-orange-900 mb-2">Cost Impact Analysis:</p>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Demurrage (5 days @ ₹45L/day):</span>
                                  <span className="font-semibold text-orange-900">₹2.25 Cr</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Port Anchorage Charges:</span>
                                  <span className="font-semibold text-orange-900">₹0.40 Cr</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Crew Overtime & Provisions:</span>
                                  <span className="font-semibold text-orange-900">₹0.15 Cr</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Plant Stock-out Risk:</span>
                                  <span className="font-semibold text-orange-900">₹3.50 Cr</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-orange-300">
                                  <span className="font-bold text-orange-900">Total Potential Cost:</span>
                                  <span className="font-bold text-orange-900">₹6.30 Cr</span>
                                </div>
                              </div>
                              <p className="text-xs text-orange-700 mt-2 font-medium">
                                💡 Mitigation: Divert to Paradip Port (saves ₹3.8 Cr after diversion costs)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Alternative Route Suggestion */}
                      <div className="p-4 bg-white rounded-lg border border-purple-200">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm mb-1">Alternative Route Available</p>
                            <p className="text-xs text-muted-foreground mb-2">
                              Paradip Port has lower congestion and similar rail connectivity to {selectedSchedule.target_plant_code}
                            </p>
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                                Cost Saving
                              </Badge>
                              <span className="text-xs text-muted-foreground">₹2.5 Cr potential savings</span>
                            </div>
                            {/* Cost Comparison */}
                            <div className="p-3 bg-green-50 rounded border border-green-200">
                              <p className="text-xs font-semibold text-green-900 mb-2">Cost Comparison:</p>
                              <div className="grid grid-cols-2 gap-3 text-xs mb-2">
                                <div>
                                  <p className="font-medium text-muted-foreground mb-1">Current Route ({selectedSchedule.selected_port || "VIZAG"}):</p>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Ocean Freight:</span>
                                      <span>₹8.5 Cr</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Port Charges:</span>
                                      <span>₹1.2 Cr</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Rail Freight:</span>
                                      <span>₹3.8 Cr</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Demurrage Risk:</span>
                                      <span>₹2.0 Cr</span>
                                    </div>
                                    <div className="flex justify-between pt-1 border-t border-green-300 font-bold">
                                      <span>Total:</span>
                                      <span className="text-red-700">₹15.5 Cr</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <p className="font-medium text-muted-foreground mb-1">Alternative (Paradip):</p>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Ocean Freight:</span>
                                      <span>₹8.8 Cr</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Port Charges:</span>
                                      <span>₹0.9 Cr</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Rail Freight:</span>
                                      <span>₹3.3 Cr</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Demurrage Risk:</span>
                                      <span>₹0.5 Cr</span>
                                    </div>
                                    <div className="flex justify-between pt-1 border-t border-green-300 font-bold">
                                      <span>Total:</span>
                                      <span className="text-green-700">₹13.5 Cr</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t-2 border-green-400">
                                <span className="font-bold text-green-900">Net Savings:</span>
                                <span className="font-bold text-lg text-green-700">₹2.0 Cr</span>
                              </div>
                              <p className="text-xs text-green-700 mt-2 font-medium">
                                ✅ Recommendation: Switch to Paradip Port for cost optimization
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Rail Capacity Scenario */}
                      <div className="p-4 bg-white rounded-lg border border-purple-200">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm mb-1">Rail Capacity Confirmed</p>
                            <p className="text-xs text-muted-foreground mb-2">
                              {Math.ceil(selectedSchedule.quantity_t / 3500)} rakes pre-allocated for {new Date(selectedSchedule.required_by_date).toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                                On Track
                              </Badge>
                              <span className="text-xs text-muted-foreground">No delays expected</span>
                            </div>
                            {/* Cost Impact */}
                            <div className="p-3 bg-blue-50 rounded border border-blue-200">
                              <p className="text-xs font-semibold text-blue-900 mb-2">Rail Transport Cost Breakdown:</p>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Rakes Required:</span>
                                  <span className="font-semibold text-blue-900">{Math.ceil(selectedSchedule.quantity_t / 3500)} rakes</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Distance ({selectedSchedule.selected_port || "Port"} → {selectedSchedule.target_plant_code}):</span>
                                  <span className="font-semibold text-blue-900">~850 km</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Rail Freight (@ ₹0.95/km/tonne):</span>
                                  <span className="font-semibold text-blue-900">₹{((selectedSchedule.quantity_t * 850 * 0.95) / 10000000).toFixed(2)} Cr</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Loading/Unloading Charges:</span>
                                  <span className="font-semibold text-blue-900">₹0.45 Cr</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Transit Insurance:</span>
                                  <span className="font-semibold text-blue-900">₹0.15 Cr</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-blue-300">
                                  <span className="font-bold text-blue-900">Total Rail Cost:</span>
                                  <span className="font-bold text-blue-900">₹{((selectedSchedule.quantity_t * 850 * 0.95) / 10000000 + 0.6).toFixed(2)} Cr</span>
                                </div>
                              </div>
                              <p className="text-xs text-blue-700 mt-2 font-medium">
                                ✅ Status: All rakes confirmed, no additional costs expected
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Alerts & Notifications */}
                  <Card className="border-2 border-red-200 bg-red-50/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-900">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        Alerts & Notifications
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Real-time alerts and critical notifications
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Critical Alert */}
                      {selectedSchedule.status === "IN_TRANSIT" && (
                        <div className="p-4 bg-white rounded-lg border-2 border-red-300">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                              <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-bold text-sm text-red-900">Vessel Position Update Required</p>
                                <Badge className="bg-red-600 text-white text-xs">Critical</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                Last AIS update received 6 hours ago. Vessel tracking may be delayed.
                              </p>
                              <p className="text-xs text-red-700 font-medium">
                                Action: Contact vessel operator for position update
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Warning Alert */}
                      <div className="p-4 bg-white rounded-lg border-2 border-yellow-300">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                            <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-bold text-sm text-yellow-900">Plant Stock Running Low</p>
                              <Badge className="bg-yellow-600 text-white text-xs">Warning</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {selectedSchedule.target_plant_code} {selectedSchedule.material?.replace("_", " ")} stock at 18 days cover (below 20-day threshold)
                            </p>
                            <p className="text-xs text-yellow-700 font-medium">
                              Priority: Expedite discharge and rail transport
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Info Alert */}
                      <div className="p-4 bg-white rounded-lg border-2 border-blue-300">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-bold text-sm text-blue-900">Documentation Complete</p>
                              <Badge className="bg-blue-600 text-white text-xs">Info</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              All customs and port clearance documents submitted and approved
                            </p>
                            <p className="text-xs text-blue-700 font-medium">
                              Status: Ready for discharge upon arrival
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Success Alert */}
                      {selectedSchedule.status === "PORT_SELECTED" && (
                        <div className="p-4 bg-white rounded-lg border-2 border-green-300">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-bold text-sm text-green-900">Port & Rail Confirmed</p>
                                <Badge className="bg-green-600 text-white text-xs">Success</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                Berth slot and rake allocation confirmed for {new Date(selectedSchedule.required_by_date).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-green-700 font-medium">
                                All systems ready for vessel arrival
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
