import * as React from 'react';
import { Menu } from 'lucide-react';
import { Container } from '../Container';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Navigation } from './Navigation';
import { cn } from '@/lib/utils';

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export function Header({ className, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60',
        className
      )}
      {...props}
    >
      <Container className="flex h-16 items-center justify-between">
        {/* Brand Logo */}
        <Logo size="default" />

        {/* Desktop Navigation */}
        <Navigation />

        {/* Right Actions: Desktop CTA & Mobile Menu Button */}
        <div className="flex items-center space-x-3">
          <Button variant="default" size="sm" className="hidden sm:inline-flex">
            Sign In
          </Button>

          {/* Mobile Menu Button Structure */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5 text-foreground" />
          </Button>
        </div>
      </Container>
    </header>
  );
}
