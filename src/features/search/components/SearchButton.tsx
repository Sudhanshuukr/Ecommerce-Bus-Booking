import * as React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SearchButtonProps {
  onClick?: () => void;
  isSubmitting?: boolean;
  disabled?: boolean;
  className?: string;
}

export const SearchButton = React.memo<SearchButtonProps>(function SearchButton({
  onClick,
  isSubmitting = false,
  disabled = false,
  className,
}) {
  return (
    <Button
      type="submit"
      onClick={onClick}
      disabled={disabled || isSubmitting}
      size="lg"
      className={cn(
        'w-full h-11 sm:h-11 md:h-12 text-sm sm:text-sm md:text-base font-semibold shadow-soft hover:shadow-hover transition-all duration-normal',
        className
      )}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
          Searching Buses...
        </>
      ) : (
        <>
          <Search className="mr-2 sm:mr-2.5 h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
          Search Buses
        </>
      )}
    </Button>
  );
});
