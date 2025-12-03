"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import {
  Compass,
  Ship,
  Gauge,
  FileStack,
  Radar,
  Boxes,
  Train,
  MapPin,
  Factory,
  TrendingUp,
  Lightbulb,
  Waves,
  FileText,
  Database,
  Info,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/login") {
      router.push("/login")
    }
  }, [isAuthenticated, router, pathname])

  if (!isAuthenticated) {
    return null
  }

  // <CHANGE>Updated navigation to match 15 specified pages with marine/nautical theme
  const navigation = [
    { name: "Home", href: "/app/home", icon: Compass, desc: "Landing & Overview" },
    { name: "STEM / Voyage Planning", href: "/app/stem", icon: Ship, desc: "Shipments & Voyages" },
    { name: "Captain's Bridge", href: "/app/bridge", icon: Gauge, desc: "Executive Dashboard" },
    { name: "Procurement Workflow", href: "/app/procurement", icon: FileStack, desc: "Import Planning" },
    { name: "Predictive Tracking", href: "/app/tracking", icon: Radar, desc: "AI-Driven ETAs" },
    { name: "Inventory Monitor", href: "/app/inventory", icon: Boxes, desc: "Stock Levels" },
    { name: "Rail Dispatch", href: "/app/rail", icon: Train, desc: "Rake Allocations" },
    { name: "Vessel Tracker Map", href: "/app/map", icon: MapPin, desc: "Geospatial View" },
    { name: "Plant & Ports", href: "/app/network", icon: Factory, desc: "Network View" },
    { name: "Cost & Risk", href: "/app/cost-risk", icon: TrendingUp, desc: "Optimization" },
    { name: "AI Lighthouse", href: "/app/ai-lighthouse", icon: Lightbulb, desc: "AI Insights" },
    { name: "Tide Charts", href: "/app/tide-charts", icon: Waves, desc: "What-If Scenarios" },
    { name: "Reports", href: "/app/reports", icon: FileText, desc: "Management Reports" },
    { name: "About SAIL", href: "/app/about-sail", icon: Info, desc: "Company Info" },
  ]

  if (user?.role === "Admin") {
    navigation.push({ name: "Admin & Data", href: "/app/admin", icon: Database, desc: "Data & Integration" })
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#001f3f] via-[#003d5c] to-[#004f6e]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar with frosted glass effect */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 backdrop-blur-xl bg-white/10 border-r border-white/20 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-2xl",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/20 bg-gradient-to-r from-[#004f6e] to-[#003d5c]">
          <Link href="/" className="flex items-center gap-3 text-lg font-bold text-white">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
              <Ship className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold">SAIL PortLink</div>
              <div className="text-xs text-blue-200">Logistics Optimizer</div>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                    : "text-white/90 hover:bg-white/10 hover:text-white",
                )}
              >
                <item.icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", isActive ? "text-white" : "text-blue-300")} />
                <div className="flex-1 min-w-0">
                  <div className="truncate">{item.name}</div>
                  <div className="text-xs opacity-70 truncate">{item.desc}</div>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/20 bg-gradient-to-r from-[#004f6e] to-[#003d5c]">
          <div className="mb-3 px-3">
            <p className="text-sm font-semibold text-white">{user?.name}</p>
            <p className="text-xs text-blue-200">{user?.role}</p>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start bg-white/10 text-white border-white/20 hover:bg-white/20"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with wave pattern */}
        <header className="h-16 backdrop-blur-xl bg-white/10 border-b border-white/20 flex items-center px-4 gap-4 shadow-lg">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/10"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <div className="text-xs text-white/70 hidden sm:block">
            SAIL Logistics Optimizer • AI-Enabled Port-Plant Network
          </div>
        </header>

        {/* Page content with scroll */}
        <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50">{children}</main>
      </div>
    </div>
  )
}
