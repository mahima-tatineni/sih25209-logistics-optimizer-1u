import type {
  Plant,
  Port,
  RailRoute,
  SupplierPort,
  Vessel,
  Shipment,
  User,
  StockSnapshot,
  PlantEvent,
  PortEvent,
  VesselEvent,
  PortCongestion,
} from "./types"

export const PLANTS: Plant[] = [
  {
    code: "BSP",
    name: "Bhilai Steel Plant",
    state: "Chhattisgarh",
    image: "/images/bhilai-steel-plant.webp",
    description: "Produces rails, structural steel, plates, and wire rods",
    lat: 21.209,
    lon: 81.429,
    crude_capacity_mtpa: 7.5,
    annual_coking_import_t: 4200000,
    annual_limestone_import_t: 900000,
    min_days_cover: 15,
    target_days_cover: 30,
    priority_ports: [
      { code: "VIZAG", priority: 1 },
      { code: "GANG", priority: 2 },
      { code: "PARA", priority: 3 },
    ],
  },
  {
    code: "RSP",
    name: "Rourkela Steel Plant",
    state: "Odisha",
    image: "/images/rourkela-steel-plant.jpg",
    description: "Manufactures structurals, semis, blooms, and billets",
    lat: 22.26,
    lon: 84.864,
    crude_capacity_mtpa: 4.5,
    annual_coking_import_t: 2800000,
    annual_limestone_import_t: 600000,
    min_days_cover: 15,
    target_days_cover: 30,
    priority_ports: [
      { code: "PARA", priority: 1 },
      { code: "DHAM", priority: 2 },
      { code: "HALD", priority: 3 },
    ],
  },
  {
    code: "BSL",
    name: "Bokaro Steel Plant",
    state: "Jharkhand",
    image: "/images/bokaro-steel-plant.jpg",
    description: "Produces plates, HR coils, CR coils, and galvanized sheets",
    lat: 23.669,
    lon: 86.151,
    crude_capacity_mtpa: 4.5,
    annual_coking_import_t: 3500000,
    annual_limestone_import_t: 750000,
    min_days_cover: 15,
    target_days_cover: 30,
    priority_ports: [
      { code: "DHAM", priority: 1 },
      { code: "HALD", priority: 2 },
      { code: "PARA", priority: 3 },
    ],
  },
  {
    code: "DSP",
    name: "Durgapur Steel Plant",
    state: "West Bengal",
    image: "/images/durgapur-steel-plant.jpg",
    description: "Produces HR coils, CR coils, and galvanized products",
    lat: 23.548,
    lon: 87.319,
    crude_capacity_mtpa: 2.5,
    annual_coking_import_t: 2100000,
    annual_limestone_import_t: 450000,
    min_days_cover: 15,
    target_days_cover: 30,
    priority_ports: [
      { code: "HALD", priority: 1 },
      { code: "PARA", priority: 2 },
    ],
  },
  {
    code: "ISP",
    name: "IISCO Steel Plant",
    state: "West Bengal",
    image: "/images/iiso-steel-plant.jpg",
    description: "Produces rails, wheel and axle, and structural steel",
    lat: 23.625,
    lon: 87.018,
    crude_capacity_mtpa: 2.0,
    annual_coking_import_t: 1400000,
    annual_limestone_import_t: 300000,
    min_days_cover: 15,
    target_days_cover: 30,
    priority_ports: [
      { code: "HALD", priority: 1 },
      { code: "PARA", priority: 2 },
    ],
  },
]

