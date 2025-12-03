"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function RakePlanningForm() {
  return (
    <div className="space-y-4">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Rake Allocation & Planning</CardTitle>
          <CardDescription>13 active routes connecting ports and plants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { route: "Vizag → Bhilai", distance: "850 km", maxRakes: "4/day", utilizaton: "3/4", transit: "2.1d" },
              {
                route: "Paradip → Rourkela",
                distance: "120 km",
                maxRakes: "5/day",
                utilizaton: "5/5",
                transit: "0.5d",
              },
              { route: "Haldia → Durgapur", distance: "220 km", maxRakes: "5/day", utilizaton: "4/5", transit: "0.8d" },
              { route: "Vizag → Rourkela", distance: "550 km", maxRakes: "3/day", utilizaton: "2/3", transit: "1.5d" },
            ].map((route, idx) => (
              <div key={idx} className="p-4 bg-secondary/10 rounded-lg border border-primary/10">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-primary">{route.route}</p>
                    <p className="text-sm text-muted-foreground">
                      {route.distance} · {route.transit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{route.maxRakes}</p>
                    <p className="text-sm text-muted-foreground">Available</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Current Allocation</p>
                    <Badge variant="outline">{route.utilizaton}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
