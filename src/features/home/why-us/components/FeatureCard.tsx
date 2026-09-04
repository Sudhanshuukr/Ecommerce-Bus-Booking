import * as React from 'react';
import {
  ShieldCheck,
  Clock,
  Ticket,
  Headphones,
  Sparkles,
  CreditCard,
  RefreshCw,
  MapPin,
  Armchair,
  TicketCheck,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WhyUsFeature } from '../types/why-us';

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  Clock,
  Ticket,
  Headphones,
  Sparkles,
  CreditCard,
  RefreshCw,
  MapPin,
  Armchair,
  TicketCheck,
};

export interface FeatureCardProps {
  feature: WhyUsFeature;
  className?: string;
}

export function FeatureCard({ feature, className }: FeatureCardProps) {
  const IconComponent = ICON_MAP[feature.iconName] || ShieldCheck;

  return (
    <article
      className={cn(
        'group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-6 shadow-subtle hover:border-slate-300 hover:shadow-hover transition-all duration-normal',
        className
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <IconComponent className="h-5 w-5" aria-hidden="true" />
          </div>

          {feature.badgeText && (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
              {feature.badgeText}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-900">
            {feature.title}
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
            {feature.description}
          </p>
        </div>
      </div>
    </article>
  );
}
