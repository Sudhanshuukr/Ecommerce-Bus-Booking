import { NextRequest } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { mapSupabaseScheduleToBusSchedule, applyTravelDateToIso } from '@/lib/supabase/mappers';
import { apiSuccess, apiError } from '@/lib/api/response';
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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date')?.trim();

    if (!id || typeof id !== 'string' || id.trim() === '') {
      return apiError('Bus schedule ID is required.', 'INVALID_ID', 400);
    }

    const scheduleId = id.trim();
    const supabase = getSupabaseServerClient();

    // 1. Query by exact schedule ID
    let { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        operators (*),
        buses (*),
        boarding_points (*),
        dropping_points (*),
        schedule_seats (
          *,
          bus_seats (*)
        )
      `)
      .eq('id', scheduleId)
      .maybeSingle();

    // 2. Fallback: handle legacy mock ID format (e.g., 'bus-1') or formatted schedule IDs
    if (!data) {
      const match = scheduleId.match(/(\d+)$/);
      if (match) {
        const busIndex = parseInt(match[1], 10);
        if (!isNaN(busIndex) && busIndex >= 1 && busIndex <= 7) {
          const targetId = `c0000000-0000-0000-0000-00000000000${busIndex}`;
          const fallbackRes = await supabase
            .from('schedules')
            .select(`
              *,
              operators (*),
              buses (*),
              boarding_points (*),
              dropping_points (*),
              schedule_seats (
                *,
                bus_seats (*)
              )
            `)
            .eq('id', targetId)
            .maybeSingle();

          if (fallbackRes.data) {
            data = fallbackRes.data;
            error = fallbackRes.error;
          }
        }
      }
    }

    if (error) {
      console.error(`[GET /api/buses/${scheduleId}] Supabase query error:`, error);
      return apiError(
        'Unable to fetch bus schedule details from database.',
        'BUS_DETAILS_QUERY_FAILED',
        500
      );
    }

    if (!data) {
      return apiError(
        `Bus schedule with ID '${scheduleId}' not found.`,
        'SCHEDULE_NOT_FOUND',
        404
      );
    }

    const row = data as unknown as RawScheduleResult;

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

    const targetDate = dateParam || new Date().toISOString().split('T')[0];

    // Query active booked seat IDs for this schedule on the requested journey date via SECURITY DEFINER RPC
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: bookedSeatsData, error: rpcError } = await (supabase.rpc as any)(
      'get_occupied_seat_ids',
      {
        p_schedule_id: row.id,
        p_journey_date: targetDate,
      }
    );

    if (rpcError) {
      console.warn(`[GET /api/buses/${scheduleId}] RPC get_occupied_seat_ids warning:`, rpcError.message);
    }

    const bookedSeatIdSet = new Set<string>();
    if (Array.isArray(bookedSeatsData)) {
      for (const item of bookedSeatsData) {
        const seatId = typeof item === 'string' ? item : item?.schedule_seat_id;
        if (seatId) {
          bookedSeatIdSet.add(seatId);
        }
      }
    }

    const sortedScheduleSeats = [...(row.schedule_seats || [])].sort((a, b) => {
      if (a.bus_seats.deck !== b.bus_seats.deck) {
        return a.bus_seats.deck === 'lower' ? -1 : 1;
      }
      if (a.bus_seats.row !== b.bus_seats.row) {
        return a.bus_seats.row - b.bus_seats.row;
      }
      return a.bus_seats.column - b.bus_seats.column;
    });

    const dynamicScheduleSeats = sortedScheduleSeats.map((ss) => {
      let dynamicStatus: 'available' | 'reserved' | 'occupied' = ss.status;
      if (bookedSeatIdSet.has(ss.id)) {
        dynamicStatus = 'occupied';
      } else if (ss.status === 'occupied') {
        dynamicStatus = 'available';
      }
      return {
        ...ss,
        status: dynamicStatus,
        bus_seat: ss.bus_seats,
      };
    });

    const busSchedule = mapSupabaseScheduleToBusSchedule({
      schedule: {
        ...row,
        departure_time: adjustedDeparture,
        arrival_time: adjustedArrival,
      },
      operator: row.operators,
      bus: row.buses,
      boardingPoints: sortedBoarding,
      droppingPoints: sortedDropping,
      scheduleSeats: dynamicScheduleSeats,
    });

    return apiSuccess(busSchedule);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown server error';
    console.error(`[GET /api/buses/[id]] Unexpected server error:`, errorMessage);
    return apiError(
      'An unexpected server error occurred while processing bus schedule details.',
      'INTERNAL_SERVER_ERROR',
      500
    );
  }
}
