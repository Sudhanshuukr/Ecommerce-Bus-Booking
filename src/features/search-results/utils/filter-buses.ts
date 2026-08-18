import { BusSchedule } from '@/features/bus/types/bus';
import { findLocationByQuery } from '@/features/search/constants/locations';
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
 * Robustly matches schedule origin/destination string against search query.
 * Supports city names, airport/station codes (DEL, LKO, JPR), and terminal names.
 */
function matchesLocation(scheduleLocation: string, queryStr: string): boolean {

  if (!queryStr) return true;
  const q = queryStr.trim().toLowerCase();
  const schedLoc = scheduleLocation.trim().toLowerCase();

  // Direct substring match
  if (schedLoc.includes(q) || q.includes(schedLoc)) {
    return true;
  }

  // Lookup in LOCATION_DATASET via findLocationByQuery
  const locObj = findLocationByQuery(queryStr);
  if (locObj) {
    const city = locObj.city.toLowerCase();
    const code = locObj.code.toLowerCase();
    const name = locObj.name.toLowerCase();

    return (
      schedLoc.includes(city) ||
      city.includes(schedLoc) ||
      schedLoc.includes(code) ||
      code.includes(schedLoc) ||
      schedLoc.includes(name) ||
      name.includes(schedLoc)
    );
  }

  return false;
}

/**
 * Pure function filtering bus schedules based on search query AND filter criteria.
 */
export function filterBusSchedules(
  schedules: BusSchedule[],
  query: ParsedSearchQuery,
  filterState?: Partial<FilterState>
): BusSchedule[] {
  const originQuery = query.origin;
  const destinationQuery = query.destination;

  const priceMax = filterState?.priceMax ?? Number.MAX_SAFE_INTEGER;
  const selectedBusTypes = filterState?.busTypes ?? [];
  const selectedAmenities = filterState?.amenities ?? [];
  const selectedTimeWindows = filterState?.timeWindows ?? [];

  return schedules.filter((schedule) => {
    // 1. Origin Filter
    if (originQuery && !matchesLocation(schedule.route.origin, originQuery)) {
      return false;
    }

    // 2. Destination Filter
    if (destinationQuery && !matchesLocation(schedule.route.destination, destinationQuery)) {
      return false;
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
