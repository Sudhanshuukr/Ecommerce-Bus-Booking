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
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WhyUsFeature } from '../types/why-us';

const ICON_MAP: Record<WhyUsFeature['iconName'], LucideIcon> = {
  ShieldCheck,
  Clock,
  Ticket,
  Headphones,
  Sparkles,
  CreditCard,
  RefreshCw,
  MapPin,
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
        'group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md dark:border-slate-800 dark:bg-slate-900',
        className
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <IconComponent className="h-6 w-6" aria-hidden="true" />
          </div>

          {feature.badgeText && (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {feature.badgeText}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {feature.title}
          </h3>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {feature.description}
          </p>
        </div>
      </div>
    </article>
  );
}
