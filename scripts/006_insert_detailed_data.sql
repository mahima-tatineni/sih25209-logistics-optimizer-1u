-- ============================================================================
-- SAIL LOGISTICS OPTIMIZER - DETAILED DATA INSERTION
-- Script 006: Insert comprehensive real-world data based on specifications
-- ============================================================================

-- This script inserts detailed realistic data for:
-- 1. Plant operational parameters
-- 2. Port specifications and tariffs  
-- 3. Complete rail route network
-- 4. Comprehensive sea routes with waypoints
-- 5. Sample shipments and operational data
-- 6. Cost parameters

-- ============================================================================
-- SECTION 1: UPDATE PLANTS WITH DETAILED OPERATIONAL DATA
-- ============================================================================

-- Update plants table with precise capacities and demands based on research
UPDATE plants SET
  latitude = 21.21,
  longitude = 81.38,
  crude_capacity_mtpa = 7.5,
  annual_coking_import_t = 4200000,  -- 30% of total
  annual_limestone_import_t = 900000,  -- 30% of total
  daily_coking_demand_t = 11507,
  daily_limestone_demand_t = 2466,
  min_days_cover = 15,
  target_days_cover = 30
WHERE code = 'BSP';

UPDATE plants SET
  latitude = 22.23,
  longitude = 84.87,
  crude_capacity_mtpa = 4.5,
  annual_coking_import_t = 2800000,  -- 20% of total
  annual_limestone_import_t = 600000,  -- 20% of total
  daily_coking_demand_t = 7671,
  daily_limestone_demand_t = 1644,
  min_days_cover = 15,
  target_days_cover = 30
WHERE code = 'RSP';

UPDATE plants SET
  latitude = 23.78,
  longitude = 86.02,
  crude_capacity_mtpa = 4.5,
  annual_coking_import_t = 3500000,  -- 25% of total
  annual_limestone_import_t = 750000,  -- 25% of total
  daily_coking_demand_t = 9589,
  daily_limestone_demand_t = 2055,
  min_days_cover = 15,
  target_days_cover = 30
WHERE code = 'BSL';

UPDATE plants SET
  latitude = 23.55,
  longitude = 87.29,
  crude_capacity_mtpa = 2.5,
  annual_coking_import_t = 2100000,  -- 15% of total
  annual_limestone_import_t = 450000,  -- 15% of total
  daily_coking_demand_t = 5753,
  daily_limestone_demand_t = 1233,
  min_days_cover = 15,
  target_days_cover = 30
WHERE code = 'DSP';

UPDATE plants SET
  latitude = 23.68,
  longitude = 86.96,
  crude_capacity_mtpa = 2.0,
  annual_coking_import_t = 1400000,  -- 10% of total
  annual_limestone_import_t = 300000,  -- 10% of total
  daily_coking_demand_t = 3836,
  daily_limestone_demand_t = 822,
  min_days_cover = 15,
  target_days_cover = 30
WHERE code = 'ISP';

-- ============================================================================
-- SECTION 2: UPDATE PORTS WITH DETAILED SPECIFICATIONS
-- ============================================================================

UPDATE ports SET
  latitude = 17.70,
  longitude = 83.30,
  max_draft_m = 16.0,
  panamax_berths = 3,
  annual_coal_capacity_mt = 25.0,
  storage_capacity_t = 1000000,
  free_storage_days = 7,
  storage_charge_inr_t_day = 5.00,
  handling_charge_inr_t = 110.00,
  port_dues_inr_t = 10.00
WHERE code = 'VIZAG';

UPDATE ports SET
  latitude = 17.65,
  longitude = 83.28,
  max_draft_m = 18.0,
  panamax_berths = 3,
  annual_coal_capacity_mt = 20.0,
  storage_capacity_t = 800000,
  free_storage_days = 7,
  storage_charge_inr_t_day = 5.00,
  handling_charge_inr_t = 115.00,
  port_dues_inr_t = 12.00
WHERE code = 'GANG';

