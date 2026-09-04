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
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

export function formatDateFromIso(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function formatShortDateFromIso(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function formatFullJourneyDate(dateInput: string): string {
  try {
    if (!dateInput) return '';
    const date = dateInput.includes('T')
      ? new Date(dateInput)
      : new Date(`${dateInput}T12:00:00+05:30`);
    if (isNaN(date.getTime())) return dateInput;
    return date.toLocaleDateString('en-US', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateInput;
  }
}

export function formatDurationMinutes(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins.toString().padStart(2, '0')}m`;
}

export function applyTravelDateToIso(baseIso: string, targetDateYmd: string): string {
  try {
    if (!targetDateYmd || !/^\d{4}-\d{2}-\d{2}$/.test(targetDateYmd)) {
      return baseIso;
    }
    const baseDate = new Date(baseIso);
    if (isNaN(baseDate.getTime())) {
      return baseIso;
    }
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const parts = formatter.formatToParts(baseDate);
    const hour = parts.find((p) => p.type === 'hour')?.value || '00';
    const minute = parts.find((p) => p.type === 'minute')?.value || '00';
    const second = parts.find((p) => p.type === 'second')?.value || '00';

    const istIsoString = `${targetDateYmd}T${hour}:${minute}:${second}+05:30`;
    const finalDate = new Date(istIsoString);
    return isNaN(finalDate.getTime()) ? baseIso : finalDate.toISOString();
  } catch {
    return baseIso;
  }
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
  const hasFullSeatLayout = Boolean(
    scheduleSeats &&
      scheduleSeats.length > 0 &&
      'bus_seat' in scheduleSeats[0] &&
      (scheduleSeats[0] as { bus_seat?: BusSeatRow }).bus_seat
  );
  const mappedSeats = hasFullSeatLayout
    ? mapSupabaseSeatsToSeats(scheduleSeats as Array<ScheduleSeatRow & { bus_seat: BusSeatRow }>)
    : undefined;

  return {
    id: schedule.id,
    operator: mappedOperator,
    busType: bus.bus_type,
    route: mappedRoute,
    price: Number(schedule.price),
    currency: schedule.currency,
    availableSeats: scheduleSeats && scheduleSeats.length > 0 ? availableCount : schedule.total_seats,
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
  return (scheduleSeats || [])
    .filter((item) => Boolean(item && item.bus_seat))
    .map((item) => ({
      id: item.id,
      label: item.bus_seat?.seat_label || '',
      deck: item.bus_seat?.deck || 'lower',
      row: item.bus_seat?.row || 1,
      column: item.bus_seat?.column || 1,
      type: item.bus_seat?.seat_type || 'seater',
      status: item.status,
      price: Number(item.price || 0),
    }));
}
