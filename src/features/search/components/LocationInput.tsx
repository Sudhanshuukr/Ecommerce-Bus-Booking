'use client';

import * as React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface LocationInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type: 'origin' | 'destination';
  error?: string;
  className?: string;
}

export const LocationInput = React.memo<LocationInputProps>(function LocationInput({
  id,
  label,
  value,
  onChange,
  placeholder = 'Enter city or station',
  type,
  error,
  className,
}) {
  const IconComponent = type === 'origin' ? Navigation : MapPin;
  const errorId = `${id}-error`;

  return (
    <div className={cn('flex flex-col space-y-1.5 w-full', className)}>
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <div className="relative flex items-center">
        <IconComponent
          className={cn(
            'absolute left-3.5 h-4 w-4 pointer-events-none transition-colors duration-normal',
            error ? 'text-destructive' : 'text-slate-400 group-focus-within:text-primary'
          )}
          aria-hidden="true"
        />
        <Input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'pl-10 h-12 text-sm font-medium text-slate-900 bg-white placeholder:text-slate-400 border-border focus-visible:ring-primary/20',
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
