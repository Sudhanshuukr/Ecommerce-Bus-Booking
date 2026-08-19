-- ============================================================================
-- Migration: 00002_seed_initial_data.sql
-- Description: Initial seed data matching the frontend mock dataset in src/features/bus/mock/buses.ts
-- ============================================================================

-- 1. SEED OPERATORS
INSERT INTO operators (id, name, rating, review_count) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'IntrCity SmartBus', 4.8, 342),
    ('a0000000-0000-0000-0000-000000000002', 'Zingbus', 4.6, 215),
    ('a0000000-0000-0000-0000-000000000003', 'VRL Travels', 4.9, 512),
    ('a0000000-0000-0000-0000-000000000004', 'UPSRTC Janrath', 4.4, 188),
    ('a0000000-0000-0000-0000-000000000005', 'SRS Travels', 4.7, 290),
    ('a0000000-0000-0000-0000-000000000006', 'KSRTC FlyBus', 4.5, 140),
    ('a0000000-0000-0000-0000-000000000007', 'Greenline Express', 4.7, 198)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED BUSES
INSERT INTO buses (id, operator_id, bus_number, bus_type, total_seats, amenities) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'UP-32-SB-0001', 'Volvo Multi-Axle AC Sleeper (2+1)', 36, ARRAY['WiFi', 'Charging Point', 'Water Bottle', 'Blanket', 'Emergency Support']),
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'DL-01-ZB-0002', 'Luxury AC Seater (2+2)', 40, ARRAY['WiFi', 'USB Charging', 'Reading Light']),
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'KA-01-VT-0003', 'Scania Multi-Axle Premium Sleeper (2+1)', 32, ARRAY['WiFi', 'Personal Screen', 'Charging Point', 'Water Bottle', 'Blanket']),
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 'UP-32-JR-0004', 'AC Semi-Sleeper (2+2)', 44, ARRAY['WiFi', 'Charging Point', 'Water Bottle']),
    ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', 'MH-01-ST-0005', 'Volvo AC Sleeper (2+1)', 36, ARRAY['WiFi', 'Charging Point', 'Blanket', 'Reading Light']),
    ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000006', 'HR-01-FB-0006', 'Volvo AC Seater (2+2)', 40, ARRAY['WiFi', 'USB Charging', 'Water Bottle']),
    ('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000007', 'WB-01-GE-0007', 'Volvo Multi-Axle AC Sleeper (2+1)', 36, ARRAY['WiFi', 'Charging Point', 'Blanket', 'Water Bottle'])
ON CONFLICT (id) DO NOTHING;

-- 3. SEED PHYSICAL BUS_SEATS (Layout template for bus-1)
-- Lower Deck Seater Seats
INSERT INTO bus_seats (bus_id, seat_label, deck, "row", "column", seat_type) VALUES
    ('b0000000-0000-0000-0000-000000000001', '1A', 'lower', 1, 1, 'seater'),
    ('b0000000-0000-0000-0000-000000000001', '1B', 'lower', 1, 2, 'seater'),
    ('b0000000-0000-0000-0000-000000000001', '1C', 'lower', 1, 4, 'seater'),
    ('b0000000-0000-0000-0000-000000000001', '1D', 'lower', 1, 5, 'seater'),

    ('b0000000-0000-0000-0000-000000000001', '2A', 'lower', 2, 1, 'seater'),
    ('b0000000-0000-0000-0000-000000000001', '2B', 'lower', 2, 2, 'seater'),
    ('b0000000-0000-0000-0000-000000000001', '2C', 'lower', 2, 4, 'seater'),
    ('b0000000-0000-0000-0000-000000000001', '2D', 'lower', 2, 5, 'seater'),

    ('b0000000-0000-0000-0000-000000000001', '3A', 'lower', 3, 1, 'seater'),
    ('b0000000-0000-0000-0000-000000000001', '3B', 'lower', 3, 2, 'seater'),
    ('b0000000-0000-0000-0000-000000000001', '3C', 'lower', 3, 4, 'seater'),
    ('b0000000-0000-0000-0000-000000000001', '3D', 'lower', 3, 5, 'seater'),

    ('b0000000-0000-0000-0000-000000000001', '4A', 'lower', 4, 1, 'seater'),
    ('b0000000-0000-0000-0000-000000000001', '4B', 'lower', 4, 2, 'seater'),
    ('b0000000-0000-0000-0000-000000000001', '4C', 'lower', 4, 4, 'seater'),
    ('b0000000-0000-0000-0000-000000000001', '4D', 'lower', 4, 5, 'seater'),

