'use client';

import * as React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { BoardingDroppingPoint } from '../types/seat';

export interface BoardingDroppingSelectorProps {
  boardingPoints: BoardingDroppingPoint[];
  droppingPoints: BoardingDroppingPoint[];
  selectedBoardingId: string;
  selectedDroppingId: string;
  onSelectBoarding: (id: string) => void;
  onSelectDropping: (id: string) => void;
  className?: string;
}

export const BoardingDroppingSelector = React.memo<BoardingDroppingSelectorProps>(
  function BoardingDroppingSelector({
    boardingPoints,
    droppingPoints,
    selectedBoardingId,
    selectedDroppingId,
    onSelectBoarding,
    onSelectDropping,
    className,
  }) {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4', className)}>
        {/* Boarding Points Selection */}
        <div className="flex flex-col space-y-2 rounded-2xl border border-border/80 bg-white p-5 shadow-subtle">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Navigation className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
            <Label className="text-sm font-bold text-slate-900">Boarding Point</Label>
          </div>

          <div className="space-y-2 pt-1">
            {boardingPoints.map((point) => {
              const isSelected = selectedBoardingId === point.id;
              return (
                <button
                  key={point.id}
                  type="button"
                  onClick={() => onSelectBoarding(point.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    'flex w-full flex-col items-start rounded-xl p-3 text-left border transition-all duration-normal',
                    isSelected
                      ? 'border-primary bg-primary/10 text-slate-900 shadow-subtle'
                      : 'border-border bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{point.name}</span>
                    <span className="text-xs font-extrabold text-primary">{point.time}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground mt-1 truncate max-w-full">
                    {point.address}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dropping Points Selection */}
        <div className="flex flex-col space-y-2 rounded-2xl border border-border/80 bg-white p-5 shadow-subtle">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <MapPin className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
            <Label className="text-sm font-bold text-slate-900">Dropping Point</Label>
          </div>

          <div className="space-y-2 pt-1">
            {droppingPoints.map((point) => {
              const isSelected = selectedDroppingId === point.id;
              return (
                <button
                  key={point.id}
                  type="button"
                  onClick={() => onSelectDropping(point.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    'flex w-full flex-col items-start rounded-xl p-3 text-left border transition-all duration-normal',
                    isSelected
                      ? 'border-primary bg-primary/10 text-slate-900 shadow-subtle'
                      : 'border-border bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{point.name}</span>
                    <span className="text-xs font-extrabold text-primary">{point.time}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground mt-1 truncate max-w-full">
                    {point.address}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);
