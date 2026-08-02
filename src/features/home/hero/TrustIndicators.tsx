import * as React from 'react';
import { ShieldCheck, Zap, Award } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TrustItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const trustIndicatorsData: TrustItem[] = [
  {
    id: 'secure-booking',
    label: 'Secure Booking',
    icon: ShieldCheck,
  },
  {
    id: 'live-availability',
    label: 'Live Seat Availability',
    icon: Zap,
  },
  {
    id: 'verified-operators',
    label: 'Verified Operators',
    icon: Award,
  },
];

export interface TrustIndicatorsProps {
  items?: TrustItem[];
  className?: string;
}

export function TrustIndicators({
  items = trustIndicatorsData,
  className,
}: TrustIndicatorsProps) {
  return (
    <div
      className={cn('flex flex-wrap items-center gap-x-6 gap-y-3 pt-2', className)}
      aria-label="Platform Trust Factors"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-muted-foreground"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Icon className="h-3.5 w-3.5" />
            </div>
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
