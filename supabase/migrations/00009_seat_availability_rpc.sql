-- ============================================================================
-- Migration: 00009_seat_availability_rpc.sql
-- Description: Date-aware seat availability RPC functions with SECURITY DEFINER
--   1. get_occupied_seat_ids: returns occupied schedule_seat_ids for a single schedule and journey date
--   2. get_occupied_seats_by_date: returns (schedule_id, schedule_seat_id) pairs for all schedules on a journey date
--   Both functions:
--     - are SECURITY DEFINER & STABLE
--     - use SET search_path = public
--     - expose ONLY UUID identifiers (zero customer/passenger PII)
--     - grant EXECUTE to anon, authenticated, and service_role
-- ============================================================================

-- Function 1: Single schedule occupied seat IDs
CREATE OR REPLACE FUNCTION get_occupied_seat_ids(
    p_schedule_id UUID,
    p_journey_date DATE
)
RETURNS TABLE (schedule_seat_id UUID)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT p.schedule_seat_id
    FROM passengers p
    JOIN bookings b ON p.booking_id = b.id
    WHERE b.schedule_id = p_schedule_id
      AND b.journey_date = p_journey_date
      AND b.status IN ('confirmed', 'pending')
      AND p.schedule_seat_id IS NOT NULL;
$$;

-- Function 2: Multi-schedule occupied seat IDs for catalog search by date
CREATE OR REPLACE FUNCTION get_occupied_seats_by_date(
    p_journey_date DATE
)
RETURNS TABLE (
    schedule_id UUID,
    schedule_seat_id UUID
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT b.schedule_id, p.schedule_seat_id
    FROM passengers p
    JOIN bookings b ON p.booking_id = b.id
    WHERE b.journey_date = p_journey_date
      AND b.status IN ('confirmed', 'pending')
      AND p.schedule_seat_id IS NOT NULL;
$$;

-- Grant execution privileges to anon, authenticated, and service_role
GRANT EXECUTE ON FUNCTION get_occupied_seat_ids(UUID, DATE) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_occupied_seats_by_date(DATE) TO anon, authenticated, service_role;
