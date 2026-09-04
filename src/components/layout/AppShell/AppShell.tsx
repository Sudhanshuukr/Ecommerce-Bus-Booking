import * as React from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { MobileBottomNav } from '../MobileBottomNav';
import { cn } from '@/lib/utils';

export interface AppShellProps {
  children: React.ReactNode;
  className?: string;
  mainClassName?: string;
  hideHeader?: boolean;
  hideFooter?: boolean;
  hideMobileNav?: boolean;
}

export function AppShell({
  children,
  className,
  mainClassName,
  hideHeader = false,
  hideFooter = false,
  hideMobileNav = false,
}: AppShellProps) {
  return (
    <div className={cn('flex min-h-screen flex-col bg-background', className)}>
      {/* Primary Application Header */}
      {!hideHeader && <Header hideMobileNav={hideMobileNav} />}

      {/* Main Page Content */}
      <main
        className={cn(
          'flex-1',
          !hideMobileNav && 'pb-[var(--mobile-bottom-nav-offset)] md:pb-0',
          mainClassName
        )}
      >
        {children}
      </main>

      {/* Primary Application Footer */}
      {!hideFooter && <Footer />}

      {/* Mobile Sticky Bottom Navigation */}
      {!hideMobileNav && <MobileBottomNav />}
    </div>
  );
}