UPDATE ports SET
  latitude = 20.27,
  longitude = 86.62,
  max_draft_m = 18.0,
  panamax_berths = 4,
  annual_coal_capacity_mt = 40.0,
  storage_capacity_t = 1500000,
  free_storage_days = 7,
  storage_charge_inr_t_day = 4.00,
  handling_charge_inr_t = 100.00,
  port_dues_inr_t = 9.00
WHERE code = 'PARA';

UPDATE ports SET
  latitude = 20.89,
  longitude = 86.97,
  max_draft_m = 18.0,
  panamax_berths = 3,
  annual_coal_capacity_mt = 25.0,
  storage_capacity_t = 1000000,
  free_storage_days = 7,
  storage_charge_inr_t_day = 4.00,
  handling_charge_inr_t = 105.00,
  port_dues_inr_t = 9.00
WHERE code = 'DHAM';

UPDATE ports SET
  latitude = 22.03,
  longitude = 88.12,
  max_draft_m = 8.5,  -- Riverine constraint
  panamax_berths = 2,
  annual_coal_capacity_mt = 15.0,
  storage_capacity_t = 600000,
  free_storage_days = 7,
  storage_charge_inr_t_day = 6.00,
  handling_charge_inr_t = 120.00,
  port_dues_inr_t = 12.00
WHERE code = 'HALD';

-- ============================================================================
-- SECTION 3: UPDATE SUPPLIER PORTS WITH COORDINATES
-- ============================================================================

UPDATE supplier_ports SET latitude = -23.85, longitude = 151.27 WHERE code = 'GLAD_AU';
UPDATE supplier_ports SET latitude = -21.30, longitude = 149.30 WHERE code = 'HAYP_AU';
UPDATE supplier_ports SET latitude = -25.97, longitude = 32.58 WHERE code = 'MAPU_MZ';
UPDATE supplier_ports SET latitude = 68.97, longitude = 33.08 WHERE code = 'MURM_RU';
UPDATE supplier_ports SET latitude = -32.92, longitude = 151.78 WHERE code = 'NEWC_AU';
UPDATE supplier_ports SET latitude = 25.05, longitude = 55.14 WHERE code = 'JEBE_UAE';
UPDATE supplier_ports SET latitude = -27.38, longitude = 153.17 WHERE code = 'BRIS_AU';
UPDATE supplier_ports SET latitude = 36.07, longitude = 120.38 WHERE code = 'QING_CN';
UPDATE supplier_ports SET latitude = -28.78, longitude = 32.08 WHERE code = 'RICH_ZA';
UPDATE supplier_ports SET latitude = 49.29, longitude = -123.11 WHERE code = 'VANC_CA';

-- ============================================================================
-- SECTION 4: INSERT COMPREHENSIVE RAIL ROUTES
-- ============================================================================

-- Get IDs for reference
DO $$
DECLARE
  v_vizag_id uuid;
  v_gang_id uuid;
  v_para_id uuid;
  v_dham_id uuid;
  v_hald_id uuid;
  v_bsp_id uuid;
  v_rsp_id uuid;
  v_bsl_id uuid;
  v_dsp_id uuid;
  v_isp_id uuid;
  v_rake_type_id uuid;
