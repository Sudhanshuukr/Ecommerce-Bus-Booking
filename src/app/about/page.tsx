import * as React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Bus,
  Armchair,
  TicketCheck,
  Search,
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { AppShell, Container, Section } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'About Bustkit | Intercity Bus Reservation Platform',
  description:
    'Learn about Bustkit — an intercity bus reservation web application supporting schedule search, interactive seat selection, and digital ticket management.',
};

const PLATFORM_CAPABILITIES = [
  {
    icon: Search,
    title: 'Schedule & Route Discovery',
    description:
      'Search and compare intercity bus schedules across departure times, bus coach types, boarding locations, and fares.',
  },
  {
    icon: Armchair,
    title: 'Interactive Seat Selection',
    description:
      'Select your specific seat on interactive lower and upper deck layouts with clear distinctions between seater seats and sleeper berths.',
  },
  {
    icon: TicketCheck,
    title: 'Digital On-Screen E-Tickets',
    description:
      'Instantly view your confirmed booking pass with generated PNR reference, passenger details, and boarding/dropping timelines.',
  },
  {
    icon: Layers,
    title: 'Self-Service Booking Management',
    description:
      'Access and manage all your past and upcoming reservations anytime through the My Bookings section.',
  },
];

const BOOKING_STEPS = [
  {
    step: '01',
    title: 'Search Corridors',
    description: 'Enter your origin city, destination, and departure date to view all matching bus services.',
  },
  {
    step: '02',
    title: 'Choose Seat & Deck',
    description: 'Inspect live deck layouts, compare coach types and amenities, and select your preferred seat.',
  },
  {
    step: '03',
    title: 'Review & Confirm',
    description: 'Enter passenger details, review fare calculations, and receive your instant digital PNR booking pass.',
  },
];

export default function AboutPage() {
  return (
    <AppShell>
      <div className="bg-background">
        {/* Hero Section */}
        <Section spacing="md" className="pt-10 pb-12 sm:pt-14 sm:pb-16 bg-slate-50/50 border-b border-slate-200/80">
          <Container>
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center space-y-4">
              <div className="inline-flex items-center space-x-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span>Intercity Bus Reservation</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                About Bustkit
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Bustkit is a bus ticket reservation platform designed to streamline how travelers search, choose seats, and manage intercity bus journeys.
              </p>
            </div>
          </Container>
        </Section>

        {/* What is Bustkit Section */}
        <Section spacing="md" className="py-12 sm:py-16">
          <Container className="space-y-12 sm:space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-700">
                  <Compass className="h-3.5 w-3.5" />
                  <span>Platform Overview</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  What is Bustkit?
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Bustkit provides an intuitive web interface for intercity travelers to discover available bus routes, inspect coach amenities, and reserve specific seats in real time.
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  The platform consolidates operator schedules and seat inventory, allowing users to compare departure times, price options, and journey durations before completing their reservation.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-800">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Multi-Operator Schedules</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Deck & Seat Layouts</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Digital PNR Passes</span>
                  </div>
                </div>
              </div>

              {/* Feature Highlights Card */}
              <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-900 to-slate-800 p-6 sm:p-8 text-white shadow-modal">
                <h3 className="font-heading text-lg font-bold text-teal-400 mb-4 flex items-center space-x-2">
                  <Bus className="h-5 w-5" />
                  <span>Core System Features</span>
                </h3>
                <div className="space-y-3.5 text-xs text-slate-300">
                  <div className="flex items-start space-x-3 rounded-xl bg-white/5 p-3 border border-white/10">
                    <div className="font-bold text-teal-300 shrink-0">Search:</div>
                    <div>Corridor-based route searching with filters for coach type, departure time, and price.</div>
                  </div>
                  <div className="flex items-start space-x-3 rounded-xl bg-white/5 p-3 border border-white/10">
                    <div className="font-bold text-teal-300 shrink-0">Layouts:</div>
                    <div>Visual lower and upper deck seat maps with real-time seat availability tracking.</div>
                  </div>
                  <div className="flex items-start space-x-3 rounded-xl bg-white/5 p-3 border border-white/10">
                    <div className="font-bold text-teal-300 shrink-0">Tickets:</div>
                    <div>Instant digital confirmation passes stored directly in your booking history.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Capabilities */}
            <div className="space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Platform Capabilities
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Key features implemented in the Bustkit booking application.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {PLATFORM_CAPABILITIES.map((cap, idx) => {
                  const Icon = cap.icon;
                  return (
                    <Card
                      key={idx}
                      className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-subtle hover:border-slate-300 hover:shadow-hover transition-all"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                        {cap.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {cap.description}
                      </p>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* 3-Step Booking Flow */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 sm:p-10 space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  How Booking Works on Bustkit
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  The standard customer booking workflow from search to digital ticket confirmation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {BOOKING_STEPS.map((step, idx) => (
                  <div
                    key={idx}
                    className="relative flex flex-col rounded-2xl bg-white p-5 border border-slate-200/80 shadow-subtle space-y-2.5"
                  >
                    <span className="font-mono text-2xl font-extrabold text-primary/40">
                      {step.step}
                    </span>
                    <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 text-center space-y-4">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Explore Available Schedules
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                Search intercity corridors, view coach seat layouts, and manage your bus reservations.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/search">
                  <Button
                    variant="default"
                    size="default"
                    className="rounded-xl px-6 font-bold bg-teal-500 hover:bg-teal-600 text-slate-950 shadow-subtle"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    <span>Search Buses</span>
                  </Button>
                </Link>
                <Link href="/operators">
                  <Button
                    variant="outline"
                    size="default"
                    className="rounded-xl px-6 font-semibold border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                  >
                    <span>View Bus Operators</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      </div>
    </AppShell>
  );
}

