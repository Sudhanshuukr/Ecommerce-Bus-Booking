'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Building2,
  Star,
  Search,
  Bus,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface OperatorItem {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  busTypes: string[];
  amenities: string[];
  routes: Array<{ origin: string; destination: string; price?: number }>;
  totalSchedules: number;
}

export interface OperatorsClientProps {
  initialOperators: OperatorItem[];
}

export function OperatorsClient({ initialOperators }: OperatorsClientProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  // Filter operators by search query against name, routes, and coach types
  const filteredOperators = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return initialOperators;

    return initialOperators.filter((op) => {
      return (
        op.name.toLowerCase().includes(q) ||
        op.routes.some(
          (r) =>
            r.origin.toLowerCase().includes(q) ||
            r.destination.toLowerCase().includes(q)
        ) ||
        op.busTypes.some((bt) => bt.toLowerCase().includes(q))
      );
    });
  }, [initialOperators, searchQuery]);

  if (initialOperators.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 bg-white rounded-2xl border border-slate-200 p-8 shadow-subtle">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <Building2 className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No operators currently available</h3>
        <p className="text-xs text-muted-foreground max-w-sm">
          No bus operator records were found in the database. Active partner operators will be listed here once configured.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 sm:p-5 border border-slate-200 shadow-subtle">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search operators by name, route, or coach type..."
            maxLength={50}
            className="pl-10 h-10 rounded-xl text-xs sm:text-sm border-slate-200 focus-visible:ring-primary"
            aria-label="Search bus operators"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
              type="button"
            >
              Clear
            </button>
          )}
        </div>
        <div className="text-xs font-semibold text-slate-500 shrink-0">
          Showing {filteredOperators.length} of {initialOperators.length} operators
        </div>
      </div>

      {/* Operator Cards Grid */}
      {filteredOperators.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 bg-white rounded-2xl border border-slate-200 p-8 shadow-subtle">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <Building2 className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No matching operators found</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            We couldn&apos;t find any operators matching &quot;{searchQuery}&quot;. Try adjusting your search query.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchQuery('')}
            className="rounded-xl text-xs font-semibold"
          >
            Clear Search
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOperators.map((operator) => (
            <Card
              key={operator.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-subtle hover:border-slate-300 hover:shadow-hover transition-all duration-normal"
            >
              <div className="space-y-4">
                {/* Top Row: Icon, Name, Rating */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-heading text-base font-bold text-slate-900 truncate">
                        {operator.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {operator.totalSchedules} active schedule{operator.totalSchedules === 1 ? '' : 's'}
                      </p>
                    </div>
                  </div>

                  {/* Rating Pill */}
                  <div className="flex flex-col items-end shrink-0">
                    <span className="inline-flex items-center rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800 border border-amber-200/80">
                      <Star className="mr-1 h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {operator.rating.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                      {operator.reviewCount} reviews
                    </span>
                  </div>
                </div>

                {/* Fleet / Bus Types */}
                {operator.busTypes.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Coach Fleet
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {operator.busTypes.slice(0, 2).map((bt, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                        >
                          <Bus className="mr-1 h-3 w-3 text-slate-500" />
                          {bt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Corridors / Routes */}
                {operator.routes.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Operating Routes
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {operator.routes.slice(0, 3).map((r, idx) => (
                        <Link
                          key={idx}
                          href={`/search?origin=${encodeURIComponent(r.origin)}&destination=${encodeURIComponent(r.destination)}`}
                          className="inline-flex items-center rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-800 transition-colors"
                        >
                          <MapPin className="mr-1 h-3 w-3 text-primary shrink-0" />
                          <span>
                            {r.origin} → {r.destination}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities Badges */}
                {operator.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 text-[11px] text-slate-600">
                    {operator.amenities.slice(0, 3).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700 border border-teal-200/50"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">
                  {operator.routes.length > 0
                    ? `${operator.routes.length} route${operator.routes.length > 1 ? 's' : ''}`
                    : 'Schedule details'}
                </span>
                <Link
                  href={
                    operator.routes.length > 0
                      ? `/search?origin=${encodeURIComponent(operator.routes[0].origin)}&destination=${encodeURIComponent(operator.routes[0].destination)}`
                      : '/routes'
                  }
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-xl px-3 text-xs font-bold border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                  >
                    <span>View Buses</span>
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

