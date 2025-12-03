"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function RakeDispatchBoard() {
  return (
    <div className="space-y-4">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Rail Dispatch Board</CardTitle>
          <CardDescription>All confirmed schedules requiring rakes by date and destination</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">From Port</th>
                  <th className="text-left py-3 px-4 font-semibold">To Plant</th>
                  <th className="text-left py-3 px-4 font-semibold">Material</th>
                  <th className="text-left py-3 px-4 font-semibold">Quantity</th>
                  <th className="text-left py-3 px-4 font-semibold">Rakes Needed</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    date: "2025-02-05",
                    from: "Vizag",
                    to: "Bhilai",
                    material: "Coal",
                    qty: "40,000t",
                    rakes: "10",
                    status: "Pending",
                  },
                  {
                    date: "2025-02-08",
                    from: "Paradip",
                    to: "Rourkela",
                    material: "Coal",
                    qty: "35,000t",
                    rakes: "9",
                    status: "Pending",
                  },
                  {
                    date: "2025-02-10",
                    from: "Haldia",
                    to: "Durgapur",
                    material: "Lime",
                    qty: "20,000t",
                    rakes: "5",
                    status: "Allocated",
                  },
                  {
                    date: "2025-02-12",
                    from: "Vizag",
                    to: "Bokaro",
                    material: "Coal",
                    qty: "45,000t",
                    rakes: "11",
                    status: "Pending",
                  },
                ].map((dispatch, idx) => (
                  <tr key={idx} className="border-b border-primary/5 hover:bg-primary/5">
                    <td className="py-3 px-4 font-semibold">{dispatch.date}</td>
                    <td className="py-3 px-4">{dispatch.from}</td>
                    <td className="py-3 px-4 font-medium text-primary">{dispatch.to}</td>
                    <td className="py-3 px-4">{dispatch.material}</td>
                    <td className="py-3 px-4 font-bold">{dispatch.qty}</td>
                    <td className="py-3 px-4 font-bold text-primary">{dispatch.rakes}</td>
                    <td className="py-3 px-4">
                      <Badge variant={dispatch.status === "Allocated" ? "default" : "secondary"}>
                        {dispatch.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="text-accent">
                        Allocate
                      </Button>
                    </td>
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
