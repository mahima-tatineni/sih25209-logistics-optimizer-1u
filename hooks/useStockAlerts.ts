import { useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { useNotifications } from "@/lib/notifications"

export function useStockAlerts(plantId?: string) {
  const { user, isAuthenticated } = useAuth()
  const { addNotification } = useNotifications()

  useEffect(() => {
    // Only check for plant users who are logged in
    if (!isAuthenticated || user?.role !== "PlantAdmin") {
      return
    }

    const effectivePlantId = plantId || user?.plant_id
    if (!effectivePlantId) return

    // Check stock levels
    const checkStockLevels = async () => {
      try {
        const response = await fetch(`/api/plant/${effectivePlantId}/stock`)
        if (!response.ok) return

        const data = await response.json()
        const { stock } = data

        // Check coking coal
        if (stock.coking_coal.days_cover < 15) {
          addNotification({
            type: "warning",
            title: "Low Stock Alert",
            message: `Coking coal at ${stock.coking_coal.days_cover} days cover. Below minimum threshold of 15 days.`,
            duration: 0, // Don't auto-dismiss
          })
        }

        // Check limestone
        if (stock.limestone.days_cover < 15) {
          addNotification({
            type: "warning",
            title: "Low Stock Alert",
            message: `Limestone at ${stock.limestone.days_cover} days cover. Below minimum threshold of 15 days.`,
            duration: 0, // Don't auto-dismiss
          })
        }
      } catch (error) {
        console.error("[v0] Error checking stock levels:", error)
      }
    }

    // Check immediately on mount
    checkStockLevels()

    // Check every 5 minutes
    const interval = setInterval(checkStockLevels, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [isAuthenticated, user, plantId, addNotification])
}
