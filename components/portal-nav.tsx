"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { getHomeRouteForUser } from "@/lib/role-routing"
import { LogOut, Home } from "lucide-react"

interface PortalNavProps {
  title: string
  portal: "plant" | "procurement" | "logistics" | "port" | "railway" | "admin"
}

export function PortalNav({ title, portal }: PortalNavProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const portalLinks: Record<string, Array<{ label: string; href: string }>> = {
    plant: [
      { label: "Dashboard", href: "/plant-portal" },
      { label: "Plant Console", href: "/plant-console" },
    ],
    procurement: [
      { label: "Dashboard", href: "/procurement" },
      { label: "Vessel Planning", href: "/procurement?tab=vessels" },
    ],
    logistics: [
      { label: "Home", href: "/logistics" },
      { label: "Schedules", href: "/logistics/schedules" },
      { label: "Tracking", href: "/logistics/tracking-dashboard" },
    ],
    port: [
      { label: "Home", href: "/port" },
      { label: "Daily Capacity", href: "/port/capacity" },
      { label: "Vessel Requests", href: "/port/requests" },
    ],
    railway: [
      { label: "Home", href: "/railway" },
      { label: "Daily Capacity", href: "/railway/capacity" },
      { label: "Schedule Requests", href: "/railway/requests" },
      { label: "History", href: "/railway/history" },
    ],
    admin: [{ label: "Dashboard", href: "/admin" }],
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const homeRoute = getHomeRouteForUser(user)
    router.push(homeRoute)
  }

  return (
    <nav className="sticky top-0 z-40 bg-gradient-to-r from-primary to-[#224EA9] text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="#" onClick={handleHomeClick} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Home className="h-5 w-5" />
              <span className="text-sm font-medium">Home</span>
            </a>

            {portalLinks[portal]?.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent pb-1"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm">{title}</span>
            <Button onClick={handleLogout} variant="ghost" className="text-white hover:bg-white/20" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
