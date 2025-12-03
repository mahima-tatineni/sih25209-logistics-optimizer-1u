"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function RakeTracking() {
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary">Rake Tracking</CardTitle>
        <CardDescription>Real-time position and ETA monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            {
              rake: "R-2401",
              from: "Vizag",
              to: "Bhilai",
              qty: "4,000t",
              status: "In Transit",
              progress: 75,
              eta: "2025-01-08",
            },
            {
              rake: "R-2402",
              from: "Paradip",
              to: "Rourkela",
              qty: "4,200t",
              status: "Loaded",
              progress: 10,
              eta: "2025-01-06",
            },
            {
              rake: "R-2403",
              from: "Haldia",
              to: "Durgapur",
              qty: "3,500t",
              status: "Scheduled",
              progress: 0,
              eta: "2025-01-10",
            },
          ].map((rake) => (
            <div key={rake.rake} className="p-4 bg-secondary/10 rounded-lg border border-primary/10">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">Rake ID</p>
                  <p className="font-bold text-primary">{rake.rake}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Route</p>
                  <p className="font-bold">
                    {rake.from} → {rake.to}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cargo</p>
                  <p className="font-bold">{rake.qty}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={rake.status === "In Transit" ? "default" : "secondary"}>{rake.status}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="font-bold text-primary">{rake.progress}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ETA</p>
                  <p className="font-bold text-primary">{rake.eta}</p>
                </div>
              </div>
              <Progress value={rake.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
