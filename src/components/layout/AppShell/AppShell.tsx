import * as React from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { cn } from '@/lib/utils';

export interface AppShellProps {
  children: React.ReactNode;
  className?: string;
  mainClassName?: string;
}

export function AppShell({
  children,
  className,
  mainClassName,
}: AppShellProps) {
  return (
    <div className={cn('flex min-h-screen flex-col bg-background', className)}>
      {/* Primary Application Header */}
      <Header />

      {/* Main Page Content */}
      <main className={cn('flex-1', mainClassName)}>{children}</main>

      {/* Primary Application Footer */}
      <Footer />
    </div>
  );
}