export const PORTS: Port[] = [
  {
    code: "VIZAG",
    name: "Visakhapatnam Port",
    image: "/images/visakhapatnam-port.webp",
    type: "deep-sea",
    lat: 17.686,
    lon: 83.218,
    max_draft_m: 18.5,
    panamax_berths: 3,
    annual_coal_capacity_mt: 25,
    sail_yard_capacity_t: 150000,
    free_storage_days: 10,
    handling_tariff_inr_per_t: 450,
    storage_tariff_inr_per_t_per_day: 15,
    nearest_plants: ["BSP", "RSP"],
  },
  {
    code: "GANG",
    name: "Gangavaram Port",
    image: "/images/gangavaram-port.jpeg",
    type: "deep-sea",
    lat: 17.632,
    lon: 83.242,
    max_draft_m: 20.0,
    panamax_berths: 2,
    annual_coal_capacity_mt: 20,
    sail_yard_capacity_t: 120000,
    free_storage_days: 10,
    handling_tariff_inr_per_t: 440,
    storage_tariff_inr_per_t_per_day: 14,
    nearest_plants: ["BSP", "RSP"],
  },
  {
    code: "PARA",
    name: "Paradip Port",
    image: "/images/paradip-port.jpg",
    type: "deep-sea",
    lat: 20.262,
    lon: 86.609,
    max_draft_m: 17.5,
    panamax_berths: 4,
    annual_coal_capacity_mt: 30,
    sail_yard_capacity_t: 180000,
    free_storage_days: 12,
    handling_tariff_inr_per_t: 430,
    storage_tariff_inr_per_t_per_day: 13,
    nearest_plants: ["RSP", "BSL", "DSP", "ISP"],
  },
  {
    code: "DHAM",
    name: "Dhamra Port",
    image: "/images/dhamra-port.jpg", // Added image property for Dhamra port
    type: "deep-sea",
    lat: 20.869,
    lon: 87.095,
    max_draft_m: 18.0,
    panamax_berths: 2,
    annual_coal_capacity_mt: 18,
    sail_yard_capacity_t: 100000,
    free_storage_days: 10,
    handling_tariff_inr_per_t: 420,
    storage_tariff_inr_per_t_per_day: 12,
    nearest_plants: ["RSP", "BSL"],
  },
  {
    code: "HALD",
    name: "Haldia Port",
    image: "/images/haldia-port.webp",
    type: "riverine",
    lat: 22.027,
    lon: 88.107,
    max_draft_m: 9.5,
    panamax_berths: 2,
    annual_coal_capacity_mt: 12,
    sail_yard_capacity_t: 80000,
    free_storage_days: 8,
    handling_tariff_inr_per_t: 410,
    storage_tariff_inr_per_t_per_day: 11,
    nearest_plants: ["DSP", "ISP", "BSL"],
  },
]

export const SUPPLIER_PORTS: SupplierPort[] = [
  { code: "GLAD", name: "Gladstone", country: "Australia", lat: -23.84, lon: 151.26 },
  { code: "HAYP", name: "Hay Point", country: "Australia", lat: -21.28, lon: 149.3 },
  { code: "MAPU", name: "Maputo", country: "Mozambique", lat: -25.97, lon: 32.58 },
  { code: "MURM", name: "Murmansk", country: "Russia", lat: 68.97, lon: 33.08 },
  { code: "NEWC", name: "Newcastle", country: "Australia", lat: -32.92, lon: 151.78 },
  { code: "JEBA", name: "Jebel Ali", country: "UAE", lat: 25.01, lon: 55.03 },
  { code: "BRIS", name: "Brisbane", country: "Australia", lat: -27.47, lon: 153.03 },
  { code: "QING", name: "Qingdao", country: "China", lat: 36.07, lon: 120.38 },
  { code: "RICH", name: "Richards Bay", country: "South Africa", lat: -28.78, lon: 32.04 },
  { code: "VANC", name: "Vancouver", country: "Canada", lat: 49.28, lon: -123.12 },
]

export const VESSELS: Vessel[] = [
  { name: "MV Pacific Glory", capacity_t: 75000, type: "Panamax" },
  { name: "MV Ocean Star", capacity_t: 72000, type: "Panamax" },
  { name: "MV Steel Carrier", capacity_t: 68000, type: "Panamax" },
  { name: "MV Baltic Pride", capacity_t: 70000, type: "Panamax" },
  { name: "MV Asian Voyager", capacity_t: 74000, type: "Panamax" },
  { name: "MV Indian Express", capacity_t: 71000, type: "Panamax" },
  { name: "MV Global Trader", capacity_t: 69000, type: "Panamax" },
  { name: "MV Southern Cross", capacity_t: 73000, type: "Panamax" },
  { name: "MV Eastern Wind", capacity_t: 67000, type: "Panamax" },
]

