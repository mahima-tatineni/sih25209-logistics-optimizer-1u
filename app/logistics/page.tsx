"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { PortalNav } from "@/components/portal-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Ship, ArrowRight } from "lucide-react"
import { ShipmentMap } from "@/components/tracking/ShipmentMap"

export default function LogisticsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [schedules, setSchedules] = useState<any[]>([])
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
      // Fetch all schedules (not just SENT_TO_LOGISTICS)
      const response = await fetch("/api/procurement/schedules")
      const data = await response.json()
      console.log("[v0] Logistics schedules:", data)
      // Filter out schedules that have been returned to procurement
      const activeSchedules = (data.data || []).filter((s: any) => s.status !== "RETURNED_TO_PROCUREMENT")
      setSchedules(activeSchedules)
    } catch (error) {
      console.error("[v0] Error fetching schedules:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <PortalNav title="Logistics Team Portal" portal="logistics" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Schedules for Port Selection</h1>
          <p className="text-muted-foreground">
            Import schedules from procurement awaiting port selection and optimization
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading schedules...</p>
          </div>
        ) : schedules.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Ship className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Schedules Found</h3>
              <p className="text-muted-foreground">
                No schedules from procurement yet. Create a schedule in procurement portal first.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Pending Port Selection */}
            {schedules.filter(s => s.status === "SENT_TO_LOGISTICS").length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-amber-600">
                  ⏳ Pending Port Selection ({schedules.filter(s => s.status === "SENT_TO_LOGISTICS").length})
                </h2>
                <div className="space-y-4">
                  {schedules.filter(s => s.status === "SENT_TO_LOGISTICS").map((schedule) => (
                    <Card key={schedule.id} className="border-2 border-amber-200 hover:border-amber-400 transition">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Schedule ID</p>
                            <p className="font-bold text-primary">{schedule.schedule_code}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Vessel</p>
                            <p className="font-bold">{schedule.vessel_name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Material & Quantity</p>
                            <p className="font-bold">
                              {schedule.material?.replace("_", " ")} · {schedule.quantity_t?.toLocaleString()}t
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Target Plant</p>
                            <p className="font-bold text-primary">{schedule.target_plant_code}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Load Port</p>
                            <Badge variant="secondary">{schedule.load_port_code}</Badge>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Sailing Date</p>
                            <Badge variant="outline">{new Date(schedule.sailing_date).toLocaleDateString()}</Badge>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Required By</p>
                            <Badge variant="outline">{new Date(schedule.required_by_date).toLocaleDateString()}</Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            {schedule.status?.replace("_", " ")}
                          </Badge>
                          <Button
                            className="bg-accent hover:bg-accent/90"
                            onClick={() => router.push(`/logistics/port-selection/${schedule.id}`)}
                          >
                            Select Discharge Port
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Port Selected / Optimized */}
            {schedules.filter(s => s.status === "PORT_SELECTED" || s.status === "optimized").length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-green-600">
                  ✅ Port Selected ({schedules.filter(s => s.status === "PORT_SELECTED" || s.status === "optimized").length})
                </h2>
                <div className="space-y-4">
                  {schedules.filter(s => s.status === "PORT_SELECTED" || s.status === "optimized").map((schedule) => (
                    <Card key={schedule.id} className="border-2 border-green-200 hover:border-green-400 transition">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Schedule ID</p>
                            <p className="font-bold text-primary">{schedule.schedule_code}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Vessel</p>
                            <p className="font-bold">{schedule.vessel_name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Material & Quantity</p>
                            <p className="font-bold">
                              {schedule.material?.replace("_", " ")} · {schedule.quantity_t?.toLocaleString()}t
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Selected Port</p>
                            <p className="font-bold text-green-600">{schedule.optimized_port_id || schedule.selected_port || "N/A"}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge variant="default" className="bg-green-600">
                            {schedule.status?.replace("_", " ")}
                          </Badge>
                          <Button
                            variant="outline"
                            onClick={() => router.push(`/logistics/tracking/${schedule.id}`)}
                          >
                            View Details
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* In Transit */}
            {schedules.filter(s => s.status === "IN_TRANSIT" || s.status === "In Transit").length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-blue-600">
                  🚢 In Transit ({schedules.filter(s => s.status === "IN_TRANSIT" || s.status === "In Transit").length})
                </h2>
                <div className="space-y-4">
                  {schedules.filter(s => s.status === "IN_TRANSIT" || s.status === "In Transit").map((schedule) => (
                    <Card key={schedule.id} className="border-2 border-blue-200">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Schedule ID</p>
                            <p className="font-bold text-primary">{schedule.schedule_code}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Vessel</p>
                            <p className="font-bold">{schedule.vessel_name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Port</p>
                            <p className="font-bold">{schedule.optimized_port_id || schedule.selected_port}</p>
                          </div>
                          <div>
                            <Badge variant="default" className="bg-blue-600">In Transit</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
