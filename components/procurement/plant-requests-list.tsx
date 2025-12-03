"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2, XCircle } from "lucide-react"

export function PlantRequestsList() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/stock-requests?status=pending,under_review")
      const data = await response.json()
      setRequests(data.data || [])
    } catch (error) {
      console.error("[v0] Error fetching requests:", error)
      setRequests([
        {
          id: "SR001",
          plant_id: "BSP",
          material_type: "coking_coal",
          quality_grade: "Prime Hard",
          quantity_requested: 50000,
          required_by_date: "2025-01-15",
          priority: "normal",
          status: "pending",
          created_at: "2024-12-28",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async () => {
    if (!selectedRequest || !actionType) return

    try {
      const newStatus = actionType === "approve" ? "approved" : "rejected"
      const response = await fetch(`/api/stock-requests/${selectedRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          procurement_notes: notes,
        }),
      })

      if (!response.ok) throw new Error("Failed to update request")

      await fetchRequests()
      setSelectedRequest(null)
      setActionType(null)
      setNotes("")
    } catch (error) {
      console.error("[v0] Error updating request:", error)
      alert("Failed to update request. Please try again.")
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">Loading requests...</CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Plant Stock Requests</CardTitle>
          <CardDescription>Submitted requirements awaiting procurement action</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No pending requests at this time.</p>
            </div>
          ) : (
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
                      <td className="py-3 px-4 font-semibold text-primary">{req.id?.substring(0, 8)}</td>
                      <td className="py-3 px-4 font-medium">{req.plant_id}</td>
                      <td className="py-3 px-4 text-foreground/70 capitalize">
                        {req.material_type?.replace("_", " ")}
                      </td>
                      <td className="py-3 px-4 font-semibold">{req.quantity_requested?.toLocaleString()}t</td>
                      <td className="py-3 px-4 text-foreground">{req.required_by_date}</td>
                      <td className="py-3 px-4 text-foreground/70">N/A</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            req.priority === "critical"
                              ? "destructive"
                              : req.priority === "high"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {req.priority?.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={req.status === "pending" ? "secondary" : "default"}>
                          {req.status?.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600"
                          onClick={() => {
                            setSelectedRequest(req)
                            setActionType("approve")
                          }}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => {
                            setSelectedRequest(req)
                            setActionType("reject")
                          }}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={selectedRequest !== null}
        onOpenChange={() => {
          setSelectedRequest(null)
          setActionType(null)
          setNotes("")
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionType === "approve" ? "Approve" : "Reject"} Stock Request</DialogTitle>
            <DialogDescription>
              Request #{selectedRequest?.id?.substring(0, 8)} from {selectedRequest?.plant_id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any comments or instructions..."
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAction}
                className={actionType === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
              >
                Confirm {actionType === "approve" ? "Approval" : "Rejection"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedRequest(null)
                  setActionType(null)
                  setNotes("")
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
