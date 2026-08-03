import { AppShell, Container, Section } from '@/components/layout';
import { Hero } from '@/features/home/hero';
import { BusGrid } from '@/features/bus';

export default function Home() {
  return (
    <AppShell>
      <Hero />
      <Section spacing="lg" className="bg-background pt-8 pb-16">
        <Container>
          <BusGrid />
        </Container>
      </Section>
    </AppShell>
  );
}





