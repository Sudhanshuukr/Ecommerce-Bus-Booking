import * as React from 'react';
import { Button } from '@/components/ui/button';
import { TrustIndicators } from './TrustIndicators';

export function HeroContent() {
  return (
    <div className="flex flex-col space-y-6 text-left">
      {/* Eyebrow Badge */}
      <div className="inline-flex items-center w-fit rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground shadow-subtle">
        <span className="flex h-2 w-2 rounded-full bg-accent mr-2" />
        Premium Intercity Bus Network
      </div>

      {/* Main Single Semantic H1 */}
      <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.15]">
        Modern, Reliable Bus Travel Built for Comfort & Speed
      </h1>

      {/* Realistic Product Marketing Copy */}
      <p className="max-w-xl text-base text-muted-foreground sm:text-lg leading-relaxed">
        Connect to hundreds of nationwide routes with instant seat selection, verified operators, and zero booking friction.
      </p>

      {/* Primary & Secondary CTA Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button variant="default" size="lg" className="w-full sm:w-auto">
          Book Tickets
        </Button>
        <Button variant="outline" size="lg" className="w-full sm:w-auto">
          Explore Routes
        </Button>
      </div>

      {/* Trust Indicators */}
      <div className="pt-4 border-t border-border">
        <TrustIndicators />
      </div>
    </div>
  );
}
