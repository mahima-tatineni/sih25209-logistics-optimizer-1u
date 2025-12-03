"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

interface Plant {
  id?: string
  code: string
  name: string
  state: string
  latitude?: number
  longitude?: number
  lat?: number
  lon?: number
  crude_capacity_mtpa: number
  annual_coking_import_t: number
  annual_limestone_import_t: number
  daily_coking_demand_t?: number
  daily_limestone_demand_t?: number
  min_days_cover?: number
  target_days_cover?: number
  image?: string
  description?: string
}

interface Port {
  id?: string
  code: string
  name: string
  state?: string
  type: string
  latitude?: number
  longitude?: number
  lat?: number
  lon?: number
  max_draft_m: number
  panamax_berths: number
  annual_coal_capacity_mt: number
  storage_capacity_t?: number
  sail_yard_capacity_t?: number
  free_storage_days: number
  storage_charge_inr_t_day?: number
  storage_tariff_inr_per_t_per_day?: number
  handling_charge_inr_t?: number
  handling_tariff_inr_per_t?: number
  port_dues_inr_t?: number
  image?: string
}

interface FacilityCardProps {
  type: "plant" | "port"
  data: Plant | Port
}

export function FacilityCard({ type, data }: FacilityCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const isPlant = type === "plant"
  const plant = isPlant ? (data as Plant) : null
  const port = !isPlant ? (data as Port) : null

  const getLat = () => (isPlant && plant ? plant.latitude || plant.lat : port ? port.latitude || port.lat : 0)
  const getLon = () => (isPlant && plant ? plant.longitude || plant.lon : port ? port.longitude || port.lon : 0)

  const getImagePath = () => {
    if (data.image) return data.image

    if (isPlant && plant) {
      const imageMap: Record<string, string> = {
        BSP: "/images/bhilai-steel-plant.webp",
        RSP: "/images/rourkela-steel-plant.jpg",
        BSL: "/images/bokaro-steel-plant.jpg",
        DSP: "/images/durgapur-steel-plant.jpg",
        ISP: "/images/iiso-steel-plant.jpg",
      }
      return imageMap[plant.code] || "/steel-plant.jpg"
    }
    if (port) {
      const imageMap: Record<string, string> = {
        VIZAG: "/images/visakhapatnam-port.webp",
        GANG: "/images/gangavaram-port.jpeg",
        PARA: "/images/paradip-port.jpg",
        DHAM: "/images/dhamra-port.jpg",
        HALD: "/images/haldia-port.webp",
      }
      return imageMap[port.code] || "/cargo-port.jpg"
    }
    return "/placeholder.svg?height=400&width=600"
  }

  const getStorageCharge = () => {
    if (!port) return 0
    return port.storage_charge_inr_t_day || port.storage_tariff_inr_per_t_per_day || 0
  }

  const getHandlingCharge = () => {
    if (!port) return 0
    return port.handling_charge_inr_t || port.handling_tariff_inr_per_t || 0
  }

  const getStorageCapacity = () => {
    if (!port) return 0
    return port.storage_capacity_t || port.sail_yard_capacity_t || 0
  }

  const getDailyCoking = () => {
    if (!plant) return 0
    return plant.daily_coking_demand_t || plant.annual_coking_import_t / 365
  }

  const getDailyLimestone = () => {
    if (!plant) return 0
    return plant.daily_limestone_demand_t || plant.annual_limestone_import_t / 365
  }

  return (
    <>
      <div className="facility-card group" onClick={() => setShowDetails(true)}>
        <div className="relative h-96 bg-gray-200">
          <Image
            src={getImagePath() || "/placeholder.svg"}
            alt={data.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Hover overlay */}
        <div className="facility-overlay">
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold mb-2">{data.name}</h3>
            {isPlant && plant && (
              <>
                <p className="text-sm text-white/90 mb-3">{plant.state}</p>
                <div className="space-y-1 text-xs">
                  <p>Capacity: {plant.crude_capacity_mtpa} MTPA</p>
                  <p>Coking Coal: {(plant.annual_coking_import_t / 1000000).toFixed(1)} MT/year</p>
                </div>
              </>
            )}
            {!isPlant && port && (
              <>
                <p className="text-sm text-white/90 mb-3 capitalize">{port.type} Port</p>
                <div className="space-y-1 text-xs">
                  <p>Capacity: {port.annual_coal_capacity_mt} MT/year</p>
                  <p>Berths: {port.panamax_berths} Panamax</p>
                  <p>Max Draft: {port.max_draft_m}m</p>
                </div>
              </>
            )}
            <p className="text-xs mt-3 text-accent font-semibold">Click for details →</p>
          </div>
        </div>

        {/* Enhanced always-visible label */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-5 pt-8">
          <h4 className="text-white font-bold text-lg drop-shadow-lg">{data.name}</h4>
          {isPlant && plant && <p className="text-white/90 text-sm drop-shadow-md">{plant.state}</p>}
          {!isPlant && port && <p className="text-white/90 text-sm capitalize drop-shadow-md">{port.type}</p>}
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">{data.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image src={getImagePath() || "/placeholder.svg"} alt={data.name} fill className="object-cover" />
            </div>

            {isPlant && plant && (
              <>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-primary">Plant Overview</h3>
                  <p className="text-foreground/80 mb-4">
                    {plant.description || `Major integrated steel plant located in ${plant.state}`}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {plant.state} ({getLat()?.toFixed(3)}°N, {getLon()?.toFixed(3)}°E)
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 text-primary">Production Capacity</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <p className="text-xs text-foreground/60 mb-1">Crude Steel Capacity</p>
                      <p className="text-2xl font-bold text-primary">{plant.crude_capacity_mtpa} MTPA</p>
                    </div>
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <p className="text-xs text-foreground/60 mb-1">Target Stock Cover</p>
                      <p className="text-2xl font-bold text-primary">{plant.target_days_cover || 30} days</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 text-primary">Annual Import Requirements</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-secondary/30 rounded">
                      <span className="text-sm font-medium">Coking Coal</span>
                      <Badge variant="secondary">{(plant.annual_coking_import_t / 1000000).toFixed(2)} MT</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-secondary/30 rounded">
                      <span className="text-sm font-medium">Limestone</span>
                      <Badge variant="secondary">{(plant.annual_limestone_import_t / 1000000).toFixed(2)} MT</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 text-primary">Daily Consumption</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-secondary/30 rounded">
                      <span className="text-sm font-medium">Coking Coal</span>
                      <Badge variant="secondary">{getDailyCoking().toFixed(0)} tonnes/day</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-secondary/30 rounded">
                      <span className="text-sm font-medium">Limestone</span>
                      <Badge variant="secondary">{getDailyLimestone().toFixed(0)} tonnes/day</Badge>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!isPlant && port && (
              <>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-primary">Port Overview</h3>
                  <div className="flex items-center gap-2 text-sm text-foreground/70 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {getLat()?.toFixed(3)}°N, {getLon()?.toFixed(3)}°E
                    </span>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {port.type} Port
                  </Badge>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 text-primary">Port Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <p className="text-xs text-foreground/60 mb-1">Annual Capacity</p>
                      <p className="text-2xl font-bold text-primary">{port.annual_coal_capacity_mt} MT</p>
                    </div>
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <p className="text-xs text-foreground/60 mb-1">Max Draft</p>
                      <p className="text-2xl font-bold text-primary">{port.max_draft_m}m</p>
                    </div>
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <p className="text-xs text-foreground/60 mb-1">Panamax Berths</p>
                      <p className="text-2xl font-bold text-primary">{port.panamax_berths}</p>
                    </div>
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <p className="text-xs text-foreground/60 mb-1">Storage Capacity</p>
                      <p className="text-2xl font-bold text-primary">{(getStorageCapacity() / 1000).toFixed(0)}K T</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 text-primary">Tariffs & Charges</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-secondary/30 rounded">
                      <span className="text-sm font-medium">Handling Charge</span>
                      <Badge variant="secondary">₹{getHandlingCharge()}/tonne</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-secondary/30 rounded">
                      <span className="text-sm font-medium">Storage Charge</span>
                      <Badge variant="secondary">₹{getStorageCharge()}/t/day</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-secondary/30 rounded">
                      <span className="text-sm font-medium">Free Storage Days</span>
                      <Badge variant="secondary">{port.free_storage_days} days</Badge>
                    </div>
                    {port.port_dues_inr_t && (
                      <div className="flex justify-between items-center p-3 bg-secondary/30 rounded">
                        <span className="text-sm font-medium">Port Dues</span>
                        <Badge variant="secondary">₹{port.port_dues_inr_t}/tonne</Badge>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
