'use client';

import * as React from 'react';
import { Check, User, ShieldCheck, Ticket, Armchair } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookingStep } from '../types/passenger';

export interface BookingStepperProps {
  currentStep: BookingStep;
  className?: string;
}

const STEPS: { id: BookingStep; label: string; icon: React.ElementType }[] = [
  { id: 'seats', label: '1. Select Seats', icon: Armchair },
  { id: 'passengers', label: '2. Passenger Details', icon: User },
  { id: 'review', label: '3. Review Booking', icon: ShieldCheck },
  { id: 'confirmation', label: '4. Confirmed', icon: Ticket },
];

export const BookingStepper = React.memo<BookingStepperProps>(function BookingStepper({
  currentStep,
  className,
}) {
  const stepIndices: Record<BookingStep, number> = {
    seats: 0,
    passengers: 1,
    review: 2,
    confirmation: 3,
  };

  const currentIndex = stepIndices[currentStep];

  return (
    <nav aria-label="Booking Progress" className={cn('w-full', className)}>
      <ol className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-subtle">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const StepIcon = step.icon;

          return (
            <li
              key={step.id}
              className={cn(
                'flex items-center space-x-2.5 rounded-xl p-2.5 transition-all text-xs font-bold',
                isCurrent && 'bg-primary/10 text-primary border border-primary/20 shadow-subtle',
                isCompleted && 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
                !isCurrent && !isCompleted && 'bg-slate-50 text-slate-400 border border-slate-100'
              )}
            >
              <div
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black transition-colors',
                  isCurrent && 'bg-primary text-white',
                  isCompleted && 'bg-emerald-600 text-white',
                  !isCurrent && !isCompleted && 'bg-slate-200 text-slate-500'
                )}
              >
                {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : <StepIcon className="h-3.5 w-3.5" />}
              </div>
              <span className="truncate">{step.label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
