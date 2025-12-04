"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"

interface PlantRequestsListProps {
  plantId?: string
}

export function PlantRequestsList({ plantId }: PlantRequestsListProps) {
  const { user } = useAuth()
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [plantId, user])

  const fetchRequests = async () => {
    try {
      const effectivePlantId = plantId || user?.plant_id || "BSP"
      console.log("[v0] Fetching requests for plant:", effectivePlantId)

      const response = await fetch(`/api/plant/${effectivePlantId}/requests`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch requests")
      }
      
      const data = await response.json()
      console.log("[v0] Requests response:", data)
      
      setRequests(data.requests || [])
    } catch (error) {
      console.error("[v0] Error fetching requests:", error)
      setRequests([])
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
                    <td className="py-3 px-4 font-medium capitalize">{req.material?.replace("_", " ")}</td>
                    <td className="py-3 px-4 text-foreground/70">{req.grade || "-"}</td>
                    <td className="py-3 px-4 font-semibold">{req.quantity_t?.toLocaleString()}</td>
                    <td className="py-3 px-4 text-foreground">{req.required_by_date}</td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusBadge(req.status?.toLowerCase())}>{req.status?.replace("_", " ").toUpperCase()}</Badge>
                    </td>
                    <td className="py-3 px-4 text-foreground/70 text-xs max-w-xs">{req.procurement_comments || "-"}</td>
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