BEGIN
  SELECT id INTO v_vizag_id FROM ports WHERE code = 'VIZAG';
  SELECT id INTO v_gang_id FROM ports WHERE code = 'GANG';
  SELECT id INTO v_para_id FROM ports WHERE code = 'PARA';
  SELECT id INTO v_dham_id FROM ports WHERE code = 'DHAM';
  SELECT id INTO v_hald_id FROM ports WHERE code = 'HALD';
  
  SELECT id INTO v_bsp_id FROM plants WHERE code = 'BSP';
  SELECT id INTO v_rsp_id FROM plants WHERE code = 'RSP';
  SELECT id INTO v_bsl_id FROM plants WHERE code = 'BSL';
  SELECT id INTO v_dsp_id FROM plants WHERE code = 'DSP';
  SELECT id INTO v_isp_id FROM plants WHERE code = 'ISP';
  
  SELECT id INTO v_rake_type_id FROM rake_types WHERE code = 'BOXNHL_4000';
  
  -- Insert rail routes (clearing existing first)
  DELETE FROM rail_routes;
  
  -- Vizag routes
  INSERT INTO rail_routes (port_id, plant_id, distance_km, rake_type_id, max_rakes_per_day) VALUES
  (v_vizag_id, v_bsp_id, 950, v_rake_type_id, 8),
  (v_vizag_id, v_rsp_id, 700, v_rake_type_id, 6);
  
  -- Gangavaram routes
  INSERT INTO rail_routes (port_id, plant_id, distance_km, rake_type_id, max_rakes_per_day) VALUES
  (v_gang_id, v_bsp_id, 940, v_rake_type_id, 6),
  (v_gang_id, v_rsp_id, 690, v_rake_type_id, 4);
  
  -- Paradip routes
  INSERT INTO rail_routes (port_id, plant_id, distance_km, rake_type_id, max_rakes_per_day) VALUES
  (v_para_id, v_bsp_id, 1100, v_rake_type_id, 4),
  (v_para_id, v_rsp_id, 400, v_rake_type_id, 10),
  (v_para_id, v_bsl_id, 500, v_rake_type_id, 6),
  (v_para_id, v_dsp_id, 600, v_rake_type_id, 4),
  (v_para_id, v_isp_id, 650, v_rake_type_id, 4);
  
  -- Dhamra routes
  INSERT INTO rail_routes (port_id, plant_id, distance_km, rake_type_id, max_rakes_per_day) VALUES
  (v_dham_id, v_rsp_id, 380, v_rake_type_id, 8),
  (v_dham_id, v_bsl_id, 450, v_rake_type_id, 8),
  (v_dham_id, v_dsp_id, 550, v_rake_type_id, 6);
  
  -- Haldia routes
  INSERT INTO rail_routes (port_id, plant_id, distance_km, rake_type_id, max_rakes_per_day) VALUES
  (v_hald_id, v_rsp_id, 650, v_rake_type_id, 4),
  (v_hald_id, v_bsl_id, 550, v_rake_type_id, 6),
  (v_hald_id, v_dsp_id, 250, v_rake_type_id, 8),
  (v_hald_id, v_isp_id, 280, v_rake_type_id, 6);
END $$;

-- ============================================================================
-- SECTION 5: INSERT SEA ROUTES WITH WAYPOINTS
-- ============================================================================

-- This creates a comprehensive network of routes from all supplier ports
-- to all Indian ports with sample waypoints for key routes

DO $$
DECLARE
  v_route_id uuid;
  -- Supplier port IDs
  v_glad_au uuid; v_hayp_au uuid; v_mapu_mz uuid; v_murm_ru uuid; v_newc_au uuid;
  v_jebe_uae uuid; v_bris_au uuid; v_qing_cn uuid; v_rich_za uuid; v_vanc_ca uuid;
  -- Indian port IDs
  v_vizag uuid; v_gang uuid; v_para uuid; v_dham uuid; v_hald uuid;
