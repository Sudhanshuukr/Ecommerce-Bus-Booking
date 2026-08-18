'use client';

import * as React from 'react';
import Link from 'next/link';
import { Star, ArrowRight, Wifi, Zap, Tv, Coffee, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BusSchedule } from '../types/bus';

export interface BusCardProps {
  schedule: BusSchedule;
  onSelect?: (scheduleId: string) => void;
  className?: string;
}

export const BusCard = React.memo<BusCardProps>(function BusCard({
  schedule,
  onSelect,
  className,
}) {
  // BusCard component - memoized for performance and HMR stability
  const { id, operator, busType, route, price, currency, availableSeats, amenities, badge } = schedule;
  const isLowSeatCount = availableSeats <= 5;

  const handleSelect = () => {
    if (onSelect) {
      onSelect(id);
    }
  };

  // Helper for rendering amenity icons
  const renderAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower.includes('wifi')) return <Wifi key={amenity} className="h-3.5 w-3.5" aria-hidden="true" />;
    if (lower.includes('power') || lower.includes('usb') || lower.includes('outlet'))
      return <Zap key={amenity} className="h-3.5 w-3.5" aria-hidden="true" />;
    if (lower.includes('screen') || lower.includes('tv'))
      return <Tv key={amenity} className="h-3.5 w-3.5" aria-hidden="true" />;
    if (lower.includes('snack') || lower.includes('water'))
      return <Coffee key={amenity} className="h-3.5 w-3.5" aria-hidden="true" />;
    return null;
  };

  return (
    <Card
      className={cn(
        'group relative flex w-full max-w-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-white p-4 shadow-subtle transition-all duration-normal hover:border-slate-300 hover:shadow-hover sm:p-5',
        className
      )}
    >
      <article aria-labelledby={`bus-card-title-${id}`} className="flex w-full flex-col space-y-3.5">
        {/* Main Content Grid: Operator | Journey Timeline | Fare & CTA */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-center md:gap-4 lg:gap-6 min-w-0">
          {/* Column 1: Operator Details (Desktop col-span-3) */}
          <div className="md:col-span-4 lg:col-span-3 min-w-0 space-y-1.5">
            <div className="flex items-center space-x-1.5 min-w-0">
              <h3
                id={`bus-card-title-${id}`}
                className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors truncate min-w-0"
              >
                {operator.name}
              </h3>
              <span title="Verified Operator" className="shrink-0">
                <ShieldCheck className="h-4 w-4 text-emerald-600" aria-label="Verified Operator" />
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs min-w-0">
              <span className="inline-flex items-center shrink-0 rounded-md bg-amber-50 px-1.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                <Star className="mr-1 h-3 w-3 fill-amber-400 text-amber-400" />
                {operator.rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground shrink-0">({operator.reviewCount})</span>
            </div>

            <div className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate min-w-0">
              {busType}
            </div>
          </div>

          {/* Column 2: Journey Timeline (Desktop col-span-5/6) */}
          <div className="md:col-span-5 lg:col-span-6 py-1 grid grid-cols-3 items-center gap-2 text-center min-w-0">
            {/* Departure */}
            <div className="text-left min-w-0">
              <time className="text-base sm:text-lg font-extrabold text-slate-900 whitespace-nowrap block">
                {route.departureTime}
              </time>
              <address className="not-italic text-xs font-semibold text-slate-600 dark:text-slate-400 truncate block">
                {route.origin}
              </address>
            </div>

            {/* Timeline graphic */}
            <div className="flex flex-col items-center justify-center min-w-0 px-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 whitespace-nowrap">
                {route.duration}
              </span>
              <div className="relative flex items-center w-full max-w-[100px] sm:max-w-[140px]">
                <div className="h-[2px] w-full bg-slate-200 dark:bg-slate-700" />
                <div className="absolute left-0 h-2 w-2 rounded-full bg-slate-400" />
                <ArrowRight className="absolute right-0 h-3.5 w-3.5 text-slate-400 bg-white dark:bg-slate-900" />
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 whitespace-nowrap">
                Direct Journey
              </span>
            </div>

            {/* Arrival */}
            <div className="text-right min-w-0">
              <time className="text-base sm:text-lg font-extrabold text-slate-900 whitespace-nowrap block">
                {route.arrivalTime}
              </time>
              <address className="not-italic text-xs font-semibold text-slate-600 dark:text-slate-400 truncate block">
                {route.destination}
              </address>
            </div>
          </div>

          {/* Column 3: Fare & Action Button (Desktop col-span-3, left-bordered on desktop) */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-row sm:flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-3 md:pt-0 md:pl-4 min-w-0">
            <div className="text-left md:text-right min-w-0">
              <div className="flex items-baseline space-x-1 justify-start md:justify-end">
                <span className="text-2xl font-black text-slate-900">{currency}{price}</span>
                <span className="text-xs text-muted-foreground font-normal">/ seat</span>
              </div>
              <p
                aria-live="polite"
                className={cn(
                  'text-xs font-semibold mt-0.5',
                  isLowSeatCount ? 'text-amber-600' : 'text-emerald-600'
                )}
              >
                {isLowSeatCount ? `Only ${availableSeats} left!` : `${availableSeats} seats available`}
              </p>
            </div>

            <Link
              href={`/buses/${id}`}
              onClick={handleSelect}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-subtle hover:bg-primary-600 hover:shadow-soft active:scale-95 transition-all w-auto text-center shrink-0 md:mt-2.5"
            >
              View Details
            </Link>
          </div>
        </div>

        {/* Bottom Bar: Amenities & Optional Badge Tag */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs min-w-0">
          {amenities.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5 text-slate-500 min-w-0 max-w-full">
              <span className="text-[11px] font-medium text-muted-foreground shrink-0">Amenities:</span>
              {amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center space-x-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300 max-w-full shrink-0"
                >
                  {renderAmenityIcon(amenity)}
                  <span className="truncate">{amenity}</span>
                </span>
              ))}
            </div>
          ) : (
            <div />
          )}

          {badge && (
            <Badge
              variant={badge === 'Fastest' ? 'accent' : badge === 'Top Rated' ? 'default' : 'secondary'}
              className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ml-auto"
            >
              {badge}
            </Badge>
          )}
        </div>
      </article>
    </Card>
  );
});



