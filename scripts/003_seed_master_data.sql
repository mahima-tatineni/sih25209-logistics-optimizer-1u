-- Seed 5 SAIL plants
INSERT INTO plants (code, name, state, latitude, longitude, crude_capacity_mtpa, annual_coking_import_t, annual_limestone_import_t, daily_coking_demand_t, daily_limestone_demand_t)
VALUES
  ('BSP', 'Bhilai Steel Plant', 'Chhattisgarh', 21.21, 81.38, 7.5, 4200000, 900000, 11507, 2466),
  ('RSP', 'Rourkela Steel Plant', 'Odisha', 22.23, 84.87, 4.5, 2800000, 600000, 7671, 1644),
  ('BSL', 'Bokaro Steel Plant', 'Jharkhand', 23.78, 86.02, 4.5, 3500000, 750000, 9589, 2055),
  ('DSP', 'Durgapur Steel Plant', 'West Bengal', 23.55, 87.29, 2.5, 2100000, 450000, 5753, 1233),
  ('ISP', 'IISCO Steel Plant', 'West Bengal', 23.68, 86.96, 2.0, 1400000, 300000, 3836, 822);

-- Seed 5 Indian discharge ports
INSERT INTO ports (code, name, state, type, latitude, longitude, max_draft_m, panamax_berths, annual_coal_capacity_mt, storage_capacity_t, storage_charge_inr_t_day, handling_charge_inr_t, port_dues_inr_t)
VALUES
  ('VIZAG', 'Visakhapatnam Port', 'Andhra Pradesh', 'deep_sea', 17.7, 83.3, 16.0, 3, 25.0, 1000000, 5, 120, 10),
  ('GANG', 'Gangavaram Port', 'Andhra Pradesh', 'deep_sea', 17.63, 83.24, 18.0, 3, 20.0, 800000, 5, 120, 12),
  ('PARA', 'Paradip Port', 'Odisha', 'deep_sea', 20.26, 86.61, 18.0, 4, 40.0, 1500000, 4, 110, 9),
  ('DHAM', 'Dhamra Port', 'Odisha', 'deep_sea', 20.87, 87.07, 18.0, 3, 25.0, 1000000, 4, 110, 9),
  ('HALD', 'Haldia Dock Complex', 'West Bengal', 'riverine', 22.02, 88.06, 8.5, 2, 15.0, 600000, 6, 130, 12);

-- Seed 10 supplier ports
INSERT INTO supplier_ports (code, name, country, latitude, longitude)
VALUES
  ('GLAD_AU', 'Gladstone', 'Australia', -23.85, 151.26),
  ('HAYP_AU', 'Hay Point', 'Australia', -21.28, 149.30),
  ('MAPU_MZ', 'Maputo', 'Mozambique', -25.97, 32.58),
  ('MURM_RU', 'Murmansk', 'Russia', 68.97, 33.08),
  ('NEWC_AU', 'Newcastle', 'Australia', -32.93, 151.78),
  ('JEBE_UAE', 'Port Jebel Ali', 'UAE', 25.01, 55.03),
  ('BRIS_AU', 'Port of Brisbane', 'Australia', -27.38, 153.17),
  ('QING_CN', 'Qingdao', 'China', 36.07, 120.38),
  ('RICH_ZA', 'Richards Bay', 'South Africa', -28.78, 32.04),
  ('VANC_CA', 'Vancouver', 'Canada', 49.28, -123.12);

-- Seed 9 vessels
INSERT INTO vessels (code, name, max_cargo_t)
VALUES
  ('V_ARJUN', 'MV ARJUN', 70000),
  ('V_BHIMA', 'MV BHIMA', 55000),
  ('V_DHARMA', 'MV DHARMA', 65000),
  ('V_INDRA', 'MV INDRA', 68000),
  ('V_NAKULA', 'MV NAKULA', 73000),
  ('V_SAHADEV', 'MV SAHADEVA', 58000),
  ('V_SHAKTI', 'MV SHAKTI', 75000),
  ('V_VIKRAM', 'MV VIKRAM', 72000),
  ('V_YUDHI', 'MV YUDHISTHIRA', 60000);

-- Seed rake type
INSERT INTO rake_types (code, name, wagons_per_rake, payload_per_wagon_t, rake_capacity_t)
VALUES
  ('BOXNHL_4000', 'BOXNHL 4000T', 58, 71.08, 4000);

-- Seed rail routes
INSERT INTO rail_routes (port_id, plant_id, distance_km, rake_type_id, max_rakes_per_day)
SELECT p.id, pl.id, distance, rt.id, max_rakes
FROM (VALUES
  ('VIZAG', 'BSP', 950, 8),
  ('GANG', 'BSP', 940, 6),
  ('PARA', 'BSP', 1100, 4),
  ('PARA', 'RSP', 400, 10),
  ('DHAM', 'RSP', 380, 8),
  ('HALD', 'RSP', 650, 4),
  ('DHAM', 'BSL', 450, 8),
  ('HALD', 'BSL', 550, 6),
  ('PARA', 'BSL', 500, 4),
  ('HALD', 'DSP', 250, 8),
  ('HALD', 'ISP', 280, 6),
  ('PARA', 'DSP', 600, 4),
  ('PARA', 'ISP', 650, 4)
) AS routes(port_code, plant_code, distance, max_rakes)
JOIN ports p ON p.code = routes.port_code
JOIN plants pl ON pl.code = routes.plant_code
CROSS JOIN rake_types rt
WHERE rt.code = 'BOXNHL_4000';
