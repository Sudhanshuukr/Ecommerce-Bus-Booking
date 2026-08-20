import * as React from 'react';
import { BusSchedule } from '@/features/bus/types/bus';
import { Seat, MAX_SEAT_SELECTION_LIMIT } from '../types/seat';
import { MOCK_SEATS, MOCK_BOARDING_POINTS, MOCK_DROPPING_POINTS, generateSeatsForSchedule } from '../mock/seats';
import { calculateFare } from '../utils/fare-calculator';

export interface UseSeatSelectionOptions {
  schedule?: BusSchedule;
  initialSeats?: Seat[];
  maxLimit?: number;
}

export function useSeatSelection(options: UseSeatSelectionOptions = {}) {
  const { schedule, initialSeats, maxLimit = MAX_SEAT_SELECTION_LIMIT } = options;

  const boardingPoints = React.useMemo(() => {
    return schedule?.boardingPoints && schedule.boardingPoints.length > 0
      ? schedule.boardingPoints
      : MOCK_BOARDING_POINTS;
  }, [schedule]);

  const droppingPoints = React.useMemo(() => {
    return schedule?.droppingPoints && schedule.droppingPoints.length > 0
      ? schedule.droppingPoints
      : MOCK_DROPPING_POINTS;
  }, [schedule]);

  const seats = React.useMemo(() => {
    if (initialSeats) return initialSeats;
    if (schedule?.seats && schedule.seats.length > 0) return schedule.seats;
    if (schedule?.price) return generateSeatsForSchedule(schedule.price);
    return MOCK_SEATS;
  }, [initialSeats, schedule]);

  const [selectedSeatIds, setSelectedSeatIds] = React.useState<string[]>([]);
  const [selectedBoardingPointId, setSelectedBoardingPointId] = React.useState<string>(
    () => boardingPoints[0]?.id || ''
  );
  const [selectedDroppingPointId, setSelectedDroppingPointId] = React.useState<string>(
    () => droppingPoints[0]?.id || ''
  );
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Sync selected boarding/dropping point IDs when schedule changes
  React.useEffect(() => {
    if (boardingPoints[0]?.id) {
      setSelectedBoardingPointId(boardingPoints[0].id);
    }
    if (droppingPoints[0]?.id) {
      setSelectedDroppingPointId(droppingPoints[0].id);
    }
  }, [boardingPoints, droppingPoints]);

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

  const clearSelection = React.useCallback(() => {
    setSelectedSeatIds([]);
    setErrorMessage(null);
  }, []);

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
    setSelectedSeatIds,
    clearSelection,
    boardingPoints,
    droppingPoints,
  };
}
