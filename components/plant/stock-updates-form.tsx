"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface StockUpdateFormProps {
  onSubmit: (data: any) => void
}

export function PlantStockUpdatesForm({ onSubmit }: StockUpdateFormProps) {
  const [material, setMaterial] = useState("coking_coal")
  const [quantity, setQuantity] = useState("")
  const [rakeId, setRakeId] = useState("")
  const [arrivalDate, setArrivalDate] = useState("")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRakeReceiptSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        event_type: "receipt",
        material,
        quantity: Number.parseInt(quantity),
        rake_id: rakeId,
        arrival_date: arrivalDate,
        comment: note,
      })
      setQuantity("")
      setRakeId("")
      setArrivalDate("")
      setNote("")
    } finally {
      setLoading(false)
    }
  }

  const handleConsumptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        event_type: "consumption",
        material,
        quantity: Number.parseInt(quantity),
        date: new Date().toISOString().split("T")[0],
        comment: note,
      })
      setQuantity("")
      setNote("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Tabs defaultValue="receipt" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2 max-w-md bg-secondary/20">
        <TabsTrigger value="receipt">Rake Receipt</TabsTrigger>
        <TabsTrigger value="consumption">Consumption</TabsTrigger>
      </TabsList>

      <TabsContent value="receipt">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Record Rake Receipt</CardTitle>
            <CardDescription>Update stock when material arrives at the plant</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRakeReceiptSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="material">Material</Label>
                  <Select value={material} onValueChange={setMaterial}>
                    <SelectTrigger id="material">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coking_coal">Coking Coal</SelectItem>
                      <SelectItem value="limestone">Limestone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quantity">Quantity (tonnes)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rakeId">Rake ID (optional)</Label>
                  <Input
                    id="rakeId"
                    placeholder="e.g., R-2401"
                    value={rakeId}
                    onChange={(e) => setRakeId(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="arrivalDate">Arrival Date & Time</Label>
                  <Input
                    id="arrivalDate"
                    type="datetime-local"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="note">Note (optional)</Label>
                <Textarea
                  id="note"
                  placeholder="Add any additional notes about this receipt..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={loading}>
                {loading ? "Recording..." : "Record Receipt"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="consumption">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Record Consumption</CardTitle>
            <CardDescription>Update stock for material consumed in the plant</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleConsumptionSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="material-consumption">Material</Label>
                  <Select value={material} onValueChange={setMaterial}>
                    <SelectTrigger id="material-consumption">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coking_coal">Coking Coal</SelectItem>
                      <SelectItem value="limestone">Limestone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quantity-consumption">Quantity Consumed (tonnes)</Label>
                  <Input
                    id="quantity-consumption"
                    type="number"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="note-consumption">Note (optional)</Label>
                <Textarea
                  id="note-consumption"
                  placeholder="Add any additional notes..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={loading}>
                {loading ? "Recording..." : "Record Consumption"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
