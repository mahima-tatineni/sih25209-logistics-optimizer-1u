"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Package, TrendingUp, Zap } from "lucide-react"

export function ProcurementDashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Shipments", value: "12", icon: Package, color: "bg-blue-50 text-blue-600" },
          { label: "Requests Pending", value: "8", icon: AlertTriangle, color: "bg-amber-50 text-amber-600" },
          { label: "Schedules in Planning", value: "5", icon: TrendingUp, color: "bg-green-50 text-green-600" },
          { label: "Days to Next ETA", value: "3", icon: Zap, color: "bg-red-50 text-red-600" },
        ].map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <Card key={idx} className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className={`p-4 rounded-lg ${kpi.color} mb-3`}>
                  <Icon className="h-8 w-8" />
                </div>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-3xl font-bold text-primary">{kpi.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Critical Alerts */}
      <Card className="border-2 border-destructive/20">
        <CardContent className="pt-6 space-y-3">
          {[
            { plant: "BSP", material: "Coking Coal", days: "18", alert: "Below minimum threshold" },
            { plant: "RSP", material: "Limestone", days: "16", alert: "Stock critical" },
          ].map((alert, idx) => (
            <Alert key={idx} variant="destructive" className="bg-destructive/5 border-destructive/20">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{alert.plant}</strong> - {alert.material} at {alert.days} days cover - {alert.alert}
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>

      {/* Days of Cover Summary */}
      <Card className="border-2 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-primary mb-4">Days of Cover by Plant</h3>
          <div className="space-y-3">
            {[
              { plant: "Bhilai (BSP)", coal: 28, limestone: 28, status: "healthy" },
              { plant: "Rourkela (RSP)", coal: 26, limestone: 27, status: "healthy" },
              { plant: "Bokaro (BSL)", coal: 27, limestone: 28, status: "healthy" },
              { plant: "Durgapur (DSP)", coal: 22, limestone: 25, status: "warning" },
              { plant: "IISCO (ISP)", coal: 20, limestone: 23, status: "critical" },
            ].map((row, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-secondary/10 rounded">
                <span className="font-medium">{row.plant}</span>
                <div className="flex gap-4 text-sm">
                  <span>
                    Coal: <strong className="text-primary">{row.coal}d</strong>
                  </span>
                  <span>
                    Limestone: <strong className="text-primary">{row.limestone}d</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
