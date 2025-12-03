export type UserRole = "Admin" | "CentralPlanner" | "PlantUser" | "PortUser"
export type Material = "COKING_COAL" | "LIMESTONE"
export type Incoterm = "FOB" | "CFR" | "CIF"
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH"

export interface Plant {
  id: string
  code: string
  name: string
  state: string
  latitude: number | null
  longitude: number | null
  crude_capacity_mtpa: number | null
  annual_coking_import_t: number | null
  annual_limestone_import_t: number | null
  daily_coking_demand_t: number | null
  daily_limestone_demand_t: number | null
  min_days_cover: number | null
  target_days_cover: number | null
  created_at: string
}

export interface Port {
  id: string
  code: string
  name: string
  state: string
  type: string
  latitude: number | null
  longitude: number | null
  max_draft_m: number | null
  panamax_berths: number | null
  annual_coal_capacity_mt: number | null
  storage_capacity_t: number | null
  free_storage_days: number | null
  storage_charge_inr_t_day: number | null
  handling_charge_inr_t: number | null
  port_dues_inr_t: number | null
  created_at: string
}

export interface SupplierPort {
  id: string
  code: string
  name: string
  country: string
  latitude: number | null
  longitude: number | null
  created_at: string
}

export interface Vessel {
  id: string
  code: string
  name: string
  max_cargo_t: number
  created_at: string
}

export interface Shipment {
  id: string
  ref_no: string | null
  vessel_id: string | null
  material: Material
  quality_grade: string | null
  incoterm: Incoterm
  supplier_port_id: string | null
  loadport_eta: string | null
  laycan_start: string | null
  laycan_end: string | null
  sail_date: string | null
  base_eta_india: string | null
  candidate_ports: string[] | null
  quantity_t: number
  status: string | null
  created_by: string | null
  created_at: string
}

export interface PlantStock {
  id: string
  plant_id: string
  material: Material
  quality: string | null
  as_of_date: string
  stock_t: number
  created_at: string
}

export interface PortStock {
  id: string
  port_id: string
  material: Material
  quality: string | null
  as_of_date: string
  stock_t: number
  created_at: string
}
