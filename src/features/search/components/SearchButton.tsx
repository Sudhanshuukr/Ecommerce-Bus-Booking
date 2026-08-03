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
        'w-full h-12 text-base font-semibold shadow-soft hover:shadow-hover transition-all duration-normal',
        className
      )}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Searching Buses...
        </>
      ) : (
        <>
          <Search className="mr-2.5 h-5 w-5 stroke-[2.5]" />
          Search Buses
        </>
      )}
    </Button>
  );
});
