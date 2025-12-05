"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { PortalNav } from "@/components/portal-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Train, Calendar, FileText } from "lucide-react"

export default function RailwayHomePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({ totalRakes: 0, pendingRequests: 0 })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "RailwayAdmin") {
      router.push("/login")
      return
    }
    fetchStats()
  }, [isAuthenticated, user, router])

  const fetchStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Fetch today's capacity
      const capacityRes = await fetch(`/api/railway/capacity?date=${today}`)
      const capacityData = await capacityRes.json()
      const totalRakes = capacityData.data?.reduce((sum: number, c: any) => sum + c.available_rakes, 0) || 0

      // Fetch pending requests
      const requestsRes = await fetch("/api/railway/requests?status=REQUESTED")
      const requestsData = await requestsRes.json()
      const pendingRequests = requestsData.data?.length || 0

      setStats({ totalRakes, pendingRequests })
    } catch (error) {
      console.error("[Railway] Failed to fetch stats:", error)
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <PortalNav title="Railway Portal" portal="railway" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Railway Operations Dashboard</h1>
          <p className="text-muted-foreground">
            Manage rake availability and respond to schedule requests from Logistics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Available Rakes</CardTitle>
              <Train className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRakes}</div>
              <p className="text-xs text-muted-foreground">Across all port-plant routes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingRequests}</div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button
                  onClick={() => router.push("/railway/capacity")}
                  className="w-full text-left text-sm text-primary hover:underline"
                >
                  Update Daily Capacity →
                </button>
                <button
                  onClick={() => router.push("/railway/requests")}
                  className="w-full text-left text-sm text-primary hover:underline"
                >
                  View Schedule Requests →
                </button>
                <button
                  onClick={() => router.push("/railway/history")}
                  className="w-full text-left text-sm text-primary hover:underline"
                >
                  View Availability History →
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Responsibilities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Update daily rake availability for each port-plant route</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Review and confirm rake allocation requests from Logistics team</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Provide realistic date windows for rake availability based on current capacity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Flag any constraints or delays that may impact schedule delivery</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
