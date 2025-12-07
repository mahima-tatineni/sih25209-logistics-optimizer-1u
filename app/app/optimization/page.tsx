"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { LineChart, Play } from "lucide-react"
import type { Shipment, OptimizationResult } from "@/lib/types"

export default function OptimizationPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/shipments')
      .then((res) => res.json())
      .then((data) => {
        setShipments(data)
        setSelected(data.filter((s: Shipment) => s.status === 'Draft' || s.status === 'Created').map((s: Shipment) => s.id))
      })
  }, [])

  const handleOptimize = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/optimization/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipments: selected }),
      })
      const data = await res.json()
      setResult(data)
    } catch (error) {
      console.error('[v0] Optimization failed:', error)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Optimization</h1>
        <p className="text-muted-foreground">Run cost optimization for shipments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Checkbox
                  checked={selected.includes(shipment.id)}
                  onCheckedChange={(checked) => {
                    setSelected(
                      checked
                        ? [...selected, shipment.id]
                        : selected.filter((id) => id !== shipment.id)
                    )
                  }}
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{shipment.vessel}</p>
                  <p className="text-xs text-muted-foreground">
                    {shipment.supplier_port} • {(shipment.quantity_t / 1000).toFixed(0)}k tons
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={handleOptimize}
            disabled={selected.length === 0 || loading}
            className="w-full bg-accent hover:bg-accent/90"
          >
            <Play className="h-4 w-4 mr-2" />
            {loading ? 'Optimizing...' : 'Run Optimization'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-accent" />
                Optimization Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.shipments.map((s) => (
                  <div key={s.shipment_id} className="p-3 bg-muted rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-sm">{s.shipment_id}</p>
                      <p className="text-xs text-muted-foreground">
                        ETA: {s.eta || 'TBD'}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {s.assigned_port || 'Port TBD'} • {s.discharge_days || 0} days
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Optimized Shipments</p>
                  <p className="text-2xl font-bold text-primary">
                    {result.shipments?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-2xl font-bold text-green-600">
                    Optimized
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
