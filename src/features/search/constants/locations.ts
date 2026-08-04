import { LocationObject } from '../types/location';

export const LOCATION_DATASET: LocationObject[] = [
  {
    id: 'loc-nyc-pabt',
    name: 'Port Authority Bus Terminal',
    city: 'New York',
    state: 'NY',
    code: 'NYC',
    popular: true,
  },
  {
    id: 'loc-bos-south',
    name: 'South Station Bus Terminal',
    city: 'Boston',
    state: 'MA',
    code: 'BOS',
    popular: true,
  },
  {
    id: 'loc-was-union',
    name: 'Union Station Bus Concourse',
    city: 'Washington',
    state: 'DC',
    code: 'WAS',
    popular: true,
  },
  {
    id: 'loc-chi-greyhound',
    name: 'Harrison St Station',
    city: 'Chicago',
    state: 'IL',
    code: 'CHI',
    popular: true,
  },
  {
    id: 'loc-phi-30th',
    name: '30th Street Station',
    city: 'Philadelphia',
    state: 'PA',
    code: 'PHI',
    popular: true,
  },
  {
    id: 'loc-det-rosa',
    name: 'Rosa Parks Transit Center',
    city: 'Detroit',
    state: 'MI',
    code: 'DET',
    popular: false,
  },
  {
    id: 'loc-mia-intermodal',
    name: 'Miami Intermodal Center',
    city: 'Miami',
    state: 'FL',
    code: 'MIA',
    popular: true,
  },
  {
    id: 'loc-atl-civic',
    name: 'Civic Center Station',
    city: 'Atlanta',
    state: 'GA',
    code: 'ATL',
    popular: false,
  },
  {
    id: 'loc-tor-union',
    name: 'Union Station Bus Terminal',
    city: 'Toronto',
    state: 'ON',
    code: 'TOR',
    popular: true,
  },
  {
    id: 'loc-sfo-salesforce',
    name: 'Salesforce Transit Center',
    city: 'San Francisco',
    state: 'CA',
    code: 'SFO',
    popular: true,
  },
];

/**
 * Finds a LocationObject by ID, city, or station code.
 */
export function findLocationByQuery(query: string): LocationObject | null {
  if (!query) return null;
  const q = query.trim().toLowerCase();
  return (
    LOCATION_DATASET.find(
      (loc) =>
        loc.id.toLowerCase() === q ||
        loc.code.toLowerCase() === q ||
        loc.city.toLowerCase() === q ||
        loc.name.toLowerCase() === q
    ) || null
  );
}
