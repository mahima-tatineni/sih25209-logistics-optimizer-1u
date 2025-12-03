"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Train } from "lucide-react"
import { RakeDispatchBoard } from "@/components/railway/dispatch-board"
import { RakePlanningForm } from "@/components/railway/rake-planning"
import { RakeTracking } from "@/components/railway/rake-tracking"

export default function RailwayPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dispatch")

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "RailwayAdmin") {
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
              <Train className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Railway Portal</h1>
                <p className="text-sm text-white/80">Rail rake allocation and tracking</p>
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
            { label: "Rakes Allocated", value: "24", icon: "🚂" },
            { label: "In Transit", value: "8", icon: "📍" },
            { label: "Capacity Used", value: "92%", icon: "📊" },
            { label: "Avg Transit Time", value: "2.1 days", icon: "⏱️" },
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
          <TabsList className="grid w-full grid-cols-3 max-w-2xl bg-secondary/20">
            <TabsTrigger value="dispatch">Dispatch Board</TabsTrigger>
            <TabsTrigger value="planning">Rake Planning</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="dispatch">
            <RakeDispatchBoard />
          </TabsContent>

          <TabsContent value="planning">
            <RakePlanningForm />
          </TabsContent>

          <TabsContent value="tracking">
            <RakeTracking />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
