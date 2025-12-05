"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { useRouter, useParams } from "next/navigation"
import { PortalNav } from "@/components/portal-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
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

      // First try to fetch from procurement schedules API (where mock data is stored)
      const procurementResponse = await fetch("/api/procurement/schedules")
      const procurementData = await procurementResponse.json()
      
      // Find the schedule with matching ID
      const foundSchedule = procurementData.data?.find((s: any) => s.id === scheduleId)
      
      if (foundSchedule) {
        const mappedSchedule: ImportSchedule = {
          id: foundSchedule.id,
          schedule_id: foundSchedule.schedule_code,
          material: foundSchedule.material,
          quantity_t: foundSchedule.quantity_t,
          vessel_id: foundSchedule.vessel_id,
          vessel_name: foundSchedule.vessel_name,
          load_port: foundSchedule.load_port_code,
          load_port_name: foundSchedule.load_port_code,
          sailing_date: foundSchedule.sailing_date,
          required_by_date: foundSchedule.required_by_date,
          target_plant: foundSchedule.target_plant_code,
          target_plant_name: foundSchedule.target_plant_code,
          status: foundSchedule.status === "SENT_TO_LOGISTICS" ? "Pending Port Selection" : "Port Selected",
          selected_port: foundSchedule.selected_port,
          selected_port_name: foundSchedule.selected_port_name,
          created_at: foundSchedule.created_at,
          from_procurement_user: "Procurement Team",
        }
        setSchedule(mappedSchedule)
        await generatePortCandidates(mappedSchedule)
        return
      }

      // Fallback: try schedules-full API
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
    // Dynamic port analysis based on vessel and schedule characteristics
    const quantity = scheduleData.quantity_t
    const loadPort = scheduleData.load_port
    const targetPlant = scheduleData.target_plant
    const vesselName = scheduleData.vessel_name
    
    // Determine vessel type based on quantity
    const vesselType = quantity > 60000 ? "Capesize" : quantity > 40000 ? "Panamax" : "Handymax"
    const vesselDraft = quantity > 60000 ? 18.0 : quantity > 40000 ? 14.5 : 12.0
    
    // Port characteristics database
    const portData = {
      VIZAG: {
        name: "Visakhapatnam",
        maxDraft: 16.5,
        distance: { GLAD: 5420, NEWC: 5380, RICH: 4850, INDO: 3200 },
        railDistance: { BSP: 850, RSP: 1100, BSL: 1350, DSP: 1650, ISP: 1450 },
        congestionLevel: "Medium",
        weatherRisk: "Low",
      },
      PARA: {
        name: "Paradip",
        maxDraft: 14.0,
        distance: { GLAD: 5650, NEWC: 5610, RICH: 5080, INDO: 3100 },
        railDistance: { BSP: 950, RSP: 750, BSL: 1100, DSP: 1200, ISP: 950 },
        congestionLevel: "Low",
        weatherRisk: "Medium",
      },
      DHAM: {
        name: "Dhamra",
        maxDraft: 15.0,
        distance: { GLAD: 5700, NEWC: 5660, RICH: 5130, INDO: 3150 },
        railDistance: { BSP: 1050, RSP: 850, BSL: 1200, DSP: 1300, ISP: 1050 },
        congestionLevel: "Low",
        weatherRisk: "Medium",
      },
      HALD: {
        name: "Haldia",
        maxDraft: 9.5,
        distance: { GLAD: 5850, NEWC: 5810, RICH: 5280, INDO: 3300 },
        railDistance: { BSP: 1250, RSP: 1050, BSL: 950, DSP: 850, ISP: 650 },
        congestionLevel: "Medium",
        weatherRisk: "High",
      },
      KOLK: {
        name: "Kolkata",
        maxDraft: 8.5,
        distance: { GLAD: 5900, NEWC: 5860, RICH: 5330, INDO: 3350 },
        railDistance: { BSP: 1300, RSP: 1100, BSL: 900, DSP: 800, ISP: 600 },
        congestionLevel: "High",
        weatherRisk: "High",
      },
    }

    const candidates: PortCandidate[] = []
    
    for (const [portId, port] of Object.entries(portData)) {
      const oceanDistance = port.distance[loadPort as keyof typeof port.distance] || 5500
      const railDistance = port.railDistance[targetPlant as keyof typeof port.railDistance] || 1000
      const transitDays = Math.ceil(oceanDistance / 300) // ~300 NM per day average
      
      // Check if port can handle vessel
      const isFeasible = vesselDraft <= port.maxDraft
      
      if (isFeasible) {
        // Calculate costs
        const oceanFreight = oceanDistance * quantity * 3.2 // ₹3.2 per NM per tonne
        const portCharges = quantity * 550 + (port.congestionLevel === "High" ? 5000000 : 0)
        const railFreight = railDistance * quantity * 0.95 // ₹0.95 per km per tonne
        const demurrage = port.congestionLevel === "High" ? 15000000 : port.congestionLevel === "Medium" ? 10000000 : 5000000
        const totalCost = oceanFreight + portCharges + railFreight + demurrage
        
        // Determine weather risk based on season and location
        const weatherRisk = port.weatherRisk as "Low" | "Medium" | "High"
        const congestionRisk = port.congestionLevel as "Low" | "Medium" | "High"
        const depthRisk = (vesselDraft / port.maxDraft) > 0.9 ? "High" : (vesselDraft / port.maxDraft) > 0.8 ? "Medium" : "Low"
        
        candidates.push({
          port_id: portId,
          port_name: port.name,
          distance_nm: oceanDistance,
          transit_days: transitDays,
          total_cost_inr: totalCost,
          cost_breakdown: {
            ocean_freight_inr: oceanFreight,
            port_charges_inr: portCharges,
            rail_freight_inr: railFreight,
            demurrage_inr: demurrage,
          },
          risks: {
            weather: weatherRisk,
            congestion: congestionRisk,
            depth_draft: depthRisk,
          },
          status: "Feasible",
          optimization_notes: "",
        })
      } else {
        // Non-feasible port
        const draftDeficit = (vesselDraft - port.maxDraft).toFixed(1)
        candidates.push({
          port_id: portId,
          port_name: port.name,
          distance_nm: oceanDistance,
          transit_days: transitDays,
          total_cost_inr: 0,
          cost_breakdown: {
            ocean_freight_inr: 0,
            port_charges_inr: 0,
            rail_freight_inr: 0,
            demurrage_inr: 0,
          },
          risks: {
            weather: port.weatherRisk as "Low" | "Medium" | "High",
            congestion: port.congestionLevel as "Low" | "Medium" | "High",
            depth_draft: "High",
          },
          status: "Non-Feasible",
          reason: `${port.maxDraft}m draft limit exceeded by ${draftDeficit}m. ${vesselType} vessel (${vesselDraft}m draft, ${quantity.toLocaleString()}T) cannot be accommodated.`,
        })
      }
    }
    
    // Sort feasible ports by total cost and mark the best one as Optimised
    const feasiblePorts = candidates.filter(p => p.status === "Feasible").sort((a, b) => a.total_cost_inr - b.total_cost_inr)
    const nonFeasiblePorts = candidates.filter(p => p.status === "Non-Feasible")
    
    if (feasiblePorts.length > 0) {
      feasiblePorts[0].status = "Optimised"
      feasiblePorts[0].optimization_notes = `Lowest total cost (₹${(feasiblePorts[0].total_cost_inr / 10000000).toFixed(2)} Cr) for ${vesselType} vessel. Optimal balance of ocean freight (${feasiblePorts[0].distance_nm} NM) and rail connectivity (${feasiblePorts[0].cost_breakdown.rail_freight_inr / 10000000} Cr rail cost to ${targetPlant}).`
      
      // Add comparison notes for other feasible ports
      for (let i = 1; i < feasiblePorts.length; i++) {
        const costDiff = (feasiblePorts[i].total_cost_inr - feasiblePorts[0].total_cost_inr) / 10000000
        const mainReason = feasiblePorts[i].cost_breakdown.rail_freight_inr > feasiblePorts[0].cost_breakdown.rail_freight_inr 
          ? "higher rail freight distance" 
          : feasiblePorts[i].cost_breakdown.ocean_freight_inr > feasiblePorts[0].cost_breakdown.ocean_freight_inr
          ? "longer ocean distance"
          : "higher port charges and demurrage"
        feasiblePorts[i].optimization_notes = `+₹${costDiff.toFixed(1)} Cr vs ${feasiblePorts[0].port_name} mainly due to ${mainReason}. ${feasiblePorts[i].risks.congestion === "Low" ? "Lower congestion risk." : ""}`
      }
    }
    
    setCandidatePorts([...feasiblePorts, ...nonFeasiblePorts])
  }

  const handlePortSelection = async (portId: string, costEstimate: number) => {
    if (
      !confirm(
        "Approve this port selection and finalize the route? This will send back to Procurement for confirmation.",
      )
    )
      return

    try {
      if (!schedule) return

      // Update the schedule via procurement API (where mock data is stored)
      const response = await fetch(`/api/procurement/schedules/${scheduleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selected_port: portId,
          status: "PORT_SELECTED",
          cost_estimate_inr: costEstimate,
        }),
      })

      if (!response.ok) {
        // Fallback: try schedules-full API
        const fallbackResponse = await fetch(`/api/schedules-full/${scheduleId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            optimized_port_id: portId,
            status: "optimized",
            cost_estimate_inr: costEstimate,
          }),
        })
        
        if (!fallbackResponse.ok) throw new Error("Failed to select port")
      }

      // Calculate ETA at port and laydays
      // Find the selected port candidate to get transit days
      const selectedPortCandidate = candidatePorts.find(p => p.port_id === portId)
      const transitDays = selectedPortCandidate?.transit_days || 15
      
      // ETA at port = sailing date + transit days
      const sailingDate = new Date(schedule.sailing_date)
      const etaPort = new Date(sailingDate)
      etaPort.setDate(etaPort.getDate() + transitDays)
      
      // Laydays end = required by date (this is when cargo must reach plant)
      // Typically laydays = discharge time + some buffer
      // For railway, we need rakes from vessel arrival until cargo is fully loaded
      const laydaysEnd = new Date(schedule.required_by_date)
      
      // Create Railway Request
      const RAKE_CAPACITY_T = 3500 // Standard rake capacity
      const requiredRakes = Math.ceil(schedule.quantity_t / RAKE_CAPACITY_T)

      await fetch("/api/railway/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schedule_id: scheduleId,
          port_code: portId,
          plant_code: schedule.target_plant,
          required_rakes: requiredRakes,
          required_window_start: etaPort.toISOString().split('T')[0], // Vessel ETA at port
          required_window_end: laydaysEnd.toISOString().split('T')[0], // End of laydays
          status: "REQUESTED",
        }),
      })

      // Create Port Request
      await fetch("/api/port/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schedule_id: scheduleId,
          port_code: portId,
          vessel_id: schedule.vessel_id,
          vessel_name: schedule.vessel_name,
          material: schedule.material,
          quantity_t: schedule.quantity_t,
          eta_port: etaPort.toISOString().split('T')[0], // Vessel ETA at port
          laydays_end: laydaysEnd.toISOString().split('T')[0], // End of laydays
          status: "REQUESTED",
        }),
      })

      alert("Route optimized! Requests sent to Railway and Port for confirmation.")
      router.push("/logistics")
    } catch (error) {
      console.error("[v0] Failed to select port:", error)
      alert("Failed to select port. Please try again.")
    }
  }

  const [showSendBackDialog, setShowSendBackDialog] = useState(false)
  const [sendBackReason, setSendBackReason] = useState("")

  const handleSendBack = async () => {
    if (!sendBackReason.trim()) {
      alert("Please provide a reason for sending back to Procurement")
      return
    }

    try {
      const response = await fetch(`/api/procurement/schedules/${scheduleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "RETURNED_TO_PROCUREMENT",
          notes: `Returned by Logistics: ${sendBackReason}`,
        }),
      })

      if (response.ok) {
        alert("Schedule returned to Procurement with reason")
        router.push("/logistics")
      } else {
        throw new Error("Failed to update schedule")
      }
    } catch (error) {
      console.error("[v0] Failed to send back:", error)
      alert("Failed to send back schedule. Please try again.")
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
        <Button variant="ghost" className="mb-4" onClick={() => router.push("/logistics")}>
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
                <Dialog open={showSendBackDialog} onOpenChange={setShowSendBackDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Send Back to Procurement
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Back to Procurement</DialogTitle>
                      <DialogDescription>
                        Please provide a reason for returning this schedule to the procurement team.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="reason" className="text-sm font-medium">
                          Reason for sending back to Procurement:
                        </label>
                        <textarea
                          id="reason"
                          value={sendBackReason}
                          onChange={(e) => setSendBackReason(e.target.value)}
                          placeholder="e.g., No feasible ports available, vessel draft too high, schedule conflicts..."
                          className="w-full min-h-[100px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowSendBackDialog(false)
                            setSendBackReason("")
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            handleSendBack()
                            setShowSendBackDialog(false)
                          }}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Send Back
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
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
