import type { User } from "./types"

export const ROLE_PORTALS: Record<User["role"], string> = {
  PlantAdmin: "/plant-portal",
  ProcurementAdmin: "/procurement",
  LogisticsTeam: "/logistics",
  PortAdmin: "/port",
  RailwayAdmin: "/railway",
  SystemAdmin: "/admin",
  Guest: "/",
}

export function getDefaultPortalForRole(role: User["role"], user?: User): string {
  // For plant users, route to plant-specific page
  if (role === "PlantAdmin" && user?.plant_id) {
    return `/plant/${user.plant_id}`
  }
  
  // For port users, route to port home (port code extracted from email in the page)
  if (role === "PortAdmin") {
    return "/port"
  }
  
  return ROLE_PORTALS[role] || "/"
}

export function getHomeRouteForUser(user: User | null): string {
  if (!user) return "/"
  
  // Plant users go to their specific plant page
  if (user.role === "PlantAdmin" && user.plant_id) {
    return `/plant/${user.plant_id}`
  }
  
  // Port users go to port home (port code extracted from email in the page)
  if (user.role === "PortAdmin") {
    return "/port"
  }
  
  // Procurement goes to dashboard
  if (user.role === "ProcurementAdmin") {
    return "/procurement"
  }
  
  // Logistics goes to schedules
  if (user.role === "LogisticsTeam") {
    return "/logistics"
  }
  
  // Railway goes to railway dashboard
  if (user.role === "RailwayAdmin") {
    return "/railway"
  }
  
  // Admin goes to admin dashboard
  if (user.role === "SystemAdmin") {
    return "/admin"
  }
  
  return "/"
}

export function canAccessPortal(userRole: User["role"], portalPath: string): boolean {
  // SystemAdmin can access everything
  if (userRole === "SystemAdmin") return true

  // Check if user's role portal matches the path
  const allowedPortal = ROLE_PORTALS[userRole]
  return portalPath.startsWith(allowedPortal)
}
