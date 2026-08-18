import { FilterState, SortOption, TimeWindow } from '../types/search-filter';

export function parseFilterStateFromUrl(searchParams: {
  get: (key: string) => string | null;
}): FilterState {
  const priceMaxParam = searchParams.get('priceMax');
  const busTypesParam = searchParams.get('busTypes');
  const amenitiesParam = searchParams.get('amenities');
  const timeWindowsParam = searchParams.get('timeWindows');
  const sortByParam = searchParams.get('sortBy');

  const priceMax = priceMaxParam ? parseInt(priceMaxParam, 10) : 3000;
  const busTypes = busTypesParam ? busTypesParam.split(',').filter(Boolean) : [];
  const amenities = amenitiesParam ? amenitiesParam.split(',').filter(Boolean) : [];
  const timeWindows = timeWindowsParam
    ? (timeWindowsParam.split(',').filter(Boolean) as TimeWindow[])
    : [];

  const validSortOptions: SortOption[] = [
    'price-asc',
    'price-desc',
    'time-asc',
    'time-desc',
    'duration-asc',
    'rating-desc',
  ];

  const sortBy: SortOption = validSortOptions.includes(sortByParam as SortOption)
    ? (sortByParam as SortOption)
    : 'price-asc';

  return {
    priceMax,
    busTypes,
    amenities,
    timeWindows,
    sortBy,
  };
}

export function createFilterQueryString(
  currentUrlSearchParams: URLSearchParams,
  updates: Partial<FilterState>
): string {
  const params = new URLSearchParams(currentUrlSearchParams.toString());

  if (updates.priceMax !== undefined) {
    if (updates.priceMax >= 3000) {
      params.delete('priceMax');
    } else {
      params.set('priceMax', String(updates.priceMax));
    }
  }


  if (updates.busTypes !== undefined) {
    if (updates.busTypes.length === 0) {
      params.delete('busTypes');
    } else {
      params.set('busTypes', updates.busTypes.join(','));
    }
  }

  if (updates.amenities !== undefined) {
    if (updates.amenities.length === 0) {
      params.delete('amenities');
    } else {
      params.set('amenities', updates.amenities.join(','));
    }
  }

  if (updates.timeWindows !== undefined) {
    if (updates.timeWindows.length === 0) {
      params.delete('timeWindows');
    } else {
      params.set('timeWindows', updates.timeWindows.join(','));
    }
  }

  if (updates.sortBy !== undefined) {
    if (updates.sortBy === 'price-asc') {
      params.delete('sortBy'); // Default sort option
    } else {
      params.set('sortBy', updates.sortBy);
    }
  }

  return params.toString();
}
