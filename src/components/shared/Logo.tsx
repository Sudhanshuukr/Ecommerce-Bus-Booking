import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface LogoProps {
  size?: 'default' | 'compact';
  href?: string | null;
  className?: string;
}

export function Logo({
  size = 'default',
  href = '/',
  className,
}: LogoProps) {
  const sizeStyles = {
    default: 'text-xl sm:text-2xl tracking-tight',
    compact: 'text-lg tracking-tight',
  };

  const logoContent = (
    <span
      className={cn(
        'font-heading font-extrabold text-foreground inline-flex items-center select-none',
        sizeStyles[size],
        className
      )}
    >
      <span>Bus</span>
      <span className="text-accent">Booking</span>
      <span className="text-accent ml-0.5 font-black">.</span>
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
        aria-label="Bus Booking Platform Home"
      >
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
