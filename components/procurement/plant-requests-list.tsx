"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2, XCircle, Ship } from "lucide-react"
import { ScheduleCreationForm } from "./schedule-creation-form"

export function PlantRequestsList() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [actionType, setActionType] = useState<"approve" | "reject" | "schedule" | null>(null)
  const [notes, setNotes] = useState("")
  const [showScheduleForm, setShowScheduleForm] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/stock-requests")
      const data = await response.json()
      console.log("[v0] Fetched requests:", data)
      setRequests(data.data || [])
    } catch (error) {
      console.error("[v0] Error fetching requests:", error)
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async () => {
    if (!selectedRequest || !actionType) return

    try {
      const newStatus = actionType === "approve" ? "APPROVED" : "REJECTED"
      const response = await fetch(`/api/stock-requests/${selectedRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          procurement_notes: notes,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update request")
      }

      const result = await response.json()
      console.log("[v0] Request updated:", result)

      // Show success message
      alert(`Request ${actionType === "approve" ? "approved" : "rejected"} successfully!`)

      await fetchRequests()
      setSelectedRequest(null)
      setActionType(null)
      setNotes("")
    } catch (error) {
      console.error("[v0] Error updating request:", error)
      alert(error instanceof Error ? error.message : "Failed to update request. Please try again.")
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
                      <td className="py-3 px-4 font-medium">{req.plants?.code || req.plant_id}</td>
                      <td className="py-3 px-4 text-foreground/70 capitalize">
                        {req.material?.replace("_", " ") || req.material_type?.replace("_", " ")}
                      </td>
                      <td className="py-3 px-4 font-semibold">{(req.quantity_t || req.quantity_requested)?.toLocaleString()}t</td>
                      <td className="py-3 px-4 text-foreground">{req.required_by_date}</td>
                      <td className="py-3 px-4 text-foreground/70">{req.current_days_cover || "N/A"}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            req.priority?.toLowerCase() === "critical"
                              ? "destructive"
                              : req.priority?.toLowerCase() === "high"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {req.priority?.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={req.status?.toLowerCase() === "pending" ? "secondary" : "default"}>
                          {req.status?.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => {
                            setSelectedRequest(req)
                            setShowScheduleForm(true)
                          }}
                          title="Create Schedule"
                        >
                          <Ship className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600"
                          onClick={() => {
                            setSelectedRequest(req)
                            setActionType("approve")
                          }}
                          title="Approve"
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
                          title="Reject"
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

      {/* Schedule Creation Form */}
      <ScheduleCreationForm
        request={selectedRequest}
        open={showScheduleForm}
        onClose={() => {
          setShowScheduleForm(false)
          setSelectedRequest(null)
        }}
        onSuccess={() => {
          fetchRequests()
        }}
      />

      {/* Approve/Reject Dialog */}
      <Dialog
        open={selectedRequest !== null && !showScheduleForm}
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
