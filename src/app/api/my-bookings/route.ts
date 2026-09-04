import { NextRequest } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentAuthUser } from '@/lib/auth/server';
import { apiSuccess, apiError } from '@/lib/api/response';
import { applyTravelDateToIso } from '@/lib/supabase/mappers';

export async function GET(request: NextRequest) {
  try {
    const authSession = await getCurrentAuthUser(request);

    if (!authSession?.user?.id) {
      return apiError(
        'Authentication required to view your bookings.',
        'UNAUTHENTICATED',
        401
      );
    }

    const userId = authSession.user.id;
    // Pass user token to getSupabaseServerClient so Supabase RLS evaluates auth.uid() correctly
    const supabase = getSupabaseServerClient(authSession.token);

    // Query bookings strictly using authenticated user ID
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from('bookings') as any)
      .select(`
        *,
        schedules (
          *,
          operators (*),
          buses (*)
        ),
        boarding_points!bookings_boarding_point_fk (*),
        dropping_points!bookings_dropping_point_fk (*),
        passengers (
          *,
          schedule_seats (
            *,
            bus_seats (*)
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[GET /api/my-bookings] Supabase error:', error);
      return apiError('Failed to fetch user bookings.', 'DATABASE_ERROR', 500);
    }

    const bookingsList = data || [];
    const now = new Date();

    const upcoming: typeof bookingsList = [];
    const completed: typeof bookingsList = [];

    bookingsList.forEach((booking: (typeof bookingsList)[number]) => {
      const schedule = booking.schedules;
      const journeyDateStr = booking.journey_date || (schedule?.departure_time ? schedule.departure_time.split('T')[0] : null);

      const adjustedDeparture = journeyDateStr && schedule?.departure_time
        ? applyTravelDateToIso(schedule.departure_time, journeyDateStr)
        : schedule?.departure_time;

      const adjustedArrival = journeyDateStr && schedule?.arrival_time
        ? applyTravelDateToIso(schedule.arrival_time, journeyDateStr)
        : schedule?.arrival_time;

      const arrivalDate = adjustedArrival ? new Date(adjustedArrival) : null;
      const isTimePast = arrivalDate ? arrivalDate < now : false;
      const isCompleted = booking.status === 'completed' || isTimePast;

      const enrichedBooking = {
        ...booking,
        schedules: schedule
          ? {
              ...schedule,
              departure_time: adjustedDeparture,
              arrival_time: adjustedArrival,
            }
          : schedule,
      };

      if (booking.status === 'cancelled') {
        completed.push({ ...enrichedBooking, displayStatus: 'cancelled' });
      } else if (isCompleted) {
        completed.push({ ...enrichedBooking, displayStatus: 'completed' });
      } else {
        upcoming.push({ ...enrichedBooking, displayStatus: 'confirmed' });
      }
    });

    return apiSuccess({
      upcoming,
      completed,
      totalCount: bookingsList.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    console.error('[GET /api/my-bookings] Unexpected error:', message);
    return apiError(
      'An unexpected error occurred while loading your bookings.',
      'INTERNAL_SERVER_ERROR',
      500
    );
  }
}
