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
import { Search, Filter, Ship, Calendar, Package } from "lucide-react"
import type { ImportSchedule } from "@/lib/types"

export default function SchedulesInboxPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [schedules, setSchedules] = useState<ImportSchedule[]>([])
  const [filteredSchedules, setFilteredSchedules] = useState<ImportSchedule[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
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
      const response = await fetch("/api/schedules-full?status=draft,pending_optimization")
      const data = await response.json()

      const mappedSchedules: ImportSchedule[] = (data.data || []).map((schedule: any) => ({
        id: schedule.id,
        schedule_id: schedule.id.substring(0, 12),
        material: schedule.material_type,
        quantity_t: schedule.quantity,
        vessel_id: schedule.id,
        vessel_name: schedule.vessel_name,
        load_port: schedule.supplier_port_id,
        load_port_name: schedule.supplier_port_name || schedule.supplier_port_id,
        sailing_date: schedule.laycan_start,
        required_by_date: schedule.laycan_end,
        target_plant: schedule.linked_requests?.[0]?.plant_id || "N/A",
        target_plant_name: schedule.linked_requests?.[0]?.plant_name || "Multiple Plants",
        status: schedule.optimized_port_id ? "Port Selected" : "Pending Port Selection",
        selected_port: schedule.optimized_port_id,
        selected_port_name: schedule.optimized_port_name,
        created_at: schedule.created_at,
        from_procurement_user: "Procurement Team",
      }))

      setSchedules(mappedSchedules)
      setFilteredSchedules(mappedSchedules)
    } catch (error) {
      console.error("[v0] Failed to fetch schedules:", error)
      // Fallback to mock data if API fails
      const mockSchedules: ImportSchedule[] = [
        {
          id: "IS001",
          schedule_id: "SCH-2025-001",
          material: "coking_coal",
          quantity_t: 75000,
          vessel_id: "V001",
          vessel_name: "MV Pacific Glory",
          load_port: "GLAD",
          load_port_name: "Gladstone, Australia",
          sailing_date: "2025-01-18",
          required_by_date: "2025-02-15",
          target_plant: "BSP",
          target_plant_name: "Bhilai Steel Plant",
          status: "Pending Port Selection",
          created_at: "2025-01-10",
          from_procurement_user: "Sanjay Gupta",
        },
      ]
      setSchedules(mockSchedules)
      setFilteredSchedules(mockSchedules)
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
            <div className="text-sm text-muted-foreground">Total Schedules</div>
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
      </div>
    </div>
  )
}
