"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface VesselPlanningFormProps {
  onSubmit: (data: any) => void
}

export function VesselPlanningForm({ onSubmit }: VesselPlanningFormProps) {
  const [loading, setLoading] = useState(false)
  const [approvedRequests, setApprovedRequests] = useState<any[]>([])
  const [selectedRequests, setSelectedRequests] = useState<string[]>([])
  const [vessel, setVessel] = useState("")
  const [supplier, setSupplier] = useState("")
  const [dischargePort, setDischargePort] = useState("")
  const [material, setMaterial] = useState("")
  const [loadDate, setLoadDate] = useState("")
  const [laycanEnd, setLaycanEnd] = useState("")
  const [quantity, setQuantity] = useState("")
  const [estimatedCost, setEstimatedCost] = useState("")

  useEffect(() => {
    fetchApprovedRequests()
  }, [])

  const fetchApprovedRequests = async () => {
    try {
      const response = await fetch("/api/stock-requests?status=approved")
      const data = await response.json()
      setApprovedRequests(data.data || [])
    } catch (error) {
      console.error("[v0] Error fetching approved requests:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/schedules-full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vessel_name: vessel,
          supplier_port_id: supplier,
          discharge_port_id: dischargePort,
          material_type: material,
          quantity: Number.parseInt(quantity),
          laycan_start: loadDate,
          laycan_end: laycanEnd,
          estimated_cost: Number.parseFloat(estimatedCost),
          status: "draft",
          linked_request_ids: selectedRequests,
        }),
      })

      if (!response.ok) throw new Error("Failed to create schedule")

      const result = await response.json()
      console.log("[v0] Schedule created:", result)

      alert("Schedule created successfully! It has been sent to Logistics for optimization.")
      onSubmit(result.data)
    } catch (error) {
      console.error("[v0] Error creating schedule:", error)
      alert("Failed to create schedule. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleRequestSelection = (requestId: string) => {
    setSelectedRequests((prev) =>
      prev.includes(requestId) ? prev.filter((id) => id !== requestId) : [...prev, requestId],
    )
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary">Create Vessel Schedule (STEM)</CardTitle>
        <CardDescription>Plan vessel assignment to plants via discharge ports</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {approvedRequests.length > 0 && (
            <div className="space-y-3">
              <Label>Link to Plant Requests (Optional)</Label>
              <div className="p-4 bg-secondary/20 rounded-lg space-y-2 max-h-64 overflow-y-auto">
                {approvedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center gap-3 p-3 bg-white rounded border hover:border-primary/50 transition"
                  >
                    <Checkbox
                      checked={selectedRequests.includes(request.id)}
                      onCheckedChange={() => toggleRequestSelection(request.id)}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {request.plant_id} - {request.material_type?.replace("_", " ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {request.quantity_requested?.toLocaleString()} t • Required by {request.required_by_date}
                      </p>
                    </div>
                    <Badge variant="secondary">{request.priority}</Badge>
                  </div>
                ))}
              </div>
              {selectedRequests.length > 0 && (
                <p className="text-sm text-green-600 font-medium">
                  ✓ {selectedRequests.length} request(s) will be linked to this schedule
                </p>
              )}
            </div>
          )}

          {/* Request Context */}
          <div className="space-y-4 p-4 bg-secondary/10 rounded-lg border border-primary/10">
            <h3 className="font-semibold text-primary">Vessel Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vessel">Vessel Name</Label>
                <Select value={vessel} onValueChange={setVessel}>
                  <SelectTrigger id="vessel">
                    <SelectValue placeholder="Select vessel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pacific">MV Pacific Glory (75,000t)</SelectItem>
                    <SelectItem value="ocean">MV Ocean Star (72,000t)</SelectItem>
                    <SelectItem value="steel">MV Steel Carrier (68,000t)</SelectItem>
                    <SelectItem value="baltic">MV Baltic Pride (70,000t)</SelectItem>
                    <SelectItem value="asian">MV Asian Voyager (74,000t)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="supplier">Supplier Port</Label>
                <Select value={supplier} onValueChange={setSupplier}>
                  <SelectTrigger id="supplier">
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="glad">Gladstone (Australia)</SelectItem>
                    <SelectItem value="newc">Newcastle (Australia)</SelectItem>
                    <SelectItem value="mapu">Maputo (Mozambique)</SelectItem>
                    <SelectItem value="rich">Richards Bay (S. Africa)</SelectItem>
                    <SelectItem value="qing">Qingdao (China)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Cargo Details */}
          <div className="space-y-4 p-4 bg-secondary/10 rounded-lg border border-primary/10">
            <h3 className="font-semibold text-primary">Cargo Specification</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="material">Material</Label>
                <Select value={material} onValueChange={setMaterial}>
                  <SelectTrigger id="material">
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coal">Coking Coal</SelectItem>
                    <SelectItem value="limestone">Limestone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">Total Quantity (tonnes)</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="e.g., 75000"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="loadDate">Load Date / Laycan</Label>
              <Input
                id="loadDate"
                type="date"
                value={loadDate}
                onChange={(e) => setLoadDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Port & Plant Allocation */}
          <div className="space-y-4 p-4 bg-secondary/10 rounded-lg border border-primary/10">
            <h3 className="font-semibold text-primary">Port & Plant Allocation</h3>
            <p className="text-sm text-muted-foreground">Choose discharge port(s) and destination plant(s)</p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { port: "Vizag", plants: ["BSP", "RSP"] },
                { port: "Paradip", plants: ["BSP", "RSP", "BSL", "DSP", "ISP"] },
                { port: "Haldia", plants: ["DSP", "ISP", "BSL"] },
              ].map((option) => (
                <div key={option.port} className="p-3 bg-white rounded border border-primary/10">
                  <p className="font-semibold text-sm">{option.port}</p>
                  <p className="text-xs text-muted-foreground mt-1">Optimal for: {option.plants.join(", ")}</p>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-white font-semibold"
            disabled={loading}
          >
            {loading ? "Creating Schedule..." : "Create Provisional Schedule"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
