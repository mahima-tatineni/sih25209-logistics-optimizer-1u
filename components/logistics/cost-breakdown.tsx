"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function CostBreakdown() {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Aggregate Cost Analysis</CardTitle>
          <CardDescription>Total costs across all active schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Ocean Freight", value: "$4.2M", percent: "45%" },
              { label: "Port Handling", value: "$1.8M", percent: "19%" },
              { label: "Port Storage", value: "$0.6M", percent: "6%" },
              { label: "Rail Transport", value: "$2.1M", percent: "23%" },
              { label: "Demurrage", value: "$0.5M", percent: "5%" },
            ].map((cost, idx) => (
              <div key={idx} className="p-4 bg-secondary/10 rounded-lg border border-primary/10">
                <p className="text-xs text-muted-foreground mb-1">{cost.label}</p>
                <p className="font-bold text-primary">{cost.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{cost.percent} of total</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* By Schedule */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Cost Breakdown by Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                schedule: "SCH001 - MV Pacific Glory",
                oceanFreight: "$4,875k",
                port: "$637k",
                rail: "$1,313k",
                demurrage: "$150k",
                total: "$6,975k",
              },
              {
                schedule: "SCH002 - MV Ocean Star",
                oceanFreight: "$4,464k",
                port: "$589k",
                rail: "$886k",
                demurrage: "$225k",
                total: "$6,164k",
              },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-secondary/10 rounded-lg">
                <p className="font-semibold text-primary mb-3">{item.schedule}</p>
                <div className="grid grid-cols-5 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Ocean</p>
                    <p className="font-bold text-primary">{item.oceanFreight}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Port</p>
                    <p className="font-bold text-primary">{item.port}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rail</p>
                    <p className="font-bold text-primary">{item.rail}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Demurrage</p>
                    <p className="font-bold text-primary">{item.demurrage}</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded border border-primary/20">
                    <p className="text-muted-foreground">Total</p>
                    <p className="font-bold text-primary">{item.total}</p>
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
