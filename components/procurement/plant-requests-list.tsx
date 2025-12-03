"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function PlantRequestsList() {
  const requests = [
    {
      id: "SR001",
      plant: "BSP",
      material: "Coking Coal",
      grade: "Prime Hard",
      quantity: "50,000",
      requiredBy: "2025-01-15",
      currentDays: "28",
      priority: "Normal",
      status: "Scheduled",
      created: "2024-12-28",
    },
    {
      id: "SR002",
      plant: "RSP",
      material: "Limestone",
      grade: "Flux Grade",
      quantity: "25,000",
      requiredBy: "2025-01-20",
      currentDays: "26",
      priority: "High",
      status: "Pending",
      created: "2024-12-30",
    },
    {
      id: "SR003",
      plant: "DSP",
      material: "Coking Coal",
      grade: "Semi-Soft",
      quantity: "35,000",
      requiredBy: "2025-01-10",
      currentDays: "22",
      priority: "Critical",
      status: "In Planning",
      created: "2024-12-25",
    },
    {
      id: "SR004",
      plant: "ISP",
      material: "Coking Coal",
      grade: "Medium",
      quantity: "28,000",
      requiredBy: "2025-01-12",
      currentDays: "20",
      priority: "Critical",
      status: "Pending",
      created: "2025-01-01",
    },
  ]

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary">Plant Stock Requests</CardTitle>
        <CardDescription>Submitted requirements awaiting procurement action</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary/10">
                <th className="text-left py-3 px-4 font-semibold text-primary">Request</th>
                <th className="text-left py-3 px-4 font-semibold text-primary">Plant</th>
                <th className="text-left py-3 px-4 font-semibold text-primary">Material</th>
                <th className="text-left py-3 px-4 font-semibold text-primary">Qty</th>
                <th className="text-left py-3 px-4 font-semibold text-primary">Required By</th>
                <th className="text-left py-3 px-4 font-semibold text-primary">Current Days</th>
                <th className="text-left py-3 px-4 font-semibold text-primary">Priority</th>
                <th className="text-left py-3 px-4 font-semibold text-primary">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-primary">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-b border-primary/5 hover:bg-primary/5">
                  <td className="py-3 px-4 font-semibold text-primary">{req.id}</td>
                  <td className="py-3 px-4 font-medium">{req.plant}</td>
                  <td className="py-3 px-4 text-foreground/70">{req.material}</td>
                  <td className="py-3 px-4 font-semibold">{req.quantity}t</td>
                  <td className="py-3 px-4 text-foreground">{req.requiredBy}</td>
                  <td className="py-3 px-4 text-foreground/70">{req.currentDays}d</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        req.priority === "Critical" ? "destructive" : req.priority === "High" ? "secondary" : "default"
                      }
                    >
                      {req.priority}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={req.status === "Pending" ? "secondary" : "default"}>{req.status}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                      Plan Shipment
                    </Button>
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
