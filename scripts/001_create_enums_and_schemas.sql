-- Create enums for SAIL Logistics Optimizer
CREATE TYPE user_role_enum AS ENUM ('Admin', 'CentralPlanner', 'PlantUser', 'PortUser');
CREATE TYPE material_enum AS ENUM ('COKING_COAL', 'LIMESTONE');
CREATE TYPE event_type_plant_enum AS ENUM ('rake_arrival', 'consumption', 'manual_adjust');
CREATE TYPE event_type_port_enum AS ENUM ('vessel_discharge', 'rake_loading', 'manual_adjust');
CREATE TYPE event_type_vessel_enum AS ENUM ('planned', 'arrived_anchorage', 'berthed', 'sailed');
CREATE TYPE incoterm_enum AS ENUM ('FOB', 'CFR', 'CIF');
CREATE TYPE risk_level_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH');
