import * as React from 'react';
import { Seat, MAX_SEAT_SELECTION_LIMIT } from '../types/seat';
import { MOCK_SEATS, MOCK_BOARDING_POINTS, MOCK_DROPPING_POINTS } from '../mock/seats';
import { calculateFare } from '../utils/fare-calculator';

export interface UseSeatSelectionOptions {
  initialSeats?: Seat[];
  maxLimit?: number;
}

export function useSeatSelection(options: UseSeatSelectionOptions = {}) {
  const { initialSeats = MOCK_SEATS, maxLimit = MAX_SEAT_SELECTION_LIMIT } = options;

  const [seats] = React.useState<Seat[]>(initialSeats);
  const [selectedSeatIds, setSelectedSeatIds] = React.useState<string[]>([]);
  const [selectedBoardingPointId, setSelectedBoardingPointId] = React.useState<string>(
    MOCK_BOARDING_POINTS[0]?.id || ''
  );
  const [selectedDroppingPointId, setSelectedDroppingPointId] = React.useState<string>(
    MOCK_DROPPING_POINTS[0]?.id || ''
  );
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Toggle seat selection
  const toggleSeatSelection = React.useCallback(
    (seatId: string) => {
      setErrorMessage(null);
      const targetSeat = seats.find((s) => s.id === seatId);

      if (!targetSeat || targetSeat.status === 'occupied' || targetSeat.status === 'reserved') {
        return;
      }

      const isAlreadySelected = selectedSeatIds.includes(seatId);

      if (isAlreadySelected) {
        setSelectedSeatIds((prev) => prev.filter((id) => id !== seatId));
      } else {
        if (selectedSeatIds.length >= maxLimit) {
          setErrorMessage(`You can select a maximum of ${maxLimit} seats per booking.`);
          return;
        }
        setSelectedSeatIds((prev) => [...prev, seatId]);
      }
    },
    [seats, selectedSeatIds, maxLimit]
  );

  // Computed selected seat objects
  const selectedSeats = React.useMemo(() => {
    return seats.filter((s) => selectedSeatIds.includes(s.id));
  }, [seats, selectedSeatIds]);

  // Computed live fare breakdown
  const fareBreakdown = React.useMemo(() => {
    return calculateFare(selectedSeats);
  }, [selectedSeats]);

  return {
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
    boardingPoints: MOCK_BOARDING_POINTS,
    droppingPoints: MOCK_DROPPING_POINTS,
  };
}
