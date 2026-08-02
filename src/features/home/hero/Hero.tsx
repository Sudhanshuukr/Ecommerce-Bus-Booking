import * as React from 'react';
import { Container, Section } from '@/components/layout';
import { HeroContent } from './HeroContent';
import { HeroVisual } from './HeroVisual';

export function Hero() {
  return (
    <Section spacing="lg" className="bg-gradient-to-b from-surface via-background to-background">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
          {/* Content Column */}
          <div className="lg:col-span-7">
            <HeroContent />
          </div>

          {/* Visual Column */}
          <div className="lg:col-span-5">
            <HeroVisual />
          </div>
        </div>
      </Container>
    </Section>
  );
}
