// Domain types for SAIL Logistics Optimizer

export interface Plant {
  code: string
  name: string
  state: string
  image?: string // Added image field for plant photos
  description?: string // Added description field for plant details
  lat: number
  lon: number
  crude_capacity_mtpa: number
  annual_coking_import_t: number
  annual_limestone_import_t: number
  min_days_cover: number
  target_days_cover: number
  priority_ports: { code: string; priority: number }[]
}

export interface Port {
  code: string
  name: string
  image?: string // Added image field for port photos
  type: "deep-sea" | "riverine"
  lat: number
  lon: number
  max_draft_m: number
  panamax_berths: number
  annual_coal_capacity_mt: number
  sail_yard_capacity_t: number
  free_storage_days: number
  handling_tariff_inr_per_t: number
  storage_tariff_inr_per_t_per_day: number
  nearest_plants: string[]
}

export interface RailRoute {
  from_port: string
  to_plant: string
  distance_km: number
  max_rakes_per_day: number
  transit_days: number
  freight_inr_per_t: number
}

export interface SupplierPort {
  code: string
  name: string
  country: string
  lat: number
  lon: number
}

export interface Vessel {
  name: string
  capacity_t: number
  type: string
}

export interface Shipment {
  id: string
  supplier_port: string
  supplier_name?: string
  vessel: string
  material: "coking_coal" | "limestone"
  grade: string
  laycan_start: string
  laycan_end: string
  sail_date: string
  quantity_t: number
  parcel_size_t: number
  contract_freight_usd_per_t?: number
  incoterm: string
  candidate_ports: string[]
  target_plants: string[]
  eta?: string
  status:
    | "Created"
    | "Draft"
    | "Assigned to Logistics"
    | "Optimized"
    | "Confirmed"
    | "In Transit"
    | "Berthed"
    | "Discharged"
    | "Completed"
  stem_id?: string
  created_by: string
  created_at: string
  linked_request_ids?: string[]
}

export interface User {
  id: string
  email: string
  name: string
  role: "PlantAdmin" | "ProcurementAdmin" | "LogisticsTeam" | "PortAdmin" | "RailwayAdmin" | "SystemAdmin" | "Guest"
  assigned_location?: string
  plant_id?: string
  port_id?: string
}

export interface OptimizationResult {
  id: string
  timestamp: string
  shipments: {
    shipment_id: string
    assigned_port: string
    assigned_plant: string
    eta: string
    discharge_days: number
  }[]
  cost_breakdown: {
    ocean_freight_usd: number
    port_handling_inr: number
    port_storage_inr: number
    rail_freight_inr: number
    demurrage_usd: number
    total_inr: number
  }
  stock_forecast: {
    plant: string
    material: string
    days_cover: number
  }[]
}

export interface Scenario {
  id: string
  name: string
  description: string
  created_at: string
  parameters: {
    fx_rate: number
    demurrage_rate_usd_per_day: number
    target_stock_days: number
  }
  result?: OptimizationResult
}

export interface StockSnapshot {
  location: string
  location_type: "plant" | "port"
  material: string
  quantity_t: number
  days_cover?: number
  last_updated: string
}

export interface PlantEvent {
  id: string
  plant_id: string
  event_type: "rake_arrival" | "consumption" | "manual_adjust"
  material: "coking_coal" | "limestone"
  quantity_t: number
  rake_id?: string
  date_time: string
  comment?: string
  user_id: string
}

export interface PortEvent {
  id: string
  port_id: string
  event_type: "vessel_discharge" | "rake_loading" | "manual_adjust"
  shipment_id?: string
  material: "coking_coal" | "limestone"
  quantity_t: number
  date_time: string
  user_id: string
  comment?: string
  destination_plant?: string
  rake_id?: string
}

export interface VesselEvent {
  id: string
  vessel_id: string
  port_id: string
  event_type: "arrived_anchorage" | "berthed" | "sailed"
  date_time: string
  eta_update?: string
  user_id: string
}

export interface CurrentStock {
  location_id: string
  location_type: "plant" | "port"
  material: "coking_coal" | "limestone"
  stock_t: number
  days_cover?: number
  last_updated: string
}

export interface PortCongestion {
  port_id: string
  vessels_at_anchorage: number
  vessels_at_berth: number
  congestion_score: number
  last_updated: string
}

export interface StockRequest {
  id: string
  plant_id: string
  material: "coking_coal" | "limestone"
  grade: string
  quantity_t: number
  required_by_date: string
  current_days_cover: number
  priority: "Normal" | "High" | "Critical"
  note?: string
  status: "Pending" | "In Planning" | "Scheduled" | "In Transit" | "Delivered"
  created_at: string
  created_by: string
  procurement_comments?: string
  assigned_schedule_id?: string
}

export interface Schedule {
  id: string
  name: string
  shipment_ids: string[]
  linked_request_ids: string[]
  vessel_id: string
  supplier_port: string
  load_date: string
  discharge_ports: {
    port_id: string
    tonnes: number
    eta: string
  }[]
  plant_allocations: {
    plant_id: string
    tonnes: number
    eta: string
    via_port: string
  }[]
  status: "Draft" | "Awaiting Logistics" | "Optimized" | "Confirmed" | "Active" | "Completed"
  cost_estimate_inr?: number
  optimization_id?: string
  created_by: string
  created_at: string
  confirmed_at?: string
}

export interface RakeSchedule {
  id: string
  schedule_id: string
  from_port: string
  to_plant: string
  material: "coking_coal" | "limestone"
  quantity_t: number
  rake_count: number
  planned_date: string
  status: "Requested" | "Confirmed" | "Scheduled" | "In Transit" | "Completed"
  confirmed_by?: string
  comments?: string
}

export interface OptimizationJob {
  id: string
  schedule_id: string
  mode: "quick" | "detailed" | "whatif"
  status: "pending" | "running" | "completed" | "failed"
  progress: number
  created_at: string
  completed_at?: string
  result?: OptimizationResult
}
