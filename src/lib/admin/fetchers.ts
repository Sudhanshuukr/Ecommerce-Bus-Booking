import { getSupabaseServerClient } from '@/lib/supabase/server';

export interface AdminOverviewMetrics {
  totalBookings: number;
  todaysBookings: number;
  totalRevenue: number;
  activeSchedules: number;
  totalOperators: number;
  totalBuses: number;
}

export interface AdminBookingRow {
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
  boardingPointName?: string;
  droppingPointName?: string;
}

export interface AdminScheduleRow {
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

export interface AdminBusRow {
  id: string;
  operatorName: string;
  busNumber: string;
  busType: string;
  totalSeats: number;
  amenities: string[];
  createdAt: string;
}

export interface AdminOperatorRow {
  id: string;
  name: string;
  logoUrl: string | null;
  rating: number;
  reviewCount: number;
  busCount: number;
  scheduleCount: number;
  createdAt: string;
}

export interface AdminUserRow {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  role: string;
  operatorId: string | null;
  createdAt: string;
}

export async function getAdminOverviewMetrics(): Promise<AdminOverviewMetrics> {
  const supabase = getSupabaseServerClient();

  // 1. Total Bookings count
  const { count: totalBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true });

  // 2. Today's Bookings count
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const { count: todaysBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfDay.toISOString());

  // 3. Total Revenue (sum of grand_total for confirmed/completed bookings)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: revenueData } = await (supabase.from('bookings') as any)
    .select('grand_total')
    .in('status', ['confirmed', 'completed']);

  const totalRevenue = (revenueData || []).reduce(
    (sum: number, item: { grand_total?: number }) => sum + (Number(item?.grand_total) || 0),
    0
  );

  // 4. Active Schedules count
  const { count: activeSchedules } = await supabase
    .from('schedules')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'scheduled');

  // 5. Total Operators count
  const { count: totalOperators } = await supabase
    .from('operators')
    .select('*', { count: 'exact', head: true });

  // 6. Total Buses count
  const { count: totalBuses } = await supabase
    .from('buses')
    .select('*', { count: 'exact', head: true });

  return {
    totalBookings: totalBookings || 0,
    todaysBookings: todaysBookings || 0,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    activeSchedules: activeSchedules || 0,
    totalOperators: totalOperators || 0,
    totalBuses: totalBuses || 0,
  };
}

export async function getAdminRecentBookings(limit = 10): Promise<AdminBookingRow[]> {
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
      schedules (
        origin,
        destination,
        departure_time,
        arrival_time,
        operators (
          name
        )
      ),
      passengers (
        id
      )
    `
    )
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[Admin Fetcher Error] getAdminRecentBookings:', error);
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
    operatorName: row.schedules?.operators?.name || 'Unknown Operator',
    seatCount: row.seat_count,
    grandTotal: Number(row.grand_total) || 0,
    currency: row.currency || '₹',
    status: row.status,
    createdAt: row.created_at,
    passengerCount: Array.isArray(row.passengers) ? row.passengers.length : 0,
  }));
}

export async function getAdminBookings(
  searchQuery = '',
  statusFilter = 'all'
): Promise<AdminBookingRow[]> {
  const supabase = getSupabaseServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase.from('bookings') as any).select(
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
    schedules (
      origin,
      destination,
      departure_time,
      arrival_time,
      operators (
        name
      )
    ),
    passengers (
      id
    )
  `
  );

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  if (searchQuery.trim()) {
    query = query.ilike('booking_reference', `%${searchQuery.trim()}%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('[Admin Fetcher Error] getAdminBookings:', error);
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
    operatorName: row.schedules?.operators?.name || 'Unknown Operator',
    seatCount: row.seat_count,
    grandTotal: Number(row.grand_total) || 0,
    currency: row.currency || '₹',
    status: row.status,
    createdAt: row.created_at,
    passengerCount: Array.isArray(row.passengers) ? row.passengers.length : 0,
  }));
}

export async function getAdminSchedules(): Promise<AdminScheduleRow[]> {
  const supabase = getSupabaseServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('schedules') as any)
    .select(
      `
      id,
      origin,
      destination,
      departure_time,
      arrival_time,
      duration_minutes,
      price,
      currency,
      total_seats,
      badge,
      status,
      operators (
        name
      ),
      buses (
        bus_number,
        bus_type
      )
    `
    )
    .order('departure_time', { ascending: true });

  if (error) {
    console.error('[Admin Fetcher Error] getAdminSchedules:', error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((row: any) => ({
    id: row.id,
    operatorName: row.operators?.name || 'Unknown Operator',
    busNumber: row.buses?.bus_number || 'N/A',
    busType: row.buses?.bus_type || 'AC Bus',
    origin: row.origin,
    destination: row.destination,
    departureTime: row.departure_time,
    arrivalTime: row.arrival_time,
    durationMinutes: row.duration_minutes,
    price: Number(row.price) || 0,
    currency: row.currency || '₹',
    totalSeats: row.total_seats,
    status: row.status,
    badge: row.badge || null,
  }));
}

export async function getAdminBuses(): Promise<AdminBusRow[]> {
  const supabase = getSupabaseServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('buses') as any)
    .select(
      `
      id,
      bus_number,
      bus_type,
      total_seats,
      amenities,
      created_at,
      operators (
        name
      )
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Admin Fetcher Error] getAdminBuses:', error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((row: any) => ({
    id: row.id,
    operatorName: row.operators?.name || 'Unknown Operator',
    busNumber: row.bus_number,
    busType: row.bus_type,
    totalSeats: row.total_seats,
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    createdAt: row.created_at,
  }));
}

export async function getAdminOperators(): Promise<AdminOperatorRow[]> {
  const supabase = getSupabaseServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('operators') as any)
    .select(
      `
      id,
      name,
      logo_url,
      rating,
      review_count,
      created_at,
      buses (
        id
      ),
      schedules (
        id
      )
    `
    )
    .order('rating', { ascending: false });

  if (error) {
    console.error('[Admin Fetcher Error] getAdminOperators:', error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url,
    rating: Number(row.rating) || 5.0,
    reviewCount: row.review_count || 0,
    busCount: Array.isArray(row.buses) ? row.buses.length : 0,
    scheduleCount: Array.isArray(row.schedules) ? row.schedules.length : 0,
    createdAt: row.created_at,
  }));
}

export async function getAdminUsers(searchQuery = '', roleFilter = 'all'): Promise<AdminUserRow[]> {
  const supabase = getSupabaseServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase.from('users') as any).select('*');

  if (roleFilter && roleFilter !== 'all') {
    query = query.eq('role', roleFilter);
  }

  if (searchQuery.trim()) {
    query = query.ilike('email', `%${searchQuery.trim()}%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('[Admin Fetcher Error] getAdminUsers:', error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((row: any) => ({
    id: row.id,
    email: row.email,
    fullName: row.full_name || null,
    phone: row.phone || null,
    role: row.role || 'customer',
    operatorId: row.operator_id || null,
    createdAt: row.created_at,
  }));
}
