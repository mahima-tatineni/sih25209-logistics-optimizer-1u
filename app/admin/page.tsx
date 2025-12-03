"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Settings, Plus } from "lucide-react"

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <header className="bg-gradient-to-r from-primary to-[#224EA9] text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">System Administration</h1>
                <p className="text-sm text-white/80">Platform configuration and user management</p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => router.push("/")}>
              Home
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Active Users", value: "15", icon: "👥" },
            { label: "Data Records", value: "2.4M", icon: "📊" },
            { label: "System Health", value: "99.9%", icon: "✅" },
            { label: "Last Backup", value: "Today", icon: "💾" },
          ].map((stat, idx) => (
            <Card key={idx} className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl mb-2">{stat.icon}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 max-w-3xl">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-primary">User Management</CardTitle>
                    <CardDescription>Manage all system users and permissions</CardDescription>
                  </div>
                  <Button className="bg-accent hover:bg-accent/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { email: "plant.bhilai@sail.in", name: "Ravi Kumar", role: "PlantAdmin" },
                    { email: "port.vizag@sail.in", name: "Vikram Rao", role: "PortAdmin" },
                    { email: "procurement@sail.in", name: "Sanjay Gupta", role: "ProcurementAdmin" },
                    { email: "logistics@sail.in", name: "Rahul Verma", role: "LogisticsTeam" },
                    { email: "railway@sail.in", name: "Anil Kumar", role: "RailwayAdmin" },
                  ].map((user, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <p className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                        {user.role}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Role Configuration</CardTitle>
                <CardDescription>Define roles and their permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "PlantAdmin", users: 5, perms: 12 },
                    { name: "PortAdmin", users: 5, perms: 10 },
                    { name: "ProcurementAdmin", users: 1, perms: 8 },
                    { name: "LogisticsTeam", users: 1, perms: 9 },
                    { name: "RailwayAdmin", users: 1, perms: 7 },
                    { name: "SystemAdmin", users: 2, perms: 15 },
                  ].map((role, idx) => (
                    <div key={idx} className="p-4 bg-secondary/30 rounded-lg">
                      <p className="font-semibold text-primary">{role.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Users: {role.users} | Permissions: {role.perms}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Database Administration</CardTitle>
                <CardDescription>Backup, maintenance, and schema management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: "Full Database Backup", lastRun: "Today 02:00 AM", status: "Success" },
                    { action: "Index Optimization", lastRun: "Yesterday 01:00 AM", status: "Success" },
                    { action: "Data Archival", lastRun: "Last week", status: "Pending" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div>
                        <p className="font-semibold">{item.action}</p>
                        <p className="text-sm text-muted-foreground">Last run: {item.lastRun}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        {item.status}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">System Reports</CardTitle>
                <CardDescription>Generate analytics and performance reports</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">Report generation will be implemented here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