export const RAIL_ROUTES: RailRoute[] = [
  {
    from_port: "VIZAG",
    to_plant: "BSP",
    distance_km: 680,
    max_rakes_per_day: 4,
    transit_days: 3,
    freight_inr_per_t: 850,
  },
  {
    from_port: "VIZAG",
    to_plant: "RSP",
    distance_km: 550,
    max_rakes_per_day: 3,
    transit_days: 2,
    freight_inr_per_t: 720,
  },
  {
    from_port: "GANG",
    to_plant: "BSP",
    distance_km: 690,
    max_rakes_per_day: 3,
    transit_days: 3,
    freight_inr_per_t: 860,
  },
  {
    from_port: "GANG",
    to_plant: "RSP",
    distance_km: 560,
    max_rakes_per_day: 2,
    transit_days: 2,
    freight_inr_per_t: 730,
  },
  {
    from_port: "PARA",
    to_plant: "BSP",
    distance_km: 580,
    max_rakes_per_day: 4,
    transit_days: 2,
    freight_inr_per_t: 780,
  },
  {
    from_port: "PARA",
    to_plant: "RSP",
    distance_km: 320,
    max_rakes_per_day: 5,
    transit_days: 1,
    freight_inr_per_t: 520,
  },
  {
    from_port: "PARA",
    to_plant: "BSL",
    distance_km: 440,
    max_rakes_per_day: 4,
    transit_days: 2,
    freight_inr_per_t: 650,
  },
  {
    from_port: "PARA",
    to_plant: "DSP",
    distance_km: 520,
    max_rakes_per_day: 3,
    transit_days: 2,
    freight_inr_per_t: 700,
  },
  {
    from_port: "PARA",
    to_plant: "ISP",
    distance_km: 530,
    max_rakes_per_day: 3,
    transit_days: 2,
    freight_inr_per_t: 710,
  },
  {
    from_port: "DHAM",
    to_plant: "RSP",
    distance_km: 280,
    max_rakes_per_day: 4,
    transit_days: 1,
    freight_inr_per_t: 480,
  },
  {
    from_port: "DHAM",
    to_plant: "BSL",
    distance_km: 380,
    max_rakes_per_day: 5,
    transit_days: 2,
    freight_inr_per_t: 590,
  },
  {
    from_port: "DHAM",
    to_plant: "DSP",
    distance_km: 460,
    max_rakes_per_day: 3,
    transit_days: 2,
    freight_inr_per_t: 640,
  },
  {
    from_port: "HALD",
    to_plant: "BSL",
    distance_km: 350,
    max_rakes_per_day: 4,
    transit_days: 2,
    freight_inr_per_t: 560,
  },
  {
    from_port: "HALD",
    to_plant: "DSP",
    distance_km: 220,
    max_rakes_per_day: 5,
    transit_days: 1,
    freight_inr_per_t: 420,
  },
  {
    from_port: "HALD",
    to_plant: "ISP",
    distance_km: 240,
    max_rakes_per_day: 5,
    transit_days: 1,
    freight_inr_per_t: 440,
  },
]

let mockShipments: Shipment[] = [
  {
    id: "SHP001",
    supplier_port: "GLAD",
    vessel: "MV Pacific Glory",
    material: "coking_coal",
    grade: "Premium Hard Coking",
    laycan_start: "2025-01-15",
    laycan_end: "2025-01-20",
    sail_date: "2025-01-18",
    quantity_t: 75000,
    incoterm: "CFR",
    candidate_ports: ["VIZAG", "GANG", "PARA"],
    eta: "2025-02-05",
    status: "in_transit",
  },
  {
    id: "SHP002",
    supplier_port: "NEWC",
    vessel: "MV Ocean Star",
    material: "coking_coal",
    grade: "Semi-Soft Coking",
    laycan_start: "2025-01-20",
    laycan_end: "2025-01-25",
    sail_date: "2025-01-22",
    quantity_t: 72000,
    incoterm: "CFR",
    candidate_ports: ["PARA", "DHAM"],
    eta: "2025-02-08",
    status: "in_transit",
  },
  {
    id: "SHP003",
    supplier_port: "MAPU",
    vessel: "MV Steel Carrier",
    material: "coking_coal",
    grade: "Medium Coking",
    laycan_start: "2025-02-01",
    laycan_end: "2025-02-05",
    sail_date: "2025-02-03",
    quantity_t: 68000,
    incoterm: "CFR",
    candidate_ports: ["VIZAG", "PARA"],
    status: "planned",
  },
]

const plantEvents: PlantEvent[] = []
const portEvents: PortEvent[] = []
const vesselEvents: VesselEvent[] = []

