'use client';

import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface DatePickerProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  minDate?: string;
  disabled?: boolean;
  error?: string;
  showQuickPresets?: boolean;
  className?: string;
}

export const DatePicker = React.memo<DatePickerProps>(function DatePicker({
  id,
  label,
  value,
  onChange,
  minDate,
  disabled = false,
  error,
  showQuickPresets = false,
  className,
}) {
  const errorId = `${id}-error`;

  const handlePresetSelect = (daysFromToday: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${day}`);
  };

  return (
    <div className={cn('flex flex-col space-y-1.5 w-full', className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </Label>
        {showQuickPresets && !disabled && (
          <div className="flex items-center space-x-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handlePresetSelect(0)}
              className="text-primary hover:underline font-medium transition-colors"
            >
              Today
            </button>
            <span className="text-muted-foreground">•</span>
            <button
              type="button"
              onClick={() => handlePresetSelect(1)}
              className="text-primary hover:underline font-medium transition-colors"
            >
              Tomorrow
            </button>
          </div>
        )}
      </div>

      <div className="relative flex items-center">
        <CalendarIcon
          className={cn(
            'absolute left-3.5 h-4 w-4 pointer-events-none transition-colors duration-normal',
            disabled ? 'text-slate-300' : error ? 'text-destructive' : 'text-slate-400'
          )}
          aria-hidden="true"
        />
        <Input
          id={id}
          type="date"
          value={value}
          min={minDate}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'pl-10 h-12 text-sm font-medium text-slate-900 bg-white border-border focus-visible:ring-primary/20',
            disabled && 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200',
            error && 'border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive'
          )}
        />
      </div>

      {error && (
        <span id={errorId} role="alert" className="text-xs font-medium text-destructive mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});
