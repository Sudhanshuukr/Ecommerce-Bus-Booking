import { NextRequest } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { mapSupabaseScheduleToBusSchedule } from '@/lib/supabase/mappers';
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
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

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

    const sortedBoarding = [...(row.boarding_points || [])].sort(
      (a, b) => a.sequence_order - b.sequence_order
    );
    const sortedDropping = [...(row.dropping_points || [])].sort(
      (a, b) => a.sequence_order - b.sequence_order
    );

    const sortedScheduleSeats = [...(row.schedule_seats || [])].sort((a, b) => {
      if (a.bus_seats.deck !== b.bus_seats.deck) {
        return a.bus_seats.deck === 'lower' ? -1 : 1;
      }
      if (a.bus_seats.row !== b.bus_seats.row) {
        return a.bus_seats.row - b.bus_seats.row;
      }
      return a.bus_seats.column - b.bus_seats.column;
    });

    const busSchedule = mapSupabaseScheduleToBusSchedule({
      schedule: row,
      operator: row.operators,
      bus: row.buses,
      boardingPoints: sortedBoarding,
      droppingPoints: sortedDropping,
      scheduleSeats: sortedScheduleSeats.map((ss) => ({
        ...ss,
        bus_seat: ss.bus_seats,
      })),
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
