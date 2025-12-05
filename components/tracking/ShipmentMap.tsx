"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Ship, Anchor, Factory, MapPin, Loader2 } from "lucide-react"

interface MapData {
  loadPort: { name: string; code: string; lat: number; lon: number }
  dischargePort: { name: string; code: string; lat: number; lon: number }
  plant: { name: string; code: string; lat: number; lon: number }
  seaWaypoints: Array<{ lat: number; lon: number; seq: number }>
  railSegment: {
    from: { lat: number; lon: number }
    to: { lat: number; lon: number }
  }
  status: string
  currentPosition: { lat: number; lon: number } | null
  schedule: {
    id: string
    code: string
    vessel: string
    material: string
    quantity: number
  }
}

interface ShipmentMapProps {
  scheduleId: string
}

export function ShipmentMap({ scheduleId }: ShipmentMapProps) {
  const [mapData, setMapData] = useState<MapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMapData()
  }, [scheduleId])

  const fetchMapData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/schedules/${scheduleId}/map-data`)
      
      if (!response.ok) {
        throw new Error("Failed to load map data")
      }
      
      const data = await response.json()
      setMapData(data)
    } catch (err: any) {
      console.error("[ShipmentMap] Error:", err)
      setError(err.message || "Failed to load map")
    } finally {
      setLoading(false)
    }
  }

  // Convert lat/lon to SVG coordinates (simple mercator-like projection)
  const projectToSVG = (lat: number, lon: number) => {
    // Map bounds: roughly -40 to 40 lat, 60 to 180 lon (covering Australia to India)
    const minLon = 60
    const maxLon = 180
    const minLat = -40
    const maxLat = 40
    
    const x = ((lon - minLon) / (maxLon - minLon)) * 800
    const y = ((maxLat - lat) / (maxLat - minLat)) * 400
    
    return { x, y }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Shipment Route
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading route map...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !mapData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Shipment Route
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Route map unavailable</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const loadPortPos = projectToSVG(mapData.loadPort.lat, mapData.loadPort.lon)
  const dischargePortPos = projectToSVG(mapData.dischargePort.lat, mapData.dischargePort.lon)
  const plantPos = projectToSVG(mapData.plant.lat, mapData.plant.lon)

  // Generate path for sea route
  const seaPathPoints = mapData.seaWaypoints
    .map((wp) => {
      const pos = projectToSVG(wp.lat, wp.lon)
      return `${pos.x},${pos.y}`
    })
    .join(" ")

  // Current vessel position
  const vesselPos = mapData.currentPosition
    ? projectToSVG(mapData.currentPosition.lat, mapData.currentPosition.lon)
    : loadPortPos

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Shipment Route
          </CardTitle>
          <Badge variant={mapData.status === "COMPLETED" ? "default" : "secondary"}>
            {mapData.status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-100 rounded-lg p-4 overflow-hidden border-2 border-blue-200">
          <svg
            viewBox="0 0 800 400"
            className="w-full h-auto"
            style={{ minHeight: "300px" }}
          >
            {/* Background ocean effect */}
            <defs>
              <pattern id="waves" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M0 20 Q 10 15, 20 20 T 40 20"
                  fill="none"
                  stroke="#93c5fd"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </pattern>
              <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.9" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <rect width="800" height="400" fill="url(#oceanGradient)" />
            <rect width="800" height="400" fill="url(#waves)" />

            {/* Country boundaries - Simplified outlines */}
            {/* India */}
            <path
              d={`M ${projectToSVG(35, 75).x},${projectToSVG(35, 75).y} 
                  L ${projectToSVG(30, 78).x},${projectToSVG(30, 78).y}
                  L ${projectToSVG(25, 82).x},${projectToSVG(25, 82).y}
                  L ${projectToSVG(20, 85).x},${projectToSVG(20, 85).y}
                  L ${projectToSVG(15, 88).x},${projectToSVG(15, 88).y}
                  L ${projectToSVG(10, 90).x},${projectToSVG(10, 90).y}
                  L ${projectToSVG(8, 78).x},${projectToSVG(8, 78).y}
                  L ${projectToSVG(12, 72).x},${projectToSVG(12, 72).y}
                  L ${projectToSVG(20, 70).x},${projectToSVG(20, 70).y}
                  L ${projectToSVG(28, 72).x},${projectToSVG(28, 72).y}
                  Z`}
              fill="#d1fae5"
              stroke="#059669"
              strokeWidth="1.5"
              opacity="0.6"
            />
            
            {/* Australia */}
            <path
              d={`M ${projectToSVG(-10, 113).x},${projectToSVG(-10, 113).y}
                  L ${projectToSVG(-15, 125).x},${projectToSVG(-15, 125).y}
                  L ${projectToSVG(-20, 135).x},${projectToSVG(-20, 135).y}
                  L ${projectToSVG(-28, 145).x},${projectToSVG(-28, 145).y}
                  L ${projectToSVG(-35, 150).x},${projectToSVG(-35, 150).y}
                  L ${projectToSVG(-38, 140).x},${projectToSVG(-38, 140).y}
                  L ${projectToSVG(-35, 125).x},${projectToSVG(-35, 125).y}
                  L ${projectToSVG(-28, 115).x},${projectToSVG(-28, 115).y}
                  L ${projectToSVG(-18, 112).x},${projectToSVG(-18, 112).y}
                  Z`}
              fill="#fef3c7"
              stroke="#f59e0b"
              strokeWidth="1.5"
              opacity="0.6"
            />

            {/* Southeast Asia */}
            <path
              d={`M ${projectToSVG(20, 95).x},${projectToSVG(20, 95).y}
                  L ${projectToSVG(15, 100).x},${projectToSVG(15, 100).y}
                  L ${projectToSVG(5, 105).x},${projectToSVG(5, 105).y}
                  L ${projectToSVG(-5, 110).x},${projectToSVG(-5, 110).y}
                  L ${projectToSVG(-8, 105).x},${projectToSVG(-8, 105).y}
                  L ${projectToSVG(-5, 98).x},${projectToSVG(-5, 98).y}
                  L ${projectToSVG(5, 95).x},${projectToSVG(5, 95).y}
                  L ${projectToSVG(15, 93).x},${projectToSVG(15, 93).y}
                  Z`}
              fill="#ddd6fe"
              stroke="#7c3aed"
              strokeWidth="1.5"
              opacity="0.5"
            />

            {/* Africa (partial - eastern coast) */}
            <path
              d={`M ${projectToSVG(10, 40).x},${projectToSVG(10, 40).y}
                  L ${projectToSVG(0, 42).x},${projectToSVG(0, 42).y}
                  L ${projectToSVG(-10, 45).x},${projectToSVG(-10, 45).y}
                  L ${projectToSVG(-20, 48).x},${projectToSVG(-20, 48).y}
                  L ${projectToSVG(-30, 50).x},${projectToSVG(-30, 50).y}
                  L ${projectToSVG(-35, 45).x},${projectToSVG(-35, 45).y}
                  L ${projectToSVG(-30, 38).x},${projectToSVG(-30, 38).y}
                  L ${projectToSVG(-20, 35).x},${projectToSVG(-20, 35).y}
                  L ${projectToSVG(-10, 33).x},${projectToSVG(-10, 33).y}
                  L ${projectToSVG(5, 35).x},${projectToSVG(5, 35).y}
                  Z`}
              fill="#fed7aa"
              stroke="#ea580c"
              strokeWidth="1.5"
              opacity="0.5"
            />

            {/* Sea route (animated dashed blue line) */}
            <polyline
              points={seaPathPoints}
              fill="none"
              stroke="#2563eb"
              strokeWidth="4"
              strokeDasharray="12,8"
              opacity="0.8"
              filter="url(#glow)"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="20"
                dur="1s"
                repeatCount="indefinite"
              />
            </polyline>

            {/* Rail route (dashed green line) */}
            <line
              x1={dischargePortPos.x}
              y1={dischargePortPos.y}
              x2={plantPos.x}
              y2={plantPos.y}
              stroke="#059669"
              strokeWidth="4"
              strokeDasharray="10,6"
              opacity="0.8"
              filter="url(#glow)"
            />

            {/* Load Port Marker (Origin) */}
            <g transform={`translate(${loadPortPos.x}, ${loadPortPos.y})`}>
              <circle r="18" fill="#dc2626" opacity="0.15">
                <animate attributeName="r" values="18;22;18" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle r="12" fill="#dc2626" opacity="0.3" />
              <circle r="8" fill="#dc2626" filter="url(#glow)" />
              <circle r="3" fill="white" />
              {/* Ship icon at origin */}
              <path
                d="M -3,-1 L 0,-4 L 3,-1 L 3,2 L -3,2 Z"
                fill="white"
                transform="translate(0, -12)"
              />
            </g>

            {/* Discharge Port Marker (Indian Port) */}
            <g transform={`translate(${dischargePortPos.x}, ${dischargePortPos.y})`}>
              <circle r="18" fill="#2563eb" opacity="0.15">
                <animate attributeName="r" values="18;22;18" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle r="12" fill="#2563eb" opacity="0.3" />
              <circle r="8" fill="#2563eb" filter="url(#glow)" />
              <circle r="3" fill="white" />
              {/* Anchor icon */}
              <path
                d="M 0,-3 L 0,3 M -2,1 L 2,1 M -3,3 L 0,0 L 3,3"
                stroke="white"
                strokeWidth="1"
                fill="none"
                transform="translate(0, -12)"
              />
            </g>

            {/* Plant Marker (Destination) */}
            <g transform={`translate(${plantPos.x}, ${plantPos.y})`}>
              <circle r="18" fill="#059669" opacity="0.15">
                <animate attributeName="r" values="18;22;18" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle r="12" fill="#059669" opacity="0.3" />
              <circle r="8" fill="#059669" filter="url(#glow)" />
              <circle r="3" fill="white" />
              {/* Factory icon */}
              <rect
                x="-3"
                y="-2"
                width="6"
                height="4"
                fill="white"
                transform="translate(0, -12)"
              />
              <rect
                x="-1"
                y="-4"
                width="2"
                height="2"
                fill="white"
                transform="translate(0, -12)"
              />
            </g>

            {/* Vessel position (if at sea) */}
            {mapData.status === "AT_SEA" && mapData.currentPosition && (
              <g transform={`translate(${vesselPos.x}, ${vesselPos.y})`}>
                <circle r="20" fill="#f59e0b" opacity="0.2">
                  <animate
                    attributeName="r"
                    values="20;28;20"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle r="14" fill="#f59e0b" opacity="0.4" />
                <circle r="10" fill="#f59e0b" filter="url(#glow)" />
                {/* Animated ship icon */}
                <g>
                  <path
                    d="M -5,-3 L 0,-8 L 5,-3 L 5,3 L -5,3 Z"
                    fill="white"
                    stroke="#f59e0b"
                    strokeWidth="1"
                  />
                  <circle cx="0" cy="-2" r="1.5" fill="#f59e0b" />
                  <animate
                    attributeName="transform"
                    values="translate(0,0);translate(0,-2);translate(0,0)"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </g>
              </g>
            )}
          </svg>

          {/* Legend */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-2 bg-white/90 rounded-lg border border-red-200">
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
                <div className="absolute inset-0 w-4 h-4 rounded-full bg-red-500 opacity-30 animate-ping"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-red-700">{mapData.loadPort.code}</p>
                <p className="text-xs text-muted-foreground truncate">{mapData.loadPort.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-white/90 rounded-lg border border-blue-200">
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
                <div className="absolute inset-0 w-4 h-4 rounded-full bg-blue-500 opacity-30 animate-ping"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-blue-700">{mapData.dischargePort.code}</p>
                <p className="text-xs text-muted-foreground truncate">{mapData.dischargePort.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-white/90 rounded-lg border border-green-200">
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
                <div className="absolute inset-0 w-4 h-4 rounded-full bg-green-500 opacity-30 animate-ping"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-green-700">{mapData.plant.code}</p>
                <p className="text-xs text-muted-foreground truncate">{mapData.plant.name}</p>
              </div>
            </div>
          </div>

          {/* Route info */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-white/90 rounded-lg border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Ship className="h-5 w-5 text-blue-600" />
                <span className="font-bold text-sm text-blue-900">Sea Route</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {mapData.loadPort.code} → {mapData.dischargePort.code}
                </span>
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                  Ocean Freight
                </Badge>
              </div>
            </div>
            <div className="p-3 bg-white/90 rounded-lg border-2 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Factory className="h-5 w-5 text-green-600" />
                <span className="font-bold text-sm text-green-900">Rail Route</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {mapData.dischargePort.code} → {mapData.plant.code}
                </span>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                  Rail Transport
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
