"use client"

import type React from "react"

import { useState } from "react"
import {
  PORTS,
  getMockShipments,
  getCurrentStock,
  addPortEvent,
  addVesselEvent,
  getPortCongestion,
} from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Anchor, Ship, Package, TrendingUp } from "lucide-react"

export default function PortConsolePage() {
  // Mock: assume logged in as VIZAG port user
  const portId = "VIZAG"
  const port = PORTS.find((p) => p.code === portId)!

  const [stocks, setStocks] = useState(getCurrentStock(portId))
  const [congestion, setCongestion] = useState(getPortCongestion(portId))
  const shipments = getMockShipments().filter((s) => s.candidate_ports.includes(portId))

  const [dischargeForm, setDischargeForm] = useState({
    vessel: "",
    material: "coking_coal" as "coking_coal" | "limestone",
    quantity: "",
    startTime: new Date().toISOString().slice(0, 16),
    endTime: "",
  })

  const [railLoadForm, setRailLoadForm] = useState({
    destinationPlant: "BSP",
    material: "coking_coal" as "coking_coal" | "limestone",
    quantity: "",
    rakeId: "",
  })

  const [adjustForm, setAdjustForm] = useState({
    material: "coking_coal" as "coking_coal" | "limestone",
    actualStock: "",
    reason: "",
  })

  const handleVesselStatus = (vesselName: string, eventType: "arrived_anchorage" | "berthed" | "sailed") => {
    addVesselEvent({
      vessel_id: vesselName,
      port_id: portId,
      event_type: eventType,
      date_time: new Date().toISOString(),
      user_id: "U002",
    })

    setCongestion(getPortCongestion(portId))
    alert(`Vessel ${vesselName} status updated to: ${eventType.replace("_", " ")}`)
  }

  const handleDischarge = (e: React.FormEvent) => {
    e.preventDefault()

    addPortEvent({
      port_id: portId,
      event_type: "vessel_discharge",
      material: dischargeForm.material,
      quantity_t: Number.parseFloat(dischargeForm.quantity),
      date_time: dischargeForm.startTime,
      user_id: "U002",
    })

    setStocks(getCurrentStock(portId))

    setDischargeForm({
      vessel: "",
      material: "coking_coal",
      quantity: "",
      startTime: new Date().toISOString().slice(0, 16),
      endTime: "",
    })

    alert("Discharge recorded successfully!")
  }

  const handleRailLoading = (e: React.FormEvent) => {
    e.preventDefault()

    addPortEvent({
      port_id: portId,
      event_type: "rake_loading",
      material: railLoadForm.material,
      quantity_t: Number.parseFloat(railLoadForm.quantity),
      destination_plant: railLoadForm.destinationPlant,
      rake_id: railLoadForm.rakeId,
      date_time: new Date().toISOString(),
      user_id: "U002",
    })

    setStocks(getCurrentStock(portId))

    setRailLoadForm({
      destinationPlant: "BSP",
      material: "coking_coal",
      quantity: "",
      rakeId: "",
    })

    alert("Rail loading recorded successfully!")
  }

  const handleStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault()

    const currentStock = stocks.find((s) => s.material === adjustForm.material)
    const adjustment = Number.parseFloat(adjustForm.actualStock) - (currentStock?.stock_t || 0)

    addPortEvent({
      port_id: portId,
      event_type: "manual_adjust",
      material: adjustForm.material,
      quantity_t: adjustment,
      date_time: new Date().toISOString(),
      comment: adjustForm.reason,
      user_id: "U002",
    })

    setStocks(getCurrentStock(portId))

    setAdjustForm({
      material: "coking_coal",
      actualStock: "",
      reason: "",
    })

    alert("Stock adjustment recorded successfully!")
  }

  const totalStock = stocks.reduce((sum, s) => sum + s.stock_t, 0)
  const utilizationPercent = (totalStock / port.sail_yard_capacity_t) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004f6e] to-[#006b8f] text-white shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Anchor className="h-10 w-10" />
            <div>
              <h1 className="text-3xl font-bold">{port.name}</h1>
              <p className="text-blue-100 text-lg">
                {port.type === "deep-sea" ? "Deep-Sea" : "Riverine"} Port • Capacity:{" "}
                {port.sail_yard_capacity_t.toLocaleString()} t
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Summary Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Total Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{totalStock.toLocaleString()} t</div>
              <div className="text-sm text-gray-600 mt-2">
                Coking Coal: {stocks.find((s) => s.material === "coking_coal")?.stock_t.toLocaleString() || 0} t
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Yard Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{utilizationPercent.toFixed(1)}%</div>
              <div className="text-sm text-gray-600 mt-2">
                Available: {(port.sail_yard_capacity_t - totalStock).toLocaleString()} t
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Anchor className="h-5 w-5 text-blue-600" />
                At Anchorage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{congestion.vessels_at_anchorage}</div>
              <div className="text-sm text-gray-600 mt-2">Vessels waiting</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Ship className="h-5 w-5 text-blue-600" />
                At Berth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{congestion.vessels_at_berth}</div>
              <div className="text-sm text-gray-600 mt-2">of {port.panamax_berths} berths</div>
            </CardContent>
          </Card>
        </div>

        {/* Vessel Status Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-[#004f6e] flex items-center gap-2">
              <Ship className="h-6 w-6" />
              Vessel Status Management
            </CardTitle>
            <CardDescription>Update vessel arrival, berthing, and departure status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shipments.length === 0 && (
                <div className="text-center text-gray-500 py-8">No vessels currently assigned to this port</div>
              )}
              {shipments.map((shipment) => (
                <div key={shipment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold text-lg">{shipment.vessel}</div>
                    <div className="text-sm text-gray-600">
                      {shipment.material.replace("_", " ")} • {shipment.quantity_t.toLocaleString()} t
                    </div>
                    <div className="text-sm text-gray-500">ETA: {shipment.eta || "TBD"}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVesselStatus(shipment.vessel, "arrived_anchorage")}
                      className="border-blue-300"
                    >
                      Arrived Anchorage
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVesselStatus(shipment.vessel, "berthed")}
                      className="border-green-300"
                    >
                      Berthed
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVesselStatus(shipment.vessel, "sailed")}
                      className="border-gray-300"
                    >
                      Sailed
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Discharge Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[#004f6e]">Vessel Discharge</CardTitle>
              <CardDescription>Record material discharged from vessel to yard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDischarge} className="space-y-4">
                <div>
                  <Label htmlFor="dischargeVessel">Vessel</Label>
                  <Select
                    value={dischargeForm.vessel}
                    onValueChange={(value) => setDischargeForm({ ...dischargeForm, vessel: value })}
                  >
                    <SelectTrigger id="dischargeVessel">
                      <SelectValue placeholder="Select vessel" />
                    </SelectTrigger>
                    <SelectContent>
                      {shipments.map((s) => (
                        <SelectItem key={s.id} value={s.vessel}>
                          {s.vessel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dischargeMaterial">Material</Label>
                  <Select
                    value={dischargeForm.material}
                    onValueChange={(value: "coking_coal" | "limestone") =>
                      setDischargeForm({ ...dischargeForm, material: value })
                    }
                  >
                    <SelectTrigger id="dischargeMaterial">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coking_coal">Coking Coal</SelectItem>
                      <SelectItem value="limestone">Limestone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dischargeQuantity">Quantity Discharged (tonnes)</Label>
                  <Input
                    id="dischargeQuantity"
                    type="number"
                    value={dischargeForm.quantity}
                    onChange={(e) => setDischargeForm({ ...dischargeForm, quantity: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label htmlFor="dischargeStart">Start Time</Label>
                  <Input
                    id="dischargeStart"
                    type="datetime-local"
                    value={dischargeForm.startTime}
                    onChange={(e) => setDischargeForm({ ...dischargeForm, startTime: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-[#004f6e] hover:bg-[#003a52]">
                  Record Discharge
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Rail Loading Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[#004f6e]">Rail Loading</CardTitle>
              <CardDescription>Record material loaded onto rakes for plant dispatch</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRailLoading} className="space-y-4">
                <div>
                  <Label htmlFor="railPlant">Destination Plant</Label>
                  <Select
                    value={railLoadForm.destinationPlant}
                    onValueChange={(value) => setRailLoadForm({ ...railLoadForm, destinationPlant: value })}
                  >
                    <SelectTrigger id="railPlant">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {port.nearest_plants.map((plantCode) => (
                        <SelectItem key={plantCode} value={plantCode}>
                          {plantCode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="railMaterial">Material</Label>
                  <Select
                    value={railLoadForm.material}
                    onValueChange={(value: "coking_coal" | "limestone") =>
                      setRailLoadForm({ ...railLoadForm, material: value })
                    }
                  >
                    <SelectTrigger id="railMaterial">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coking_coal">Coking Coal</SelectItem>
                      <SelectItem value="limestone">Limestone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="railQuantity">Quantity Loaded (tonnes)</Label>
                  <Input
                    id="railQuantity"
                    type="number"
                    value={railLoadForm.quantity}
                    onChange={(e) => setRailLoadForm({ ...railLoadForm, quantity: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Available: {stocks.find((s) => s.material === railLoadForm.material)?.stock_t.toLocaleString() || 0}{" "}
                    t
                  </div>
                </div>

                <div>
                  <Label htmlFor="railRakeId">Rake ID (optional)</Label>
                  <Input
                    id="railRakeId"
                    value={railLoadForm.rakeId}
                    onChange={(e) => setRailLoadForm({ ...railLoadForm, rakeId: e.target.value })}
                    placeholder="e.g., RAKE-2025-001"
                  />
                </div>

                <Button type="submit" className="w-full bg-[#004f6e] hover:bg-[#003a52]">
                  Record Rail Loading
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Stock Adjustment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-[#004f6e]">Yard Stock Adjustment</CardTitle>
            <CardDescription>Adjust stock based on physical verification</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStockAdjustment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="adjustMaterial">Material</Label>
                  <Select
                    value={adjustForm.material}
                    onValueChange={(value: "coking_coal" | "limestone") =>
                      setAdjustForm({ ...adjustForm, material: value })
                    }
                  >
                    <SelectTrigger id="adjustMaterial">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coking_coal">Coking Coal</SelectItem>
                      <SelectItem value="limestone">Limestone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="actualStock">Actual Yard Stock (tonnes)</Label>
                  <Input
                    id="actualStock"
                    type="number"
                    value={adjustForm.actualStock}
                    onChange={(e) => setAdjustForm({ ...adjustForm, actualStock: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Current: {stocks.find((s) => s.material === adjustForm.material)?.stock_t.toLocaleString() || 0} t
                  </div>
                </div>

                <div>
                  <Label htmlFor="adjustReason">Reason</Label>
                  <Input
                    id="adjustReason"
                    value={adjustForm.reason}
                    onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                    required
                    placeholder="e.g., Physical verification"
                  />
                </div>
              </div>

              <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                Adjust Stock
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