const currentStocks: StockSnapshot[] = [
  {
    location_id: "BSP",
    location_type: "plant",
    material: "coking_coal",
    stock_t: 350000,
    days_cover: 28,
    last_updated: new Date().toISOString(),
  },
  {
    location_id: "BSP",
    location_type: "plant",
    material: "limestone",
    stock_t: 75000,
    days_cover: 28,
    last_updated: new Date().toISOString(),
  },
  {
    location_id: "RSP",
    location_type: "plant",
    material: "coking_coal",
    stock_t: 220000,
    days_cover: 26,
    last_updated: new Date().toISOString(),
  },
  {
    location_id: "RSP",
    location_type: "plant",
    material: "limestone",
    stock_t: 48000,
    days_cover: 27,
    last_updated: new Date().toISOString(),
  },
  {
    location_id: "BSL",
    location_type: "plant",
    material: "coking_coal",
    stock_t: 280000,
    days_cover: 27,
    last_updated: new Date().toISOString(),
  },
  {
    location_id: "BSL",
    location_type: "plant",
    material: "limestone",
    stock_t: 62000,
    days_cover: 28,
    last_updated: new Date().toISOString(),
  },
  {
    location_id: "VIZAG",
    location_type: "port",
    material: "coking_coal",
    stock_t: 85000,
    last_updated: new Date().toISOString(),
  },
  {
    location_id: "PARA",
    location_type: "port",
    material: "coking_coal",
    stock_t: 120000,
    last_updated: new Date().toISOString(),
  },
  {
    location_id: "DHAM",
    location_type: "port",
    material: "coking_coal",
    stock_t: 65000,
    last_updated: new Date().toISOString(),
  },
]

export const STOCK_SNAPSHOTS = currentStocks

const portCongestions: PortCongestion[] = [
  {
    port_id: "VIZAG",
    vessels_at_anchorage: 2,
    vessels_at_berth: 1,
    congestion_score: 0.4,
    last_updated: new Date().toISOString(),
  },
  {
    port_id: "PARA",
    vessels_at_anchorage: 1,
    vessels_at_berth: 2,
    congestion_score: 0.5,
    last_updated: new Date().toISOString(),
  },
]

const mockUsers: User[] = [
  { id: "U001", email: "planner@sail.in", name: "Central Planner", role: "CentralPlanner" },
  {
    id: "U002",
    email: "vizag@sail.in",
    name: "Vizag Port User",
    role: "PortUser",
    assigned_location: "VIZAG",
    port_id: "VIZAG",
  },
  {
    id: "U003",
    email: "bhilai@sail.in",
    name: "Bhilai Plant User",
    role: "PlantUser",
    assigned_location: "BSP",
    plant_id: "BSP",
  },
  {
    id: "U004",
    email: "rourkela@sail.in",
    name: "Rourkela Plant User",
    role: "PlantUser",
    assigned_location: "RSP",
    plant_id: "RSP",
  },
  {
    id: "U005",
    email: "paradip@sail.in",
    name: "Paradip Port User",
    role: "PortUser",
    assigned_location: "PARA",
    port_id: "PARA",
  },
  { id: "U006", email: "admin@sail.in", name: "System Admin", role: "Admin" },
]

export const getMockShipments = () => mockShipments
export const addMockShipment = (shipment: Shipment) => {
  mockShipments.push(shipment)
}
export const updateMockShipment = (id: string, updates: Partial<Shipment>) => {
  const index = mockShipments.findIndex((s) => s.id === id)
  if (index !== -1) {
    mockShipments[index] = { ...mockShipments[index], ...updates }
  }
}
export const deleteMockShipment = (id: string) => {
  mockShipments = mockShipments.filter((s) => s.id !== id)
}

export const getMockUsers = () => mockUsers
export const findUserByEmail = (email: string) => mockUsers.find((u) => u.email === email)

export const getPlantEvents = (plantId?: string) =>
  plantId ? plantEvents.filter((e) => e.plant_id === plantId) : plantEvents

export const addPlantEvent = (event: Omit<PlantEvent, "id">) => {
  const newEvent = { ...event, id: `PE${Date.now()}` }
  plantEvents.push(newEvent)

  // Update current stock
  updatePlantStock(event.plant_id, event.material, event.quantity_t, event.event_type)
  return newEvent
}

export const getPortEvents = (portId?: string) => (portId ? portEvents.filter((e) => e.port_id === portId) : portEvents)

