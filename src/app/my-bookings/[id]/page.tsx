'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Printer,
  AlertCircle,
  Bus,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Container } from '@/components/layout/Container';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { cn } from '@/lib/utils';
import { formatTimeFromIso, formatShortDateFromIso, formatFullJourneyDate, formatDurationMinutes } from '@/lib/supabase/mappers';

interface PassengerJoined {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  mobile: string;
  email: string;
  schedule_seats?: {
    bus_seats?: {
      seat_label: string;
    };
  };
}

interface BookingDetailRecord {
  id: string;
  booking_reference: string;
  journey_date?: string;
  seat_count: number;
  seat_price_total: number;
  service_fee: number;
  tax_amount: number;
  grand_total: number;
  currency: string;
  status: string;
  displayStatus: 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  schedules?: {
    id: string;
    origin: string;
    destination: string;
    departure_time: string;
    arrival_time: string;
    duration_minutes: number;
    operators?: {
      name: string;
      logo_url?: string;
    };
    buses?: {
      bus_type: string;
      bus_number: string;
    };
  };
  boarding_points?: {
    name: string;
    time: string;
    address: string;
  };
  dropping_points?: {
    name: string;
    time: string;
    address: string;
  };
  passengers?: PassengerJoined[];
}

export default function BookingDetailPage() {
  const params = useParams();
  const bookingId = params.id as string;

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [booking, setBooking] = React.useState<BookingDetailRecord | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorStatus, setErrorStatus] = React.useState<number | null>(null);

  const fetchDetail = React.useCallback(async () => {
    if (!bookingId) return;
    setIsLoading(true);
    setErrorStatus(null);

    try {
      const res = await fetch(`/api/my-bookings/${bookingId}`);
      if (res.status === 401) {
        setIsLoading(false);
        setErrorStatus(401);
        return;
      }
      if (res.status === 404) {
        setIsLoading(false);
        setErrorStatus(404);
        return;
      }
      if (!res.ok) {
        throw new Error(`HTTP_${res.status}`);
      }
      const json = await res.json();
      if (json.success && json.data) {
        setBooking(json.data);
      } else {
        setErrorStatus(500);
      }
    } catch (err) {
      console.error('[Booking Detail Fetch Error]:', err);
      setErrorStatus(500);
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchDetail();
    } else if (!authLoading) {
      setIsLoading(false);
      setErrorStatus(401);
    }
  }, [isAuthenticated, authLoading, fetchDetail]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Loading skeleton state
  if (isLoading || authLoading) {
    return (
      <AppShell className="bg-slate-50/50">
        <div className="py-12">
          <Container className="max-w-4xl space-y-6 animate-pulse">
            <div className="h-6 w-36 bg-slate-200 rounded" />
            <div className="h-32 w-full bg-slate-200 rounded-2xl" />
            <div className="h-64 w-full bg-slate-200 rounded-2xl" />
          </Container>
        </div>
      </AppShell>
    );
  }

  // Not Found / Ownership Mismatch State (404 Error)
  if (errorStatus === 404 || !booking) {
    return (
      <AppShell className="bg-slate-50/50">
        <div className="py-16">
          <Container className="max-w-xl text-center space-y-6">
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 shadow-subtle space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 mx-auto">
                <AlertCircle className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Booking Not Found</h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                The requested booking ticket could not be found or you do not have permission to view it.
              </p>
              <div className="pt-2">
                <Link
                  href="/my-bookings"
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-5 text-xs font-bold text-white shadow-subtle hover:bg-slate-800 transition-all"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span>Back to My Bookings</span>
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </AppShell>
    );
  }

  const schedule = booking.schedules;
  const operator = schedule?.operators;
  const bus = schedule?.buses;
  const boardingPoint = booking.boarding_points;
  const droppingPoint = booking.dropping_points;
  const passengers = booking.passengers || [];

  const depTime = schedule?.departure_time
    ? formatTimeFromIso(schedule.departure_time)
    : 'N/A';
  const arrTime = schedule?.arrival_time
    ? formatTimeFromIso(schedule.arrival_time)
    : 'N/A';

  const journeyDateFormatted = booking.journey_date
    ? formatFullJourneyDate(booking.journey_date)
    : schedule?.departure_time
    ? formatFullJourneyDate(schedule.departure_time)
    : 'N/A';

  const durationFormatted = schedule?.duration_minutes
    ? formatDurationMinutes(schedule.duration_minutes)
    : 'Direct Route';

  return (
    <AppShell className="bg-slate-50/50">
      <div className="py-8 sm:py-12">
        <Container className="max-w-4xl space-y-6">
          {/* Top Back Action Bar */}
          <div className="flex items-center justify-between">
            <Link
              href="/my-bookings"
              className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              <span>Back to My Bookings</span>
            </Link>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-xs font-bold text-slate-700 shadow-subtle hover:bg-slate-50 transition-all"
            >
              <Printer className="mr-2 h-4 w-4" />
              <span>Print E-Ticket</span>
            </button>
          </div>

          {/* Ticket Confirmation Header Banner */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 text-center shadow-subtle space-y-3">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-soft">
                <CheckCircle2 className="h-7 w-7" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Official Bus E-Ticket
            </h1>

            <div className="flex items-center justify-center space-x-3 pt-1">
              <span className="font-mono text-xs font-black bg-white text-slate-900 px-3 py-1 rounded-lg border border-emerald-300 shadow-subtle">
                PNR: {booking.booking_reference}
              </span>
              <span
                className={cn(
                  'text-[11px] font-black uppercase px-2.5 py-1 rounded-lg tracking-wider',
                  booking.displayStatus === 'confirmed' &&
                    'bg-emerald-100 text-emerald-800 border border-emerald-300',
                  booking.displayStatus === 'completed' &&
                    'bg-blue-100 text-blue-800 border border-blue-300',
                  booking.displayStatus === 'cancelled' &&
                    'bg-red-100 text-red-800 border border-red-300'
                )}
              >
                {booking.displayStatus}
              </span>
            </div>
          </div>

          {/* Main Ticket Pass Card */}
          <div className="rounded-2xl border border-border/80 bg-white p-5 sm:p-6 shadow-subtle space-y-6">
            {/* Operator Details */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-black">
                  <Bus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {operator?.name || 'SmartBus Express'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    {bus?.bus_type || 'AC Seater / Sleeper'} ({bus?.bus_number || 'BUS-101'})
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-muted-foreground block font-medium">
                  Booking Date
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {formatShortDateFromIso(booking.created_at)}
                </span>
              </div>
            </div>

            {/* Journey Date Banner */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 border border-slate-200/80 px-4 py-2.5">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-primary shrink-0" />
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Journey Date:
                </span>
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                {journeyDateFormatted}
              </span>
            </div>

            {/* Route & Schedule Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 bg-slate-50/70 rounded-xl p-4 border border-slate-100">
              <div className="sm:col-span-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Origin / Departure
                </span>
                <time className="text-lg font-black text-slate-900 block mt-0.5">
                  {depTime}
                </time>
                <p className="text-xs font-semibold text-slate-700">
                  {schedule?.origin || 'Origin'}
                </p>
              </div>

              <div className="sm:col-span-4 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-600 mb-1 flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-slate-500" />
                  <span>{durationFormatted}</span>
                </span>
                <div className="h-[2px] w-full max-w-[120px] bg-slate-300" />
                <span className="text-[10px] font-semibold text-emerald-600 mt-1">
                  Confirmed Route
                </span>
              </div>

              <div className="sm:col-span-4 sm:text-right">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Destination / Arrival
                </span>
                <time className="text-lg font-black text-slate-900 block mt-0.5">
                  {arrTime}
                </time>
                <p className="text-xs font-semibold text-slate-700">
                  {schedule?.destination || 'Destination'}
                </p>
              </div>
            </div>

            {/* Boarding & Dropping Locations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1">
                <div className="flex items-center space-x-1.5 text-primary font-extrabold uppercase text-[10px]">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Boarding / Pickup Point</span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {boardingPoint?.name || 'Main Station'}
                </h4>
                <p className="font-bold text-emerald-700">Time: {boardingPoint?.time || depTime}</p>
                <p className="text-slate-600">{boardingPoint?.address || 'Origin Address'}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1">
                <div className="flex items-center space-x-1.5 text-blue-600 font-extrabold uppercase text-[10px]">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Dropping / Dropoff Point</span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {droppingPoint?.name || 'Terminal Station'}
                </h4>
                <p className="font-bold text-blue-700">Time: {droppingPoint?.time || arrTime}</p>
                <p className="text-slate-600">{droppingPoint?.address || 'Destination Address'}</p>
              </div>
            </div>

            {/* Passenger List */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                Passenger Manifest ({passengers.length})
              </span>

              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
                {passengers.map((p, idx) => {
                  const seatLabel =
                    p.schedule_seats?.bus_seats?.seat_label || `Seat ${idx + 1}`;

                  return (
                    <div
                      key={p.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 text-xs gap-3"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex h-8 w-12 items-center justify-center rounded-lg bg-primary text-white font-black text-xs shadow-subtle">
                          {seatLabel}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{p.full_name}</h4>
                          <p className="text-[11px] text-slate-500">
                            Age: {p.age} • Gender: <span className="capitalize">{p.gender}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right text-[11px] text-slate-600 space-y-0.5">
                        <p className="flex items-center sm:justify-end space-x-1">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span>{p.mobile}</span>
                        </p>
                        <p className="flex items-center sm:justify-end space-x-1">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <span>{p.email}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fare Summary Breakdown */}
            <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-2">
                Fare Paid Breakdown
              </span>

              <div className="flex justify-between text-slate-600">
                <span>Seat Price Total ({booking.seat_count} seats)</span>
                <span className="font-semibold text-slate-900">
                  {booking.currency || '₹'}
                  {booking.seat_price_total}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Service Fee</span>
                <span className="font-semibold text-slate-900">
                  {booking.currency || '₹'}
                  {booking.service_fee}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>GST / Tax (5%)</span>
                <span className="font-semibold text-slate-900">
                  {booking.currency || '₹'}
                  {booking.tax_amount}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Grand Total Paid</span>
                <span className="text-xl font-black text-primary">
                  {booking.currency || '₹'}
                  {booking.grand_total}
                </span>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </AppShell>
  );
}
