"use server"

import { createClient } from "@/lib/supabase/server"
import { PLANTS, PORTS } from "@/lib/mock-data"

export async function getPlants() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("plants").select("*").order("name")

  if (error) {
    console.error("[v0] Error fetching plants:", error)
    return PLANTS
  }

  if (!data || data.length === 0) {
    console.log("[v0] No plants in Supabase, using mock data")
    return PLANTS
  }

  return data.map((plant) => ({
    ...plant,
    image: PLANTS.find((p) => p.code === plant.code)?.image || plant.image,
    description: PLANTS.find((p) => p.code === plant.code)?.description || plant.description,
    lat: plant.latitude,
    lon: plant.longitude,
  }))
}

export async function getPorts() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("ports").select("*").order("name")

  if (error) {
    console.error("[v0] Error fetching ports:", error)
    return PORTS
  }

  if (!data || data.length === 0) {
    console.log("[v0] No ports in Supabase, using mock data")
    return PORTS
  }

  return data.map((port) => ({
    ...port,
    image: PORTS.find((p) => p.code === port.code)?.image || port.image,
    lat: port.latitude,
    lon: port.longitude,
  }))
}

export async function getVessels() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("vessels").select("*").order("name")

  if (error) {
    console.error("[v0] Error fetching vessels:", error)
    return []
  }

  return data || []
}

export async function getSupplierPorts() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("supplier_ports").select("*").order("name")

  if (error) {
    console.error("[v0] Error fetching supplier ports:", error)
    return []
  }

  return data || []
}

export async function getShipments() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("shipments")
    .select(`
      *,
      vessel:vessels(name, max_cargo_t),
      supplier_port:supplier_ports(name, country),
      discharge_port:ports(name)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching shipments:", error)
    return []
  }

  return data || []
}

export async function getPlantStock() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("plant_stock").select(`
      *,
      plant:plants(code, name)
    `)

  if (error) {
    console.error("[v0] Error fetching plant stock:", error)
    return []
  }

  return data || []
}

export async function getPortStock() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("port_stock").select(`
      *,
      port:ports(code, name)
    `)

  if (error) {
    console.error("[v0] Error fetching port stock:", error)
    return []
  }

  return data || []
}

export async function getOptimizationRuns() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("optimization_runs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("[v0] Error fetching optimization runs:", error)
    return []
  }

  return data || []
}
