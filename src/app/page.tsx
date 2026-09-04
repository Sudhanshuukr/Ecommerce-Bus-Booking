import { AppShell } from '@/components/layout';
import {
  Hero,
  PopularRoutesSection,
  OperatorShowcase,
  HowItWorksSection,
  WhyUsSection,
  OffersSection,
  CtaSection,
} from '@/features/home';

export default function Home() {
  return (
    <AppShell>
      {/* 1. Primary Focus: Hero + Elevated Search + Trust Metrics */}
      <Hero />

      {/* 2. Secondary Focus: Popular Travel Corridors */}
      <div id="popular-routes">
        <PopularRoutesSection />
      </div>

      {/* 3. Operator Network Coverage */}
      <OperatorShowcase />

      {/* 4. How It Works - 3 Step Booking Flow */}
      <HowItWorksSection />

      {/* 5. Core Platform Feature Capabilities */}
      <WhyUsSection />

      {/* 6. Promotional Deals & Offers */}
      <OffersSection />

      {/* 7. Final Conversion Action */}
      <CtaSection />
    </AppShell>
  );
}
