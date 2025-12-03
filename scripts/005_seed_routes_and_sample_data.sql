-- Seed some routes
INSERT INTO routes (origin_id, indian_port_id, description)
SELECT sp.id, p.id, sp.name || ' to ' || p.name
FROM supplier_ports sp
CROSS JOIN ports p
WHERE sp.code IN ('HAYP_AU', 'GLAD_AU', 'RICH_ZA', 'QING_CN')
  AND p.code IN ('VIZAG', 'PARA', 'DHAM', 'HALD');

-- Seed sample shipments
INSERT INTO shipments (ref_no, vessel_id, material, quality_grade, incoterm, supplier_port_id, laycan_start, laycan_end, sail_date, base_eta_india, candidate_ports, quantity_t, status)
SELECT 
  'STEM-2025-' || LPAD((ROW_NUMBER() OVER())::text, 3, '0'),
  v.id,
  (ARRAY['COKING_COAL', 'LIMESTONE']::material_enum[])[1 + floor(random() * 2)],
  'Grade A',
  'CFR'::incoterm_enum,
  sp.id,
  CURRENT_DATE + (floor(random() * 30))::integer,
  CURRENT_DATE + (floor(random() * 30) + 3)::integer,
  CURRENT_TIMESTAMP + (floor(random() * 40) || ' days')::interval,
  CURRENT_TIMESTAMP + (floor(random() * 60) + 20 || ' days')::interval,
  ARRAY['VIZAG', 'PARA', 'DHAM'],
  65000 + floor(random() * 10000),
  'PLANNED'
FROM vessels v
CROSS JOIN supplier_ports sp
WHERE sp.code IN ('HAYP_AU', 'GLAD_AU', 'RICH_ZA')
LIMIT 5;

-- Seed sample cost parameters
INSERT INTO cost_params (valid_from, material, origin_id, port_id, ocean_freight_usd_t, ocean_diff_usd_t, demurrage_usd_day, handling_inr_t, storage_inr_t_day, rail_freight_inr_t, fx_usd_inr)
SELECT 
  CURRENT_DATE - 30,
  'COKING_COAL'::material_enum,
  sp.id,
  p.id,
  45.00 + random() * 10,
  -5.00 + random() * 10,
  25000,
  p.handling_charge_inr_t,
  p.storage_charge_inr_t_day,
  1.5,
  85.00
FROM supplier_ports sp
CROSS JOIN ports p
WHERE sp.code IN ('HAYP_AU', 'GLAD_AU')
  AND p.code IN ('VIZAG', 'PARA')
LIMIT 4;

-- Seed initial plant stock
INSERT INTO plant_stock (plant_id, material, as_of_date, stock_t)
SELECT 
  p.id,
  m::material_enum,
  CURRENT_DATE,
  CASE 
    WHEN m = 'COKING_COAL' THEN p.daily_coking_demand_t * 25
    ELSE p.daily_limestone_demand_t * 25
  END
FROM plants p
CROSS JOIN unnest(ARRAY['COKING_COAL', 'LIMESTONE']) AS m;

-- Seed initial port stock
INSERT INTO port_stock (port_id, material, as_of_date, stock_t)
SELECT 
  p.id,
  m::material_enum,
  CURRENT_DATE,
  50000 + random() * 100000
FROM ports p
CROSS JOIN unnest(ARRAY['COKING_COAL', 'LIMESTONE']) AS m;
