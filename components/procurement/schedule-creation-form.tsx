"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth"
import { useNotifications } from "@/lib/notifications"

interface Vessel {
  id: string
  name: string
  dwt: number
  draft_m: number
  capacity_t: number
  compatible_ports: string[]
  compatible_ports_count: number
}

interface ScheduleCreationFormProps {
  request: any
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ScheduleCreationForm({ request, open, onClose, onSuccess }: ScheduleCreationFormProps) {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [loading, setLoading] = useState(false)

  // Form state
  const [vessels, setVessels] = useState<Vessel[]>([])
  const [selectedVesselId, setSelectedVesselId] = useState("")
  const [loadPort, setLoadPort] = useState("")
  const [sailingDate, setSailingDate] = useState("")

  // Fetch vessels that can access at least 2 ports
  useEffect(() => {
    const fetchVessels = async () => {
      try {
        const response = await fetch("/api/vessels?minPorts=2")
        const result = await response.json()
        if (result.data) {
          setVessels(result.data)
        }
      } catch (error) {
        console.error("[v0] Error fetching vessels:", error)
      }
    }
    
    if (open) {
      fetchVessels()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const selectedVessel = vessels.find(v => v.id === selectedVesselId)
      
      const response = await fetch("/api/procurement/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_ids: [request.id],
          vessel_id: selectedVesselId,
          vessel_name: selectedVessel?.name,
          load_port_code: loadPort,
          sailing_date: sailingDate,
          material: request.material,
          quantity_t: request.quantity_t,
          target_plant_code: request.plant_id,
          required_by_date: request.required_by_date,
          created_by: user?.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create schedule")
      }

      const result = await response.json()
      console.log("[v0] Schedule created:", result)

      addNotification({
        type: "success",
        title: "Schedule Created",
        message: `Schedule ${result.schedule.schedule_code} created and sent to logistics team`,
        duration: 5000,
      })

      onSuccess()
      onClose()

      // Reset form
      setSelectedVesselId("")
      setLoadPort("")
      setSailingDate("")
    } catch (error) {
      console.error("[v0] Error creating schedule:", error)
      addNotification({
        type: "error",
        title: "Schedule Creation Failed",
        message: error instanceof Error ? error.message : "Failed to create schedule",
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  if (!request) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Import Schedule</DialogTitle>
          <DialogDescription>
            Convert plant request into an import schedule with vessel details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Request Details (Read-only) */}
          <div className="p-4 bg-secondary/10 rounded-lg border border-primary/10">
            <h3 className="font-semibold text-primary mb-3">Request Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Plant</p>
                <p className="font-semibold">{request.plant_id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Material</p>
                <p className="font-semibold capitalize">{request.material?.replace("_", " ")}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Quantity</p>
                <p className="font-semibold">{request.quantity_t?.toLocaleString()} tonnes</p>
              </div>
              <div>
                <p className="text-muted-foreground">Required By</p>
                <p className="font-semibold">{request.required_by_date}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Priority</p>
                <p className="font-semibold">{request.priority}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Grade</p>
                <p className="font-semibold">{request.grade || "Standard"}</p>
              </div>
            </div>
          </div>

          {/* Vessel Details */}
          <div className="space-y-4 p-4 bg-secondary/10 rounded-lg border border-primary/10">
            <h3 className="font-semibold text-primary">Vessel & Voyage Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vesselName">
                  Vessel Name <span className="text-red-500">*</span>
                </Label>
                <Select value={selectedVesselId} onValueChange={setSelectedVesselId} required>
                  <SelectTrigger id="vesselName">
                    <SelectValue placeholder="Select vessel" />
                  </SelectTrigger>
                  <SelectContent>
                    {vessels.map((vessel) => (
                      <SelectItem key={vessel.id} value={vessel.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{vessel.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {vessel.capacity_t.toLocaleString()}t • Draft: {vessel.draft_m}m • {vessel.compatible_ports_count} ports
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Vessels compatible with at least 2 Indian ports
                </p>
              </div>

              <div>
                <Label htmlFor="loadPort">
                  Load Port <span className="text-red-500">*</span>
                </Label>
                <Select value={loadPort} onValueChange={setLoadPort} required>
                  <SelectTrigger id="loadPort">
                    <SelectValue placeholder="Select load port" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GLAD">Gladstone, Australia</SelectItem>
                    <SelectItem value="NEWC">Newcastle, Australia</SelectItem>
                    <SelectItem value="RICH">Richards Bay, South Africa</SelectItem>
                    <SelectItem value="MOZA">Mozambique</SelectItem>
                    <SelectItem value="INDO">Indonesia</SelectItem>
                    <SelectItem value="USA">USA East Coast</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Supplier port where vessel will load material
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="sailingDate">
                Sailing Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="sailingDate"
                type="date"
                value={sailingDate}
                onChange={(e) => setSailingDate(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Date when vessel departs from load port
              </p>
            </div>
          </div>

          {/* Port & Plant Allocation Info */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Schedule will be sent to <strong>Logistics Team</strong></li>
              <li>• Logistics will evaluate and select optimal discharge port</li>
              <li>• Port options: Vizag, Paradip, Haldia, Dhamra</li>
              <li>• Target plant: <strong>{request.plant_id}</strong></li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-accent hover:bg-accent/90"
              disabled={loading}
            >
              {loading ? "Creating Schedule..." : "Create Schedule & Send to Logistics"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
