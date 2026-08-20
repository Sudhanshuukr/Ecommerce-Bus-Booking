-- ============================================================================
-- Migration: 00003_create_booking_transaction.sql
-- Description: Atomic PostgreSQL RPC function for concurrency-safe booking creation
-- ============================================================================

CREATE OR REPLACE FUNCTION create_booking(
    p_schedule_id UUID,
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
BEGIN
    -- 1. Validate Schedule
    SELECT * INTO v_schedule FROM schedules WHERE id = p_schedule_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'SCHEDULE_NOT_FOUND: Bus schedule with ID % does not exist', p_schedule_id;
    END IF;

    -- 2. Validate Boarding Point belongs to schedule
    SELECT * INTO v_boarding FROM boarding_points WHERE id = p_boarding_point_id AND schedule_id = p_schedule_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'INVALID_BOARDING_POINT: Boarding point % does not belong to schedule %', p_boarding_point_id, p_schedule_id;
    END IF;

    -- 3. Validate Dropping Point belongs to schedule
    SELECT * INTO v_dropping FROM dropping_points WHERE id = p_dropping_point_id AND schedule_id = p_schedule_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'INVALID_DROPPING_POINT: Dropping point % does not belong to schedule %', p_dropping_point_id, p_schedule_id;
    END IF;

    v_seat_count := jsonb_array_length(p_passengers);
    IF v_seat_count IS NULL OR v_seat_count = 0 THEN
        RAISE EXCEPTION 'INVALID_SEATS: At least one seat must be selected';
    END IF;

    -- 4. Atomic Lock & Availability Check on Schedule Seats
    -- Loop through passengers and lock requested schedule seats with FOR UPDATE
    FOR i IN 0..(v_seat_count - 1)
    LOOP
        v_p_record := p_passengers->i;
        v_seat_id_str := v_p_record->>'seatId';
        
        -- Lock schedule seat row
        SELECT ss.* INTO v_schedule_seat 
        FROM schedule_seats ss
        LEFT JOIN bus_seats bs ON ss.bus_seat_id = bs.id
        WHERE ss.schedule_id = p_schedule_id 
          AND (ss.id::text = v_seat_id_str OR ss.bus_seat_id::text = v_seat_id_str OR bs.seat_label = v_seat_id_str)
        FOR UPDATE OF ss;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'INVALID_SEAT: Seat % is not valid for schedule %', v_seat_id_str, p_schedule_id;
        END IF;

        IF v_schedule_seat.status != 'available' THEN
            RAISE EXCEPTION 'SEAT_UNAVAILABLE: Seat % is currently % and cannot be booked', v_seat_id_str, v_schedule_seat.status;
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

    -- 5. Calculate Verified Fares
    v_tax_amount := ROUND((v_seat_price_sum * 0.05)::numeric, 2); -- 5% GST
    v_grand_total := v_seat_price_sum + v_service_fee + v_tax_amount;

    -- 6. Insert Master Booking Record
    INSERT INTO bookings (
        booking_reference,
        user_id,
        schedule_id,
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

    -- 7. Reserve Schedule Seats & Insert Passenger Details
    FOR i IN 1..v_seat_count
    LOOP
        v_p_record := p_passengers->(i - 1);
        
        -- Update schedule_seats status to 'occupied'
        UPDATE schedule_seats
        SET status = 'occupied', updated_at = NOW()
        WHERE id = v_seat_ids[i];

        -- Insert Passenger
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

    -- Return JSON Payload
    RETURN jsonb_build_object(
        'bookingId', v_booking_id,
        'bookingReference', p_booking_reference,
        'scheduleId', p_schedule_id,
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
