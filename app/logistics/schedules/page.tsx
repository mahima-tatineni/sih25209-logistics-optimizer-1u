"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { PortalNav } from "@/components/portal-nav"
import { RoleAlerts } from "@/components/alerts/RoleAlerts"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Ship, Calendar, Package, History } from "lucide-react"
import type { ImportSchedule } from "@/lib/types"

export default function SchedulesInboxPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [schedules, setSchedules] = useState<ImportSchedule[]>([])
  const [filteredSchedules, setFilteredSchedules] = useState<ImportSchedule[]>([])
  const [historySchedules, setHistorySchedules] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<"active" | "history">("active")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "LogisticsTeam") {
      router.push("/login")
      return
    }
    fetchSchedules()
  }, [isAuthenticated, user, router])

  useEffect(() => {
    let filtered = schedules

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.schedule_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.vessel_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.target_plant_name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((s) => s.status === statusFilter)
    }

    setFilteredSchedules(filtered)
  }, [schedules, searchTerm, statusFilter])

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      // Fetch from procurement schedules API (where mock data is stored)
      const response = await fetch("/api/procurement/schedules")
      const data = await response.json()

      // Separate active schedules from history (returned/completed)
      const activeSchedules = (data.data || []).filter(
        (schedule: any) => schedule.status !== "RETURNED_TO_PROCUREMENT" && 
                          schedule.status !== "RETURNED" &&
                          schedule.status !== "DELIVERED" &&
                          schedule.status !== "COMPLETED"
      )

      const processedSchedules = (data.data || []).filter(
        (schedule: any) => schedule.status === "RETURNED_TO_PROCUREMENT" || 
                          schedule.status === "RETURNED" ||
                          schedule.status === "DELIVERED" ||
                          schedule.status === "COMPLETED"
      )

      const mappedSchedules: ImportSchedule[] = activeSchedules.map((schedule: any) => {
        // Map status to display status
        let displayStatus: ImportSchedule["status"] = "Pending Port Selection"
        if (schedule.status === "PORT_SELECTED") {
          displayStatus = "Port Selected"
        } else if (schedule.status === "IN_TRANSIT") {
          displayStatus = "In Transit"
        }

        return {
          id: schedule.id,
          schedule_id: schedule.schedule_code,
          material: schedule.material,
          quantity_t: schedule.quantity_t,
          vessel_id: schedule.vessel_id,
          vessel_name: schedule.vessel_name,
          load_port: schedule.load_port_code,
          load_port_name: schedule.load_port_code,
          sailing_date: schedule.sailing_date,
          required_by_date: schedule.required_by_date,
          target_plant: schedule.target_plant_code,
          target_plant_name: schedule.target_plant_code,
          status: displayStatus,
          selected_port: schedule.selected_port,
          selected_port_name: schedule.selected_port,
          created_at: schedule.created_at,
          from_procurement_user: "Procurement Team",
        }
      })

      setSchedules(mappedSchedules)
      setFilteredSchedules(mappedSchedules)
      setHistorySchedules(processedSchedules)
    } catch (error) {
      console.error("[v0] Failed to fetch schedules:", error)
      setSchedules([])
      setFilteredSchedules([])
      setHistorySchedules([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: ImportSchedule["status"]) => {
    switch (status) {
      case "Pending Port Selection":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Port Selected":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "In Transit":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleRowClick = (schedule: ImportSchedule) => {
    if (schedule.status === "Pending Port Selection") {
      router.push(`/logistics/port-selection/${schedule.id}`)
    } else if (schedule.status === "Port Selected" || schedule.status === "In Transit") {
      router.push(`/logistics/tracking/${schedule.id}`)
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <PortalNav title="Logistics Team Portal" portal="logistics" />

      <div className="container mx-auto px-4 py-8">
        {/* Add role-specific alerts at the top for logistics */}
        <div className="mb-6">
          <RoleAlerts role="logistics" userId={user?.id} />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Schedules Inbox</h1>
          <p className="text-muted-foreground">
            Import schedules received from Procurement awaiting port selection and optimization
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "active" | "history")} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="active">
              Active Schedules
              <Badge className="ml-2" variant="secondary">{schedules.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              History
              <Badge className="ml-2" variant="secondary">{historySchedules.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Schedule ID, Vessel, or Plant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="w-full md:w-64">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending Port Selection">Pending Port Selection</SelectItem>
                  <SelectItem value="Port Selected">Port Selected</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading schedules...</p>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="text-center py-12">
              <Ship className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Schedules Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No schedules from Procurement yet"}
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Schedule ID</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Vessel</TableHead>
                    <TableHead>Load Port</TableHead>
                    <TableHead>Sailing Date</TableHead>
                    <TableHead>Required By</TableHead>
                    <TableHead>Target Plant</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedules.map((schedule) => (
                    <TableRow
                      key={schedule.id}
                      onClick={() => handleRowClick(schedule)}
                      className="cursor-pointer hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-mono font-medium text-primary">{schedule.schedule_id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="capitalize">{schedule.material.replace("_", " ")}</span>
                        </div>
                      </TableCell>
                      <TableCell>{schedule.quantity_t.toLocaleString()} T</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Ship className="h-4 w-4 text-muted-foreground" />
                          {schedule.vessel_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{schedule.load_port}</div>
                          <div className="text-muted-foreground text-xs">{schedule.load_port_name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(schedule.sailing_date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(schedule.required_by_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{schedule.target_plant}</div>
                          <div className="text-muted-foreground text-xs">{schedule.target_plant_name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(schedule.status)}>
                          {schedule.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-2xl font-bold text-primary">{schedules.length}</div>
                <div className="text-sm text-muted-foreground">Total Active</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {schedules.filter((s) => s.status === "Pending Port Selection").length}
                </div>
                <div className="text-sm text-muted-foreground">Pending Port Selection</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {schedules.filter((s) => s.status === "Port Selected").length}
                </div>
                <div className="text-sm text-muted-foreground">Port Selected</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {schedules.filter((s) => s.status === "In Transit").length}
                </div>
                <div className="text-sm text-muted-foreground">In Transit</div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Processed Schedules</h2>
                <p className="text-sm text-muted-foreground">
                  History of completed, delivered, and returned schedules
                </p>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading history...</p>
                </div>
              ) : historySchedules.length === 0 ? (
                <div className="text-center py-12">
                  <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No History Yet</h3>
                  <p className="text-muted-foreground">
                    Processed schedules will appear here
                  </p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Schedule ID</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Vessel</TableHead>
                        <TableHead>Target Plant</TableHead>
                        <TableHead>Selected Port</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historySchedules.map((schedule) => (
                        <TableRow key={schedule.id} className="hover:bg-muted/30">
                          <TableCell className="font-mono font-medium text-primary">
                            {schedule.schedule_code}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span className="capitalize">{schedule.material?.replace("_", " ")}</span>
                            </div>
                          </TableCell>
                          <TableCell>{schedule.quantity_t?.toLocaleString()} T</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Ship className="h-4 w-4 text-muted-foreground" />
                              {schedule.vessel_name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{schedule.target_plant_code}</Badge>
                          </TableCell>
                          <TableCell>
                            {schedule.selected_port ? (
                              <Badge variant="secondary">{schedule.selected_port}</Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                schedule.status === "DELIVERED" || schedule.status === "COMPLETED" 
                                  ? "default" 
                                  : "destructive"
                              }
                              className={
                                schedule.status === "DELIVERED" || schedule.status === "COMPLETED"
                                  ? "bg-green-600"
                                  : "bg-red-600"
                              }
                            >
                              {schedule.status?.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {schedule.notes ? (
                              <div className="max-w-xs truncate text-sm text-muted-foreground" title={schedule.notes}>
                                {schedule.notes}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {historySchedules.filter((s) => s.status === "DELIVERED" || s.status === "COMPLETED").length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-red-600">
                  {historySchedules.filter((s) => s.status === "RETURNED_TO_PROCUREMENT" || s.status === "RETURNED").length}
                </div>
                <div className="text-sm text-muted-foreground">Returned to Procurement</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-primary">
                  {historySchedules.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Processed</div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
