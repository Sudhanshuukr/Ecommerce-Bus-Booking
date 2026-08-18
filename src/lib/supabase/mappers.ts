import { BusSchedule, BusOperator, BusRoute } from '@/features/bus/types/bus';
import { Seat, BoardingDroppingPoint } from '@/features/booking/types/seat';
import { Database } from './database.types';

type ScheduleRow = Database['public']['Tables']['schedules']['Row'];
type OperatorRow = Database['public']['Tables']['operators']['Row'];
type BusRow = Database['public']['Tables']['buses']['Row'];
type BoardingPointRow = Database['public']['Tables']['boarding_points']['Row'];
type DroppingPointRow = Database['public']['Tables']['dropping_points']['Row'];
type ScheduleSeatRow = Database['public']['Tables']['schedule_seats']['Row'];
type BusSeatRow = Database['public']['Tables']['bus_seats']['Row'];

export interface RawSupabaseScheduleJoined {
  schedule: ScheduleRow;
  operator: OperatorRow;
  bus: BusRow;
  boardingPoints: BoardingPointRow[];
  droppingPoints: DroppingPointRow[];
  scheduleSeats?: Array<ScheduleSeatRow & { bus_seat: BusSeatRow }>;
}

export function formatTimeFromIso(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

export function formatDurationMinutes(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins.toString().padStart(2, '0')}m`;
}

export function mapSupabaseScheduleToBusSchedule(
  data: RawSupabaseScheduleJoined
): BusSchedule {
  const { schedule, operator, bus, boardingPoints, droppingPoints, scheduleSeats } = data;

  const mappedOperator: BusOperator = {
    id: operator.id,
    name: operator.name,
    logoUrl: operator.logo_url || undefined,
    rating: Number(operator.rating),
    reviewCount: operator.review_count,
  };

  const mappedRoute: BusRoute = {
    origin: schedule.origin,
    destination: schedule.destination,
    departureTime: formatTimeFromIso(schedule.departure_time),
    arrivalTime: formatTimeFromIso(schedule.arrival_time),
    duration: formatDurationMinutes(schedule.duration_minutes),
  };

  const mappedBoardingPoints: BoardingDroppingPoint[] = (boardingPoints || []).map((bp) => ({
    id: bp.id,
    name: bp.name,
    time: formatTimeFromIso(bp.time),
    address: bp.address,
  }));

  const mappedDroppingPoints: BoardingDroppingPoint[] = (droppingPoints || []).map((dp) => ({
    id: dp.id,
    name: dp.name,
    time: formatTimeFromIso(dp.time),
    address: dp.address,
  }));

  const availableCount = (scheduleSeats || []).filter((s) => s.status === 'available').length;
  const mappedSeats = scheduleSeats ? mapSupabaseSeatsToSeats(scheduleSeats) : undefined;

  return {
    id: schedule.id,
    operator: mappedOperator,
    busType: bus.bus_type,
    route: mappedRoute,
    price: Number(schedule.price),
    currency: schedule.currency,
    availableSeats: scheduleSeats ? availableCount : schedule.total_seats,
    totalSeats: schedule.total_seats,
    amenities: bus.amenities,
    badge: schedule.badge || undefined,
    boardingPoints: mappedBoardingPoints,
    droppingPoints: mappedDroppingPoints,
    seats: mappedSeats,
  };
}

export function mapSupabaseSeatsToSeats(
  scheduleSeats: Array<ScheduleSeatRow & { bus_seat: BusSeatRow }>
): Seat[] {
  return scheduleSeats.map((item) => ({
    id: item.id,
    label: item.bus_seat.seat_label,
    deck: item.bus_seat.deck,
    row: item.bus_seat.row,
    column: item.bus_seat.column,
    type: item.bus_seat.seat_type,
    status: item.status,
    price: Number(item.price),
  }));
}
