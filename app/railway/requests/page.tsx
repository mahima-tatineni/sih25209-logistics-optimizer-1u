"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { PortalNav } from "@/components/portal-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function RailwayRequestsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [requests, setRequests] = useState<any[]>([])
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    status: "REQUESTED",
    confirmed_start: "",
    confirmed_end: "",
    comment: "",
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "RailwayAdmin") {
      router.push("/login")
      return
    }
    fetchRequests()
  }, [isAuthenticated, user, router])

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/railway/requests")
      const data = await response.json()
      setRequests(data.data?.filter((r: any) => r.status !== "CLOSED") || [])
    } catch (error) {
      console.error("[Railway] Failed to fetch requests:", error)
    }
  }

  const handleRowClick = (request: any) => {
    setSelectedRequest(request)
    setFormData({
      status: request.status,
      confirmed_start: request.confirmed_start || "",
      confirmed_end: request.confirmed_end || "",
      comment: request.comment || "",
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!selectedRequest) return

    try {
      const response = await fetch(`/api/railway/requests/${selectedRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update request")

      alert("Request updated successfully!")
      setDialogOpen(false)
      fetchRequests()
    } catch (error) {
      console.error("[Railway] Failed to update request:", error)
      alert("Failed to update request. Please try again.")
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      REQUESTED: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-green-100 text-green-800",
      PARTIAL: "bg-orange-100 text-orange-800",
      REJECTED: "bg-red-100 text-red-800",
    }
    return <Badge className={colors[status as keyof typeof colors] || ""}>{status}</Badge>
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <PortalNav title="Railway Portal" portal="railway" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Schedule Requests</h1>
          <p className="text-muted-foreground">
            Review and confirm rake allocation requests from Logistics
          </p>
        </div>

        {requests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
              <p className="text-muted-foreground">All requests have been processed</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    onClick={() => handleRowClick(request)}
                    className="p-4 border rounded-lg hover:bg-muted/30 cursor-pointer transition"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Schedule</p>
                        <p className="font-semibold">{request.schedule_id?.substring(0, 15)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Route</p>
                        <p className="font-semibold">{request.port_code} → {request.plant_code}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Required Rakes</p>
                        <p className="font-semibold">{request.required_rakes}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Window</p>
                        <p className="font-semibold text-sm">
                          {new Date(request.required_window_start).toLocaleDateString()} - {new Date(request.required_window_end).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Railway Request Details</DialogTitle>
            </DialogHeader>

            {selectedRequest && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Schedule Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Schedule ID</p>
                      <p className="font-semibold">{selectedRequest.schedule_id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Route</p>
                      <p className="font-semibold">{selectedRequest.port_code} → {selectedRequest.plant_code}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Required Rakes</p>
                      <p className="font-semibold">{selectedRequest.required_rakes}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Required Window</p>
                      <p className="font-semibold">
                        {new Date(selectedRequest.required_window_start).toLocaleDateString()} - {new Date(selectedRequest.required_window_end).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="REQUESTED">Requested</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="PARTIAL">Partial</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="confirmed_start">Confirmed Start Date</Label>
                      <Input
                        id="confirmed_start"
                        type="date"
                        value={formData.confirmed_start}
                        onChange={(e) => setFormData({...formData, confirmed_start: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmed_end">Confirmed End Date</Label>
                      <Input
                        id="confirmed_end"
                        type="date"
                        value={formData.confirmed_end}
                        onChange={(e) => setFormData({...formData, confirmed_end: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="comment">Comments</Label>
                    <Textarea
                      id="comment"
                      value={formData.comment}
                      onChange={(e) => setFormData({...formData, comment: e.target.value})}
                      placeholder="Add any notes or constraints..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