-- Upper Deck Sleeper Berths
    ('b0000000-0000-0000-0000-000000000001', 'U1', 'upper', 1, 1, 'sleeper'),
    ('b0000000-0000-0000-0000-000000000001', 'U2', 'upper', 1, 2, 'sleeper'),
    ('b0000000-0000-0000-0000-000000000001', 'U3', 'upper', 1, 4, 'sleeper'),
    ('b0000000-0000-0000-0000-000000000001', 'U4', 'upper', 1, 5, 'sleeper'),

    ('b0000000-0000-0000-0000-000000000001', 'U5', 'upper', 2, 1, 'sleeper'),
    ('b0000000-0000-0000-0000-000000000001', 'U6', 'upper', 2, 2, 'sleeper'),
    ('b0000000-0000-0000-0000-000000000001', 'U7', 'upper', 2, 4, 'sleeper'),
    ('b0000000-0000-0000-0000-000000000001', 'U8', 'upper', 2, 5, 'sleeper'),

    ('b0000000-0000-0000-0000-000000000001', 'U9', 'upper', 3, 1, 'sleeper'),
    ('b0000000-0000-0000-0000-000000000001', 'U10', 'upper', 3, 2, 'sleeper'),
    ('b0000000-0000-0000-0000-000000000001', 'U11', 'upper', 3, 4, 'sleeper'),
    ('b0000000-0000-0000-0000-000000000001', 'U12', 'upper', 3, 5, 'sleeper')
ON CONFLICT (bus_id, seat_label) DO NOTHING;

