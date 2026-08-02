import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Section({
  as: Component = 'section',
  spacing = 'md',
  className,
  children,
  ...props
}: SectionProps) {
  const spacingStyles = {
    none: '',
    sm: 'py-6 md:py-8',
    md: 'py-10 md:py-16',
    lg: 'py-14 md:py-24',
  };

  return (
    <Component
      className={cn(spacingStyles[spacing], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
