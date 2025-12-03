"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ship, Factory, TrendingUp, AlertCircle, Package } from "lucide-react"
import { STOCK_SNAPSHOTS } from "@/lib/mock-data"
import type { Shipment, StockSnapshot } from "@/lib/types"

export default function DashboardPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [stocks] = useState<StockSnapshot[]>(STOCK_SNAPSHOTS)

  useEffect(() => {
    fetch("/api/shipments")
      .then((res) => res.json())
      .then(setShipments)
      .catch(console.error)
  }, [])

  const inTransit = shipments.filter((s) => s.status === "in_transit").length
  const totalQuantity = shipments.reduce((sum, s) => sum + s.quantity_t, 0)
  const plantStocks = stocks.filter((s) => s.location_type === "plant")
  const avgDaysCover = plantStocks.reduce((sum, s) => sum + (s.days_cover || 0), 0) / plantStocks.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of logistics operations and key metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vessels in Transit</CardTitle>
            <Ship className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{inTransit}</div>
            <p className="text-xs text-muted-foreground mt-1">Active shipments</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Material in Transit</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{Math.round(totalQuantity / 1000)}k</div>
            <p className="text-xs text-muted-foreground mt-1">Tonnes</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Days Cover</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{avgDaysCover.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">Days at plants</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">2</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Arrivals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ship className="h-5 w-5 text-accent" />
            Upcoming Vessel Arrivals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {shipments.filter((s) => s.eta).length > 0 ? (
            <div className="space-y-3">
              {shipments
                .filter((s) => s.eta)
                .sort((a, b) => (a.eta! > b.eta! ? 1 : -1))
                .slice(0, 5)
                .map((shipment) => (
                  <div key={shipment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{shipment.vessel}</p>
                      <p className="text-xs text-muted-foreground">
                        {shipment.supplier_port} → {shipment.candidate_ports.join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">{shipment.eta}</p>
                      <p className="text-xs text-muted-foreground">{(shipment.quantity_t / 1000).toFixed(0)}k tons</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No upcoming arrivals</p>
          )}
        </CardContent>
      </Card>

      {/* Plant Stock Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5 text-accent" />
            Plant Stock Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {plantStocks.map((stock) => (
              <div
                key={`${stock.location}-${stock.material}`}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div>
                  <p className="font-semibold text-sm">{stock.location}</p>
                  <p className="text-xs text-muted-foreground capitalize">{stock.material.replace("_", " ")}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">{(stock.quantity_t / 1000).toFixed(0)}k tons</p>
                  {stock.days_cover && (
                    <p
                      className={`text-xs font-medium ${stock.days_cover < 20 ? "text-destructive" : "text-green-600"}`}
                    >
                      {stock.days_cover.toFixed(1)} days cover
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
