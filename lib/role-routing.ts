import type { User } from "./types"

export const ROLE_PORTALS: Record<User["role"], string> = {
  PlantAdmin: "/plant-portal",
  ProcurementAdmin: "/procurement",
  LogisticsTeam: "/logistics",
  PortAdmin: "/port-portal",
  RailwayAdmin: "/railway",
  SystemAdmin: "/admin",
  Guest: "/",
}

export function getDefaultPortalForRole(role: User["role"]): string {
  return ROLE_PORTALS[role] || "/"
}

export function canAccessPortal(userRole: User["role"], portalPath: string): boolean {
  // SystemAdmin can access everything
  if (userRole === "SystemAdmin") return true

  // Check if user's role portal matches the path
  const allowedPortal = ROLE_PORTALS[userRole]
  return portalPath.startsWith(allowedPortal)
}
