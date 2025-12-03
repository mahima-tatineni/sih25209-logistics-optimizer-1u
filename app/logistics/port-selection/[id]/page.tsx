"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { useRouter, useParams } from "next/navigation"
import { PortalNav } from "@/components/portal-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Ship, AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react"
import type { ImportSchedule, PortCandidate } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function PortSelectionPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const scheduleId = params.id as string

  const [schedule, setSchedule] = useState<ImportSchedule | null>(null)
  const [candidatePorts, setCandidatePorts] = useState<PortCandidate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "LogisticsTeam") {
      router.push("/login")
      return
    }
    fetchScheduleAndPorts()
  }, [isAuthenticated, user, router, scheduleId])

  const fetchScheduleAndPorts = async () => {
    try {
      setLoading(true)

      const scheduleResponse = await fetch(`/api/schedules-full/${scheduleId}`)
      const scheduleData = await scheduleResponse.json()

      if (scheduleData.data) {
        const rawSchedule = scheduleData.data
        const mappedSchedule: ImportSchedule = {
          id: rawSchedule.id,
          schedule_id: rawSchedule.id.substring(0, 12),
          material: rawSchedule.material_type,
          quantity_t: rawSchedule.quantity,
          vessel_id: rawSchedule.id,
          vessel_name: rawSchedule.vessel_name,
          load_port: rawSchedule.supplier_port_id,
          load_port_name: rawSchedule.supplier_port_name || rawSchedule.supplier_port_id,
          sailing_date: rawSchedule.laycan_start,
          required_by_date: rawSchedule.laycan_end,
          target_plant: rawSchedule.linked_requests?.[0]?.plant_id || "BSP",
          target_plant_name: rawSchedule.linked_requests?.[0]?.plant_name || "Multiple Plants",
          status: rawSchedule.optimized_port_id ? "Port Selected" : "Pending Port Selection",
          selected_port: rawSchedule.optimized_port_id,
          selected_port_name: rawSchedule.optimized_port_name,
          created_at: rawSchedule.created_at,
          from_procurement_user: "Procurement Team",
        }
        setSchedule(mappedSchedule)

        await generatePortCandidates(mappedSchedule)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch schedule:", error)
      // Fallback to mock data
      const mockSchedule: ImportSchedule = {
        id: scheduleId,
        schedule_id: "SCH-2025-001",
        material: "coking_coal",
        quantity_t: 75000,
        vessel_id: "V001",
        vessel_name: "MV Pacific Glory",
        load_port: "GLAD",
        load_port_name: "Gladstone, Australia",
        sailing_date: "2025-01-18",
        required_by_date: "2025-02-15",
        target_plant: "BSP",
        target_plant_name: "Bhilai Steel Plant",
        status: "Pending Port Selection",
        created_at: "2025-01-10",
        from_procurement_user: "Sanjay Gupta",
      }
      setSchedule(mockSchedule)
      await generatePortCandidates(mockSchedule)
    } finally {
      setLoading(false)
    }
  }

  const generatePortCandidates = async (scheduleData: ImportSchedule) => {
    // Mock optimization logic - in production, this would call optimization API
    const mockCandidates: PortCandidate[] = [
      {
        port_id: "VIZAG",
        port_name: "Visakhapatnam",
        distance_nm: 5420,
        transit_days: 18,
        total_cost_inr: 285000000,
        cost_breakdown: {
          ocean_freight_inr: 180000000,
          port_charges_inr: 42000000,
          rail_freight_inr: 51000000,
          demurrage_inr: 12000000,
        },
        risks: {
          weather: "Low",
          congestion: "Medium",
          depth_draft: "Low",
        },
        status: "Optimised",
        optimization_notes: "Lowest total cost among feasible ports. Optimal rail connectivity to target plant.",
      },
      {
        port_id: "PARA",
        port_name: "Paradip",
        distance_nm: 5650,
        transit_days: 19,
        total_cost_inr: 292000000,
        cost_breakdown: {
          ocean_freight_inr: 185000000,
          port_charges_inr: 39000000,
          rail_freight_inr: 58500000,
          demurrage_inr: 9500000,
        },
        risks: {
          weather: "Medium",
          congestion: "Low",
          depth_draft: "Low",
        },
        status: "Feasible",
        optimization_notes: "+₹7 Cr vs Vizag mainly due to higher rail freight distance.",
      },
      {
        port_id: "HALD",
        port_name: "Haldia",
        distance_nm: 5850,
        transit_days: 20,
        total_cost_inr: 0,
        cost_breakdown: {
          ocean_freight_inr: 0,
          port_charges_inr: 0,
          rail_freight_inr: 0,
          demurrage_inr: 0,
        },
        risks: {
          weather: "High",
          congestion: "Medium",
          depth_draft: "High",
        },
        status: "Non-Feasible",
        reason: `Riverine port with draft limit 9.5m - not suitable for ${scheduleData.quantity_t.toLocaleString()}T Panamax vessel`,
      },
    ]

    setCandidatePorts(mockCandidates)
  }

  const handlePortSelection = async (portId: string, costEstimate: number) => {
    if (
      !confirm(
        "Approve this port selection and finalize the route? This will send back to Procurement for confirmation.",
      )
    )
      return

    try {
      const response = await fetch(`/api/schedules-full/${scheduleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          optimized_port_id: portId,
          status: "optimized",
          cost_estimate_inr: costEstimate,
        }),
      })

      if (!response.ok) throw new Error("Failed to select port")

      alert("Route optimized and sent to Procurement for final confirmation!")
      router.push("/logistics/schedules")
    } catch (error) {
      console.error("[v0] Failed to select port:", error)
      alert("Failed to select port. Please try again.")
    }
  }

  const handleSendBack = async () => {
    const reason = prompt("Reason for sending back to Procurement:")
    if (!reason) return

    try {
      await fetch(`/api/schedules-full/${scheduleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "draft",
          notes: `Returned by Logistics: ${reason}`,
        }),
      })
      alert("Schedule sent back to Procurement")
      router.push("/logistics/schedules")
    } catch (error) {
      console.error("[v0] Failed to send back:", error)
      alert("Failed to send back schedule")
    }
  }

  const getRiskColor = (risk: "Low" | "Medium" | "High") => {
    switch (risk) {
      case "Low":
        return "text-green-600 bg-green-50"
      case "Medium":
        return "text-yellow-600 bg-yellow-50"
      case "High":
        return "text-red-600 bg-red-50"
    }
  }

  const getStatusBadge = (status: PortCandidate["status"]) => {
    switch (status) {
      case "Optimised":
        return <Badge className="bg-green-500 hover:bg-green-600">Optimised</Badge>
      case "Feasible":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Feasible</Badge>
      case "Non-Feasible":
        return <Badge className="bg-red-500 hover:bg-red-600">Non-Feasible</Badge>
    }
  }

  if (!isAuthenticated || loading) return null

  const feasiblePorts = candidatePorts.filter((p) => p.status !== "Non-Feasible")
  const nonFeasiblePorts = candidatePorts.filter((p) => p.status === "Non-Feasible")

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <PortalNav title="Port Selection" portal="logistics" />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-4" onClick={() => router.push("/logistics/schedules")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Schedules
        </Button>

        {schedule && (
          <>
            <Card className="p-6 mb-6 bg-gradient-to-r from-primary/10 to-primary/5">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Schedule ID</div>
                  <div className="font-mono font-bold text-primary">{schedule.schedule_id}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Vessel</div>
                  <div className="font-medium flex items-center gap-1">
                    <Ship className="h-3 w-3" />
                    {schedule.vessel_name}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Load Port</div>
                  <div className="font-medium">{schedule.load_port}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Target Plant</div>
                  <div className="font-medium">{schedule.target_plant}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Material</div>
                  <div className="font-medium capitalize">{schedule.material.replace("_", " ")}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Quantity</div>
                  <div className="font-medium">{schedule.quantity_t.toLocaleString()} T</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Sailing Date</div>
                  <div className="font-medium">{new Date(schedule.sailing_date).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Required Date</div>
                  <div className="font-medium">{new Date(schedule.required_by_date).toLocaleDateString()}</div>
                </div>
              </div>
            </Card>

            <div className="mb-8">
              {/* Add action buttons at top of feasible ports section */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Feasible Ports ({feasiblePorts.length})</h2>
                <Button
                  variant="outline"
                  onClick={handleSendBack}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Send Back to Procurement
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {feasiblePorts.map((port) => (
                  <Card key={port.port_id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-primary">{port.port_name}</h3>
                        <p className="text-sm text-muted-foreground">Port Code: {port.port_id}</p>
                      </div>
                      {getStatusBadge(port.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Distance</div>
                        <div className="font-semibold">{port.distance_nm.toLocaleString()} NM</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Transit Time</div>
                        <div className="font-semibold">{port.transit_days} days</div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="mb-4">
                      <div className="text-2xl font-bold text-primary mb-2">
                        ₹{(port.total_cost_inr / 10000000).toFixed(2)} Cr
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ocean Freight:</span>
                          <span className="font-medium">
                            ₹{(port.cost_breakdown.ocean_freight_inr / 10000000).toFixed(2)} Cr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Port Charges:</span>
                          <span className="font-medium">
                            ₹{(port.cost_breakdown.port_charges_inr / 10000000).toFixed(2)} Cr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rail Freight:</span>
                          <span className="font-medium">
                            ₹{(port.cost_breakdown.rail_freight_inr / 10000000).toFixed(2)} Cr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Demurrage:</span>
                          <span className="font-medium">
                            ₹{(port.cost_breakdown.demurrage_inr / 10000000).toFixed(2)} Cr
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Weather Risk:</span>
                        <Badge variant="outline" className={getRiskColor(port.risks.weather)}>
                          {port.risks.weather}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Congestion Risk:</span>
                        <Badge variant="outline" className={getRiskColor(port.risks.congestion)}>
                          {port.risks.congestion}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Depth/Draft Risk:</span>
                        <Badge variant="outline" className={getRiskColor(port.risks.depth_draft)}>
                          {port.risks.depth_draft}
                        </Badge>
                      </div>
                    </div>

                    {port.optimization_notes && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full mb-3 bg-transparent">
                            <Info className="h-4 w-4 mr-2" />
                            Why {port.status === "Optimised" ? "Optimised" : "Not Optimised"}?
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Port Analysis: {port.port_name}</DialogTitle>
                            <DialogDescription>{port.optimization_notes}</DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    )}

                    <Button
                      onClick={() => handlePortSelection(port.port_id, port.total_cost_inr)}
                      className="w-full"
                      variant={port.status === "Optimised" ? "default" : "secondary"}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {port.status === "Optimised" ? "Approve & Send to Procurement" : "Select Port"}
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            {nonFeasiblePorts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Non-Feasible Ports ({nonFeasiblePorts.length})</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {nonFeasiblePorts.map((port) => (
                    <Card key={port.port_id} className="p-6 border-red-200 bg-red-50/30">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-red-700">{port.port_name}</h3>
                          <p className="text-sm text-muted-foreground">Port Code: {port.port_id}</p>
                        </div>
                        {getStatusBadge(port.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Distance</div>
                          <div className="font-semibold">{port.distance_nm.toLocaleString()} NM</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Transit Time</div>
                          <div className="font-semibold">{port.transit_days} days</div>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="flex items-start gap-3 p-3 bg-red-100 border border-red-200 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-red-800">
                          <div className="font-semibold mb-1">Constraint Violation:</div>
                          <div>{port.reason}</div>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Weather Risk:</span>
                          <Badge variant="outline" className={getRiskColor(port.risks.weather)}>
                            {port.risks.weather}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Congestion Risk:</span>
                          <Badge variant="outline" className={getRiskColor(port.risks.congestion)}>
                            {port.risks.congestion}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Depth/Draft Risk:</span>
                          <Badge variant="outline" className={getRiskColor(port.risks.depth_draft)}>
                            {port.risks.depth_draft}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
