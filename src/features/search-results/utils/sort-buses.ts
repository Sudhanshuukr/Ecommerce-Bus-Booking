import { BusSchedule } from '@/features/bus/types/bus';
import { SortOption } from '../types/search-filter';

/**
 * Parses time string like "07:30 AM" or "04:45 PM" into minutes from 00:00.
 */
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Parses duration string like "4h 15m" or "3h 45m" into total minutes.
 */
export function parseDurationToMinutes(durationStr: string): number {
  if (!durationStr) return 0;
  const hoursMatch = durationStr.match(/(\d+)\s*h/i);
  const minsMatch = durationStr.match(/(\d+)\s*m/i);

  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;

  return hours * 60 + mins;
}

/**
 * Calculates formatted duration string (e.g. "8h 00m") from departure and arrival time strings.
 * Accurately handles overnight journeys where arrival time is on the next day.
 */
export function calculateJourneyDuration(departureTime: string, arrivalTime: string): string {
  const depMins = parseTimeToMinutes(departureTime);
  let arrMins = parseTimeToMinutes(arrivalTime);

  // Overnight rollover
  if (arrMins < depMins) {
    arrMins += 24 * 60;
  }

  const diffMins = arrMins - depMins;
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;

  return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}

/**
 * Pure function sorting bus schedules based on selected sort option.
 */
export function sortBusSchedules(
  schedules: BusSchedule[],
  sortBy: SortOption
): BusSchedule[] {
  const sorted = [...schedules];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);

    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);

    case 'time-asc':
      return sorted.sort(
        (a, b) => parseTimeToMinutes(a.route.departureTime) - parseTimeToMinutes(b.route.departureTime)
      );

    case 'time-desc':
      return sorted.sort(
        (a, b) => parseTimeToMinutes(b.route.departureTime) - parseTimeToMinutes(a.route.departureTime)
      );

    case 'duration-asc':
      return sorted.sort(
        (a, b) => parseDurationToMinutes(a.route.duration) - parseDurationToMinutes(b.route.duration)
      );

    case 'rating-desc':
      return sorted.sort((a, b) => b.operator.rating - a.operator.rating);

    default:
      return sorted;
  }
}
