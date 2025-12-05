"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { PortalNav } from "@/components/portal-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"

const PORTS = ["VIZAG", "PARA", "DHAM", "HALD", "KOLK"]
const PLANTS = ["BSP", "RSP", "BSL", "DSP", "ISP"]

export default function RailwayHistoryPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [selectedRoute, setSelectedRoute] = useState("VIZAG-BSP")
  const [startDate, setStartDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 7)
    return date.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const [capacityData, setCapacityData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "RailwayAdmin") {
      router.push("/login")
      return
    }
  }, [isAuthenticated, user, router])

  useEffect(() => {
    fetchCapacityHistory()
  }, [selectedRoute, startDate, endDate])

  const fetchCapacityHistory = async () => {
    try {
      setLoading(true)
      const [port, plant] = selectedRoute.split('-')
      
      // Generate date range
      const dates = []
      const current = new Date(startDate)
      const end = new Date(endDate)
      
      while (current <= end) {
        dates.push(current.toISOString().split('T')[0])
        current.setDate(current.getDate() + 1)
      }

      // Fetch capacity for each date
      const promises = dates.map(async (date) => {
        const response = await fetch(`/api/railway/capacity?date=${date}`)
        const data = await response.json()
        const capacity = data.data?.find((c: any) => c.port_code === port && c.plant_code === plant)
        return {
          date,
          rakes: capacity?.available_rakes || 0,
          notes: capacity?.notes || "",
        }
      })

      const results = await Promise.all(promises)
      setCapacityData(results)
    } catch (error) {
      console.error("[Railway] Failed to fetch capacity history:", error)
    } finally {
      setLoading(false)
    }
  }

  const adjustDateRange = (days: number) => {
    const newStart = new Date(startDate)
    newStart.setDate(newStart.getDate() + days)
    const newEnd = new Date(endDate)
    newEnd.setDate(newEnd.getDate() + days)
    
    setStartDate(newStart.toISOString().split('T')[0])
    setEndDate(newEnd.toISOString().split('T')[0])
  }

  const totalRakes = capacityData.reduce((sum, d) => sum + d.rakes, 0)
  const avgRakes = capacityData.length > 0 ? (totalRakes / capacityData.length).toFixed(1) : 0

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <PortalNav title="Railway Portal" portal="railway" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Rake Availability History</h1>
          <p className="text-muted-foreground">
            View historical rake availability across different routes and dates
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Route</label>
                <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PORTS.map(port => 
                      PLANTS.map(plant => (
                        <SelectItem key={`${port}-${plant}`} value={`${port}-${plant}`}>
                          {port} → {plant}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => adjustDateRange(-7)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous Week
              </Button>
              <Button variant="outline" size="sm" onClick={() => adjustDateRange(7)}>
                Next Week
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0]
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  setStartDate(weekAgo.toISOString().split('T')[0])
                  setEndDate(today)
                }}
              >
                Last 7 Days
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Rakes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalRakes}</div>
              <p className="text-xs text-muted-foreground">Across selected period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Average per Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgRakes}</div>
              <p className="text-xs text-muted-foreground">Rakes available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Days Covered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{capacityData.length}</div>
              <p className="text-xs text-muted-foreground">In selected range</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daily Breakdown - {selectedRoute}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading data...</p>
              </div>
            ) : capacityData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No data available for selected period</p>
              </div>
            ) : (
              <div className="space-y-2">
                {capacityData.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition"
                  >
                    <div className="flex-1">
                      <div className="font-semibold">
                        {new Date(item.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      {item.notes && (
                        <div className="text-sm text-muted-foreground mt-1">{item.notes}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{item.rakes}</div>
                        <div className="text-xs text-muted-foreground">rakes</div>
                      </div>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((item.rakes / 20) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
