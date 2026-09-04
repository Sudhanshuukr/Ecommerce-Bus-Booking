-- ============================================================================
-- Migration: 00008_date_aware_bookings.sql
-- Description: Minimal date-aware booking migration
--   1. Adds journey_date DATE to bookings table
--   2. Safely backfills existing test bookings from their schedule departure date
--   3. Enforces NOT NULL on bookings.journey_date
--   4. Creates index on (schedule_id, journey_date, status)
--   5. Resets schedule_seats.status from 'occupied' back to 'available'
--   6. Replaces create_booking RPC to accept p_journey_date and lock seats per date
-- ============================================================================

-- Step 1: Add journey_date column to bookings if not exists
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS journey_date DATE;

-- Step 2: Safely backfill existing bookings with their schedule departure date
UPDATE bookings b
SET journey_date = (s.departure_time AT TIME ZONE 'Asia/Kolkata')::date
FROM schedules s
WHERE b.schedule_id = s.id
  AND b.journey_date IS NULL;

-- Step 3: Enforce NOT NULL on journey_date
ALTER TABLE bookings ALTER COLUMN journey_date SET NOT NULL;

-- Step 4: Create performance index for date-aware booking lookups
CREATE INDEX IF NOT EXISTS idx_bookings_schedule_journey_date 
ON bookings(schedule_id, journey_date, status);

-- Step 5: Reset schedule_seats template inventory (release legacy occupied seats)
UPDATE schedule_seats
SET status = 'available', updated_at = NOW()
WHERE status = 'occupied';

