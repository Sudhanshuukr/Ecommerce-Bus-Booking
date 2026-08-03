import { BusSchedule } from '@/features/bus';
import { ParsedSearchQuery } from '../types/search-query';

/**
 * Pure function filtering bus schedules based on search query criteria.
 */
export function filterBusSchedules(
  schedules: BusSchedule[],
  query: ParsedSearchQuery
): BusSchedule[] {
  const originQuery = query.origin.trim().toLowerCase();
  const destinationQuery = query.destination.trim().toLowerCase();

  return schedules.filter((schedule) => {
    // 1. Origin Filter (case-insensitive substring or match)
    if (originQuery) {
      const scheduleOrigin = schedule.route.origin.toLowerCase();
      const isOriginMatch =
        scheduleOrigin.includes(originQuery) || originQuery.includes(scheduleOrigin);
      if (!isOriginMatch) return false;
    }

    // 2. Destination Filter (case-insensitive substring or match)
    if (destinationQuery) {
      const scheduleDestination = schedule.route.destination.toLowerCase();
      const isDestinationMatch =
        scheduleDestination.includes(destinationQuery) ||
        destinationQuery.includes(scheduleDestination);
      if (!isDestinationMatch) return false;
    }

    // 3. Passenger Capacity Filter
    if (query.totalPassengers > 0 && schedule.availableSeats < query.totalPassengers) {
      return false;
    }

    return true;
  });
}
