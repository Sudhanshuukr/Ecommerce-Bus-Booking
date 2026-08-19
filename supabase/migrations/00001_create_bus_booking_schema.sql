-- ============================================================================
-- Migration: 00001_create_bus_booking_schema.sql
-- Description: Core DDL schema for Bus Booking Platform (10 Relational Tables)
-- ============================================================================

-- 1. Helper function for updating updated_at columns automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. OPERATORS Table
CREATE TABLE IF NOT EXISTS operators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    logo_url TEXT,
    rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0 CHECK (rating >= 0.0 AND rating <= 5.0),
    review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. BUSES Table
CREATE TABLE IF NOT EXISTS buses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
    bus_number VARCHAR(20) NOT NULL UNIQUE,
    bus_type VARCHAR(100) NOT NULL,
    total_seats INTEGER NOT NULL CHECK (total_seats > 0),
    amenities TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. BUS_SEATS Table (Static Physical Seat Layout)
CREATE TABLE IF NOT EXISTS bus_seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bus_id UUID NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
    seat_label VARCHAR(10) NOT NULL,
    deck VARCHAR(10) NOT NULL DEFAULT 'lower' CHECK (deck IN ('lower', 'upper')),
    "row" INTEGER NOT NULL CHECK ("row" > 0),
    "column" INTEGER NOT NULL CHECK ("column" > 0),
    seat_type VARCHAR(10) NOT NULL DEFAULT 'seater' CHECK (seat_type IN ('seater', 'sleeper')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT bus_seats_bus_label_unique UNIQUE (bus_id, seat_label)
);

-- 5. SCHEDULES Table (Operational Journeys - Source of Truth)
CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE RESTRICT,
    bus_id UUID NOT NULL REFERENCES buses(id) ON DELETE RESTRICT,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_time TIMESTAMPTZ NOT NULL,
    arrival_time TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    currency VARCHAR(5) NOT NULL DEFAULT '₹',
    total_seats INTEGER NOT NULL CHECK (total_seats > 0),
    badge VARCHAR(20) CHECK (badge IN ('Fastest', 'Cheapest', 'Top Rated', 'Popular')),
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'departed', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT schedules_arrival_after_departure CHECK (arrival_time > departure_time)
);

-- 6. BOARDING_POINTS Table
CREATE TABLE IF NOT EXISTS boarding_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    time TIMESTAMPTZ NOT NULL,
    address TEXT NOT NULL,
    sequence_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT boarding_points_id_schedule_unique UNIQUE (id, schedule_id)
);

-- 7. DROPPING_POINTS Table
CREATE TABLE IF NOT EXISTS dropping_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    time TIMESTAMPTZ NOT NULL,
    address TEXT NOT NULL,
    sequence_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT dropping_points_id_schedule_unique UNIQUE (id, schedule_id)
);

-- 8. SCHEDULE_SEATS Table (Schedule Inventory State)
CREATE TABLE IF NOT EXISTS schedule_seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
    bus_seat_id UUID NOT NULL REFERENCES bus_seats(id) ON DELETE CASCADE,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'occupied')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT schedule_seats_schedule_bus_seat_unique UNIQUE (schedule_id, bus_seat_id)
);

-- 9. USERS Profile Table (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(100),
    email VARCHAR(254) NOT NULL UNIQUE,
    phone VARCHAR(15),
    role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'operator', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. BOOKINGS Table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference VARCHAR(25) NOT NULL UNIQUE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE RESTRICT,
    boarding_point_id UUID NOT NULL,
    dropping_point_id UUID NOT NULL,
    seat_count INTEGER NOT NULL CHECK (seat_count > 0),
    seat_price_total NUMERIC(10, 2) NOT NULL CHECK (seat_price_total >= 0),
    service_fee NUMERIC(10, 2) NOT NULL DEFAULT 2.00 CHECK (service_fee >= 0),
    tax_amount NUMERIC(10, 2) NOT NULL CHECK (tax_amount >= 0),
    grand_total NUMERIC(10, 2) NOT NULL CHECK (grand_total >= 0),
    currency VARCHAR(5) NOT NULL DEFAULT '₹',
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT bookings_boarding_point_fk FOREIGN KEY (boarding_point_id, schedule_id) REFERENCES boarding_points(id, schedule_id) ON DELETE RESTRICT,
    CONSTRAINT bookings_dropping_point_fk FOREIGN KEY (dropping_point_id, schedule_id) REFERENCES dropping_points(id, schedule_id) ON DELETE RESTRICT
);

-- 11. PASSENGERS Table
CREATE TABLE IF NOT EXISTS passengers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    schedule_seat_id UUID NOT NULL REFERENCES schedule_seats(id) ON DELETE RESTRICT,
    full_name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 1 AND age <= 120),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    mobile VARCHAR(10) NOT NULL,
    email VARCHAR(254) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT passengers_booking_seat_unique UNIQUE (booking_id, schedule_seat_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_operators_rating ON operators(rating DESC);
CREATE INDEX IF NOT EXISTS idx_buses_operator ON buses(operator_id);
CREATE INDEX IF NOT EXISTS idx_bus_seats_bus ON bus_seats(bus_id);
CREATE INDEX IF NOT EXISTS idx_schedules_route_date ON schedules(origin, destination, departure_time);
CREATE INDEX IF NOT EXISTS idx_schedules_operator ON schedules(operator_id);
CREATE INDEX IF NOT EXISTS idx_boarding_points_schedule ON boarding_points(schedule_id, sequence_order);
CREATE INDEX IF NOT EXISTS idx_dropping_points_schedule ON dropping_points(schedule_id, sequence_order);
CREATE INDEX IF NOT EXISTS idx_schedule_seats_lookup ON schedule_seats(schedule_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_schedule ON bookings(schedule_id);
CREATE INDEX IF NOT EXISTS idx_passengers_booking ON passengers(booking_id);

-- ============================================================================
-- AUTOMATIC UPDATED_AT TRIGGERS
-- ============================================================================

CREATE TRIGGER trigger_update_operators_updated_at
    BEFORE UPDATE ON operators
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_buses_updated_at
    BEFORE UPDATE ON buses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_schedules_updated_at
    BEFORE UPDATE ON schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_schedule_seats_updated_at
    BEFORE UPDATE ON schedule_seats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE boarding_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE dropping_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE passengers ENABLE ROW LEVEL SECURITY;

-- Public read policies for catalog & schedule data
CREATE POLICY "Public operators read access" ON operators FOR SELECT USING (true);
CREATE POLICY "Public buses read access" ON buses FOR SELECT USING (true);
CREATE POLICY "Public bus_seats read access" ON bus_seats FOR SELECT USING (true);
CREATE POLICY "Public schedules read access" ON schedules FOR SELECT USING (true);
CREATE POLICY "Public boarding_points read access" ON boarding_points FOR SELECT USING (true);
CREATE POLICY "Public dropping_points read access" ON dropping_points FOR SELECT USING (true);
CREATE POLICY "Public schedule_seats read access" ON schedule_seats FOR SELECT USING (true);
