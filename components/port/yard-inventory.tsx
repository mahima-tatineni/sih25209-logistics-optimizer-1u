"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function PortYardInventory() {
  return (
    <div className="space-y-4">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Yard Inventory & Utilization</CardTitle>
          <CardDescription>Current stockpile and storage capacity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            { material: "Coking Coal", qty: "245,000 t", capacity: "320,000 t", utilization: 76 },
            { material: "Limestone", qty: "89,000 t", capacity: "200,000 t", utilization: 44 },
          ].map((item) => (
            <div key={item.material} className="p-4 bg-secondary/10 rounded-lg border border-primary/10">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-primary">{item.material}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.qty} / {item.capacity}
                  </p>
                </div>
                <p className="font-bold text-primary">{item.utilization}%</p>
              </div>
              <Progress value={item.utilization} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Recent Movements</CardTitle>
          <CardDescription>Last 7 days of yard receipts and dispatches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Movement</th>
                  <th className="text-left py-3 px-4 font-semibold">Material</th>
                  <th className="text-left py-3 px-4 font-semibold">Quantity</th>
                  <th className="text-left py-3 px-4 font-semibold">Reference</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    date: "2025-01-05",
                    movement: "Receipt",
                    material: "Coking Coal",
                    qty: "50,000t",
                    ref: "Cape Mercury",
                  },
                  {
                    date: "2025-01-04",
                    movement: "Dispatch",
                    material: "Coking Coal",
                    qty: "20,000t",
                    ref: "Rake R-2401",
                  },
                  {
                    date: "2025-01-03",
                    movement: "Receipt",
                    material: "Limestone",
                    qty: "30,000t",
                    ref: "Ocean Giant",
                  },
                  {
                    date: "2025-01-02",
                    movement: "Dispatch",
                    material: "Limestone",
                    qty: "15,000t",
                    ref: "Rake R-2400",
                  },
                ].map((move, idx) => (
                  <tr key={idx} className="border-b border-primary/5 hover:bg-primary/5">
                    <td className="py-3 px-4">{move.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={
                          move.movement === "Receipt" ? "text-green-600 font-medium" : "text-blue-600 font-medium"
                        }
                      >
                        {move.movement}
                      </span>
                    </td>
                    <td className="py-3 px-4">{move.material}</td>
                    <td className="py-3 px-4 font-bold text-primary">{move.qty}</td>
                    <td className="py-3 px-4 text-muted-foreground">{move.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
