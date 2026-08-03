'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { TimeWindow, TIME_WINDOWS } from '../types/search-filter';

export interface DepartureTimeFilterProps {
  selectedWindows: TimeWindow[];
  onChange: (windows: TimeWindow[]) => void;
}

export const DepartureTimeFilter = React.memo<DepartureTimeFilterProps>(function DepartureTimeFilter({
  selectedWindows,
  onChange,
}) {
  const toggleWindow = (windowId: TimeWindow) => {
    if (selectedWindows.includes(windowId)) {
      onChange(selectedWindows.filter((w) => w !== windowId));
    } else {
      onChange([...selectedWindows, windowId]);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Departure Time
      </Label>
      <div className="grid grid-cols-2 gap-2">
        {TIME_WINDOWS.map((window) => {
          const isSelected = selectedWindows.includes(window.id);
          return (
            <button
              key={window.id}
              type="button"
              onClick={() => toggleWindow(window.id)}
              aria-pressed={isSelected}
              className={cn(
                'flex flex-col items-start rounded-xl p-2.5 text-left border transition-all duration-normal',
                isSelected
                  ? 'border-primary bg-primary/10 text-primary shadow-subtle'
                  : 'border-border bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              <span className="text-xs font-bold">{window.label}</span>
              <span className="text-[10px] text-muted-foreground mt-0.5">{window.sublabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
