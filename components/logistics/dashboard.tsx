"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, AlertTriangle, Zap, Truck } from "lucide-react"

export function LogisticsDashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Avg All-in Cost", value: "$85.3/t", icon: TrendingDown, color: "bg-green-50 text-green-600" },
          { label: "Vessels Tracked", value: "9", icon: Truck, color: "bg-blue-50 text-blue-600" },
          { label: "Routes Active", value: "13", icon: Zap, color: "bg-amber-50 text-amber-600" },
          { label: "Cost Savings YTD", value: "$12.4M", icon: TrendingDown, color: "bg-emerald-50 text-emerald-600" },
        ].map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className={`p-3 rounded-lg ${stat.color} w-fit mb-3`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pending Schedules */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Schedules Awaiting Optimization</CardTitle>
          <CardDescription>Draft schedules from procurement ready for optimization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: "SCH001", vessel: "MV Pacific Glory", origin: "Gladstone", qty: "75,000t", age: "2 hours" },
              { id: "SCH002", vessel: "MV Ocean Star", origin: "Newcastle", qty: "72,000t", age: "5 hours" },
              { id: "SCH003", vessel: "MV Steel Carrier", origin: "Maputo", qty: "68,000t", age: "1 day" },
            ].map((sch) => (
              <div
                key={sch.id}
                className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50"
              >
                <div>
                  <p className="font-semibold text-primary">{sch.vessel}</p>
                  <p className="text-sm text-muted-foreground">
                    From {sch.origin} · {sch.qty}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{sch.age}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Port Congestion Alerts */}
      <Card className="border-2 border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Port Congestion Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="p-3 bg-white rounded border border-amber-200">
            <p className="font-semibold text-amber-900">Paradip Port</p>
            <p className="text-sm text-amber-700">2 vessels at berth, 1 waiting anchorage. Avg wait: 3.2 days</p>
          </div>
          <div className="p-3 bg-white rounded border border-amber-200">
            <p className="font-semibold text-amber-900">Vizag Port</p>
            <p className="text-sm text-amber-700">1 vessel at berth, normal operations</p>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Runs History */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Recent Optimization Runs</CardTitle>
          <CardDescription>Latest cost optimization results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { run: "Quick Optimize (SCH001)", result: "$82.5/t", time: "2 min", improvement: "+2.8%" },
              { run: "Detailed Optimize (SCH002)", result: "$84.1/t", time: "12 min", improvement: "+1.5%" },
              { run: "What-If Analysis (SCH003)", result: "$86.3/t", time: "8 min", improvement: "-0.3%" },
            ].map((opt, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-secondary/10 rounded text-sm">
                <div>
                  <p className="font-medium">{opt.run}</p>
                  <p className="text-xs text-muted-foreground">{opt.time} ago</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{opt.result}</p>
                  <p className={`text-xs ${opt.improvement.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                    {opt.improvement}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
