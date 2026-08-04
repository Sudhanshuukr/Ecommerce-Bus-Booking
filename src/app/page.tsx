import { AppShell, Container, Section } from '@/components/layout';
import {
  Hero,
  OffersSection,
  PopularRoutesSection,
  WhyUsSection,
  TestimonialsSection,
} from '@/features/home';
import { BusGrid } from '@/features/bus';

export default function Home() {
  return (
    <AppShell>
      <Hero />
      <OffersSection />
      <PopularRoutesSection />
      <WhyUsSection />
      <TestimonialsSection />
      <Section spacing="lg" className="bg-slate-50/50 py-12 md:py-16">
        <Container>
          <BusGrid />
        </Container>
      </Section>
    </AppShell>
  );
}

