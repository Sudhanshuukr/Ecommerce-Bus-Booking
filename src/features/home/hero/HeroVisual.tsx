import * as React from 'react';

export function HeroVisual() {
  return (
    <div
      className="relative mx-auto w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-soft lg:max-w-none"
      aria-hidden="true"
    >
      {/* Decorative Backdrop Glow */}
      <div className="absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 blur-xl" />

      {/* Travel Vector Illustration */}
      <svg
        viewBox="0 0 500 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-subtle"
        role="img"
      >
        {/* Route Path Line */}
        <path
          d="M 50 250 C 150 250, 180 120, 300 120 C 380 120, 420 220, 450 220"
          stroke="currentColor"
          className="text-border"
          strokeWidth="4"
          strokeDasharray="8 8"
        />

        {/* Active Route Segment */}
        <path
          d="M 50 250 C 150 250, 180 120, 240 120"
          stroke="currentColor"
          className="text-accent"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Origin Node */}
        <g transform="translate(50, 250)">
          <circle r="12" className="fill-surface stroke-primary" strokeWidth="4" />
          <circle r="5" className="fill-primary" />
        </g>

        {/* Destination Node */}
        <g transform="translate(450, 220)">
          <circle r="12" className="fill-surface stroke-accent" strokeWidth="4" />
          <circle r="5" className="fill-accent" />
        </g>

        {/* Bus Card Graphic */}
        <g transform="translate(180, 75)">
          <rect
            x="0"
            y="0"
            width="180"
            height="90"
            rx="16"
            className="fill-primary text-primary shadow-soft"
          />

          {/* Windshield */}
          <rect
            x="125"
            y="12"
            width="42"
            height="36"
            rx="6"
            className="fill-accent/90"
          />

          {/* Windows */}
          <rect x="15" y="18" width="28" height="24" rx="4" className="fill-surface/80" />
          <rect x="50" y="18" width="28" height="24" rx="4" className="fill-surface/80" />
          <rect x="85" y="18" width="28" height="24" rx="4" className="fill-surface/80" />

          {/* Accent Stripe */}
          <rect x="0" y="54" width="180" height="8" className="fill-accent" />

          {/* Wheels */}
          <circle cx="42" cy="90" r="16" className="fill-foreground stroke-surface" strokeWidth="4" />
          <circle cx="42" cy="90" r="6" className="fill-muted-foreground" />

          <circle cx="138" cy="90" r="16" className="fill-foreground stroke-surface" strokeWidth="4" />
          <circle cx="138" cy="90" r="6" className="fill-muted-foreground" />
        </g>

        {/* Floating Live Indicator Pill */}
        <g transform="translate(60, 40)">
          <rect
            x="0"
            y="0"
            width="140"
            height="44"
            rx="22"
            className="fill-surface stroke-border"
            strokeWidth="1"
          />
          <circle cx="22" cy="22" r="6" className="fill-success" />
          <text x="36" y="26" className="fill-foreground font-heading text-xs font-bold">
            Live Booking
          </text>
        </g>

        {/* Comfort Tag Pill */}
        <g transform="translate(310, 240)">
          <rect
            x="0"
            y="0"
            width="130"
            height="40"
            rx="12"
            className="fill-surface stroke-border"
            strokeWidth="1"
          />
          <text x="16" y="24" className="fill-muted-foreground font-body text-xs">
            Comfort Sleeper
          </text>
        </g>
      </svg>
    </div>
  );
}
