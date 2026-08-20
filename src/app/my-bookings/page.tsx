'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Ticket,
  Clock,
  Calendar,
  MapPin,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertCircle,
  Bus,
  ChevronRight,
  ShieldAlert,
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

interface BookingRecord {
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

export default function MyBookingsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = React.useState<'upcoming' | 'completed'>('upcoming');

  const [upcomingBookings, setUpcomingBookings] = React.useState<BookingRecord[]>([]);
  const [completedBookings, setCompletedBookings] = React.useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const fetchBookings = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/my-bookings');
      if (res.status === 401) {
        setIsLoading(false);
        return;
      }
      if (!res.ok) {
        throw new Error(`HTTP_${res.status}`);
      }
      const json = await res.json();
      if (json.success && json.data) {
        setUpcomingBookings(json.data.upcoming || []);
        setCompletedBookings(json.data.completed || []);
      } else {
        setErrorMessage(json.error?.message || 'Unable to load your bookings.');
      }
    } catch (err) {
      console.error('[My Bookings Fetch Error]:', err);
      setErrorMessage('Network error occurred while fetching bookings.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [isAuthenticated, authLoading, fetchBookings]);

  const activeBookings = activeTab === 'upcoming' ? upcomingBookings : completedBookings;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <Container className="max-w-5xl space-y-8">
          {/* Header Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                My Bookings
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                View and manage your upcoming and past bus travel itineraries.
              </p>
            </div>

            <Link
              href="/search"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-4 text-xs font-bold text-white shadow-subtle hover:bg-slate-800 transition-all self-start sm:self-auto"
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Book New Bus</span>
            </Link>
          </div>

          {/* Authentication Protection Banner */}
          {!authLoading && !isAuthenticated && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">Sign in to view your trips</h2>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Please log in to your account to view your confirmed bus reservations and ticket details.
                </p>
              </div>
              <div className="flex items-center justify-center space-x-3 pt-2">
                <Link
                  href="/login?redirect=/my-bookings"
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-subtle hover:bg-primary-600 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-xs font-bold text-slate-700 shadow-subtle hover:bg-slate-50 transition-all"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}

          {/* Main Content View (Only when Authenticated) */}
          {isAuthenticated && (
            <div className="space-y-6">
              {/* Tab Navigation Controls */}
              <div className="flex items-center space-x-2 border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('upcoming')}
                  className={cn(
                    'flex items-center space-x-2 border-b-2 py-3 px-4 text-xs sm:text-sm font-bold transition-all',
                    activeTab === 'upcoming'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  )}
                >
                  <span>Upcoming Trips</span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[11px] font-extrabold',
                      activeTab === 'upcoming'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-slate-200 text-slate-600'
                    )}
                  >
                    {upcomingBookings.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('completed')}
                  className={cn(
                    'flex items-center space-x-2 border-b-2 py-3 px-4 text-xs sm:text-sm font-bold transition-all',
                    activeTab === 'completed'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  )}
                >
                  <span>Completed Trips</span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[11px] font-extrabold',
                      activeTab === 'completed'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-slate-200 text-slate-600'
                    )}
                  >
                    {completedBookings.length}
                  </span>
                </button>
              </div>

              {/* Loading State Skeleton */}
              {isLoading && (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle animate-pulse space-y-4"
                    >
                      <div className="h-5 w-48 bg-slate-200 rounded" />
                      <div className="h-12 w-full bg-slate-100 rounded-xl" />
                      <div className="h-4 w-32 bg-slate-200 rounded" />
                    </div>
                  ))}
                </div>
              )}

              {/* Error Alert */}
              {!isLoading && errorMessage && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-800 space-y-3">
                  <AlertCircle className="h-6 w-6 mx-auto text-red-600" />
                  <p className="text-xs font-semibold">{errorMessage}</p>
                  <button
                    type="button"
                    onClick={() => fetchBookings()}
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-red-600 px-4 text-xs font-bold text-white hover:bg-red-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !errorMessage && activeBookings.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-subtle space-y-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Ticket className="h-7 w-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">
                      {activeTab === 'upcoming' ? 'No Upcoming Trips' : 'No Completed Trips'}
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      {activeTab === 'upcoming'
                        ? 'You have no active or upcoming bus reservations. Search for routes and book your next trip!'
                        : 'Your past completed bus journeys will appear here after travel.'}
                    </p>
                  </div>
                  {activeTab === 'upcoming' && (
                    <Link
                      href="/search"
                      className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-subtle hover:bg-primary-600 transition-all"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      <span>Search Buses</span>
                    </Link>
                  )}
                </div>
              )}

              {/* Booking Cards List */}
              {!isLoading && !errorMessage && activeBookings.length > 0 && (
                <div className="space-y-4">
                  {activeBookings.map((booking) => {
                    const schedule = booking.schedules;
                    const operator = schedule?.operators;
                    const bus = schedule?.buses;

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

                    // Extract seat labels
                    const seatLabels = (booking.passengers || [])
                      .map(
                        (p) =>
                          p.schedule_seats?.bus_seats?.seat_label || `Seat ${p.id.slice(0, 4)}`
                      )
                      .join(', ');

                    return (
                      <div
                        key={booking.id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-subtle hover:shadow-soft transition-all space-y-5"
                      >
                        {/* Top Card Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-black">
                              <Bus className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                                {operator?.name || 'SmartBus Express'}
                              </h3>
                              <p className="text-xs font-semibold text-slate-500">
                                {bus?.bus_type || 'AC Seater / Sleeper (2+2)'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-extrabold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200">
                              {booking.booking_reference}
                            </span>
                            <span
                              className={cn(
                                'text-[11px] font-black uppercase px-2.5 py-1 rounded-lg tracking-wider',
                                booking.displayStatus === 'confirmed' &&
                                  'bg-emerald-100 text-emerald-800 border border-emerald-200',
                                booking.displayStatus === 'completed' &&
                                  'bg-blue-100 text-blue-800 border border-blue-200',
                                booking.displayStatus === 'cancelled' &&
                                  'bg-red-100 text-red-800 border border-red-200'
                              )}
                            >
                              {booking.displayStatus}
                            </span>
                          </div>
                        </div>

                        {/* Route & Schedule Timeline Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 bg-slate-50/70 rounded-xl p-4 border border-slate-100">
                          <div className="sm:col-span-4">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                              Origin
                            </span>
                            <h4 className="text-sm font-black text-slate-900 mt-0.5">
                              {schedule?.origin || 'Origin'}
                            </h4>
                            <div className="flex items-center space-x-1 text-xs font-semibold text-slate-600 mt-1">
                              <Clock className="h-3.5 w-3.5 text-primary" />
                              <span>{depTime}</span>
                            </div>
                          </div>

                          <div className="sm:col-span-4 flex flex-col items-center justify-center text-center">
                            <div className="flex items-center space-x-1 text-xs font-bold text-slate-500 mb-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{depDate}</span>
                            </div>
                            <div className="h-[2px] w-full max-w-[120px] bg-slate-300 relative">
                              <div className="absolute left-1/2 -top-1.5 -translate-x-1/2 bg-white px-1">
                                <Bus className="h-3 w-3 text-slate-400" />
                              </div>
                            </div>
                          </div>

                          <div className="sm:col-span-4 sm:text-right">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                              Destination
                            </span>
                            <h4 className="text-sm font-black text-slate-900 mt-0.5">
                              {schedule?.destination || 'Destination'}
                            </h4>
                            <div className="flex items-center space-x-1 justify-start sm:justify-end text-xs font-semibold text-slate-600 mt-1">
                              <Clock className="h-3.5 w-3.5 text-primary" />
                              <span>{arrTime}</span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Footer Info & Action */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
                          <div className="flex flex-wrap items-center gap-4 text-slate-600">
                            <div>
                              <span className="text-slate-400 font-semibold block text-[11px]">
                                Seats ({booking.seat_count})
                              </span>
                              <span className="font-extrabold text-slate-900">
                                {seatLabels || `${booking.seat_count} Seat(s)`}
                              </span>
                            </div>

                            <div className="border-l border-slate-200 pl-4">
                              <span className="text-slate-400 font-semibold block text-[11px]">
                                Total Fare
                              </span>
                              <span className="font-black text-primary text-sm">
                                {booking.currency || '₹'}
                                {booking.grand_total}
                              </span>
                            </div>
                          </div>

                          <Link
                            href={`/my-bookings/${booking.id}`}
                            className="inline-flex h-9 items-center justify-center rounded-xl bg-slate-900 px-4 text-xs font-bold text-white shadow-subtle hover:bg-slate-800 transition-all self-end sm:self-auto"
                          >
                            <span>View Ticket Details</span>
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
