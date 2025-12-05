"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Eye, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export function SchedulesList() {
  const router = useRouter()
  const [schedules, setSchedules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("draft")

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      // Fetch from procurement schedules API (where mock data is stored)
      const response = await fetch("/api/procurement/schedules")
      const data = await response.json()
      setSchedules(data.data || [])
    } catch (error) {
      console.error("[v0] Failed to fetch schedules:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendToLogistics = async (scheduleId: string) => {
    try {
      await fetch(`/api/procurement/schedules/${scheduleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SENT_TO_LOGISTICS" }),
      })
      fetchSchedules()
    } catch (error) {
      console.error("[v0] Failed to send schedule to logistics:", error)
    }
  }

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm("Are you sure you want to delete this draft schedule? This action cannot be undone.")) return

    try {
      await fetch(`/api/procurement/schedules/${scheduleId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
      fetchSchedules()
      alert("Schedule deleted successfully")
    } catch (error) {
      console.error("[v0] Failed to delete schedule:", error)
      alert("Failed to delete schedule")
    }
  }

  const handleConfirmSchedule = async (scheduleId: string) => {
    if (!confirm("Confirm this optimized schedule? This will notify all relevant teams.")) return

    try {
      await fetch(`/api/schedules-full/${scheduleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Confirmed", confirmed_by: "Procurement Admin" }),
      })
      fetchSchedules()
      alert("Schedule confirmed successfully!")
    } catch (error) {
      console.error("[v0] Failed to confirm schedule:", error)
      alert("Failed to confirm schedule")
    }
  }

  const draftSchedules = schedules.filter((s) => s.status === "draft" || s.status === "NEW")
  const pendingSchedules = schedules.filter((s) => s.status === "SENT_TO_LOGISTICS")
  const returnedSchedules = schedules.filter((s) => s.status === "RETURNED" || s.status === "RETURNED_TO_PROCUREMENT")
  const optimizedSchedules = schedules.filter((s) => s.status === "PORT_SELECTED")
  const confirmedSchedules = schedules.filter((s) => s.status === "Confirmed" || s.status === "IN_TRANSIT" || s.status === "DELIVERED")

  const renderScheduleCard = (sch: any, showActions: "send" | "confirm" | "view" | "draft") => (
    <Card key={sch.id} className="border-2 border-primary/20">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Schedule ID</p>
            <p className="font-bold text-primary">{sch.id.substring(0, 12)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Vessel</p>
            <p className="font-bold">{sch.vessel_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Material & Quantity</p>
            <p className="font-bold">
              {sch.material_type} · {sch.quantity?.toLocaleString()}t
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Laycan</p>
            <p className="font-bold text-primary">
              {new Date(sch.laycan_start).toLocaleDateString()} - {new Date(sch.laycan_end).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Supplier Port</p>
            <Badge variant="secondary">{sch.supplier_port_id}</Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Discharge Port</p>
            {sch.optimized_port_id ? (
              <Badge variant="default">{sch.optimized_port_id}</Badge>
            ) : (
              <span className="text-sm text-muted-foreground">Pending Selection</span>
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Linked Requests</p>
            <div className="flex flex-wrap gap-1">
              {sch.linked_requests?.map((req: any) => (
                <Badge key={req.request_id} variant="outline">
                  {req.plant_id}
                </Badge>
              )) || <span className="text-sm text-muted-foreground">None</span>}
            </div>
          </div>
        </div>

        {sch.cost_estimate_inr && (
          <div className="mb-4 p-3 bg-secondary/30 rounded-lg">
            <p className="text-xs text-muted-foreground">Total Estimated Cost</p>
            <p className="text-lg font-bold text-primary">₹{sch.cost_estimate_inr?.toLocaleString()}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Badge variant={sch.status === "Confirmed" ? "default" : "secondary"}>{sch.status}</Badge>
          <div className="flex gap-2">
            {showActions === "draft" && (
              <>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteSchedule(sch.id)}
                >
                  Delete
                </Button>
                <Button className="bg-accent hover:bg-accent/90" size="sm" onClick={() => handleSendToLogistics(sch.id)}>
                  Send to Logistics
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </>
            )}
            {showActions === "send" && (
              <Button className="bg-accent hover:bg-accent/90" size="sm" onClick={() => handleSendToLogistics(sch.id)}>
                Send to Logistics
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            {showActions === "confirm" && (
              <>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                  onClick={() => handleConfirmSchedule(sch.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Final
                </Button>
              </>
            )}
            {showActions === "view" && (
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Track Progress
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading schedules...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-5 max-w-4xl bg-secondary/20">
        <TabsTrigger value="draft">
          Draft <Badge className="ml-2">{draftSchedules.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="pending">
          Sent to Logistics <Badge className="ml-2">{pendingSchedules.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="returned">
          Returned <Badge className="ml-2 bg-red-500">{returnedSchedules.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="optimized">
          Optimized <Badge className="ml-2">{optimizedSchedules.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="confirmed">
          Confirmed <Badge className="ml-2">{confirmedSchedules.length}</Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="draft" className="space-y-3">
        <Card className="border-2 border-primary/20 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-sm">Draft Schedules</CardTitle>
            <CardDescription>Schedules created but not yet sent to Logistics for optimization</CardDescription>
          </CardHeader>
        </Card>
        {draftSchedules.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">No draft schedules</CardContent>
          </Card>
        ) : (
          draftSchedules.map((sch) => renderScheduleCard(sch, "draft"))
        )}
      </TabsContent>

      <TabsContent value="pending" className="space-y-3">
        <Card className="border-2 border-primary/20 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-sm">Sent to Logistics</CardTitle>
            <CardDescription>Schedules awaiting port selection and route optimization</CardDescription>
          </CardHeader>
        </Card>
        {pendingSchedules.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">No pending schedules</CardContent>
          </Card>
        ) : (
          pendingSchedules.map((sch) => renderScheduleCard(sch, "view"))
        )}
      </TabsContent>

      <TabsContent value="returned" className="space-y-3">
        <Card className="border-2 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-sm text-red-700">Returned by Logistics</CardTitle>
            <CardDescription>Schedules rejected by logistics team - review and revise before resubmitting</CardDescription>
          </CardHeader>
        </Card>
        {returnedSchedules.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">No returned schedules</CardContent>
          </Card>
        ) : (
          returnedSchedules.map((sch) => (
            <Card key={sch.id} className="border-2 border-red-200">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Schedule Code</p>
                    <p className="font-bold text-primary">{sch.schedule_code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Vessel</p>
                    <p className="font-bold">{sch.vessel_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Material & Quantity</p>
                    <p className="font-bold">
                      {sch.material?.replace("_", " ")} · {sch.quantity_t?.toLocaleString()}t
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Target Plant</p>
                    <p className="font-bold text-primary">{sch.target_plant_code}</p>
                  </div>
                </div>

                {sch.notes && (
                  <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg">
                    <p className="text-sm font-semibold text-red-800 mb-2">Rejection Reason:</p>
                    <p className="text-sm text-red-700">{sch.notes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Badge variant="destructive">RETURNED</Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleSendToLogistics(sch.id)}>
                      Revise & Resubmit
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>

      <TabsContent value="optimized" className="space-y-3">
        <Card className="border-2 border-primary/20 bg-green-50">
          <CardHeader>
            <CardTitle className="text-sm">Optimized by Logistics</CardTitle>
            <CardDescription>
              Schedules with finalized ports and routes - review and confirm to activate
            </CardDescription>
          </CardHeader>
        </Card>
        {optimizedSchedules.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">No optimized schedules</CardContent>
          </Card>
        ) : (
          optimizedSchedules.map((sch) => renderScheduleCard(sch, "confirm"))
        )}
      </TabsContent>

      <TabsContent value="confirmed" className="space-y-3">
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-sm">Confirmed Schedules</CardTitle>
            <CardDescription>Active schedules - visible to Railway, Ports, and Public dashboard</CardDescription>
          </CardHeader>
        </Card>
        {confirmedSchedules.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">No confirmed schedules</CardContent>
          </Card>
        ) : (
          confirmedSchedules.map((sch) => renderScheduleCard(sch, "view"))
        )}
      </TabsContent>
    </Tabs>
  )
}
