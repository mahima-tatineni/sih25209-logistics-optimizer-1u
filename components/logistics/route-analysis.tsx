"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function RouteAnalysis() {
  const routes = [
    {
      id: "RT001",
      origin: "Gladstone",
      port: "Vizag",
      destination: "Bhilai (BSP)",
      distance: "6,200 NM",
      oceanFreight: "$65/t",
      portCost: "$8.5/t",
      railCost: "$17.5/t",
      total: "$91/t",
      status: "Active",
      vessels: 2,
    },
    {
      id: "RT002",
      origin: "Newcastle",
      port: "Paradip",
      destination: "Rourkela (RSP)",
      distance: "5,800 NM",
      oceanFreight: "$62/t",
      portCost: "$8.2/t",
      railCost: "$12.3/t",
      total: "$82.5/t",
      status: "Active",
      vessels: 2,
    },
    {
      id: "RT003",
      origin: "Richards Bay",
      port: "Haldia",
      destination: "Durgapur (DSP)",
      distance: "4,200 NM",
      oceanFreight: "$58/t",
      portCost: "$7.8/t",
      railCost: "$18.2/t",
      total: "$84/t",
      status: "Planned",
      vessels: 1,
    },
  ]

  return (
    <div className="space-y-4">
      {routes.map((route) => (
        <Card key={route.id} className="border-2 border-primary/20">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Route Summary */}
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-primary">
                      {route.origin} → {route.port} → {route.destination}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {route.distance} · {route.vessels} active vessels
                    </p>
                  </div>
                  <Badge variant={route.status === "Active" ? "default" : "secondary"}>{route.status}</Badge>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-secondary/10 rounded">
                  <p className="text-xs text-muted-foreground">Ocean</p>
                  <p className="font-bold text-primary">{route.oceanFreight}</p>
                </div>
                <div className="p-3 bg-secondary/10 rounded">
                  <p className="text-xs text-muted-foreground">Port</p>
                  <p className="font-bold text-primary">{route.portCost}</p>
                </div>
                <div className="p-3 bg-secondary/10 rounded">
                  <p className="text-xs text-muted-foreground">Rail</p>
                  <p className="font-bold text-primary">{route.railCost}</p>
                </div>
              </div>

              {/* Total Cost */}
              <div className="md:col-span-2 p-4 bg-primary/10 rounded border-2 border-primary/20">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-primary">All-in Cost</p>
                  <p className="text-2xl font-bold text-primary">{route.total}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
