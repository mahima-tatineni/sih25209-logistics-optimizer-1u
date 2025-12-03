"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function InventoryMonitor() {
  const plants = [
    { code: "BSP", name: "Bhilai", coal: 350000, limestone: 75000, coalDays: 28, limestoneDays: 28, status: "green" },
    { code: "RSP", name: "Rourkela", coal: 220000, limestone: 48000, coalDays: 26, limestoneDays: 27, status: "green" },
    { code: "BSL", name: "Bokaro", coal: 280000, limestone: 62000, coalDays: 27, limestoneDays: 28, status: "green" },
    { code: "DSP", name: "Durgapur", coal: 140000, limestone: 28000, coalDays: 22, limestoneDays: 25, status: "amber" },
    { code: "ISP", name: "IISCO", coal: 100000, limestone: 18000, coalDays: 20, limestoneDays: 23, status: "red" },
  ]

  const ports = [
    { code: "VIZAG", name: "Vizag", coal: 85000, status: "green" },
    { code: "PARA", name: "Paradip", coal: 120000, status: "green" },
    { code: "DHAM", name: "Dhamra", coal: 65000, status: "amber" },
    { code: "HALD", name: "Haldia", coal: 45000, status: "green" },
    { code: "GANG", name: "Gangavaram", coal: 75000, status: "green" },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      green: "bg-green-100 border-green-300",
      amber: "bg-amber-100 border-amber-300",
      red: "bg-red-100 border-red-300",
    }
    return colors[status] || "bg-gray-100"
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, any> = {
      green: "default",
      amber: "secondary",
      red: "destructive",
    }
    return badges[status] || "default"
  }

  return (
    <div className="space-y-6">
      {/* Plant Inventory */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Plant Inventory Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {plants.map((plant) => (
              <div key={plant.code} className={`p-4 rounded-lg border-2 ${getStatusColor(plant.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-primary">{plant.name}</p>
                    <p className="text-xs text-muted-foreground">Code: {plant.code}</p>
                  </div>
                  <Badge variant={getStatusBadge(plant.status)}>{plant.status.toUpperCase()}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Coking Coal</p>
                    <p className="font-bold text-primary">
                      {(plant.coal / 1000).toFixed(0)}k t · {plant.coalDays}d
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Limestone</p>
                    <p className="font-bold text-primary">
                      {(plant.limestone / 1000).toFixed(0)}k t · {plant.limestoneDays}d
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Port Inventory */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Port Yard Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ports.map((port) => (
              <div key={port.code} className={`p-4 rounded-lg border-2 ${getStatusColor(port.status)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-primary">{port.name}</p>
                    <p className="text-sm font-bold">{(port.coal / 1000).toFixed(0)}k t Coal</p>
                  </div>
                  <Badge variant={getStatusBadge(port.status)}>{port.status.toUpperCase()}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