-- 4. SEED SCHEDULES
INSERT INTO schedules (id, operator_id, bus_id, origin, destination, departure_time, arrival_time, duration_minutes, price, currency, total_seats, badge) VALUES
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Delhi', 'Lucknow', '2026-08-20 22:30:00+05:30', '2026-08-21 06:30:00+05:30', 480, 899, '₹', 36, 'Top Rated'),
    ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Delhi', 'Jaipur', '2026-08-20 06:00:00+05:30', '2026-08-20 11:30:00+05:30', 330, 599, '₹', 40, 'Cheapest'),
    ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Bengaluru', 'Hyderabad', '2026-08-20 21:00:00+05:30', '2026-08-21 06:00:00+05:30', 540, 1249, '₹', 32, 'Fastest'),
    ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004', 'Delhi', 'Lucknow', '2026-08-20 13:30:00+05:30', '2026-08-20 21:50:00+05:30', 500, 649, '₹', 44, NULL),
    ('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'Mumbai', 'Pune', '2026-08-20 07:15:00+05:30', '2026-08-20 10:45:00+05:30', 210, 399, '₹', 36, 'Popular'),
    ('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000006', 'Delhi', 'Chandigarh', '2026-08-20 14:00:00+05:30', '2026-08-20 19:00:00+05:30', 300, 749, '₹', 40, NULL),
    ('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000007', 'Kolkata', 'Siliguri', '2026-08-20 20:00:00+05:30', '2026-08-21 07:00:00+05:30', 660, 1099, '₹', 36, 'Popular')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED BOARDING_POINTS
INSERT INTO boarding_points (id, schedule_id, name, time, address, sequence_order) VALUES
    ('d0000000-0000-0000-0000-000000000101', 'c0000000-0000-0000-0000-000000000001', 'Kashmere Gate ISBT', '2026-08-20 22:00:00+05:30', 'Kashmere Gate, Delhi 110006', 1),
    ('d0000000-0000-0000-0000-000000000102', 'c0000000-0000-0000-0000-000000000001', 'Anand Vihar ISBT', '2026-08-20 22:30:00+05:30', 'Anand Vihar, Delhi 110092', 2),

    ('d0000000-0000-0000-0000-000000000201', 'c0000000-0000-0000-0000-000000000002', 'Kashmere Gate ISBT', '2026-08-20 05:30:00+05:30', 'Kashmere Gate, Delhi 110006', 1),
    ('d0000000-0000-0000-0000-000000000202', 'c0000000-0000-0000-0000-000000000002', 'Dhaula Kuan', '2026-08-20 06:00:00+05:30', 'Dhaula Kuan Metro Station, Delhi', 2),

    ('d0000000-0000-0000-0000-000000000301', 'c0000000-0000-0000-0000-000000000003', 'Electronic City', '2026-08-20 20:30:00+05:30', 'Toll Plaza, Electronic City, Bengaluru', 1),
    ('d0000000-0000-0000-0000-000000000302', 'c0000000-0000-0000-0000-000000000003', 'Silk Board', '2026-08-20 21:00:00+05:30', 'Silk Board Junction, Bengaluru', 2),

    ('d0000000-0000-0000-0000-000000000401', 'c0000000-0000-0000-0000-000000000004', 'Kashmere Gate ISBT', '2026-08-20 13:00:00+05:30', 'Kashmere Gate, Delhi 110006', 1),
    ('d0000000-0000-0000-0000-000000000402', 'c0000000-0000-0000-0000-000000000004', 'Anand Vihar ISBT', '2026-08-20 13:30:00+05:30', 'Anand Vihar, Delhi 110092', 2),

    ('d0000000-0000-0000-0000-000000000501', 'c0000000-0000-0000-0000-000000000005', 'Borivali East', '2026-08-20 06:30:00+05:30', 'National Park Bridge, Borivali, Mumbai', 1),
    ('d0000000-0000-0000-0000-000000000502', 'c0000000-0000-0000-0000-000000000005', 'Dadar West', '2026-08-20 07:15:00+05:30', 'Asiad Bus Stand, Dadar, Mumbai', 2),

    ('d0000000-0000-0000-0000-000000000601', 'c0000000-0000-0000-0000-000000000006', 'Kashmere Gate ISBT', '2026-08-20 13:30:00+05:30', 'Kashmere Gate, Delhi 110006', 1),
    ('d0000000-0000-0000-0000-000000000602', 'c0000000-0000-0000-0000-000000000006', 'Connaught Place', '2026-08-20 14:00:00+05:30', 'Outer Circle CP, Delhi', 2),

    ('d0000000-0000-0000-0000-000000000701', 'c0000000-0000-0000-0000-000000000007', 'Esplanade', '2026-08-20 19:30:00+05:30', 'Esplanade Bus Terminus, Kolkata', 1),
    ('d0000000-0000-0000-0000-000000000702', 'c0000000-0000-0000-0000-000000000007', 'Karunamoyee Salt Lake', '2026-08-20 20:00:00+05:30', 'Karunamoyee Bus Stand, Kolkata', 2)
ON CONFLICT (id) DO NOTHING;

-- 6. SEED DROPPING_POINTS
INSERT INTO dropping_points (id, schedule_id, name, time, address, sequence_order) VALUES
    ('e0000000-0000-0000-0000-000000000101', 'c0000000-0000-0000-0000-000000000001', 'Alambagh Bus Stand', '2026-08-21 06:00:00+05:30', 'Alambagh, Lucknow, UP 226005', 1),
    ('e0000000-0000-0000-0000-000000000102', 'c0000000-0000-0000-0000-000000000001', 'Charbagh Bus Station', '2026-08-21 06:30:00+05:30', 'Charbagh, Lucknow, UP 226001', 2),

    ('e0000000-0000-0000-0000-000000000201', 'c0000000-0000-0000-0000-000000000002', 'Sindhi Camp Jaipur', '2026-08-20 11:00:00+05:30', 'Sindhi Camp Bus Stand, Jaipur', 1),
    ('e0000000-0000-0000-0000-000000000202', 'c0000000-0000-0000-0000-000000000002', 'Narayan Singh Circle', '2026-08-20 11:30:00+05:30', 'Narayan Singh Circle, Jaipur', 2),

    ('e0000000-0000-0000-0000-000000000301', 'c0000000-0000-0000-0000-000000000003', 'Ameerpet', '2026-08-21 05:30:00+05:30', 'Metro Station Ameerpet, Hyderabad', 1),
    ('e0000000-0000-0000-0000-000000000302', 'c0000000-0000-0000-0000-000000000003', 'MGBS Hyderabad', '2026-08-21 06:00:00+05:30', 'Mahatma Gandhi Bus Station, Hyderabad', 2),

    ('e0000000-0000-0000-0000-000000000401', 'c0000000-0000-0000-0000-000000000004', 'Alambagh Bus Stand', '2026-08-20 21:30:00+05:30', 'Alambagh, Lucknow, UP 226005', 1),
    ('e0000000-0000-0000-0000-000000000402', 'c0000000-0000-0000-0000-000000000004', 'Charbagh Bus Station', '2026-08-20 21:50:00+05:30', 'Charbagh, Lucknow, UP 226001', 2),

    ('e0000000-0000-0000-0000-000000000501', 'c0000000-0000-0000-0000-000000000005', 'Wakad Pune', '2026-08-20 10:15:00+05:30', 'Ginger Hotel, Wakad, Pune', 1),
    ('e0000000-0000-0000-0000-000000000502', 'c0000000-0000-0000-0000-000000000005', 'Swargate Pune', '2026-08-20 10:45:00+05:30', 'Swargate Bus Stand, Pune', 2),

    ('e0000000-0000-0000-0000-000000000601', 'c0000000-0000-0000-0000-000000000006', 'Sector 17 Chandigarh', '2026-08-20 18:45:00+05:30', 'ISBT Sector 17, Chandigarh', 1),
    ('e0000000-0000-0000-0000-000000000602', 'c0000000-0000-0000-0000-000000000006', 'Sector 43 ISBT', '2026-08-20 19:00:00+05:30', 'ISBT Sector 43, Chandigarh', 2),

    ('e0000000-0000-0000-0000-000000000701', 'c0000000-0000-0000-0000-000000000007', 'Siliguri Junction', '2026-08-21 06:30:00+05:30', 'Siliguri Junction, Siliguri', 1),
    ('e0000000-0000-0000-0000-000000000702', 'c0000000-0000-0000-0000-000000000007', 'Tenzing Norgay Bus Terminus', '2026-08-21 07:00:00+05:30', 'Tenzing Norgay Bus Stand, Siliguri', 2)
ON CONFLICT (id) DO NOTHING;

-- 7. SEED SCHEDULE_SEATS (Inventory & Pricing for schedule c0000000-0000-0000-0000-000000000001)
-- Seater base fare = ₹899, Sleeper fare = base + ₹300 = ₹1199
INSERT INTO schedule_seats (schedule_id, bus_seat_id, price, status)
SELECT 
    'c0000000-0000-0000-0000-000000000001'::uuid AS schedule_id,
    bs.id AS bus_seat_id,
    v.price,
    v.status
FROM (VALUES
    ('1A', 899, 'available'),
    ('1B', 899, 'occupied'),
    ('1C', 899, 'available'),
    ('1D', 899, 'available'),

    ('2A', 899, 'available'),
    ('2B', 899, 'available'),
    ('2C', 899, 'occupied'),
    ('2D', 899, 'occupied'),

    ('3A', 899, 'reserved'),
    ('3B', 899, 'reserved'),
    ('3C', 899, 'available'),
    ('3D', 899, 'available'),

    ('4A', 899, 'available'),
    ('4B', 899, 'available'),
    ('4C', 899, 'available'),
    ('4D', 899, 'available'),

    ('U1', 1199, 'available'),
    ('U2', 1199, 'occupied'),
    ('U3', 1199, 'available'),
    ('U4', 1199, 'available'),

    ('U5', 1199, 'available'),
    ('U6', 1199, 'available'),
    ('U7', 1199, 'occupied'),
    ('U8', 1199, 'available'),

    ('U9', 1199, 'available'),
    ('U10', 1199, 'available'),
    ('U11', 1199, 'available'),
    ('U12', 1199, 'available')
) AS v(seat_label, price, status)
JOIN bus_seats bs ON bs.bus_id = 'b0000000-0000-0000-0000-000000000001' AND bs.seat_label = v.seat_label
ON CONFLICT (schedule_id, bus_seat_id) DO NOTHING;
