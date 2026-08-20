'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Ticket,
  Clock,
  Calendar,
  MapPin,
  User as UserIcon,
  Phone,
  Mail,
  Printer,
  AlertCircle,
  Bus,
  ShieldCheck,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { cn } from '@/lib/utils';
import { formatTimeFromIso } from '@/lib/supabase/mappers';

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
  const router = useRouter();
  const bookingId = (params?.id as string) || '';

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
      if (res.status === 404 || res.status === 403) {
        setErrorStatus(404);
        setIsLoading(false);
        return;
      }
      if (res.status === 401) {
        setErrorStatus(401);
        setIsLoading(false);
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
      console.error('[Booking Detail Error]:', err);
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
      <div className="min-h-screen flex flex-col bg-slate-50/50">
        <Header />
        <main className="flex-1 py-12">
          <Container className="max-w-4xl space-y-6 animate-pulse">
            <div className="h-6 w-36 bg-slate-200 rounded" />
            <div className="h-32 w-full bg-slate-200 rounded-2xl" />
            <div className="h-64 w-full bg-slate-200 rounded-2xl" />
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  // Not Found / Ownership Mismatch State (404 Error)
  if (errorStatus === 404 || !booking) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50/50">
        <Header />
        <main className="flex-1 py-16">
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
        </main>
        <Footer />
      </div>
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

  const depDate = schedule?.departure_time
    ? new Date(schedule.departure_time).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />

      <main className="flex-1 py-8 sm:py-12">
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
              className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-300 bg-white px-3.5 text-xs font-bold text-slate-700 shadow-subtle hover:bg-slate-50 transition-all"
            >
              <Printer className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
              <span>Print E-Ticket</span>
            </button>
          </div>

          {/* Hero Status Card */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-8 text-center shadow-subtle space-y-3">
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-soft">
                <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              {booking.displayStatus === 'completed'
                ? 'Journey Completed'
                : booking.displayStatus === 'cancelled'
                ? 'Booking Cancelled'
                : 'Confirmed E-Ticket'}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-700 max-w-md mx-auto">
              Present this official e-ticket and a valid photo ID during bus boarding.
            </p>

            {/* Reference Badge */}
            <div className="pt-2">
              <div className="inline-flex flex-col items-center justify-center rounded-xl bg-white border border-emerald-300 px-6 py-2.5 shadow-subtle">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  Booking Reference Number
                </span>
                <span className="text-xl font-black text-slate-900 tracking-wide font-mono mt-0.5">
                  {booking.booking_reference}
                </span>
              </div>
            </div>
          </div>

          {/* Ticket Body Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-subtle space-y-6">
            {/* Header & Total Paid */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center space-x-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary font-black">
                  <Bus className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {operator?.name || 'SmartBus Express'}
                  </h2>
                  <p className="text-xs font-semibold text-slate-500">
                    {bus?.bus_type || 'AC Seater / Sleeper (2+2)'} • {bus?.bus_number || 'UP-32-SB-0001'}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-medium text-muted-foreground block">Total Amount Paid</span>
                <span className="text-2xl font-black text-primary">
                  {booking.currency || '₹'}
                  {booking.grand_total}
                </span>
              </div>
            </div>

            {/* Journey Route & Timing Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 bg-slate-50 rounded-xl p-5 border border-slate-200/80">
              <div className="sm:col-span-4">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                  Departure / Origin
                </span>
                <time className="text-xl font-black text-slate-900 block mt-0.5">
                  {depTime}
                </time>
                <h3 className="text-xs font-bold text-slate-800 mt-1">
                  {schedule?.origin}
                </h3>
                <p className="text-[11px] font-semibold text-slate-500">{depDate}</p>
              </div>

              <div className="sm:col-span-4 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-600 mb-1 flex items-center space-x-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>
                    {schedule?.duration_minutes
                      ? `${Math.floor(schedule.duration_minutes / 60)}h ${schedule.duration_minutes % 60}m`
                      : '8h 00m'}
                  </span>
                </span>
                <div className="h-[2px] w-full max-w-[120px] bg-slate-300 relative">
                  <div className="absolute left-1/2 -top-1.5 -translate-x-1/2 bg-slate-50 px-1">
                    <Bus className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-600 mt-1">
                  Confirmed Route
                </span>
              </div>

              <div className="sm:col-span-4 sm:text-right">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                  Arrival / Destination
                </span>
                <time className="text-xl font-black text-slate-900 block mt-0.5">
                  {arrTime}
                </time>
                <h3 className="text-xs font-bold text-slate-800 mt-1">
                  {schedule?.destination}
                </h3>
                <p className="text-[11px] font-semibold text-slate-500">{depDate}</p>
              </div>
            </div>

            {/* Boarding & Dropping Point Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-700 font-extrabold text-[11px] uppercase tracking-wider">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Boarding Point</span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {boardingPoint?.name || 'Main Bus Terminal'}
                </h4>
                <p className="font-semibold text-slate-700">
                  Time: {boardingPoint?.time ? formatTimeFromIso(boardingPoint.time) : depTime}
                </p>
                <p className="text-slate-600">{boardingPoint?.address || schedule?.origin}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-1">
                <div className="flex items-center space-x-1.5 text-blue-700 font-extrabold text-[11px] uppercase tracking-wider">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Dropping Point</span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {droppingPoint?.name || 'Destination Terminal'}
                </h4>
                <p className="font-semibold text-slate-700">
                  Time: {droppingPoint?.time ? formatTimeFromIso(droppingPoint.time) : arrTime}
                </p>
                <p className="text-slate-600">{droppingPoint?.address || schedule?.destination}</p>
              </div>
            </div>

            {/* Passenger List */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Passenger Details ({passengers.length})
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Total Seats: {booking.seat_count}
                </span>
              </div>

              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white overflow-hidden">
                {passengers.map((p, idx) => {
                  const seatLabel =
                    p.schedule_seats?.bus_seats?.seat_label || `Seat ${idx + 1}`;

                  return (
                    <div
                      key={p.id || idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 text-xs gap-3"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex h-8 w-11 items-center justify-center rounded-lg bg-primary text-white font-black text-xs shadow-subtle">
                          {seatLabel}
                        </span>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm">{p.full_name}</h4>
                          <p className="text-[11px] text-slate-500 font-medium">
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

            {/* Itemized Fare Breakdown */}
            <div className="space-y-2 border-t border-slate-100 pt-5 text-xs font-medium">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-3">
                Fare Receipt Summary
              </span>

              <div className="flex justify-between text-slate-600">
                <span>Seat Fare Subtotal ({booking.seat_count} seats)</span>
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
      </main>

      <Footer />
    </div>
  );
}
