'use client';

import * as React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SwapButtonProps {
  onClick: () => void;
  isSwapping?: boolean;
  className?: string;
}

export const SwapButton = React.memo<SwapButtonProps>(function SwapButton({
  onClick,
  isSwapping = false,
  className,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Swap origin and destination"
      title="Swap origin and destination"
      className={cn(
        'group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-slate-600 shadow-subtle transition-all duration-normal hover:border-primary hover:bg-slate-50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 active:scale-95',
        className
      )}
    >
      <ArrowLeftRight
        className={cn(
          'h-4 w-4 transition-transform duration-normal ease-standard group-hover:scale-110',
          isSwapping && 'rotate-180 scale-110 text-primary'
        )}
      />
    </button>
  );
});
