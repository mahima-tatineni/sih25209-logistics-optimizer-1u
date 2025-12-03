"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

export function PortVesselOperations() {
  const [showForm, setShowForm] = useState(false)
  const [selectedVessel, setSelectedVessel] = useState("")

  return (
    <div className="space-y-4">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-primary">Vessel Management</CardTitle>
              <CardDescription>Update vessel status, berth allocation, and discharge progress</CardDescription>
            </div>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Record Vessel Status
            </Button>
          </div>
        </CardHeader>
      </Card>

      {showForm && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Record Vessel Status Update</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vessel">Vessel Name</Label>
                  <Select value={selectedVessel} onValueChange={setSelectedVessel}>
                    <SelectTrigger id="vessel">
                      <SelectValue placeholder="Select vessel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cape">Cape Mercury</SelectItem>
                      <SelectItem value="ocean">Ocean Giant</SelectItem>
                      <SelectItem value="new">New Dawn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Current Status</Label>
                  <Select defaultValue="berthed">
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="arrived">Arrived at Roadstead</SelectItem>
                      <SelectItem value="anchorage">At Anchorage</SelectItem>
                      <SelectItem value="berthed">Berthed</SelectItem>
                      <SelectItem value="discharging">Discharging</SelectItem>
                      <SelectItem value="completed">Discharge Complete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="berth">Berth Allocated</Label>
                  <Input id="berth" placeholder="e.g., Berth 3" />
                </div>

                <div>
                  <Label htmlFor="progress">Discharge Progress (%)</Label>
                  <Input id="progress" type="number" min="0" max="100" placeholder="0-100" />
                </div>
              </div>

              <div>
                <Label htmlFor="comments">Comments/Observations</Label>
                <Textarea id="comments" placeholder="Any weather, operational, or other notes..." rows={3} />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-accent hover:bg-accent/90">
                  Save Status Update
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Vessel List */}
      <div className="space-y-3">
        {[
          { name: "Cape Mercury", eta: "2025-02-05", status: "Berthed", cargo: "75,000t Coal", progress: 65 },
          { name: "Ocean Giant", eta: "2025-02-08", status: "Anchorage", cargo: "68,000t Coal", progress: 0 },
          { name: "New Dawn", eta: "2025-02-10", status: "Roadstead", cargo: "52,000t Lime", progress: 5 },
        ].map((vessel) => (
          <Card key={vessel.name} className="border-2 border-primary/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Vessel</p>
                  <p className="font-bold text-primary">{vessel.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cargo</p>
                  <p className="font-bold">{vessel.cargo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={vessel.status === "Berthed" ? "default" : "secondary"}>{vessel.status}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ETA</p>
                  <p className="font-bold text-primary">{vessel.eta}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="font-bold text-primary">{vessel.progress}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
