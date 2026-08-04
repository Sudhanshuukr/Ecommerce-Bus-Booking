import * as React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container, Section } from '@/components/layout';
import { FeatureCard } from './FeatureCard';
import { WhyUsFeature } from '../types/why-us';
import { MOCK_WHY_US_FEATURES } from '../mock/why-us';

export interface WhyUsSectionProps {
  features?: WhyUsFeature[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function WhyUsSection({
  features = MOCK_WHY_US_FEATURES,
  title = 'Why Millions Choose Us for Bus Travel',
  subtitle = 'Experience seamless booking, guaranteed comfort, and world-class service every step of the journey.',
  className,
}: WhyUsSectionProps) {
  return (
    <Section spacing="lg" className={cn('bg-slate-50/60 py-12 dark:bg-slate-950/40 md:py-16', className)}>
      <Container>
        {/* Section Header */}
        <header className="mx-auto mb-10 flex max-w-2xl flex-col items-center text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>The Bus booking Advantage</span>
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
      </Container>
    </Section>
  );
}
