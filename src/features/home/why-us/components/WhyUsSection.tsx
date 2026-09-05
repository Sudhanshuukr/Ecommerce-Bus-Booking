import * as React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container, Section } from '@/components/layout';
import { ScrollReveal } from '@/components/shared';
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
  title = 'Why Book With Our Platform',
  subtitle = 'Built for reliable intercity journeys with transparent bus layouts, verified boarding points, and instant digital passes.',
  className,
}: WhyUsSectionProps) {
  return (
    <Section
      spacing="none"
      className={cn(
        'relative flex min-h-[100svh] flex-col justify-center bg-background py-16 sm:py-20 snap-start',
        className
      )}
    >
      <Container className="my-auto">
        {/* Section Header */}
        <ScrollReveal delay={0} className="mx-auto mb-10 sm:mb-12 flex max-w-2xl flex-col items-center text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Platform Features</span>
          </div>

          <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            {title}
          </h2>

          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        </ScrollReveal>

        {/* Features Grid */}
        <ScrollReveal delay={150}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
