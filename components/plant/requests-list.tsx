"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function PlantRequestsList() {
  const requests = [
    {
      id: "SR001",
      material: "Coking Coal",
      grade: "Prime Hard",
      quantity: "50,000",
      requiredBy: "2025-01-15",
      status: "Scheduled",
      created: "2024-12-28",
      procurement_comment: "Assigned to Voyage SHP001",
    },
    {
      id: "SR002",
      material: "Limestone",
      grade: "Flux Grade",
      quantity: "25,000",
      requiredBy: "2025-01-20",
      status: "Pending",
      created: "2024-12-30",
      procurement_comment: "Under evaluation",
    },
    {
      id: "SR003",
      material: "Coking Coal",
      grade: "Semi-Soft",
      quantity: "35,000",
      requiredBy: "2025-01-10",
      status: "In Planning",
      created: "2024-12-25",
      procurement_comment: "Port discharge confirmed at Paradip",
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      Pending: "secondary",
      "In Planning": "default",
      Scheduled: "default",
      "In Transit": "outline",
      Delivered: "outline",
    }
    return variants[status] || "secondary"
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary">Stock Requests</CardTitle>
        <CardDescription>Status and history of replenishment requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary/10">
                <th className="text-left py-3 px-4 font-semibold text-primary">Request ID</th>
                <th className="text-left py-3 px-4 font-semibold text-primary">Material</th>
                <th className="text-left py-3 px-4 font-semibold text-primary">Grade</th>
                <th className="text-left py-3 px-4 font-semibold text-primary">Qty (t)</th>
                <th className="text-left py-3 px-4 font-semibold text-primary">Required By</th>
                <th className="text-left py-3 px-4 font-semibold text-primary">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-primary">Procurement Notes</th>
                <th className="text-left py-3 px-4 font-semibold text-primary">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-b border-primary/5 hover:bg-primary/5">
                  <td className="py-3 px-4 font-semibold text-primary">{req.id}</td>
                  <td className="py-3 px-4 font-medium">{req.material}</td>
                  <td className="py-3 px-4 text-foreground/70">{req.grade}</td>
                  <td className="py-3 px-4 font-semibold">{req.quantity}</td>
                  <td className="py-3 px-4 text-foreground">{req.requiredBy}</td>
                  <td className="py-3 px-4">
                    <Badge variant={getStatusBadge(req.status)}>{req.status}</Badge>
                  </td>
                  <td className="py-3 px-4 text-foreground/70 text-xs max-w-xs">{req.procurement_comment}</td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                      View
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