BEGIN
  -- Get supplier port IDs
  SELECT id INTO v_glad_au FROM supplier_ports WHERE code = 'GLAD_AU';
  SELECT id INTO v_hayp_au FROM supplier_ports WHERE code = 'HAYP_AU';
  SELECT id INTO v_mapu_mz FROM supplier_ports WHERE code = 'MAPU_MZ';
  SELECT id INTO v_murm_ru FROM supplier_ports WHERE code = 'MURM_RU';
  SELECT id INTO v_newc_au FROM supplier_ports WHERE code = 'NEWC_AU';
  SELECT id INTO v_jebe_uae FROM supplier_ports WHERE code = 'JEBE_UAE';
  SELECT id INTO v_bris_au FROM supplier_ports WHERE code = 'BRIS_AU';
  SELECT id INTO v_qing_cn FROM supplier_ports WHERE code = 'QING_CN';
  SELECT id INTO v_rich_za FROM supplier_ports WHERE code = 'RICH_ZA';
  SELECT id INTO v_vanc_ca FROM supplier_ports WHERE code = 'VANC_CA';
  
  -- Get Indian port IDs
  SELECT id INTO v_vizag FROM ports WHERE code = 'VIZAG';
  SELECT id INTO v_gang FROM ports WHERE code = 'GANG';
  SELECT id INTO v_para FROM ports WHERE code = 'PARA';
  SELECT id INTO v_dham FROM ports WHERE code = 'DHAM';
  SELECT id INTO v_hald FROM ports WHERE code = 'HALD';
  
  -- Clear existing routes and waypoints
  DELETE FROM route_waypoints;
  DELETE FROM routes;
  
  -- HAY POINT (Australia) → Indian Ports with detailed waypoints
  INSERT INTO routes (origin_id, indian_port_id, description) 
  VALUES (v_hayp_au, v_vizag, 'Hay Point → Torres Strait → Bay of Bengal → Visakhapatnam')
  RETURNING id INTO v_route_id;
  
  INSERT INTO route_waypoints (route_id, seq_no, code, description, latitude, longitude) VALUES
  (v_route_id, 1, 'HAYP_PORT', 'Departure Hay Point', -21.30, 149.30),
  (v_route_id, 2, 'CORAL_SEA', 'Coral Sea crossing', -18.00, 152.00),
  (v_route_id, 3, 'TORRES_STR', 'Torres Strait passage', -10.50, 142.00),
  (v_route_id, 4, 'ANDAMAN_SEA', 'Andaman Sea', 10.00, 95.00),
  (v_route_id, 5, 'BAY_BENGAL', 'Mid Bay of Bengal', 15.00, 86.00),
  (v_route_id, 6, 'VIZAG_ANCH', 'Vizag anchorage', 17.70, 83.40),
  (v_route_id, 7, 'VIZAG_PORT', 'Vizag port', 17.70, 83.30);
  
  INSERT INTO routes (origin_id, indian_port_id, description) 
  VALUES (v_hayp_au, v_para, 'Hay Point → Torres Strait → Bay of Bengal → Paradip');
  
  INSERT INTO routes (origin_id, indian_port_id, description) 
  VALUES (v_hayp_au, v_dham, 'Hay Point → Torres Strait → Bay of Bengal → Dhamra');
  
  INSERT INTO routes (origin_id, indian_port_id, description) 
  VALUES (v_hayp_au, v_hald, 'Hay Point → Torres Strait → Bay of Bengal → Haldia');
  
  INSERT INTO routes (origin_id, indian_port_id, description) 
  VALUES (v_hayp_au, v_gang, 'Hay Point → Torres Strait → Bay of Bengal → Gangavaram');
  
  -- GLADSTONE (Australia) → Indian Ports
  INSERT INTO routes (origin_id, indian_port_id, description) VALUES
  (v_glad_au, v_vizag, 'Gladstone → Torres Strait → Bay of Bengal → Visakhapatnam'),
  (v_glad_au, v_para, 'Gladstone → Torres Strait → Bay of Bengal → Paradip'),
  (v_glad_au, v_dham, 'Gladstone → Torres Strait → Bay of Bengal → Dhamra'),
  (v_glad_au, v_hald, 'Gladstone → Torres Strait → Bay of Bengal → Haldia'),
  (v_glad_au, v_gang, 'Gladstone → Torres Strait → Bay of Bengal → Gangavaram');
  
  -- MAPUTO (Mozambique) → Indian Ports
  INSERT INTO routes (origin_id, indian_port_id, description) VALUES
  (v_mapu_mz, v_vizag, 'Maputo → Mozambique Channel → Indian Ocean → Bay of Bengal → Visakhapatnam'),
  (v_mapu_mz, v_para, 'Maputo → Indian Ocean → Bay of Bengal → Paradip'),
  (v_mapu_mz, v_dham, 'Maputo → Indian Ocean → Bay of Bengal → Dhamra'),
  (v_mapu_mz, v_hald, 'Maputo → Indian Ocean → Bay of Bengal → Haldia');
  
  -- RICHARDS BAY (South Africa) → Indian Ports
  INSERT INTO routes (origin_id, indian_port_id, description) VALUES
  (v_rich_za, v_vizag, 'Richards Bay → Indian Ocean → Bay of Bengal → Visakhapatnam'),
  (v_rich_za, v_para, 'Richards Bay → Indian Ocean → Bay of Bengal → Paradip'),
  (v_rich_za, v_dham, 'Richards Bay → Indian Ocean → Bay of Bengal → Dhamra'),
  (v_rich_za, v_hald, 'Richards Bay → Indian Ocean → Bay of Bengal → Haldia');
  
  -- NEWCASTLE (Australia) → Indian Ports
  INSERT INTO routes (origin_id, indian_port_id, description) VALUES
  (v_newc_au, v_vizag, 'Newcastle → Tasman Sea → Torres Strait → Bay of Bengal → Visakhapatnam'),
  (v_newc_au, v_para, 'Newcastle → Torres Strait → Bay of Bengal → Paradip'),
  (v_newc_au, v_dham, 'Newcastle → Torres Strait → Bay of Bengal → Dhamra');
  
  -- BRISBANE (Australia) → Indian Ports
  INSERT INTO routes (origin_id, indian_port_id, description) VALUES
  (v_bris_au, v_vizag, 'Brisbane → Coral Sea → Torres Strait → Bay of Bengal → Visakhapatnam'),
  (v_bris_au, v_para, 'Brisbane → Torres Strait → Bay of Bengal → Paradip');
  
  -- JEBEL ALI (UAE) → Indian Ports
  INSERT INTO routes (origin_id, indian_port_id, description) VALUES
  (v_jebe_uae, v_vizag, 'Jebel Ali → Arabian Sea → Bay of Bengal → Visakhapatnam'),
  (v_jebe_uae, v_para, 'Jebel Ali → Arabian Sea → Bay of Bengal → Paradip'),
  (v_jebe_uae, v_dham, 'Jebel Ali → Arabian Sea → Bay of Bengal → Dhamra'),
  (v_jebe_uae, v_hald, 'Jebel Ali → Arabian Sea → Bay of Bengal → Haldia');
  
  -- QINGDAO (China) → Indian Ports
  INSERT INTO routes (origin_id, indian_port_id, description) VALUES
  (v_qing_cn, v_vizag, 'Qingdao → South China Sea → Malacca Strait → Bay of Bengal → Visakhapatnam'),
  (v_qing_cn, v_para, 'Qingdao → Malacca Strait → Bay of Bengal → Paradip'),
  (v_qing_cn, v_dham, 'Qingdao → Malacca Strait → Bay of Bengal → Dhamra'),
  (v_qing_cn, v_hald, 'Qingdao → Malacca Strait → Bay of Bengal → Haldia');
  
  -- MURMANSK (Russia) → Indian Ports
  INSERT INTO routes (origin_id, indian_port_id, description) VALUES
  (v_murm_ru, v_para, 'Murmansk → Barents → Suez Canal → Red Sea → Arabian Sea → Bay of Bengal → Paradip'),
  (v_murm_ru, v_hald, 'Murmansk → Barents → Suez → Arabian Sea → Bay of Bengal → Haldia');
  
  -- VANCOUVER (Canada) → Indian Ports
  INSERT INTO routes (origin_id, indian_port_id, description) VALUES
  (v_vanc_ca, v_vizag, 'Vancouver → North Pacific → around Australia → Indian Ocean → Visakhapatnam'),
  (v_vanc_ca, v_para, 'Vancouver → Pacific → Indian Ocean → Paradip'),
  (v_vanc_ca, v_dham, 'Vancouver → Pacific → Indian Ocean → Dhamra'),
  (v_vanc_ca, v_hald, 'Vancouver → Pacific → Indian Ocean → Haldia');
  
