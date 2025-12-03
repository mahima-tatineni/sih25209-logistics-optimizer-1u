"use client"

import { useEffect, useState } from "react"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface Alert {
  id: string
  type: "warning" | "critical" | "info"
  title: string
  message: string
  details?: string
  timestamp: Date
}

interface RoleAlertsProps {
  role: "plant" | "procurement" | "logistics" | "port" | "railway" | "admin"
  userId?: string
  plantId?: string
}

export function RoleAlerts({ role, userId, plantId }: RoleAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 30000)
    return () => clearInterval(interval)
  }, [role, userId, plantId])

  const fetchAlerts = async () => {
    try {
      const params = new URLSearchParams()
      if (plantId) params.append("plantId", plantId)
      if (userId) params.append("userId", userId)
      params.append("role", role)

      const response = await fetch(`/api/alerts?${params}`)
      if (response.ok) {
        const data = await response.json()
        setAlerts(data.alerts || [])
      } else {
        setAlerts(getMockAlerts(role, plantId))
      }
    } catch (error) {
      console.error("[v0] Error fetching alerts:", error)
      setAlerts(getMockAlerts(role, plantId))
    } finally {
      setLoading(false)
    }
  }

  const getMockAlerts = (role: string, plantId?: string): Alert[] => {
    const now = new Date()

    switch (role) {
      case "plant":
        return [
          {
            id: "alert-1",
            type: "warning",
            title: "Low Stock Warning",
            message: `${plantId || "RSP"}: coking_coal at 13.0 days cover`,
            details: "Below minimum threshold of 15 days. Request replenishment urgently.",
            timestamp: now,
          },
        ]

      case "procurement":
        return [
          {
            id: "alert-2",
            type: "critical",
            title: "Urgent Stock Request",
            message: "BSP requires 50,000t coking coal - Priority: URGENT",
            details: "Current stock: 8 days cover. Target: 30 days.",
            timestamp: now,
          },
          {
            id: "alert-3",
            type: "info",
            title: "Schedule Created",
            message: "New vessel schedule created for Gladstone to Vizag",
            details: "Vessel: Cape Mercury, Qty: 75,000t, ETA: Jan 15",
            timestamp: now,
          },
        ]

      case "logistics":
        return [
          {
            id: "alert-4",
            type: "info",
            title: "New Schedule for Optimization",
            message: "3 new schedules pending port selection",
            details: "Total quantity: 185,000t coking coal from Australia",
            timestamp: now,
          },
          {
            id: "alert-5",
            type: "warning",
            title: "Port Congestion Alert",
            message: "Vizag port congestion at 85% capacity",
            details: "Consider alternative discharge ports",
            timestamp: now,
          },
        ]

      case "port":
        return [
          {
            id: "alert-6",
            type: "info",
            title: "Vessel Arrival",
            message: "Cape Mercury arriving tomorrow",
            details: "75,000t coking coal for discharge",
            timestamp: now,
          },
        ]

      case "railway":
        return [
          {
            id: "alert-7",
            type: "warning",
            title: "High Rake Demand",
            message: "15 rakes required for next 3 days",
            details: "Current available: 12 rakes",
            timestamp: now,
          },
        ]

      case "admin":
        return [
          {
            id: "alert-8",
            type: "info",
            title: "System Health",
            message: "All systems operational",
            details: "5 active schedules, 12 pending requests",
            timestamp: now,
          },
        ]

      default:
        return []
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  const getTextColor = (type: string) => {
    switch (type) {
      case "critical":
        return "text-red-900"
      case "warning":
        return "text-yellow-900"
      default:
        return "text-blue-900"
    }
  }

  if (loading) {
    return (
      <Card className="p-4 border-2 border-primary/20">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    )
  }

  if (alerts.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Card key={alert.id} className={`p-4 border-2 ${getBgColor(alert.type)} transition-all hover:shadow-md`}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">{getIcon(alert.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`font-semibold text-sm ${getTextColor(alert.type)}`}>{alert.title}</h3>
                <Badge variant={alert.type === "critical" ? "destructive" : "secondary"} className="flex-shrink-0">
                  {alert.type}
                </Badge>
              </div>
              <p className={`text-sm mt-1 ${getTextColor(alert.type)}`}>{alert.message}</p>
              {alert.details && <p className="text-xs text-gray-600 mt-2 italic">{alert.details}</p>}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
