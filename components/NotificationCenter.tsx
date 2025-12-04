"use client"

import { useNotifications } from "@/lib/notifications"
import { useAuth } from "@/lib/auth"
import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react"

export function NotificationCenter() {
  const { notifications, removeNotification } = useNotifications()
  const { isAuthenticated } = useAuth()

  // Only show notifications when user is logged in
  if (!isAuthenticated) {
    return null
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${getBgColor(notification.type)} animate-in slide-in-from-top-2 duration-300`}
        >
          <div className="flex-shrink-0">{getIcon(notification.type)}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-900">{notification.title}</h3>
            <p className="text-sm text-gray-700 mt-1">{notification.message}</p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  )
}
