'use client';

import * as React from 'react';
import { Users, Plus, Minus, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { PassengerCounts, MIN_ADULTS, MAX_PASSENGERS } from '../types/search-form';

export interface PassengerSelectorProps {
  passengers: PassengerCounts;
  onUpdateCount: (type: keyof PassengerCounts, delta: number) => void;
  isOpen: boolean;
  onToggleOpen: (isOpen?: boolean) => void;
  error?: string;
  className?: string;
}

export const PassengerSelector = React.memo<PassengerSelectorProps>(function PassengerSelector({
  passengers,
  onUpdateCount,
  isOpen,
  onToggleOpen,
  error,
  className,
}) {
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const totalCount = passengers.adults + passengers.children;

  // Format label summary
  const summaryText = React.useMemo(() => {
    const parts: string[] = [];
    parts.push(`${passengers.adults} ${passengers.adults === 1 ? 'Adult' : 'Adults'}`);
    if (passengers.children > 0) {
      parts.push(`${passengers.children} ${passengers.children === 1 ? 'Child' : 'Children'}`);
    }
    return parts.join(', ');
  }, [passengers]);

  // Close popover when clicking outside or pressing Escape
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onToggleOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        onToggleOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onToggleOpen]);

  const isMaxReached = totalCount >= MAX_PASSENGERS;

  return (
    <div ref={popoverRef} className={cn('relative flex flex-col space-y-1.5 w-full', className)}>
      <Label htmlFor="passenger-selector-trigger" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Passengers
      </Label>

      {/* Popover Trigger Button */}
      <button
        id="passenger-selector-trigger"
        type="button"
        onClick={() => onToggleOpen()}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Select passengers. Current: ${summaryText}`}
        className={cn(
          'flex h-12 w-full items-center justify-between rounded-lg border border-border bg-white px-3.5 text-sm font-medium text-slate-900 shadow-subtle transition-all duration-normal hover:bg-slate-50 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
          error && 'border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive'
        )}
      >
        <div className="flex items-center space-x-2.5 truncate">
          <Users className={cn('h-4 w-4 shrink-0', error ? 'text-destructive' : 'text-slate-400')} />
          <span className="truncate text-slate-900 font-medium">{summaryText}</span>
        </div>
        <ChevronDown
          className={cn('h-4 w-4 text-slate-400 transition-transform duration-normal', isOpen && 'rotate-180 text-primary')}
        />
      </button>

      {error && (
        <span role="alert" className="text-xs font-medium text-destructive mt-0.5">
          {error}
        </span>
      )}

      {/* Popover Content Card */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Passenger Selection Dialog"
          className="absolute top-full left-0 z-30 mt-2 w-full min-w-[260px] rounded-xl border border-border bg-white p-4 shadow-modal transition-all duration-normal animate-in fade-in-50 zoom-in-95"
        >
          <div className="space-y-4">
            {/* Adult Counter */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Adults</p>
                <p className="text-xs text-muted-foreground">Age 12+</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => onUpdateCount('adults', -1)}
                  disabled={passengers.adults <= MIN_ADULTS}
                  aria-label="Decrease adult count"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-5 text-center text-sm font-semibold text-slate-900" aria-live="polite">
                  {passengers.adults}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateCount('adults', 1)}
                  disabled={isMaxReached}
                  aria-label="Increase adult count"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* Children Counter */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Children</p>
                <p className="text-xs text-muted-foreground">Age 2-11</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => onUpdateCount('children', -1)}
                  disabled={passengers.children <= 0}
                  aria-label="Decrease children count"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-5 text-center text-sm font-semibold text-slate-900" aria-live="polite">
                  {passengers.children}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateCount('children', 1)}
                  disabled={isMaxReached}
                  aria-label="Increase children count"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Max Passengers Limit Warning */}
            {isMaxReached && (
              <p className="text-[11px] font-medium text-amber-600 bg-amber-50 rounded-md p-2 text-center">
                Maximum limit of {MAX_PASSENGERS} passengers reached.
              </p>
            )}

            {/* Done CTA */}
            <button
              type="button"
              onClick={() => onToggleOpen(false)}
              className="w-full mt-2 h-9 rounded-lg bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
