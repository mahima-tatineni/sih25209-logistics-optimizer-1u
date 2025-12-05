"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { PortalNav } from "@/components/portal-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Anchor, Ship, Calendar, FileText } from "lucide-react"

export default function PortHomePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({ berths: 0, stockyard: 0, congestion: 0, upcomingVessels: 0 })
  const [portCode, setPortCode] = useState("")
  const [portName, setPortName] = useState("")

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "PortAdmin") {
      router.push("/login")
      return
    }
    
    // Extract port code from email (e.g., port.vizag@sail.in → VIZAG)
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
      fetchStats(code)
    }
  }, [isAuthenticated, user, router])

  const fetchStats = async (code: string) => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Fetch today's capacity
      const capacityRes = await fetch(`/api/port/capacity?date=${today}&port_code=${code}`)
      const capacityData = await capacityRes.json()
      const capacity = capacityData.data?.[0] || { available_berths: 0, available_stockyard_t: 0, congestion_index: 0 }

      // Fetch upcoming vessels
      const requestsRes = await fetch(`/api/port/requests?port_code=${code}`)
      const requestsData = await requestsRes.json()
      const upcomingVessels = requestsData.data?.filter((r: any) => r.status !== "CLOSED").length || 0

      setStats({
        berths: capacity.available_berths,
        stockyard: capacity.available_stockyard_t,
        congestion: capacity.congestion_index,
        upcomingVessels,
      })
    } catch (error) {
      console.error("[Port] Failed to fetch stats:", error)
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <PortalNav title={`${portName} Port Portal`} portal="port" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">{portName} Port Operations</h1>
          <p className="text-muted-foreground">
            Manage berth availability and respond to vessel schedule requests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Berths</CardTitle>
              <Anchor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.berths}</div>
              <p className="text-xs text-muted-foreground">Today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stockyard Capacity</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.stockyard.toLocaleString()} T</div>
              <p className="text-xs text-muted-foreground">Available for SAIL cargo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Congestion Index</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.congestion}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.congestion < 30 ? "Low" : stats.congestion < 70 ? "Medium" : "High"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Vessels</CardTitle>
              <Ship className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingVessels}</div>
              <p className="text-xs text-muted-foreground">Pending confirmation</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button
                onClick={() => router.push("/port/capacity")}
                className="w-full text-left p-3 border rounded-lg hover:bg-muted/30 transition"
              >
                <div className="font-semibold">Update Daily Capacity</div>
                <div className="text-sm text-muted-foreground">Set berths, stockyard, and congestion for today</div>
              </button>
              <button
                onClick={() => router.push("/port/requests")}
                className="w-full text-left p-3 border rounded-lg hover:bg-muted/30 transition"
              >
                <div className="font-semibold">View Vessel Requests</div>
                <div className="text-sm text-muted-foreground">Confirm berth windows for incoming vessels</div>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Responsibilities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Update daily berth availability and stockyard capacity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Monitor and report port congestion levels</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Review vessel schedule requests and confirm berth windows</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Flag any delays or capacity constraints that may impact discharge operations</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
