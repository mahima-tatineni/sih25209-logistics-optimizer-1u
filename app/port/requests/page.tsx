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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Ship, History, CheckCircle, XCircle } from "lucide-react"

export default function PortRequestsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [portCode, setPortCode] = useState("")
  const [portName, setPortName] = useState("")
  const [requests, setRequests] = useState<any[]>([])
  const [historyRequests, setHistoryRequests] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending")
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    status: "REQUESTED",
    confirmed_window_start: "",
    confirmed_window_end: "",
    comment: "",
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "PortAdmin") {
      router.push("/login")
      return
    }
    
    const email = user?.email || ""
    const match = email.match(/port\.(\w+)@/)
    if (match) {
      const emailPort = match[1].toLowerCase()
      // Map email subdomain to actual port code and name
      const portCodeMap: Record<string, string> = {
        'vizag': 'VIZAG',
        'paradip': 'PARA',
        'dhamra': 'DHAM',
        'haldia': 'HALD',
        'kolkata': 'KOLK',
      }
      const portNameMap: Record<string, string> = {
        'vizag': 'Visakhapatnam',
        'paradip': 'Paradip',
        'dhamra': 'Dhamra',
        'haldia': 'Haldia',
        'kolkata': 'Kolkata',
      }
      const code = portCodeMap[emailPort] || emailPort.toUpperCase()
      const name = portNameMap[emailPort] || emailPort
      setPortCode(code)
      setPortName(name)
      fetchRequests(code)
    }
  }, [isAuthenticated, user, router])

  const fetchRequests = async (code: string) => {
    try {
      const response = await fetch(`/api/port/requests?port_code=${code}`)
      const data = await response.json()
      
      // Separate pending requests from processed/closed ones
      const allRequests = data.data || []
      const pendingRequests = allRequests.filter((r: any) => 
        r.status === "REQUESTED" || r.status === "WINDOW_ADJUSTED"
      )
      const processedRequests = allRequests.filter((r: any) => 
        r.status === "CONFIRMED" || r.status === "REJECTED" || r.status === "CLOSED"
      )
      
      setRequests(pendingRequests)
      setHistoryRequests(processedRequests)
    } catch (error) {
      console.error("[Port] Failed to fetch requests:", error)
    }
  }

  const handleRowClick = (request: any) => {
    setSelectedRequest(request)
    setFormData({
      status: request.status,
      confirmed_window_start: request.confirmed_window_start || "",
      confirmed_window_end: request.confirmed_window_end || "",
      comment: request.comment || "",
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!selectedRequest) return

    try {
      const response = await fetch(`/api/port/requests/${selectedRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update request")

      alert("Request updated successfully!")
      setDialogOpen(false)
      fetchRequests(portCode)
    } catch (error) {
      console.error("[Port] Failed to update request:", error)
      alert("Failed to update request. Please try again.")
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      REQUESTED: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-green-100 text-green-800",
      WINDOW_ADJUSTED: "bg-blue-100 text-blue-800",
      REJECTED: "bg-red-100 text-red-800",
    }
    return <Badge className={colors[status as keyof typeof colors] || ""}>{status.replace("_", " ")}</Badge>
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <PortalNav title={`${portName} Port Portal`} portal="port" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">{portName} Vessel Schedule Requests</h1>
          <p className="text-muted-foreground">
            Review and confirm berth windows for incoming SAIL vessels
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "pending" | "history")} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="pending">
              Pending Requests
              <Badge className="ml-2" variant="secondary">{requests.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              History
              <Badge className="ml-2" variant="secondary">{historyRequests.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {requests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Ship className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
                  <p className="text-muted-foreground">All vessel requests have been processed</p>
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
                            <p className="text-sm text-muted-foreground">Vessel</p>
                            <p className="font-semibold">{request.vessel_name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Material & Quantity</p>
                            <p className="font-semibold">{request.material?.replace("_", " ")} · {request.quantity_t?.toLocaleString()}T</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">ETA</p>
                            <p className="font-semibold">{new Date(request.eta_port).toLocaleDateString()}</p>
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
          </TabsContent>

          <TabsContent value="history">
            {historyRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No History Yet</h3>
                  <p className="text-muted-foreground">Processed vessel requests will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold mb-2">Processed Requests</h2>
                      <p className="text-sm text-muted-foreground">
                        History of confirmed, rejected, and closed vessel requests
                      </p>
                    </div>
                    <div className="space-y-4">
                      {historyRequests.map((request) => (
                        <div
                          key={request.id}
                          onClick={() => handleRowClick(request)}
                          className="p-4 border rounded-lg hover:bg-muted/30 cursor-pointer transition"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Schedule</p>
                              <p className="font-semibold">{request.schedule_id?.substring(0, 15)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Vessel</p>
                              <p className="font-semibold">{request.vessel_name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Material & Quantity</p>
                              <p className="font-semibold">{request.material?.replace("_", " ")} · {request.quantity_t?.toLocaleString()}T</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">ETA</p>
                              <p className="font-semibold">{new Date(request.eta_port).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Status</p>
                              {getStatusBadge(request.status)}
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Confirmed Window</p>
                              {request.confirmed_window_start && request.confirmed_window_end ? (
                                <p className="text-sm font-medium">
                                  {new Date(request.confirmed_window_start).toLocaleDateString()} - {new Date(request.confirmed_window_end).toLocaleDateString()}
                                </p>
                              ) : (
                                <p className="text-sm text-muted-foreground">N/A</p>
                              )}
                            </div>
                          </div>
                          {request.comment && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-xs text-muted-foreground mb-1">Comment:</p>
                              <p className="text-sm">{request.comment}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {historyRequests.filter((r) => r.status === "CONFIRMED").length}
                        </div>
                        <div className="text-sm text-muted-foreground">Confirmed</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-8 w-8 text-red-600" />
                      <div>
                        <div className="text-2xl font-bold text-red-600">
                          {historyRequests.filter((r) => r.status === "REJECTED").length}
                        </div>
                        <div className="text-sm text-muted-foreground">Rejected</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <Ship className="h-8 w-8 text-primary" />
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {historyRequests.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Processed</div>
                      </div>
                    </div>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Vessel Request Details</DialogTitle>
            </DialogHeader>

            {selectedRequest && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Vessel Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Schedule ID</p>
                      <p className="font-semibold">{selectedRequest.schedule_id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Vessel</p>
                      <p className="font-semibold">{selectedRequest.vessel_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Material</p>
                      <p className="font-semibold">{selectedRequest.material?.replace("_", " ")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quantity</p>
                      <p className="font-semibold">{selectedRequest.quantity_t?.toLocaleString()} T</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ETA</p>
                      <p className="font-semibold">{new Date(selectedRequest.eta_port).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Laydays End</p>
                      <p className="font-semibold">{new Date(selectedRequest.laydays_end).toLocaleDateString()}</p>
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
                        <SelectItem value="WINDOW_ADJUSTED">Window Adjusted</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="window_start">Confirmed Window Start</Label>
                      <Input
                        id="window_start"
                        type="date"
                        value={formData.confirmed_window_start}
                        onChange={(e) => setFormData({...formData, confirmed_window_start: e.target.value})}
                        title="Confirmed berth + stockyard window start during which vessel can discharge without extra waiting"
                      />
                    </div>
                    <div>
                      <Label htmlFor="window_end">Confirmed Window End</Label>
                      <Input
                        id="window_end"
                        type="date"
                        value={formData.confirmed_window_end}
                        onChange={(e) => setFormData({...formData, confirmed_window_end: e.target.value})}
                        title="Confirmed berth + stockyard window end during which vessel can discharge without extra waiting"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="comment">Comments</Label>
                    <Textarea
                      id="comment"
                      value={formData.comment}
                      onChange={(e) => setFormData({...formData, comment: e.target.value})}
                      placeholder="Add any notes about berth availability, congestion, or constraints..."
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
