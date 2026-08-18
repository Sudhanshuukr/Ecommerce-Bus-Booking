'use client';

import * as React from 'react';
import { MapPin, Navigation, Check, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LocationObject } from '../types/location';
import { searchAndRankLocations } from '../utils/location-ranking';
import { useDebounce } from '../hooks/useDebounce';

export interface LocationInputProps {
  id: string;
  label: string;
  value: LocationObject | null;
  onChange: (location: LocationObject | null) => void;
  placeholder?: string;
  type: 'origin' | 'destination';
  error?: string;
  className?: string;
}

export const LocationInput = React.memo<LocationInputProps>(function LocationInput({
  id,
  label,
  value,
  onChange,
  placeholder = 'Select city or station',
  type,
  error,
  className,
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(
    value ? `${value.city}, ${value.state} (${value.code})` : ''
  );
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>(0);

  // Sync internal display input value when external location value changes
  React.useEffect(() => {
    if (value) {
      setInputValue(`${value.city}, ${value.state} (${value.code})`);
    } else {
      setInputValue('');
    }
  }, [value]);

  // Debounce the text typed into the search box for querying suggestions
  const debouncedQuery = useDebounce(inputValue, 250);

  // Calculate ranked location suggestions
  const suggestions = React.useMemo(() => {
    if (value && inputValue === `${value.city}, ${value.state} (${value.code})`) {
      return searchAndRankLocations('');
    }
    return searchAndRankLocations(debouncedQuery);
  }, [debouncedQuery, inputValue, value]);

  // Auto-scroll highlighted item into view during keyboard navigation
  React.useEffect(() => {
    if (isOpen && listRef.current) {
      const highlightedEl = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedEl) {
        highlightedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (value) {
          setInputValue(`${value.city}, ${value.state} (${value.code})`);
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, value]);

  const handleSelect = React.useCallback(
    (loc: LocationObject) => {
      onChange(loc);
      setInputValue(`${loc.city}, ${loc.state} (${loc.code})`);
      setIsOpen(false);
    },
    [onChange]
  );

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(null);
      setInputValue('');
      setIsOpen(true);
      inputRef.current?.focus();
    },
    [onChange]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) {
        if (e.key === 'ArrowDown' || e.key === 'Enter') {
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev + 1) % Math.max(1, suggestions.length));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev <= 0 ? Math.max(0, suggestions.length - 1) : prev - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (suggestions[highlightedIndex]) {
            handleSelect(suggestions[highlightedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          if (value) {
            setInputValue(`${value.city}, ${value.state} (${value.code})`);
          }
          break;
      }
    },
    [isOpen, suggestions, highlightedIndex, handleSelect, value]
  );

  const IconComponent = type === 'origin' ? Navigation : MapPin;
  const errorId = `${id}-error`;

  return (
    <div ref={containerRef} className={cn('relative flex flex-col space-y-1.5 w-full', className)}>
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>

      <div className="relative flex items-center">
        <IconComponent
          className={cn(
            'absolute left-3.5 h-4 w-4 pointer-events-none transition-colors duration-normal z-10',
            error ? 'text-destructive' : 'text-slate-400 group-focus-within:text-primary'
          )}
          aria-hidden="true"
        />

        <Input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={`${id}-suggestions-list`}
          aria-activedescendant={
            isOpen && suggestions[highlightedIndex]
              ? `${id}-suggestion-${suggestions[highlightedIndex].id}`
              : undefined
          }
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          value={inputValue}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'pl-10 pr-16 h-12 text-sm font-medium text-slate-900 bg-white placeholder:text-slate-400 border-border focus-visible:ring-2 focus-visible:ring-primary/20',
            error && 'border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive'
          )}
        />

        <div className="absolute right-3 flex items-center space-x-1.5 z-10">
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              aria-label={`Clear ${label} selection`}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {value && (
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300 pointer-events-none shrink-0">
              {value.code}
            </span>
          )}
        </div>
      </div>

      {error && (
        <span id={errorId} role="alert" className="text-xs font-medium text-destructive mt-0.5">
          {error}
        </span>
      )}

      {/* Ranked Location Suggestions Dropdown */}
      {isOpen && (
        <ul
          ref={listRef}
          id={`${id}-suggestions-list`}
          role="listbox"
          aria-label={`${label} station options`}
          className="absolute top-full left-0 z-50 mt-2 max-h-72 w-full min-w-[280px] sm:min-w-[320px] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-border/80 bg-white p-1.5 shadow-modal transition-all duration-normal animate-in fade-in-50 zoom-in-95"
        >
          {suggestions.length === 0 ? (
            <li className="px-3 py-3 text-center text-xs text-muted-foreground">
              No matching stations found for &ldquo;{inputValue}&rdquo;
            </li>
          ) : (
            suggestions.map((loc, idx) => {
              const isSelected = value?.id === loc.id;
              const isHighlighted = idx === highlightedIndex;

              return (
                <li
                  key={loc.id}
                  id={`${id}-suggestion-${loc.id}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent input blur
                    handleSelect(loc);
                  }}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={cn(
                    'flex cursor-pointer items-center justify-between gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors duration-fast',
                    isHighlighted ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-700 hover:bg-slate-50',
                    isSelected && !isHighlighted && 'bg-slate-100 font-semibold text-slate-900'
                  )}
                >
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-slate-900 truncate text-xs sm:text-sm">
                        {loc.city}, {loc.state}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">{loc.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0 pl-1">
                    {loc.popular && (
                      <span className="inline-flex items-center space-x-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                        <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />
                        <span>Popular</span>
                      </span>
                    )}
                    <span className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {loc.code}
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary ml-1 shrink-0" aria-hidden="true" />}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      )}

    </div>
  );
});
