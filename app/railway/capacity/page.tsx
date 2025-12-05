"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { PortalNav } from "@/components/portal-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Save } from "lucide-react"

const PORTS = ["VIZAG", "PARA", "DHAM", "HALD", "KOLK"]
const PLANTS = ["BSP", "RSP", "BSL", "DSP", "ISP"]

export default function RailwayCapacityPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [capacities, setCapacities] = useState<Record<string, { rakes: number, notes: string }>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "RailwayAdmin") {
      router.push("/login")
      return
    }
    fetchCapacities()
  }, [isAuthenticated, user, router, selectedDate])

  const fetchCapacities = async () => {
    try {
      const response = await fetch(`/api/railway/capacity?date=${selectedDate}`)
      const data = await response.json()
      
      const capacityMap: Record<string, { rakes: number, notes: string }> = {}
      data.data?.forEach((c: any) => {
        const key = `${c.port_code}-${c.plant_code}`
        capacityMap[key] = { rakes: c.available_rakes, notes: c.notes || "" }
      })
      
      setCapacities(capacityMap)
    } catch (error) {
      console.error("[Railway] Failed to fetch capacities:", error)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      
      const promises = []
      for (const port of PORTS) {
        for (const plant of PLANTS) {
          const key = `${port}-${plant}`
          const capacity = capacities[key]
          
          if (capacity && capacity.rakes >= 0) {
            promises.push(
              fetch("/api/railway/capacity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  date: selectedDate,
                  port_code: port,
                  plant_code: plant,
                  available_rakes: capacity.rakes,
                  notes: capacity.notes,
                  created_by: user?.id,
                }),
              })
            )
          }
        }
      }
      
      await Promise.all(promises)
      alert("Daily capacity saved successfully!")
    } catch (error) {
      console.error("[Railway] Failed to save capacities:", error)
      alert("Failed to save capacities. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const updateCapacity = (port: string, plant: string, field: 'rakes' | 'notes', value: any) => {
    const key = `${port}-${plant}`
    setCapacities(prev => ({
      ...prev,
      [key]: {
        rakes: field === 'rakes' ? parseInt(value) || 0 : prev[key]?.rakes || 0,
        notes: field === 'notes' ? value : prev[key]?.notes || "",
      }
    }))
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <PortalNav title="Railway Portal" portal="railway" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Daily Rake Capacity</h1>
          <p className="text-muted-foreground">
            Update available rakes for each port-plant route
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="max-w-xs"
              />
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save All"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {PORTS.map(port => (
            <Card key={port}>
              <CardHeader>
                <CardTitle>{port} - Port to Plant Routes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {PLANTS.map(plant => {
                    const key = `${port}-${plant}`
                    const capacity = capacities[key] || { rakes: 0, notes: "" }
                    
                    return (
                      <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                        <div>
                          <Label className="text-sm font-semibold">{port} → {plant}</Label>
                          <p className="text-xs text-muted-foreground mt-1">Port to Plant Route</p>
                        </div>
                        <div>
                          <Label htmlFor={`${key}-rakes`} className="text-sm">
                            Available Rakes
                          </Label>
                          <Input
                            id={`${key}-rakes`}
                            type="number"
                            min="0"
                            value={capacity.rakes}
                            onChange={(e) => updateCapacity(port, plant, 'rakes', e.target.value)}
                            placeholder="0"
                            title="Number of rakes Railway can provide on this route on this date"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${key}-notes`} className="text-sm">
                            Notes
                          </Label>
                          <Input
                            id={`${key}-notes`}
                            value={capacity.notes}
                            onChange={(e) => updateCapacity(port, plant, 'notes', e.target.value)}
                            placeholder="Optional notes"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
