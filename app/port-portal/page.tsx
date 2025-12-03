"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Anchor, AlertTriangle } from "lucide-react"
import { PortVesselOperations } from "@/components/port/vessel-operations"
import { PortYardInventory } from "@/components/port/yard-inventory"
import { PortSchedules } from "@/components/port/schedules"

export default function PortPortalPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [portName] = useState("Visakhapatnam Port")
  const [activeTab, setActiveTab] = useState("operations")

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "PortAdmin") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <header className="bg-gradient-to-r from-primary to-[#224EA9] text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Anchor className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">{portName} Portal</h1>
                <p className="text-sm text-white/80">Deep-sea port operations and scheduling</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => router.push("/")}>
                Home
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  localStorage.removeItem("sail_user")
                  router.push("/login")
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Yard Utilization", value: "72%", icon: "📊" },
            { label: "Vessels Berthed", value: "3", icon: "⛴️" },
            { label: "At Anchorage", value: "2", icon: "⚓" },
            { label: "Congestion Level", value: "Moderate", icon: "⚠️" },
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 max-w-3xl bg-secondary/20">
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="vessels">Vessels</TabsTrigger>
            <TabsTrigger value="yard">Yard Stock</TabsTrigger>
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
          </TabsList>

          <TabsContent value="operations" className="space-y-4">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Daily Operations Summary</CardTitle>
                <CardDescription>Current berthing status and cargo movements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { vessel: "Cape Mercury", status: "Berthed", operation: "Discharging coal", progress: 65 },
                    { vessel: "Ocean Giant", status: "At Anchorage", operation: "Awaiting berth", progress: 0 },
                    { vessel: "New Dawn", status: "Arrived", operation: "Port entry processing", progress: 20 },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-secondary/30 rounded-lg border border-primary/10">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-primary">{item.vessel}</p>
                          <p className="text-sm text-muted-foreground">{item.operation}</p>
                        </div>
                        <Badge variant={item.status === "Berthed" ? "default" : "secondary"}>{item.status}</Badge>
                      </div>
                      {item.progress > 0 && (
                        <div className="w-full bg-primary/20 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Operational Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-3 bg-white rounded border border-amber-200">
                  <p className="text-sm text-amber-900">
                    <strong>Weather Alert:</strong> Slight swell expected tomorrow morning
                  </p>
                </div>
                <div className="p-3 bg-white rounded border border-amber-200">
                  <p className="text-sm text-amber-900">
                    <strong>Congestion:</strong> 2 vessels at anchorage, berth availability in 6 hours
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vessels">
            <PortVesselOperations />
          </TabsContent>

          <TabsContent value="yard">
            <PortYardInventory />
          </TabsContent>

          <TabsContent value="schedules">
            <PortSchedules />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
