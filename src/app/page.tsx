import { AppShell, Container, Section } from '@/components/layout';

export default function Home() {
  return (
    <AppShell>
      <Section spacing="lg">
        <Container className="flex flex-col items-center justify-center text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Bus Booking Platform
          </h1>
        </Container>
      </Section>
    </AppShell>
  );
}




