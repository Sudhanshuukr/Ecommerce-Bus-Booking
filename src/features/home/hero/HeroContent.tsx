import * as React from 'react';
import { Sparkles } from 'lucide-react';

export function HeroContent() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center text-center space-y-3 sm:space-y-4">
      {/* Eyebrow Pill */}
      <div className="inline-flex items-center space-x-1.5 sm:space-x-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1 sm:px-3.5 sm:py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-primary">
        <Sparkles className="h-3.5 w-3.5 text-accent" />
        <span>India&apos;s Intercity Bus Booking Network</span>
      </div>

      {/* Main Single Semantic H1 */}
      <h1 className="font-heading text-[1.65rem] sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.22] sm:leading-tight lg:leading-[1.15]">
        Book Verified Buses Across India
      </h1>

      {/* Supporting Text */}
      <p className="max-w-xl text-[13px] sm:text-base md:text-lg text-muted-foreground leading-relaxed px-2 sm:px-0">
        Compare schedules across 14 state and private operators, choose your exact seat on live layouts, and get instant digital e-tickets.
      </p>
    </div>
  );
}
