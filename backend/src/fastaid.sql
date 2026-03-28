CREATE TYPE incident_status AS ENUM ('ABERTO', 'FECHADO');

CREATE TABLE incident (
    id UUID PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(200) NOT NULL,
    lat DOUBLE PRECISION,
    lon DOUBLE PRECISION,
    place TEXT,
    phone VARCHAR(16) NOT NULL CHECK (phone ~ '^\+?[1-9][0-9]{7,14}$'),
    transcription TEXT NOT NULL,
    report TEXT NOT NULL,
    status incident_status NOT NULL DEFAULT 'ABERTO',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO incident (
    id, title, description, lat, lon, place, phone,
    transcription, report, status, created_at, updated_at
) VALUES

-- 1
(
 '9f1c2a5e-1b4d-4f6b-9c2d-1a2b3c4d5e01',
 'Multi-vehicle collision on A1 near Lisbon',
 'Three cars involved in a high-speed collision causing injuries and traffic blockage.',
 38.8801, -9.0324,
 'A1 Highway near Lisbon, Portugal',
 '+351912345001',
 'There has been a big crash, three cars, people are hurt and one is not moving!',
 'Three-vehicle high-speed collision on A1. One unconscious victim. INEM must dispatch ALS units. Bombeiros required for extraction. Polícia to block lanes and redirect traffic. Access via A1 northbound with diversion routes activated.',
 'ABERTO',
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP
),

-- 2
(
 '9f1c2a5e-1b4d-4f6b-9c2d-1a2b3c4d5e02',
 'Motorcycle accident in downtown Porto',
 'Motorcycle lost control and collided with a parked vehicle.',
 41.1496, -8.6109,
 'Porto city center, Portugal',
 '+351912345002',
 'Motorbike crashed into a parked car, driver bleeding heavily.',
 'Motorcycle accident with possible head trauma. INEM urgent dispatch. Polícia to secure urban zone. Bombeiros to mitigate fire risk. Access through central Porto arteries.',
 'ABERTO',
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP
),

-- 3
(
 '9f1c2a5e-1b4d-4f6b-9c2d-1a2b3c4d5e03',
 'Head-on collision in rural Coimbra road',
 'Two vehicles collided head-on in a narrow road.',
 40.2110, -8.4292,
 'Rural road near Coimbra, Portugal',
 '+351912345003',
 'Two cars hit head on, both drivers trapped!',
 'Head-on collision with entrapment. Bombeiros required for extraction. INEM trauma support needed. GNR to coordinate rural access routes and ensure safe transport.',
 'ABERTO',
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP
),

-- 4
(
 '9f1c2a5e-1b4d-4f6b-9c2d-1a2b3c4d5e04',
 'Pedestrian struck by car in Braga',
 'Vehicle hit a pedestrian at a crosswalk.',
 41.5454, -8.4265,
 'Braga city center, Portugal',
 '+351912345004',
 'A car hit someone crossing, they are not moving!',
 'Pedestrian unconscious. INEM critical response needed. Polícia to isolate area. Bombeiros assist stabilization. Fast urban access required.',
 'ABERTO',
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP
),

-- 5
(
 '9f1c2a5e-1b4d-4f6b-9c2d-1a2b3c4d5e05',
 'Truck overturned on A2 highway',
 'Heavy truck overturned blocking lanes.',
 38.2030, -8.3790,
 'A2 Highway, Portugal',
 '+351912345005',
 'Truck flipped over, driver trapped!',
 'Overturned truck blocking lanes. Bombeiros extraction required. INEM for trauma. Polícia to divert traffic. Assess hazardous cargo risk.',
 'ABERTO',
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP
),

-- 6
(
 '9f1c2a5e-1b4d-4f6b-9c2d-1a2b3c4d5e06',
 'Rear-end collision in Faro during rain',
 'Multiple vehicles collided due to slippery road.',
 37.0194, -7.9304,
 'Faro, Portugal',
 '+351912345006',
 'Cars keep crashing, road is slippery!',
 'Chain collision due to weather. INEM deploy multiple ambulances. Polícia control traffic. Bombeiros clear debris and prevent hazards.',
 'FECHADO',
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP
),

-- 7
(
 '9f1c2a5e-1b4d-4f6b-9c2d-1a2b3c4d5e07',
 'Car fell into ditch in Alentejo',
 'Vehicle left road and fell into ditch.',
 38.5714, -7.9135,
 'Alentejo rural road, Portugal',
 '+351912345007',
 'Car went off road, driver trapped!',
 'Vehicle off-road in rural terrain. Bombeiros extraction needed. INEM stabilization. GNR coordinate access through rural paths.',
 'ABERTO',
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP
),

-- 8
(
 '9f1c2a5e-1b4d-4f6b-9c2d-1a2b3c4d5e08',
 'Hit-and-run in Setúbal',
 'Driver fled after collision.',
 38.5244, -8.8882,
 'Setúbal, Portugal',
 '+351912345008',
 'Driver hit another and ran away!',
 'Hit-and-run incident. INEM assist injured driver. Polícia investigate and secure scene. Traffic managed to avoid congestion.',
 'ABERTO',
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP
),

-- 9
(
 '9f1c2a5e-1b4d-4f6b-9c2d-1a2b3c4d5e09',
 'Bus accident near Leiria',
 'Bus collided with roadside barrier.',
 39.7436, -8.8071,
 'Leiria, Portugal',
 '+351912345009',
 'Bus crashed, many people inside screaming!',
 'Bus accident with multiple passengers. INEM triage needed. Bombeiros assist evacuation. Polícia secure road and redirect traffic.',
 'ABERTO',
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP
),

-- 10
(
 '9f1c2a5e-1b4d-4f6b-9c2d-1a2b3c4d5e10',
 'Car fire after crash on 25 de Abril Bridge',
 'Vehicle caught fire after impact.',
 38.6916, -9.1771,
 '25 de Abril Bridge, Lisbon, Portugal',
 '+351912345010',
 'Car crashed and is on fire, someone may be inside!',
 'Critical fire after collision. Bombeiros immediate suppression and rescue. INEM prepare for burns. Polícia close bridge sections and reroute traffic urgently.',
 'ABERTO',
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP
);