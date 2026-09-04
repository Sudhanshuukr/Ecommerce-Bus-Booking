import * as React from 'react';
import { Container, Section } from '@/components/layout';
import { HeroContent } from './HeroContent';
import { TrustStatsBar } from './TrustStatsBar';
import { SearchPanel } from '@/features/search/components/SearchPanel';

export function Hero() {
  return (
    <Section spacing="lg" className="relative overflow-hidden bg-gradient-to-b from-slate-50/80 via-surface to-surface pt-8 pb-12 sm:pt-12 sm:pb-16">
      {/* Subtle Ambient Background Gradients */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -z-10 h-[420px] w-full max-w-7xl bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(13,148,136,0.12),rgba(255,255,255,0))]"
        aria-hidden="true"
      />

      <Container className="space-y-8">
        {/* Centered Hero Heading & Subtitle */}
        <HeroContent />

        {/* Dominant Elevated Search Widget */}
        <div className="mx-auto max-w-5xl">
          <React.Suspense
            fallback={
              <div className="w-full h-56 rounded-2xl border border-border/80 bg-white p-6 shadow-modal animate-pulse" />
            }
          >
            <SearchPanel />
          </React.Suspense>
        </div>

        {/* Platform Trust Metrics Strip */}
        <div className="mx-auto max-w-5xl pt-2">
          <TrustStatsBar />
        </div>
      </Container>
    </Section>
  );
}
