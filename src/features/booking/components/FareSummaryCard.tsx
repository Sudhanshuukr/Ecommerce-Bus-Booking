'use client';

import * as React from 'react';
import { ArrowRight, Ticket, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Seat, FareBreakdown } from '../types/seat';

export interface FareSummaryCardProps {
  selectedSeats: Seat[];
  fareBreakdown: FareBreakdown;
  errorMessage?: string | null;
  currency?: string;
  buttonText?: string;
  isLoading?: boolean;
  onContinue?: () => void;
  className?: string;
}

export const FareSummaryCard = React.memo<FareSummaryCardProps>(function FareSummaryCard({
  selectedSeats,
  fareBreakdown,
  errorMessage,
  currency = '₹',
  buttonText = 'Continue Booking',
  isLoading = false,
  onContinue,
  className,
}) {
  const hasSeats = selectedSeats.length > 0;

  const handleContinue = () => {
    if (hasSeats && !isLoading) {
      if (onContinue) {
        onContinue();
      } else {
        alert(
          `Seat reservation ready! Total seats: ${selectedSeats.map((s) => s.label).join(', ')}. Amount: ${currency}${fareBreakdown.grandTotal}`
        );
      }
    }
  };

  return (
    <div
      aria-label="Fare Summary & Checkout"
      className={cn(
        'flex flex-col space-y-5 rounded-2xl border border-border/80 bg-white p-5 shadow-subtle sm:p-6',
        className
      )}
    >
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
        <Ticket className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
        <h2 className="text-base font-bold text-slate-900">Fare Summary</h2>
      </div>

      {/* Selected Seats Badges */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Selected Seats ({selectedSeats.length})
        </span>

        {hasSeats ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {selectedSeats.map((seat) => (
              <span
                key={seat.id}
                className="inline-flex items-center rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1 text-xs font-extrabold text-primary"
              >
                Seat {seat.label} ({currency}{seat.price})
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs italic text-muted-foreground pt-1">No seats selected yet</p>
        )}
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-center space-x-2 rounded-lg bg-destructive/10 border border-destructive/20 p-2.5 text-xs font-semibold text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Cost Breakdown */}
      <div className="space-y-2 border-t border-slate-100 pt-4 text-xs font-medium">
        <div className="flex justify-between text-slate-600">
          <span>Seat Fare Subtotal</span>
          <span className="font-semibold text-slate-900">{currency}{fareBreakdown.seatPriceTotal}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Service Fee</span>
          <span className="font-semibold text-slate-900">{currency}{fareBreakdown.serviceFee}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>GST / Tax (5%)</span>
          <span className="font-semibold text-slate-900">{currency}{fareBreakdown.tax}</span>
        </div>

        <div className="border-t border-slate-200 pt-3 flex justify-between text-sm font-extrabold text-slate-900">
          <span>Grand Total</span>
          <span className="text-xl font-black text-primary">{currency}{fareBreakdown.grandTotal}</span>
        </div>
      </div>

      {/* Continue Action Button */}
      <Button
        onClick={handleContinue}
        disabled={!hasSeats || isLoading}
        size="lg"
        className="w-full h-12 text-sm font-bold shadow-soft hover:shadow-hover active:scale-95 transition-all"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Creating Booking...</span>
          </div>
        ) : (
          <>
            <span>{buttonText}</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
});
