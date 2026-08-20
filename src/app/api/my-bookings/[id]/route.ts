import { NextRequest } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentAuthUser } from '@/lib/auth/server';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id || typeof id !== 'string' || id.trim() === '') {
      return apiError('Booking ID is required.', 'INVALID_ID', 400);
    }

    const authSession = await getCurrentAuthUser(request);

    if (!authSession?.user?.id) {
      return apiError(
        'Authentication required to view booking details.',
        'UNAUTHENTICATED',
        401
      );
    }

    const userId = authSession.user.id;
    const bookingId = id.trim();
    // Pass user token to getSupabaseServerClient so Supabase RLS evaluates auth.uid() correctly
    const supabase = getSupabaseServerClient(authSession.token);

    // Query strictly matching BOTH requested bookingId AND authenticated userId
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: booking, error } = await (supabase.from('bookings') as any)
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
      .eq('id', bookingId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error(`[GET /api/my-bookings/${bookingId}] Query error:`, error);
      return apiError('Unable to fetch booking details.', 'DATABASE_ERROR', 500);
    }

    // Return 404 if booking doesn't exist or doesn't belong to this user
    if (!booking) {
      return apiError('Booking not found.', 'NOT_FOUND', 404);
    }

    const now = new Date();
    const schedule = booking.schedules;
    const arrivalTimeStr = schedule?.arrival_time || schedule?.departure_time;
    const arrivalDate = arrivalTimeStr ? new Date(arrivalTimeStr) : null;

    const isTimePast = arrivalDate ? arrivalDate < now : false;
    const isCompleted = booking.status === 'completed' || isTimePast;

    const displayStatus =
      booking.status === 'cancelled'
        ? 'cancelled'
        : isCompleted
        ? 'completed'
        : 'confirmed';

    return apiSuccess({
      ...booking,
      displayStatus,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    console.error(`[GET /api/my-bookings/[id]] Unexpected error:`, message);
    return apiError(
      'An unexpected error occurred while retrieving booking details.',
      'INTERNAL_SERVER_ERROR',
      500
    );
  }
}
