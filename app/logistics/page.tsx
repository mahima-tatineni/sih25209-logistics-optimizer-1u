"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { PortalNav } from "@/components/portal-nav"

export default function LogisticsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "LogisticsTeam") {
      router.push("/login")
    } else {
      router.push("/logistics/schedules")
    }
  }, [isAuthenticated, user, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <PortalNav title="Logistics Team Portal" portal="logistics" />
      <div className="container mx-auto px-4 py-8">
        <p>Redirecting to Schedules Inbox...</p>
      </div>
    </div>
  )
}
