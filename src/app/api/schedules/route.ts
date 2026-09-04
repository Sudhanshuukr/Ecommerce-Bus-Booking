import { NextRequest } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { mapSupabaseScheduleToBusSchedule, applyTravelDateToIso } from '@/lib/supabase/mappers';
import { apiSuccess, apiError } from '@/lib/api/response';
import { BusSchedule } from '@/features/bus/types/bus';
import { Database } from '@/lib/supabase/database.types';

type ScheduleRow = Database['public']['Tables']['schedules']['Row'];
type OperatorRow = Database['public']['Tables']['operators']['Row'];
type BusRow = Database['public']['Tables']['buses']['Row'];
type BoardingPointRow = Database['public']['Tables']['boarding_points']['Row'];
type DroppingPointRow = Database['public']['Tables']['dropping_points']['Row'];
type ScheduleSeatRow = Database['public']['Tables']['schedule_seats']['Row'];
type BusSeatRow = Database['public']['Tables']['bus_seats']['Row'];

interface ScheduleSeatJoined extends ScheduleSeatRow {
  bus_seats: BusSeatRow;
}

interface RawScheduleResult extends ScheduleRow {
  operators: OperatorRow;
  buses: BusRow;
  boarding_points: BoardingPointRow[];
  dropping_points: DroppingPointRow[];
  schedule_seats: ScheduleSeatJoined[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin')?.trim();
    const destination = searchParams.get('destination')?.trim();
    const dateParam = searchParams.get('date')?.trim();

    const supabase = getSupabaseServerClient();

    let query = supabase
      .from('schedules')
      .select(`
        *,
        operators (*),
        buses (*),
        boarding_points (*),
        dropping_points (*),
        schedule_seats (
          id,
          status
        )
      `)
      .order('departure_time', { ascending: true });

    // Filter by origin if provided
    if (origin) {
      query = query.ilike('origin', `%${origin}%`);
    }

    // Filter by destination if provided
    if (destination) {
      query = query.ilike('destination', `%${destination}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[GET /api/schedules] Supabase query error:', error);
      return apiError(
        'Unable to fetch bus schedules from database.',
        'SCHEDULE_QUERY_FAILED',
        500
      );
    }

    const targetDate = dateParam || new Date().toISOString().split('T')[0];

    // Query date-specific bookings for active schedules on targetDate via SECURITY DEFINER RPC
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: bookedSeatsData, error: rpcError } = await (supabase.rpc as any)(
      'get_occupied_seats_by_date',
      {
        p_journey_date: targetDate,
      }
    );

    if (rpcError) {
      console.warn('[GET /api/schedules] RPC get_occupied_seats_by_date warning:', rpcError.message);
    }

    // Group occupied seat IDs by schedule_id
    const occupiedSeatsBySchedule = new Map<string, Set<string>>();
    if (Array.isArray(bookedSeatsData)) {
      for (const item of (bookedSeatsData as unknown as Array<{ schedule_id?: string; schedule_seat_id?: string }>)) {
        if (item?.schedule_id && item?.schedule_seat_id) {
          if (!occupiedSeatsBySchedule.has(item.schedule_id)) {
            occupiedSeatsBySchedule.set(item.schedule_id, new Set());
          }
          occupiedSeatsBySchedule.get(item.schedule_id)!.add(item.schedule_seat_id);
        }
      }
    }

    const rawRows = (data || []) as unknown as RawScheduleResult[];

    const schedules: BusSchedule[] = rawRows.map((row) => {
      // If dateParam is provided, map operational schedule to the target travel date
      const adjustedDeparture = dateParam
        ? applyTravelDateToIso(row.departure_time, dateParam)
        : row.departure_time;

      const adjustedArrival = dateParam
        ? applyTravelDateToIso(row.arrival_time, dateParam)
        : row.arrival_time;

      const sortedBoarding = [...(row.boarding_points || [])]
        .sort((a, b) => a.sequence_order - b.sequence_order)
        .map((bp) => ({
          ...bp,
          time: dateParam ? applyTravelDateToIso(bp.time, dateParam) : bp.time,
        }));

      const sortedDropping = [...(row.dropping_points || [])]
        .sort((a, b) => a.sequence_order - b.sequence_order)
        .map((dp) => ({
          ...dp,
          time: dateParam ? applyTravelDateToIso(dp.time, dateParam) : dp.time,
        }));

      const occupiedSet = occupiedSeatsBySchedule.get(row.id) || new Set<string>();
      const dynamicScheduleSeats = (row.schedule_seats || []).map((ss) => {
        let dynamicStatus: 'available' | 'reserved' | 'occupied' = ss.status;
        if (occupiedSet.has(ss.id)) {
          dynamicStatus = 'occupied';
        } else if (ss.status === 'occupied') {
          dynamicStatus = 'available';
        }
        return {
          ...ss,
          status: dynamicStatus,
        };
      });

      return mapSupabaseScheduleToBusSchedule({
        schedule: {
          ...row,
          departure_time: adjustedDeparture,
          arrival_time: adjustedArrival,
        },
        operator: row.operators,
        bus: row.buses,
        boardingPoints: sortedBoarding,
        droppingPoints: sortedDropping,
        scheduleSeats: dynamicScheduleSeats as unknown as Parameters<
          typeof mapSupabaseScheduleToBusSchedule
        >[0]['scheduleSeats'],
      });
    });

    return apiSuccess(schedules);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown server error';
    console.error('[GET /api/schedules] Unexpected server error:', errorMessage);
    return apiError(
      'An unexpected server error occurred while processing schedules.',
      'INTERNAL_SERVER_ERROR',
      500
    );
  }
}
