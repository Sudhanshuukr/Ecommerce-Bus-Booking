import { Seat, FareBreakdown } from '../types/seat';

/**
 * Pure function computing live fare breakdown for selected seats.
 */
export function calculateFare(
  selectedSeats: Seat[],
  serviceFee = 2.0,
  taxRate = 0.05
): FareBreakdown {
  const seatCount = selectedSeats.length;
  const seatPriceTotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  if (seatCount === 0) {
    return {
      seatCount: 0,
      seatPriceTotal: 0,
      serviceFee: 0,
      tax: 0,
      grandTotal: 0,
    };
  }

  const tax = Math.round(seatPriceTotal * taxRate * 100) / 100;
  const grandTotal = seatPriceTotal + serviceFee + tax;

  return {
    seatCount,
    seatPriceTotal,
    serviceFee,
    tax,
    grandTotal,
  };
}
