"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Clock, AlertCircle } from "lucide-react"

interface CurrentRequestsSummaryProps {
  plantId: string
}

export function CurrentRequestsSummary({ plantId }: CurrentRequestsSummaryProps) {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [plantId])

  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/plant/${plantId}/requests`)
      if (response.ok) {
        const data = await response.json()
        // Only show pending and in-planning requests
        const activeRequests = (data.requests || []).filter(
          (r: any) => r.status === "Pending" || r.status === "In Planning"
        )
        setRequests(activeRequests)
      }
    } catch (error) {
      console.error("[v0] Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="border-2 border-primary/20">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading current requests...</p>
        </CardContent>
      </Card>
    )
  }

  if (requests.length === 0) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Current Stock Requests</CardTitle>
          <CardDescription>Active replenishment requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No active stock requests</p>
            <p className="text-sm mt-1">Create a request in the Stock Requests tab</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary">Current Stock Requests</CardTitle>
        <CardDescription>{requests.length} active request{requests.length !== 1 ? "s" : ""}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="flex items-start justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition border border-primary/10"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="h-4 w-4 text-primary" />
                  <p className="font-semibold text-primary capitalize">
                    {req.material?.replace("_", " ")}
                  </p>
                  {req.priority === "Critical" && (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {req.quantity_t?.toLocaleString()} tonnes · {req.grade || "Standard grade"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Required by: {new Date(req.required_by_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={req.status === "Pending" ? "secondary" : "default"}
                  className={req.priority === "Critical" ? "bg-red-100 text-red-800 border-red-200" : ""}
                >
                  {req.status}
                </Badge>
                {req.priority === "Critical" && (
                  <p className="text-xs text-red-600 mt-1 font-semibold">URGENT</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
