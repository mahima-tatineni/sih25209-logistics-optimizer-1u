"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StockMovementHistoryProps {
  plantId: string
}

export function StockMovementHistory({ plantId }: StockMovementHistoryProps) {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [plantId])

  const fetchEvents = async () => {
    try {
      const response = await fetch(`/api/plant/${plantId}/events`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error("[v0] Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="border-2 border-primary/20">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading stock movement history...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary">Stock Movement History</CardTitle>
        <CardDescription>Last 30 days of receipts and consumption</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No stock movements recorded yet</p>
            <p className="text-sm mt-1">Updates will appear here after stock transactions</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="text-left py-3 px-4 font-semibold text-primary">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-primary">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-primary">Material</th>
                  <th className="text-left py-3 px-4 font-semibold text-primary">Quantity (t)</th>
                  <th className="text-left py-3 px-4 font-semibold text-primary">Reference</th>
                  <th className="text-left py-3 px-4 font-semibold text-primary">Comment</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-primary/5 hover:bg-primary/5">
                    <td className="py-3 px-4 text-foreground">
                      {new Date(event.date_time).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={event.event_type === "rake_arrival" ? "default" : "secondary"}
                        className="flex items-center gap-1 w-fit"
                      >
                        {event.event_type === "rake_arrival" ? (
                          <>
                            <TrendingUp className="h-3 w-3" />
                            Receipt
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-3 w-3" />
                            Consumption
                          </>
                        )}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-medium capitalize">
                      {event.material?.replace("_", " ")}
                    </td>
                    <td className="py-3 px-4 font-semibold text-primary">
                      {event.quantity_t?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {event.rake_id || "Daily use"}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      {event.comment || "-"}
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
