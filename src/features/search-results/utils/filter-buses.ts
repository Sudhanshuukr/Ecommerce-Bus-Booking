import { BusSchedule } from '@/features/bus';
import { ParsedSearchQuery } from '../types/search-query';
import { FilterState, TimeWindow } from '../types/search-filter';
import { parseTimeToMinutes } from './sort-buses';

/**
 * Checks if a given time in minutes falls within any of the selected time windows.
 */
function matchesTimeWindow(timeInMinutes: number, selectedWindows: TimeWindow[]): boolean {
  if (selectedWindows.length === 0) return true;

  return selectedWindows.some((window) => {
    switch (window) {
      case 'early-morning':
        return timeInMinutes < 6 * 60; // Before 6 AM
      case 'morning':
        return timeInMinutes >= 6 * 60 && timeInMinutes < 12 * 60; // 6 AM - 12 PM
      case 'afternoon':
        return timeInMinutes >= 12 * 60 && timeInMinutes < 18 * 60; // 12 PM - 6 PM
      case 'night':
        return timeInMinutes >= 18 * 60; // After 6 PM
      default:
        return true;
    }
  });
}

/**
 * Pure function filtering bus schedules based on search query AND filter criteria.
 */
export function filterBusSchedules(
  schedules: BusSchedule[],
  query: ParsedSearchQuery,
  filterState?: Partial<FilterState>
): BusSchedule[] {
  const originQuery = query.origin.trim().toLowerCase();
  const destinationQuery = query.destination.trim().toLowerCase();

  const priceMax = filterState?.priceMax ?? Number.MAX_SAFE_INTEGER;
  const selectedBusTypes = filterState?.busTypes ?? [];
  const selectedAmenities = filterState?.amenities ?? [];
  const selectedTimeWindows = filterState?.timeWindows ?? [];

  return schedules.filter((schedule) => {
    // 1. Origin Filter
    if (originQuery) {
      const scheduleOrigin = schedule.route.origin.toLowerCase();
      const isOriginMatch =
        scheduleOrigin.includes(originQuery) || originQuery.includes(scheduleOrigin);
      if (!isOriginMatch) return false;
    }

    // 2. Destination Filter
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

    // 4. Price Filter
    if (schedule.price > priceMax) {
      return false;
    }

    // 5. Bus Type Filter
    if (selectedBusTypes.length > 0) {
      const busTypeLower = schedule.busType.toLowerCase();
      const matchesType = selectedBusTypes.some((type) =>
        busTypeLower.includes(type.toLowerCase())
      );
      if (!matchesType) return false;
    }

    // 6. Amenities Filter
    if (selectedAmenities.length > 0) {
      const scheduleAmenitiesLower = schedule.amenities.map((a) => a.toLowerCase());
      const matchesAllAmenities = selectedAmenities.every((amenity) =>
        scheduleAmenitiesLower.some((a) => a.includes(amenity.toLowerCase()))
      );
      if (!matchesAllAmenities) return false;
    }

    // 7. Departure Time Window Filter
    if (selectedTimeWindows.length > 0) {
      const departureMinutes = parseTimeToMinutes(schedule.route.departureTime);
      if (!matchesTimeWindow(departureMinutes, selectedTimeWindows)) {
        return false;
      }
    }

    return true;
  });
}
