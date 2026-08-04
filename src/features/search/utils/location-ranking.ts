import { LocationObject } from '../types/location';
import { LOCATION_DATASET } from '../constants/locations';

/**
 * Calculates a match relevance score for a given location against a search query string.
 */
export function scoreLocationMatch(location: LocationObject, query: string): number {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) {
    return location.popular ? 50 : 10;
  }

  const city = location.city.toLowerCase();
  const name = location.name.toLowerCase();
  const code = location.code.toLowerCase();
  const state = location.state.toLowerCase();

  let score = 0;

  // 1. Exact matches
  if (code === cleanQuery) score += 100;
  else if (city === cleanQuery) score += 95;

  // 2. Prefix matches
  else if (code.startsWith(cleanQuery)) score += 85;
  else if (city.startsWith(cleanQuery)) score += 80;
  else if (name.startsWith(cleanQuery)) score += 70;

  // 3. Substring matches
  else if (city.includes(cleanQuery)) score += 50;
  else if (name.includes(cleanQuery)) score += 40;
  else if (state.startsWith(cleanQuery)) score += 30;

  if (score > 0 && location.popular) {
    score += 10;
  }

  return score;
}

/**
 * Filters and ranks locations based on relevance score.
 */
export function searchAndRankLocations(
  query: string,
  dataset: LocationObject[] = LOCATION_DATASET
): LocationObject[] {
  const cleanQuery = query.trim();

  if (!cleanQuery) {
    // Return all locations, popular ones first
    return [...dataset].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
  }

  const scored = dataset
    .map((loc) => ({
      location: loc,
      score: scoreLocationMatch(loc, cleanQuery),
    }))
    .filter((item) => item.score > 0);

  scored.sort((a, b) => b.score - a.score);

  return scored.map((item) => item.location);
}

/**
 * Simulates an async backend search service with debounced call capability.
 */
export async function fetchLocationSuggestions(
  query: string,
  dataset: LocationObject[] = LOCATION_DATASET
): Promise<LocationObject[]> {
  return searchAndRankLocations(query, dataset);
}
