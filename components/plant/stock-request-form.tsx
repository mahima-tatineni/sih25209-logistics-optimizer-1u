"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/lib/auth"
import { useNotifications } from "@/lib/notifications"

interface StockRequestFormProps {
  plantId?: string
  onSubmit: (data: any) => void
}

export function PlantStockRequestForm({ plantId, onSubmit }: StockRequestFormProps) {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [loading, setLoading] = useState(false)
  const [material, setMaterial] = useState("coking_coal")
  const [grade, setGrade] = useState("")
  const [quantity, setQuantity] = useState("")
  const [requiredByDate, setRequiredByDate] = useState("")
  const [priority, setPriority] = useState("Normal")
  const [note, setNote] = useState("")
  const [currentDaysCover, setCurrentDaysCover] = useState(28)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const effectivePlantId = plantId || user?.plant_id || "BSP"
      
      const response = await fetch(`/api/plant/${effectivePlantId}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          material: material,
          grade: grade,
          quantity_t: Number.parseInt(quantity),
          required_by_date: requiredByDate,
          current_days_cover: currentDaysCover,
          priority: priority,
          note: note,
          created_by: user?.id || user?.email,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create request")
      }

      const result = await response.json()
      console.log("[v0] Stock request created:", result)

      // Show success notification
      addNotification({
        type: "success",
        title: "Request Created",
        message: `Stock request for ${Number.parseInt(quantity).toLocaleString()} tonnes of ${material.replace("_", " ")} created successfully!`,
        duration: 5000,
      })

      onSubmit(result.request)

      // Reset form
      setMaterial("coking_coal")
      setGrade("")
      setQuantity("")
      setRequiredByDate("")
      setPriority("Normal")
      setNote("")
    } catch (error) {
      console.error("[v0] Error creating stock request:", error)
      
      // Show error notification
      addNotification({
        type: "error",
        title: "Request Failed",
        message: error instanceof Error ? error.message : "Failed to create stock request. Please try again.",
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary">Create Stock Request</CardTitle>
        <CardDescription>Submit essential replenishment requirements to procurement team</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Material & Grade Section */}
          <div className="space-y-4 p-4 bg-secondary/10 rounded-lg border border-primary/10">
            <h3 className="font-semibold text-primary">Material & Grade</h3>

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
                <Label htmlFor="grade">Grade / Quality Band</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger id="grade">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prime_hard">Prime Hard Coking</SelectItem>
                    <SelectItem value="semi_soft">Semi-Soft Coking</SelectItem>
                    <SelectItem value="medium">Medium Coking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Quantity & Timing Section */}
          <div className="space-y-4 p-4 bg-secondary/10 rounded-lg border border-primary/10">
            <h3 className="font-semibold text-primary">Quantity & Timeline</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Required Quantity (tonnes)</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="e.g., 50000"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="requiredByDate">Latest Acceptable Arrival</Label>
                <Input
                  id="requiredByDate"
                  type="date"
                  value={requiredByDate}
                  onChange={(e) => setRequiredByDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded border border-blue-200 text-sm">
              <p className="text-blue-900">
                <strong>Current Days of Cover:</strong> 28 days
              </p>
              <p className="text-blue-700 mt-1">This requirement will maintain healthy stock levels</p>
            </div>
          </div>

          {/* Priority & Notes Section */}
          <div className="space-y-4 p-4 bg-secondary/10 rounded-lg border border-primary/10">
            <h3 className="font-semibold text-primary">Priority & Comments</h3>

            <div>
              <Label className="mb-3 block">Priority Level</Label>
              <RadioGroup value={priority} onValueChange={setPriority}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Normal" id="priority-normal" />
                  <Label htmlFor="priority-normal" className="font-normal cursor-pointer">
                    Normal - Routine replenishment
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="High" id="priority-high" />
                  <Label htmlFor="priority-high" className="font-normal cursor-pointer">
                    High - Faster delivery needed
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Critical" id="priority-critical" />
                  <Label htmlFor="priority-critical" className="font-normal cursor-pointer">
                    Critical - Urgent requirement
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="note">Additional Notes (optional)</Label>
              <Textarea
                id="note"
                placeholder="Add any special requirements or context..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-white font-semibold"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