END $$;

-- ============================================================================
-- SECTION 6: INSERT SAMPLE SHIPMENTS
-- ============================================================================

DO $$
DECLARE
  v_shipment_id uuid;
BEGIN
  -- Sample shipments from various origins
  -- Shipment 1: Hay Point → Visakhapatnam (MV ARJUN)
  INSERT INTO shipments (
    ref_no, vessel_id, material, quality_grade, incoterm,
    supplier_port_id, loadport_eta, laycan_start, laycan_end,
    sail_date, base_eta_india, candidate_ports, quantity_t, status
  ) SELECT
    'SAIL-2025-001',
    v.id,
    'COKING_COAL',
    'Prime',
    'CFR',
    sp.id,
    CURRENT_DATE + INTERVAL '2 days',
    CURRENT_DATE + INTERVAL '5 days',
    CURRENT_DATE + INTERVAL '7 days',
    CURRENT_DATE + INTERVAL '10 days',
    CURRENT_DATE + INTERVAL '30 days',
    ARRAY['VIZAG', 'GANG'],
    70000,
    'IN_TRANSIT'
  FROM vessels v, supplier_ports sp
  WHERE v.code = 'V_ARJUN' AND sp.code = 'HAYP_AU'
  RETURNING id INTO v_shipment_id;
  
  -- Add vessel event for this shipment
  INSERT INTO vessel_events (vessel_id, shipment_id, port_id, event_type, event_time)
  SELECT v.id, v_shipment_id, NULL, 'planned', CURRENT_TIMESTAMP
  FROM vessels v WHERE v.code = 'V_ARJUN';
  
  -- Shipment 2: Richards Bay → Paradip (MV SHAKTI)
  INSERT INTO shipments (
    ref_no, vessel_id, material, quality_grade, incoterm,
    supplier_port_id, laycan_start, laycan_end,
    base_eta_india, candidate_ports, quantity_t, status
  ) SELECT
    'SAIL-2025-002',
    v.id,
    'COKING_COAL',
    'Semi Soft',
    'CFR',
    sp.id,
    CURRENT_DATE + INTERVAL '10 days',
    CURRENT_DATE + INTERVAL '12 days',
    CURRENT_DATE + INTERVAL '35 days',
    ARRAY['PARA', 'DHAM'],
    75000,
    'PLANNED'
  FROM vessels v, supplier_ports sp
  WHERE v.code = 'V_SHAKTI' AND sp.code = 'RICH_ZA';
  
  -- Shipment 3: Maputo → Haldia (MV VIKRAM)
  INSERT INTO shipments (
    ref_no, vessel_id, material, quality_grade, incoterm,
    supplier_port_id, laycan_start, laycan_end,
    base_eta_india, candidate_ports, quantity_t, status
  ) SELECT
    'SAIL-2025-003',
    v.id,
    'LIMESTONE',
    'High Grade',
    'FOB',
    sp.id,
    CURRENT_DATE + INTERVAL '15 days',
    CURRENT_DATE + INTERVAL '17 days',
    CURRENT_DATE + INTERVAL '42 days',
    ARRAY['HALD', 'PARA'],
    55000,
    'PLANNED'
  FROM vessels v, supplier_ports sp
  WHERE v.code = 'V_VIKRAM' AND sp.code = 'MAPU_MZ';
  
