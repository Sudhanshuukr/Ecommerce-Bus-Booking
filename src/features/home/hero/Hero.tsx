'use client';

import * as React from 'react';
import { Container, Section } from '@/components/layout';
import { ScrollReveal } from '@/components/shared';
import { HeroContent } from './HeroContent';
import { TrustStatsBar } from './TrustStatsBar';
import { SearchPanel } from '@/features/search/components/SearchPanel';

export function Hero() {
  return (
    <Section
      spacing="none"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-gradient-to-b from-slate-50/90 via-surface to-surface pt-20 pb-8 sm:pt-20 sm:pb-10 md:pt-24 md:pb-16 snap-start"
    >
      {/* Subtle Ambient Background Gradients */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -z-10 h-[520px] w-full max-w-7xl bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(13,148,136,0.14),rgba(255,255,255,0))]"
        aria-hidden="true"
      />

      <Container className="space-y-5 sm:space-y-6 md:space-y-8 my-auto py-1.5 sm:py-2">
        {/* Centered Hero Heading & Subtitle */}
        <ScrollReveal delay={0}>
          <HeroContent />
        </ScrollReveal>

        {/* Dominant Elevated Search Widget */}
        <ScrollReveal delay={120} className="relative z-30 mx-auto max-w-5xl lg:max-w-6xl xl:max-w-7xl">
          <React.Suspense
            fallback={
              <div className="w-full h-56 rounded-2xl border border-border/80 bg-white p-6 shadow-modal animate-pulse" />
            }
          >
            <SearchPanel />
          </React.Suspense>
        </ScrollReveal>

        {/* Platform Trust Metrics Strip */}
        <ScrollReveal delay={240} className="relative z-10 mx-auto max-w-5xl lg:max-w-6xl xl:max-w-7xl pt-1 sm:pt-2">
          <TrustStatsBar />
        </ScrollReveal>
      </Container>
    </Section>
  );
}
