"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface SchedulesListProps {
  status: "draft" | "confirmed"
}

export function SchedulesList({ status }: SchedulesListProps) {
  const schedules =
    status === "draft"
      ? [
          {
            id: "SCH001",
            vessel: "MV Pacific Glory",
            origin: "Gladstone",
            material: "Coking Coal",
            qty: "75,000",
            ports: ["Vizag"],
            plants: ["BSP", "RSP"],
            eta: "2025-02-05",
            status: "Draft",
            linkedRequests: ["SR001"],
          },
          {
            id: "SCH002",
            vessel: "MV Ocean Star",
            origin: "Newcastle",
            material: "Coking Coal",
            qty: "72,000",
            ports: ["Paradip"],
            plants: ["RSP", "BSL"],
            eta: "2025-02-08",
            status: "Draft",
            linkedRequests: ["SR003"],
          },
        ]
      : [
          {
            id: "SCH003",
            vessel: "MV Steel Carrier",
            origin: "Maputo",
            material: "Coking Coal",
            qty: "68,000",
            ports: ["Vizag", "Paradip"],
            plants: ["BSP", "RSP", "BSL"],
            eta: "2025-02-15",
            status: "Confirmed",
            linkedRequests: ["SR001", "SR002"],
          },
        ]

  return (
    <div className="space-y-3">
      {schedules.map((sch) => (
        <Card key={sch.id} className="border-2 border-primary/20">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Schedule ID</p>
                <p className="font-bold text-primary">{sch.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vessel</p>
                <p className="font-bold">{sch.vessel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Material</p>
                <p className="font-bold">
                  {sch.material} · {sch.qty}t
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ETA</p>
                <p className="font-bold text-primary">{sch.eta}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Discharge Ports</p>
                <div className="flex flex-wrap gap-1">
                  {sch.ports.map((port) => (
                    <Badge key={port} variant="secondary">
                      {port}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Destination Plants</p>
                <div className="flex flex-wrap gap-1">
                  {sch.plants.map((plant) => (
                    <Badge key={plant} variant="outline">
                      {plant}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Linked Requests</p>
                <div className="flex flex-wrap gap-1">
                  {sch.linkedRequests.map((req) => (
                    <Badge key={req} variant="default">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Badge variant={status === "draft" ? "secondary" : "default"}>{sch.status}</Badge>
              <Button variant="ghost" size="sm" className="text-accent">
                {status === "draft" ? "Send to Logistics" : "View Details"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
