import * as React from 'react';
import { AppShell, Container, Section } from '@/components/layout';
import { BusDetailsContainer } from '@/features/bus/components/BusDetailsContainer';
import { BookingContainer } from '@/features/booking/components/BookingContainer';

export const metadata = {
  title: 'Bus Schedule Details | Bus Booking Platform',
  description: 'View schedule details, operator information, journey timeline, and seat availability.',
};

export interface BusDetailPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    step?: string;
  }>;
}

export default async function BusDetailPage({ params, searchParams }: BusDetailPageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  return (
    <AppShell>
      <Section spacing="md" className="bg-background min-h-[calc(100vh-16rem)] py-8">
        <Container>
          {resolvedSearchParams?.step ? (
            <BookingContainer busId={id} />
          ) : (
            <BusDetailsContainer busId={id} />
          )}
        </Container>
      </Section>
    </AppShell>
  );
}
