import * as React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container, Section } from '@/components/layout';
import { FeatureCard } from './FeatureCard';
import { WhyUsFeature, WhyUsStat } from '../types/why-us';
import { MOCK_WHY_US_FEATURES, MOCK_WHY_US_STATS } from '../mock/why-us';

export interface WhyUsSectionProps {
  features?: WhyUsFeature[];
  stats?: WhyUsStat[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function WhyUsSection({
  features = MOCK_WHY_US_FEATURES,
  stats = MOCK_WHY_US_STATS,
  title = 'Why Travelers Choose Our Platform',
  subtitle = 'Experience rapid booking, verified operator safety, instant e-tickets, and round-the-clock support.',
  className,
}: WhyUsSectionProps) {
  return (
    <Section spacing="lg" className={cn('bg-slate-50/60 py-12 dark:bg-slate-950/40 md:py-16', className)}>
      <Container>
        {/* Section Header */}
        <header className="mx-auto mb-10 flex max-w-2xl flex-col items-center text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>The Bus Booking Advantage</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {title}
          </h2>

          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {subtitle}
          </p>
        </header>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>

        {/* Optional Demo Trust Statistics Bar */}
        {stats && stats.length > 0 && (
          <div className="mt-12 rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
            <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.id} className="space-y-1">
                  <div className="text-2xl font-black tracking-tight text-primary sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}

