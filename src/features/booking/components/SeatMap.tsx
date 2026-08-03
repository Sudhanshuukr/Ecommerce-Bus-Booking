'use client';

import * as React from 'react';
import { Disc } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Seat, DeckType } from '../types/seat';
import { SeatItem } from './SeatItem';
import { SeatLegend } from './SeatLegend';

export interface SeatMapProps {
  seats: Seat[];
  selectedSeatIds: string[];
  onSelectSeat: (seatId: string) => void;
  className?: string;
}

export function SeatMap({ seats, selectedSeatIds, onSelectSeat, className }: SeatMapProps) {
  const [activeDeck, setActiveDeck] = React.useState<DeckType>('lower');

  const activeSeats = React.useMemo(() => {
    return seats.filter((s) => s.deck === activeDeck);
  }, [seats, activeDeck]);

  // Group active deck seats by row
  const rows = React.useMemo(() => {
    const rowMap = new Map<number, Seat[]>();
    activeSeats.forEach((seat) => {
      const existing = rowMap.get(seat.row) || [];
      existing.push(seat);
      rowMap.set(seat.row, existing);
    });
    return Array.from(rowMap.entries()).sort(([a], [b]) => a - b);
  }, [activeSeats]);

  return (
    <div
      className={cn(
        'flex flex-col space-y-5 rounded-2xl border border-border/80 bg-white p-5 shadow-subtle sm:p-6',
        className
      )}
    >
      {/* Top Header & Deck Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Select Seats</h2>
          <p className="text-xs text-muted-foreground">Click available seats to reserve your journey</p>
        </div>

        {/* Deck Switcher Tabs */}
        <div role="tablist" aria-label="Bus Deck Switcher" className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            type="button"
            role="tab"
            aria-selected={activeDeck === 'lower'}
            onClick={() => setActiveDeck('lower')}
            className={cn(
              'rounded-lg px-4 py-1.5 transition-all capitalize',
              activeDeck === 'lower' ? 'bg-white text-primary shadow-subtle font-bold' : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Lower Deck
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeDeck === 'upper'}
            onClick={() => setActiveDeck('upper')}
            className={cn(
              'rounded-lg px-4 py-1.5 transition-all capitalize',
              activeDeck === 'upper' ? 'bg-white text-primary shadow-subtle font-bold' : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Upper Deck
          </button>
        </div>
      </div>

      {/* Seat Legend */}
      <SeatLegend />

      {/* Bus Vehicle Graphic Layout */}
      <div className="relative mx-auto w-full max-w-[320px] rounded-3xl border-2 border-slate-200 bg-slate-50/50 p-6 pt-10 shadow-inner">
        {/* Front Vehicle Header & Driver Wheel */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            FRONT / DRIVER
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-600" title="Driver Cabin">
            <Disc className="h-4 w-4 animate-spin-slow" />
          </div>
        </div>

        {/* Seats Layout Grid */}
        <div className="space-y-4">
          {rows.map(([rowNum, rowSeats]) => {
            const leftSeats = rowSeats.filter((s) => s.column <= 2);
            const rightSeats = rowSeats.filter((s) => s.column >= 4);

            return (
              <div key={rowNum} className="flex items-center justify-between">
                {/* Left Side Seats (Columns 1, 2) */}
                <div className="flex items-center space-x-2">
                  {leftSeats.map((seat) => (
                    <SeatItem
                      key={seat.id}
                      seat={seat}
                      isSelected={selectedSeatIds.includes(seat.id)}
                      onSelect={onSelectSeat}
                    />
                  ))}
                </div>

                {/* Gangway Aisle Gap Indicator */}
                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                  AISLE
                </div>

                {/* Right Side Seats (Columns 4, 5) */}
                <div className="flex items-center space-x-2">
                  {rightSeats.map((seat) => (
                    <SeatItem
                      key={seat.id}
                      seat={seat}
                      isSelected={selectedSeatIds.includes(seat.id)}
                      onSelect={onSelectSeat}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rear Exit Indicator */}
        <div className="mt-8 text-center border-t border-slate-200 pt-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          REAR OF BUS
        </div>
      </div>
    </div>
  );
}
