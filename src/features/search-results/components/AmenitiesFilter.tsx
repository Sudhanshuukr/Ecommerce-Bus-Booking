'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

export interface AmenitiesFilterProps {
  selectedAmenities: string[];
  onChange: (amenities: string[]) => void;
}

const AMENITY_OPTIONS = [
  { id: 'wifi', label: 'Free WiFi' },
  { id: 'power', label: 'Power Outlets' },
  { id: 'blanket', label: 'Blanket & Pillow' },
  { id: 'screen', label: 'Personal TV' },
  { id: 'water', label: 'Water Bottle' },
];

export const AmenitiesFilter = React.memo<AmenitiesFilterProps>(function AmenitiesFilter({
  selectedAmenities,
  onChange,
}) {
  const toggleAmenity = (amenityId: string) => {
    if (selectedAmenities.includes(amenityId)) {
      onChange(selectedAmenities.filter((a) => a !== amenityId));
    } else {
      onChange([...selectedAmenities, amenityId]);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Amenities
      </Label>
      <div className="flex flex-wrap gap-1.5">
        {AMENITY_OPTIONS.map((item) => {
          const isSelected = selectedAmenities.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleAmenity(item.id)}
              aria-pressed={isSelected}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-normal border',
                isSelected
                  ? 'border-primary bg-primary/10 text-primary shadow-subtle'
                  : 'border-border bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
});
