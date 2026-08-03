'use client';

import * as React from 'react';
import { Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Seat } from '../types/seat';

export interface SeatItemProps {
  seat: Seat;
  isSelected: boolean;
  onSelect: (seatId: string) => void;
  className?: string;
}

export const SeatItem = React.memo<SeatItemProps>(function SeatItem({
  seat,
  isSelected,
  onSelect,
  className,
}) {
  const { id, label, status, type, price } = seat;
  const isOccupied = status === 'occupied';
  const isReserved = status === 'reserved';
  const isDisabled = isOccupied || isReserved;

  const handleClick = () => {
    if (!isDisabled) {
      onSelect(id);
    }
  };

  const statusText = isSelected
    ? 'Selected'
    : isOccupied
    ? 'Occupied'
    : isReserved
    ? 'Reserved'
    : 'Available';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
      aria-label={`Seat ${label}, $${price}, ${statusText}`}
      className={cn(
        'group relative flex flex-col items-center justify-center rounded-xl transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
        type === 'sleeper' ? 'h-20 w-12' : 'h-11 w-11',
        // Status Variants
        isSelected && 'bg-primary text-white border-2 border-primary shadow-subtle scale-105',
        !isSelected && status === 'available' && 'bg-white text-slate-800 border border-slate-300 hover:border-primary hover:bg-emerald-50/50 shadow-subtle active:scale-95',
        isOccupied && 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-70',
        isReserved && 'bg-amber-100 text-amber-600 border border-amber-300 cursor-not-allowed',
        className
      )}
    >
      {isSelected ? (
        <Check className="h-4 w-4 stroke-[3]" />
      ) : isReserved ? (
        <Lock className="h-3.5 w-3.5" />
      ) : (
        <span className="text-xs font-extrabold">{label}</span>
      )}

      {/* Seat Type Accent Handle */}
      {type === 'seater' && !isDisabled && (
        <div
          className={cn(
            'absolute -top-1 h-1 w-6 rounded-full',
            isSelected ? 'bg-white/40' : 'bg-slate-300'
          )}
        />
      )}
    </button>
  );
});
