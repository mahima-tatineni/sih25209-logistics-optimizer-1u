"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function LiveTracking() {
  const vessels = [
    {
      id: "VES001",
      name: "MV Pacific Glory",
      origin: "Gladstone",
      destination: "Vizag",
      status: "At Sea",
      progress: 65,
      eta: "2025-02-05",
      position: "8.2°N 78.5°E",
      speed: "14.2 knots",
      weather: "Favorable",
    },
    {
      id: "VES002",
      name: "MV Ocean Star",
      origin: "Newcastle",
      destination: "Paradip",
      status: "At Sea",
      progress: 45,
      eta: "2025-02-08",
      position: "12.5°N 82.3°E",
      speed: "13.8 knots",
      weather: "Moderate swell",
    },
    {
      id: "VES003",
      name: "MV Steel Carrier",
      origin: "Maputo",
      destination: "Haldia",
      status: "Loading",
      progress: 5,
      eta: "2025-02-18",
      position: "-25.9°S 32.5°E",
      speed: "0 knots",
      weather: "Good",
    },
  ]

  return (
    <div className="space-y-4">
      {vessels.map((vessel) => (
        <Card key={vessel.id} className="border-2 border-primary/20">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Vessel</p>
                <p className="font-bold text-primary">{vessel.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Route</p>
                <p className="font-bold">
                  {vessel.origin} → {vessel.destination}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={vessel.status === "At Sea" ? "default" : "secondary"}>{vessel.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ETA</p>
                <p className="font-bold text-primary">{vessel.eta}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weather</p>
                <p className="font-bold text-primary">{vessel.weather}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-primary">Journey Progress</p>
                <p className="text-xs text-muted-foreground">{vessel.progress}%</p>
              </div>
              <Progress value={vessel.progress} className="h-2" />
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-primary/10">
              <div className="text-sm">
                <p className="text-muted-foreground">Position</p>
                <p className="font-medium">{vessel.position}</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Speed</p>
                <p className="font-medium">{vessel.speed}</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Distance Remaining</p>
                <p className="font-medium">{Math.round((100 - vessel.progress) * 80)} NM</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Days to ETA</p>
                <p className="font-medium">{Math.round((100 - vessel.progress) / 10)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
