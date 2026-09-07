import * as React from 'react';
import { Metadata } from 'next';
import { Building2, Bus } from 'lucide-react';
import { AppShell, Container, Section } from '@/components/layout';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { OperatorsClient, OperatorItem } from './OperatorsClient';

export const metadata: Metadata = {
  title: 'Bus Operators | Bustkit',
  description:
    'Browse bus operators on Bustkit to view their coach types, amenities, and available routes.',
};

async function getOperatorsData(): Promise<OperatorItem[]> {
  try {
    const supabase = getSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: dbOperators, error } = await (supabase.from('operators') as any)
      .select(
        `
        id,
        name,
        rating,
        review_count,
        buses (
          bus_type,
          amenities
        ),
        schedules (
          id,
          origin,
          destination,
          price
        )
      `
      )
      .order('rating', { ascending: false });

    if (error || !dbOperators || dbOperators.length === 0) {
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dbOperators.map((op: any) => {
      // Unique bus types from genuine DB records
      const busTypesSet = new Set<string>();
      const amenitiesSet = new Set<string>();
      if (Array.isArray(op.buses)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        op.buses.forEach((b: any) => {
          if (b.bus_type) busTypesSet.add(b.bus_type);
          if (Array.isArray(b.amenities)) {
            b.amenities.forEach((a: string) => amenitiesSet.add(a));
          }
        });
      }

      // Unique route pairs from genuine DB schedules
      const routesMap = new Map<string, { origin: string; destination: string; price?: number }>();
      if (Array.isArray(op.schedules)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        op.schedules.forEach((s: any) => {
          if (s.origin && s.destination) {
            const key = `${s.origin}-${s.destination}`;
            if (!routesMap.has(key)) {
              routesMap.set(key, { origin: s.origin, destination: s.destination, price: s.price });
            }
          }
        });
      }

      return {
        id: op.id,
        name: op.name,
        rating: typeof op.rating === 'number' ? op.rating : 0,
        reviewCount: typeof op.review_count === 'number' ? op.review_count : 0,
        busTypes: Array.from(busTypesSet),
        amenities: Array.from(amenitiesSet),
        routes: Array.from(routesMap.values()),
        totalSchedules: Array.isArray(op.schedules) ? op.schedules.length : 0,
      };
    });
  } catch {
    return [];
  }
}

export default async function OperatorsPage() {
  const operators = await getOperatorsData();

  return (
    <AppShell>
      <Section spacing="md" className="bg-background min-h-[calc(100vh-16rem)] py-8 sm:py-12">
        <Container className="space-y-8 sm:space-y-10">
          {/* Header Section */}
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center space-y-3">
            <div className="inline-flex items-center space-x-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Building2 className="h-3.5 w-3.5" />
              <span>Partner Operators</span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Bus Operators
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
              Explore bus operators available on Bustkit. Compare coach types, onboard amenities, and scheduled routes across different corridors.
            </p>

            {operators.length > 0 && (
              <div className="inline-flex items-center space-x-1.5 rounded-xl bg-slate-100 px-3 py-1.5 border border-slate-200 text-xs font-semibold text-slate-700">
                <Bus className="h-4 w-4 text-primary" />
                <span>{operators.length} Operators Listed</span>
              </div>
            )}
          </div>

          {/* Interactive Operators Client */}
          <OperatorsClient initialOperators={operators} />
        </Container>
      </Section>
    </AppShell>
  );
}

