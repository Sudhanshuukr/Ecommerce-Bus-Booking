'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Bus, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PopularRoute } from '../types/popular-route';

export interface RouteCardProps {
  routeItem: PopularRoute;
  className?: string;
}

export const RouteCard = React.memo<RouteCardProps>(function RouteCard({ routeItem, className }) {
  const { origin, destination, startingPrice, currency, estimatedDuration, dailyBusesCount, popularTag } = routeItem;

  const searchUrl = `/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;

  return (
    <Card
      className={cn(
        'group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-5 shadow-subtle transition-all duration-normal hover:border-slate-300 hover:shadow-hover md:p-6',
        className
      )}
    >
      <article className="flex flex-col justify-between h-full space-y-4">
        {/* Top Header: Tag & Daily Frequency */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-muted-foreground bg-slate-100 px-2.5 py-1 rounded-full">
            <Bus className="h-3.5 w-3.5 text-slate-500" />
            <span>{dailyBusesCount} Daily Buses</span>
          </div>

          {popularTag && (
            <Badge variant="secondary" className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
              {popularTag}
            </Badge>
          )}
        </div>

        {/* Origin to Destination Route Banner */}
        <div className="space-y-2 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span className="text-base font-bold text-slate-900">{origin}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="text-base font-bold text-slate-900">{destination}</span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-xs font-medium text-muted-foreground pt-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>Estimated Duration: {estimatedDuration}</span>
          </div>
        </div>

        {/* Footer: Price & CTA Link */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Starting From
            </span>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-black text-slate-900">{currency}{startingPrice}</span>
              <span className="text-xs text-muted-foreground font-normal">/ seat</span>
            </div>
          </div>

          <Link
            href={searchUrl}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white shadow-subtle hover:bg-slate-800 active:scale-95 transition-all"
          >
            <span>Search Route</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </div>
      </article>
    </Card>
  );
});
