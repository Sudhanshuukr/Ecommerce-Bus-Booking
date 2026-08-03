'use client';

import * as React from 'react';
import { Star, ArrowRight, Wifi, Zap, Tv, Coffee, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
        'group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-5 shadow-subtle transition-all duration-normal hover:border-slate-300 hover:shadow-hover md:p-6',
        className
      )}
    >
      <article aria-labelledby={`bus-card-title-${id}`}>
        {/* Top Header: Operator Info & Badge */}
        <div className="flex flex-wrap items-start justify-between gap-2 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 id={`bus-card-title-${id}`} className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors">
                {operator.name}
              </h3>
              <span title="Verified Operator">
                <ShieldCheck className="h-4 w-4 text-emerald-600" aria-label="Verified Operator" />
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="inline-flex items-center rounded-md bg-amber-50 px-1.5 py-0.5 text-xs font-semibold text-amber-700">
                <Star className="mr-1 h-3 w-3 fill-amber-400 text-amber-400" />
                {operator.rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">({operator.reviewCount} reviews)</span>
              <span className="text-slate-300">•</span>
              <span className="font-medium text-slate-600 truncate max-w-[200px]">{busType}</span>
            </div>
          </div>

          {badge && (
            <Badge
              variant={badge === 'Fastest' ? 'accent' : badge === 'Top Rated' ? 'default' : 'secondary'}
              className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
            >
              {badge}
            </Badge>
          )}
        </div>

        {/* Middle Section: Route Timeline & Duration */}
        <div className="py-5 grid grid-cols-1 sm:grid-cols-12 items-center gap-4">
          {/* Departure */}
          <div className="sm:col-span-4 text-left">
            <time className="text-lg font-extrabold text-slate-900">{route.departureTime}</time>
            <address className="not-italic text-xs font-medium text-muted-foreground truncate">
              {route.origin}
            </address>
          </div>

          {/* Timeline graphic */}
          <div className="sm:col-span-4 flex flex-col items-center justify-center my-1 sm:my-0">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              {route.duration}
            </span>
            <div className="relative flex items-center w-full max-w-[140px]">
              <div className="h-[2px] w-full bg-slate-200" />
              <div className="absolute left-0 h-2 w-2 rounded-full bg-slate-400" />
              <ArrowRight className="absolute right-0 h-3.5 w-3.5 text-slate-400 bg-white" />
            </div>
            <span className="text-[10px] text-emerald-600 font-medium mt-1">Direct Journey</span>
          </div>

          {/* Arrival */}
          <div className="sm:col-span-4 sm:text-right">
            <time className="text-lg font-extrabold text-slate-900">{route.arrivalTime}</time>
            <address className="not-italic text-xs font-medium text-muted-foreground truncate">
              {route.destination}
            </address>
          </div>
        </div>

        {/* Amenities Bar */}
        {amenities.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 pb-4">
            <span className="text-[11px] font-medium text-muted-foreground">Amenities:</span>
            <div className="flex items-center space-x-1.5 text-slate-500">
              {amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center space-x-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                >
                  {renderAmenityIcon(amenity)}
                  <span>{amenity}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Footer: Price, Seats & Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <div className="flex items-baseline space-x-1">
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
              {isLowSeatCount ? `Only ${availableSeats} seats left!` : `${availableSeats} seats available`}
            </p>
          </div>

          <Button
            onClick={handleSelect}
            size="default"
            className="px-6 font-semibold shadow-subtle hover:shadow-soft active:scale-95 transition-all"
          >
            View Details
          </Button>
        </div>
      </article>
    </Card>
  );
});
