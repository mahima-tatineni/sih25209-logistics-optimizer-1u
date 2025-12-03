"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Users, Database, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PortalNav } from "@/components/portal-nav"
import { RoleAlerts } from "@/components/alerts/RoleAlerts"
import { useRealtimeData } from "@/hooks/useRealtimeData"

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const { stocks, shipments, loading } = useRealtimeData({ refreshInterval: 15000 })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "SystemAdmin") {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <PortalNav title="System Administration" portal="admin" />

      <div className="container mx-auto px-4 py-8">
        {/* Add role-specific alerts at the top for admin */}
        <div className="mb-6">
          <RoleAlerts role="admin" userId={user?.id} />
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-primary">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground mt-1">All roles online</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-primary">Data Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4M</div>
              <p className="text-xs text-muted-foreground mt-1">Across all systems</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-primary">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge className="bg-green-600">99.9%</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-primary">Last Backup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Today</div>
              <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl bg-secondary/20">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">System Status</CardTitle>
                <CardDescription>Real-time monitoring dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <p className="font-semibold text-green-900">Database</p>
                    </div>
                    <p className="text-sm text-green-700">Connected and responding</p>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <p className="font-semibold text-green-900">API Server</p>
                    </div>
                    <p className="text-sm text-green-700">All endpoints operational</p>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <p className="font-semibold text-green-900">Analytics</p>
                    </div>
                    <p className="text-sm text-green-700">Collecting metrics normally</p>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <p className="font-semibold text-green-900">Notifications</p>
                    </div>
                    <p className="text-sm text-green-700">Service running smoothly</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-primary flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      Active Alerts
                    </CardTitle>
                    <CardDescription>Current system alerts and warnings</CardDescription>
                  </div>
                  <Button className="bg-accent hover:bg-accent/90">Add User</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="font-semibold text-amber-900">High Memory Usage on API-3</p>
                    <p className="text-sm text-amber-700 mt-1">Memory at 85%. Monitor for next 24 hours.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-primary flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Management
                    </CardTitle>
                    <CardDescription>Manage system users and roles</CardDescription>
                  </div>
                  <Button className="bg-accent hover:bg-accent/90">Add User</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-primary/10">
                        <th className="text-left py-3 px-4 font-semibold">Email</th>
                        <th className="text-left py-3 px-4 font-semibold">Role</th>
                        <th className="text-left py-3 px-4 font-semibold">Location</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { email: "plant.bhilai@sail.in", role: "Plant Admin", location: "Bhilai", status: "Active" },
                        { email: "port.vizag@sail.in", role: "Port Admin", location: "Vizag", status: "Active" },
                        { email: "procurement@sail.in", role: "Procurement Admin", location: "HQ", status: "Active" },
                        { email: "logistics@sail.in", role: "Logistics Team", location: "HQ", status: "Active" },
                        { email: "railway@sail.in", role: "Railway Admin", location: "Railway", status: "Active" },
                      ].map((user, idx) => (
                        <tr key={idx} className="border-b border-primary/5 hover:bg-primary/5">
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4 font-medium text-primary">{user.role}</td>
                          <td className="py-3 px-4">{user.location}</td>
                          <td className="py-3 px-4">
                            <Badge className="bg-green-600">{user.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Configuration
                </CardTitle>
                <CardDescription>Database and service configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <p className="font-semibold mb-2">Database Configuration</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Host: supabase.postgres.database.azure.com</p>
                    <p>Port: 5432</p>
                    <p>Backup Strategy: Daily automated backups</p>
                    <p>Replication: Multi-region active-passive</p>
                  </div>
                </div>

                <div className="p-4 bg-secondary/30 rounded-lg">
                  <p className="font-semibold mb-2">API Configuration</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Version: 1.0.0</p>
                    <p>Rate Limit: 1000 requests/minute</p>
                    <p>Authentication: JWT tokens</p>
                    <p>Cache Duration: 5 minutes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">System Logs</CardTitle>
                <CardDescription>Recent system activity and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {[
                    { time: "14:32:15", level: "INFO", message: "User logistics@sail.in logged in" },
                    { time: "14:25:42", level: "INFO", message: "Optimization run completed (15 schedules optimized)" },
                    { time: "14:15:08", level: "INFO", message: "Stock snapshot updated for all locations" },
                    { time: "14:10:33", level: "WARNING", message: "API response time > 2s for /schedules endpoint" },
                    { time: "14:05:19", level: "INFO", message: "Vessel tracking updated (8 vessels in transit)" },
                    { time: "13:55:47", level: "INFO", message: "User plant.bhilai@sail.in submitted stock request" },
                  ].map((log, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-secondary/30 rounded text-sm">
                      <span className="text-muted-foreground min-w-fit">{log.time}</span>
                      <Badge variant={log.level === "WARNING" ? "destructive" : "default"}>{log.level}</Badge>
                      <span className="flex-1">{log.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
