'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { mainNavItems, type NavItem } from './nav-items';

export interface NavigationProps {
  items?: NavItem[];
  activeHref?: string;
  className?: string;
}

export function Navigation({
  items = mainNavItems,
  activeHref,
  className,
}: NavigationProps) {
  const pathname = usePathname();
  const currentPath = activeHref ?? pathname ?? '/';

  return (
    <nav
      className={cn('hidden md:flex items-center space-x-6', className)}
      aria-label="Main Navigation"
    >
      {items.map((item) => {
        const isActive =
          item.href === '/'
            ? currentPath === '/'
            : currentPath === item.href || currentPath.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'text-sm font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-1 py-0.5',
              isActive
                ? 'text-foreground font-bold border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
