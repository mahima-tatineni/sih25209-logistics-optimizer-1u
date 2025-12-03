import { createClient } from "./supabase/server"
import type { Plant, Port, Vessel, SupplierPort } from "./supabase-types"

export async function getPlants(): Promise<Plant[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("plants").select("*").order("code")

  if (error) throw error
  return data || []
}

export async function getPorts(): Promise<Port[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("ports").select("*").order("code")

  if (error) throw error
  return data || []
}

export async function getVessels(): Promise<Vessel[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("vessels").select("*").order("name")

  if (error) throw error
  return data || []
}

export async function getSupplierPorts(): Promise<SupplierPort[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("supplier_ports").select("*").order("name")

  if (error) throw error
  return data || []
}

export async function getPlantStock(plantId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("plant_stock")
    .select("*")
    .eq("plant_id", plantId)
    .order("as_of_date", { ascending: false })
    .limit(1)

  if (error) throw error
  return data || []
}

export async function getPortStock(portId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("port_stock")
    .select("*")
    .eq("port_id", portId)
    .order("as_of_date", { ascending: false })
    .limit(1)

  if (error) throw error
  return data || []
}