END $$;

-- ============================================================================
-- SECTION 7: INSERT COST PARAMETERS
-- ============================================================================

DO $$
DECLARE
  v_hayp_id uuid;
  v_rich_id uuid;
  v_vizag_id uuid;
  v_para_id uuid;
  v_hald_id uuid;
BEGIN
  SELECT id INTO v_hayp_id FROM supplier_ports WHERE code = 'HAYP_AU';
  SELECT id INTO v_rich_id FROM supplier_ports WHERE code = 'RICH_ZA';
  SELECT id INTO v_vizag_id FROM ports WHERE code = 'VIZAG';
  SELECT id INTO v_para_id FROM ports WHERE code = 'PARA';
  SELECT id INTO v_hald_id FROM ports WHERE code = 'HALD';
  
  INSERT INTO cost_params (
    valid_from, valid_to, material, origin_id, port_id,
    ocean_freight_usd_t, ocean_diff_usd_t, demurrage_usd_day,
    handling_inr_t, storage_inr_t_day, rail_freight_inr_t, fx_usd_inr
  ) VALUES
  -- Hay Point to Vizag
  (CURRENT_DATE, CURRENT_DATE + INTERVAL '6 months', 'COKING_COAL', v_hayp_id, v_vizag_id,
   18.50, 2.00, 25000, 110.00, 5.00, 450.00, 85.00),
  
  -- Hay Point to Paradip
  (CURRENT_DATE, CURRENT_DATE + INTERVAL '6 months', 'COKING_COAL', v_hayp_id, v_para_id,
   17.80, 1.80, 25000, 100.00, 4.00, 480.00, 85.00),
  
  -- Richards Bay to Paradip
  (CURRENT_DATE, CURRENT_DATE + INTERVAL '6 months', 'COKING_COAL', v_rich_id, v_para_id,
   22.00, 2.50, 25000, 100.00, 4.00, 480.00, 85.00),
  
  -- Richards Bay to Haldia
  (CURRENT_DATE, CURRENT_DATE + INTERVAL '6 months', 'COKING_COAL', v_rich_id, v_hald_id,
   23.50, 3.00, 25000, 120.00, 6.00, 420.00, 85.00);
  
