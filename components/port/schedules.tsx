"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function PortSchedules() {
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary">Scheduled Arrivals</CardTitle>
        <CardDescription>Next 10 vessel arrivals at this port</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary/10">
                <th className="text-left py-3 px-4 font-semibold">Vessel</th>
                <th className="text-left py-3 px-4 font-semibold">Origin</th>
                <th className="text-left py-3 px-4 font-semibold">Material</th>
                <th className="text-left py-3 px-4 font-semibold">Quantity</th>
                <th className="text-left py-3 px-4 font-semibold">ETA</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  vessel: "Cape Mercury",
                  origin: "Gladstone",
                  material: "Coal",
                  qty: "75,000t",
                  eta: "2025-02-05",
                  status: "At Sea",
                },
                {
                  vessel: "Ocean Giant",
                  origin: "Richards Bay",
                  material: "Coal",
                  qty: "68,000t",
                  eta: "2025-02-08",
                  status: "At Sea",
                },
                {
                  vessel: "New Dawn",
                  origin: "Newcastle",
                  material: "Coal",
                  qty: "52,000t",
                  eta: "2025-02-10",
                  status: "Planned",
                },
                {
                  vessel: "Steel Carrier",
                  origin: "Maputo",
                  material: "Coal",
                  qty: "65,000t",
                  eta: "2025-02-15",
                  status: "Planned",
                },
                {
                  vessel: "Baltic Pride",
                  origin: "Murmansk",
                  material: "Coal",
                  qty: "71,000t",
                  eta: "2025-02-20",
                  status: "Planned",
                },
              ].map((schedule, idx) => (
                <tr key={idx} className="border-b border-primary/5 hover:bg-primary/5">
                  <td className="py-3 px-4 font-semibold text-primary">{schedule.vessel}</td>
                  <td className="py-3 px-4">{schedule.origin}</td>
                  <td className="py-3 px-4">{schedule.material}</td>
                  <td className="py-3 px-4 font-bold">{schedule.qty}</td>
                  <td className="py-3 px-4">{schedule.eta}</td>
                  <td className="py-3 px-4">
                    <Badge variant={schedule.status === "At Sea" ? "default" : "secondary"}>{schedule.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
