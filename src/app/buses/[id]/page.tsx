import * as React from 'react';
import { AppShell, Container, Section } from '@/components/layout';
import { BookingContainer } from '@/features/booking';

export const metadata = {
  title: 'Bus Details & Seat Selection | Bus Booking Platform',
  description: 'View bus details, select your preferred seats, and proceed to booking.',
};

export interface BusDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BusDetailPage({ params }: BusDetailPageProps) {
  const { id } = await params;

  return (
    <AppShell>
      <Section spacing="md" className="bg-background min-h-[calc(100vh-16rem)] py-8">
        <Container>
          <BookingContainer busId={id} />
        </Container>
      </Section>
    </AppShell>
  );
}
