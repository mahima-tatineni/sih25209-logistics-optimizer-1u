"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface VesselPlanningFormProps {
  onSubmit: (data: any) => void
}

export function VesselPlanningForm({ onSubmit }: VesselPlanningFormProps) {
  const [vessel, setVessel] = useState("")
  const [supplier, setSupplier] = useState("")
  const [material, setMaterial] = useState("")
  const [loadDate, setLoadDate] = useState("")
  const [quantity, setQuantity] = useState("")
  const [plants, setPlants] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      vessel,
      supplier,
      material,
      load_date: loadDate,
      quantity: Number.parseInt(quantity),
      assigned_plants: plants,
    })
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary">Create Vessel Schedule (STEM)</CardTitle>
        <CardDescription>Plan vessel assignment to plants via discharge ports</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white font-semibold">
            Create Provisional Schedule
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
