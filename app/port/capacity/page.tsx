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
import { Slider } from "@/components/ui/slider"
import { Calendar, Save } from "lucide-react"

export default function PortCapacityPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [portCode, setPortCode] = useState("")
  const [portName, setPortName] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [formData, setFormData] = useState({
    available_berths: 0,
    available_stockyard_t: 0,
    congestion_index: 0,
    notes: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "PortAdmin") {
      router.push("/login")
      return
    }
    
    // Extract port code from email
    const email = user?.email || ""
    const match = email.match(/port\.(\w+)@/)
    if (match) {
      const emailPort = match[1].toLowerCase()
      // Map email subdomain to actual port code and name
      const portCodeMap: Record<string, string> = {
        'vizag': 'VIZAG',
        'paradip': 'PARA',
        'dhamra': 'DHAM',
        'haldia': 'HALD',
        'kolkata': 'KOLK',
      }
      const portNameMap: Record<string, string> = {
        'vizag': 'Visakhapatnam',
        'paradip': 'Paradip',
        'dhamra': 'Dhamra',
        'haldia': 'Haldia',
        'kolkata': 'Kolkata',
      }
      const code = portCodeMap[emailPort] || emailPort.toUpperCase()
      const name = portNameMap[emailPort] || emailPort
      setPortCode(code)
      setPortName(name)
      fetchCapacity(code)
    }
  }, [isAuthenticated, user, router, selectedDate])

  const fetchCapacity = async (code: string) => {
    try {
      const response = await fetch(`/api/port/capacity?date=${selectedDate}&port_code=${code}`)
      const data = await response.json()
      
      if (data.data && data.data.length > 0) {
        const capacity = data.data[0]
        setFormData({
          available_berths: capacity.available_berths,
          available_stockyard_t: capacity.available_stockyard_t,
          congestion_index: capacity.congestion_index,
          notes: capacity.notes || "",
        })
      } else {
        setFormData({
          available_berths: 0,
          available_stockyard_t: 0,
          congestion_index: 0,
          notes: "",
        })
      }
    } catch (error) {
      console.error("[Port] Failed to fetch capacity:", error)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      
      const response = await fetch("/api/port/capacity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          port_code: portCode,
          ...formData,
          created_by: user?.id,
        }),
      })

      if (!response.ok) throw new Error("Failed to save capacity")

      alert("Port capacity saved successfully!")
    } catch (error) {
      console.error("[Port] Failed to save capacity:", error)
      alert("Failed to save capacity. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <PortalNav title={`${portName} Port Portal`} portal="port" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">{portName} Daily Capacity</h1>
          <p className="text-muted-foreground">
            Update berth availability, stockyard capacity, and congestion levels
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
                {loading ? "Saving..." : "Save Capacity"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{portName} Port Capacity for {new Date(selectedDate).toLocaleDateString()}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="berths">Available Berths</Label>
              <Input
                id="berths"
                type="number"
                min="0"
                value={formData.available_berths}
                onChange={(e) => setFormData({...formData, available_berths: parseInt(e.target.value) || 0})}
                placeholder="Number of berths available for SAIL vessels"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Number of berths available for SAIL vessels on this date
              </p>
            </div>

            <div>
              <Label htmlFor="stockyard">Available Stockyard Capacity (tonnes)</Label>
              <Input
                id="stockyard"
                type="number"
                min="0"
                value={formData.available_stockyard_t}
                onChange={(e) => setFormData({...formData, available_stockyard_t: parseInt(e.target.value) || 0})}
                placeholder="Free storage capacity in tonnes"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Free storage capacity in tonnes for SAIL cargo
              </p>
            </div>

            <div>
              <Label htmlFor="congestion">Congestion Index: {formData.congestion_index}%</Label>
              <Slider
                id="congestion"
                min={0}
                max={100}
                step={5}
                value={[formData.congestion_index]}
                onValueChange={(value) => setFormData({...formData, congestion_index: value[0]})}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low (0-30%)</span>
                <span>Medium (30-70%)</span>
                <span>High (70-100%)</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Port congestion level: 0 = no congestion, 100 = severe congestion
              </p>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Any additional notes about port conditions, weather, or constraints..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
