'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';

export interface PriceRangeFilterProps {
  priceMax: number;
  minPrice?: number;
  maxPrice?: number;
  onChange: (value: number) => void;
  currency?: string;
}

export const PriceRangeFilter = React.memo<PriceRangeFilterProps>(function PriceRangeFilter({
  priceMax,
  minPrice = 20,
  maxPrice = 100,
  onChange,
  currency = '$',
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="price-range-input" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Max Price
        </Label>
        <span className="text-sm font-bold text-slate-900">
          Up to {currency}{priceMax}
        </span>
      </div>

      <div className="space-y-1.5">
        <input
          id="price-range-input"
          type="range"
          min={minPrice}
          max={maxPrice}
          step={5}
          value={priceMax}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          aria-label={`Maximum price up to ${currency}${priceMax}`}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        />

        <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
          <span>{currency}{minPrice}</span>
          <span>{currency}{maxPrice}</span>
        </div>
      </div>
    </div>
  );
});
