'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Users,
  AlertCircle,
  Search,
  Wifi,
  Zap,
  Tv,
  Coffee,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BusSchedule } from '../types/bus';
import { Seat } from '@/features/booking/types/seat';

export interface BusDetailsContainerProps {
  busId: string;
  className?: string;
}

export function BusDetailsContainer({ busId, className }: BusDetailsContainerProps) {
  const [schedule, setSchedule] = React.useState<BusSchedule | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const fetchSchedule = React.useCallback(() => {
    if (!busId || busId.trim() === '') {
      setIsLoading(false);
      setFetchError('SCHEDULE_NOT_FOUND');
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setFetchError(null);

    fetch(`/api/buses/${busId}`)
      .then((res) => {
        if (res.status === 404) {
          throw new Error('SCHEDULE_NOT_FOUND');
        }
        if (!res.ok) {
          throw new Error(`HTTP_${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        if (!isMounted) return;
        if (json.success && json.data) {
          setSchedule(json.data);
        } else {
          setFetchError(json.error?.message || 'Unable to load schedule details.');
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : '';
        if (msg === 'SCHEDULE_NOT_FOUND') {
          setFetchError('SCHEDULE_NOT_FOUND');
        } else {
          console.error('[Bus Details API Error]:', err);
          setFetchError(
            'Unable to connect to the schedule service. Please check your network connection and try again.'
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [busId]);

  React.useEffect(() => {
    const cleanup = fetchSchedule();
    return cleanup;
  }, [fetchSchedule]);

  // Read-only seat statistics calculation
  const seatStats = React.useMemo(() => {
    if (!schedule || !schedule.seats) {
      return {
        total: schedule?.totalSeats || 0,
        available: schedule?.availableSeats || 0,
        occupied: 0,
        reserved: 0,
        seaterPrice: schedule?.price || 0,
        sleeperPrice: null as number | null,
      };
    }

    const seats = schedule.seats as Seat[];
    const total = seats.length || schedule.totalSeats;
    const available = seats.filter((s) => s.status === 'available').length;
    const occupied = seats.filter((s) => s.status === 'occupied').length;
    const reserved = seats.filter((s) => s.status === 'reserved').length;

    const seaterSeats = seats.filter((s) => s.type === 'seater');
    const sleeperSeats = seats.filter((s) => s.type === 'sleeper');

    const seaterPrice = seaterSeats.length > 0 ? seaterSeats[0].price : schedule.price;
    const sleeperPrice = sleeperSeats.length > 0 ? sleeperSeats[0].price : null;

    return {
      total,
      available,
      occupied,
      reserved,
      seaterPrice,
      sleeperPrice,
    };
  }, [schedule]);

  // Amenity icon helper
  const renderAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower.includes('wifi')) return <Wifi className="h-4 w-4 text-primary" aria-hidden="true" />;
    if (lower.includes('power') || lower.includes('charging') || lower.includes('usb'))
      return <Zap className="h-4 w-4 text-amber-500" aria-hidden="true" />;
    if (lower.includes('screen') || lower.includes('tv'))
      return <Tv className="h-4 w-4 text-blue-500" aria-hidden="true" />;
    if (lower.includes('water') || lower.includes('snack') || lower.includes('bottle'))
      return <Coffee className="h-4 w-4 text-emerald-500" aria-hidden="true" />;
    return <CheckCircle2 className="h-4 w-4 text-slate-400" aria-hidden="true" />;
  };

  // Loading State
  if (isLoading) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-24 text-slate-500 space-y-4 bg-white rounded-2xl border border-slate-100 p-8 shadow-subtle',
          className
        )}
      >
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
        <p className="text-sm font-medium">Fetching journey and bus details...</p>
      </div>
    );
  }

  // Not Found State (404)
  if (fetchError === 'SCHEDULE_NOT_FOUND' || !schedule) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-12 text-center shadow-subtle space-y-4',
          className
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Bus Schedule Not Found</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          The requested bus schedule could not be found or has expired. Please return to the search results to choose another schedule.
        </p>
        <Link
          href="/search"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-5 text-xs font-bold text-white shadow-subtle hover:bg-slate-800 transition-all"
        >
          <Search className="mr-2 h-4 w-4" />
          <span>Back to Search Results</span>
        </Link>
      </div>
    );
  }

  // Network / General Error State
  if (fetchError) {
    return (
      <div
        className={cn(
          'rounded-2xl border border-red-200 bg-red-50/80 p-8 text-center text-red-800 space-y-4',
          className
        )}
      >
        <p className="font-semibold text-sm">{fetchError}</p>
        <div className="flex items-center justify-center space-x-3 pt-2">
          <button
            type="button"
            onClick={() => fetchSchedule()}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-red-600 px-4 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition-colors"
          >
            Retry Loading
          </button>
          <Link
            href="/search"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            Return to Search
          </Link>
        </div>
      </div>
    );
  }

  const { operator, busType, route, currency, amenities, badge, boardingPoints = [], droppingPoints = [] } = schedule;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Top Header & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/search"
          className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Back to Search Results</span>
        </Link>

        {badge && (
          <Badge
            variant={badge === 'Fastest' ? 'accent' : badge === 'Top Rated' ? 'default' : 'secondary'}
            className="text-xs font-semibold px-3 py-1 rounded-full"
          >
            {badge} Schedule
          </Badge>
        )}
      </div>

      {/* Main Grid: Left Column Details | Right Column Pricing & CTA Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Operator & Bus Overview */}
          <Card className="rounded-2xl border border-border/80 bg-white p-6 shadow-subtle space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-extrabold text-slate-900">{operator.name}</h1>
                  <ShieldCheck className="h-5 w-5 text-emerald-600" aria-label="Verified Operator" />
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-medium">
                  <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 font-bold text-amber-700">
                    <Star className="mr-1 h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {operator.rating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">({operator.reviewCount} reviews)</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-semibold text-slate-700">{busType}</span>
                </div>
              </div>
            </div>

            {/* Journey Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 py-2 bg-slate-50/70 rounded-xl p-4">
              <div className="sm:col-span-4">
                <time className="text-xl font-black text-slate-900">{route.departureTime}</time>
                <p className="text-xs font-bold text-slate-700 mt-0.5">{route.origin}</p>
                <p className="text-[11px] text-muted-foreground">Departure Point</p>
              </div>

              <div className="sm:col-span-4 flex flex-col items-center justify-center my-2 sm:my-0">
                <span className="text-xs font-bold text-slate-600 mb-1">{route.duration}</span>
                <div className="relative flex items-center w-full max-w-[140px]">
                  <div className="h-[2px] w-full bg-slate-300" />
                  <div className="absolute left-0 h-2.5 w-2.5 rounded-full bg-slate-600" />
                  <ArrowRight className="absolute right-0 h-4 w-4 text-slate-600 bg-slate-50" />
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 mt-1">Direct Route</span>
              </div>

              <div className="sm:col-span-4 sm:text-right">
                <time className="text-xl font-black text-slate-900">{route.arrivalTime}</time>
                <p className="text-xs font-bold text-slate-700 mt-0.5">{route.destination}</p>
                <p className="text-[11px] text-muted-foreground">Arrival Point</p>
              </div>
            </div>

            {/* Amenities Section */}
            {amenities.length > 0 && (
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Bus Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center space-x-1.5 rounded-lg bg-slate-100/80 px-3 py-1.5 text-xs font-medium text-slate-700"
                    >
                      {renderAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Card 2: Boarding & Dropping Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Boarding Points */}
            <Card className="rounded-2xl border border-border/80 bg-white p-5 shadow-subtle space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Boarding Points ({boardingPoints.length})</h3>
              </div>

              {boardingPoints.length === 0 ? (
                <p className="text-xs text-muted-foreground">No specific boarding points listed.</p>
              ) : (
                <div className="space-y-3">
                  {boardingPoints.map((point, idx) => (
                    <div key={point.id} className="flex items-start space-x-3 text-xs">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">{point.name}</span>
                          <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded text-[11px]">
                            {point.time}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-[11px] leading-relaxed">{point.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Dropping Points */}
            <Card className="rounded-2xl border border-border/80 bg-white p-5 shadow-subtle space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <MapPin className="h-5 w-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Dropping Points ({droppingPoints.length})</h3>
              </div>

              {droppingPoints.length === 0 ? (
                <p className="text-xs text-muted-foreground">No specific dropping points listed.</p>
              ) : (
                <div className="space-y-3">
                  {droppingPoints.map((point, idx) => (
                    <div key={point.id} className="flex items-start space-x-3 text-xs">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">{point.name}</span>
                          <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded text-[11px]">
                            {point.time}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-[11px] leading-relaxed">{point.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Right Column (4 cols Sticky): Seat Availability Summary, Pricing & CTA */}
        <div className="lg:col-span-4 space-y-6 sticky top-6">
          <Card className="rounded-2xl border border-border/80 bg-white p-6 shadow-modal space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Journey Summary</h2>
              <p className="text-xs text-muted-foreground">Review pricing and seat availability</p>
            </div>

            {/* Read-Only Seat Availability Counters */}
            <div className="space-y-3 border-t border-b border-slate-100 py-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center text-slate-600">
                  <Users className="mr-2 h-4 w-4 text-slate-400" />
                  Total Seats
                </span>
                <span className="font-bold text-slate-900">{seatStats.total}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center text-emerald-700 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2" />
                  Available Seats
                </span>
                <span className="font-extrabold text-emerald-700">{seatStats.available}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-slate-300 mr-2" />
                  Occupied Seats
                </span>
                <span className="font-medium text-slate-600">{seatStats.occupied}</span>
              </div>

              {seatStats.reserved > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center text-amber-600">
                    <span className="h-2 w-2 rounded-full bg-amber-400 mr-2" />
                    Reserved Seats
                  </span>
                  <span className="font-medium text-amber-700">{seatStats.reserved}</span>
                </div>
              )}
            </div>

            {/* Pricing Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Base Fare</span>
                <span className="text-xl font-black text-slate-900">
                  {currency}{seatStats.seaterPrice}
                  <span className="text-xs font-normal text-muted-foreground"> / seat</span>
                </span>
              </div>

              {seatStats.sleeperPrice !== null && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-dashed border-slate-200">
                  <span className="text-slate-500 font-medium">Sleeper Berth Fare</span>
                  <span className="font-bold text-slate-800">
                    {currency}{seatStats.sleeperPrice} / berth
                  </span>
                </div>
              )}
            </div>

            {/* Proceed to Seat Selection CTA */}
            <div className="pt-2">
              <Link
                href={`/buses/${schedule.id}?step=seats`}
                className="flex w-full h-11 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-subtle hover:bg-primary-600 hover:shadow-soft active:scale-95 transition-all text-center"
              >
                <span>Select Seats</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <p className="text-[11px] text-center text-muted-foreground mt-2">
                Choose your preferred seat from the physical layout map
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