export const addPortEvent = (event: Omit<PortEvent, "id">) => {
  const newEvent = { ...event, id: `POE${Date.now()}` }
  portEvents.push(newEvent)

  // Update port stock
  updatePortStock(event.port_id, event.material, event.quantity_t, event.event_type)
  return newEvent
}

export const getVesselEvents = (portId?: string) =>
  portId ? vesselEvents.filter((e) => e.port_id === portId) : vesselEvents

export const addVesselEvent = (event: Omit<VesselEvent, "id">) => {
  const newEvent = { ...event, id: `VE${Date.now()}` }
  vesselEvents.push(newEvent)

  // Update port congestion
  updatePortCongestion(event.port_id)
  return newEvent
}

export const getCurrentStock = (locationId: string, material?: string) => {
  if (material) {
    return currentStocks.find((s) => s.location_id === locationId && s.material === material)
  }
  return currentStocks.filter((s) => s.location_id === locationId)
}

export const getAllCurrentStocks = () => currentStocks

export const getPortCongestion = (portId: string) =>
  portCongestions.find((c) => c.port_id === portId) || {
    port_id: portId,
    vessels_at_anchorage: 0,
    vessels_at_berth: 0,
    congestion_score: 0,
    last_updated: new Date().toISOString(),
  }

function updatePlantStock(plantId: string, material: string, quantityChange: number, eventType: string) {
  const stock = currentStocks.find((s) => s.location_id === plantId && s.material === material)
  const plant = PLANTS.find((p) => p.code === plantId)

  if (stock && plant) {
    // Calculate new stock based on event type
    if (eventType === "rake_arrival" || eventType === "manual_adjust") {
      stock.stock_t += quantityChange
    } else if (eventType === "consumption") {
      stock.stock_t -= quantityChange
    }

    // Calculate days of cover
    const dailyDemand =
      material === "coking_coal" ? plant.annual_coking_import_t / 365 : plant.annual_limestone_import_t / 365
    stock.days_cover = stock.stock_t / dailyDemand
    stock.last_updated = new Date().toISOString()
  }
}

function updatePortStock(portId: string, material: string, quantityChange: number, eventType: string) {
  let stock = currentStocks.find((s) => s.location_id === portId && s.material === material)

  if (!stock) {
    stock = {
      location_id: portId,
      location_type: "port",
      material: material as "coking_coal" | "limestone",
      stock_t: 0,
      last_updated: new Date().toISOString(),
    }
    currentStocks.push(stock)
  }

  // Update stock based on event type
  if (eventType === "vessel_discharge" || eventType === "manual_adjust") {
    stock.stock_t += quantityChange
  } else if (eventType === "rake_loading") {
    stock.stock_t -= quantityChange
  }

  stock.last_updated = new Date().toISOString()
}

function updatePortCongestion(portId: string) {
  const vesselEventsAtPort = vesselEvents.filter((e) => e.port_id === portId)

  // Count current vessels by status
  const vesselsAtAnchorage = vesselEventsAtPort.filter(
    (e) =>
      e.event_type === "arrived_anchorage" &&
      !vesselEventsAtPort.some(
        (e2) => e2.vessel_id === e.vessel_id && e2.event_type === "sailed" && e2.date_time > e.date_time,
      ),
  ).length

  const vesselsAtBerth = vesselEventsAtPort.filter(
    (e) =>
      e.event_type === "berthed" &&
      !vesselEventsAtPort.some(
        (e2) => e2.vessel_id === e.vessel_id && e2.event_type === "sailed" && e2.date_time > e.date_time,
      ),
  ).length

  const port = PORTS.find((p) => p.code === portId)
  const congestionScore = port ? (vesselsAtAnchorage * 0.3 + vesselsAtBerth * 0.7) / port.panamax_berths : 0

  const existingCongestion = portCongestions.find((c) => c.port_id === portId)
  if (existingCongestion) {
    existingCongestion.vessels_at_anchorage = vesselsAtAnchorage
    existingCongestion.vessels_at_berth = vesselsAtBerth
    existingCongestion.congestion_score = congestionScore
    existingCongestion.last_updated = new Date().toISOString()
  } else {
    portCongestions.push({
      port_id: portId,
      vessels_at_anchorage: vesselsAtAnchorage,
      vessels_at_berth: vesselsAtBerth,
      congestion_score: congestionScore,
      last_updated: new Date().toISOString(),
    })
  }
}
