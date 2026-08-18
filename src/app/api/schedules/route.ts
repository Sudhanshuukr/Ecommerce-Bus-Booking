import { NextRequest } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { mapSupabaseScheduleToBusSchedule } from '@/lib/supabase/mappers';
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
          *,
          bus_seats (*)
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

    // Filter by travel date if provided
    if (dateParam) {
      const parsedDate = new Date(dateParam);
      if (isNaN(parsedDate.getTime())) {
        return apiError(
          'Invalid date format. Please provide a valid date string (e.g. YYYY-MM-DD).',
          'INVALID_DATE',
          400
        );
      }

      const year = parsedDate.getUTCFullYear();
      const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0');
      const day = String(parsedDate.getUTCDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const startIso = new Date(`${dateStr}T00:00:00.000Z`).toISOString();
      const endIso = new Date(`${dateStr}T23:59:59.999Z`).toISOString();

      query = query.gte('departure_time', startIso).lte('departure_time', endIso);
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

    const rawRows = (data || []) as unknown as RawScheduleResult[];

    const schedules: BusSchedule[] = rawRows.map((row) => {
      const sortedBoarding = [...(row.boarding_points || [])].sort(
        (a, b) => a.sequence_order - b.sequence_order
      );
      const sortedDropping = [...(row.dropping_points || [])].sort(
        (a, b) => a.sequence_order - b.sequence_order
      );

      return mapSupabaseScheduleToBusSchedule({
        schedule: row,
        operator: row.operators,
        bus: row.buses,
        boardingPoints: sortedBoarding,
        droppingPoints: sortedDropping,
        scheduleSeats: (row.schedule_seats || []).map((ss) => ({
          ...ss,
          bus_seat: ss.bus_seats,
        })),
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