-- Step 6: Replace create_booking RPC with date-aware atomic transaction
CREATE OR REPLACE FUNCTION create_booking(
    p_schedule_id UUID,
    p_journey_date DATE,
    p_boarding_point_id UUID,
    p_dropping_point_id UUID,
    p_user_id UUID,
    p_booking_reference VARCHAR,
    p_passengers JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_schedule RECORD;
    v_boarding RECORD;
    v_dropping RECORD;
    v_seat_count INTEGER;
    v_seat_price_sum NUMERIC(10, 2) := 0;
    v_service_fee NUMERIC(10, 2) := 2.00;
    v_tax_amount NUMERIC(10, 2) := 0;
    v_grand_total NUMERIC(10, 2) := 0;
    v_booking_id UUID;
    v_p_record JSONB;
    v_schedule_seat RECORD;
    v_seat_id_str VARCHAR;
    v_seat_ids UUID[];
    v_already_booked BOOLEAN;
BEGIN
    -- 1. Validate Journey Date
    IF p_journey_date IS NULL THEN
        RAISE EXCEPTION 'INVALID_JOURNEY_DATE: Journey date is required';
    END IF;

    -- 2. Validate Schedule
    SELECT * INTO v_schedule FROM schedules WHERE id = p_schedule_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'SCHEDULE_NOT_FOUND: Bus schedule with ID % does not exist', p_schedule_id;
    END IF;

    -- 3. Validate Boarding Point belongs to schedule
    SELECT * INTO v_boarding FROM boarding_points WHERE id = p_boarding_point_id AND schedule_id = p_schedule_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'INVALID_BOARDING_POINT: Boarding point % does not belong to schedule %', p_boarding_point_id, p_schedule_id;
    END IF;

    -- 4. Validate Dropping Point belongs to schedule
    SELECT * INTO v_dropping FROM dropping_points WHERE id = p_dropping_point_id AND schedule_id = p_schedule_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'INVALID_DROPPING_POINT: Dropping point % does not belong to schedule %', p_dropping_point_id, p_schedule_id;
    END IF;

    v_seat_count := jsonb_array_length(p_passengers);
    IF v_seat_count IS NULL OR v_seat_count = 0 THEN
        RAISE EXCEPTION 'INVALID_SEATS: At least one seat must be selected';
    END IF;

    -- 5. Atomic Lock & Availability Check on Schedule Seats for requested Journey Date
    FOR i IN 0..(v_seat_count - 1)
    LOOP
        v_p_record := p_passengers->i;
        v_seat_id_str := v_p_record->>'seatId';
        
        -- Validate physical seat template exists
        SELECT ss.* INTO v_schedule_seat 
        FROM schedule_seats ss
        LEFT JOIN bus_seats bs ON ss.bus_seat_id = bs.id
        WHERE ss.schedule_id = p_schedule_id 
          AND (ss.id::text = v_seat_id_str OR ss.bus_seat_id::text = v_seat_id_str OR bs.seat_label = v_seat_id_str);

        IF NOT FOUND THEN
            RAISE EXCEPTION 'INVALID_SEAT: Seat % is not valid for schedule %', v_seat_id_str, p_schedule_id;
        END IF;

        -- Physical template status guard (e.g. maintenance/permanently reserved)
        IF v_schedule_seat.status != 'available' THEN
            RAISE EXCEPTION 'SEAT_UNAVAILABLE: Seat % is template status % and cannot be booked', v_seat_id_str, v_schedule_seat.status;
        END IF;

        -- Acquire transaction-level advisory lock per (seat_id, journey_date) to serialize concurrent bookings
        PERFORM pg_advisory_xact_lock(hashtext('seat_booking:' || v_schedule_seat.id::text || ':' || p_journey_date::text));

        -- Date-specific availability check: check if already booked on requested journey_date
        SELECT EXISTS (
            SELECT 1 
            FROM passengers p
            JOIN bookings b ON p.booking_id = b.id
            WHERE p.schedule_seat_id = v_schedule_seat.id
              AND b.journey_date = p_journey_date
              AND b.status IN ('confirmed', 'pending')
        ) INTO v_already_booked;

        IF v_already_booked THEN
            RAISE EXCEPTION 'SEAT_UNAVAILABLE: Seat % is already booked for journey date %', v_seat_id_str, p_journey_date;
        END IF;

        -- Accumulate verified seat price
        v_seat_price_sum := v_seat_price_sum + v_schedule_seat.price;
        
        -- Track locked seat IDs
        v_seat_ids := array_append(v_seat_ids, v_schedule_seat.id);
    END LOOP;

    -- Check for duplicate seats in single request payload
    IF array_length(v_seat_ids, 1) != v_seat_count THEN
        RAISE EXCEPTION 'DUPLICATE_SEATS: Duplicate seats found in booking request';
    END IF;

    -- 6. Calculate Verified Fares
    v_tax_amount := ROUND((v_seat_price_sum * 0.05)::numeric, 2); -- 5% GST
    v_grand_total := v_seat_price_sum + v_service_fee + v_tax_amount;

    -- 7. Insert Master Booking Record with journey_date
    INSERT INTO bookings (
        booking_reference,
        user_id,
        schedule_id,
        journey_date,
        boarding_point_id,
        dropping_point_id,
        seat_count,
        seat_price_total,
        service_fee,
        tax_amount,
        grand_total,
        currency,
        status
    ) VALUES (
        p_booking_reference,
        p_user_id,
        p_schedule_id,
        p_journey_date,
        p_boarding_point_id,
        p_dropping_point_id,
        v_seat_count,
        v_seat_price_sum,
        v_service_fee,
        v_tax_amount,
        v_grand_total,
        v_schedule.currency,
        'confirmed'
    ) RETURNING id INTO v_booking_id;

    -- 8. Insert Passenger Details (without mutating schedule_seats.status)
    FOR i IN 1..v_seat_count
    LOOP
        v_p_record := p_passengers->(i - 1);

        INSERT INTO passengers (
            booking_id,
            schedule_seat_id,
            full_name,
            age,
            gender,
            mobile,
            email
        ) VALUES (
            v_booking_id,
            v_seat_ids[i],
            v_p_record->>'fullName',
            (v_p_record->>'age')::INTEGER,
            v_p_record->>'gender',
            v_p_record->>'mobile',
            v_p_record->>'email'
        );
    END LOOP;

    -- 9. Return JSON Payload
    RETURN jsonb_build_object(
        'bookingId', v_booking_id,
        'bookingReference', p_booking_reference,
        'scheduleId', p_schedule_id,
        'journeyDate', p_journey_date,
        'seatCount', v_seat_count,
        'seatPriceTotal', v_seat_price_sum,
        'serviceFee', v_service_fee,
        'taxAmount', v_tax_amount,
        'grandTotal', v_grand_total,
        'currency', v_schedule.currency,
        'status', 'confirmed'
    );
END;
$$;