END $$;

-- ============================================================================
-- SECTION 8: INSERT INITIAL STOCK LEVELS
-- ============================================================================

-- Plant stock (current levels)
INSERT INTO plant_stock (plant_id, material, quality, as_of_date, stock_t)
SELECT 
  p.id,
  'COKING_COAL',
  'Prime',
  CURRENT_DATE,
  p.daily_coking_demand_t * 25  -- 25 days of stock
FROM plants p;

INSERT INTO plant_stock (plant_id, material, quality, as_of_date, stock_t)
SELECT 
  p.id,
  'LIMESTONE',
  'High Grade',
  CURRENT_DATE,
  p.daily_limestone_demand_t * 25  -- 25 days of stock
FROM plants p;

-- Port stock (current yard levels)
INSERT INTO port_stock (port_id, material, quality, as_of_date, stock_t)
SELECT 
  p.id,
  'COKING_COAL',
  'Prime',
  CURRENT_DATE,
  CASE p.code
    WHEN 'VIZAG' THEN 150000
    WHEN 'PARA' THEN 200000
    WHEN 'DHAM' THEN 180000
    WHEN 'HALD' THEN 100000
    WHEN 'GANG' THEN 120000
  END
FROM ports p;

-- ============================================================================
-- SCRIPT COMPLETE
-- ============================================================================

-- Verify data insertion
SELECT 'Data insertion complete!' as status;
SELECT 
  'plants' as table_name, COUNT(*) as count FROM plants
UNION ALL
SELECT 'ports', COUNT(*) FROM ports
UNION ALL
SELECT 'supplier_ports', COUNT(*) FROM supplier_ports
UNION ALL
SELECT 'vessels', COUNT(*) FROM vessels
UNION ALL
SELECT 'rail_routes', COUNT(*) FROM rail_routes
UNION ALL
SELECT 'routes', COUNT(*) FROM routes
UNION ALL
SELECT 'route_waypoints', COUNT(*) FROM route_waypoints
UNION ALL
SELECT 'shipments', COUNT(*) FROM shipments
UNION ALL
SELECT 'cost_params', COUNT(*) FROM cost_params
UNION ALL
SELECT 'plant_stock', COUNT(*) FROM plant_stock
UNION ALL
SELECT 'port_stock', COUNT(*) FROM port_stock;
