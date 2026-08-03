'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { BusSchedule, MOCK_BUS_SCHEDULES } from '@/features/bus';
import { useSeatSelection } from '../hooks/useSeatSelection';
import { BusDetailsHeader } from './BusDetailsHeader';
import { BoardingDroppingSelector } from './BoardingDroppingSelector';
import { SeatMap } from './SeatMap';
import { FareSummaryCard } from './FareSummaryCard';

export interface BookingContainerProps {
  busId?: string;
  className?: string;
}

export function BookingContainer({ busId = 'bus-1', className }: BookingContainerProps) {
  // Find schedule from mock dataset
  const schedule = React.useMemo<BusSchedule>(() => {
    return MOCK_BUS_SCHEDULES.find((s) => s.id === busId) || MOCK_BUS_SCHEDULES[0];
  }, [busId]);

  const {
    seats,
    selectedSeatIds,
    selectedSeats,
    selectedBoardingPointId,
    selectedDroppingPointId,
    errorMessage,
    fareBreakdown,
    toggleSeatSelection,
    setSelectedBoardingPointId,
    setSelectedDroppingPointId,
    boardingPoints,
    droppingPoints,
  } = useSeatSelection();

  return (
    <div className={cn('space-y-6', className)}>
      {/* Operator & Route Header */}
      <BusDetailsHeader schedule={schedule} />

      {/* Boarding & Dropping Point Selector */}
      <BoardingDroppingSelector
        boardingPoints={boardingPoints}
        droppingPoints={droppingPoints}
        selectedBoardingId={selectedBoardingPointId}
        selectedDroppingId={selectedDroppingPointId}
        onSelectBoarding={setSelectedBoardingPointId}
        onSelectDropping={setSelectedDroppingPointId}
      />

      {/* Main Seat Selection & Fare Breakdown Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Seat Map */}
        <div className="lg:col-span-7">
          <SeatMap
            seats={seats}
            selectedSeatIds={selectedSeatIds}
            onSelectSeat={toggleSeatSelection}
          />
        </div>

        {/* Live Fare Summary & Checkout */}
        <div className="lg:col-span-5 sticky top-6">
          <FareSummaryCard
            selectedSeats={selectedSeats}
            fareBreakdown={fareBreakdown}
            errorMessage={errorMessage}
          />
        </div>
      </div>
    </div>
  );
}
