'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, AlertCircle, Search, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BusSchedule } from '@/features/bus/types/bus';
import { useSeatSelection } from '../hooks/useSeatSelection';
import { BusDetailsHeader } from './BusDetailsHeader';
import { BoardingDroppingSelector } from './BoardingDroppingSelector';
import { SeatMap } from './SeatMap';
import { FareSummaryCard } from './FareSummaryCard';
import { BookingStepper } from './BookingStepper';
import { PassengerForm, validatePassenger } from './PassengerForm';
import { BookingReview } from './BookingReview';
import { BookingConfirmation } from './BookingConfirmation';
import {
  BookingStep,
  Passenger,
  PassengerFormErrors,
  BookingConfirmationData,
} from '../types/passenger';

export interface BookingContainerProps {
  busId?: string;
  initialStep?: string;
  className?: string;
}

export function BookingContainer({ busId = '', initialStep, className }: BookingContainerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 1. Live Schedule State from GET /api/buses/[id]
  const [schedule, setSchedule] = React.useState<BusSchedule | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const fetchSchedule = React.useCallback(() => {
    if (!busId) {
      setIsLoading(false);
      setFetchError('SCHEDULE_NOT_FOUND');
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setFetchError(null);

    fetch(`/api/buses/${busId}`)
      .then((res) => {
        if (res.status === 404) {
          throw new Error('SCHEDULE_NOT_FOUND');
        }
        if (!res.ok) {
          throw new Error(`HTTP_${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        if (!isMounted) return;
        if (json.success && json.data) {
          setSchedule(json.data);
        } else {
          setFetchError(json.error?.message || 'Unable to fetch bus schedule.');
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : '';
        if (msg === 'SCHEDULE_NOT_FOUND') {
          setFetchError('SCHEDULE_NOT_FOUND');
        } else {
          console.error('[Bus Details API Error]:', err);
          setFetchError(
            'Unable to connect to the schedule service. Please check your network connection and try again.'
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [busId]);

  React.useEffect(() => {
    const cleanup = fetchSchedule();
    return cleanup;
  }, [fetchSchedule]);

  // 2. Seat & Point Selection Hook
  const {
    seats,
    selectedSeatIds,
    selectedSeats,
    selectedBoardingPointId,
    selectedDroppingPointId,
    errorMessage: seatErrorMessage,
    fareBreakdown,
    toggleSeatSelection,
    setSelectedBoardingPointId,
    setSelectedDroppingPointId,
    clearSelection,
    boardingPoints,
    droppingPoints,
  } = useSeatSelection({ schedule: schedule || undefined });

  // Selected Boarding & Dropping Point objects
  const selectedBoardingPoint = React.useMemo(() => {
    return (
      boardingPoints.find((p) => p.id === selectedBoardingPointId) ||
      boardingPoints[0] || {
        id: 'bp-def',
        name: 'Main Station',
        time: schedule?.route?.departureTime || '10:00 AM',
        address: schedule?.route?.origin || 'Origin City',
      }
    );
  }, [boardingPoints, selectedBoardingPointId, schedule]);

  const selectedDroppingPoint = React.useMemo(() => {
    return (
      droppingPoints.find((p) => p.id === selectedDroppingPointId) ||
      droppingPoints[0] || {
        id: 'dp-def',
        name: 'Destination Terminal',
        time: schedule?.route?.arrivalTime || '06:00 PM',
        address: schedule?.route?.destination || 'Destination City',
      }
    );
  }, [droppingPoints, selectedDroppingPointId, schedule]);

  // 3. Step & Passenger State
  const stepParam = searchParams.get('step') || initialStep;
  const initialBookingStep: BookingStep =
    stepParam === 'passengers' || stepParam === 'passenger'
      ? 'passengers'
      : stepParam === 'review'
      ? 'review'
      : 'seats';

  const [currentStep, setCurrentStep] = React.useState<BookingStep>(initialBookingStep);
  const [passengers, setPassengers] = React.useState<Passenger[]>([]);
  const [formErrors, setFormErrors] = React.useState<Record<string, PassengerFormErrors>>({});
  const [stepErrorMessage, setStepErrorMessage] = React.useState<string | null>(null);
  const [confirmationData, setConfirmationData] = React.useState<BookingConfirmationData | null>(
    null
  );

  React.useEffect(() => {
    if (stepParam === 'passengers' || stepParam === 'passenger') {
      setCurrentStep('passengers');
    } else if (stepParam === 'review') {
      setCurrentStep('review');
    } else if (stepParam === 'seats') {
      setCurrentStep('seats');
    }
  }, [stepParam]);

  const navigateToStep = React.useCallback(
    (step: BookingStep) => {
      setCurrentStep(step);
      router.push(`${pathname}?step=${step}`, { scroll: false });
    },
    [pathname, router]
  );

  // Stale passenger cleanup: ensure passengers state matches selected seats
  React.useEffect(() => {
    setPassengers((prev) => {
      const currentMap = new Map(prev.map((p) => [p.seatId, p]));
      return selectedSeats.map((seat) => {
        return (
          currentMap.get(seat.id) || {
            seatId: seat.id,
            seatLabel: seat.label,
            fullName: '',
            age: '',
            gender: '',
            mobile: '',
            email: '',
          }
        );
      });
    });
  }, [selectedSeats]);

  // Update specific passenger data
  const handlePassengerChange = React.useCallback(
    (seatId: string, updated: Partial<Passenger>) => {
      setStepErrorMessage(null);
      setPassengers((prev) =>
        prev.map((p) => (p.seatId === seatId ? { ...p, ...updated } : p))
      );
      setFormErrors((prev) => {
        if (!prev[seatId]) return prev;
        const newSeatErrors = { ...prev[seatId] };
        Object.keys(updated).forEach((key) => {
          delete (newSeatErrors as Record<string, string | undefined>)[key];
        });
        return { ...prev, [seatId]: newSeatErrors };
      });
    },
    []
  );

  // Transition handlers
  const handleProceedToPassengers = () => {
    setStepErrorMessage(null);
    if (selectedSeats.length === 0) {
      setStepErrorMessage('Please select at least 1 seat to proceed.');
      return;
    }
    navigateToStep('passengers');
  };

  const handleProceedToReview = () => {
    setStepErrorMessage(null);
    let hasError = false;
    const newErrors: Record<string, PassengerFormErrors> = {};

    selectedSeats.forEach((seat) => {
      const passenger = passengers.find((p) => p.seatId === seat.id) || {
        seatId: seat.id,
        seatLabel: seat.label,
        fullName: '',
        age: '',
        gender: '',
        mobile: '',
        email: '',
      };

      const errs = validatePassenger(passenger);
      if (Object.keys(errs).length > 0) {
        hasError = true;
        newErrors[seat.id] = errs;
      }
    });

    if (hasError) {
      setFormErrors(newErrors);
      setStepErrorMessage('Please correct the validation errors in the passenger form.');
      return;
    }

    setFormErrors({});
    navigateToStep('review');
  };

  const [isSubmittingBooking, setIsSubmittingBooking] = React.useState(false);
  const [reviewVerified, setReviewVerified] = React.useState(false);

  const handleReviewVerified = async () => {
    if (!schedule || isSubmittingBooking) return;
    setIsSubmittingBooking(true);
    setStepErrorMessage(null);

    // Prepare typed booking payload matching 00003_create_booking_transaction.sql schema
    const preparedPayload = {
      scheduleId: schedule.id,
      boardingPointId: selectedBoardingPoint.id,
      droppingPointId: selectedDroppingPoint.id,
      passengers: passengers.map((p) => ({
        seatId: p.seatId,
        fullName: p.fullName,
        age: parseInt(p.age, 10) || 1,
        gender: p.gender || 'other',
        mobile: p.mobile,
        email: p.email,
      })),
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preparedPayload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        const errorMsg =
          json.error?.message || json.message || 'Failed to complete booking. Please try again.';
        setStepErrorMessage(errorMsg);
        setIsSubmittingBooking(false);
        return;
      }

      const resData = json.data;
      const confirmation: BookingConfirmationData = {
        bookingId: resData.bookingReference || resData.bookingId || `BB-${Date.now()}`,
        bookingDate: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        schedule,
        boardingPoint: selectedBoardingPoint,
        droppingPoint: selectedDroppingPoint,
        selectedSeats,
        passengers,
        fareBreakdown: {
          seatCount: selectedSeats.length,
          seatPriceTotal: resData.seatPriceTotal ?? fareBreakdown.seatPriceTotal,
          serviceFee: resData.serviceFee ?? fareBreakdown.serviceFee,
          tax: resData.taxAmount ?? fareBreakdown.tax,
          grandTotal: resData.grandTotal ?? fareBreakdown.grandTotal,
        },
      };

      setConfirmationData(confirmation);
      setReviewVerified(true);
      navigateToStep('confirmation');
      fetchSchedule();
    } catch (err) {
      console.error('[Booking Submit Error]:', err);
      setStepErrorMessage(
        'Unable to connect to the booking server. Please check your network connection and try again.'
      );
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleResetBooking = () => {
    clearSelection();
    setConfirmationData(null);
    setPassengers([]);
    setFormErrors({});
    setStepErrorMessage(null);
    setReviewVerified(false);
    navigateToStep('seats');
    fetchSchedule();
  };

  // Loading state render guard
  if (isLoading) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-20 text-slate-500 space-y-4 bg-white rounded-2xl border border-slate-100 p-8 shadow-subtle',
          className
        )}
      >
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
        <p className="text-sm font-medium">Loading bus schedule and seat layout...</p>
      </div>
    );
  }

  // Schedule Not Found state render guard
  if (fetchError === 'SCHEDULE_NOT_FOUND' || !schedule) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-12 text-center shadow-subtle space-y-4',
          className
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Bus Schedule Not Found</h2>
        <p className="text-xs text-muted-foreground max-w-md">
          The requested bus schedule could not be found or has expired. Please select a valid schedule from search results.
        </p>
        <Link
          href="/search"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-5 text-xs font-bold text-white shadow-subtle hover:bg-slate-800 transition-all"
        >
          <Search className="mr-2 h-4 w-4" />
          <span>Back to Search</span>
        </Link>
      </div>
    );
  }

  // General Network Error state render guard
  if (fetchError) {
    return (
      <div
        className={cn(
          'rounded-2xl border border-red-200 bg-red-50/80 p-8 text-center text-red-800 space-y-4',
          className
        )}
      >
        <p className="font-semibold text-sm">{fetchError}</p>
        <div className="flex items-center justify-center space-x-3 pt-2">
          <button
            type="button"
            onClick={() => fetchSchedule()}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-red-600 px-4 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition-colors"
          >
            Retry Loading
          </button>
          <Link
            href="/search"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            Return to Search
          </Link>
        </div>
      </div>
    );
  }

  // Missing seats state handling for step 2 & 3 navigation
  const isMissingSeats =
    (currentStep === 'passengers' || currentStep === 'review') && selectedSeats.length === 0;

  if (isMissingSeats) {
    return (
      <div className={cn('space-y-6', className)}>
        <BookingStepper currentStep={currentStep} />
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-10 text-center shadow-subtle space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No Seats Selected</h2>
          <p className="text-xs text-muted-foreground max-w-md">
            You currently have no seats selected for this booking. Please select your preferred seats to continue.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep('seats')}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-subtle hover:bg-primary-600 active:scale-95 transition-all"
            >
              Select Seats
            </button>
            <Link
              href="/search"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-xs font-bold text-slate-700 shadow-subtle hover:bg-slate-50 active:scale-95 transition-all"
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Search Buses</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render Confirmation Screen
  if (currentStep === 'confirmation') {
    if (!confirmationData) {
      return (
        <div className={cn('space-y-6', className)}>
          <BookingStepper currentStep="confirmation" />
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-10 text-center shadow-subtle space-y-4">
            <h2 className="text-lg font-bold text-slate-900">No Active Confirmation Record</h2>
            <p className="text-xs text-muted-foreground">
              No booking confirmation record was found in session state.
            </p>
            <Link
              href="/search"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-5 text-xs font-bold text-white shadow-subtle hover:bg-slate-800 transition-all"
            >
              Search Buses
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className={cn('space-y-6', className)}>
        <BookingStepper currentStep="confirmation" />
        <BookingConfirmation data={confirmationData} onResetBooking={handleResetBooking} />
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Step Indicator */}
      <BookingStepper currentStep={currentStep} />

      {/* Main Grid: Left Dynamic Step View | Right Fare Summary Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column Content */}
        <div className="lg:col-span-7 space-y-6">
          {/* Back Action Bar for Steps 2 & 3 */}
          {currentStep === 'passengers' && (
            <button
              type="button"
              onClick={() => navigateToStep('seats')}
              className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              <span>Back to Seat Selection</span>
            </button>
          )}

          {currentStep === 'review' && (
            <button
              type="button"
              onClick={() => navigateToStep('passengers')}
              className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              <span>Back to Passenger Details</span>
            </button>
          )}

          {/* STEP 1: Seats & Points */}
          {currentStep === 'seats' && (
            <>
              <BusDetailsHeader schedule={schedule} />
              <BoardingDroppingSelector
                boardingPoints={boardingPoints}
                droppingPoints={droppingPoints}
                selectedBoardingId={selectedBoardingPointId}
                selectedDroppingId={selectedDroppingPointId}
                onSelectBoarding={setSelectedBoardingPointId}
                onSelectDropping={setSelectedDroppingPointId}
              />
              <SeatMap
                seats={seats}
                selectedSeatIds={selectedSeatIds}
                onSelectSeat={toggleSeatSelection}
              />
            </>
          )}

          {/* STEP 2: Passenger Details Form */}
          {currentStep === 'passengers' && (
            <PassengerForm
              selectedSeats={selectedSeats}
              passengers={passengers}
              errors={formErrors}
              onChangePassenger={handlePassengerChange}
            />
          )}

          {/* STEP 3: Booking Review */}
          {currentStep === 'review' && (
            <BookingReview
              schedule={schedule}
              boardingPoint={selectedBoardingPoint}
              droppingPoint={selectedDroppingPoint}
              selectedSeats={selectedSeats}
              passengers={passengers}
            />
          )}
        </div>

        {/* Right Sticky Column: Live Fare Summary & Step Action */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <FareSummaryCard
            selectedSeats={selectedSeats}
            fareBreakdown={fareBreakdown}
            errorMessage={stepErrorMessage || seatErrorMessage}
            currency={schedule.currency}
            isLoading={isSubmittingBooking}
            buttonText={
              currentStep === 'seats'
                ? 'Proceed to Passenger Details'
                : currentStep === 'passengers'
                ? 'Proceed to Review'
                : 'Confirm & Book Seats'
            }
            onContinue={
              currentStep === 'seats'
                ? handleProceedToPassengers
                : currentStep === 'passengers'
                ? handleProceedToReview
                : handleReviewVerified
            }
          />
        </div>
      </div>
    </div>
  );
}
