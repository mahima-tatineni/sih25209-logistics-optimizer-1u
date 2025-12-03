"use client"

import type React from "react"

import { useState } from "react"
import { PLANTS, getCurrentStock, addPlantEvent } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Factory, TrendingUp, TrendingDown, Package, Train } from "lucide-react"

export default function PlantConsolePage() {
  // Mock: assume logged in as BSP plant user
  const plantId = "BSP"
  const plant = PLANTS.find((p) => p.code === plantId)!

  const [stocks, setStocks] = useState(getCurrentStock(plantId))
  const [rakeForm, setRakeForm] = useState({
    dateTime: new Date().toISOString().slice(0, 16),
    material: "coking_coal" as "coking_coal" | "limestone",
    quantity: "",
    rakeId: "",
    comment: "",
  })

  const [consumptionForm, setConsumptionForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    material: "coking_coal" as "coking_coal" | "limestone",
    quantity: "",
  })

  const [adjustForm, setAdjustForm] = useState({
    material: "coking_coal" as "coking_coal" | "limestone",
    actualStock: "",
    reason: "",
  })

  const handleRakeReceipt = (e: React.FormEvent) => {
    e.preventDefault()

    addPlantEvent({
      plant_id: plantId,
      event_type: "rake_arrival",
      material: rakeForm.material,
      quantity_t: Number.parseFloat(rakeForm.quantity),
      rake_id: rakeForm.rakeId,
      date_time: rakeForm.dateTime,
      comment: rakeForm.comment,
      user_id: "U003", // Mock user ID
    })

    // Refresh stocks
    setStocks(getCurrentStock(plantId))

    // Reset form
    setRakeForm({
      dateTime: new Date().toISOString().slice(0, 16),
      material: "coking_coal",
      quantity: "",
      rakeId: "",
      comment: "",
    })

    alert("Rake receipt recorded successfully!")
  }

  const handleConsumption = (e: React.FormEvent) => {
    e.preventDefault()

    addPlantEvent({
      plant_id: plantId,
      event_type: "consumption",
      material: consumptionForm.material,
      quantity_t: Number.parseFloat(consumptionForm.quantity),
      date_time: new Date(consumptionForm.date).toISOString(),
      user_id: "U003",
    })

    setStocks(getCurrentStock(plantId))

    setConsumptionForm({
      date: new Date().toISOString().slice(0, 10),
      material: "coking_coal",
      quantity: "",
    })

    alert("Consumption recorded successfully!")
  }

  const handleStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault()

    const currentStock = stocks.find((s) => s.material === adjustForm.material)
    const adjustment = Number.parseFloat(adjustForm.actualStock) - (currentStock?.stock_t || 0)

    addPlantEvent({
      plant_id: plantId,
      event_type: "manual_adjust",
      material: adjustForm.material,
      quantity_t: adjustment,
      date_time: new Date().toISOString(),
      comment: adjustForm.reason,
      user_id: "U003",
    })

    setStocks(getCurrentStock(plantId))

    setAdjustForm({
      material: "coking_coal",
      actualStock: "",
      reason: "",
    })

    alert("Stock adjustment recorded successfully!")
  }

  const coalStock = stocks.find((s) => s.material === "coking_coal")
  const limestoneStock = stocks.find((s) => s.material === "limestone")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004f6e] to-[#006b8f] text-white shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Factory className="h-10 w-10" />
            <div>
              <h1 className="text-3xl font-bold">{plant.name}</h1>
              <p className="text-blue-100 text-lg">
                {plant.state} • Capacity: {plant.crude_capacity_mtpa} MTPA
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Summary Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Coking Coal Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{(coalStock?.stock_t || 0).toLocaleString()} t</div>
              <div className="flex items-center gap-2 mt-2">
                {(coalStock?.days_cover || 0) >= plant.target_days_cover ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-orange-600" />
                )}
                <span className="text-sm text-gray-600">
                  {coalStock?.days_cover?.toFixed(1)} days cover (Target: {plant.target_days_cover})
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Limestone Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">
                {(limestoneStock?.stock_t || 0).toLocaleString()} t
              </div>
              <div className="flex items-center gap-2 mt-2">
                {(limestoneStock?.days_cover || 0) >= plant.target_days_cover ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-orange-600" />
                )}
                <span className="text-sm text-gray-600">
                  {limestoneStock?.days_cover?.toFixed(1)} days cover (Target: {plant.target_days_cover})
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Train className="h-5 w-5 text-blue-600" />
                Daily Consumption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">
                {((plant.annual_coking_import_t + plant.annual_limestone_import_t) / 365).toFixed(0)} t
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Coal: {(plant.annual_coking_import_t / 365).toFixed(0)} t/day
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rake Receipt Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[#004f6e]">Rake Receipt</CardTitle>
              <CardDescription>Record incoming rail rake with material</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRakeReceipt} className="space-y-4">
                <div>
                  <Label htmlFor="rakeDateTime">Date & Time</Label>
                  <Input
                    id="rakeDateTime"
                    type="datetime-local"
                    value={rakeForm.dateTime}
                    onChange={(e) => setRakeForm({ ...rakeForm, dateTime: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="rakeMaterial">Material</Label>
                  <Select
                    value={rakeForm.material}
                    onValueChange={(value: "coking_coal" | "limestone") =>
                      setRakeForm({ ...rakeForm, material: value })
                    }
                  >
                    <SelectTrigger id="rakeMaterial">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coking_coal">Coking Coal</SelectItem>
                      <SelectItem value="limestone">Limestone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="rakeQuantity">Quantity (tonnes)</Label>
                  <Input
                    id="rakeQuantity"
                    type="number"
                    value={rakeForm.quantity}
                    onChange={(e) => setRakeForm({ ...rakeForm, quantity: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label htmlFor="rakeId">Rake ID (optional)</Label>
                  <Input
                    id="rakeId"
                    value={rakeForm.rakeId}
                    onChange={(e) => setRakeForm({ ...rakeForm, rakeId: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="rakeComment">Comment (optional)</Label>
                  <Textarea
                    id="rakeComment"
                    value={rakeForm.comment}
                    onChange={(e) => setRakeForm({ ...rakeForm, comment: e.target.value })}
                    rows={2}
                  />
                </div>

                <Button type="submit" className="w-full bg-[#004f6e] hover:bg-[#003a52]">
                  Record Rake Receipt
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Daily Consumption Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[#004f6e]">Daily Consumption</CardTitle>
              <CardDescription>Record material consumed during production</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleConsumption} className="space-y-4">
                <div>
                  <Label htmlFor="consumptionDate">Date</Label>
                  <Input
                    id="consumptionDate"
                    type="date"
                    value={consumptionForm.date}
                    onChange={(e) => setConsumptionForm({ ...consumptionForm, date: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="consumptionMaterial">Material</Label>
                  <Select
                    value={consumptionForm.material}
                    onValueChange={(value: "coking_coal" | "limestone") =>
                      setConsumptionForm({ ...consumptionForm, material: value })
                    }
                  >
                    <SelectTrigger id="consumptionMaterial">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coking_coal">Coking Coal</SelectItem>
                      <SelectItem value="limestone">Limestone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="consumptionQuantity">Quantity Consumed (tonnes)</Label>
                  <Input
                    id="consumptionQuantity"
                    type="number"
                    value={consumptionForm.quantity}
                    onChange={(e) => setConsumptionForm({ ...consumptionForm, quantity: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                  Expected daily consumption:
                  <br />
                  Coking Coal: ~{(plant.annual_coking_import_t / 365).toFixed(0)} t/day
                  <br />
                  Limestone: ~{(plant.annual_limestone_import_t / 365).toFixed(0)} t/day
                </div>

                <Button type="submit" className="w-full bg-[#004f6e] hover:bg-[#003a52]">
                  Record Consumption
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Stock Adjustment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-[#004f6e]">Stock Adjustment</CardTitle>
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
                  <Label htmlFor="actualStock">Actual Stock (tonnes)</Label>
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
