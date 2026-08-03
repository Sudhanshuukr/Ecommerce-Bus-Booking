'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

export interface BusTypeFilterProps {
  selectedTypes: string[];
  onChange: (types: string[]) => void;
}

const BUS_TYPES_OPTIONS = [
  { id: 'sleeper', label: 'AC Sleeper' },
  { id: 'seater', label: 'AC Seater' },
  { id: 'volvo', label: 'Volvo Multi-Axle' },
  { id: 'scania', label: 'Scania Premium' },
];

export const BusTypeFilter = React.memo<BusTypeFilterProps>(function BusTypeFilter({
  selectedTypes,
  onChange,
}) {
  const toggleType = (typeId: string) => {
    if (selectedTypes.includes(typeId)) {
      onChange(selectedTypes.filter((t) => t !== typeId));
    } else {
      onChange([...selectedTypes, typeId]);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Bus Type
      </Label>
      <div className="flex flex-wrap gap-1.5">
        {BUS_TYPES_OPTIONS.map((type) => {
          const isSelected = selectedTypes.includes(type.id);
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => toggleType(type.id)}
              aria-pressed={isSelected}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-normal border',
                isSelected
                  ? 'border-primary bg-primary/10 text-primary shadow-subtle'
                  : 'border-border bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              {type.label}
            </button>
          );
        })}
      </div>
    </div>
  );
});
