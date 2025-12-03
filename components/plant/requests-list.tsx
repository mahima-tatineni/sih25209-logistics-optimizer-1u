"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"

export function PlantRequestsList() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const plantCode = user?.plant_id || "BSP"
      console.log("[v0] Fetching plant with code:", plantCode)

      const plantsRes = await fetch(`/api/plants?code=${plantCode}`)
      const plantsData = await plantsRes.json()

      console.log("[v0] Plants API response:", plantsData)

      // Check if we have valid plant data
      if (!plantsData.data || plantsData.data.length === 0) {
        console.error("[v0] Plant not found:", plantCode)
        // Use mock data fallback
        setRequests([
          {
            id: "SR001",
            material_type: "coking_coal",
            quality_grade: "Prime Hard",
            quantity_requested: 50000,
            required_by_date: "2025-01-15",
            status: "scheduled",
            created_at: "2024-12-28",
            procurement_notes: "Assigned to Voyage SHP001",
          },
        ])
        setLoading(false)
        return
      }

      const plantUuid = plantsData.data[0].id
      console.log("[v0] Found plant UUID:", plantUuid)

      const response = await fetch(`/api/stock-requests?plant_id=${plantUuid}`)
      const data = await response.json()

      console.log("[v0] Stock requests response:", data)
      setRequests(data.data || [])
    } catch (error) {
      console.error("[v0] Error fetching requests:", error)
      // Fallback to mock data
      setRequests([
        {
          id: "SR001",
          material_type: "coking_coal",
          quality_grade: "Prime Hard",
          quantity_requested: 50000,
          required_by_date: "2025-01-15",
          status: "scheduled",
          created_at: "2024-12-28",
          procurement_notes: "Assigned to Voyage SHP001",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: "secondary",
      under_review: "default",
      approved: "default",
      scheduled: "default",
      in_transit: "outline",
      completed: "outline",
      rejected: "destructive",
    }
    return variants[status] || "secondary"
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">Loading requests...</CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary">Stock Requests</CardTitle>
        <CardDescription>Status and history of replenishment requests</CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No stock requests found.</p>
            <p className="text-sm">Create your first request using the form above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="text-left py-3 px-4 font-semibold text-primary">Request ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-primary">Material</th>
                  <th className="text-left py-3 px-4 font-semibold text-primary">Grade</th>
                  <th className="text-left py-3 px-4 font-semibold text-primary">Qty (t)</th>
                  <th className="text-left py-3 px-4 font-semibold text-primary">Required By</th>
                  <th className="text-left py-3 px-4 font-semibold text-primary">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-primary">Procurement Notes</th>
                  <th className="text-left py-3 px-4 font-semibold text-primary">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id} className="border-b border-primary/5 hover:bg-primary/5">
                    <td className="py-3 px-4 font-semibold text-primary">{req.id?.substring(0, 8)}</td>
                    <td className="py-3 px-4 font-medium capitalize">{req.material_type?.replace("_", " ")}</td>
                    <td className="py-3 px-4 text-foreground/70">{req.quality_grade}</td>
                    <td className="py-3 px-4 font-semibold">{req.quantity_requested?.toLocaleString()}</td>
                    <td className="py-3 px-4 text-foreground">{req.required_by_date}</td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusBadge(req.status)}>{req.status?.replace("_", " ").toUpperCase()}</Badge>
                    </td>
                    <td className="py-3 px-4 text-foreground/70 text-xs max-w-xs">{req.procurement_notes || "-"}</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
