"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import type { StockSnapshot, Shipment } from "@/lib/types"

interface UseRealtimeDataOptions {
  refreshInterval?: number
  onDataChange?: (type: string, data: any) => void
}

export function useRealtimeData(options: UseRealtimeDataOptions = {}) {
  const { refreshInterval = 5000, onDataChange } = options
  const [stocks, setStocks] = useState<StockSnapshot[]>([])
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const lastDataRef = useRef<{ stocks: string; shipments: string }>({ stocks: "", shipments: "" })

  const fetchStocks = useCallback(async () => {
    try {
      const response = await fetch("/api/stock-snapshot")
      if (!response.ok) throw new Error("Failed to fetch stocks")
      const result = await response.json()

      const data = Array.isArray(result) ? result : result.data || []
      const dataStr = JSON.stringify(data)

      // Only update if data changed
      if (lastDataRef.current.stocks !== dataStr) {
        setStocks(data)
        lastDataRef.current.stocks = dataStr
        onDataChange?.("stocks", data)
      }
    } catch (err) {
      console.error("[v0] Error fetching stocks:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }, [onDataChange])

  const fetchShipments = useCallback(async () => {
    try {
      const response = await fetch("/api/schedules")
      if (!response.ok) throw new Error("Failed to fetch shipments")
      const result = await response.json()

      const data = Array.isArray(result) ? result : result.data || []
      const dataStr = JSON.stringify(data)

      // Only update if data changed
      if (lastDataRef.current.shipments !== dataStr) {
        setShipments(data)
        lastDataRef.current.shipments = dataStr
        onDataChange?.("shipments", data)
      }
    } catch (err) {
      console.error("[v0] Error fetching shipments:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }, [onDataChange])

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchStocks(), fetchShipments()]).finally(() => setLoading(false))

    const interval = setInterval(() => {
      fetchStocks()
      fetchShipments()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [fetchStocks, fetchShipments, refreshInterval])

  return {
    stocks,
    shipments,
    loading,
    error,
    refetch: () => {
      fetchStocks()
      fetchShipments()
    },
  }
}

export function useStockAlerts() {
  const [alerts, setAlerts] = useState<Array<{ id: string; type: "warning" | "critical"; message: string }>>([])
  const { stocks } = useRealtimeData()

  useEffect(() => {
    if (!Array.isArray(stocks)) {
      console.error("[v0] stocks is not an array:", stocks)
      return
    }

    const newAlerts: typeof alerts = []

    stocks.forEach((stock) => {
      if (stock.days_cover && stock.days_cover < 15) {
        newAlerts.push({
          id: `${stock.location_id}-${stock.material}`,
          type: stock.days_cover < 10 ? "critical" : "warning",
          message: `${stock.location_id}: ${stock.material} at ${stock.days_cover?.toFixed(1)} days cover`,
        })
      }
    })

    setAlerts(newAlerts)
  }, [stocks])

  return { alerts }
}
