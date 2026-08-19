import { getSupabaseServerClient } from '@/lib/supabase/server';

export interface OperatorOverviewMetrics {
  totalRevenue: number;
  totalBookings: number;
  activeSchedules: number;
  fleetBuses: number;
}

export interface OperatorBookingRow {
  id: string;
  bookingReference: string;
  userId: string | null;
  scheduleId: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  operatorName: string;
  seatCount: number;
  grandTotal: number;
  currency: string;
  status: string;
  createdAt: string;
  passengerCount: number;
}

export interface OperatorScheduleRow {
  id: string;
  operatorName: string;
  busNumber: string;
  busType: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  price: number;
  currency: string;
  totalSeats: number;
  status: string;
  badge: string | null;
}

export interface OperatorBusRow {
  id: string;
  operatorName: string;
  busNumber: string;
  busType: string;
  totalSeats: number;
  amenities: string[];
  createdAt: string;
}

export async function getOperatorOverviewMetrics(
  operatorId: string | null | undefined
): Promise<OperatorOverviewMetrics> {
  if (!operatorId || typeof operatorId !== 'string' || operatorId.trim() === '') {
    return {
      totalRevenue: 0,
      totalBookings: 0,
      activeSchedules: 0,
      fleetBuses: 0,
    };
  }

  const cleanOperatorId = operatorId.trim();
  const supabase = getSupabaseServerClient();

  // 1. Total Bookings & Total Revenue for this operator's schedules
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: bookingData, error: bookingError } = await (supabase.from('bookings') as any)
    .select(
      `
      grand_total,
      status,
      schedules!inner (
        operator_id
      )
    `
    )
    .eq('schedules.operator_id', cleanOperatorId);

  if (bookingError) {
    console.error('[Operator Fetcher Error] getOperatorOverviewMetrics bookings:', bookingError);
  }

  const allOperatorBookings = bookingData || [];
  const totalBookings = allOperatorBookings.length;

  const confirmedBookings = allOperatorBookings.filter((b: { status?: string }) =>
    ['confirmed', 'completed'].includes(b.status || '')
  );

  const totalRevenue = confirmedBookings.reduce(
    (sum: number, item: { grand_total?: number }) => sum + (Number(item?.grand_total) || 0),
    0
  );

  // 2. Active Schedules count for this operator
  const { count: activeSchedules, error: scheduleError } = await supabase
    .from('schedules')
    .select('*', { count: 'exact', head: true })
    .eq('operator_id', cleanOperatorId)
    .eq('status', 'scheduled');

  if (scheduleError) {
    console.error('[Operator Fetcher Error] getOperatorOverviewMetrics schedules:', scheduleError);
  }

  // 3. Fleet Buses count for this operator
  const { count: fleetBuses, error: busError } = await supabase
    .from('buses')
    .select('*', { count: 'exact', head: true })
    .eq('operator_id', cleanOperatorId);

  if (busError) {
    console.error('[Operator Fetcher Error] getOperatorOverviewMetrics buses:', busError);
  }

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalBookings: totalBookings || 0,
    activeSchedules: activeSchedules || 0,
    fleetBuses: fleetBuses || 0,
  };
}

export async function getOperatorRecentBookings(
  operatorId: string | null | undefined,
  limit = 10
): Promise<OperatorBookingRow[]> {
  if (!operatorId || typeof operatorId !== 'string' || operatorId.trim() === '') {
    return [];
  }

  const cleanOperatorId = operatorId.trim();
  const supabase = getSupabaseServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('bookings') as any)
    .select(
      `
      id,
      booking_reference,
      user_id,
      schedule_id,
      seat_count,
      grand_total,
      currency,
      status,
      created_at,
      schedules!inner (
        origin,
        destination,
        departure_time,
        arrival_time,
        operator_id,
        operators (
          name
        )
      ),
      passengers (
        id
      )
    `
    )
    .eq('schedules.operator_id', cleanOperatorId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[Operator Fetcher Error] getOperatorRecentBookings:', error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((row: any) => ({
    id: row.id,
    bookingReference: row.booking_reference,
    userId: row.user_id,
    scheduleId: row.schedule_id,
    origin: row.schedules?.origin || 'Unknown',
    destination: row.schedules?.destination || 'Unknown',
    departureTime: row.schedules?.departure_time || '',
    arrivalTime: row.schedules?.arrival_time || '',
    operatorName: row.schedules?.operators?.name || 'Operator',
    seatCount: row.seat_count,
    grandTotal: Number(row.grand_total) || 0,
    currency: row.currency || '₹',
    status: row.status,
    createdAt: row.created_at,
    passengerCount: Array.isArray(row.passengers) ? row.passengers.length : 0,
  }));
}
