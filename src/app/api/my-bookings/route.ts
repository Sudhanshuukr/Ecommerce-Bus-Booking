import { NextRequest } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentAuthUser } from '@/lib/auth/server';
import { apiSuccess, apiError } from '@/lib/api/response';

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

    bookingsList.forEach((booking: any) => {
      const schedule = booking.schedules;
      const arrivalTimeStr = schedule?.arrival_time || schedule?.departure_time;
      const arrivalDate = arrivalTimeStr ? new Date(arrivalTimeStr) : null;

      const isTimePast = arrivalDate ? arrivalDate < now : false;
      const isCompleted = booking.status === 'completed' || isTimePast;

      if (booking.status === 'cancelled') {
        completed.push({ ...booking, displayStatus: 'cancelled' });
      } else if (isCompleted) {
        completed.push({ ...booking, displayStatus: 'completed' });
      } else {
        upcoming.push({ ...booking, displayStatus: 'confirmed' });
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
